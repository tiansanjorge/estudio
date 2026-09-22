import type { PreguntaEntrevista } from "../types";

export const entrevistaIteradores: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace que un objeto sea 'iterable' en JavaScript, y qué usa ese protocolo?",
    respuestaEs:
      "Un objeto es iterable si implementa el método Symbol.iterator, que debe devolver un iterator: un objeto con un método .next() que devuelve {value, done}. for...of, el operador spread (...) y el destructuring de arrays usan este protocolo por debajo — no son casos especiales del lenguaje para arrays, funcionan con cualquier objeto que lo implemente (Array, String, Map, Set, o una clase propia).",
    respuestaEn:
      "An object is iterable if it implements the Symbol.iterator method, which must return an iterator: an object with a .next() method that returns {value, done}. for...of, the spread operator (...), and array destructuring all use this protocol under the hood — they're not special-cased language features for arrays, they work with any object that implements it (Array, String, Map, Set, or a custom class).",
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué ventaja te da un generador (function*) sobre implementar un iterator a mano?",
    respuestaEs:
      "Escribir un iterator a mano implica mantener manualmente el estado entre llamadas a .next() (por ejemplo, un índice guardado en una variable de closure) y devolver el objeto {value, done} explícitamente en cada paso. Un generador hace eso automáticamente: cada yield pausa la función y produce un valor, y la siguiente llamada a .next() la reanuda justo donde quedó, con todo su estado local intacto — el motor se encarga de la pausa/reanudación, uno solo escribe la lógica como si fuera secuencial.",
    respuestaEn:
      "Writing an iterator by hand means manually tracking state between .next() calls (e.g. an index stored in a closure variable) and explicitly returning the {value, done} object at each step. A generator does that automatically: each yield pauses the function and produces a value, and the next .next() call resumes it right where it left off, with all its local state intact — the engine handles the pause/resume, you just write the logic as if it were sequential.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué se dice que los generadores son 'lazy', y qué problema resuelve eso?",
    respuestaEs:
      "Un generador no calcula ningún valor hasta que se lo piden explícitamente con .next(): cada yield produce solo el siguiente valor de la secuencia, no todos de antemano. Esto permite representar secuencias infinitas (por ejemplo, un generador de números naturales que nunca termina) o muy costosas de calcular completas, sin el problema de memoria o tiempo que tendría construir un array con todos los valores de una. El costo se paga de a un valor por vez, solo cuando realmente se necesita.",
    respuestaEn:
      "A generator doesn't compute any value until it's explicitly asked for with .next(): each yield only produces the sequence's next value, not all of them upfront. This lets you represent infinite sequences (e.g. a generator of natural numbers that never ends) or ones too expensive to compute in full, without the memory or time cost of building an array with every value at once. The cost is paid one value at a time, only when it's actually needed.",
    tradeoffs:
      "Lazy evaluation ahorra memoria y permite secuencias infinitas, pero agrega indirección: no podés usar métodos de array (.map, .filter) directamente sobre un generador sin convertirlo primero, y depurar el estado 'congelado' en cada yield es menos directo que inspeccionar un array ya materializado.",
    repregunta:
      "¿Qué pasa si hacés Array.from() o spread sobre un generador infinito?",
    respuestaRepreguntaEs:
      "El proceso se cuelga (o eventualmente falla por memoria). Tanto Array.from() como el spread agotan completamente un iterable antes de devolver algo: llaman a .next() en loop hasta recibir done: true. Si el generador nunca llega a done: true porque representa una secuencia infinita, ese loop nunca termina — hay que consumir generadores infinitos con un límite explícito (por ejemplo, un for...of con un break, o tomando manualmente N valores con .next()), nunca materializándolos enteros de una.",
    respuestaRepreguntaEn:
      "The process hangs (or eventually crashes from memory exhaustion). Both Array.from() and spread fully drain an iterable before returning anything: they call .next() in a loop until they get done: true. If the generator never reaches done: true because it represents an infinite sequence, that loop never ends — infinite generators must be consumed with an explicit limit (e.g. a for...of with a break, or manually pulling N values with .next()), never materialized whole at once.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirve yield* dentro de un generador?",
    respuestaEs:
      "Delega la iteración a otro iterable (otro generador, un array, cualquier cosa iterable): en vez de hacer un loop manual que re-emite cada valor uno por uno con yield, yield* itera automáticamente el iterable delegado y reenvía cada uno de sus valores como si fueran propios del generador que delega. Además reenvía correctamente llamadas a .next(valor), .throw() y .return() al generador delegado, algo que un loop manual reimplementaría mal o incompleto. Es la forma correcta de componer generadores (por ejemplo, aplanar generadores anidados) sin perder ese comportamiento.",
    respuestaEn:
      "It delegates iteration to another iterable (another generator, an array, anything iterable): instead of writing a manual loop that re-emits each value one by one with yield, yield* automatically iterates the delegated iterable and forwards each of its values as if they were the delegating generator's own. It also correctly forwards .next(value), .throw(), and .return() calls to the delegated generator, something a manual loop would implement incorrectly or incompletely. It's the correct way to compose generators (e.g. flattening nested generators) without losing that behavior.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa cuando un for...of se corta antes de tiempo (break, return, throw dentro del loop) sobre un iterator custom?",
    respuestaEs:
      "El motor llama automáticamente al método .return() del iterator, si lo implementa, dándole la oportunidad de hacer cleanup (cerrar un archivo, liberar una conexión, cancelar un timer) antes de abandonar la iteración. Un generador ya implementa esto por vos: si tiene un try/finally alrededor del cuerpo, el bloque finally corre igual cuando el for...of se corta con un break, porque internamente eso invoca gen.return(), que fuerza al generador a 'retomar' justo para ejecutar el finally pendiente y terminar. Un iterator escrito a mano que no implemente .return() simplemente no tiene oportunidad de liberar sus recursos en ese escenario.",
    respuestaEn:
      "The engine automatically calls the iterator's .return() method, if it implements one, giving it a chance to clean up (close a file, release a connection, cancel a timer) before abandoning iteration. A generator already implements this for you: if it has a try/finally around its body, the finally block still runs when the for...of is cut short with a break, because internally that calls gen.return(), which forces the generator to 'resume' just to run the pending finally and terminate. A hand-written iterator that doesn't implement .return() simply has no chance to release its resources in that scenario.",
    repregunta:
      "¿Qué hace gen.throw(error) en un generador pausado, y para qué sirve?",
    respuestaRepreguntaEs:
      "Inyecta una excepción exactamente en el punto donde el generador está pausado (en la expresión yield actual), como si ese throw hubiera ocurrido ahí adentro. Si el cuerpo del generador tiene un try/catch alrededor de ese yield, lo captura normalmente y el generador puede seguir ejecutando su lógica de manejo de errores o cleanup. Sirve para propagar cancelación o errores 'hacia adentro' de un generador desde el código que lo consume — por ejemplo, para que un generador que representa una operación en curso pueda enterarse de que el consumidor decidió abortarla y reaccionar (liberar un recurso, revertir un estado) en vez de quedar simplemente pausado para siempre.",
    respuestaRepreguntaEn:
      "It injects an exception exactly at the point where the generator is paused (at the current yield expression), as if that throw had happened right there. If the generator's body has a try/catch around that yield, it catches it normally and the generator can continue running its error-handling or cleanup logic. It's used to propagate cancellation or errors 'inward' into a generator from the consuming code — for example, so a generator representing an in-progress operation can learn that the consumer decided to abort it and react (release a resource, roll back state) instead of just staying paused forever.",
  },
  {
    nivel: 3,
    pregunta:
      "¿En qué se diferencia el protocolo de un async iterator del de un iterator síncrono?",
    respuestaEs:
      "Un iterator síncrono implementa Symbol.iterator y su .next() devuelve directamente {value, done}. Un async iterator implementa Symbol.asyncIterator, y su .next() devuelve una Promise que resuelve a {value, done} — porque producir el siguiente valor puede implicar una operación asincrónica (leer el siguiente chunk de un stream, la siguiente página de una API). for await...of consume ese protocolo automáticamente, esperando cada Promise antes de continuar. Un async generator (async function*) combina ambos: su cuerpo puede usar await junto con yield, y el motor arma automáticamente el objeto que implementa Symbol.asyncIterator por vos.",
    respuestaEn:
      "A synchronous iterator implements Symbol.iterator and its .next() directly returns {value, done}. An async iterator implements Symbol.asyncIterator, and its .next() returns a Promise that resolves to {value, done} — because producing the next value might involve an asynchronous operation (reading the next chunk of a stream, the next page of an API). for await...of consumes that protocol automatically, awaiting each Promise before continuing. An async generator (async function*) combines both: its body can use await alongside yield, and the engine automatically builds the object implementing Symbol.asyncIterator for you.",
  },
];
