import type { PreguntaEntrevista } from "../types";

export const entrevistaFiber: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema del reconciler anterior a React 16 vino a resolver Fiber?",
    respuestaEs:
      "Antes de Fiber, renderizar un árbol era una operación recursiva directa de JavaScript: una vez que arrancaba, no había forma de pausarla a mitad de camino, y para árboles grandes eso podía trabar perceptiblemente el hilo principal. Fiber reescribió ese motor como una estructura de datos explícita (cada componente tiene su propio 'fiber' con punteros a padre, hijo y hermano), permitiendo procesar el árbol en unidades de trabajo chicas que se pueden pausar, priorizar y retomar.",
    respuestaEn:
      "Before Fiber, rendering a tree was a direct JavaScript recursive operation: once it started, there was no way to pause it midway, and for large trees that could perceptibly freeze the main thread. Fiber rewrote that engine as an explicit data structure (each component has its own 'fiber' with pointers to parent, child, and sibling), allowing the tree to be processed in small units of work that can be paused, prioritized, and resumed.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿Fiber hace que un loop pesado dentro de un event handler deje de trabar la interfaz?",
    respuestaEs:
      "No. Fiber solo puede pausar y retomar el trabajo de RENDER que React mismo administra — no tiene forma de interrumpir un for síncrono de JavaScript corriendo dentro de un handler, porque ese código nunca le devuelve el control a React entre iteraciones. Si un cálculo pesado bloquea la interfaz, el fix es partirlo en pedazos y ceder el control explícitamente (con varios setTimeout, o APIs como requestIdleCallback), no confiar en que Fiber lo va a resolver solo.",
    respuestaEn:
      "No. Fiber can only pause and resume the RENDER work React itself manages — it has no way to interrupt a synchronous JS for loop running inside a handler, because that code never hands control back to React between iterations. If a heavy computation blocks the UI, the fix is splitting it into chunks and explicitly yielding control (with several setTimeouts, or APIs like requestIdleCallback), not relying on Fiber to solve it on its own.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es el 'double buffering' de Fiber (árbol current vs árbol work-in-progress)?",
    respuestaEs:
      "React mantiene DOS árboles de fibers al mismo tiempo: el árbol 'current' (el que corresponde a lo que está efectivamente en pantalla) y un árbol 'work-in-progress' (una copia donde React va calculando la próxima actualización, fiber por fiber). Mientras React trabaja en el árbol work-in-progress, el árbol current sigue intacto y siendo lo que el usuario ve — si por algún motivo ese trabajo en progreso se descarta (una prioridad mayor lo interrumpe, o directamente ya no hace falta), el árbol current nunca se vio afectado. Recién cuando el work-in-progress está completo, React lo 'intercambia' para que pase a ser el nuevo current, en Commit. Es la misma técnica de 'double buffering' usada en gráficos para evitar mostrar un frame a medio dibujar.",
    respuestaEn:
      "React keeps TWO fiber trees at the same time: the 'current' tree (matching what's actually on screen) and a 'work-in-progress' tree (a copy where React is computing the next update, fiber by fiber). While React works on the work-in-progress tree, the current tree stays intact and is what the user sees — if for some reason that work in progress gets discarded (a higher priority interrupts it, or it's simply no longer needed), the current tree was never affected. Only once the work-in-progress is complete does React 'swap' it to become the new current, during Commit. It's the same 'double buffering' technique used in graphics to avoid showing a half-drawn frame.",
    codigo: `// conceptual, no código real de React interno:
// arbolCurrent   -> lo que el usuario ve ahora mismo
// arbolWIP       -> copia donde React calcula la próxima actualización
// si arbolWIP se descarta a medio camino, arbolCurrent sigue intacto
// al terminar: arbolWIP pasa a ser el nuevo arbolCurrent (commit)`,
    tradeoffs:
      "Mantener dos árboles cuesta memoria extra comparado con mutar un solo árbol in-place, pero es lo que garantiza que un trabajo interrumpido o descartado nunca deje al usuario viendo una UI a medio actualizar.",
    repregunta:
      "¿Cómo decide React qué unidad de trabajo procesar primero cuando hay varias actualizaciones pendientes con distinta urgencia?",
    respuestaRepreguntaEs:
      "Con un sistema de 'lanes' (carriles): cada actualización se etiqueta con una prioridad según su origen — una interacción directa del usuario (click, tecla) tiene una lane de prioridad muy alta; una actualización envuelta en startTransition tiene una lane de prioridad baja; hay lanes intermedias para otros casos (reintentos de Suspense, por ejemplo). El bucle de trabajo de React siempre prioriza procesar primero las lanes de mayor prioridad, pudiendo pausar o posponer las de menor prioridad — esto es lo que hace posible que una transición pesada no bloquee la respuesta inmediata a un click, aunque ambas actualizaciones hayan sido disparadas casi al mismo tiempo.",
    respuestaRepreguntaEn:
      "With a 'lanes' system: each update gets tagged with a priority based on its origin — a direct user interaction (click, keypress) gets a very high-priority lane; an update wrapped in startTransition gets a low-priority lane; there are intermediate lanes for other cases (Suspense retries, for example). React's work loop always prioritizes processing higher-priority lanes first, being able to pause or postpone lower-priority ones — this is what makes it possible for a heavy transition to not block the immediate response to a click, even though both updates were triggered almost at the same time.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué React implementó su propio Scheduler en vez de usar requestIdleCallback del navegador para repartir el trabajo entre frames?",
    respuestaEs:
      "requestIdleCallback existe justamente para ejecutar trabajo de baja prioridad durante los ratos libres del navegador, que suena ideal para esto — pero su timing es inconsistente entre navegadores, dispara con demasiada poca frecuencia en algunos casos, y no da a React el nivel de control fino que necesita sobre cuándo ceder exactamente el control (por ejemplo, priorizar consistentemente por encima de animaciones o por debajo de inputs, según el tipo de trabajo). Por eso React construyó su propio paquete Scheduler, con su propia heurística de time-slicing implementada sobre APIs más predecibles (como MessageChannel), para tener control total sobre cómo se reparte el trabajo entre frames, sin depender de una API del navegador cuyo comportamiento no podían garantizar de forma consistente.",
    respuestaEn:
      "requestIdleCallback exists precisely to run low-priority work during the browser's idle time, which sounds ideal for this — but its timing is inconsistent across browsers, fires too infrequently in some cases, and doesn't give React the fine-grained control it needs over exactly when to yield (e.g. consistently prioritizing above animations or below inputs, depending on the type of work). That's why React built its own Scheduler package, with its own time-slicing heuristic implemented over more predictable APIs (like MessageChannel), to have full control over how work is split across frames, without depending on a browser API whose behavior they couldn't guarantee consistently.",
    repregunta:
      "Dentro del procesamiento de un único fiber, ¿qué diferencia hay entre la fase 'begin work' y la fase 'complete work'?",
    respuestaRepreguntaEs:
      "'Begin work' es la fase descendente (top-down): React entra a un fiber, ejecuta el render de ese componente si hace falta, y crea los fibers de sus hijos, bajando por el árbol. 'Complete work' es la fase ascendente (bottom-up): cuando un fiber ya no tiene más hijos por procesar, React 'completa' ese fiber (calculando su porción de las mutaciones necesarias, entre otras cosas) y sube al hermano o al padre. El recorrido completo de un render es, en esencia, bajar completando begin work en cada nivel y subir completando complete work una vez que se llega a las hojas — el mismo patrón de recorrido en profundidad que tendría una recursión normal, pero implementado con punteros explícitos en vez de la pila de llamadas de JavaScript, para poder pausarlo entre cualquiera de esos pasos.",
    respuestaRepreguntaEn:
      "'Begin work' is the descending phase (top-down): React enters a fiber, runs that component's render if needed, and creates its children's fibers, going down the tree. 'Complete work' is the ascending phase (bottom-up): once a fiber has no more children to process, React 'completes' that fiber (computing its portion of the needed mutations, among other things) and moves up to the sibling or parent. The whole render traversal is, in essence, going down completing begin work at each level and coming back up completing complete work once it reaches the leaves — the same depth-first traversal pattern a normal recursion would have, but implemented with explicit pointers instead of JavaScript's call stack, so it can be paused between any of those steps.",
  },
];
