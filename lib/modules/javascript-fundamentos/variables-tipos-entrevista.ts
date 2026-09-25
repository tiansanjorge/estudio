import type { PreguntaEntrevista } from "../types";

export const entrevistaVariablesTipos: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuál es la diferencia real entre var, let y const?",
    respuestaEs:
      "var es function-scoped (o global) y se puede reasignar y redeclarar; además sufre hoisting inicializándose en undefined. let y const son block-scoped: solo existen dentro del bloque {} donde se declaran. La diferencia entre let y const no es sobre el valor, sino sobre el binding: const no permite reasignar la variable a otro valor, pero si esa variable guarda un objeto o array, su contenido sí se puede mutar.",
    respuestaEn:
      "var is function-scoped (or global) and can be reassigned and redeclared; it also gets hoisted and initialized as undefined. let and const are block-scoped: they only exist inside the {} block where they're declared. The difference between let and const isn't about the value, it's about the binding: const doesn't allow reassigning the variable to a different value, but if that variable holds an object or array, its contents can still be mutated.",
    codigo: `if (true) {
  var x = 1;
  let y = 2;
}
console.log(x); // 1 — var "se escapó" del bloque
console.log(y); // ReferenceError — y no existe fuera del bloque`,
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué diferencia hay entre un tipo primitivo y un objeto al asignarlo a otra variable?",
    respuestaEs:
      "Los primitivos (string, number, boolean, null, undefined, symbol, bigint) se copian por valor: cada variable guarda su propia copia independiente. Los objetos (incluyendo arrays y funciones) se copian por referencia: la variable guarda un puntero a la misma estructura en memoria, así que modificarla desde una variable se refleja en la otra.",
    respuestaEn:
      "Primitives (string, number, boolean, null, undefined, symbol, bigint) are copied by value: each variable holds its own independent copy. Objects (including arrays and functions) are copied by reference: the variable holds a pointer to the same structure in memory, so modifying it through one variable shows up through the other.",
    codigo: `let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — no se afectó

const obj1 = { valor: 5 };
const obj2 = obj1;
obj2.valor = 10;
console.log(obj1.valor); // 10 — misma referencia`,
    tradeoffs:
      "Esto es la base de bugs comunes en React: mutar un objeto de estado directamente no dispara un re-render porque la referencia sigue siendo la misma.",
  },
  {
    nivel: 1,
    pregunta: "¿Por qué typeof null devuelve \"object\" en vez de \"null\"?",
    respuestaEs:
      "Es un bug histórico de la primera implementación de JavaScript (1995): los valores se representaban internamente con una etiqueta de tipo, y el valor 0x00 (que null usaba) coincidía con la etiqueta de los objetos. Se mantiene por compatibilidad hacia atrás — corregirlo rompería código existente en toda la web. Para chequear null de verdad se usa comparación directa (valor === null), nunca typeof.",
    respuestaEn:
      "It's a historical bug from JavaScript's first implementation (1995): values were represented internally with a type tag, and the 0x00 tag (which null used) collided with the object tag. It's kept for backward compatibility — fixing it would break existing code across the web. To actually check for null you use direct comparison (value === null), never typeof.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué se recomienda usar === en vez de == en la mayoría de los casos?",
    respuestaEs:
      "== aplica coerción de tipos antes de comparar, siguiendo reglas del spec que no siempre son intuitivas (por ejemplo, '' == 0 es true, y '0' == false también). === compara sin convertir: si los tipos son distintos, directamente da false. Usar === por defecto elimina una fuente entera de bugs silenciosos; == solo tiene sentido en casos muy puntuales, como comparar contra null y undefined a la vez (valor == null).",
    respuestaEn:
      "== applies type coercion before comparing, following spec rules that aren't always intuitive (for example, '' == 0 is true, and '0' == false is too). === compares without converting: if the types differ, it's simply false. Defaulting to === removes an entire class of silent bugs; == only makes sense in narrow cases, like checking against both null and undefined at once (value == null).",
    codigo: `'' == 0        // true
'0' == false   // true
null == undefined // true
null === undefined // false`,
  },
  {
    nivel: 2,
    pregunta:
      "Si const no hace inmutable el valor, ¿cómo lográs que un objeto no se pueda modificar?",
    respuestaEs:
      "Con Object.freeze(objeto), que impide agregar, eliminar o reasignar propiedades de primer nivel (en modo estricto, intentarlo lanza TypeError; si no, falla en silencio). Es importante notar que Object.freeze es superficial: si una propiedad es a su vez un objeto, ese objeto anidado sigue siendo mutable. Para inmutabilidad profunda hay que congelar recursivamente o usar una librería (Immer, Immutable.js).",
    respuestaEn:
      "With Object.freeze(object), which prevents adding, removing, or reassigning top-level properties (in strict mode, attempting it throws a TypeError; otherwise it fails silently). It's important to note that Object.freeze is shallow: if a property is itself an object, that nested object remains mutable. For deep immutability you need to freeze recursively or use a library (Immer, Immutable.js).",
    codigo: `const config = Object.freeze({ tema: "oscuro", opciones: { debug: true } });
config.tema = "claro";        // no hace nada (falla en silencio)
config.opciones.debug = false; // esto SÍ funciona — freeze es superficial`,
    repregunta: "¿Es lo mismo Object.freeze que const?",
    respuestaRepreguntaEs:
      "No, resuelven problemas distintos. const congela el binding (la variable no puede apuntar a otro valor), pero el objeto al que apunta sigue siendo mutable. Object.freeze congela el objeto en sí (sus propiedades no se pueden cambiar), independientemente de si la variable que lo referencia es const o let.",
    respuestaRepreguntaEn:
      "No, they solve different problems. const freezes the binding (the variable can't point to a different value), but the object it points to remains mutable. Object.freeze freezes the object itself (its properties can't change), regardless of whether the variable referencing it is const or let.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es la Temporal Dead Zone (TDZ) y en qué se diferencia del hoisting de var?",
    respuestaEs:
      "let y const también sufren hoisting — el motor sabe que existen desde el inicio del bloque — pero, a diferencia de var, no se inicializan en undefined: quedan en un estado 'no inicializado' hasta que la línea de declaración se ejecuta. Acceder a la variable en ese tramo (la Temporal Dead Zone) lanza un ReferenceError, no devuelve undefined. Esto existe para detectar temprano un uso antes de la declaración, en vez de dejar pasar silenciosamente un undefined inesperado.",
    respuestaEn:
      "let and const are also hoisted — the engine knows they exist from the start of the block — but unlike var, they aren't initialized to undefined: they stay in an 'uninitialized' state until the declaration line actually runs. Accessing the variable during that window (the Temporal Dead Zone) throws a ReferenceError instead of returning undefined. This exists to catch a use-before-declaration early, instead of silently letting an unexpected undefined slip through.",
    codigo: `console.log(a); // undefined (hoisting de var)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué [] + [] da \"\" (string vacío) y [] + {} da \"[object Object]\"?",
    respuestaEs:
      "El operador + con al menos un objeto/array como operando fuerza la conversión de ambos a primitivo antes de operar, vía el algoritmo ToPrimitive. Para arrays y objetos comunes eso llama a toString(): [].toString() es '', así que '' + '' da ''. {}.toString() es '[object Object]', así que '' + '[object Object]' da esa cadena. Este comportamiento es una de las razones por las que se recomienda evitar + para chequear tipos y usar comparaciones explícitas o Array.isArray/typeof en su lugar.",
    respuestaEn:
      "The + operator, with at least one object/array operand, forces both sides to convert to a primitive first via the ToPrimitive algorithm. For arrays and plain objects that calls toString(): [].toString() is '', so '' + '' gives ''. {}.toString() is '[object Object]', so '' + '[object Object]' gives that string. This behavior is one of the reasons + is discouraged for type checks in favor of explicit comparisons or Array.isArray/typeof.",
    codigo: `[] + []       // ""
[] + {}       // "[object Object]"
{} + []       // 0 (en top-level, {} se parsea como bloque, no como objeto)
[1,2] + [3,4] // "1,23,4"`,
  },
];
