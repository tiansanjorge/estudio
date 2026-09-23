import type { PreguntaEntrevista } from "../types";

export const entrevistaUseState: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué los hooks (incluido useState) tienen que llamarse siempre en el mismo orden, en cada render?",
    respuestaEs:
      "Porque React no identifica cada useState por nombre de variable ni por ningún identificador explícito — los guarda en una lista interna asociada al componente, en el orden exacto en que se llamaron. En el segundo render, React recorre esa misma lista en orden y empareja cada llamada a useState con su slot correspondiente según la POSICIÓN en la que fue llamada, no según ningún otro criterio. Si un useState se llama condicionalmente (dentro de un if, después de un return temprano, dentro de un loop), el orden puede cambiar entre renders y React empareja mal los slots, mezclando el estado de una variable con el de otra.",
    respuestaEn:
      "Because React doesn't identify each useState by variable name or any explicit identifier — it stores them in an internal list attached to the component, in the exact order they were called. On the second render, React walks that same list in order and matches each useState call to its corresponding slot based on the POSITION it was called in, not any other criterion. If a useState is called conditionally (inside an if, after an early return, inside a loop), the order can change between renders and React matches the slots wrong, mixing up one variable's state with another's.",
    codigo: `function Componente({ condicion }) {
  if (condicion) {
    const [a, setA] = useState(0); // ⚠️ a veces se llama, a veces no
  }
  const [b, setB] = useState(1); // su "posición" en la lista cambia según condicion
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo usarías la forma de función (lazy initializer) en vez de pasar el valor inicial directo?",
    respuestaEs:
      "Cuando calcular el valor inicial es costoso (parsear un JSON grande de localStorage, procesar una lista pesada). Pasando `useState(calculoCostoso())` esa función se ejecuta en CADA render, aunque el resultado solo se use en el primero — React descarta el resultado en los renders siguientes, pero el cálculo igual se hizo. Con `useState(() => calculoCostoso())`, React solo llama a esa función en el montaje inicial, nunca en renders posteriores.",
    respuestaEn:
      "When computing the initial value is expensive (parsing a large JSON from localStorage, processing a heavy list). Passing `useState(expensiveComputation())` runs that function on EVERY render, even though the result is only used on the first one — React discards the result on later renders, but the computation still happened. With `useState(() => expensiveComputation())`, React only calls that function on the initial mount, never on later renders.",
    codigo: `// se ejecuta en cada render, aunque el resultado se descarte después del primero
const [datos, setDatos] = useState(JSON.parse(localStorage.getItem('datos')));

// solo se ejecuta una vez, en el montaje
const [datos, setDatos] = useState(() => JSON.parse(localStorage.getItem('datos')));`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Conviene usar varios useState separados o uno solo con un objeto, para datos relacionados (por ejemplo, x e y de una posición)?",
    respuestaEs:
      "Depende de si esos valores casi siempre cambian juntos o de forma independiente. Si x e y siempre se actualizan a la vez (por ejemplo, arrastrar un elemento), un solo useState con `{ x, y }` los mantiene atómicos: nunca hay un render intermedio donde uno cambió y el otro no. Si en cambio se actualizan de forma independiente la mayoría de las veces (nombre y email de un formulario, donde el usuario edita un campo por vez), separarlos en useState individuales es más simple: no hace falta hacer spread del objeto anterior en cada actualización, y cada setter es más directo.",
    respuestaEn:
      "It depends on whether those values almost always change together or independently. If x and y always update together (e.g. dragging an element), a single useState with `{ x, y }` keeps them atomic: there's never an intermediate render where one changed and the other didn't. If instead they update independently most of the time (a form's name and email, where the user edits one field at a time), splitting them into individual useState calls is simpler: no need to spread the previous object on every update, and each setter is more direct.",
    codigo: `// atómico: siempre cambian juntos
const [posicion, setPosicion] = useState({ x: 0, y: 0 });
setPosicion({ x: 10, y: 20 });

// independiente: se editan por separado
const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');`,
    tradeoffs:
      "Un objeto agrupado evita estados intermedios inconsistentes, pero obliga a hacer spread manual del resto de las propiedades en cada actualización parcial — olvidarse el spread borra silenciosamente las demás propiedades.",
    repregunta:
      "¿Hace falta incluir el setter de useState (por ejemplo, setContador) en el array de dependencias de un useEffect que lo usa?",
    respuestaRepreguntaEs:
      "No hace falta, aunque incluirlo no rompe nada (solo agrega ruido). React garantiza que la identidad de la función setter devuelta por useState es ESTABLE entre renders — nunca cambia mientras el componente esté montado. Como los linters de exhaustive-deps saben esto, no marcan el setter como una dependencia faltante. Es la misma garantía de estabilidad que tiene el objeto devuelto por useRef.",
    respuestaRepreguntaEn:
      "It's not necessary, though including it doesn't break anything (it just adds noise). React guarantees the setter function returned by useState has a STABLE identity across renders — it never changes while the component stays mounted. Since exhaustive-deps linters know this, they don't flag the setter as a missing dependency. It's the same stability guarantee the object returned by useRef has.",
    codigoRepregunta: `const [contador, setContador] = useState(0);

useEffect(() => {
  const id = setInterval(() => setContador((c) => c + 1), 1000);
  return () => clearInterval(id);
}, []); // setContador no hace falta en las deps: su identidad nunca cambia`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa si guardás una función directamente como valor inicial de useState, esperando que sea 'el estado' en sí, no un lazy initializer?",
    respuestaEs:
      "React interpreta CUALQUIER función pasada como argumento de useState (o como argumento del setter) como un lazy initializer / updater function, y la EJECUTA para obtener el valor real — nunca la guarda como valor tal cual. Si la intención era guardar la función misma como el dato de estado (por ejemplo, un callback que se va a usar después), hay que envolverla explícitamente en otra función: `useState(() => miFuncion)`, para que React ejecute la función externa (que devuelve miFuncion) en vez de ejecutar miFuncion directamente.",
    respuestaEn:
      "React interprets ANY function passed as useState's argument (or as the setter's argument) as a lazy initializer / updater function, and CALLS it to get the actual value — it never stores it as-is. If the intent was to store the function itself as the state data (e.g. a callback to be used later), it needs to be explicitly wrapped in another function: `useState(() => myFunction)`, so React calls the outer function (which returns myFunction) instead of calling myFunction directly.",
    codigo: `function suma(a, b) { return a + b; }

// mal: React llama a suma() de inmediato, tratándola como lazy initializer
const [operacion, setOperacion] = useState(suma); // operacion = NaN o error

// bien: envuelta, React llama a la función externa, que devuelve suma sin ejecutarla
const [operacion, setOperacion] = useState(() => suma); // operacion = la función suma`,
    repregunta:
      "¿Dónde almacena React internamente el estado de cada useState, y por qué eso explica el bug de los hooks condicionales?",
    respuestaRepreguntaEs:
      "Cada fiber (la estructura interna de React que vimos en el módulo de Fiber) tiene una lista enlazada de 'hooks' colgando de él, uno por cada llamada a un hook en ese componente, en el mismo orden en que se llamaron la primera vez que el componente montó. En cada render, React avanza un puntero por esa lista enlazada, en el mismo orden, para saber qué nodo de la lista le corresponde a cada llamada de useState/useEffect/etc. Si el número o el orden de las llamadas a hooks cambia entre renders (por un hook condicional), el puntero avanza sobre nodos que no corresponden al hook que realmente se está llamando, devolviendo el estado equivocado o desalineando toda la lista para los hooks siguientes.",
    respuestaRepreguntaEn:
      "Each fiber (the internal React structure we saw in the Fiber module) has a linked list of 'hooks' hanging off it, one per hook call in that component, in the same order they were called the first time the component mounted. On every render, React advances a pointer through that linked list, in the same order, to know which list node corresponds to each useState/useEffect/etc. call. If the number or order of hook calls changes between renders (due to a conditional hook), the pointer advances over nodes that don't correspond to the hook actually being called, returning the wrong state or misaligning the whole list for subsequent hooks.",
  },
];
