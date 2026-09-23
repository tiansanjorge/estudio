import type { PreguntaEntrevista } from "../types";

export const entrevistaConcurrent: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema resuelve envolver una actualización con startTransition?",
    respuestaEs:
      "Evita que una actualización costosa (como re-renderizar una lista grande filtrada) bloquee una actualización urgente disparada en el mismo evento (como el valor de un input que el usuario está tipeando). Sin startTransition, ambas actualizaciones se tratan como una sola unidad de trabajo: el input no se pinta hasta que TODO termine. Con startTransition, React prioriza lo urgente y procesa lo marcado como transición en segundo plano, pudiendo incluso interrumpirla si llega algo más nuevo.",
    respuestaEn:
      "It prevents an expensive update (like re-rendering a large filtered list) from blocking an urgent update triggered in the same event (like the value of an input the user is typing into). Without startTransition, both updates are treated as a single unit of work: the input doesn't paint until EVERYTHING finishes. With startTransition, React prioritizes what's urgent and processes what's marked as a transition in the background, even being able to interrupt it if something newer comes in.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿en qué se diferencia una transición de un simple debounce para un buscador?",
    respuestaEs:
      "Un debounce retrasa CUÁNDO arranca el trabajo (espera a que el usuario deje de tipear un rato antes de disparar el filtro). Una transición puede arrancar de inmediato con cada tecla, pero si el usuario sigue interactuando antes de que termine de procesarse, React puede directamente descartar ese trabajo a medio hacer y arrancar de nuevo con el valor más reciente — sin gastar tiempo terminando un cálculo que ya iba a quedar obsoleto, y sin el delay artificial que introduce un debounce.",
    respuestaEn:
      "A debounce delays WHEN the work starts (it waits for the user to stop typing for a bit before triggering the filter). A transition can start immediately on every keystroke, but if the user keeps interacting before it finishes processing, React can just discard that half-done work and start over with the most recent value — without wasting time finishing a calculation that was already going to be obsolete, and without the artificial delay a debounce introduces.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué diferencia hay entre startTransition y useDeferredValue, si ambos 'despriorizan' trabajo?",
    respuestaEs:
      "startTransition envuelve una ACTUALIZACIÓN de estado que vos mismo disparás — lo usás cuando tenés control directo sobre el setState que querés marcar como no urgente. useDeferredValue envuelve un VALOR cuyo origen no controlás directamente (por ejemplo, una prop que viene de un componente padre, o un valor de un Context) — React internamente mantiene una versión 'diferida' de ese valor, que se actualiza con baja prioridad, mientras la versión inmediata sigue disponible para lo que sí necesite reaccionar al instante. Ambos usan el mismo mecanismo de lanes de baja prioridad por debajo, pero se aplican en puntos distintos: uno en el origen del cambio, el otro en el consumo de un valor que no originaste vos.",
    respuestaEn:
      "startTransition wraps a state UPDATE you trigger yourself — you use it when you have direct control over the setState you want to mark as non-urgent. useDeferredValue wraps a VALUE whose origin you don't directly control (e.g. a prop coming from a parent component, or a value from a Context) — React internally keeps a 'deferred' version of that value, updated with low priority, while the immediate version stays available for whatever needs to react instantly. Both use the same low-priority lanes mechanism underneath, but they apply at different points: one at the source of the change, the other at the consumption of a value you didn't originate.",
    codigo: `// startTransition: controlás el setState de origen
function manejarCambio(valor) {
  setQuery(valor); // urgente
  startTransition(() => setQueryFiltro(valor)); // no urgente
}

// useDeferredValue: no controlás el origen de "query" (viene por props)
function ListaFiltrada({ query }) {
  const queryDiferida = useDeferredValue(query);
  const resultados = filtrarListaGrande(queryDiferida);
}`,
    tradeoffs:
      "useDeferredValue es más simple de aplicar cuando no controlás el estado de origen, pero da menos control explícito que startTransition sobre exactamente qué actualización se despriorizada.",
    repregunta:
      "¿Cómo interactúa startTransition con Suspense cuando el contenido nuevo todavía no está listo?",
    respuestaRepreguntaEs:
      "Si una actualización envuelta en startTransition provoca que un componente 'suspenda' (lance una Promise porque sus datos todavía no llegaron), React NO muestra el fallback de Suspense inmediatamente como haría con una actualización normal — en cambio, mantiene visible el contenido ANTERIOR (la UI que ya estaba en pantalla) mientras el nuevo contenido se prepara en segundo plano, y expone isPending como true durante ese lapso. Recién cuando el contenido nuevo está listo, React reemplaza lo viejo por lo nuevo de una sola vez. Esto evita el parpadeo de mostrar un fallback de carga cada vez que se navega o cambia de pestaña, prefiriendo mantener la pantalla anterior visible un poco más de tiempo.",
    respuestaRepreguntaEn:
      "If an update wrapped in startTransition causes a component to 'suspend' (throw a Promise because its data hasn't arrived yet), React does NOT immediately show the Suspense fallback like it would with a normal update — instead, it keeps the PREVIOUS content visible (the UI that was already on screen) while the new content prepares in the background, exposing isPending as true during that time. Only once the new content is ready does React swap the old for the new all at once. This avoids the flicker of showing a loading fallback every time you navigate or switch tabs, preferring to keep the previous screen visible a bit longer.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué pasa si el usuario dispara una segunda transición antes de que la primera haya terminado de procesarse?",
    respuestaEs:
      "React no encola ambas transiciones para procesarlas una después de la otra: si la segunda transición vuelve obsoleto el resultado que la primera estaba calculando, React puede abandonar el trabajo en progreso de la primera y arrancar directamente con los datos de la segunda. El usuario nunca ve el resultado intermedio de la primera transición (que de todos modos ya no sería el correcto) — solo isPending se mantiene en true durante todo el proceso, hasta que la transición más reciente efectivamente termina.",
    respuestaEn:
      "React doesn't queue both transitions to process one after the other: if the second transition makes the result the first one was computing obsolete, React can abandon the first one's in-progress work and start directly with the second one's data. The user never sees the first transition's intermediate result (which wouldn't be correct anymore anyway) — isPending just stays true throughout the whole process, until the most recent transition actually finishes.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es 'tearing' en el contexto del renderizado concurrente, y por qué es un problema específico de las fuentes de estado externas a React?",
    respuestaEs:
      "Tearing es cuando distintas partes de la misma UI, en el mismo frame visible para el usuario, terminan mostrando valores inconsistentes de lo que debería ser un único estado compartido — por ejemplo, dos componentes que leen el mismo store externo, pero uno muestra el valor viejo y el otro el valor nuevo, porque el store cambió justo en medio de un render concurrente que React había pausado y retomado. React garantiza consistencia interna para su propio estado (useState, useReducer) porque controla completamente cuándo se aplican los cambios dentro de una actualización. Pero un store externo (una variable global, una librería de estado fuera del control de React) puede mutar en cualquier momento, incluso mientras un render está pausado a mitad de camino esperando para retomar — sin ningún mecanismo especial, dos partes del árbol podrían terminar leyendo ese store en momentos distintos de esa pausa, viendo valores diferentes.",
    respuestaEn:
      "Tearing is when different parts of the same UI, in the same frame visible to the user, end up showing inconsistent values of what should be a single shared piece of state — for example, two components reading the same external store, but one shows the old value and the other the new one, because the store changed right in the middle of a concurrent render React had paused and resumed. React guarantees internal consistency for its own state (useState, useReducer) because it fully controls when changes get applied within an update. But an external store (a global variable, a state library outside React's control) can mutate at any time, even while a render is paused midway waiting to resume — without any special mechanism, two parts of the tree could end up reading that store at different points during that pause, seeing different values.",
    codigo: `// riesgo de tearing: leer un store externo mutable directamente
let contadorGlobal = 0; // fuera de React, puede cambiar en cualquier momento

function ComponenteA() { return <p>{contadorGlobal}</p>; }
function ComponenteB() { return <p>{contadorGlobal}</p>; }
// si contadorGlobal cambia entre el render de A y el de B durante una pausa
// concurrente, ambos podrían mostrar valores distintos en el mismo frame`,
    repregunta:
      "¿Cómo evita useSyncExternalStore el problema de tearing con stores externos?",
    respuestaRepreguntaEs:
      "useSyncExternalStore obliga a que la lectura del store externo pase por una función de snapshot que React puede volver a invocar y verificar como parte de su propio proceso de render — específicamente, React chequea que el snapshot del store no haya cambiado entre el momento en que arrancó a renderizar y el momento en que confirma (commitea) esa actualización; si detecta que cambió en el medio, fuerza un re-render síncrono adicional para asegurar que TODOS los componentes que leen ese store, en esa misma actualización, terminen viendo la misma versión consistente del dato, cerrando la ventana donde el tearing podría ocurrir. Es la razón por la que librerías como Redux y Zustand migraron a usar este hook por debajo en vez de su propia lógica de suscripción ad-hoc.",
    respuestaRepreguntaEn:
      "useSyncExternalStore forces reading the external store through a snapshot function React can re-invoke and verify as part of its own render process — specifically, React checks that the store's snapshot hasn't changed between when it started rendering and when it commits that update; if it detects a change in between, it forces an additional synchronous re-render to make sure ALL components reading that store, within that same update, end up seeing the same consistent version of the data, closing the window where tearing could occur. This is why libraries like Redux and Zustand migrated to using this hook underneath instead of their own ad-hoc subscription logic.",
  },
];
