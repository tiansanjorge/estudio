import type { PreguntaEntrevista } from "../types";

export const entrevistaUseMemo: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace useMemo, y qué garantiza (y qué NO garantiza) sobre cuándo recalcula?",
    respuestaEs:
      "useMemo memoiza el RESULTADO de una función entre renders: solo vuelve a ejecutar esa función y recalcular el valor cuando alguna de las dependencias de su array cambió; si no cambió ninguna, devuelve el valor ya calculado en el render anterior sin volver a correr la función. Importante: React documenta esto como una optimización de PERFORMANCE, no como una garantía semántica absoluta — en casos raros (por ejemplo, para liberar memoria), React podría 'olvidar' un valor memoizado y recalcularlo igual, aunque las dependencias no hayan cambiado. Por eso nunca hay que depender de useMemo para correctitud (como si fuera la única forma de evitar un efecto secundario), solo para performance.",
    respuestaEn:
      "useMemo memoizes a function's RESULT between renders: it only re-runs that function and recomputes the value when one of its dependency array's values changed; if none changed, it returns the value already computed on the previous render without re-running the function. Important: React documents this as a PERFORMANCE optimization, not an absolute semantic guarantee — in rare cases (e.g. to free up memory), React could 'forget' a memoized value and recompute it anyway, even if dependencies didn't change. That's why you should never rely on useMemo for correctness (as if it were the only way to avoid a side effect), only for performance.",
    codigo: `const resultadosOrdenados = useMemo(() => {
  return [...items].sort((a, b) => a.precio - b.precio); // costoso con listas grandes
}, [items]);`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿usarías useMemo para memoizar cualquier cálculo dentro de un componente?",
    respuestaEs:
      "No. useMemo tiene su propio costo: React tiene que guardar el valor anterior, comparar cada dependencia del array contra la del render anterior, y decidir si recalcular. Para un cálculo trivial (sumar dos números, formatear un string corto), ese costo de comparación puede ser igual o mayor que simplemente recalcular el valor directo en cada render. Reservo useMemo para cálculos genuinamente costosos (ordenar/filtrar listas grandes, cálculos con mucha iteración) donde el ahorro de no recalcular supera claramente el costo de la memoización en sí.",
    respuestaEn:
      "No. useMemo has its own cost: React has to store the previous value, compare each dependency in the array against the previous render's, and decide whether to recompute. For a trivial computation (adding two numbers, formatting a short string), that comparison cost can be equal to or greater than just recomputing the value directly on every render. I reserve useMemo for genuinely expensive computations (sorting/filtering large lists, heavily iterative calculations) where the savings from not recomputing clearly outweigh the memoization's own cost.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo tiene sentido usar useMemo específicamente para mantener la identidad de un objeto o array, más allá de ahorrar cálculo?",
    respuestaEs:
      "Cuando ese objeto se usa como dependencia de otro hook (otro useMemo, un useEffect) o se pasa como prop a un componente envuelto en React.memo, o como value de un Context Provider. En esos casos, lo que importa no es 'cuánto tarda en calcularse' el objeto (puede ser trivial, como `{ a, b }`), sino que sea la MISMA referencia entre renders cuando su contenido no cambió — de lo contrario, un objeto literal nuevo en cada render rompe la comparación superficial de memo, o dispara el efecto/re-render de todo lo que dependa de esa referencia innecesariamente.",
    respuestaEn:
      "When that object is used as a dependency for another hook (another useMemo, a useEffect) or passed as a prop to a component wrapped in React.memo, or as a Context Provider's value. In those cases, what matters isn't 'how long it takes to compute' the object (it can be trivial, like `{ a, b }`), but that it's the SAME reference between renders when its content didn't change — otherwise, a new object literal on every render breaks memo's shallow comparison, or unnecessarily triggers the effect/re-render of anything depending on that reference.",
    codigo: `// sin useMemo: nueva referencia en cada render, rompe memo/deps de otros hooks
const config = { tema, idioma };

// con useMemo: misma referencia mientras tema e idioma no cambien
const config = useMemo(() => ({ tema, idioma }), [tema, idioma]);`,
    tradeoffs:
      "Usar useMemo por estabilidad de referencia (no por costo de cálculo) es legítimo, pero hay que ser consciente de que agrega una capa de indirección — si el consumidor de ese valor no depende de su identidad (no está en un array de deps, no está detrás de memo), el useMemo ahí no aporta nada real.",
  },
  {
    nivel: 2,
    pregunta:
      "Si el array de dependencias de un useMemo no incluye todos los valores que la función usa internamente, ¿qué bug produce?",
    respuestaEs:
      "El mismo problema de 'stale closure' que un useEffect con dependencias incompletas: la función memoizada queda capturando el valor VIEJO de esa variable omitida, y como el array de dependencias no la incluye, React nunca vuelve a ejecutar la función cuando esa variable realmente cambia — el valor memoizado queda desactualizado silenciosamente, sin ningún error visible, hasta que alguien nota que el resultado no refleja el estado actual de la app.",
    respuestaEn:
      "The same 'stale closure' problem as a useEffect with incomplete dependencies: the memoized function ends up capturing the OLD value of that omitted variable, and since the dependency array doesn't include it, React never re-runs the function when that variable actually changes — the memoized value silently goes stale, with no visible error, until someone notices the result doesn't reflect the app's current state.",
    codigo: `const [descuento, setDescuento] = useState(0);

// bug: descuento no está en las deps, queda "congelado" en su valor inicial
const total = useMemo(() => precio * (1 - descuento), [precio]);

// fix: incluir todo lo que la función realmente usa
const total = useMemo(() => precio * (1 - descuento), [precio, descuento]);`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo cambia el rol de useMemo con la llegada del React Compiler (auto-memoización)?",
    respuestaEs:
      "El React Compiler analiza el código en tiempo de compilación y puede insertar memoización automáticamente donde detecta que es segura y beneficiosa, sin que el desarrollador escriba useMemo/useCallback/React.memo a mano. Esto no vuelve inútil entender useMemo — sigue siendo necesario para diagnosticar por qué algo NO se está memoizando cuando el compilador no puede garantizar que sea seguro hacerlo (por ejemplo, código con efectos secundarios sutiles que rompe las reglas que el compilador exige), y para trabajar en código legacy o en proyectos que todavía no adoptaron el compiler. El cambio real es de énfasis: en vez de decidir manualmente 'dónde memoizar', el foco pasa a escribir componentes que sigan las reglas de React de forma estricta, para que el compilador pueda optimizar con confianza.",
    respuestaEn:
      "The React Compiler analyzes code at compile time and can automatically insert memoization where it detects it's safe and beneficial, without the developer writing useMemo/useCallback/React.memo by hand. This doesn't make understanding useMemo useless — it's still needed to diagnose why something ISN'T getting memoized when the compiler can't guarantee it's safe to do so (e.g. code with subtle side effects that breaks the rules the compiler requires), and to work on legacy code or projects that haven't adopted the compiler yet. The real shift is in emphasis: instead of manually deciding 'where to memoize', the focus shifts to writing components that strictly follow React's rules, so the compiler can optimize with confidence.",
    repregunta:
      "¿Por qué useMemo no garantiza preservar la identidad de un valor entre CUALQUIER par de renders, ni siquiera sin el React Compiler de por medio?",
    respuestaRepreguntaEs:
      "Porque bajo renderizado concurrente, React puede descartar un árbol de trabajo-en-progreso a medio calcular (lo que vimos en el módulo de Fiber sobre el double buffering) y volver a intentar ese render desde cero más tarde — en ese reintento, los valores memoizados de ese intento descartado se pierden junto con el resto del trabajo, y useMemo simplemente vuelve a ejecutar su función en el nuevo intento. Esto refuerza por qué la documentación oficial es explícita en que useMemo es una optimización, no una garantía: en un modelo de render que puede pausarse, descartarse y reintentarse, prometer 'esto siempre va a ser la misma referencia' sería una promesa que React no podría cumplir de forma consistente en todos los escenarios.",
    respuestaRepreguntaEn:
      "Because under concurrent rendering, React can discard a half-computed work-in-progress tree (what we saw in the Fiber module about double buffering) and retry that render from scratch later — in that retry, the memoized values from that discarded attempt are lost along with the rest of the work, and useMemo simply re-runs its function on the new attempt. This reinforces why the official docs are explicit that useMemo is an optimization, not a guarantee: in a rendering model that can be paused, discarded, and retried, promising 'this will always be the same reference' would be a promise React couldn't consistently keep across every scenario.",
  },
];
