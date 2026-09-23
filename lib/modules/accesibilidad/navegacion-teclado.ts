/**
 * Índice al que se mueve el foco dentro de un widget compuesto (roving tabindex)
 * según la tecla. Devuelve null si la tecla no es de navegación interna.
 */
export function siguienteIndice(
  actual: number,
  tecla: string,
  total: number,
  orientacion: "horizontal" | "vertical" = "horizontal",
): number | null {
  const [anterior, siguiente] =
    orientacion === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];

  switch (tecla) {
    case siguiente:
      return (actual + 1) % total;
    case anterior:
      return (actual - 1 + total) % total;
    case "Home":
      return 0;
    case "End":
      return total - 1;
    default:
      return null;
  }
}

/** Cuántas veces hay que apretar Tab para atravesar un grupo de controles. */
export function paradasDeTab(cantidadControles: number, roving: boolean): number {
  return roving ? 1 : cantidadControles;
}
