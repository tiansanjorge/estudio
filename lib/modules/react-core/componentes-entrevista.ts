import type { PreguntaEntrevista } from "../types";

export const entrevistaComponentes: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es, técnicamente, un componente de React?",
    respuestaEs:
      "Una función de JavaScript que recibe un objeto de props y retorna una descripción de UI (JSX, que se compila a llamados a React.createElement). React llama a esa función y usa lo que devuelve para construir un árbol de elementos, donde cada nodo es una etiqueta nativa del DOM o otro componente propio. No hay nada mágico en la función en sí — la 'magia' está en cómo React la orquesta: cuándo la llama, cómo compara lo que devuelve entre renders, y cuándo decide actualizar el DOM real.",
    respuestaEn:
      "A JavaScript function that receives a props object and returns a UI description (JSX, which compiles to React.createElement calls). React calls that function and uses what it returns to build a tree of elements, where each node is either a native DOM tag or another component of your own. There's nothing magic about the function itself — the 'magic' is in how React orchestrates it: when it calls it, how it compares what it returns between renders, and when it decides to update the real DOM.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo decidís extraer un componente nuevo en vez de dejar el JSX inline?",
    respuestaEs:
      "Principalmente por dos señales: cuando veo el mismo bloque de JSX repetido con datos distintos (reutilización), o cuando un bloque tiene su propia responsabilidad clara y separarlo hace más legible al componente padre, aunque solo se use una vez (organización). No extraigo componentes solo por 'línea de código' — eso a veces empeora la legibilidad al forzar al lector a saltar entre archivos para seguir un flujo que era simple de leer junto.",
    respuestaEn:
      "Mainly for two signals: when I see the same JSX block repeated with different data (reuse), or when a block has its own clear responsibility and separating it makes the parent component more readable, even if it's only used once (organization). I don't extract components purely by 'line count' — that sometimes worsens readability by forcing the reader to jump between files to follow a flow that was simple to read together.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene un componente controlado vs uno no controlado (con ref) para un input?",
    respuestaEs:
      "Un componente controlado (el valor vive en un useState y se actualiza en cada onChange) tiene sentido cuando necesitás reaccionar a cada cambio en tiempo real: validación inline, formatear el valor mientras se escribe, deshabilitar un botón según el contenido. Un componente no controlado (el DOM maneja su propio valor, y lo leés con una ref solo cuando hace falta, típicamente al enviar el formulario) evita un re-render de React en cada tecla — relevante en formularios grandes donde controlar cada campo genera renders innecesarios del árbol completo del formulario en cada letra tipeada.",
    respuestaEn:
      "A controlled component (the value lives in useState and updates on every onChange) makes sense when you need to react to every change in real time: inline validation, formatting the value as it's typed, disabling a button based on content. An uncontrolled component (the DOM manages its own value, and you read it with a ref only when needed, typically on form submit) avoids a React re-render on every keystroke — relevant in large forms where controlling every field generates unnecessary re-renders of the whole form tree on every letter typed.",
    codigo: `// controlado: re-render en cada tecla, útil para validación en vivo
function InputControlado() {
  const [valor, setValor] = useState('');
  return <input value={valor} onChange={(e) => setValor(e.target.value)} />;
}

// no controlado: sin re-render por tecla, se lee solo al enviar
function InputNoControlado() {
  const ref = useRef<HTMLInputElement>(null);
  function enviar() { console.log(ref.current?.value); }
  return <input ref={ref} defaultValue="" />;
}`,
    tradeoffs:
      "Controlado: reactividad inmediata, más renders. No controlado: menos renders, pero perdés la capacidad de reaccionar a cada cambio sin escuchar eventos del DOM manualmente.",
    repregunta:
      "¿Qué es el patrón 'compound components' (como Tabs/Tab o Select/Option), y qué problema de props resuelve?",
    respuestaRepreguntaEs:
      "Es un patrón donde varios componentes relacionados (un componente padre y sus hijos) comparten estado implícito a través de Context, en vez de que el padre le pase explícitamente cada dato a cada hijo por props. Por ejemplo, `<Tabs>` mantiene cuál tab está activo y lo expone por Context; cada `<Tab>` hijo lo lee sin que `<Tabs>` tenga que pasarle props individuales a cada uno ni que el consumidor tenga que gestionar ese estado manualmente. Resuelve el problema de una API con muchos props de coordinación (activeIndex, onTabChange, etc.) reemplazándola por una composición declarativa donde la relación entre padre e hijos es implícita pero clara por convención de uso.",
    respuestaRepreguntaEn:
      "It's a pattern where several related components (a parent and its children) share implicit state through Context, instead of the parent explicitly passing each piece of data to each child via props. For example, `<Tabs>` keeps track of which tab is active and exposes it via Context; each child `<Tab>` reads it without `<Tabs>` needing to pass individual props to each one, or the consumer needing to manage that state manually. It solves the problem of an API with many coordination props (activeIndex, onTabChange, etc.) by replacing it with declarative composition where the parent-child relationship is implicit but clear by usage convention.",
    codigoRepregunta: `const TabsContext = createContext(null);

function Tabs({ children }) {
  const [activo, setActivo] = useState(0);
  return <TabsContext.Provider value={{ activo, setActivo }}>{children}</TabsContext.Provider>;
}

function Tab({ index, children }) {
  const { activo, setActivo } = useContext(TabsContext);
  return <button onClick={() => setActivo(index)}>{children}</button>;
}

// uso: <Tabs><Tab index={0}>Uno</Tab><Tab index={1}>Dos</Tab></Tabs>`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué riesgo tiene descomponer un componente en demasiados subcomponentes muy chicos, demasiado pronto?",
    respuestaEs:
      "Cada componente extra agrega un nivel de indirección: para seguir el flujo de datos o entender qué hace una pantalla, el lector tiene que saltar entre más archivos, y a menudo termina reintroduciendo el prop drilling que se quería evitar (props que solo existen para atravesar 2-3 componentes intermedios). La descomposición temprana también puede fijar límites de responsabilidad que después no encajan con cómo el diseño realmente evoluciona, forzando a rearmar la jerarquía. Suele ser mejor esperar a que la necesidad de reutilización o de separar responsabilidades sea concreta, en vez de descomponer 'preventivamente'.",
    respuestaEn:
      "Every extra component adds a level of indirection: to follow the data flow or understand what a screen does, the reader has to jump between more files, and often ends up reintroducing the prop drilling that was meant to be avoided (props that only exist to pass through 2-3 intermediate components). Early decomposition can also lock in responsibility boundaries that later don't fit how the design actually evolves, forcing the hierarchy to be reworked. It's usually better to wait until the need for reuse or separation of concerns is concrete, instead of decomposing 'preventively'.",
  },
  {
    nivel: 3,
    pregunta:
      "Si dos ramas de un if renderizan componentes DISTINTOS en la misma posición del árbol, ¿React actualiza el existente o lo reemplaza?",
    respuestaEs:
      "Lo reemplaza por completo: desmonta la instancia del tipo anterior (perdiendo todo su estado interno y ejecutando su cleanup de efectos) y monta una instancia nueva del tipo actual, aunque estén en la misma posición del árbol y semánticamente representen 'lo mismo' desde el punto de vista del usuario. React decide reconciliar o reemplazar comparando el TIPO del elemento en cada posición, no su intención — si el tipo cambia (de `<Boton>` a `<a>`, o de `<FormularioA>` a `<FormularioB>`), es un reemplazo completo, no una actualización incremental.",
    respuestaEn:
      "It replaces it entirely: it unmounts the previous type's instance (losing all its internal state and running its effects' cleanup) and mounts a new instance of the current type, even if they're in the same tree position and semantically represent 'the same thing' from the user's point of view. React decides whether to reconcile or replace by comparing the element's TYPE at each position, not its intent — if the type changes (from `<Button>` to `<a>`, or from `<FormA>` to `<FormB>`), it's a full replacement, not an incremental update.",
    codigo: `function Formulario({ modoEdicion }) {
  // si modoEdicion cambia, React desmonta uno y monta el otro por completo
  return modoEdicion ? <FormularioEdicion /> : <FormularioLectura />;
  // el estado interno de cualquiera de los dos se pierde al cambiar de rama
}`,
    repregunta:
      "¿Por qué React.memo a veces no evita un re-render aunque las props 'no cambiaron' desde el punto de vista del desarrollador?",
    respuestaRepreguntaEs:
      "React.memo hace una comparación superficial (shallow equality) de cada prop entre renders. Si una prop es un objeto, array o función creado inline en el JSX del padre (`<Hijo config={{ a: 1 }} />` o `<Hijo onClick={() => ...}>`), esa prop es una referencia NUEVA en cada render del padre, aunque su contenido sea idéntico — shallow equality los ve como distintos, y memo no evita el re-render. Para que memo funcione en esos casos, hace falta estabilizar esas referencias en el padre con useMemo (para objetos/arrays) o useCallback (para funciones), o levantar esos valores fuera del componente si son verdaderamente constantes.",
    respuestaRepreguntaEn:
      "React.memo does a shallow equality comparison of each prop between renders. If a prop is an object, array, or function created inline in the parent's JSX (`<Child config={{ a: 1 }} />` or `<Child onClick={() => ...}>`), that prop is a NEW reference on every parent render, even if its content is identical — shallow equality sees them as different, and memo doesn't prevent the re-render. For memo to work in those cases, those references need to be stabilized in the parent with useMemo (for objects/arrays) or useCallback (for functions), or hoisted outside the component if they're truly constant.",
    codigoRepregunta: `const Hijo = React.memo(function Hijo({ onClick }) { /* ... */ });

function Padre() {
  // nueva función en cada render de Padre: memo no evita el re-render de Hijo
  return <Hijo onClick={() => console.log('click')} />;
}

function PadreOptimizado() {
  const manejarClick = useCallback(() => console.log('click'), []);
  return <Hijo onClick={manejarClick} />; // referencia estable: memo sí funciona
}`,
  },
];
