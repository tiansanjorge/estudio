import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FetchLifecycleSimulador } from "@/components/modulo/FetchLifecycleSimulador";
import { BusquedaConCancelacion } from "@/components/modulo/BusquedaConCancelacion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosFetch } from "@/lib/modules/http/fetch-lifecycle";

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

export default function FetchYRequestsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Fetch/XHR y manejo de requests"
      descripcion="fetch() resuelve su Promise más veces de lo que la mayoría espera — y cancelar requests obsoletas es la diferencia entre una UI correcta y una con bugs intermitentes."
    >
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
    </ModuloLayout>
  );
}
