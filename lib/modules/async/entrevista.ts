import type { PreguntaEntrevista } from "../types";

export const entrevistaAsync: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué devuelve siempre una función async, y qué hace await con ella?",
    respuestaEs:
      "Una función async siempre devuelve una Promise, incluso si adentro hacés un return de un valor plano — se envuelve automáticamente. await pausa la ejecución de esa función puntual hasta que la promesa que le pasás se resuelve, sin bloquear el resto del programa: le devuelve el control a quien la llamó, que sigue ejecutando su código síncrono mientras tanto.",
    respuestaEn:
      "An async function always returns a Promise, even if you return a plain value inside it — it gets wrapped automatically. await pauses that specific function's execution until the promise you pass it settles, without blocking the rest of the program: it hands control back to the caller, which keeps running its synchronous code in the meantime.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cómo evitás que tres peticiones independientes se ejecuten más lento de lo necesario con async/await?",
    respuestaEs:
      "Evitando encadenar awaits uno detrás del otro cuando las operaciones no dependen entre sí. Inicio las tres promesas primero (sin await) y recién después las espero juntas con Promise.all — así corren en paralelo y el tiempo total es el de la más lenta, no la suma de las tres.",
    respuestaEn:
      "By not chaining awaits one after another when the operations don't depend on each other. I start all three promises first (without awaiting), and only then wait for them together with Promise.all — that way they run in parallel and the total time is that of the slowest one, not the sum of all three.",
  },
  {
    nivel: 2,
    pregunta:
      "¿En qué momento empieza a ejecutarse realmente el código dentro de una función async?",
    respuestaEs:
      "Inmediatamente, de forma síncrona, en el mismo instante en que se la llama — igual que cualquier función normal. Lo único que cambia es que en cuanto llega al primer await, la ejecución se pausa y le devuelve el control al llamador; todo el código antes de ese primer await corre síncrono, sin ninguna vuelta al Event Loop de por medio.",
    respuestaEn:
      "Immediately, synchronously, at the exact moment it's called — just like any regular function. The only thing that changes is that as soon as it hits the first await, execution pauses and control returns to the caller; all the code before that first await runs synchronously, with no trip through the Event Loop in between.",
    tradeoffs:
      "Esto importa para debugging: un error lanzado antes del primer await se comporta como una excepción síncrona normal (podés envolver la llamada en un try/catch afuera), mientras que un error después de un await solo se puede capturar en la promesa que devuelve la función.",
    repregunta:
      "¿Conviene envolver toda la función async en un único try/catch, o un try/catch por cada await?",
    respuestaRepreguntaEs:
      "Depende de si necesito distinguir cuál operación falló para reaccionar distinto a cada una. Un único try/catch alrededor de toda la función es más simple y suficiente cuando cualquier fallo debe manejarse igual (por ejemplo, mostrar un error genérico). Si necesito un fallback específico por operación (reintentar solo la que falló, o usar un valor por defecto para una y propagar el error de otra), conviene un try/catch más granular alrededor de cada await, aunque sea más verboso.",
    respuestaRepreguntaEn:
      "It depends on whether I need to tell which operation failed to react differently to each. A single try/catch around the whole function is simpler and enough when any failure should be handled the same way (e.g. showing a generic error). If I need a specific fallback per operation (retry only the one that failed, or use a default value for one while propagating another's error), a more granular try/catch around each await is worth the extra verbosity.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué son los async generators y cuándo los usarías en vez de una función async normal?",
    respuestaEs:
      "Un async generator (`async function*`) combina generadores con async: en vez de devolver una sola Promise, produce un async iterable que puede emitir múltiples valores en el tiempo, cada uno esperado con `for await...of`. Los uso cuando necesito procesar datos que llegan de a poco (streams, paginación de una API, lectura de un archivo grande) sin cargar todo en memoria de una vez, dejando que el consumidor procese cada chunk a medida que llega.",
    respuestaEn:
      "An async generator (`async function*`) combines generators with async: instead of returning a single Promise, it produces an async iterable that can emit multiple values over time, each awaited with `for await...of`. I use them when I need to process data that arrives incrementally (streams, API pagination, reading a large file) without loading everything into memory at once, letting the consumer process each chunk as it arrives.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es una 'floating promise' y por qué es un riesgo silencioso en un codebase grande?",
    respuestaEs:
      "Es llamar a una función async (o cualquier cosa que devuelva una Promise) sin await, sin .then() ni .catch() — la promesa queda 'flotando', sin que nadie observe su resultado. Si esa operación rechaza, se convierte en un unhandled rejection que puede pasar completamente desapercibido en desarrollo y solo manifestarse en producción. Es un riesgo típico en código que dispara efectos secundarios (loguear, notificar) sin esperar su resultado. Reglas de lint como no-floating-promises (typescript-eslint) existen justamente para detectarlas en build time.",
    respuestaEn:
      "It's calling an async function (or anything that returns a Promise) without await, .then(), or .catch() — the promise is left 'floating', with nobody observing its outcome. If that operation rejects, it becomes an unhandled rejection that can go completely unnoticed in development and only surface in production. It's a typical risk in code that fires side effects (logging, notifying) without waiting for the result. Lint rules like no-floating-promises (typescript-eslint) exist specifically to catch these at build time.",
    repregunta:
      "¿Por qué a veces el stack trace de un error async no muestra de dónde vino la llamada original, antes del await?",
    respuestaRepreguntaEs:
      "Porque cada await reanuda la ejecución en una microtask nueva, y por defecto el motor no conserva el stack del código que estaba corriendo antes de la suspensión — el stack capturado en el error solo refleja el contexto de esa microtask puntual, no toda la cadena de llamadas que llevó hasta ahí. Motores modernos de V8 y Node soportan 'zero-cost async stack traces' que mitigan esto reconstruyendo la cadena completa, pero no es universal en todos los entornos ni versiones, así que en código crítico conviene loguear contexto explícito (request id, argumentos) en vez de depender solo del stack trace.",
    respuestaRepreguntaEn:
      "Because each await resumes execution in a new microtask, and by default the engine doesn't preserve the stack of the code that was running before the suspension — the stack captured in the error only reflects that specific microtask's context, not the full call chain that led there. Modern V8 and Node versions support 'zero-cost async stack traces' that mitigate this by reconstructing the full chain, but it's not universal across every environment or version, so in critical code it's worth logging explicit context (request id, arguments) instead of relying solely on the stack trace.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué riesgo tiene usar top-level await en un módulo ES, y qué pasa si hay una dependencia circular?",
    respuestaEs:
      "Top-level await pausa la evaluación de todo el módulo (y de cualquier módulo que dependa de él) hasta que la promesa se resuelve — el grafo de módulos completo espera. Si dos módulos con top-level await tienen una dependencia circular, se puede llegar a un deadlock: el módulo A espera a que B termine de evaluarse, pero B necesita algo de A que todavía no está disponible porque A sigue pausado en su propio await. El runtime suele detectarlo y lanzar un error en vez de colgarse indefinidamente, pero el riesgo real es el delay de arranque: cualquier import de un módulo con top-level await lento retrasa toda la carga de la aplicación.",
    respuestaEn:
      "Top-level await pauses evaluation of the entire module (and any module that depends on it) until the promise settles — the whole module graph waits. If two modules with top-level await have a circular dependency, you can hit a deadlock: module A waits for B to finish evaluating, but B needs something from A that isn't available yet because A is still paused on its own await. The runtime usually detects this and throws an error instead of hanging indefinitely, but the real risk is startup delay: importing any module with a slow top-level await delays the entire application's load.",
  },
];
