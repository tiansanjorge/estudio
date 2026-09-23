import type { PreguntaEntrevista } from "../types";

export const entrevistaRouteHandlers: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un Route Handler y en qué se diferencia de las API Routes del Pages Router?",
    respuestaEs:
      "Es un archivo `route.ts` dentro de `app/` que exporta una función por método HTTP (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`) y define un endpoint en esa ruta. Es el equivalente de `pages/api`, con dos diferencias principales. Usa las APIs web estándar `Request` y `Response` (más los helpers `NextRequest` y `NextResponse`) en vez de los objetos `req` y `res` de Node, lo que lo hace portable y más fácil de testear. Y la separación por método es por export: no hay un `if (req.method === ...)`; si llega un método que el archivo no exporta, Next responde 405 solo. Un `route.ts` no puede convivir con un `page.tsx` en el mismo segmento, porque cada uno toma todos los verbos de esa ruta, y no participa de layouts ni de la navegación del cliente.",
    respuestaEn:
      "It's a `route.ts` file inside `app/` that exports one function per HTTP method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`) and defines an endpoint at that route. It's the equivalent of `pages/api`, with two main differences. It uses the standard web `Request` and `Response` APIs (plus the `NextRequest` and `NextResponse` helpers) instead of Node's `req` and `res` objects, which makes it portable and easier to test. And method separation is by export: there's no `if (req.method === ...)`; if a method the file doesn't export arrives, Next responds 405 on its own. A `route.ts` can't coexist with a `page.tsx` in the same segment, since each takes over all verbs for that route, and it doesn't take part in layouts or client navigation.",
  },
  {
    nivel: 1,
    pregunta: "¿Cuándo usarías un Route Handler, cuándo una Server Action y cuándo solo un Server Component?",
    respuestaEs:
      "Para LEER datos que muestra tu propia UI, casi siempre alcanza un Server Component que consulta la fuente directamente; pasar por un Route Handler propio agrega un viaje HTTP y, si la página se prerenderiza en el build, falla porque no hay servidor escuchando. Para MUTAR datos desde tu UI (un formulario, un botón de borrar), una Server Action: se llama como una función, se integra con formularios y con la revalidación del cache. Un Route Handler es para cuando necesitás un endpoint HTTP de verdad: lo consume alguien que no es tu UI de React (una app mobile, un tercero, un webhook de Stripe o del CMS), necesitás controlar la respuesta HTTP (status, headers, streaming, un archivo, un RSS), o el cliente pide datos que dependen de APIs del navegador o que se consultan periódicamente (polling con SWR o TanStack Query). Las Server Actions se encolan, así que no conviene usarlas para leer datos.",
    respuestaEn:
      "To READ data your own UI shows, a Server Component querying the source directly is almost always enough; going through your own Route Handler adds an HTTP hop and, if the page is prerendered at build, fails because no server is listening. To MUTATE data from your UI (a form, a delete button), a Server Action: it's called like a function and integrates with forms and cache revalidation. A Route Handler is for when you need a real HTTP endpoint: it's consumed by something other than your React UI (a mobile app, a third party, a Stripe or CMS webhook), you need to control the HTTP response (status, headers, streaming, a file, an RSS feed), or the client fetches data that depends on browser APIs or is polled (with SWR or TanStack Query). Server Actions are queued, so they're not a good fit for reading data.",
    tradeoffs:
      "Una Server Action es más cómoda pero su endpoint es interno de Next; un Route Handler es un contrato HTTP explícito que se puede documentar (OpenAPI), versionar y consumir desde cualquier cliente.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué cuidados de seguridad tiene un Route Handler que recibe datos?",
    respuestaEs:
      "Es un endpoint público: cualquiera puede llamarlo con cualquier cuerpo, sin pasar por tu UI. Por eso: verificar autenticación y autorización DENTRO del handler (no confiar en el Proxy); validar el body con un esquema (por ejemplo Zod) y responder 400 con el detalle si no cumple, además de controlar tipo de contenido y tamaño; no devolver más datos de los necesarios ni volcar errores internos al cliente; aplicar rate limiting en endpoints sensibles (login, envío de mails) devolviendo 429; y en webhooks, verificar la firma del proveedor antes de procesar nada. Con los headers conviene ser deliberado: no copiar los headers entrantes a la respuesta, porque podés reflejar información sensible. Y como el handler puede correr como función serverless, no hay que guardar estado en memoria entre requests ni esperar que un proceso largo termine antes del timeout.",
    respuestaEn:
      "It's a public endpoint: anyone can call it with any body, bypassing your UI. So: verify authentication and authorization INSIDE the handler (don't rely on Proxy); validate the body with a schema (e.g. Zod) and respond 400 with details if it fails, also checking content type and size; don't return more data than needed or dump internal errors to the client; apply rate limiting on sensitive endpoints (login, sending emails) returning 429; and for webhooks, verify the provider's signature before processing anything. Be deliberate with headers: don't copy incoming headers to the response, since you may reflect sensitive information. And since the handler may run as a serverless function, don't keep state in memory between requests or expect a long process to finish before the timeout.",
    codigo: `export async function POST(request: Request) {
  const sesion = await verificarSesion(request);
  if (!sesion) return Response.json({ error: "No autenticado" }, { status: 401 });

  const resultado = esquemaPedido.safeParse(await request.json());
  if (!resultado.success) {
    return Response.json({ error: resultado.error.issues }, { status: 400 });
  }

  const pedido = await crearPedido(sesion.userId, resultado.data);
  return Response.json(pedido, { status: 201 });
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo se comporta el caching en un Route Handler?",
    respuestaEs:
      "Por defecto no se cachea. En el modelo clásico, solo los `GET` se pueden volver estáticos, con `export const dynamic = 'force-static'` o con `revalidate`; los demás métodos nunca se cachean, aunque estén en el mismo archivo que un GET cacheado. Con Cache Components, los `GET` siguen el mismo modelo que las páginas: si no leen datos del request ni datos no cacheados, se prerenderizan en el build; si leen `headers()`, `cookies()`, propiedades del `request` o hacen consultas sin cachear, se ejecutan por request; y para incluir datos de la base en la respuesta estática se extrae la consulta a una función con `\"use cache\"` (la directiva no se puede poner directamente en el cuerpo del handler). Los archivos especiales como `sitemap.ts` u `opengraph-image.tsx` también son Route Handlers y son estáticos por defecto.",
    respuestaEn:
      "By default it's not cached. In the classic model, only `GET`s can be made static, with `export const dynamic = 'force-static'` or `revalidate`; other methods are never cached, even in the same file as a cached GET. With Cache Components, `GET`s follow the same model as pages: if they don't read request data or uncached data, they're prerendered at build; if they read `headers()`, `cookies()`, `request` properties or run uncached queries, they run per request; and to include database data in the static response you extract the query into a `\"use cache\"` function (the directive can't go directly in the handler body). Special files like `sitemap.ts` or `opengraph-image.tsx` are also Route Handlers and are static by default.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué métodos implementa Next automáticamente en un Route Handler y qué devuelve cada uno?",
    respuestaEs:
      "Dos. `HEAD`: si el archivo exporta `GET` pero no `HEAD`, Next usa el mismo handler de `GET` para responder `HEAD` (el protocolo descarta el body). `OPTIONS`: si no lo exportás, Next responde 204 con un header `Allow` que lista los métodos implementados, ordenados, incluyendo `OPTIONS` y `HEAD` cuando corresponde. Cualquier otro método que el archivo no exporte recibe un 405 Method Not Allowed, que por cierto no incluye el header `Allow` (quien quiera descubrir los métodos tiene que preguntar con OPTIONS). Hay un matiz importante con CORS: el OPTIONS automático no agrega headers `Access-Control-Allow-*`, así que si el endpoint lo consume otro origen, hay que exportar un `OPTIONS` propio que responda el preflight, o configurar los headers en el Proxy o en `next.config`.",
    respuestaEn:
      "Two. `HEAD`: if the file exports `GET` but not `HEAD`, Next uses the same `GET` handler to answer `HEAD` (the protocol drops the body). `OPTIONS`: if you don't export it, Next responds 204 with an `Allow` header listing the implemented methods, sorted, including `OPTIONS` and `HEAD` where applicable. Any other method the file doesn't export gets a 405 Method Not Allowed, which incidentally doesn't include the `Allow` header (method discovery requires asking via OPTIONS). There's an important CORS nuance: the automatic OPTIONS doesn't add `Access-Control-Allow-*` headers, so if another origin consumes the endpoint, you must export your own `OPTIONS` answering the preflight, or configure the headers in Proxy or `next.config`.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué limitaciones tiene un Route Handler desplegado como función serverless?",
    respuestaEs:
      "Cada invocación puede caer en una instancia distinta y efímera, así que no se puede compartir estado en memoria entre requests (un contador, un cache en una variable, un rate limiter en un Map): ese estado va a un store externo como Redis. El sistema de archivos suele ser de solo lectura o temporal. Hay un timeout máximo por invocación, así que el trabajo largo (procesar un video, mandar mil mails) no va en el handler: se encola en un job asíncrono y el handler responde enseguida, típicamente con 202 Accepted. Y no se pueden mantener conexiones persistentes como WebSockets, porque la función termina al responder o al llegar al timeout; para tiempo real se usa un servicio dedicado o, si alcanza, streaming o Server-Sent Events dentro del límite de tiempo. Estas restricciones no son de Next sino del modelo de despliegue: en un servidor Node propio no aplican.",
    respuestaEn:
      "Each invocation may land on a different, ephemeral instance, so in-memory state can't be shared between requests (a counter, a cache in a variable, a rate limiter in a Map): that state goes to an external store like Redis. The file system is usually read-only or temporary. There's a maximum timeout per invocation, so long work (processing a video, sending a thousand emails) doesn't go in the handler: it's queued in an async job and the handler responds right away, typically with 202 Accepted. And persistent connections like WebSockets can't be held, since the function ends on response or timeout; for real-time you use a dedicated service or, if enough, streaming or Server-Sent Events within the time limit. These constraints aren't Next's but the deployment model's: on your own Node server they don't apply.",
  },
];
