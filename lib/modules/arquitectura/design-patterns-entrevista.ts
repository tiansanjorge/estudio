import type { PreguntaEntrevista } from "../types";

export const entrevistaDesignPatterns: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "Explicá el patrón Strategy con un ejemplo real.",
    respuestaEs:
      "Strategy encapsula algoritmos intercambiables detrás de una misma interfaz, para elegir cuál usar en tiempo de ejecución sin que el código que los usa cambie. Ejemplo: el cálculo del costo de envío. En vez de una función con un `if/switch` por tipo de envío (estándar, express, retiro) que crece con cada opción nueva, cada tipo es una estrategia con un método `calcular(envio)`, y el checkout recibe la estrategia elegida y solo delega. Agregar 'moto en el día' es agregar una estrategia, sin tocar el checkout: cumple el principio abierto/cerrado. En JavaScript no hacen falta clases: una estrategia puede ser simplemente una función, y un mapa `{ estandar: fn, express: fn }` ya es el patrón. Otros ejemplos: métodos de pago, algoritmos de ordenamiento en una tabla, reglas de validación, políticas de reintento.",
    respuestaEn:
      "Strategy encapsulates interchangeable algorithms behind the same interface, to choose one at runtime without the calling code changing. Example: shipping cost. Instead of a function with an `if/switch` per shipping type (standard, express, pickup) that grows with each new option, each type is a strategy with a `calculate(shipment)` method, and checkout receives the chosen strategy and just delegates. Adding 'same-day motorbike' means adding a strategy, without touching checkout: it follows the open/closed principle. In JavaScript you don't need classes: a strategy can simply be a function, and a map `{ standard: fn, express: fn }` is already the pattern. Other examples: payment methods, table sorting algorithms, validation rules, retry policies.",
    codigo: `const estrategias: Record<TipoEnvio, (e: Envio) => number> = {
  estandar: (e) => 1500 + e.pesoKg * 200,
  express: (e) => (1500 + e.pesoKg * 200) * 1.8,
  retiro: () => 0,
};

const costo = estrategias[tipoElegido](envio);`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué es el patrón Observer y dónde lo ves en el día a día del frontend?",
    respuestaEs:
      "Observer define una relación uno a muchos: un sujeto (emisor) mantiene una lista de observadores (suscriptores) y los notifica cuando pasa algo, sin conocer qué hace cada uno. Los suscriptores se agregan y se quitan dinámicamente. Desacopla al que produce el evento de los que reaccionan: el checkout emite 'pedido confirmado' y no sabe que Inventario, Email y Analytics lo escuchan. En el frontend está por todas partes: `addEventListener` del DOM es Observer; los stores como Zustand o Redux notifican a los componentes suscriptos cuando cambia el estado; `useSyncExternalStore` de React es literalmente una API de suscripción; los Observables de RxJS; y el `IntersectionObserver` o `ResizeObserver` del navegador. El detalle clave en la práctica es DESUSCRIBIRSE (el cleanup de un `useEffect`), porque un suscriptor olvidado es un memory leak y puede ejecutar lógica sobre componentes desmontados.",
    respuestaEn:
      "Observer defines a one-to-many relationship: a subject (emitter) keeps a list of observers (subscribers) and notifies them when something happens, without knowing what each one does. Subscribers are added and removed dynamically. It decouples the event producer from the reactors: checkout emits 'order confirmed' and doesn't know Inventory, Email and Analytics listen. In frontend it's everywhere: DOM `addEventListener` is Observer; stores like Zustand or Redux notify subscribed components when state changes; React's `useSyncExternalStore` is literally a subscription API; RxJS Observables; and the browser's `IntersectionObserver` or `ResizeObserver`. The key practical detail is UNSUBSCRIBING (the `useEffect` cleanup), since a forgotten subscriber is a memory leak and may run logic on unmounted components.",
  },
  {
    nivel: 2,
    pregunta: "¿Para qué sirve una Factory y cuándo es mejor un simple `new`?",
    respuestaEs:
      "Una Factory centraliza la decisión de QUÉ objeto concreto crear: el que llama pide 'un notificador para este canal' o 'un cliente de pagos para este país', y la factory decide la clase, la configura y la devuelve detrás de una interfaz común. Sirve cuando la clase concreta depende de un dato de runtime (configuración, tipo de usuario, entorno), cuando la construcción es compleja (dependencias, configuración, validaciones) y no querés repetirla en cada lugar, o cuando querés que el código cliente dependa de una interfaz y no de las implementaciones. Un `new` directo es mejor cuando hay una sola implementación y construirla es trivial: meter una factory ahí es indirección sin beneficio. En JavaScript la forma idiomática suele ser una función `crearX(opciones)` en lugar de una jerarquía de clases factory; el Factory Method y el Abstract Factory de GoF son variantes más formales del mismo objetivo.",
    respuestaEn:
      "A Factory centralizes the decision of WHICH concrete object to create: the caller asks for 'a notifier for this channel' or 'a payment client for this country', and the factory picks the class, configures it and returns it behind a common interface. It's useful when the concrete class depends on runtime data (config, user type, environment), when construction is complex (dependencies, configuration, validation) and you don't want to repeat it everywhere, or when you want client code depending on an interface rather than implementations. A direct `new` is better when there's a single implementation and building it is trivial: a factory there is indirection with no benefit. In JavaScript the idiomatic form is usually a `createX(options)` function rather than a hierarchy of factory classes; GoF's Factory Method and Abstract Factory are more formal variants of the same goal.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué otros patrones usás seguido en aplicaciones web modernas?",
    respuestaEs:
      "Algunos que aparecen a diario: ADAPTER, para envolver una API externa con una interfaz propia (el cliente de un proveedor de pagos, un SDK de analytics), base de la arquitectura hexagonal. FACADE, una interfaz simple sobre un subsistema complejo (un `apiClient` que esconde fetch, headers, auth, reintentos y parseo de errores). DECORATOR, agregar comportamiento envolviendo sin modificar: los higher-order components y los middlewares de Express o de Redux son decoradores. COMPOSITE, tratar igual a elementos individuales y grupos: el árbol de componentes de React y los menús anidados. SINGLETON, una única instancia compartida (el cliente de Prisma, el QueryClient), que en JS se logra naturalmente con un módulo, porque los módulos se evalúan una vez. Y PUB/SUB, una variante de Observer con un intermediario (un bus o broker) entre emisores y suscriptores. Lo importante en una entrevista no es recitar el catálogo, sino reconocer qué problema resuelve cada uno.",
    respuestaEn:
      "Some that show up daily: ADAPTER, wrapping an external API with your own interface (a payment provider client, an analytics SDK), the basis of hexagonal architecture. FACADE, a simple interface over a complex subsystem (an `apiClient` hiding fetch, headers, auth, retries and error parsing). DECORATOR, adding behavior by wrapping without modifying: higher-order components and Express or Redux middlewares are decorators. COMPOSITE, treating individual elements and groups alike: React's component tree and nested menus. SINGLETON, a single shared instance (the Prisma client, the QueryClient), naturally achieved in JS with a module, since modules evaluate once. And PUB/SUB, an Observer variant with an intermediary (a bus or broker) between publishers and subscribers. What matters in an interview isn't reciting the catalog, but recognizing which problem each solves.",
  },
  {
    nivel: 3,
    pregunta: "¿Cuándo un patrón de diseño empeora el código?",
    respuestaEs:
      "Cuando se aplica por el patrón y no por el problema. Síntomas: interfaces con una sola implementación que nunca va a tener otra; una factory que siempre devuelve la misma clase; un Strategy para dos casos que nunca van a crecer, donde un `if` era más claro; capas de abstracción que obligan a saltar por cinco archivos para seguir un flujo simple. Cada patrón agrega indirección, y la indirección tiene costo de lectura y de mantenimiento; solo se paga si compra algo concreto: extensibilidad que efectivamente se usa, testeabilidad, o aislar algo que cambia. El caso clásico de daño es el Singleton como estado global mutable, que acopla todo, complica los tests (el estado sobrevive entre tests) y oculta dependencias. Una buena práctica es la 'regla de tres': esperar a tener dos o tres casos reales antes de abstraer, en vez de anticipar variaciones que quizás nunca lleguen (YAGNI).",
    respuestaEn:
      "When it's applied for the pattern's sake and not for the problem. Symptoms: interfaces with a single implementation that will never have another; a factory that always returns the same class; a Strategy for two cases that will never grow, where an `if` was clearer; abstraction layers forcing you through five files to follow a simple flow. Every pattern adds indirection, and indirection has a reading and maintenance cost; it only pays off if it buys something concrete: extensibility that's actually used, testability, or isolating something that changes. The classic harmful case is the Singleton as mutable global state, which couples everything, complicates tests (state survives between tests) and hides dependencies. A good practice is the 'rule of three': wait for two or three real cases before abstracting, instead of anticipating variations that may never come (YAGNI).",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo implementarías un Observer con tipado fuerte en TypeScript para varios eventos?",
    respuestaEs:
      "Con un mapa de eventos como parámetro de tipo: se define una interfaz donde cada clave es el nombre del evento y el valor es el tipo de su payload (`{ pedidoConfirmado: { id: string; total: number }; sesionCerrada: { usuarioId: string } }`), y el emisor es genérico sobre ese mapa. `on<K extends keyof Eventos>(evento: K, fn: (payload: Eventos[K]) => void)` y `emit<K extends keyof Eventos>(evento: K, payload: Eventos[K])` hacen que emitir un evento con el payload equivocado, o escuchar uno que no existe, sea un error de compilación, y que el suscriptor reciba el tipo correcto sin anotaciones. `on` devuelve una función para desuscribirse, ideal para el cleanup de un `useEffect`. Internamente se guarda un `Map<keyof Eventos, Set<Función>>`. Conviene además decidir qué pasa si un suscriptor lanza un error: si no se aísla con try/catch, un suscriptor roto impide que los siguientes se ejecuten.",
    respuestaEn:
      "With an event map as a type parameter: define an interface where each key is the event name and the value is its payload type (`{ orderConfirmed: { id: string; total: number }; sessionClosed: { userId: string } }`), and make the emitter generic over that map. `on<K extends keyof Events>(event: K, fn: (payload: Events[K]) => void)` and `emit<K extends keyof Events>(event: K, payload: Events[K])` make emitting an event with the wrong payload, or listening to one that doesn't exist, a compile error, and give the subscriber the right type without annotations. `on` returns an unsubscribe function, ideal for a `useEffect` cleanup. Internally a `Map<keyof Events, Set<Function>>` is kept. You should also decide what happens if a subscriber throws: if not isolated with try/catch, one broken subscriber prevents the next ones from running.",
    codigo: `class EmisorTipado<Eventos extends Record<string, unknown>> {
  private handlers = new Map<keyof Eventos, Set<(p: never) => void>>();

  on<K extends keyof Eventos>(evento: K, fn: (payload: Eventos[K]) => void) {
    const set = this.handlers.get(evento) ?? new Set();
    set.add(fn as (p: never) => void);
    this.handlers.set(evento, set);
    return () => set.delete(fn as (p: never) => void);
  }

  emit<K extends keyof Eventos>(evento: K, payload: Eventos[K]) {
    this.handlers.get(evento)?.forEach((fn) => (fn as (p: Eventos[K]) => void)(payload));
  }
}`,
  },
];
