import type { PreguntaEntrevista } from "../types";

export const entrevistaErroresLogging: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cómo organizás el manejo de errores en un backend?",
    respuestaEs:
      "Distinguiendo dos tipos de error. Los ESPERADOS u operacionales son parte del negocio o del entorno: recurso no encontrado, datos inválidos, sin permisos, stock insuficiente, un proveedor que no responde. Se modelan como errores tipados (clases como `NoEncontrado`, `StockInsuficiente`, con un código estable), se lanzan desde la lógica y se traducen a respuestas HTTP con sentido (404, 422, 409, 503). Los INESPERADOS son bugs: un `undefined` donde no debía, una excepción no contemplada; esos responden 500 con un mensaje genérico, se loguean con todo el detalle y disparan una alerta. La traducción de errores a HTTP se centraliza en UN manejador (el error middleware de Express, un exception filter de NestJS, el `setErrorHandler` de Fastify), así los handlers no repiten try/catch y el formato de respuesta es siempre el mismo. Lo que no se hace: tragarse errores con un `catch` vacío, ni devolver 200 con `{ error }` en el body.",
    respuestaEn:
      "By distinguishing two kinds of error. EXPECTED or operational ones are part of the business or environment: resource not found, invalid data, missing permissions, insufficient stock, a provider not responding. They're modeled as typed errors (classes like `NotFound`, `InsufficientStock`, with a stable code), thrown from the logic and translated into meaningful HTTP responses (404, 422, 409, 503). UNEXPECTED ones are bugs: an `undefined` where it shouldn't be, an unanticipated exception; those return 500 with a generic message, are logged in full detail and fire an alert. Translation from errors to HTTP is centralized in ONE handler (Express's error middleware, a NestJS exception filter, Fastify's `setErrorHandler`), so handlers don't repeat try/catch and the response format is always the same. What you don't do: swallow errors with an empty `catch`, or return 200 with `{ error }` in the body.",
    codigo: `class ErrorDeDominio extends Error {
  constructor(public codigo: string, public status: number, mensaje: string) {
    super(mensaje);
  }
}
class StockInsuficiente extends ErrorDeDominio {
  constructor(productoId: string) {
    super("STOCK_INSUFICIENTE", 409, \`Sin stock de \${productoId}\`);
  }
}

app.use((err, req, res, next) => {
  if (err instanceof ErrorDeDominio) {
    return res.status(err.status).json({ codigo: err.codigo, mensaje: err.message, requestId: req.id });
  }
  req.log.error({ err }, "error inesperado");
  res.status(500).json({ codigo: "INTERNO", requestId: req.id });
});`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué son los logs estructurados y por qué son mejores que console.log?",
    respuestaEs:
      "Un log estructurado es un objeto con campos (normalmente JSON en una línea): timestamp, nivel, mensaje, y contexto como `requestId`, `usuarioId`, `ruta`, `status`, `duracionMs`. Un `console.log('Error al cobrar')` es texto libre: en producción, con muchos requests concurrentes, sus líneas se intercalan con las de otros y no hay forma de filtrar ni de reconstruir qué le pasó a un request puntual. Con logs estructurados, las herramientas (Datadog, Grafana Loki, CloudWatch, Elastic) indexan cada campo y se puede buscar 'todas las líneas de `requestId=req_b2`', 'errores del endpoint de pagos en la última hora' o armar métricas a partir de los logs. En Node, librerías como pino (muy rápida, la que usa Fastify) o winston lo resuelven; se configura un logger por request (child logger) que agrega el `requestId` automáticamente a todas sus líneas. Además, los niveles (`debug`, `info`, `warn`, `error`) permiten ajustar cuánto se registra en cada entorno.",
    respuestaEn:
      "A structured log is an object with fields (usually one-line JSON): timestamp, level, message, and context like `requestId`, `userId`, `route`, `status`, `durationMs`. A `console.log('Payment failed')` is free text: in production, with many concurrent requests, its lines interleave with others' and there's no way to filter or reconstruct what happened to a specific request. With structured logs, tools (Datadog, Grafana Loki, CloudWatch, Elastic) index each field and you can search 'all lines with `requestId=req_b2`', 'payment endpoint errors in the last hour' or build metrics from logs. In Node, libraries like pino (very fast, used by Fastify) or winston handle it; you configure a per-request logger (child logger) that automatically adds `requestId` to all its lines. Levels (`debug`, `info`, `warn`, `error`) also let you tune how much is recorded per environment.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué NO tiene que aparecer en los logs?",
    respuestaEs:
      "Datos sensibles: contraseñas, tokens de sesión, API keys, headers `Authorization` y cookies, números de tarjeta, y datos personales más allá de lo necesario (documentos, direcciones, datos de salud), porque los logs se guardan mucho tiempo, los leen muchas personas y herramientas, y suelen tener controles de acceso más laxos que la base de datos; además, varias regulaciones (GDPR y leyes de protección de datos locales) aplican también a los logs. El riesgo típico es loguear objetos completos: el request entero, el body de un login, el objeto de configuración o un error de una librería HTTP que incluye los headers del request. Se previene con redacción automática en el logger (pino tiene `redact` con paths como `req.headers.authorization`), logueando campos específicos en vez de objetos enteros, identificando usuarios por id y no por email, y revisando los logs en code review. Tampoco conviene loguear de más en el camino feliz: el volumen tiene costo y esconde lo importante.",
    respuestaEn:
      "Sensitive data: passwords, session tokens, API keys, `Authorization` headers and cookies, card numbers, and personal data beyond what's needed (IDs, addresses, health data), because logs are kept for a long time, read by many people and tools, and usually have looser access controls than the database; several regulations (GDPR and local data protection laws) also apply to logs. The typical risk is logging whole objects: the entire request, a login body, the config object or an HTTP library error that includes the request headers. It's prevented with automatic redaction in the logger (pino has `redact` with paths like `req.headers.authorization`), logging specific fields instead of whole objects, identifying users by id rather than email, and reviewing logs in code review. Also avoid over-logging on the happy path: volume has a cost and buries what matters.",
    codigo: `const logger = pino({
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.token"],
    censor: "[REDACTADO]",
  },
});`,
    tradeoffs:
      "Más contexto en los logs acelera el diagnóstico, pero aumenta el costo de almacenamiento y el riesgo de filtrar datos. La regla: identificadores y metadatos sí, contenido sensible no.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué hacés con los errores no capturados y los rechazos de promesas sin manejar?",
    respuestaEs:
      "`uncaughtException` y `unhandledRejection` son la última red: indican un bug que escapó de todo manejo. Desde Node 15, una promesa rechazada sin manejar termina el proceso por defecto, y es el comportamiento correcto: después de un error inesperado el proceso puede quedar en un estado inconsistente (una conexión a medio usar, un lock tomado), así que lo sano es registrar el error con todo el detalle, enviarlo al sistema de monitoreo, intentar un cierre ordenado con un timeout corto y dejar que el orquestador levante otra instancia. Lo que no hay que hacer es un `process.on('uncaughtException', () => {})` que se trague todo y siga como si nada. La prevención real está antes: nunca dejar promesas 'flotando' sin await ni catch (la regla de ESLint `no-floating-promises` ayuda), y en Express 4, envolver los handlers async o usar Express 5, que captura sus rechazos.",
    respuestaEn:
      "`uncaughtException` and `unhandledRejection` are the last safety net: they signal a bug that escaped all handling. Since Node 15, an unhandled rejected promise terminates the process by default, and that's correct: after an unexpected error the process may be in an inconsistent state (a half-used connection, a held lock), so the sane move is logging the error in full detail, sending it to monitoring, attempting an orderly shutdown with a short timeout and letting the orchestrator bring up another instance. What you must not do is a `process.on('uncaughtException', () => {})` that swallows everything and carries on. Real prevention comes earlier: never leave promises 'floating' without await or catch (the ESLint rule `no-floating-promises` helps), and in Express 4, wrap async handlers or use Express 5, which catches their rejections.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo seguís un request que atraviesa varios servicios?",
    respuestaEs:
      "Con propagación de contexto y tracing distribuido. El primer servicio (o el gateway) genera un identificador de traza, y cada llamada a otro servicio lo propaga en un header estándar (`traceparent` de W3C Trace Context); cada servicio lo agrega a sus logs y crea 'spans' (unidades de trabajo con inicio, fin y atributos: la consulta a la base, la llamada al proveedor de pagos). OpenTelemetry es el estándar abierto para instrumentar: su SDK para Node instrumenta automáticamente HTTP, Express/Fastify, Prisma, Redis y otras librerías, y exporta trazas a Jaeger, Tempo, Datadog o Honeycomb. Con eso se ve el recorrido completo de un request como una cascada: qué servicio tardó, dónde falló y con qué contexto. Dentro de un proceso Node, el contexto se mantiene a través de las operaciones asincrónicas con `AsyncLocalStorage`, que es lo que permite que el logger agregue el `traceId` a cada línea sin pasarlo a mano por todas las funciones.",
    respuestaEn:
      "With context propagation and distributed tracing. The first service (or gateway) generates a trace identifier, and every call to another service propagates it in a standard header (`traceparent` from W3C Trace Context); each service adds it to its logs and creates 'spans' (units of work with start, end and attributes: the database query, the payment provider call). OpenTelemetry is the open standard for instrumentation: its Node SDK automatically instruments HTTP, Express/Fastify, Prisma, Redis and other libraries, and exports traces to Jaeger, Tempo, Datadog or Honeycomb. With that you see a request's full path as a waterfall: which service was slow, where it failed and with what context. Within a Node process, context is kept across async operations with `AsyncLocalStorage`, which is what lets the logger add the `traceId` to every line without passing it by hand through every function.",
    codigo: `import { AsyncLocalStorage } from "node:async_hooks";
const contexto = new AsyncLocalStorage<{ requestId: string }>();

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"]?.toString() ?? crypto.randomUUID();
  contexto.run({ requestId }, next);
});

// en cualquier parte, sin pasar parámetros
export const log = (msg: string, datos?: object) =>
  logger.info({ ...contexto.getStore(), ...datos }, msg);`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué diferencia hay entre logs, métricas y trazas, y cuándo alertás?",
    respuestaEs:
      "Son los tres pilares de la observabilidad. Los LOGS son eventos discretos con detalle ('falló el cobro del pedido X con este error'): sirven para investigar un caso puntual, pero son caros de almacenar y consultar en volumen. Las MÉTRICAS son números agregados en el tiempo (requests por segundo, tasa de errores, latencia p95, uso de memoria): baratas, ideales para dashboards y alertas, pero sin el detalle de cada caso. Las TRAZAS muestran el recorrido de un request entre servicios con tiempos por etapa: sirven para encontrar dónde se va la latencia o dónde falla una cadena. Para alertar se usan métricas orientadas al síntoma que ve el usuario, no a causas internas: tasa de errores 5xx, latencia p95/p99 del endpoint crítico, fallas del checkout, idealmente definidas como SLOs (por ejemplo, 99,9% de los requests exitosos en 30 días) con alertas por 'burn rate' del presupuesto de errores. Alertar por cada error individual o por CPU alta genera fatiga: el equipo aprende a ignorar las alertas y se pierde la que importa.",
    respuestaEn:
      "They're the three pillars of observability. LOGS are discrete detailed events ('payment for order X failed with this error'): great for investigating a specific case, but costly to store and query at volume. METRICS are numbers aggregated over time (requests per second, error rate, p95 latency, memory use): cheap, ideal for dashboards and alerts, but without per-case detail. TRACES show a request's path across services with per-stage timings: useful to find where latency goes or where a chain fails. Alerts use symptom-oriented metrics the user experiences, not internal causes: 5xx error rate, p95/p99 latency of the critical endpoint, checkout failures, ideally defined as SLOs (e.g. 99.9% successful requests over 30 days) with alerts on error-budget 'burn rate'. Alerting on every individual error or on high CPU causes fatigue: the team learns to ignore alerts and misses the one that matters.",
  },
];
