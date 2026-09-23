import type { PreguntaEntrevista } from "../types";

export const entrevistaReduxToolkit: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema del Redux 'clásico' vino a resolver Redux Toolkit (RTK)?",
    respuestaEs:
      "El Redux original requería mucho código repetitivo para cada pedazo de estado: definir constantes de tipos de acción, action creators, un reducer con un switch grande, y combinarlos todos a mano con `combineReducers`. RTK es la forma oficial y recomendada de usar Redux hoy: `createSlice` genera automáticamente los action creators y el reducer a partir de un solo objeto de definiciones, `configureStore` arma el store con buenas prácticas por defecto (Redux DevTools, middleware de detección de mutaciones y de valores no serializables), y usa Immer internamente para permitir escribir 'mutaciones' que en realidad generan actualizaciones inmutables.",
    respuestaEn:
      "Original Redux required a lot of boilerplate for every piece of state: defining action type constants, action creators, a reducer with a big switch, and combining them all by hand with `combineReducers`. RTK is the official, recommended way to use Redux today: `createSlice` automatically generates action creators and the reducer from a single object of definitions, `configureStore` sets up the store with good defaults (Redux DevTools, middleware detecting mutations and non-serializable values), and it uses Immer internally to allow writing 'mutations' that actually produce immutable updates.",
    codigo: `import { createSlice, configureStore } from '@reduxjs/toolkit';

const contadorSlice = createSlice({
  name: 'contador',
  initialState: { valor: 0 },
  reducers: {
    incrementar: (estado) => { estado.valor += 1; }, // "mutación", inmutable por debajo
  },
});

const store = configureStore({ reducer: { contador: contadorSlice.reducer } });
export const { incrementar } = contadorSlice.actions; // action creator generado solo`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cómo se conecta un componente de React al store de Redux Toolkit?",
    respuestaEs:
      "Con los hooks de `react-redux`: `useSelector` para leer una porción del estado (similar en espíritu al selector de Zustand), y `useDispatch` para obtener la función `dispatch` y disparar acciones. Igual que con Context, `useSelector` re-renderiza el componente cuando el resultado del selector cambia entre actualizaciones del store — por eso conviene seleccionar solo lo que el componente realmente necesita, no el estado completo.",
    respuestaEn:
      "With `react-redux`'s hooks: `useSelector` to read a slice of state (similar in spirit to Zustand's selector), and `useDispatch` to get the `dispatch` function and trigger actions. Just like with Context, `useSelector` re-renders the component when the selector's result changes between store updates — that's why you should select only what the component actually needs, not the whole state.",
    codigo: `function Contador() {
  const valor = useSelector((estado) => estado.contador.valor);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(incrementar())}>{valor}</button>;
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo permite RTK escribir código que 'parece' mutar el estado, si Redux exige inmutabilidad estricta?",
    respuestaEs:
      "`createSlice` envuelve cada reducer con Immer por debajo. Immer usa un Proxy que registra qué propiedades del 'borrador' (draft) del estado se modifican dentro de la función, y al final construye un objeto completamente nuevo con esos cambios aplicados de forma inmutable, sin tocar el objeto original — el desarrollador escribe `estado.valor += 1` como si fuera una mutación directa, pero lo que Redux recibe como nuevo estado es un objeto distinto en memoria. Esto solo aplica dentro de los reducers de un slice creado con createSlice; escribir Redux 'a mano' sin RTK sigue exigiendo el patrón de spread manual explícito.",
    respuestaEn:
      "`createSlice` wraps each reducer with Immer underneath. Immer uses a Proxy that tracks which properties of the state 'draft' get modified inside the function, and at the end builds a completely new object with those changes applied immutably, without touching the original object — the developer writes `state.value += 1` as if it were a direct mutation, but what Redux receives as the new state is a different object in memory. This only applies inside reducers created with createSlice; writing Redux 'by hand' without RTK still requires the explicit manual spread pattern.",
    codigo: `// se ve como mutación, pero Immer genera un objeto nuevo por debajo
reducers: {
  agregarItem: (estado, accion) => {
    estado.items.push(accion.payload); // "mutación" segura gracias a Immer
  },
}`,
    tradeoffs:
      "La sintaxis de 'mutación aparente' de Immer hace el código más legible y menos propenso a errores de spread olvidado, pero puede confundir a quien no sabe que hay un Proxy por debajo — es fácil pensar erróneamente que Redux dejó de requerir inmutabilidad.",
    repregunta:
      "¿Qué pasa si dentro de un reducer de createSlice se intenta tanto mutar el draft COMO retornar un nuevo estado explícitamente?",
    respuestaRepreguntaEs:
      "Immer no permite mezclar ambos enfoques dentro del mismo reducer: si la función muta el draft Y ADEMÁS hace un return explícito de algo distinto de undefined, Immer lanza un error en tiempo de ejecución ('An immer producer returned a new value and modified its draft'), porque no puede reconciliar 'aplicá los cambios que detecté en el draft' con 'ignorá todo eso y usá este otro valor que estoy retornando'. La regla es: o se muta el draft sin retornar nada (dejando que la función termine implícitamente con undefined), o se retorna explícitamente un estado nuevo sin tocar el draft en absoluto — nunca ambas cosas en el mismo reducer.",
    respuestaRepreguntaEn:
      "Immer doesn't allow mixing both approaches in the same reducer: if the function mutates the draft AND ALSO does an explicit return of something other than undefined, Immer throws a runtime error ('An immer producer returned a new value and modified its draft'), because it can't reconcile 'apply the changes I detected on the draft' with 'ignore all that and use this other value I'm returning'. The rule is: either mutate the draft without returning anything (letting the function implicitly end with undefined), or explicitly return a new state without touching the draft at all — never both in the same reducer.",
    codigoRepregunta: `// error en runtime: mezcla mutación del draft con un return explícito
reducers: {
  reset: (estado) => {
    estado.valor = 0; // mutación del draft
    return { valor: 0, extra: true }; // Y ADEMÁS un return: Immer lanza error
  },
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo maneja Redux Toolkit la lógica asincrónica, como un fetch, si los reducers deben ser puros y síncronos?",
    respuestaEs:
      "Con `createAsyncThunk`, que genera un 'thunk' (una función async especial) y automáticamente tres tipos de acción asociados: pending (arrancó), fulfilled (resolvió con éxito) y rejected (falló). El componente hace `dispatch(miThunkAsync(argumento))`, y por debajo se despachan esas tres acciones en el momento correspondiente del ciclo de vida de la promesa — el slice solo necesita manejar esos tres casos en su `extraReducers`, sin que ningún reducer individual necesite ser async. Es una forma estandarizada de manejar estados de carga/éxito/error sin escribir esa lógica repetitiva a mano en cada slice.",
    respuestaEn:
      "With `createAsyncThunk`, which generates a 'thunk' (a special async function) and automatically three associated action types: pending (started), fulfilled (resolved successfully) and rejected (failed). The component does `dispatch(myAsyncThunk(argument))`, and underneath those three actions get dispatched at the corresponding point in the promise's lifecycle — the slice only needs to handle those three cases in its `extraReducers`, without any individual reducer needing to be async. It's a standardized way to handle loading/success/error states without writing that repetitive logic by hand in every slice.",
    codigo: `const cargarUsuario = createAsyncThunk('usuario/cargar', async (id) => {
  const res = await fetch(\`/api/usuarios/\${id}\`);
  return res.json();
});

const slice = createSlice({
  name: 'usuario',
  initialState: { datos: null, cargando: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cargarUsuario.pending, (estado) => { estado.cargando = true; })
      .addCase(cargarUsuario.fulfilled, (estado, accion) => {
        estado.cargando = false;
        estado.datos = accion.payload;
      });
  },
});`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué se recomienda normalizar el estado de Redux (guardar entidades por id en un objeto, en vez de arrays anidados) para datos relacionales?",
    respuestaEs:
      "Guardar listas de entidades como arrays anidados (por ejemplo, `pedidos: [{ id, items: [...] }]`) hace que actualizar UN elemento puntual requiera recorrer y reconstruir el array completo, y que buscar un elemento por id sea O(n). Normalizar significa guardar las entidades en un objeto indexado por id (`{ 1: {...}, 2: {...} }`) más un array separado de ids para el orden (`allIds: [1, 2]`) — actualizar una entidad puntual es una operación O(1) sobre esa clave, sin tocar el resto, y buscar por id también es O(1). RTK incluye `createEntityAdapter` específicamente para generar esta estructura normalizada y sus reducers/selectors asociados sin escribirlos a mano.",
    respuestaEn:
      "Storing entity lists as nested arrays (e.g. `orders: [{ id, items: [...] }]`) makes updating ONE specific element require traversing and rebuilding the whole array, and looking up an element by id is O(n). Normalizing means storing entities in an object indexed by id (`{ 1: {...}, 2: {...} }`) plus a separate array of ids for ordering (`allIds: [1, 2]`) — updating a specific entity is an O(1) operation on that key, without touching the rest, and lookup by id is also O(1). RTK includes `createEntityAdapter` specifically to generate this normalized structure and its associated reducers/selectors without writing them by hand.",
    codigo: `import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adaptador = createEntityAdapter();
const slice = createSlice({
  name: 'pedidos',
  initialState: adaptador.getInitialState(), // { ids: [], entities: {} }
  reducers: {
    agregarPedido: adaptador.addOne, // O(1), sin recorrer arrays
  },
});`,
    repregunta:
      "¿Qué relación hay entre RTK Query (el sistema de data fetching incluido en Redux Toolkit) y TanStack Query, y cuándo elegirías uno sobre el otro?",
    respuestaRepreguntaEs:
      "Ambos resuelven el mismo problema central: cachear, deduplicar y sincronizar datos que vienen del servidor, evitando escribir esa lógica a mano con useEffect + useState. RTK Query tiene sentido cuando un proyecto ya usa Redux para el resto de su estado y quiere una solución de data fetching integrada al mismo store, con las mismas DevTools y el mismo patrón mental. TanStack Query es agnóstico de cualquier librería de estado global — no requiere Redux ni ninguna otra, y suele tener una API más liviana para el caso de uso puro de 'traer y cachear datos del servidor' sin necesitar adoptar todo el ecosistema de Redux. La elección rara vez es técnica pura: si ya hay Redux en el proyecto, RTK Query es la opción de menor fricción; si no hay Redux (o se está evitando deliberadamente), TanStack Query es la opción más directa.",
    respuestaRepreguntaEn:
      "Both solve the same core problem: caching, deduping, and syncing data coming from the server, avoiding writing that logic by hand with useEffect + useState. RTK Query makes sense when a project already uses Redux for the rest of its state and wants a data fetching solution integrated into the same store, with the same DevTools and mental pattern. TanStack Query is agnostic of any global state library — it doesn't require Redux or anything else, and usually has a lighter API for the pure use case of 'fetch and cache server data' without needing to adopt the whole Redux ecosystem. The choice is rarely purely technical: if Redux is already in the project, RTK Query is the lowest-friction option; if there's no Redux (or it's being deliberately avoided), TanStack Query is the more direct choice.",
  },
];
