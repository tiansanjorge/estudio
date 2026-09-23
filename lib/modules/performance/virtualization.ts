export interface RangoVisible {
  inicio: number;
  fin: number;
}

export function calcularRangoVisible(
  scrollTop: number,
  alturaFila: number,
  alturaViewport: number,
  totalItems: number,
  overscan: number,
): RangoVisible {
  const primerIndice = Math.floor(scrollTop / alturaFila);
  const cantidadVisible = Math.ceil(alturaViewport / alturaFila);

  const inicio = Math.max(0, primerIndice - overscan);
  const fin = Math.min(totalItems, primerIndice + cantidadVisible + overscan);

  return { inicio, fin };
}
