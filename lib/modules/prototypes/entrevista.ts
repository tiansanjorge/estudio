import type { PreguntaEntrevista } from "../types";

export const entrevistaPrototypes: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es la cadena de prototipos y cómo la usa JS para resolver una propiedad?",
    respuestaEs:
      "Cada objeto tiene una referencia interna a otro objeto, su prototipo ([[Prototype]], accesible con Object.getPrototypeOf). Cuando accedés a una propiedad que el objeto no tiene como propia, el motor sube por esa cadena de prototipos, buscando en cada nivel, hasta encontrarla o llegar a null (el final de la cadena, típicamente después de Object.prototype). Es el mismo mecanismo de búsqueda por niveles que la scope chain, pero para propiedades de objetos en vez de variables.",
    respuestaEn:
      "Every object has an internal reference to another object, its prototype ([[Prototype]], accessible via Object.getPrototypeOf). When you access a property the object doesn't have as its own, the engine climbs that prototype chain, checking at each level, until it finds it or reaches null (the end of the chain, typically after Object.prototype). It's the same level-by-level lookup mechanism as the scope chain, but for object properties instead of variables.",
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué hace realmente `class Hijo extends Padre` por debajo, en términos de prototipos?",
    respuestaEs:
      "class es azúcar sintáctico sobre el sistema de prototipos que ya existía en JS. `extends` conecta Hijo.prototype como un objeto cuyo prototipo es Padre.prototype, así que las instancias de Hijo encuentran, por la cadena, tanto los métodos definidos en Hijo como los heredados de Padre. Los métodos declarados dentro de una clase se definen una sola vez en el prototype, compartidos por todas las instancias — no se duplican por cada `new`, a diferencia de una función asignada dentro del constructor.",
    respuestaEn:
      "class is syntactic sugar over the prototype system JS already had. `extends` connects Hijo.prototype as an object whose prototype is Padre.prototype, so instances of Hijo find, via the chain, both methods defined on Hijo and those inherited from Padre. Methods declared inside a class are defined once on the prototype, shared by all instances — they're not duplicated on every `new`, unlike a function assigned inside the constructor.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Composición o herencia de clases? ¿Cuándo conviene cada una?",
    respuestaEs:
      "Herencia (`extends`) modela una relación 'es un' y tiene sentido cuando de verdad hay una jerarquía natural y estable (un `Perro` es un `Animal`). Se vuelve un problema cuando se usa para compartir código entre cosas que no tienen esa relación real: jerarquías profundas de varios niveles se vuelven frágiles ante cambios en la clase base ('fragile base class problem'), porque modificar un método heredado puede romper silenciosamente a todos los descendientes. La composición (combinar comportamientos con funciones factory, mixins vía Object.assign, o simplemente pasando dependencias) modela 'tiene un' y es más flexible para compartir funcionalidad entre objetos sin relación jerárquica.",
    respuestaEn:
      "Inheritance (`extends`) models an 'is-a' relationship and makes sense when there's genuinely a natural, stable hierarchy (a `Dog` is an `Animal`). It becomes a problem when used to share code between things without that real relationship: deep multi-level hierarchies become fragile against changes to the base class (the 'fragile base class problem'), because modifying an inherited method can silently break every descendant. Composition (combining behaviors via factory functions, mixins through Object.assign, or simply passing dependencies) models 'has-a' and is more flexible for sharing functionality between unrelated objects.",
    tradeoffs:
      "Herencia: menos código repetido cuando la jerarquía es real y estable, pero acopla fuertemente a los descendientes con la base. Composición: más flexible y desacoplada, pero puede requerir más código explícito para 'conectar' comportamientos.",
    repregunta:
      "¿Qué ventaja tiene Object.create(null) sobre un objeto literal {} para representar un diccionario de datos externos?",
    respuestaRepreguntaEs:
      "Un objeto literal {} hereda de Object.prototype, así que trae consigo métodos como toString, hasOwnProperty o constructor. Si ese objeto se usa como diccionario con claves que vienen de una fuente externa (por ejemplo, nombres de usuario, o keys de una API), una clave que coincida con el nombre de un método heredado (como 'toString' o 'constructor') puede generar bugs sutiles al acceder a ella esperando el valor del diccionario y obteniendo la función heredada en su lugar. Object.create(null) crea un objeto sin prototipo — sin ninguno de esos métodos heredados — eliminando esa clase entera de colisiones.",
    respuestaRepreguntaEn:
      "A literal object {} inherits from Object.prototype, so it comes with methods like toString, hasOwnProperty, or constructor. If that object is used as a dictionary with keys coming from an external source (e.g. usernames, or API keys), a key that matches an inherited method's name (like 'toString' or 'constructor') can cause subtle bugs when accessed expecting the dictionary's value and getting the inherited function instead. Object.create(null) creates an object with no prototype — none of those inherited methods — eliminating that whole class of collisions.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué cambiar el prototipo de un objeto ya creado con Object.setPrototypeOf es una mala práctica de performance?",
    respuestaEs:
      "Los motores modernos optimizan el acceso a propiedades asumiendo que la 'forma' de un objeto (qué propiedades tiene, en qué orden, y cuál es su prototipo) se mantiene estable después de creado — eso les permite usar inline caches que aceleran accesos repetidos al mismo tipo de objeto. Cambiar el prototipo dinámicamente después de la creación invalida esas suposiciones para ese objeto (y potencialmente para todos los que comparten esa forma), forzando al motor a des-optimizar el acceso a sus propiedades. Si necesitás que un objeto tenga cierto prototipo, es mucho mejor definirlo en el momento de creación (con Object.create o el constructor correspondiente) que cambiarlo después.",
    respuestaEn:
      "Modern engines optimize property access by assuming an object's 'shape' (which properties it has, in what order, and what its prototype is) stays stable after creation — that lets them use inline caches that speed up repeated accesses to the same object type. Changing the prototype dynamically after creation invalidates those assumptions for that object (and potentially for every object sharing that shape), forcing the engine to de-optimize property access on it. If you need an object to have a certain prototype, it's much better to set it at creation time (with Object.create or the appropriate constructor) than to change it afterward.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué son las 'hidden classes' (shapes) en V8 y cómo se relacionan con el sistema de prototipos?",
    respuestaEs:
      "Son una estructura interna que el motor usa para optimizar el acceso a propiedades: dos objetos creados con las mismas propiedades, agregadas en el mismo orden, comparten la misma hidden class, lo que permite al motor calcular el offset de cada propiedad en memoria una sola vez y reusarlo (inline caching) en vez de buscar por nombre cada vez. Es un mecanismo distinto pero relacionado al prototype chain: la hidden class optimiza el acceso a las propiedades PROPIAS de un objeto con una forma dada, mientras que el prototype chain es lo que se recorre cuando la propiedad NO es propia. Agregar propiedades dinámicamente en un orden distinto entre instancias, o mutar el prototipo, genera hidden classes distintas y pierde esa optimización.",
    respuestaEn:
      "They're an internal structure the engine uses to optimize property access: two objects created with the same properties, added in the same order, share the same hidden class, which lets the engine compute each property's memory offset once and reuse it (inline caching) instead of looking it up by name every time. It's a distinct but related mechanism to the prototype chain: the hidden class optimizes access to an object's OWN properties for a given shape, while the prototype chain is what gets traversed when the property is NOT its own. Adding properties dynamically in a different order between instances, or mutating the prototype, generates different hidden classes and loses that optimization.",
    repregunta:
      "¿`super.metodo()` dentro de un método de clase depende de `this` para saber en qué prototipo buscar hacia arriba?",
    respuestaRepreguntaEs:
      "No. `super` usa una referencia interna del método llamada [[HomeObject]], fijada en el momento en que el método se define (apunta al prototype donde ese método fue declarado), no en `this`. Por eso, si extraés un método que usa `super` y lo llamás con un `this` distinto (por ejemplo, con `.call()` sobre otro objeto), `super.metodo()` sigue resolviendo desde el prototipo original donde se definió el método, no desde el prototipo de ese otro `this` — a diferencia de un `this.algo()` normal, que sí depende completamente de cómo se invoque la función.",
    respuestaRepreguntaEn:
      "No. `super` uses an internal method reference called [[HomeObject]], fixed at the moment the method is defined (it points to the prototype where that method was declared), not `this`. So if you extract a method that uses `super` and call it with a different `this` (e.g. via `.call()` on another object), `super.metodo()` still resolves from the original prototype where the method was defined, not from that other `this`'s prototype — unlike a regular `this.algo()`, which fully depends on how the function is invoked.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Object.freeze(objeto) impide que se modifiquen las propiedades heredadas de su prototipo?",
    respuestaEs:
      "No. Object.freeze solo afecta las propiedades PROPIAS del objeto congelado: impide agregar, eliminar o modificar esas propiedades directas, y evita reasignar su prototipo. Pero no toca el prototipo en sí — si una propiedad se resuelve por herencia (viene del prototype), ese prototipo sigue siendo completamente mutable a menos que también se lo congele explícitamente. Es un error común asumir que congelar una instancia protege todo lo que esa instancia 'expone', cuando en realidad solo protege lo que le pertenece directamente a ella.",
    respuestaEn:
      "No. Object.freeze only affects the frozen object's OWN properties: it prevents adding, removing, or modifying those direct properties, and prevents reassigning its prototype. But it doesn't touch the prototype itself — if a property resolves through inheritance (comes from the prototype), that prototype remains fully mutable unless it's also explicitly frozen. It's a common mistake to assume freezing an instance protects everything that instance 'exposes', when it actually only protects what belongs to it directly.",
  },
];
