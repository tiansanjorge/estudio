import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EventDrivenSimulador } from "@/components/modulo/EventDrivenSimulador";
import { entrevistaEventDriven } from "@/lib/modules/arquitectura/event-driven-entrevista";

const preguntasPorNivel = {
  1: entrevistaEventDriven.filter((p) => p.nivel === 1),
  2: entrevistaEventDriven.filter((p) => p.nivel === 2),
  3: entrevistaEventDriven.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Event-driven architecture — Dev Study Lab",
  description:
    "Eventos vs llamadas sincrónicas, comandos vs eventos, idempotencia, consistencia eventual, outbox y sagas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "El servicio de email está caído. ¿Qué pasa con el checkout si se comunica por eventos?",
    opciones: [
      "El checkout confirma; el evento espera en la cola a que vuelva",
      "El checkout falla, porque el evento no se pudo entregar",
      "El checkout espera a que el email vuelva y reintenta",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La cola desacopla la disponibilidad del productor de la de los consumidores.",
  },
  {
    pregunta: "¿Cuál es un nombre de evento (y no de comando)?",
    opciones: [
      "CrearPedido",
      "PedidoCreado",
      "ProcesarPedido",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los eventos describen hechos pasados; los comandos, órdenes.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué garantía de entrega ofrecen la mayoría de los brokers?",
    opciones: [
      "Exactly-once",
      "At-most-once",
      "At-least-once",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Por eso los consumidores tienen que tolerar duplicados.",
  },
  {
    pregunta: "El usuario compra y en 'Mis pedidos' todavía no aparece. ¿Qué es?",
    opciones: [
      "Consistencia eventual",
      "Un evento perdido",
      "Un lost update",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Se maneja con UI optimista, estados intermedios o notificación al completar.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué resuelve el patrón Outbox?",
    opciones: [
      "Que los eventos se procesen en el mismo orden en que se publicaron",
      "Que guardar en la base y publicar el evento pasen los dos o ninguno",
      "Que un consumidor no procese dos veces el mismo evento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El evento se guarda en la misma transacción y un proceso aparte lo publica.",
  },
  {
    pregunta: "En una saga, ¿qué pasa si falla el cobro después de reservar stock?",
    opciones: [
      "Se hace rollback de la transacción distribuida completa",
      "El stock queda reservado hasta que se reintente el cobro",
      "Se ejecuta la compensación: liberar el stock",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Cada paso local tiene su compensación en vez de una transacción global.",
  },
];

export default function EventDrivenPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Event-driven architecture"
      descripcion="Servicios que reaccionan a hechos publicados en una cola en vez de llamarse entre sí: qué se gana, qué se complica y cómo se maneja."
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
            En vez de llamar a cada servicio, el productor{" "}
            <strong className="text-foreground">publica un evento</strong> (un
            hecho: &quot;PedidoCreado&quot;) en una cola o broker, y los
            interesados se suscriben. El productor no conoce a los
            consumidores.
          </p>
          <p>
            Se gana desacoplamiento, resiliencia ante caídas y menor latencia
            para el usuario. Se paga con consistencia eventual, duplicados y
            flujos más difíciles de seguir. Un{" "}
            <strong className="text-foreground">evento</strong> describe algo que
            pasó; un <strong className="text-foreground">comando</strong> ordena
            algo a un destinatario.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EventDrivenSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Eventos que en realidad son comandos.</strong>{" "}
            &quot;EnviarMailConfirmacion&quot; mantiene el acoplamiento.
          </li>
          <li>
            <strong className="text-foreground">Eventos para todo.</strong>{" "}
            Si el usuario necesita la respuesta ya, una llamada sincrónica es
            más simple.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Notificaciones, facturación y analytics después de una compra.</li>
          <li>Procesamiento de imágenes o videos subidos.</li>
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
            La entrega es <strong className="text-foreground">at-least-once</strong>:
            un mensaje puede llegar dos veces, así que los consumidores tienen
            que ser <strong className="text-foreground">idempotentes</strong>{" "}
            (registrar ids procesados, operaciones de &quot;establecer&quot; en
            vez de &quot;incrementar&quot;).
          </p>
          <p>
            La <strong className="text-foreground">consistencia eventual</strong>{" "}
            se nota en la UX: se maneja con UI optimista, estados intermedios y
            notificaciones al completar. Los mensajes que fallan una y otra vez
            van a una <strong className="text-foreground">dead letter queue</strong>{" "}
            para revisarlos sin bloquear al resto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Asumir exactly-once.</strong>{" "}
            El primer duplicado genera dos facturas.
          </li>
          <li>
            <strong className="text-foreground">Reintentos infinitos de un mensaje roto.</strong>{" "}
            Bloquea la cola; para eso existe la DLQ.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una tabla <code>eventos_procesados</code> con constraint único.</li>
          <li>&quot;Estamos procesando tu pago&quot; con aviso cuando termina.</li>
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
            <strong className="text-foreground">Doble escritura</strong>:
            guardar y publicar son dos sistemas sin transacción común. El{" "}
            <strong className="text-foreground">Outbox</strong> guarda el evento
            en la misma transacción y un proceso aparte lo publica.
          </p>
          <p>
            Las <strong className="text-foreground">sagas</strong> coordinan
            operaciones entre servicios con pasos locales y acciones
            compensatorias, por coreografía (eventos) u orquestación (un
            coordinador explícito).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Publicar el evento después del commit, sin outbox.</strong>{" "}
            Una caída en el medio pierde el evento.
          </li>
          <li>
            <strong className="text-foreground">Coreografía de 12 pasos.</strong>{" "}
            Nadie puede explicar el flujo completo; conviene orquestar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Outbox con un worker que publica en SQS.</li>
          <li>Una saga de reserva de viaje (vuelo, hotel, auto) con compensaciones.</li>
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
            Soporte reporta clientes con dos cobros y pedidos que nunca se
            facturaron. ¿Qué dos problemas tiene este código?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// productor
const pedido = await db.pedido.create({ data });
await cola.publicar("PedidoCreado", pedido);   // puede fallar después del create

// consumidor de facturación
cola.suscribir("PedidoCreado", async (evento) => {
  await pasarela.cobrar(evento.clienteId, evento.total);
  await db.factura.create({ data: { pedidoId: evento.id } });
});`}
          </pre>
          <RevelarSolucion>
            <p>
              1) Doble escritura en el productor: si el proceso se cae entre el{" "}
              <code>create</code> y el <code>publicar</code>, el pedido existe
              pero el evento nunca sale, y ese pedido no se factura. Solución:
              outbox, guardando el evento en la misma transacción. 2) Consumidor
              no idempotente: con entrega at-least-once, un evento repetido
              cobra dos veces. Solución: registrar el id del evento procesado
              (constraint único) y usar una idempotency key al cobrar (por
              ejemplo el id del pedido), para que la pasarela tampoco cobre dos
              veces aunque el consumidor reintente.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
