import type { PreguntaEntrevista } from "../types";

export const entrevistaEstadoContext: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cómo se combina Context con useReducer para armar un store de estado global sin ninguna librería externa?",
    respuestaEs:
      "Context distribuye un valor a cualquier descendiente sin prop drilling; useReducer centraliza la lógica de cómo cambia el estado ante distintas acciones. Combinados, un Provider expone `{ estado, dispatch }` a través de Context, y cualquier componente descendiente puede leer el estado actual con `useContext` y disparar cambios con `dispatch({ tipo: '...' })`, sin que ningún componente intermedio necesite saber que ese estado existe. Es, en esencia, el mismo patrón que implementan por debajo librerías como Redux, armado únicamente con herramientas nativas de React.",
    respuestaEn:
      "Context distributes a value to any descendant without prop drilling; useReducer centralizes the logic of how state changes in response to different actions. Combined, a Provider exposes `{ state, dispatch }` through Context, and any descendant component can read the current state with `useContext` and trigger changes with `dispatch({ type: '...' })`, without any intermediate component needing to know that state exists. It's, in essence, the same pattern libraries like Redux implement underneath, built only with React's native tools.",
    codigo: `const EstadoContext = createContext(null);
const DispatchContext = createContext(null);

function AppProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);
  return (
    <EstadoContext.Provider value={estado}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </EstadoContext.Provider>
  );
}`,
  },
  {
    nivel: 1,
    pregunta:
      "¿Por qué conviene separar el estado y el dispatch en dos Contexts distintos, en vez de uno solo con ambos adentro?",
    respuestaEs:
      "Porque `dispatch` tiene una identidad estable (nunca cambia mientras el componente esté montado), mientras que `estado` cambia constantemente. Si ambos viajan juntos en un mismo Context, cualquier componente que solo necesite `dispatch` para disparar acciones (sin leer el estado actual) igual re-renderiza cada vez que el estado cambia, porque el value combinado del Provider cambió de referencia. Separarlos en dos Contexts permite que un componente que solo dispara acciones se suscriba únicamente al Context de dispatch, sin re-renderizar por cambios de estado que no le importan.",
    respuestaEn:
      "Because `dispatch` has a stable identity (it never changes while the component stays mounted), while `state` changes constantly. If both travel together in the same Context, any component that only needs `dispatch` to trigger actions (without reading the current state) still re-renders every time the state changes, because the Provider's combined value's reference changed. Splitting them into two Contexts lets a component that only dispatches actions subscribe exclusively to the dispatch Context, without re-rendering for state changes it doesn't care about.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo empieza a quedarse corto el patrón Context + useReducer como solución de estado global para toda una app?",
    respuestaEs:
      "Principalmente en tres escenarios: (1) cuando hace falta selección granular del estado — un componente que solo necesita una porción chica de un estado grande igual re-renderiza en cada cambio, porque Context no soporta suscripción parcial nativamente (visto en el módulo de Context de React Core); (2) cuando se necesitan herramientas de debugging avanzadas, como time-travel debugging o inspeccionar el historial completo de acciones despachadas, que Context no ofrece de fábrica; (3) cuando la lógica de estado se vuelve compleja y se necesita middleware (logging, persistencia automática, sincronización con el servidor) de forma reutilizable entre distintos stores. En esos casos, librerías como Zustand o Redux Toolkit resuelven esos problemas con menos código propio que mantener.",
    respuestaEn:
      "Mainly in three scenarios: (1) when granular state selection is needed — a component that only needs a small slice of a large state still re-renders on every change, because Context doesn't support partial subscription natively (seen in React Core's Context module); (2) when advanced debugging tools are needed, like time-travel debugging or inspecting the full history of dispatched actions, which Context doesn't offer out of the box; (3) when state logic gets complex and reusable middleware is needed (logging, automatic persistence, syncing with the server) across different stores. In those cases, libraries like Zustand or Redux Toolkit solve those problems with less custom code to maintain.",
    tradeoffs:
      "Context + useReducer: cero dependencias extra, control total, pero sin selección granular ni devtools avanzadas de fábrica. Una librería dedicada: resuelve esos problemas de entrada, a cambio de una dependencia más y una API propia que aprender.",
    repregunta:
      "¿Cómo implementarías un 'middleware' simple de logging para este patrón, sin ninguna librería externa?",
    respuestaRepreguntaEs:
      "Envolviendo el dispatch real en una función que loguea antes de llamarlo: en vez de exponer el dispatch crudo de useReducer por Context, se expone una versión envuelta que registra la acción (y opcionalmente el estado antes/después) y luego delega al dispatch original. Es un patrón manual y limitado (no compone tan fácilmente como el sistema de middleware de Redux, que encadena varias funciones de este tipo de forma configurable), pero cubre el caso simple de querer ver en consola cada acción despachada durante desarrollo.",
    respuestaRepreguntaEn:
      "By wrapping the real dispatch in a function that logs before calling it: instead of exposing useReducer's raw dispatch through Context, you expose a wrapped version that records the action (and optionally the before/after state) and then delegates to the original dispatch. It's a manual and limited pattern (it doesn't compose as easily as Redux's middleware system, which chains several functions of this kind in a configurable way), but it covers the simple case of wanting to see every dispatched action in the console during development.",
    codigoRepregunta: `function AppProvider({ children }) {
  const [estado, dispatchReal] = useReducer(reducer, estadoInicial);

  const dispatch = (accion) => {
    console.log('accion:', accion, 'estado antes:', estado);
    dispatchReal(accion);
  };

  return (
    <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
  );
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo se relaciona el problema de tearing (visto en Concurrent Rendering) con elegir Context + useReducer como store global bajo React 18+?",
    respuestaEs:
      "El estado de useReducer, al ser estado nativo de React (no un store externo mutable), NO tiene el problema de tearing que sí tienen los stores externos leídos directamente — React garantiza consistencia interna para su propio estado durante un render concurrente. Por eso Context + useReducer sigue siendo una opción 'segura' bajo renderizado concurrente sin necesitar useSyncExternalStore: el estado vive dentro del sistema de estado de React, no afuera. Esto es justamente lo que distingue a este patrón de intentar usar, por ejemplo, una variable global mutable con un sistema de suscripción manual como store — ESE patrón sí necesitaría useSyncExternalStore para ser seguro bajo concurrencia.",
    respuestaEn:
      "useReducer's state, being native React state (not an external mutable store), does NOT have the tearing problem that stores read directly do — React guarantees internal consistency for its own state during a concurrent render. That's why Context + useReducer remains a 'safe' option under concurrent rendering without needing useSyncExternalStore: the state lives inside React's own state system, not outside it. This is precisely what distinguishes this pattern from trying to use, say, a mutable global variable with a manual subscription system as a store — THAT pattern would need useSyncExternalStore to be safe under concurrency.",
    repregunta:
      "Entonces, ¿por qué librerías como Zustand igual usan useSyncExternalStore por debajo, si el problema de tearing no aplica a Context + useReducer?",
    respuestaRepreguntaEs:
      "Porque Zustand (y librerías similares) NO guardan su estado dentro del sistema de estado de React — lo guardan en un store completamente externo (un objeto plano, actualizado fuera del ciclo de render), precisamente para lograr la suscripción granular que Context no ofrece nativamente. Al ser un store externo mutable, SÍ está expuesto al problema de tearing bajo renderizado concurrente, y por eso necesita useSyncExternalStore para leerlo de forma segura. Es la contracara del trade-off: Context + useReducer evita el problema de tearing por estar 'adentro' de React, pero paga el costo de no tener selección granular; un store externo como el de Zustand logra la selección granular, pero necesita resolver el tearing explícitamente con useSyncExternalStore.",
    respuestaRepreguntaEn:
      "Because Zustand (and similar libraries) do NOT keep their state inside React's own state system — they keep it in a completely external store (a plain object, updated outside the render cycle), precisely to achieve the granular subscription Context doesn't offer natively. Being an external mutable store, it IS exposed to the tearing problem under concurrent rendering, and that's why it needs useSyncExternalStore to read it safely. It's the flip side of the trade-off: Context + useReducer avoids the tearing problem by being 'inside' React, but pays the cost of no granular selection; an external store like Zustand's achieves granular selection, but needs to explicitly solve tearing with useSyncExternalStore.",
  },
];
