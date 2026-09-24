import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ColaJobsSimulador } from "@/components/modulo/ColaJobsSimulador";
import { entrevistaColasJobs } from "@/lib/modules/backend/colas-jobs-entrevista";

const preguntasPorNivel = {
  1: entrevistaColasJobs.filter((p) => p.nivel === 1),
  2: entrevistaColasJobs.filter((p) => p.nivel === 2),
  3: entrevistaColasJobs.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Colas y jobs asíncronos (BullMQ) — Dev Study Lab",
  description:
    "Trabajo en segundo plano: cuándo encolar, reintentos con backoff, cola de fallidos, idempotencia, concurrencia, outbox y operación.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estas tareas conviene sacar del request y encolar?",
    opciones: [
      "Enviar el email de bienvenida",
      "Validar el body del registro",
      "Chequear que el email no exista",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El usuario no necesita esperarlo, y si el proveedor falla se reintenta después.",
  },
  {
    pregunta: "Un job falla siempre porque el email del usuario es inválido. ¿Qué debería pasar?",
    opciones: [
      "Reintentarlo con backoff hasta que el email se corrija",
      "Agotar los intentos (o marcarlo no reintentable) e ir a fallidos",
      "Borrarlo de la cola para que no bloquee a los demás",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los reintentos arreglan fallas transitorias, no datos inválidos.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un worker manda el email y se cae antes de marcar el job como completo. ¿Qué pasa?",
    opciones: [
      "El job se pierde, porque ya salió de la cola",
      "Queda marcado como completado por timeout",
      "Se vuelve a ejecutar: por eso tiene que ser idempotente",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Las colas garantizan al menos una vez, no exactamente una vez.",
  },
  {
    pregunta: "Tu proveedor de emails acepta 10 por segundo. ¿Cómo lo respetás con muchos workers?",
    opciones: [
      "Con el rate limiter de la cola, coordinado en Redis entre todos los workers",
      "Con un setTimeout de 100 ms en cada worker entre email y email",
      "Con concurrency: 10 en cada worker, que es el límite del proveedor",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El límite se aplica a la cola, no a cada worker por separado.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo asegurás que el job se encole solo si la transacción se confirmó?",
    opciones: [
      "Encolando el job antes del commit, dentro del mismo try",
      "Outbox en la misma transacción, o una cola respaldada por la misma base",
      "Encolando después del commit, que ya garantiza que el job sale",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Encolar es parte de la misma unidad atómica que el cambio de datos.",
  },
  {
    pregunta: "¿Qué métrica refleja mejor lo que siente el usuario?",
    opciones: [
      "La duración de cada job una vez que empieza",
      "La cantidad de jobs completados por minuto",
      "Cuánto tarda un job desde que se encola hasta que empieza",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Junto con la profundidad de la cola, es la base para alertar y autoescalar.",
  },
];

export default function ColasJobsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Colas y jobs asíncronos (BullMQ)"
      descripcion="Sacar del request el trabajo lento o poco confiable, y procesarlo en segundo plano sin perderlo ni duplicarlo."
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
            El request encola un <strong className="text-foreground">job</strong>{" "}
            y responde; <strong className="text-foreground">workers</strong> en
            otro proceso lo ejecutan. Para emails, PDFs, imágenes, llamadas a
            terceros y tareas programadas. En Node, BullMQ sobre Redis.
          </p>
          <p>
            Los fallos transitorios se resuelven con{" "}
            <strong className="text-foreground">reintentos y backoff</strong>;
            los permanentes terminan en la{" "}
            <strong className="text-foreground">cola de fallidos</strong> para
            revisarlos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ColaJobsSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Sin límite de intentos.</strong>{" "}
            Un job roto se reintenta para siempre.
          </li>
          <li>
            <strong className="text-foreground">Nadie mira la cola de fallidos.</strong>{" "}
            Los errores se acumulan en silencio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Emails transaccionales con 5 intentos y backoff exponencial.</li>
          <li>Un job programado que limpia sesiones vencidas cada noche.</li>
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
            Entrega <strong className="text-foreground">al menos una vez</strong>:
            los jobs tienen que ser idempotentes (jobId determinístico, registrar
            efectos, idempotency keys, guardar solo ids).
          </p>
          <p>
            <strong className="text-foreground">Concurrencia</strong> alta para
            I/O, baja para CPU; <strong className="text-foreground">rate
            limit</strong> por cola para respetar a los proveedores; colas
            separadas por tipo y prioridad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Newsletter y emails transaccionales en la misma cola.</strong>{" "}
            El de &quot;restablecer contraseña&quot; espera detrás de 100.000.
          </li>
          <li>
            <strong className="text-foreground">Payload completo en el job.</strong>{" "}
            Se procesa con datos que ya cambiaron.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li><code>limiter: {"{ max: 10, duration: 1000 }"}</code> en la cola de emails.</li>
          <li>Workers de PDFs separados, con concurrencia baja.</li>
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
            <strong className="text-foreground">Encolar y confirmar</strong> son
            dos escrituras: outbox en la misma transacción, o una cola sobre la
            misma base (pg-boss, Graphile Worker) donde encolar es un INSERT.
          </p>
          <p>
            <strong className="text-foreground">Operar</strong> colas requiere
            métricas de profundidad y latencia de espera, alertas, autoescalado,
            un panel para reprocesar, pausas, cierre ordenado y versionado de
            payloads.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Encolar dentro de una transacción que después hace rollback.</strong>{" "}
            El worker procesa algo que no existe.
          </li>
          <li>
            <strong className="text-foreground">Cambiar la forma del payload sin compatibilidad.</strong>{" "}
            Los jobs viejos rompen a los workers nuevos durante el deploy.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Autoescalar workers según la profundidad de la cola.</li>
          <li>Bull Board para inspeccionar y reprocesar fallidos.</li>
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
          <p>¿Qué problemas tiene este flujo de alta de pedido?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`await db.$transaction(async (tx) => {
  const pedido = await tx.pedido.create({ data });
  await cola.add("facturar", { pedido });            // payload completo
  await cola.add("email", { pedidoId: pedido.id });
  await tx.stock.update({ ... });                    // puede fallar y hacer rollback
});

new Worker("facturar", async (job) => {
  await afip.emitirFactura(job.data.pedido);         // sin idempotencia
});`}
          </pre>
          <RevelarSolucion>
            <p>
              1) Se encola dentro de la transacción: si el update de stock falla
              y hace rollback, los jobs ya están en Redis y se factura y se manda
              el email de un pedido que no existe. Solución: outbox en la misma
              transacción, o una cola sobre la base. 2) El job de facturación
              lleva el pedido completo: si cambia antes de procesarse, se
              factura con datos viejos; mejor el id y leer el estado actual. 3)
              El worker de facturación no es idempotente: un reintento o un job
              estancado emite dos facturas; hay que registrar la factura emitida
              por pedido (con constraint único) y verificar antes, o usar una
              clave de idempotencia con el proveedor. 4) Falta configurar
              intentos, backoff y alertas sobre la cola de fallidos.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
