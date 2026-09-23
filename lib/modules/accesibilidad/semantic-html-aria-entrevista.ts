import type { PreguntaEntrevista } from "../types";

export const entrevistaSemanticHtmlAria: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué importa usar HTML semántico si con divs y CSS se ve igual?",
    respuestaEs:
      "Porque la página no la 'ven' solo los ojos: el navegador construye un árbol de accesibilidad a partir del DOM, y eso es lo que usan lectores de pantalla, navegación por teclado, control por voz y otras tecnologías asistivas. Un `<button>` aparece en ese árbol con rol 'button', se puede alcanzar con Tab y se activa con Enter o Espacio sin escribir nada. Un `<div onClick>` se ve igual pero para esas tecnologías es texto genérico: no se puede enfocar ni activar con teclado. Lo mismo con la estructura: `<nav>`, `<main>`, `<header>` y los niveles de encabezado permiten a un usuario de lector de pantalla saltar directo a la navegación o recorrer la página por títulos, como alguien que mira escanea visualmente. Además mejora SEO y hace el código más legible.",
    respuestaEn:
      "Because the page isn't only 'seen' by eyes: the browser builds an accessibility tree from the DOM, and that's what screen readers, keyboard navigation, voice control and other assistive technologies use. A `<button>` shows up in that tree with the 'button' role, can be reached with Tab and activates with Enter or Space without writing anything. A `<div onClick>` looks the same but to those technologies it's generic text: it can't be focused or activated by keyboard. Same with structure: `<nav>`, `<main>`, `<header>` and heading levels let a screen reader user jump straight to navigation or move through the page by headings, the way a sighted user scans visually. It also improves SEO and makes the code more readable.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es el 'nombre accesible' de un elemento y cómo se calcula?",
    respuestaEs:
      "Es el texto que las tecnologías asistivas usan para identificar un elemento: lo que el lector de pantalla dice antes del rol ('Guardar, botón'). Se calcula con un orden de prioridad: primero `aria-labelledby` (el texto de otro elemento referenciado por id), después `aria-label`, después la asociación nativa (el `<label>` de un input, el `alt` de una imagen) y por último el contenido de texto del elemento, para los roles que lo permiten. El error típico es un botón que solo contiene un ícono SVG: es operable, pero su nombre accesible queda vacío y el lector anuncia solo 'botón'. Se arregla con `aria-label` o con texto visualmente oculto, y marcando el ícono con `aria-hidden`.",
    respuestaEn:
      "It's the text assistive technologies use to identify an element: what the screen reader says before the role ('Save, button'). It's computed in priority order: first `aria-labelledby` (another element's text referenced by id), then `aria-label`, then the native association (an input's `<label>`, an image's `alt`) and finally the element's text content, for roles that allow it. The typical mistake is a button containing only an SVG icon: it's operable, but its accessible name is empty and the reader announces just 'button'. The fix is `aria-label` or visually hidden text, and marking the icon with `aria-hidden`.",
    codigo: `// nombre vacío: el lector dice "botón"
<button><IconoPapelera /></button>

// nombre accesible: "Eliminar, botón"
<button aria-label="Eliminar">
  <IconoPapelera aria-hidden="true" />
</button>`,
  },
  {
    nivel: 2,
    pregunta: "¿Cuál es la primera regla de ARIA y por qué existe?",
    respuestaEs:
      "'Si podés usar un elemento HTML nativo con la semántica y el comportamiento que necesitás, usalo en vez de agregar ARIA.' Existe porque ARIA solo cambia lo que se ANUNCIA, no lo que el elemento HACE: `role=\"button\"` en un div hace que el lector diga 'botón', pero no lo vuelve enfocable ni lo activa con teclado. Tenés que agregar `tabIndex`, manejar Enter y Espacio, el estado disabled, el submit dentro de un form, y es fácil olvidarse algo. Encima, ARIA mal usado es peor que no usarlo: promete una interacción que el elemento no cumple. Los datos de WebAIM lo muestran año a año: las páginas con ARIA tienen en promedio MÁS errores de accesibilidad detectados que las que no lo usan. ARIA es para lo que el HTML no puede expresar: estados como `aria-expanded`, regiones vivas, o widgets complejos sin equivalente nativo (tabs, combobox, tree).",
    respuestaEn:
      "'If you can use a native HTML element with the semantics and behavior you need, use it instead of adding ARIA.' It exists because ARIA only changes what gets ANNOUNCED, not what the element DOES: `role=\"button\"` on a div makes the reader say 'button', but doesn't make it focusable or keyboard-activatable. You have to add `tabIndex`, handle Enter and Space, the disabled state, submit inside a form, and it's easy to miss something. On top of that, misused ARIA is worse than none: it promises an interaction the element doesn't deliver. WebAIM's data shows it year after year: pages with ARIA have on average MORE detected accessibility errors than those without it. ARIA is for what HTML can't express: states like `aria-expanded`, live regions, or complex widgets with no native equivalent (tabs, combobox, tree).",
    tradeoffs:
      "Los elementos nativos a veces son difíciles de estilizar (select, checkbox). La salida no es reemplazarlos por divs con ARIA, sino estilizar el nativo o usar una librería headless probada (Radix, React Aria) que ya resolvió teclado y ARIA.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirven las regiones vivas (aria-live) y qué error común hay al usarlas?",
    respuestaEs:
      "Sirven para anunciar cambios de contenido que ocurren sin que el foco se mueva: un 'guardado correctamente', el resultado de una búsqueda, un error de validación que aparece. Sin ellas, un usuario de lector de pantalla no se entera de que algo cambió. `aria-live=\"polite\"` espera a que el lector termine lo que está diciendo; `assertive` interrumpe y debe reservarse para lo urgente. También existen `role=\"status\"` (polite) y `role=\"alert\"` (assertive) como atajos. El error común es montar la región viva junto con su contenido: el lector solo anuncia CAMBIOS dentro de una región que ya estaba en el árbol de accesibilidad, así que si el contenedor aparece con el mensaje ya adentro, muchas veces no se anuncia nada. La región tiene que existir vacía desde antes y cambiar su contenido después.",
    respuestaEn:
      "They announce content changes that happen without focus moving: a 'saved successfully', a search result count, a validation error appearing. Without them, a screen reader user doesn't find out something changed. `aria-live=\"polite\"` waits for the reader to finish what it's saying; `assertive` interrupts and should be reserved for urgent things. There are also `role=\"status\"` (polite) and `role=\"alert\"` (assertive) as shortcuts. The common mistake is mounting the live region together with its content: the reader only announces CHANGES inside a region that was already in the accessibility tree, so if the container appears with the message already inside, often nothing is announced. The region must exist empty beforehand and have its content change later.",
    codigo: `// ❌ la región aparece con el mensaje: puede no anunciarse
{guardado && <div role="status">Guardado</div>}

// ✅ la región existe siempre; cambia su contenido
<div role="status">{guardado ? "Guardado" : ""}</div>`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué diferencia hay entre display: none, visibility: hidden, aria-hidden y una clase sr-only?",
    respuestaEs:
      "`display: none` y `visibility: hidden` ocultan el elemento para todos: visualmente y del árbol de accesibilidad. `aria-hidden=\"true\"` lo saca SOLO del árbol de accesibilidad pero sigue visible e interactivo, así que se usa para decoración (íconos junto a texto, ilustraciones); el peligro es ponerlo sobre algo enfocable, porque el teclado llega a un elemento que el lector no puede describir. Una clase `sr-only` (o `visually-hidden`) hace lo inverso: oculta visualmente con clip y tamaño de 1px, pero lo deja en el árbol, para texto que solo necesitan las tecnologías asistivas, como el nombre de un botón de ícono. No se usa `display: none` para eso porque también lo sacaría del árbol. El atributo `inert`, más nuevo, saca un subárbol entero de la interacción y del árbol de accesibilidad, útil para el contenido detrás de un modal.",
    respuestaEn:
      "`display: none` and `visibility: hidden` hide the element for everyone: visually and from the accessibility tree. `aria-hidden=\"true\"` removes it ONLY from the accessibility tree but it stays visible and interactive, so it's used for decoration (icons next to text, illustrations); the danger is putting it on something focusable, because the keyboard reaches an element the reader can't describe. An `sr-only` (or `visually-hidden`) class does the opposite: hides visually with clip and 1px size, but keeps it in the tree, for text only assistive technologies need, like an icon button's name. You don't use `display: none` for that because it would also remove it from the tree. The newer `inert` attribute removes an entire subtree from interaction and the accessibility tree, useful for content behind a modal.",
  },
  {
    nivel: 3,
    pregunta:
      "Tenés que construir un componente de tabs. ¿Qué implica hacerlo accesible según el patrón de ARIA?",
    respuestaEs:
      "No hay un elemento nativo, así que es un caso legítimo de ARIA y hay que implementar el patrón completo de la ARIA Authoring Practices Guide. Roles: un contenedor `role=\"tablist\"`, cada pestaña `role=\"tab\"` con `aria-selected` y `aria-controls` apuntando a su panel, y cada panel `role=\"tabpanel\"` con `aria-labelledby` apuntando a su pestaña. Teclado: la tablist es UNA sola parada de Tab (roving tabindex: la pestaña activa tiene `tabIndex=0` y las demás `-1`), las flechas mueven entre pestañas, Home y End van a la primera y la última, y Tab sale de la tablist hacia el panel. Hay una decisión de diseño: activación automática (la flecha ya cambia de panel) o manual (la flecha mueve el foco y Enter activa); la manual es mejor si cargar un panel es costoso. Por esto, en producción suele convenir una librería headless probada en vez de reimplementarlo.",
    respuestaEn:
      "There's no native element, so it's a legitimate ARIA case and you implement the full pattern from the ARIA Authoring Practices Guide. Roles: a `role=\"tablist\"` container, each tab `role=\"tab\"` with `aria-selected` and `aria-controls` pointing to its panel, and each panel `role=\"tabpanel\"` with `aria-labelledby` pointing to its tab. Keyboard: the tablist is a SINGLE Tab stop (roving tabindex: the active tab has `tabIndex=0` and the rest `-1`), arrows move between tabs, Home and End go to the first and last, and Tab leaves the tablist toward the panel. There's a design decision: automatic activation (the arrow already switches panel) or manual (the arrow moves focus and Enter activates); manual is better when loading a panel is expensive. That's why in production a proven headless library is usually preferable to reimplementing it.",
    repregunta: "¿Por qué la tablist es una sola parada de Tab y no una por pestaña?",
    respuestaRepreguntaEs:
      "Porque un widget compuesto se comporta como un solo control: si cada pestaña fuera una parada de Tab, un usuario de teclado tendría que atravesar todas para llegar al contenido, igual que si un grupo de radio buttons pidiera un Tab por opción. La convención de la plataforma es Tab para moverse ENTRE controles y flechas para moverse DENTRO de un control compuesto. El roving tabindex implementa eso: solo un elemento del grupo es tabulable a la vez, y las flechas mueven cuál es.",
    respuestaRepreguntaEn:
      "Because a composite widget behaves as a single control: if every tab were a Tab stop, a keyboard user would have to go through all of them to reach the content, like a radio group requiring one Tab per option. The platform convention is Tab to move BETWEEN controls and arrows to move WITHIN a composite control. Roving tabindex implements that: only one element in the group is tabbable at a time, and arrows move which one it is.",
  },
];
