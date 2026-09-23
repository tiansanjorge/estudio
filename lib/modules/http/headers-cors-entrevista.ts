import type { PreguntaEntrevista } from "../types";

export const entrevistaHeadersCors: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es CORS y qué problema resuelve?",
    respuestaEs:
      "Por defecto, el navegador aplica la same-origin policy: el JavaScript de una página solo puede leer respuestas de su mismo origen (mismo esquema, dominio y puerto). Es lo que impide que un sitio malicioso use tu sesión para leer datos de tu banco con un fetch. CORS (Cross-Origin Resource Sharing) es el mecanismo para que un SERVIDOR relaje esa regla de forma controlada: con headers como `Access-Control-Allow-Origin` declara qué orígenes pueden leer sus respuestas. Lo importante es que la decisión la toma el navegador, basándose en lo que dice el servidor: por eso un error de CORS se arregla configurando el servidor, no el frontend, y por eso herramientas como curl o Postman no tienen 'problemas de CORS'.",
    respuestaEn:
      "By default, the browser enforces the same-origin policy: a page's JavaScript can only read responses from its own origin (same scheme, domain and port). It's what stops a malicious site from using your session to read your bank data with a fetch. CORS (Cross-Origin Resource Sharing) is the mechanism for a SERVER to relax that rule in a controlled way: with headers like `Access-Control-Allow-Origin` it declares which origins may read its responses. The key point is that the browser makes the decision, based on what the server says: that's why a CORS error is fixed by configuring the server, not the frontend, and why tools like curl or Postman don't have 'CORS problems'.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es un preflight y cuándo lo manda el navegador?",
    respuestaEs:
      "Es un request `OPTIONS` que el navegador manda automáticamente ANTES del request real cuando este no es 'simple', para preguntarle al servidor si lo acepta. Un request es simple si usa GET, HEAD o POST, solo headers básicos, y un `Content-Type` de formulario (`application/x-www-form-urlencoded`, `multipart/form-data` o `text/plain`). Casi cualquier llamada a una API moderna dispara preflight: un `Content-Type: application/json`, un header `Authorization` o métodos como PUT, PATCH o DELETE. El preflight lleva `Access-Control-Request-Method` y `Access-Control-Request-Headers`, y el servidor tiene que responder con los `Access-Control-Allow-*` correspondientes; si no, el request real ni se manda. El costo es un round trip extra, que se mitiga cacheando la respuesta del preflight con `Access-Control-Max-Age`.",
    respuestaEn:
      "It's an `OPTIONS` request the browser sends automatically BEFORE the real request when it isn't 'simple', to ask the server whether it accepts it. A request is simple if it uses GET, HEAD or POST, only basic headers, and a form `Content-Type` (`application/x-www-form-urlencoded`, `multipart/form-data` or `text/plain`). Almost any modern API call triggers a preflight: a `Content-Type: application/json`, an `Authorization` header, or methods like PUT, PATCH or DELETE. The preflight carries `Access-Control-Request-Method` and `Access-Control-Request-Headers`, and the server must respond with the matching `Access-Control-Allow-*`; otherwise the real request isn't even sent. The cost is an extra round trip, mitigated by caching the preflight response with `Access-Control-Max-Age`.",
  },
  {
    nivel: 2,
    pregunta: "Tu frontend usa cookies de sesión contra una API en otro dominio. ¿Qué hace falta para que funcione?",
    respuestaEs:
      "Del lado del cliente, pedir que se incluyan las credenciales: `fetch(url, { credentials: 'include' })`. Del lado del servidor, responder `Access-Control-Allow-Credentials: true` y un `Access-Control-Allow-Origin` con el origen EXACTO del frontend: con credenciales, el comodín `*` no está permitido. Como el valor depende del origen del request, el servidor normalmente compara `Origin` contra una lista blanca y lo refleja, y debe agregar `Vary: Origin` para que un CDN o un proxy no cacheen la respuesta de un origen y se la sirvan a otro. Además, la cookie tiene que poder viajar cross-site: `SameSite=None; Secure`. Y si front y API comparten dominio registrable (app.ejemplo.com y api.ejemplo.com), son 'same-site' aunque sean 'cross-origin', y una cookie `SameSite=Lax` alcanza.",
    respuestaEn:
      "On the client, ask for credentials to be included: `fetch(url, { credentials: 'include' })`. On the server, respond with `Access-Control-Allow-Credentials: true` and an `Access-Control-Allow-Origin` with the frontend's EXACT origin: with credentials, the `*` wildcard isn't allowed. Since the value depends on the request origin, the server usually checks `Origin` against an allowlist and echoes it, and must add `Vary: Origin` so a CDN or proxy doesn't cache one origin's response and serve it to another. Also, the cookie must be able to travel cross-site: `SameSite=None; Secure`. And if front and API share a registrable domain (app.example.com and api.example.com), they're 'same-site' even though 'cross-origin', and a `SameSite=Lax` cookie is enough.",
    codigo: `// servidor
const PERMITIDOS = new Set(["https://app.ejemplo.com"]);
const origen = request.headers.get("Origin");
if (origen && PERMITIDOS.has(origen)) {
  headers.set("Access-Control-Allow-Origin", origen);
  headers.set("Access-Control-Allow-Credentials", "true");
}
headers.append("Vary", "Origin");`,
  },
  {
    nivel: 2,
    pregunta: "¿CORS protege a tu API de requests maliciosos?",
    respuestaEs:
      "No, y es una confusión peligrosa. CORS protege al USUARIO: impide que el JavaScript de otro sitio LEA respuestas usando las credenciales del usuario. No impide que el request llegue al servidor. Un request simple cross-origin (un POST de formulario) se manda sin preflight y el servidor lo procesa aunque después el navegador bloquee la lectura; si ese request tiene efectos, es un ataque CSRF y CORS no lo frena. Además, cualquiera puede llamar a tu API desde curl, un script o un servidor, donde CORS no existe. La protección de la API sigue siendo autenticación, autorización, validación, rate limiting, y contra CSRF, cookies `SameSite`, tokens anti-CSRF o verificar el header `Origin` en los requests con efectos.",
    respuestaEn:
      "No, and it's a dangerous confusion. CORS protects the USER: it stops another site's JavaScript from READING responses using the user's credentials. It doesn't stop the request from reaching the server. A simple cross-origin request (a form POST) is sent without preflight and the server processes it even though the browser then blocks reading; if that request has side effects, it's a CSRF attack and CORS doesn't stop it. Also, anyone can call your API from curl, a script or a server, where CORS doesn't exist. API protection is still authentication, authorization, validation, rate limiting, and against CSRF, `SameSite` cookies, anti-CSRF tokens or checking the `Origin` header on state-changing requests.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué vulnerabilidad aparece al reflejar cualquier `Origin` con `Allow-Credentials: true`?",
    respuestaEs:
      "Es una de las configuraciones de CORS más peligrosas y más comunes. Para 'arreglar' errores de CORS, algunos servidores copian el header `Origin` del request directo en `Access-Control-Allow-Origin` y agregan `Allow-Credentials: true`. El efecto es equivalente a desactivar la same-origin policy para esa API: cualquier sitio que visite un usuario logueado puede hacer un fetch con sus cookies y LEER la respuesta, robando datos de su cuenta. Variantes del mismo error: validar el origen con `includes` o un regex mal anclado (`ejemplo.com.atacante.com` pasa), o aceptar el origen `null`, que un atacante puede producir con un iframe sandboxeado. La solución es una lista blanca exacta de orígenes, comparada por igualdad, y nunca combinar credenciales con orígenes arbitrarios.",
    respuestaEn:
      "It's one of the most dangerous and most common CORS misconfigurations. To 'fix' CORS errors, some servers copy the request's `Origin` header straight into `Access-Control-Allow-Origin` and add `Allow-Credentials: true`. The effect is equivalent to disabling the same-origin policy for that API: any site a logged-in user visits can fetch with their cookies and READ the response, stealing account data. Variants of the same mistake: validating the origin with `includes` or a poorly anchored regex (`example.com.attacker.com` passes), or accepting the `null` origin, which an attacker can produce with a sandboxed iframe. The fix is an exact allowlist of origins, compared by equality, and never combining credentials with arbitrary origins.",
    codigo: `// ❌ equivale a no tener same-origin policy
res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
res.setHeader("Access-Control-Allow-Credentials", "true");

// ❌ "https://ejemplo.com.atacante.com" también pasa
if (origin.includes("ejemplo.com")) { /* ... */ }`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué headers de seguridad configurarías en una aplicación web y qué protege cada uno?",
    respuestaEs:
      "Los principales: `Strict-Transport-Security` (HSTS) obliga al navegador a usar HTTPS con ese dominio durante un tiempo, evitando ataques de downgrade; con `preload` se aplica incluso en la primera visita. `Content-Security-Policy` define de dónde se pueden cargar scripts, estilos, imágenes y conexiones; es la defensa en profundidad más fuerte contra XSS, idealmente con nonces o hashes en vez de `unsafe-inline`, y su directiva `frame-ancestors` evita que tu sitio se embeba en iframes ajenos (clickjacking), reemplazando a `X-Frame-Options`. `X-Content-Type-Options: nosniff` impide que el navegador adivine el tipo de un archivo y ejecute como script algo servido como texto. `Referrer-Policy` controla cuánta URL se filtra a otros sitios. Y `Permissions-Policy` desactiva APIs que no usás (cámara, geolocalización). Una CSP estricta cuesta configurarla; conviene empezar en modo `Content-Security-Policy-Report-Only` para ver qué rompería antes de aplicarla.",
    respuestaEn:
      "The main ones: `Strict-Transport-Security` (HSTS) forces the browser to use HTTPS with that domain for a period, preventing downgrade attacks; with `preload` it applies even on the first visit. `Content-Security-Policy` defines where scripts, styles, images and connections may load from; it's the strongest defense-in-depth against XSS, ideally with nonces or hashes instead of `unsafe-inline`, and its `frame-ancestors` directive prevents your site from being embedded in foreign iframes (clickjacking), replacing `X-Frame-Options`. `X-Content-Type-Options: nosniff` stops the browser from guessing a file's type and executing as script something served as text. `Referrer-Policy` controls how much of the URL leaks to other sites. And `Permissions-Policy` disables APIs you don't use (camera, geolocation). A strict CSP takes effort; start in `Content-Security-Policy-Report-Only` mode to see what would break before enforcing it.",
  },
];
