import type { PreguntaEntrevista } from "../types";

export const entrevistaEventLoop: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es el Event Loop y por qué existe en JavaScript?",
    respuestaEs:
      "JavaScript corre en un único hilo, así que no puede bloquearse esperando una operación lenta (una request, un timer). El Event Loop es el mecanismo que permite delegar esas operaciones a APIs externas (del navegador o de Node) y retomar sus callbacks más tarde, sin frenar la ejecución del resto del programa. Es lo que hace posible que JS sea asincrónico sin ser multi-hilo.",
    respuestaEn:
      "JavaScript runs on a single thread, so it can't block waiting for a slow operation like a request or a timer. The Event Loop is the mechanism that offloads those operations to external APIs (browser or Node) and resumes their callbacks later, without stalling the rest of the program. It's what makes JS asynchronous without being multi-threaded.",
    tradeoffs:
      "Un solo hilo simplifica el modelo de concurrencia (no hay race conditions clásicas entre threads) pero exige no bloquear el call stack con trabajo síncrono pesado.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cómo te asegurás de no bloquear la interfaz con una tarea pesada?",
    respuestaEs:
      "Evito trabajo síncrono largo en el hilo principal: si es cómputo pesado, lo parto en chunks con setTimeout/requestIdleCallback o lo muevo a un Web Worker. Si es una operación de datos, la hago asincrónica (fetch, IndexedDB) para que no compita por el call stack. En producción, además, mido con las devtools (Performance tab) si hay long tasks que superan los 50ms.",
    respuestaEn:
      "I avoid long synchronous work on the main thread: for heavy computation, I split it into chunks with setTimeout/requestIdleCallback or move it to a Web Worker. For data operations, I keep them async (fetch, IndexedDB) so they don't compete for the call stack. In production, I also profile with devtools (Performance tab) to catch long tasks over 50ms.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuál es la diferencia entre el Event Loop del navegador y el de Node.js?",
    respuestaEs:
      "En el navegador, el loop alterna entre una cola de tareas y ciclos de render (rAF, estilos, layout, paint), y siempre vacía las microtasks antes de renderizar. En Node no hay render: el loop de libuv tiene fases explícitas (timers, pending callbacks, poll, check, close callbacks), y entre cada fase se vacía la cola de microtasks. Además Node tiene una cola extra, process.nextTick, con más prioridad que las microtasks de Promise.",
    respuestaEn:
      "In the browser, the loop alternates between a task queue and render cycles (rAF, style, layout, paint), and always drains microtasks before rendering. Node has no rendering: its libuv loop has explicit phases (timers, pending callbacks, poll, check, close callbacks), draining the microtask queue between each phase. Node also has an extra queue, process.nextTick, with higher priority than Promise microtasks.",
    tradeoffs:
      "Conocer esta diferencia importa cuando escribís código isomórfico (Next.js) o cuando debugueás timing issues que se comportan distinto en SSR vs cliente.",
    repregunta:
      "¿Qué pasa si encadenás muchos process.nextTick recursivos en Node?",
    respuestaRepreguntaEs:
      "La cola de nextTick se vacía por completo antes de que el loop avance a cualquier otra fase. Si cada nextTick encola otro sin fin, el loop nunca llega a timers, I/O ni al cierre del proceso: es 'nextTick starvation', el equivalente en Node a la microtask starvation del navegador.",
    respuestaRepreguntaEn:
      "The nextTick queue is fully drained before the loop can move to any other phase. If each nextTick keeps queueing another one forever, the loop never reaches timers, I/O, or process shutdown — that's 'nextTick starvation', Node's equivalent of the browser's microtask starvation.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es 'microtask starvation' y cómo lo evitarías?",
    respuestaEs:
      "Pasa cuando una microtask (típicamente una Promise) encola otra microtask indefinidamente: como el loop no avanza a la siguiente macrotask ni al render hasta vaciar por completo la cola de microtasks, el programa queda 'trabado' procesando microtasks sin dejar respirar a la UI ni a los timers. Se evita rompiendo la cadena con un setTimeout(fn, 0) o repartiendo el trabajo en macrotasks cuando se necesita procesar una cantidad no acotada de items de forma recursiva.",
    respuestaEn:
      "It happens when a microtask (typically a Promise) keeps queueing another microtask indefinitely: since the loop won't move to the next macrotask or render until the microtask queue is fully drained, the program gets stuck processing microtasks without letting the UI or timers run. You avoid it by breaking the chain with a setTimeout(fn, 0) or spreading the work across macrotasks when recursively processing an unbounded number of items.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Cuáles son las fases del Event Loop de libuv en Node.js y en qué orden corren?",
    respuestaEs:
      "En orden: timers (callbacks de setTimeout/setInterval vencidos), pending callbacks (callbacks de I/O diferidos de la vuelta anterior), idle/prepare (uso interno), poll (recupera nuevos eventos de I/O y ejecuta sus callbacks, es la fase donde el loop puede bloquearse esperando), check (callbacks de setImmediate) y close callbacks (ej: socket.on('close')). Entre cada fase se vacía la cola de microtasks (Promises) y, antes que eso, la de process.nextTick.",
    respuestaEn:
      "In order: timers (due setTimeout/setInterval callbacks), pending callbacks (deferred I/O callbacks from the previous cycle), idle/prepare (internal use), poll (retrieves new I/O events and runs their callbacks — this is where the loop can block waiting), check (setImmediate callbacks) and close callbacks (e.g. socket.on('close')). Between every phase, the microtask queue (Promises) is drained, and before that, the process.nextTick queue.",
    repregunta:
      "¿setImmediate y setTimeout(fn, 0) siempre corren en el mismo orden?",
    respuestaRepreguntaEs:
      "No. Dentro de un callback de I/O (ya en fase poll), setImmediate siempre gana porque la fase check es la inmediata siguiente. Fuera de un callback de I/O (por ejemplo en el scope principal del módulo), el orden entre ambos no está garantizado: depende de cuánto tarde el proceso en entrar al loop y de la precisión del timer del sistema operativo.",
    respuestaRepreguntaEn:
      "No. Inside an I/O callback (already in the poll phase), setImmediate always wins because the check phase comes right after. Outside an I/O callback (e.g. in the module's top-level scope), the order between the two isn't guaranteed: it depends on how long the process takes to enter the loop and the OS timer's precision.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo diagnosticarías event loop lag en un servicio Node en producción?",
    respuestaEs:
      "Instrumentando el delay del propio loop: librerías como event-loop-lag o el módulo perf_hooks (monitorEventLoopDelay) permiten medir cuánto tarda el loop en volver a una fase esperada, y exponerlo como métrica. También uso --prof o clinic.js para generar un flamegraph y encontrar qué handler síncrono está acaparando el call stack. Si el lag correlaciona con un endpoint específico, suele ser trabajo síncrono pesado (parseo, serialización JSON grande, regex catastrófico) que debería moverse a un worker thread.",
    respuestaEn:
      "By instrumenting the loop's own delay: libraries like event-loop-lag or the perf_hooks module (monitorEventLoopDelay) measure how long the loop takes to return to an expected phase, exposed as a metric. I also use --prof or clinic.js to generate a flamegraph and find which synchronous handler is hogging the call stack. If the lag correlates with a specific endpoint, it's usually heavy synchronous work (parsing, large JSON serialization, catastrophic regex) that should move to a worker thread.",
  },
];
