import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { IdempotenciaSimulador } from "@/components/modulo/IdempotenciaSimulador";
import { entrevistaIdempotenciaRateLimiting } from "@/lib/modules/system-design/idempotencia-rate-limiting-entrevista";

const preguntasPorNivel = {
  1: entrevistaIdempotenciaRateLimiting.filter((p) => p.nivel === 1),
  2: entrevistaIdempotenciaRateLimiting.filter((p) => p.nivel === 2),
  3: entrevistaIdempotenciaRateLimiting.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Idempotencia y rate limiting a nivel de diseño — Dev Study Lab",
  description:
    "Idempotencia como requisito de diseño, almacenamiento de idempotency keys, flujos de varios pasos, capas de rate limiting, equidad entre tenants y diseño de un rate limiter.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un request de pago da timeout. ¿Qué sabe el cliente?",
    opciones: [
      "Nada: el cobro pudo haberse hecho o no",
      "Que el cobro falló y hay que reintentarlo",
      "Que el cobro se hizo pero no llegó la respuesta",
    ],
    respuestaCorrecta: 0,
    explicacion: "Por eso reintentar tiene que ser seguro.",
  },
  {
    pregunta: "¿Qué límite evita que un cliente con un script mal hecho degrade a todos?",
    opciones: [
      "Un límite global de la API",
      "Un límite por tenant",
      "Un límite por endpoint",
    ],
    respuestaCorrecta: 1,
    explicacion: "El global castiga a todos por igual cuando se alcanza.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué resuelve la carrera entre dos requests con la misma idempotency key?",
    opciones: [
      "Un SELECT previo que verifique si la clave ya existe",
      "Guardar la respuesta en un Map en memoria del proceso",
      "Un INSERT con restricción UNIQUE: solo una request gana",
    ],
    respuestaCorrecta: 2,
    explicacion: "Verificar y después actuar sin atomicidad deja pasar a las dos.",
  },
  {
    pregunta: "Llega la misma clave con un cuerpo distinto. ¿Qué respondés?",
    opciones: [
      "422: la clave ya se usó con otro contenido",
      "200 con la respuesta guardada de la primera",
      "Proceso el cuerpo nuevo como otra operación",
    ],
    respuestaCorrecta: 0,
    explicacion: "Devolver la respuesta anterior sería un error silencioso.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Tu API llama a un proveedor de pagos. ¿Cómo evitás un doble cobro al reintentar?",
    opciones: [
      "Reintentar solo si el proveedor respondió 5xx",
      "Pasarle al proveedor una clave de idempotencia por operación",
      "No reintentar nunca las llamadas al proveedor",
    ],
    respuestaCorrecta: 1,
    explicacion: "La idempotencia tiene que propagarse a cada paso.",
  },
  {
    pregunta: "Redis, que guarda los contadores del rate limiter, no responde. ¿Qué es fail open?",
    opciones: [
      "Rechazar todas las requests hasta que Redis vuelva",
      "Pasar a un límite fijo guardado en cada instancia",
      "Dejar pasar las requests sin limitar mientras tanto",
    ],
    respuestaCorrecta: 2,
    explicacion: "Prioriza disponibilidad a costa de quedar sin protección un rato.",
  },
];

export default function IdempotenciaRateLimitingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Idempotencia y rate limiting a nivel de diseño"
      descripcion="Cómo diseñar un sistema donde reintentar es seguro y ningún cliente puede quedarse con la capacidad de todos."
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
            <strong className="text-foreground">Idempotencia</strong>: los
            reintentos son inevitables, así que las operaciones que crean, cobran
            o incrementan necesitan una clave. Métodos idempotentes y{" "}
            <code>Idempotency-Key</code> básico están en HTTP.
          </p>
          <p>
            <strong className="text-foreground">Rate limiting</strong> en capas:
            borde, identidad, costo por endpoint y dependencias. Algoritmos y
            Redis están en el módulo de Backend.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <IdempotenciaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Guardar las respuestas en la memoria de la instancia.</strong>{" "}
            El reintento cae en otra instancia y no las encuentra.
          </li>
          <li>
            <strong className="text-foreground">Un solo límite global.</strong>{" "}
            Cuando un cliente lo agota, lo pagan todos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Idempotency keys en la creación de pagos y pedidos.</li>
          <li>Un límite saliente compartido para respetar el rate limit de un proveedor.</li>
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
            <strong className="text-foreground">Idempotency keys</strong>:
            clave por cliente, huella del request, estado, respuesta guardada,
            UNIQUE para la carrera y vencimiento.
          </p>
          <p>
            <strong className="text-foreground">Equidad</strong>: límites por
            tenant y por costo, colas justas, recursos dedicados para los
            clientes grandes, y 429 con información de cuota.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Guardar un error reintentable como respuesta final.</strong>{" "}
            El reintento recibe el mismo error aunque el problema ya se resolvió.
          </li>
          <li>
            <strong className="text-foreground">Claves &quot;en proceso&quot; sin vencimiento.</strong>{" "}
            Si la instancia se cae, la clave queda bloqueada para siempre.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Headers de cuota restante para que los clientes se autorregulen.</li>
          <li>Una cola de exportaciones con prioridad justa entre tenants.</li>
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
            <strong className="text-foreground">Varios pasos</strong>: claves
            propagadas a los proveedores, tablas de deduplicación, claves
            naturales y flujos como máquinas de estado persistidas.
          </p>
          <p>
            <strong className="text-foreground">Diseñar un rate limiter</strong>:
            requisitos, ubicación, algoritmo, estado compartido y atómico,
            escala, fail open o closed, e interfaz.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Idempotencia solo en la entrada.</strong>{" "}
            La API deduplica, pero la llamada interna al proveedor cobra dos veces.
          </li>
          <li>
            <strong className="text-foreground">No decidir qué hacer si el limitador falla.</strong>{" "}
            La decisión se toma sola, en el peor momento.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un UNIQUE sobre (pedido_id, tipo) para no enviar dos veces la misma notificación.</li>
          <li>Un workflow en Temporal que retoma desde el último paso confirmado.</li>
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
            Una API de envío de SMS para empresas: cada cliente manda campañas
            por API, el sistema cobra por mensaje y los entrega a través de un
            proveedor que acepta 500 mensajes por segundo en total. Un cliente
            grande manda 2 millones de SMS de golpe y los demás se quejan de
            demoras; además, algunos clientes reportan SMS duplicados y cobros
            dobles. Diseñá la solución.
          </p>
          <RevelarSolucion>
            <p>
              Duplicados: la API de envío exige una idempotency key por mensaje
              (o por campaña, más un id por destinatario), guardada con UNIQUE
              junto al cobro en la misma transacción; el worker que llama al
              proveedor deduplica por id de mensaje y le pasa al proveedor una
              referencia propia, para no reenviar un SMS ya aceptado al
              reintentar. Equidad: los mensajes no van a una única cola FIFO,
              donde la campaña grande bloquea a todos, sino a colas por cliente
              consumidas con fair queuing (round-robin o ponderado por plan),
              así cada cliente recibe su parte de los 500 por segundo. El límite
              del proveedor se respeta con un token bucket compartido por todos
              los workers. Límites de entrada por cliente según su plan, con 429
              y cuota restante, y una estimación del tiempo de entrega de la
              campaña que se muestra al cliente en vez de aceptar todo sin
              avisar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
