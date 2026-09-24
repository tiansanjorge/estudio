import type { PreguntaEntrevista } from "../types";

export const entrevistaDocker: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es Docker y qué problema resuelve?",
    respuestaEs:
      "Docker empaqueta una aplicación con todo lo que necesita para correr (el runtime, las librerías del sistema, las dependencias y la configuración por default) en una IMAGEN, un paquete inmutable y versionado. Un CONTENEDOR es una instancia en ejecución de esa imagen: un proceso aislado del resto del sistema. Resuelve el 'en mi máquina funciona': la misma imagen corre igual en la laptop, en CI y en producción, porque no depende de qué versión de Node o de qué librería tenga instalada cada máquina. A diferencia de una máquina virtual, un contenedor no trae su propio sistema operativo: comparte el kernel del host y solo aísla procesos, red y sistema de archivos. Por eso arranca en milisegundos y pesa megas en vez de gigas, a cambio de un aislamiento menos fuerte que el de una VM. En la práctica, un desarrollador full stack lo usa para levantar dependencias locales (Postgres, Redis) con docker compose, y para empaquetar servicios que se despliegan en plataformas de contenedores como ECS, Cloud Run o Kubernetes.",
    respuestaEn:
      "Docker packages an application with everything it needs to run (the runtime, system libraries, dependencies and default configuration) into an IMAGE, an immutable, versioned package. A CONTAINER is a running instance of that image: a process isolated from the rest of the system. It solves 'works on my machine': the same image runs the same on a laptop, in CI and in production, because it doesn't depend on which Node version or library each machine has installed. Unlike a virtual machine, a container doesn't bring its own operating system: it shares the host's kernel and only isolates processes, network and filesystem. That's why it starts in milliseconds and weighs megabytes instead of gigabytes, at the cost of weaker isolation than a VM. In practice, a full stack developer uses it to run local dependencies (Postgres, Redis) with docker compose, and to package services deployed on container platforms like ECS, Cloud Run or Kubernetes.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo escribís un Dockerfile para una app Node, y por qué importa el orden?",
    respuestaEs:
      "Cada instrucción del Dockerfile genera una CAPA, y Docker cachea las capas: si una instrucción y sus archivos de entrada no cambiaron desde el último build, reutiliza el resultado. Pero la cache es una cadena: cuando una capa se invalida, todas las siguientes se reconstruyen. Por eso el orden va de lo que cambia poco a lo que cambia siempre. Primero la imagen base, después copiar SOLO `package.json` y el lockfile, instalar dependencias con `npm ci`, y recién después copiar el resto del código y construir. Así, cambiar un archivo de `src/` reutiliza la capa de dependencias (que suele ser lo más lento) y solo rehace el build. Si se copia todo el proyecto antes de instalar, cualquier cambio en el código reinstala todo. Complemento necesario: un `.dockerignore` que excluya `node_modules`, `.git`, `.env` y los artefactos de build, para que no entren en la imagen ni invaliden la cache sin motivo.",
    respuestaEn:
      "Each Dockerfile instruction creates a LAYER, and Docker caches layers: if an instruction and its input files haven't changed since the last build, it reuses the result. But the cache is a chain: once a layer is invalidated, every following one is rebuilt. That's why ordering goes from what rarely changes to what always changes. First the base image, then copy ONLY `package.json` and the lockfile, install dependencies with `npm ci`, and only then copy the rest of the code and build. That way, changing a file in `src/` reuses the dependency layer (usually the slowest) and only redoes the build. If you copy the whole project before installing, any code change reinstalls everything. A necessary complement: a `.dockerignore` excluding `node_modules`, `.git`, `.env` and build artifacts, so they don't end up in the image or invalidate the cache for no reason.",
    codigo: `FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci                      # cacheada mientras no cambien las dependencias
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo hacés una imagen chica y segura?",
    respuestaEs:
      "MULTI-STAGE BUILD: una etapa con todo lo necesario para construir (compiladores, devDependencies, código fuente) y una etapa final que copia solo el resultado y las dependencias de producción. La imagen final pasa de más de un giga a unos cientos de megas, y cuanto menos tiene, menos vulnerabilidades puede tener. IMAGEN BASE mínima: `-slim` (Debian recortado) es un buen default; `alpine` es más chica pero usa musl en vez de glibc, lo que a veces rompe dependencias nativas; distroless no trae ni shell, lo que reduce la superficie de ataque pero complica depurar. SIN ROOT: `USER node` para que un atacante que comprometa la app no sea root dentro del contenedor. SIN SECRETOS EN LA IMAGEN: un `ARG` o `ENV` con un token queda guardado en las capas y cualquiera con la imagen lo puede leer con `docker history`; para secretos del build (un token de un registry privado) se usa `RUN --mount=type=secret`, y los de runtime se inyectan como variables de entorno al correr el contenedor. Y MANTENIMIENTO: fijar la versión de la imagen base, escanear la imagen en CI (Trivy, Docker Scout) y reconstruir seguido para recibir parches de seguridad.",
    respuestaEn:
      "MULTI-STAGE BUILD: one stage with everything needed to build (compilers, devDependencies, source code) and a final stage copying only the result and production dependencies. The final image goes from over a gigabyte to a few hundred megabytes, and the less it contains, the fewer vulnerabilities it can have. A minimal BASE IMAGE: `-slim` (trimmed Debian) is a good default; `alpine` is smaller but uses musl instead of glibc, which sometimes breaks native dependencies; distroless doesn't even include a shell, reducing the attack surface but making debugging harder. NO ROOT: `USER node` so an attacker who compromises the app isn't root inside the container. NO SECRETS IN THE IMAGE: an `ARG` or `ENV` with a token is stored in the layers and anyone with the image can read it with `docker history`; for build secrets (a private registry token) use `RUN --mount=type=secret`, and runtime ones are injected as environment variables when running the container. And MAINTENANCE: pin the base image version, scan the image in CI (Trivy, Docker Scout) and rebuild often to pick up security patches.",
    tradeoffs:
      "Imágenes más mínimas son más chicas y seguras, pero más difíciles de depurar: sin shell ni herramientas, investigar un problema en producción requiere otras técnicas.",
  },
  {
    nivel: 2,
    pregunta: "¿Para qué usás docker compose?",
    respuestaEs:
      "Para definir en un archivo varios servicios que trabajan juntos y levantarlos con un comando. El uso más común en desarrollo: la base de datos, Redis y otros servicios que la app necesita, con versiones fijadas, así cualquiera del equipo tiene el mismo entorno con `docker compose up` en vez de instalar Postgres a mano. Cada servicio tiene su imagen, puertos, variables de entorno y VOLÚMENES (para que los datos de la base sobrevivan a recrear el contenedor); compose crea una red donde los servicios se encuentran por nombre (la app se conecta a `postgres:5432`, no a localhost). Un detalle frecuente: `depends_on` solo ordena el arranque, no espera a que Postgres esté listo para aceptar conexiones; para eso se combina con un `healthcheck` y `condition: service_healthy`. También sirve en CI, para levantar dependencias de los tests de integración. En producción, compose en una sola máquina alcanza para proyectos chicos, pero no da alta disponibilidad, escalado ni deploys sin downtime; para eso están los orquestadores o las plataformas gestionadas.",
    respuestaEn:
      "To define in one file several services working together and start them with a single command. The most common development use: the database, Redis and other services the app needs, with pinned versions, so anyone on the team gets the same environment with `docker compose up` instead of installing Postgres by hand. Each service has its image, ports, environment variables and VOLUMES (so database data survives recreating the container); compose creates a network where services find each other by name (the app connects to `postgres:5432`, not localhost). A frequent detail: `depends_on` only orders startup, it doesn't wait for Postgres to accept connections; for that you combine it with a `healthcheck` and `condition: service_healthy`. It's also useful in CI, to start integration test dependencies. In production, compose on a single machine is enough for small projects, but it gives no high availability, scaling or zero-downtime deploys; that's what orchestrators or managed platforms are for.",
    codigo: `services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: dev
    volumes:
      - datos:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "postgres"]
      interval: 2s

  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:dev@postgres:5432/postgres
    depends_on:
      postgres:
        condition: service_healthy   # espera a que acepte conexiones

volumes:
  datos:`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué cambia cuando una app Node corre en un contenedor en producción?",
    respuestaEs:
      "Varias cosas que en una VM no se notan. PID 1 Y SEÑALES: el proceso principal del contenedor es el PID 1, y el kernel no le aplica los manejadores de señales por default; si la app no maneja SIGTERM explícitamente, no termina al pedírselo y la plataforma la mata con SIGKILL después del timeout, cortando requests. Además, `CMD [\"npm\", \"start\"]` pone a npm como PID 1, y npm no reenvía bien las señales a Node; conviene ejecutar `node` directamente, o usar un init mínimo (`docker run --init`, tini). MEMORIA: el contenedor tiene un límite de memoria; si el heap de V8 crece más allá, el kernel mata el proceso (OOMKilled) sin un error de JavaScript. Conviene fijar `--max-old-space-size` por debajo del límite, dejando margen para la memoria que no es heap. SIN ESTADO LOCAL: el sistema de archivos del contenedor se pierde al reemplazarlo, así que nada de sesiones, uploads ni logs en disco: logs a stdout (la plataforma los recolecta), archivos a un storage como S3, estado en la base o Redis. CONFIGURACIÓN por variables de entorno, la misma imagen en todos los entornos. Y TAGS INMUTABLES: desplegar por SHA del commit o por digest, nunca `latest`, que no dice qué versión está corriendo y hace el rollback ambiguo.",
    respuestaEn:
      "Several things you don't notice on a VM. PID 1 AND SIGNALS: the container's main process is PID 1, and the kernel doesn't apply default signal handlers to it; if the app doesn't handle SIGTERM explicitly, it doesn't stop when asked and the platform kills it with SIGKILL after the timeout, cutting requests. Also, `CMD [\"npm\", \"start\"]` makes npm PID 1, and npm doesn't forward signals to Node well; better to run `node` directly, or use a minimal init (`docker run --init`, tini). MEMORY: the container has a memory limit; if the V8 heap grows beyond it, the kernel kills the process (OOMKilled) with no JavaScript error. It's worth setting `--max-old-space-size` below the limit, leaving room for non-heap memory. NO LOCAL STATE: the container's filesystem is lost when it's replaced, so no sessions, uploads or logs on disk: logs to stdout (the platform collects them), files to storage like S3, state in the database or Redis. CONFIGURATION through environment variables, the same image in every environment. And IMMUTABLE TAGS: deploy by commit SHA or digest, never `latest`, which doesn't say what version is running and makes rollback ambiguous.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es, técnicamente, un contenedor?",
    respuestaEs:
      "Un proceso común de Linux con dos mecanismos del kernel aplicados. NAMESPACES aíslan lo que el proceso VE: el namespace de PID hace que vea solo sus propios procesos (y él mismo es el 1), el de red le da su propia interfaz y puertos, el de mount su propio sistema de archivos, el de usuarios le permite ser 'root' adentro sin serlo en el host. CGROUPS limitan lo que el proceso PUEDE USAR: CPU, memoria, IO; de ahí salen los límites de recursos y el OOMKill. El sistema de archivos viene de la imagen: una pila de capas de solo lectura, direccionadas por el hash de su contenido (por eso se comparten entre imágenes y la cache funciona), unidas con un union filesystem (overlayfs) más una capa de escritura propia de cada contenedor, que se descarta al borrarlo. El formato de imagen y el runtime están estandarizados por OCI, así que una imagen construida con Docker corre en containerd, Podman o Kubernetes. La consecuencia de seguridad: todos los contenedores comparten el kernel del host, así que una vulnerabilidad del kernel puede romper el aislamiento. Para correr código no confiable de varios clientes se usan sandboxes más fuertes, como gVisor o microVMs tipo Firecracker.",
    respuestaEn:
      "An ordinary Linux process with two kernel mechanisms applied. NAMESPACES isolate what the process SEES: the PID namespace makes it see only its own processes (and itself as 1), the network one gives it its own interface and ports, the mount one its own filesystem, the user one lets it be 'root' inside without being root on the host. CGROUPS limit what the process CAN USE: CPU, memory, IO; that's where resource limits and OOMKill come from. The filesystem comes from the image: a stack of read-only layers, addressed by their content hash (which is why they're shared across images and caching works), merged with a union filesystem (overlayfs) plus a writable layer per container, discarded when it's deleted. The image format and runtime are standardized by OCI, so an image built with Docker runs on containerd, Podman or Kubernetes. The security consequence: all containers share the host kernel, so a kernel vulnerability can break isolation. To run untrusted code from multiple customers, stronger sandboxes are used, like gVisor or Firecracker-style microVMs.",
  },
];
