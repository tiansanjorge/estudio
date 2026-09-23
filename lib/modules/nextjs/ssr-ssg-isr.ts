export type EstrategiaId = "ssg" | "isr-tiempo" | "isr-demanda" | "ssr";

export interface Estrategia {
  id: EstrategiaId;
  nombre: string;
  codigo: string;
}

export const ESTRATEGIAS: Estrategia[] = [
  { id: "ssg", nombre: "SSG", codigo: "// sin revalidate: se genera solo en el build" },
  { id: "isr-tiempo", nombre: "ISR por tiempo", codigo: "export const revalidate = 3600; // segundos: 60 minutos" },
  { id: "isr-demanda", nombre: "ISR a demanda", codigo: "// el CMS llama a revalidateTag('post') al editar" },
  { id: "ssr", nombre: "SSR", codigo: "await cookies(); // o cualquier dato por request" },
];

/** Escenario fijo: build en el minuto 0 y una edición del contenido en el minuto 10. */
export const MINUTO_EDICION = 10;
export const REQUESTS = [2, 12, 15, 65, 67];
const REVALIDATE_MINUTOS = 60;

export type Render = "ninguno" | "en el request" | "en segundo plano";

export interface FilaSimulacion {
  minuto: number;
  versionServida: number;
  versionActual: number;
  render: Render;
  /** Si la respuesta sale de un HTML ya generado (rápido, cacheable en CDN). */
  desdeCache: boolean;
}

export function simular(estrategia: EstrategiaId): FilaSimulacion[] {
  let versionCacheada = 1; // generada en el build
  let generadaEn = 0;
  let invalidada = false;

  return REQUESTS.map((minuto) => {
    const versionActual = minuto >= MINUTO_EDICION ? 2 : 1;

    if (estrategia === "ssr") {
      return { minuto, versionServida: versionActual, versionActual, render: "en el request", desdeCache: false };
    }
    if (estrategia === "ssg") {
      return { minuto, versionServida: 1, versionActual, render: "ninguno", desdeCache: true };
    }

    if (estrategia === "isr-demanda" && minuto >= MINUTO_EDICION && generadaEn < MINUTO_EDICION) {
      invalidada = true; // el webhook del CMS invalidó al editar
    }
    const vencida =
      invalidada || (estrategia === "isr-tiempo" && minuto - generadaEn >= REVALIDATE_MINUTOS);

    const fila: FilaSimulacion = {
      minuto,
      versionServida: versionCacheada,
      versionActual,
      render: vencida ? "en segundo plano" : "ninguno",
      desdeCache: true,
    };
    if (vencida) {
      // stale-while-revalidate: este request recibe lo viejo, el siguiente lo nuevo
      versionCacheada = versionActual;
      generadaEn = minuto;
      invalidada = false;
    }
    return fila;
  });
}

export function resumir(filas: FilaSimulacion[]) {
  return {
    renders: filas.filter((f) => f.render !== "ninguno").length,
    desactualizadas: filas.filter((f) => f.versionServida < f.versionActual).length,
  };
}
