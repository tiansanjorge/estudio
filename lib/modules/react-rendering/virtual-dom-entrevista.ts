import type { PreguntaEntrevista } from "../types";

export const entrevistaVirtualDom: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es literalmente un elemento de React, lo que devuelve React.createElement?",
    respuestaEs:
      "Un objeto JavaScript plano, con un `type` (el nombre del tag o el componente) y unas `props`. No es un nodo del DOM ni sabe nada del navegador — es pura información describiendo qué debería mostrarse. Un árbol de esos objetos es, literalmente, lo que se conoce como 'Virtual DOM': no es una tecnología aparte, es el mismo árbol de elementos que ya se produce en cada render.",
    respuestaEn:
      "A plain JavaScript object, with a `type` (the tag name or the component) and some `props`. It's not a DOM node and knows nothing about the browser — it's pure information describing what should be shown. A tree of those objects is, literally, what's known as the 'Virtual DOM': it's not a separate technology, it's the same element tree already produced on every render.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿es cierto que 'React es rápido porque usa Virtual DOM'?",
    respuestaEs:
      "Es una simplificación excesiva. Código vanilla optimizado a mano manipulando el DOM directamente puede ganarle en benchmarks puntuales — el Virtual DOM no es magia que garantice velocidad. Su valor real es otro: permite escribir 'así debería verse la UI' de forma declarativa, sin tener que programar a mano cada mutación imperativa, manteniendo un rendimiento razonable porque comparar objetos JS livianos es mucho más barato que tocar el DOM real de más.",
    respuestaEn:
      "It's an oversimplification. Hand-optimized vanilla code manipulating the DOM directly can beat it in specific benchmarks — the Virtual DOM isn't magic that guarantees speed. Its real value is different: it lets you write 'this is what the UI should look like' declaratively, without hand-coding every imperative DOM mutation, while keeping reasonable performance because comparing lightweight JS objects is much cheaper than touching the real DOM excessively.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Crear el árbol de elementos de React en cada render es literalmente gratis, sin ningún costo?",
    respuestaEs:
      "No es gratis, es barato comparado con tocar el DOM real — pero para árboles muy grandes o profundamente anidados, armar ese árbol de objetos en cada render sí tiene un costo medible, sobre todo si el mismo padre re-renderiza a hijos que no necesitaban recalcular nada. Por eso React.memo tiene un efecto real más allá de evitar mutaciones del DOM: evita directamente volver a ejecutar la función del componente y volver a crear su porción del árbol de elementos, ahorrando también ese costo de creación de objetos, no solo el de diffing o de mutación del DOM.",
    respuestaEn:
      "It's not free, it's cheap compared to touching the real DOM — but for very large or deeply nested trees, building that object tree on every render does have a measurable cost, especially if the same parent re-renders children that didn't need to recompute anything. That's why React.memo has a real effect beyond avoiding DOM mutations: it directly avoids re-running the component's function and re-creating its portion of the element tree, saving that object-creation cost too, not just the diffing or DOM mutation cost.",
    codigo: `// sin memo: cada render de Padre recrea todo el subárbol de elementos de Hijo,
// aunque Hijo termine mostrando exactamente lo mismo
function Padre() {
  return <Hijo dato="fijo" />;
}

const HijoMemo = React.memo(Hijo); // evita recrear y re-ejecutar si las props no cambiaron`,
    tradeoffs:
      "El costo de crear objetos JS es órdenes de magnitud menor que el de mutar el DOM, pero no es cero — en árboles grandes con muchos re-renders innecesarios, ese costo acumulado sí se nota, y ahí memoización tiene un beneficio real más allá de lo cosmético.",
    repregunta:
      "¿Cómo se comparan frameworks como Solid o Svelte, que evitan el Virtual DOM por completo, con el enfoque de React?",
    respuestaRepreguntaEs:
      "Usan 'reactividad de grano fino' (fine-grained reactivity): en vez de volver a ejecutar toda la función de un componente en cada actualización y diffear el resultado contra el anterior, el compilador de estos frameworks analiza de antemano exactamente qué nodo del DOM depende de qué pieza de estado, y genera código que actualiza ESE nodo puntual directamente cuando ese estado cambia — sin re-ejecutar ninguna función de componente ni crear ningún árbol de objetos intermedio para comparar. El trade-off es distinto: menos overhead por actualización (no hay diffing ni creación de árboles), a cambio de un modelo mental diferente (los 'componentes' no se vuelven a llamar como funciones en cada render, corren una sola vez para configurar esas dependencias reactivas) y de depender más fuertemente de un paso de compilación inteligente.",
    respuestaRepreguntaEn:
      "They use 'fine-grained reactivity': instead of re-running a component's whole function on every update and diffing the result against the previous one, these frameworks' compiler figures out ahead of time exactly which DOM node depends on which piece of state, and generates code that updates THAT specific node directly when that state changes — without re-running any component function or creating any intermediate object tree to compare. The trade-off is different: less overhead per update (no diffing, no tree creation), in exchange for a different mental model (‘components' aren't called again as functions on every render, they run once to set up those reactive dependencies) and a stronger reliance on a smart compilation step.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué los elementos de React tienen una propiedad interna $$typeof con un Symbol, y qué vulnerabilidad de seguridad previene específicamente?",
    respuestaEs:
      "Cada elemento de React lleva internamente `$$typeof: Symbol.for('react.element')`. Esto existe como defensa contra un vector de XSS específico: si una API devuelve datos que un atacante controla parcialmente, y esos datos se guardan como JSON (por ejemplo, en una base de datos) para renderizarse después, JSON no puede serializar Symbols — así que un objeto malicioso inyectado vía JSON JAMÁS puede tener ese `$$typeof` real, aunque imite la forma exacta de un elemento de React (con `type` y `props`). React chequea esa propiedad antes de tratar algo como un elemento válido, así que ese objeto malicioso inyectado por JSON nunca se interpreta como un componente real a renderizar, cerrando esa puerta de inyección específica.",
    respuestaEn:
      "Every React element internally carries `$$typeof: Symbol.for('react.element')`. This exists as defense against a specific XSS vector: if an API returns data an attacker partially controls, and that data gets stored as JSON (e.g. in a database) to be rendered later, JSON can't serialize Symbols — so a malicious object injected via JSON can NEVER have that real `$$typeof`, even if it mimics the exact shape of a React element (with `type` and `props`). React checks that property before treating something as a valid element, so that maliciously injected JSON object is never interpreted as a real component to render, closing that specific injection door.",
    codigo: `// un atacante podría inyectar esto vía una API/base de datos como JSON:
const objetoMalicioso = { type: 'img', props: { src: 'x', onError: 'alert(1)' } };

// pero JSON.parse nunca puede producir un Symbol real para $$typeof,
// así que React nunca lo trata como un elemento válido para renderizar`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué React no adjunta un listener nativo del DOM a cada elemento que tiene un onClick, y qué tiene que ver esto con el costo del Virtual DOM?",
    respuestaEs:
      "React usa delegación de eventos: en vez de adjuntar un listener nativo a cada nodo individual con un handler, adjunta un único listener en la raíz del árbol (el contenedor donde se montó la app), y cuando un evento burbujea hasta ahí, React determina a qué componente 'pertenece' lógicamente y ejecuta el handler correspondiente desde su propio sistema de eventos sintéticos. Esto reduce drásticamente el costo de crear y destruir nodos del DOM: adjuntar y desmontar cientos de listeners nativos individuales en cada actualización de una lista grande sería mucho más caro que mantener un único listener raíz que nunca cambia, independientemente de cuántos elementos con onClick aparezcan o desaparezcan del árbol.",
    respuestaEn:
      "React uses event delegation: instead of attaching a native listener to each individual node with a handler, it attaches a single listener at the tree's root (the container where the app was mounted), and when an event bubbles up there, React figures out which component it logically 'belongs' to and runs the corresponding handler from its own synthetic event system. This drastically reduces the cost of creating and destroying DOM nodes: attaching and detaching hundreds of individual native listeners on every update of a large list would be much more expensive than keeping a single root listener that never changes, regardless of how many elements with onClick appear or disappear from the tree.",
    repregunta:
      "¿Por qué React 17 cambió el punto donde se adjunta ese listener raíz de document al contenedor de la app?",
    respuestaRepreguntaEs:
      "En versiones anteriores, React adjuntaba su listener delegado directamente en `document`, lo que causaba problemas al integrar múltiples versiones de React en la misma página (por ejemplo, durante una migración gradual): un evento capturado por el listener de una versión de React adjunto a document podía interferir con el de otra versión montada en un contenedor distinto de la misma página. Desde React 17, el listener se adjunta al contenedor raíz de CADA árbol de React (el nodo que se le pasa a ReactDOM.render/createRoot), no a document — así, múltiples raíces de React, incluso de versiones distintas, pueden convivir en la misma página sin que sus sistemas de eventos delegados se pisen entre sí.",
    respuestaRepreguntaEn:
      "In earlier versions, React attached its delegated listener directly to `document`, which caused problems when integrating multiple React versions on the same page (e.g. during a gradual migration): an event captured by one React version's listener attached to document could interfere with another version's mounted in a different container on the same page. Since React 17, the listener attaches to the root container of EACH React tree (the node passed to ReactDOM.render/createRoot), not to document — so multiple React roots, even from different versions, can coexist on the same page without their delegated event systems stepping on each other.",
  },
];
