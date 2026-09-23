import type { PreguntaEntrevista } from "../types";

export const entrevistaCachingHttp: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre `no-cache`, `no-store` y `max-age`?",
    respuestaEs:
      "`max-age=N` dice que la respuesta es fresca durante N segundos: en ese lapso el navegador la usa directamente, sin preguntarle nada al servidor. `no-cache`, pese al nombre, SÍ guarda la respuesta, pero obliga a revalidarla con el servidor antes de cada uso: el navegador manda el `ETag` en `If-None-Match` (o la fecha en `If-Modified-Since`) y, si no cambió, recibe un 304 sin body. Ahorra transferencia, pero no el round trip. `no-store` es el único que prohíbe guardar la respuesta en cualquier cache: siempre se descarga completa; se usa para datos sensibles, como un extracto bancario. Resumen: max-age evita el request, no-cache evita la descarga, no-store no evita nada.",
    respuestaEn:
      "`max-age=N` says the response is fresh for N seconds: during that time the browser uses it directly, without asking the server anything. `no-cache`, despite the name, DOES store the response, but forces revalidation with the server before each use: the browser sends the `ETag` in `If-None-Match` (or the date in `If-Modified-Since`) and, if unchanged, gets a bodyless 304. It saves transfer, not the round trip. `no-store` is the only one that forbids storing the response in any cache: it's always fully downloaded; used for sensitive data like a bank statement. Summary: max-age avoids the request, no-cache avoids the download, no-store avoids nothing.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo funciona una revalidación con ETag?",
    respuestaEs:
      "El servidor manda junto con la respuesta un `ETag`, un identificador de esa versión del recurso (típicamente un hash del contenido). Cuando la copia guardada deja de estar fresca, el navegador no la descarta: hace el request agregando `If-None-Match: <etag>`. Si el recurso no cambió, el servidor responde `304 Not Modified` sin body y el navegador reutiliza su copia, renovando su frescura; si cambió, responde 200 con el contenido nuevo y un ETag nuevo. Es el mismo mecanismo con `Last-Modified` e `If-Modified-Since`, pero basado en fechas, con precisión de un segundo y menos confiable si varios servidores generan el mismo archivo con fechas distintas. El 304 ahorra el body, pero sigue costando un round trip.",
    respuestaEn:
      "Alongside the response, the server sends an `ETag`, an identifier for that version of the resource (typically a content hash). When the stored copy stops being fresh, the browser doesn't discard it: it makes the request adding `If-None-Match: <etag>`. If the resource hasn't changed, the server responds `304 Not Modified` without a body and the browser reuses its copy, renewing its freshness; if it changed, it responds 200 with the new content and a new ETag. `Last-Modified` and `If-Modified-Since` work the same way but date-based, with one-second precision and less reliable when several servers generate the same file with different dates. The 304 saves the body, but still costs a round trip.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué política de cache le pondrías al HTML, a los assets con hash y a una API por usuario?",
    respuestaEs:
      "A los assets estáticos con hash en el nombre (`app.3f9a1c.js`): `public, max-age=31536000, immutable`. Como el nombre cambia con cada versión, el archivo nunca cambia para la misma URL, así que puede cachearse un año sin revalidar; `immutable` evita que el navegador lo revalide al recargar. Esa es la técnica de cache busting. Al HTML: `no-cache` (o un max-age muy corto): tiene que revalidarse siempre, porque es el que apunta a los nombres nuevos de los assets; si el HTML se cacheara un año, nadie vería el deploy nuevo. A una API con datos del usuario: `private` (solo el navegador de ese usuario puede guardarla, nunca un CDN compartido) con max-age corto o `no-cache`; y `no-store` si los datos son sensibles. Si un CDN puede cachear algo por más tiempo que el navegador, se usa `s-maxage` para el CDN y `max-age` para el navegador.",
    respuestaEn:
      "Static assets with a hash in the name (`app.3f9a1c.js`): `public, max-age=31536000, immutable`. Since the name changes with each version, the file never changes for the same URL, so it can be cached a year without revalidating; `immutable` prevents revalidation on reload. That's the cache-busting technique. The HTML: `no-cache` (or a very short max-age): it must always be revalidated, because it's what points to the assets' new names; if the HTML were cached for a year, nobody would see the new deploy. An API with user data: `private` (only that user's browser may store it, never a shared CDN) with a short max-age or `no-cache`; and `no-store` if the data is sensitive. If a CDN can cache something longer than the browser, use `s-maxage` for the CDN and `max-age` for the browser.",
    codigo: `/assets/app.3f9a1c.js   Cache-Control: public, max-age=31536000, immutable
/index.html             Cache-Control: no-cache
/api/mi-perfil          Cache-Control: private, no-cache
/api/extracto-bancario  Cache-Control: no-store
/api/productos          Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600`,
  },
  {
    nivel: 2,
    pregunta: "¿Para qué sirve el header `Vary` y qué pasa si lo usás mal?",
    respuestaEs:
      "`Vary` le dice a los caches qué headers del REQUEST forman parte de la clave del cache, además de la URL. Si el servidor devuelve contenido distinto según `Accept-Encoding` (gzip o brotli) o `Accept-Language`, tiene que declarar `Vary: Accept-Encoding, Accept-Language`; si no, un CDN puede guardar la versión en brotli o en inglés y servírsela a un cliente que pidió otra cosa. El error inverso es igual de grave: `Vary: Cookie` o `Vary: User-Agent` multiplican las variantes hasta que casi ningún request comparte entrada, y el cache deja de servir; `Vary: *` directamente lo vuelve incacheable. La regla es variar solo por los headers que realmente cambian la respuesta, y normalizarlos cuando se puede (por ejemplo, reducir el idioma a un conjunto chico de valores en el CDN).",
    respuestaEn:
      "`Vary` tells caches which REQUEST headers are part of the cache key, besides the URL. If the server returns different content depending on `Accept-Encoding` (gzip or brotli) or `Accept-Language`, it must declare `Vary: Accept-Encoding, Accept-Language`; otherwise a CDN may store the brotli or English version and serve it to a client that asked for something else. The opposite mistake is just as bad: `Vary: Cookie` or `Vary: User-Agent` multiply variants until almost no request shares an entry and the cache stops helping; `Vary: *` makes it uncacheable outright. The rule is to vary only on headers that actually change the response, and normalize them when possible (e.g. reducing locale to a small set of values at the CDN).",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el cache poisoning y cómo se previene?",
    respuestaEs:
      "Es un ataque en el que se consigue que un cache compartido (un CDN o un proxy) guarde una respuesta manipulada y se la sirva a todos los usuarios. El caso típico explota headers que la aplicación USA para construir la respuesta pero que NO son parte de la clave del cache ('unkeyed headers'): por ejemplo, el servidor usa `X-Forwarded-Host` para armar las URLs de los scripts; el atacante manda un request con `X-Forwarded-Host: atacante.com`, el CDN cachea esa respuesta bajo la URL normal, y todos los visitantes reciben una página que carga scripts del atacante. Se previene no confiando en headers que el cliente puede controlar para generar contenido, incluyendo en la clave (o en `Vary`) cualquier header que cambie la respuesta, configurando el CDN para descartar o normalizar headers que no se esperan, y no cacheando respuestas de error o con contenido reflejado del request.",
    respuestaEn:
      "It's an attack that gets a shared cache (a CDN or proxy) to store a manipulated response and serve it to every user. The typical case exploits headers the application USES to build the response but that are NOT part of the cache key ('unkeyed headers'): e.g. the server uses `X-Forwarded-Host` to build script URLs; the attacker sends a request with `X-Forwarded-Host: attacker.com`, the CDN caches that response under the normal URL, and every visitor gets a page loading the attacker's scripts. It's prevented by not trusting client-controllable headers to generate content, including in the key (or in `Vary`) any header that changes the response, configuring the CDN to drop or normalize unexpected headers, and not caching error responses or responses that reflect request content.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es un cache stampede y cómo lo mitigás?",
    respuestaEs:
      "Pasa cuando una entrada muy pedida vence y, en el mismo instante, cientos o miles de requests encuentran el cache vacío y van todos al origen a regenerarla: el backend recibe de golpe una carga que el cache venía absorbiendo, y puede caerse, con lo cual la entrada nunca se regenera. Mitigaciones: `stale-while-revalidate`, para que durante la regeneración se siga sirviendo la copia vieja y solo un request vaya al origen; request coalescing en el CDN o en la aplicación (un solo request al origen por clave, los demás esperan su resultado); un lock al regenerar; agregar jitter a los TTL para que no venzan muchas entradas a la vez; y `stale-if-error` para servir la copia vieja si el origen falla. Es el mismo problema de fondo que el thundering herd de los reintentos.",
    respuestaEn:
      "It happens when a heavily requested entry expires and, at the same instant, hundreds or thousands of requests find the cache empty and all go to the origin to regenerate it: the backend suddenly receives load the cache had been absorbing, and may go down, so the entry never regenerates. Mitigations: `stale-while-revalidate`, so the old copy keeps being served during regeneration and only one request goes to the origin; request coalescing at the CDN or app (one origin request per key, the rest wait for its result); a lock while regenerating; adding jitter to TTLs so many entries don't expire at once; and `stale-if-error` to serve the old copy if the origin fails. It's the same underlying problem as the retry thundering herd.",
    tradeoffs:
      "stale-while-revalidate cambia frescura por estabilidad: algunos usuarios ven datos viejos por un rato a cambio de que el origen nunca reciba el pico completo.",
  },
];
