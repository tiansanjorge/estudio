import type { PreguntaEntrevista } from "../types";

export const entrevistaPortals: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace createPortal y qué problema resuelve?",
    respuestaEs:
      "`ReactDOM.createPortal(children, domNode)` renderiza `children` dentro de un nodo del DOM distinto al del componente padre, aunque en el árbol de React siga siendo un hijo normal de ese componente. Resuelve el problema clásico de modales, tooltips y dropdowns anidados dentro de contenedores con `overflow: hidden` o un `z-index` de un stacking context que los recorta o los tapa visualmente — el portal 'escapa' de esa jerarquía del DOM sin romper la jerarquía lógica de React.",
    respuestaEn:
      "`ReactDOM.createPortal(children, domNode)` renders `children` into a different DOM node than the parent component's, while still being a normal child of that component in React's tree. It solves the classic problem of modals, tooltips, and dropdowns nested inside containers with `overflow: hidden` or a stacking context's `z-index` that clips or visually covers them — the portal 'escapes' that DOM hierarchy without breaking React's logical hierarchy.",
    codigo: `function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root'),
  );
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿en qué casos usarías un portal?",
    respuestaEs:
      "Para cualquier UI que necesite renderizarse 'por encima' de todo lo demás sin que el CSS de sus ancestros la corte o la esconda: modales, tooltips, menús desplegables, notificaciones tipo toast. Todos comparten el mismo problema: si se renderizaran en su posición natural del árbol, quedarían atrapados por el overflow o el z-index de algún contenedor padre — el portal los saca de esa jerarquía visual, típicamente montándolos directo en un nodo cerca de la raíz del documento.",
    respuestaEn:
      "For any UI that needs to render 'above' everything else without its ancestors' CSS clipping or hiding it: modals, tooltips, dropdown menus, toast notifications. They all share the same problem: if rendered in their natural tree position, they'd get trapped by some parent container's overflow or z-index — the portal takes them out of that visual hierarchy, typically mounting them directly on a node near the document root.",
  },
  {
    nivel: 2,
    pregunta:
      "Un evento disparado dentro de un portal, ¿burbujea (bubbles) por el árbol del DOM o por el árbol de React?",
    respuestaEs:
      "Por el árbol de React, no por el DOM. Aunque el nodo físico del portal esté en otro lugar del documento HTML, React sigue tratando al contenido del portal como un hijo lógico del componente que lo creó — así que un evento que se dispara adentro del portal sigue burbujeando hacia arriba a través de los componentes ancestros EN JSX, no a través de los ancestros reales en el DOM. Esto significa que un `onClick` en un componente padre (en términos de React) sigue disparándose por un click dentro del portal, aunque el portal esté renderizado en un `<div>` completamente distinto del DOM.",
    respuestaEn:
      "Through React's tree, not the DOM. Even though the portal's physical node sits elsewhere in the HTML document, React still treats the portal's content as a logical child of the component that created it — so an event fired inside the portal still bubbles up through the ancestor components IN JSX, not through the real DOM ancestors. This means an `onClick` on a parent component (in React terms) still fires for a click inside the portal, even though the portal is rendered in a completely different `<div>` in the DOM.",
    codigo: `function App() {
  return (
    <div onClick={() => console.log('capturado')}>
      <Modal>
        <button>Click acá</button> {/* dispara "capturado" al burbujear por React */}
      </Modal>
    </div>
  );
}
// aunque Modal renderiza su contenido en otro <div> del DOM,
// el evento sigue burbujeando por el árbol de React hasta el div padre`,
    tradeoffs:
      "Este comportamiento es conveniente (podés seguir manejando eventos del portal 'desde afuera' sin lógica especial), pero puede sorprender si esperás que un stopPropagation a nivel DOM (por ejemplo, en un listener nativo agregado con addEventListener fuera de React) detenga algo que en realidad sigue viajando por el árbol de React.",
    repregunta:
      "¿Qué cuidado de accesibilidad hay que tener específicamente porque un portal rompe el orden natural del DOM?",
    respuestaRepreguntaEs:
      "Como el contenido del portal se monta en otro punto del documento, el orden de lectura del DOM (el que siguen lectores de pantalla al navegar con Tab o con teclado) puede no coincidir con el orden lógico/visual que el usuario espera. Para un modal, esto se resuelve con manejo explícito de foco: mover el foco al modal cuando se abre (focus trap, para que Tab no se escape hacia contenido de fondo que visualmente está tapado), marcar el modal con `aria-modal=\"true\"` y `role=\"dialog\"`, y devolver el foco al elemento que abrió el modal cuando se cierra. Nada de esto es automático por usar createPortal — hay que implementarlo a mano o con una librería de UI accesible.",
    respuestaRepreguntaEn:
      "Since the portal's content mounts at a different point in the document, the DOM's reading order (the one screen readers follow when navigating with Tab or the keyboard) might not match the logical/visual order the user expects. For a modal, this is solved with explicit focus management: move focus into the modal when it opens (a focus trap, so Tab doesn't escape to background content that's visually covered), mark the modal with `aria-modal=\"true\"` and `role=\"dialog\"`, and return focus to the element that opened the modal when it closes. None of this is automatic just from using createPortal — it has to be implemented by hand or with an accessible UI library.",
    codigoRepregunta: `function Modal({ onCerrar, children }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus(); // focus trap básico al abrir
    return () => elementoQueAbrio.focus(); // devolver foco al cerrar
  }, []);

  return createPortal(
    <div role="dialog" aria-modal="true" ref={ref} tabIndex={-1}>
      {children}
    </div>,
    document.getElementById('modal-root'),
  );
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué un selector CSS como `.padre > .contenido-modal` no funciona para estilar el contenido de un portal?",
    respuestaEs:
      "Porque ese selector depende de la relación de descendencia REAL en el DOM, y el portal específicamente rompe esa relación: aunque `.contenido-modal` sea un hijo lógico de `.padre` en el árbol de React (y en el JSX), en el DOM real está montado en otro nodo completamente distinto (por ejemplo, directo en el body). CSS no tiene forma de 'ver' la jerarquía de React — solo ve el DOM real, así que cualquier selector que dependa de esa relación padre-hijo visual falla silenciosamente (no aplica ningún estilo, sin error).",
    respuestaEn:
      "Because that selector depends on the REAL descendant relationship in the DOM, and the portal specifically breaks that relationship: even though `.modal-content` is a logical child of `.parent` in React's tree (and in the JSX), in the real DOM it's mounted on a completely different node (e.g. directly on body). CSS has no way to 'see' React's hierarchy — it only sees the real DOM, so any selector depending on that visual parent-child relationship fails silently (no style applies, no error).",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué llamar a createPortal directamente durante el render de un componente puede romper el server-side rendering en Next.js?",
    respuestaEs:
      "`createPortal` necesita un nodo real del DOM (típicamente obtenido con `document.getElementById(...)`), y `document` no existe en el entorno de Node donde corre el server-side rendering — llamarlo directamente durante el render de un Server Component, o incluso en el primer render de un Client Component antes de que el DOM esté disponible, causa un error o un mismatch de hidratación. La solución estándar es renderizar `null` (o un placeholder) hasta que un `useEffect` confirme que el componente ya está montado en el cliente (donde `document` sí existe), y recién ahí crear el portal.",
    respuestaEn:
      "`createPortal` needs a real DOM node (typically obtained with `document.getElementById(...)`), and `document` doesn't exist in the Node environment where server-side rendering runs — calling it directly during a Server Component's render, or even on a Client Component's first render before the DOM is available, causes an error or a hydration mismatch. The standard solution is to render `null` (or a placeholder) until a `useEffect` confirms the component is already mounted on the client (where `document` does exist), and only then create the portal.",
    codigo: `function Modal({ children }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  if (!montado) return null; // evita usar document antes de tener DOM real

  return createPortal(children, document.getElementById('modal-root'));
}`,
    repregunta:
      "Aunque el portal escapa de la jerarquía del DOM para efectos de overflow, ¿puede seguir quedando 'atrapado' visualmente por un z-index de un ancestro?",
    respuestaRepreguntaEs:
      "Sí, y es un gotcha frecuente. Si un ancestro del NODO DESTINO del portal en el DOM (no del componente padre en React, sino de dónde físicamente cuelga el target, típicamente cerca de la raíz) tiene una propiedad CSS que crea su propio 'stacking context' (`transform` distinto de none, `filter`, `will-change`, `opacity` menor a 1, entre otras), ese stacking context puede terminar acotando el z-index de todo lo que esté dentro, incluido el contenido del portal, sin importar qué tan alto sea el z-index que se le puso al modal. El portal resuelve el problema de recorte por `overflow: hidden`, pero NO es inmune a los stacking contexts creados por propiedades CSS de sus ancestros reales en el DOM — hay que revisar toda la cadena de ancestros del nodo destino, no asumir que 'estar cerca de la raíz' es garantía de estar por encima de todo.",
    respuestaRepreguntaEn:
      "Yes, and it's a frequent gotcha. If an ancestor of the portal's TARGET NODE in the DOM (not the React parent component, but wherever the target physically hangs, typically near the root) has a CSS property that creates its own 'stacking context' (`transform` other than none, `filter`, `will-change`, `opacity` less than 1, among others), that stacking context can end up bounding the z-index of everything inside it, including the portal's content, no matter how high the z-index set on the modal is. The portal solves the clipping problem from `overflow: hidden`, but it's NOT immune to stacking contexts created by CSS properties on its real DOM ancestors — you have to check the whole ancestor chain of the target node, not assume 'being close to the root' guarantees being above everything.",
    codigoRepregunta: `/* si algún ancestro del #modal-root tiene esto, crea un stacking context: */
.algun-ancestro-lejano {
  transform: translateZ(0); /* o filter, will-change, opacity < 1 */
}
/* el modal con z-index: 9999 puede quedar igual "por debajo"
   de elementos fuera de ese stacking context */`,
  },
];
