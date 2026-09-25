import type { PreguntaEntrevista } from "../types";

export const entrevistaOperadoresControlFlujo: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué valores son falsy en JavaScript?",
    respuestaEs:
      "Son exactamente siete: false, 0, -0, 0n (BigInt cero), '' (string vacío), null, undefined y NaN. Todo lo demás es truthy, incluyendo cosas que parecen 'vacías' pero no lo son: un array vacío [], un objeto vacío {} y el string '0' son todas truthy, porque son objetos o strings no vacíos.",
    respuestaEn:
      "There are exactly seven: false, 0, -0, 0n (BigInt zero), '' (empty string), null, undefined, and NaN. Everything else is truthy — including things that look 'empty' but aren't: an empty array [], an empty object {}, and the string '0' are all truthy, because they're objects or non-empty strings.",
    codigo: `if ([]) console.log("un array vacío es truthy"); // se imprime
if ({}) console.log("un objeto vacío es truthy");  // se imprime
if ("0") console.log("el string '0' es truthy");   // se imprime`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre for, for...of y for...in?",
    respuestaEs:
      "for es el loop clásico con contador explícito (inicialización; condición; incremento). for...of itera sobre los valores de cualquier iterable (arrays, strings, Maps, Sets): es la forma preferida para recorrer datos. for...in itera sobre las claves enumerables de un objeto (incluyendo las heredadas del prototipo), y sobre arrays da los índices como strings — por eso no se recomienda para arrays.",
    respuestaEn:
      "for is the classic loop with an explicit counter (initialization; condition; increment). for...of iterates over the values of any iterable (arrays, strings, Maps, Sets): it's the preferred way to walk over data. for...in iterates over an object's enumerable keys (including inherited ones from the prototype), and over arrays it yields indices as strings — which is why it's discouraged for arrays.",
    codigo: `const arr = ["a", "b", "c"];

for (const valor of arr) console.log(valor);      // "a", "b", "c"
for (const indice in arr) console.log(indice);    // "0", "1", "2" (strings)`,
  },
  {
    nivel: 1,
    pregunta: "¿Cuándo conviene while o do...while en vez de for?",
    respuestaEs:
      "for conviene cuando se sabe de antemano cuántas vueltas dar (o se puede calcular con un contador). while conviene cuando la repetición depende de una condición externa que no tiene una cantidad fija de vueltas — por ejemplo, leer datos de un stream hasta que se acabe, o reintentar una operación hasta que tenga éxito. do...while es igual a while pero garantiza al menos una ejecución del cuerpo, útil cuando la primera vuelta siempre debe correr (por ejemplo, mostrar un menú al menos una vez antes de preguntar si continuar).",
    respuestaEn:
      "for makes sense when you know in advance how many iterations to run (or can compute it with a counter). while makes sense when the repetition depends on an external condition without a fixed number of iterations — for example, reading data from a stream until it runs out, or retrying an operation until it succeeds. do...while is like while but guarantees at least one run of the body, useful when the first iteration should always happen (for example, showing a menu at least once before asking whether to continue).",
    codigo: `let intentos = 0;
while (intentos < 3) {
  console.log("intento", intentos);
  intentos++;
} // condición chequeada ANTES de cada vuelta

let n = 5;
do {
  console.log("n vale", n);
  n++;
} while (n < 3); // se ejecuta 1 vez igual: condición chequeada DESPUÉS`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre || y ?? al elegir un valor por defecto?",
    respuestaEs:
      "|| devuelve el operando derecho si el izquierdo es falsy (incluye 0, '', false). ?? (nullish coalescing) solo devuelve el derecho si el izquierdo es null o undefined, respetando 0, '' o false como valores válidos. Por eso cantidad ?? 10 funciona bien cuando cantidad puede ser legítimamente 0, mientras que cantidad || 10 lo reemplazaría incorrectamente por 10.",
    respuestaEn:
      "|| returns the right-hand operand if the left is falsy (which includes 0, '', false). ?? (nullish coalescing) only returns the right side if the left is null or undefined, treating 0, '' or false as valid values. That's why cantidad ?? 10 works correctly when cantidad can legitimately be 0, while cantidad || 10 would incorrectly replace it with 10.",
    codigo: `const cantidad = 0;
console.log(cantidad || 10); // 10 — bug: 0 es un valor válido
console.log(cantidad ?? 10); // 0  — correcto`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene un switch en vez de una cadena de if/else if?",
    respuestaEs:
      "Cuando se compara un mismo valor contra varios casos discretos (un enum, un string de estado), switch suele ser más legible que una cadena larga de else if. La contra es el fallthrough implícito: olvidar un break hace que se ejecuten los casos siguientes también, un bug clásico. En TypeScript, un switch sobre una union discriminada además permite verificar exhaustividad (que no falte ningún caso) asignando el valor a never en el default.",
    respuestaEn:
      "When comparing the same value against several discrete cases (an enum, a status string), switch is usually more readable than a long else-if chain. The downside is implicit fallthrough: forgetting a break makes the following cases run too — a classic bug. In TypeScript, a switch over a discriminated union also lets you verify exhaustiveness (no case missing) by assigning the value to never in the default branch.",
    codigo: `function narrow(estado) {
  switch (estado) {
    case "cargando":
      return "Cargando...";
    case "listo":
      return "Listo";
    // falta un break acá sería el bug clásico de fallthrough
    default: {
      const _exhaustivo = estado; // TS: error si falta un caso del union
      return _exhaustivo;
    }
  }
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué se prefiere .map()/.filter() (o for...of) sobre for...in para recorrer un array?",
    respuestaEs:
      "for...in itera sobre propiedades enumerables, incluyendo las heredadas del prototipo (por ejemplo, si alguien extendió Array.prototype) y no garantiza el orden en todos los motores para claves no numéricas. Además entrega los índices como strings, no numbers, lo que puede causar bugs sutiles en comparaciones o aritmética. for...of y los métodos de array iteran solo los valores reales del array, en orden, sin esos riesgos.",
    respuestaEn:
      "for...in iterates over enumerable properties, including ones inherited from the prototype (for example, if someone extended Array.prototype), and doesn't guarantee order across engines for non-numeric keys. It also yields indices as strings, not numbers, which can cause subtle bugs in comparisons or arithmetic. for...of and array methods only iterate the array's actual values, in order, without those risks.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es el 'comma operator' y por qué casi nunca se usa a propósito?",
    respuestaEs:
      "El operador coma evalúa cada expresión separada por comas de izquierda a derecha y devuelve el valor de la última. Se usa casi exclusivamente en la parte de incremento de un for clásico, para actualizar más de una variable en cada vuelta. Fuera de ese contexto, suele ser un error de tipeo (confundir con un punto y coma) más que una elección deliberada, porque reduce mucho la legibilidad.",
    respuestaEn:
      "The comma operator evaluates each comma-separated expression left to right and returns the value of the last one. It's used almost exclusively in the increment clause of a classic for loop, to update more than one variable per iteration. Outside that context, it's usually a typo (confused with a semicolon) rather than a deliberate choice, since it hurts readability a lot.",
    codigo: `for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j); // actualiza dos variables por vuelta con el comma operator
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo se comporta break y continue con etiquetas (labels) en loops anidados?",
    respuestaEs:
      "Por defecto, break y continue afectan solo al loop más interno. Con una etiqueta (identificador seguido de dos puntos antes del loop externo), break etiqueta sale de ambos loops de una vez, y continue etiqueta salta a la siguiente iteración del loop externo. Es una herramienta poco usada porque casi siempre se puede reemplazar con una función que hace return temprano, más legible que las etiquetas.",
    respuestaEn:
      "By default, break and continue only affect the innermost loop. With a label (an identifier followed by a colon before the outer loop), a labeled break exits both loops at once, and a labeled continue jumps to the next iteration of the outer loop. It's rarely used because it can almost always be replaced with a function that returns early, which is more readable than labels.",
    codigo: `externo: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue externo; // salta a la siguiente i, no solo la siguiente j
    console.log(i, j);
  }
}`,
  },
];
