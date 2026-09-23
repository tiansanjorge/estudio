import type { PreguntaEntrevista } from "../types";

export const entrevistaFocusManagement: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué tiene que pasar con el foco cuando se abre y se cierra un modal?",
    respuestaEs:
      "Tres cosas. Al abrir, el foco tiene que MOVERSE adentro del diálogo (al primer campo, o al título o al propio contenedor si no hay nada interactivo); si queda en el botón que lo abrió, el lector de pantalla no se entera de que apareció algo y el usuario de teclado sigue tabulando por la página de atrás. Mientras está abierto, el foco tiene que quedar CONTENIDO: Tab y Shift+Tab recorren solo los elementos del diálogo, y el contenido de fondo no se puede alcanzar. Y al cerrar, el foco tiene que VOLVER al elemento que lo abrió; si no, el elemento enfocado se desmonta, el foco cae al inicio del documento y el usuario pierde su lugar en la página. Además, Escape debe cerrarlo.",
    respuestaEn:
      "Three things. On open, focus must MOVE into the dialog (to the first field, or to the heading or the container itself if nothing is interactive); if it stays on the button that opened it, the screen reader doesn't learn something appeared and the keyboard user keeps tabbing through the page behind. While open, focus must stay CONTAINED: Tab and Shift+Tab cycle only through the dialog's elements, and background content can't be reached. And on close, focus must RETURN to the element that opened it; otherwise the focused element unmounts, focus drops to the start of the document and the user loses their place on the page. Escape should also close it.",
  },
  {
    nivel: 1,
    pregunta: "¿Por qué nunca hay que sacar el outline de foco con `outline: none` sin reemplazo?",
    respuestaEs:
      "Porque el indicador de foco es para el usuario de teclado lo que el cursor es para el usuario de mouse: sin él no sabe dónde está parado ni qué va a activar al apretar Enter. Se suele sacar porque aparece al hacer click y 'se ve feo'. La solución correcta es `:focus-visible`, que el navegador aplica solo cuando el foco llega por teclado (o en elementos donde siempre hace falta, como inputs de texto), y no al hacer click con el mouse. Así se estiliza un indicador visible y con buen contraste para quien lo necesita, sin molestar a quien usa mouse. WCAG exige que el foco sea visible (2.4.7) y, en su versión 2.2, que no quede tapado por elementos como headers sticky (2.4.11).",
    respuestaEn:
      "Because the focus indicator is to a keyboard user what the cursor is to a mouse user: without it they don't know where they are or what Enter will activate. It's usually removed because it appears on click and 'looks ugly'. The right fix is `:focus-visible`, which the browser applies only when focus arrives via keyboard (or on elements where it's always needed, like text inputs), not on mouse clicks. That way you style a visible, good-contrast indicator for whoever needs it without bothering mouse users. WCAG requires focus to be visible (2.4.7) and, in 2.2, not hidden behind elements like sticky headers (2.4.11).",
    codigo: `/* ❌ el usuario de teclado queda a ciegas */
button:focus { outline: none; }

/* ✅ solo cuando el foco llega por teclado */
button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo manejás el foco en una SPA al navegar entre rutas del lado del cliente?",
    respuestaEs:
      "En una navegación tradicional el navegador carga un documento nuevo, el foco vuelve al inicio y el lector anuncia el título. En una SPA nada de eso pasa: cambia el contenido, pero el foco queda en el link que se clickeó (que a veces ni existe en la nueva vista) y el lector no anuncia nada. Hay que replicarlo a mano: después de navegar, mover el foco a un elemento significativo de la nueva vista, típicamente el `<h1>` con `tabIndex={-1}` (enfocable por código pero no por Tab), o anunciar el cambio de ruta en una región viva. Next.js App Router ya incluye un route announcer que lee el título de la página nueva, y maneja el scroll y el foco de forma razonable, pero conviene verificarlo con un lector real, sobre todo en layouts con navegación persistente.",
    respuestaEn:
      "In a traditional navigation the browser loads a new document, focus returns to the start and the reader announces the title. In an SPA none of that happens: content changes, but focus stays on the clicked link (which sometimes doesn't even exist in the new view) and the reader announces nothing. You replicate it manually: after navigating, move focus to a meaningful element of the new view, typically the `<h1>` with `tabIndex={-1}` (focusable by code but not by Tab), or announce the route change in a live region. Next.js App Router already includes a route announcer that reads the new page's title, and handles scroll and focus reasonably, but it's worth verifying with a real screen reader, especially in layouts with persistent navigation.",
    tradeoffs:
      "Mover el foco al h1 da contexto pero obliga a volver a tabular desde el inicio del contenido; en flujos donde se navega muchas veces seguidas (paginación, filtros) a veces conviene solo anunciar el cambio y dejar el foco donde está.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué pasa con el foco cuando se elimina el elemento que lo tenía, y cómo lo resolvés?",
    respuestaEs:
      "Cuando el elemento enfocado se desmonta (borrar un ítem de una lista, cerrar un toast, un botón que se reemplaza por un spinner), el foco vuelve al `<body>`: el usuario de teclado tiene que empezar de nuevo desde el inicio del documento y el lector no dice nada. Hay que decidir explícitamente a dónde va: al borrar un ítem, al siguiente (o al anterior si era el último), o al encabezado de la lista si quedó vacía; al reemplazar un botón por un estado de carga, mantener el botón con `aria-busy` o `disabled` en vez de desmontarlo. La regla es que ninguna acción del usuario debería dejar el foco en el body.",
    respuestaEn:
      "When the focused element unmounts (deleting a list item, closing a toast, a button replaced by a spinner), focus goes back to `<body>`: the keyboard user has to start over from the top of the document and the reader says nothing. You have to decide explicitly where it goes: after deleting an item, to the next one (or previous if it was last), or to the list heading if it's now empty; when replacing a button with a loading state, keep the button with `aria-busy` or `disabled` instead of unmounting it. The rule is that no user action should leave focus on the body.",
    codigo: `function eliminar(indice: number) {
  setItems((prev) => prev.filter((_, i) => i !== indice));
  // después del commit, enfocar el vecino que ocupa su lugar
  requestAnimationFrame(() => {
    const destino = refs.current[indice] ?? refs.current[indice - 1] ?? tituloRef.current;
    destino?.focus();
  });
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Conviene implementar un focus trap a mano, usar `inert`, o usar el elemento `<dialog>` nativo?",
    respuestaEs:
      "Hoy, `<dialog>` con `showModal()` es la opción por defecto: el navegador vuelve inerte todo lo que está fuera del diálogo (no se puede enfocar ni clickear, y sale del árbol de accesibilidad), mueve el foco adentro al abrir, cierra con Escape, lo pone en el top layer (sin pelear con z-index) y en navegadores modernos devuelve el foco al cerrar. Un focus trap manual (interceptar Tab en el primer y último elemento) tiene huecos: no bloquea al lector de pantalla, que puede navegar el fondo con sus propios comandos sin pasar por Tab, y hay que mantener la lista de elementos enfocables. `inert` sobre el resto de la página resuelve eso para diálogos custom (por ejemplo, cuando se necesita una animación o estructura que `<dialog>` complica). Las librerías headless combinan ambos. Lo que no alcanza es solo `aria-modal=\"true\"`: le dice al lector que el fondo no importa, pero no impide llegar a él.",
    respuestaEn:
      "Today, `<dialog>` with `showModal()` is the default: the browser makes everything outside the dialog inert (unfocusable, unclickable, removed from the accessibility tree), moves focus in on open, closes on Escape, puts it in the top layer (no z-index fights) and in modern browsers returns focus on close. A manual focus trap (intercepting Tab on the first and last element) has holes: it doesn't block the screen reader, which can navigate the background with its own commands without going through Tab, and you must maintain the list of focusable elements. `inert` on the rest of the page fixes that for custom dialogs (e.g. when you need an animation or structure `<dialog>` complicates). Headless libraries combine both. What isn't enough is just `aria-modal=\"true\"`: it tells the reader the background doesn't matter, but doesn't prevent reaching it.",
    repregunta: "¿Por qué el focus trap con Tab no alcanza para un usuario de lector de pantalla?",
    respuestaRepreguntaEs:
      "Porque los lectores de pantalla no navegan solo con Tab: tienen un modo de lectura (virtual cursor o browse mode) donde recorren el contenido con flechas, saltan por encabezados, landmarks o links, sin mover el foco del DOM. Interceptar Tab no afecta esos comandos, así que el usuario puede terminar leyendo el contenido de detrás del modal sin darse cuenta. Por eso hace falta sacar el fondo del árbol de accesibilidad, que es exactamente lo que hacen `inert` y `showModal()`.",
    respuestaRepreguntaEn:
      "Because screen readers don't navigate only with Tab: they have a reading mode (virtual cursor or browse mode) where they move through content with arrows, jump by headings, landmarks or links, without moving DOM focus. Intercepting Tab doesn't affect those commands, so the user can end up reading the content behind the modal without noticing. That's why the background must be removed from the accessibility tree, which is exactly what `inert` and `showModal()` do.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué significa `tabIndex={-1}` versus `tabIndex={0}` versus un valor positivo, y por qué los positivos son un antipatrón?",
    respuestaEs:
      "`tabIndex={0}` agrega el elemento al orden de Tab en su posición natural del DOM: se usa para hacer enfocable un control custom. `tabIndex={-1}` lo hace enfocable solo por código (`.focus()`) pero lo saca del recorrido con Tab: se usa para destinos de foco programático, como un encabezado al que se mueve el foco al navegar, o para los ítems no activos en un roving tabindex. Un valor positivo (`tabIndex={3}`) crea un orden global que se recorre ANTES que todo lo demás, en orden numérico, independiente de la posición en el DOM. Es un antipatrón porque es frágil (cada componente nuevo tiene que conocer los números de los demás), rompe la correspondencia entre orden visual y orden de foco que exige WCAG (2.4.3), y en apps componentizadas es imposible de mantener. Si el orden de foco está mal, se arregla el orden del DOM.",
    respuestaEn:
      "`tabIndex={0}` adds the element to the Tab order at its natural DOM position: used to make a custom control focusable. `tabIndex={-1}` makes it focusable only by code (`.focus()`) but removes it from Tab traversal: used for programmatic focus targets, like a heading focus moves to after navigation, or for inactive items in a roving tabindex. A positive value (`tabIndex={3}`) creates a global order traversed BEFORE everything else, in numeric order, independent of DOM position. It's an antipattern because it's fragile (every new component must know the others' numbers), breaks the visual-order/focus-order correspondence WCAG requires (2.4.3), and is impossible to maintain in componentized apps. If focus order is wrong, fix the DOM order.",
  },
];
