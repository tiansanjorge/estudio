import type { PreguntaEntrevista } from "../types";

export const entrevistaRestGraphqlWebsockets: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuándo elegirías REST, GraphQL o WebSockets?",
    respuestaEs:
      "REST es el default razonable: recursos con URLs propias, verbos HTTP, status codes y caching HTTP estándar; lo entiende cualquier cliente y cualquier herramienta, y encaja bien cuando las pantallas se corresponden con los recursos. GraphQL conviene cuando hay muchos clientes con necesidades distintas (web, mobile, terceros) sobre un modelo de datos muy relacionado, y el overfetching o las cascadas de requests son un problema real: cada cliente pide exactamente los campos que necesita en una sola query, a cambio de complejidad en el servidor y un caching más difícil. WebSockets no compite con los otros dos: es para cuando el SERVIDOR necesita empujar datos en tiempo real (chat, colaboración, precios en vivo, notificaciones) o hay mucho intercambio bidireccional de baja latencia. Lo habitual es combinarlos: REST o GraphQL para leer y mutar, y un canal en tiempo real solo para lo que realmente lo necesita.",
    respuestaEn:
      "REST is the reasonable default: resources with their own URLs, HTTP verbs, status codes and standard HTTP caching; any client and tool understands it, and it fits well when screens map to resources. GraphQL pays off when there are many clients with different needs (web, mobile, third parties) over a highly relational data model, and overfetching or request waterfalls are a real problem: each client asks for exactly the fields it needs in one query, at the cost of server complexity and harder caching. WebSockets doesn't compete with the other two: it's for when the SERVER needs to push data in real time (chat, collaboration, live prices, notifications) or there's heavy low-latency bidirectional exchange. Combining them is common: REST or GraphQL to read and mutate, and a real-time channel only for what truly needs it.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué son el overfetching y el underfetching?",
    respuestaEs:
      "Overfetching es recibir más datos de los que la pantalla usa: un endpoint `/usuarios/42` devuelve 40 campos y la tarjeta muestra el nombre y el avatar; se desperdicia transferencia y procesamiento, algo que pesa sobre todo en mobile. Underfetching es lo contrario: un endpoint no trae todo lo necesario y hay que hacer requests adicionales, a veces en cascada (el usuario, después sus posts, después los comentarios de cada post), sumando round trips. GraphQL resuelve ambos porque el cliente declara la forma exacta de la respuesta. En REST se mitiga con parámetros de campos (`?fields=nombre,avatar`), con endpoints de inclusión (`?include=posts`) o con un BFF (Backend for Frontend) que arma exactamente la respuesta que necesita cada pantalla.",
    respuestaEn:
      "Overfetching is receiving more data than the screen uses: a `/users/42` endpoint returns 40 fields and the card shows name and avatar; transfer and processing are wasted, which hurts especially on mobile. Underfetching is the opposite: an endpoint doesn't bring everything needed and extra requests are required, sometimes in a waterfall (the user, then their posts, then each post's comments), adding round trips. GraphQL solves both because the client declares the exact response shape. In REST it's mitigated with field parameters (`?fields=name,avatar`), inclusion parameters (`?include=posts`) or a BFF (Backend for Frontend) that builds exactly the response each screen needs.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué es el problema N+1 en GraphQL y cómo se resuelve?",
    respuestaEs:
      "En GraphQL cada campo se resuelve con su propio resolver. Si una query pide 50 posts y el autor de cada uno, el resolver de posts hace 1 consulta, y el resolver de `autor` se ejecuta 50 veces, una por post: 51 consultas a la base para algo que debería ser 2. Es fácil de introducir porque cada resolver por separado parece correcto. La solución estándar es DataLoader: en vez de consultar inmediatamente, el resolver pide el autor a un loader, que junta todos los ids pedidos durante el mismo tick del event loop y hace una sola consulta `WHERE id IN (...)`, además de cachear dentro del request. El loader tiene que crearse por request, para no compartir datos entre usuarios. Otra alternativa es que el resolver padre mire qué campos pide la query y haga un JOIN, más eficiente pero más acoplado.",
    respuestaEn:
      "In GraphQL each field resolves with its own resolver. If a query asks for 50 posts and each one's author, the posts resolver makes 1 query, and the `author` resolver runs 50 times, one per post: 51 database queries for something that should be 2. It's easy to introduce because each resolver looks correct in isolation. The standard fix is DataLoader: instead of querying immediately, the resolver asks a loader for the author, which batches all ids requested during the same event loop tick into a single `WHERE id IN (...)` query, and caches within the request. The loader must be created per request, to avoid sharing data between users. An alternative is the parent resolver inspecting the requested fields and doing a JOIN, more efficient but more coupled.",
    codigo: `// ❌ una consulta por post
autor: (post) => db.usuario.findUnique({ where: { id: post.autorId } }),

// ✅ una sola consulta por lote
const autorLoader = new DataLoader(async (ids) => {
  const usuarios = await db.usuario.findMany({ where: { id: { in: ids } } });
  return ids.map((id) => usuarios.find((u) => u.id === id));
});
autor: (post, _, ctx) => ctx.autorLoader.load(post.autorId),`,
  },
  {
    nivel: 2,
    pregunta: "¿WebSockets, Server-Sent Events o polling? ¿Cuándo cada uno?",
    respuestaEs:
      "Polling (pedir cada N segundos) es lo más simple y robusto: funciona con cualquier infraestructura y cache, y alcanza cuando los datos cambian poco o un retraso de segundos es aceptable; el costo son requests vacíos y latencia igual al intervalo. Server-Sent Events es un stream HTTP del servidor al cliente: unidireccional, texto, con reconexión automática y `Last-Event-ID` incluidos en el navegador, y funciona sobre HTTP/2 sin configuración especial en proxies; es ideal para notificaciones, feeds en vivo o el streaming de respuestas de un LLM. WebSockets es bidireccional, de baja latencia y admite binario, pero es un protocolo aparte: requiere manejar reconexión, heartbeats y escalado a mano, y algunos proxies o firewalls corporativos lo complican. Regla: si el cliente solo recibe, SSE; si hay intercambio constante en ambas direcciones (chat, juegos, edición colaborativa), WebSockets; si el tiempo real es 'nice to have', polling.",
    respuestaEn:
      "Polling (requesting every N seconds) is simplest and most robust: it works with any infrastructure and cache, and is enough when data changes rarely or a few seconds' delay is acceptable; the cost is empty requests and latency equal to the interval. Server-Sent Events is an HTTP stream from server to client: unidirectional, text, with automatic reconnection and `Last-Event-ID` built into the browser, and it works over HTTP/2 with no special proxy setup; ideal for notifications, live feeds or streaming LLM responses. WebSockets is bidirectional, low-latency and supports binary, but it's a separate protocol: you handle reconnection, heartbeats and scaling yourself, and some proxies or corporate firewalls complicate it. Rule: if the client only receives, SSE; if there's constant two-way exchange (chat, games, collaborative editing), WebSockets; if real time is nice-to-have, polling.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo protegés una API GraphQL pública de queries abusivas?",
    respuestaEs:
      "Como el cliente arma la query, puede pedir algo extremadamente caro en un solo request: relaciones anidadas diez niveles (usuario → amigos → amigos → ...), listas enormes o alias que repiten el mismo campo cien veces. Las defensas: límite de profundidad; análisis de costo o complejidad antes de ejecutar (cada campo tiene un peso, las listas multiplican por el tamaño pedido, y se rechaza la query si supera un presupuesto); paginación obligatoria con máximos; timeouts; y rate limiting por costo, no solo por cantidad de requests. Para clientes propios, las persisted queries son la defensa más fuerte: el servidor solo acepta queries registradas de antemano, identificadas por un hash, lo que además permite mandarlas por GET y cachearlas en un CDN. Y conviene deshabilitar la introspección en producción si la API no es pública, para no regalar el mapa completo del schema.",
    respuestaEn:
      "Since the client builds the query, it can request something extremely expensive in a single request: relations nested ten levels (user → friends → friends → ...), huge lists, or aliases repeating the same field a hundred times. Defenses: depth limits; cost or complexity analysis before execution (each field has a weight, lists multiply by the requested size, and the query is rejected past a budget); mandatory pagination with maximums; timeouts; and cost-based rate limiting, not just request count. For first-party clients, persisted queries are the strongest defense: the server only accepts queries registered in advance, identified by a hash, which also allows sending them via GET and caching them on a CDN. And disable introspection in production if the API isn't public, so you don't hand out the full schema map.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué desafíos tiene escalar WebSockets a varias instancias del servidor?",
    respuestaEs:
      "Una conexión WebSocket vive en UNA instancia. Si el usuario A está conectado a la instancia 1 y el usuario B a la 2, un mensaje de A para B no llega si la instancia 1 no sabe dónde está B. La solución es un bus de mensajes compartido (Redis pub/sub, NATS, Kafka): cada instancia publica los eventos y se suscribe a los canales de sus clientes. Otros desafíos: el load balancer tiene que soportar conexiones largas y el upgrade de protocolo; cada conexión consume memoria, así que la capacidad se mide en conexiones simultáneas y no en requests por segundo; un deploy corta todas las conexiones de una instancia a la vez, lo que exige reconexión del cliente con backoff y jitter para no generar una avalancha; hacen falta heartbeats para detectar conexiones muertas; y la autenticación es particular: la API de WebSocket del navegador no permite headers custom, así que se usa la cookie (verificando el header `Origin` para evitar cross-site WebSocket hijacking) o un token de corta duración en la URL o en el primer mensaje.",
    respuestaEn:
      "A WebSocket connection lives on ONE instance. If user A is connected to instance 1 and user B to instance 2, a message from A to B doesn't arrive if instance 1 doesn't know where B is. The fix is a shared message bus (Redis pub/sub, NATS, Kafka): each instance publishes events and subscribes to its clients' channels. Other challenges: the load balancer must support long-lived connections and the protocol upgrade; each connection consumes memory, so capacity is measured in concurrent connections, not requests per second; a deploy drops all of an instance's connections at once, requiring client reconnection with backoff and jitter to avoid a stampede; heartbeats are needed to detect dead connections; and authentication is special: the browser WebSocket API doesn't allow custom headers, so you use the cookie (checking the `Origin` header to prevent cross-site WebSocket hijacking) or a short-lived token in the URL or first message.",
    tradeoffs:
      "Un servicio administrado de tiempo real (Pusher, Ably, o el de tu cloud) resuelve el escalado y la reconexión a cambio de costo y dependencia de un proveedor.",
  },
];
