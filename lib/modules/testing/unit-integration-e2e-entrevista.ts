import type { PreguntaEntrevista } from "../types";

export const entrevistaUnitIntegrationE2e: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre un test unitario, uno de integración y uno end-to-end?",
    respuestaEs:
      "La diferencia es cuánto del sistema real ejercitan. Un test UNITARIO prueba una unidad aislada (una función, un hook, una clase) reemplazando sus dependencias: es rapidísimo y, cuando falla, señala exactamente dónde. Un test de INTEGRACIÓN prueba varias piezas funcionando juntas: en frontend, típicamente varios componentes renderizados con Testing Library y la red simulada con MSW; en backend, un endpoint con su base de datos real de test. Verifica que las piezas se conecten bien. Un test END-TO-END recorre la aplicación completa como un usuario, en un navegador real (Playwright, Cypress), contra el frontend, la API y la base desplegados: es el que más se parece a producción, y también el más lento y frágil. Ningún nivel reemplaza a los otros: cada uno atrapa bugs que los demás no ven.",
    respuestaEn:
      "The difference is how much of the real system they exercise. A UNIT test checks an isolated unit (a function, a hook, a class) replacing its dependencies: it's very fast and, when it fails, points exactly where. An INTEGRATION test checks several pieces working together: in frontend, typically several components rendered with Testing Library and the network mocked with MSW; in backend, an endpoint with its real test database. It verifies the pieces connect properly. An END-TO-END test walks through the full app like a user, in a real browser (Playwright, Cypress), against the deployed frontend, API and database: it's closest to production, and also the slowest and most brittle. No level replaces the others: each catches bugs the others miss.",
  },
  {
    nivel: 1,
    pregunta: "Dame un ejemplo de bug que un test de integración con mocks no detecta pero un e2e sí.",
    respuestaEs:
      "El clásico es un cambio de contrato de la API: el backend renombra el campo `precio` a `price`. El test de integración del frontend usa MSW, que sigue devolviendo la respuesta con la forma vieja, así que pasa en verde mientras producción muestra 'undefined'. El mock es una suposición sobre la API, y esa suposición quedó desactualizada. El e2e, que habla con la API real, lo detecta. Otro ejemplo es el layout: jsdom no calcula posiciones ni superposiciones, así que un botón tapado por un banner en mobile se puede 'clickear' sin problema en un test de integración, pero no en un navegador real. Por eso se combinan: la integración da feedback rápido sobre la lógica de la UI, y unos pocos e2e (o contract tests) cubren lo que los mocks no pueden ver.",
    respuestaEn:
      "The classic is an API contract change: the backend renames the `price` field to `amount`. The frontend integration test uses MSW, which keeps returning the old shape, so it passes green while production shows 'undefined'. The mock is an assumption about the API, and that assumption went stale. The e2e test, talking to the real API, catches it. Another example is layout: jsdom doesn't compute positions or overlaps, so a button covered by a banner on mobile can be 'clicked' fine in an integration test, but not in a real browser. That's why they're combined: integration gives fast feedback on UI logic, and a few e2e tests (or contract tests) cover what mocks can't see.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué hace que un test sea bueno, independientemente de su nivel?",
    respuestaEs:
      "Varias propiedades. Que pruebe COMPORTAMIENTO observable y no implementación: qué ve el usuario o qué devuelve la función, no qué métodos internos se llamaron; así sobrevive a los refactors. Que sea DETERMINÍSTICO: mismo código, mismo resultado, sin depender de la hora, del orden de ejecución, de datos compartidos o de servicios externos. Que esté AISLADO: cada test prepara y limpia su propio estado. Que sea LEGIBLE, con la estructura Arrange-Act-Assert y un nombre que describe el comportamiento ('aplica el cupón sobre el subtotal', no 'test 3'), porque un test también es documentación. Que falle por UNA razón clara, con un mensaje que ayude a diagnosticar. Y que sea RÁPIDO para su nivel. Un test que se rompe cuando el comportamiento no cambió, o que pasa cuando el comportamiento se rompió, cuesta más de lo que aporta.",
    respuestaEn:
      "Several properties. It tests observable BEHAVIOR, not implementation: what the user sees or what the function returns, not which internal methods were called; so it survives refactors. It's DETERMINISTIC: same code, same result, not depending on time, execution order, shared data or external services. It's ISOLATED: each test sets up and cleans its own state. It's READABLE, with Arrange-Act-Assert structure and a name describing the behavior ('applies the coupon to the subtotal', not 'test 3'), since a test is also documentation. It fails for ONE clear reason, with a message that helps diagnose. And it's FAST for its level. A test that breaks when behavior didn't change, or passes when behavior broke, costs more than it's worth.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué base de datos usás en los tests de integración de un backend?",
    respuestaEs:
      "Idealmente la MISMA tecnología que en producción. Usar SQLite en memoria para tests de una app que corre en Postgres es tentador por velocidad, pero las diferencias (tipos, constraints, JSONB, transacciones, sintaxis) hacen que pasen tests que en producción fallan, y viceversa. Lo habitual hoy es levantar un Postgres real en un contenedor (Testcontainers, o un servicio en el CI, o una rama efímera de una base administrada como Neon), aplicar las migraciones una vez, y aislar cada test: envolviéndolo en una transacción que se revierte al final, o truncando las tablas entre tests. Los mocks del ORM en tests de integración pierden justamente lo que se quería verificar: que las consultas reales funcionan. Los mocks de la base tienen sentido en tests unitarios de la lógica que está POR ENCIMA del repositorio.",
    respuestaEn:
      "Ideally the SAME technology as production. Using in-memory SQLite for tests of an app running on Postgres is tempting for speed, but the differences (types, constraints, JSONB, transactions, syntax) let tests pass that fail in production, and vice versa. The usual approach today is spinning up a real Postgres in a container (Testcontainers, a CI service, or an ephemeral branch of a managed database like Neon), running migrations once, and isolating each test: wrapping it in a transaction rolled back at the end, or truncating tables between tests. ORM mocks in integration tests lose exactly what you wanted to verify: that real queries work. Database mocks make sense in unit tests of the logic sitting ABOVE the repository.",
    tradeoffs:
      "Una base real es más lenta de levantar que un mock, pero atrapa errores de consultas, migraciones y constraints que un mock nunca va a ver.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo hacés que una suite de e2e sea estable y rápida?",
    respuestaEs:
      "Estabilidad: nunca esperar por tiempo fijo (`waitForTimeout(2000)`), sino por condiciones (Playwright espera automáticamente a que el elemento sea visible y accionable, y sus `expect` reintentan hasta un timeout); seleccionar elementos por rol y nombre accesible en vez de clases CSS o XPath frágiles; aislar datos: cada test crea sus propios datos (por API o con seeds) en vez de depender de lo que dejó otro; y no depender de servicios de terceros reales (pagos, mails): se mockean en el borde o se usan sus sandboxes. Velocidad: paralelizar con workers y shardear entre máquinas del CI; hacer el login una vez y reutilizar el estado de autenticación guardado en vez de loguearse por la UI en cada test; preparar los datos por API y usar la UI solo para lo que se está probando. Y mantener pocos e2e, enfocados en flujos críticos, con trazas y videos solo de los que fallan para poder diagnosticar.",
    respuestaEn:
      "Stability: never wait on fixed time (`waitForTimeout(2000)`) but on conditions (Playwright auto-waits for the element to be visible and actionable, and its `expect` retries until a timeout); select elements by role and accessible name instead of fragile CSS classes or XPath; isolate data: each test creates its own data (via API or seeds) rather than depending on what another left behind; and don't depend on real third-party services (payments, email): mock them at the edge or use their sandboxes. Speed: parallelize with workers and shard across CI machines; log in once and reuse the saved auth state instead of logging in through the UI in every test; set up data via API and use the UI only for what's being tested. And keep few e2e tests, focused on critical flows, with traces and videos only for failures to diagnose them.",
    codigo: `// auth.setup.ts: login una vez, se guarda el estado
setup("login", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.E2E_USER!);
  await page.getByLabel("Contraseña").fill(process.env.E2E_PASS!);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await page.context().storageState({ path: ".auth/usuario.json" });
});

// playwright.config.ts: los demás tests arrancan logueados
use: { storageState: ".auth/usuario.json" }`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué son los tests de regresión visual y cuándo valen la pena?",
    respuestaEs:
      "Toman capturas de componentes o páginas y las comparan pixel a pixel (o con tolerancia) contra una imagen de referencia aprobada; si algo cambió, el test falla y muestra la diferencia. Atrapan justo lo que los otros tests no ven: un CSS que rompió el layout de otra pantalla, un z-index, un cambio de tema, una fuente que no cargó. El costo es el ruido: diferencias de renderizado entre sistemas operativos, fuentes o antialiasing generan falsos positivos, así que las capturas tienen que generarse siempre en el mismo entorno (un contenedor fijo o un servicio como Chromatic o Percy), con datos estables y animaciones desactivadas. Además cada cambio visual intencional requiere revisar y aprobar nuevas imágenes. Valen la pena en design systems y bibliotecas de componentes, donde un cambio de estilo impacta en muchos lugares, y en pantallas críticas; no para cubrir toda la app.",
    respuestaEn:
      "They take screenshots of components or pages and compare them pixel by pixel (or with tolerance) against an approved reference image; if something changed, the test fails and shows the diff. They catch exactly what other tests miss: CSS that broke another screen's layout, a z-index, a theme change, a font that didn't load. The cost is noise: rendering differences across operating systems, fonts or antialiasing cause false positives, so screenshots must always be generated in the same environment (a fixed container or a service like Chromatic or Percy), with stable data and animations disabled. Also, every intentional visual change requires reviewing and approving new images. They pay off in design systems and component libraries, where a style change impacts many places, and on critical screens; not to cover the whole app.",
  },
];
