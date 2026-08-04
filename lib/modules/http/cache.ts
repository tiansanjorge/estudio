export type DirectivaCacheSimulada = "no-store" | "no-cache" | "max-age";

export interface EntradaCache {
  guardadoEn: number;
  etag: string;
}

export type TipoResultadoCache = "red" | "cache" | "revalidacion";

export interface ResultadoPeticion {
  entradaCache: EntradaCache | null;
  mensaje: string;
  tipo: TipoResultadoCache;
}

interface EjecutarPeticionParams {
  directiva: DirectivaCacheSimulada;
  maxAgeSegundos: number;
  tiempoActual: number;
  cache: EntradaCache | null;
  etagServidor: string;
}

export function ejecutarPeticion({
  directiva,
  maxAgeSegundos,
  tiempoActual,
  cache,
  etagServidor,
}: EjecutarPeticionParams): ResultadoPeticion {
  if (directiva === "no-store") {
    return {
      entradaCache: null,
      mensaje: "200 OK. no-store: nunca se guarda nada en caché, va directo al servidor.",
      tipo: "red",
    };
  }

  if (directiva === "no-cache") {
    if (!cache) {
      return {
        entradaCache: { guardadoEn: tiempoActual, etag: etagServidor },
        mensaje: "200 OK. Primera vez: se guarda en caché, pero la próxima igual se revalida.",
        tipo: "red",
      };
    }
    if (cache.etag === etagServidor) {
      return {
        entradaCache: { ...cache, guardadoEn: tiempoActual },
        mensaje: "Revalida con If-None-Match → 304 Not Modified: se reutiliza el body cacheado.",
        tipo: "revalidacion",
      };
    }
    return {
      entradaCache: { guardadoEn: tiempoActual, etag: etagServidor },
      mensaje: "Revalida con If-None-Match → el contenido cambió: 200 OK con body nuevo.",
      tipo: "red",
    };
  }

  if (cache && tiempoActual - cache.guardadoEn < maxAgeSegundos) {
    const restante = maxAgeSegundos - (tiempoActual - cache.guardadoEn);
    return {
      entradaCache: cache,
      mensaje: `HIT: se usa la copia en caché sin pegarle al servidor (${restante}s más de vida).`,
      tipo: "cache",
    };
  }

  if (!cache) {
    return {
      entradaCache: { guardadoEn: tiempoActual, etag: etagServidor },
      mensaje: `MISS: no había nada en caché. 200 OK, se guarda con vencimiento en ${maxAgeSegundos}s.`,
      tipo: "red",
    };
  }

  if (cache.etag === etagServidor) {
    return {
      entradaCache: { ...cache, guardadoEn: tiempoActual },
      mensaje: `max-age venció: revalida con If-None-Match → 304 Not Modified, se reinicia el contador (${maxAgeSegundos}s más).`,
      tipo: "revalidacion",
    };
  }

  return {
    entradaCache: { guardadoEn: tiempoActual, etag: etagServidor },
    mensaje: `max-age venció y el contenido cambió: 200 OK con body nuevo, nuevo vencimiento en ${maxAgeSegundos}s.`,
    tipo: "red",
  };
}
