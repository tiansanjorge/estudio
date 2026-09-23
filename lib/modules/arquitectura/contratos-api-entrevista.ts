import type { PreguntaEntrevista } from "../types";

export const entrevistaContratosApi: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es OpenAPI y para qué sirve más allá de documentar?",
    respuestaEs:
      "Es un estándar para describir una API HTTP en un archivo YAML o JSON: endpoints, métodos, parámetros, cuerpos de request y respuesta con sus schemas, códigos de status, autenticación. Documentar (con Swagger UI o Redoc) es solo el uso más visible. El valor real es que se vuelve un CONTRATO legible por máquinas entre quien provee la API y quien la consume: a partir de él se generan tipos y clientes para el frontend (openapi-typescript, orval), mocks para desarrollar sin backend, validación automática de requests y respuestas en el servidor, tests de contrato y fuzzing, y detección de breaking changes comparando versiones. Frontend y backend pueden trabajar en paralelo sobre el contrato acordado, y un cambio incompatible se detecta en el CI en vez de en producción.",
    respuestaEn:
      "It's a standard for describing an HTTP API in a YAML or JSON file: endpoints, methods, parameters, request and response bodies with their schemas, status codes, authentication. Documenting (with Swagger UI or Redoc) is just the most visible use. The real value is that it becomes a machine-readable CONTRACT between API provider and consumer: from it you generate types and clients for the frontend (openapi-typescript, orval), mocks to develop without a backend, automatic request and response validation on the server, contract tests and fuzzing, and breaking-change detection by diffing versions. Frontend and backend can work in parallel on the agreed contract, and an incompatible change is caught in CI instead of production.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es un breaking change en una API? Dá ejemplos.",
    respuestaEs:
      "Es un cambio que hace fallar a un cliente que funcionaba con la versión anterior sin que ese cliente haya cambiado. Ejemplos en la respuesta: quitar o renombrar un campo, cambiar su tipo (de número a string), cambiar su significado o formato (una fecha que pasa de ISO a timestamp). En el request: agregar un campo obligatorio, hacer obligatorio uno que era opcional, restringir valores aceptados, cambiar el método o la URL. También cambios de comportamiento: un status code distinto, otra forma de paginar, otro formato de error. En cambio, suelen ser compatibles: agregar un endpoint, agregar campos OPCIONALES al request, y agregar campos a la respuesta, siempre que los clientes ignoren lo desconocido. Un caso engañoso es agregar un valor a un enum de respuesta: para un cliente con un switch exhaustivo o tipos estrictos, es breaking.",
    respuestaEn:
      "It's a change that makes a client that worked with the previous version fail without that client having changed. Response examples: removing or renaming a field, changing its type (number to string), changing its meaning or format (a date switching from ISO to timestamp). Request: adding a required field, making an optional one required, restricting accepted values, changing the method or URL. Also behavior changes: a different status code, different pagination, a different error format. On the other hand, usually compatible: adding an endpoint, adding OPTIONAL request fields, and adding response fields, as long as clients ignore unknown ones. A tricky case is adding a value to a response enum: for a client with an exhaustive switch or strict types, it's breaking.",
  },
  {
    nivel: 2,
    pregunta: "¿Design-first o code-first? ¿Qué trade-offs tiene cada uno?",
    respuestaEs:
      "En DESIGN-FIRST se escribe primero el contrato OpenAPI, se revisa y acuerda entre equipos, y después se implementa; frontend y backend arrancan en paralelo (el front con mocks generados), y la API se diseña pensando en el consumidor. El riesgo es que la implementación se desvíe del contrato si no se valida en los tests o en runtime. En CODE-FIRST el contrato se GENERA desde el código (decoradores de NestJS, schemas de Zod con zod-openapi, FastAPI), así nunca queda desactualizado respecto de la implementación; es más cómodo para el backend, pero el diseño de la API tiende a reflejar la estructura interna del servidor en vez de las necesidades del cliente, y el contrato existe recién cuando el código existe. Una combinación habitual: code-first con schemas como fuente única de verdad (Zod o similar) que generan el OpenAPI, más revisión del diff del contrato en cada PR, para no perder la mirada de diseño.",
    respuestaEn:
      "In DESIGN-FIRST the OpenAPI contract is written first, reviewed and agreed between teams, then implemented; frontend and backend start in parallel (the front with generated mocks), and the API is designed with the consumer in mind. The risk is the implementation drifting from the contract unless it's validated in tests or at runtime. In CODE-FIRST the contract is GENERATED from code (NestJS decorators, Zod schemas with zod-openapi, FastAPI), so it never goes stale versus the implementation; it's more convenient for the backend, but API design tends to mirror the server's internal structure rather than client needs, and the contract only exists once the code does. A common combination: code-first with schemas as the single source of truth (Zod or similar) generating the OpenAPI, plus reviewing the contract diff in every PR, so design thinking isn't lost.",
    tradeoffs:
      "Design-first optimiza el diseño y el trabajo en paralelo; code-first optimiza que el contrato sea siempre fiel al código. Sin validación automática, cualquiera de los dos se desincroniza.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo versionarías una API pública?",
    respuestaEs:
      "Lo primero es evitar versionar: la mayoría de los cambios se pueden hacer de forma compatible (agregar en vez de modificar), y cada versión mayor es una API más para mantener. Cuando hace falta romper, hay varias estrategias: versión en la URL (`/v1/pedidos`, `/v2/pedidos`), la más visible y simple de rutear y cachear; versión en un header (`Accept: application/vnd.miapi.v2+json` o un header propio), que mantiene URLs limpias pero es menos obvia; o versionado por fecha (el modelo de Stripe: cada cliente queda fijado a la versión de la fecha en que se integró, y el servidor transforma las respuestas para cada versión). Lo importante es el proceso alrededor: anunciar la deprecación con tiempo, marcarla en el contrato (`deprecated: true`) y en headers (`Deprecation`, `Sunset`), medir quién sigue usando la versión vieja, y darle un período de convivencia razonable antes de apagarla.",
    respuestaEn:
      "The first thing is avoiding versioning: most changes can be made compatibly (adding instead of modifying), and every major version is one more API to maintain. When breaking is needed, there are several strategies: version in the URL (`/v1/orders`, `/v2/orders`), the most visible and simplest to route and cache; version in a header (`Accept: application/vnd.myapi.v2+json` or a custom header), keeping URLs clean but less obvious; or date-based versioning (Stripe's model: each client is pinned to the version of the date it integrated, and the server transforms responses per version). What matters is the surrounding process: announce deprecation early, mark it in the contract (`deprecated: true`) and in headers (`Deprecation`, `Sunset`), measure who still uses the old version, and allow a reasonable coexistence period before shutting it down.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el patrón expand/contract para cambios incompatibles?",
    respuestaEs:
      "Es una forma de hacer un cambio incompatible en pasos compatibles, sin coordinar un deploy simultáneo entre servidor y clientes. Por ejemplo, renombrar `estado` a `status`. EXPAND: el servidor agrega `status` y sigue devolviendo `estado` con el mismo valor; el contrato marca `estado` como deprecado. MIGRATE: los clientes se actualizan de a uno, a su ritmo, para leer `status`; se monitorea el uso de `estado` (logs, métricas por cliente o por versión de la app). CONTRACT: cuando nadie usa `estado` (o vence el plazo anunciado), se quita. Es el mismo patrón que se usa para migraciones de base de datos sin downtime. Es especialmente importante con apps mobile, donde conviven versiones viejas instaladas durante meses y no se puede forzar a todos a actualizar el mismo día.",
    respuestaEn:
      "It's a way to make an incompatible change in compatible steps, without coordinating a simultaneous deploy of server and clients. For example, renaming `estado` to `status`. EXPAND: the server adds `status` and keeps returning `estado` with the same value; the contract marks `estado` as deprecated. MIGRATE: clients update one by one, at their own pace, to read `status`; usage of `estado` is monitored (logs, metrics per client or app version). CONTRACT: when nobody uses `estado` (or the announced deadline passes), it's removed. It's the same pattern used for zero-downtime database migrations. It's especially important with mobile apps, where old installed versions coexist for months and you can't force everyone to update the same day.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo garantizás en el CI que el frontend y el backend respetan el contrato?",
    respuestaEs:
      "Con varias verificaciones automáticas. En el backend: validar en los tests que cada respuesta cumple el schema del OpenAPI (o validar en runtime con el schema en un middleware en entornos de test y staging), y correr un fuzzer basado en el contrato (Schemathesis) que busque 500s y respuestas que no coinciden. En el frontend: generar los tipos del cliente desde el contrato en el build, así un cambio incompatible rompe la compilación del front; y generar los mocks de MSW desde el mismo contrato. Entre versiones: un paso del pipeline compara el contrato del PR contra el de la rama principal (oasdiff, openapi-diff) y falla, o exige aprobación explícita, si detecta breaking changes. Y con varios consumidores independientes, contract tests dirigidos por el consumidor (Pact), donde cada cliente publica lo que usa y el proveedor verifica que lo sigue cumpliendo.",
    respuestaEn:
      "With several automated checks. On the backend: validate in tests that every response matches the OpenAPI schema (or validate at runtime with the schema in a middleware in test and staging environments), and run a contract-based fuzzer (Schemathesis) looking for 500s and mismatching responses. On the frontend: generate client types from the contract at build, so an incompatible change breaks the front's compilation; and generate MSW mocks from the same contract. Across versions: a pipeline step diffs the PR's contract against the main branch (oasdiff, openapi-diff) and fails, or requires explicit approval, if it detects breaking changes. And with several independent consumers, consumer-driven contract tests (Pact), where each client publishes what it uses and the provider verifies it still complies.",
    codigo: `# .github/workflows/contrato.yml (paso del pipeline)
- name: Detectar breaking changes
  run: |
    oasdiff breaking \\
      origin/main:openapi.yaml openapi.yaml \\
      --fail-on ERR`,
  },
];
