import type { PreguntaEntrevista } from "../types";

export const entrevistaRender: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa concretamente que React 'renderice' un componente?",
    respuestaEs:
      "Que React llama a la función del componente. Esa llamada devuelve JSX, que son objetos JavaScript describiendo qué debería verse — no HTML, no una actualización del DOM. El DOM real recién se toca después, en la fase de Commit, y solo si Reconciliation determinó que algo realmente cambió.",
    respuestaEn:
      "That React calls the component's function. That call returns JSX, which are JavaScript objects describing what should be shown — not HTML, not a DOM update. The real DOM is only touched later, during the Commit phase, and only if Reconciliation determined something actually changed.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué evitarías hacer un fetch directamente en el cuerpo de un componente?",
    respuestaEs:
      "Porque el cuerpo de un componente debe ser puro: React puede llamarlo más de una vez para el mismo resultado final (Strict Mode en desarrollo lo hace a propósito, y el renderizado concurrente puede pausar o descartar un render). Un fetch ahí adentro se dispararía de más, sin control, cada vez que React decide re-ejecutar la función. El lugar correcto es un useEffect, que corre después del commit, una vez por actualización real.",
    respuestaEn:
      "Because a component's body must be pure: React can call it more than once for the same final result (Strict Mode does this on purpose in development, and concurrent rendering can pause or discard a render). A fetch in there would fire excessively, uncontrolled, every time React decides to re-run the function. The correct place is a useEffect, which runs after commit, once per real update.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuáles son las únicas cosas que realmente disparan un render de un componente?",
    respuestaEs:
      "Cuatro: el montaje inicial del componente, una actualización de estado propio (setState), un re-render del componente padre (que por default re-renderiza también a los hijos, sin importar props), o un cambio en un Context que el componente consume. Mutar una ref, o simplemente llamar a una función normal dentro del componente, NO dispara un render por sí solo — solo lo hace si esa función termina llamando a alguna de las cuatro cosas anteriores.",
    respuestaEn:
      "Four things: the component's initial mount, its own state update (setState), a parent component re-rendering (which by default also re-renders children, regardless of props), or a change in a Context the component consumes. Mutating a ref, or simply calling a regular function inside the component, does NOT trigger a render by itself — it only does if that function ends up triggering one of the four things above.",
    codigo: `function Componente() {
  const ref = useRef(0);
  ref.current++; // NO dispara render

  function calcular() {
    return ref.current * 2; // llamarla tampoco dispara render
  }

  return <p>{calcular()}</p>;
}`,
    tradeoffs:
      "Conocer exactamente qué dispara un render ayuda a diagnosticar renders 'misteriosos': casi siempre son alguno de los cuatro triggers, nunca magia — si algo re-renderiza sin que ninguno de los cuatro haya ocurrido, hay que revisar si un padre está renderizando por otra razón.",
    repregunta:
      "¿Qué arquitectura interna de React hace posible que un render se pueda pausar o descartar a mitad de camino?",
    respuestaRepreguntaEs:
      "React Fiber: en vez de recorrer el árbol de componentes con la pila de llamadas normal de JavaScript (que no se puede pausar desde afuera), React arma su propia estructura de datos en forma de árbol enlazado (cada Fiber representa una unidad de trabajo, con punteros a su padre, hijo y hermano). Esto le permite a React procesar el árbol de a pedazos, ceder el control al navegador entre unidades de trabajo si hace falta atender algo más urgente (como un input del usuario), y retomar exactamente donde había quedado — o directamente descartar el trabajo en progreso si ya no es necesario. Es la base técnica que habilita el renderizado concurrente.",
    respuestaRepreguntaEn:
      "React Fiber: instead of walking the component tree with JavaScript's normal call stack (which can't be paused from outside), React builds its own linked tree data structure (each Fiber represents a unit of work, with pointers to its parent, child, and sibling). This lets React process the tree in chunks, yield control back to the browser between units of work if something more urgent needs attention (like a user input), and resume exactly where it left off — or simply discard the work in progress if it's no longer needed. It's the technical foundation that enables concurrent rendering.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué React Strict Mode llama a los componentes dos veces en desarrollo, y qué implica para el código que escribís?",
    respuestaEs:
      "Es una herramienta deliberada de detección de bugs: si el cuerpo de un componente (o ciertos hooks) no es puro, llamarlo dos veces seguidas produce resultados distintos o efectos duplicados, exponiendo el problema temprano en desarrollo en vez de que aparezca de forma intermitente y difícil de reproducir en producción bajo renderizado concurrente real. Implica que cualquier código que dependa de ejecutarse 'exactamente una vez' en el cuerpo del componente (contadores globales, IDs generados ahí mismo, side effects) va a mostrar el bug inmediatamente en desarrollo — la solución no es 'ignorar Strict Mode', sino mover ese código a un lugar que sí garantice ejecutarse una sola vez por actualización real, como useEffect o fuera del componente por completo.",
    respuestaEn:
      "It's a deliberate bug-detection tool: if a component's body (or certain hooks) isn't pure, calling it twice in a row produces different results or duplicated effects, exposing the problem early in development instead of it showing up intermittently and hard to reproduce in production under real concurrent rendering. It means any code that depends on running 'exactly once' in the component body (global counters, IDs generated right there, side effects) will show the bug immediately in development — the fix isn't 'ignore Strict Mode', but moving that code somewhere that does guarantee running once per real update, like useEffect or outside the component entirely.",
    codigo: `let contador = 0;

function Componente() {
  contador++; // en Strict Mode, salta de 2 en 2 por cada actualización real
  return <p>{contador}</p>;
}`,
    repregunta:
      "¿Es válido llamar a setState directamente dentro del cuerpo de un componente, durante el render?",
    respuestaRepreguntaEs:
      "En un caso muy específico sí, y es un patrón documentado oficialmente: calcular 'estado derivado' comparando una prop con un valor guardado en una ref o en otro estado, y llamar a setState condicionalmente ahí mismo si detectás que cambió, ANTES de que el componente termine de renderizar (por ejemplo, para resetear un estado interno cuando cambia un id recibido por props, sin usar un useEffect). React detecta ese setState durante el render y, si realmente cambia el estado, descarta el render actual y vuelve a ejecutar la función inmediatamente con el estado nuevo, sin llegar a pintar la versión intermedia. Es un patrón de nicho — la gran mayoría de los casos de 'sincronizar estado' se resuelven mejor calculando el valor directamente en el render, no con este mecanismo.",
    respuestaRepreguntaEn:
      "In one very specific case, yes, and it's an officially documented pattern: computing 'derived state' by comparing a prop against a value stored in a ref or another piece of state, and calling setState conditionally right there if you detect it changed, BEFORE the component finishes rendering (e.g. to reset internal state when an id received via props changes, without using a useEffect). React detects that setState during render and, if it actually changes the state, discards the current render and re-runs the function immediately with the new state, without ever painting the intermediate version. It's a niche pattern — most 'syncing state' cases are better solved by computing the value directly during render, not with this mechanism.",
    codigoRepregunta: `function Lista({ items }) {
  const [itemsPrevios, setItemsPrevios] = useState(items);
  const [seleccion, setSeleccion] = useState(null);

  if (items !== itemsPrevios) {
    setItemsPrevios(items);
    setSeleccion(null); // reset condicional, DURANTE el render, sin useEffect
  }
}`,
  },
];
