/** Ids de posts ordenados del más nuevo al más viejo (como un feed). */
export const DATASET_INICIAL: number[] = Array.from({ length: 12 }, (_, i) => 112 - i);
export const TAMANO_PAGINA = 4;

/** GET /posts?limit=4&offset=N — "saltá N filas", sobre el dataset actual. */
export function paginaPorOffset(dataset: number[], paginasCargadas: number): number[] {
  const offset = paginasCargadas * TAMANO_PAGINA;
  return dataset.slice(offset, offset + TAMANO_PAGINA);
}

/** GET /posts?limit=4&cursor=ID — "dame los que vienen después del último que viste". */
export function paginaPorCursor(dataset: number[], ultimoId: number | null): number[] {
  const desde = ultimoId === null ? 0 : dataset.findIndex((id) => id < ultimoId);
  return desde === -1 ? [] : dataset.slice(desde, desde + TAMANO_PAGINA);
}

export function analizar(cargados: number[], datasetAlCargar: number[]) {
  const vistos = new Set<number>();
  const duplicados = new Set<number>();
  for (const id of cargados) {
    if (vistos.has(id)) duplicados.add(id);
    vistos.add(id);
  }
  // salteados: ids que siguen existiendo "entre" posts ya cargados y nunca aparecieron
  // (un post nuevo, más arriba del más reciente cargado, no cuenta como salteado)
  const minimo = Math.min(...cargados);
  const maximo = Math.max(...cargados);
  const salteados = datasetAlCargar.filter((id) => id >= minimo && id <= maximo && !vistos.has(id));
  return { duplicados, salteados };
}
