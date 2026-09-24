import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { DockerCapasSimulador } from "@/components/modulo/DockerCapasSimulador";
import { entrevistaDocker } from "@/lib/modules/ci-cd/docker-entrevista";

const preguntasPorNivel = {
  1: entrevistaDocker.filter((p) => p.nivel === 1),
  2: entrevistaDocker.filter((p) => p.nivel === 2),
  3: entrevistaDocker.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Docker (nociones) — Dev Study Lab",
  description:
    "Imágenes y contenedores, cache de capas, multi-stage, imágenes seguras, docker compose, PID 1 y señales, y qué es un contenedor por dentro.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia a un contenedor de una máquina virtual?",
    opciones: [
      "El contenedor comparte el kernel del host; la VM trae su propio SO",
      "El contenedor corre en la nube; la VM corre en hardware físico propio",
      "El contenedor no tiene red propia; la VM sí tiene interfaces de red",
    ],
    respuestaCorrecta: 0,
    explicacion: "Por eso arranca en milisegundos, con un aislamiento menos fuerte.",
  },
  {
    pregunta: "¿Por qué copiar package.json antes que el resto del código?",
    opciones: [
      "Porque npm ci necesita el package.json para leer las variables de entorno",
      "Para que un cambio de código reutilice la capa cacheada de npm ci",
      "Porque Docker copia los archivos en orden alfabético si no se aclara",
    ],
    respuestaCorrecta: 1,
    explicacion: "La cache es una cadena: una capa invalidada reconstruye todas las siguientes.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa con un token pasado como ARG en el Dockerfile?",
    opciones: [
      "Se descarta al terminar el build y no queda en la imagen final",
      "Queda disponible como variable de entorno en el contenedor",
      "Queda guardado en las capas y se lee con docker history",
    ],
    respuestaCorrecta: 2,
    explicacion: "Para secretos de build se usa RUN --mount=type=secret.",
  },
  {
    pregunta: "¿Qué garantiza depends_on sin condition en docker compose?",
    opciones: [
      "Solo el orden de arranque de los contenedores",
      "Que la base esté lista para aceptar conexiones",
      "Que los servicios compartan la misma red interna",
    ],
    respuestaCorrecta: 0,
    explicacion: "Para esperar a que esté lista hace falta un healthcheck y service_healthy.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "La app no se apaga con SIGTERM y la plataforma la mata a los 30 segundos. ¿Causa probable?",
    opciones: [
      "El contenedor no tiene memoria suficiente para cerrar ordenado",
      "Corre como PID 1 (o detrás de npm) sin manejar la señal",
      "El healthcheck sigue respondiendo y bloquea el apagado",
    ],
    respuestaCorrecta: 1,
    explicacion: "El PID 1 no recibe los manejadores por default; hay que manejar SIGTERM o usar un init.",
  },
  {
    pregunta: "¿Qué mecanismo del kernel limita la memoria de un contenedor?",
    opciones: [
      "namespaces",
      "seccomp",
      "cgroups",
    ],
    respuestaCorrecta: 2,
    explicacion: "Los namespaces aíslan lo que se ve; los cgroups, lo que se puede usar.",
  },
];

export default function DockerPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Docker (nociones)"
      descripcion="Empaquetar una app para que corra igual en todos lados, con builds rápidos e imágenes chicas."
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
            Una <strong className="text-foreground">imagen</strong> es un paquete
            inmutable con la app y todo lo que necesita; un{" "}
            <strong className="text-foreground">contenedor</strong> es una
            instancia en ejecución, un proceso aislado que comparte el kernel del
            host.
          </p>
          <p>
            Cada instrucción del Dockerfile es una capa cacheada. El orden va de
            lo que cambia poco (dependencias) a lo que cambia siempre (código).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <DockerCapasSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>COPY . .</code> antes de instalar.</strong>{" "}
            Cada cambio en el código reinstala todas las dependencias.
          </li>
          <li>
            <strong className="text-foreground">Sin <code>.dockerignore</code>.</strong>{" "}
            <code>node_modules</code>, <code>.git</code> y <code>.env</code> terminan dentro de la imagen.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Levantar Postgres y Redis locales con docker compose.</li>
          <li>Empaquetar una API para desplegarla en Cloud Run o ECS.</li>
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
            <strong className="text-foreground">Imágenes chicas y seguras</strong>:
            multi-stage, base <code>-slim</code>, <code>USER node</code>, nada de
            secretos en las capas, base fijada y escaneo en CI.
          </p>
          <p>
            <strong className="text-foreground">docker compose</strong>: varios
            servicios, una red donde se encuentran por nombre, volúmenes para los
            datos y healthchecks para el orden de arranque.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Secretos en <code>ENV</code> o <code>ARG</code>.</strong>{" "}
            Cualquiera con la imagen los puede leer.
          </li>
          <li>
            <strong className="text-foreground">Conectarse a <code>localhost</code> desde otro contenedor.</strong>{" "}
            Dentro de la red de compose, cada servicio se llama por su nombre.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Pasar de una imagen de 1,4 GB a 260 MB con multi-stage.</li>
          <li>Tests de integración en CI contra un Postgres levantado con compose.</li>
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
            <strong className="text-foreground">En producción</strong>: manejar
            SIGTERM como PID 1, ajustar el heap al límite de memoria, nada de
            estado en el disco del contenedor, configuración por entorno y tags
            inmutables.
          </p>
          <p>
            <strong className="text-foreground">Por dentro</strong>: un proceso
            con namespaces (lo que ve) y cgroups (lo que usa), sobre capas de
            solo lectura unidas con overlayfs.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Desplegar <code>latest</code>.</strong>{" "}
            No se sabe qué versión corre y el rollback es ambiguo.
          </li>
          <li>
            <strong className="text-foreground">Guardar uploads en el disco del contenedor.</strong>{" "}
            Se pierden en el próximo deploy.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Diagnosticar reinicios por OOMKilled en un contenedor con 512 MB.</li>
          <li>Promover la misma imagen, por digest, de staging a producción.</li>
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
            Este Dockerfile tarda 3 minutos en cada build, la imagen pesa 1,5 GB,
            los deploys cortan requests y un escaneo encontró un token en la
            imagen. Encontrá los problemas.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`FROM node:latest
ARG NPM_TOKEN
ENV NPM_TOKEN=$NPM_TOKEN
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`}
          </pre>
          <RevelarSolucion>
            <p>
              1) <code>node:latest</code>: base completa y sin versión fija, cambia
              sola entre builds; usar <code>node:22-slim</code> fijado. 2) El
              token en <code>ARG</code>/<code>ENV</code> queda en las capas: usar{" "}
              <code>RUN --mount=type=secret,id=npmrc</code> solo en el paso de
              instalación. 3) <code>COPY . .</code> antes de instalar: cualquier
              cambio reinstala todo; copiar primero <code>package.json</code> y
              el lockfile, y agregar <code>.dockerignore</code>. 4){" "}
              <code>npm install</code> en vez de <code>npm ci</code>: no respeta
              el lockfile de forma estricta. 5) Sin multi-stage: la imagen final
              lleva devDependencies y el código fuente. 6) Corre como root: sumar{" "}
              <code>USER node</code>. 7) <code>CMD [&quot;npm&quot;, &quot;start&quot;]</code>{" "}
              deja a npm como PID 1 y las señales no llegan bien a Node:
              ejecutar <code>node dist/server.js</code> directamente y manejar
              SIGTERM con graceful shutdown.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
