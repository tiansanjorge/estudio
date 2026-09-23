export type OptimizacionId = "tree-shaking" | "reemplazar-dependencia" | "import-dinamico";

export interface PiezaBundle {
  id: string;
  nombre: string;
  /** KB transferidos por la red (gzip). */
  kbGzip: number;
  /** KB que el navegador tiene que parsear y ejecutar (sin comprimir). */
  kbSinComprimir: number;
  /** Si la pieza viaja en el chunk inicial o en uno diferido. */
  diferido: boolean;
}

interface PiezaBase {
  id: string;
  nombre: string;
  kbGzip: number;
  kbSinComprimir: number;
  /** Optimización que transforma esta pieza, y cómo queda después de aplicarla. */
  optimizacion?: {
    id: OptimizacionId;
    resultado: Partial<Omit<PiezaBundle, "id">>;
  };
}

/** Valores ilustrativos, del orden de magnitud real de cada caso. */
const PIEZAS_BASE: PiezaBase[] = [
  { id: "react", nombre: "react + react-dom", kbGzip: 45, kbSinComprimir: 140 },
  { id: "app", nombre: "Código de la app", kbGzip: 30, kbSinComprimir: 95 },
  {
    id: "fechas",
    nombre: "moment + locales",
    kbGzip: 72,
    kbSinComprimir: 290,
    optimizacion: {
      id: "reemplazar-dependencia",
      resultado: { nombre: "date-fns (solo lo usado)", kbGzip: 5, kbSinComprimir: 16 },
    },
  },
  {
    id: "utilidades",
    nombre: "lodash (import completo)",
    kbGzip: 25,
    kbSinComprimir: 71,
    optimizacion: {
      id: "tree-shaking",
      resultado: { nombre: "lodash-es (tree-shaken)", kbGzip: 3, kbSinComprimir: 9 },
    },
  },
  {
    id: "graficos",
    nombre: "Librería de gráficos",
    kbGzip: 60,
    kbSinComprimir: 200,
    optimizacion: {
      id: "import-dinamico",
      resultado: { diferido: true },
    },
  },
];

/** Presupuesto de referencia para JS inicial en mobile de gama media. */
export const PRESUPUESTO_KB_GZIP = 170;

/** Red móvil lenta, en KB por segundo. */
export const KB_POR_SEGUNDO_RED_LENTA = 50;

export function calcularBundle(activas: ReadonlySet<OptimizacionId>): PiezaBundle[] {
  return PIEZAS_BASE.map(({ optimizacion, ...pieza }) => {
    const base: PiezaBundle = { ...pieza, diferido: false };
    return optimizacion && activas.has(optimizacion.id)
      ? { ...base, ...optimizacion.resultado }
      : base;
  });
}

export function totalizar(piezas: PiezaBundle[]) {
  return piezas.reduce(
    (acc, p) => ({
      kbGzip: acc.kbGzip + p.kbGzip,
      kbSinComprimir: acc.kbSinComprimir + p.kbSinComprimir,
    }),
    { kbGzip: 0, kbSinComprimir: 0 },
  );
}
