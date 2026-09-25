import type { Nivel } from "./types";

const CLAVE_STORAGE = "progreso-modulos";

export const NIVELES: Nivel[] = [1, 2, 3];

/** Se dispara en window al marcar/desmarcar un nivel, para sincronizar todas las instancias montadas (mismo tab). */
export const EVENTO_PROGRESO_CAMBIO = "progreso-modulos-changed";

/** Clave de progreso de un nivel de módulo: "<categoriaSlug>/<moduloSlug>/nivel-<n>". */
export function claveNivel(categoriaSlug: string, moduloSlug: string, nivel: Nivel): string {
  return `${categoriaSlug}/${moduloSlug}/nivel-${nivel}`;
}

export function leerLeidos(): Set<string> {
  try {
    const raw = localStorage.getItem(CLAVE_STORAGE);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function alternarLeido(clave: string) {
  const leidos = leerLeidos();
  if (leidos.has(clave)) leidos.delete(clave);
  else leidos.add(clave);
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify([...leidos]));
  } catch {
    // Storage bloqueado o lleno: el toggle sigue funcionando, solo no persiste.
  }
  window.dispatchEvent(new Event(EVENTO_PROGRESO_CAMBIO));
}

/** Cuenta, para una categoría y un nivel dados, cuántos de sus módulos tienen ese nivel marcado como leído. */
export function contarLeidosPorNivel(
  leidos: Set<string>,
  categoriaSlug: string,
  moduloSlugs: string[],
  nivel: Nivel,
): number {
  return moduloSlugs.filter((slug) => leidos.has(claveNivel(categoriaSlug, slug, nivel))).length;
}
