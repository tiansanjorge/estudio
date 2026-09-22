import type { PreguntaEntrevista } from "../types";

export const entrevistaScope: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué determina el scope de una variable en JavaScript?",
    respuestaEs:
      "JavaScript usa scope léxico: el scope de una variable se determina por dónde está escrita en el código, no por desde dónde se la llama. Cuando el motor necesita resolver una variable, arranca en el scope más interno y sube nivel por nivel por la cadena de scopes hasta encontrarla o llegar al global sin suerte, en cuyo caso lanza un ReferenceError.",
    respuestaEn:
      "JavaScript uses lexical scoping: a variable's scope is determined by where it's written in the code, not by where it's called from. When the engine needs to resolve a variable, it starts at the innermost scope and climbs the scope chain level by level until it finds it or reaches the global scope without luck, in which case it throws a ReferenceError.",
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué es shadowing y cómo evitás que te cause un bug en un proyecto real?",
    respuestaEs:
      "Es cuando una variable interna con el mismo nombre que una externa 'tapa' a esta última mientras estás dentro de ese scope, sin modificarla ni afectarla. Lo evito prestando atención a nombres de parámetros que coinciden con variables externas, y en general prefiriendo nombres específicos por contexto en vez de reusar nombres genéricos (data, item, error) en scopes anidados donde podrían pisarse visualmente.",
    respuestaEn:
      "It's when an inner variable with the same name as an outer one 'shadows' it while you're inside that scope, without modifying or affecting it. I avoid it by paying attention to parameter names that coincide with outer variables, and generally preferring context-specific names over reusing generic ones (data, item, error) in nested scopes where they could visually clash.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué diferencia hay entre el scope de un módulo ES y el scope de un script clásico cargado con <script>?",
    respuestaEs:
      "Cada módulo ES tiene su propio scope de nivel superior, aislado de otros módulos y del objeto global — declarar algo con let/const/function en el nivel superior de un módulo no lo hace visible en otro módulo ni lo cuelga del objeto window. Un script clásico, en cambio, comparte un único scope global entre todos los <script> de la página: variables declaradas con var (o funciones) en el nivel superior sí terminan como propiedades de window. Además, los módulos son strict mode por defecto; los scripts clásicos no, salvo que se declare explícitamente.",
    respuestaEn:
      "Each ES module has its own top-level scope, isolated from other modules and from the global object — declaring something with let/const/function at a module's top level doesn't make it visible in another module or attach it to window. A classic script, on the other hand, shares a single global scope across all <script> tags on the page: variables declared with var (or functions) at the top level do end up as properties of window. Also, modules are strict mode by default; classic scripts aren't unless declared explicitly.",
    tradeoffs:
      "Módulos: aislamiento real, sin contaminar el global, mejor para tooling (bundlers, tree-shaking). Scripts clásicos: más simples para prototipos rápidos, pero el scope global compartido es una fuente clásica de colisiones de nombres entre librerías.",
    repregunta:
      "En Node.js, ¿un var declarado en el nivel superior de un archivo también termina en el objeto global?",
    respuestaRepreguntaEs:
      "No. Node envuelve cada archivo CommonJS en una función (el 'module wrapper') antes de ejecutarlo, con parámetros como module, exports, require, __dirname. Por eso un var en el 'nivel superior' de un archivo en realidad está dentro del scope de esa función wrapper, no en el scope global real de Node — a diferencia de un script clásico en el navegador, donde el nivel superior sí es el scope global compartido.",
    respuestaRepreguntaEn:
      "No. Node wraps every CommonJS file in a function (the 'module wrapper') before running it, with parameters like module, exports, require, __dirname. So a var at a file's 'top level' is actually inside that wrapper function's scope, not Node's real global scope — unlike a classic browser script, where the top level really is the shared global scope.",
    codigoRepregunta: `// Así envuelve Node cada archivo CommonJS por debajo:
(function (exports, require, module, __filename, __dirname) {
  var x = 1;
  // "x" vive en el scope de ESTA función, no en el global real
})();

typeof global.x; // "undefined"`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué se considera una mala práctica el statement `with`, y qué alternativa moderna cumple un propósito similar?",
    respuestaEs:
      "`with` mete las propiedades de un objeto en el scope chain de forma dinámica, así que el motor no puede saber en tiempo de compilación si un nombre se refiere a una variable o a una propiedad del objeto — eso rompe las optimizaciones de resolución de variables y hace el código difícil de razonar (ambigüedad sobre qué se está leyendo o escribiendo). Está prohibido directamente en strict mode. La alternativa moderna para 'traer' propiedades de un objeto al scope local sin ambigüedad es destructuring: `const { a, b } = objeto`, que es explícito y no afecta cómo el motor resuelve el resto de las variables.",
    respuestaEn:
      "`with` dynamically injects an object's properties into the scope chain, so the engine can't know at compile time whether a name refers to a variable or a property of the object — that breaks variable resolution optimizations and makes the code hard to reason about (ambiguity over what's being read or written). It's outright banned in strict mode. The modern alternative for 'bringing' an object's properties into local scope without ambiguity is destructuring: `const { a, b } = object`, which is explicit and doesn't affect how the engine resolves the rest of the variables.",
    codigo: `// Prohibido en strict mode, ambiguo sobre qué es qué:
with (config) {
  console.log(host, port); // ¿variables externas o config.host/config.port?
}

// Alternativa moderna, explícita:
const { host, port } = config;
console.log(host, port);`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es la Temporal Dead Zone (TDZ) y en qué se diferencia de simplemente 'no estar definida'?",
    respuestaEs:
      "let y const también se hoistean al tope de su scope de bloque, igual que var, pero a diferencia de var no se inicializan con undefined: quedan en un estado 'muerto' (TDZ) desde el inicio del bloque hasta la línea donde se declaran. Acceder a la variable en ese rango lanza un ReferenceError, no devuelve undefined. Es distinto de una variable no declarada: `typeof variableNoDeclarada` da 'undefined' sin error, pero `typeof variableEnTDZ` lanza ReferenceError — la TDZ existe específicamente para evitar el patrón confuso de var donde leer una variable antes de su declaración silenciosamente daba undefined en vez de avisar del error de orden.",
    respuestaEn:
      "let and const are also hoisted to the top of their block scope, just like var, but unlike var they aren't initialized with undefined: they sit in a 'dead' state (TDZ) from the start of the block until the line where they're declared. Accessing the variable in that range throws a ReferenceError, not undefined. That's different from an undeclared variable: `typeof undeclaredVariable` gives 'undefined' with no error, but `typeof variableInTDZ` throws a ReferenceError — the TDZ exists specifically to avoid var's confusing pattern where reading a variable before its declaration silently gave undefined instead of flagging the ordering mistake.",
    codigo: `console.log(typeof noDeclarada); // "undefined", sin error

console.log(typeof enTDZ); // ReferenceError
let enTDZ = 1;`,
    repregunta:
      "¿Una function declaration dentro de un bloque ({ }) en modo no estricto se comporta igual en todos los entornos?",
    respuestaRepreguntaEs:
      "No exactamente. La spec de ES2015 en adelante define un comportamiento de compatibilidad retroactiva ('Annex B') específicamente para navegadores: una function declaration dentro de un bloque en modo no estricto queda además asignada como var en el scope de la función contenedora (o global), visible incluso fuera del bloque, aunque su comportamiento de 'cuál versión ve cada scope' es distinto antes y después de ejecutar el bloque. Motores no basados en navegador (o en strict mode) no están obligados a implementar Annex B, así que ese mismo código puede comportarse distinto en Node vs un navegador según el modo — otra razón más para preferir siempre strict mode y evitar function declarations sueltas dentro de bloques.",
    respuestaRepreguntaEn:
      "Not exactly. The ES2015+ spec defines a legacy web-compatibility behavior ('Annex B') specifically for browsers: a function declaration inside a block in non-strict mode also gets assigned as a var in the containing function's (or global) scope, visible even outside the block, though the exact semantics of 'which version each scope sees' differ before and after the block runs. Non-browser engines (or strict mode) aren't required to implement Annex B, so the same code can behave differently in Node vs a browser depending on the mode — one more reason to always prefer strict mode and avoid loose function declarations inside blocks.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Puede el uso de `eval` o `with` afectar la performance de código que ni siquiera los usa directamente?",
    respuestaEs:
      "Sí. Los motores modernos optimizan la resolución de variables analizando estáticamente, en tiempo de compilación, qué scope corresponde a cada identificador (compilación con slots fijos en vez de buscar por nombre en runtime). Si una función contiene un `eval` (o, históricamente, un `with`), el motor no puede garantizar qué variables podrían crearse o modificarse dinámicamente dentro de ese scope, así que tiene que desactivar esas optimizaciones para toda la función que contiene el eval — no solo para el código dentro del eval — y caer a una resolución de variables más lenta, tipo diccionario, en runtime.",
    respuestaEn:
      "Yes. Modern engines optimize variable resolution by statically analyzing, at compile time, which scope each identifier belongs to (compiling with fixed slots instead of looking up by name at runtime). If a function contains an `eval` (or, historically, a `with`), the engine can't guarantee which variables might be dynamically created or modified inside that scope, so it has to disable those optimizations for the entire function containing the eval — not just the code inside the eval — and fall back to slower, dictionary-style variable resolution at runtime.",
  },
];
