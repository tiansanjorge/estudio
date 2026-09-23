import type { PreguntaEntrevista } from "../types";

export const entrevistaFrameworksNode: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Express, Fastify o NestJS? ¿Qué criterio usás para elegir?",
    respuestaEs:
      "Depende del tamaño del equipo, de cuánta estructura necesita el proyecto y de la experiencia existente. Express es minimalista y universal: routing y middlewares, y todo lo demás (validación, estructura, manejo de errores) lo decidís vos; es el más conocido, pero su diseño es anterior a async/await y no trae validación ni tipos. Fastify es igual de liviano de usar pero moderno: async/await nativo, validación y serialización por JSON Schema (con buena integración con TypeScript y Zod), logging con pino incluido y un sistema de plugins con encapsulación; además es notablemente más rápido. NestJS es un framework completo y opinado: módulos, controllers, servicios, inyección de dependencias, guards, pipes e interceptors, corriendo sobre Express o Fastify. Da consistencia en equipos grandes, a cambio de más ceremonia y curva. Mi elección por defecto para un proyecto nuevo chico o mediano es Fastify; para un backend grande con varios equipos, NestJS.",
    respuestaEn:
      "It depends on team size, how much structure the project needs and existing experience. Express is minimalist and universal: routing and middleware, and everything else (validation, structure, error handling) is up to you; it's the most widely known, but its design predates async/await and it ships no validation or types. Fastify is just as lightweight to use but modern: native async/await, JSON Schema validation and serialization (with good TypeScript and Zod integration), built-in pino logging and a plugin system with encapsulation; it's also notably faster. NestJS is a full, opinionated framework: modules, controllers, services, dependency injection, guards, pipes and interceptors, running on top of Express or Fastify. It brings consistency to large teams, at the cost of more ceremony and learning curve. My default for a new small or medium project is Fastify; for a large backend with several teams, NestJS.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es un middleware en Express y en qué orden se ejecutan?",
    respuestaEs:
      "Es una función `(req, res, next)` que se ejecuta en el camino del request: puede leer o modificar `req` y `res`, terminar la respuesta, o llamar a `next()` para pasarle el control al siguiente. Se ejecutan en el ORDEN en que se registran con `app.use` o en la ruta, lo que importa mucho: el parser de JSON tiene que ir antes de las rutas que leen `req.body`, la autenticación antes de las rutas protegidas, y el manejador de errores (una función con cuatro parámetros, `(err, req, res, next)`) al final, porque recibe lo que se pasa con `next(err)`. Errores comunes: olvidar llamar a `next()` (el request queda colgado), llamarlo después de enviar la respuesta (error de headers ya enviados), y en Express 4 no capturar los errores de funciones async: un `throw` dentro de un handler async no llega al manejador de errores y queda como una promesa rechazada sin manejar. Express 5 captura automáticamente las promesas rechazadas.",
    respuestaEn:
      "It's a function `(req, res, next)` running in the request's path: it can read or modify `req` and `res`, end the response, or call `next()` to hand control to the next one. They run in the ORDER they're registered with `app.use` or on the route, which matters a lot: the JSON parser must come before routes reading `req.body`, authentication before protected routes, and the error handler (a four-parameter function, `(err, req, res, next)`) at the end, since it receives what's passed with `next(err)`. Common mistakes: forgetting to call `next()` (the request hangs), calling it after sending the response (headers-already-sent error), and in Express 4 not catching errors from async functions: a `throw` inside an async handler doesn't reach the error handler and becomes an unhandled rejected promise. Express 5 automatically catches rejected promises.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué Fastify es más rápido que Express?",
    respuestaEs:
      "Por varias decisiones de diseño. La principal es la serialización: cuando se declara el schema de la respuesta, Fastify compila una función de serialización específica (con fast-json-stringify) que es bastante más rápida que `JSON.stringify` genérico, y de paso filtra campos que no están en el schema, evitando filtrar datos por accidente. La validación de entrada también se compila a partir del JSON Schema (con Ajv). Además, el router usa un radix tree muy eficiente, y el core tiene menos overhead por request que la cadena de middlewares de Express. Dicho esto, la diferencia importa sobre todo cuando el handler hace poco trabajo (un gateway, un servicio de tracking con mucho tráfico); en una API típica que pasa la mayor parte del tiempo esperando a la base de datos, el framework rara vez es el cuello de botella, así que la elección suele pesar más por ergonomía, estructura y ecosistema que por benchmarks.",
    respuestaEn:
      "Because of several design decisions. The main one is serialization: when the response schema is declared, Fastify compiles a dedicated serialization function (with fast-json-stringify) that's considerably faster than generic `JSON.stringify`, and also filters fields not in the schema, avoiding accidental data leaks. Input validation is also compiled from the JSON Schema (with Ajv). In addition, the router uses a very efficient radix tree, and the core has less per-request overhead than Express's middleware chain. That said, the difference matters mostly when the handler does little work (a gateway, a high-traffic tracking service); in a typical API spending most of its time waiting on the database, the framework is rarely the bottleneck, so the choice usually weighs more on ergonomics, structure and ecosystem than benchmarks.",
    tradeoffs:
      "Los schemas de respuesta de Fastify dan velocidad y evitan filtrar campos, pero son una segunda definición de tipos que hay que mantener sincronizada (los type providers con Zod o TypeBox lo resuelven).",
  },
  {
    nivel: 2,
    pregunta: "¿Qué aportan los guards, pipes e interceptors de NestJS?",
    respuestaEs:
      "Son puntos de extensión del ciclo de vida de un request, cada uno con una responsabilidad clara, que se aplican de forma declarativa con decoradores (a un handler, a un controller o globalmente). Los GUARDS deciden si el request puede continuar: autenticación y autorización (`@UseGuards(JwtAuthGuard, RolesGuard)` con `@Roles('admin')`). Los PIPES transforman y validan los parámetros antes de llegar al handler: `ValidationPipe` valida el DTO del body, `ParseIntPipe` convierte un parámetro. Los INTERCEPTORS envuelven la ejecución del handler, antes y después: logging, medir tiempos, transformar la respuesta a un formato común, cachear, manejar timeouts. Y los EXCEPTION FILTERS convierten excepciones en respuestas HTTP. La ventaja es que las preocupaciones transversales quedan fuera de los handlers, se reutilizan y se ven de un vistazo en los decoradores; el costo es más magia: entender en qué orden corre cada cosa requiere conocer el ciclo de vida de Nest.",
    respuestaEn:
      "They're extension points in a request's lifecycle, each with a clear responsibility, applied declaratively via decorators (to a handler, a controller or globally). GUARDS decide whether the request may continue: authentication and authorization (`@UseGuards(JwtAuthGuard, RolesGuard)` with `@Roles('admin')`). PIPES transform and validate parameters before reaching the handler: `ValidationPipe` validates the body DTO, `ParseIntPipe` converts a parameter. INTERCEPTORS wrap handler execution, before and after: logging, timing, transforming the response to a common format, caching, handling timeouts. And EXCEPTION FILTERS turn exceptions into HTTP responses. The advantage is that cross-cutting concerns live outside handlers, get reused and are visible at a glance in the decorators; the cost is more magic: understanding the order things run in requires knowing Nest's lifecycle.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es la inyección de dependencias en NestJS y qué problemas resuelve?",
    respuestaEs:
      "Nest tiene un contenedor de IoC: las clases marcadas con `@Injectable()` se registran como providers en un módulo, y cuando un controller o servicio declara una dependencia en su constructor, el contenedor crea la instancia (por defecto un singleton por aplicación) y se la pasa. Resuelve tres cosas. Desacoplamiento: `PedidosService` no hace `new PrismaClient()` ni `new StripeClient()`, recibe lo que necesita, así se puede reemplazar la implementación (un token con `useClass` o `useFactory`) sin tocar a quien la usa. Testeabilidad: en los tests, `Test.createTestingModule` permite sobreescribir cualquier provider con un fake. Y ciclo de vida: el contenedor maneja la creación y la destrucción (hooks como `onModuleInit` y `onModuleDestroy`) y el orden entre dependencias. Detalles a conocer: los providers pueden tener scope por request (útil para datos del request, pero más caro porque se crean en cada uno), y las dependencias circulares entre módulos requieren `forwardRef`, que suele ser señal de un problema de diseño.",
    respuestaEn:
      "Nest has an IoC container: classes marked `@Injectable()` are registered as providers in a module, and when a controller or service declares a dependency in its constructor, the container creates the instance (by default an app-wide singleton) and passes it in. It solves three things. Decoupling: `OrdersService` doesn't `new PrismaClient()` or `new StripeClient()`, it receives what it needs, so the implementation can be swapped (a token with `useClass` or `useFactory`) without touching its users. Testability: in tests, `Test.createTestingModule` lets you override any provider with a fake. And lifecycle: the container handles creation and teardown (hooks like `onModuleInit` and `onModuleDestroy`) and ordering between dependencies. Details worth knowing: providers can be request-scoped (useful for request data, but costlier since they're created each time), and circular dependencies between modules require `forwardRef`, usually a sign of a design problem.",
    codigo: `@Module({
  providers: [
    PedidosService,
    { provide: PASARELA_PAGOS, useClass: StripePasarela },
  ],
})
export class PedidosModule {}

// en el test
const modulo = await Test.createTestingModule({ imports: [PedidosModule] })
  .overrideProvider(PASARELA_PAGOS)
  .useValue(pasarelaFake)
  .compile();`,
  },
  {
    nivel: 3,
    pregunta: "¿Cuándo NO usarías ninguno de los tres y elegirías otra cosa?",
    respuestaEs:
      "Hay casos donde otras opciones encajan mejor. Si el backend es principalmente un BFF para una app Next.js, los Route Handlers y Server Actions del propio Next pueden alcanzar, sin un servidor aparte (con el límite de que no sirven para procesos largos ni conexiones persistentes). Si el código tiene que correr en entornos edge o en varios runtimes (Node, Bun, Deno, Cloudflare Workers), Hono es un framework minimalista basado en las APIs web estándar (`Request`/`Response`) que corre en todos. Si frontend y backend están en un monorepo TypeScript y el único cliente es tu propia app, tRPC da tipos de punta a punta sin escribir contratos. Y si lo que se necesita es un CRUD administrativo sobre una base, a veces conviene una herramienta que lo genera (un headless CMS, PostgREST, Supabase) en vez de escribir endpoints. La pregunta de fondo en una entrevista es la misma: qué problema concreto se resuelve y qué costo operativo trae cada opción.",
    respuestaEn:
      "There are cases where other options fit better. If the backend is mainly a BFF for a Next.js app, Next's own Route Handlers and Server Actions may suffice, with no separate server (with the limit that they don't suit long processes or persistent connections). If code must run on edge environments or several runtimes (Node, Bun, Deno, Cloudflare Workers), Hono is a minimalist framework built on standard web APIs (`Request`/`Response`) that runs on all of them. If frontend and backend live in a TypeScript monorepo and your own app is the only client, tRPC gives end-to-end types without writing contracts. And if what's needed is an admin CRUD over a database, sometimes a tool that generates it (a headless CMS, PostgREST, Supabase) beats writing endpoints. The underlying interview question is the same: which concrete problem is solved and what operational cost each option brings.",
  },
];
