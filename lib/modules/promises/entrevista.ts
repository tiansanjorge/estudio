import type { PreguntaEntrevista } from "../types";

export const entrevistaPromises: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué son los tres estados de una Promise y por qué son irreversibles?",
    respuestaEs:
      "Pendiente, cumplida y rechazada. Una vez que una Promise pasa de pendiente a cumplida o rechazada, ese estado queda fijo para siempre — no puede volver a pendiente ni cambiar de resultado. Esa inmutabilidad es lo que permite que cualquier .then() agregado después, incluso mucho después de que la promesa ya se resolvió, siga funcionando: recibe el valor final igual.",
    respuestaEn:
      "Pending, fulfilled and rejected. Once a Promise moves from pending to fulfilled or rejected, that state is fixed forever — it can't go back to pending or change its result. That immutability is what lets any .then() added later, even long after the promise already settled, still work correctly: it still receives the final value.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo usarías Promise.all vs Promise.allSettled?",
    respuestaEs:
      "Promise.all cuando necesito TODOS los resultados para continuar y no tiene sentido seguir si uno falla (por ejemplo, cargar datos que son todos obligatorios para renderizar una pantalla). Promise.allSettled cuando las operaciones son independientes entre sí y el fallo de una no debe cancelar ni ocultar el resultado de las demás (por ejemplo, subir varios archivos donde quiero saber cuáles subieron bien aunque otro falle).",
    respuestaEn:
      "Promise.all when I need ALL the results to continue and there's no point proceeding if one fails (e.g. loading data that's all mandatory to render a screen). Promise.allSettled when the operations are independent from each other and one failing shouldn't cancel or hide the others' results (e.g. uploading several files where I want to know which ones succeeded even if another one fails).",
  },
  {
    nivel: 2,
    pregunta:
      "¿async/await o cadenas de .then()? ¿Qué trade-off real hay entre ambos?",
    respuestaEs:
      "Son azúcar sintáctico sobre lo mismo — Promises — así que no hay diferencia de comportamiento, solo de legibilidad y de dónde vive el manejo de errores. async/await lee como código síncrono y permite usar try/catch, lo que suele ser más claro con lógica condicional o loops. El riesgo real está en el mal uso: encadenar awaits secuenciales para operaciones independientes serializa lo que podría correr en paralelo con Promise.all, perdiendo tiempo real de ejecución.",
    respuestaEn:
      "They're syntactic sugar over the same thing — Promises — so there's no behavioral difference, only readability and where error handling lives. async/await reads like synchronous code and allows try/catch, which is usually clearer with conditional logic or loops. The real risk is misuse: chaining sequential awaits for independent operations serializes work that could run in parallel with Promise.all, wasting real execution time.",
    tradeoffs:
      "async/await: más legible, try/catch familiar, pero fácil de serializar por accidente. .then(): explícito sobre el paralelismo cuando se combina con los combinadores, pero más verboso y con manejo de errores menos intuitivo en cadenas largas.",
    repregunta:
      "Tenés que pedir los datos de usuario y sus preferencias, y son independientes entre sí. ¿Cómo lo escribirías con async/await para no perder el paralelismo?",
    respuestaRepreguntaEs:
      "Iniciando ambas llamadas antes de esperar cualquiera: `const [usuario, preferencias] = await Promise.all([getUsuario(), getPreferencias()])`. Si en cambio escribo `const usuario = await getUsuario(); const preferencias = await getPreferencias();`, cada await bloquea el progreso del async hasta resolverse, así que la segunda llamada ni siquiera arranca hasta que termina la primera — serializando dos operaciones que podrían correr en paralelo.",
    respuestaRepreguntaEn:
      "By kicking off both calls before awaiting either: `const [usuario, preferencias] = await Promise.all([getUsuario(), getPreferencias()])`. If instead I write `const usuario = await getUsuario(); const preferencias = await getPreferencias();`, each await blocks the async function's progress until it settles, so the second call doesn't even start until the first one finishes — serializing two operations that could run in parallel.",
    codigoRepregunta: `// Serializado: la segunda llamada arranca recién cuando termina la primera
const usuario = await getUsuario();
const preferencias = await getPreferencias();

// Paralelo: ambas arrancan antes de esperar cualquiera
const [usuario, preferencias] = await Promise.all([
  getUsuario(),
  getPreferencias(),
]);`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué pasa si una Promise rechaza y nadie la maneja con .catch() o try/catch?",
    respuestaEs:
      "Se dispara un unhandled rejection: en el navegador, el evento `unhandledrejection` en window; en Node, un evento del mismo nombre en el process, que desde versiones recientes por defecto termina el proceso si nadie lo escucha. Es un error silencioso peligroso porque no rompe la ejecución inmediatamente como una excepción síncrona — puede pasar desapercibido en desarrollo y aparecer recién en producción bajo cierta condición de red o timing.",
    respuestaEn:
      "It triggers an unhandled rejection: in the browser, the `unhandledrejection` event on window; in Node, an event of the same name on process, which in recent versions terminates the process by default if nobody listens for it. It's a dangerous silent error because it doesn't break execution immediately like a synchronous exception — it can go unnoticed in development and only show up in production under a specific network or timing condition.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué .then() siempre se ejecuta como microtask, incluso si la Promise ya estaba resuelta cuando lo agregaste?",
    respuestaEs:
      "Es una garantía deliberada de la spec (Promises/A+): el callback de .then() nunca se ejecuta sincrónicamente, ni siquiera si la promesa ya estaba cumplida en el momento de registrarlo. Siempre se encola como microtask. Esto evita 'Zalgo' — funciones cuyo comportamiento síncrono o asincrónico depende de una condición de carrera, lo cual rompe el razonamiento sobre el orden de ejecución. Gracias a esta garantía, el orden relativo del código que sigue a un .then() es siempre predecible.",
    respuestaEn:
      "It's a deliberate guarantee from the spec (Promises/A+): the .then() callback never runs synchronously, even if the promise was already fulfilled when you registered it. It's always queued as a microtask. This avoids 'releasing Zalgo' — functions whose sync-or-async behavior depends on a race condition, which breaks reasoning about execution order. Thanks to this guarantee, the relative order of code following a .then() is always predictable.",
    repregunta:
      "¿Qué es un 'thenable' y por qué Promise.resolve() lo trata distinto a un valor plano?",
    respuestaRepreguntaEs:
      "Un thenable es cualquier objeto con un método `.then()`, sea o no una Promise nativa (por ejemplo, el resultado de una librería vieja de promesas, o un objeto armado a mano). `Promise.resolve(valor)` detecta si el valor es un thenable y, en ese caso, no lo envuelve directamente: 'asimila' su estado llamando a su `.then()` y esperando a que se resuelva, para garantizar que el resultado final sea siempre una Promise nativa genuina. Con un valor plano, en cambio, simplemente crea una Promise ya cumplida con ese valor.",
    respuestaRepreguntaEn:
      "A thenable is any object with a `.then()` method, whether or not it's a native Promise (e.g. the result of an old promise library, or a hand-built object). `Promise.resolve(value)` checks if the value is a thenable and, if so, doesn't wrap it directly: it 'assimilates' its state by calling its `.then()` and waiting for it to settle, guaranteeing the final result is always a genuine native Promise. With a plain value, it simply creates an already-fulfilled Promise with that value.",
    codigoRepregunta: `const thenable = {
  then(resolve) {
    setTimeout(() => resolve('valor asimilado'), 100);
  },
};

Promise.resolve(thenable).then(console.log);
// Espera a que el .then() del thenable resuelva, como si
// fuera una Promise nativa — no lo trata como un valor plano.`,
  },
  {
    nivel: 3,
    pregunta:
      "Las Promises no son cancelables nativamente. ¿Cómo implementarías cancelación real (por ejemplo, para un fetch)?",
    respuestaEs:
      "Con AbortController: se crea un controller, se pasa su `signal` a la operación (fetch lo soporta nativamente), y llamar a `controller.abort()` hace que la promesa subyacente rechace con un AbortError. La Promise en sí sigue sin ser cancelable — lo que se cancela es la operación underlying (la request de red), y esa cancelación se comunica de vuelta como un rechazo. Para código propio, el patrón es aceptar una signal y chequear `signal.aborted` (o escuchar su evento 'abort') en los puntos donde tenga sentido cortar el trabajo.",
    respuestaEn:
      "With AbortController: you create a controller, pass its `signal` to the operation (fetch supports it natively), and calling `controller.abort()` makes the underlying promise reject with an AbortError. The Promise itself still isn't cancelable — what gets cancelled is the underlying operation (the network request), and that cancellation is communicated back as a rejection. For your own code, the pattern is to accept a signal and check `signal.aborted` (or listen for its 'abort' event) at points where it makes sense to stop the work.",
    codigo: `const controller = new AbortController();

fetch('/api/datos', { signal: controller.signal })
  .then((r) => r.json())
  .catch((err) => {
    if (err.name === 'AbortError') return; // cancelado a propósito
    throw err;
  });

controller.abort(); // dispara el rechazo con AbortError`,
  },
];
