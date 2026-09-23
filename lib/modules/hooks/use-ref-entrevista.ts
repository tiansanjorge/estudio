import type { PreguntaEntrevista } from "../types";

export const entrevistaUseRef: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace useRef, y en qué se diferencia fundamentalmente de useState?",
    respuestaEs:
      "useRef devuelve un objeto mutable con una única propiedad, `.current`, que persiste entre renders — igual que useState. La diferencia clave: cambiar `ref.current` NUNCA dispara un re-render, mientras que llamar al setter de useState siempre programa uno (salvo el caso puntual de Object.is con el mismo valor primitivo). useRef sirve para guardar datos que necesitan sobrevivir entre renders pero que NO deberían afectar visualmente lo que se muestra en pantalla.",
    respuestaEn:
      "useRef returns a mutable object with a single property, `.current`, that persists between renders — just like useState. The key difference: changing `ref.current` NEVER triggers a re-render, while calling useState's setter always schedules one (except for the specific Object.is-same-primitive-value case). useRef is for storing data that needs to survive between renders but that shouldn't visually affect what's shown on screen.",
    codigo: `const contadorClicks = useRef(0);

function manejarClick() {
  contadorClicks.current++; // no dispara ningún render
  console.log('clicks totales:', contadorClicks.current);
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿para qué usarías useRef sobre un elemento del DOM?",
    respuestaEs:
      "Para acceder directamente a un nodo del DOM cuando algo que React no maneja lo necesita: poner foco en un input al montar, medir el tamaño de un elemento, integrar una librería externa que espera un nodo del DOM real (un gráfico, un editor de texto enriquecido). Se pasa el ref como prop especial (`<input ref={miRef} />`), y React lo conecta al nodo real durante el commit — antes de eso, `miRef.current` es `null`.",
    respuestaEn:
      "To directly access a DOM node when something React doesn't manage needs it: focusing an input on mount, measuring an element's size, integrating an external library that expects a real DOM node (a chart, a rich text editor). The ref is passed as a special prop (`<input ref={myRef} />`), and React connects it to the real node during commit — before that, `myRef.current` is `null`.",
    codigo: `function CampoConFoco() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus(); // ya conectado al DOM real, después del commit
  }, []);

  return <input ref={inputRef} />;
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo elegirías useRef en vez de useState para un valor, si ambos persisten entre renders?",
    respuestaEs:
      "La pregunta clave es: ¿el usuario necesita VER este valor reflejado en la UI? Si sí, tiene que ser useState — solo un cambio de estado dispara el re-render que actualiza lo que se muestra. Si el valor es puramente interno al funcionamiento del componente y nunca se muestra directamente (el id de un setInterval para poder cancelarlo después, el valor anterior de una prop para compararlo, un contador de reintentos que solo se loguea), useRef es más apropiado: evita re-renders innecesarios que useState causaría sin ningún beneficio visual.",
    respuestaEn:
      "The key question is: does the user need to SEE this value reflected in the UI? If yes, it has to be useState — only a state change triggers the re-render that updates what's shown. If the value is purely internal to how the component works and never displayed directly (a setInterval's id so it can be cancelled later, a prop's previous value for comparison, a retry counter that's only logged), useRef is more appropriate: it avoids unnecessary re-renders useState would cause with no visual benefit.",
    codigo: `// useState: el usuario ve "cargando..." mientras esto es true
const [cargando, setCargando] = useState(false);

// useRef: nadie ve directamente el id del timer, solo hace falta para cancelarlo
const timerId = useRef(null);`,
    tradeoffs:
      "useState mantiene la UI sincronizada con el dato a costa de un re-render por cambio; useRef evita ese costo, pero si el componente necesita reaccionar visualmente a ese cambio más adelante, hay que migrarlo a useState — no se puede 'leer' un cambio de ref para actualizar el render.",
    repregunta:
      "En React 19, ¿sigue haciendo falta forwardRef para pasarle un ref a un componente de función propio?",
    respuestaRepreguntaEs:
      "No, ya no. Antes de React 19, un componente de función no podía recibir `ref` como una prop más — React lo interceptaba especialmente, y para 'reenviarlo' al DOM interno del componente hacía falta envolverlo explícitamente en `forwardRef((props, ref) => ...)`. Desde React 19, `ref` se puede declarar y recibir como cualquier otro prop en un componente de función, sin necesitar forwardRef — simplificando el patrón para componentes de librerías de UI que necesitan exponer un nodo del DOM interno al que los usa.",
    respuestaRepreguntaEn:
      "No, not anymore. Before React 19, a function component couldn't receive `ref` like any other prop — React intercepted it specially, and to 'forward' it to the component's internal DOM you had to explicitly wrap it in `forwardRef((props, ref) => ...)`. Since React 19, `ref` can be declared and received like any other prop in a function component, without needing forwardRef — simplifying the pattern for UI library components that need to expose an internal DOM node to whoever uses them.",
    codigoRepregunta: `// React 19: ref como prop normal, sin forwardRef
function Boton({ ref, children }) {
  return <button ref={ref}>{children}</button>;
}

// antes de React 19, hacía falta:
const Boton = forwardRef(({ children }, ref) => <button ref={ref}>{children}</button>);`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es useImperativeHandle, y qué problema resuelve cuando un componente expone un ref hacia afuera?",
    respuestaEs:
      "Cuando un componente reenvía un ref a su nodo del DOM interno, el consumidor externo obtiene acceso al nodo del DOM COMPLETO — todos sus métodos nativos, sin ningún control sobre qué se expone. `useImperativeHandle` permite personalizar exactamente qué valor recibe quien usa ese ref: en vez de exponer el nodo del DOM entero, se puede exponer un objeto custom con solo los métodos que tiene sentido que el consumidor externo llame (por ejemplo, un `focus()` y un `scrollIntoView()` propios, pero no acceso directo a manipular estilos o atributos internos del componente). Es la forma de mantener una API pública controlada para un componente reutilizable, en vez de filtrar toda su implementación interna a través del ref.",
    respuestaEn:
      "When a component forwards a ref to its internal DOM node, the external consumer gets access to the ENTIRE DOM node — all its native methods, with no control over what's exposed. `useImperativeHandle` lets you customize exactly what value whoever uses that ref receives: instead of exposing the whole DOM node, you can expose a custom object with only the methods that make sense for the external consumer to call (e.g. your own `focus()` and `scrollIntoView()`, but no direct access to manipulate the component's internal styles or attributes). It's how you keep a controlled public API for a reusable component, instead of leaking its whole internal implementation through the ref.",
    codigo: `function CampoConLimpiar({ ref }) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    limpiar: () => { inputRef.current.value = ''; },
    // el nodo real del input NO se expone directamente
  }));

  return <input ref={inputRef} />;
}`,
    repregunta:
      "¿Qué diferencia hay entre un ref de objeto (useRef) y un ref de función (callback ref), y cuándo conviene el segundo?",
    respuestaRepreguntaEs:
      "Un ref de objeto (`useRef(null)`) es un contenedor pasivo: React le asigna `.current` al montar y lo pone en `null` al desmontar, pero nada 'avisa' activamente cuando eso pasa — hay que leerlo dentro de un efecto. Un ref de función (`ref={(nodo) => { ... }}`) es una callback que React INVOCA directamente con el nodo real al montar, y con `null` al desmontar — permite reaccionar al momento exacto de conexión/desconexión sin necesitar un useEffect aparte. Conviene especialmente para listas dinámicas de elementos donde se necesita un ref por cada item (guardando cada nodo en un Map dentro de la función), o para medir un elemento apenas se monta, sin esperar al siguiente ciclo de efectos.",
    respuestaRepreguntaEn:
      "An object ref (`useRef(null)`) is a passive container: React assigns `.current` on mount and sets it to `null` on unmount, but nothing actively 'notifies' when that happens — you have to read it inside an effect. A callback ref (`ref={(node) => { ... }}`) is a function React CALLS directly with the real node on mount, and with `null` on unmount — letting you react to the exact moment of connection/disconnection without needing a separate useEffect. It's especially useful for dynamic lists of elements where you need a ref per item (storing each node in a Map inside the function), or to measure an element right as it mounts, without waiting for the next effects cycle.",
    codigoRepregunta: `function Lista({ items }) {
  const nodos = useRef(new Map());

  return items.map((item) => (
    <div
      key={item.id}
      ref={(nodo) => {
        if (nodo) nodos.current.set(item.id, nodo);
        else nodos.current.delete(item.id); // se llama con null al desmontar
      }}
    >
      {item.nombre}
    </div>
  ));
}`,
  },
];
