import type { PreguntaEntrevista } from "../types";

export const entrevistaAppVsPagesRouter: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuál es la diferencia principal entre App Router y Pages Router en Next.js?",
    respuestaEs:
      "Son dos sistemas de routing con modelos distintos. En Pages Router cada archivo dentro de `pages/` es una ruta, los componentes son componentes de cliente tradicionales (se renderizan en el servidor y se hidratan enteros), y los datos se piden con funciones a nivel de página como `getServerSideProps` o `getStaticProps`, que bajan por props. En App Router, las carpetas dentro de `app/` definen las rutas y archivos especiales (`page`, `layout`, `loading`, `error`, `not-found`) definen la UI de cada segmento. Está construido sobre React Server Components: por defecto los componentes corren solo en el servidor, pueden ser async y pedir sus propios datos, y su código no llega al navegador. Además trae layouts anidados que se preservan al navegar, streaming con Suspense, y un modelo de caching más granular. Para proyectos nuevos, Next recomienda App Router; Pages sigue soportado.",
    respuestaEn:
      "They're two routing systems with different models. In Pages Router each file in `pages/` is a route, components are traditional client components (server-rendered and fully hydrated), and data is fetched with page-level functions like `getServerSideProps` or `getStaticProps`, passed down as props. In App Router, folders in `app/` define routes and special files (`page`, `layout`, `loading`, `error`, `not-found`) define each segment's UI. It's built on React Server Components: by default components run only on the server, can be async and fetch their own data, and their code doesn't reach the browser. It also brings nested layouts preserved across navigation, streaming with Suspense, and a more granular caching model. For new projects Next recommends App Router; Pages is still supported.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo se traduce `getServerSideProps` al App Router?",
    respuestaEs:
      "Desaparece como concepto: el fetch se hace directamente en un Server Component async, que es la página misma o cualquier componente dentro de ella. Si el acceso a datos depende del request (cookies, headers, searchParams) o se marca como no cacheable, la ruta se renderiza en cada request, que es el equivalente a SSR. La diferencia práctica es que ya no hay un único punto de entrada de datos por página que después baja por props: cada componente pide lo que necesita, y Next deduplica los requests iguales dentro del mismo render. Para acceder a cookies o headers se usan las funciones `cookies()` y `headers()` de `next/headers` en lugar del objeto `req`.",
    respuestaEn:
      "It disappears as a concept: the fetch happens directly in an async Server Component, which is the page itself or any component inside it. If data access depends on the request (cookies, headers, searchParams) or is marked uncacheable, the route renders on every request, the SSR equivalent. The practical difference is there's no longer a single data entry point per page passed down via props: each component requests what it needs, and Next deduplicates identical requests within the same render. To access cookies or headers you use the `cookies()` and `headers()` functions from `next/headers` instead of the `req` object.",
    codigo: `// Pages
export async function getServerSideProps({ req }) {
  const tema = req.cookies.tema;
  return { props: { tema } };
}

// App
import { cookies } from "next/headers";

export default async function Page() {
  const tema = (await cookies()).get("tema")?.value;
  return <Panel tema={tema} />;
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo migrarías una aplicación grande de Pages Router a App Router?",
    respuestaEs:
      "Incrementalmente: las carpetas `app/` y `pages/` pueden convivir, así que se migra ruta por ruta en vez de hacer un big bang. Primero se crea el root layout (que reemplaza a `_app` y `_document`), después se mueven las rutas de menor riesgo y más valor, convirtiendo las funciones de datos en Server Components y marcando con 'use client' solo los componentes interactivos, que muchas veces se pueden reutilizar tal cual. Hay que tener en cuenta el costo de la convivencia: navegar entre una ruta de `pages/` y una de `app/` es una navegación completa (hard navigation), y `next/link` no hace prefetch entre routers; por eso conviene migrar por secciones que se navegan juntas. También hay que revisar librerías que dependen del contexto de React en todo el árbol (CSS-in-JS con runtime, algunos state managers), porque en App necesitan un provider de cliente explícito. Y los componentes compartidos que usan `useRouter` pueden usar `next/compat/router` durante la transición.",
    respuestaEn:
      "Incrementally: `app/` and `pages/` can coexist, so you migrate route by route instead of a big bang. First create the root layout (which replaces `_app` and `_document`), then move the lowest-risk, highest-value routes, turning data functions into Server Components and marking only interactive components with 'use client', which can often be reused as-is. Keep the cost of coexistence in mind: navigating between a `pages/` route and an `app/` route is a full (hard) navigation, and `next/link` doesn't prefetch across routers; so migrate sections that are navigated together. Also review libraries that depend on React context across the whole tree (runtime CSS-in-JS, some state managers), since in App they need an explicit client provider. And shared components using `useRouter` can use `next/compat/router` during the transition.",
    tradeoffs:
      "Migrar tiene costo real (curva de RSC, nuevo modelo de caching, librerías incompatibles). Si la app funciona bien en Pages y no necesita layouts anidados, streaming ni menos JS en el cliente, no migrar también es una decisión válida.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué ventaja concreta dan los layouts anidados del App Router frente a `_app` + `getLayout`?",
    respuestaEs:
      "Tres. Primero, persistencia: al navegar entre rutas hijas, el layout compartido no se vuelve a renderizar ni se desmonta, así que conserva su estado (un sidebar colapsado, un input con texto, un video reproduciéndose) y solo cambia la parte que cambió. Con `getLayout` se podía lograr algo parecido, pero era un patrón manual y frágil. Segundo, cada segmento puede tener sus propios `loading.tsx` y `error.tsx`, así que un error o una carga lenta en una sección se contiene ahí sin afectar el resto. Tercero, los layouts pueden ser Server Components que piden sus propios datos (el menú de usuario, la lista de proyectos del sidebar). La contracara de la persistencia es que un layout no puede leer `searchParams` ni depender del pathname en el servidor, porque quedaría desactualizado: eso se resuelve en la page o en un Client Component con `useSearchParams` o `usePathname`.",
    respuestaEn:
      "Three. First, persistence: when navigating between child routes, the shared layout doesn't re-render or unmount, so it keeps its state (a collapsed sidebar, an input with text, a playing video) and only the changed part updates. With `getLayout` you could get something similar, but it was a manual, fragile pattern. Second, each segment can have its own `loading.tsx` and `error.tsx`, so an error or slow load in one section is contained there without affecting the rest. Third, layouts can be Server Components fetching their own data (the user menu, the sidebar's project list). The flip side of persistence is that a layout can't read `searchParams` or depend on the pathname on the server, since it would go stale: that's handled in the page or in a Client Component with `useSearchParams` or `usePathname`.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa en el App Router cuando navegás del lado del cliente? ¿Se descarga HTML?",
    respuestaEs:
      "En la carga inicial el servidor manda HTML (para mostrar algo rápido y para SEO) más el RSC payload, una representación serializada del árbol de Server Components con los lugares donde van los Client Components y sus props. En las navegaciones siguientes no se descarga HTML: el router pide solo el RSC payload de los segmentos que cambian (los layouts compartidos ya están), React lo reconcilia con el árbol actual y actualiza el DOM, preservando el estado de lo que no cambió. Los links visibles se prefetchean, y el router mantiene un cache en el cliente de los segmentos visitados, lo que permite volver atrás instantáneamente. Por eso el App Router se siente como una SPA sin perder el render en el servidor. Un efecto a tener en cuenta: como ese cache existe, después de una mutación hay que invalidar (por ejemplo con `revalidatePath` en una Server Action, o `router.refresh()`), si no se puede ver data vieja.",
    respuestaEn:
      "On the initial load the server sends HTML (to show something fast and for SEO) plus the RSC payload, a serialized representation of the Server Component tree with slots for Client Components and their props. On subsequent navigations no HTML is downloaded: the router requests only the RSC payload for the segments that change (shared layouts are already there), React reconciles it with the current tree and updates the DOM, preserving state for what didn't change. Visible links are prefetched, and the router keeps a client-side cache of visited segments, allowing instant back navigation. That's why App Router feels like an SPA without giving up server rendering. One effect to keep in mind: because that cache exists, after a mutation you need to invalidate (e.g. with `revalidatePath` in a Server Action, or `router.refresh()`), otherwise stale data may show.",
  },
  {
    nivel: 3,
    pregunta:
      "El App Router plantea que la frontera entre estático y dinámico está a nivel de componente, no de ruta. ¿Qué significa y qué costo tiene?",
    respuestaEs:
      "En Pages, cada ruta elegía un modo: o `getStaticProps` (estática, generada en el build) o `getServerSideProps` (dinámica en cada request). Una página casi estática con un solo dato personalizado (el nombre del usuario, un precio en vivo) tenía que volverse entera dinámica o pedir ese dato en el cliente después de cargar. En App Router, con Partial Prerendering y Cache Components (`use cache`), una misma respuesta combina un shell estático que se sirve instantáneamente, partes cacheadas que se revalidan por su cuenta, y partes dinámicas que llegan por streaming dentro de límites de Suspense. El costo, según la propia documentación, es de infraestructura: el hosting necesita soportar streaming, coordinar la invalidación del cache entre instancias (un `revalidateTag` tiene que llegar a todas) y mantener consistentes el HTML y el RSC payload. En Vercel eso viene resuelto; al hacer self-hosting con varias instancias, hay que configurar un cache compartido.",
    respuestaEn:
      "In Pages, each route picked one mode: either `getStaticProps` (static, generated at build) or `getServerSideProps` (dynamic per request). A mostly-static page with one personalized piece of data (the user's name, a live price) had to become fully dynamic or fetch that data on the client after load. In App Router, with Partial Prerendering and Cache Components (`use cache`), a single response combines a static shell served instantly, cached parts that revalidate independently, and dynamic parts streamed in within Suspense boundaries. The cost, per the docs themselves, is infrastructure: hosting must support streaming, coordinate cache invalidation across instances (a `revalidateTag` must reach all of them) and keep HTML and RSC payload consistent. On Vercel that's handled; when self-hosting with multiple instances, you need to configure a shared cache.",
  },
];
