export const TTL_SEGUNDOS = 60;
export const LATENCIA_REDIS_MS = 1;
export const LATENCIA_DB_MS = 40;

export interface EstadoCache {
  segundo: number;
  precioDb: number;
  // null = la clave no existe en Redis
  cache: { precio: number; expiraEn: number } | null;
  invalidarAlEscribir: boolean;
  log: EntradaLog[];
}

export interface EntradaLog {
  segundo: number;
  tipo: "hit" | "miss" | "hit-viejo" | "escritura" | "expira";
  texto: string;
}

export type AccionCache =
  | { tipo: "leer" }
  | { tipo: "escribir" }
  | { tipo: "avanzar"; segundos: number }
  | { tipo: "invalidacion"; activa: boolean }
  | { tipo: "reiniciar" };

export function estadoInicial(invalidarAlEscribir = false): EstadoCache {
  return { segundo: 0, precioDb: 1000, cache: null, invalidarAlEscribir, log: [] };
}

const MAX_LOG = 8;

function registrar(estado: EstadoCache, entrada: Omit<EntradaLog, "segundo">): EntradaLog[] {
  return [{ ...entrada, segundo: estado.segundo }, ...estado.log].slice(0, MAX_LOG);
}

export function reducirCache(estado: EstadoCache, accion: AccionCache): EstadoCache {
  switch (accion.tipo) {
    case "leer": {
      const { cache } = estado;
      if (cache) {
        const viejo = cache.precio !== estado.precioDb;
        return {
          ...estado,
          log: registrar(estado, {
            tipo: viejo ? "hit-viejo" : "hit",
            texto: viejo
              ? `HIT en ${LATENCIA_REDIS_MS} ms: $${cache.precio}, pero la base ya dice $${estado.precioDb}`
              : `HIT en ${LATENCIA_REDIS_MS} ms: $${cache.precio}`,
          }),
        };
      }
      return {
        ...estado,
        cache: { precio: estado.precioDb, expiraEn: estado.segundo + TTL_SEGUNDOS },
        log: registrar(estado, {
          tipo: "miss",
          texto: `MISS: consulta a la base (${LATENCIA_DB_MS} ms) y SET con TTL de ${TTL_SEGUNDOS}s → $${estado.precioDb}`,
        }),
      };
    }
    case "escribir": {
      const precioDb = estado.precioDb + 250;
      return {
        ...estado,
        precioDb,
        cache: estado.invalidarAlEscribir ? null : estado.cache,
        log: registrar(estado, {
          tipo: "escritura",
          texto: estado.invalidarAlEscribir
            ? `UPDATE precio = $${precioDb} y DEL de la clave`
            : `UPDATE precio = $${precioDb} (la caché no se entera)`,
        }),
      };
    }
    case "avanzar": {
      const segundo = estado.segundo + accion.segundos;
      const vence = estado.cache !== null && estado.cache.expiraEn <= segundo;
      const siguiente = { ...estado, segundo };
      return vence
        ? { ...siguiente, cache: null, log: registrar(siguiente, { tipo: "expira", texto: "La clave expira por TTL" }) }
        : siguiente;
    }
    case "invalidacion":
      return { ...estado, invalidarAlEscribir: accion.activa };
    case "reiniciar":
      return estadoInicial(estado.invalidarAlEscribir);
  }
}
