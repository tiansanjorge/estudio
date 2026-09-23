import type { PreguntaEntrevista } from "../types";

export const entrevistaDataFetchingCaching: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cómo se piden datos en el App Router, y qué pasa con dos componentes que piden lo mismo?",
    respuestaEs:
      "En un Server Component async, directamente: con `fetch`, con un ORM o con una consulta a la base, sin `useEffect` ni API intermedia. Cada componente pide lo que necesita en vez de recibirlo por props desde arriba. Si dos componentes del mismo render hacen el mismo `fetch` GET (misma URL y opciones), Next lo memoiza y se ejecuta una sola vez; para consultas que no son `fetch` (un ORM), se envuelve la función con `React.cache` para lograr lo mismo. Esa memoización dura solo el render de ese request, no es un cache persistente. Para no bloquear toda la página mientras llegan los datos, se usa `<Suspense>` (o `loading.tsx` a nivel de ruta): lo que ya está listo se manda y lo lento llega por streaming.",
    respuestaEn:
      "In an async Server Component, directly: with `fetch`, an ORM or a database query, with no `useEffect` or intermediate API. Each component fetches what it needs instead of receiving it via props from above. If two components in the same render make the same GET `fetch` (same URL and options), Next memoizes it and it runs once; for non-`fetch` queries (an ORM), wrap the function with `React.cache` to get the same. That memoization lasts only for that request's render, it's not a persistent cache. To avoid blocking the whole page while data arrives, use `<Suspense>` (or `loading.tsx` at route level): what's ready is sent and the slow parts stream in.",
  },
  {
    nivel: 1,
    pregunta: "Una page hace tres awaits seguidos que no dependen entre sí. ¿Qué problema tiene?",
    respuestaEs:
      "Es una cascada (waterfall): cada consulta empieza recién cuando termina la anterior, así que el tiempo total es la SUMA de las tres. Si no dependen entre sí, hay que iniciarlas juntas y esperar el conjunto con `Promise.all` (o `Promise.allSettled` si una puede fallar sin romper la página), y el tiempo pasa a ser el de la más lenta. Otra opción, a veces mejor, es separarlas en componentes distintos dentro de sus propios `<Suspense>`: cada uno pide lo suyo en paralelo y la UI muestra cada parte apenas está lista, en vez de esperar a la más lenta para mostrar todo. La cascada sí es correcta cuando una consulta necesita el resultado de otra (primero el usuario, después sus pedidos).",
    respuestaEn:
      "It's a waterfall: each query starts only when the previous one finishes, so total time is the SUM of all three. If they're independent, start them together and await the set with `Promise.all` (or `Promise.allSettled` if one can fail without breaking the page), and time becomes that of the slowest. Another option, sometimes better, is splitting them into separate components inside their own `<Suspense>`: each fetches in parallel and the UI shows each part as soon as it's ready, instead of waiting for the slowest to show everything. A waterfall is correct when a query needs another's result (first the user, then their orders).",
    codigo: `// ❌ ~900 ms: 300 + 300 + 300
const usuario = await getUsuario();
const ventas = await getVentas();
const avisos = await getAvisos();

// ✅ ~300 ms: arrancan juntas
const [usuario, ventas, avisos] = await Promise.all([
  getUsuario(),
  getVentas(),
  getAvisos(),
]);`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo funciona el caching con Cache Components en Next.js 16?",
    respuestaEs:
      "Se habilita con `cacheComponents: true` y el caching pasa a ser explícito y opt-in: nada se cachea por defecto, ni siquiera `fetch`. Para cachear se usa la directiva `\"use cache\"` al inicio de una función de datos (nivel dato) o de un componente o página (nivel UI). Los argumentos y los valores que la función captura de su scope forman la clave del cache, así que entradas distintas generan entradas distintas. `cacheLife` define cuánto vive la entrada con perfiles (`minutes`, `hours`, `days`, `max`) que fijan tres tiempos: `stale` (cuánto la usa el navegador sin preguntar), `revalidate` (a partir de cuándo el servidor la regenera en segundo plano) y `expire` (a partir de cuándo ya no se puede servir y el request espera). `cacheTag` le pone una etiqueta para invalidarla a demanda. Lo cacheado entra en el shell estático prerenderizado; lo que depende del request (cookies, headers) va dentro de `<Suspense>` y llega por streaming.",
    respuestaEn:
      "It's enabled with `cacheComponents: true` and caching becomes explicit and opt-in: nothing is cached by default, not even `fetch`. To cache you use the `\"use cache\"` directive at the top of a data function (data level) or a component or page (UI level). Arguments and values the function closes over form the cache key, so different inputs produce different entries. `cacheLife` sets how long the entry lives with profiles (`minutes`, `hours`, `days`, `max`) that fix three times: `stale` (how long the browser uses it without asking), `revalidate` (after which the server regenerates it in the background) and `expire` (after which it can't be served and the request waits). `cacheTag` labels it for on-demand invalidation. Cached output goes into the prerendered static shell; request-dependent parts (cookies, headers) go inside `<Suspense>` and stream in.",
    codigo: `import { cacheLife, cacheTag } from "next/cache";

export async function getProductos(categoria: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("productos");
  return db.producto.findMany({ where: { categoria } }); // categoria es parte de la clave
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencia hay entre `revalidateTag`, `updateTag` y `revalidatePath`?",
    respuestaEs:
      "Los tres invalidan cache después de una mutación, con distinta semántica. `revalidateTag(tag, 'max')` marca como vencidas las entradas con ese tag con stale-while-revalidate: el próximo request recibe la versión vieja al instante y dispara la regeneración en segundo plano. Sirve cuando una pequeña demora es aceptable (un catálogo, un blog actualizado desde un webhook del CMS) y se puede llamar desde Server Actions o Route Handlers. `updateTag(tag)` expira la entrada inmediatamente: el próximo request espera los datos nuevos. Es para read-your-own-writes, cuando el usuario que acaba de editar algo tiene que ver su cambio, y solo se puede usar en Server Actions. `revalidatePath('/ruta')` invalida todo lo de una ruta sin saber qué tags tiene; es más grueso y puede invalidar de más, así que se prefieren los tags.",
    respuestaEn:
      "All three invalidate cache after a mutation, with different semantics. `revalidateTag(tag, 'max')` marks entries with that tag as stale using stale-while-revalidate: the next request gets the old version instantly and triggers background regeneration. It fits when a slight delay is acceptable (a catalog, a blog updated from a CMS webhook) and can be called from Server Actions or Route Handlers. `updateTag(tag)` expires the entry immediately: the next request waits for fresh data. It's for read-your-own-writes, when the user who just edited something must see their change, and it can only be used in Server Actions. `revalidatePath('/route')` invalidates everything for a route without knowing its tags; it's coarser and can over-invalidate, so tags are preferred.",
    tradeoffs:
      "revalidateTag prioriza la latencia (nadie espera) a costa de servir un dato viejo una vez; updateTag prioriza la consistencia a costa de que ese request espere la regeneración.",
  },
  {
    nivel: 3,
    pregunta: "¿Dónde vive realmente lo que cachea `use cache`, y qué implica en serverless?",
    respuestaEs:
      "El resultado se serializa como RSC payload y puede vivir en tres lugares. Si entra en el prerender, como HTML del shell estático, en disco o en el almacenamiento de la plataforma detrás de un CDN. En runtime, por defecto en un store en memoria POR INSTANCIA, que en serverless es efímero: cada instancia nueva arranca vacía, así que el hit rate puede ser bajo y la función se re-ejecuta más de lo esperado. `\"use cache: remote\"` lo mueve a un cache handler durable y compartido entre instancias (por ejemplo Redis), a cambio de un viaje de red por lectura, que solo conviene si el hit rate es alto. Y en el navegador, dentro del payload de una navegación o prefetch, fresco durante el tiempo `stale`; `\"use cache: private\"` vive solo ahí, para datos por usuario que leen cookies. Además, todos estos stores son por deploy: la clave incluye el build id, así que un deploy nuevo arranca con el cache vacío.",
    respuestaEn:
      "The result is serialized as an RSC payload and can live in three places. If it goes into the prerender, as static shell HTML, on disk or in the platform's storage behind a CDN. At runtime, by default in a PER-INSTANCE in-memory store, which on serverless is ephemeral: each new instance starts empty, so hit rate can be low and the function re-runs more than expected. `\"use cache: remote\"` moves it to a durable cache handler shared across instances (e.g. Redis), at the cost of a network roundtrip per read, only worth it with a high hit rate. And in the browser, inside a navigation or prefetch payload, fresh for the `stale` window; `\"use cache: private\"` lives only there, for per-user data that reads cookies. Also, all these stores are per deployment: the key includes the build id, so a new deploy starts with an empty cache.",
  },
  {
    nivel: 3,
    pregunta:
      "Un componente con `use cache` lee `cookies()` adentro para personalizar el resultado. ¿Qué problema hay y cómo se resuelve?",
    respuestaEs:
      "Un scope cacheado compartido no puede depender de datos del request que no forman parte de su clave: si leyera la cookie adentro, el resultado de un usuario podría quedar guardado y servirse a otro. Por eso Next no permite leer APIs de runtime (`cookies`, `headers`, `searchParams`) dentro de un `use cache` normal. La solución es separar: un componente NO cacheado, dentro de `<Suspense>`, lee la cookie y le pasa el valor extraído (por ejemplo, el id de sesión o el idioma) como argumento a la función cacheada, donde pasa a ser parte de la clave, así cada valor tiene su propia entrada. La alternativa es `\"use cache: private\"`, que sí permite leer cookies directamente porque el resultado vive solo en el navegador de ese usuario y nunca en un cache compartido.",
    respuestaEn:
      "A shared cached scope can't depend on request data that isn't part of its key: if it read the cookie inside, one user's result could be stored and served to another. That's why Next doesn't allow reading runtime APIs (`cookies`, `headers`, `searchParams`) inside a regular `use cache`. The fix is splitting: an UNcached component, inside `<Suspense>`, reads the cookie and passes the extracted value (e.g. the session id or locale) as an argument to the cached function, where it becomes part of the key, so each value gets its own entry. The alternative is `\"use cache: private\"`, which does allow reading cookies directly because the result lives only in that user's browser and never in a shared cache.",
    codigo: `async function Perfil() {
  const idioma = (await cookies()).get("idioma")?.value ?? "es";
  return <Novedades idioma={idioma} />;
}

async function Novedades({ idioma }: { idioma: string }) {
  "use cache"; // idioma es parte de la clave: una entrada por idioma
  cacheLife("hours");
  return <Lista items={await getNovedades(idioma)} />;
}

// en la page: <Suspense fallback={<Skeleton />}><Perfil /></Suspense>`,
  },
];
