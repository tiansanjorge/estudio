import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ComparadorRestGraphql } from "@/components/modulo/ComparadorRestGraphql";
import { TiempoRealSimulador } from "@/components/modulo/TiempoRealSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosComparacion } from "@/lib/modules/http/rest-vs-graphql";

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

export default function RestGraphqlWebsocketsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="REST vs GraphQL vs WebSockets"
      descripcion="Tres formas de comunicar cliente y servidor, con trade-offs distintos: cuántas peticiones hacés, cuánto control tenés sobre la forma de la respuesta, y quién inicia la comunicación."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Conectá en modo polling o WebSocket y mirá la diferencia en la
          actividad de red durante unos segundos.
        </p>
        <TiempoRealSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
