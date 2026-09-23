import type { PreguntaEntrevista } from "../types";

export const entrevistaColasJobs: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuándo mandarías un trabajo a una cola en vez de hacerlo dentro del request?",
    respuestaEs:
      "Cuando no hace falta que el usuario espere el resultado para recibir la respuesta, o cuando el trabajo es lento, poco confiable o costoso. Ejemplos: mandar emails o notificaciones, generar PDFs o reportes, procesar imágenes o videos, llamar a APIs de terceros que pueden fallar (facturación, CRM), sincronizaciones, y tareas programadas (limpiar datos viejos cada noche). El request guarda lo mínimo, encola un job y responde enseguida; uno o varios workers procesan la cola en segundo plano. Se gana latencia para el usuario, resiliencia (si el proveedor de emails está caído, el job se reintenta después en vez de hacer fallar el registro) y control de carga (los workers procesan a su ritmo aunque lleguen mil jobs juntos). En Node, BullMQ sobre Redis es la opción más usada; en cloud, SQS, Cloud Tasks o Pub/Sub. El costo: otro componente que operar, y aceptar que el resultado llega después.",
    respuestaEn:
      "When the user doesn't need to wait for the result to get the response, or the work is slow, unreliable or expensive. Examples: sending emails or notifications, generating PDFs or reports, processing images or videos, calling third-party APIs that may fail (billing, CRM), syncs, and scheduled tasks (cleaning old data nightly). The request saves the minimum, enqueues a job and responds immediately; one or more workers process the queue in the background. You gain user latency, resilience (if the email provider is down, the job retries later instead of failing the signup) and load control (workers process at their own pace even if a thousand jobs arrive at once). In Node, BullMQ on Redis is the most used option; in the cloud, SQS, Cloud Tasks or Pub/Sub. The cost: another component to operate, and accepting the result arrives later.",
    codigo: `// en el request: encolar y responder
await colaEmails.add("bienvenida", { usuarioId }, {
  attempts: 5,
  backoff: { type: "exponential", delay: 1000 },
});
res.status(201).json(usuario);

// en el worker (otro proceso)
new Worker("emails", async (job) => {
  await enviarBienvenida(job.data.usuarioId);
}, { connection: redis, concurrency: 10 });`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué son los reintentos con backoff y la cola de fallidos (DLQ)?",
    respuestaEs:
      "Cuando un job falla, se reintenta automáticamente hasta un máximo de intentos, esperando entre cada uno. El backoff exponencial (1 s, 2 s, 4 s, 8 s...) le da tiempo al sistema externo a recuperarse y evita martillarlo en el peor momento; con jitter, además, evita que miles de jobs reintenten en el mismo instante. Los reintentos arreglan fallas TRANSITORIAS (un timeout, un 503, un deadlock en la base). Pero hay fallas PERMANENTES (un email mal formado, un registro que ya no existe, un bug) que ningún reintento va a resolver: cuando un job agota sus intentos, se mueve a una cola de fallidos (dead letter queue), en vez de perderse o de reintentarse para siempre bloqueando recursos. Esa cola se monitorea con alertas, se inspecciona (qué falló y con qué datos), y los jobs se pueden reprocesar a mano una vez corregido el problema. También conviene distinguir en el código los errores no reintentables para mandarlos a fallidos sin gastar intentos.",
    respuestaEn:
      "When a job fails, it's retried automatically up to a maximum number of attempts, waiting between each. Exponential backoff (1 s, 2 s, 4 s, 8 s...) gives the external system time to recover and avoids hammering it at the worst moment; jitter also prevents thousands of jobs retrying at the same instant. Retries fix TRANSIENT failures (a timeout, a 503, a database deadlock). But there are PERMANENT failures (a malformed email, a record that no longer exists, a bug) no retry will fix: when a job exhausts its attempts, it's moved to a failed or dead letter queue, rather than lost or retried forever tying up resources. That queue is monitored with alerts, inspected (what failed and with what data), and jobs can be reprocessed manually once the problem is fixed. It's also worth flagging non-retryable errors in code to send them to failed without spending attempts.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué los jobs tienen que ser idempotentes?",
    respuestaEs:
      "Porque las colas garantizan, en general, entrega 'al menos una vez': un job puede ejecutarse más de una vez. Pasa si el worker procesó el trabajo pero se cayó antes de marcarlo como completado (el job vuelve a la cola), si un job tarda más que el tiempo de bloqueo y se considera 'estancado' y otro worker lo toma, o por los propios reintentos cuando el fallo ocurrió DESPUÉS de producir el efecto (el email se mandó pero la conexión se cortó al confirmar). Si el job no es idempotente, el cliente recibe dos emails o se le cobra dos veces. Técnicas: usar un id de job determinístico (BullMQ ignora jobs con un `jobId` repetido, lo que evita encolar duplicados), registrar en la base que el efecto ya se produjo y chequearlo antes de producirlo, pasar una idempotency key a las APIs externas (Stripe la acepta), y preferir operaciones de 'establecer' antes que de 'incrementar'. Y guardar en el job solo ids, no datos completos: al ejecutarse lee el estado actual, que pudo cambiar desde que se encoló.",
    respuestaEn:
      "Because queues generally guarantee 'at least once' delivery: a job may run more than once. It happens if the worker did the work but crashed before marking it complete (the job returns to the queue), if a job takes longer than its lock duration and is considered 'stalled' and another worker picks it up, or through retries themselves when the failure happened AFTER producing the effect (the email was sent but the connection dropped on confirmation). If the job isn't idempotent, the customer gets two emails or is charged twice. Techniques: use a deterministic job id (BullMQ ignores jobs with a repeated `jobId`, preventing duplicate enqueues), record in the database that the effect happened and check before producing it, pass an idempotency key to external APIs (Stripe accepts one), and prefer 'set' over 'increment' operations. And store only ids in the job, not full data: when it runs it reads current state, which may have changed since enqueueing.",
    tradeoffs:
      "Guardar solo ids en el job evita datos viejos pero agrega una consulta al ejecutar; guardar el payload completo es más rápido pero puede procesar información desactualizada.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo manejás la concurrencia de los workers y los límites de un proveedor externo?",
    respuestaEs:
      "La concurrencia define cuántos jobs procesa cada worker a la vez: para trabajo de I/O (llamadas HTTP, emails) puede ser alta, porque el worker pasa la mayor parte del tiempo esperando; para trabajo de CPU (PDFs, imágenes) conviene baja, del orden de los núcleos, o workers separados en su propia cola para no bloquear el resto. Escalar agregando más procesos worker es horizontal y simple. El problema aparece con los límites de terceros: si el proveedor de emails acepta 10 por segundo y tenés 50 workers con concurrencia 10, lo vas a saturar y te va a responder 429. Las colas suelen ofrecer rate limiting por cola (BullMQ tiene `limiter: { max, duration }`) que se respeta entre todos los workers porque se coordina en Redis. Además conviene separar colas por tipo y prioridad (los emails transaccionales no pueden quedar detrás de 100.000 de un newsletter), y usar prioridades dentro de una cola cuando hace falta.",
    respuestaEn:
      "Concurrency defines how many jobs each worker processes at once: for I/O work (HTTP calls, emails) it can be high, since the worker spends most of its time waiting; for CPU work (PDFs, images) keep it low, around the core count, or use separate workers on their own queue so they don't block the rest. Scaling by adding more worker processes is horizontal and simple. The problem arises with third-party limits: if the email provider accepts 10 per second and you have 50 workers at concurrency 10, you'll saturate it and get 429s. Queues often offer per-queue rate limiting (BullMQ has `limiter: { max, duration }`) enforced across all workers since it's coordinated in Redis. Also separate queues by type and priority (transactional emails can't sit behind 100,000 newsletter emails), and use priorities within a queue when needed.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo garantizás que un job se encole solo si la transacción de la base se confirmó?",
    respuestaEs:
      "Es el problema de la doble escritura aplicado a colas. Si encolás dentro de la transacción y la transacción después hace rollback, el worker procesa algo que no existe (manda un email de bienvenida a un usuario que no se creó). Si encolás después del commit y el proceso se cae entre el commit y el encolado, el job se pierde. Las soluciones: el patrón OUTBOX, que guarda el 'job por encolar' en una tabla de la misma base, dentro de la misma transacción, y un proceso aparte lo lee y lo encola (garantía at-least-once, así que el job tiene que ser idempotente); o, si la cola vive en la misma base, usar una cola respaldada por Postgres (como pg-boss o Graphile Worker), donde encolar es un INSERT más dentro de la transacción y la atomicidad es gratis. Una mitigación más simple pero incompleta es encolar después del commit y tener un proceso de reconciliación que detecte y repare los casos perdidos.",
    respuestaEn:
      "It's the dual-write problem applied to queues. If you enqueue inside the transaction and it later rolls back, the worker processes something that doesn't exist (sends a welcome email to a user never created). If you enqueue after commit and the process crashes between commit and enqueue, the job is lost. Solutions: the OUTBOX pattern, storing the 'job to enqueue' in a table in the same database, within the same transaction, with a separate process reading and enqueuing it (at-least-once guarantee, so the job must be idempotent); or, if the queue lives in the same database, using a Postgres-backed queue (like pg-boss or Graphile Worker), where enqueuing is just another INSERT in the transaction and atomicity comes for free. A simpler but incomplete mitigation is enqueuing after commit plus a reconciliation process that detects and repairs lost cases.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué métricas y operaciones necesitás para operar colas en producción?",
    respuestaEs:
      "Las métricas clave son: la PROFUNDIDAD de cada cola (jobs esperando) y su tendencia, porque si crece sin parar los workers no dan abasto; la LATENCIA de espera (cuánto tarda un job desde que se encola hasta que empieza), que es lo que siente el usuario; el tiempo de procesamiento por tipo de job; la tasa de fallos y de reintentos; el tamaño de la cola de fallidos; y los jobs estancados. Con esas métricas se alerta (la cola de emails transaccionales tiene más de 5 minutos de espera) y se autoescalan los workers según la profundidad. Operaciones necesarias: un panel para inspeccionar y reprocesar jobs fallidos (Bull Board, por ejemplo), la capacidad de pausar una cola durante un incidente con un proveedor, cierre ordenado de los workers en cada deploy (terminar el job actual, no tomar nuevos), limpieza de jobs completados para que Redis no crezca sin límite, y versionado del payload de los jobs, porque durante un deploy conviven jobs encolados por la versión vieja con workers de la nueva.",
    respuestaEn:
      "Key metrics: each queue's DEPTH (waiting jobs) and its trend, since if it grows nonstop the workers can't keep up; WAIT LATENCY (how long from enqueue to start), which is what the user feels; processing time per job type; failure and retry rates; failed-queue size; and stalled jobs. With those metrics you alert (the transactional email queue has over 5 minutes of wait) and autoscale workers by depth. Necessary operations: a dashboard to inspect and reprocess failed jobs (Bull Board, for instance), the ability to pause a queue during a provider incident, graceful worker shutdown on each deploy (finish the current job, don't take new ones), cleanup of completed jobs so Redis doesn't grow unbounded, and versioning job payloads, since during a deploy jobs enqueued by the old version coexist with workers of the new one.",
  },
];
