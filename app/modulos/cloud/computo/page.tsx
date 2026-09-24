import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ComputoSimulador } from "@/components/modulo/ComputoSimulador";
import { entrevistaComputo } from "@/lib/modules/cloud/computo-entrevista";

const preguntasPorNivel = {
  1: entrevistaComputo.filter((p) => p.nivel === 1),
  2: entrevistaComputo.filter((p) => p.nivel === 2),
  3: entrevistaComputo.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Cómputo: VMs vs contenedores vs serverless — Dev Study Lab",
  description:
    "Máquinas virtuales, contenedores y serverless: cómo elegir, cold starts, límites de serverless, cuándo Kubernetes, y cómo escala cada modelo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué modelo escala a cero cuando no hay tráfico, por default?",
    opciones: ["VMs con autoscaling", "Serverless de funciones", "Un cluster de Kubernetes"],
    respuestaCorrecta: 1,
    explicacion: "Sin invocaciones no hay instancias, y no se paga por ellas.",
  },
  {
    pregunta: "Un worker que consume una cola sin parar las 24 horas, ¿dónde encaja mejor?",
    opciones: ["Funciones serverless", "Contenedores", "Un CDN"],
    respuestaCorrecta: 1,
    explicacion: "Es un proceso de larga vida con carga constante: justo lo que serverless hace peor.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué elimina los cold starts a cambio de pagar capacidad ociosa?",
    opciones: ["Achicar el bundle", "Provisioned concurrency o un mínimo de instancias", "Usar más memoria"],
    respuestaCorrecta: 1,
    explicacion: "Es volver en parte al modelo de instancias siempre prendidas.",
  },
  {
    pregunta: "Cien funciones concurrentes contra un Postgres sin pooler. ¿Qué pasa?",
    opciones: [
      "Nada, Postgres las encola",
      "Se agotan las conexiones de la base",
      "Las funciones comparten una conexión",
    ],
    respuestaCorrecta: 1,
    explicacion: "Cada instancia abre la suya; hace falta un pooler o un driver sobre HTTP.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué señal suele reflejar mejor la carga de una API que espera IO?",
    opciones: ["Uso de CPU", "Requests concurrentes por instancia", "Uso de disco"],
    respuestaCorrecta: 1,
    explicacion: "Una app que espera a la base puede saturarse con la CPU baja.",
  },
  {
    pregunta: "¿Cuándo tiene sentido Kubernetes?",
    opciones: [
      "Siempre, es el estándar",
      "Con muchos servicios y equipos, y gente para operar la plataforma",
      "Para una API con tres endpoints",
    ],
    respuestaCorrecta: 1,
    explicacion: "Su costo operativo solo se justifica a cierta escala.",
  },
];

export default function ComputoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="Cómputo: VMs vs contenedores vs serverless"
      descripcion="Dónde corre tu código, cuánto tenés que administrar, y cómo responde cada opción cuando llega un pico."
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
            <strong className="text-foreground">VMs</strong>: control total,
            escalan en minutos. <strong className="text-foreground">Contenedores</strong>:
            la misma imagen en todos lados, escalan en segundos.{" "}
            <strong className="text-foreground">Serverless</strong>: sin nada que
            administrar, escala por request y baja a cero.
          </p>
          <p>
            El default: lo más gestionado que cumpla con la carga. El costo en
            detalle está en el módulo de costo y escalabilidad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ComputoSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Kubernetes para el primer producto.</strong>{" "}
            El equipo termina operando la plataforma en vez de construir el producto.
          </li>
          <li>
            <strong className="text-foreground">Procesos largos en funciones.</strong>{" "}
            Chocan con el límite de duración y se cortan a mitad de camino.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una API con tráfico irregular en Cloud Run o Lambda.</li>
          <li>Un servidor de WebSockets en contenedores con Fargate.</li>
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
            <strong className="text-foreground">Cold starts</strong>: bundles
            chicos, inicialización diferida, clientes reutilizados fuera del
            handler, e instancias pre-calentadas si el p99 lo exige.
          </p>
          <p>
            <strong className="text-foreground">Límites de serverless</strong>:
            duración, estado, conexiones a la base, conexiones largas y costo con
            tráfico constante.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Crear el cliente de la base dentro del handler.</strong>{" "}
            Una conexión nueva en cada invocación.
          </li>
          <li>
            <strong className="text-foreground">Optimizar cold starts sin medirlos.</strong>{" "}
            Muchas veces están muy por debajo de lo que el usuario nota.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>RDS Proxy delante de Postgres para funciones Lambda.</li>
          <li>Un mínimo de 1 instancia en Cloud Run para el endpoint de login.</li>
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
            <strong className="text-foreground">Kubernetes</strong>:
            estandarización y portabilidad a un costo operativo alto; se
            justifica con muchos servicios y equipos.
          </p>
          <p>
            <strong className="text-foreground">Escalado</strong>: la señal del
            autoscaler, la demora hasta tener capacidad, los límites de
            concurrencia, y proteger las dependencias que no escalan igual.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Escalar por CPU una API que espera IO.</strong>{" "}
            Las requests se acumulan mientras la CPU sigue baja.
          </li>
          <li>
            <strong className="text-foreground">Funciones sin límite de concurrencia contra una base chica.</strong>{" "}
            Un pico de tráfico se convierte en una caída de la base.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Escalar por agenda antes del pico de una campaña conocida.</li>
          <li>Una cola entre las funciones y un proveedor externo con rate limit.</li>
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
            Una plataforma de cursos online tiene: la web y la API (tráfico bajo
            de noche, picos al abrir inscripciones), un chat en vivo durante las
            clases, la generación de certificados en PDF (segundos cada uno, en
            ráfagas al terminar un curso) y el transcoding de videos subidos por
            los profesores (hasta 40 minutos por video). Elegí el cómputo de
            cada parte.
          </p>
          <RevelarSolucion>
            <p>
              No hace falta una sola respuesta para todo. La web y la API:
              serverless o contenedores con escala a cero (Vercel, Cloud Run),
              con un mínimo de instancias o escalado por agenda antes de abrir
              inscripciones, y un pooler delante de la base. El chat en vivo:
              contenedores con conexiones WebSocket de larga vida, con un mínimo
              de instancias durante el horario de clases; serverless encaja mal
              con conexiones de horas. Los certificados: funciones disparadas por
              una cola, ideales para ráfagas cortas, con concurrencia máxima
              limitada para no saturar el storage ni la base. El transcoding: 40
              minutos supera el límite de Lambda, así que va a contenedores como
              tareas por lote (Fargate o Cloud Run Jobs) o a un servicio
              gestionado de transcoding, disparadas por el evento de subida a
              S3. Ninguna parte necesita VMs ni Kubernetes a esta escala.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
