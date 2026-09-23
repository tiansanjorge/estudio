import type { PreguntaEntrevista } from "../types";

export const entrevistaCuandoNoUsarEstadoGlobal: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué no todo el estado de una aplicación debería vivir en un store global (Redux, Zustand, o el que sea)?",
    respuestaEs:
      "Porque cada pieza de estado tiene un 'radio de influencia' natural, y forzarla a vivir en un store global cuando en realidad solo le importa a un componente (o a una rama chica del árbol) agrega acoplamiento y complejidad sin ningún beneficio real: cualquier componente de la app queda técnicamente habilitado para leer o modificar ese estado, dificultando razonar sobre quién lo cambia y por qué. El estado de un input mientras se escribe, si un dropdown está abierto, o en qué paso de un wizard local está el usuario, son ejemplos típicos de estado que debería quedarse en useState local, no subir a un store compartido por toda la app.",
    respuestaEn:
      "Because every piece of state has a natural 'radius of influence', and forcing it to live in a global store when it actually only matters to one component (or a small branch of the tree) adds coupling and complexity with no real benefit: any component in the app becomes technically able to read or modify that state, making it harder to reason about who changes it and why. An input's value while typing, whether a dropdown is open, or which step of a local wizard the user is on, are typical examples of state that should stay in local useState, not move up to a store shared by the whole app.",
    codigo: `// innecesario: nadie fuera de este componente necesita saber esto
useStoreGlobal((s) => s.dropdownAbierto);

// suficiente: es estado puramente local a este componente
const [abierto, setAbierto] = useState(false);`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué tipos de estado NO deberían vivir en Redux/Zustand aunque a veces se pongan ahí por costumbre?",
    respuestaEs:
      "Tres categorías principales: (1) estado de UI puramente local (un modal abierto, un acordeón expandido, el valor de un input mientras se escribe) — vive mejor en useState del componente correspondiente; (2) estado que se puede derivar en el URL (filtros de búsqueda, la página actual de una lista, un id seleccionado) — vive mejor en los query params, porque además se vuelve compartible por link y sobrevive a un refresh; (3) 'server state' (datos que vienen de una API) — vive mejor en una herramienta como TanStack Query, que resuelve cacheo y revalidación, en vez de copiarlo a mano en el store global.",
    respuestaEn:
      "Three main categories: (1) purely local UI state (an open modal, an expanded accordion, an input's value while typing) — lives better in the corresponding component's useState; (2) state that can be derived from the URL (search filters, a list's current page, a selected id) — lives better in query params, since it also becomes link-shareable and survives a refresh; (3) 'server state' (data coming from an API) — lives better in a tool like TanStack Query, which solves caching and revalidation, instead of manually copying it into the global store.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja concreta tiene guardar un filtro de búsqueda en la URL (query params) en vez de en un store global o en useState?",
    respuestaEs:
      "Tres ventajas que ni un store global ni useState dan de por sí: la URL resultante es COMPARTIBLE (mandarle el link a alguien reproduce exactamente el mismo filtro aplicado), sobrevive a un REFRESH de página (un store global en memoria o un useState se pierden al recargar, la URL no), y el botón de atrás/adelante del navegador funciona de forma natural para navegar entre estados de filtro anteriores, sin tener que implementar ese historial a mano. El costo es que solo se pueden guardar datos serializables a string, y hay límites prácticos de longitud de URL para estados muy complejos.",
    respuestaEn:
      "Three advantages neither a global store nor useState give by themselves: the resulting URL is SHAREABLE (sending someone the link reproduces the exact same applied filter), it survives a page REFRESH (an in-memory global store or a useState get lost on reload, the URL doesn't), and the browser's back/forward button naturally works to navigate between previous filter states, without implementing that history by hand. The cost is that only string-serializable data can be stored, and there are practical URL length limits for very complex state.",
    codigo: `// estado en la URL: compartible, sobrevive refresh, back/forward funciona solo
const searchParams = useSearchParams();
const categoria = searchParams.get('categoria');

router.push(\`?categoria=\${nuevaCategoria}\`);`,
    tradeoffs:
      "URL: compartible y persistente entre refreshes, pero limitado a datos serializables y con límites de longitud. Store global: sin esas limitaciones, pero no compartible por link ni persistente ante un refresh sin trabajo extra (localStorage, por ejemplo).",
    repregunta:
      "¿Qué costo real tiene 'levantar' estado a un store global antes de que exista una necesidad concreta de compartirlo entre componentes lejanos?",
    respuestaRepreguntaEs:
      "El costo principal es de ACOPLAMIENTO y de RE-RENDERS: cualquier componente que lea ese estado desde un store global (sin selectores bien granulares) queda potencialmente sujeto a re-renderizar por cambios que antes solo afectaban a un componente aislado, y cualquier otro componente de la app queda técnicamente habilitado para modificarlo, dificultando razonar sobre 'quién es responsable de este dato'. También hay un costo de indirección para quien lee el código: entender un estado local requiere mirar un solo componente; entender un estado global requiere rastrear todos los lugares de la app que lo leen o modifican. Levantarlo prematuramente paga ese costo sin ningún beneficio real todavía.",
    respuestaRepreguntaEn:
      "The main cost is COUPLING and RE-RENDERS: any component reading that state from a global store (without well-granular selectors) becomes potentially subject to re-rendering from changes that previously only affected an isolated component, and any other component in the app becomes technically able to modify it, making it harder to reason about 'who's responsible for this data'. There's also a reading-cost for whoever reads the code: understanding local state requires looking at one component; understanding global state requires tracing every place in the app that reads or modifies it. Lifting it prematurely pays that cost with no real benefit yet.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo SÍ tiene sentido usar una librería de estado global, entonces?",
    respuestaEs:
      "Cuando el estado realmente necesita ser leído o modificado desde componentes en ramas DISTINTAS y lejanas del árbol, sin una relación de ancestro-descendiente clara (por ejemplo, el usuario autenticado, el tema visual, el idioma, un carrito de compras accedido desde el header y desde la página de checkout). La señal concreta es: si tratar de 'levantar el estado' (lifting state up) al ancestro común más cercano terminaría subiéndolo casi hasta la raíz de la app, y de ahí bajarlo por props a través de muchos componentes intermedios que no lo usan (prop drilling severo), ese es el caso donde Context o una librería dedicada realmente aportan valor sobre mantenerlo local.",
    respuestaEn:
      "When state genuinely needs to be read or modified from components in DIFFERENT and distant branches of the tree, without a clear ancestor-descendant relationship (e.g. the authenticated user, the visual theme, the language, a shopping cart accessed from the header and from the checkout page). The concrete signal is: if trying to 'lift state up' to the nearest common ancestor would end up pushing it almost to the app's root, and from there passing it down through props across many intermediate components that don't use it (severe prop drilling), that's the case where Context or a dedicated library genuinely add value over keeping it local.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué framework de decisión (basado en 'colocation') usarías para decidir dónde debería vivir una pieza de estado nueva?",
    respuestaEs:
      "El principio de 'colocación de estado' (popularizado por Kent C. Dodds) propone moverse por niveles, empezando por el más chico, y solo subir de nivel cuando hay una necesidad real: (1) ¿puede ser una variable local dentro de la función del componente, sin ni siquiera useState (si no necesita disparar un re-render)? (2) ¿puede ser useState/useReducer local a ese componente? (3) ¿puede vivir en la URL, si es algo que tiene sentido compartir o preservar entre refreshes? (4) ¿necesita subir al padre común más cercano de los componentes que lo usan? (5) ¿de verdad necesita Context o una librería global, porque lo consumen ramas lejanas y no relacionadas del árbol? La regla práctica es no saltar a un nivel más alto sin haber descartado honestamente los anteriores — la mayoría del estado de una app típica termina resuelto en los primeros dos o tres niveles.",
    respuestaEn:
      "The 'state colocation' principle (popularized by Kent C. Dodds) proposes moving through levels, starting from the smallest, and only moving up a level when there's a genuine need: (1) can it be a local variable inside the component's function, without even useState (if it doesn't need to trigger a re-render)? (2) can it be local useState/useReducer to that component? (3) can it live in the URL, if it's something worth sharing or preserving across refreshes? (4) does it need to move up to the nearest common parent of the components using it? (5) does it genuinely need Context or a global library, because distant, unrelated branches of the tree consume it? The practical rule is not to jump to a higher level without honestly ruling out the previous ones — most of a typical app's state ends up resolved in the first two or three levels.",
    codigo: `// nivel 1: ni siquiera necesita estado, se recalcula cada render
function Lista({ items }) {
  const total = items.length; // no hace falta useState para esto
}

// nivel 5: solo si de verdad lo consumen ramas lejanas y no relacionadas
const useAuthStore = create((set) => ({ usuario: null, /* ... */ }));`,
    repregunta:
      "¿Cómo se relaciona esto con el antipatrón de guardar 'estado derivado' visto en el módulo de State — por qué a veces el problema no es DÓNDE vive el estado, sino que ni siquiera debería ser estado?",
    respuestaRepreguntaEs:
      "Es un caso especial y frecuente del framework de colocación: antes de preguntarse EN QUÉ NIVEL debería vivir un dato, hay que preguntarse si ese dato es realmente estado independiente, o si puede CALCULARSE a partir de estado/props que ya existen en algún nivel. Un total de un carrito, una lista filtrada, o un booleano de 'formulario válido' casi siempre se pueden derivar directamente durante el render (o memoizar con useMemo si el cálculo es costoso) a partir de datos que ya están en algún nivel de la jerarquía — promoverlos a estado propio, y encima subirlos a un store global 'por las dudas', combina dos errores de una sola vez: el dato innecesario en sí, y la ubicación innecesariamente alta en la jerarquía de estado.",
    respuestaRepreguntaEn:
      "It's a special and frequent case of the colocation framework: before asking WHAT LEVEL a piece of data should live at, you need to ask whether that data is actually independent state, or whether it can be COMPUTED from state/props that already exist at some level. A cart total, a filtered list, or a 'form is valid' boolean can almost always be derived directly during render (or memoized with useMemo if the computation is expensive) from data that already exists somewhere in the hierarchy — promoting them to their own state, and on top of that lifting them to a global store 'just in case', combines two mistakes at once: the unnecessary data itself, and its unnecessarily high position in the state hierarchy.",
  },
];
