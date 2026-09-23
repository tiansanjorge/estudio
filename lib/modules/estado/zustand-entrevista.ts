import type { PreguntaEntrevista } from "../types";

export const entrevistaZustand: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace que Zustand se sienta tan distinto de usar Context para estado global?",
    respuestaEs:
      "Zustand no usa Context ni Provider por defecto: `create()` arma un store externo a React (un objeto simple con estado y funciones para actualizarlo), y expone ese store como un hook que cualquier componente puede importar y usar directamente, sin envolver la app en ningún Provider. Cada componente que llama al hook se suscribe automáticamente solo al store, y — a diferencia de Context — puede elegir leer solo una PORCIÓN específica del estado con un selector, re-renderizando únicamente cuando esa porción puntual cambia, no todo el store.",
    respuestaEn:
      "Zustand doesn't use Context or a Provider by default: `create()` builds a store external to React (a simple object with state and functions to update it), and exposes that store as a hook any component can import and use directly, without wrapping the app in any Provider. Each component calling the hook automatically subscribes only to the store, and — unlike Context — can choose to read only a SPECIFIC slice of state with a selector, re-rendering only when that particular slice changes, not the whole store.",
    codigo: `import { create } from 'zustand';

const useStore = create((set) => ({
  contador: 0,
  incrementar: () => set((estado) => ({ contador: estado.contador + 1 })),
}));

function Contador() {
  const contador = useStore((estado) => estado.contador); // selector: solo esta porción
  const incrementar = useStore((estado) => estado.incrementar);
  return <button onClick={incrementar}>{contador}</button>;
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué es importante usar un selector al leer del store, en vez de desestructurar todo el estado de una vez?",
    respuestaEs:
      "Leer con un selector (`useStore((estado) => estado.contador)`) hace que ese componente se suscriba SOLO a esa porción, re-renderizando únicamente cuando `contador` cambia. Si en cambio se lee el store completo sin selector (`const estado = useStore()`), el componente se suscribe a TODO el store, y re-renderiza ante cualquier cambio de cualquier propiedad, aunque el componente solo use una de ellas — perdiendo la ventaja principal de Zustand frente a Context.",
    respuestaEn:
      "Reading with a selector (`useStore((state) => state.count)`) makes that component subscribe ONLY to that slice, re-rendering only when `count` changes. If instead you read the whole store without a selector (`const state = useStore()`), the component subscribes to the ENTIRE store, and re-renders on any change to any property, even if the component only uses one of them — losing Zustand's main advantage over Context.",
    codigo: `// mal: se suscribe a TODO el store, re-renderiza por cualquier cambio
const estado = useStore();

// bien: se suscribe solo a "contador"
const contador = useStore((estado) => estado.contador);`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué trade-off hay entre Zustand y Redux Toolkit en cuanto a estructura y boilerplate?",
    respuestaEs:
      "Zustand es deliberadamente minimalista: no exige actions ni reducers separados, no necesita Provider, y un store se define en pocas líneas con `create()`. Esa simplicidad es una ventaja para proyectos chicos o medianos, pero también significa menos estructura impuesta — en equipos grandes, sin convenciones propias, es más fácil terminar con stores organizados de formas inconsistentes entre sí. Redux Toolkit impone una estructura más rígida (slices, reducers, actions generadas automáticamente), lo que agrega algo de boilerplate pero da consistencia y un ecosistema de herramientas (DevTools con time-travel, middleware estandarizado) más maduro.",
    respuestaEn:
      "Zustand is deliberately minimalist: it doesn't require separate actions or reducers, doesn't need a Provider, and a store is defined in a few lines with `create()`. That simplicity is an advantage for small or medium projects, but it also means less imposed structure — in large teams, without their own conventions, it's easier to end up with stores organized inconsistently from each other. Redux Toolkit imposes a more rigid structure (slices, reducers, auto-generated actions), which adds some boilerplate but gives consistency and a more mature tooling ecosystem (DevTools with time-travel, standardized middleware).",
    tradeoffs:
      "Zustand: menos código, más flexibilidad, pero requiere disciplina propia del equipo para mantener consistencia. Redux Toolkit: más estructura y ecosistema maduro, a cambio de más ceremonia inicial por cada slice de estado.",
    repregunta:
      "¿Cómo se manejan actualizaciones inmutables de estado anidado en Zustand, ya que set() no hace merge profundo automáticamente?",
    respuestaRepreguntaEs:
      "`set()` en Zustand hace un merge superficial (shallow merge) del objeto que se le pasa con el estado actual — para propiedades anidadas, hay que hacer el spread manualmente en cada nivel, igual que con setState de React. Para evitar ese boilerplate repetitivo, Zustand ofrece un middleware `immer` que permite escribir la actualización como si se mutara el estado directamente (`estado.perfil.nombre = 'Ana'`), mientras por debajo Immer genera un nuevo objeto inmutable — la misma técnica de 'mutación aparente, inmutabilidad real' que usa Redux Toolkit internamente.",
    respuestaRepreguntaEn:
      "`set()` in Zustand does a shallow merge of the object passed to it with the current state — for nested properties, you have to spread manually at each level, just like with React's setState. To avoid that repetitive boilerplate, Zustand offers an `immer` middleware that lets you write the update as if directly mutating the state (`state.profile.name = 'Ana'`), while underneath Immer generates a new immutable object — the same 'apparent mutation, real immutability' technique Redux Toolkit uses internally.",
    codigoRepregunta: `// sin immer: spread manual en cada nivel anidado
set((estado) => ({ perfil: { ...estado.perfil, nombre: 'Ana' } }));

// con middleware immer: sintaxis de mutación directa, inmutable por debajo
import { immer } from 'zustand/middleware/immer';
const useStore = create(immer((set) => ({
  perfil: { nombre: '' },
  cambiarNombre: (nombre) => set((estado) => { estado.perfil.nombre = nombre; }),
})));`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo logra Zustand la selección granular sin que React sepa nada de su store, y cómo evita el tearing al hacerlo?",
    respuestaEs:
      "El hook que devuelve `create()` está implementado sobre `useSyncExternalStore`: cada componente que llama al hook con un selector se suscribe directamente al store externo, pasándole a React una función que extrae solo la porción de estado que le interesa. React (a través de useSyncExternalStore) se encarga de comparar esa porción entre notificaciones del store y re-renderizar el componente SOLO si el resultado del selector cambió — sin que el store necesite saber nada de React, y sin exponerse al problema de tearing bajo renderizado concurrente, porque React verifica la consistencia del snapshot del store en cada commit.",
    respuestaEn:
      "The hook `create()` returns is implemented on top of `useSyncExternalStore`: each component calling the hook with a selector subscribes directly to the external store, passing React a function that extracts only the slice of state it cares about. React (through useSyncExternalStore) handles comparing that slice between store notifications and re-rendering the component ONLY if the selector's result changed — without the store needing to know anything about React, and without being exposed to the tearing problem under concurrent rendering, because React verifies the store snapshot's consistency on every commit.",
    codigo: `// simplificado: cómo Zustand usa useSyncExternalStore por debajo
function useStore(selector) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
  );
}`,
    repregunta:
      "¿Qué pasa si dos componentes usan selectores que devuelven un objeto nuevo cada vez (por ejemplo, `useStore((s) => ({ a: s.a, b: s.b }))`), en vez de un valor primitivo?",
    respuestaRepreguntaEs:
      "El selector se ejecuta en cada notificación del store, y como devuelve un objeto literal NUEVO cada vez, la comparación por referencia que hace useSyncExternalStore (o el comparador por defecto de Zustand, Object.is) siempre detecta un cambio, aunque el contenido sea idéntico — el componente re-renderiza en cada actualización del store, sin importar si `a` o `b` realmente cambiaron. La solución es pasar un comparador de igualdad shallow como segundo argumento del hook (`useStore(selector, shallow)`), que Zustand ofrece específicamente para este caso, comparando las propiedades del objeto devuelto en vez de su referencia.",
    respuestaRepreguntaEn:
      "The selector runs on every store notification, and since it returns a NEW object literal each time, the reference comparison useSyncExternalStore does (or Zustand's default comparator, Object.is) always detects a change, even if the content is identical — the component re-renders on every store update, regardless of whether `a` or `b` actually changed. The fix is passing a shallow equality comparator as the hook's second argument (`useStore(selector, shallow)`), which Zustand offers specifically for this case, comparing the returned object's properties instead of its reference.",
    codigoRepregunta: `import { shallow } from 'zustand/shallow';

// sin shallow: re-renderiza en cada cambio del store, objeto nuevo siempre
const { a, b } = useStore((s) => ({ a: s.a, b: s.b }));

// con shallow: solo re-renderiza si a o b cambiaron de verdad
const { a, b } = useStore((s) => ({ a: s.a, b: s.b }), shallow);`,
  },
];
