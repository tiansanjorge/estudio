import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EscanerSecretos } from "@/components/modulo/EscanerSecretos";
import { entrevistaSecretsManagement } from "@/lib/modules/seguridad/secrets-management-entrevista";

const preguntasPorNivel = {
  1: entrevistaSecretsManagement.filter((p) => p.nivel === 1),
  2: entrevistaSecretsManagement.filter((p) => p.nivel === 2),
  3: entrevistaSecretsManagement.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Secrets management — Dev Study Lab",
  description:
    "Dónde guardar secretos, el riesgo de NEXT_PUBLIC_, qué hacer ante una filtración, secretos en CI/CD, rotación y KMS.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué va en el repositorio respecto de las variables de entorno?",
    opciones: [
      "Un .env.example con los nombres, sin valores",
      "El .env de desarrollo, con valores de prueba",
      "Los .env de cada entorno, cifrados con git-crypt",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Documenta qué hace falta configurar sin exponer ningún valor.",
  },
  {
    pregunta: "¿Quién puede leer NEXT_PUBLIC_STRIPE_SECRET?",
    opciones: [
      "Solo el servidor, porque es una variable de entorno",
      "Cualquiera que abra el sitio: queda en el bundle",
      "Solo los Client Components, en runtime",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El prefijo hace que Next lo incruste en el JavaScript del cliente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Se pusheó una API key. ¿Cuál es el primer paso?",
    opciones: [
      "Reescribir el historial de git para borrarla",
      "Hacer el repositorio privado cuanto antes",
      "Rotar la clave en el proveedor",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El historial y los clones conservan el secreto; solo revocarlo cierra la exposición.",
  },
  {
    pregunta: "¿Qué evita guardar credenciales de larga vida del cloud en el CI?",
    opciones: [
      "OIDC con credenciales temporales por rol",
      "Guardarlas como secrets cifrados del repo",
      "Rotarlas a mano cada 90 días",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El workflow obtiene credenciales de corta duración según el repo y la rama.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace falta para rotar un secreto sin downtime?",
    opciones: [
      "Rotarlo en el horario de menor tráfico, con los servicios apagados",
      "Que durante la transición sean válidas la versión vieja y la nueva",
      "Guardarlo en un secret manager, que rota sin que la app se entere",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Se despliega el uso de la nueva y recién después se revoca la vieja.",
  },
  {
    pregunta: "En envelope encryption, ¿dónde vive la clave maestra?",
    opciones: [
      "Junto a los datos, cifrada con la data key",
      "En una variable de entorno de la aplicación",
      "En el KMS, y nunca sale de ahí",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "La app solo pide al KMS que descifre las data keys, con permisos y auditoría.",
  },
];

export default function SecretsManagementPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="Secrets management"
      descripcion="Mantener API keys, contraseñas y claves fuera del código, del bundle y de los logs, y qué hacer cuando igual se filtran."
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
            Un secreto nunca va al repositorio: el historial de git es
            permanente. En local, <code>.env</code> en el{" "}
            <code>.gitignore</code> y un <code>.env.example</code> con los
            nombres. En producción, las variables del proveedor de deploy o un{" "}
            <strong className="text-foreground">gestor de secretos</strong>{" "}
            (con cifrado, permisos, auditoría y rotación).
          </p>
          <p>
            En Next.js, todo lo que empieza con{" "}
            <code>NEXT_PUBLIC_</code> termina en el bundle del navegador. Si el
            cliente necesita un secreto, la llamada pasa por el servidor.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Escáner de secretos">
        <EscanerSecretos />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;Es un repo privado&quot;.</strong>{" "}
            Los accesos cambian, se clona en muchas máquinas y el historial es
            para siempre.
          </li>
          <li>
            <strong className="text-foreground">Secretos en los logs.</strong>{" "}
            Loguear el request completo con headers o el objeto de configuración.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un <code>env.ts</code> que valida las variables con Zod al arrancar.</li>
          <li>Una Route Handler que llama a un servicio con la clave secreta, en vez de exponerla.</li>
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
            Ante una filtración, <strong className="text-foreground">rotar
            primero</strong>: borrar el archivo no sirve. Después revisar logs,
            reconfigurar y, recién al final, limpiar el historial.
          </p>
          <p>
            En <strong className="text-foreground">CI/CD</strong>: OIDC con
            credenciales temporales en vez de claves de larga vida, secretos por
            entorno con aprobación para producción, sin acceso desde forks,
            acciones fijadas por hash y <code>permissions</code> mínimos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Actions de terceros sin fijar versión.</strong>{" "}
            Una versión comprometida corre con tus secretos.
          </li>
          <li>
            <strong className="text-foreground">El mismo secreto en staging y producción.</strong>{" "}
            Un entorno menos protegido expone al otro.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>gitleaks en un hook de pre-commit y en el CI.</li>
          <li>Deploy a AWS desde GitHub Actions con OIDC y un rol acotado.</li>
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
            La <strong className="text-foreground">rotación</strong> acota el
            daño de filtraciones que no detectaste. Sin downtime requiere dos
            versiones válidas en la transición; el ideal son credenciales
            dinámicas de vida corta.
          </p>
          <p>
            Para datos cifrados en tu base,{" "}
            <strong className="text-foreground">envelope encryption</strong>:
            data keys por dato, cifradas con una clave maestra que vive en un
            KMS y nunca sale de ahí.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">La clave de cifrado en una variable al lado de la base.</strong>{" "}
            Un acceso al servidor da datos y clave juntos.
          </li>
          <li>
            <strong className="text-foreground">Nunca haber practicado una rotación.</strong>{" "}
            El día de la filtración se improvisa bajo presión.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Rotación automática de la contraseña de RDS con Secrets Manager.</li>
          <li>Guardar tokens OAuth de terceros cifrados con KMS.</li>
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
            Un Dockerfile de producción. ¿Qué problemas de manejo de secretos
            tiene?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`FROM node:22
WORKDIR /app
COPY . .
ENV DATABASE_URL=postgresql://admin:clave123@db:5432/prod
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci
CMD ["node", "dist/server.js"]`}
          </pre>
          <RevelarSolucion>
            <p>
              1) <code>ENV DATABASE_URL</code> con la contraseña queda grabado en
              la imagen: cualquiera con acceso al registry la ve con{" "}
              <code>docker inspect</code>; va como variable en el entorno de
              ejecución o desde un gestor de secretos. 2) El{" "}
              <code>.npmrc</code> con el token queda en una capa de la imagen
              aunque después se borre; hay que usar build secrets (
              <code>RUN --mount=type=secret</code>) o un build multi-stage que no
              copie ese archivo a la imagen final. 3) <code>COPY . .</code> sin{" "}
              <code>.dockerignore</code> puede copiar el <code>.env</code> local
              adentro de la imagen. 4) El usuario <code>admin</code> de la base
              sugiere que la app corre con más permisos de los necesarios.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
