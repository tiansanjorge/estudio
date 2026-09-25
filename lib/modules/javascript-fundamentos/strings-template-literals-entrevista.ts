import type { PreguntaEntrevista } from "../types";

export const entrevistaStringsTemplateLiterals: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué ventajas tienen los template literals sobre la concatenación con +?",
    respuestaEs:
      "Permiten interpolar variables y expresiones directamente dentro del string con ${expresion}, sin cortar comillas ni concatenar con +. También soportan strings multilínea de forma nativa (con saltos de línea reales dentro de las backticks), algo que con comillas simples o dobles requiere \\n explícito o concatenación.",
    respuestaEn:
      "They let you interpolate variables and expressions directly inside the string with ${expression}, without breaking out of quotes or concatenating with +. They also support multiline strings natively (real line breaks inside the backticks), which with single or double quotes requires an explicit \\n or concatenation.",
    codigo: `const nombre = "Ana";
const edad = 30;

// Concatenación:
const msg1 = "Hola " + nombre + ", tenés " + edad + " años";
// Template literal:
const msg2 = \`Hola \${nombre}, tenés \${edad} años\`;`,
  },
  {
    nivel: 1,
    pregunta: "¿Los strings son mutables o inmutables en JavaScript?",
    respuestaEs:
      "Son inmutables: ningún método de string modifica el string original, todos devuelven uno nuevo. toUpperCase(), slice(), replace(), trim() — todos crean un string nuevo. Por eso texto.toUpperCase() sin reasignar (texto = texto.toUpperCase()) no cambia nada visible.",
    respuestaEn:
      "They're immutable: no string method modifies the original string, they all return a new one. toUpperCase(), slice(), replace(), trim() — they all create a new string. That's why texto.toUpperCase() without reassigning (texto = texto.toUpperCase()) doesn't change anything visible.",
    codigo: `let texto = "hola";
texto.toUpperCase();     // devuelve "HOLA", pero no reasigna
console.log(texto);      // "hola" — no cambió

texto = texto.toUpperCase(); // ahora sí
console.log(texto);      // "HOLA"`,
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué diferencia hay entre .slice(), .substring() y .split() en strings?",
    respuestaEs:
      "slice(inicio, fin) extrae una porción del string entre esos índices, y acepta índices negativos contados desde el final. substring(inicio, fin) hace algo parecido pero trata los índices negativos como 0 y reordena inicio/fin si vienen invertidos. split(separador) no extrae una porción: corta el string completo en un array de substrings, usando el separador dado.",
    respuestaEn:
      "slice(start, end) extracts a portion of the string between those indices, and accepts negative indices counted from the end. substring(start, end) does something similar but treats negative indices as 0 and reorders start/end if they're swapped. split(separator) doesn't extract a portion: it cuts the whole string into an array of substrings, using the given separator.",
    codigo: `const s = "javascript";
s.slice(-6);       // "script"
s.substring(-6);   // "javascript" — negativos se tratan como 0
s.split("a");      // ["j", "v", "script"]`,
  },
  {
    nivel: 2,
    pregunta: "¿Para qué sirven los tagged template literals?",
    respuestaEs:
      "Permiten procesar un template literal con una función propia antes de generar el string final: la función recibe el array de partes literales y, por separado, los valores interpolados, y decide qué devolver. Es la base de librerías como styled-components (css``) y de gql`` para GraphQL, y también se usa para escapar/sanitizar valores automáticamente (por ejemplo, para prevenir inyección SQL o XSS al interpolar datos dinámicos).",
    respuestaEn:
      "They let you process a template literal with your own function before generating the final string: the function receives the array of literal parts and, separately, the interpolated values, and decides what to return. This is the basis for libraries like styled-components (css``) and gql`` for GraphQL, and it's also used to automatically escape/sanitize values (for example, to prevent SQL injection or XSS when interpolating dynamic data).",
    codigo: `function resaltar(partes, ...valores) {
  return partes.reduce(
    (acc, parte, i) => acc + parte + (valores[i] !== undefined ? \`**\${valores[i]}**\` : ""),
    "",
  );
}

const nombre = "Ana";
resaltar\`Hola \${nombre}, bienvenida\`; // "Hola **Ana**, bienvenida"`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué cuidado hay que tener con .length en strings que contienen emojis u otros caracteres fuera del rango básico de Unicode?",
    respuestaEs:
      ".length cuenta unidades UTF-16, no caracteres visibles. Muchos emojis y caracteres fuera del Basic Multilingual Plane ocupan dos unidades UTF-16 (un par sustituto), así que '😀'.length da 2, no 1. Esto puede romper truncados de texto o validaciones de longitud que asumen un carácter = una unidad. Para contar caracteres visibles reales conviene [...string].length (usa el iterador de strings, que sí respeta los pares sustitutos) o Intl.Segmenter para casos con emojis compuestos.",
    respuestaEn:
      ".length counts UTF-16 code units, not visible characters. Many emoji and characters outside the Basic Multilingual Plane take up two UTF-16 units (a surrogate pair), so '😀'.length is 2, not 1. This can break text truncation or length validations that assume one character equals one unit. To count actual visible characters, [...string].length (uses the string iterator, which does respect surrogate pairs) or Intl.Segmenter for cases with compound emoji is preferable.",
    codigo: `"😀".length;      // 2 — es un par sustituto (surrogate pair)
[..."😀"].length; // 1 — el iterador de strings sí lo cuenta como uno`,
  },
  {
    nivel: 3,
    pregunta: "¿Por qué 'a' < 'b' pero 'Z' < 'a' al comparar strings con <?",
    respuestaEs:
      "La comparación con < entre strings es lexicográfica basada en el valor del code point Unicode de cada carácter, no en orden alfabético humano. Las letras mayúsculas (A-Z) ocupan los códigos 65-90, y las minúsculas (a-z) ocupan 97-122 — todas las mayúsculas tienen código menor que todas las minúsculas. Por eso 'Z' (90) es menor que 'a' (97), aunque alfabéticamente Z va después. Para ordenar texto de forma consciente del idioma/mayúsculas se usa localeCompare().",
    respuestaEn:
      "String comparison with < is lexicographic, based on each character's Unicode code point value, not human alphabetical order. Uppercase letters (A-Z) occupy codes 65-90, and lowercase (a-z) occupy 97-122 — all uppercase letters have a lower code than all lowercase letters. That's why 'Z' (90) is less than 'a' (97), even though alphabetically Z comes after. To sort text in a language/case-aware way, use localeCompare().",
    codigo: `"a" < "b";  // true — 97 < 98
"Z" < "a";  // true — 90 < 97, aunque Z va después alfabéticamente

["b", "Z", "a"].sort();                       // ["Z", "a", "b"] — por code point
["b", "Z", "a"].sort((x, y) => x.localeCompare(y)); // ["a", "b", "Z"] — alfabético real`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué diferencia hay entre normalizar un string con .normalize() y no hacerlo, al comparar texto que viene de distintas fuentes?",
    respuestaEs:
      "Unicode permite representar el mismo carácter visible de más de una forma: por ejemplo, 'é' puede ser un único code point precompuesto (U+00E9) o una 'e' seguida de un acento combinante (U+0065 + U+0301). Ambas se ven idénticas pero son strings distintos en JavaScript, con distinto length y que fallan al compararse con ===. .normalize() (por defecto en forma NFC) convierte ambas representaciones a una forma canónica única, para que comparaciones entre texto de distintas fuentes (un formulario, una API externa) funcionen correctamente.",
    respuestaEn:
      "Unicode allows the same visible character to be represented in more than one way: for example, 'é' can be a single precomposed code point (U+00E9) or an 'e' followed by a combining accent (U+0065 + U+0301). Both look identical but are different strings in JavaScript, with different length, and they fail when compared with ===. .normalize() (defaulting to NFC form) converts both representations to a single canonical form, so comparisons between text from different sources (a form, an external API) work correctly.",
    codigo: `const precompuesto = "\\u00e9";        // "é" como un solo code point
const combinado = "e\\u0301";          // "e" + acento combinante

precompuesto === combinado;            // false — ¡se ven iguales pero no lo son!
precompuesto.normalize() === combinado.normalize(); // true`,
  },
];
