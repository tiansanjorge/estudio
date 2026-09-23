import type { PreguntaEntrevista } from "../types";

export const entrevistaLazyLoading: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace React.lazy, y por qué siempre se usa junto con Suspense?",
    respuestaEs:
      "`React.lazy(() => import('./Componente'))` retrasa la descarga del código de ese componente hasta el momento en que realmente se necesita renderizarlo, en vez de incluirlo en el bundle inicial. Mientras ese código se descarga (asincrónicamente, la primera vez que se renderiza), React necesita mostrar ALGO en su lugar — ese 'algo' es exactamente lo que resuelve Suspense: un fallback visible mientras el componente lazy todavía no está disponible, y el reemplazo automático por el componente real en cuanto termina de cargar.",
    respuestaEn:
      "`React.lazy(() => import('./Component'))` delays downloading that component's code until the moment it's actually needed to render, instead of including it in the initial bundle. While that code downloads (asynchronously, the first time it's rendered), React needs to show SOMETHING in its place — that 'something' is exactly what Suspense solves: a visible fallback while the lazy component isn't available yet, and the automatic swap to the real component once it finishes loading.",
    codigo: `const PanelAvanzado = React.lazy(() => import('./PanelAvanzado'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <PanelAvanzado />
    </Suspense>
  );
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué tipo de componentes conviene cargar de forma perezosa (lazy)?",
    respuestaEs:
      "Componentes que NO son visibles de inmediato para la mayoría de los usuarios: un modal que solo se abre con una acción explícita, una pestaña secundaria de un panel con tabs, una sección avanzada de configuración que poca gente visita, o rutas completas de la app a las que no todos los usuarios navegan. Cargar de forma perezosa algo que el usuario ve apenas entra a la página (el contenido 'above the fold') es contraproducente: agrega una espera extra donde antes no la había, en vez de mejorar algo.",
    respuestaEn:
      "Components that AREN'T immediately visible to most users: a modal that only opens with an explicit action, a secondary tab in a panel, an advanced settings section few people visit, or entire app routes not every user navigates to. Lazily loading something the user sees the moment they land on the page ('above the fold' content) is counterproductive: it adds an extra wait where there wasn't one before, instead of improving anything.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué trade-off hay entre lazy loading agresivo (muchos componentes chicos) y no dividir el código en absoluto?",
    respuestaEs:
      "Sin ninguna división, el usuario descarga TODO el código de la app (incluidas partes que quizás nunca use) antes de poder interactuar con cualquier cosa — un bundle inicial más pesado, un tiempo hasta interactividad más largo. Lazy loading demasiado agresivo (dividir en decenas de chunks muy chicos) tiene su propio costo: cada import() dinámico es una request de red adicional, y muchas requests chicas pueden generar más overhead acumulado (latencia de conexión, cabeceras HTTP) que unos pocos chunks más grandes bien elegidos. El punto óptimo suele estar en dividir por unidades de navegación reales (rutas, secciones que el usuario visita de forma independiente), no en fragmentar cada componente individual.",
    respuestaEn:
      "With no splitting at all, the user downloads the ENTIRE app's code (including parts they might never use) before being able to interact with anything — a heavier initial bundle, a longer time to interactivity. Overly aggressive lazy loading (splitting into dozens of very small chunks) has its own cost: each dynamic import() is an extra network request, and many small requests can generate more accumulated overhead (connection latency, HTTP headers) than a few well-chosen larger chunks. The sweet spot is usually splitting by real navigation units (routes, sections the user visits independently), not fragmenting every individual component.",
    tradeoffs:
      "Sin lazy loading: bundle inicial pesado, pero sin requests adicionales después. Lazy loading agresivo: bundle inicial liviano, pero más requests de red y más puntos donde puede fallar la carga.",
    repregunta:
      "¿Cómo evitarías que el usuario vea el fallback de Suspense (un spinner) apenas hace hover sobre un enlace, si podés anticipar que probablemente va a navegar ahí?",
    respuestaRepreguntaEs:
      "Con 'preloading': disparar el `import()` dinámico del componente/ruta ANTES de que el usuario efectivamente navegue, en respuesta a una señal de intención (un `onMouseEnter` sobre el link, o directamente apenas la página actual terminó de cargar, si el destino es muy probable). El import dinámico devuelve una promesa que se puede iniciar sin usarla todavía — cuando el usuario efectivamente hace click, si la descarga ya terminó (o está en curso), React.lazy usa ese resultado ya disponible o casi disponible, mostrando el fallback de Suspense por mucho menos tiempo, o directamente sin mostrarlo si el preload ya terminó.",
    respuestaRepreguntaEn:
      "With 'preloading': triggering the dynamic `import()` of the component/route BEFORE the user actually navigates, in response to an intent signal (an `onMouseEnter` on the link, or right after the current page finishes loading, if the destination is very likely). The dynamic import returns a promise that can be started without using it yet — when the user actually clicks, if the download already finished (or is in progress), React.lazy uses that already-available or nearly-available result, showing the Suspense fallback for much less time, or not at all if the preload already finished.",
    codigoRepregunta: `const cargarPanel = () => import('./PanelAvanzado');
const PanelAvanzado = React.lazy(cargarPanel);

function Enlace() {
  return (
    <a onMouseEnter={() => cargarPanel()} href="/panel-avanzado">
      Ver panel avanzado
    </a>
  ); // dispara la descarga en el hover, antes del click real
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿En qué se diferencia el lazy loading de imágenes (loading='lazy') del lazy loading de componentes con React.lazy?",
    respuestaEs:
      "El atributo nativo `loading=\"lazy\"` en una etiqueta `<img>` le dice al NAVEGADOR que retrase la descarga de esa imagen hasta que esté cerca de entrar al viewport (scroll), sin necesitar ninguna librería ni JavaScript — es una optimización de RED (menos bytes descargados de entrada). `React.lazy` retrasa la descarga de CÓDIGO JavaScript (el componente en sí), no de un recurso de imagen — es una optimización de bundle size y tiempo de parseo/ejecución de JS, un problema distinto aunque con el mismo objetivo general de 'no cargar de más lo que todavía no hace falta'.",
    respuestaEn:
      "The native `loading=\"lazy\"` attribute on an `<img>` tag tells the BROWSER to delay downloading that image until it's near entering the viewport (scroll), with no library or JavaScript needed — it's a NETWORK optimization (fewer bytes downloaded upfront). `React.lazy` delays downloading JavaScript CODE (the component itself), not an image resource — it's a bundle size and JS parse/execution time optimization, a different problem though with the same general goal of 'don't load upfront what isn't needed yet'.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa si el import() dinámico de un componente lazy falla (por ejemplo, por un problema de red al descargar el chunk), y cómo se maneja correctamente?",
    respuestaEs:
      "Un import() que falla rechaza la Promise, y React.lazy propaga ese rechazo como un ERROR durante el render — Suspense NO captura errores, solo maneja el estado de 'todavía cargando'. Por eso un componente lazy siempre debería estar envuelto tanto en Suspense (para el estado de carga) COMO en un error boundary (para el caso de que la descarga falle), típicamente el error boundary por FUERA del Suspense, para que pueda mostrar un mensaje de 'no se pudo cargar esta sección, reintentar' en vez de dejar que el error tumbe toda la aplicación.",
    respuestaEn:
      "A failed import() rejects the Promise, and React.lazy propagates that rejection as an ERROR during render — Suspense does NOT catch errors, it only handles the 'still loading' state. That's why a lazy component should always be wrapped both in Suspense (for the loading state) AND in an error boundary (for the case the download fails), typically with the error boundary OUTSIDE the Suspense, so it can show a 'couldn't load this section, retry' message instead of letting the error take down the whole application.",
    codigo: `<ErrorBoundary fallback={<p>No se pudo cargar esta sección. <button onClick={reintentar}>Reintentar</button></p>}>
  <Suspense fallback={<Spinner />}>
    <PanelAvanzado /> {/* si el import() falla, sube al ErrorBoundary, no al Suspense */}
  </Suspense>
</ErrorBoundary>`,
    repregunta:
      "Si el usuario hace click en 'reintentar' después de un fallo de carga, ¿alcanza con volver a renderizar el mismo componente lazy?",
    respuestaRepreguntaEs:
      "No necesariamente — `React.lazy` cachea internamente la Promise devuelta por el import() la primera vez que se llama: si esa Promise ya quedó rechazada, simplemente volver a renderizar el mismo componente lazy vuelve a usar esa Promise rechazada, sin reintentar la descarga. La forma correcta de forzar un reintento real es cambiar la `key` del componente lazy (o del boundary que lo envuelve) al reintentar, para que React lo trate como una instancia nueva y dispare el `import()` de cero — o, en implementaciones más elaboradas, envolver la función de carga en un helper que reintenta manualmente el import() con un nuevo intento cada vez que se invoca.",
    respuestaRepreguntaEn:
      "Not necessarily — `React.lazy` internally caches the Promise returned by the import() the first time it's called: if that Promise already rejected, simply re-rendering the same lazy component reuses that rejected Promise, without retrying the download. The correct way to force a real retry is changing the lazy component's `key` (or the boundary wrapping it) on retry, so React treats it as a new instance and triggers the `import()` from scratch — or, in more elaborate implementations, wrapping the loading function in a helper that manually retries the import() with a fresh attempt each time it's invoked.",
  },
];
