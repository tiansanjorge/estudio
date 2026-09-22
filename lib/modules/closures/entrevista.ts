import type { PreguntaEntrevista } from "../types";

export const entrevistaClosures: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es una closure y por qué la variable capturada no se destruye?",
    respuestaEs:
      "Es una función que retiene acceso al scope léxico donde fue creada, aunque la función externa ya haya terminado de ejecutarse. Normalmente esas variables se liberarían al salir del call stack, pero como la closure todavía las referencia, el motor de JavaScript las mantiene vivas en el heap en vez de descartarlas.",
    respuestaEn:
      "It's a function that keeps access to the lexical scope where it was created, even after the outer function has already finished running. Normally those variables would be freed once the call stack unwinds, but since the closure still references them, the JS engine keeps them alive on the heap instead of discarding them.",
    codigo: `function crearContador() {
  let cuenta = 0;
  return function () {
    cuenta++;
    return cuenta;
  };
}

const contador = crearContador();
contador(); // 1
contador(); // 2
// "cuenta" sigue viva porque la función interna todavía la referencia.`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿para qué usarías una closure en vez de una variable global o una clase?",
    respuestaEs:
      "Para encapsular estado que no quiero que nadie de afuera pueda mutar directamente: una función factory que retorna funciones con acceso a variables privadas, sin exponerlas en el objeto retornado. Lo uso típicamente en debounce/throttle (guardar el id del timer entre llamadas) y en memoización (cachear resultados costosos).",
    respuestaEn:
      "To encapsulate state that I don't want anything outside to mutate directly: a factory function that returns functions with access to private variables, without exposing them on the returned object. I typically use it for debounce/throttle (holding the pending timer id between calls) and memoization (caching expensive results).",
  },
  {
    nivel: 2,
    pregunta:
      "¿Closures o clases con campos privados (#campo) para encapsular estado? ¿Qué trade-off hay?",
    respuestaEs:
      "Con closures, cada instancia (cada llamada a la función factory) crea su propia copia de los métodos internos, porque son funciones nuevas definidas en ese scope. Con clases, los métodos viven una sola vez en el prototipo y se comparten entre instancias; solo los campos de datos se duplican por instancia. En apps con miles de instancias (por ejemplo, nodos de una estructura de datos), las clases son más eficientes en memoria. Las closures ganan cuando la encapsulación real (no solo por convención) importa más que la cantidad de instancias, o en estilo funcional sin `this`.",
    respuestaEn:
      "With closures, each instance (each call to the factory function) creates its own copy of the inner methods, since they're new functions defined in that scope. With classes, methods live once on the prototype and are shared across instances; only data fields get duplicated per instance. In apps with thousands of instances (e.g. nodes in a data structure), classes are more memory-efficient. Closures win when real encapsulation (not just naming convention) matters more than instance count, or in functional style without `this`.",
    tradeoffs:
      "Closures: encapsulación real, sin `this`, pero duplican métodos por instancia. Clases: métodos compartidos en el prototipo (más eficientes a escala), pero `#privado` es más reciente y `this` puede perderse si el método se desacopla del objeto.",
    repregunta:
      "¿Cómo detectarías en producción que una closure de larga vida está causando un memory leak?",
    respuestaRepreguntaEs:
      "Tomando dos heap snapshots en Chrome DevTools con la app en el mismo estado 'lógico' (por ejemplo, después de abrir y cerrar el mismo modal varias veces) y comparándolos: si el conteo de instancias de una función o de un objeto retenido crece sin bajar, hay un leak. Después reviso los 'retainers' de ese objeto para ver qué closure lo está reteniendo — el caso típico es un event listener agregado pero nunca removido, que captura una referencia a un nodo del DOM o a un objeto grande.",
    respuestaRepreguntaEn:
      "By taking two heap snapshots in Chrome DevTools with the app in the same 'logical' state (e.g. after opening and closing the same modal several times) and comparing them: if the instance count of a function or a retained object keeps growing without dropping, there's a leak. Then I check that object's 'retainers' to see which closure is holding onto it — the typical case is an event listener that was added but never removed, capturing a reference to a DOM node or a large object.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja tiene el module pattern (IIFE con closures) frente a variables globales, y qué lo volvió obsoleto?",
    respuestaEs:
      "El module pattern envuelve código en una IIFE para crear un scope propio y evitar contaminar el scope global: solo expone lo que retorna explícitamente, todo lo demás queda privado por closure. Lo volvió obsoleto la llegada de los ES Modules, que dan scope por archivo de forma nativa (cada módulo tiene su propio scope sin necesidad de envolver nada), con mejor soporte de tooling (tree-shaking, imports estáticos analizables).",
    respuestaEn:
      "The module pattern wraps code in an IIFE to create its own scope and avoid polluting the global scope: it only exposes what it explicitly returns, everything else stays private via closure. It became obsolete with ES Modules, which give per-file scoping natively (each module has its own scope without wrapping anything), with better tooling support (tree-shaking, statically analyzable imports).",
    codigo: `const ContadorModulo = (function () {
  let privado = 0; // inaccesible desde afuera

  return {
    incrementar: () => ++privado,
    valor: () => privado,
  };
})();

ContadorModulo.incrementar();
ContadorModulo.valor(); // 1
ContadorModulo.privado; // undefined, nunca se expuso`,
  },
  {
    nivel: 3,
    pregunta:
      "¿V8 retiene todo el scope léxico externo cuando creás una closure, o solo lo que la closure realmente usa?",
    respuestaEs:
      "V8 optimiza esto: en la mayoría de los casos, solo mantiene vivas las variables que la closure efectivamente referencia (context allocation acotado), no todo el scope de la función externa. Pero esto no es garantía absoluta: si varias funciones internas comparten el mismo scope léxico (por ejemplo, dos closures definidas dentro de la misma función), todas terminan compartiendo el mismo 'contexto', y si UNA de ellas usa una variable pesada, esa variable queda retenida para todas, aunque las demás no la usen. Por eso separar closures en scopes más chicos y acotados ayuda a que el optimizador libere más memoria.",
    respuestaEn:
      "V8 optimizes this: in most cases it only keeps alive the variables the closure actually references (bounded context allocation), not the entire outer function's scope. But this isn't an absolute guarantee: if several inner functions share the same lexical scope (e.g. two closures defined inside the same function), they all end up sharing the same 'context', and if ONE of them uses a heavy variable, that variable stays retained for all of them, even the ones that don't use it. That's why splitting closures into smaller, tighter scopes helps the optimizer free more memory.",
    codigo: `function crear() {
  const datoLiviano = 1;
  const datoPesado = new Array(1_000_000).fill('x');

  function usaLiviano() {
    return datoLiviano;
  }
  function usaPesado() {
    return datoPesado.length;
  }

  return usaLiviano;
  // aunque solo se devuelve usaLiviano, comparte contexto con
  // usaPesado — datoPesado puede seguir retenido en memoria.
}`,
    repregunta:
      "¿Qué pasa con closures dentro de un loop que usa async/await en vez de setTimeout?",
    respuestaRepreguntaEs:
      "El mismo comportamiento de captura aplica: cada `await` dentro del loop suspende y crea una continuación que closurea sobre las variables vivas en ese punto. Con `let` en un `for`, cada vuelta tiene su propio binding, así que cada continuación async retoma con el valor correcto de esa vuelta. Con `var`, todas las continuaciones comparten el mismo binding y leen el valor final del loop cuando finalmente se resuelven — el mismo bug clásico de var, ahora con async/await en vez de setTimeout.",
    respuestaRepreguntaEn:
      "The same capture behavior applies: every `await` inside the loop suspends and creates a continuation that closes over whatever variables are alive at that point. With `let` in a `for`, each iteration has its own binding, so each async continuation resumes with that iteration's correct value. With `var`, all continuations share the same binding and read the loop's final value once they eventually resolve — the same classic var bug, now with async/await instead of setTimeout.",
    codigoRepregunta: `for (var i = 0; i < 3; i++) {
  await algoAsincronico();
  console.log(i); // imprime 3, 3, 3 — todas comparten la misma i
}

for (let j = 0; j < 3; j++) {
  await algoAsincronico();
  console.log(j); // imprime 0, 1, 2 — cada vuelta tiene su propio binding
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo funciona la recursión de una function expression con nombre gracias a closures?",
    respuestaEs:
      "Una function expression con nombre (`const fact = function factorial(n) { ... }`) crea un binding adicional, visible solo dentro del cuerpo de la función, que apunta a la función misma — independiente de la variable externa (`fact`) a la que se asignó. Eso es una closure sobre su propio nombre: permite que la función se llame a sí misma de forma recursiva (`factorial(n - 1)`) incluso si la variable externa `fact` es reasignada o queda fuera de scope, porque la referencia interna no depende de ella.",
    respuestaEn:
      "A named function expression (`const fact = function factorial(n) { ... }`) creates an extra binding, visible only inside the function body, pointing to the function itself — independent of the outer variable (`fact`) it was assigned to. That's a closure over its own name: it lets the function call itself recursively (`factorial(n - 1)`) even if the outer `fact` variable gets reassigned or goes out of scope, because the internal reference doesn't depend on it.",
    codigo: `let fact = function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
};

const otraReferencia = fact;
fact = null; // 'factorial' sigue funcionando igual, no depende de 'fact'
otraReferencia(5); // 120`,
  },
];
