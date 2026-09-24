import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { DeploySimulador } from "@/components/modulo/DeploySimulador";
import { entrevistaEstrategiasDeploy } from "@/lib/modules/ci-cd/estrategias-deploy-entrevista";

const preguntasPorNivel = {
  1: entrevistaEstrategiasDeploy.filter((p) => p.nivel === 1),
  2: entrevistaEstrategiasDeploy.filter((p) => p.nivel === 2),
  3: entrevistaEstrategiasDeploy.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Estrategias de deploy — Dev Study Lab",
  description:
    "Recreate, rolling, blue-green y canary; rollback, graceful shutdown, convivencia de versiones, deploy vs release y métricas DORA.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué estrategia tiene rollback instantáneo con un switch del balanceador?",
    opciones: ["Recreate", "Rolling", "Blue-green"],
    respuestaCorrecta: 2,
    explicacion: "El entorno anterior sigue levantado; volver es apuntar el tráfico de nuevo a él.",
  },
  {
    pregunta: "¿Cuál es la forma más confiable de volver atrás un deploy?",
    opciones: [
      "Revertir el commit y reconstruir",
      "Desplegar el artefacto anterior, ya construido y probado",
      "Editar el código en el servidor",
    ],
    respuestaCorrecta: 1,
    explicacion: "Reconstruir puede producir algo distinto y tarda más.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué necesita un canary para ser útil?",
    opciones: [
      "El doble de servidores",
      "Métricas por versión (errores, latencia) para decidir si avanzar",
      "Un solo servidor",
    ],
    respuestaCorrecta: 1,
    explicacion: "Sin datos de la versión nueva, no hay con qué decidir.",
  },
  {
    pregunta: "¿Qué debería hacer la app al recibir SIGTERM?",
    opciones: [
      "Salir inmediatamente",
      "Dejar de aceptar conexiones nuevas, terminar las activas y salir",
      "Ignorarla",
    ],
    respuestaCorrecta: 1,
    explicacion: "Es el graceful shutdown que evita cortar requests durante el deploy.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Durante un rolling, un worker v1 recibe un mensaje producido por v2. ¿Qué lo hace seguro?",
    opciones: [
      "Nada, siempre falla",
      "Formatos de mensaje versionados y consumidores tolerantes a campos nuevos",
      "Apagar la cola durante el deploy",
    ],
    respuestaCorrecta: 1,
    explicacion: "Los mensajes son un contrato entre versiones, como una API.",
  },
  {
    pregunta: "¿Cuál de estas es una métrica DORA?",
    opciones: ["Cobertura de tests", "Tasa de falla de cambios", "Líneas de código por día"],
    respuestaCorrecta: 1,
    explicacion: "Junto con frecuencia de deploy, lead time y tiempo de recuperación.",
  },
];

export default function EstrategiasDeployPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Estrategias de deploy"
      descripcion="Cómo pasar de la versión vieja a la nueva sin cortar el servicio, y cuánto daño hace un bug según cómo lo hagas."
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
            <strong className="text-foreground">Recreate</strong> (con downtime),{" "}
            <strong className="text-foreground">rolling</strong> (de a tandas),{" "}
            <strong className="text-foreground">blue-green</strong> (dos entornos
            y un switch) y <strong className="text-foreground">canary</strong>{" "}
            (un porcentaje de tráfico que crece si las métricas acompañan).
          </p>
          <p>
            El rollback más confiable es desplegar el artefacto anterior, siempre
            que las migraciones sean compatibles hacia atrás.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <DeploySimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Rollback que reconstruye.</strong>{" "}
            Más lento y puede producir un artefacto distinto al que funcionaba.
          </li>
          <li>
            <strong className="text-foreground">Migraciones incompatibles en el mismo deploy.</strong>{" "}
            Si hay que volver atrás, la versión vieja tampoco funciona.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Rolling en Kubernetes para una API sin estado.</li>
          <li>Rollback instantáneo en Vercel a un deploy anterior.</li>
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
            <strong className="text-foreground">Blue-green vs canary</strong>:
            rollback instantáneo y pruebas previas contra radio de impacto
            acotado y decisiones con métricas reales.
          </p>
          <p>
            <strong className="text-foreground">Sin cortar requests</strong>:
            readiness checks al arrancar, graceful shutdown al apagar, y{" "}
            <code>maxSurge</code>/<code>maxUnavailable</code> para el ritmo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Readiness igual a liveness.</strong>{" "}
            La instancia recibe tráfico antes de poder atenderlo.
          </li>
          <li>
            <strong className="text-foreground">Canary con poco tráfico.</strong>{" "}
            El 5% son tan pocas requests que un error no se distingue del ruido.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Canary automático con Argo Rollouts o Flagger según la tasa de errores.</li>
          <li>Blue-green para un cambio grande de infraestructura.</li>
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
            <strong className="text-foreground">Convivencia de versiones</strong>:
            base, colas, caché, sesiones, conexiones largas y clientes viejos
            tienen que funcionar con v1 y v2 a la vez.
          </p>
          <p>
            <strong className="text-foreground">Deploy vs release</strong>: el
            código llega apagado y se activa aparte. Las métricas DORA miden el
            proceso: frecuencia, lead time, tasa de falla y tiempo de
            recuperación.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cambiar la forma de un objeto cacheado.</strong>{" "}
            v1 lee lo que escribió v2 y falla; versionar las claves.
          </li>
          <li>
            <strong className="text-foreground">Deploys grandes y poco frecuentes.</strong>{" "}
            Más difíciles de entender, de probar y de revertir.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Shadow traffic para validar una reescritura del motor de precios.</li>
          <li>Un canary interno: primero los empleados, después todos.</li>
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
            Un checkout procesa pagos. El equipo va a desplegar una versión que
            cambia el formato de los eventos <code>pago.confirmado</code> que
            consume el servicio de facturación, y agrega una columna a la tabla{" "}
            <code>pagos</code>. Un error acá cuesta plata. Diseñá el deploy.
          </p>
          <RevelarSolucion>
            <p>
              Separarlo en pasos compatibles. 1) Migración expand: la columna
              nueva nullable, en un deploy propio. 2) Facturación primero: que
              acepte el formato viejo y el nuevo del evento (consumidor
              tolerante), y desplegarla. 3) Checkout con canary: 1% del tráfico,
              comparando por versión la tasa de pagos fallidos, la latencia y los
              errores de facturación; avance automático a 10%, 50% y 100% si las
              métricas no empeoran, y rollback automático si empeoran. Como
              facturación ya acepta los dos formatos, v1 y v2 del checkout
              pueden convivir. 4) La lógica nueva, además, detrás de un feature
              flag, para poder apagarla sin redeploy. 5) Cuando todo el tráfico
              está en v2 y pasó un tiempo prudente: quitar el soporte del formato
              viejo en facturación y hacer el contract de la migración si hace
              falta.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
