import type { PreguntaEntrevista } from "../types";

export const entrevistaUseReducer: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es useReducer, y en qué se parece a lo que ya se hace con .reduce() en arrays?",
    respuestaEs:
      "useReducer maneja estado a través de una función pura llamada 'reducer': recibe el estado ACTUAL y una 'acción' (un objeto que describe qué pasó), y devuelve el NUEVO estado, sin mutar el anterior. Es la misma idea que `array.reduce((acumulado, item) => nuevoAcumulado, inicial)`, aplicada a actualizaciones de estado en vez de a una lista: en vez de llamar directamente a un setter con el valor nuevo, se hace `dispatch({ tipo: 'incrementar' })`, y el reducer decide qué hacer con esa acción para calcular el estado siguiente.",
    respuestaEn:
      "useReducer manages state through a pure function called a 'reducer': it receives the CURRENT state and an 'action' (an object describing what happened), and returns the NEW state, without mutating the previous one. It's the same idea as `array.reduce((accumulated, item) => newAccumulated, initial)`, applied to state updates instead of a list: instead of calling a setter directly with the new value, you do `dispatch({ type: 'increment' })`, and the reducer decides what to do with that action to compute the next state.",
    codigo: `function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'incrementar': return estado + 1;
    case 'decrementar': return estado - 1;
    default: return estado;
  }
}

const [contador, dispatch] = useReducer(reducer, 0);
dispatch({ tipo: 'incrementar' }); // contador pasa a 1`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo elegirías useReducer en vez de varios useState sueltos?",
    respuestaEs:
      "Cuando hay varias piezas de estado relacionadas que cambian juntas según distintas acciones — un formulario con varios pasos, un estado de UI con transiciones tipo idle/cargando/éxito/error con distintos payloads. Con useState disperso, la lógica de mantener sincronizadas esas piezas queda repartida en varios handlers; useReducer la centraliza en una sola función, fácil de testear de forma aislada sin renderizar ningún componente, solo llamándola directamente con distintos estados y acciones.",
    respuestaEn:
      "When there are several related pieces of state that change together based on different actions — a multi-step form, a UI state with idle/loading/success/error transitions with different payloads. With scattered useState, the logic to keep those pieces in sync ends up spread across several handlers; useReducer centralizes it into a single function, easy to test in isolation without rendering any component, just calling it directly with different states and actions.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué el reducer tiene que ser una función pura, sin efectos secundarios (fetch, mutaciones, console.log incluso)?",
    respuestaEs:
      "Porque React puede llamar al reducer más de una vez para la misma actualización en ciertos escenarios (de forma similar a por qué el cuerpo de un componente debe ser puro): por ejemplo, en Strict Mode, React invoca el reducer dos veces en desarrollo para ayudar a detectar impurezas. Si el reducer hiciera un fetch o mutara algo externo, eso se dispararía dos veces, con efectos duplicados. Además, un reducer puro es trivial de testear: se le pasa un estado y una acción, se compara el resultado con lo esperado, sin mocks ni entorno de renderizado — apenas se agregan efectos secundarios, esa simplicidad de testing desaparece.",
    respuestaEn:
      "Because React can call the reducer more than once for the same update in certain scenarios (similar to why a component's body must be pure): for example, in Strict Mode, React invokes the reducer twice in development to help catch impurities. If the reducer did a fetch or mutated something external, that would fire twice, with duplicated effects. Also, a pure reducer is trivial to test: you pass it a state and an action, compare the result against what's expected, no mocks or rendering environment needed — as soon as side effects are added, that testing simplicity disappears.",
    codigo: `// mal: efecto secundario dentro del reducer
function reducer(estado, accion) {
  if (accion.tipo === 'guardar') {
    fetch('/api/guardar', { method: 'POST', body: JSON.stringify(estado) }); // ⚠️
    return estado;
  }
}

// bien: el reducer solo calcula estado; el efecto va en un useEffect aparte
function reducer(estado, accion) {
  if (accion.tipo === 'marcarParaGuardar') return { ...estado, pendienteGuardar: true };
}`,
    tradeoffs:
      "Mantener el reducer puro obliga a mover cualquier lógica async (fetch, timers) a un useEffect que reacciona al estado resultante, agregando una capa de indirección — pero a cambio se gana testabilidad total y previsibilidad frente a Strict Mode y futuras optimizaciones de React.",
    repregunta:
      "¿Cómo estructurarías las acciones cuando el reducer maneja una lógica de negocio con muchos casos posibles (como un carrito de compras)?",
    respuestaRepreguntaEs:
      "Con un discriminated union de TypeScript para el tipo de las acciones (`{ tipo: 'agregar'; item } | { tipo: 'quitar'; id } | { tipo: 'vaciar' }`), igual que se modelan estados de UI — así el switch del reducer puede usar exhaustiveness checking con never en el default, y el compilador avisa si se agrega un caso nuevo al union sin manejarlo en el reducer. Además, cada acción trae solo el payload que necesita su caso puntual, evitando un objeto de acción genérico con campos opcionales que no siempre aplican.",
    respuestaRepreguntaEn:
      "With a TypeScript discriminated union for the action type (`{ type: 'add'; item } | { type: 'remove'; id } | { type: 'clear' }`), the same way UI states are modeled — so the reducer's switch can use exhaustiveness checking with never in the default, and the compiler warns if a new case is added to the union without handling it in the reducer. Also, each action carries only the payload its specific case needs, avoiding a generic action object with optional fields that don't always apply.",
    codigoRepregunta: `type AccionCarrito =
  | { tipo: 'agregar'; item: Producto }
  | { tipo: 'quitar'; id: string }
  | { tipo: 'vaciar' };

function reducer(estado: Carrito, accion: AccionCarrito): Carrito {
  switch (accion.tipo) {
    case 'agregar': return { items: [...estado.items, accion.item] };
    case 'quitar': return { items: estado.items.filter((i) => i.id !== accion.id) };
    case 'vaciar': return { items: [] };
  }
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja da el tercer argumento de useReducer (el 'init' function) frente a calcular el estado inicial directamente?",
    respuestaEs:
      "`useReducer(reducer, argumentoInicial, funcionInit)` permite calcular el estado inicial de forma perezosa, igual que el lazy initializer de useState: `funcionInit(argumentoInicial)` solo se ejecuta una vez, en el montaje, en vez de en cada render. Es útil cuando el estado inicial depende de props (por ejemplo, inicializar un formulario con datos que vienen de afuera) y ese cálculo es no trivial — separa la lógica de inicialización del reducer, permitiendo además reusar esa misma función de init para resetear el estado a su forma inicial en una acción de 'reset', sin duplicar la lógica.",
    respuestaEn:
      "`useReducer(reducer, initialArg, init)` lets you compute the initial state lazily, just like useState's lazy initializer: `init(initialArg)` only runs once, at mount, instead of on every render. It's useful when the initial state depends on props (e.g. initializing a form with data coming from outside) and that computation is non-trivial — it separates initialization logic from the reducer, also allowing that same init function to be reused to reset state back to its initial shape on a 'reset' action, without duplicating logic.",
    codigo: `function init(datosIniciales) {
  return { valores: datosIniciales, errores: {}, enviando: false };
}

function reducer(estado, accion) {
  if (accion.tipo === 'reset') return init(accion.datosIniciales); // reusa el init
  // ...
}

const [estado, dispatch] = useReducer(reducer, datosIniciales, init);`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo se relaciona internamente useReducer con useState, y por qué React los implementa con el mismo mecanismo de fondo?",
    respuestaEs:
      "Internamente, useState está implementado sobre el mismo mecanismo que useReducer: `useState(inicial)` es, conceptualmente, `useReducer(reducerBasico, inicial)`, donde `reducerBasico` es un reducer trivial que simplemente ignora el estado anterior y devuelve la 'acción' recibida como nuevo estado (o la ejecuta si es una función, para soportar la forma funcional del setter). Esto explica por qué ambos comparten las mismas garantías: la identidad de `dispatch` (y del setter de useState) es estable entre renders, ambos participan del mismo sistema de batching, y ambos respetan la misma comparación Object.is para decidir si programar un re-render.",
    respuestaEn:
      "Internally, useState is implemented on top of the same mechanism as useReducer: `useState(initial)` is, conceptually, `useReducer(basicReducer, initial)`, where `basicReducer` is a trivial reducer that simply ignores the previous state and returns the received 'action' as the new state (or calls it if it's a function, to support the setter's functional form). This explains why both share the same guarantees: `dispatch`'s identity (and useState's setter) is stable across renders, both participate in the same batching system, and both follow the same Object.is comparison to decide whether to schedule a re-render.",
    codigo: `// conceptualmente, useState es un caso particular de useReducer
function reducerBasico(estadoAnterior, accion) {
  return typeof accion === 'function' ? accion(estadoAnterior) : accion;
}
// useState(inicial) ≈ useReducer(reducerBasico, inicial)`,
    repregunta:
      "¿Por qué useReducer suele recomendarse sobre Context + useState cuando varios componentes necesitan disparar actualizaciones complejas sobre un mismo estado compartido?",
    respuestaRepreguntaEs:
      "Porque combinar useReducer con Context separa dos responsabilidades que Context + useState sueltos tienden a mezclar: el Context solo necesita distribuir el estado actual y la función `dispatch` (cuya identidad es estable, sin necesitar useCallback), mientras que TODA la lógica de cómo cambia el estado ante cada acción posible queda centralizada y testeable en el reducer, en vez de dispersa en múltiples funciones `set...` pasadas también por Context. Los componentes consumidores solo necesitan saber qué acción disparar (`dispatch({ tipo: '...' })`), no cómo se calcula el resultado — un desacople más limpio que exponer media docena de setters individuales a través del mismo Context.",
    respuestaRepreguntaEn:
      "Because combining useReducer with Context separates two responsibilities that plain Context + useState tend to mix together: the Context only needs to distribute the current state and the `dispatch` function (whose identity is stable, with no need for useCallback), while ALL the logic of how state changes for each possible action stays centralized and testable in the reducer, instead of scattered across multiple `set...` functions also passed through Context. Consuming components only need to know which action to dispatch (`dispatch({ type: '...' })`), not how the result is computed — a cleaner decoupling than exposing half a dozen individual setters through the same Context.",
  },
];
