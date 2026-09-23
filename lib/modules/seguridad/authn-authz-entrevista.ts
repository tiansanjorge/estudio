import type { PreguntaEntrevista } from "../types";

export const entrevistaAuthnAuthz: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre autenticación y autorización?",
    respuestaEs:
      "Autenticación (AuthN) responde '¿quién sos?': verificar la identidad de quien hace el request, con una contraseña, un token, una passkey, un segundo factor o un proveedor externo (OAuth / OpenID Connect). Autorización (AuthZ) responde '¿podés hacer esto?': dado que sé quién sos, decidir si tenés permiso para esa acción sobre ese recurso. Siempre va primero la autenticación: no se puede decidir qué puede hacer alguien sin saber quién es. En HTTP se reflejan en status distintos: 401 cuando falla la autenticación (no hay sesión o el token es inválido o venció) y 403 cuando falla la autorización (se sabe quién es, pero no tiene permiso), o 404 si no se quiere revelar que el recurso existe. Confundirlas es fuente de bugs graves: un endpoint que verifica que haya sesión pero no que el recurso sea del usuario permite leer datos ajenos cambiando un id.",
    respuestaEn:
      "Authentication (AuthN) answers 'who are you?': verifying the identity of whoever makes the request, with a password, token, passkey, second factor or external provider (OAuth / OpenID Connect). Authorization (AuthZ) answers 'may you do this?': given I know who you are, deciding whether you're allowed that action on that resource. Authentication always comes first: you can't decide what someone may do without knowing who they are. In HTTP they map to different statuses: 401 when authentication fails (no session, or the token is invalid or expired) and 403 when authorization fails (identity is known but lacks permission), or 404 if you don't want to reveal the resource exists. Confusing them causes serious bugs: an endpoint that checks there's a session but not that the resource belongs to the user lets anyone read others' data by changing an id.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es IDOR (Insecure Direct Object Reference) y cómo se previene?",
    respuestaEs:
      "Es una falla de autorización donde el servidor usa un identificador que manda el cliente (`/pedidos/41`, `?userId=7`) para acceder a un recurso, sin verificar que ese usuario tenga derecho a ese recurso concreto. El atacante está correctamente autenticado con su propia cuenta y simplemente cambia el id para leer o modificar datos de otros. Es una de las vulnerabilidades más comunes (Broken Access Control encabeza el OWASP Top 10). Se previene verificando la pertenencia en CADA acceso, idealmente en la consulta misma (`where: { id, usuarioId: sesion.usuarioId }`) para que sea imposible olvidarla; nunca tomando el id del usuario desde el body o la URL cuando corresponde al usuario logueado (se toma de la sesión); centralizando la autorización en una capa de acceso a datos; y con tests que verifiquen que un usuario no accede a recursos de otro. Los ids no secuenciales (UUID) dificultan la enumeración, pero no reemplazan la verificación.",
    respuestaEn:
      "It's an authorization flaw where the server uses a client-supplied identifier (`/orders/41`, `?userId=7`) to access a resource without checking the user has rights to that specific resource. The attacker is properly authenticated with their own account and simply changes the id to read or modify others' data. It's among the most common vulnerabilities (Broken Access Control tops the OWASP Top 10). It's prevented by verifying ownership on EVERY access, ideally in the query itself (`where: { id, userId: session.userId }`) so it can't be forgotten; never taking the user id from the body or URL when it refers to the logged-in user (take it from the session); centralizing authorization in a data access layer; and with tests verifying a user can't access another's resources. Non-sequential ids (UUIDs) make enumeration harder, but don't replace verification.",
    codigo: `// ❌ cualquier usuario logueado lee cualquier pedido
const pedido = await db.pedido.findUnique({ where: { id: params.id } });

// ✅ la pertenencia es parte de la consulta
const pedido = await db.pedido.findFirst({
  where: { id: params.id, usuarioId: sesion.usuarioId },
});
if (!pedido) return notFound();`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué son OAuth 2.0 y OpenID Connect, y cuál usás para 'Iniciar sesión con Google'?",
    respuestaEs:
      "OAuth 2.0 es un protocolo de AUTORIZACIÓN delegada: permite que una aplicación obtenga un access token para acceder a recursos de un usuario en otro servicio (sus archivos de Drive, su calendario) sin conocer su contraseña, con permisos acotados (scopes). No dice nada, por sí mismo, sobre quién es el usuario. OpenID Connect (OIDC) es una capa de AUTENTICACIÓN construida sobre OAuth: agrega un ID token (un JWT firmado con datos de identidad: sub, email, nombre) y un endpoint de userinfo, estandarizando el 'iniciar sesión con'. Para login con Google se usa OIDC. En aplicaciones web el flujo recomendado es Authorization Code con PKCE: el navegador vuelve de Google con un código de un solo uso, y el servidor lo canjea por los tokens; PKCE evita que un código interceptado sirva a otro. El flujo implícito, que devolvía tokens directamente en la URL, está desaconsejado.",
    respuestaEn:
      "OAuth 2.0 is a delegated AUTHORIZATION protocol: it lets an app obtain an access token to reach a user's resources on another service (their Drive files, calendar) without knowing their password, with scoped permissions. By itself it says nothing about who the user is. OpenID Connect (OIDC) is an AUTHENTICATION layer built on OAuth: it adds an ID token (a signed JWT with identity data: sub, email, name) and a userinfo endpoint, standardizing 'sign in with'. For Google login you use OIDC. In web apps the recommended flow is Authorization Code with PKCE: the browser returns from Google with a single-use code, and the server exchanges it for tokens; PKCE prevents an intercepted code from being usable by someone else. The implicit flow, which returned tokens directly in the URL, is discouraged.",
  },
  {
    nivel: 2,
    pregunta: "¿Dónde tiene que vivir la verificación de autorización en una aplicación web?",
    respuestaEs:
      "En el servidor, lo más cerca posible de los datos, y en cada punto de acceso. Ocultar un botón en la UI es experiencia de usuario, no seguridad: cualquiera puede llamar al endpoint directamente. Un middleware o el Proxy de Next pueden hacer un chequeo grueso (redirigir si no hay sesión), pero no alcanzan: dependen de un matcher y no conocen el recurso concreto. La autorización fina (¿este usuario puede editar ESTE documento?) va en la capa que accede a los datos: una capa de acceso a datos (DAL) o servicios que reciben al usuario y verifican antes de leer o escribir, idealmente filtrando en la propia consulta. En Next.js eso implica verificar en cada Server Action y Route Handler, porque son endpoints públicos, y en los Server Components que leen datos sensibles. Centralizarla en funciones reutilizables (`puedeEditar(usuario, documento)`) evita que cada endpoint reimplemente las reglas a su manera.",
    respuestaEn:
      "On the server, as close to the data as possible, and at every access point. Hiding a button in the UI is user experience, not security: anyone can call the endpoint directly. A middleware or Next's Proxy can do a coarse check (redirect if there's no session), but it's not enough: it depends on a matcher and doesn't know the specific resource. Fine-grained authorization (may this user edit THIS document?) belongs in the data-access layer: a data access layer (DAL) or services that receive the user and check before reading or writing, ideally filtering in the query itself. In Next.js that means checking in every Server Action and Route Handler, since they're public endpoints, and in Server Components reading sensitive data. Centralizing it in reusable functions (`canEdit(user, document)`) avoids each endpoint reimplementing rules its own way.",
    tradeoffs:
      "Verificar en cada acceso agrega consultas y código, pero la alternativa (confiar en la UI o en un filtro global) deja huecos que solo aparecen cuando alguien los explota.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo implementás MFA y qué tipos de segundo factor existen?",
    respuestaEs:
      "La autenticación multifactor combina al menos dos categorías: algo que sabés (contraseña), algo que tenés (el teléfono, una llave física) y algo que sos (biometría). Los segundos factores, de más débil a más fuerte: SMS (vulnerable a SIM swapping e interceptación, mejor que nada pero desaconsejado para cuentas sensibles), códigos TOTP de una app autenticadora (Google Authenticator, basados en un secreto compartido y la hora; resistentes a SIM swap pero phisheables: el usuario puede tipear el código en un sitio falso), notificaciones push (con riesgo de 'fatiga MFA', donde el atacante manda notificaciones hasta que el usuario acepta; se mitiga con number matching), y WebAuthn/FIDO2 (llaves físicas o passkeys), que son resistentes al phishing porque la firma criptográfica está atada al dominio real del sitio. Además: códigos de recuperación de un solo uso, pedir de nuevo el factor para acciones sensibles (step-up auth), y rate limiting en la verificación.",
    respuestaEn:
      "Multi-factor authentication combines at least two categories: something you know (password), something you have (phone, a hardware key) and something you are (biometrics). Second factors, from weaker to stronger: SMS (vulnerable to SIM swapping and interception, better than nothing but discouraged for sensitive accounts), TOTP codes from an authenticator app (Google Authenticator, based on a shared secret and the time; resistant to SIM swap but phishable: the user may type the code into a fake site), push notifications (with 'MFA fatigue' risk, where the attacker sends prompts until the user accepts; mitigated with number matching), and WebAuthn/FIDO2 (hardware keys or passkeys), which are phishing-resistant because the cryptographic signature is bound to the real site's domain. Also: single-use recovery codes, re-prompting the factor for sensitive actions (step-up auth), and rate limiting on verification.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué son las passkeys y por qué se dice que reemplazan a las contraseñas?",
    respuestaEs:
      "Son credenciales basadas en WebAuthn: en vez de un secreto compartido (la contraseña, que el servidor guarda hasheada y el usuario puede reutilizar o entregar a un sitio falso), se genera un PAR de claves por sitio. La clave privada queda en el dispositivo del usuario (o sincronizada en su gestor: iCloud Keychain, Google Password Manager) protegida por biometría o PIN, y el servidor solo guarda la clave pública. Al iniciar sesión, el servidor manda un desafío, el dispositivo lo firma con la clave privada y el servidor verifica la firma. Ventajas: no hay secreto que robar de la base (una clave pública filtrada no sirve), son resistentes al phishing porque el navegador solo firma para el dominio real, no se pueden reutilizar entre sitios, y la experiencia es más rápida que tipear una contraseña más un código. Los desafíos son la recuperación de cuenta si se pierden todos los dispositivos y la convivencia con usuarios que todavía usan contraseña.",
    respuestaEn:
      "They're WebAuthn-based credentials: instead of a shared secret (the password, which the server stores hashed and the user may reuse or give to a fake site), a key PAIR is generated per site. The private key stays on the user's device (or synced in their manager: iCloud Keychain, Google Password Manager) protected by biometrics or a PIN, and the server stores only the public key. At sign-in, the server sends a challenge, the device signs it with the private key and the server verifies the signature. Advantages: there's no secret to steal from the database (a leaked public key is useless), they're phishing-resistant since the browser only signs for the real domain, they can't be reused across sites, and the experience is faster than typing a password plus a code. Challenges are account recovery if all devices are lost and coexisting with users still on passwords.",
  },
];
