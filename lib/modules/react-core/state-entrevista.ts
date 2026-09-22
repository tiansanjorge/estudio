import type { PreguntaEntrevista } from "../types";

export const entrevistaState: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué llamar al setter de useState no actualiza la variable inmediatamente?",
    respuestaEs:
      "Porque setState no muta nada de forma síncrona: solo le dice a React 'programá un re-render con este nuevo valor'. La variable local de la ejecución actual de la función sigue siendo la misma referencia congelada desde que arrancó este render (su closure), y React recién aplica el nuevo valor cuando procesa la actualización y vuelve a llamar al componente.",
    respuestaEn:
      "Because setState doesn't mutate anything synchronously: it just tells React 'schedule a re-render with this new value'. The local variable in the current execution of the function is still the same reference frozen since this render started (its closure), and React only applies the new value when it processes the update and calls the component again.",
    codigo: `function Contador() {
  const [n, setN] = useState(0);

  function manejarClick() {
    setN(n + 1);
    console.log(n); // sigue imprimiendo el valor VIEJO, no el nuevo
  }

  return <button onClick={manejarClick}>{n}</button>;
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo usarías la forma funcional del setter (setN(n => n + 1)) en vez de setN(n + 1)?",
    respuestaEs:
      "Siempre que la actualización dependa del valor anterior y pueda dispararse más de una vez antes de que React procese el render (llamadas seguidas en el mismo handler, o actualizaciones que pueden pisarse por eventos rápidos). La forma funcional recibe el valor pendiente más reciente en el momento en que React la aplica, no el valor stale capturado en la closure del render — evita perder actualizaciones cuando se acumulan varias seguidas.",
    respuestaEn:
      "Whenever the update depends on the previous value and could fire more than once before React processes the render (successive calls in the same handler, or updates that could overlap from fast events). The functional form receives the most recent pending value at the moment React applies it, not the stale value captured in the render's closure — it avoids losing updates when several stack up in a row.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es 'automatic batching' en React 18, y en qué se diferencia del comportamiento anterior?",
    respuestaEs:
      "Batching significa que React agrupa varias llamadas a setState que ocurren en el mismo 'tick' de ejecución en un único re-render, en vez de re-renderizar una vez por cada llamada. Antes de React 18, esto solo pasaba dentro de handlers de eventos de React; dentro de un setTimeout, una promesa resuelta, o un handler de evento nativo del DOM, cada setState disparaba su propio render por separado. Desde React 18, el batching es automático en todos esos contextos también — múltiples setState dentro de un setTimeout ahora se agrupan en un solo render, igual que dentro de un onClick.",
    respuestaEn:
      "Batching means React groups several setState calls that happen in the same execution 'tick' into a single re-render, instead of re-rendering once per call. Before React 18, this only happened inside React event handlers; inside a setTimeout, a resolved promise, or a native DOM event handler, each setState triggered its own separate render. Since React 18, batching is automatic in all those contexts too — multiple setState calls inside a setTimeout now get grouped into a single render, just like inside an onClick.",
    codigo: `function Ejemplo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  function manejar() {
    setTimeout(() => {
      setA((v) => v + 1);
      setB((v) => v + 1);
      // React 17: 2 renders acá. React 18: 1 solo render (batching automático).
    }, 0);
  }
}`,
    tradeoffs:
      "El batching automático mejora performance por defecto, pero puede sorprender a quien depende de leer un valor de estado 'ya actualizado' inmediatamente después de un setState dentro de un callback async — el valor sigue sin estar disponible hasta el siguiente render, sea cual sea el contexto.",
    repregunta:
      "¿Cómo forzarías que una actualización de estado se aplique de forma síncrona, saltándose el batching, si de verdad lo necesitás?",
    respuestaRepreguntaEs:
      "Con `flushSync` (de `react-dom`), que envuelve un setState y fuerza a React a aplicar esa actualización y re-renderizar de inmediato, antes de continuar con el resto del código. Es una herramienta de escape hatch para casos puntuales donde el orden síncrono importa (por ejemplo, medir el DOM inmediatamente después de una actualización, algo que necesita que el render ya haya ocurrido). Se desaconseja usarlo por costumbre porque reintroduce el costo de performance que el batching automático evita.",
    respuestaRepreguntaEn:
      "With `flushSync` (from `react-dom`), which wraps a setState call and forces React to apply that update and re-render immediately, before continuing with the rest of the code. It's an escape hatch tool for specific cases where synchronous ordering matters (e.g. measuring the DOM right after an update, which needs the render to have already happened). It's discouraged as a habit because it reintroduces the performance cost automatic batching avoids.",
    codigoRepregunta: `import { flushSync } from 'react-dom';

function manejar() {
  flushSync(() => {
    setA((v) => v + 1); // se aplica y re-renderiza YA, antes de seguir
  });
  medirAlgoEnElDOM(); // acá el DOM ya refleja el nuevo estado de "a"
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene guardar estado derivado en un useState propio con un useEffect que lo sincroniza, en vez de calcularlo directamente en el render?",
    respuestaEs:
      "Casi nunca — es uno de los antipatrones más comunes en React. Si un valor se puede calcular a partir de props o de otro estado ya existente, calcularlo directamente durante el render (una variable normal, o useMemo si el cálculo es costoso) es más simple, evita un render extra (el useEffect corre DESPUÉS del render, así que sincronizar estado derivado siempre cuesta un render de más) y elimina la posibilidad de que ambos estados se desincronicen temporalmente. Un useEffect que solo existe para mantener sincronizados dos estados es casi siempre una señal de que uno de los dos no debería ser estado en absoluto.",
    respuestaEn:
      "Almost never — it's one of the most common antipatterns in React. If a value can be computed from props or from other existing state, computing it directly during render (a plain variable, or useMemo if the computation is expensive) is simpler, avoids an extra render (useEffect runs AFTER the render, so syncing derived state always costs one more render), and eliminates the possibility of both states being temporarily out of sync. A useEffect that exists only to keep two states in sync is almost always a sign that one of them shouldn't be state at all.",
    codigo: `// antipatrón: estado derivado sincronizado con efecto
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() => { setTotal(items.reduce((s, i) => s + i.precio, 0)); }, [items]);

// mejor: calculado directamente, sin estado extra ni efecto
const [items, setItems] = useState([]);
const total = items.reduce((s, i) => s + i.precio, 0);`,
  },
  {
    nivel: 3,
    pregunta:
      "Si llamás a setEstado(mismoValor) con exactamente el mismo valor primitivo que ya tenía, ¿React re-renderiza igual?",
    respuestaEs:
      "No. React usa `Object.is` para comparar el valor nuevo con el actual antes de programar el re-render: si son iguales según esa comparación, React 'bail-outea' (evita) el re-render de ese componente, incluso sin memoización explícita de por medio. Esto aplica a valores primitivos comparados por valor (números, strings, booleanos) — para objetos y arrays, `Object.is` compara por referencia, así que crear un objeto nuevo con el mismo contenido SÍ dispara el re-render, porque la referencia cambió aunque el contenido sea idéntico.",
    respuestaEn:
      "No. React uses `Object.is` to compare the new value against the current one before scheduling a re-render: if they're equal by that comparison, React 'bails out' of re-rendering that component, even without explicit memoization involved. This applies to primitive values compared by value (numbers, strings, booleans) — for objects and arrays, `Object.is` compares by reference, so creating a new object with the same content DOES trigger a re-render, because the reference changed even if the content is identical.",
    codigo: `const [n, setN] = useState(5);
setN(5); // mismo valor primitivo: React NO re-renderiza este componente

const [obj, setObj] = useState({ x: 1 });
setObj({ x: 1 }); // objeto NUEVO, aunque el contenido sea igual: SÍ re-renderiza`,
    repregunta:
      "¿Cuándo conviene migrar de useState a useReducer para manejar el estado de un componente?",
    respuestaRepreguntaEs:
      "Cuando hay varias piezas de estado relacionadas que cambian juntas según distintas 'acciones' (por ejemplo, un formulario multi-paso, o un estado de UI con transiciones complejas tipo idle/cargando/éxito/error con distintos payloads), useReducer centraliza toda la lógica de transición en una sola función pura (el reducer), fácil de testear de forma aislada sin renderizar nada. Con useState disperso, la misma lógica termina repartida en varios handlers, cada uno actualizando manualmente varios useState en el orden correcto — más fácil de romper si alguien olvida actualizar una de las piezas relacionadas al agregar una acción nueva.",
    respuestaRepreguntaEn:
      "When there are several related pieces of state that change together based on different 'actions' (e.g. a multi-step form, or a UI state with complex transitions like idle/loading/success/error with different payloads), useReducer centralizes all the transition logic into a single pure function (the reducer), easy to test in isolation without rendering anything. With scattered useState, the same logic ends up spread across several handlers, each manually updating multiple useState calls in the right order — easier to break if someone forgets to update one of the related pieces when adding a new action.",
    codigoRepregunta: `function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'cargar': return { ...estado, status: 'cargando' };
    case 'exito': return { status: 'exito', datos: accion.datos };
    case 'error': return { status: 'error', error: accion.error };
    default: return estado;
  }
}

const [estado, dispatch] = useReducer(reducer, { status: 'idle' });`,
  },
];
