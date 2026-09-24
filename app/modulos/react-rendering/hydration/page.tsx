import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HydrationSimulador } from "@/components/modulo/HydrationSimulador";
import { HydrationMismatchDemo } from "@/components/modulo/HydrationMismatchDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosHydration } from "@/lib/modules/react-rendering/hydration-escenarios";
import { entrevistaHydration } from "@/lib/modules/react-rendering/hydration-entrevista";

const preguntasPorNivel = {
  1: entrevistaHydration.filter((p) => p.nivel === 1),
  2: entrevistaHydration.filter((p) => p.nivel === 2),
  3: entrevistaHydration.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Hydration — Dev Study Lab",
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

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué habilita el streaming SSR con Suspense boundaries respecto a la hydration?",
    opciones: [
      "Nada, la hydration siempre es un único paso para todo el árbol",
      "Selective hydration: cada sección se hidrata independientemente a medida que llega, y React puede priorizar la sección con la que el usuario intenta interactuar",
      "Elimina por completo la necesidad de hidratar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las secciones envueltas en Suspense que tardan más se completan y transmiten después, sin bloquear al resto de la página, y se hidratan cuando llegan.",
  },
  {
    pregunta:
      "Si el usuario hace click en una sección que todavía no terminó de hidratarse, ¿el evento se pierde?",
    opciones: [
      "Sí, siempre se pierde y hay que volver a hacer click después",
      "No, generalmente se registra y usa como señal para elevar la prioridad de hidratación de esa sección específica",
      "Solo funciona si la sección tiene su propio error boundary",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Gracias a la delegación de eventos en la raíz, React puede 'replayear' el evento contra el árbol ya hidratado una vez que esa sección termina de conectarse.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Todos los hydration mismatches tienen el mismo costo de recuperación?",
    opciones: [
      "Sí, React siempre descarta y rehace el árbol completo",
      "No: un mismatch de texto se puede parchear puntualmente; un mismatch estructural (tipo de elemento distinto) obliga a descartar y re-renderizar toda esa porción en el cliente",
      "No, pero solo importa la diferencia en desarrollo, no en producción",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un mismatch estructural es notoriamente más costoso y visible (puede causar un salto de layout perceptible), a diferencia de uno de texto que React puede corregir sin descartar el resto del árbol.",
  },
  {
    pregunta:
      "¿Cómo evitarías el flash de tema incorrecto sin depender de un script anti-flash ni de useEffect?",
    opciones: [
      "No es posible evitarlo de ninguna forma",
      "Guardando la preferencia también en una cookie, que viaja en cada request y le permite al servidor renderizar el tema correcto desde el primer byte",
      "Usando siempre localStorage y aumentando el timeout del useEffect",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "A diferencia de localStorage, una cookie viaja automáticamente al servidor en cada request, eliminando la discrepancia entre lo que el servidor manda y lo que el cliente muestra.",
  },
];

export default function HydrationPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Hydration"
      descripcion="El servidor te ahorra el primer render armando el HTML de antemano. Hydration es el momento en que React reutiliza ese HTML en vez de tirarlo — y donde aparecen los bugs más confusos de SSR."
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
        <div className="flex flex-col gap-4 prosa">
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
        <ul className="flex flex-col gap-3 prosa">
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
        <ul className="flex flex-col gap-3 prosa">
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

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
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
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Con Suspense boundaries en el árbol del servidor, React puede
            transmitir (stream) el HTML de a partes, sin esperar a que
            todo el árbol termine de renderizarse antes de mandar algo al
            navegador. Del lado de la hidratación, esto habilita{" "}
            <strong className="text-foreground">
              selective hydration
            </strong>
            : cada sección se hidrata independientemente a medida que
            llega, y React puede priorizar la sección con la que el
            usuario intenta interactuar por encima del orden fijo de
            arriba hacia abajo.
          </p>
          <p>
            Si el usuario hace click en una sección que todavía no
            terminó de hidratarse, ese evento generalmente no se pierde:
            gracias a la delegación de eventos en la raíz, React lo
            registra, eleva la prioridad de hidratación de esa sección, y
            lo &ldquo;replayea&rdquo; una vez que termina de conectarse.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que la hydration es siempre un único paso para toda
              la página.
            </strong>{" "}
            Con streaming SSR y Suspense, es un proceso incremental y
            priorizado.
          </li>
          <li>
            <strong className="text-foreground">
              No definir límites de Suspense pensando en qué secciones
              son más lentas.
            </strong>{" "}
            Sin esos límites, no hay nada que streamear ni priorizar por
            separado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver en Suspense una sección que depende de una consulta
            lenta a base de datos, para que no bloquee el streaming del
            resto de la página.
          </li>
          <li>
            Diseñar límites de Suspense alrededor de secciones
            interactivas tempranas (un formulario, un botón principal)
            para que se prioricen si el usuario interactúa antes de
            tiempo.
          </li>
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
        <div className="flex flex-col gap-4 prosa">
          <p>
            No todos los hydration mismatches tienen la misma severidad.
            Un mismatch de{" "}
            <strong className="text-foreground">texto</strong> (un número
            o fecha que difiere) es el caso más benigno: React puede
            parchear puntualmente ese nodo y seguir. Un mismatch de{" "}
            <strong className="text-foreground">estructura</strong> (tipo
            de elemento distinto, cantidad de hijos distinta) es más
            grave: React tiene que descartar esa porción del árbol y
            re-renderizarla enteramente en el cliente, perdiendo el
            beneficio de SSR ahí.
          </p>
          <p>
            En vez de un valor neutro + useEffect, se puede evitar el
            mismatch de raíz guardando la preferencia en una{" "}
            <strong className="text-foreground">cookie</strong> en vez de
            solo en localStorage: una cookie viaja automáticamente en
            cada request al servidor, que puede leerla al renderizar y
            generar el HTML correcto desde el primer byte — eliminando
            por completo la necesidad del script anti-flash o del parche
            de useEffect.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Tratar todo hydration mismatch como igual de grave.
            </strong>{" "}
            Uno de texto es mucho más barato de recuperar que uno
            estructural.
          </li>
          <li>
            <strong className="text-foreground">
              Depender solo de localStorage para algo que el servidor
              podría conocer de antemano.
            </strong>{" "}
            Una cookie es la herramienta correcta cuando el servidor
            necesita esa preferencia para renderizar bien desde el inicio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Migrar la preferencia de tema de este mismo proyecto de
            localStorage a una cookie, para que el servidor renderice el
            tema correcto sin script anti-flash.
          </li>
          <li>
            Priorizar el diagnóstico de mismatches estructurales sobre los
            de texto al revisar warnings de hidratación en un proyecto
            grande, por su mayor costo de recuperación.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
