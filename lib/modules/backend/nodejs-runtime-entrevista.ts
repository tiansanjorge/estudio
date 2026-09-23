import type { PreguntaEntrevista } from "../types";

export const entrevistaNodejsRuntime: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "Node.js es single-threaded: ¿cómo atiende miles de conexiones a la vez?",
    respuestaEs:
      "El código JavaScript corre en un solo hilo (el del event loop), pero la mayor parte del trabajo de un servidor web no es CPU: es ESPERAR (a la base de datos, a otra API, al disco, a la red). Node delega esas esperas al sistema operativo (epoll, kqueue, IOCP) o a su pool de hilos interno de libuv (para disco, DNS, algunas operaciones de crypto y compresión), y mientras tanto el hilo principal sigue atendiendo otros requests. Cuando una operación termina, su callback o Promise se encola y el event loop lo ejecuta. Por eso Node escala muy bien en cargas de I/O con miles de conexiones concurrentes con poca memoria, sin crear un hilo por conexión. El límite aparece con trabajo de CPU: mientras el hilo principal calcula algo pesado, no atiende a nadie más.",
    respuestaEn:
      "JavaScript code runs on a single thread (the event loop's), but most of a web server's work isn't CPU: it's WAITING (for the database, another API, disk, network). Node delegates those waits to the operating system (epoll, kqueue, IOCP) or to libuv's internal thread pool (for disk, DNS, some crypto and compression operations), and meanwhile the main thread keeps serving other requests. When an operation finishes, its callback or Promise is queued and the event loop runs it. That's why Node scales very well for I/O workloads with thousands of concurrent connections and little memory, without a thread per connection. The limit shows with CPU work: while the main thread computes something heavy, it serves no one else.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué significa 'bloquear el event loop' y qué ejemplos comunes hay?",
    respuestaEs:
      "Es ejecutar código sincrónico que tarda en el hilo principal: mientras corre, ningún otro request avanza, ni siquiera los que solo necesitaban 1 ms, y la latencia de TODOS sube. Ejemplos comunes: procesar o serializar un JSON enorme (`JSON.parse` de varios MB), hashear contraseñas con la versión sincrónica de bcrypt, regex con backtracking catastrófico ante cierto input (ReDoS), comprimir o redimensionar imágenes, generar PDFs o reportes grandes, recorrer arrays de millones de elementos, y usar las APIs sincrónicas de Node (`fs.readFileSync`, `crypto.pbkdf2Sync`) dentro de un handler. Se detecta midiendo el lag del event loop (`monitorEventLoopDelay` de `perf_hooks`, o las métricas del APM) y con profiling. Se soluciona usando las versiones asincrónicas, partiendo el trabajo en pedazos, o moviéndolo fuera del hilo principal.",
    respuestaEn:
      "It's running slow synchronous code on the main thread: while it runs, no other request progresses, not even those needing 1 ms, and EVERYONE's latency rises. Common examples: parsing or serializing a huge JSON (`JSON.parse` of several MB), hashing passwords with the synchronous bcrypt version, regexes with catastrophic backtracking on certain input (ReDoS), compressing or resizing images, generating large PDFs or reports, looping over arrays of millions of elements, and using Node's synchronous APIs (`fs.readFileSync`, `crypto.pbkdf2Sync`) inside a handler. It's detected by measuring event loop lag (`monitorEventLoopDelay` from `perf_hooks`, or APM metrics) and with profiling. It's fixed by using async versions, splitting the work into chunks, or moving it off the main thread.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencia hay entre worker threads, child processes y cluster?",
    respuestaEs:
      "WORKER THREADS son hilos dentro del mismo proceso, cada uno con su propio event loop e instancia de V8; se comunican por mensajes y pueden compartir memoria con SharedArrayBuffer. Son la herramienta para trabajo de CPU dentro de un servicio: el handler le pasa el trabajo a un pool de workers (por ejemplo con Piscina) y el event loop principal queda libre. CHILD PROCESSES (`spawn`, `fork`, `exec`) son procesos separados del sistema operativo, con memoria aislada: sirven para ejecutar otros programas (ffmpeg, un script de Python) o aislar código poco confiable, con más costo de creación y comunicación. CLUSTER (o varios procesos detrás de un balanceador) corre varias copias del SERVIDOR completo, una por núcleo, para aprovechar todos los CPUs en tráfico general; cada proceso tiene su propio event loop, así que un bloqueo afecta solo a los requests de ese proceso. Hoy, en contenedores, lo habitual es un proceso por contenedor y escalar con réplicas, en vez de cluster.",
    respuestaEn:
      "WORKER THREADS are threads within the same process, each with its own event loop and V8 instance; they communicate via messages and can share memory with SharedArrayBuffer. They're the tool for CPU work inside a service: the handler hands work to a worker pool (e.g. with Piscina) and the main event loop stays free. CHILD PROCESSES (`spawn`, `fork`, `exec`) are separate OS processes with isolated memory: for running other programs (ffmpeg, a Python script) or isolating untrusted code, with higher creation and communication cost. CLUSTER (or several processes behind a load balancer) runs several copies of the whole SERVER, one per core, to use all CPUs for general traffic; each process has its own event loop, so a block only affects that process's requests. Today, in containers, the norm is one process per container and scaling with replicas instead of cluster.",
    codigo: `// pdf.worker.ts
import { parentPort } from "node:worker_threads";
parentPort!.on("message", (datos) => parentPort!.postMessage(generarPdf(datos)));

// handler: el event loop no se bloquea
import Piscina from "piscina";
const pool = new Piscina({ filename: new URL("./pdf.worker.js", import.meta.url).href });
app.post("/reportes", async (req, res) => res.send(await pool.run(req.body)));`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué es el thread pool de libuv y cuándo se vuelve un cuello de botella?",
    respuestaEs:
      "Es un pool de hilos (4 por defecto, configurable con `UV_THREADPOOL_SIZE`) que libuv usa para operaciones que el sistema operativo no ofrece de forma asincrónica eficiente: la mayoría de las operaciones de archivos (`fs`), `dns.lookup`, y las funciones asincrónicas pesadas de `crypto` (pbkdf2, scrypt, randomBytes) y de `zlib`. La red, en cambio, no usa el pool: va por los mecanismos asincrónicos del sistema operativo. Se vuelve cuello de botella cuando hay muchas operaciones de ese tipo simultáneas: con 4 hilos, el quinto hash de contraseña espera a que se libere uno, aunque el event loop esté libre. Síntoma típico: un login lento bajo carga, o `dns.lookup` demorando todas las conexiones salientes. Se mitiga subiendo `UV_THREADPOOL_SIZE` (con criterio, según los núcleos), cacheando DNS, o moviendo el trabajo pesado a workers o a otro servicio.",
    respuestaEn:
      "It's a thread pool (4 by default, configurable with `UV_THREADPOOL_SIZE`) libuv uses for operations the OS doesn't offer efficiently in async form: most file operations (`fs`), `dns.lookup`, and the heavy async `crypto` (pbkdf2, scrypt, randomBytes) and `zlib` functions. Networking, by contrast, doesn't use the pool: it goes through the OS async mechanisms. It becomes a bottleneck with many such operations at once: with 4 threads, the fifth password hash waits for one to free up, even if the event loop is idle. Typical symptom: slow login under load, or `dns.lookup` delaying all outgoing connections. It's mitigated by raising `UV_THREADPOOL_SIZE` (judiciously, based on cores), caching DNS, or moving heavy work to workers or another service.",
    tradeoffs:
      "Subir el tamaño del pool da más paralelismo para esas operaciones, pero más hilos compitiendo por pocos núcleos no aumenta el throughput real y suma consumo de memoria.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo diagnosticás un memory leak en un servicio Node.js en producción?",
    respuestaEs:
      "Primero confirmar que es un leak y no uso normal: el heap usado crece sin volver a bajar después de las recolecciones de basura, y el proceso termina reiniciándose por falta de memoria. Las causas típicas en servidores: caches en memoria sin límite ni expiración (un Map que solo crece), listeners de eventos que se agregan en cada request y nunca se quitan, closures que retienen objetos grandes, timers o intervalos que no se limpian, y datos acumulados por conexión que no se liberan al cerrar. Para encontrarlo se toman heap snapshots en momentos distintos (con `--inspect` y Chrome DevTools, `v8.writeHeapSnapshot()` o `--heapsnapshot-near-heap-limit`) y se comparan para ver qué tipo de objeto crece y qué lo retiene. En producción conviene métricas de memoria por proceso con alertas, reproducir en un entorno de carga, y como mitigación temporal, reinicios controlados mientras se busca la causa. Las caches se reemplazan por LRU con tamaño máximo o por un store externo como Redis.",
    respuestaEn:
      "First confirm it's a leak and not normal usage: used heap grows without dropping after garbage collections, and the process ends up restarting from running out of memory. Typical server causes: unbounded in-memory caches with no expiry (a Map that only grows), event listeners added per request and never removed, closures retaining large objects, timers or intervals never cleared, and per-connection data not freed on close. To find it, take heap snapshots at different moments (with `--inspect` and Chrome DevTools, `v8.writeHeapSnapshot()` or `--heapsnapshot-near-heap-limit`) and compare them to see which object type grows and what retains it. In production, per-process memory metrics with alerts help, reproducing under load, and as a temporary mitigation, controlled restarts while hunting the cause. Caches get replaced by size-bounded LRUs or an external store like Redis.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo hacés un graceful shutdown en un servidor Node?",
    respuestaEs:
      "Cuando el orquestador (Kubernetes, un deploy, un autoscaler) quiere apagar una instancia, manda SIGTERM y espera un tiempo antes de forzar con SIGKILL. Un apagado ordenado aprovecha ese tiempo para no cortar trabajo a la mitad: al recibir SIGTERM, dejar de aceptar conexiones nuevas (`server.close()`) y marcar el health check de readiness como no listo para que el balanceador deje de mandar tráfico; esperar a que terminen los requests en curso, con un límite de tiempo; cerrar las conexiones keep-alive ociosas; dejar de tomar jobs nuevos de las colas y terminar o devolver los que estaban en proceso; cerrar los pools de base de datos, Redis y otros clientes; enviar los logs y métricas pendientes; y recién ahí salir con código 0. Sin esto, cada deploy corta requests en vuelo (errores 502 para los usuarios) y puede dejar jobs a medio procesar. El tiempo total tiene que ser menor que el período de gracia del orquestador.",
    respuestaEn:
      "When the orchestrator (Kubernetes, a deploy, an autoscaler) wants to shut an instance down, it sends SIGTERM and waits a while before forcing with SIGKILL. An orderly shutdown uses that time to avoid cutting work in half: on SIGTERM, stop accepting new connections (`server.close()`) and flip the readiness health check to not-ready so the load balancer stops sending traffic; wait for in-flight requests to finish, with a time limit; close idle keep-alive connections; stop taking new jobs from queues and finish or return those in progress; close database, Redis and other client pools; flush pending logs and metrics; and only then exit with code 0. Without this, every deploy cuts in-flight requests (502 errors for users) and may leave half-processed jobs. The total time must be shorter than the orchestrator's grace period.",
    codigo: `process.on("SIGTERM", async () => {
  listo = false;                                  // readiness → 503
  server.close();                                 // no acepta conexiones nuevas
  await Promise.race([esperarRequestsEnCurso(), timeout(20_000)]);
  await Promise.all([worker.close(), prisma.$disconnect(), redis.quit()]);
  process.exit(0);
});`,
  },
];
