import type { PreguntaEntrevista } from "../types";

export const entrevistaMemoization: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa establecer un 'límite de memoización' (memoization boundary) en un árbol de componentes?",
    respuestaEs:
      "Envolver un componente en React.memo crea un punto donde React deja de propagar automáticamente el re-render de un padre hacia ese subárbol: si las props que recibe ese componente memoizado no cambiaron de referencia, React se salta por completo el re-render de él y de todos sus hijos. Sin ningún límite de memoización, el comportamiento por defecto de React es que CUALQUIER re-render de un componente re-renderiza también a todos sus descendientes, sin importar si sus props cambiaron — memo es la herramienta para cortar esa propagación en un punto específico del árbol.",
    respuestaEn:
      "Wrapping a component in React.memo creates a point where React stops automatically propagating a parent's re-render into that subtree: if the props that memoized component receives didn't change reference, React completely skips re-rendering it and all its children. With no memoization boundary at all, React's default behavior is that ANY re-render of a component also re-renders all its descendants, regardless of whether their props changed — memo is the tool to cut that propagation at a specific point in the tree.",
    codigo: `function Padre({ contador }) {
  return (
    <div>
      <p>{contador}</p>
      <ListaCostosa items={items} /> {/* sin memo: re-renderiza en cada cambio de contador */}
    </div>
  );
}

const ListaCostosa = React.memo(function ListaCostosa({ items }) {
  // con memo: no re-renderiza si "items" mantiene la misma referencia
});`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué no envolverías todos los componentes de la app en React.memo por costumbre?",
    respuestaEs:
      "Cada componente memoizado tiene un costo propio: React tiene que guardar las props del render anterior y compararlas contra las nuevas en cada actualización, aunque el resultado sea 'sí, hay que re-renderizar'. Para componentes muy baratos de renderizar (un span con texto, un ícono), ese costo de comparación puede ser igual o mayor que simplemente dejar que se re-rendericen sin memo. La memoización rinde donde el COSTO DE RENDERIZAR es alto (listas grandes, cálculos pesados dentro del componente), no en cualquier lugar por sistema.",
    respuestaEn:
      "Every memoized component has its own cost: React has to store the previous render's props and compare them against the new ones on every update, even when the result is 'yes, re-render anyway'. For very cheap-to-render components (a span with text, an icon), that comparison cost can be equal to or greater than just letting it re-render without memo. Memoization pays off where the COST OF RENDERING is high (large lists, expensive computations inside the component), not everywhere by default.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué colocar un límite de memoización 'demasiado alto' en el árbol a veces no evita los re-renders que se buscaba evitar?",
    respuestaEs:
      "Si se envuelve en memo un componente contenedor grande que a su vez recibe children como JSX creado en el padre (no como children pasados literalmente sin cambiar), ese JSX se sigue creando de nuevo en cada render del padre — memo compara las props recibidas, y si una de esas props (incluido children) es un elemento recién creado, la comparación superficial sigue detectando un cambio. El límite de memoización tiene que colocarse en el nivel donde las props que realmente importan pueden mantenerse estables entre renders, no simplemente en el componente más 'grande' o más externo del árbol.",
    respuestaEn:
      "If you wrap a large container component in memo that in turn receives children as JSX created in the parent (not as children passed literally without changing), that JSX still gets recreated on every parent render — memo compares the received props, and if one of them (including children) is a freshly created element, the shallow comparison still detects a change. The memoization boundary needs to be placed at the level where the props that actually matter can be kept stable between renders, not simply at the 'biggest' or most outer component in the tree.",
    codigo: `const Contenedor = React.memo(function Contenedor({ children }) {
  return <div className="panel">{children}</div>;
});

function App() {
  const [contador, setContador] = useState(0);
  // children es JSX nuevo en cada render de App: memo de Contenedor no ayuda acá
  return <Contenedor>{contador % 2 === 0 ? <ListaA /> : <ListaB />}</Contenedor>;
}`,
    tradeoffs:
      "Un límite bien ubicado corta la propagación de re-renders exactamente donde el costo real está; uno mal ubicado agrega el overhead de comparación de memo sin lograr evitar el trabajo que se quería evitar.",
    repregunta:
      "Antes de agregar memoización en algún lugar, ¿cómo confirmarías que ese componente realmente tiene un costo de render alto, en vez de adivinarlo?",
    respuestaRepreguntaEs:
      "Con el Profiler de React DevTools: se graba una interacción (por ejemplo, escribir en un input que dispara re-renders de una lista), y el Profiler muestra cuánto tiempo tomó renderizar cada componente en esa actualización, junto con cuántas veces re-renderizó. Esto reemplaza la intuición ('esto parece que debería ser costoso') con datos concretos ('este componente tardó 40ms en renderizar 50 veces durante esta interacción') — memoizar sin medir primero es común terminar optimizando un componente que en realidad no era el cuello de botella real.",
    respuestaRepreguntaEn:
      "With the React DevTools Profiler: you record an interaction (e.g. typing in an input that triggers a list's re-renders), and the Profiler shows how long it took to render each component in that update, along with how many times it re-rendered. This replaces intuition ('this seems like it should be expensive') with concrete data ('this component took 40ms to render 50 times during this interaction') — memoizing without measuring first commonly ends up optimizing a component that wasn't actually the real bottleneck.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué alternativa a la memoización manual existe para el problema de re-renders innecesarios, y cómo cambia la estrategia general de dónde poner límites de memoización?",
    respuestaEs:
      "El React Compiler analiza el código en tiempo de compilación y puede insertar automáticamente memo/useMemo/useCallback donde detecta que es seguro y útil, sin que el desarrollador decida manualmente dónde colocar cada límite. Esto no elimina la necesidad de entender el concepto (sigue siendo necesario para diagnosticar casos donde el compilador no puede garantizar seguridad, o para código que todavía no lo adoptó), pero cambia el foco de la estrategia: en vez de razonar activamente sobre '¿dónde pongo memo?', el trabajo pasa a ser escribir componentes que respeten las reglas de React de forma estricta, para que el compilador pueda memoizar con confianza en todos los puntos donde tenga sentido, potencialmente con más granularidad de la que un desarrollador colocaría a mano.",
    respuestaEn:
      "The React Compiler analyzes code at compile time and can automatically insert memo/useMemo/useCallback where it detects it's safe and useful, without the developer manually deciding where to place each boundary. This doesn't eliminate the need to understand the concept (it's still needed to diagnose cases where the compiler can't guarantee safety, or for code that hasn't adopted it yet), but it shifts the strategy's focus: instead of actively reasoning about 'where do I put memo?', the work becomes writing components that strictly follow React's rules, so the compiler can memoize confidently at every point where it makes sense, potentially with more granularity than a developer would place by hand.",
    repregunta:
      "Para una lista de miles de elementos, ¿la memoización de cada item es suficiente, o hace falta una técnica distinta?",
    respuestaRepreguntaEs:
      "Memoizar cada item evita RE-RENDERIZAR items que no cambiaron, pero no evita que React tenga que mantener, en el árbol de Fiber, un nodo por cada uno de los miles de items — ni que el navegador tenga que sostener miles de nodos reales en el DOM, con el costo de memoria y de cálculo de layout que eso implica, incluso si esos nodos nunca vuelven a re-renderizar. Para ese problema (no de re-render, sino de CANTIDAD de nodos existentes) la técnica correcta es virtualización/windowing: renderizar en el DOM real solo los ítems visibles en el viewport en un momento dado, sin importar cuántos haya en total en los datos — un problema distinto al que memo resuelve, que necesita una herramienta distinta.",
    respuestaRepreguntaEn:
      "Memoizing each item avoids RE-RENDERING items that didn't change, but doesn't prevent React from having to maintain, in the Fiber tree, one node for each of the thousands of items — nor the browser from having to hold thousands of real nodes in the DOM, with the memory and layout-calculation cost that implies, even if those nodes never re-render again. For that problem (not re-rendering, but the SHEER NUMBER of existing nodes), the right technique is virtualization/windowing: rendering in the real DOM only the items visible in the viewport at a given moment, regardless of how many there are in total in the data — a different problem than what memo solves, needing a different tool.",
  },
];
