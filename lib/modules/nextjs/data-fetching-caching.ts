export type PerfilId = "minutes" | "hours" | "days";

export interface PerfilCache {
  id: PerfilId;
  /** Minutos hasta que la entrada se regenera en segundo plano. */
  revalidate: number;
  /** Minutos hasta que la entrada deja de poder servirse (el request espera). */
  expire: number;
}

/** Valores de revalidate y expire de los perfiles de cacheLife de Next.js. */
export const PERFILES: Record<PerfilId, PerfilCache> = {
  minutes: { id: "minutes", revalidate: 1, expire: 60 },
  hours: { id: "hours", revalidate: 60, expire: 60 * 24 },
  days: { id: "days", revalidate: 60 * 24, expire: 60 * 24 * 7 },
};

type Invalidacion = "ninguna" | "stale" | "expirada";

export interface EntradaCache {
  version: number;
  creadaEn: number;
  invalidacion: Invalidacion;
}

export interface EstadoCache {
  minuto: number;
  versionDb: number;
  entrada: EntradaCache | null;
}

export type TipoRespuesta = "MISS" | "HIT" | "STALE";

export interface Respuesta {
  tipo: TipoRespuesta;
  versionServida: number;
}

export const ESTADO_INICIAL: EstadoCache = { minuto: 0, versionDb: 1, entrada: null };

function entradaFresca(estado: EstadoCache): EntradaCache {
  return { version: estado.versionDb, creadaEn: estado.minuto, invalidacion: "ninguna" };
}

/** Un request a una función con 'use cache' + cacheLife(perfil). */
export function pedir(
  estado: EstadoCache,
  perfil: PerfilCache,
): { estado: EstadoCache; respuesta: Respuesta } {
  const { entrada } = estado;
  const edad = entrada ? estado.minuto - entrada.creadaEn : Infinity;

  // sin entrada, expirada o invalidada con updateTag: el request espera la regeneración
  if (!entrada || entrada.invalidacion === "expirada" || edad >= perfil.expire) {
    return {
      estado: { ...estado, entrada: entradaFresca(estado) },
      respuesta: { tipo: "MISS", versionServida: estado.versionDb },
    };
  }

  // vencida o invalidada con revalidateTag: sirve lo viejo y regenera en segundo plano
  if (entrada.invalidacion === "stale" || edad >= perfil.revalidate) {
    return {
      estado: { ...estado, entrada: entradaFresca(estado) },
      respuesta: { tipo: "STALE", versionServida: entrada.version },
    };
  }

  return { estado, respuesta: { tipo: "HIT", versionServida: entrada.version } };
}

export type Invalidador = "ninguno" | "revalidateTag" | "updateTag";

/** Una mutación en la DB, seguida (o no) de una invalidación del tag. */
export function mutar(estado: EstadoCache, invalidador: Invalidador): EstadoCache {
  const versionDb = estado.versionDb + 1;
  if (!estado.entrada || invalidador === "ninguno") return { ...estado, versionDb };
  return {
    ...estado,
    versionDb,
    entrada: {
      ...estado.entrada,
      invalidacion: invalidador === "updateTag" ? "expirada" : "stale",
    },
  };
}

export function avanzar(estado: EstadoCache, minutos: number): EstadoCache {
  return { ...estado, minuto: estado.minuto + minutos };
}

export function formatearMinutos(minutos: number): string {
  if (minutos < 60) return `${minutos} min`;
  if (minutos < 60 * 24) return `${(minutos / 60).toFixed(minutos % 60 ? 1 : 0)} h`;
  return `${(minutos / (60 * 24)).toFixed(minutos % (60 * 24) ? 1 : 0)} d`;
}
