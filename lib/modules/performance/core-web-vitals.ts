export type Metrica = "LCP" | "INP" | "CLS";
export type Calificacion = "bueno" | "mejorable" | "malo";

interface Umbral {
  nombre: string;
  mide: string;
  /** Hasta este valor (inclusive) la métrica es "buena". */
  bueno: number;
  /** Hasta este valor (inclusive) "necesita mejorar"; por encima es "mala". */
  mejorable: number;
  unidad: "s" | "ms" | "";
}

export const UMBRALES: Record<Metrica, Umbral> = {
  LCP: {
    nombre: "Largest Contentful Paint",
    mide: "Carga: cuándo se pinta el elemento más grande del viewport",
    bueno: 2.5,
    mejorable: 4,
    unidad: "s",
  },
  INP: {
    nombre: "Interaction to Next Paint",
    mide: "Respuesta: cuánto tarda la página en pintar tras una interacción",
    bueno: 200,
    mejorable: 500,
    unidad: "ms",
  },
  CLS: {
    nombre: "Cumulative Layout Shift",
    mide: "Estabilidad visual: cuánto se mueve el contenido sin que el usuario lo pida",
    bueno: 0.1,
    mejorable: 0.25,
    unidad: "",
  },
};

export function clasificar(metrica: Metrica, valor: number): Calificacion {
  const { bueno, mejorable } = UMBRALES[metrica];
  if (valor <= bueno) return "bueno";
  if (valor <= mejorable) return "mejorable";
  return "malo";
}

interface DesplazamientoVertical {
  alturaViewport: number;
  /** Posición y altura del elemento inestable antes de moverse. */
  top: number;
  altura: number;
  /** Cuántos px se movió hacia abajo. */
  desplazamiento: number;
}

/**
 * Puntaje de un layout shift para un elemento de ancho completo que se mueve
 * verticalmente: impact fraction × distance fraction. Simplificación: la
 * spec divide la distancia por la dimensión MAYOR del viewport; acá se usa la altura.
 */
export function calcularLayoutShift({
  alturaViewport,
  top,
  altura,
  desplazamiento,
}: DesplazamientoVertical): { impacto: number; distancia: number; puntaje: number } {
  if (desplazamiento === 0) return { impacto: 0, distancia: 0, puntaje: 0 };

  // unión del área que ocupaba antes y ocupa después, recortada al viewport
  const inicio = Math.max(0, top);
  const fin = Math.min(alturaViewport, top + altura + desplazamiento);
  const impacto = Math.max(0, fin - inicio) / alturaViewport;
  const distancia = Math.min(desplazamiento, alturaViewport) / alturaViewport;

  return { impacto, distancia, puntaje: impacto * distancia };
}
