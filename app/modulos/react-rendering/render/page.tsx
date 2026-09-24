import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FasesPipeline } from "@/components/modulo/FasesPipeline";
import { RenderHuellaDemo } from "@/components/modulo/RenderHuellaDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { pasosFases } from "@/lib/modules/react-rendering/fases";
import { entrevistaRender } from "@/lib/modules/react-rendering/render-entrevista";

const preguntasPorNivel = {
  1: entrevistaRender.filter((p) => p.nivel === 1),
  2: entrevistaRender.filter((p) => p.nivel === 2),
  3: entrevistaRender.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Render — Dev Study Lab",
  description:
    "Renderizar no es lo mismo que actualizar el DOM. Es el momento en que React llama a tus componentes para averiguar qué debería mostrarse.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué produce la fase de Render?",
    opciones: [
      "Cambios directos aplicados al DOM del navegador",
      "Una descripción de la UI (elementos React) — todavía no se tocó el DOM real",
      "Un archivo HTML nuevo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Render es 'preguntarle' a los componentes qué deberían mostrar. El resultado es una estructura de datos, no una actualización del DOM — eso pasa después, en Commit.",
  },
  {
    pregunta: "¿Por qué la fase de Render tiene que ser pura, sin efectos secundarios?",
    opciones: [
      "Por una convención de estilo sin consecuencias reales",
      "Porque React puede llamar a esa función más de una vez, pausarla o descartarla, sobre todo con renderizado concurrente",
      "Porque JavaScript no permite side effects dentro de funciones",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si el cuerpo del componente muta variables externas o hace fetch directamente, esos efectos pueden dispararse de más (o de menos) cuando React reintenta, pausa o descarta un render.",
  },
  {
    pregunta: "Por default, cuando un componente padre re-renderiza, ¿qué pasa con sus hijos?",
    opciones: [
      "Solo re-renderizan si sus props cambiaron",
      "También re-renderizan, aunque sus props sigan siendo exactamente las mismas",
      "Nunca re-renderizan a menos que se les pida explícitamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin memoización explícita (como React.memo), un re-render del padre dispara el re-render de todos sus hijos, sin importar si sus props cambiaron.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuáles son los únicos disparadores reales de un render?",
    opciones: [
      "Cualquier línea de código ejecutada dentro del componente",
      "Montaje inicial, actualización de estado propio, re-render del padre, o cambio de un Context consumido",
      "Solo cuando cambian las props del componente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Mutar una ref o llamar a una función normal dentro del componente no dispara un render por sí solo, salvo que termine llamando a alguno de esos cuatro triggers.",
  },
  {
    pregunta:
      "¿Qué arquitectura interna de React permite que un render se pause o se descarte a mitad de camino?",
    opciones: [
      "El call stack normal de JavaScript",
      "React Fiber: una estructura de árbol enlazado propia que le permite a React ceder el control y retomar el trabajo donde quedó",
      "Web Workers, que corren el render en un hilo aparte",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El call stack de JS no se puede pausar desde afuera. Fiber le da a React su propia estructura de datos para procesar el árbol de a pedazos, base técnica del renderizado concurrente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué React Strict Mode llama a los componentes dos veces en desarrollo?",
    opciones: [
      "Es un bug conocido que todavía no se corrigió",
      "Es deliberado: expone tempranamente componentes impuros, que producirían resultados o efectos duplicados en producción bajo renderizado concurrente",
      "Solo ocurre en componentes de clase, nunca en función",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si el cuerpo del componente no es puro, llamarlo dos veces muestra el bug de inmediato en desarrollo. La solución es mover ese código a un lugar que garantice ejecutarse una sola vez, como useEffect.",
  },
  {
    pregunta:
      "¿Es válido llamar a setState directamente en el cuerpo de un componente, durante el render?",
    opciones: [
      "Nunca, siempre hay que usar useEffect para actualizar estado",
      "Sí, en el patrón documentado de estado derivado: React descarta el render actual y vuelve a ejecutar la función con el estado nuevo, sin pintar la versión intermedia",
      "Solo en componentes de clase con setState tradicional",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un patrón de nicho para resetear estado interno al detectar un cambio en una prop, comparándola contra un valor guardado en una ref, sin necesitar un useEffect adicional.",
  },
];

export default function RenderPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Render"
      descripcion="Cuando React 'renderiza' un componente, no está tocando el DOM. Está llamando a tu función para preguntarle qué debería mostrarse."
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
            &ldquo;Renderizar&rdquo; un componente significa una sola
            cosa muy concreta: React llama a la función del componente.
            Esa llamada devuelve JSX, que en realidad son objetos
            JavaScript describiendo qué debería verse — no HTML, no una
            actualización del DOM. Eso es todo lo que pasa en la fase de{" "}
            <strong className="text-foreground">Render</strong>.
          </p>
          <p>
            Por eso el cuerpo de un componente tiene que ser{" "}
            <strong className="text-foreground">puro</strong>: nada de
            mutar variables externas, hacer fetch, o tocar el DOM
            directamente ahí. React necesita poder llamar a esa función
            las veces que haga falta — incluso más de una vez para el
            mismo resultado final (por ejemplo, React Strict Mode en
            desarrollo llama a los componentes dos veces a propósito,
            para exponer justamente estos side effects mal ubicados).
          </p>
          <p>
            Un punto que sorprende seguido: por default, cuando un
            componente re-renderiza, <strong className="text-foreground">
              todos sus hijos re-renderizan también
            </strong>
            , sin importar si sus props cambiaron. Que un componente
            &ldquo;renderice&rdquo; no significa que el DOM vaya a
            cambiar — eso se decide después, comparando el resultado
            (Reconciliation) y recién ahí tocando el DOM (Commit).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <FasesPipeline pasos={pasosFases} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <RenderHuellaDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que &apos;render&apos; significa que el DOM cambió.
            </strong>{" "}
            El DOM solo se toca en Commit, y a veces ni siquiera cambia
            si Reconciliation determina que el resultado es idéntico.
          </li>
          <li>
            <strong className="text-foreground">
              Causar side effects en el cuerpo del componente.
            </strong>{" "}
            console.log está bien para debuggear, pero mutar una
            variable externa, hacer fetch, o programar un timer
            directamente ahí puede ejecutarse más veces (o menos) de lo
            esperado.
          </li>
          <li>
            <strong className="text-foreground">
              Sorprenderse de que un hijo re-renderiza sin que cambien sus props.
            </strong>{" "}
            Es el comportamiento por default. Si hace falta evitarlo, la
            herramienta es React.memo (lo vamos a ver más en profundidad
            en el módulo de Memoization).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el React DevTools Profiler para ver qué componentes
            renderizaron en cada interacción, y detectar renders
            innecesarios.
          </li>
          <li>
            Mover side effects (fetch, suscripciones, timers) a useEffect,
            que corre después del commit, no durante el render.
          </li>
          <li>
            Reconocer cuándo vale la pena memoizar un componente (props
            que rara vez cambian, render costoso) versus cuándo no hace
            falta la complejidad extra.
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
          <p>¿Por qué es un problema hacer esto directamente en el cuerpo del componente?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`let logs = [];

function Componente({ valor }) {
  logs.push(valor); // ⚠️

  return <p>{valor}</p>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              La fase de Render tiene que ser pura. React puede llamar a{" "}
              <code>Componente</code> más de una vez para el mismo
              resultado final visible — por ejemplo, React Strict Mode en
              desarrollo invoca los componentes dos veces a propósito, o
              un render concurrente puede empezar, pausarse, y
              descartarse.
            </p>
            <p className="mt-2">
              En cualquiera de esos casos, <code>logs</code> termina con
              valores duplicados o de renders que ni siquiera llegaron a
              mostrarse en pantalla. El fix es mover ese efecto a un{" "}
              <code>useEffect</code>, que corre una sola vez por
              actualización real, después del commit:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Componente({ valor }) {
  useEffect(() => {
    logs.push(valor);
  }, [valor]);

  return <p>{valor}</p>;
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
            Solo cuatro cosas disparan un render: el{" "}
            <strong className="text-foreground">montaje inicial</strong>,
            una <strong className="text-foreground">
            actualización de estado propio</strong>, un{" "}
            <strong className="text-foreground">
              re-render del componente padre
            </strong>{" "}
            (que por default re-renderiza también a los hijos, sin
            importar props), o un{" "}
            <strong className="text-foreground">
              cambio en un Context
            </strong>{" "}
            consumido. Mutar una ref o llamar a una función normal dentro
            del componente no dispara un render por sí solo.
          </p>
          <p>
            Lo que hace posible que un render se pause o se descarte a
            mitad de camino es{" "}
            <strong className="text-foreground">React Fiber</strong>: en
            vez de usar el call stack normal de JavaScript (que no se
            puede pausar desde afuera), React arma su propia estructura de
            árbol enlazado, procesando el trabajo de a unidades que puede
            interrumpir, ceder al navegador, y retomar exactamente donde
            quedó — la base técnica del renderizado concurrente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Buscar una causa &quot;mágica&quot; para un render inesperado.
            </strong>{" "}
            Casi siempre es alguno de los cuatro triggers — revisar si un
            padre está renderizando por otra razón.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir mutar una ref con actualizar estado.
            </strong>{" "}
            Mutar ref.current no dispara ningún render, a diferencia de
            un setState.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar una ref (en vez de estado) para guardar un valor que no
            necesita disparar re-render, como un contador interno de
            reintentos.
          </li>
          <li>
            Diagnosticar renders innecesarios identificando cuál de los
            cuatro triggers los está causando, con el Profiler de React
            DevTools.
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
            React Strict Mode llama a los componentes dos veces en
            desarrollo deliberadamente: si el cuerpo no es puro, eso
            produce resultados o efectos duplicados, exponiendo el
            problema temprano en vez de que aparezca de forma intermitente
            en producción bajo renderizado concurrente real.
          </p>
          <p>
            Es válido llamar a <code>setState</code> directamente en el
            cuerpo de un componente en un caso de nicho: el patrón de{" "}
            <strong className="text-foreground">estado derivado</strong>,
            comparando una prop contra un valor guardado y actualizando
            estado condicionalmente ahí mismo, antes de terminar de
            renderizar. React descarta ese render y vuelve a ejecutar la
            función con el estado nuevo, sin pintar la versión intermedia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Depender de que un componente se ejecute exactamente una vez
              en desarrollo.
            </strong>{" "}
            Strict Mode expone ese supuesto como un bug real, no un
            problema del modo en sí.
          </li>
          <li>
            <strong className="text-foreground">
              Usar el patrón de setState en render como reemplazo general
              de useEffect.
            </strong>{" "}
            Es un patrón de nicho para estado derivado puntual, no una
            forma general de manejar efectos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Resetear el estado interno de un componente cuando cambia un
            id recibido por props, sin useEffect, usando el patrón de
            estado derivado durante el render.
          </li>
          <li>
            Confiar en Strict Mode durante el desarrollo para detectar
            componentes impuros antes de que lleguen a producción.
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
