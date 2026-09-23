import type { PreguntaEntrevista } from "../types";

export const entrevistaMetodosStatus: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa que un método HTTP sea seguro o idempotente? Dá ejemplos.",
    respuestaEs:
      "Seguro significa que no modifica el estado del servidor: GET, HEAD y OPTIONS; se pueden repetir, precargar o cachear sin consecuencias. Idempotente significa que ejecutarlo una vez o N veces con los mismos datos deja el servidor en el mismo estado final: GET, HEAD, OPTIONS, PUT y DELETE. PUT reemplaza el recurso entero, así que repetirlo da lo mismo; DELETE borra, y borrar algo ya borrado no cambia nada (aunque la segunda respuesta sea 404). POST no es ni seguro ni idempotente: dos POST crean dos recursos. PATCH no es idempotente por definición: depende de la operación (poner un campo en un valor sí lo es, incrementar un contador no). Importa en la práctica porque los clientes, proxies y librerías reintentan automáticamente solo lo idempotente, y porque define qué se puede cachear.",
    respuestaEn:
      "Safe means it doesn't modify server state: GET, HEAD and OPTIONS; they can be repeated, prefetched or cached with no consequences. Idempotent means executing it once or N times with the same data leaves the server in the same final state: GET, HEAD, OPTIONS, PUT and DELETE. PUT replaces the whole resource, so repeating it changes nothing; DELETE removes, and deleting something already deleted changes nothing (even if the second response is 404). POST is neither safe nor idempotent: two POSTs create two resources. PATCH isn't idempotent by definition: it depends on the operation (setting a field to a value is, incrementing a counter isn't). It matters in practice because clients, proxies and libraries automatically retry only idempotent requests, and because it defines what can be cached.",
  },
  {
    nivel: 1,
    pregunta: "¿Cuál es la diferencia entre 401 y 403? ¿Y entre 400 y 422?",
    respuestaEs:
      "401 Unauthorized, pese al nombre, es un problema de AUTENTICACIÓN: el servidor no sabe quién sos (falta el token, venció o es inválido); el cliente puede resolverlo logueándose. 403 Forbidden es de AUTORIZACIÓN: sabe quién sos, pero no tenés permiso; loguearse de nuevo no cambia nada. Entre 400 y 422: 400 Bad Request es un request mal formado, que el servidor no puede ni interpretar (JSON inválido, falta un parámetro obligatorio de la URL); 422 Unprocessable Content es un request bien formado pero semánticamente inválido (el JSON parsea, pero el email no tiene formato de email o la fecha de fin es anterior a la de inicio). Muchas APIs usan 400 para ambos casos, y está bien si es consistente; lo importante es que sean 4xx, porque el error es del cliente, y que el body diga qué campo falló y por qué.",
    respuestaEn:
      "401 Unauthorized, despite the name, is an AUTHENTICATION problem: the server doesn't know who you are (missing, expired or invalid token); the client can fix it by logging in. 403 Forbidden is AUTHORIZATION: it knows who you are, but you lack permission; logging in again changes nothing. Between 400 and 422: 400 Bad Request is a malformed request the server can't even interpret (invalid JSON, a missing required URL parameter); 422 Unprocessable Content is a well-formed but semantically invalid request (the JSON parses, but the email isn't an email or the end date precedes the start date). Many APIs use 400 for both, which is fine if consistent; what matters is that they're 4xx, since it's a client error, and that the body says which field failed and why.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo hacés que un POST de pago sea seguro de reintentar si se corta la red?",
    respuestaEs:
      "El problema: el cliente manda el POST, el servidor lo procesa y cobra, pero la respuesta se pierde por un timeout. El cliente no sabe si se cobró, y reintentar un POST puede cobrar dos veces. La solución estándar es una idempotency key: el cliente genera un identificador único por operación (un UUID) y lo manda en un header como `Idempotency-Key`. El servidor guarda la key junto con el resultado de la primera ejecución; si llega otro request con la misma key, no vuelve a ejecutar la operación y devuelve la respuesta guardada. Si el segundo llega mientras el primero todavía se está procesando, se responde 409 para que el cliente espere. Hay que definir cuánto tiempo se guardan las keys y verificar que un reintento con la misma key y un body distinto se rechace. Es el patrón que usan Stripe y la mayoría de las APIs de pago.",
    respuestaEn:
      "The problem: the client sends the POST, the server processes and charges, but the response is lost to a timeout. The client doesn't know whether it was charged, and retrying a POST might charge twice. The standard fix is an idempotency key: the client generates a unique id per operation (a UUID) and sends it in a header like `Idempotency-Key`. The server stores the key with the result of the first execution; if another request arrives with the same key, it doesn't run the operation again and returns the stored response. If the second arrives while the first is still processing, respond 409 so the client waits. You need to define how long keys are kept and check that a retry with the same key but a different body is rejected. It's the pattern used by Stripe and most payment APIs.",
    codigo: `POST /pagos
Idempotency-Key: 5f1c9a2e-8b3d-4e7a-9c11-2d4f6a8b0c3e
Content-Type: application/json

{ "pedidoId": "A-1042", "monto": 15000 }`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué status usarías para crear un recurso, para una operación asíncrona y para rate limiting?",
    respuestaEs:
      "Para crear: 201 Created, con un header `Location` que apunta a la URL del recurso nuevo y, normalmente, el recurso en el body. Para una operación que se acepta pero se procesa después (generar un reporte, procesar un video): 202 Accepted, con un `Location` o un id para consultar el estado; no es un 200 porque todavía no terminó. Para una operación exitosa sin nada que devolver (un DELETE, un PUT que no devuelve el recurso): 204 No Content. Para rate limiting: 429 Too Many Requests con `Retry-After` indicando cuándo volver a intentar. Y para caída temporal o mantenimiento: 503 Service Unavailable, también con `Retry-After`. Los headers importan tanto como el código: le dicen al cliente qué hacer después.",
    respuestaEn:
      "To create: 201 Created, with a `Location` header pointing to the new resource's URL and, usually, the resource in the body. For an operation accepted but processed later (generating a report, processing a video): 202 Accepted, with a `Location` or id to poll status; not 200 since it's not done yet. For a successful operation with nothing to return (a DELETE, a PUT that doesn't return the resource): 204 No Content. For rate limiting: 429 Too Many Requests with `Retry-After` indicating when to retry. And for temporary outage or maintenance: 503 Service Unavailable, also with `Retry-After`. Headers matter as much as the code: they tell the client what to do next.",
    tradeoffs:
      "Devolver el recurso en el 201 le ahorra al cliente un GET extra, a costa de un payload más grande; con 204 la respuesta es mínima pero el cliente tiene que pedir el estado actualizado si lo necesita.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué diferencia hay entre 301, 302, 303, 307 y 308?",
    respuestaEs:
      "Todos redirigen con un header `Location`, pero difieren en dos ejes: si es permanente y si se conserva el método. 301 (permanente) y 302 (temporal) son los históricos, y en la práctica los navegadores convertían un POST redirigido en GET, un comportamiento que la especificación terminó aceptando. Para eliminar esa ambigüedad aparecieron 307 (temporal) y 308 (permanente), que garantizan que el método y el body se mantengan: un POST redirigido con 307 sigue siendo POST. 303 See Other dice explícitamente 'andá a esta otra URL con GET', y es la base del patrón Post/Redirect/Get: después de procesar un formulario se responde 303 hacia la página de resultado, así que refrescar la página no reenvía el formulario. Los permanentes (301, 308) los cachean navegadores y buscadores, que transfieren el posicionamiento a la URL nueva; por eso un 301 puesto por error es difícil de deshacer.",
    respuestaEn:
      "All redirect with a `Location` header, but they differ on two axes: whether it's permanent and whether the method is preserved. 301 (permanent) and 302 (temporary) are the historical ones, and in practice browsers turned a redirected POST into a GET, behavior the spec ended up accepting. To remove that ambiguity, 307 (temporary) and 308 (permanent) appeared, guaranteeing method and body are kept: a POST redirected with 307 is still a POST. 303 See Other explicitly says 'go to this other URL with GET', and it's the basis of the Post/Redirect/Get pattern: after processing a form you respond 303 to the result page, so refreshing doesn't resubmit the form. Permanent ones (301, 308) are cached by browsers and search engines, which transfer ranking to the new URL; that's why a mistaken 301 is hard to undo.",
  },
  {
    nivel: 3,
    pregunta:
      "Un usuario pide `/facturas/123`, que existe pero pertenece a otra persona. ¿Respondés 403 o 404?",
    respuestaEs:
      "Depende de si la EXISTENCIA del recurso es información sensible. Con 403 le confirmás que la factura 123 existe, y un atacante puede enumerar ids para descubrir cuántas facturas hay, qué usuarios existen o qué recursos son válidos. Con 404 el recurso es indistinguible de uno inexistente, así que no se filtra nada; la especificación lo permite explícitamente cuando el servidor no quiere revelar que el recurso existe. Por eso muchas APIs responden 404 ante recursos de otros usuarios, y se complementa con ids no secuenciales (UUID) para que enumerar sea impráctico. El 403 sigue siendo correcto cuando la existencia no es secreta y conviene que el usuario entienda que le falta un permiso, por ejemplo en un panel interno donde sabe que la sección existe. Lo importante es que la decisión sea consciente y consistente en toda la API.",
    respuestaEn:
      "It depends on whether the resource's EXISTENCE is sensitive information. With 403 you confirm invoice 123 exists, and an attacker can enumerate ids to learn how many invoices there are, which users exist or which resources are valid. With 404 the resource is indistinguishable from a nonexistent one, so nothing leaks; the spec explicitly allows it when the server doesn't want to reveal the resource exists. That's why many APIs respond 404 to other users' resources, complemented with non-sequential ids (UUID) so enumeration is impractical. 403 is still right when existence isn't secret and it helps the user understand they lack a permission, e.g. in an internal panel where they know the section exists. What matters is that the decision is deliberate and consistent across the API.",
  },
];
