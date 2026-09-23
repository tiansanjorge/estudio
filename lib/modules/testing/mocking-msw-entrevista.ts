import type { PreguntaEntrevista } from "../types";

export const entrevistaMockingMsw: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre un stub, un spy, un mock y un fake?",
    respuestaEs:
      "Son tipos de 'test doubles', objetos que reemplazan a una dependencia real en un test. Un STUB devuelve respuestas predefinidas para que el código bajo prueba pueda avanzar ('cuando pidan el usuario, devolvé este'), y no se verifica cómo se usó. Un SPY envuelve una función (real o falsa) y registra cómo se la llamó: cuántas veces y con qué argumentos, para verificarlo después. Un MOCK, en sentido estricto, viene con expectativas sobre cómo tiene que ser llamado y el test falla si no se cumplen; en la práctica, en Jest y Vitest, `vi.fn()` hace de stub y de spy a la vez, y 'mock' se usa para todo. Un FAKE es una implementación funcional pero simplificada: una base de datos en memoria, un repositorio con un array. La distinción importa porque verificar llamadas (spies y mocks) acopla el test a la implementación, mientras que stubs y fakes permiten verificar el resultado.",
    respuestaEn:
      "They're kinds of 'test doubles', objects replacing a real dependency in a test. A STUB returns predefined answers so the code under test can proceed ('when asked for the user, return this'), with no check on how it was used. A SPY wraps a function (real or fake) and records how it was called: how many times and with which arguments, to verify later. A MOCK, strictly, comes with expectations about how it must be called and the test fails if unmet; in practice, in Jest and Vitest, `vi.fn()` acts as stub and spy at once, and 'mock' is used for everything. A FAKE is a working but simplified implementation: an in-memory database, a repository backed by an array. The distinction matters because verifying calls (spies and mocks) couples the test to implementation, while stubs and fakes let you verify the outcome.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es MSW y por qué se prefiere a mockear fetch o los módulos del cliente?",
    respuestaEs:
      "Mock Service Worker intercepta los requests a nivel de RED: en el navegador con un Service Worker, y en Node (tests) interceptando los módulos de red. Se definen handlers por método y URL que devuelven respuestas, y tu código hace requests HTTP reales sin saber que hay un mock. La ventaja es que todo tu código corre de verdad (componente, hook, cliente de API, manejo de errores), y el test no depende de CÓMO hacés los requests: si pasás de fetch a axios o a TanStack Query, los tests siguen funcionando. Además, los mismos handlers se reutilizan en tests, en Storybook y para desarrollar el frontend antes de que exista el backend. Mockear el módulo del cliente o espiar `fetch` es más rápido de escribir, pero ata el test a la implementación y deja sin probar justo la capa donde viven muchos bugs.",
    respuestaEn:
      "Mock Service Worker intercepts requests at the NETWORK level: in the browser via a Service Worker, and in Node (tests) by intercepting network modules. You define handlers per method and URL that return responses, and your code makes real HTTP requests without knowing there's a mock. The advantage is all your code runs for real (component, hook, API client, error handling), and the test doesn't depend on HOW you make requests: if you switch from fetch to axios or TanStack Query, tests keep working. Also, the same handlers are reused in tests, in Storybook and to build the frontend before the backend exists. Mocking the client module or spying on `fetch` is quicker to write, but ties the test to implementation and leaves untested exactly the layer where many bugs live.",
    codigo: `// mocks/handlers.ts
export const handlers = [
  http.get("/api/productos", () => HttpResponse.json([{ id: 1, nombre: "Teclado" }])),
];

// vitest.setup.ts
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo testeás los estados de error y de carga con MSW?",
    respuestaEs:
      "Con overrides por test: `server.use()` agrega un handler que tiene prioridad sobre los definidos por defecto solo para ese test, y `server.resetHandlers()` en el `afterEach` los limpia para que no contaminen a los siguientes. Para un error del servidor, el handler devuelve `HttpResponse.json({ ... }, { status: 500 })`; para un error de RED (sin respuesta), `HttpResponse.error()`, que hace rechazar al fetch como si se hubiera cortado la conexión, dos caminos distintos en tu código. Para el estado de carga, `await delay()` dentro del handler demora la respuesta y permite verificar que se muestra el skeleton antes de que lleguen los datos. Y conviene configurar `onUnhandledRequest: 'error'`: si el código hace un request que ningún handler cubre, el test falla en vez de pegarle a la red real o colgarse.",
    respuestaEn:
      "With per-test overrides: `server.use()` adds a handler that takes priority over the defaults just for that test, and `server.resetHandlers()` in `afterEach` clears them so they don't leak into the next ones. For a server error, the handler returns `HttpResponse.json({ ... }, { status: 500 })`; for a NETWORK error (no response), `HttpResponse.error()`, which makes fetch reject as if the connection dropped, two different paths in your code. For the loading state, `await delay()` inside the handler delays the response and lets you check the skeleton shows before data arrives. And set `onUnhandledRequest: 'error'`: if the code makes a request no handler covers, the test fails instead of hitting the real network or hanging.",
    codigo: `it("muestra un mensaje si la API falla", async () => {
  server.use(
    http.get("/api/productos", () =>
      HttpResponse.json({ error: "Interno" }, { status: 500 }),
    ),
  );
  render(<ListaProductos />);
  expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar");
});`,
  },
  {
    nivel: 2,
    pregunta: "¿Cuándo es un problema mockear demasiado?",
    respuestaEs:
      "Cuando el test termina verificando los mocks en vez del código. Síntomas: el test tiene más líneas de setup de mocks que de comportamiento; verifica que se llamaron ciertas funciones internas con ciertos argumentos en vez de verificar el resultado; o hay que actualizar los mocks en cada refactor aunque el comportamiento no cambió. En ese punto el test da falsa confianza (pasa aunque la integración real esté rota) y encima frena los cambios. La regla práctica es mockear solo en los BORDES del sistema, lo que no controlás o es lento o no determinístico: la red, el reloj, servicios de terceros, APIs del navegador que jsdom no tiene. Lo que es tuyo (componentes hijos, hooks, módulos internos), dejarlo real. Y si algo es difícil de testear sin mockear medio mundo, suele ser una señal de diseño: demasiadas dependencias acopladas.",
    respuestaEn:
      "When the test ends up verifying the mocks instead of the code. Symptoms: the test has more lines of mock setup than behavior; it verifies that certain internal functions were called with certain arguments instead of verifying the outcome; or mocks must be updated on every refactor even though behavior didn't change. At that point the test gives false confidence (it passes even if the real integration is broken) and also slows changes down. The practical rule is to mock only at the system's EDGES, what you don't control or is slow or non-deterministic: the network, the clock, third-party services, browser APIs jsdom lacks. What's yours (child components, hooks, internal modules), keep real. And if something is hard to test without mocking half the world, it's usually a design signal: too many coupled dependencies.",
    tradeoffs:
      "Menos mocks dan tests más realistas y resistentes a refactors, pero más lentos y con más setup de datos. Los mocks en los bordes son el equilibrio habitual.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo evitás que los handlers de MSW queden desincronizados con la API real?",
    respuestaEs:
      "Es el riesgo principal de cualquier mock: que represente una API que ya no existe. Hay varias capas de defensa. Tipar los handlers con los tipos generados desde el contrato de la API (OpenAPI con openapi-typescript, o el schema de GraphQL con codegen): si el backend cambia un campo, el handler deja de compilar. Generar los handlers directamente desde el contrato, con herramientas que producen mocks a partir del OpenAPI. Validar las respuestas en runtime con un esquema (Zod) en el cliente de API, de modo que un cambio de forma falle de manera explícita también en desarrollo y en producción. Y contract tests (Pact) donde el proveedor verifica que cumple lo que los consumidores esperan. Además, unos pocos e2e contra la API real atrapan lo que se escape. Sin ninguna de estas, los mocks se vuelven ficción con el tiempo.",
    respuestaEn:
      "It's the main risk of any mock: representing an API that no longer exists. There are several layers of defense. Type the handlers with types generated from the API contract (OpenAPI with openapi-typescript, or the GraphQL schema with codegen): if the backend changes a field, the handler stops compiling. Generate the handlers directly from the contract, with tools producing mocks from the OpenAPI. Validate responses at runtime with a schema (Zod) in the API client, so a shape change fails explicitly in development and production too. And contract tests (Pact) where the provider verifies it meets consumer expectations. Plus, a few e2e tests against the real API catch what slips through. Without any of these, mocks turn into fiction over time.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo testeás código que depende del tiempo (debounce, timeouts, fechas)?",
    respuestaEs:
      "Con fake timers: `vi.useFakeTimers()` reemplaza `setTimeout`, `setInterval` y `Date` por versiones controladas, y `vi.advanceTimersByTime(300)` hace avanzar el reloj sin esperar de verdad, así un debounce de 300 ms se prueba en microsegundos y de forma determinística. Para fechas, `vi.setSystemTime(new Date('2026-01-15'))` fija 'ahora', evitando tests que fallan a fin de mes o en otra zona horaria. Hay trampas: al combinar fake timers con Testing Library y `userEvent`, hay que configurar `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, porque userEvent usa timers internos y si no se cuelga; las Promises no avanzan con los timers, así que para código que mezcla ambos se usan las variantes async (`advanceTimersByTimeAsync`); y siempre restaurar con `vi.useRealTimers()` en el `afterEach`. Una alternativa de diseño es inyectar el reloj como dependencia, lo que hace el código testeable sin parchear globales.",
    respuestaEn:
      "With fake timers: `vi.useFakeTimers()` replaces `setTimeout`, `setInterval` and `Date` with controlled versions, and `vi.advanceTimersByTime(300)` moves the clock forward without actually waiting, so a 300 ms debounce is tested in microseconds and deterministically. For dates, `vi.setSystemTime(new Date('2026-01-15'))` pins 'now', avoiding tests that fail at month-end or in another timezone. There are traps: combining fake timers with Testing Library and `userEvent` requires `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`, since userEvent uses internal timers and otherwise hangs; Promises don't advance with timers, so for code mixing both use the async variants (`advanceTimersByTimeAsync`); and always restore with `vi.useRealTimers()` in `afterEach`. A design alternative is injecting the clock as a dependency, making code testable without patching globals.",
  },
];
