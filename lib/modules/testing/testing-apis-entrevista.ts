import type { PreguntaEntrevista } from "../types";

export const entrevistaTestingApis: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué casos cubrirías en los tests de un endpoint `POST /pedidos`?",
    respuestaEs:
      "Por categorías. El camino feliz: con datos válidos responde 201, devuelve el recurso y el header `Location`, y el pedido quedó efectivamente guardado en la base. Validación: cada regla del body (campos faltantes, tipos incorrectos, cantidades negativas) responde 400 o 422 con un mensaje que indica el campo, y NO guarda nada. Autenticación: sin sesión o con token vencido, 401. Autorización: un usuario no puede operar sobre recursos de otro (403 o 404), y un rol sin permiso tampoco. Reglas de negocio: sin stock, producto inexistente, límites. Exposición de datos: la respuesta no incluye campos internos ni sensibles. Y según el caso, idempotencia (el mismo `Idempotency-Key` no duplica) y efectos secundarios (se encoló el mail, se emitió el evento). La autorización y la exposición de datos son las que más se olvidan y las que más cuestan en producción.",
    respuestaEn:
      "By category. Happy path: with valid data it responds 201, returns the resource and the `Location` header, and the order was actually saved in the database. Validation: each body rule (missing fields, wrong types, negative quantities) responds 400 or 422 with a message pointing to the field, and saves NOTHING. Authentication: without a session or with an expired token, 401. Authorization: a user can't operate on another's resources (403 or 404), nor can a role without permission. Business rules: out of stock, nonexistent product, limits. Data exposure: the response doesn't include internal or sensitive fields. And as needed, idempotency (the same `Idempotency-Key` doesn't duplicate) and side effects (the email was queued, the event emitted). Authorization and data exposure are the most forgotten and the most costly in production.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo testeás un endpoint sin levantar el servidor en un puerto?",
    respuestaEs:
      "Con herramientas que invocan la aplicación directamente en memoria. En Node, Supertest recibe la app de Express (o el handler HTTP) y le hace requests sin abrir un puerto real; Fastify tiene `app.inject()` con el mismo objetivo; en NestJS se crea el módulo de test con `Test.createTestingModule` y se usa Supertest sobre la app inicializada. En los Route Handlers de Next.js, como son funciones que reciben un `Request` y devuelven un `Response`, se pueden llamar directamente con un `new Request(...)`. La ventaja es que se ejercita todo el pipeline real (routing, middlewares, validación, serialización, manejo de errores) con la velocidad de un test en memoria, sin conflictos de puertos al correr en paralelo. La base de datos, en cambio, conviene que sea real (un Postgres de test).",
    respuestaEn:
      "With tools that invoke the app directly in memory. In Node, Supertest takes the Express app (or HTTP handler) and makes requests without opening a real port; Fastify has `app.inject()` for the same purpose; in NestJS you build the test module with `Test.createTestingModule` and use Supertest on the initialized app. Next.js Route Handlers, being functions that take a `Request` and return a `Response`, can be called directly with a `new Request(...)`. The advantage is exercising the whole real pipeline (routing, middleware, validation, serialization, error handling) at in-memory test speed, with no port conflicts when running in parallel. The database, on the other hand, should be real (a test Postgres).",
    codigo: `import request from "supertest";
import { crearApp } from "../src/app";

const app = crearApp();

it("GET /salud responde 200", async () => {
  const res = await request(app).get("/salud");
  expect(res.status).toBe(200);
});`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo manejás los datos de prueba en tests de API con base de datos real?",
    respuestaEs:
      "El objetivo es que cada test sea independiente y determinístico. Para el aislamiento hay tres estrategias habituales: envolver cada test en una transacción que se revierte al final (muy rápida, pero no sirve si el código abre sus propias transacciones o usa varias conexiones); truncar las tablas antes de cada test (simple y robusta, algo más lenta); o una base (o schema, o rama efímera) por worker del runner para correr en paralelo sin choques. Para crear los datos, factories o builders (`crearUsuario({ rol: 'admin' })`) con valores por defecto válidos, en los que cada test sobreescribe solo lo que le importa, en lugar de fixtures gigantes compartidas donde nadie sabe qué dato usa quién. Y nunca depender de datos creados por otro test ni del orden de ejecución. Las migraciones se aplican una vez al inicio de la suite, igual que en producción, así también se prueban.",
    respuestaEn:
      "The goal is each test being independent and deterministic. For isolation there are three common strategies: wrapping each test in a transaction rolled back at the end (very fast, but it fails if the code opens its own transactions or uses several connections); truncating tables before each test (simple and robust, a bit slower); or a database (or schema, or ephemeral branch) per runner worker to run in parallel without clashes. For creating data, factories or builders (`createUser({ role: 'admin' })`) with valid defaults, where each test overrides only what matters to it, instead of giant shared fixtures where nobody knows which data is used by whom. And never depend on data created by another test or on execution order. Migrations run once at suite start, just like production, so they get tested too.",
    tradeoffs:
      "Las transacciones revertidas son las más rápidas pero las menos realistas; truncar es más lento pero se comporta igual que producción. Para suites grandes, una base por worker combina aislamiento y paralelismo.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo testeás un endpoint que llama a un servicio externo, como una pasarela de pagos?",
    respuestaEs:
      "No se llama al servicio real en los tests automatizados: es lento, no determinístico, puede costar dinero y depende de la disponibilidad de un tercero. Hay dos lugares donde cortar. Uno es a nivel de red, interceptando las llamadas HTTP salientes (MSW en Node, o nock), lo que ejercita también tu cliente del servicio, la serialización y el manejo de errores. El otro es a nivel de un adaptador propio: si el acceso al proveedor está detrás de una interfaz (`PasarelaPagos`), en los tests se inyecta un fake que simula aprobaciones, rechazos y timeouts. En cualquier caso, lo importante es testear los escenarios feos: el pago rechazado, el timeout, la respuesta inesperada, el webhook que llega dos veces. Y se complementa con pruebas contra el sandbox del proveedor en un pipeline aparte o manualmente, y con verificación de la firma de los webhooks.",
    respuestaEn:
      "The real service isn't called in automated tests: it's slow, non-deterministic, may cost money and depends on a third party's availability. There are two places to cut. One is at the network level, intercepting outgoing HTTP calls (MSW in Node, or nock), which also exercises your service client, serialization and error handling. The other is at your own adapter: if provider access sits behind an interface (`PaymentGateway`), tests inject a fake that simulates approvals, declines and timeouts. Either way, what matters is testing the ugly scenarios: the declined payment, the timeout, the unexpected response, the webhook arriving twice. It's complemented by tests against the provider's sandbox in a separate pipeline or manually, and by verifying webhook signatures.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo testeás condiciones de carrera en un endpoint?",
    respuestaEs:
      "Muchas APIs funcionan bien con un request a la vez y fallan con dos simultáneos: dos compras del último producto en stock, dos transferencias que leen el mismo saldo, un registro con el mismo email enviado dos veces. Para testearlo hay que disparar los requests EN PARALELO (`Promise.all` de varios requests) contra una base real, no en secuencia, y verificar el estado final: que solo uno se concretó, que el stock no quedó negativo, que no hay registros duplicados. Estos tests suelen revelar que falta un constraint único en la base, un bloqueo (`SELECT ... FOR UPDATE`), una actualización atómica (`UPDATE stock SET cantidad = cantidad - 1 WHERE cantidad > 0`) o un nivel de aislamiento de transacción adecuado. Como la concurrencia no es determinística, conviene repetir el escenario varias veces o forzar la ventana de carrera con pausas inyectadas en el código.",
    respuestaEn:
      "Many APIs work fine with one request at a time and fail with two simultaneous ones: two purchases of the last item in stock, two transfers reading the same balance, a signup with the same email sent twice. To test it, fire requests IN PARALLEL (`Promise.all` of several requests) against a real database, not sequentially, and verify the final state: only one went through, stock didn't go negative, there are no duplicate records. These tests often reveal a missing unique constraint, a lock (`SELECT ... FOR UPDATE`), an atomic update (`UPDATE stock SET qty = qty - 1 WHERE qty > 0`) or an appropriate transaction isolation level. Since concurrency is non-deterministic, repeat the scenario several times or force the race window with delays injected into the code.",
    codigo: `it("no vende más unidades que el stock", async () => {
  await db.producto.update({ where: { id: "p1" }, data: { stock: 1 } });

  const compras = await Promise.all(
    [ana, beto, carla].map((u) =>
      request(app).post("/pedidos").set("Cookie", sesionDe(u)).send({ productoId: "p1", cantidad: 1 }),
    ),
  );

  expect(compras.filter((r) => r.status === 201)).toHaveLength(1);
  expect((await db.producto.findUnique({ where: { id: "p1" } }))!.stock).toBe(0);
});`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué rol cumple la especificación OpenAPI en el testing de una API?",
    respuestaEs:
      "Puede pasar de documentación a contrato verificable. Primero, validar en los tests que cada respuesta cumple el schema declarado (hay matchers y middlewares que lo hacen), así la documentación no puede desincronizarse del comportamiento real sin que falle el CI. Segundo, generar a partir de ella los tipos del cliente (openapi-typescript) y los mocks del frontend, que quedan alineados por construcción. Tercero, herramientas de testing basado en propiedades o fuzzing (como Schemathesis) generan automáticamente cientos de requests a partir del schema, con valores límite y combinaciones raras, y detectan 500s, respuestas que no cumplen el contrato o validaciones faltantes que nadie pensó en escribir a mano. Y cuarto, comparar la especificación entre versiones para detectar breaking changes (un campo eliminado, un tipo cambiado) antes de publicar. El requisito es mantener la especificación como fuente de verdad, generada desde el código o escrita primero (design-first).",
    respuestaEn:
      "It can go from documentation to a verifiable contract. First, validate in tests that every response matches the declared schema (there are matchers and middlewares for it), so docs can't drift from real behavior without failing CI. Second, generate client types (openapi-typescript) and frontend mocks from it, aligned by construction. Third, property-based testing or fuzzing tools (like Schemathesis) automatically generate hundreds of requests from the schema, with edge values and odd combinations, catching 500s, contract-violating responses or missing validations nobody thought to write by hand. And fourth, diff the spec across versions to catch breaking changes (a removed field, a changed type) before publishing. The requirement is keeping the spec as the source of truth, generated from code or written first (design-first).",
  },
];
