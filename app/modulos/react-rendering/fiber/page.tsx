import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FiberSimulador } from "@/components/modulo/FiberSimulador";
import { TrabajoEnChunksDemo } from "@/components/modulo/TrabajoEnChunksDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosFiber } from "@/lib/modules/react-rendering/fiber-escenarios";

export const metadata: Metadata = {
  title: "Fiber — Frontend Study Lab",
  description:
    "Fiber es el motor interno que le permite a React pausar, retomar y priorizar trabajo de render, en vez de renderizar todo de una sola vez sin poder parar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema del reconciler viejo (React 15) vino a resolver Fiber?",
    opciones: [
      "Que los componentes de clase eran muy lentos de escribir",
      "Que renderizar un árbol grande era una sola operación recursiva ininterrumpible, capaz de trabar el hilo principal",
      "Que JSX no soportaba fragmentos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El reconciler recursivo no podía pausarse a mitad de camino: una vez que empezaba a renderizar un árbol grande, el navegador no podía atender nada más (input, animaciones) hasta que terminara.",
  },
  {
    pregunta: "¿Qué es, en esencia, una 'unidad de trabajo' en Fiber?",
    opciones: [
      "Un archivo de código fuente",
      "Un pedazo chico del trabajo de render (aproximadamente un componente), después del cual React puede ceder el control",
      "Una petición de red",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Fiber divide el render en unidades pequeñas. Entre unidad y unidad hay un punto donde React puede pausar, dejar que el navegador atienda algo más urgente, y retomar después exactamente donde había quedado.",
  },
  {
    pregunta: "¿Fiber cambia QUÉ calcula React (el resultado del render) o CÓMO lo ejecuta?",
    opciones: [
      "Cambia el resultado: con Fiber, React renderiza cosas distintas",
      "Cambia la ejecución: el resultado final es el mismo, pero el trabajo se puede pausar, priorizar y retomar",
      "Reemplaza JSX por otro lenguaje",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Fiber es un cambio de arquitectura interna, no de comportamiento visible del árbol resultante. Habilita CÓMO se programa y ejecuta ese trabajo — la base de Concurrent Rendering, que viene en el próximo módulo.",
  },
];

export default function FiberPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Fiber"
      descripcion="Fiber no cambia qué renderiza React. Cambia cómo lo hace: en vez de una operación recursiva de una sola pieza, el trabajo se parte en unidades chicas que se pueden pausar, priorizar y retomar."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Antes de React 16, el reconciler funcionaba con recursión
            directa de JavaScript: para renderizar un árbol, React
            llamaba a una función, que llamaba a otra por cada hijo, que
            llamaba a otra... Una vez que ese proceso arrancaba, no había
            forma de pausarlo a mitad de camino — el hilo principal
            quedaba ocupado hasta que la recursión completa terminara.
            Para árboles grandes, esto podía trabar la página perceptiblemente.
          </p>
          <p>
            <strong className="text-foreground">Fiber</strong> es la
            reescritura de ese motor (desde React 16) como una estructura
            de datos explícita: cada componente tiene su propio
            &ldquo;fiber&rdquo;, con punteros a su padre, su primer hijo
            y su hermano siguiente — un árbol recorrible sin depender de
            la pila de llamadas de JavaScript. Eso permite procesar el
            árbol en{" "}
            <strong className="text-foreground">
              unidades de trabajo chicas
            </strong>
            , y entre unidad y unidad, preguntar: &ldquo;¿hay algo más
            urgente que debería atender antes de seguir?&rdquo;.
          </p>
          <p>
            Fiber en sí mismo no cambia qué termina en pantalla — el
            árbol resultante es el mismo. Lo que cambia es la capacidad
            de <strong className="text-foreground">pausar, priorizar y retomar</strong>{" "}
            ese trabajo, que es exactamente lo que hace posible el
            renderizado concurrente (próximo módulo) y funciones como
            Suspense.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <FiberSimulador escenarios={escenariosFiber} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <TrabajoEnChunksDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Pensar que Fiber hace que el render sea más rápido.
            </strong>{" "}
            No reduce la cantidad de trabajo — lo reorganiza para que se
            pueda interrumpir. La misma cantidad de cálculo puede tomar
            el mismo tiempo total, pero sin trabar la interfaz en el
            camino.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir Fiber con Virtual DOM.
            </strong>{" "}
            Son cosas relacionadas pero distintas: Virtual DOM es la
            idea de representar la UI como objetos JS antes de tocar el
            DOM real (lo vemos en el próximo módulo). Fiber es la
            estructura interna que organiza y programa ese trabajo.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que cualquier trabajo pesado se reparta solo.
            </strong>{" "}
            Fiber habilita la posibilidad de pausar, pero funciones
            sincrónicas que bloquean el hilo (como un loop pesado dentro
            de un handler) siguen bloqueando igual — Fiber no puede
            interrumpir código JS que vos escribiste corriendo de forma
            síncrona.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Entender por qué actualizar una lista gigante no
            necesariamente traba el input de búsqueda que la filtra — si
            se usa correctamente el renderizado concurrente (próximo
            módulo).
          </li>
          <li>
            Reconocer que un &ldquo;freeze&rdquo; real de la UI casi
            siempre viene de código síncrono bloqueante tuyo, no de una
            limitación de React — Fiber no puede pausar tu propio loop.
          </li>
          <li>
            Debuggear con el React DevTools Profiler viendo cómo se
            reparte el trabajo de render entre distintos frames.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Esta función procesa 10.000 elementos de forma síncrona
            dentro de un evento de click, y la página se congela un
            segundo entero. ¿Por qué Fiber no evita esto, y qué
            enfoque distinto arreglaría el problema?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function manejarClick() {
  const resultados = [];
  for (let i = 0; i < 10000; i++) {
    resultados.push(calculoPesado(i));
  }
  setResultados(resultados);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Fiber puede pausar y retomar el trabajo de{" "}
              <strong className="text-foreground">React</strong> (render
              de componentes), pero esto es un <code>for</code> síncrono
              de JavaScript corriendo dentro de un event handler — código
              tuyo, no trabajo de render que React esté administrando.
              Ninguna parte de este loop le da a React (ni al navegador)
              la oportunidad de intervenir.
            </p>
            <p className="mt-2">
              El arreglo real es partir el trabajo en pedazos y ceder el
              control explícitamente entre cada uno — por ejemplo con
              varios <code>setTimeout</code> (como en el Playground de
              este módulo), o con APIs pensadas para esto en el navegador
              como <code>requestIdleCallback</code>. Fiber no puede
              pausar código bloqueante que vos escribiste; solo puede
              pausar el trabajo de render que React mismo está haciendo.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
