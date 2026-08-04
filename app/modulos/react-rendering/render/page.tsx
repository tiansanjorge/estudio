import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FasesPipeline } from "@/components/modulo/FasesPipeline";
import { RenderHuellaDemo } from "@/components/modulo/RenderHuellaDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { pasosFases } from "@/lib/modules/react-rendering/fases";

export const metadata: Metadata = {
  title: "Render — Frontend Study Lab",
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

export default function RenderPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Render"
      descripcion="Cuando React 'renderiza' un componente, no está tocando el DOM. Está llamando a tu función para preguntarle qué debería mostrarse."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
