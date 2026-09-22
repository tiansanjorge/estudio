import type { PreguntaEntrevista } from "../types";

export const entrevistaMemory: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué criterio usa el Garbage Collector de JavaScript para decidir qué liberar?",
    respuestaEs:
      "Reachability, no tiempo de vida ni tamaño: un objeto sigue vivo mientras exista al menos un camino de referencias desde un root (variables globales, el scope en ejecución, closures activas) hasta ese objeto. Si ningún camino lo alcanza, es basura recolectable. El algoritmo típico, mark-and-sweep, arranca desde los roots, marca todo lo alcanzable, y recolecta lo que quedó sin marcar — por eso hasta un ciclo de referencias entre dos objetos se recolecta si nadie externo los referencia.",
    respuestaEn:
      "Reachability, not lifetime or size: an object stays alive as long as there's at least one reference path from a root (global variables, the currently executing scope, active closures) to that object. If no path reaches it, it's garbage and eligible for collection. The typical algorithm, mark-and-sweep, starts from the roots, marks everything reachable, and collects whatever's left unmarked — that's why even a reference cycle between two objects gets collected if nothing external references them.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué patrón revisás primero cuando sospechás una fuga de memoria en frontend?",
    respuestaEs:
      "Reviso las fuentes clásicas de referencias que sobreviven de más: event listeners agregados pero nunca removidos, timers (setInterval/setTimeout) sin cancelar, y referencias a nodos del DOM guardadas en variables globales o caches que ya no deberían existir. En React, casi siempre es un efecto sin cleanup — algo que se suscribe en useEffect sin devolver la función que lo desuscribe.",
    respuestaEn:
      "I check the classic sources of references that outlive their usefulness: event listeners added but never removed, timers (setInterval/setTimeout) never cleared, and DOM node references stored in global variables or caches that shouldn't exist anymore. In React, it's almost always an effect without cleanup — something that subscribes in useEffect without returning the function that unsubscribes it.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué los motores de JS dividen el heap en una generación 'joven' y una 'vieja' para el Garbage Collector?",
    respuestaEs:
      "Es una optimización basada en una observación empírica: la mayoría de los objetos mueren jóvenes (variables temporales, resultados intermedios). V8 (y motores similares) asignan objetos nuevos en una generación joven pequeña, que se recolecta muy seguido con un algoritmo rápido (Scavenger). Los objetos que sobreviven varias rondas se 'promueven' a la generación vieja, que se recolecta con menos frecuencia usando Mark-Compact, más costoso pero justificado porque ahí hay menos basura por unidad de tiempo. El resultado neto es menos trabajo total de GC que tratar todo el heap por igual.",
    respuestaEn:
      "It's an optimization based on an empirical observation: most objects die young (temporary variables, intermediate results). V8 (and similar engines) allocate new objects in a small young generation, collected very frequently with a fast algorithm (Scavenger). Objects that survive several rounds get 'promoted' to the old generation, collected less often using Mark-Compact, which is more expensive but justified because there's less garbage per unit of time there. The net result is less total GC work than treating the whole heap uniformly.",
    tradeoffs:
      "Generational GC asume que la mayoría de las allocations son de corta vida — cierto para la mayoría de código de aplicación, pero un patrón que retiene muchos objetos temporales artificialmente (por ejemplo, una closure que no debería vivir tanto) los fuerza a la generación vieja, aumentando el costo de los ciclos de Mark-Compact.",
    repregunta:
      "¿En qué se diferencia un WeakMap de un Map para evitar fugas, y qué perdés a cambio?",
    respuestaRepreguntaEs:
      "Las claves de un WeakMap deben ser objetos, y esas referencias son 'débiles': no impiden que el Garbage Collector recolecte la clave si nada más la referencia, y en ese caso la entrada entera desaparece automáticamente del WeakMap. Un Map normal mantiene referencias fuertes: mientras el Map exista, todas sus claves y valores quedan vivos, aunque nadie más los use — una fuente típica de leaks si se usa como cache sin invalidación manual. Lo que se pierde con WeakMap es la posibilidad de iterar sus entradas o saber su tamaño (no tiene .size ni es iterable), precisamente porque su contenido puede desaparecer en cualquier momento por el GC.",
    respuestaRepreguntaEn:
      "A WeakMap's keys must be objects, and those references are 'weak': they don't stop the Garbage Collector from reclaiming the key if nothing else references it, and in that case the whole entry automatically disappears from the WeakMap. A regular Map holds strong references: as long as the Map exists, all its keys and values stay alive, even if nobody else uses them — a typical leak source when used as a cache without manual invalidation. What you lose with WeakMap is the ability to iterate its entries or know its size (no .size, not iterable), precisely because its contents can vanish at any time due to GC.",
    codigoRepregunta: `const cache = new WeakMap();

function calcular(elementoDom) {
  if (cache.has(elementoDom)) return cache.get(elementoDom);
  const resultado = costoso(elementoDom);
  cache.set(elementoDom, resultado);
  return resultado;
}
// si elementoDom se remueve del DOM y nadie más lo referencia,
// su entrada en cache desaparece sola — con un Map, quedaría para siempre`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo diagnosticarías con las DevTools del navegador que un componente desmontado sigue vivo en memoria?",
    respuestaEs:
      "Tomando dos heap snapshots en el mismo estado lógico de la app (por ejemplo, después de montar y desmontar el mismo componente varias veces) y usando la vista 'Comparison' para ver qué tipos de objetos crecieron en cantidad sin bajar. Si el componente (o algo que debería morir con él) sigue apareciendo, reviso sus 'retainers' — la cadena de referencias que lo mantiene vivo — para identificar qué listener, timer o cache externa lo está reteniendo.",
    respuestaEn:
      "By taking two heap snapshots in the same logical app state (e.g. after mounting and unmounting the same component several times) and using the 'Comparison' view to see which object types grew in count without dropping back. If the component (or something that should die with it) keeps showing up, I check its 'retainers' — the reference chain keeping it alive — to identify which listener, timer, or external cache is holding onto it.",
  },
  {
    nivel: 3,
    pregunta:
      "Si guardás una referencia a un solo nodo hijo de un árbol del DOM que ya se removió, ¿se libera el resto del árbol?",
    respuestaEs:
      "No necesariamente. Los nodos del DOM mantienen referencias bidireccionales entre padre e hijo (parentNode, childNodes). Si tu código conserva una referencia a un único nodo hijo de un subárbol que fue removido del documento, esa referencia alcanza hacia arriba a través de parentNode hasta la raíz del subárbol completo, y ese subárbol entero queda 'detached' pero vivo en memoria — no solo el nodo que guardaste explícitamente. Es una causa de leaks mucho más grande de lo esperado a partir de una sola referencia aparentemente inocente.",
    respuestaEn:
      "Not necessarily. DOM nodes hold bidirectional references between parent and child (parentNode, childNodes). If your code keeps a reference to a single child node of a subtree that was removed from the document, that reference reaches upward through parentNode all the way to the subtree's root, and that entire subtree stays 'detached' but alive in memory — not just the node you explicitly kept. It's a leak cause much larger than expected from one seemingly innocent reference.",
    codigo: `const arbol = document.getElementById('arbol-grande');
const hijoGuardado = arbol.querySelector('.item-100');

arbol.remove(); // se quita del documento visible

// hijoGuardado.parentNode sigue apuntando hacia arriba, y así
// sucesivamente hasta la raíz — todo "arbol" sigue vivo en memoria.`,
    repregunta:
      "¿Qué son WeakRef y FinalizationRegistry, y por qué no conviene depender de ellos para lógica de negocio?",
    respuestaRepreguntaEs:
      "WeakRef permite mantener una referencia a un objeto sin impedir que el GC lo recolecte, y FinalizationRegistry permite registrar un callback que corre después de que un objeto fue recolectado (por ejemplo, para liberar un recurso externo asociado). El problema es que la spec no garantiza CUÁNDO ni SI el callback de finalización va a correr — depende completamente de la heurística interna del motor, puede tardar arbitrariamente o directamente no ejecutarse antes de que el proceso termine. Por eso solo sirven para optimizaciones de 'mejor esfuerzo' (invalidar una entrada de cache, telemetría), nunca para lógica que la aplicación necesite que ocurra de forma determinística, como cerrar una conexión crítica.",
    respuestaRepreguntaEn:
      "WeakRef lets you keep a reference to an object without preventing the GC from collecting it, and FinalizationRegistry lets you register a callback that runs after an object has been collected (e.g. to release an associated external resource). The problem is the spec doesn't guarantee WHEN or IF the finalization callback will run — it depends entirely on the engine's internal heuristics, and it can take an arbitrary amount of time or simply never run before the process exits. That's why they're only good for 'best effort' optimizations (invalidating a cache entry, telemetry), never for logic the application needs to happen deterministically, like closing a critical connection.",
    codigoRepregunta: `const registro = new FinalizationRegistry((clave) => {
  console.log(\`\${clave} fue recolectado\`); // "mejor esfuerzo", sin timing garantizado
});

let objeto = { datos: 'grande' };
registro.register(objeto, 'objeto-1');
objeto = null; // candidato a GC, pero el callback puede tardar o no correr`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué un ciclo de Garbage Collection puede causar jank perceptible en la UI, y cómo lo mitigan los motores modernos?",
    respuestaEs:
      "Un mark-and-sweep clásico es 'stop-the-world': pausa la ejecución completa del programa (incluido el render) mientras recorre y marca todo el heap alcanzable, y esa pausa crece con el tamaño del heap. Motores modernos como V8 (con su recolector Orinoco) mueven la mayor parte del trabajo de marcado a ser incremental (se hace en pequeños pasos intercalados con la ejecución normal) y concurrente (en threads de background, en paralelo al hilo principal), dejando solo una breve 'pausa atómica' final para completar la recolección de forma consistente. El resultado es que un heap grande ya no se traduce directamente en un frame perdido.",
    respuestaEn:
      "A classic mark-and-sweep is 'stop-the-world': it pauses the entire program's execution (including rendering) while it traverses and marks the whole reachable heap, and that pause grows with heap size. Modern engines like V8 (with its Orinoco collector) move most of the marking work to be incremental (done in small steps interleaved with normal execution) and concurrent (on background threads, in parallel with the main thread), leaving only a brief final 'atomic pause' to complete collection consistently. The result is that a large heap no longer directly translates into a dropped frame.",
  },
];
