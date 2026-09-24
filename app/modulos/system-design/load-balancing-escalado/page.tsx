import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { BalanceoSimulador } from "@/components/modulo/BalanceoSimulador";
import { entrevistaLoadBalancing } from "@/lib/modules/system-design/load-balancing-entrevista";

const preguntasPorNivel = {
  1: entrevistaLoadBalancing.filter((p) => p.nivel === 1),
  2: entrevistaLoadBalancing.filter((p) => p.nivel === 2),
  3: entrevistaLoadBalancing.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Load balancing y escalado horizontal vs vertical — Dev Study Lab",
  description:
    "Escalado vertical y horizontal, aplicaciones sin estado, algoritmos de balanceo, sticky sessions, consistent hashing y protección contra sobrecarga.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué suele escalarse verticalmente primero?",
    opciones: [
      "La base de datos",
      "La API sin estado",
      "El CDN",
    ],
    respuestaCorrecta: 0,
    explicacion: "Repartir una base con estado es mucho más complejo que agrandar la máquina.",
  },
  {
    pregunta: "La app guarda la sesión en memoria y agregás una segunda instancia. ¿Qué pasa?",
    opciones: [
      "Nada: el balanceador replica la memoria entre instancias",
      "Los usuarios pierden la sesión al caer en la otra instancia",
      "Las sesiones se duplican y cada usuario tiene dos",
    ],
    respuestaCorrecta: 1,
    explicacion: "El estado tiene que ir a un almacén compartido o a un token.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con requests de duración muy variable, ¿qué algoritmo reparte mejor la carga?",
    opciones: [
      "Round robin",
      "IP hash",
      "Least connections",
    ],
    respuestaCorrecta: 2,
    explicacion: "Mira cuántas requests activas tiene cada servidor, no solo cuántas le mandó.",
  },
  {
    pregunta: "¿Qué problema traen las sticky sessions con autoscaling?",
    opciones: [
      "Las instancias nuevas solo reciben usuarios nuevos y tardan en aliviar",
      "Las instancias nuevas no pueden leer las cookies de las sesiones viejas",
      "El balanceador deja de hacer health checks sobre las instancias",
    ],
    respuestaCorrecta: 0,
    explicacion: "Los usuarios existentes siguen atados a su instancia original.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Con hash % N, pasar de 4 a 5 servidores de caché, ¿qué fracción de claves cambia de servidor?",
    opciones: [
      "Alrededor del 20%",
      "Alrededor del 80%",
      "Alrededor del 50%",
    ],
    respuestaCorrecta: 1,
    explicacion: "Con consistent hashing se movería solo alrededor de 1/5.",
  },
  {
    pregunta: "Ante un pico que supera la capacidad, ¿qué conviene?",
    opciones: [
      "Encolar todo el excedente hasta que haya capacidad",
      "Subir los timeouts para que ningún request falle",
      "Rechazar rápido el excedente con 503 y priorizar",
    ],
    respuestaCorrecta: 2,
    explicacion: "Load shedding protege a los usuarios que sí se pueden atender.",
  },
];

export default function LoadBalancingEscaladoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Load balancing y escalado horizontal vs vertical"
      descripcion="Cómo repartir carga entre varias máquinas, qué exige eso de la aplicación, y cómo no caerse cuando no alcanza."
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
            <strong className="text-foreground">Vertical</strong>: una máquina
            más grande, simple pero con techo y punto único de falla.{" "}
            <strong className="text-foreground">Horizontal</strong>: más
            máquinas detrás de un balanceador, sin techo, a cambio de una
            aplicación sin estado.
          </p>
          <p>
            ALB, NLB y health checks del lado cloud están en Redes básicas;
            acá el foco es el diseño.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <BalanceoSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un cron en cada instancia.</strong>{" "}
            Con 5 instancias, el email diario se envía 5 veces.
          </li>
          <li>
            <strong className="text-foreground">Uploads en el disco local.</strong>{" "}
            El archivo existe solo en la instancia que lo recibió.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una API sin estado que escala de 2 a 20 instancias según el tráfico.</li>
          <li>Agrandar la instancia de la base antes de pensar en réplicas.</li>
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
            <strong className="text-foreground">Algoritmos</strong>:
            round-robin (misma cantidad, no misma carga), least connections
            (mira la carga real), dos opciones al azar, y hash para afinidad.
          </p>
          <p>
            <strong className="text-foreground">Sticky sessions</strong>:
            esconden estado local y desbalancean; mejor no depender de la
            afinidad, salvo WebSockets o afinidad buscada por clave.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Round-robin con requests heterogéneas.</strong>{" "}
            Un servidor puede recibir todas las pesadas, como en el playground.
          </li>
          <li>
            <strong className="text-foreground">Afinidad por cliente sin mirar su tamaño.</strong>{" "}
            Un cliente grande satura su servidor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Least connections para una API con reportes que tardan segundos.</li>
          <li>Sesiones en Redis para poder quitar sticky sessions del balanceador.</li>
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
            <strong className="text-foreground">Consistent hashing</strong>:
            al cambiar la cantidad de servidores se mueve solo una fracción de
            las claves; los nodos virtuales emparejan el reparto.
          </p>
          <p>
            <strong className="text-foreground">Sobrecarga</strong>: el
            cuello de botella se muda a las dependencias; health checks sin
            dependencias, reintentos con backoff, load shedding, backpressure y
            circuit breakers.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Reintentos inmediatos y sin límite.</strong>{" "}
            Multiplican la carga justo cuando el sistema está saturado.
          </li>
          <li>
            <strong className="text-foreground">Escalar la API sin mirar la base.</strong>{" "}
            Más instancias son más conexiones y consultas contra el mismo primario.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un caché distribuido con consistent hashing y nodos virtuales.</li>
          <li>Rechazar recomendaciones con 503 durante un pico para proteger el checkout.</li>
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
            Durante un evento, el tráfico se multiplicó por 5. El autoscaling
            subió de 4 a 20 instancias, pero la latencia empeoró y terminó en una
            caída total: la base llegó al máximo de conexiones, los health checks
            (que hacen un <code>SELECT 1</code>) empezaron a fallar, el
            balanceador sacó instancias, y los clientes reintentaban cada 100 ms.
            Explicá la cascada y qué cambiarías.
          </p>
          <RevelarSolucion>
            <p>
              La cascada: 20 instancias con su pool de conexiones agotaron el
              límite de la base; las consultas empezaron a esperar; el health
              check, que depende de la base, falló en todas a la vez; el
              balanceador las sacó y la capacidad cayó justo en el pico; los
              reintentos cada 100 ms multiplicaron la carga sobre lo que quedaba.
              Cambios: 1) un pooler delante de la base y un máximo de
              conexiones por instancia calculado para la escala máxima; 2) un
              máximo de instancias acorde a lo que la base soporta; 3) health
              check de liveness que no dependa de la base, y la base en un
              readiness que no saque a todas a la vez; 4) reintentos con
              backoff exponencial, jitter y límite en los clientes; 5) load
              shedding: rechazar con 503 lo que excede la capacidad, priorizando
              las operaciones críticas; 6) caché para las lecturas más
              repetidas del evento, que era probablemente la mayor parte del
              tráfico.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
