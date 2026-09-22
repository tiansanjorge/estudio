import type { PreguntaEntrevista } from "../types";

export const entrevistaHoisting: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es hoisting y qué diferencia hay entre var, let/const y function declarations?",
    respuestaEs:
      "Antes de ejecutar cualquier línea de un scope, JavaScript escanea ese scope entero y registra sus declaraciones en memoria — eso es hoisting, el código no se mueve, solo se procesa antes. var queda registrada con valor undefined desde ese momento. let y const también se registran, pero quedan en la Temporal Dead Zone: acceder antes de su línea da ReferenceError, no undefined. Una function declaration se registra completa, con su cuerpo, así que se puede llamar antes de la línea donde está escrita.",
    respuestaEn:
      "Before running any line of a scope, JavaScript scans that whole scope and registers its declarations in memory — that's hoisting; the code doesn't move, it just gets processed beforehand. var gets registered with value undefined from that point on. let and const also get registered, but stay in the Temporal Dead Zone: accessing them before their line throws a ReferenceError, not undefined. A function declaration gets registered whole, body included, so it can be called before the line where it's written.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué preferirías declarar una variable antes de usarla en vez de confiar en hoisting?",
    respuestaEs:
      "Aunque el hoisting técnicamente permita usar una var o llamar a una function declaration antes de su línea, escribir el código en el orden en que se ejecuta hace mucho más fácil de leer para otra persona (o para mí en seis meses). Además, con let/const el hoisting ni siquiera da un margen seguro: cualquier uso antes de la declaración es un error real por la TDZ, así que declarar-antes-de-usar es directamente la única forma correcta de trabajar con ellas.",
    respuestaEn:
      "Even though hoisting technically allows using a var or calling a function declaration before its line, writing code in the order it actually executes makes it much easier for someone else (or me in six months) to read. Also, with let/const hoisting doesn't even give you safe room to work with: any use before the declaration is a real error due to the TDZ, so declare-before-use is simply the only correct way to work with them.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Una class declaration se hoistea igual que una function declaration?",
    respuestaEs:
      "Se hoistea, pero con las reglas de let/const, no las de function: queda registrada en memoria pero en la Temporal Dead Zone hasta que se ejecuta la línea de la clase. Intentar instanciarla o extenderla antes de esa línea lanza ReferenceError, a diferencia de una function declaration que se puede llamar libremente antes de su definición porque se hoistea con el cuerpo completo.",
    respuestaEn:
      "It's hoisted, but with let/const rules, not function rules: it gets registered in memory but stays in the Temporal Dead Zone until the class's line runs. Trying to instantiate or extend it before that line throws a ReferenceError, unlike a function declaration, which can be freely called before its definition because it's hoisted with the full body.",
    codigo: `saludar(); // funciona, "hola" — hoisted con cuerpo completo
function saludar() { console.log('hola'); }

new Perro(); // ReferenceError: Cannot access 'Perro' before initialization
class Perro {}`,
    tradeoffs:
      "Esto sorprende a quien viene de pensar 'las clases son azúcar sobre funciones': sintácticamente se parecen a function declarations, pero para hoisting se comportan como let — la intuición de 'las funciones se pueden usar antes' no aplica.",
    repregunta:
      "¿Qué pasa si un import de un módulo ES referencia algo que ese módulo todavía no exportó, por una dependencia circular?",
    respuestaRepreguntaEs:
      "Los imports se hoistean al tope del módulo — conceptualmente, todo el grafo de módulos se resuelve y sus bindings se registran antes de ejecutar el cuerpo de cualquiera. Los named imports son 'live bindings' (referencias en vivo a la variable exportada, no una copia del valor), lo que permite que dos módulos con dependencia circular funcionen en muchos casos: aunque al momento del import el valor todavía no esté asignado, cuando el código que sí lo usa se ejecuta más tarde (por ejemplo, dentro de una función, no en el nivel superior), el binding ya está actualizado. El caso que sigue fallando es usar el valor importado directamente en el nivel superior del módulo, antes de que el módulo exportador haya llegado a esa asignación.",
    respuestaRepreguntaEn:
      "Imports are hoisted to the top of the module — conceptually, the whole module graph gets resolved and its bindings registered before any module's body runs. Named imports are 'live bindings' (live references to the exported variable, not a copy of the value), which lets two circularly-dependent modules work in many cases: even though the value isn't assigned yet at import time, by the time the code that actually uses it runs later (e.g. inside a function, not at the top level), the binding has already been updated. The case that still breaks is using the imported value directly at the module's top level, before the exporting module has reached that assignment.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué algunos linters (no-use-before-define) prohíben usar una función antes de declararla, si el hoisting técnicamente lo permite?",
    respuestaEs:
      "Es una regla de legibilidad y mantenibilidad, no de corrección técnica. Confiar en el hoisting para llamar una función antes de su definición hace que el lector tenga que saltar hacia adelante en el archivo para entender el flujo, y puede ocultar bugs si esa función después se reemplaza por una const con una arrow function (que sí tiene TDZ y rompería en runtime). Forzar declarar-antes-de-usar hace que el código se lea en el mismo orden en que se ejecuta.",
    respuestaEn:
      "It's a readability and maintainability rule, not a technical correctness one. Relying on hoisting to call a function before its definition forces the reader to jump forward in the file to follow the flow, and it can hide bugs if that function later gets replaced with a const arrow function (which does have a TDZ and would break at runtime). Forcing declare-before-use makes the code read in the same order it executes.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa si un parámetro con valor por defecto referencia a otro parámetro que se declara después en la misma función?",
    respuestaEs:
      "Los parámetros de una función viven en su propio scope, intermedio entre el scope externo y el cuerpo de la función, y se inicializan en orden de izquierda a derecha. Un parámetro puede usar en su valor por defecto a otro parámetro ya inicializado antes (`function f(a, b = a) {}` funciona), pero no a uno que se declara después: `function f(a = b, b) {}` lanza ReferenceError, porque en el momento de evaluar el default de `a`, `b` todavía está en la Temporal Dead Zone de ese scope de parámetros.",
    respuestaEn:
      "A function's parameters live in their own scope, in between the outer scope and the function body, and they're initialized left to right. A parameter can use an already-initialized earlier parameter in its default value (`function f(a, b = a) {}` works), but not one declared after it: `function f(a = b, b) {}` throws a ReferenceError, because at the moment `a`'s default is evaluated, `b` is still in that parameter scope's Temporal Dead Zone.",
    codigo: `function f(a, b = a) {
  return [a, b];
}
f(1); // [1, 1] — funciona, b puede usar a

function g(a = b, b) {
  return [a, b];
}
g(undefined, 1); // ReferenceError: Cannot access 'b' before initialization`,
    repregunta:
      "¿La cláusula `extends` de una clase se evalúa cuando se declara la clase o recién cuando se instancia?",
    respuestaRepreguntaEs:
      "Se evalúa inmediatamente cuando se ejecuta la declaración de la clase, no cuando se instancia. Por eso `class B extends A {}` lanza ReferenceError en ese mismo momento si `A` todavía está en su propia Temporal Dead Zone (por ejemplo, por un orden de declaración incorrecto o una dependencia circular mal resuelta entre módulos) — el error aparece al cargar el archivo, no al hacer `new B()`.",
    respuestaRepreguntaEn:
      "It's evaluated immediately when the class declaration runs, not when it's instantiated. That's why `class B extends A {}` throws a ReferenceError right at that point if `A` is still in its own Temporal Dead Zone (e.g. due to a wrong declaration order or a poorly resolved circular dependency between modules) — the error shows up when the file loads, not when you do `new B()`.",
    codigoRepregunta: `class B extends A {} // ReferenceError acá mismo, al declarar B

class A {}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Una function declaration dentro de un bloque ({ }) se hoistea al scope del bloque o al de la función contenedora?",
    respuestaEs:
      "Depende del modo. En strict mode (incluido siempre dentro de módulos ES o clases), una function declaration dentro de un bloque queda hoisteada solo hasta el tope de ESE bloque — block-scoped, como si fuera let. En modo no estricto, además existe el comportamiento legacy de compatibilidad web ('Annex B'): la función también queda asignada como var en el scope de la función contenedora (o global), visible incluso fuera del bloque una vez que este se ejecuta. El mismo código puede comportarse distinto según el modo o el motor, lo que la vuelve una fuente de bugs difíciles de reproducir entre entornos.",
    respuestaEn:
      "It depends on the mode. In strict mode (always the case inside ES modules or classes), a function declaration inside a block is hoisted only to the top of THAT block — block-scoped, like a let. In non-strict mode, there's also the legacy web-compatibility behavior ('Annex B'): the function also gets assigned as a var in the containing function's (or global) scope, visible even outside the block once it runs. The same code can behave differently depending on the mode or engine, making it a source of bugs that are hard to reproduce across environments.",
    codigo: `if (true) {
  function saludar() { return 'hola'; }
}

// strict mode / módulo ES: ReferenceError, saludar no existe acá afuera
// sloppy mode (Annex B, navegador): puede devolver 'hola'
console.log(typeof saludar);`,
  },
];
