import type { PreguntaEntrevista } from "../types";

export const entrevistaSuspense: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "Más allá de code splitting, ¿qué significa 'Suspense para data fetching'?",
    respuestaEs:
      "Es el mismo mecanismo de Suspense (un componente que lanza una Promise durante el render, y un ancestro Suspense que la captura y muestra un fallback mientras tanto) pero aplicado a esperar DATOS, no código. En vez de que un componente maneje manualmente un estado 'cargando' con useState, el componente simplemente intenta leer datos que todavía no están listos, lanza (implícitamente, a través de una librería o del hook `use()`) una Promise, y el Suspense ancestro se encarga de mostrar el fallback — el componente en sí, una vez que los datos llegan, se escribe como si los datos SIEMPRE hubieran estado disponibles de forma síncrona.",
    respuestaEn:
      "It's the same Suspense mechanism (a component throwing a Promise during render, and an ancestor Suspense catching it and showing a fallback meanwhile) but applied to waiting for DATA, not code. Instead of a component manually managing a 'loading' state with useState, the component simply tries to read data that isn't ready yet, throws (implicitly, through a library or the `use()` hook) a Promise, and the ancestor Suspense handles showing the fallback — the component itself, once the data arrives, is written as if the data had ALWAYS been available synchronously.",
    codigo: `function Perfil({ promesaUsuario }) {
  const usuario = use(promesaUsuario); // suspende si la promesa no resolvió aún
  return <p>{usuario.nombre}</p>; // se escribe como si el dato ya estuviera ahí
}

<Suspense fallback={<Spinner />}>
  <Perfil promesaUsuario={obtenerUsuario(id)} />
</Suspense>`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué ventaja tiene 'Suspense para data fetching' sobre el patrón manual de isLoading/data/error con useState?",
    respuestaEs:
      "Elimina la necesidad de que CADA componente maneje su propio estado de carga con condicionales (`if (cargando) return <Spinner />`), reemplazándolo por un único límite de Suspense que puede envolver varios componentes a la vez, cada uno potencialmente esperando datos distintos — el fallback se muestra mientras CUALQUIERA de ellos no esté listo, y el código de cada componente individual queda más simple, sin lógica condicional de carga mezclada con la lógica de presentación de los datos ya disponibles.",
    respuestaEn:
      "It removes the need for EACH component to manage its own loading state with conditionals (`if (loading) return <Spinner />`), replacing it with a single Suspense boundary that can wrap several components at once, each potentially waiting on different data — the fallback shows while ANY of them isn't ready, and each individual component's code stays simpler, without loading conditional logic mixed with the presentation logic for already-available data.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es el problema de 'fetch-on-render' (o 'request waterfall'), y cómo lo resuelve el patrón 'render-as-you-fetch'?",
    respuestaEs:
      "'Fetch-on-render' es el patrón donde un componente empieza a pedir sus datos recién cuando se MONTA (típicamente en un useEffect): si un componente padre necesita renderizarse primero para que su hijo exista y dispare SU propio fetch, y ese hijo a su vez tiene otro hijo con su propio fetch, los pedidos de red terminan encadenados secuencialmente (esperar a que el padre monte, para que el hijo monte, para que el nieto pida sus datos) en vez de dispararse todos en paralelo desde el principio. 'Render-as-you-fetch' invierte el orden: la petición de datos se dispara ANTES de renderizar (por ejemplo, en el manejador de navegación de una ruta, antes de montar los componentes), y los componentes simplemente LEEN (con Suspense) datos que ya están en tránsito, permitiendo que todas las peticiones necesarias arranquen en paralelo desde el primer instante, sin esperar a que el árbol de componentes termine de montarse nivel por nivel.",
    respuestaEn:
      "'Fetch-on-render' is the pattern where a component only starts requesting its data when it MOUNTS (typically in a useEffect): if a parent component needs to render first for its child to exist and fire ITS OWN fetch, and that child in turn has another child with its own fetch, network requests end up chained sequentially (wait for the parent to mount, so the child mounts, so the grandchild requests its data) instead of all firing in parallel from the start. 'Render-as-you-fetch' inverts the order: the data request fires BEFORE rendering (e.g. in a route's navigation handler, before mounting the components), and components simply READ (with Suspense) data that's already in flight, allowing all necessary requests to start in parallel from the first instant, without waiting for the component tree to finish mounting level by level.",
    codigo: `// fetch-on-render: cada nivel dispara su fetch recién al montar (waterfall)
function Pagina() {
  useEffect(() => { fetchUsuario().then(setUsuario); }, []);
  // el hijo recién monta después, y ahí dispara SU fetch
}

// render-as-you-fetch: se arrancan los fetches ANTES de montar los componentes
const promesaUsuario = fetchUsuario(); // arranca ya, en paralelo con cualquier otro fetch
function Pagina() {
  return <Suspense fallback={<Spinner />}><Perfil promesaUsuario={promesaUsuario} /></Suspense>;
}`,
    tradeoffs:
      "Render-as-you-fetch requiere reestructurar dónde se disparan las peticiones (típicamente en el nivel de ruteo, antes del render), lo cual es más trabajo de arquitectura inicial que un useEffect simple, pero elimina waterfalls de red que se acumulan silenciosamente a medida que la app crece en profundidad de componentes.",
    repregunta:
      "¿Por qué los Server Components de React (usados en el App Router de Next.js) hacen que este problema de waterfalls sea menos frecuente por diseño?",
    respuestaRepreguntaEs:
      "Porque un Server Component puede hacer `await` directamente dentro de su función (es async por naturaleza, corriendo en el servidor), y varios Server Components hermanos pueden empezar a resolver sus propias peticiones de datos EN PARALELO en el servidor, sin depender de un ciclo de montaje del lado del cliente — el servidor puede iniciar todos los fetches necesarios para una página al mismo tiempo, apenas se sabe qué componentes van a renderizar, sin la limitación de 'esperar a que un componente hijo exista en el DOM del cliente para recién ahí empezar su fetch' que sí tiene el patrón clásico de fetch-on-render en el cliente.",
    respuestaRepreguntaEn:
      "Because a Server Component can `await` directly inside its function (it's async by nature, running on the server), and several sibling Server Components can start resolving their own data requests IN PARALLEL on the server, without depending on a client-side mount cycle — the server can kick off every fetch a page needs at the same time, as soon as it knows which components will render, without the 'wait for a child component to exist in the client's DOM before starting its fetch' limitation that classic client-side fetch-on-render has.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué conviene usar varios Suspense boundaries anidados en vez de uno solo envolviendo toda una pantalla?",
    respuestaEs:
      "Un único Suspense grande muestra UN solo fallback (típicamente un spinner de pantalla completa) hasta que TODO lo que está adentro está listo, incluso si una parte de la pantalla (por ejemplo, el header con el nombre del usuario) podría mostrarse casi de inmediato mientras otra parte (una lista con muchos datos relacionados) tarda más. Con Suspense boundaries anidados, cada sección puede mostrar SU PROPIO contenido en cuanto está lista, sin esperar a las secciones más lentas — el usuario ve la página 'completarse' progresivamente, sección por sección, en vez de ver una sola pantalla de carga hasta que todo esté disponible de una vez. Es el mismo principio de selective hydration visto en el módulo de Hydration, aplicado ahora al momento de mostrar contenido, no solo de hidratarlo.",
    respuestaEn:
      "A single large Suspense shows ONE fallback (typically a full-screen spinner) until EVERYTHING inside is ready, even if part of the screen (e.g. the header with the user's name) could show almost immediately while another part (a list with lots of related data) takes longer. With nested Suspense boundaries, each section can show ITS OWN content as soon as it's ready, without waiting for slower sections — the user sees the page 'complete' progressively, section by section, instead of seeing a single loading screen until everything's available at once. It's the same selective hydration principle from the Hydration module, now applied to when content is shown, not just when it's hydrated.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo funciona internamente el hook use() de React para 'suspender' un componente al recibir una Promise sin resolver?",
    respuestaEs:
      "`use(promesa)` chequea el estado interno de esa Promise: si ya está resuelta, devuelve directamente su valor de forma síncrona (sin ninguna espera adicional). Si todavía está pendiente, `use` LANZA la Promise misma como si fuera una excepción (`throw promesa`) — no un error, la promesa en sí. React, al procesar el árbol de fibers, tiene lógica especial para reconocer cuando lo que se lanzó durante el render es una Promise (en vez de un Error real): en ese caso, en vez de propagarlo como un error hacia un error boundary, lo intercepta como señal de 'este componente todavía no puede completar su render', pausa ese trabajo, y cuando la Promise finalmente resuelve, programa un reintento del render de ese componente — mostrando mientras tanto el fallback del Suspense ancestro más cercano.",
    respuestaEn:
      "`use(promise)` checks that Promise's internal state: if it's already resolved, it directly returns its value synchronously (no additional wait). If it's still pending, `use` THROWS the Promise itself as if it were an exception (`throw promise`) — not an error, the promise itself. React, while processing the fiber tree, has special logic to recognize when what was thrown during render is a Promise (instead of a real Error): in that case, instead of propagating it as an error toward an error boundary, it intercepts it as a signal of 'this component can't complete its render yet', pauses that work, and once the Promise finally resolves, schedules a retry of that component's render — showing the nearest ancestor Suspense's fallback in the meantime.",
    codigo: `// conceptualmente, así funciona use() por debajo:
function use(promesa) {
  if (promesa.status === 'fulfilled') return promesa.value;
  if (promesa.status === 'rejected') throw promesa.reason; // error real, va a un error boundary
  throw promesa; // todavía pendiente: React lo interpreta como señal de Suspense, no como error`,
    repregunta:
      "¿Por qué NO se puede simplemente llamar a `use()` con una Promise creada de nuevo en cada render (por ejemplo, directamente dentro del cuerpo del componente)?",
    respuestaRepreguntaEs:
      "Porque cada vez que el componente se re-renderiza, se crearía una Promise NUEVA para `use()`, que empieza pendiente desde cero — el componente entraría en un ciclo de suspender indefinidamente, ya que nunca le da tiempo a la misma promesa de resolver antes de que otro render la reemplace por una distinta. `use()` está pensado para recibir una Promise que se creó UNA sola vez fuera del ciclo de render (por ejemplo, en un cache de peticiones, o pasada como prop desde un componente padre que la creó también fuera del render, o directamente devuelta por una librería de data fetching que gestiona su propio cacheo) — nunca una Promise instanciada de cero cada vez que la función del componente se ejecuta.",
    respuestaRepreguntaEn:
      "Because every time the component re-renders, a NEW Promise would be created for `use()`, starting pending from scratch — the component would enter an infinite suspend cycle, since the same promise never gets time to resolve before another render replaces it with a different one. `use()` is meant to receive a Promise created ONCE outside the render cycle (e.g. in a request cache, or passed as a prop from a parent component that also created it outside render, or directly returned by a data-fetching library that manages its own caching) — never a Promise instantiated fresh every time the component's function runs.",
  },
];
