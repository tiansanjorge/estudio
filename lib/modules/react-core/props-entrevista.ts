import type { PreguntaEntrevista } from "../types";

export const entrevistaProps: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es 'props' en términos concretos de JavaScript?",
    respuestaEs:
      "Es simplemente el objeto que se le pasa como primer argumento a la función del componente. `<Tarjeta nombre=\"Ana\" activo={true} />` es, en el fondo, un llamado a `Tarjeta({ nombre: 'Ana', activo: true })`. No hay ningún mecanismo especial de React más allá de eso — es un objeto común, con destructuring y valores por defecto funcionando exactamente igual que en cualquier función de JS.",
    respuestaEn:
      "It's simply the object passed as the first argument to the component function. `<Card name=\"Ana\" active={true} />` is, underneath, a call to `Card({ name: 'Ana', active: true })`. There's no special React mechanism beyond that — it's a plain object, with destructuring and default values working exactly like in any JS function.",
    codigo: `function Tarjeta({ nombre, activo = false }) {
  return <div>{nombre} — {activo ? 'activo' : 'inactivo'}</div>;
}
// <Tarjeta nombre="Ana" /> equivale a Tarjeta({ nombre: 'Ana' })`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué el prop drilling es un problema de mantenimiento y no de performance?",
    respuestaEs:
      "Porque pasar un dato a través de varios componentes intermedios que no lo usan no hace que la app sea más lenta — React sigue renderizando eficientemente. El problema real es de acoplamiento: cada componente en el camino tiene que conocer y reenviar props que no le importan para nada, y si el dato en algún momento deja de ser necesario o cambia de forma, hay que tocar todos los componentes intermedios, no solo el que realmente lo usa.",
    respuestaEn:
      "Because passing a piece of data through several intermediate components that don't use it doesn't make the app slower — React still renders efficiently. The real problem is coupling: every component along the way has to know about and forward props that don't matter to it at all, and if the data ever stops being needed or changes shape, every intermediate component has to be touched, not just the one that actually uses it.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué riesgo tiene hacer spread de props sin filtrar (`{...props}`) sobre un elemento del DOM?",
    respuestaEs:
      "Cualquier prop que no sea un atributo HTML válido termina como un atributo desconocido en el DOM real, lo que React marca con un warning en consola (y en algunos casos, atributos no estándar simplemente se ignoran o generan comportamiento inesperado). Además, hacer spread ciego pierde el control sobre la API pública del componente: cualquiera puede pasarle cualquier prop, incluso una que colisione con una que el componente ya maneja internamente, sobreescribiéndola sin que sea obvio en el código de uso.",
    respuestaEn:
      "Any prop that isn't a valid HTML attribute ends up as an unknown attribute on the real DOM element, which React flags with a console warning (and in some cases, non-standard attributes are just ignored or cause unexpected behavior). It also loses control over the component's public API: anyone can pass any prop, even one that collides with one the component already handles internally, silently overriding it without that being obvious at the call site.",
    codigo: `function Boton({ children, ...resto }) {
  return <button {...resto}>{children}</button>;
  // si alguien pasa un prop "foo" no estándar, React lo pasa igual al <button>
}

<Boton foo="bar" onClick={() => {}} /> // "foo" termina como atributo DOM desconocido`,
    tradeoffs:
      "Spread de props es cómodo para componentes wrapper genéricos (design systems), pero sacrifica el control explícito sobre qué props son realmente parte de la API pensada del componente.",
    repregunta:
      "¿Cuándo conviene el patrón render props (children como función) en vez de un hook custom?",
    respuestaRepreguntaEs:
      "Hooks reemplazaron a render props para la mayoría de los casos de reuso de LÓGICA pura (sin necesidad de renderizar nada específico). Render props siguen siendo útiles cuando el componente que comparte el comportamiento también necesita controlar PARTE del renderizado o darle al consumidor acceso a datos calculados dentro de un contexto de render específico — por ejemplo, un componente `<Lista>` que sabe cómo paginar y ordenar, pero le deja al consumidor decidir cómo se ve cada fila, pasándole el item como argumento de una función children. Un hook podría dar la lógica de paginación, pero no resuelve tan naturalmente 'dame el ítem para que decidas el JSX' sin que el consumidor arme el loop de renderizado él mismo.",
    respuestaRepreguntaEn:
      "Hooks replaced render props for most cases of reusing pure LOGIC (without needing to render anything specific). Render props are still useful when the component sharing the behavior also needs to control PART of the rendering or give the consumer access to data computed within a specific render context — for example, a `<List>` component that knows how to paginate and sort, but lets the consumer decide how each row looks, passing it the item as a function-as-children argument. A hook could give the pagination logic, but doesn't as naturally solve 'here's the item, you decide the JSX' without the consumer building the render loop themselves.",
    codigoRepregunta: `function Lista({ items, children }) {
  return <ul>{items.map((item) => <li key={item.id}>{children(item)}</li>)}</ul>;
}

<Lista items={usuarios}>
  {(usuario) => <span>{usuario.nombre}</span>}
</Lista>`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué defaultProps en componentes de función está en desuso, y qué lo reemplaza?",
    respuestaEs:
      "defaultProps era la forma de dar valores por defecto en componentes de clase, y se soportaba también en componentes de función por compatibilidad, pero React (desde la versión 18 en adelante, y deprecado explícitamente en versiones más nuevas para componentes de función) recomienda usar valores por defecto en el destructuring de parámetros, que es JavaScript estándar y no requiere ninguna API especial de React. Es más simple, más explícito en el mismo lugar donde se leen los props, y no depende de una propiedad estática adicional que hay que recordar sincronizar con la firma del componente.",
    respuestaEn:
      "defaultProps was the way to give default values in class components, and was also supported on function components for compatibility, but React (from version 18 onward, and explicitly deprecated in newer versions for function components) recommends using default values in parameter destructuring, which is standard JavaScript and requires no special React API. It's simpler, more explicit right where the props are read, and doesn't depend on an extra static property that needs to be kept in sync with the component's signature.",
    codigo: `// en desuso
function Boton(props) { /* ... */ }
Boton.defaultProps = { variante: 'primario' };

// forma moderna
function Boton({ variante = 'primario' }) { /* ... */ }`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué `key` no está disponible como prop dentro del componente, aunque se le pase como si fuera uno?",
    respuestaEs:
      "`key` (junto con `ref` en componentes de función sin forwardRef) es un prop reservado que React intercepta antes de que llegue al objeto de props del componente — lo usa internamente para la reconciliación (identificar elementos entre renders de una lista) y nunca lo expone dentro de la función. Si necesitás ese mismo valor disponible dentro del componente para alguna lógica, hay que pasarlo también como un prop distinto con otro nombre (`id`, por ejemplo), porque leer `props.key` siempre da `undefined`.",
    respuestaEn:
      "`key` (along with `ref` on function components without forwardRef) is a reserved prop that React intercepts before it reaches the component's props object — it uses it internally for reconciliation (identifying elements between list renders) and never exposes it inside the function. If you need that same value available inside the component for some logic, you have to pass it also as a separate prop with a different name (e.g. `id`), because reading `props.key` always gives `undefined`.",
    codigo: `function Item({ id, key, nombre }) {
  console.log(key); // siempre undefined, aunque se pase key={id} al usarlo
  console.log(id); // el valor real, si se pasa por separado
  return <li>{nombre}</li>;
}

items.map((item) => <Item key={item.id} id={item.id} nombre={item.nombre} />)`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo funciona 'pasar contenido como prop' (children u otra prop de tipo JSX) para evitar re-renders innecesarios de una parte del árbol?",
    respuestaEs:
      "Cuando un componente padre re-renderiza por un cambio de estado LOCAL suyo, React todavía tiene que reconciliar sus hijos — pero si un elemento JSX se recibe como PROP (por ejemplo, `children`) en vez de crearse en el cuerpo del componente que cambió de estado, React ve que ese elemento es la misma referencia entre renders (porque quien lo creó, más arriba en el árbol, no volvió a ejecutarse) y puede saltear por completo la reconciliación de ese subárbol. Es la base del patrón 'levantar el contenido, no el estado': envolver una parte costosa del árbol en un componente que la recibe como children, en vez de definirla dentro del componente que cambia de estado seguido.",
    respuestaEn:
      "When a parent component re-renders due to its own LOCAL state change, React still has to reconcile its children — but if a JSX element is received as a PROP (e.g. `children`) instead of being created in the body of the component that changed state, React sees that element is the same reference between renders (because whoever created it, higher up in the tree, didn't re-run) and can completely skip reconciling that subtree. It's the basis of the 'lift content up, not state' pattern: wrap an expensive part of the tree in a component that receives it as children, instead of defining it inside the component that changes state frequently.",
    codigo: `function ContadorConHijoCostoso({ children }) {
  const [n, setN] = useState(0);
  return (
    <div>
      <button onClick={() => setN(n + 1)}>{n}</button>
      {children} {/* misma referencia entre renders: React la saltea */}
    </div>
  );
}

// en el padre, ArbolCostoso NO se re-crea cuando ContadorConHijoCostoso re-renderiza
<ContadorConHijoCostoso>
  <ArbolCostoso />
</ContadorConHijoCostoso>`,
  },
];
