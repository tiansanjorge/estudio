import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ComparadorRestGraphql } from "@/components/modulo/ComparadorRestGraphql";
import { TiempoRealSimulador } from "@/components/modulo/TiempoRealSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosComparacion } from "@/lib/modules/http/rest-vs-graphql";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaRestGraphqlWebsockets } from "@/lib/modules/http/rest-graphql-websockets-entrevista";

const preguntasPorNivel = {
  1: entrevistaRestGraphqlWebsockets.filter((p) => p.nivel === 1),
  2: entrevistaRestGraphqlWebsockets.filter((p) => p.nivel === 2),
  3: entrevistaRestGraphqlWebsockets.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "REST vs GraphQL vs WebSockets — Dev Study Lab",
  description:
    "Tres formas distintas de comunicar cliente y servidor, y cuándo conviene cada una.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema de REST resuelve mejor GraphQL en el caso típico?",
    opciones: [
      "La latencia de red",
      "El overfetching/underfetching al combinar varios recursos",
      "La seguridad de las peticiones",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "GraphQL permite pedir exactamente los campos que necesitás de varios recursos relacionados en una sola query, evitando el problema típico de REST de traer de más o de menos y necesitar múltiples requests.",
  },
  {
    pregunta:
      "¿Por qué un WebSocket es mejor que hacer polling para un chat en tiempo real?",
    opciones: [
      "Porque WebSocket usa menos JavaScript",
      "Porque el servidor empuja mensajes solo cuando hay algo nuevo, sin peticiones repetidas vacías",
      "Porque WebSocket no usa HTTP",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El polling manda peticiones a intervalos fijos aunque no haya nada nuevo. El WebSocket mantiene una conexión abierta y el servidor push-ea solo cuando hay algo que avisar.",
  },
  {
    pregunta: "¿Qué desventaja tiene GraphQL frente a REST en cuanto a caching HTTP?",
    opciones: [
      "GraphQL no puede devolver JSON",
      "Al ir todo por POST a un único endpoint, se pierde el cacheo por URL que aprovechan REST y los CDNs",
      "GraphQL no soporta autenticación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "REST se beneficia de caching HTTP estándar por URL (CDNs, navegador). GraphQL, al usar típicamente POST a un solo endpoint, necesita mecanismos aparte (persisted queries, caching a nivel de cliente) para lograr algo similar.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Una query pide 50 posts con su autor y se ejecutan 51 consultas. ¿Qué lo resuelve?",
    opciones: ["Más índices en la base", "DataLoader (batching por request)", "Pasar a REST"],
    respuestaCorrecta: 1,
    explicacion:
      "Agrupa los ids pedidos en el mismo tick y hace una sola consulta con IN.",
  },
  {
    pregunta: "El servidor solo tiene que mandar notificaciones al cliente. ¿Qué conviene?",
    opciones: ["WebSockets", "Server-Sent Events", "Una query GraphQL cada 100 ms"],
    respuestaCorrecta: 1,
    explicacion:
      "SSE es unidireccional, va sobre HTTP y trae reconexión automática.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué defensa permite aceptar solo queries GraphQL conocidas y cachearlas por GET?",
    opciones: ["Introspección", "Persisted queries", "Alias"],
    respuestaCorrecta: 1,
    explicacion:
      "El cliente manda el hash de una query registrada; el servidor rechaza el resto.",
  },
  {
    pregunta: "Usuario A en la instancia 1 y B en la 2. ¿Cómo llega un mensaje de A a B?",
    opciones: [
      "Solo, porque comparten el load balancer",
      "Con un bus compartido (por ejemplo Redis pub/sub) entre instancias",
      "No se puede",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada conexión vive en una instancia; el bus distribuye los eventos entre todas.",
  },
];

export default function RestGraphqlWebsocketsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="REST vs GraphQL vs WebSockets"
      descripcion="Tres formas de comunicar cliente y servidor, con trade-offs distintos: cuántas peticiones hacés, cuánto control tenés sobre la forma de la respuesta, y quién inicia la comunicación."
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
            <strong className="text-foreground">REST</strong> modela la API
            como recursos con URLs propias (<code>/usuarios/42</code>,{" "}
            <code>/usuarios/42/posts</code>). Es simple, aprovecha caching
            HTTP estándar, pero para armar una pantalla que combina varios
            recursos relacionados normalmente necesitás varias peticiones
            — o el servidor te devuelve más campos de los que ibas a usar.
          </p>
          <p>
            <strong className="text-foreground">GraphQL</strong> expone un
            único endpoint donde el cliente describe exactamente qué
            campos de qué entidades relacionadas necesita, en una sola
            query. Resuelve el over/underfetching, pero traslada
            complejidad al servidor (resolver la query) y complica el
            caching HTTP tradicional.
          </p>
          <p>
            <strong className="text-foreground">WebSockets</strong> cambia
            el modelo por completo: en vez de que el cliente{" "}
            <em>pida</em> datos (pull), abre una conexión persistente
            donde el servidor puede{" "}
            <em>empujar</em> datos (push) en cualquier momento. Tiene
            sentido cuando necesitás tiempo real (chat, notificaciones,
            precios en vivo) — no para reemplazar cada request de tu app.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ComparadorRestGraphql escenarios={escenariosComparacion} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Conectá en modo polling o WebSocket y mirá la diferencia en la
          actividad de red durante unos segundos.
        </p>
        <TiempoRealSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar GraphQL para todo &ldquo;porque es más moderno&rdquo;.
            </strong>{" "}
            Si tus pantallas usan casi todos los campos de un recurso
            simple, REST es más simple y más barato de cachear.
          </li>
          <li>
            <strong className="text-foreground">
              Usar WebSockets para datos que casi no cambian.
            </strong>{" "}
            Mantener una conexión persistente tiene costo (en el
            servidor y en el cliente) que no se justifica si un simple
            fetch cada tanto alcanza.
          </li>
          <li>
            <strong className="text-foreground">
              No manejar la reconexión de un WebSocket.
            </strong>{" "}
            A diferencia de un fetch, una conexión WebSocket se puede
            cortar en cualquier momento (red inestable, el server
            reinicia) y hay que reconectar explícitamente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            REST: la mayoría de los CRUDs y catálogos, donde el cacheo por
            URL y la simplicidad importan más que la flexibilidad.
          </li>
          <li>
            GraphQL: apps con pantallas muy distintas consumiendo los
            mismos datos relacionados (ej: un dashboard configurable).
          </li>
          <li>
            WebSockets: chat, notificaciones en vivo, colaboración en
            tiempo real (como un editor compartido), precios que cambian
            constantemente.
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
            Estás armando un dashboard de e-commerce con: (1) una tabla de
            productos con muchos filtros y columnas que cambian según el
            usuario, y (2) un contador de &ldquo;pedidos nuevos&rdquo; que
            tiene que actualizarse al instante cuando entra un pedido.
            ¿Qué usarías para cada parte?
          </p>
          <RevelarSolucion>
            <p>
              Para la tabla de productos: <strong className="text-foreground">GraphQL</strong>{" "}
              (o REST con query params bien diseñados) tiene sentido porque
              las columnas/campos necesarios cambian según el usuario —
              justo el caso donde evitar over/underfetching vale la pena.
            </p>
            <p className="mt-2">
              Para el contador de pedidos nuevos:{" "}
              <strong className="text-foreground">WebSocket</strong> (o
              Server-Sent Events). Necesitás que el número cambie apenas
              pasa algo del lado del servidor, sin esperar a que el
              cliente pregunte — polling metería latencia innecesaria o
              muchas peticiones vacías.
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
            En GraphQL cada campo tiene su resolver, y eso genera el{" "}
            <strong className="text-foreground">problema N+1</strong>: pedir 50
            posts con su autor hace 51 consultas. DataLoader agrupa los ids del
            mismo tick en una sola consulta. GraphQL tampoco versiona por URL:
            el schema evoluciona agregando campos y marcando los viejos con{" "}
            <code>@deprecated</code>.
          </p>
          <p>
            Para tiempo real hay más opciones que WebSockets:{" "}
            <strong className="text-foreground">polling</strong> (simple y
            robusto), <strong className="text-foreground">Server-Sent Events</strong>{" "}
            (servidor a cliente sobre HTTP, con reconexión automática) y{" "}
            <strong className="text-foreground">WebSockets</strong>{" "}
            (bidireccional, pero con reconexión, heartbeats y escalado a
            cargo tuyo).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Resolvers que consultan la base uno por uno.</strong>{" "}
            El N+1 aparece recién con datos reales.
          </li>
          <li>
            <strong className="text-foreground">WebSockets para algo unidireccional.</strong>{" "}
            SSE resuelve lo mismo con menos infraestructura.
          </li>
          <li>
            <strong className="text-foreground">DataLoader compartido entre requests.</strong>{" "}
            Su cache puede filtrar datos de un usuario a otro.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Streaming de la respuesta de un LLM con SSE.</li>
          <li>Un BFF que arma la respuesta exacta de cada pantalla sobre varios servicios REST.</li>
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
            Una API GraphQL pública necesita límites que REST no: profundidad,
            costo por query, paginación obligatoria y rate limiting por costo.
            Las <strong className="text-foreground">persisted queries</strong>{" "}
            aceptan solo queries registradas y habilitan el caching por GET.
          </p>
          <p>
            Escalar <strong className="text-foreground">WebSockets</strong>{" "}
            exige un bus compartido entre instancias, un load balancer para
            conexiones largas, reconexión con backoff tras cada deploy,
            heartbeats, y autenticación por cookie (verificando{" "}
            <code>Origin</code>) o token de corta duración, porque el navegador
            no permite headers custom.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Introspección abierta en una API privada.</strong>{" "}
            Expone el schema completo.
          </li>
          <li>
            <strong className="text-foreground">No verificar <code>Origin</code> en el handshake del WebSocket.</strong>{" "}
            Permite cross-site WebSocket hijacking con la cookie del usuario.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un chat con varias instancias sincronizadas por Redis pub/sub.</li>
          <li>Una API GraphQL con límite de complejidad por plan de cliente.</li>
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
            Esta query es válida contra tu API GraphQL pública. ¿Por qué es un
            problema y qué defensas pondrías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`query {
  usuarios(primeros: 1000) {
    amigos(primeros: 1000) {
      amigos(primeros: 1000) {
        amigos(primeros: 1000) { nombre email }
      }
    }
  }
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Es un solo request que pide hasta 1000⁴ nodos: puede tumbar la base
              y el servidor (denegación de servicio con una query legítima), y
              además expone emails en masa. Defensas: límite de profundidad (por
              ejemplo 5), análisis de costo que multiplica por el tamaño de cada
              lista y rechaza antes de ejecutar, un máximo por página (
              <code>primeros</code> ≤ 50), rate limiting por costo, timeouts, y
              autorización por campo para datos como el email. Si los clientes
              son propios, persisted queries.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
