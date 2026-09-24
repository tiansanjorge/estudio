import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PipelineSimulador } from "@/components/modulo/PipelineSimulador";
import { entrevistaPipelinesGithubActions } from "@/lib/modules/ci-cd/pipelines-github-actions-entrevista";

const preguntasPorNivel = {
  1: entrevistaPipelinesGithubActions.filter((p) => p.nivel === 1),
  2: entrevistaPipelinesGithubActions.filter((p) => p.nivel === 2),
  3: entrevistaPipelinesGithubActions.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Pipelines (GitHub Actions) — Dev Study Lab",
  description:
    "CI vs delivery vs deployment, anatomía de un workflow, cache y paralelismo, protección de main, seguridad de Actions y pipelines que escalan.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia a continuous deployment de continuous delivery?",
    opciones: [
      "Ninguna",
      "En deployment, cada cambio que pasa el pipeline llega a producción sin intervención",
      "Delivery no corre tests",
    ],
    respuestaCorrecta: 1,
    explicacion: "En delivery el cambio queda listo, pero alguien decide cuándo desplegarlo.",
  },
  {
    pregunta: "Dos jobs de un workflow sin needs, ¿cómo corren?",
    opciones: [
      "En orden, en la misma máquina",
      "En paralelo, cada uno en un runner nuevo",
      "Solo corre el primero",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso cada job hace su propio checkout e instalación.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Llegan tres pushes seguidos al mismo PR. ¿Qué evita correr tres pipelines completos?",
    opciones: ["Un cron", "concurrency con cancel-in-progress", "Más runners"],
    respuestaCorrecta: 1,
    explicacion: "Cada push nuevo cancela la ejecución anterior del mismo grupo.",
  },
  {
    pregunta: "¿Qué resuelve una merge queue?",
    opciones: [
      "Que los PRs se revisen más rápido",
      "Que dos PRs que pasan por separado no rompan main al combinarse",
      "Que no haga falta CI",
    ],
    respuestaCorrecta: 1,
    explicacion: "Prueba cada PR junto con los que tiene adelante en la cola.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué fijar las actions de terceros a un SHA en vez de a un tag?",
    opciones: [
      "Porque es más rápido",
      "Porque el dueño puede mover un tag a otro código; un SHA es inmutable",
      "Porque GitHub lo exige",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un tag movido a código malicioso tendría acceso a tus secretos.",
  },
  {
    pregunta: "¿Qué significa build once, deploy many?",
    opciones: [
      "Desplegar muchas veces por día",
      "Construir un artefacto una vez y promover ese mismo artefacto por todos los entornos",
      "Tener un solo entorno",
    ],
    respuestaCorrecta: 1,
    explicacion: "Así lo que se probó en staging es exactamente lo que llega a producción.",
  },
];

export default function PipelinesGithubActionsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Pipelines (GitHub Actions)"
      descripcion="El camino automático de un commit a producción: qué verifica, cómo se hace rápido y cómo no se convierte en un agujero de seguridad."
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
            <strong className="text-foreground">CI</strong>: integrar seguido y
            verificar cada push automáticamente (lint, typecheck, tests, build).{" "}
            <strong className="text-foreground">CD</strong>: dejar cada cambio
            listo para producción (delivery) o desplegarlo solo (deployment).
          </p>
          <p>
            En GitHub Actions, un workflow tiene triggers, jobs que corren en
            runners nuevos (en paralelo salvo que declaren <code>needs</code>) y
            steps dentro de cada job.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PipelineSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Deploys manuales desde una laptop.</strong>{" "}
            Nadie sabe qué versión está en producción ni cómo llegó.
          </li>
          <li>
            <strong className="text-foreground">Paralelizar sin cache.</strong>{" "}
            Cada job reinstala todo y el total puede empeorar, como muestra el playground.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Correr lint, typecheck y tests en cada PR antes de permitir el merge.</li>
          <li>Desplegar automáticamente a producción al mergear a main.</li>
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
            <strong className="text-foreground">Velocidad</strong>: medir, cachear,
            paralelizar con shards, correr solo lo afectado, cancelar ejecuciones
            obsoletas y ordenar para fallar rápido.
          </p>
          <p>
            <strong className="text-foreground">Protección de main</strong>:
            checks requeridos, review, preview deploys, environments con
            aprobación y merge queue.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">e2e completos en cada push de un borrador.</strong>{" "}
            Minutos facturados y feedback lento para cambios que todavía no están listos.
          </li>
          <li>
            <strong className="text-foreground">Checks opcionales.</strong>{" "}
            Si no son requeridos, alguien mergea con el pipeline en rojo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Partir 2.000 tests en 4 shards con una matrix.</li>
          <li>Un environment &quot;production&quot; con aprobación manual.</li>
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
            <strong className="text-foreground">Seguridad</strong>: actions
            fijadas a SHA, <code>permissions</code> mínimos, nada de interpolar
            input del usuario en <code>run</code>, cuidado con{" "}
            <code>pull_request_target</code>, y OIDC en vez de claves de larga
            vida.
          </p>
          <p>
            <strong className="text-foreground">Escala</strong>: cuarentena de
            tests flaky, build once / deploy many, builds afectados en monorepos y
            entornos reproducibles.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Reintentar tests flaky hasta que pasen.</strong>{" "}
            El equipo aprende a ignorar el rojo y un fallo real se escapa.
          </li>
          <li>
            <strong className="text-foreground">Reconstruir la app en cada entorno.</strong>{" "}
            Staging y producción terminan corriendo artefactos distintos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Deploy a AWS con credenciales temporales por OIDC.</li>
          <li>Un monorepo que solo testea los paquetes afectados con Turborepo.</li>
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
            Este workflow comenta en cada PR (incluidos los de forks) con el
            resultado de los tests. Encontrá los problemas de seguridad.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`on: pull_request_target

jobs:
  comentar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - uses: un-usuario/comentar-pr@v2
      - run: npm ci && npm test
      - run: echo "Tests de: \${{ github.event.pull_request.title }}"
        env:
          NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`}
          </pre>
          <RevelarSolucion>
            <p>
              Cuatro problemas. 1) <code>pull_request_target</code> corre con los
              secretos y un token con permisos de escritura del repo base, y el
              workflow hace checkout del código del PR y lo ejecuta (
              <code>npm ci</code> corre scripts de instalación, <code>npm test</code>{" "}
              corre lo que el fork quiera): cualquiera puede robar secretos con un
              PR. 2) El título del PR se interpola en <code>run</code>: script
              injection. 3) La action de terceros va por tag, no por SHA. 4) No
              declara <code>permissions</code> y el secreto está expuesto a un
              step que no lo necesita. La solución: correr los tests con{" "}
              <code>pull_request</code> (sin secretos, token de solo lectura),
              subir el resultado como artifact, y comentar desde un segundo
              workflow disparado por <code>workflow_run</code> que solo lee ese
              artifact sin ejecutar código del PR, con{" "}
              <code>permissions: pull-requests: write</code>, la action fijada a
              SHA y el título pasado por variable de entorno.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
