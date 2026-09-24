import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PercentilesSimulador } from "@/components/modulo/PercentilesSimulador";
import { entrevistaObservabilidad } from "@/lib/modules/ci-cd/observabilidad-entrevista";

const preguntasPorNivel = {
  1: entrevistaObservabilidad.filter((p) => p.nivel === 1),
  2: entrevistaObservabilidad.filter((p) => p.nivel === 2),
  3: entrevistaObservabilidad.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Observabilidad — Dev Study Lab",
  description:
    "Monitoreo vs observabilidad, golden signals, percentiles, SLI/SLO y error budgets, tipos de métricas y cardinalidad, OpenTelemetry, sampling y alertas por burn rate.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "El promedio de latencia es 150 ms. ¿Qué te dice sobre los usuarios más afectados?",
    opciones: [
      "Que todos tardan unos 150 ms",
      "Casi nada: la cola lenta queda escondida en el promedio",
      "Que el p99 es 300 ms",
    ],
    respuestaCorrecta: 1,
    explicacion: "Para ver la cola hacen falta percentiles como el p95 y el p99.",
  },
  {
    pregunta: "¿Cuál de estas NO es una de las golden signals?",
    opciones: ["Latencia", "Cobertura de tests", "Saturación"],
    respuestaCorrecta: 1,
    explicacion: "Son latencia, tráfico, errores y saturación.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un SLO de 99,9% sobre 1 millón de requests. ¿Cuál es el error budget?",
    opciones: ["100 requests", "1.000 requests", "10.000 requests"],
    respuestaCorrecta: 1,
    explicacion: "El 0,1% de un millón.",
  },
  {
    pregunta: "¿Qué label dispara la cardinalidad de una métrica?",
    opciones: ["status", "user_id", "método HTTP"],
    respuestaCorrecta: 1,
    explicacion: "Cada usuario crea una serie de tiempo nueva.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué header propaga el contexto de una traza entre servicios según W3C?",
    opciones: ["x-request-id", "traceparent", "authorization"],
    respuestaCorrecta: 1,
    explicacion: "Lleva el trace id, el span padre y el flag de muestreo.",
  },
  {
    pregunta: "¿Qué ventaja tiene tail sampling sobre head sampling?",
    opciones: [
      "Es más barato",
      "Decide al final, así puede guardar todas las trazas con error o lentas",
      "No necesita collector",
    ],
    respuestaCorrecta: 1,
    explicacion: "Head sampling descarta a ciegas, antes de saber cómo termina la traza.",
  },
];

export default function ObservabilidadPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Observabilidad"
      descripcion="Qué medir para saber si un sistema anda bien, y cómo llegar al porqué cuando anda mal."
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
            <strong className="text-foreground">Monitoreo</strong> responde si
            funciona; <strong className="text-foreground">observabilidad</strong>,
            por qué no y para quién, con métricas, logs y trazas correlacionados.
            Logs estructurados y qué no loguear están en el módulo de Backend.
          </p>
          <p>
            Qué medir: golden signals (latencia, tráfico, errores, saturación), y
            la latencia en percentiles, no en promedio.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PercentilesSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Dashboards con promedios.</strong>{" "}
            La cola lenta, donde están los problemas, no aparece.
          </li>
          <li>
            <strong className="text-foreground">Señales sin correlacionar.</strong>{" "}
            Sin trace id en los logs, no se puede ir de una traza lenta a lo que pasó.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un dashboard RED por endpoint de la API.</li>
          <li>Encontrar que la latencia subió solo para un cliente con muchos datos.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
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
            <strong className="text-foreground">SLI, SLO y error budget</strong>:
            medir lo que siente el usuario, fijar un objetivo menor a 100% y usar
            lo que sobra para decidir entre velocidad y estabilidad.
          </p>
          <p>
            <strong className="text-foreground">Métricas</strong>: counters,
            gauges e histogramas. Los percentiles no se promedian, y los labels
            tienen que tener pocos valores posibles.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Promediar el p99 de varias instancias.</strong>{" "}
            El resultado no es el p99 del servicio; hay que sumar histogramas.
          </li>
          <li>
            <strong className="text-foreground">Un SLO de 100%.</strong>{" "}
            Es inalcanzable y deja sin margen para cambiar nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un SLO de 99,5% para el checkout y congelar features si se agota el budget.</li>
          <li>Un histograma de latencia con la ruta como plantilla.</li>
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
            <strong className="text-foreground">OpenTelemetry</strong>: SDKs,
            protocolo y collector estándar; las trazas se propagan con el header{" "}
            <code>traceparent</code>, también a través de colas.
          </p>
          <p>
            <strong className="text-foreground">Costo y alertas</strong>: tail
            sampling para conservar lo interesante, y alertas por burn rate sobre
            síntomas del usuario, no por causas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Alertar por CPU al 90%.</strong>{" "}
            A veces no le importa a nadie, y el equipo aprende a ignorar las alertas.
          </li>
          <li>
            <strong className="text-foreground">No propagar el contexto en los mensajes de una cola.</strong>{" "}
            El consumidor arranca una traza nueva y se pierde el recorrido.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un collector que guarda el 100% de las trazas con error y el 5% del resto.</li>
          <li>Dos alertas de burn rate: una que despierta a alguien y otra que abre un ticket.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            El equipo recibe 40 alertas por semana (CPU alta, memoria alta, un
            pod reiniciado, disco al 80%) y casi todas se ignoran. La semana
            pasada, el checkout falló para el 3% de los usuarios durante dos
            horas y nadie se enteró hasta que llamó soporte. Rediseñá el
            monitoreo.
          </p>
          <RevelarSolucion>
            <p>
              El problema es alertar por causas y no por síntomas. 1) Definir
              SLIs por flujo crítico medidos en el balanceador: disponibilidad y
              latencia del checkout (requests sin error 5xx y en menos de 1 s).
              2) Un SLO, por ejemplo 99,5% en 28 días, que da un error budget
              explícito. 3) Alertas por burn rate sobre ese SLO: una rápida
              (burn rate de 6 o más en la última hora, confirmado en los últimos
              5 minutos para no disparar por picos, que despierta a alguien) y
              una lenta (burn rate de 1 o más sostenido durante 3 días, que abre
              un ticket). Un 3% de fallas sobre un SLO de 99,5% es un burn rate
              de 6 (3% dividido 0,5%), así que la alerta rápida se habría
              disparado en la primera hora, no a las dos horas por una llamada
              de soporte. 4) Las
              alertas de CPU, memoria y disco pasan a dashboards para
              diagnosticar, salvo las que predicen una caída segura (disco a
              punto de llenarse), que se quedan como alerta. 5) Cada alerta con
              un runbook y un responsable, y revisar cada mes cuáles no
              generaron ninguna acción, para borrarlas.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
