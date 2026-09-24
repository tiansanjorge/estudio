export type EstrategiaEscritura = "cache-aside" | "write-through" | "write-back" | "write-around";

export const ESTRATEGIAS: { id: EstrategiaEscritura; nombre: string; descripcion: string }[] = [
  { id: "cache-aside", nombre: "Cache-aside", descripcion: "escribe en la base y borra la clave del caché" },
  { id: "write-through", nombre: "Write-through", descripcion: "escribe en el caché y en la base, en la misma operación" },
  { id: "write-back", nombre: "Write-back", descripcion: "escribe solo en el caché; la base se actualiza después, en lote" },
  { id: "write-around", nombre: "Write-around", descripcion: "escribe solo en la base y no toca el caché" },
];

export const LATENCIA_CACHE = 1;
export const LATENCIA_DB = 20;

export interface EntradaLog {
  tipo: "ok" | "viejo" | "perdida" | "info";
  texto: string;
}

export interface EstadoCaching {
  estrategia: EstrategiaEscritura;
  db: number;
  cache: number | null;
  // write-back: el caché tiene un valor que la base todavía no recibió
  sucio: boolean;
  log: EntradaLog[];
}

export type AccionCaching =
  | { tipo: "escribir" }
  | { tipo: "leer" }
  | { tipo: "flush" }
  | { tipo: "caida" }
  | { tipo: "estrategia"; estrategia: EstrategiaEscritura };

const MAX_LOG = 7;

export function estadoInicial(estrategia: EstrategiaEscritura = "write-through"): EstadoCaching {
  return { estrategia, db: 100, cache: 100, sucio: false, log: [] };
}

function registrar(estado: EstadoCaching, entrada: EntradaLog): EntradaLog[] {
  return [entrada, ...estado.log].slice(0, MAX_LOG);
}

export function reducirCaching(estado: EstadoCaching, accion: AccionCaching): EstadoCaching {
  switch (accion.tipo) {
    case "estrategia":
      return estadoInicial(accion.estrategia);

    case "escribir": {
      const nuevo = (estado.sucio && estado.cache !== null ? estado.cache : estado.db) + 10;
      switch (estado.estrategia) {
        case "cache-aside":
          return {
            ...estado,
            db: nuevo,
            cache: null,
            log: registrar(estado, { tipo: "ok", texto: `Escritura: base = ${nuevo} y DEL de la clave · ${LATENCIA_DB + LATENCIA_CACHE} ms` }),
          };
        case "write-through":
          return {
            ...estado,
            db: nuevo,
            cache: nuevo,
            log: registrar(estado, { tipo: "ok", texto: `Escritura: caché y base = ${nuevo} · ${LATENCIA_DB + LATENCIA_CACHE} ms (espera a la base)` }),
          };
        case "write-back":
          return {
            ...estado,
            cache: nuevo,
            sucio: true,
            log: registrar(estado, { tipo: "ok", texto: `Escritura: caché = ${nuevo}, base pendiente · ${LATENCIA_CACHE} ms` }),
          };
        case "write-around":
          return {
            ...estado,
            db: nuevo,
            log: registrar(estado, {
              tipo: estado.cache !== null ? "viejo" : "ok",
              texto:
                estado.cache !== null
                  ? `Escritura: base = ${nuevo}, pero el caché sigue con ${estado.cache} · ${LATENCIA_DB} ms`
                  : `Escritura: base = ${nuevo} · ${LATENCIA_DB} ms`,
            }),
          };
      }
    }

    case "leer": {
      if (estado.cache !== null) {
        // con write-back, el caché sucio es la versión correcta; en otro caso, si difiere de la base está viejo
        const viejo = !estado.sucio && estado.cache !== estado.db;
        return {
          ...estado,
          log: registrar(estado, {
            tipo: viejo ? "viejo" : "ok",
            texto: viejo
              ? `HIT: ${estado.cache} · ${LATENCIA_CACHE} ms — dato viejo, la base tiene ${estado.db}`
              : `HIT: ${estado.cache} · ${LATENCIA_CACHE} ms`,
          }),
        };
      }
      return {
        ...estado,
        cache: estado.db,
        log: registrar(estado, { tipo: "info", texto: `MISS: lee ${estado.db} de la base y lo guarda en caché · ${LATENCIA_DB + LATENCIA_CACHE} ms` }),
      };
    }

    case "flush":
      if (!estado.sucio || estado.cache === null) {
        return { ...estado, log: registrar(estado, { tipo: "info", texto: "Flush: no hay escrituras pendientes." }) };
      }
      return {
        ...estado,
        db: estado.cache,
        sucio: false,
        log: registrar(estado, { tipo: "ok", texto: `Flush: la base recibe ${estado.cache} en un lote.` }),
      };

    case "caida": {
      const perdida = estado.sucio && estado.cache !== null;
      return {
        ...estado,
        cache: null,
        sucio: false,
        log: registrar(estado, {
          tipo: perdida ? "perdida" : "info",
          texto: perdida
            ? `Se cae el caché: el ${estado.cache} nunca llegó a la base, que sigue en ${estado.db}. Escritura perdida.`
            : "Se cae el caché: se vacía, pero la base tiene todo. Las próximas lecturas serán miss.",
        }),
      };
    }
  }
}
