import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CapSimulador } from "@/components/modulo/CapSimulador";
import { entrevistaCapConsistencia } from "@/lib/modules/system-design/cap-consistencia-entrevista";

const preguntasPorNivel = {
  1: entrevistaCapConsistencia.filter((p) => p.nivel === 1),
  2: entrevistaCapConsistencia.filter((p) => p.nivel === 2),
  3: entrevistaCapConsistencia.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "CAP theorem, consistencia vs disponibilidad — Dev Study Lab",
  description:
    "Qué dice realmente CAP, cuándo elegir consistencia o disponibilidad, PACELC y quórums, modelos de consistencia, resolución de conflictos y consenso.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Según CAP, ¿cuándo hay que elegir entre consistencia y disponibilidad?",
    opciones: ["Siempre", "Cuando hay una partición de red", "Nunca, se pueden tener las tres"],
    respuestaCorrecta: 1,
    explicacion: "Sin partición, un sistema puede ser consistente y disponible a la vez.",
  },
  {
    pregunta: "¿Qué dato conviene tratar como CP?",
    opciones: ["El contador de likes", "El saldo de una cuenta", "El feed de noticias"],
    respuestaCorrecta: 1,
    explicacion: "Un saldo viejo puede permitir gastar dos veces el mismo dinero.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con N = 3 réplicas, ¿qué combinación garantiza leer la última escritura?",
    opciones: ["W = 1, R = 1", "W = 2, R = 2", "W = 1, R = 2"],
    respuestaCorrecta: 1,
    explicacion: "R + W = 4 > 3: los conjuntos siempre se superponen.",
  },
  {
    pregunta: "Un usuario edita su perfil y al recargar ve la versión anterior. ¿Qué garantía falta?",
    opciones: ["Consistencia causal", "Read-your-writes", "Tolerancia a particiones"],
    respuestaCorrecta: 1,
    explicacion: "Un usuario siempre debería ver sus propias escrituras.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué riesgo tiene last-write-wins?",
    opciones: [
      "Es lento",
      "Descarta en silencio escrituras concurrentes y depende de relojes no sincronizados",
      "Necesita consenso",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso existen los relojes vectoriales y los CRDTs.",
  },
  {
    pregunta: "¿Cuántas fallas tolera un cluster de consenso de 5 nodos?",
    opciones: ["1", "2", "4"],
    respuestaCorrecta: 1,
    explicacion: "Con 2f + 1 nodos se toleran f fallas: la mayoría de 5 es 3.",
  },
];

export default function CapConsistenciaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="CAP theorem, consistencia vs disponibilidad"
      descripcion="Qué hace un sistema distribuido cuando se corta la red, y cómo elegir qué garantías dar a cada dato."
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
            Las particiones pasan, así que la elección real es qué hacer durante
            una: <strong className="text-foreground">CP</strong> (el lado que no
            puede confirmar deja de responder) o <strong className="text-foreground">AP</strong>{" "}
            (todos responden, aunque diverjan).
          </p>
          <p>
            Se decide por dato, según qué es peor: un error o un dato incorrecto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CapSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">&quot;Elegí dos de tres&quot;.</strong>{" "}
            La tolerancia a particiones no es opcional en una red real.
          </li>
          <li>
            <strong className="text-foreground">Una sola respuesta para todo el sistema.</strong>{" "}
            Pagos y feed tienen necesidades opuestas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Reservas de asientos con consistencia fuerte.</li>
          <li>Un carrito que acepta cambios aunque una réplica esté aislada.</li>
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
            <strong className="text-foreground">PACELC</strong>: sin partición,
            la elección es entre latencia y consistencia. Los quórums (R + W &gt;
            N) permiten ajustarla por operación.
          </p>
          <p>
            <strong className="text-foreground">Modelos</strong>: fuerte,
            causal, read-your-writes, lecturas monótonas y eventual. Réplicas y
            replication lag de bases de datos se ven en Bases de datos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Consistencia fuerte en todo &quot;por las dudas&quot;.</strong>{" "}
            Se paga latencia en cada escritura, también en datos que no la necesitan.
          </li>
          <li>
            <strong className="text-foreground">Eventual sin read-your-writes.</strong>{" "}
            El usuario cree que sus cambios no se guardaron.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Lecturas con quórum para datos críticos y con R = 1 para el resto.</li>
          <li>Comentarios con consistencia causal: nadie ve la respuesta antes que el comentario.</li>
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
            <strong className="text-foreground">Conflictos en AP</strong>:
            last-write-wins (pierde escrituras), relojes vectoriales (detectan
            concurrencia), resolución en la aplicación y CRDTs (convergen solos).
          </p>
          <p>
            <strong className="text-foreground">Consenso en CP</strong>: Raft y
            Paxos confirman por mayoría, con 2f + 1 nodos para tolerar f fallas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Clusters de consenso con número par de nodos.</strong>{" "}
            Cuatro nodos toleran las mismas fallas que tres.
          </li>
          <li>
            <strong className="text-foreground">Confiar en relojes para ordenar escrituras entre máquinas.</strong>{" "}
            La desincronización hace que &quot;la última&quot; no sea la última.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un editor colaborativo basado en CRDTs.</li>
          <li>etcd para la configuración y la elección de líder de un sistema.</li>
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
            Una app de reservas de canchas funciona en dos regiones para que los
            usuarios de cada país tengan baja latencia. Un corte entre regiones
            deja a cada una aislada durante 10 minutos. Decidí qué comportamiento
            debería tener cada dato durante el corte: las reservas de turnos, el
            perfil del usuario, las reseñas de las canchas y el contador de
            &quot;personas mirando esta cancha&quot;.
          </p>
          <RevelarSolucion>
            <p>
              Reservas: CP. Dos personas no pueden reservar el mismo turno;
              durante el corte, las reservas de cada cancha las acepta solo la
              región dueña de esa cancha (la que tiene la mayoría o el líder de
              esos datos), y la otra región responde que reintente o muestra
              disponibilidad como no confirmada. Asignar cada cancha a una
              región &quot;hogar&quot; hace que el corte afecte solo a los
              usuarios que reservan canchas de la otra región. Perfil: AP con
              read-your-writes; si el usuario lo edita en las dos regiones
              durante el corte, last-write-wins es aceptable. Reseñas: AP, se
              reconcilian por unión, porque son un conjunto que solo crece.
              Contador: AP; un CRDT de contador o simplemente valores
              aproximados que se corrigen al volver la red, porque nadie sale
              perjudicado por un número impreciso durante 10 minutos.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
