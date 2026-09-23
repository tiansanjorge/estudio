import type { PreguntaEntrevista } from "../types";

export const entrevistaTdd: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es TDD y en qué consiste el ciclo red-green-refactor?",
    respuestaEs:
      "Test-Driven Development es escribir el test ANTES que el código, en ciclos cortos de tres fases. Red: escribir un test para el próximo comportamiento y verlo fallar, lo que confirma que el test realmente puede detectar el problema. Green: escribir lo mínimo indispensable para que pase, aunque sea feo o parezca trampa; el objetivo es volver a verde rápido. Refactor: con todos los tests en verde como red de seguridad, mejorar el diseño (nombres, duplicación, estructura) sin cambiar el comportamiento. Y repetir. El resultado es que cada línea de código existe porque un test la pidió, la suite documenta el comportamiento esperado, y el diseño emerge de a poco a partir de casos concretos en vez de anticiparse. TDD es sobre todo una técnica de DISEÑO: pensar primero cómo se va a usar una función obliga a definir una interfaz clara.",
    respuestaEn:
      "Test-Driven Development is writing the test BEFORE the code, in short three-phase cycles. Red: write a test for the next behavior and watch it fail, confirming the test can actually detect the problem. Green: write the bare minimum to make it pass, even if ugly or seemingly cheating; the goal is to get back to green fast. Refactor: with all tests green as a safety net, improve the design (names, duplication, structure) without changing behavior. And repeat. The result is that every line of code exists because a test asked for it, the suite documents expected behavior, and the design emerges gradually from concrete cases instead of being anticipated. TDD is mainly a DESIGN technique: thinking first about how a function will be used forces a clear interface.",
  },
  {
    nivel: 1,
    pregunta: "¿Por qué es importante ver el test fallar antes de hacerlo pasar?",
    respuestaEs:
      "Porque un test que nunca falló puede estar pasando por la razón equivocada: un assert mal escrito que siempre es verdadero, un `await` faltante que hace que el assert corra antes de tiempo, un mock que devuelve justo lo esperado, o un test que ni siquiera se está ejecutando. Si se escribe el test después del código y pasa a la primera, no hay forma de saber si realmente está verificando algo. Verlo en rojo por el motivo esperado (y leer el mensaje de error) confirma que el test está conectado al comportamiento que describe. Es una práctica útil incluso sin hacer TDD: al arreglar un bug, primero escribir un test que lo reproduzca y verlo fallar, y recién después corregir el código.",
    respuestaEn:
      "Because a test that never failed may be passing for the wrong reason: a badly written assertion that's always true, a missing `await` making the assertion run too early, a mock returning exactly what's expected, or a test that isn't even running. If you write the test after the code and it passes first time, there's no way to know if it actually verifies anything. Seeing it red for the expected reason (and reading the error message) confirms the test is connected to the behavior it describes. It's useful even without TDD: when fixing a bug, first write a test that reproduces it and watch it fail, and only then fix the code.",
  },
  {
    nivel: 2,
    pregunta: "¿Usás TDD siempre? ¿Cuándo sí y cuándo no?",
    respuestaEs:
      "No siempre, y está bien decirlo en una entrevista con criterio. Rinde mucho cuando los requisitos están claros y la lógica tiene muchos casos: reglas de negocio, cálculos (precios, impuestos, envíos), validaciones, parsers, algoritmos, y al corregir bugs (el test que reproduce el bug primero). También en código crítico donde un error es caro. Rinde menos en exploración: prototipos, spikes para evaluar una librería o UI donde todavía no sabés qué querés, porque se tiran los tests junto con el código. Y en código mayormente de 'pegamento' (configuración, wiring de componentes) suele convenir más un test de integración escrito después. Una postura madura es usar TDD como herramienta para la lógica con reglas claras, y para el resto asegurarse de que los tests existan antes de mergear, aunque se escriban después.",
    respuestaEn:
      "Not always, and it's fine to say so in an interview with good judgment. It pays off when requirements are clear and logic has many cases: business rules, calculations (prices, taxes, shipping), validations, parsers, algorithms, and when fixing bugs (the reproducing test first). Also in critical code where an error is expensive. It pays off less in exploration: prototypes, spikes to evaluate a library, or UI where you don't yet know what you want, since tests get thrown away with the code. And in mostly 'glue' code (configuration, component wiring) an integration test written afterwards is often better. A mature stance is using TDD as a tool for logic with clear rules, and for the rest making sure tests exist before merging, even if written after.",
    tradeoffs:
      "TDD da diseño guiado por el uso y una suite completa, pero cuesta más al principio y puede sobre-especificar si se testea implementación en vez de comportamiento.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué es 'fake it till you make it' y por qué no es trampa?",
    respuestaEs:
      "Es la técnica de hacer pasar el primer test con la implementación más tonta posible, por ejemplo devolviendo una constante (`return 0`), y dejar que los tests siguientes obliguen a generalizar. Parece trampa, pero tiene dos funciones. Primero, mantiene los pasos chicos: cada ciclo agrega un comportamiento, así cuando algo falla, el cambio que lo rompió es mínimo. Segundo, evita escribir lógica que ningún test verifica: si al primer test ya escribías el algoritmo completo, parte de ese código no tiene un test que lo justifique. La generalización aparece por 'triangulación': con dos o tres ejemplos distintos, la implementación constante ya no alcanza y la regla real surge de los casos. Con experiencia, los pasos se agrandan cuando la implementación es obvia; los pasos chicos son para cuando no lo es.",
    respuestaEn:
      "It's the technique of passing the first test with the dumbest possible implementation, e.g. returning a constant (`return 0`), and letting later tests force generalization. It looks like cheating, but serves two purposes. First, it keeps steps small: each cycle adds one behavior, so when something fails, the breaking change is minimal. Second, it avoids writing logic no test verifies: if you wrote the full algorithm at the first test, part of that code has no test justifying it. Generalization comes through 'triangulation': with two or three different examples, the constant implementation no longer works and the real rule emerges from the cases. With experience, steps grow when the implementation is obvious; small steps are for when it isn't.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué diferencia hay entre TDD 'de adentro hacia afuera' y 'de afuera hacia adentro'?",
    respuestaEs:
      "Inside-out (escuela clásica o de Chicago) empieza por las piezas internas de dominio, con tests unitarios de funciones y objetos reales, y va construyendo hacia afuera hasta la interfaz; usa pocos mocks porque cuando llega a una capa, las de abajo ya existen. Da tests robustos a refactors, pero el riesgo es construir piezas que después no encajan con lo que la interfaz necesita. Outside-in (escuela de Londres o 'mockist') empieza por un test de aceptación del comportamiento visible (por ejemplo, un endpoint o un flujo de UI), y va bajando: cada capa se diseña con mocks de las que todavía no existen, descubriendo sus interfaces desde el uso. Asegura que todo lo construido se necesita, pero los tests quedan más acoplados a las interacciones entre objetos. Un enfoque habitual combina ambos: un test de aceptación externo que guía el trabajo (double loop TDD) y ciclos internos clásicos para la lógica.",
    respuestaEn:
      "Inside-out (classic or Chicago school) starts with the internal domain pieces, with unit tests of real functions and objects, and builds outward to the interface; it uses few mocks because when it reaches a layer, the ones below already exist. It yields refactor-resistant tests, but risks building pieces that later don't fit what the interface needs. Outside-in (London or 'mockist' school) starts with an acceptance test of visible behavior (e.g. an endpoint or UI flow), and works downward: each layer is designed with mocks of those not yet existing, discovering their interfaces from usage. It ensures everything built is needed, but tests end up more coupled to object interactions. A common approach combines both: an outer acceptance test guiding the work (double-loop TDD) and classic inner cycles for the logic.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo aplicás TDD sobre código legacy sin tests?",
    respuestaEs:
      "No se puede empezar por el ciclo red-green sobre código que no tiene tests y es difícil de aislar. Primero hay que ganar una red de seguridad con tests de caracterización: tests que documentan lo que el código HACE hoy (no lo que debería), ejecutándolo con entradas representativas y fijando las salidas actuales, incluso las que parecen bugs; herramientas de snapshot o approval testing ayudan. Con eso, cualquier cambio que altere el comportamiento se detecta. Después se aplican refactors pequeños y seguros para abrir 'costuras' (seams, en términos de Michael Feathers): extraer una función pura de un método gigante, inyectar una dependencia en vez de crearla adentro, separar el acceso a la base de la lógica. Recién ahí, para cada cambio nuevo o bug, se trabaja con TDD sobre la parte aislada. Es un proceso incremental: se mejora la zona que se toca, no se reescribe todo de golpe.",
    respuestaEn:
      "You can't start the red-green cycle on code with no tests that's hard to isolate. First you need a safety net of characterization tests: tests documenting what the code DOES today (not what it should), running it with representative inputs and pinning current outputs, even ones that look like bugs; snapshot or approval testing tools help. With that, any change altering behavior is detected. Then apply small, safe refactors to open 'seams' (in Michael Feathers' terms): extracting a pure function from a giant method, injecting a dependency instead of creating it inside, separating database access from logic. Only then, for each new change or bug, work with TDD on the isolated part. It's incremental: improve the area you touch, don't rewrite everything at once.",
  },
];
