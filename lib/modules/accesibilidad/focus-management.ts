export interface ConfigFoco {
  /** Al abrir, mover el foco adentro del diálogo. */
  moverAlAbrir: boolean;
  /** Mientras está abierto, impedir que el foco salga (focus trap + inert en el fondo). */
  atrapar: boolean;
  /** Al cerrar, devolver el foco al elemento que lo abrió. */
  devolverAlCerrar: boolean;
}

export const CONFIG_CORRECTA: ConfigFoco = {
  moverAlAbrir: true,
  atrapar: true,
  devolverAlCerrar: true,
};

/** Describe dónde está el foco, para el registro del playground. */
export function describirFoco(elemento: Element | null, contenedor: Element | null): string {
  if (!elemento || elemento === document.body) return "<body> — foco perdido";
  if (contenedor && !contenedor.contains(elemento)) return "fuera del playground";
  return elemento.getAttribute("data-foco") ?? elemento.tagName.toLowerCase();
}

export function problemasDeConfig(config: ConfigFoco): string[] {
  const problemas: string[] = [];
  if (!config.moverAlAbrir) {
    problemas.push("Al abrir, el foco queda detrás del diálogo: el lector no se entera de que se abrió.");
  }
  if (!config.atrapar) {
    problemas.push("Con Tab el foco se escapa al contenido de fondo, que visualmente está tapado.");
  }
  if (!config.devolverAlCerrar) {
    problemas.push("Al cerrar, el botón enfocado se desmonta y el foco vuelve al inicio del documento.");
  }
  return problemas;
}
