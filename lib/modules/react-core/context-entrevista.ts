import type { PreguntaEntrevista } from "../types";

export const entrevistaContext: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema resuelve Context, y cómo se usa a un nivel básico?",
    respuestaEs:
      "Evita pasar un dato por props manualmente a través de cada componente intermedio hasta llegar al que realmente lo necesita (prop drilling). `createContext()` crea un canal; un `<MiContext.Provider value={...}>` en algún punto del árbol define qué valor viaja por ese canal, y cualquier descendiente, sin importar qué tan profundo esté, puede leerlo con `useContext(MiContext)` sin que nadie en el medio lo reciba ni reenvíe.",
    respuestaEn:
      "It avoids manually passing a piece of data through props across every intermediate component until it reaches the one that actually needs it (prop drilling). `createContext()` creates a channel; a `<MyContext.Provider value={...}>` somewhere in the tree defines what value travels through that channel, and any descendant, no matter how deep, can read it with `useContext(MyContext)` without anyone in between receiving or forwarding it.",
    codigo: `const TemaContext = createContext('claro');

function App() {
  return (
    <TemaContext.Provider value="oscuro">
      <ComponenteProfundo />
    </TemaContext.Provider>
  );
}

function ComponenteProfundo() {
  const tema = useContext(TemaContext); // 'oscuro', sin recibirlo por props
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué tipo de datos son buenos candidatos para vivir en Context?",
    respuestaEs:
      "Datos que muchos componentes en ramas distintas del árbol necesitan, y que cambian con poca frecuencia: tema visual, usuario autenticado, idioma/configuración de i18n. No es un buen candidato el estado que cambia todo el tiempo (el texto de un input, la posición del mouse), porque cada cambio de ese valor re-renderiza a todos los consumidores del Context, sin importar si les importa esa parte específica del valor o no.",
    respuestaEn:
      "Data that many components in different branches of the tree need, and that changes infrequently: visual theme, authenticated user, language/i18n configuration. State that changes constantly (an input's text, mouse position) isn't a good candidate, because every change to that value re-renders every consumer of the Context, regardless of whether they care about that specific part of the value or not.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué conviene dividir un Context grande en varios más chicos, separados por frecuencia de cambio?",
    respuestaEs:
      "Porque cuando el value de un Provider cambia, TODOS sus consumidores re-renderizan, sin importar qué parte del valor realmente usen. Si un solo `AppContext` mezcla el usuario (cambia poco) con, por ejemplo, un contador de notificaciones (cambia seguido), cualquier notificación nueva re-renderiza también a los componentes que solo leen el usuario. Separarlos en `UsuarioContext` y `NotificacionesContext` limita el radio de impacto de cada cambio a únicamente los consumidores que realmente les interesa ese dato puntual.",
    respuestaEn:
      "Because when a Provider's value changes, ALL its consumers re-render, regardless of which part of the value they actually use. If a single `AppContext` mixes the user (changes rarely) with, say, a notification counter (changes often), any new notification also re-renders components that only read the user. Splitting them into `UserContext` and `NotificationsContext` limits each change's blast radius to only the consumers that actually care about that specific piece of data.",
    codigo: `// un solo context grande: cualquier cambio re-renderiza a todos
const AppContext = createContext({ usuario, notificaciones });

// dividido por frecuencia de cambio: menor radio de impacto
const UsuarioContext = createContext(usuario); // cambia poco
const NotificacionesContext = createContext(notificaciones); // cambia seguido`,
    tradeoffs:
      "Más contexts significa más Providers anidados en el árbol ('provider hell'), que se puede mitigar con un componente que los componga todos juntos — pero sigue siendo más código de setup que un único Context grande.",
    repregunta:
      "¿Cómo se resuelve en la práctica el 'provider hell' de tener muchos Providers anidados?",
    respuestaRepreguntaEs:
      "Con un componente compositor que envuelve todos los Providers en un solo lugar, típicamente llamado `AppProviders` o similar, que la app monta una única vez en su raíz. En vez de que `App` tenga que anidar visualmente cinco o seis Providers uno dentro de otro, ese componente centraliza el orden y la composición, dejando el árbol principal de la app limpio — el costo de tener varios contexts separados queda contenido en un solo lugar, en vez de repetirse en cada punto donde se monta la app.",
    respuestaRepreguntaEn:
      "With a composer component that wraps all the Providers in one place, typically called `AppProviders` or similar, which the app mounts once at its root. Instead of `App` having to visually nest five or six Providers inside each other, that component centralizes the order and composition, keeping the app's main tree clean — the cost of having several separate contexts stays contained in one place, instead of repeating everywhere the app gets mounted.",
    codigoRepregunta: `function AppProviders({ children }) {
  return (
    <UsuarioProvider>
      <TemaProvider>
        <NotificacionesProvider>{children}</NotificacionesProvider>
      </TemaProvider>
    </UsuarioProvider>
  );
}

// App queda limpio:
function App() {
  return <AppProviders><Contenido /></AppProviders>;
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué limitación tiene Context comparado con una librería de estado como Zustand o Redux en cuanto a re-renders selectivos?",
    respuestaEs:
      "Context nativo no soporta 'suscripción parcial' al valor: cualquier cambio en el value del Provider re-renderiza a TODOS los componentes que llaman a useContext sobre ese Context, incluso si un consumidor puntual solo lee una propiedad del objeto que no cambió. Librerías como Zustand o Redux con selectors permiten que cada componente se suscriba solo a la porción específica del estado que le importa, re-renderizando únicamente cuando ESA porción cambia, no el store completo. Context no tiene ese mecanismo de selección incorporado — hay que simularlo dividiendo en más contexts (como en la pregunta anterior) o usando una librería externa para esa selección fina.",
    respuestaEn:
      "Native Context doesn't support 'partial subscription' to the value: any change to the Provider's value re-renders ALL components calling useContext on that Context, even if a specific consumer only reads a property of the object that didn't change. Libraries like Zustand or Redux with selectors let each component subscribe only to the specific slice of state it cares about, re-rendering only when THAT slice changes, not the whole store. Context has no built-in selection mechanism for that — you have to simulate it by splitting into more contexts (as in the previous question) or using an external library for that fine-grained selection.",
  },
  {
    nivel: 3,
    pregunta:
      "¿React.memo puede evitar que un componente re-renderice cuando cambia un Context que consume?",
    respuestaEs:
      "No. `React.memo` compara props entre renders para decidir si saltear el render — pero un componente que llama a `useContext` se suscribe directamente al Context, y esa suscripción es independiente de sus props. Si el value del Provider cambia, ese componente re-renderiza igual, sin importar si está envuelto en memo ni si sus props externos siguen siendo los mismos. memo no tiene forma de interceptar ni comparar el valor del Context — la única forma de reducir ese impacto es dividir el Context en piezas más chicas, o mover el useContext a un componente hijo más aislado, para que el memo del padre no se vea afectado por ese cambio.",
    respuestaEn:
      "No. `React.memo` compares props between renders to decide whether to skip rendering — but a component calling `useContext` subscribes directly to the Context, and that subscription is independent of its props. If the Provider's value changes, that component re-renders anyway, regardless of whether it's wrapped in memo or whether its external props stay the same. memo has no way to intercept or compare the Context's value — the only way to reduce that impact is splitting the Context into smaller pieces, or moving the useContext call to a more isolated child component, so the parent's memo isn't affected by that change.",
    codigo: `const Componente = React.memo(function Componente() {
  const tema = useContext(TemaContext);
  return <div>{tema}</div>;
  // re-renderiza cada vez que cambia TemaContext, aunque esté en memo
});`,
    repregunta:
      "¿Cómo evitan librerías como Zustand este problema de 'todo consumidor re-renderiza' que tiene Context nativo?",
    respuestaRepreguntaEs:
      "Usando `useSyncExternalStore` (el hook oficial de React para suscribirse a fuentes de estado externas al árbol de componentes) junto con una función de comparación (selector) por cada componente consumidor. En vez de que React propague un cambio de value a través del árbol de contexto, cada componente se suscribe directamente al store externo y le pasa una función que extrae SOLO la porción de estado que le interesa; el store solo notifica a ese componente si el resultado de esa función cambió (comparado normalmente con igualdad referencial o una comparación custom), no en cada cambio del store completo. Es un mecanismo de suscripción granular que Context, por diseño, no ofrece de forma nativa.",
    respuestaRepreguntaEn:
      "By using `useSyncExternalStore` (React's official hook for subscribing to state sources external to the component tree) together with a comparison function (selector) per consuming component. Instead of React propagating a value change through the context tree, each component subscribes directly to the external store and passes it a function that extracts ONLY the slice of state it cares about; the store only notifies that component if that function's result changed (usually compared with referential equality or a custom comparator), not on every change to the whole store. It's a granular subscription mechanism that Context, by design, doesn't offer natively.",
    codigoRepregunta: `// simplificado: cómo Zustand usa useSyncExternalStore por debajo
function useStore(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()), // solo la porción que este componente necesita
  );
}

const nombre = useStore((estado) => estado.usuario.nombre);
// re-renderiza solo si "nombre" cambió, no si cambió cualquier otra parte del store`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cuándo se usa realmente el valor por defecto que se le pasa a createContext(valorDefault)?",
    respuestaEs:
      "Solo cuando un componente llama a `useContext` y NO existe ningún `Provider` de ese Context por encima de él en el árbol — es decir, el default es un fallback para el caso 'me olvidé de envolver esto en un Provider' o 'este componente se usa fuera del árbol que tiene el Provider', típicamente útil en tests o en Storybook. Es un error común pensar que el valor default también aplica como 'valor inicial' dentro de un Provider — no es así: en cuanto hay un Provider por encima, sea cual sea su value (incluso `undefined` o `null`), ese es el valor que todos los consumidores reciben, sin ninguna influencia del default declarado en createContext.",
    respuestaEn:
      "Only when a component calls `useContext` and there's NO `Provider` for that Context anywhere above it in the tree — that is, the default is a fallback for the 'I forgot to wrap this in a Provider' or 'this component is used outside the tree that has the Provider' case, typically useful in tests or Storybook. It's a common mistake to think the default value also applies as an 'initial value' inside a Provider — it doesn't: as soon as there's a Provider above, whatever its value is (even `undefined` or `null`), that's what all consumers receive, with no influence from the default declared in createContext.",
    codigo: `const TemaContext = createContext('claro'); // default: solo para SIN Provider

function App() {
  return (
    <TemaContext.Provider value={undefined}>
      <Hijo /> {/* useContext acá da undefined, NO 'claro' */}
    </TemaContext.Provider>
  );
}

function Aislado() {
  return <Hijo />; // sin Provider por encima: acá SÍ usa el default 'claro'
}`,
  },
];
