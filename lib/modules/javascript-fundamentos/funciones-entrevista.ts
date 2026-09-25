import type { PreguntaEntrevista } from "../types";

export const entrevistaFunciones: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta:
      "¿Qué diferencia hay entre function declaration, function expression y arrow function?",
    respuestaEs:
      "function declaration (function saludar() {}) sufre hoisting completo: se puede llamar antes de la línea donde está escrita. function expression (const saludar = function() {}) es una función asignada a una variable, y solo existe después de esa línea (la variable sufre hoisting, pero queda undefined hasta la asignación). Arrow function (const saludar = () => {}) es sintaxis más corta, sin su propio this ni arguments — los toma del scope donde fue definida.",
    respuestaEn:
      "A function declaration (function greet() {}) gets fully hoisted: it can be called before the line where it's written. A function expression (const greet = function() {}) is a function assigned to a variable, and only exists after that line (the variable is hoisted, but stays undefined until the assignment). An arrow function (const greet = () => {}) is shorter syntax with no own this or arguments — it takes them from the scope where it was defined.",
    codigo: `saludar(); // funciona: hoisting completo
function saludar() { console.log("hola"); }

decir(); // TypeError: decir is not a function (todavía es undefined)
var decir = function () { console.log("hola"); };`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué son los parámetros por defecto y el rest parameter?",
    respuestaEs:
      "Un parámetro por defecto (function f(x = 10)) le da un valor a x cuando se llama a la función sin ese argumento o pasando undefined explícitamente. El rest parameter (function f(...args)) junta todos los argumentos restantes (los que no tienen parámetro nombrado) en un array real, reemplazando al objeto arguments para ese uso.",
    respuestaEn:
      "A default parameter (function f(x = 10)) gives x a value when the function is called without that argument, or when undefined is passed explicitly. The rest parameter (function f(...args)) collects all remaining arguments (the ones without a named parameter) into a real array, replacing the arguments object for that use case.",
    codigo: `function sumarTodo(primero = 0, ...resto) {
  return resto.reduce((acc, n) => acc + n, primero);
}
sumarTodo();          // 0
sumarTodo(1, 2, 3);   // 6`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuál es la diferencia clave de this entre una función regular y una arrow function?",
    respuestaEs:
      "Una función regular tiene su propio this, que se determina en el momento en que se la llama (depende de cómo se invoca: como método, standalone, con new, etc.). Una arrow function no tiene this propio: lo hereda léxicamente del scope donde fue definida, como si fuera una variable más. Por eso las arrow functions son ideales como callbacks dentro de un método, para no perder la referencia a this del objeto contenedor.",
    respuestaEn:
      "A regular function has its own this, determined at call time (it depends on how it's invoked: as a method, standalone, with new, etc.). An arrow function has no own this: it inherits it lexically from the scope where it was defined, just like a regular variable. That's why arrow functions are ideal as callbacks inside a method, to avoid losing the reference to the containing object's this.",
    codigo: `const contador = {
  valor: 0,
  incrementar() {
    setTimeout(function () {
      this.valor++; // this acá NO es contador (es undefined o globalThis)
    }, 100);
    setTimeout(() => {
      this.valor++; // this acá SÍ es contador (heredado del método)
    }, 100);
  },
};`,
    repregunta: "¿Cómo se resolvía este problema antes de que existieran las arrow functions?",
    respuestaRepreguntaEs:
      "Guardando una referencia a this en una variable normal antes del callback (const self = this, o const that = this) y usándola dentro. También se usaba .bind(this) para fijar el this de la función anidada. Las arrow functions resolvieron esto de forma nativa, sin esos workarounds.",
    respuestaRepreguntaEn:
      "By saving a reference to this in a regular variable before the callback (const self = this, or const that = this) and using it inside. .bind(this) was also used to fix the nested function's this. Arrow functions solved this natively, without those workarounds.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencia hay entre call, apply y bind?",
    respuestaEs:
      "Los tres sirven para invocar una función con un this explícito. call(thisArg, arg1, arg2) la ejecuta inmediatamente pasando los argumentos uno por uno. apply(thisArg, [arg1, arg2]) hace lo mismo pero recibe los argumentos como un array. bind(thisArg) no ejecuta la función: devuelve una nueva función con ese this (y opcionalmente algunos argumentos) fijados para siempre, útil para pasarla como callback sin perder el this.",
    respuestaEn:
      "All three invoke a function with an explicit this. call(thisArg, arg1, arg2) runs it immediately, passing arguments one by one. apply(thisArg, [arg1, arg2]) does the same but takes the arguments as an array. bind(thisArg) doesn't run the function: it returns a new function with that this (and optionally some arguments) permanently fixed, useful for passing it as a callback without losing this.",
    codigo: `function saludar(saludo) { return \`\${saludo}, \${this.nombre}\`; }
const persona = { nombre: "Ana" };

saludar.call(persona, "Hola");     // "Hola, Ana" — ejecuta ya
saludar.apply(persona, ["Hola"]);  // "Hola, Ana" — args como array
const saludarAna = saludar.bind(persona);
saludarAna("Hola");                // "Hola, Ana" — this fijado, ejecuta después`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué diferencia hay entre el objeto arguments y el rest parameter, más allá de la sintaxis?",
    respuestaEs:
      "arguments es un objeto array-like (tiene length e índices, pero no los métodos de Array como map o filter) y no existe en arrow functions — dentro de una arrow, arguments se resuelve al de la función regular más cercana que la contiene. El rest parameter es un array real, con todos sus métodos disponibles, y sí funciona dentro de arrow functions porque es solo sintaxis de parámetros, no un objeto mágico ligado al tipo de función.",
    respuestaEn:
      "arguments is an array-like object (it has length and indices, but not Array methods like map or filter) and doesn't exist inside arrow functions — inside an arrow, arguments resolves to the closest enclosing regular function's. The rest parameter is a real array, with all its methods available, and does work inside arrow functions because it's just parameter syntax, not a magic object tied to the function type.",
    codigo: `function normal() {
  console.log(arguments.length); // funciona
}

const flecha = () => {
  console.log(arguments); // ReferenceError si no hay función regular contenedora
};`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Para qué sirve nombrar una function expression (const f = function nombre() {}) en vez de dejarla anónima?",
    respuestaEs:
      "El nombre queda disponible dentro del propio cuerpo de la función (pero no fuera de ella), lo que permite recursión estable sin depender de la variable externa a la que se asignó. Si esa variable se reasigna después, una llamada recursiva por el nombre interno sigue apuntando a la función original, mientras que recursión por el nombre de la variable externa apuntaría al nuevo valor. También mejora los stack traces en debugging, porque el nombre aparece en vez de 'anonymous'.",
    respuestaEn:
      "The name is available inside the function's own body (but not outside it), which allows stable recursion without depending on the outer variable it was assigned to. If that variable gets reassigned later, a recursive call by the inner name still points to the original function, while recursion by the outer variable name would point to the new value. It also improves stack traces during debugging, since the name shows up instead of 'anonymous'.",
    codigo: `let factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // "fact" es estable aunque reasignen factorial
};
const otraRef = factorial;
factorial = null;
console.log(otraRef(5)); // 120 — sigue funcionando`,
  },
];
