import type { PreguntaEntrevista } from "../types";

export const entrevistaFetchRequests: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué `fetch` no rechaza la Promise ante un 404 o un 500, y cómo lo manejás?",
    respuestaEs:
      "Porque para `fetch` un 404 o un 500 NO es una falla: el servidor respondió correctamente con un status, y la Promise se resuelve con un `Response` apenas llegan los headers. Solo rechaza cuando no hay respuesta HTTP: sin conexión, DNS que no resuelve, CORS bloqueando, o una cancelación con AbortController. Por eso hay que chequear `response.ok` (true para 2xx) o `response.status` y convertir los errores HTTP en excepciones a mano, idealmente en un solo lugar: un wrapper o cliente de API que lanza un error tipado con el status y el body del error, así el resto de la app los maneja con un solo `try/catch`. Axios, en cambio, rechaza por defecto ante status fuera de 2xx, y es una de las diferencias que conviene conocer.",
    respuestaEn:
      "Because to `fetch` a 404 or 500 is NOT a failure: the server responded correctly with a status, and the Promise resolves with a `Response` as soon as headers arrive. It only rejects when there's no HTTP response: no connection, DNS that doesn't resolve, CORS blocking, or cancellation via AbortController. So you check `response.ok` (true for 2xx) or `response.status` and turn HTTP errors into exceptions yourself, ideally in one place: a wrapper or API client that throws a typed error with the status and error body, so the rest of the app handles them with a single `try/catch`. Axios, by contrast, rejects by default on non-2xx statuses, a difference worth knowing.",
    codigo: `class ErrorHttp extends Error {
  constructor(public status: number, public cuerpo: unknown) {
    super(\`HTTP \${status}\`);
  }
}

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new ErrorHttp(res.status, await res.json().catch(() => null));
  return res.json() as Promise<T>;
}`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué es una race condition entre requests y cómo la evitás?",
    respuestaEs:
      "Pasa cuando se disparan varios requests para lo mismo y las respuestas llegan en otro orden: en un buscador, el usuario escribe 're' y después 'react'; si la respuesta de 're' tarda más, llega última y pisa los resultados correctos de 'react'. La solución principal es cancelar el request anterior al disparar uno nuevo con `AbortController`: se pasa su `signal` al `fetch` y se llama a `abort()` cuando ya no sirve (en React, en la función de cleanup del efecto). Al abortar, el fetch rechaza con un error de nombre `AbortError`, que hay que ignorar en vez de mostrarlo como falla. Complementos: debounce para no disparar un request por tecla, y librerías como TanStack Query, que asocian cada respuesta a su clave y descartan las obsoletas.",
    respuestaEn:
      "It happens when several requests fire for the same thing and responses arrive out of order: in a search box, the user types 're' then 'react'; if the 're' response is slower, it arrives last and overwrites the correct 'react' results. The main fix is cancelling the previous request when firing a new one with `AbortController`: pass its `signal` to `fetch` and call `abort()` when it's no longer needed (in React, in the effect's cleanup). On abort, fetch rejects with an error named `AbortError`, which should be ignored rather than shown as a failure. Complements: debounce so you don't fire a request per keystroke, and libraries like TanStack Query, which tie each response to its key and discard stale ones.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo implementarías timeouts y reintentos en las llamadas a una API?",
    respuestaEs:
      "`fetch` no tiene timeout propio: puede quedar colgado indefinidamente. Se agrega con `AbortSignal.timeout(ms)`, y si además hay que poder cancelar manualmente, se combinan señales con `AbortSignal.any([...])`. Para los reintentos, tres reglas. Solo reintentar lo que tiene sentido: errores de red, timeouts, 408, 429, 502, 503 y 504; nunca un 400 o un 404, que van a fallar igual. Solo reintentar requests idempotentes, o POST con idempotency key. Y esperar con backoff exponencial más jitter (por ejemplo 200 ms, 400 ms, 800 ms, cada uno con un componente aleatorio), respetando `Retry-After` si el servidor lo manda; sin jitter, miles de clientes reintentan al mismo tiempo y generan picos que vuelven a tirar el servicio (thundering herd). Con un límite de intentos, y reportando el error si se agotan.",
    respuestaEn:
      "`fetch` has no built-in timeout: it can hang indefinitely. Add one with `AbortSignal.timeout(ms)`, and if manual cancellation is also needed, combine signals with `AbortSignal.any([...])`. For retries, three rules. Only retry what makes sense: network errors, timeouts, 408, 429, 502, 503 and 504; never a 400 or 404, which will fail again. Only retry idempotent requests, or POSTs with an idempotency key. And wait with exponential backoff plus jitter (e.g. 200 ms, 400 ms, 800 ms, each with a random component), honoring `Retry-After` if the server sends it; without jitter, thousands of clients retry at the same moment and create spikes that knock the service down again (thundering herd). With an attempt cap, reporting the error when exhausted.",
    codigo: `const REINTENTABLES = new Set([408, 429, 502, 503, 504]);

async function conReintentos(url: string, intentos = 3): Promise<Response> {
  for (let i = 0; ; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!REINTENTABLES.has(res.status) || i === intentos - 1) return res;
    } catch (error) {
      if (i === intentos - 1) throw error;
    }
    const espera = 200 * 2 ** i * (0.5 + Math.random()); // backoff + jitter
    await new Promise((r) => setTimeout(r, espera));
  }
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencias prácticas hay entre `fetch` y `XMLHttpRequest` hoy?",
    respuestaEs:
      "`fetch` es la API moderna: basada en Promises, con `Request`/`Response` estándar, streaming del body, `AbortController`, y disponible también en Node, Deno y los runtimes de servidor. `XMLHttpRequest` es la API vieja basada en eventos, pero conserva una ventaja real: el progreso de SUBIDA con `xhr.upload.onprogress`, algo que `fetch` todavía no ofrece de forma práctica en todos los navegadores; por eso muchas implementaciones de barra de progreso al subir archivos siguen usando XHR (o librerías que lo usan por debajo, como Axios en el navegador). El progreso de BAJADA sí se puede calcular con `fetch` leyendo `response.body` como stream y comparando con `Content-Length`. Otras diferencias: XHR permite requests sincrónicos (deprecados, bloquean el hilo) y `fetch` tiene opciones como `keepalive` para requests que tienen que completarse aunque se cierre la página.",
    respuestaEn:
      "`fetch` is the modern API: Promise-based, with standard `Request`/`Response`, body streaming, `AbortController`, and also available in Node, Deno and server runtimes. `XMLHttpRequest` is the old event-based API, but keeps one real advantage: UPLOAD progress via `xhr.upload.onprogress`, something `fetch` still doesn't offer practically across all browsers; that's why many file-upload progress bars still use XHR (or libraries using it underneath, like Axios in the browser). DOWNLOAD progress can be computed with `fetch` by reading `response.body` as a stream and comparing against `Content-Length`. Other differences: XHR allows synchronous requests (deprecated, they block the thread) and `fetch` has options like `keepalive` for requests that must complete even if the page closes.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo mandás datos de analytics de forma confiable cuando el usuario cierra la pestaña?",
    respuestaEs:
      "Un `fetch` normal disparado al cerrar la página se cancela cuando el documento se descarga, así que los datos se pierden. Hay dos herramientas diseñadas para esto: `navigator.sendBeacon(url, datos)`, que encola un POST que el navegador completa en segundo plano aunque la página ya no exista, y `fetch(url, { keepalive: true })`, que hace lo mismo con la API completa de fetch (headers, método). Ambas tienen un límite de tamaño (del orden de 64 KB en total para los requests pendientes) y no permiten leer la respuesta. El otro punto es CUÁNDO mandar: el evento `unload` no es confiable (no se dispara en mobile al cambiar de app y rompe el back/forward cache), así que se usa `visibilitychange` cuando `document.visibilityState` pasa a `hidden`, que es el último momento confiable en el que la página tiene la atención del usuario.",
    respuestaEn:
      "A regular `fetch` fired on page close is cancelled when the document unloads, so the data is lost. Two tools are designed for this: `navigator.sendBeacon(url, data)`, which queues a POST the browser completes in the background even after the page is gone, and `fetch(url, { keepalive: true })`, which does the same with the full fetch API (headers, method). Both have a size limit (around 64 KB total for pending requests) and don't let you read the response. The other point is WHEN to send: the `unload` event isn't reliable (it doesn't fire on mobile when switching apps and breaks the back/forward cache), so you use `visibilitychange` when `document.visibilityState` becomes `hidden`, the last reliable moment the page has the user's attention.",
    codigo: `document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    navigator.sendBeacon("/analytics", JSON.stringify(eventosPendientes));
  }
});`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué es un circuit breaker y cuándo lo aplicarías en un cliente de API?",
    respuestaEs:
      "Es un patrón para no seguir golpeando un servicio que está fallando. Tiene tres estados: cerrado (los requests pasan normalmente y se cuentan los errores), abierto (después de N fallas seguidas, los requests se rechazan de inmediato sin llegar al servicio, durante un tiempo) y semiabierto (pasado ese tiempo, se deja pasar un request de prueba: si sale bien se vuelve a cerrado, si falla se abre otra vez). Los reintentos resuelven fallas transitorias de un request; el circuit breaker resuelve caídas prolongadas del servicio, evitando que los reintentos lo saturen y que el cliente acumule requests colgados esperando timeouts. Es más habitual del lado del servidor (un backend que llama a otro servicio), pero en un frontend con muchas llamadas a un mismo servicio caído también ayuda: la UI muestra enseguida un estado degradado en vez de un spinner eterno.",
    respuestaEn:
      "It's a pattern to stop hammering a failing service. It has three states: closed (requests pass normally and errors are counted), open (after N consecutive failures, requests are rejected immediately without reaching the service, for a while) and half-open (after that time, one test request is let through: if it succeeds it closes again, if it fails it reopens). Retries handle transient failures of one request; the circuit breaker handles prolonged service outages, preventing retries from overwhelming it and the client from piling up requests hung on timeouts. It's more common server-side (a backend calling another service), but in a frontend with many calls to the same down service it also helps: the UI immediately shows a degraded state instead of an endless spinner.",
    tradeoffs:
      "El umbral y el tiempo de apertura son un equilibrio: muy sensibles cortan el servicio ante un error aislado; muy laxos no protegen durante una caída real.",
  },
];
