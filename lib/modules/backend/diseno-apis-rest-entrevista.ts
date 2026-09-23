import type { PreguntaEntrevista } from "../types";

export const entrevistaDisenoApisRest: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué convenciones seguís al diseñar las URLs de una API REST?",
    respuestaEs:
      "Las URLs identifican RECURSOS con sustantivos en plural, y la acción la indica el método HTTP: `GET /pedidos`, `POST /pedidos`, `GET /pedidos/41`, `PATCH /pedidos/41`, `DELETE /pedidos/41`; nunca verbos en la URL como `/obtenerPedidos` o `/pedidos/41/borrar`. Las relaciones se expresan anidando un nivel cuando el recurso pertenece claramente a otro (`GET /pedidos/41/items`), evitando anidamientos profundos: `/clientes/7/pedidos/41/items/3` es frágil; si el item tiene id propio, `/items/3` alcanza. Filtros, orden y paginación van como query params (`?estado=pagado&orden=-fecha&limit=20`). Las acciones que no encajan en CRUD se modelan como sub-recursos o como un recurso nuevo (`POST /pedidos/41/cancelacion` o `POST /pedidos/41/acciones/cancelar`), y se elige una convención de nombres (camelCase o snake_case en el JSON) y se respeta en toda la API. La consistencia vale más que cualquier regla puntual.",
    respuestaEn:
      "URLs identify RESOURCES with plural nouns, and the HTTP method expresses the action: `GET /orders`, `POST /orders`, `GET /orders/41`, `PATCH /orders/41`, `DELETE /orders/41`; never verbs in the URL like `/getOrders` or `/orders/41/delete`. Relationships are expressed by nesting one level when a resource clearly belongs to another (`GET /orders/41/items`), avoiding deep nesting: `/customers/7/orders/41/items/3` is brittle; if the item has its own id, `/items/3` is enough. Filters, sorting and pagination go as query params (`?status=paid&sort=-date&limit=20`). Actions that don't fit CRUD are modeled as sub-resources or a new resource (`POST /orders/41/cancellation` or `POST /orders/41/actions/cancel`), and a naming convention (camelCase or snake_case in JSON) is chosen and kept across the whole API. Consistency matters more than any single rule.",
  },
  {
    nivel: 1,
    pregunta: "¿Paginación por offset o por cursor?",
    respuestaEs:
      "Offset (`?limit=20&offset=40`) es simple, permite saltar a una página arbitraria ('ir a la página 7') y mostrar el total, pero tiene dos problemas. Performance: la base igual tiene que recorrer y descartar las 40 filas anteriores, así que las páginas lejanas se vuelven lentas en tablas grandes. Consistencia: si entre página y página se inserta o borra un elemento, todo se corre y el usuario ve duplicados o se saltea elementos. Cursor (`?limit=20&cursor=abc`) usa un marcador del último elemento visto (normalmente codificado a partir de la columna de orden y el id, para desempatar) y pide 'los que vienen después': con un índice, cada página cuesta lo mismo sin importar la profundidad, y los cambios en el medio no generan duplicados. A cambio, no se puede saltar a una página arbitraria ni saber fácilmente el total. Offset para tablas administrativas chicas con paginador numerado; cursor para feeds, scroll infinito, APIs públicas y tablas grandes.",
    respuestaEn:
      "Offset (`?limit=20&offset=40`) is simple, lets you jump to an arbitrary page ('go to page 7') and show the total, but has two problems. Performance: the database still has to scan and discard the previous 40 rows, so far pages get slow on large tables. Consistency: if an item is inserted or deleted between pages, everything shifts and the user sees duplicates or skips items. Cursor (`?limit=20&cursor=abc`) uses a marker of the last item seen (usually encoded from the sort column plus the id as tiebreaker) and asks for 'what comes after': with an index, every page costs the same regardless of depth, and changes in between don't create duplicates. In exchange, you can't jump to an arbitrary page or easily know the total. Offset for small admin tables with numbered pagers; cursor for feeds, infinite scroll, public APIs and large tables.",
    codigo: `-- offset: recorre y descarta 10.000 filas
SELECT * FROM posts ORDER BY creado DESC, id DESC LIMIT 20 OFFSET 10000;

-- cursor (keyset): usa el índice desde el último visto
SELECT * FROM posts
WHERE (creado, id) < ($1, $2)
ORDER BY creado DESC, id DESC
LIMIT 20;`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo diseñás el formato de errores de una API?",
    respuestaEs:
      "Consistente en TODOS los endpoints, así el cliente lo maneja en un solo lugar. El status HTTP comunica la categoría (400, 401, 403, 404, 409, 422, 429, 500) y el body agrega el detalle en una estructura fija. Una buena base es Problem Details (RFC 9457, `application/problem+json`): `type` (una URI que identifica el tipo de error), `title` (resumen legible), `status`, `detail` (explicación de esta ocurrencia) e `instance`, más extensiones propias. Conviene incluir un código de error estable y legible por máquina (`STOCK_INSUFICIENTE`), porque el cliente no debería parsear mensajes en texto, y para errores de validación una lista de campos con su problema (`[{ campo: 'email', mensaje: '...' }]`) para mostrarlos junto a cada input. Y un id de request o de trazabilidad, que el usuario pueda reportar y que permita encontrar el error en los logs. Lo que nunca va: stack traces, consultas SQL o mensajes internos en producción.",
    respuestaEn:
      "Consistent across ALL endpoints, so the client handles it in one place. The HTTP status communicates the category (400, 401, 403, 404, 409, 422, 429, 500) and the body adds detail in a fixed structure. A good base is Problem Details (RFC 9457, `application/problem+json`): `type` (a URI identifying the error type), `title` (readable summary), `status`, `detail` (explanation of this occurrence) and `instance`, plus custom extensions. Include a stable, machine-readable error code (`INSUFFICIENT_STOCK`), since the client shouldn't parse text messages, and for validation errors a list of fields with their problem (`[{ field: 'email', message: '...' }]`) to show next to each input. And a request or trace id the user can report and that lets you find the error in logs. What never goes in: stack traces, SQL queries or internal messages in production.",
    codigo: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.tienda.com/errores/validacion",
  "title": "Datos inválidos",
  "status": 422,
  "codigo": "VALIDACION",
  "errores": [{ "campo": "cantidad", "mensaje": "Tiene que ser mayor a 0" }],
  "requestId": "req_7f3a9c"
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo modelás una operación que tarda minutos en una API REST?",
    respuestaEs:
      "No se deja el request abierto esperando: los timeouts de proxies, balanceadores y clientes lo van a cortar, y se ocupan recursos del servidor. Se modela como un recurso de 'operación' o 'job'. El cliente hace `POST /reportes` y el servidor responde enseguida `202 Accepted` con un `Location: /reportes/77` (o `/operaciones/77`) y el estado inicial (`pendiente`). El trabajo se encola y lo procesa un worker. El cliente consulta `GET /reportes/77` para ver el estado (`pendiente`, `procesando`, `completado` con la URL del resultado, o `fallido` con el error), idealmente respetando un `Retry-After` para no consultar de más; o, mejor, el servidor avisa cuando termina por webhook, WebSocket, SSE o email. Conviene que la creación sea idempotente (con idempotency key) para que un reintento no dispare dos reportes, y que los resultados tengan un tiempo de expiración.",
    respuestaEn:
      "You don't leave the request open waiting: proxy, load balancer and client timeouts will cut it, and server resources are tied up. It's modeled as an 'operation' or 'job' resource. The client does `POST /reports` and the server immediately responds `202 Accepted` with `Location: /reports/77` (or `/operations/77`) and the initial status (`pending`). The work is queued and processed by a worker. The client polls `GET /reports/77` for status (`pending`, `processing`, `completed` with the result URL, or `failed` with the error), ideally honoring a `Retry-After` to avoid over-polling; or, better, the server notifies on completion via webhook, WebSocket, SSE or email. Creation should be idempotent (with an idempotency key) so a retry doesn't fire two reports, and results should have an expiration time.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo manejás actualizaciones concurrentes del mismo recurso (lost update)?",
    respuestaEs:
      "El problema: dos usuarios abren el mismo pedido, cada uno edita un campo distinto y guarda; si el servidor reemplaza el recurso completo con cada PUT, el segundo guardado pisa el cambio del primero sin que nadie se entere. La solución estándar es CONTROL DE CONCURRENCIA OPTIMISTA con precondiciones HTTP: al leer, el servidor devuelve un `ETag` (una versión del recurso, como un número de versión o un hash); al modificar, el cliente manda `If-Match: <etag>`, y el servidor aplica el cambio solo si la versión actual coincide. Si alguien lo modificó en el medio, responde `412 Precondition Failed` y el cliente tiene que volver a leer, mostrar el conflicto y decidir. En la base se implementa con una columna `version` y un `UPDATE ... WHERE id = $1 AND version = $2` que incrementa la versión. Además, usar PATCH con solo los campos cambiados reduce los choques, y para contadores u operaciones aditivas conviene una operación atómica en la base en vez de leer-modificar-escribir.",
    respuestaEn:
      "The problem: two users open the same order, each edits a different field and saves; if the server replaces the whole resource on each PUT, the second save overwrites the first's change without anyone noticing. The standard solution is OPTIMISTIC CONCURRENCY CONTROL with HTTP preconditions: on read, the server returns an `ETag` (a resource version, like a version number or hash); on modify, the client sends `If-Match: <etag>`, and the server applies the change only if the current version matches. If someone modified it in between, it responds `412 Precondition Failed` and the client must reread, show the conflict and decide. In the database it's implemented with a `version` column and an `UPDATE ... WHERE id = $1 AND version = $2` that increments the version. Also, using PATCH with only changed fields reduces collisions, and for counters or additive operations an atomic database operation beats read-modify-write.",
    codigo: `GET /pedidos/41          → 200, ETag: "v7"
PATCH /pedidos/41
If-Match: "v7"           → 200 si nadie lo cambió, ETag: "v8"
                         → 412 si ya está en "v8": hay que releer

UPDATE pedidos SET nota = $1, version = version + 1
WHERE id = $2 AND version = $3;   -- 0 filas afectadas = conflicto`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué es HATEOAS y por qué casi nadie lo implementa del todo?",
    respuestaEs:
      "Hypermedia As The Engine Of Application State es la restricción de REST (según la tesis de Roy Fielding) que dice que las respuestas deben incluir LINKS a las acciones y recursos relacionados disponibles, de modo que el cliente navegue la API descubriéndolas en vez de tener las URLs y las reglas codificadas: un pedido pendiente trae un link `cancelar`, uno ya enviado no. En teoría desacopla totalmente al cliente del servidor. En la práctica, la mayoría de las APIs 'REST' son en realidad 'JSON sobre HTTP con recursos', en el nivel 2 del modelo de madurez de Richardson (recursos más verbos HTTP), porque los clientes reales (una SPA, una app mobile) se construyen contra una documentación conocida, necesitan saber de antemano qué pantallas mostrar, y el beneficio de descubrir acciones en runtime rara vez justifica la complejidad. Una versión liviana que sí aporta: incluir links de paginación (`next`, `prev`) y, a veces, un campo de acciones permitidas para que la UI no duplique las reglas de negocio.",
    respuestaEn:
      "Hypermedia As The Engine Of Application State is the REST constraint (per Roy Fielding's dissertation) saying responses should include LINKS to the available related actions and resources, so the client navigates the API discovering them instead of having URLs and rules hardcoded: a pending order carries a `cancel` link, a shipped one doesn't. In theory it fully decouples client from server. In practice, most 'REST' APIs are really 'JSON over HTTP with resources', at level 2 of the Richardson maturity model (resources plus HTTP verbs), because real clients (an SPA, a mobile app) are built against known documentation, need to know upfront which screens to show, and the benefit of discovering actions at runtime rarely justifies the complexity. A lightweight version that does help: including pagination links (`next`, `prev`) and sometimes an allowed-actions field so the UI doesn't duplicate business rules.",
  },
];
