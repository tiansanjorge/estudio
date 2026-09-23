import type { PreguntaEntrevista } from "../types";

export const entrevistaReconciliation: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué dos reglas heurísticas usa React para reconciliar en vez de comparar árboles exhaustivamente?",
    respuestaEs:
      "Regla uno: elementos del mismo tipo en la misma posición se consideran 'el mismo' — React reutiliza la instancia y su estado, solo actualiza las props que cambiaron. Regla dos: elementos de tipo distinto en la misma posición se consideran árboles completamente distintos — React destruye la instancia vieja (con todo su estado) y monta una nueva desde cero. Ambas reglas evitan el costo de un diff exhaustivo de árboles, que sería computacionalmente muy caro.",
    respuestaEn:
      "Rule one: elements of the same type in the same position are considered 'the same' — React reuses the instance and its state, only updating the props that changed. Rule two: elements of different types in the same position are considered completely different trees — React destroys the old instance (with all its state) and mounts a new one from scratch. Both rules avoid the cost of an exhaustive tree diff, which would be computationally very expensive.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué un {condicion ? <FormularioA /> : <FormularioB />} pierde el estado interno de cualquiera de los dos al cambiar la condición?",
    respuestaEs:
      "Porque FormularioA y FormularioB son componentes de tipo distinto en la misma posición del árbol. Por la regla dos de reconciliación, cada vez que la condición cambia, React destruye por completo el que estaba montado (con cualquier estado interno que tuviera) y monta el otro desde cero — aunque visualmente ambos parezcan 'el mismo formulario en otro paso'.",
    respuestaEn:
      "Because FormularioA and FormularioB are components of different types in the same tree position. By reconciliation's rule two, every time the condition changes, React fully destroys the one that was mounted (with whatever internal state it had) and mounts the other from scratch — even if visually both look like 'the same form on a different step'.",
  },
  {
    nivel: 2,
    pregunta:
      "¿React compara realmente listas keyed con un solo pase O(n) simple, o hay algo más sofisticado por debajo?",
    respuestaEs:
      "Hay un refinamiento sobre la idea simple de 'solo usar keys': React primero intenta detectar rápidamente los casos comunes escaneando desde ambos extremos de la lista vieja y la nueva simultáneamente (buscando un prefijo y un sufijo que coincidan sin cambios) — esto resuelve gratis los casos de agregar o quitar elementos al final o al principio, sin necesitar ningún mapeo por key. Solo para la sección del medio que realmente cambió de orden, React arma un mapa de keys a elementos para hacer el diff más fino. Es una heurística en capas: rápida para los patrones más comunes (append, prepend, sin cambios), con un fallback más costoso solo para reordenamientos genuinos.",
    respuestaEn:
      "There's a refinement over the simple idea of 'just use keys': React first tries to quickly detect common cases by scanning from both ends of the old and new lists simultaneously (looking for a matching prefix and suffix with no changes) — this resolves append/prepend cases for free, without needing any key-based mapping. Only for the middle section that actually changed order does React build a map from keys to elements to do a finer diff. It's a layered heuristic: fast for the most common patterns (append, prepend, no changes), with a more expensive fallback only for genuine reorders.",
    codigo: `// caso rápido: agregar al final, sin reordenar nada existente
// viejo: [A, B, C]  nuevo: [A, B, C, D]
// React detecta el prefijo común [A, B, C] sin mapear keys, solo agrega D

// caso que necesita el mapa de keys: reordenamiento real
// viejo: [A, B, C]  nuevo: [C, A, B]`,
    tradeoffs:
      "Esta heurística en capas agrega complejidad interna al algoritmo, pero hace que los patrones más frecuentes (agregar/quitar al final) sean prácticamente gratis, reservando el costo del mapeo por key solo para los casos que realmente lo necesitan.",
    repregunta:
      "¿Qué pasa si un componente renderiza a veces un único elemento y a veces un array de elementos en la misma posición del árbol?",
    respuestaRepreguntaEs:
      "React trata la posición como si el 'tipo' cambiara entre un elemento suelto y una lista, aunque el contenido sea conceptualmente similar — esto puede generar destrucciones y remontajes innecesarios si no se maneja con cuidado. La práctica recomendada es ser consistente: si un valor puede eventualmente convertirse en una lista de más de un elemento, envolverlo siempre en un array (aunque tenga un solo ítem) desde el principio, para que React siempre reconcilie ese lugar del árbol como 'una lista', evitando el salto entre representaciones distintas en la misma posición.",
    respuestaRepreguntaEn:
      "React treats the position as if the 'type' changed between a single element and a list, even if the content is conceptually similar — this can cause unnecessary destruction and remounting if not handled carefully. The recommended practice is to be consistent: if a value could eventually become a list of more than one element, always wrap it in an array (even with a single item) from the start, so React always reconciles that spot in the tree as 'a list', avoiding the jump between different representations in the same position.",
    codigoRepregunta: `// riesgoso: salta entre elemento suelto y array según la cantidad
function Items({ items }) {
  return items.length === 1 ? items[0] : items.map((i) => <Item key={i.id} {...i} />);
}

// consistente: siempre lista, aunque tenga un solo elemento
function Items({ items }) {
  return items.map((i) => <Item key={i.id} {...i} />);
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿React.Children.map opera sobre children como si fuera siempre un array plano y predecible?",
    respuestaEs:
      "No exactamente — children es una estructura opaca que puede ser un único elemento, un array, un Fragment con más elementos adentro, texto, null, o cualquier combinación de esas cosas, según lo que el consumidor del componente haya pasado. React.Children.map (y utilidades relacionadas como React.Children.count u only) existen precisamente porque iterar children con .map de array normal fallaría o daría resultados inesperados si no es un array plano. Aun así, tienen sus propias limitaciones: React.Children.only lanza una excepción si recibe más de un hijo, y aplanar children con Fragments anidados no siempre produce el resultado 'intuitivo' que un desarrollador esperaría de un array plano común. Por eso, componentes que necesitan manipular children de forma compleja (reordenar, filtrar por tipo) suelen preferir pedir un array explícito como prop en vez de depender de children con esas utilidades.",
    respuestaEn:
      "Not exactly — children is an opaque structure that can be a single element, an array, a Fragment with more elements inside, text, null, or any combination of those, depending on what the component's consumer passed. React.Children.map (and related utilities like React.Children.count or only) exist precisely because iterating children with a normal array .map would fail or give unexpected results if it isn't a flat array. Even so, they have their own limitations: React.Children.only throws if it receives more than one child, and flattening children with nested Fragments doesn't always produce the 'intuitive' result a developer would expect from a plain flat array. That's why components needing to manipulate children in complex ways (reordering, filtering by type) usually prefer requesting an explicit array prop instead of relying on children with these utilities.",
    codigo: `function Grupo({ children }) {
  // children puede ser: un elemento, un array, un Fragment, texto, null...
  return React.Children.map(children, (hijo, i) => (
    <div key={i}>{hijo}</div>
  ));
}

<Grupo>
  <Item /> {/* children = un solo elemento */}
</Grupo>
<Grupo>
  <Item /><Item /> {/* children = array de dos elementos */}
</Grupo>`,
    repregunta:
      "¿Cómo interactúan reconciliation (identidad por tipo+posición/key) y React.memo (bail-out de re-render) en una lista de items memoizados?",
    respuestaRepreguntaEs:
      "Son dos mecanismos independientes que se complementan: reconciliation decide, para cada posición de la lista, qué instancia (fiber) de qué tipo corresponde reutilizar según la key — eso determina la IDENTIDAD. React.memo, aplicado a un componente item de esa lista, decide si vale la pena volver a EJECUTAR la función de ese componente cuando su identidad ya fue resuelta como 'el mismo de antes' — comparando sus props actuales contra las anteriores. Así, en una lista de 100 items donde solo uno cambió sus props, reconciliation resuelve que los 100 siguen siendo 'los mismos' (misma key, mismo tipo), y memo se encarga de que los 99 que no cambiaron props ni siquiera vuelvan a ejecutar su función — solo el que sí cambió corre de nuevo.",
    respuestaRepreguntaEn:
      "They're two independent mechanisms that complement each other: reconciliation decides, for each position in the list, which instance (fiber) of which type should be reused based on the key — that determines IDENTITY. React.memo, applied to an item component in that list, decides whether it's worth re-RUNNING that component's function once its identity was already resolved as 'the same as before' — by comparing its current props against the previous ones. So in a list of 100 items where only one changed its props, reconciliation resolves that all 100 are still 'the same' (same key, same type), and memo ensures the 99 that didn't change props don't even re-run their function — only the one that changed runs again.",
  },
];
