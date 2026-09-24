import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ReconexionSimulador } from "@/components/modulo/ReconexionSimulador";
import { entrevistaWebsocketsTiempoReal } from "@/lib/modules/backend/websockets-tiempo-real-entrevista";

const preguntasPorNivel = {
  1: entrevistaWebsocketsTiempoReal.filter((p) => p.nivel === 1),
  2: entrevistaWebsocketsTiempoReal.filter((p) => p.nivel === 2),
  3: entrevistaWebsocketsTiempoReal.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "WebSockets / tiempo real — Dev Study Lab",
  description:
    "Conexiones persistentes desde el backend: handshake, mensajes perdidos, reconexión, heartbeats, autenticación, backpressure y garantías de entrega.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Con qué status responde el servidor al aceptar un WebSocket?",
    opciones: [
      "101 Switching Protocols",
      "200 OK",
      "204 No Content",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El request HTTP inicial se 'actualiza' a un canal bidireccional.",
  },
  {
    pregunta: "¿Qué pasa con los mensajes emitidos mientras el cliente estaba desconectado?",
    opciones: [
      "El servidor los guarda y los reenvía al reconectar",
      "Se pierden, salvo que diseñes un resync",
      "El protocolo los reintenta hasta que llegan",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un WebSocket es un canal en vivo, no una cola.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué sirven los heartbeats?",
    opciones: [
      "Para medir la latencia y ajustar la calidad de los datos",
      "Para renovar la autenticación de la conexión",
      "Para detectar conexiones muertas y evitar cierres por inactividad",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "TCP puede dejar una conexión 'abierta' aunque el otro lado ya no exista.",
  },
  {
    pregunta: "¿Por qué hay que verificar el header Origin en el handshake si se autentica por cookie?",
    opciones: [
      "Porque la cookie viaja aunque la página que conecta sea de otro sitio",
      "Porque CORS bloquea los WebSockets sin Origin y el cliente no conecta",
      "Porque Origin trae el token de sesión que hay que validar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Sin ese chequeo, un sitio malicioso puede abrir un WebSocket con la sesión del usuario.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Un cliente lento acumula megas en bufferedAmount. ¿Qué hacés en un feed de precios?",
    opciones: [
      "Aumentar el buffer para que el cliente se ponga al día",
      "Descartar intermedios y mandar solo el último estado",
      "Cerrar la conexión y dejar que el cliente reconecte",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "En un feed de precios solo importa el valor actual; en un chat no se podría descartar.",
  },
  {
    pregunta: "¿Qué garantía da un WebSocket sobre que un mensaje fue procesado?",
    opciones: [
      "Que llegó: TCP confirma cada mensaje al emisor",
      "Que llegó y se procesó, si el send() no lanzó error",
      "Ninguna por sí solo: hacen falta ids, ACKs y dedup",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Si la conexión se corta no se sabe qué llegó; la confiabilidad se construye encima.",
  },
];

export default function WebsocketsTiempoRealPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="WebSockets / tiempo real"
      descripcion="Mantener conexiones abiertas con miles de clientes: qué pasa cuando se cortan, cómo recuperar lo perdido y cómo no saturar al servidor."
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
            Un WebSocket arranca como un request HTTP con{" "}
            <code>Upgrade: websocket</code> y, con un <code>101</code>, queda
            como canal bidireccional persistente. La comparación con SSE y
            polling, y el escalado con pub/sub, se vieron en HTTP y Networking.
          </p>
          <p>
            Acá importa la <strong className="text-foreground">entrega</strong>:
            la conexión se corta todo el tiempo y lo emitido mientras tanto se
            pierde, salvo que haya ids, un buffer para reenviar y un cliente
            que deduplique.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ReconexionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Asumir que la conexión es estable.</strong>{" "}
            En mobile se corta varias veces por sesión.
          </li>
          <li>
            <strong className="text-foreground">Usar el WebSocket como única fuente de verdad.</strong>{" "}
            Al reconectar conviene recuperar el estado por HTTP.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un chat con ids por mensaje y recuperación del historial al reconectar.</li>
          <li>Notificaciones que solo avisan &quot;hay novedades&quot; y el cliente consulta por HTTP.</li>
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
            <strong className="text-foreground">Reconexión</strong> automática
            con backoff y jitter, re-autenticación, re-suscripción y resync.{" "}
            <strong className="text-foreground">Heartbeats</strong> para
            detectar conexiones muertas y mantener vivas las inactivas.
          </p>
          <p>
            <strong className="text-foreground">Autenticación</strong> en el
            handshake (cookie más chequeo de <code>Origin</code>, o un token de
            un solo uso) y <strong className="text-foreground">autorización</strong>{" "}
            por suscripción, igual que un endpoint.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Reconectar con intervalo fijo.</strong>{" "}
            Tras un deploy, todos los clientes vuelven en el mismo segundo.
          </li>
          <li>
            <strong className="text-foreground">Tokens de larga duración en la URL.</strong>{" "}
            Quedan registrados en los logs de proxies.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Ping cada 25 s y cierre si no hay pong en 10 s.</li>
          <li>Verificar permisos antes de unir a un usuario a la sala de un proyecto.</li>
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
            <strong className="text-foreground">Backpressure</strong>: clientes
            lentos acumulan mensajes en el buffer del servidor. Se vigila{" "}
            <code>bufferedAmount</code> y se descarta, muestrea o desconecta
            según si importa cada mensaje o solo el estado final.
          </p>
          <p>
            <strong className="text-foreground">Garantías</strong>: por sí solo,
            como mucho una vez. Con ids, ACKs, persistencia y deduplicación se
            llega a &quot;al menos una vez&quot; más idempotencia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Ignorar <code>bufferedAmount</code>.</strong>{" "}
            Unos pocos clientes lentos agotan la memoria del proceso.
          </li>
          <li>
            <strong className="text-foreground">Construir todo esto sin evaluar un servicio administrado.</strong>{" "}
            Historial y recuperación ya existen en varias plataformas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Redis Streams como historial de un canal para hacer replay.</li>
          <li>Un marcador en vivo que envía como mucho 4 actualizaciones por segundo.</li>
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
            Diseñá las notificaciones en tiempo real de una app de delivery
            (&quot;tu pedido salió&quot;, &quot;el repartidor está cerca&quot;).
            Los usuarios están en el celular, con conexión inestable. ¿Qué
            decidís?
          </p>
          <RevelarSolucion>
            <p>
              Las notificaciones de estado del pedido no pueden perderse, así
              que el WebSocket (o SSE) no es la fuente de verdad: cada evento se
              persiste con un id y el estado del pedido vive en la base. El
              canal en tiempo real avisa; al reconectar, el cliente pide el
              estado actual por HTTP (o el replay desde su último id) y
              deduplica. La posición del repartidor es distinta: solo importa
              la última, así que se muestrea (una cada pocos segundos) y se
              descartan intermedias si el cliente va lento. Heartbeats y
              reconexión con backoff y jitter, autenticación por cookie o token
              de un solo uso, y autorización por pedido (cada usuario solo se
              suscribe a los suyos). Y como la app puede estar cerrada, push
              notifications del sistema operativo para los hitos importantes.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
