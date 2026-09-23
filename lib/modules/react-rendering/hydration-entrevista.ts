import type { PreguntaEntrevista } from "../types";

export const entrevistaHydration: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace React durante la hydration, y por qué no vuelve a construir el DOM desde cero?",
    respuestaEs:
      "Reutiliza el HTML que el servidor ya generó y le conecta el árbol de Fiber y los event listeners correspondientes, en vez de descartarlo y volver a crear cada nodo desde cero. El HTML del servidor está 'muerto' (sin listeners, sin estado de React) hasta ese momento; hydration es exactamente el proceso de dejarlo interactivo sin pagar el costo de recrear el DOM que ya está ahí.",
    respuestaEn:
      "It reuses the HTML the server already generated and attaches the corresponding Fiber tree and event listeners, instead of discarding it and recreating every node from scratch. The server's HTML is 'dead' (no listeners, no React state) until that point; hydration is exactly the process of making it interactive without paying the cost of recreating the DOM that's already there.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cómo mostrarías algo que depende de localStorage sin causar un hydration mismatch?",
    respuestaEs:
      "Arrancando el estado con un valor neutro, igual tanto en servidor como en cliente (por ejemplo, un string vacío o un valor por defecto), y actualizándolo recién dentro de un useEffect — que solo corre en el cliente, después de que la hidratación ya terminó. Así el primer render del cliente coincide exactamente con el HTML que mandó el servidor (sin mismatch), y el valor real de localStorage se aplica un instante después, sin que React tenga que descartar y rehacer esa parte del árbol.",
    respuestaEn:
      "By starting the state with a neutral value, the same on both server and client (e.g. an empty string or a default value), and only updating it inside a useEffect — which only runs on the client, after hydration already finished. That way the client's first render matches exactly the HTML the server sent (no mismatch), and the real localStorage value gets applied an instant later, without React having to discard and redo that part of the tree.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es 'selective hydration', y qué habilita durante Server-Side Rendering con streaming?",
    respuestaEs:
      "Con Suspense boundaries en el árbol del servidor, React puede transmitir (stream) el HTML de a partes, sin esperar a que TODO el árbol termine de renderizarse del lado del servidor antes de mandar algo al navegador — las secciones envueltas en Suspense que tardan más (por ejemplo, esperando una consulta lenta a una base de datos) se completan y envían después, mientras el resto de la página ya llegó. Del lado de la hidratación, esto habilita 'selective hydration': React puede hidratar independientemente cada sección a medida que su HTML y su código llegan, y — más importante — puede PRIORIZAR hidratar primero la sección con la que el usuario intenta interactuar (por ejemplo, si hace click en un botón de una sección que todavía no terminó de hidratarse), en vez de seguir un orden fijo de arriba hacia abajo.",
    respuestaEn:
      "With Suspense boundaries in the server tree, React can stream the HTML in parts, without waiting for the WHOLE tree to finish rendering server-side before sending anything to the browser — sections wrapped in Suspense that take longer (e.g. waiting on a slow database query) get completed and sent later, while the rest of the page already arrived. On the hydration side, this enables 'selective hydration': React can hydrate each section independently as its HTML and code arrive, and — more importantly — can PRIORITIZE hydrating first the section the user is trying to interact with (e.g. if they click a button in a section that hasn't finished hydrating yet), instead of following a fixed top-to-bottom order.",
    codigo: `<Suspense fallback={<Spinner />}>
  <SeccionRapida />
</Suspense>
<Suspense fallback={<Spinner />}>
  <SeccionLenta /> {/* streamea y se hidrata cuando esté lista, sin bloquear a las demás */}
</Suspense>`,
    tradeoffs:
      "Streaming SSR + selective hydration mejora el time-to-interactive de las partes rápidas de una página, a cambio de una arquitectura más compleja (definir bien los límites de Suspense, manejar fallbacks coherentes) comparado con el modelo tradicional de 'esperar todo, hidratar todo de una vez'.",
    repregunta:
      "Si el usuario hace click en un botón de una sección que todavía no terminó de hidratarse, ¿el click se pierde?",
    respuestaRepreguntaEs:
      "No, generalmente no se pierde: React registra ese evento (gracias a la delegación de eventos en la raíz) y lo usa como señal para elevar la prioridad de hidratación de esa sección específica, procesándola antes que otras secciones de menor prioridad que todavía no fueron interactuadas. El evento se 'replaya' (se vuelve a disparar) contra el árbol ya hidratado una vez que esa sección puntual termina de conectarse. No es una garantía absoluta en todos los escenarios extremos, pero es el comportamiento esperado en el flujo normal de selective hydration.",
    respuestaRepreguntaEn:
      "No, generally it's not lost: React records that event (thanks to root-level event delegation) and uses it as a signal to raise that specific section's hydration priority, processing it before other lower-priority sections that haven't been interacted with yet. The event gets 'replayed' (re-fired) against the already-hydrated tree once that specific section finishes connecting. It's not an absolute guarantee in every extreme scenario, but it's the expected behavior in the normal selective hydration flow.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Todos los hydration mismatches tienen la misma severidad de recuperación?",
    respuestaEs:
      "No. Un mismatch de contenido de TEXTO (por ejemplo, un número o una fecha que difiere entre servidor y cliente) suele ser el caso más benigno: React puede parchear puntualmente ese nodo de texto con el valor del cliente y seguir adelante, preservando el resto del DOM hidratado alrededor. Un mismatch de ESTRUCTURA (un tipo de elemento distinto, o una cantidad distinta de hijos entre lo que el servidor mandó y lo que el cliente calcula) es más grave: React no puede simplemente 'corregir' un nodo puntual, así que tiene que descartar esa porción del árbol y volver a renderizarla enteramente en el cliente, perdiendo ahí el beneficio de SSR para esa sección específica. Por eso, un mismatch de texto genera un warning más silencioso en la práctica, mientras uno estructural es notoriamente más costoso y visible (puede causar un salto de layout perceptible).",
    respuestaEn:
      "No. A TEXT content mismatch (e.g. a number or date that differs between server and client) is usually the most benign case: React can patch just that text node with the client's value and move on, preserving the rest of the hydrated DOM around it. A STRUCTURAL mismatch (a different element type, or a different number of children between what the server sent and what the client computes) is more serious: React can't simply 'fix' a specific node, so it has to discard that portion of the tree and re-render it entirely on the client, losing SSR's benefit for that specific section. That's why a text mismatch produces a quieter warning in practice, while a structural one is noticeably more expensive and visible (it can cause a perceptible layout shift).",
    codigo: `// mismatch de texto: React puede parchear solo ese nodo
<p>{new Date().getHours()}</p>

// mismatch estructural: React descarta y rehace todo ese subárbol
{esMobile ? <MenuMobil /> : <MenuDesktop />} // esMobile puede diferir servidor/cliente`,
    repregunta:
      "En vez de mostrar un valor neutro y actualizarlo en useEffect, ¿hay una forma de que el servidor conozca de antemano una preferencia del cliente (como el tema) para evitar el mismatch/flash directamente?",
    respuestaRepreguntaEs:
      "Sí: guardando la preferencia en una cookie (en vez de únicamente en localStorage) al momento de cambiarla. Una cookie, a diferencia de localStorage, SÍ viaja automáticamente en cada request HTTP al servidor, así que el servidor puede leerla al momento de renderizar y generar el HTML inicial ya con el tema correcto desde el primer byte — eliminando por completo la necesidad del script anti-flash y del parche de useEffect, porque nunca hay una discrepancia entre lo que el servidor manda y lo que el cliente muestra. Es una técnica más robusta que el patrón 'valor neutro + useEffect', pero requiere que el servidor efectivamente lea esa cookie en el momento de renderizar, algo que no siempre es trivial según la infraestructura (CDN, cacheo de HTML estático) del proyecto.",
    respuestaRepreguntaEn:
      "Yes: by storing the preference in a cookie (instead of only in localStorage) at the moment it's changed. A cookie, unlike localStorage, DOES travel automatically with every HTTP request to the server, so the server can read it at render time and generate the initial HTML already with the correct theme from the first byte — completely eliminating the need for the anti-flash script and the useEffect patch, because there's never a discrepancy between what the server sends and what the client shows. It's a more robust technique than the 'neutral value + useEffect' pattern, but it requires the server to actually read that cookie at render time, which isn't always trivial depending on the project's infrastructure (CDN, static HTML caching).",
  },
];
