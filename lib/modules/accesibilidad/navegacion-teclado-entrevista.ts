import type { PreguntaEntrevista } from "../types";

export const entrevistaNavegacionTeclado: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cómo verificás rápido si una página es usable solo con teclado?",
    respuestaEs:
      "Desenchufando el mouse (o sin tocarlo) y recorriendo el flujo principal. Con Tab y Shift+Tab: ¿se llega a todos los controles interactivos?, ¿el orden sigue la lectura visual?, ¿se ve siempre dónde está el foco? Con Enter y Espacio: ¿se activan botones, links, checkboxes? Con Escape: ¿se cierran modales y menús? Y con las flechas dentro de menús, tabs o selects. Los problemas típicos que aparecen enseguida: controles hechos con divs que no son alcanzables, menús que solo se abren con hover, indicador de foco invisible, un modal del que no se puede salir, o el foco que salta de un lado a otro porque el orden visual no coincide con el del DOM. Es una prueba de cinco minutos que encuentra muchos problemas que las herramientas automáticas no detectan.",
    respuestaEn:
      "By unplugging the mouse (or not touching it) and going through the main flow. With Tab and Shift+Tab: can every interactive control be reached?, does the order follow the visual reading?, is it always clear where focus is? With Enter and Space: do buttons, links and checkboxes activate? With Escape: do modals and menus close? And with arrows inside menus, tabs or selects. The typical problems show up right away: div-based controls that can't be reached, hover-only menus, invisible focus indicator, a modal you can't get out of, or focus jumping around because visual order doesn't match DOM order. It's a five-minute test that finds many problems automated tools don't catch.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es un skip link y por qué hace falta?",
    respuestaEs:
      "Es un link al principio de la página, normalmente oculto hasta que recibe foco, que dice 'Saltar al contenido' y lleva al `<main>`. Hace falta porque un usuario de teclado, en cada página, tendría que atravesar con Tab todo el header y la navegación (a veces decenas de links) antes de llegar al contenido. El que usa mouse simplemente va al contenido; el skip link le da el mismo atajo al teclado. Es un requisito de WCAG (2.4.1, bypass blocks). Se implementa con un `<a href=\"#contenido\">` como primer elemento enfocable y el `<main id=\"contenido\">` como destino; se oculta visualmente fuera de foco y se muestra al enfocarlo, nunca con `display: none`.",
    respuestaEn:
      "It's a link at the start of the page, usually hidden until focused, that says 'Skip to content' and goes to `<main>`. It's needed because a keyboard user, on every page, would have to Tab through the whole header and navigation (sometimes dozens of links) before reaching the content. A mouse user just goes to the content; the skip link gives the keyboard the same shortcut. It's a WCAG requirement (2.4.1, bypass blocks). It's implemented with an `<a href=\"#content\">` as the first focusable element and `<main id=\"content\">` as the target; it's visually hidden when not focused and shown on focus, never with `display: none`.",
    codigo: `<a href="#contenido" className="sr-only focus:not-sr-only">
  Saltar al contenido
</a>
<Header />
<main id="contenido" tabIndex={-1}>…</main>`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué reordenar elementos con CSS (flex `order`, `row-reverse`, grid placement) puede romper la navegación por teclado?",
    respuestaEs:
      "Porque el orden de Tab y el de lectura del lector de pantalla siguen el orden del DOM, no el visual. Si con CSS ponés visualmente primero algo que en el DOM está último, el usuario de teclado ve el foco saltar de un lado a otro de forma impredecible, y el del lector escucha el contenido en un orden distinto al que ve quien mira la pantalla. WCAG pide que el orden de foco preserve el significado y la operabilidad (2.4.3). El caso típico es un layout responsive que en mobile usa `order` para subir un bloque. La solución es que el orden del DOM sea el orden lógico, y usar CSS solo para diferencias de presentación que no cambian la secuencia; si el orden realmente tiene que cambiar según el breakpoint, a veces conviene renderizar distinto en vez de reordenar con CSS. `reading-flow` es una propiedad CSS nueva que busca resolver esto, pero todavía no tiene soporte amplio.",
    respuestaEn:
      "Because Tab order and screen reader reading order follow DOM order, not visual order. If CSS visually puts first something that's last in the DOM, the keyboard user sees focus jump around unpredictably, and the screen reader user hears content in a different order than a sighted user sees. WCAG requires focus order to preserve meaning and operability (2.4.3). The typical case is a responsive layout that uses `order` on mobile to move a block up. The fix is making DOM order the logical order, and using CSS only for presentational differences that don't change sequence; if order really must change per breakpoint, sometimes it's better to render differently than to reorder with CSS. `reading-flow` is a new CSS property aimed at this, but it doesn't have broad support yet.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué es roving tabindex y cuándo se usa?",
    respuestaEs:
      "Es la técnica para que un widget compuesto (toolbar, tabs, menú, listbox, grilla) sea UNA sola parada de Tab. Solo el elemento activo tiene `tabIndex=0`; todos los demás tienen `-1`. Las flechas mueven el foco dentro del grupo actualizando cuál tiene el 0, y Tab sale del widget. Así, el que navega con teclado atraviesa una toolbar de veinte botones con un solo Tab en vez de veinte, y al volver al widget el foco cae en el último elemento usado. Es la convención de las plataformas de escritorio: Tab entre controles, flechas dentro de un control. Se usa en todos los patrones compuestos de la ARIA Authoring Practices Guide.",
    respuestaEn:
      "It's the technique to make a composite widget (toolbar, tabs, menu, listbox, grid) a SINGLE Tab stop. Only the active element has `tabIndex=0`; all others have `-1`. Arrows move focus within the group by updating which one has the 0, and Tab leaves the widget. That way a keyboard user crosses a twenty-button toolbar with one Tab instead of twenty, and when coming back focus lands on the last used element. It's the desktop platform convention: Tab between controls, arrows within a control. It's used in every composite pattern of the ARIA Authoring Practices Guide.",
    codigo: `{herramientas.map((h, i) => (
  <button
    key={h}
    tabIndex={i === activo ? 0 : -1}
    onKeyDown={(e) => {
      if (e.key === "ArrowRight") mover((i + 1) % total);
      if (e.key === "ArrowLeft") mover((i - 1 + total) % total);
    }}
  >
    {h}
  </button>
))}`,
  },
  {
    nivel: 3,
    pregunta: "¿Roving tabindex o `aria-activedescendant`? ¿Cuándo conviene cada uno?",
    respuestaEs:
      "Los dos resuelven 'una parada de Tab con navegación interna', pero de forma distinta. Con roving tabindex el foco del DOM se mueve de verdad entre los elementos: es simple, el navegador hace scroll al elemento enfocado, y los estilos de `:focus-visible` funcionan solos. Con `aria-activedescendant` el foco del DOM se queda en el contenedor (o en un input) y un atributo le indica a las tecnologías asistivas cuál descendiente está 'activo'; hay que dibujar el indicador visual a mano y manejar el scroll. Su ventaja clave es el combobox: el usuario sigue escribiendo en el input mientras las flechas recorren las opciones del listbox, algo imposible si el foco se moviera a la opción. Regla práctica: roving tabindex por defecto; activedescendant cuando el foco tiene que quedarse en un campo de texto.",
    respuestaEn:
      "Both solve 'one Tab stop with internal navigation', but differently. With roving tabindex the DOM focus actually moves between elements: it's simple, the browser scrolls to the focused element, and `:focus-visible` styles just work. With `aria-activedescendant` DOM focus stays on the container (or an input) and an attribute tells assistive technologies which descendant is 'active'; you have to draw the visual indicator yourself and handle scrolling. Its key advantage is the combobox: the user keeps typing in the input while arrows move through the listbox options, which is impossible if focus moved to the option. Rule of thumb: roving tabindex by default; activedescendant when focus must stay in a text field.",
  },
  {
    nivel: 3,
    pregunta:
      "Querés agregar atajos de teclado de una sola tecla (por ejemplo, 'j' y 'k' para navegar un feed). ¿Qué riesgos de accesibilidad tiene?",
    respuestaEs:
      "Choca con los usuarios de control por voz y de lectores de pantalla. Un usuario de voz que dicta texto puede disparar comandos sin querer (dice una palabra y cada letra ejecuta una acción), y los lectores de pantalla ya usan teclas sueltas en su modo de lectura (h para encabezados, k para links), así que tus atajos compiten con los suyos. WCAG 2.1.4 pide que un atajo de una sola tecla se pueda desactivar, reasignar, o que solo funcione cuando el componente tiene foco. Además: los atajos deben ser descubribles (listados en un diálogo de ayuda, típicamente con '?'), no deben pisar atajos del navegador o del sistema, y no deben dispararse mientras el usuario escribe en un input, algo que se olvida muy seguido.",
    respuestaEn:
      "It clashes with voice control and screen reader users. A voice user dictating text can trigger commands by accident (they say a word and each letter runs an action), and screen readers already use single keys in browse mode (h for headings, k for links), so your shortcuts compete with theirs. WCAG 2.1.4 requires a single-key shortcut to be turn-off-able, remappable, or active only when the component has focus. Also: shortcuts must be discoverable (listed in a help dialog, typically with '?'), must not override browser or OS shortcuts, and must not fire while the user is typing in an input, which is very often forgotten.",
    repregunta: "¿Cómo evitás que un atajo global se dispare mientras el usuario escribe?",
    respuestaRepreguntaEs:
      "En el listener global, ignorando el evento si su target es un campo editable: `input`, `textarea`, `select` o un elemento con `contentEditable`. También conviene ignorar eventos con modificadores que no correspondan (Ctrl, Meta, Alt) para no pisar atajos del sistema, y chequear `e.isComposing` para no interferir con la composición de caracteres en idiomas con IME.",
    respuestaRepreguntaEn:
      "In the global listener, ignore the event if its target is an editable field: `input`, `textarea`, `select` or a `contentEditable` element. It's also wise to ignore events with non-matching modifiers (Ctrl, Meta, Alt) to avoid overriding system shortcuts, and check `e.isComposing` to avoid interfering with IME character composition.",
    codigoRepregunta: `function esEditable(el: EventTarget | null) {
  return el instanceof HTMLElement &&
    (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

document.addEventListener("keydown", (e) => {
  if (esEditable(e.target) || e.isComposing || e.ctrlKey || e.metaKey) return;
  if (e.key === "j") siguientePost();
});`,
  },
];
