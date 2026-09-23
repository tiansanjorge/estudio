export type Deteccion = "si" | "no";

export interface ProblemaA11y {
  id: string;
  descripcion: string;
  codigo: string;
  deteccion: Deteccion;
  /** Regla de axe-core que lo reporta, si existe. */
  regla?: string;
  explicacion: string;
}

export const PROBLEMAS: ProblemaA11y[] = [
  {
    id: "img-sin-alt",
    descripcion: "Imagen sin texto alternativo",
    codigo: `<img src="grafico.png" />`,
    deteccion: "si",
    regla: "image-alt",
    explicacion: "Es una regla estructural: basta con ver que falta el atributo.",
  },
  {
    id: "alt-inutil",
    descripcion: "Alt que no describe nada",
    codigo: `<img src="grafico.png" alt="imagen" />`,
    deteccion: "no",
    explicacion: "El atributo existe. Si el texto es útil o no, lo decide una persona.",
  },
  {
    id: "input-sin-label",
    descripcion: "Input sin nombre accesible",
    codigo: `<input type="email" placeholder="Email" />`,
    deteccion: "si",
    regla: "label",
    explicacion:
      "axe calcula el nombre accesible; aunque el placeholder a veces lo provee, la regla lo marca como insuficiente.",
  },
  {
    id: "contraste",
    descripcion: "Texto gris claro sobre fondo blanco",
    codigo: `<p style="color:#c0c0c0">Envío gratis</p>`,
    deteccion: "si",
    regla: "color-contrast",
    explicacion:
      "Lo calcula con los colores computados, en un navegador real. En jsdom (sin layout) no puede.",
  },
  {
    id: "div-onclick",
    descripcion: "Div clickeable sin soporte de teclado",
    codigo: `<div onClick={abrir}>Ver detalle</div>`,
    deteccion: "no",
    explicacion:
      "axe analiza el DOM y el árbol de accesibilidad, no los event listeners: no sabe que ese div hace algo.",
  },
  {
    id: "switch-sin-estado",
    descripcion: "role=\"switch\" sin aria-checked",
    codigo: `<button role="switch">Modo oscuro</button>`,
    deteccion: "si",
    regla: "aria-required-attr",
    explicacion: "Cada rol tiene atributos obligatorios definidos en la spec de ARIA.",
  },
  {
    id: "foco-modal",
    descripcion: "Modal que no devuelve el foco al cerrarse",
    codigo: `setAbierto(false); // y nada más`,
    deteccion: "no",
    explicacion: "Es comportamiento en el tiempo; un análisis estático del DOM no lo ve.",
  },
  {
    id: "error-solo-color",
    descripcion: "Error indicado solo con borde rojo",
    codigo: `<input className={error ? "border-red-500" : ""} />`,
    deteccion: "no",
    explicacion: "axe no puede saber que ese color significa 'error'.",
  },
  {
    id: "html-lang",
    descripcion: "Documento sin idioma declarado",
    codigo: `<html>`,
    deteccion: "si",
    regla: "html-has-lang",
    explicacion: "Sin lang, el lector usa la voz equivocada (inglés leyendo español).",
  },
  {
    id: "orden-foco",
    descripcion: "Orden de Tab distinto del orden visual",
    codigo: `<div class="flex flex-row-reverse">…</div>`,
    deteccion: "no",
    explicacion: "Requiere comparar lo que se ve con el recorrido real: prueba manual con teclado.",
  },
];

export function contarAciertos(
  respuestas: Record<string, Deteccion>,
  problemas: ProblemaA11y[] = PROBLEMAS,
): { aciertos: number; respondidas: number } {
  const respondidas = problemas.filter((p) => respuestas[p.id]);
  return {
    respondidas: respondidas.length,
    aciertos: respondidas.filter((p) => respuestas[p.id] === p.deteccion).length,
  };
}
