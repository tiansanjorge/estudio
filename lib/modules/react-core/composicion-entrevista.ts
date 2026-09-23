import type { PreguntaEntrevista } from "../types";

export const entrevistaComposicion: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa 'composición sobre configuración' en React?",
    respuestaEs:
      "Configuración es agregarle a un componente más y más props (típicamente booleanos) para que sepa renderizar cada variante posible internamente — escala mal porque el componente termina con una explosión combinatoria de casos condicionales. Composición es lo opuesto: dejar el componente simple y armar las variantes combinándolo con otras piezas chicas desde afuera (con children, con props que son JSX, o envolviéndolo en otro componente más específico). React no tiene herencia entre componentes; composición es la forma nativa de reutilizar y extender comportamiento.",
    respuestaEn:
      "Configuration means adding more and more props (typically booleans) to a component so it knows how to render every possible variant internally — it scales poorly because the component ends up with a combinatorial explosion of conditional cases. Composition is the opposite: keep the component simple and build variants by combining it with other small pieces from the outside (with children, with JSX props, or wrapping it in a more specific component). React has no inheritance between components; composition is the native way to reuse and extend behavior.",
    codigo: `// configuración: escala mal
function Boton({ variante, tamaño, conIcono, iconoPosicion }) { /* ... */ }

// composición: piezas específicas armadas sobre una base simple
function BotonPrimario(props) { return <Boton variante="primario" {...props} />; }
function BotonConIcono({ icono, children }) {
  return <Boton>{icono}{children}</Boton>;
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo usarías props con nombre en vez de children para pasar contenido?",
    respuestaEs:
      "children sirve para un único slot de contenido — cuando el componente solo necesita envolver 'lo que sea' en un único lugar. Cuando un componente necesita más de un punto de inserción independiente (por ejemplo, un panel dividido con contenido a la izquierda y a la derecha, o un layout con header/sidebar/contenido), un solo children no alcanza: ahí se usan props normales cuyo valor es JSX, cada una representando un slot distinto.",
    respuestaEn:
      "children works for a single content slot — when the component only needs to wrap 'whatever' in one single place. When a component needs more than one independent insertion point (e.g. a split panel with content on the left and right, or a layout with header/sidebar/content), a single children isn't enough: that's when you use regular props whose value is JSX, each one representing a different slot.",
    codigo: `function SplitPane({ izquierda, derecha }) {
  return (
    <div className="flex">
      <div>{izquierda}</div>
      <div>{derecha}</div>
    </div>
  );
}

<SplitPane izquierda={<Lista />} derecha={<Detalle />} />`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué son los Higher-Order Components (HOC), y por qué los hooks los reemplazaron en la mayoría de los casos?",
    respuestaEs:
      "Un HOC es una función que recibe un componente y devuelve otro componente, agregándole comportamiento (por ejemplo, `withAuth(Componente)` que inyecta el usuario logueado como prop). Antes de los hooks, era el patrón principal para compartir lógica con estado entre componentes. El problema: componer varios HOCs anidados genera 'wrapper hell' (una pila de componentes envolventes visible en las devtools), riesgo de colisión de nombres de props inyectadas entre distintos HOCs, y pérdida de tipado claro sobre qué props finalmente recibe el componente. Los hooks resuelven el mismo problema (compartir lógica con estado) sin agregar ningún componente extra al árbol ni wrapping — simplemente se llama la función dentro del componente que la necesita.",
    respuestaEn:
      "A HOC is a function that receives a component and returns another component, adding behavior to it (e.g. `withAuth(Component)` injecting the logged-in user as a prop). Before hooks, it was the main pattern for sharing stateful logic between components. The problem: composing several nested HOCs generates 'wrapper hell' (a stack of wrapping components visible in devtools), a risk of prop name collisions injected by different HOCs, and loss of clear typing over what props the component ultimately receives. Hooks solve the same problem (sharing stateful logic) without adding any extra component to the tree or wrapping — you just call the function inside the component that needs it.",
    codigo: `// HOC: agrega un componente extra al árbol, riesgo de colisión de props
const ComponenteConAuth = withAuth(withTema(MiComponente));

// hook: mismo resultado, sin wrapping ni componentes extra
function MiComponente() {
  const usuario = useAuth();
  const tema = useTema();
}`,
    tradeoffs:
      "HOCs siguen siendo útiles cuando la lógica compartida necesita controlar SI algo se renderiza o no (por ejemplo, un error boundary, que solo puede implementarse con una clase) — algo que un hook no puede hacer, porque un hook no puede evitar que el componente que lo llama renderice.",
    repregunta:
      "¿Qué es el patrón 'asChild' (o Slot) usado en librerías como Radix UI, y qué problema de composición resuelve?",
    respuestaRepreguntaEs:
      "Permite que un componente (por ejemplo, un `<Tooltip.Trigger>`) delegue qué elemento HTML final renderizar al hijo que se le pase, en vez de forzar siempre un `<button>` o `<div>` propio. Con `asChild`, el componente usa `React.cloneElement` internamente para fusionar sus props (handlers de eventos, atributos ARIA) con las del único elemento hijo recibido, en vez de envolverlo en un elemento extra. Resuelve el problema de que un componente de comportamiento (que sabe manejar clicks, teclado, accesibilidad) necesite renderizarse a veces como `<button>`, a veces como `<a>`, sin duplicar toda esa lógica de comportamiento para cada posible elemento final.",
    respuestaRepreguntaEn:
      "It lets a component (e.g. a `<Tooltip.Trigger>`) delegate which final HTML element to render to the child it's given, instead of always forcing its own `<button>` or `<div>`. With `asChild`, the component uses `React.cloneElement` internally to merge its props (event handlers, ARIA attributes) with the single child element it received, instead of wrapping it in an extra element. It solves the problem of a behavior component (that knows how to handle clicks, keyboard, accessibility) sometimes needing to render as a `<button>`, sometimes as an `<a>`, without duplicating all that behavior logic for every possible final element.",
    codigoRepregunta: `function Trigger({ asChild, children, ...props }) {
  if (asChild) {
    return React.cloneElement(children, { ...props, ...children.props });
  }
  return <button {...props}>{children}</button>;
}

<Trigger asChild><a href="/perfil">Ver perfil</a></Trigger>
// renderiza un <a>, no un <button>, pero con los handlers de Trigger fusionados`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja tiene tipar los slots de un componente compuesto con props explícitas en vez de un solo children genérico?",
    respuestaEs:
      "Con props con nombre (`{ izquierda: ReactNode; derecha: ReactNode }`), TypeScript puede exigir que ambos slots estén presentes (o marcarlos opcionales explícitamente), y el editor sugiere exactamente qué nombres de prop existen. Con children genérico, no hay forma de que el tipo exprese 'necesito exactamente dos elementos, uno para cada lado' — cualquier cantidad y tipo de children compila igual, y el error de uso incorrecto (olvidarse un slot, o pasar tres elementos cuando el layout espera dos) recién se nota visualmente en runtime, no en compilación.",
    respuestaEn:
      "With named props (`{ left: ReactNode; right: ReactNode }`), TypeScript can require both slots to be present (or mark them explicitly optional), and the editor suggests exactly which prop names exist. With generic children, there's no way for the type to express 'I need exactly two elements, one per side' — any amount and type of children compiles the same, and the misuse (forgetting a slot, or passing three elements when the layout expects two) is only noticed visually at runtime, not at compile time.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué riesgos tiene usar React.cloneElement para inyectar props en los children de un componente?",
    respuestaEs:
      "cloneElement asume que sabés exactamente qué elemento(s) va a recibir como children y de qué tipo son, para poder inyectarles props de forma segura. Si el consumidor pasa más de un hijo, un fragment, texto plano, o un componente que no espera esas props inyectadas, el comportamiento se rompe de formas no siempre obvias (props ignoradas, warnings de props desconocidas, o errores si el hijo espera un tipo de prop distinto). Es un patrón frágil que depende de una convención implícita entre el componente padre y lo que se le pasa como children — por eso, para casos más generales de coordinación entre padre e hijos, un compound component basado en Context es más robusto: no depende de la forma exacta del árbol de children, solo de que los hijos relevantes lean el Context correspondiente.",
    respuestaEn:
      "cloneElement assumes you know exactly what element(s) it will receive as children and what type they are, in order to safely inject props into them. If the consumer passes more than one child, a fragment, plain text, or a component that doesn't expect those injected props, the behavior breaks in ways that aren't always obvious (ignored props, unknown-prop warnings, or errors if the child expects a different prop type). It's a fragile pattern that depends on an implicit convention between the parent component and whatever gets passed as children — that's why, for more general parent-child coordination cases, a Context-based compound component is more robust: it doesn't depend on the exact shape of the children tree, only on the relevant children reading the corresponding Context.",
    codigo: `function Grupo({ children }) {
  // asume UN solo hijo con una prop "seleccionado" — se rompe si children es texto,
  // un array, o un componente que no acepta esa prop
  return React.cloneElement(children, { seleccionado: true });
}`,
  },
];
