import type { PreguntaEntrevista } from "../types";

export const entrevistaKeys: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Para qué usa React las keys en una lista, exactamente?",
    respuestaEs:
      "Para emparejar cada elemento de un render anterior con uno del render nuevo, y decidir qué instancia reutilizar (con su estado interno), qué actualizar y qué eliminar. Solo necesita ser única entre los elementos hermanos de esa lista puntual, no en toda la app — la misma key puede repetirse en listas distintas sin problema.",
    respuestaEn:
      "To match each element from a previous render with one from the new render, and decide which instance to reuse (with its internal state), which to update, and which to remove. It only needs to be unique among the sibling elements of that specific list, not across the whole app — the same key can repeat in different lists without issue.",
    codigo: `{tareas.map((tarea) => <Tarea key={tarea.id} data={tarea} />)}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo es aceptable usar el índice del array como key?",
    respuestaEs:
      "Solo cuando la lista es estrictamente estática: nunca se reordena, ni se inserta ni se elimina nada en el medio, y ningún elemento tiene estado propio (inputs, animaciones) que pueda quedar mal asociado. Fuera de ese caso puntual, uso siempre un identificador estable que le pertenece al dato (un id de base de datos, o un UUID generado al crear el item), no a su posición actual en el array.",
    respuestaEn:
      "Only when the list is strictly static: it never reorders, and nothing is inserted or removed in the middle, and no element has its own state (inputs, animations) that could end up mismatched. Outside that specific case, I always use a stable identifier that belongs to the data (a database id, or a UUID generated when the item was created), not its current position in the array.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo usarías deliberadamente la key para resetear el estado interno de un componente, sin manejarlo con un efecto?",
    respuestaEs:
      "Cambiando la key de un componente puntual (no de una lista) fuerza a React a desmontar la instancia vieja y montar una nueva desde cero, con todo su estado interno reinicializado — es una técnica intencional, no un bug. Es el patrón típico para un formulario de edición que se reutiliza entre distintos registros: en vez de escribir un useEffect que resetee manualmente cada pieza de estado cuando cambia el id del registro, se le pasa `key={registro.id}` al componente del formulario, y React hace el reset completo automáticamente al cambiar de registro.",
    respuestaEn:
      "Changing a single component's key (not a list's) forces React to unmount the old instance and mount a new one from scratch, with all its internal state reinitialized — it's an intentional technique, not a bug. It's the typical pattern for an edit form reused across different records: instead of writing a useEffect that manually resets every piece of state when the record's id changes, you pass `key={record.id}` to the form component, and React does the full reset automatically when switching records.",
    codigo: `function PaginaEdicion({ registroId }) {
  return <FormularioEdicion key={registroId} registroId={registroId} />;
  // al cambiar registroId, React desmonta el formulario viejo (con su estado)
  // y monta uno nuevo limpio, sin useEffect de reset manual
}`,
    tradeoffs:
      "Resetear con key es más simple que sincronizar estado con un efecto, pero tiene el costo de un desmontaje/montaje completo (pierde animaciones de transición y re-ejecuta todos los efectos de montaje) — para casos donde se necesita una transición suave entre estados, puede no ser lo ideal.",
    repregunta:
      "¿Por qué React puede resolver la reconciliación de listas en tiempo lineal (O(n)) en vez del algoritmo general de diffing de árboles, que es mucho más costoso?",
    respuestaRepreguntaEs:
      "El problema general de encontrar la diferencia mínima entre dos árboles es computacionalmente muy costoso (O(n³) con algoritmos clásicos). React evita ese costo apoyándose en dos heurísticas prácticas: primero, asume que elementos de tipos distintos producen árboles distintos (no intenta diffear el contenido interno de un `<div>` contra un `<span>`, directamente reemplaza). Segundo, para listas, usa las keys para emparejar elementos entre renders en vez de comparar por posición o por contenido — con eso, puede recorrer ambas listas una sola vez y saber exactamente qué mover, agregar o eliminar, en tiempo lineal. Sin keys estables, React tendría que asumir que todo cambió, perdiendo esa optimización.",
    respuestaRepreguntaEn:
      "The general problem of finding the minimum difference between two trees is computationally expensive (O(n³) with classic algorithms). React avoids that cost by relying on two practical heuristics: first, it assumes elements of different types produce different trees (it doesn't try to diff a `<div>`'s internal content against a `<span>`'s, it just replaces directly). Second, for lists, it uses keys to match elements between renders instead of comparing by position or content — with that, it can walk both lists once and know exactly what to move, add, or remove, in linear time. Without stable keys, React would have to assume everything changed, losing that optimization.",
    codigoRepregunta: `// sin keys estables, React asume que todo cambió: O(n) remontajes completos
// con keys estables, React sabe exactamente qué se movió: O(n) actualizaciones mínimas`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo le ponés una key a un elemento de lista que necesita renderizar más de un nodo raíz (por ejemplo, un <dt> y un <dd>)?",
    respuestaEs:
      "Con un Fragment explícito que acepte key: `<React.Fragment key={id}>`. El Fragment abreviado (`<>...</>`) no acepta props, así que si un item de la lista necesita más de un elemento raíz sin envolverlos en un div extra, hace falta la forma larga de Fragment específicamente para poder pasarle la key.",
    respuestaEn:
      "With an explicit Fragment that accepts key: `<React.Fragment key={id}>`. The short Fragment syntax (`<>...</>`) doesn't accept props, so if a list item needs more than one root element without wrapping them in an extra div, you need the long Fragment form specifically to be able to pass the key.",
    codigo: `{items.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.termino}</dt>
    <dd>{item.definicion}</dd>
  </React.Fragment>
))}`,
  },
  {
    nivel: 3,
    pregunta:
      "Si combinás items de dos fuentes de datos distintas (usuarios y productos) en una sola lista renderizada, ¿qué riesgo hay si ambos usan 'id' como key sin modificar?",
    respuestaEs:
      "Las keys solo necesitan ser únicas entre HERMANOS de esa lista puntual — pero si estás combinando dos arrays de fuentes distintas en un solo array renderizado, y ambos tienen ids que pueden coincidir numéricamente (un usuario con id 1 y un producto con id 1), usar el id crudo como key genera una colisión real: React ve dos elementos hermanos con la misma key y no puede distinguirlos, generando el comportamiento indefinido típico de keys duplicadas (mezcla de estado entre ambos, warning en consola). El fix es namespacar la key con el tipo de entidad: `key={`usuario-${u.id}`}` y `key={`producto-${p.id}`}`.",
    respuestaEn:
      "Keys only need to be unique among SIBLINGS in that specific list — but if you're combining two arrays from different sources into a single rendered array, and both have ids that can numerically coincide (a user with id 1 and a product with id 1), using the raw id as key creates a real collision: React sees two sibling elements with the same key and can't tell them apart, causing the typical undefined behavior of duplicate keys (state mixing between both, console warning). The fix is to namespace the key with the entity type: `key={`user-${u.id}`}` and `key={`product-${p.id}`}`.",
    codigo: `const combinados = [...usuarios, ...productos];

// riesgoso: usuario.id=1 y producto.id=1 colisionan como key
combinados.map((item) => <Fila key={item.id} data={item} />);

// seguro: namespaced por tipo de entidad
combinados.map((item) => (
  <Fila key={\`\${item.tipo}-\${item.id}\`} data={item} />
));`,
  },
];
