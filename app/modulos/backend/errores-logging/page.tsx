import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { LogsErroresSimulador } from "@/components/modulo/LogsErroresSimulador";
import { entrevistaErroresLogging } from "@/lib/modules/backend/errores-logging-entrevista";

const preguntasPorNivel = {
  1: entrevistaErroresLogging.filter((p) => p.nivel === 1),
  2: entrevistaErroresLogging.filter((p) => p.nivel === 2),
  3: entrevistaErroresLogging.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Manejo de errores y logging — Dev Study Lab",
  description:
    "Errores esperados vs inesperados, manejo centralizado, logs estructurados, qué no loguear, tracing distribuido y alertas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un usuario pide un pedido que no existe. ¿Qué tipo de error es?",
    opciones: [
      "Un bug inesperado (500)",
      "Un error esperado del dominio, que se traduce a 404",
      "No es un error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los errores esperados se modelan tipados y se traducen a respuestas con sentido.",
  },
  {
    pregunta: "¿Qué permite reconstruir el recorrido de un request entre líneas de log intercaladas?",
    opciones: ["El timestamp", "Un requestId en cada línea", "El nivel de log"],
    respuestaCorrecta: 1,
    explicacion:
      "Con logs estructurados se filtra por ese campo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace la opción redact de pino?",
    opciones: [
      "Comprime los logs",
      "Reemplaza campos sensibles (tokens, contraseñas) antes de escribir el log",
      "Borra los logs viejos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Evita que un objeto logueado entero filtre credenciales.",
  },
  {
    pregunta: "Ante un uncaughtException, ¿qué conviene hacer?",
    opciones: [
      "Ignorarlo y seguir",
      "Loguearlo, intentar un cierre ordenado y dejar que el orquestador reinicie",
      "Reintentar la operación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El proceso puede haber quedado en un estado inconsistente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué header estándar propaga el contexto de una traza entre servicios?",
    opciones: ["x-powered-by", "traceparent (W3C Trace Context)", "cache-control"],
    respuestaCorrecta: 1,
    explicacion:
      "OpenTelemetry lo propaga y lo lee automáticamente.",
  },
  {
    pregunta: "¿Sobre qué conviene alertar?",
    opciones: [
      "Cada error individual",
      "Síntomas que ve el usuario (tasa de errores, latencia p95) respecto de un SLO",
      "CPU arriba del 50%",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las alertas por causas internas generan fatiga y se terminan ignorando.",
  },
];

export default function ErroresLoggingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Manejo de errores y logging"
      descripcion="Qué hacer cuando algo falla: responder con sentido al cliente, dejar el rastro suficiente para entender qué pasó, y enterarse antes que el usuario."
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
            Errores <strong className="text-foreground">esperados</strong>{" "}
            (no encontrado, sin stock, proveedor caído): tipados, con un código
            estable y un status con sentido. Errores{" "}
            <strong className="text-foreground">inesperados</strong> (bugs): 500
            genérico, log completo y alerta. La traducción a HTTP va en un solo
            manejador central.
          </p>
          <p>
            Los <strong className="text-foreground">logs estructurados</strong>{" "}
            (JSON con nivel, requestId y contexto) permiten filtrar y
            reconstruir lo que le pasó a un request puntual entre miles.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <LogsErroresSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground"><code>catch (e) {"{}"}</code> vacío.</strong>{" "}
            El error desaparece y el bug queda escondido.
          </li>
          <li>
            <strong className="text-foreground">Stack traces en la respuesta.</strong>{" "}
            Información útil para un atacante, inútil para el cliente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un error middleware que traduce errores de dominio a Problem Details.</li>
          <li>pino con un child logger por request.</li>
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
            Nunca en los logs: contraseñas, tokens, headers de autorización,
            tarjetas ni datos personales de más. Redacción automática en el
            logger y campos específicos en vez de objetos enteros.
          </p>
          <p>
            Los errores no capturados indican un bug: loguear, cierre ordenado y
            reinicio. La prevención es no dejar promesas flotando y capturar los
            rechazos de los handlers async.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Loguear el error de una librería HTTP completo.</strong>{" "}
            Muchas incluyen los headers del request, con el token.
          </li>
          <li>
            <strong className="text-foreground"><code>process.on(&quot;uncaughtException&quot;)</code> que no hace nada.</strong>{" "}
            El proceso sigue en un estado que nadie conoce.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Configurar <code>redact</code> en el logger del proyecto.</li>
          <li>Activar <code>no-floating-promises</code> en ESLint.</li>
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
            <strong className="text-foreground">Tracing distribuido</strong>:
            un id de traza propagado con <code>traceparent</code>, spans por
            etapa y OpenTelemetry para instrumentar. Dentro del proceso,{" "}
            <code>AsyncLocalStorage</code> mantiene el contexto sin pasarlo a
            mano.
          </p>
          <p>
            Logs para investigar, métricas para dashboards y alertas, trazas
            para ver el recorrido. Las alertas, sobre síntomas del usuario
            medidos contra SLOs.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Cada servicio con su propio id de request.</strong>{" "}
            No se pueden unir los logs de una misma operación.
          </li>
          <li>
            <strong className="text-foreground">Alertas por todo.</strong>{" "}
            El equipo las silencia y se pierde la importante.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>OpenTelemetry con auto-instrumentación y exportación a Grafana Tempo.</li>
          <li>Un SLO de 99,9% para el checkout con alertas por burn rate.</li>
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
          <p>¿Qué problemas de manejo de errores y logging tiene este código?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`app.post("/login", async (req, res) => {
  console.log("Login:", req.body);
  try {
    const usuario = await autenticar(req.body.email, req.body.password);
    res.json(usuario);
  } catch (e) {
    console.log(e);
    res.status(200).json({ ok: false, error: e.message });
  }
});`}
          </pre>
          <RevelarSolucion>
            <p>
              1) <code>console.log(&quot;Login:&quot;, req.body)</code> escribe
              la contraseña en los logs. 2) Logs en texto libre, sin nivel ni
              requestId: imposibles de correlacionar. 3) Responde 200 ante un
              error: el cliente, el monitoreo y los tests creen que salió bien.
              4) Mezcla errores esperados (credenciales inválidas → 401 con un
              mensaje genérico) con inesperados (la base caída → 500 y alerta),
              y además devuelve <code>e.message</code>, que puede filtrar
              detalles internos. 5) Devuelve el usuario completo, posiblemente
              con el hash. Mejor: logger estructurado con redact, errores de
              dominio tipados, un manejador central y un DTO de respuesta.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
