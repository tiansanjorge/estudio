import type { PreguntaEntrevista } from "../types";

export const entrevistaObjetos: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es destructuring y qué problema resuelve?",
    respuestaEs:
      "Destructuring es una sintaxis para extraer propiedades de un objeto (o elementos de un array) y asignarlas a variables en una sola línea, en vez de acceder una por una con punto. Además permite renombrar variables, asignar valores por defecto si la propiedad no existe, y extraer propiedades anidadas directamente.",
    respuestaEn:
      "Destructuring is syntax for extracting properties from an object (or elements from an array) and assigning them to variables in a single line, instead of accessing them one by one with dot notation. It also allows renaming variables, assigning default values when a property doesn't exist, and extracting nested properties directly.",
    codigo: `const usuario = { nombre: "Ana", edad: 30, direccion: { ciudad: "CABA" } };

const { nombre, edad: anios = 0 } = usuario; // renombra edad -> anios
const { direccion: { ciudad } } = usuario;    // extrae anidado
console.log(nombre, anios, ciudad); // "Ana" 30 "CABA"`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué hace el spread operator (...) con objetos?",
    respuestaEs:
      "Copia las propiedades enumerables propias de un objeto dentro de otro objeto literal, creando un objeto nuevo. Se usa mucho para combinar objetos o para crear una copia con algunos campos actualizados, sin mutar el original: { ...original, campo: nuevoValor }. Es una copia superficial (shallow): si una propiedad es a su vez un objeto, esa referencia se comparte entre el original y la copia.",
    respuestaEn:
      "It copies an object's own enumerable properties into another object literal, creating a new object. It's used a lot to merge objects or to create a copy with some fields updated, without mutating the original: { ...original, field: newValue }. It's a shallow copy: if a property is itself an object, that reference is shared between the original and the copy.",
    codigo: `const original = { nombre: "Ana", edad: 30 };
const actualizado = { ...original, edad: 31 };
console.log(original.edad);    // 30 — no se mutó
console.log(actualizado.edad); // 31`,
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué diferencia hay entre Object.keys, Object.values y Object.entries?",
    respuestaEs:
      "Object.keys(obj) devuelve un array con los nombres de las propiedades propias enumerables. Object.values(obj) devuelve un array con sus valores. Object.entries(obj) devuelve un array de pares [clave, valor], útil para iterar con for...of o transformar con map/filter/reduce combinando clave y valor a la vez.",
    respuestaEn:
      "Object.keys(obj) returns an array with the names of the own enumerable properties. Object.values(obj) returns an array with their values. Object.entries(obj) returns an array of [key, value] pairs, useful for iterating with for...of or transforming with map/filter/reduce using both key and value at once.",
    codigo: `const precios = { pan: 100, leche: 80 };

Object.keys(precios);   // ["pan", "leche"]
Object.values(precios); // [100, 80]
Object.entries(precios); // [["pan", 100], ["leche", 80]]`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué el spread operator no alcanza para copiar un objeto con propiedades anidadas de forma segura?",
    respuestaEs:
      "Porque el spread es una copia superficial: copia las referencias de las propiedades de primer nivel, no su contenido. Si una propiedad es un objeto o array, la copia y el original siguen apuntando al mismo objeto anidado, así que mutar esa propiedad anidada desde la copia también afecta al original. Para copiar en profundidad hace falta structuredClone(obj), JSON.parse(JSON.stringify(obj)) (con sus limitaciones: pierde funciones, Dates se vuelven strings), o spread anidado manual por cada nivel.",
    respuestaEn:
      "Because spread is a shallow copy: it copies the references of top-level properties, not their content. If a property is an object or array, the copy and the original still point to the same nested object, so mutating that nested property from the copy also affects the original. For a deep copy you need structuredClone(obj), JSON.parse(JSON.stringify(obj)) (with its limitations: it loses functions, Dates become strings), or manual nested spread at each level.",
    codigo: `const original = { usuario: { nombre: "Ana" } };
const copia = { ...original };
copia.usuario.nombre = "Beto";
console.log(original.usuario.nombre); // "Beto" — se mutó el original también

const copiaProfunda = structuredClone(original); // copia real, sin este problema`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene usar optional chaining (?.) y cómo se combina con ??",
    respuestaEs:
      "Optional chaining evita un TypeError al acceder a una propiedad de algo que podría ser null o undefined, devolviendo undefined en ese caso en vez de romper: usuario?.direccion?.ciudad. Se combina naturalmente con ?? para dar un valor por defecto cuando esa cadena resulta undefined: usuario?.direccion?.ciudad ?? 'Sin especificar'. Es preferible a encadenar validaciones manuales con && para cada nivel.",
    respuestaEn:
      "Optional chaining avoids a TypeError when accessing a property of something that might be null or undefined, returning undefined in that case instead of breaking: usuario?.direccion?.ciudad. It combines naturally with ?? to provide a default value when that chain ends up undefined: usuario?.direccion?.ciudad ?? 'Not specified'. It's preferable to chaining manual && checks at every level.",
    codigo: `const usuario = { nombre: "Ana" }; // sin direccion

const ciudad = usuario?.direccion?.ciudad ?? "Sin especificar";
console.log(ciudad); // "Sin especificar" — sin lanzar TypeError`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué diferencia hay entre Object.freeze, Object.seal y Object.preventExtensions?",
    respuestaEs:
      "preventExtensions impide agregar nuevas propiedades, pero permite modificar o eliminar las existentes. seal hace eso y además impide eliminar propiedades existentes (pero sigue permitiendo modificar sus valores). freeze es el más restrictivo: impide agregar, eliminar y modificar propiedades existentes — el objeto queda completamente inmutable en su primer nivel. Los tres son superficiales: no afectan a objetos anidados dentro de las propiedades.",
    respuestaEn:
      "preventExtensions prevents adding new properties, but allows modifying or deleting existing ones. seal does that and also prevents deleting existing properties (but still allows modifying their values). freeze is the most restrictive: it prevents adding, deleting, and modifying existing properties — the object becomes completely immutable at its first level. All three are shallow: they don't affect objects nested inside the properties.",
    codigo: `const a = Object.preventExtensions({ x: 1 });
a.x = 2; a.y = 3;      // x cambia a 2, y no se agrega
delete a.x;             // se puede borrar

const b = Object.seal({ x: 1 });
b.x = 2;                // funciona
delete b.x;              // no funciona

const c = Object.freeze({ x: 1 });
c.x = 2;                 // no funciona — nada cambia`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo determina JavaScript el orden de las claves al iterar un objeto con Object.keys o for...in?",
    respuestaEs:
      "El spec de ECMAScript define un orden específico, no arbitrario: primero las claves que parecen enteros no negativos (como '0', '1', '2'), ordenadas numéricamente ascendente, sin importar en qué orden se agregaron; después el resto de las claves string, en el orden en que se insertaron; y por último los Symbols, también en orden de inserción. Esto sorprende a quienes esperan que el orden de inserción se respete siempre.",
    respuestaEn:
      "The ECMAScript spec defines a specific order, not an arbitrary one: first, keys that look like non-negative integers (like '0', '1', '2'), sorted numerically ascending, regardless of insertion order; then the remaining string keys, in insertion order; and finally Symbols, also in insertion order. This surprises people who expect insertion order to always be respected.",
    codigo: `const obj = { b: 1, 2: "dos", a: 2, 1: "uno" };
console.log(Object.keys(obj)); // ["1", "2", "b", "a"]
// las claves "tipo entero" van primero y ordenadas, después el resto en orden de inserción`,
  },
];
