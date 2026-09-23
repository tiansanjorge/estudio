import type { PreguntaEntrevista } from "../types";

export const entrevistaUseCallback: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema resuelve useCallback, y por qué existe si ya existe useMemo?",
    respuestaEs:
      "Cada vez que un componente renderiza, cualquier función definida en su cuerpo (incluyendo funciones inline pasadas como props) es una referencia NUEVA, aunque haga exactamente lo mismo. useCallback memoiza esa referencia de función entre renders, devolviendo la misma función mientras las dependencias de su array no cambien. Técnicamente no aporta nada que useMemo no pudiera hacer — `useCallback(fn, deps)` es equivalente a `useMemo(() => fn, deps)` — pero es más legible y directo cuando lo que se quiere memoizar es específicamente una función.",
    respuestaEn:
      "Every time a component renders, any function defined in its body (including inline functions passed as props) is a NEW reference, even if it does exactly the same thing. useCallback memoizes that function reference between renders, returning the same function while its dependency array doesn't change. Technically it doesn't do anything useMemo couldn't do — `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)` — but it's more readable and direct when what you want to memoize is specifically a function.",
    codigo: `// sin useCallback: nueva función en cada render
const manejarClick = () => setCantidad((c) => c + 1);

// con useCallback: misma referencia mientras las deps no cambien
const manejarClick = useCallback(() => setCantidad((c) => c + 1), []);`,
  },
  {
    nivel: 1,
    pregunta:
      "Si envolvés una función en useCallback pero el componente hijo que la recibe no está en React.memo, ¿sirve de algo?",
    respuestaEs:
      "No, en la práctica no aporta nada por sí solo. useCallback evita que la función tenga una referencia nueva en cada render, pero si el componente hijo que la recibe como prop no está envuelto en React.memo, ese hijo va a re-renderizar igual cada vez que su padre renderice, sin importar si la prop cambió de referencia o no. useCallback y React.memo trabajan juntos: uno mantiene estable la referencia, el otro es el que realmente aprovecha esa estabilidad para evitar el re-render.",
    respuestaEn:
      "No, in practice it doesn't do anything on its own. useCallback prevents the function from having a new reference on every render, but if the child component receiving it as a prop isn't wrapped in React.memo, that child is going to re-render anyway every time its parent renders, regardless of whether the prop's reference changed. useCallback and React.memo work together: one keeps the reference stable, the other is what actually takes advantage of that stability to avoid the re-render.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene usar useCallback para estabilizar un callback que se pasa como dependencia de un useEffect en otro componente?",
    respuestaEs:
      "Cuando ese callback viene de props y el componente que lo recibe lo usa dentro de un useEffect que lo incluye en su array de dependencias. Sin useCallback en el componente que lo define, el callback es una referencia nueva en cada render de ESE padre, lo que hace que el efecto del hijo se dispare de nuevo en cada render del padre, aunque la lógica del callback no haya cambiado realmente. Envolver el callback en useCallback en el padre estabiliza esa referencia, y el efecto del hijo solo se dispara cuando algo realmente relevante cambió.",
    respuestaEn:
      "When that callback comes from props and the component receiving it uses it inside a useEffect that includes it in its dependency array. Without useCallback in the component that defines it, the callback is a new reference on every render of THAT parent, which makes the child's effect re-fire on every parent render, even though the callback's logic didn't actually change. Wrapping the callback in useCallback in the parent stabilizes that reference, and the child's effect only fires when something actually relevant changed.",
    codigo: `function Padre() {
  const manejarGuardado = useCallback((datos) => guardar(datos), []);
  return <Hijo onGuardar={manejarGuardado} />;
}

function Hijo({ onGuardar }) {
  useEffect(() => {
    // sin useCallback en Padre, este efecto se dispara en cada render de Padre
  }, [onGuardar]);
}`,
    tradeoffs:
      "Estabilizar callbacks con useCallback tiene sentido cuando de verdad hay un consumidor (memo, deps de otro hook) que se beneficia de esa estabilidad — envolver por costumbre agrega complejidad de lectura sin ningún efecto medible.",
  },
  {
    nivel: 2,
    pregunta:
      "Un useCallback tiene un objeto como dependencia, pero ese objeto se crea de nuevo en cada render del padre. ¿Sigue funcionando la memoización?",
    respuestaEs:
      "No, en la práctica se anula: useCallback compara cada dependencia por referencia (con Object.is), así que si esa dependencia es un objeto nuevo en cada render (por ejemplo, un objeto de configuración creado como literal en el JSX del padre), la comparación siempre da 'distinto', y React recrea el callback en cada render de todas formas — la memoización nunca llega a activarse. Para que funcione de verdad, esa dependencia también necesita tener una referencia estable, típicamente memoizada con su propio useMemo (o useState/useRef si corresponde), en el lugar donde se crea.",
    respuestaEn:
      "No, in practice it's nullified: useCallback compares each dependency by reference (with Object.is), so if that dependency is a new object on every render (e.g. a config object created as a literal in the parent's JSX), the comparison always comes back 'different', and React recreates the callback on every render anyway — the memoization never actually kicks in. For it to really work, that dependency also needs a stable reference, typically memoized with its own useMemo (or useState/useRef as appropriate), where it's created.",
    codigo: `// "config" es un objeto nuevo en cada render: anula la memoización de abajo
function Padre() {
  return <Hijo config={{ modo: 'oscuro' }} />;
}
function Hijo({ config }) {
  const manejar = useCallback(() => aplicar(config), [config]); // se recrea siempre
}`,
  },
  {
    nivel: 3,
    pregunta:
      "Un useCallback con array de dependencias vacío captura un valor de estado que cambia después. ¿Qué bug produce, y por qué es tan fácil pasarlo por alto?",
    respuestaEs:
      "El callback queda con una closure sobre el valor de estado que existía en el momento en que se creó esa versión memoizada — como el array de dependencias está vacío, React nunca vuelve a crear el callback, así que sigue 'viendo' para siempre el valor viejo de ese estado, aunque el componente haya vuelto a renderizar con un valor nuevo. Es fácil pasarlo por alto porque el código compila sin errores, el linter de exhaustive-deps es la única red de seguridad real (y solo avisa si está activado y configurado correctamente), y el bug solo se manifiesta en runtime, generalmente como 'el valor que uso está atrasado un paso' — un patrón que se confunde fácilmente con otros bugs de timing.",
    respuestaEn:
      "The callback ends up with a closure over the state value that existed at the moment that memoized version was created — since the dependency array is empty, React never recreates the callback, so it keeps 'seeing' that state's old value forever, even though the component has re-rendered with a new value since. It's easy to overlook because the code compiles with no errors, the exhaustive-deps linter is the only real safety net (and only warns if it's enabled and configured correctly), and the bug only shows up at runtime, usually as 'the value I'm using is one step behind' — a pattern easily confused with other timing bugs.",
    codigo: `function Contador() {
  const [cuenta, setCuenta] = useState(0);

  const mostrarCuenta = useCallback(() => {
    console.log(cuenta); // siempre imprime 0: quedó "congelado" en el primer render
  }, []); // debería incluir [cuenta]

  return <button onClick={mostrarCuenta}>{cuenta}</button>;
}`,
    repregunta:
      "¿Cómo evitarías este stale closure sin agregar cuenta al array de dependencias, si de verdad necesitás que la referencia del callback se mantenga completamente estable?",
    respuestaRepreguntaEs:
      "Con el mismo patrón que resuelve useEffectEvent para efectos: envolver la lectura del valor cambiante en una función especial que siempre ve la versión más reciente sin formar parte de las dependencias — o, de forma más manual y anterior a esa API, guardar el valor actual en una ref que se actualiza en cada render (`useRef` + un efecto que la sincroniza), y leer `ref.current` dentro del callback en vez del valor de estado directo. Ambas soluciones separan 'qué necesita disparar una nueva versión del callback' (nada, en este caso) de 'qué valor necesito leer siempre actualizado' (la cuenta), evitando la stale closure sin sacrificar la estabilidad de referencia del callback.",
    respuestaRepreguntaEn:
      "With the same pattern useEffectEvent solves for effects: wrap the changing value's read in a special function that always sees the latest version without being part of the dependencies — or, more manually and predating that API, store the current value in a ref that updates on every render (`useRef` + an effect syncing it), and read `ref.current` inside the callback instead of the state value directly. Both solutions separate 'what needs to trigger a new version of the callback' (nothing, in this case) from 'what value do I need to always read up to date' (the count), avoiding the stale closure without sacrificing the callback's reference stability.",
    codigoRepregunta: `function Contador() {
  const [cuenta, setCuenta] = useState(0);
  const cuentaRef = useRef(cuenta);

  useEffect(() => { cuentaRef.current = cuenta; }, [cuenta]);

  const mostrarCuenta = useCallback(() => {
    console.log(cuentaRef.current); // siempre el valor actual, sin recrear el callback
  }, []);

  return <button onClick={mostrarCuenta}>{cuenta}</button>;
}`,
  },
];
