import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FiberSimulador } from "@/components/modulo/FiberSimulador";
import { TrabajoEnChunksDemo } from "@/components/modulo/TrabajoEnChunksDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosFiber } from "@/lib/modules/react-rendering/fiber-escenarios";
import { entrevistaFiber } from "@/lib/modules/react-rendering/fiber-entrevista";

const preguntasPorNivel = {
  1: entrevistaFiber.filter((p) => p.nivel === 1),
  2: entrevistaFiber.filter((p) => p.nivel === 2),
  3: entrevistaFiber.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Fiber — Dev Study Lab",
  description:
    "Fiber es el motor interno que le permite a React pausar, retomar y priorizar trabajo de render, en vez de renderizar todo de una sola vez sin poder parar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema del reconciler viejo (React 15) vino a resolver Fiber?",
    opciones: [
      "Que no podía comparar listas sin keys y volvía a crear todos los elementos en cada render",
      "Que escribía en el DOM en cada setState por separado, sin agrupar los cambios del evento",
      "Que renderizar un árbol grande era una recursión que no se podía interrumpir",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El reconciler recursivo no podía pausarse a mitad de camino: una vez que empezaba a renderizar un árbol grande, el navegador no podía atender nada más (input, animaciones) hasta que terminara.",
  },
  {
    pregunta: "¿Qué es, en esencia, una 'unidad de trabajo' en Fiber?",
    opciones: [
      "Un pedazo chico del render (más o menos un componente), tras el cual React puede ceder",
      "Un render completo del árbol, que React puede repetir desde cero si algo falla a mitad",
      "Una mutación del DOM, que React agrupa con otras parecidas antes de aplicarlas juntas",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Fiber divide el render en unidades pequeñas. Entre unidad y unidad hay un punto donde React puede pausar, dejar que el navegador atienda algo más urgente, y retomar después exactamente donde había quedado.",
  },
  {
    pregunta: "¿Fiber cambia QUÉ calcula React (el resultado del render) o CÓMO lo ejecuta?",
    opciones: [
      "Cambia el resultado: el diffing es más preciso y termina generando menos mutaciones",
      "Cambia la ejecución: mismo resultado, pero el trabajo se puede pausar y priorizar",
      "Cambia las dos cosas: calcula menos nodos y además lo hace en un hilo aparte",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Fiber es un cambio de arquitectura interna, no de comportamiento visible del árbol resultante. Habilita CÓMO se programa y ejecuta ese trabajo — la base de Concurrent Rendering, que viene en el próximo módulo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué son los árboles 'current' y 'work-in-progress' en Fiber?",
    opciones: [
      "Current es el árbol que renderizó el servidor; work-in-progress, el que se hidrata en el cliente",
      "Current es el Virtual DOM ya comparado; work-in-progress, el DOM real que se está mutando",
      "Current es lo que se ve; work-in-progress, un borrador descartable de la próxima versión",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es la técnica de 'double buffering': si el trabajo en progreso se descarta a mitad de camino, el árbol current nunca se vio afectado. Recién al completarse se intercambian, en Commit.",
  },
  {
    pregunta:
      "¿Cómo decide React qué actualización procesar primero cuando hay varias pendientes?",
    opciones: [
      "Con 'lanes': cada actualización tiene una prioridad según su origen",
      "Por orden de llegada: la primera que se disparó es la primera que se procesa",
      "Por profundidad: primero las de los componentes más cercanos a la raíz",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Una interacción directa del usuario tiene una lane de alta prioridad; una actualización en startTransition, una de baja prioridad. React siempre prioriza las lanes más altas.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué React implementó su propio Scheduler en vez de usar requestIdleCallback del navegador?",
    opciones: [
      "Porque requestIdleCallback no existe en Node y React necesita el mismo código en SSR",
      "Porque su timing es inconsistente y no le da a React control fino sobre cuándo ceder",
      "Porque requestIdleCallback solo corre una vez por frame y React necesita varias",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React construyó su propio paquete Scheduler sobre APIs más predecibles (como MessageChannel), para tener control total sobre cómo se reparte el trabajo entre frames.",
  },
  {
    pregunta:
      "Dentro del procesamiento de un fiber, ¿qué diferencia hay entre 'begin work' y 'complete work'?",
    opciones: [
      "Begin work calcula el render y complete work aplica los cambios al DOM",
      "Begin work corre en render y complete work en commit, ya en el DOM real",
      "Begin work baja creando fibers hijos; complete work sube completando cada uno",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es el mismo patrón de recorrido en profundidad de una recursión normal, pero con punteros explícitos en vez de la pila de llamadas de JavaScript, para poder pausarlo entre pasos.",
  },
];

export default function FiberPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Fiber"
      descripcion="Fiber no cambia qué renderiza React. Cambia cómo lo hace: en vez de una operación recursiva de una sola pieza, el trabajo se parte en unidades chicas que se pueden pausar, priorizar y retomar."
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
        <ul className="flex flex-col gap-3 prosa">
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
        <ul className="flex flex-col gap-3 prosa">
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

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
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
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            React mantiene DOS árboles de fibers: el{" "}
            <strong className="text-foreground">current</strong> (lo que
            está en pantalla) y uno{" "}
            <strong className="text-foreground">work-in-progress</strong>{" "}
            (una copia donde va calculando la próxima actualización).
            Mientras trabaja en el WIP, el current sigue intacto — si ese
            trabajo se descarta, el usuario nunca vio nada a medio
            actualizar. Recién al completarse, React los intercambia en
            Commit. Es la misma técnica de &quot;double buffering&quot;
            usada en gráficos.
          </p>
          <p>
            Para decidir qué procesar primero entre varias actualizaciones
            pendientes, React usa un sistema de{" "}
            <strong className="text-foreground">lanes</strong>: cada
            actualización se etiqueta con una prioridad según su origen —
            una interacción directa tiene prioridad muy alta, una
            actualización en <code>startTransition</code> tiene prioridad
            baja. El bucle de trabajo siempre prioriza las lanes más
            altas, pudiendo pausar las de menor prioridad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que las actualizaciones se procesan en el orden en
              que se dispararon.
            </strong>{" "}
            React es priority-based, no FIFO: una transición programada
            antes puede procesarse después de un click de mayor prioridad.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que mantener dos árboles es un desperdicio evitable.
            </strong>{" "}
            Es lo que garantiza que un trabajo descartado nunca afecte lo
            que el usuario ve.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Entender por qué un click puede &quot;adelantarse&quot; a una
            transición pesada programada antes, gracias al sistema de
            lanes.
          </li>
          <li>
            Razonar sobre por qué React puede abandonar sin costo un
            trabajo en progreso: el árbol current nunca se vio afectado.
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
            React implementó su propio paquete{" "}
            <strong className="text-foreground">Scheduler</strong> en vez
            de usar <code>requestIdleCallback</code> del navegador: esa
            API tiene timing inconsistente entre navegadores y no da el
            control fino que React necesita sobre cuándo ceder el
            control exactamente. El Scheduler propio corre sobre APIs más
            predecibles (como <code>MessageChannel</code>).
          </p>
          <p>
            Al procesar un fiber, hay dos fases: <strong className="text-foreground">
            begin work</strong> (descendente: crea los fibers hijos
            bajando por el árbol) y <strong className="text-foreground">
            complete work</strong> (ascendente: completa cada fiber al
            subir, una vez que no tiene más hijos por procesar). Es el
            mismo recorrido en profundidad de una recursión normal, pero
            con punteros explícitos para poder pausarlo entre pasos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en requestIdleCallback para lógica propia esperando
              el mismo comportamiento que React.
            </strong>{" "}
            React evita esa API justamente por su inconsistencia entre
            navegadores.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que begin work y complete work son fases separadas en
              el tiempo para todo el árbol.
            </strong>{" "}
            Se intercalan por fiber, siguiendo el recorrido en
            profundidad, no como dos pasadas completas separadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el React DevTools Profiler para observar cómo el
            Scheduler reparte unidades de trabajo entre frames en una
            actualización grande.
          </li>
          <li>
            Explicar en una entrevista de nivel staff por qué React
            necesitó construir infraestructura propia en vez de apoyarse
            en APIs del navegador ya existentes.
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
