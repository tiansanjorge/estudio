import type { PreguntaEntrevista } from "../types";

export const entrevistaArraysMetodos: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre map, filter y forEach?",
    respuestaEs:
      "map transforma cada elemento y devuelve un array nuevo del mismo largo, con los resultados. filter devuelve un array nuevo solo con los elementos que cumplen una condición (puede ser más corto). forEach solo ejecuta una función por cada elemento y devuelve undefined — no sirve para construir un array nuevo, es para efectos secundarios (loggear, mutar algo externo).",
    respuestaEn:
      "map transforms each element and returns a new array of the same length, with the results. filter returns a new array with only the elements that satisfy a condition (it can be shorter). forEach just runs a function for each element and returns undefined — it's not for building a new array, it's for side effects (logging, mutating something external).",
    codigo: `const numeros = [1, 2, 3, 4];
numeros.map(n => n * 2);        // [2, 4, 6, 8]
numeros.filter(n => n % 2 === 0); // [2, 4]
numeros.forEach(n => console.log(n)); // imprime, devuelve undefined`,
  },
  {
    nivel: 1,
    pregunta: "¿Cuáles métodos de array mutan el array original y cuáles no?",
    respuestaEs:
      "Mutan el original: push, pop, shift, unshift, splice, sort, reverse, fill. No mutan (devuelven uno nuevo): map, filter, slice, concat, spread ([...arr]). Es una distinción crítica en frameworks como React, donde el estado no se debe mutar directamente: hay que usar las versiones que devuelven un array nuevo para que la UI detecte el cambio.",
    respuestaEn:
      "These mutate the original: push, pop, shift, unshift, splice, sort, reverse, fill. These don't mutate (they return a new one): map, filter, slice, concat, spread ([...arr]). This distinction is critical in frameworks like React, where state shouldn't be mutated directly: you need the versions that return a new array so the UI can detect the change.",
    codigo: `const original = [3, 1, 2];
const ordenadoMal = original.sort();  // muta original TAMBIÉN
const copia = [...original].sort();   // no muta el original`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué hace reduce y cuándo conviene usarlo?",
    respuestaEs:
      "reduce recorre el array acumulando un único resultado, aplicando una función que recibe el acumulador y el elemento actual en cada paso. Conviene cuando el resultado final no es 'un array transformado' (para eso está map) sino un valor distinto: una suma, un objeto agrupado, el máximo, o incluso construir otro array con lógica más compleja que map/filter solos no resuelven fácil.",
    respuestaEn:
      "reduce walks the array accumulating a single result, applying a function that receives the accumulator and the current element at each step. It makes sense when the final result isn't 'a transformed array' (that's what map is for) but a different kind of value: a sum, a grouped object, a maximum, or even building another array with logic that map/filter alone don't handle easily.",
    codigo: `const numeros = [1, 2, 3, 4];
const suma = numeros.reduce((acc, n) => acc + n, 0); // 10
const agrupado = ["a", "bb", "ccc"].reduce((acc, s) => {
  (acc[s.length] ??= []).push(s);
  return acc;
}, {}); // { 1: ["a"], 2: ["bb"], 3: ["ccc"] }`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuándo conviene encadenar .filter().map() y cuándo es mejor un solo reduce?",
    respuestaEs:
      "filter().map() es más legible cuando cada paso tiene una responsabilidad clara, a costa de recorrer el array dos veces (dos pasadas) y crear un array intermedio. Un solo reduce recorre una sola vez y no crea intermedios, lo que importa en arrays muy grandes o loops calientes, pero suele ser menos legible. La regla general: priorizar legibilidad (chain) salvo que se mida un problema real de performance.",
    respuestaEn:
      "filter().map() is more readable when each step has a clear responsibility, at the cost of walking the array twice (two passes) and creating an intermediate array. A single reduce walks it once and creates no intermediates, which matters for very large arrays or hot loops, but tends to be less readable. General rule: prioritize readability (chaining) unless you've measured an actual performance problem.",
    codigo: `// Dos pasadas, más legible:
const resultado = items.filter(x => x.activo).map(x => x.nombre);

// Una pasada, menos legible:
const resultado2 = items.reduce((acc, x) => {
  if (x.activo) acc.push(x.nombre);
  return acc;
}, []);`,
  },
  {
    nivel: 2,
    pregunta:
      "En React, ¿por qué actualizar un array de estado con push() no funciona como se espera?",
    respuestaEs:
      "push muta el array existente y devuelve el nuevo length, no un array nuevo. React decide si re-renderizar comparando la referencia del estado anterior contra la nueva (Object.is): si el array sigue siendo el mismo objeto en memoria (solo se le agregó un elemento), React no detecta el cambio y no re-renderiza. Hay que usar setEstado([...estado, nuevoItem]) o setEstado(estado.concat(nuevoItem)), que crean una referencia nueva.",
    respuestaEn:
      "push mutates the existing array and returns the new length, not a new array. React decides whether to re-render by comparing the previous state's reference against the new one (Object.is): if the array is still the same object in memory (an item was just added to it), React doesn't detect the change and doesn't re-render. You need setState([...state, newItem]) or setState(state.concat(newItem)), which create a new reference.",
    codigo: `// Mal: React no re-renderiza, la referencia del array no cambió
function agregar(item) {
  lista.push(item);
  setLista(lista);
}

// Bien: nueva referencia
function agregar(item) {
  setLista([...lista, item]);
}`,
  },
  {
    nivel: 3,
    pregunta: "¿Por qué [10, 2, 1].sort() da [1, 10, 2] en vez de [1, 2, 10]?",
    respuestaEs:
      "Sin un comparador explícito, sort() convierte cada elemento a string y los ordena lexicográficamente (por código Unicode de cada carácter), no numéricamente. '10' es menor que '2' en orden de texto porque '1' (el primer carácter) es menor que '2'. Para ordenar números correctamente hay que pasar un comparador: arr.sort((a, b) => a - b).",
    respuestaEn:
      "Without an explicit comparator, sort() converts each element to a string and orders them lexicographically (by Unicode code point), not numerically. '10' is less than '2' in text order because '1' (the first character) is less than '2'. To sort numbers correctly you need to pass a comparator: arr.sort((a, b) => a - b).",
    codigo: `[10, 2, 1].sort();               // [1, 10, 2] — orden de texto
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10] — orden numérico`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es un array 'sparse' (disperso) y cómo se comportan los métodos de iteración con él?",
    respuestaEs:
      "Un array sparse tiene 'huecos': posiciones sin asignar, no posiciones con undefined. Se crean con new Array(3) o borrando un índice con delete. Métodos como forEach, map y filter saltean esos huecos (no ejecutan el callback para ellos), pero el array conserva su length original — map sobre un array sparse devuelve otro sparse, manteniendo los huecos en las mismas posiciones. for...of sí los recorre y da undefined en cada hueco, porque itera por índice sin chequear si la posición está asignada.",
    respuestaEn:
      "A sparse array has 'holes': unassigned positions, not positions holding undefined. They're created with new Array(3) or by deleting an index with delete. Methods like forEach, map, and filter skip those holes (they don't run the callback for them), but the array keeps its original length — map over a sparse array returns another sparse array, keeping the holes in the same positions. for...of does visit them and yields undefined for each hole, because it iterates by index without checking whether the position is assigned.",
    codigo: `const disperso = [1, , 3]; // hueco en el índice 1
disperso.forEach(n => console.log(n)); // 1, 3 (salta el hueco)
disperso.map(n => n * 2);              // [2, <1 empty item>, 6]
for (const n of disperso) console.log(n); // 1, undefined, 3`,
  },
];
