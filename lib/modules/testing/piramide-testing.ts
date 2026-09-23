export type Nivel = "unit" | "integracion" | "e2e";

export interface PerfilNivel {
  nombre: string;
  /** Tiempo típico por test, en milisegundos. */
  msPorTest: number;
  /** Probabilidad de que un test falle sin que haya un bug (flaky) en una corrida. */
  probabilidadFlaky: number;
}

/** Órdenes de magnitud típicos, no mediciones exactas. */
export const PERFILES: Record<Nivel, PerfilNivel> = {
  unit: { nombre: "Unit", msPorTest: 5, probabilidadFlaky: 0.0001 },
  integracion: { nombre: "Integración", msPorTest: 150, probabilidadFlaky: 0.001 },
  e2e: { nombre: "E2E", msPorTest: 8000, probabilidadFlaky: 0.01 },
};

export type Distribucion = Record<Nivel, number>;

export const PRESETS: { id: string; nombre: string; distribucion: Distribucion }[] = [
  { id: "piramide", nombre: "Pirámide", distribucion: { unit: 600, integracion: 120, e2e: 10 } },
  { id: "trofeo", nombre: "Trofeo", distribucion: { unit: 150, integracion: 350, e2e: 15 } },
  { id: "cono", nombre: "Cono de helado", distribucion: { unit: 40, integracion: 30, e2e: 200 } },
];

export function tiempoSuiteMs(d: Distribucion): number {
  return (Object.keys(PERFILES) as Nivel[]).reduce(
    (acc, nivel) => acc + d[nivel] * PERFILES[nivel].msPorTest,
    0,
  );
}

/** Probabilidad de que al menos un test falle por flakiness en una corrida. */
export function probabilidadCorridaRoja(d: Distribucion): number {
  const todosPasan = (Object.keys(PERFILES) as Nivel[]).reduce(
    (acc, nivel) => acc * (1 - PERFILES[nivel].probabilidadFlaky) ** d[nivel],
    1,
  );
  return 1 - todosPasan;
}

export type Forma = "piramide" | "trofeo" | "cono" | "otra";

export function clasificarForma(d: Distribucion): Forma {
  if (d.e2e > d.integracion && d.e2e > d.unit) return "cono";
  if (d.unit >= d.integracion && d.integracion >= d.e2e) return "piramide";
  if (d.integracion > d.unit && d.integracion > d.e2e) return "trofeo";
  return "otra";
}

export const DESCRIPCION_FORMA: Record<Forma, string> = {
  piramide:
    "Pirámide: muchos tests unitarios rápidos y baratos, menos de integración y pocos e2e. Feedback rápido y suite estable.",
  trofeo:
    "Trofeo: el grueso en integración, donde se prueba cómo se usan las piezas juntas. Más confianza por test, a un costo todavía razonable.",
  cono:
    "Cono de helado (antipatrón): casi todo e2e. Suite lenta, frágil y cara de mantener; los errores aparecen tarde y cuesta ubicarlos.",
  otra: "Distribución mixta: revisá qué nivel te da más confianza por minuto de CI.",
};

export function formatearDuracion(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  const segundos = ms / 1000;
  if (segundos < 60) return `${segundos.toFixed(1)} s`;
  return `${Math.floor(segundos / 60)} min ${Math.round(segundos % 60)} s`;
}
