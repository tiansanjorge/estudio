import type { PreguntaEntrevista } from "../types";

export const entrevistaCustomHooks: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un custom hook, y qué lo distingue de una función auxiliar cualquiera?",
    respuestaEs:
      "Es una función cuyo nombre empieza con `use`, y que internamente llama a otros hooks (useState, useEffect, u otros custom hooks). Esa combinación es lo que le permite compartir LÓGICA CON ESTADO entre componentes distintos, sin duplicar código ni recurrir a HOCs o render props — cada componente que llama al custom hook obtiene su propia instancia independiente de ese estado, como si el código del hook se hubiera copiado y pegado directamente en cada componente que lo usa.",
    respuestaEn:
      "It's a function whose name starts with `use`, and which internally calls other hooks (useState, useEffect, or other custom hooks). That combination is what lets it share STATEFUL LOGIC between different components, without duplicating code or resorting to HOCs or render props — every component calling the custom hook gets its own independent instance of that state, as if the hook's code had been copy-pasted directly into each component using it.",
    codigo: `function useContador(inicial = 0) {
  const [cuenta, setCuenta] = useState(inicial);
  const incrementar = () => setCuenta((c) => c + 1);
  return { cuenta, incrementar };
}

function ComponenteA() {
  const { cuenta, incrementar } = useContador(); // su propia instancia
}
function ComponenteB() {
  const { cuenta, incrementar } = useContador(); // otra instancia, independiente
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo extraerías un custom hook en vez de dejar la lógica duplicada en cada componente?",
    respuestaEs:
      "Cuando veo la misma combinación de useState/useEffect (u otros hooks) repetida en dos o más componentes, resolviendo el mismo problema — leer y sincronizar con localStorage, suscribirse al tamaño de la ventana, manejar el estado de un formulario. Igual que con componentes, no extraigo un custom hook 'por las dudas' antes de ver la repetición real: la señal es código con estado duplicado, no la posibilidad teórica de reutilización futura.",
    respuestaEn:
      "When I see the same combination of useState/useEffect (or other hooks) repeated in two or more components, solving the same problem — reading and syncing with localStorage, subscribing to window size, managing form state. Just like with components, I don't extract a custom hook 'just in case' before seeing actual repetition: the signal is duplicated stateful code, not the theoretical possibility of future reuse.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Conviene que un custom hook devuelva un array (como useState) o un objeto (como la mayoría de los hooks de librerías)?",
    respuestaEs:
      "Devolver un ARRAY (`return [valor, setValor]`) le da a quien lo usa la libertad de renombrar cada elemento libremente al destructurar, por posición — útil cuando el hook se va a usar varias veces en el mismo componente con nombres distintos (como varios useState). Devolver un OBJETO (`return { valor, setValor }`) obliga a usar (o renombrar explícitamente con `:`) los nombres que el hook define, pero es más autodocumentado cuando hay más de dos o tres valores devueltos — no hay que memorizar en qué posición del array está cada cosa. La convención más común es: pocos valores relacionados y simétricos → array; varios valores con roles distintos → objeto.",
    respuestaEn:
      "Returning an ARRAY (`return [value, setValue]`) gives whoever uses it the freedom to rename each element freely when destructuring, by position — useful when the hook will be used multiple times in the same component with different names (like several useState calls). Returning an OBJECT (`return { value, setValue }`) forces using (or explicitly renaming with `:`) the names the hook defines, but is more self-documenting when there are more than two or three returned values — no need to memorize which position in the array holds what. The most common convention is: few, related, symmetric values → array; several values with distinct roles → object.",
    codigo: `// array: cómodo para usarlo varias veces con nombres distintos
const [ancho, setAncho] = useVentana('ancho');
const [alto, setAlto] = useVentana('alto');

// objeto: autodocumentado con varios valores de roles distintos
const { datos, cargando, error, reintentar } = useFetch(url);`,
    tradeoffs:
      "Array: más flexible para renombrar, pero el orden importa y hay que recordarlo. Objeto: autodocumentado y con destructuring parcial (tomar solo lo que hace falta), pero requiere renombrar explícitamente si hay colisión de nombres con otro hook.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo compondrías un custom hook a partir de otro custom hook más genérico, en vez de duplicar lógica entre ambos?",
    respuestaEs:
      "Un custom hook puede llamar a otros custom hooks internamente, formando capas de abstracción: por ejemplo, un `useFetch` genérico que maneja el ciclo de carga/éxito/error de cualquier petición, y un `useUsuario(id)` más específico que llama a `useFetch` con la URL correspondiente y le da forma al resultado para ese caso puntual. Esto evita reimplementar el manejo de estados de carga en cada hook específico, y aísla los cambios: si la lógica genérica de fetch necesita ajustarse (agregar reintentos, por ejemplo), se cambia en un solo lugar y todos los hooks específicos que lo usan se benefician automáticamente.",
    respuestaEn:
      "A custom hook can call other custom hooks internally, forming layers of abstraction: for example, a generic `useFetch` that handles the loading/success/error cycle of any request, and a more specific `useUser(id)` that calls `useFetch` with the corresponding URL and shapes the result for that specific case. This avoids reimplementing loading state handling in every specific hook, and isolates changes: if the generic fetch logic needs adjusting (adding retries, for example), it changes in one place and every specific hook using it benefits automatically.",
    codigo: `function useFetch(url) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  useEffect(() => { /* fetch genérico */ }, [url]);
  return estado;
}

function useUsuario(id) {
  const { datos, cargando, error } = useFetch(\`/api/usuarios/\${id}\`);
  return { usuario: datos, cargando, error };
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué el prefijo 'use' en un custom hook no es solo una convención de estilo, sino algo que el tooling depende de verificar?",
    respuestaEs:
      "El plugin de ESLint `eslint-plugin-react-hooks` verifica las 'reglas de los hooks' (llamarlos siempre en el mismo orden, solo en el nivel superior de un componente o de otro hook) analizando estáticamente el código — y para saber qué funciones debe tratar como hooks (y por lo tanto verificar), se basa en el patrón de nombre `use[A-Z]`. Si un custom hook no empieza con 'use', el linter no lo reconoce como hook y NO aplica esas verificaciones dentro de él, dejando pasar violaciones reales de las reglas de los hooks sin ningún aviso. El prefijo no es solo legible para humanos — es literalmente la señal que usa el tooling automatizado para saber qué código auditar.",
    respuestaEn:
      "The `eslint-plugin-react-hooks` ESLint plugin verifies the 'rules of hooks' (always calling them in the same order, only at the top level of a component or another hook) by statically analyzing the code — and to know which functions it should treat as hooks (and therefore check), it relies on the `use[A-Z]` name pattern. If a custom hook doesn't start with 'use', the linter doesn't recognize it as a hook and does NOT apply those checks inside it, letting real rules-of-hooks violations slip through with no warning. The prefix isn't just readable for humans — it's literally the signal automated tooling uses to know what code to audit.",
    codigo: `// el linter SÍ analiza esto como hook, por el prefijo "use"
function useDatos() {
  const [datos, setDatos] = useState(null);
  if (datos) { useEffect(() => {}); } // el linter SÍ marca esto como violación
}

// el linter NO lo analiza como hook — nombre sin prefijo "use"
function obtenerDatos() {
  const [datos, setDatos] = useState(null); // ni siquiera avisa que esto está mal ubicado
}`,
    repregunta:
      "Si dos componentes distintos llaman al mismo custom hook, ¿comparten el mismo estado interno de ese hook?",
    respuestaRepreguntaEs:
      "No. Cada llamada al custom hook, desde cada componente, ejecuta el cuerpo de esa función de nuevo, con sus propios useState/useEffect internos registrados en la lista de hooks del FIBER de ESE componente puntual — no hay ningún estado compartido ni instancia única 'detrás' del hook. Es exactamente el mismo comportamiento que llamar a useState directamente dos veces en dos componentes distintos: cada uno tiene su propia variable de estado, sin ninguna relación entre sí. Si de verdad se necesita compartir estado entre componentes, un custom hook no alcanza — hace falta Context, o una librería de estado externo.",
    respuestaRepreguntaEn:
      "No. Each call to the custom hook, from each component, runs that function's body again, with its own internal useState/useEffect registered in THAT specific component's fiber hook list — there's no shared state or single instance 'behind' the hook. It's the exact same behavior as calling useState directly twice in two different components: each has its own state variable, with no relationship between them. If state genuinely needs to be shared between components, a custom hook isn't enough — Context, or an external state library, is needed.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué no se puede simplemente llamar a un custom hook como una función normal fuera de un componente, para testearlo?",
    respuestaEs:
      "Porque un custom hook depende de los hooks que llama internamente (useState, useEffect), y esos hooks a su vez dependen de estar ejecutándose dentro del contexto de renderizado de React — específicamente, de un fiber activo al que asociar su estado interno. Llamarlo como una función suelta, fuera de ese contexto, hace que React lance un error ('Invalid hook call') porque no hay ningún componente en render activo al cual asociar ese estado. Para testear un custom hook de forma aislada se usa una utilidad como `renderHook` (de React Testing Library), que monta un componente de prueba mínimo e invisible solo para darle al hook un contexto de renderizado válido donde ejecutarse, exponiendo su resultado y permitiendo disparar re-renders controlados para probar cómo reacciona a cambios.",
    respuestaEn:
      "Because a custom hook depends on the hooks it calls internally (useState, useEffect), and those hooks in turn depend on running inside React's rendering context — specifically, an active fiber to associate their internal state with. Calling it as a standalone function, outside that context, makes React throw an error ('Invalid hook call') because there's no active rendering component to associate that state with. To test a custom hook in isolation, a utility like `renderHook` (from React Testing Library) is used, which mounts a minimal, invisible test component just to give the hook a valid rendering context to run in, exposing its result and allowing controlled re-renders to test how it reacts to changes.",
    codigo: `import { renderHook, act } from '@testing-library/react';

test('useContador incrementa', () => {
  const { result } = renderHook(() => useContador(0));
  act(() => result.current.incrementar());
  expect(result.current.cuenta).toBe(1);
});`,
  },
];
