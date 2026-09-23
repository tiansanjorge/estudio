import type { PreguntaEntrevista } from "../types";

export const entrevistaCoreWebVitals: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué son las Core Web Vitals y qué mide cada una?",
    respuestaEs:
      "Son tres métricas que Google definió para medir la experiencia real de carga, respuesta y estabilidad de una página. LCP (Largest Contentful Paint) mide cuándo se pinta el elemento de contenido más grande del viewport, como proxy de 'la página ya muestra lo importante'; bueno es 2,5 s o menos. INP (Interaction to Next Paint) mide cuánto tarda la página en pintar el resultado de una interacción (click, tecla, tap), tomando una de las peores de la sesión; bueno es 200 ms o menos. CLS (Cumulative Layout Shift) mide cuánto se mueve el contenido visible sin que el usuario lo haya provocado; bueno es 0,1 o menos. Se evalúan en el percentil 75 de usuarios reales: una página 'pasa' si al menos el 75% de las visitas tiene valores buenos.",
    respuestaEn:
      "They're three metrics Google defined to measure the real loading, responsiveness and stability experience of a page. LCP (Largest Contentful Paint) measures when the largest content element in the viewport paints, as a proxy for 'the page is showing what matters'; good is 2.5 s or less. INP (Interaction to Next Paint) measures how long the page takes to paint the result of an interaction (click, key, tap), taking one of the worst in the session; good is 200 ms or less. CLS (Cumulative Layout Shift) measures how much visible content moves without the user causing it; good is 0.1 or less. They're evaluated at the 75th percentile of real users: a page 'passes' if at least 75% of visits have good values.",
  },
  {
    nivel: 1,
    pregunta:
      "Lighthouse te da 98 de performance, pero Search Console dice que la página no pasa las Core Web Vitals. ¿Cómo puede ser?",
    respuestaEs:
      "Porque miden cosas distintas. Lighthouse es un dato de laboratorio: una carga simulada, en un dispositivo y red fijos, sin interacción real. Search Console usa datos de campo (CrUX): lo que midieron los navegadores de usuarios reales, con sus celulares, redes y comportamiento. Los usuarios reales pueden tener dispositivos más lentos, llegar con caché vacía, o interactuar mientras la página todavía carga. Además, INP ni siquiera se puede medir en laboratorio porque necesita interacciones reales; Lighthouse usa Total Blocking Time como aproximación. El laboratorio sirve para diagnosticar y comparar cambios de forma reproducible; el campo es la verdad sobre la experiencia. Para tener datos de campo propios, con más detalle que CrUX, se usa RUM, por ejemplo con la librería web-vitals.",
    respuestaEn:
      "Because they measure different things. Lighthouse is lab data: a simulated load on a fixed device and network, with no real interaction. Search Console uses field data (CrUX): what real users' browsers measured, on their phones, networks and behavior. Real users may have slower devices, arrive with an empty cache, or interact while the page is still loading. Also, INP can't even be measured in the lab since it needs real interactions; Lighthouse uses Total Blocking Time as a proxy. Lab data is for diagnosing and comparing changes reproducibly; field data is the truth about the experience. For your own field data, with more detail than CrUX, you use RUM, for example with the web-vitals library.",
    codigo: `import { onLCP, onINP, onCLS } from 'web-vitals';

function enviar(metrica) {
  navigator.sendBeacon('/analytics', JSON.stringify(metrica));
}

onLCP(enviar);
onINP(enviar);
onCLS(enviar);`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo encarás un LCP malo?",
    respuestaEs:
      "Primero identifico cuál es el elemento LCP (DevTools lo marca, y web-vitals con attribution lo reporta en campo), porque la solución depende de qué es. Después descompongo el tiempo en sus partes: tiempo hasta el primer byte (servidor, redirecciones, falta de CDN), demora hasta que el navegador empieza a pedir el recurso, duración de la descarga, y demora de render. Los arreglos típicos: si es una imagen, que sea descubrible en el HTML inicial (no inyectada por JS ni como background de CSS), con `fetchpriority=\"high\"` y SIN `loading=\"lazy\"`; optimizarla en formato y tamaño; sacar CSS y JS que bloquean el render; y si el HTML tarda, cachear o renderizar en el servidor. En Next.js, `next/image` con `priority` en la imagen principal resuelve buena parte.",
    respuestaEn:
      "First I identify which element is the LCP (DevTools marks it, and web-vitals with attribution reports it in the field), because the fix depends on what it is. Then I break the time into its parts: time to first byte (server, redirects, missing CDN), delay until the browser starts requesting the resource, download duration, and render delay. Typical fixes: if it's an image, make it discoverable in the initial HTML (not injected by JS or as a CSS background), with `fetchpriority=\"high\"` and WITHOUT `loading=\"lazy\"`; optimize its format and size; remove render-blocking CSS and JS; and if the HTML is slow, cache it or render on the server. In Next.js, `next/image` with `priority` on the main image covers a good part of it.",
    tradeoffs:
      "Poner fetchpriority alta en muchos recursos anula el efecto: la prioridad es relativa, así que hay que reservarla para el elemento LCP.",
    repregunta: "¿Por qué `loading=\"lazy\"` en la imagen principal empeora el LCP?",
    respuestaRepreguntaEs:
      "Porque lazy loading hace que el navegador espere a calcular el layout para decidir si la imagen está cerca del viewport antes de pedirla, en vez de pedirla apenas la ve en el HTML. Para una imagen que va a estar visible sí o sí, esa espera es pura demora agregada al LCP. Lazy loading es para imágenes fuera del viewport inicial.",
    respuestaRepreguntaEn:
      "Because lazy loading makes the browser wait for layout to decide whether the image is near the viewport before requesting it, instead of requesting it as soon as it sees it in the HTML. For an image that will definitely be visible, that wait is pure delay added to LCP. Lazy loading is for images outside the initial viewport.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo mejorás un INP malo en una app React?",
    respuestaEs:
      "INP es alto cuando el hilo principal está ocupado en el momento de la interacción o cuando el handler hace demasiado trabajo antes de pintar. Primero encuentro qué interacción es la lenta (web-vitals con attribution, o el panel Performance grabando la interacción) y veo dónde se va el tiempo. Las herramientas: partir tareas largas y ceder el hilo principal (con `scheduler.yield()` o un `setTimeout`) para que el navegador pueda pintar; en React, marcar las actualizaciones no urgentes con `startTransition` o `useDeferredValue` para que la respuesta inmediata (el input que cambia) se pinte primero; evitar re-renders innecesarios de árboles grandes; virtualizar listas largas; y reducir el JavaScript que corre al cargar, porque interactuar durante la hidratación es una causa muy común de INP malo.",
    respuestaEn:
      "INP is high when the main thread is busy at the moment of interaction or when the handler does too much work before painting. First I find which interaction is slow (web-vitals with attribution, or recording it in the Performance panel) and see where the time goes. The tools: split long tasks and yield to the main thread (with `scheduler.yield()` or a `setTimeout`) so the browser can paint; in React, mark non-urgent updates with `startTransition` or `useDeferredValue` so the immediate response (the input changing) paints first; avoid unnecessary re-renders of large trees; virtualize long lists; and reduce JavaScript running at load, because interacting during hydration is a very common cause of bad INP.",
    codigo: `function onFiltroChange(e) {
  setTexto(e.target.value);          // urgente: el input responde ya
  startTransition(() => {
    setFiltro(e.target.value);       // no urgente: filtrar 10.000 filas
  });
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo se calcula exactamente el CLS? ¿Es la suma de todos los layout shifts de la sesión?",
    respuestaEs:
      "No, desde 2021 ya no. Cada layout shift individual tiene un puntaje: impact fraction (qué porción del viewport ocupa el contenido inestable, uniendo su posición antes y después) por distance fraction (la mayor distancia que se movió, relativa a la dimensión mayor del viewport). Esos shifts se agrupan en 'session windows': ventanas de shifts separados por menos de 1 segundo, con un máximo de 5 segundos por ventana. El CLS es el puntaje de la PEOR ventana, no la suma total. El cambio se hizo porque la suma castigaba a las páginas que el usuario tiene abiertas mucho tiempo, como una SPA. Además, los shifts que ocurren dentro de los 500 ms posteriores a una interacción del usuario no cuentan, porque se consideran esperados (abrir un acordeón, por ejemplo).",
    respuestaEn:
      "No, not since 2021. Each individual layout shift has a score: impact fraction (how much of the viewport the unstable content covers, uniting its before and after positions) times distance fraction (the greatest distance it moved, relative to the viewport's largest dimension). Those shifts are grouped into 'session windows': windows of shifts less than 1 second apart, with a 5-second maximum per window. CLS is the score of the WORST window, not the total sum. The change was made because the sum penalized pages users keep open for a long time, like an SPA. Also, shifts occurring within 500 ms after a user interaction don't count, since they're considered expected (opening an accordion, for example).",
    repregunta:
      "Una animación que mueve un elemento con `top` genera CLS, pero con `transform` no. ¿Por qué?",
    respuestaRepreguntaEs:
      "Porque un layout shift es un cambio en la posición de layout de un elemento, y `transform` no afecta el layout: se aplica en la etapa de composición, sobre la capa ya pintada, sin mover a los demás elementos. Cambiar `top`, `margin` o `height` sí recalcula el layout y puede desplazar otros elementos. Por eso animar con `transform` y `opacity` es mejor tanto para CLS como para rendimiento, ya que evita recalcular el layout en cada frame.",
    respuestaRepreguntaEn:
      "Because a layout shift is a change in an element's layout position, and `transform` doesn't affect layout: it's applied at compositing, on the already-painted layer, without moving other elements. Changing `top`, `margin` or `height` does recompute layout and can displace other elements. That's why animating with `transform` and `opacity` is better for both CLS and performance, since it avoids recomputing layout every frame.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué INP reemplazó a FID en 2024, y qué partes componen la latencia de una interacción?",
    respuestaEs:
      "FID (First Input Delay) medía solo la demora de la PRIMERA interacción hasta que empezaba a correr su handler. Tenía dos puntos ciegos: ignoraba todas las interacciones posteriores, y no medía cuánto tardaba el handler ni el pintado del resultado. Casi todas las páginas lo pasaban, así que no discriminaba. INP considera todas las interacciones de la sesión y reporta una de las peores (en páginas con muchas interacciones descarta algunas extremas), y mide la latencia completa en tres partes: input delay (el hilo principal ocupado con otra tarea cuando llega el evento), processing time (lo que tardan los handlers) y presentation delay (lo que tarda el navegador en recalcular estilos, layout y pintar el siguiente frame). Separar esas tres partes indica qué arreglar: la primera se ataca liberando el hilo, la segunda optimizando el handler, y la tercera reduciendo el trabajo de render y el tamaño del DOM.",
    respuestaEn:
      "FID (First Input Delay) measured only the delay of the FIRST interaction until its handler started running. It had two blind spots: it ignored every later interaction, and it didn't measure how long the handler or the painting of the result took. Almost every page passed it, so it didn't discriminate. INP considers every interaction in the session and reports one of the worst (on pages with many interactions it discards a few outliers), and measures the full latency in three parts: input delay (the main thread busy with another task when the event arrives), processing time (how long handlers take) and presentation delay (how long the browser takes to recalculate styles, layout and paint the next frame). Splitting those three parts tells you what to fix: the first by freeing the thread, the second by optimizing the handler, and the third by reducing render work and DOM size.",
  },
];
