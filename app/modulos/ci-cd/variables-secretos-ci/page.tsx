import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { SecretosCiSimulador } from "@/components/modulo/SecretosCiSimulador";
import { entrevistaVariablesSecretosCi } from "@/lib/modules/ci-cd/variables-secretos-ci-entrevista";

const preguntasPorNivel = {
  1: entrevistaVariablesSecretosCi.filter((p) => p.nivel === 1),
  2: entrevistaVariablesSecretosCi.filter((p) => p.nivel === 2),
  3: entrevistaVariablesSecretosCi.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Variables y secretos en CI — Dev Study Lab",
  description:
    "Variables vs secretos, configuración por entorno, build vs runtime, límites del enmascarado, OIDC y trust policies, y secretos que no pasan por el pipeline.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "La URL pública de la API de staging, ¿variable o secreto?",
    opciones: ["Secreto", "Variable", "Hardcodeada en el código"],
    respuestaCorrecta: 1,
    explicacion: "Filtrarla no le da acceso a nadie: es configuración no sensible.",
  },
  {
    pregunta: "Falta DATABASE_URL en producción. ¿Cuándo debería enterarse el equipo?",
    opciones: [
      "Cuando un usuario use la funcionalidad",
      "Al arrancar la app, que no debería levantar sin ella",
      "En el próximo deploy",
    ],
    respuestaCorrecta: 1,
    explicacion: "Validar la configuración al arrancar convierte un bug latente en un error inmediato.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa con NEXT_PUBLIC_API_URL al hacer el build?",
    opciones: [
      "Se lee en cada request",
      "Su valor queda grabado en el JavaScript del cliente",
      "Se encripta",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso ese build no se puede promover a otro entorno con otra URL.",
  },
  {
    pregunta: "Un script imprime el secreto codificado en base64. ¿Lo enmascara el CI?",
    opciones: ["Sí, siempre", "No: el enmascarado busca el valor exacto", "Solo en repos privados"],
    respuestaCorrecta: 1,
    explicacion: "Cualquier transformación del valor esquiva el enmascarado.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué condición de la trust policy deja que cualquier branch asuma el rol de producción?",
    opciones: [
      'sub = "repo:org/repo:environment:production"',
      'sub like "repo:org/repo:*"',
      'aud = "sts.amazonaws.com"',
    ],
    respuestaCorrecta: 1,
    explicacion: "El comodín acepta cualquier ref o PR del repositorio.",
  },
  {
    pregunta: "¿Qué gana la app al leer sus secretos de un secret manager en runtime?",
    opciones: [
      "Arranca más rápido",
      "El CI no necesita conocer las credenciales de producción",
      "No hace falta rotarlos",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un pipeline comprometido puede desplegar, pero no leer la base.",
  },
];

export default function VariablesSecretosCiPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Variables y secretos en CI"
      descripcion="Cómo llega la configuración de cada entorno al pipeline y a la app, sin que un secreto termine en un log o en un fork."
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
            <strong className="text-foreground">Variables</strong> para
            configuración no sensible, <strong className="text-foreground">secretos</strong>{" "}
            para lo que da acceso a algo. Se definen por organización, repo o
            environment, y gana el nivel más específico.
          </p>
          <p>
            Un artefacto para todos los entornos, configuración por variables de
            entorno, validada al arrancar. El manejo general de secretos (dónde
            guardarlos, rotación, KMS) está en el módulo de Seguridad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <SecretosCiSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un <code>.env</code> commiteado.</strong>{" "}
            Aunque se borre después, queda en el historial de git.
          </li>
          <li>
            <strong className="text-foreground">Configuración sin validar.</strong>{" "}
            Una variable faltante explota en producción recién cuando alguien usa esa función.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Environments staging y production con su propio DATABASE_URL.</li>
          <li>Un <code>.env.example</code> commiteado que documenta qué variables hacen falta.</li>
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
            <strong className="text-foreground">Build vs runtime</strong>: lo que
            se graba en el artefacto al construir (como <code>NEXT_PUBLIC_</code>)
            no se puede cambiar por entorno sin reconstruir.
          </p>
          <p>
            <strong className="text-foreground">Enmascarado</strong>: reemplaza el
            valor exacto en los logs, nada más. Transformaciones, artifacts,
            caches e imágenes quedan afuera.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un secreto con prefijo <code>NEXT_PUBLIC_</code>.</strong>{" "}
            Termina en el bundle que descarga cualquiera.
          </li>
          <li>
            <strong className="text-foreground"><code>set -x</code> en un script de deploy.</strong>{" "}
            Imprime cada comando con sus variables expandidas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Pasar la URL de la API al cliente desde el servidor, para promover un solo build.</li>
          <li>Enmascarar con <code>::add-mask::</code> un token obtenido durante el job.</li>
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
            <strong className="text-foreground">OIDC</strong>: el workflow
            cambia un JWT de GitHub por credenciales temporales; la seguridad
            depende de las condiciones sobre <code>sub</code> en la trust policy.
          </p>
          <p>
            <strong className="text-foreground">Secretos fuera del pipeline</strong>:
            la app los lee en runtime con su propia identidad, y el CI solo puede
            desplegar.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Comodines en <code>sub</code>.</strong>{" "}
            Cualquier branch o PR asume el rol de producción.
          </li>
          <li>
            <strong className="text-foreground">Un solo rol para todos los entornos.</strong>{" "}
            Un job de staging comprometido llega a producción.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Deploy a AWS sin claves guardadas, con un rol atado a environment:production.</li>
          <li>Una API en ECS que lee su contraseña de base desde Secrets Manager al arrancar.</li>
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
            Hoy el repo tiene como secretos <code>AWS_ACCESS_KEY_ID</code>,{" "}
            <code>AWS_SECRET_ACCESS_KEY</code> (de un usuario IAM con permisos de
            administrador) y <code>PROD_DATABASE_URL</code>, disponibles para
            cualquier workflow. Un solo job despliega a staging y a producción
            según el branch. Rediseñalo.
          </p>
          <RevelarSolucion>
            <p>
              1) Borrar las claves de AWS y rotarlas (asumir que ya se filtraron
              en algún log o fork): OIDC con dos roles, uno por entorno, con
              permisos mínimos para desplegar (no administrador), y trust
              policies atadas a <code>environment:staging</code> y{" "}
              <code>environment:production</code>. 2) Dos environments en GitHub:
              production con revisores requeridos y solo desde main. 3) Dos jobs
              de deploy, cada uno con su environment y{" "}
              <code>permissions: id-token: write, contents: read</code>. 4){" "}
              <code>PROD_DATABASE_URL</code> fuera del CI: en AWS Secrets
              Manager, leída por la app en runtime con el rol de su tarea; el
              pipeline ya no necesita conocerla. 5) Si igual hace falta un
              secreto en CI (por ejemplo, para correr migraciones), como secreto
              del environment production, no del repo, para que solo lo vea el
              job aprobado.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
