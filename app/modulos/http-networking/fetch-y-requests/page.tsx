import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FetchLifecycleSimulador } from "@/components/modulo/FetchLifecycleSimulador";
import { BusquedaConCancelacion } from "@/components/modulo/BusquedaConCancelacion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosFetch } from "@/lib/modules/http/fetch-lifecycle";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaFetchRequests } from "@/lib/modules/http/fetch-requests-entrevista";

const preguntasPorNivel = {
  1: entrevistaFetchRequests.filter((p) => p.nivel === 1),
  2: entrevistaFetchRequests.filter((p) => p.nivel === 2),
  3: entrevistaFetchRequests.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Fetch/XHR y manejo de requests — Dev Study Lab",
  description:
    "Cómo se resuelve la Promise de fetch, cuándo rechaza de verdad, y cómo cancelar requests para evitar race conditions.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "fetch('/api/x') devuelve un 500. ¿La Promise de fetch se rechaza?",
    opciones: [
      "Sí, siempre que el status no sea 2xx",
      "No, se resuelve igual — hay que chequear response.ok",
      "Solo si el 500 viene sin body",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "fetch() solo rechaza ante un error de red (sin conexión, DNS, CORS bloqueado antes de la respuesta). Un status HTTP de error resuelve la Promise igual, con response.ok en false.",
  },
  {
    pregunta:
      "Escribís 'r' y después 'react' rápido en un buscador sin cancelación. La respuesta de 'r' tarda más y llega después que la de 'react'. ¿Qué termina mostrando la UI?",
    opciones: [
      "Los resultados de 'react' (la búsqueda más reciente)",
      "Los resultados de 'r' (la que llegó al final)",
      "Un error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin cancelar requests obsoletas, gana la última respuesta en llegar, no la última en pedirse. Eso es una race condition.",
  },
  {
    pregunta: "¿Con qué herramienta se cancela un fetch en curso?",
    opciones: ["clearTimeout", "AbortController", "response.cancel()"],
    respuestaCorrecta: 1,
    explicacion:
      "Se crea un AbortController, se manda su signal en las opciones de fetch, y controller.abort() cancela la petición.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estos status conviene reintentar automáticamente?",
    opciones: ["400 Bad Request", "404 Not Found", "503 Service Unavailable"],
    respuestaCorrecta: 2,
    explicacion:
      "Un 503 es transitorio; un 400 o 404 van a fallar igual en el reintento.",
  },
  {
    pregunta: "¿Para qué se agrega jitter al backoff exponencial?",
    opciones: [
      "Para que los reintentos sean más rápidos",
      "Para que miles de clientes no reintenten todos al mismo tiempo",
      "Para evitar CORS",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin aleatoriedad, los reintentos sincronizados generan picos que vuelven a tirar el servicio.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué evento conviene usar para mandar analytics antes de que el usuario se vaya?",
    opciones: ["unload", "visibilitychange (cuando pasa a hidden)", "click"],
    respuestaCorrecta: 1,
    explicacion:
      "unload no es confiable en mobile y rompe el back/forward cache.",
  },
  {
    pregunta: "Un servicio lleva 2 minutos caído. ¿Qué patrón evita seguir golpeándolo?",
    opciones: ["Más reintentos", "Circuit breaker", "Debounce"],
    respuestaCorrecta: 1,
    explicacion:
      "Tras N fallas, rechaza de inmediato durante un tiempo y después prueba con un request.",
  },
];

export default function FetchYRequestsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Fetch/XHR y manejo de requests"
      descripcion="fetch() resuelve su Promise más veces de lo que la mayoría espera — y cancelar requests obsoletas es la diferencia entre una UI correcta y una con bugs intermitentes."
    >
      <NivelTabs
        niveles={{
          1: <NivelUno />,
          2: <NivelDos />,
          3: <NivelTres />,
        }}
      />
    </ModuloLayout>
  );
}

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <code>fetch()</code> devuelve una Promise que se resuelve en
            cuanto llegan los <strong className="text-foreground">headers</strong>{" "}
            de la respuesta, sin esperar el body. Esa Promise se resuelve con
            un objeto <code>Response</code> — sin importar si el status es
            200 o 500.
          </p>
          <p>
            Eso significa que{" "}
            <strong className="text-foreground">
              fetch() no rechaza por un error HTTP
            </strong>
            . Solo rechaza ante un error de red: sin conexión, DNS que no
            resuelve, o CORS bloqueando antes de recibir respuesta. Por eso
            siempre hay que chequear{" "}
            <code>response.ok</code> (o <code>response.status</code>)
            manualmente antes de asumir que la petición salió bien.
          </p>
          <p>
            El otro problema clásico no es sobre una petición sola, sino
            sobre varias en secuencia:{" "}
            <strong className="text-foreground">race conditions</strong>. Si
            disparás un fetch en cada tecla de un buscador y no cancelás
            los anteriores, una respuesta vieja puede llegar{" "}
            <em>después</em> de una más nueva y pisar el resultado
            correcto en pantalla. <code>AbortController</code> existe
            justamente para cancelar esas peticiones obsoletas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <FetchLifecycleSimulador escenarios={escenariosFetch} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <BusquedaConCancelacion />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Confiar en que el catch atrapa errores HTTP.
            </strong>{" "}
            No lo hace. Un 404 o 500 entra por el then/await normal, no por
            el catch.
          </li>
          <li>
            <strong className="text-foreground">
              No cancelar requests obsoletas en buscadores o filtros.
            </strong>{" "}
            Genera race conditions donde una respuesta vieja pisa una más
            nueva.
          </li>
          <li>
            <strong className="text-foreground">
              Tratar un AbortError como un error real.
            </strong>{" "}
            Cuando vos mismo cancelás con AbortController, fetch rechaza con
            un error de nombre <code>AbortError</code> — hay que
            identificarlo y no tratarlo como una falla.
          </li>
          <li>
            <strong className="text-foreground">
              Disparar un fetch por cada tecla sin debounce.
            </strong>{" "}
            Multiplica peticiones innecesarias, aunque después se cancelen.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Buscadores con autocompletado: cancelar la búsqueda anterior en
            cada tecla nueva.
          </li>
          <li>
            Cancelar una petición en curso si el usuario navega a otra
            pantalla antes de que termine.
          </li>
          <li>
            Distinguir un error de red (reintentable) de un error de
            validación 4xx (no tiene sentido reintentarlo igual).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este hook busca cada vez que cambia <code>query</code>, pero no
            cancela nada:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function useBusqueda(query) {
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    fetch(\`/api/buscar?q=\${query}\`)
      .then((res) => res.json())
      .then((datos) => setResultado(datos));
  }, [query]);

  return resultado;
}`}
          </pre>
          <p>
            El usuario escribe &ldquo;r&rdquo;, &ldquo;re&rdquo;,
            &ldquo;rea&rdquo;, &ldquo;react&rdquo; rápido. La respuesta de
            &ldquo;r&rdquo; tarda más y llega después que la de
            &ldquo;react&rdquo;. ¿Qué termina mostrando <code>resultado</code>{" "}
            y cómo lo arreglarías?
          </p>
          <RevelarSolucion>
            <p>
              <code>resultado</code> termina mostrando los datos de{" "}
              &ldquo;r&rdquo;, no de &ldquo;react&rdquo; — gana la última
              respuesta en <em>llegar</em>, no la última en pedirse. Es una
              race condition.
            </p>
            <p className="mt-2">El fix es cancelar el fetch anterior con AbortController en el cleanup del effect:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/buscar?q=\${query}\`, { signal: controller.signal })
    .then((res) => res.json())
    .then((datos) => setResultado(datos))
    .catch((error) => {
      if (error.name !== "AbortError") throw error;
    });

  return () => controller.abort();
}, [query]);`}
            </pre>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <code>fetch</code> no tiene timeout: se agrega con{" "}
            <code>AbortSignal.timeout(ms)</code>, y se combina con una
            cancelación manual con <code>AbortSignal.any()</code>.
          </p>
          <p>
            Los <strong className="text-foreground">reintentos</strong> se
            aplican solo a errores transitorios (red, timeout, 408, 429, 5xx
            de gateway) y a requests idempotentes, con{" "}
            <strong className="text-foreground">backoff exponencial y jitter</strong>{" "}
            y respetando <code>Retry-After</code>.
          </p>
          <p>
            Conviene centralizar todo en un{" "}
            <strong className="text-foreground">cliente de API</strong>:
            headers comunes, errores tipados, timeouts y reintentos en un solo
            lugar. Y conocer a <code>XMLHttpRequest</code>: sigue siendo la
            forma práctica de medir el progreso de subida de un archivo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Reintentar un POST sin idempotency key.</strong>{" "}
            Puede crear el recurso dos veces.
          </li>
          <li>
            <strong className="text-foreground">Reintentos sin espera ni límite.</strong>{" "}
            Convierten una caída breve en una avalancha de requests.
          </li>
          <li>
            <strong className="text-foreground">Leer el body dos veces.</strong>{" "}
            <code>response.json()</code> consume el stream; para leerlo de
            nuevo hay que usar <code>response.clone()</code> antes.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un <code>apiClient</code> con timeout de 10 s y 3 reintentos para GETs.</li>
          <li>Subida de archivos con barra de progreso usando XHR.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel2} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[2]} />
      </Seccion>
    </>
  );
}

function NivelTres() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Al cerrar la página, un <code>fetch</code> normal se cancela.{" "}
            <code>navigator.sendBeacon</code> y{" "}
            <code>fetch(url, {"{ keepalive: true }"})</code> completan el request
            en segundo plano (con límite de tamaño), y el momento confiable
            para mandarlos es <code>visibilitychange</code> a{" "}
            <code>hidden</code>.
          </p>
          <p>
            El <strong className="text-foreground">circuit breaker</strong>{" "}
            complementa a los reintentos: ante una caída prolongada deja de
            llamar al servicio durante un tiempo y después prueba con un
            request. El <strong className="text-foreground">streaming</strong>{" "}
            de <code>response.body</code> permite procesar respuestas grandes
            (o de un LLM) a medida que llegan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Mandar analytics en <code>unload</code>.</strong>{" "}
            En mobile muchas veces no se dispara.
          </li>
          <li>
            <strong className="text-foreground">Esperar el body completo de una respuesta enorme.</strong>{" "}
            Con streaming se puede mostrar progreso o resultados parciales.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Mostrar la respuesta de un chat con IA token a token leyendo el stream.</li>
          <li>Un circuit breaker en el BFF que llama a un servicio de pagos.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este cliente &quot;robusto&quot; empeoró la última caída del
            backend: el tráfico se multiplicó por cinco. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`async function pedirConReintentos(url, opciones) {
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(url, opciones);
      if (res.ok) return res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Reintenta cualquier error, incluidos 400 y 404, y cualquier
              método, incluidos POST no idempotentes. Espera siempre 1 segundo
              fijo: todos los clientes reintentan sincronizados, cada segundo,
              cinco veces, así que un backend con problemas recibe el tráfico
              multiplicado justo cuando menos puede. Tampoco tiene timeout (un
              request colgado bloquea el loop) y, si todo falla, devuelve{" "}
              <code>undefined</code> en silencio. La versión correcta reintenta
              solo errores transitorios y requests idempotentes, con backoff
              exponencial y jitter, respeta <code>Retry-After</code>, usa{" "}
              <code>AbortSignal.timeout</code> y lanza un error al agotar los
              intentos. Ante caídas largas, un circuit breaker corta los
              intentos por completo.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
