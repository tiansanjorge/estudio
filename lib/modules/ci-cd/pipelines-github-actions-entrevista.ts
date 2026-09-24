import type { PreguntaEntrevista } from "../types";

export const entrevistaPipelinesGithubActions: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es CI/CD y qué debería correr un pipeline?",
    respuestaEs:
      "CI, integración continua, es integrar los cambios al branch principal seguido, en PRs chicos, con un pipeline que en cada push verifica automáticamente que el código funciona: instala dependencias, corre lint, typecheck y tests, y construye la aplicación. El objetivo es enterarse de un error minutos después de introducirlo, no una semana más tarde al integrar un branch enorme. CD tiene dos significados que conviene distinguir. Continuous DELIVERY: cada cambio que pasa el pipeline queda listo para desplegarse, pero alguien decide cuándo (un botón, una aprobación). Continuous DEPLOYMENT: cada cambio que pasa el pipeline se despliega a producción automáticamente, sin intervención. Un pipeline típico de una app web: en cada PR, lint, typecheck, tests unitarios y de integración, build, y un preview deploy para revisarlo; al mergear a main, lo mismo más tests e2e contra staging, y después el deploy a producción. La regla es que el pipeline sea la única vía a producción: nada de deploys manuales desde la máquina de alguien.",
    respuestaEn:
      "CI, continuous integration, is integrating changes into the main branch frequently, in small PRs, with a pipeline that on every push automatically verifies the code works: installs dependencies, runs lint, typecheck and tests, and builds the app. The goal is to learn about a bug minutes after introducing it, not a week later when merging a huge branch. CD has two meanings worth distinguishing. Continuous DELIVERY: every change that passes the pipeline is ready to deploy, but someone decides when (a button, an approval). Continuous DEPLOYMENT: every change that passes the pipeline is deployed to production automatically, with no intervention. A typical web app pipeline: on each PR, lint, typecheck, unit and integration tests, build, and a preview deploy for review; on merge to main, the same plus e2e tests against staging, then the production deploy. The rule is that the pipeline is the only way to production: no manual deploys from someone's machine.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo está armado un workflow de GitHub Actions?",
    respuestaEs:
      "Un workflow es un archivo YAML en `.github/workflows/`. Tiene tres partes. Los TRIGGERS (`on`): qué lo dispara, como `push` a ciertos branches, `pull_request`, un cron (`schedule`) o una ejecución manual (`workflow_dispatch`). Los JOBS: cada job corre en un RUNNER, una máquina virtual nueva y limpia (`runs-on: ubuntu-latest`), y por default los jobs corren en paralelo; con `needs` se declara que uno depende de otro, y así se arma un grafo. Los STEPS: dentro de un job, pasos en orden que comparten el sistema de archivos; cada step es un comando (`run`) o una ACTION reutilizable (`uses: actions/checkout@v4`). Como cada job arranca en una máquina vacía, hay que hacer checkout e instalar dependencias en cada uno, y para pasar archivos entre jobs se usan artifacts. Los secretos se configuran en el repositorio y se leen con `${{ secrets.NOMBRE }}`, sin quedar en el código.",
    respuestaEn:
      "A workflow is a YAML file in `.github/workflows/`. It has three parts. TRIGGERS (`on`): what fires it, like `push` to certain branches, `pull_request`, a cron (`schedule`) or a manual run (`workflow_dispatch`). JOBS: each job runs on a RUNNER, a fresh, clean virtual machine (`runs-on: ubuntu-latest`), and by default jobs run in parallel; with `needs` you declare one depends on another, building a graph. STEPS: inside a job, ordered steps sharing the filesystem; each step is a command (`run`) or a reusable ACTION (`uses: actions/checkout@v4`). Since each job starts on an empty machine, you check out and install dependencies in each one, and to pass files between jobs you use artifacts. Secrets are configured in the repository and read with `${{ secrets.NAME }}`, without living in the code.",
    codigo: `on:
  pull_request:
  push:
    branches: [main]

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test

  deploy:
    needs: verificar            # solo si verificar pasó
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "deploy..."`,
  },
  {
    nivel: 2,
    pregunta: "El pipeline tarda 25 minutos. ¿Cómo lo acelerás?",
    respuestaEs:
      "Primero mido dónde se va el tiempo: GitHub muestra la duración de cada step. Después, en orden de impacto. CACHE: las dependencias (`setup-node` con `cache: npm`), el cache de build del framework y, en monorepos, un cache remoto de tareas (Turborepo, Nx) para no reconstruir lo que no cambió. PARALELIZAR: separar lint, typecheck y tests en jobs independientes, y partir la suite de tests en shards que corren en paralelo (Vitest y Playwright soportan `--shard`). Ojo que cada job paga su propio setup, así que sin cache paralelizar puede incluso empeorar el total. HACER MENOS: correr solo lo afectado por el cambio (filtros de paths, `turbo run --filter`), y no correr e2e completos en cada push de un PR en borrador. CANCELAR lo obsoleto: `concurrency` con `cancel-in-progress` corta la ejecución anterior del mismo PR cuando llega un push nuevo. ORDENAR para fallar rápido: lo barato y más propenso a fallar primero, así el feedback llega en 2 minutos y no en 20. Y si todo eso no alcanza, runners más grandes.",
    respuestaEn:
      "First I measure where the time goes: GitHub shows each step's duration. Then, by impact. CACHING: dependencies (`setup-node` with `cache: npm`), the framework's build cache and, in monorepos, a remote task cache (Turborepo, Nx) to avoid rebuilding what didn't change. PARALLELIZING: split lint, typecheck and tests into independent jobs, and split the test suite into shards running in parallel (Vitest and Playwright support `--shard`). Note that each job pays its own setup, so without caching, parallelizing can even worsen the total. DOING LESS: run only what the change affects (path filters, `turbo run --filter`), and don't run full e2e on every push to a draft PR. CANCELING stale runs: `concurrency` with `cancel-in-progress` stops the previous run of the same PR when a new push arrives. ORDERING to fail fast: cheap, failure-prone checks first, so feedback arrives in 2 minutes instead of 20. And if all that isn't enough, bigger runners.",
    tradeoffs:
      "Paralelizar baja el tiempo de reloj pero suma minutos facturados (cada job instala todo de nuevo); el cache ahorra tiempo pero puede esconder problemas si la clave está mal armada.",
    codigo: `concurrency:
  group: ci-\${{ github.ref }}
  cancel-in-progress: true   # un push nuevo cancela la ejecución anterior

jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx vitest run --shard=\${{ matrix.shard }}/4`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué reglas ponés alrededor del branch principal?",
    respuestaEs:
      "Que a main solo se llegue por un PR que pasó todo. BRANCH PROTECTION (o rulesets): prohibir pushes directos, exigir los checks del pipeline como requeridos, al menos una aprobación de review, y que el branch esté actualizado con main antes de mergear. PREVIEW DEPLOYS por PR (Vercel, Netlify o un entorno efímero) para que el review incluya ver la funcionalidad andando, no solo leer código. ENVIRONMENTS de GitHub para producción: secretos que solo ve ese entorno, reglas como aprobación manual o una ventana de tiempo, y un historial de qué se desplegó y cuándo. Con mucho tráfico de PRs, una MERGE QUEUE: el requisito de 'actualizado con main' obliga a rebasar y re-correr el pipeline cada vez que otro PR entra primero; la cola prueba cada PR combinado con los que tiene adelante y mergea en orden, así main nunca se rompe por dos cambios que pasaban por separado. Y un main siempre desplegable: si algo se rompe, revertir primero y arreglar después.",
    respuestaEn:
      "That main is only reached through a PR that passed everything. BRANCH PROTECTION (or rulesets): forbid direct pushes, make pipeline checks required, at least one review approval, and require the branch to be up to date with main before merging. PREVIEW DEPLOYS per PR (Vercel, Netlify or an ephemeral environment) so review includes seeing the feature working, not just reading code. GitHub ENVIRONMENTS for production: secrets only that environment sees, rules like manual approval or a time window, and a history of what was deployed and when. With heavy PR traffic, a MERGE QUEUE: the 'up to date with main' requirement forces rebasing and re-running the pipeline every time another PR lands first; the queue tests each PR combined with those ahead of it and merges in order, so main never breaks from two changes that passed separately. And an always-deployable main: if something breaks, revert first and fix later.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué riesgos de seguridad tiene GitHub Actions y cómo los mitigás?",
    respuestaEs:
      "El pipeline tiene acceso a secretos y a producción, así que es un blanco. ACTIONS DE TERCEROS: `uses: alguien/accion@v3` apunta a un tag que su dueño puede mover a código malicioso; lo seguro es fijar el SHA completo del commit (y dejar que Dependabot lo actualice). PERMISOS del `GITHUB_TOKEN`: declarar `permissions` mínimos por workflow o job (por ejemplo `contents: read`), en vez de los amplios por default. SCRIPT INJECTION: interpolar datos controlados por el usuario directo en un `run`, como `${{ github.event.pull_request.title }}`, permite que un título de PR con comandos se ejecute; se pasa como variable de entorno y se usa `\"$TITULO\"`. `pull_request_target`: corre con los secretos del repositorio base aunque el PR venga de un fork; si además hace checkout del código del PR y lo ejecuta, cualquiera puede robar los secretos con un PR. SECRETOS DE LARGA VIDA: en vez de guardar claves de AWS o GCP, usar OIDC, donde el workflow obtiene credenciales temporales que el proveedor cloud emite solo para ese repositorio y branch. Y los runners self-hosted nunca para repositorios públicos: un PR de un fork podría ejecutar código en tu infraestructura.",
    respuestaEn:
      "The pipeline has access to secrets and production, so it's a target. THIRD-PARTY ACTIONS: `uses: someone/action@v3` points to a tag its owner can move to malicious code; the safe option is pinning the full commit SHA (and letting Dependabot update it). `GITHUB_TOKEN` PERMISSIONS: declare minimal `permissions` per workflow or job (for example `contents: read`), instead of the broad defaults. SCRIPT INJECTION: interpolating user-controlled data straight into a `run`, like `${{ github.event.pull_request.title }}`, lets a PR title containing commands execute; pass it as an environment variable and use `\"$TITLE\"`. `pull_request_target`: runs with the base repository's secrets even when the PR comes from a fork; if it also checks out and runs the PR's code, anyone can steal the secrets with a PR. LONG-LIVED SECRETS: instead of storing AWS or GCP keys, use OIDC, where the workflow gets temporary credentials the cloud provider issues only for that repository and branch. And never self-hosted runners for public repositories: a fork's PR could run code on your infrastructure.",
    codigo: `permissions:
  contents: read

steps:
  # fijado al SHA: un tag movido no cambia lo que se ejecuta
  - uses: actions/checkout@<sha-completo-de-40-caracteres> # v4

  # inyección: el título del PR se interpola como código
  - run: echo "\${{ github.event.pull_request.title }}"

  # seguro: llega como variable de entorno, no como código
  - run: echo "$TITULO"
    env:
      TITULO: \${{ github.event.pull_request.title }}`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué problemas aparecen cuando el pipeline y el equipo crecen?",
    respuestaEs:
      "TESTS FLAKY: tests que a veces fallan sin cambios en el código (timing, orden, dependencia de la red o de la hora). El reflejo de reintentar hasta que pase entrena al equipo a ignorar los fallos rojos, y un fallo real se pierde. Lo sano es detectarlos (reportar reintentos que pasaron), ponerlos en cuarentena con un responsable, y arreglar la causa. BUILD ONCE, DEPLOY MANY: si cada entorno reconstruye la aplicación, staging y producción pueden terminar con artefactos distintos (otra versión de una dependencia, otro momento); lo correcto es construir una vez, guardar el artefacto o la imagen con un tag inmutable (el SHA del commit) y promover ese mismo artefacto por los entornos, cambiando solo la configuración. MONOREPOS: correr todo en cada cambio se vuelve insostenible; herramientas como Turborepo o Nx calculan qué paquetes afecta el cambio y reutilizan resultados de un cache remoto. ENTORNOS REPRODUCIBLES: versiones fijadas de Node y de las herramientas, `npm ci` con lockfile, y nada que dependa de lo que tenga instalado el runner. Y COSTO: los minutos de CI se facturan, así que conviene vigilar cuánto gasta cada workflow, como cualquier otra infraestructura.",
    respuestaEn:
      "FLAKY TESTS: tests that sometimes fail with no code change (timing, ordering, reliance on the network or the clock). The reflex of retrying until it passes trains the team to ignore red failures, and a real failure gets lost. The healthy approach is detecting them (report retries that passed), quarantining them with an owner, and fixing the cause. BUILD ONCE, DEPLOY MANY: if each environment rebuilds the app, staging and production can end up with different artifacts (another dependency version, another moment); the right way is building once, storing the artifact or image with an immutable tag (the commit SHA) and promoting that same artifact across environments, changing only configuration. MONOREPOS: running everything on every change becomes unsustainable; tools like Turborepo or Nx compute which packages the change affects and reuse results from a remote cache. REPRODUCIBLE ENVIRONMENTS: pinned Node and tool versions, `npm ci` with a lockfile, and nothing relying on what the runner happens to have installed. And COST: CI minutes are billed, so it's worth watching what each workflow spends, like any other infrastructure.",
  },
];
