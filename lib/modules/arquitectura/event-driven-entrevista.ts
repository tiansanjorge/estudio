import type { PreguntaEntrevista } from "../types";

export const entrevistaEventDriven: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es una arquitectura orientada a eventos y qué ventajas tiene?",
    respuestaEs:
      "En vez de que un servicio llame directamente a otros para avisarles que algo pasó, PUBLICA un evento que describe un hecho ('PedidoCreado', 'PagoAprobado') en un broker o cola (Kafka, RabbitMQ, SQS, Redis Streams), y los servicios interesados se suscriben y reaccionan por su cuenta. Ventajas: desacoplamiento (el checkout no conoce a inventario, facturación ni email; sumar un consumidor nuevo no lo toca), resiliencia (si el servicio de email está caído, el evento espera en la cola y se procesa cuando vuelve, en vez de hacer fallar el checkout), menor latencia para el usuario (el request responde apenas se guarda y se publica, sin esperar a todos), y escalado independiente de cada consumidor según su carga. El costo es la complejidad: consistencia eventual, entregas duplicadas, orden de los mensajes, y flujos más difíciles de seguir y depurar.",
    respuestaEn:
      "Instead of a service directly calling others to tell them something happened, it PUBLISHES an event describing a fact ('OrderCreated', 'PaymentApproved') to a broker or queue (Kafka, RabbitMQ, SQS, Redis Streams), and interested services subscribe and react on their own. Advantages: decoupling (checkout doesn't know about inventory, billing or email; adding a new consumer doesn't touch it), resilience (if the email service is down, the event waits in the queue and is processed when it's back, instead of failing checkout), lower user latency (the request responds as soon as it saves and publishes, without waiting for everyone), and independent scaling of each consumer according to its load. The cost is complexity: eventual consistency, duplicate deliveries, message ordering, and flows that are harder to follow and debug.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre un comando y un evento?",
    respuestaEs:
      "Un COMANDO es una orden dirigida a un destinatario específico que puede aceptarla o rechazarla: 'CobrarPedido', 'EnviarMail'. Se nombra en imperativo, tiene un único receptor, y el emisor espera que se haga algo concreto. Un EVENTO es la notificación de un hecho que YA ocurrió: 'PedidoCreado', 'PagoRechazado'. Se nombra en pasado, puede tener cero, uno o muchos suscriptores, y el emisor no sabe ni le importa quién reacciona. La distinción importa para el acoplamiento: si el checkout publica el comando 'EnviarMailDeConfirmación', sigue sabiendo que existe un servicio de mails y qué tiene que hacer; si publica el evento 'PedidoCreado', la decisión de mandar un mail pertenece al servicio de notificaciones. Los eventos son inmutables y forman parte del contrato público del servicio, así que se versionan con el mismo cuidado que una API.",
    respuestaEn:
      "A COMMAND is an order addressed to a specific recipient that may accept or reject it: 'ChargeOrder', 'SendEmail'. It's named in the imperative, has a single receiver, and the sender expects something concrete to be done. An EVENT is the notification of a fact that ALREADY happened: 'OrderCreated', 'PaymentDeclined'. It's named in the past tense, can have zero, one or many subscribers, and the sender neither knows nor cares who reacts. The distinction matters for coupling: if checkout publishes the command 'SendConfirmationEmail', it still knows an email service exists and what it must do; if it publishes the event 'OrderCreated', deciding to send an email belongs to the notifications service. Events are immutable and part of the service's public contract, so they're versioned as carefully as an API.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué los consumidores de eventos tienen que ser idempotentes?",
    respuestaEs:
      "Porque la mayoría de los brokers garantizan entrega 'at-least-once' (al menos una vez), no 'exactly-once'. Un mensaje puede llegar dos veces si el consumidor lo procesó pero se cayó antes de confirmar (ack), si hubo un timeout de red, o durante un rebalanceo. Si procesar dos veces el evento 'PagoAprobado' genera dos facturas o descuenta dos veces el stock, hay un bug real en producción. Un consumidor idempotente produce el mismo resultado lo reciba una o varias veces. Técnicas: guardar el id de cada evento procesado (una tabla con constraint único) y descartar los repetidos, dentro de la misma transacción que el efecto; diseñar las operaciones como 'establecer' en vez de 'incrementar' (estado = pagado, no saldo += 100); o usar claves únicas de negocio (una factura por id de pedido). El 'exactly-once' de algunos sistemas existe, pero con condiciones muy específicas.",
    respuestaEn:
      "Because most brokers guarantee 'at-least-once' delivery, not 'exactly-once'. A message may arrive twice if the consumer processed it but crashed before acknowledging, if there was a network timeout, or during a rebalance. If processing 'PaymentApproved' twice creates two invoices or decrements stock twice, that's a real production bug. An idempotent consumer produces the same result whether it receives the message once or several times. Techniques: store each processed event id (a table with a unique constraint) and discard repeats, in the same transaction as the effect; design operations as 'set' rather than 'increment' (status = paid, not balance += 100); or use unique business keys (one invoice per order id). Some systems' 'exactly-once' exists, but under very specific conditions.",
    codigo: `async function alPagoAprobado(evento: PagoAprobado) {
  await db.$transaction(async (tx) => {
    // constraint único sobre eventoId: un duplicado lanza y se descarta
    await tx.eventoProcesado.create({ data: { eventoId: evento.id } });
    await tx.factura.create({ data: { pedidoId: evento.pedidoId, monto: evento.monto } });
  });
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué es la consistencia eventual y cómo impacta en la UX?",
    respuestaEs:
      "Significa que, después de un cambio, las distintas partes del sistema NO quedan actualizadas al mismo tiempo, pero sí llegan a estarlo en un plazo (normalmente milisegundos o segundos). En un sistema por eventos, el pedido se confirma de inmediato, pero el stock baja, la factura se genera y el historial se actualiza un rato después, cuando cada consumidor procesa el evento. Impacto en la UX: el usuario puede confirmar una compra e ir a 'Mis pedidos' antes de que aparezca; o ver stock disponible que en realidad ya se reservó. Se maneja de varias formas: la UI muestra el resultado del propio usuario de forma optimista (read-your-own-writes) en vez de releer de la vista que todavía no se actualizó; se comunican estados intermedios ('Procesando tu pago...'); se notifica cuando termina (WebSocket, polling o email); y las reglas críticas que no toleran inconsistencia se validan de forma sincrónica en el lugar donde vive el dato.",
    respuestaEn:
      "It means that after a change, the system's parts are NOT updated at the same time, but they do converge within a window (usually milliseconds or seconds). In an event-driven system, the order confirms immediately, but stock decreases, the invoice is generated and history updates a bit later, as each consumer processes the event. UX impact: the user may confirm a purchase and go to 'My orders' before it shows up; or see available stock that's actually already reserved. It's handled in several ways: the UI shows the user's own result optimistically (read-your-own-writes) instead of rereading from the not-yet-updated view; intermediate states are communicated ('Processing your payment...'); completion is notified (WebSocket, polling or email); and critical rules that can't tolerate inconsistency are validated synchronously where the data lives.",
    tradeoffs:
      "La consistencia eventual compra disponibilidad y desacoplamiento. Donde la inconsistencia tiene un costo de negocio alto (saldo de una cuenta), conviene una operación sincrónica y transaccional.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el problema de la doble escritura y cómo lo resuelve el patrón Outbox?",
    respuestaEs:
      "El servicio tiene que hacer dos cosas: guardar el pedido en su base y publicar 'PedidoCreado' en el broker. Son dos sistemas distintos, sin una transacción que los abarque. Si guarda y después se cae antes de publicar, el pedido existe pero nadie se entera (no se factura, no se descuenta stock). Si publica primero y la escritura falla, los demás reaccionan a un pedido que no existe. El patrón Transactional Outbox lo resuelve así: en la MISMA transacción de la base se guarda el pedido y se inserta el evento en una tabla `outbox`. Como es una sola transacción, o pasan las dos cosas o ninguna. Después, un proceso aparte (un poller, o Change Data Capture como Debezium leyendo el log de la base) lee la outbox, publica en el broker y marca como enviado. Si se cae entre publicar y marcar, el evento se publica de nuevo, por eso los consumidores tienen que ser idempotentes: la garantía resultante es at-least-once.",
    respuestaEn:
      "The service must do two things: save the order in its database and publish 'OrderCreated' to the broker. They're different systems, with no transaction spanning both. If it saves and then crashes before publishing, the order exists but nobody finds out (no invoice, no stock decrement). If it publishes first and the write fails, others react to an order that doesn't exist. The Transactional Outbox pattern solves it: in the SAME database transaction, the order is saved and the event is inserted into an `outbox` table. Being one transaction, both happen or neither does. Then a separate process (a poller, or Change Data Capture like Debezium reading the database log) reads the outbox, publishes to the broker and marks it sent. If it crashes between publishing and marking, the event is published again, which is why consumers must be idempotent: the resulting guarantee is at-least-once.",
    codigo: `await db.$transaction([
  db.pedido.create({ data: pedido }),
  db.outbox.create({
    data: { tipo: "PedidoCreado", payload: JSON.stringify(pedido) },
  }),
]);
// un worker aparte publica las filas de outbox en el broker y las marca`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué es una saga y cuándo la necesitás?",
    respuestaEs:
      "Es la forma de coordinar una operación de negocio que abarca varios servicios, cada uno con su propia base, sin una transacción distribuida (two-phase commit escala mal y acopla). La operación se divide en pasos locales, cada uno con su transacción, y cada paso tiene una ACCIÓN COMPENSATORIA que deshace su efecto si un paso posterior falla. Ejemplo de una compra: reservar stock, cobrar, crear el envío; si el cobro falla, se compensa liberando el stock reservado. Hay dos estilos: por COREOGRAFÍA, donde cada servicio escucha eventos y publica el siguiente (simple y desacoplado, pero el flujo completo no está escrito en ningún lado y es difícil de seguir cuando crece), y por ORQUESTACIÓN, donde un coordinador (un servicio o un motor de workflows como Temporal) le dice a cada uno qué hacer y maneja las compensaciones (el flujo queda explícito, a cambio de un componente central). Las compensaciones no siempre deshacen del todo: un mail enviado no se 'desenvía', se manda otro.",
    respuestaEn:
      "It's how to coordinate a business operation spanning several services, each with its own database, without a distributed transaction (two-phase commit scales poorly and couples). The operation is split into local steps, each with its own transaction, and each step has a COMPENSATING ACTION that undoes its effect if a later step fails. Purchase example: reserve stock, charge, create shipment; if the charge fails, compensate by releasing the reserved stock. There are two styles: CHOREOGRAPHY, where each service listens to events and publishes the next (simple and decoupled, but the full flow isn't written anywhere and gets hard to follow as it grows), and ORCHESTRATION, where a coordinator (a service or a workflow engine like Temporal) tells each one what to do and handles compensations (the flow is explicit, at the cost of a central component). Compensations don't always fully undo: a sent email can't be 'unsent', you send another.",
  },
];
