import type { PreguntaEntrevista } from "../types";

export const entrevistaJwtSesiones: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre sesiones con estado y JWT?",
    respuestaEs:
      "Con sesiones con estado (stateful), al loguearse el servidor crea una sesión en un store (base de datos, Redis) y le manda al navegador solo un id opaco en una cookie; en cada request busca ese id para saber quién es el usuario. Revocar es trivial (se borra la sesión), pero cada request consulta el store. Con JWT (stateless), el servidor firma un token que CONTIENE los datos (quién es, rol, vencimiento); en cada request solo verifica la firma, sin consultar nada, lo que escala bien entre servicios. El costo es la revocación: un JWT firmado es válido hasta que vence, así que cerrar sesión o banear a un usuario no lo invalida por sí solo. Para una aplicación web tradicional, las sesiones son simples y seguras; los JWT tienen más sentido entre servicios o con varios backends que necesitan verificar identidad sin compartir un store.",
    respuestaEn:
      "With stateful sessions, on login the server creates a session in a store (database, Redis) and sends the browser only an opaque id in a cookie; on each request it looks up that id to know who the user is. Revoking is trivial (delete the session), but every request hits the store. With JWT (stateless), the server signs a token that CONTAINS the data (who they are, role, expiry); on each request it just verifies the signature, with no lookup, which scales well across services. The cost is revocation: a signed JWT is valid until it expires, so logging out or banning a user doesn't invalidate it by itself. For a traditional web app, sessions are simple and secure; JWTs make more sense between services or with multiple backends needing to verify identity without sharing a store.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué tiene un JWT adentro y por qué no hay que guardar datos sensibles en el payload?",
    respuestaEs:
      "Tiene tres partes en base64url separadas por puntos: el header (el algoritmo de firma, por ejemplo HS256 o RS256), el payload (los claims: `sub` con el id del usuario, `exp` con el vencimiento, `iat` con la fecha de emisión, más datos propios como el rol) y la firma, calculada sobre header y payload con un secreto o una clave privada. La firma garantiza INTEGRIDAD: si alguien modifica el payload (por ejemplo cambia su rol a admin), la firma deja de coincidir y el servidor lo rechaza. Pero NO da confidencialidad: base64url es una codificación, no un cifrado, y cualquiera que tenga el token puede leer el payload (basta pegarlo en jwt.io). Por eso nunca van contraseñas, datos personales sensibles ni información interna. Si hace falta ocultar el contenido existe JWE (tokens cifrados), aunque casi nunca es necesario si el payload se mantiene mínimo.",
    respuestaEn:
      "It has three base64url parts separated by dots: the header (the signing algorithm, e.g. HS256 or RS256), the payload (the claims: `sub` with the user id, `exp` with expiry, `iat` with issue time, plus custom data like the role) and the signature, computed over header and payload with a secret or private key. The signature guarantees INTEGRITY: if someone modifies the payload (e.g. changes their role to admin), the signature no longer matches and the server rejects it. But it does NOT provide confidentiality: base64url is an encoding, not encryption, and anyone holding the token can read the payload (just paste it into jwt.io). So passwords, sensitive personal data or internal information never go there. If content must be hidden there's JWE (encrypted tokens), though it's rarely needed if the payload is kept minimal.",
  },
  {
    nivel: 2,
    pregunta: "¿Dónde guardás el token o la sesión en el navegador: localStorage o cookie?",
    respuestaEs:
      "En una cookie `HttpOnly`, `Secure` y `SameSite=Lax` (o `Strict`). `HttpOnly` hace que el JavaScript de la página no pueda leerla, así que un XSS no puede robar el token y usarlo desde otra máquina. `Secure` la manda solo por HTTPS. `SameSite` evita que se envíe en la mayoría de los requests cross-site, lo que mitiga CSRF. En `localStorage`, en cambio, cualquier script que corra en la página (un XSS, una dependencia comprometida, un script de terceros) puede leer el token y exfiltrarlo; y como el JWT no se puede revocar, el atacante lo usa hasta que vence. El trade-off: con cookies hay que pensar en CSRF (SameSite ayuda mucho; para operaciones sensibles, un token anti-CSRF o verificar `Origin`), y el backend tiene que leer el token de la cookie en vez del header `Authorization`. Aun con cookies HttpOnly, un XSS puede hacer requests en nombre del usuario mientras está en la página, así que prevenir XSS sigue siendo esencial.",
    respuestaEn:
      "In an `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) cookie. `HttpOnly` means page JavaScript can't read it, so an XSS can't steal the token and use it from another machine. `Secure` sends it only over HTTPS. `SameSite` prevents it being sent on most cross-site requests, mitigating CSRF. In `localStorage`, by contrast, any script running on the page (an XSS, a compromised dependency, a third-party script) can read the token and exfiltrate it; and since the JWT can't be revoked, the attacker uses it until it expires. The trade-off: with cookies you must think about CSRF (SameSite helps a lot; for sensitive operations, an anti-CSRF token or checking `Origin`), and the backend must read the token from the cookie rather than the `Authorization` header. Even with HttpOnly cookies, an XSS can make requests on the user's behalf while on the page, so preventing XSS remains essential.",
    codigo: `// al loguear, el servidor setea la cookie
cookies().set("sesion", token, {
  httpOnly: true,   // JS no la puede leer
  secure: true,     // solo HTTPS
  sameSite: "lax",  // no viaja en la mayoría de requests cross-site
  maxAge: 60 * 15,
  path: "/",
});`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo resolvés la revocación de JWT? ¿Qué son los refresh tokens?",
    respuestaEs:
      "La estrategia estándar es combinar dos tokens. Un ACCESS TOKEN de vida corta (5 a 15 minutos), un JWT que se verifica sin consultar nada; si lo roban, sirve poco tiempo. Y un REFRESH TOKEN de vida larga (días o semanas), que solo sirve para pedir un access token nuevo a un endpoint específico, y que el servidor SÍ guarda (o registra) para poder revocarlo. Al cerrar sesión o banear, se revoca el refresh token y, a más tardar cuando vence el access token actual, el usuario queda afuera. Una mejora importante es la ROTACIÓN: cada vez que se usa un refresh token se emite uno nuevo y el anterior se invalida; si alguien intenta usar uno ya usado, es señal de robo y se revoca toda la familia de tokens. Para revocación inmediata del access token hay que agregar una denylist (por `jti`) que se consulta en cada request, lo que reintroduce estado: en ese punto conviene preguntarse si no alcanzaban las sesiones.",
    respuestaEn:
      "The standard strategy combines two tokens. A short-lived ACCESS TOKEN (5 to 15 minutes), a JWT verified with no lookup; if stolen, it's useful briefly. And a long-lived REFRESH TOKEN (days or weeks), usable only to request a new access token from a specific endpoint, which the server DOES store (or record) so it can be revoked. On logout or ban, the refresh token is revoked and, at the latest when the current access token expires, the user is out. An important improvement is ROTATION: each time a refresh token is used, a new one is issued and the previous one invalidated; if someone tries to use an already-used one, it signals theft and the whole token family is revoked. For immediate access token revocation you add a denylist (by `jti`) checked on each request, which reintroduces state: at that point, ask whether sessions would have been enough.",
    tradeoffs:
      "Un access token más corto reduce el daño de un robo pero aumenta los refrescos; uno más largo es más cómodo pero una revocación tarda más en hacer efecto.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué vulnerabilidades clásicas tiene la verificación de JWT?",
    respuestaEs:
      "Varias, casi todas por verificar mal. El algoritmo `none`: un token con `alg: none` y sin firma, que librerías mal configuradas aceptaban como válido. La confusión de algoritmos: un servidor que usa RS256 (clave pública para verificar) y acepta el algoritmo que dice el header; el atacante cambia a HS256 y firma con la clave PÚBLICA como si fuera un secreto HMAC, y el servidor lo verifica con esa misma clave pública. La solución a ambas es fijar en el servidor la lista de algoritmos aceptados, nunca confiar en el header. Secretos HMAC débiles, que se pueden romper por fuerza bruta offline con un solo token. No validar `exp`, `nbf`, `iss` (quién lo emitió) o `aud` (para quién es), lo que permite reutilizar un token emitido para otro servicio. Usar `decode` en vez de `verify` (decodificar no verifica nada). Y claims como el rol usados sin revalidar para decisiones críticas, cuando el rol pudo haber cambiado después de emitido el token.",
    respuestaEn:
      "Several, almost all from verifying poorly. The `none` algorithm: a token with `alg: none` and no signature, which misconfigured libraries accepted as valid. Algorithm confusion: a server using RS256 (public key to verify) that accepts whatever algorithm the header states; the attacker switches to HS256 and signs with the PUBLIC key as if it were an HMAC secret, and the server verifies it with that same public key. The fix for both is pinning the accepted algorithms on the server, never trusting the header. Weak HMAC secrets, brute-forceable offline from a single token. Not validating `exp`, `nbf`, `iss` (who issued it) or `aud` (who it's for), allowing reuse of a token issued for another service. Using `decode` instead of `verify` (decoding verifies nothing). And claims like role used without revalidation for critical decisions, when the role may have changed after the token was issued.",
    codigo: `// ✅ algoritmos, emisor y audiencia fijados en el servidor
const { payload } = await jwtVerify(token, clavePublica, {
  algorithms: ["RS256"],
  issuer: "https://auth.miapp.com",
  audience: "api-pedidos",
});`,
  },
  {
    nivel: 3,
    pregunta: "¿HS256 o RS256? ¿Cuándo conviene la criptografía asimétrica?",
    respuestaEs:
      "HS256 usa un único secreto compartido para firmar y verificar (HMAC). Es simple y rápido, pero todo servicio que necesite verificar tokens tiene que tener el secreto, y cualquiera que lo tenga también puede EMITIR tokens válidos: si un servicio secundario se ve comprometido, el atacante puede fabricar tokens de administrador. RS256 (o ES256, con curvas elípticas, más chico y rápido) usa un par de claves: el servidor de autenticación firma con la clave privada, que nunca sale de ahí, y los demás verifican con la clave pública, que se puede distribuir libremente, normalmente publicada en un endpoint JWKS (`/.well-known/jwks.json`) que además permite rotar claves identificándolas con `kid`. Regla práctica: si el que emite y el que verifica son el mismo servicio, HS256 alcanza; si hay varios servicios o terceros que verifican, asimétrico, para que verificar no implique poder emitir.",
    respuestaEn:
      "HS256 uses a single shared secret to sign and verify (HMAC). It's simple and fast, but every service needing to verify tokens must hold the secret, and anyone holding it can also ISSUE valid tokens: if a secondary service is compromised, the attacker can forge admin tokens. RS256 (or ES256, with elliptic curves, smaller and faster) uses a key pair: the auth server signs with the private key, which never leaves it, and others verify with the public key, which can be freely distributed, usually published at a JWKS endpoint (`/.well-known/jwks.json`) that also enables key rotation by identifying keys with `kid`. Rule of thumb: if issuer and verifier are the same service, HS256 is enough; if several services or third parties verify, go asymmetric, so verifying doesn't imply being able to issue.",
  },
];
