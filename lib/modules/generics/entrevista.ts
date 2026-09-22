import type { PreguntaEntrevista } from "../types";

export const entrevistaGenericos: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Para qué sirven los genéricos y en qué se diferencian de usar `any`?",
    respuestaEs:
      "Los genéricos son parámetros de tipo: permiten escribir una función, clase o interfaz que funciona con cualquier tipo, pero preservando la relación entre el tipo de entrada y el de salida. `any` también acepta cualquier tipo, pero descarta toda la información: el compilador deja de poder verificar nada sobre ese valor de ahí en adelante. Con un genérico, TypeScript sabe exactamente qué tipo entró y lo propaga a la salida, manteniendo el autocompletado y la verificación de tipos intactos.",
    respuestaEn:
      "Generics are type parameters: they let you write a function, class, or interface that works with any type while preserving the relationship between the input type and the output type. `any` also accepts any type, but it discards all information: the compiler stops being able to check anything about that value from then on. With a generic, TypeScript knows exactly what type came in and propagates it to the output, keeping autocomplete and type checking intact.",
    codigo: `function identidad<T>(valor: T): T {
  return valor;
}
identidad('hola').toUpperCase(); // TS sabe que es string

function identidadAny(valor: any): any {
  return valor;
}
identidadAny('hola').toUpperCase(); // TS no verifica nada acá`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo usarías un genérico en vez de escribir una función distinta por cada tipo?",
    respuestaEs:
      "Cuando la lógica es idéntica sin importar el tipo concreto — por ejemplo, envolver una respuesta de API (ApiResponse<T>), un hook que persiste cualquier valor en localStorage, o un repositorio con operaciones CRUD genéricas. Duplicar la función por cada tipo (una para User, otra para Product) es código repetido que hay que mantener en varios lugares; un genérico lo escribe una sola vez y el compilador se encarga de que cada uso mantenga su propio tipo correcto.",
    respuestaEn:
      "When the logic is identical regardless of the concrete type — for example, wrapping an API response (ApiResponse<T>), a hook that persists any value in localStorage, or a repository with generic CRUD operations. Duplicating the function per type (one for User, another for Product) is repeated code that needs maintaining in multiple places; a generic writes it once and the compiler ensures each use keeps its own correct type.",
    codigo: `interface ApiResponse<T> {
  data: T;
  status: number;
}

function useLocalStorage<T>(key: string, valorInicial: T): [T, (v: T) => void] {
  // misma lógica sin importar si T es string, un objeto, un array...
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirve un constraint (extends) en un genérico, y qué pasa si no lo ponés cuando hace falta?",
    respuestaEs:
      "Un constraint (`<T extends Forma>`) limita qué tipos son válidos para ese parámetro, permitiéndole al compilador saber que, sea cual sea el T concreto, al menos tiene la forma declarada — y por lo tanto es seguro acceder a esas propiedades dentro de la función. Sin el constraint, TypeScript trata a T como completamente desconocido y no te deja acceder a ninguna propiedad sobre él, ni siquiera una tan básica como `.length`, porque no puede garantizar que todo tipo la tenga.",
    respuestaEn:
      "A constraint (`<T extends Shape>`) restricts which types are valid for that parameter, letting the compiler know that whatever the concrete T is, it at least has the declared shape — and therefore it's safe to access those properties inside the function. Without the constraint, TypeScript treats T as completely unknown and won't let you access any property on it, not even something as basic as `.length`, because it can't guarantee every type has it.",
    codigo: `function primero<T>(items: T[]) {
  return items.length; // OK, T[] siempre tiene .length propio del array
}

function obtenerId<T extends { id: string }>(entidad: T) {
  return entidad.id; // sin el constraint, TS no sabría que T tiene "id"
}`,
    tradeoffs:
      "Un constraint muy amplio (extends object) da poca seguridad real. Uno muy específico (extends UnaClaseConcreta) reduce la reutilización del genérico. El punto justo es pedir exactamente la forma mínima que la función necesita, ni más ni menos.",
    repregunta:
      "¿Cómo escribirías una función type-safe que acceda a una propiedad dinámica de un objeto, sin usar `any` ni perder el tipo del valor devuelto?",
    respuestaRepreguntaEs:
      "Combinando un genérico para el objeto con otro constreñido por `keyof` del primero: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K]`. Así, `key` solo acepta nombres de propiedades que realmente existen en `T`, y el tipo de retorno (`T[K]`) es exactamente el tipo de esa propiedad puntual — no `any`, no `unknown`, el tipo real. El compilador rechaza en tiempo de compilación cualquier `key` que no exista en el objeto.",
    respuestaRepreguntaEn:
      "By combining a generic for the object with another one constrained by `keyof` the first: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K]`. That way, `key` only accepts property names that actually exist on `T`, and the return type (`T[K]`) is exactly that property's type — not `any`, not `unknown`, the real type. The compiler rejects at compile time any `key` that doesn't exist on the object.",
    codigoRepregunta: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const usuario = { nombre: 'Ana', edad: 30 };
getProp(usuario, 'nombre'); // string
getProp(usuario, 'apellido'); // Error de compilación: no existe en usuario`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja tiene un default type parameter (<T = string>), y cuándo conviene usarlo?",
    respuestaEs:
      "Permite que el genérico se use sin especificar el tipo explícitamente cuando el caso más común ya está cubierto por el default, sin perder la posibilidad de sobreescribirlo cuando hace falta un tipo distinto. Es útil en APIs donde la mayoría de los usos comparten un mismo tipo (por ejemplo, un formulario que casi siempre maneja strings) pero ocasionalmente alguien necesita otro tipo — evita forzar a todos los consumidores a escribir `<string>` explícitamente en el caso común.",
    respuestaEn:
      "It lets the generic be used without specifying the type explicitly when the most common case is already covered by the default, without losing the ability to override it when a different type is needed. It's useful in APIs where most uses share the same type (e.g. a form that almost always handles strings) but occasionally someone needs a different type — it avoids forcing every consumer to write `<string>` explicitly in the common case.",
    codigo: `interface CampoFormulario<T = string> {
  valor: T;
  onChange: (v: T) => void;
}

const campoTexto: CampoFormulario = { valor: '', onChange: () => {} }; // usa el default
const campoNumero: CampoFormulario<number> = { valor: 0, onChange: () => {} }; // override`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es un conditional type, y qué significa que sea 'distributivo' sobre un union type?",
    respuestaEs:
      "Un conditional type (`T extends U ? X : Y`) elige entre dos tipos según si T es asignable a U, evaluado en tiempo de compilación. Cuando T es un tipo genérico 'naked' (no envuelto en otra estructura) y quien lo instancia le pasa un union, TypeScript distribuye automáticamente la condición sobre cada miembro del union por separado y une los resultados — no evalúa la condición una sola vez contra el union completo. Para desactivar esa distribución (evaluarlo como un bloque único), hay que envolver ambos lados en tuplas: `[T] extends [U] ? X : Y`.",
    respuestaEn:
      "A conditional type (`T extends U ? X : Y`) picks between two types depending on whether T is assignable to U, evaluated at compile time. When T is a 'naked' generic type parameter (not wrapped in another structure) and whoever instantiates it passes a union, TypeScript automatically distributes the condition over each member of the union separately and unions the results — it doesn't evaluate the condition once against the whole union. To turn off that distribution (evaluate it as a single block), you wrap both sides in tuples: `[T] extends [U] ? X : Y`.",
    codigo: `type SoloString<T> = T extends string ? T : never;

type Resultado = SoloString<string | number | boolean>;
// se distribuye: (string extends string ? string : never)
//              | (number extends string ? number : never)
//              | (boolean extends string ? boolean : never)
// => Resultado es "string"`,
    repregunta:
      "¿Cómo funciona `infer` dentro de un conditional type, por ejemplo para implementar un ReturnType propio?",
    respuestaRepreguntaEs:
      "`infer X` declara una variable de tipo nueva DENTRO de la rama `extends` de un conditional type, y TypeScript la infiere automáticamente comparando estructuralmente contra el tipo que estás chequeando. En `type MiReturnType<T> = T extends (...args: any[]) => infer R ? R : never`, TypeScript intenta hacer coincidir T con la forma 'función que devuelve algo', y si coincide, captura ese 'algo' en R y lo usa como resultado — es la forma de 'extraer' una parte de un tipo complejo sin tener que descomponerlo manualmente.",
    respuestaRepreguntaEn:
      "`infer X` declares a new type variable INSIDE the `extends` branch of a conditional type, and TypeScript infers it automatically by structurally matching against the type you're checking. In `type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never`, TypeScript tries to match T against the shape 'a function that returns something', and if it matches, it captures that 'something' in R and uses it as the result — it's how you 'extract' a part of a complex type without manually decomposing it.",
    codigoRepregunta: `type MiReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function crearUsuario() {
  return { id: 1, nombre: 'Ana' };
}

type Usuario = MiReturnType<typeof crearUsuario>;
// Usuario = { id: number; nombre: string }`,
  },
  {
    nivel: 3,
    pregunta:
      "Los genéricos desaparecen en el JavaScript compilado (type erasure). ¿Qué implica esto para código que necesita distinguir tipos en runtime?",
    respuestaEs:
      "Que un genérico nunca puede usarse para tomar decisiones en tiempo de ejecución: `if (typeof T === 'string')` no compila ni tendría sentido, porque T no existe como valor en el JavaScript final — es pura información para el compilador, borrada al emitir el código. Para distinguir tipos en runtime hace falta información que sí sobreviva a la compilación: `typeof`/`instanceof` sobre el valor real, una propiedad discriminante explícita en el objeto (discriminated unions), o pasar una referencia al constructor/clase como parámetro de valor además del tipo genérico.",
    respuestaEn:
      "That a generic can never be used to make runtime decisions: `if (typeof T === 'string')` doesn't compile, and wouldn't make sense, because T doesn't exist as a value in the final JavaScript — it's purely compiler information, erased when the code is emitted. To distinguish types at runtime you need information that actually survives compilation: `typeof`/`instanceof` on the real value, an explicit discriminant property on the object (discriminated unions), or passing a reference to the constructor/class as a value parameter alongside the generic type.",
    codigo: `function procesar<T>(valor: T) {
  if (typeof valor === 'string') { /* esto sí funciona: chequea el VALOR */ }
  // if (T === String) // esto no compila: T no existe en runtime
}`,
  },
];
