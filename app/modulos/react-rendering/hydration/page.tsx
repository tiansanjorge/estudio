import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HydrationSimulador } from "@/components/modulo/HydrationSimulador";
import { HydrationMismatchDemo } from "@/components/modulo/HydrationMismatchDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosHydration } from "@/lib/modules/react-rendering/hydration-escenarios";

export const metadata: Metadata = {
  title: "Hydration — Frontend Study Lab",
  description:
    "El servidor manda HTML ya armado. Hydration es el momento en que React lo reutiliza y lo conecta con JavaScript, en vez de volver a construirlo desde cero.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace React durante la hydration?",
    opciones: [
      "Descarta el HTML del servidor y arma el DOM de nuevo desde cero",
      "Reutiliza el HTML que ya está en la página y le conecta los event listeners y el estado de React",
      "Descarga imágenes adicionales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Hydration reutiliza el DOM existente (renderizado por el servidor) en vez de recrearlo — solo lo 'conecta' con React para que se vuelva interactivo.",
  },
  {
    pregunta: "¿Qué es un hydration mismatch?",
    opciones: [
      "Un error de sintaxis en el JSX",
      "Cuando el HTML que calculó el servidor no coincide con lo que el cliente calcula al hidratar el mismo componente",
      "Cuando el CSS no carga a tiempo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si el servidor y el cliente producen resultados distintos para el mismo componente (por ejemplo, por usar Date.now(), window, o datos que dependen del entorno), React detecta la discrepancia al hidratar.",
  },
  {
    pregunta: "¿Cuál es el patrón seguro para mostrar algo que solo se puede calcular en el cliente (como localStorage)?",
    opciones: [
      "Leerlo directamente en el cuerpo del componente",
      "useState con un valor inicial neutro (igual en servidor y cliente) + useEffect que lo actualiza después del mount",
      "Usar suppressHydrationWarning en todos los casos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Arrancar con un valor neutro asegura que el primer render del cliente coincida con el del servidor (sin mismatch), y recién en useEffect — que solo corre en el cliente, después de hidratar — se actualiza con el valor real.",
  },
];

export default function HydrationPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Hydration"
      descripcion="El servidor te ahorra el primer render armando el HTML de antemano. Hydration es el momento en que React reutiliza ese HTML en vez de tirarlo — y donde aparecen los bugs más confusos de SSR."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Con Server-Side Rendering, el servidor ejecuta los
            componentes y genera HTML completo antes de mandarlo al
            navegador. El usuario ve la página casi de inmediato — pero
            ese HTML está &ldquo;muerto&rdquo;: no tiene event
            listeners, no tiene estado de React, los botones todavía no
            responden.
          </p>
          <p>
            <strong className="text-foreground">Hydration</strong> es el
            momento en que React, ya corriendo en el navegador, recorre
            ese HTML existente y lo &ldquo;conecta&rdquo;: en vez de
            volver a crear cada nodo del DOM desde cero, reutiliza los
            que ya están, y solo les agrega los event listeners y el
            árbol de Fiber correspondiente. Por eso no hay un parpadeo
            visible entre el HTML del servidor y la versión interactiva.
          </p>
          <p>
            Para que esto funcione, React necesita que el HTML del
            servidor coincida con lo que el mismo componente calcularía
            en el cliente. Si no coincide —{" "}
            <strong className="text-foreground">hydration mismatch</strong>{" "}
            — React lo detecta, avisa por consola, y en el peor caso
            tiene que descartar esa parte del HTML del servidor y
            volver a renderizarla desde cero en el cliente, perdiendo
            ahí el beneficio de SSR.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <HydrationSimulador escenarios={escenariosHydration} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <HydrationMismatchDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Usar valores que difieren entre servidor y cliente sin protegerlos.
            </strong>{" "}
            Date.now(), Math.random(), formateo de fechas dependiente del
            huso horario, o cualquier dato que cambie entre el momento
            del render del servidor y el de la hidratación.
          </li>
          <li>
            <strong className="text-foreground">
              Acceder a APIs del navegador (window, localStorage) directo en el cuerpo del componente.
            </strong>{" "}
            Durante SSR esas APIs no existen — no es solo un mismatch, es
            un error que rompe el render del servidor directamente.
          </li>
          <li>
            <strong className="text-foreground">
              Usar suppressHydrationWarning como parche automático.
            </strong>{" "}
            Sirve para mismatches intencionales y entendidos (como
            nuestro toggle de tema). Usarlo para silenciar cualquier
            warning sin investigar la causa puede estar tapando un bug
            real.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Mostrar contenido que depende de preferencias guardadas en
            localStorage (como el tema de este mismo proyecto): valor
            inicial neutro + useEffect que lo actualiza tras el mount.
          </li>
          <li>
            Mostrar timestamps relativos (&ldquo;hace 2 minutos&rdquo;):
            mismo patrón — calcular la diferencia en el cliente, después
            de hidratar, no en el render inicial.
          </li>
          <li>
            Usar <code>suppressHydrationWarning</code> puntualmente en un
            elemento cuyo atributo se sabe que va a diferir a propósito
            (como la clase del <code>&lt;html&gt;</code> que setea
            nuestro script anti-flash).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este componente muestra un saludo distinto según la hora del
            día, calculado directo en el render. Tira un hydration
            mismatch en producción. ¿Por qué, y cómo lo arreglarías con
            el mismo patrón que usamos en este proyecto?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Saludo() {
  const hora = new Date().getHours();
  const texto = hora < 12 ? 'Buen día' : 'Buenas tardes';

  return <h1>{texto}</h1>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El servidor calcula <code>new Date()</code> en el momento
              en que arma el HTML; el cliente la vuelve a calcular al
              hidratar, unos segundos (o minutos, con caché) después. Si
              esa diferencia de tiempo cruza el umbral de las 12,
              &ldquo;Buen día&rdquo; y &ldquo;Buenas tardes&rdquo; van a
              chocar — hydration mismatch.
            </p>
            <p className="mt-2">
              El fix es el mismo patrón que usamos para el toggle de
              tema: arrancar con un valor neutro (igual en servidor y
              cliente) y calcular el saludo real recién en un useEffect:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Saludo() {
  const [texto, setTexto] = useState('Hola');

  useEffect(() => {
    const hora = new Date().getHours();
    setTexto(hora < 12 ? 'Buen día' : 'Buenas tardes');
  }, []);

  return <h1>{texto}</h1>;
}`}
            </pre>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
