import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { EventLoopSimulador } from "@/components/modulo/EventLoopSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosEventLoop } from "@/lib/modules/event-loop/escenarios";

export const metadata: Metadata = {
  title: "Event Loop — Frontend Study Lab",
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

export default function EventLoopPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Event Loop"
      descripcion="JavaScript es de un solo hilo. El Event Loop es el mecanismo que le permite manejar operaciones asincrónicas sin bloquearse."
    >
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
    </ModuloLayout>
  );
}
