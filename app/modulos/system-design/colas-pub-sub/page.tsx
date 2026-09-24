import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ParticionesSimulador } from "@/components/modulo/ParticionesSimulador";
import { entrevistaColasPubSub } from "@/lib/modules/system-design/colas-pub-sub-entrevista";

const preguntasPorNivel = {
  1: entrevistaColasPubSub.filter((p) => p.nivel === 1),
  2: entrevistaColasPubSub.filter((p) => p.nivel === 2),
  3: entrevistaColasPubSub.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Colas de mensajes / pub-sub (Kafka, SQS) — Dev Study Lab",
  description:
    "Cola vs pub/sub vs log, SQS, SNS, RabbitMQ o Kafka, garantías de entrega, orden por clave, particiones y consumer groups, y visibility timeout.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Facturación, envíos y analítica tienen que enterarse de cada pedido. ¿Qué modelo?",
    opciones: ["Una cola compartida", "Pub/sub: cada suscriptor recibe su copia", "Una llamada HTTP a cada uno"],
    respuestaCorrecta: 1,
    explicacion: "En una cola compartida, cada mensaje lo recibiría uno solo de los tres.",
  },
  {
    pregunta: "¿Qué permite Kafka que una cola tradicional no?",
    opciones: ["Borrar mensajes al leerlos", "Releer el historial desde cualquier offset", "Enviar emails"],
    respuestaCorrecta: 1,
    explicacion: "Retiene los mensajes aunque se hayan consumido.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué garantía da SQS estándar?",
    opciones: ["At-most-once", "At-least-once", "Exactly-once de punta a punta"],
    respuestaCorrecta: 1,
    explicacion: "Un mensaje puede llegar más de una vez: el consumidor tiene que ser idempotente.",
  },
  {
    pregunta: "¿Cómo mantenés en orden los eventos de cada pedido en Kafka?",
    opciones: ["Con un solo consumidor global", "Usando el id del pedido como clave de partición", "No se puede"],
    respuestaCorrecta: 1,
    explicacion: "Misma clave, misma partición, y dentro de una partición hay orden.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Un topic con 6 particiones y 10 consumidores en el grupo. ¿Cuántos trabajan?",
    opciones: ["10", "6", "1"],
    respuestaCorrecta: 1,
    explicacion: "Una partición la lee un solo consumidor del grupo: 4 quedan ociosos.",
  },
  {
    pregunta: "Un job de SQS tarda 90 segundos y el visibility timeout es 30. ¿Qué pasa?",
    opciones: [
      "Nada",
      "El mensaje reaparece y otro consumidor lo procesa en paralelo",
      "SQS lo borra",
    ],
    respuestaCorrecta: 1,
    explicacion: "Hay que subir el timeout o extenderlo mientras se procesa.",
  },
];

export default function ColasPubSubPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Colas de mensajes / pub-sub (Kafka, SQS)"
      descripcion="Cómo se comunican los servicios de forma asíncrona, qué garantías dan los brokers y qué cuesta mantener el orden."
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
            <strong className="text-foreground">Cola</strong>: cada mensaje a un
            consumidor. <strong className="text-foreground">Pub/sub</strong>: a
            todos los suscriptores. <strong className="text-foreground">Log</strong>{" "}
            (Kafka): mensajes retenidos en orden, con replay y grupos de
            consumidores.
          </p>
          <p>
            DLQ, idempotencia y outbox están en Colas y jobs (Backend); comandos,
            eventos y sagas, en Event-driven (Arquitectura).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ParticionesSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Kafka para encolar unos cientos de jobs por día.</strong>{" "}
            Todo su costo operativo para algo que SQS resuelve sin administrar nada.
          </li>
          <li>
            <strong className="text-foreground">Una cola compartida entre varios servicios interesados.</strong>{" "}
            Cada mensaje le llega a uno solo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>SNS con una cola SQS por servicio interesado en un pedido.</li>
          <li>Kafka para eventos de clics que consumen analítica, recomendaciones y fraude.</li>
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">Garantías</strong>:
            at-most-once pierde, at-least-once duplica; el efecto exactly-once
            sale de un consumidor idempotente.
          </p>
          <p>
            <strong className="text-foreground">Orden</strong>: por entidad,
            con clave de partición o message group; limita el paralelismo y un
            mensaje fallido bloquea a los de su clave.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Confiar en el exactly-once del broker para escribir en la base.</strong>{" "}
            Fuera del broker, la garantía vuelve a ser at-least-once.
          </li>
          <li>
            <strong className="text-foreground">Pedir orden global.</strong>{" "}
            Un solo consumidor para todo el sistema, que no escala.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>SQS FIFO con el id de la cuenta como message group para movimientos.</li>
          <li>Descartar eventos viejos por número de versión en vez de exigir orden.</li>
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
            <strong className="text-foreground">Kafka</strong>: las particiones
            son el techo de paralelismo del grupo; los rebalanceos frenan el
            consumo; el consumer lag es la métrica central.
          </p>
          <p>
            <strong className="text-foreground">SQS</strong>: visibility
            timeout mayor al procesamiento (o extendido), DLQ por cantidad de
            recepciones y alarma por antigüedad del mensaje más viejo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Pocas particiones al crear el topic.</strong>{" "}
            Agregarlas después rompe el orden por clave durante la transición.
          </li>
          <li>
            <strong className="text-foreground">Lag que supera la retención.</strong>{" "}
            Kafka borra mensajes que nadie llegó a leer.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Autoscaling de consumidores según el lag, hasta la cantidad de particiones.</li>
          <li>Extender el visibility timeout de un job que procesa un video largo.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Una billetera virtual publica movimientos (depósitos, transferencias,
            retiros) que consumen tres sistemas: el que actualiza saldos, el de
            detección de fraude y el de analítica. Los saldos tienen que
            aplicarse en orden por cuenta; fraude necesita reaccionar en
            segundos; analítica quiere poder reprocesar el último mes cuando
            cambia un modelo. Un 1% de las cuentas genera la mitad de los
            movimientos. Diseñá la mensajería.
          </p>
          <RevelarSolucion>
            <p>
              Replay y varios consumidores independientes apuntan a un log:
              Kafka (o Kinesis), con un topic de movimientos y retención de al
              menos un mes. Clave de partición: el id de la cuenta, para el orden
              por cuenta. Cada sistema es un consumer group propio, con su ritmo
              y su offset: saldos, fraude y analítica no se frenan entre sí, y
              analítica reprocesa rebobinando su offset. El 1% de cuentas
              grandes genera particiones calientes: dimensionar suficientes
              particiones (el hash reparte mejor con muchas), monitorear el lag
              por partición, y si una cuenta sola satura una partición,
              evaluar sub-claves para lo que no necesita orden (analítica puede
              leer de otro topic sin orden por cuenta). El consumidor de saldos
              es idempotente, por id de movimiento, porque la entrega es
              at-least-once, y los movimientos que fallan no se saltean: se
              reintentan y alertan, porque saltearlos rompería el saldo. Fraude
              se escala hasta la cantidad de particiones, con alarma por lag de
              segundos.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
