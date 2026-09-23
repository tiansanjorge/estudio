import type { PreguntaEntrevista } from "../types";

export const entrevistaMiddlewareEdge: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es el Proxy (antes Middleware) de Next.js y para qué se usa?",
    respuestaEs:
      "Es una función en `proxy.ts`, en la raíz del proyecto, que se ejecuta antes de que un request llegue a la ruta. Con el request en la mano puede redirigir, reescribir a otra ruta, modificar headers del request o de la respuesta, o responder directamente. Los usos típicos son redirects que dependen del request (idioma, país, sesión), A/B tests con rewrites, agregar headers a un grupo de rutas y chequeos optimistas de autenticación (si no hay cookie de sesión, mandar a /login). Con `config.matcher` se limita a qué rutas aplica. En Next 16 se renombró de Middleware a Proxy porque 'middleware' hacía pensar en los middlewares de Express, que encadenan lógica de negocio, cuando en realidad es una capa de red delante de la app que conviene usar como último recurso. Para redirects simples y fijos alcanza con `redirects` en `next.config`.",
    respuestaEn:
      "It's a function in `proxy.ts`, at the project root, that runs before a request reaches the route. With the request in hand it can redirect, rewrite to another route, modify request or response headers, or respond directly. Typical uses are request-dependent redirects (locale, country, session), A/B tests with rewrites, adding headers to a group of routes, and optimistic auth checks (no session cookie, send to /login). `config.matcher` limits which routes it applies to. In Next 16 it was renamed from Middleware to Proxy because 'middleware' evoked Express middlewares that chain business logic, when it's really a network layer in front of the app best used as a last resort. For simple, fixed redirects, `redirects` in `next.config` is enough.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre un redirect y un rewrite?",
    respuestaEs:
      "Un redirect le responde al navegador con un status 3xx (307 por defecto en `NextResponse.redirect`) y una nueva URL: el navegador hace un segundo request y la barra de direcciones cambia. Sirve cuando el usuario tiene que estar en otra URL: login, una ruta que se movió, el idioma correcto. Un rewrite se resuelve dentro del servidor: Next renderiza otra ruta, pero el navegador sigue viendo la URL original, sin segundo request. Sirve cuando la URL pública tiene que mantenerse pero el contenido sale de otro lado: un A/B test donde `/` muestra `/home-b` a la mitad de los usuarios, multi-tenant donde `cliente.app.com` se sirve desde `/sitios/cliente`, o hacer de proxy hacia otro backend. Para SEO, un redirect permanente (308) transfiere la URL; un rewrite es invisible para el buscador.",
    respuestaEn:
      "A redirect responds to the browser with a 3xx status (307 by default in `NextResponse.redirect`) and a new URL: the browser makes a second request and the address bar changes. It's for when the user must be at another URL: login, a moved route, the right locale. A rewrite is resolved inside the server: Next renders another route, but the browser still sees the original URL, with no second request. It's for when the public URL must stay but content comes from elsewhere: an A/B test where `/` shows `/home-b` to half the users, multi-tenant where `client.app.com` is served from `/sites/client`, or proxying to another backend. For SEO, a permanent redirect (308) transfers the URL; a rewrite is invisible to the search engine.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué no alcanza con verificar la autenticación en el Proxy?",
    respuestaEs:
      "Porque el Proxy es un filtro de conveniencia, no una frontera de seguridad confiable. Primero, depende del matcher: si alguien cambia el patrón, agrega una ruta nueva que no matchea o mueve una Server Action a otra ruta (las Server Actions se llaman con POST a la ruta donde se usan), esa ruta queda sin protección sin que nadie lo note. Segundo, la documentación recomienda que solo haga chequeos optimistas, leer la cookie sin ir a la base, porque corre en cada request, incluidos los prefetch, y una consulta a la DB ahí agrega latencia a toda la app. Y tercero, hubo vulnerabilidades reales: en 2025 se publicó una (CVE-2025-29927) que permitía saltearse el middleware con un header interno. La regla es defensa en profundidad: el Proxy redirige rápido al que claramente no tiene sesión, y la autorización real se verifica cerca de los datos, en la capa de acceso a datos, en cada Server Action y en cada Route Handler.",
    respuestaEn:
      "Because Proxy is a convenience filter, not a reliable security boundary. First, it depends on the matcher: if someone changes the pattern, adds a new route that doesn't match, or moves a Server Action to another route (Server Actions are called via POST to the route where they're used), that route is left unprotected without anyone noticing. Second, the docs recommend only optimistic checks, reading the cookie without hitting the database, because it runs on every request including prefetches, and a DB query there adds latency to the whole app. And third, there were real vulnerabilities: in 2025 one was published (CVE-2025-29927) that allowed bypassing middleware with an internal header. The rule is defense in depth: Proxy quickly redirects whoever clearly has no session, and real authorization is verified close to the data, in the data access layer, in every Server Action and every Route Handler.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué es importante el matcher y qué pasa si no lo configurás?",
    respuestaEs:
      "Sin matcher, el Proxy corre en TODOS los requests: páginas, pero también los archivos de `_next/static` (JS y CSS), `_next/image`, el favicon y todo lo de `public/`. Eso tiene dos costos. De performance: cada asset paga la ejecución del Proxy. Y de correctitud: un redirect de autenticación que no distingue rutas puede mandar a /login el request del CSS o del JS, y la página de login termina sin estilos o sin funcionar. Por eso el patrón habitual es un matcher negativo que excluye `api`, `_next/static`, `_next/image` y `favicon.ico`, o uno positivo que lista solo las rutas que necesitan lógica. Los valores del matcher tienen que ser constantes, porque se analizan en el build; también acepta condiciones `has` y `missing` sobre headers, cookies o query params.",
    respuestaEn:
      "Without a matcher, Proxy runs on EVERY request: pages, but also `_next/static` files (JS and CSS), `_next/image`, the favicon and everything in `public/`. That has two costs. Performance: every asset pays for the Proxy execution. And correctness: an auth redirect that doesn't distinguish routes can send the CSS or JS request to /login, and the login page ends up unstyled or broken. So the usual pattern is a negative matcher excluding `api`, `_next/static`, `_next/image` and `favicon.ico`, or a positive one listing only the routes that need logic. Matcher values must be constants since they're analyzed at build time; it also accepts `has` and `missing` conditions on headers, cookies or query params.",
    codigo: `export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué era el Edge runtime, por qué se usaba en el middleware y qué pasó con él?",
    respuestaEs:
      "Next tenía dos runtimes de servidor: Node.js, con todas sus APIs, y Edge, un entorno reducido basado en APIs web estándar (fetch, Request, Response, Web Crypto, streams), sin `fs`, sin módulos nativos y sin muchas librerías de Node. La promesa del Edge era arrancar casi sin cold start y ejecutarse en ubicaciones cercanas al usuario, algo atractivo para una capa que corre en cada request, como el middleware, que durante años corrió SOLO en Edge. El costo eran las limitaciones: no se podían usar muchos drivers de base de datos ni SDKs, el tamaño del código estaba limitado, e ISR no funcionaba. Además, correr cerca del usuario sirve de poco si la base de datos está en una sola región: cada consulta cruza el mundo igual. Por eso la dirección cambió: desde Next 15.5 el middleware puede usar Node.js; en Next 16, Proxy usa Node.js por defecto (y no admite configurar el runtime), y `runtime = 'edge'` en las rutas quedó deprecado, además de ser incompatible con Cache Components. En una entrevista conviene conocer las dos épocas, porque hay mucho código en producción con Next 13 a 15 y middleware en Edge.",
    respuestaEn:
      "Next had two server runtimes: Node.js, with all its APIs, and Edge, a reduced environment based on standard web APIs (fetch, Request, Response, Web Crypto, streams), with no `fs`, no native modules and no support for many Node libraries. Edge's promise was near-zero cold starts and running close to the user, attractive for a layer that runs on every request, like middleware, which for years ran ONLY on Edge. The cost was the limitations: many database drivers and SDKs couldn't be used, code size was capped, and ISR didn't work. Also, running close to the user helps little if the database is in a single region: every query crosses the world anyway. So the direction changed: since Next 15.5 middleware can use Node.js; in Next 16, Proxy defaults to Node.js (and doesn't allow configuring the runtime), and `runtime = 'edge'` on routes was deprecated, besides being incompatible with Cache Components. In an interview it's worth knowing both eras, since a lot of production code runs Next 13 to 15 with middleware on Edge.",
    tradeoffs:
      "Edge: arranque rápido y cercanía al usuario, pero APIs limitadas y lejos de los datos. Node.js: todo el ecosistema y cerca de la base, con cold starts mayores en serverless.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo encaja el Proxy en el orden de resolución de un request en Next.js?",
    respuestaEs:
      "Primero se aplican los `headers` y los `redirects` de `next.config`; después corre el Proxy; luego los rewrites `beforeFiles`; después las rutas del sistema de archivos (public, _next/static, app, pages); los rewrites `afterFiles`; las rutas dinámicas; y por último los rewrites `fallback`. Tiene consecuencias prácticas: un redirect declarado en `next.config` gana antes de que el Proxy se entere, y un rewrite hecho en el Proxy se resuelve contra las rutas del sistema de archivos. Dos detalles más: durante las navegaciones del cliente (requests RSC), Next le oculta al Proxy los headers internos de Flight para que no trate distinto el request RSC y el HTML de la misma página, y `NextResponse.rewrite` propaga solo lo necesario, cosa que un proxy hecho a mano con `fetch` tiene que replicar. Y para trabajo en segundo plano que no debe demorar la respuesta, como mandar analytics, existe `event.waitUntil()`.",
    respuestaEn:
      "First `next.config` `headers` and `redirects` apply; then Proxy runs; then `beforeFiles` rewrites; then file system routes (public, _next/static, app, pages); `afterFiles` rewrites; dynamic routes; and finally `fallback` rewrites. It has practical consequences: a redirect declared in `next.config` wins before Proxy even sees the request, and a rewrite done in Proxy resolves against file system routes. Two more details: during client navigations (RSC requests), Next hides internal Flight headers from Proxy so it doesn't treat the RSC request and the HTML of the same page differently, and `NextResponse.rewrite` propagates what's needed, which a hand-rolled `fetch` proxy must replicate. And for background work that shouldn't delay the response, like sending analytics, there's `event.waitUntil()`.",
  },
];
