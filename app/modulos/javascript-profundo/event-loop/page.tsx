import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { EventLoopSimulador } from "@/components/modulo/EventLoopSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosEventLoop } from "@/lib/modules/event-loop/escenarios";
import { entrevistaEventLoop } from "@/lib/modules/event-loop/entrevista";

const preguntasPorNivel = {
  1: entrevistaEventLoop.filter((p) => p.nivel === 1),
  2: entrevistaEventLoop.filter((p) => p.nivel === 2),
  3: entrevistaEventLoop.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Event Loop — Dev Study Lab",
  description:
    "Entendé cómo JavaScript ejecuta código asincrónico siendo un lenguaje de un solo hilo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué se ejecuta primero cuando el call stack queda vacío: la cola de microtasks o la de macrotasks?",
    opciones: ["La cola de macrotasks", "La cola de microtasks", "Da igual el orden"],
    respuestaCorrecta: 1,
    explicacion:
      "El Event Loop siempre vacía por completo la cola de microtasks antes de tomar la siguiente macrotask.",
  },
  {
    pregunta: "¿Qué es una macrotask?",
    opciones: [
      "El callback de una Promise",
      "El callback de setTimeout, setInterval o un evento del DOM",
      "Una función síncrona dentro de main()",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "setTimeout, setInterval y los eventos del DOM se resuelven como macrotasks (task queue).",
  },
  {
    pregunta:
      "¿Por qué setTimeout(fn, 0) no se ejecuta inmediatamente después del código síncrono?",
    opciones: [
      "Porque el navegador lo bloquea",
      "Porque siempre tiene que esperar a que el call stack esté vacío y se agoten las microtasks pendientes",
      "Porque 0ms en realidad significa 1000ms",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Aunque el timer venza en 0ms, su callback recién entra al call stack cuando este está vacío y no quedan microtasks pendientes.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "En Node.js, ¿qué se ejecuta primero: process.nextTick o una microtask de Promise?",
    opciones: [
      "Da igual, comparten la misma cola",
      "process.nextTick tiene su propia cola y se vacía antes que las microtasks de Promise",
      "Las microtasks de Promise siempre van primero",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "process.nextTick es una cola aparte, con más prioridad que la de microtasks de Promise, y se vacía por completo antes que esta última en cada vuelta.",
  },
  {
    pregunta:
      "¿El navegador puede ejecutar un ciclo de render entre dos macrotasks?",
    opciones: [
      "No, el render solo ocurre al final de todo el script",
      "Sí, el navegador puede pintar entre macrotasks (después de vaciar microtasks)",
      "Solo si se usa requestAnimationFrame explícitamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Después de una macrotask y de vaciar las microtasks pendientes, el navegador puede decidir pintar un frame antes de tomar la siguiente macrotask.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Dentro de un callback de I/O en Node, ¿qué corre primero: setImmediate o setTimeout(fn, 0)?",
    opciones: [
      "setTimeout(fn, 0) siempre",
      "setImmediate siempre, porque el callback ya está en la fase poll y check es la siguiente",
      "Es indeterminado en todos los casos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Dentro de un callback de I/O (fase poll), setImmediate corre en la fase check inmediatamente después, mientras que el timer recién se evalúa en la próxima vuelta del loop.",
  },
  {
    pregunta:
      "¿Qué pasa si encadenás process.nextTick de forma recursiva e indefinida?",
    opciones: [
      "Node lo detecta y lo corta automáticamente",
      "El loop nunca avanza a la fase de timers, I/O ni cierra el proceso: 'nextTick starvation'",
      "No tiene ningún efecto porque nextTick es asincrónico",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Como la cola de nextTick se vacía por completo antes de que el loop avance, encadenarla recursivamente sin fin bloquea I/O, timers y el cierre del proceso.",
  },
];

export default function EventLoopPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Event Loop"
      descripcion="JavaScript es de un solo hilo. El Event Loop es el mecanismo que le permite manejar operaciones asincrónicas sin bloquearse."
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
            JavaScript ejecuta código en un único hilo: solo puede hacer una
            cosa a la vez. El <strong className="text-foreground">call stack</strong>{" "}
            guarda las funciones que se están ejecutando. Cuando una función
            asincrónica se invoca (como <code>setTimeout</code> o un{" "}
            <code>fetch</code>), no se ejecuta ahí mismo: se delega a las{" "}
            <strong className="text-foreground">Web APIs</strong> del navegador.
          </p>
          <p>
            Cuando esa operación termina, su callback no vuelve directo al
            call stack. Primero espera en una cola. Hay dos colas con
            distinta prioridad: la de{" "}
            <strong className="text-foreground">microtasks</strong> (promesas)
            y la de <strong className="text-foreground">macrotasks</strong>{" "}
            (timers, eventos). El{" "}
            <strong className="text-foreground">Event Loop</strong> revisa
            constantemente: si el call stack está vacío, vacía primero{" "}
            <em>toda</em> la cola de microtasks, y recién después toma una
            macrotask.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <EventLoopSimulador escenarios={[escenariosEventLoop[0]]} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Elegí un escenario distinto y recorré los pasos para ver cómo
          cambia el orden de ejecución.
        </p>
        <EventLoopSimulador escenarios={escenariosEventLoop} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Pensar que setTimeout(fn, 0) se ejecuta inmediatamente.
            </strong>{" "}
            Siempre espera a que termine el código síncrono y se vacíen las
            microtasks.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir Promises con macrotasks.
            </strong>{" "}
            Las promesas son microtasks: tienen prioridad sobre setTimeout,
            incluso si setTimeout se llamó antes.
          </li>
          <li>
            <strong className="text-foreground">
              Bloquear el call stack con código síncrono pesado.
            </strong>{" "}
            Mientras el call stack no esté vacío, el Event Loop no puede
            procesar ninguna cola, aunque tengan callbacks listos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Entender por qué un <code>fetch</code> nunca bloquea la interfaz,
            aunque tarde segundos en responder.
          </li>
          <li>
            Debuggear por qué un <code>console.log</code> aparece en un orden
            distinto al que esperabas al mezclar promesas y timers.
          </li>
          <li>
            Decidir si una tarea pesada de UI conviene partirla con{" "}
            <code>setTimeout</code> para no trabar el render.
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
          <p>Antes de correrlo, escribí en qué orden creés que se imprime esto:</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');`}
          </pre>
          <RevelarSolucion>
            <p>
              Orden real: <strong className="text-foreground">1, 5, 3, 4, 2</strong>.
            </p>
            <p className="mt-2">
              El código síncrono corre primero (1 y 5). Después se vacía toda
              la cola de microtasks: como el segundo <code>.then()</code>{" "}
              se encola recién cuando corre el primero, igual se ejecutan
              ambos (3 y 4) antes de pasar a la macrotask del setTimeout (2).
            </p>
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
            El navegador y Node.js implementan el Event Loop distinto. En el
            navegador, el loop alterna entre tomar una macrotask y, si
            corresponde, correr un ciclo de render (estilos, layout, paint) —
            siempre después de vaciar las microtasks pendientes. Node no
            renderiza: su loop (libuv) tiene fases explícitas —{" "}
            <strong className="text-foreground">timers, pending callbacks,
            poll, check, close callbacks</strong> — y entre cada fase también
            se vacían las colas de <code>process.nextTick</code> y microtasks.
          </p>
          <p>
            <code>process.nextTick</code> es exclusivo de Node y tiene más
            prioridad que las microtasks de Promise: su cola se vacía primero,
            en cada vuelta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Asumir que el Event Loop del navegador y el de Node son iguales.
            </strong>{" "}
            Node no tiene ciclo de render y agrega fases (poll, check) y una
            cola extra (nextTick) que el navegador no tiene.
          </li>
          <li>
            <strong className="text-foreground">
              Encadenar microtasks sin límite (microtask starvation).
            </strong>{" "}
            Si una Promise sigue encolando otra indefinidamente, el loop
            nunca llega a la siguiente macrotask ni al render.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Elegir <code>requestAnimationFrame</code> en vez de{" "}
            <code>setTimeout</code> para animaciones, porque se sincroniza
            con el ciclo de render del navegador.
          </li>
          <li>
            Romper una cadena larga de <code>.then()</code> con un{" "}
            <code>setTimeout(fn, 0)</code> para dejar respirar al render o a
            otros timers.
          </li>
          <li>
            Debuggear código isomórfico (Next.js) donde el mismo efecto
            asincrónico se comporta distinto en el servidor (Node) que en el
            cliente (navegador).
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Las fases de libuv corren en este orden fijo:{" "}
            <strong className="text-foreground">timers</strong> (callbacks de
            setTimeout/setInterval vencidos),{" "}
            <strong className="text-foreground">pending callbacks</strong>{" "}
            (I/O diferido de la vuelta anterior),{" "}
            <strong className="text-foreground">idle/prepare</strong> (uso
            interno), <strong className="text-foreground">poll</strong>{" "}
            (donde el loop puede bloquearse esperando I/O y ejecuta esos
            callbacks), <strong className="text-foreground">check</strong>{" "}
            (callbacks de <code>setImmediate</code>) y{" "}
            <strong className="text-foreground">close callbacks</strong>.
          </p>
          <p>
            Dentro de un callback de I/O (fase poll), <code>setImmediate</code>{" "}
            siempre corre antes que un <code>setTimeout(fn, 0)</code>, porque
            la fase check es la inmediata siguiente. Fuera de un callback de
            I/O, el orden entre ambos no está garantizado y depende de la
            performance del proceso.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Asumir que setTimeout corre puntual en una pestaña en
              background.
            </strong>{" "}
            Los navegadores throttlean los timers de pestañas inactivas
            (hasta 1s o más), algo que no pasa en Node.
          </li>
          <li>
            <strong className="text-foreground">
              Encadenar process.nextTick de forma recursiva sin fin.
            </strong>{" "}
            Como esa cola se vacía por completo antes de avanzar, bloquea I/O,
            timers y hasta el cierre del proceso (&quot;nextTick starvation&quot;).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Medir event loop lag en producción con{" "}
            <code>perf_hooks.monitorEventLoopDelay</code> o{" "}
            <code>clinic.js</code>, para detectar handlers síncronos que
            acaparan el call stack.
          </li>
          <li>
            Usar <code>MessageChannel</code> como alternativa a{" "}
            <code>setTimeout</code> cuando se necesita comportamiento de
            macrotask sin el throttling de timers en pestañas inactivas.
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
