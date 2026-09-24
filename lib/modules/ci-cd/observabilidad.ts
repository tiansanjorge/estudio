export const TOTAL_REQUESTS = 1000;
export const UMBRAL_SLO_MS = 500;
export const OBJETIVO_SLO = 99;

// latencias deterministas: la mayoría rápidas y una cola de requests lentas
// (una query sin índice, un timeout contra un servicio externo)
export function generarLatencias(porcentajeLentas: number): number[] {
  const lentas = Math.round((TOTAL_REQUESTS * porcentajeLentas) / 100);
  return Array.from({ length: TOTAL_REQUESTS }, (_, i) =>
    i < lentas ? 1200 + ((i * 211) % 1800) : 50 + ((i * 37) % 110),
  );
}

export function percentil(ordenadas: number[], p: number): number {
  const indice = Math.min(ordenadas.length - 1, Math.ceil((p / 100) * ordenadas.length) - 1);
  return ordenadas[Math.max(0, indice)];
}

export interface ResumenLatencias {
  promedio: number;
  p50: number;
  p95: number;
  p99: number;
  cumplimiento: number;
  buckets: { etiqueta: string; cantidad: number }[];
}

const LIMITES = [100, 200, 500, 1000, 2000, Infinity];
const ETIQUETAS = ["< 100 ms", "100–200", "200–500", "0,5–1 s", "1–2 s", "> 2 s"];

export function resumir(latencias: number[]): ResumenLatencias {
  const ordenadas = [...latencias].sort((a, b) => a - b);
  const promedio = Math.round(latencias.reduce((a, b) => a + b, 0) / latencias.length);
  const bajoUmbral = latencias.filter((l) => l < UMBRAL_SLO_MS).length;
  const buckets = LIMITES.map((limite, i) => ({
    etiqueta: ETIQUETAS[i],
    cantidad: latencias.filter((l) => l >= (i === 0 ? 0 : LIMITES[i - 1]) && l < limite).length,
  }));
  return {
    promedio,
    p50: percentil(ordenadas, 50),
    p95: percentil(ordenadas, 95),
    p99: percentil(ordenadas, 99),
    cumplimiento: (bajoUmbral / latencias.length) * 100,
    buckets,
  };
}
