export type Modo = "cp" | "ap";
// mayoría: réplicas A y B; minoría: réplica C, que queda aislada cuando hay partición
export type Lado = "mayoria" | "minoria";

export interface Replica {
  valor: number;
  // momento de la última escritura, para last-write-wins al reconciliar
  ts: number;
  escribioDuranteParticion: boolean;
}

export interface EntradaLog {
  tipo: "ok" | "error" | "viejo" | "info" | "perdida";
  texto: string;
}

export interface EstadoCap {
  modo: Modo;
  particion: boolean;
  reloj: number;
  mayoria: Replica;
  minoria: Replica;
  log: EntradaLog[];
}

export type AccionCap =
  | { tipo: "escribir"; lado: Lado }
  | { tipo: "leer"; lado: Lado }
  | { tipo: "particion" }
  | { tipo: "modo"; modo: Modo };

const NOMBRE: Record<Lado, string> = { mayoria: "A/B (mayoría)", minoria: "C (minoría)" };
const MAX_LOG = 8;

const replicaInicial = (): Replica => ({ valor: 100, ts: 0, escribioDuranteParticion: false });

export function estadoInicial(modo: Modo = "cp"): EstadoCap {
  return { modo, particion: false, reloj: 0, mayoria: replicaInicial(), minoria: replicaInicial(), log: [] };
}

function conLog(estado: EstadoCap, entrada: EntradaLog): EstadoCap {
  return { ...estado, log: [entrada, ...estado.log].slice(0, MAX_LOG) };
}

export function reducirCap(estado: EstadoCap, accion: AccionCap): EstadoCap {
  switch (accion.tipo) {
    case "modo":
      return estadoInicial(accion.modo);

    case "escribir": {
      const reloj = estado.reloj + 1;
      // cada escritura suma 10 al saldo, para que el valor muestre cuántas llegaron
      const nuevo = estado[accion.lado].valor + 10;
      const lado = NOMBRE[accion.lado];

      if (!estado.particion) {
        const replica = { valor: nuevo, ts: reloj, escribioDuranteParticion: false };
        return conLog(
          { ...estado, reloj, mayoria: replica, minoria: replica },
          { tipo: "ok", texto: `Escritura en ${lado}: saldo = ${nuevo}, replicado a las 3 réplicas.` },
        );
      }
      if (estado.modo === "cp" && accion.lado === "minoria") {
        return conLog(
          { ...estado, reloj },
          { tipo: "error", texto: "C rechaza la escritura: sin la mayoría no puede garantizar consistencia (no disponible)." },
        );
      }
      const replica = { valor: nuevo, ts: reloj, escribioDuranteParticion: true };
      return conLog(
        { ...estado, reloj, [accion.lado]: replica },
        {
          tipo: "ok",
          texto:
            estado.modo === "cp"
              ? `A/B aceptan: son mayoría (2 de 3). Saldo = ${nuevo}; C no se entera.`
              : `${lado} acepta sin consultar al otro lado. Saldo local = ${nuevo}.`,
        },
      );
    }

    case "leer": {
      const lado = NOMBRE[accion.lado];
      if (estado.particion && estado.modo === "cp" && accion.lado === "minoria") {
        return conLog(estado, {
          tipo: "error",
          texto: "C rechaza la lectura: podría estar desactualizada y no puede confirmarlo (no disponible).",
        });
      }
      const propia = estado[accion.lado];
      const otra = estado[accion.lado === "mayoria" ? "minoria" : "mayoria"];
      const desactualizada = estado.particion && otra.ts > propia.ts;
      return conLog(estado, {
        tipo: desactualizada ? "viejo" : "ok",
        texto: desactualizada
          ? `Lectura en ${lado}: ${propia.valor}, pero el otro lado ya tiene ${otra.valor} (dato viejo).`
          : `Lectura en ${lado}: ${propia.valor}.`,
      });
    }

    case "particion": {
      if (!estado.particion) {
        return conLog({ ...estado, particion: true }, { tipo: "info", texto: "Se corta la red: C queda aislada de A y B." });
      }
      const { mayoria, minoria } = estado;
      // last-write-wins: gana la escritura más reciente, la otra se descarta sin avisar
      const ganadora = minoria.ts > mayoria.ts ? minoria : mayoria;
      const perdedora = ganadora === minoria ? mayoria : minoria;
      const huboConflicto = mayoria.escribioDuranteParticion && minoria.escribioDuranteParticion;
      const reconciliada = { valor: ganadora.valor, ts: ganadora.ts, escribioDuranteParticion: false };
      const base = { ...estado, particion: false, mayoria: reconciliada, minoria: reconciliada };
      return conLog(
        base,
        huboConflicto
          ? {
              tipo: "perdida",
              texto: `Se cura la red. Los dos lados escribieron: last-write-wins deja ${ganadora.valor} y descarta el ${perdedora.valor} del otro lado. Se perdió una escritura.`,
            }
          : { tipo: "info", texto: `Se cura la red. Las réplicas se sincronizan en ${ganadora.valor}.` },
      );
    }
  }
}
