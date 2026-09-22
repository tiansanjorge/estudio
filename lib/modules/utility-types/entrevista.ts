import type { PreguntaEntrevista } from "../types";

export const entrevistaUtilityTypes: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué son los utility types y para qué sirven Partial, Pick y Omit?",
    respuestaEs:
      "Son tipos genéricos incluidos en TypeScript que transforman otro tipo sin tener que escribirlo de nuevo a mano. Partial<T> hace que todas las propiedades de T sean opcionales (útil para actualizaciones parciales). Pick<T, K> construye un nuevo tipo quedándose solo con las propiedades K de T. Omit<T, K> hace lo inverso: todas las propiedades de T excepto las K. Los tres derivan un tipo nuevo a partir de uno existente, así que si el tipo original cambia, el derivado se actualiza solo.",
    respuestaEn:
      "They're generic types built into TypeScript that transform another type without having to rewrite it by hand. Partial<T> makes all of T's properties optional (useful for partial updates). Pick<T, K> builds a new type keeping only the K properties from T. Omit<T, K> does the opposite: all of T's properties except K. All three derive a new type from an existing one, so if the original type changes, the derived one updates automatically.",
    codigo: `interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

type ActualizacionUsuario = Partial<Usuario>; // todas opcionales
type ResumenUsuario = Pick<Usuario, 'id' | 'nombre'>; // solo id y nombre
type UsuarioSinId = Omit<Usuario, 'id'>; // todo menos id`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué preferirías derivar un tipo con Pick/Omit en vez de escribir una interfaz nueva a mano?",
    respuestaEs:
      "Porque escribir la interfaz a mano crea una segunda fuente de verdad: si el tipo original agrega o renombra un campo, la copia manual queda desactualizada y el compilador no te avisa (a menos que coincida por casualidad). Derivándolo con Pick/Omit, cualquier cambio en el tipo base se refleja automáticamente en el derivado, y si un campo que usabas desaparece, TypeScript te lo marca como error inmediatamente donde corresponda.",
    respuestaEn:
      "Because writing the interface by hand creates a second source of truth: if the original type adds or renames a field, the manual copy goes stale and the compiler doesn't warn you (unless it happens to still match). Deriving it with Pick/Omit means any change to the base type automatically reflects in the derived one, and if a field you were using disappears, TypeScript flags it as an error right where it matters.",
    codigo: `// riesgoso: copia manual que puede desincronizarse
interface PropsTarjeta {
  nombre: string;
  email: string;
}

// mejor: se mantiene sincronizado con Usuario automáticamente
type PropsTarjeta = Pick<Usuario, 'nombre' | 'email'>;`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo escribirías tu propio utility type, por ejemplo un Nullable<T> que permita null en cada propiedad?",
    respuestaEs:
      "Con un mapped type: `type Nullable<T> = { [K in keyof T]: T[K] | null }`. `keyof T` obtiene la unión de todas las claves de T, y `[K in keyof T]` itera sobre cada una para construir una propiedad nueva con el mismo nombre pero el tipo modificado. Es exactamente el mismo mecanismo que usan los utility types built-in por debajo — no hay magia especial en Partial o Readonly, son mapped types que TypeScript ya trae escritos.",
    respuestaEn:
      "With a mapped type: `type Nullable<T> = { [K in keyof T]: T[K] | null }`. `keyof T` gets the union of all of T's keys, and `[K in keyof T]` iterates over each one to build a new property with the same name but the modified type. It's the exact same mechanism the built-in utility types use under the hood — there's no special magic in Partial or Readonly, they're mapped types TypeScript already ships written.",
    tradeoffs:
      "Escribir un mapped type propio tiene sentido cuando la transformación es específica del dominio (Nullable, DeepPartial). Si ya existe un built-in que hace exactamente lo que necesitás, reinventarlo solo agrega código a mantener sin beneficio real.",
    repregunta:
      "¿Readonly<T> protege también las propiedades anidadas de un objeto, o solo el primer nivel?",
    respuestaRepreguntaEs:
      "Solo el primer nivel. Readonly<T> marca como de solo lectura las propiedades directas de T, pero si una de esas propiedades es a su vez un objeto, ese objeto interno sigue siendo completamente mutable. TypeScript no incluye un DeepReadonly nativo — hay que escribirlo a mano con un mapped type recursivo, o usar una librería, si se necesita inmutabilidad real en todos los niveles.",
    respuestaRepreguntaEn:
      "Only the first level. Readonly<T> marks T's direct properties as read-only, but if one of those properties is itself an object, that inner object remains fully mutable. TypeScript doesn't ship a native DeepReadonly — you have to write one by hand with a recursive mapped type, or use a library, if you need real immutability at every level.",
    codigoRepregunta: `interface Config {
  nombre: string;
  opciones: { tema: string };
}

const config: Readonly<Config> = { nombre: 'app', opciones: { tema: 'claro' } };
config.nombre = 'otra'; // Error: solo lectura
config.opciones.tema = 'oscuro'; // Permitido: Readonly no es profundo`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirven Extract<T, U> y Exclude<T, U>, y qué trade-off hay frente a escribir el union a mano?",
    respuestaEs:
      "Ambos filtran miembros de un union type: Extract<T, U> se queda solo con los miembros de T asignables a U; Exclude<T, U> hace lo contrario, descarta los asignables a U. Se usan típicamente para derivar subconjuntos de un union más grande (por ejemplo, los tipos de acción de éxito de un reducer, excluyendo los de error). El trade-off es el mismo que con Pick/Omit: derivarlo mantiene sincronización automática con el union original, mientras que escribirlo a mano crea una copia que puede desactualizarse si el union base cambia.",
    respuestaEn:
      "Both filter members of a union type: Extract<T, U> keeps only T's members assignable to U; Exclude<T, U> does the opposite, discards those assignable to U. They're typically used to derive subsets of a larger union (e.g. a reducer's success action types, excluding the error ones). The trade-off is the same as with Pick/Omit: deriving it keeps automatic sync with the original union, while writing it by hand creates a copy that can go stale if the base union changes.",
    codigo: `type Accion =
  | { tipo: 'cargar_exito'; datos: string[] }
  | { tipo: 'cargar_error'; error: string }
  | { tipo: 'reset' };

type AccionesDeError = Extract<Accion, { tipo: 'cargar_error' }>;
type AccionesSinError = Exclude<Accion, { tipo: 'cargar_error' }>;`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué permite el 'key remapping' (cláusula as) en un mapped type, agregado en TypeScript 4.1?",
    respuestaEs:
      "Permite transformar el NOMBRE de cada clave a medida que se mapea, no solo su tipo. Combinado con template literal types, se puede generar automáticamente un conjunto de claves nuevas derivadas de las originales — por ejemplo, generar un tipo con un getter por cada propiedad, con el nombre `get` + la propiedad capitalizada. También permite filtrar claves condicionalmente: mapear una clave a `never` en la cláusula as la excluye por completo del tipo resultante.",
    respuestaEn:
      "It lets you transform each key's NAME as it's mapped, not just its type. Combined with template literal types, you can automatically generate a set of new keys derived from the original ones — for example, generating a type with one getter per property, named `get` plus the capitalized property. It also allows conditionally filtering keys: mapping a key to `never` in the as clause excludes it entirely from the resulting type.",
    codigo: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface Persona {
  nombre: string;
  edad: number;
}

type PersonaGetters = Getters<Persona>;
// { getNombre: () => string; getEdad: () => number }`,
    repregunta:
      "¿Cómo está implementado NonNullable<T> por debajo, y por qué se comporta bien con un union?",
    respuestaRepreguntaEs:
      "NonNullable<T> se define como un conditional type distributivo: `type NonNullable<T> = T extends null | undefined ? never : T`. Como T es un parámetro genérico 'naked', cuando se le pasa un union, la condición se distribuye automáticamente sobre cada miembro: los que sean null o undefined se convierten en never (que desaparece de un union al unirse) y el resto queda intacto. Por eso NonNullable<string | null | undefined> da exactamente 'string', sin necesitar lógica especial para manejar el union.",
    respuestaRepreguntaEn:
      "NonNullable<T> is defined as a distributive conditional type: `type NonNullable<T> = T extends null | undefined ? never : T`. Since T is a 'naked' generic parameter, when a union is passed in, the condition automatically distributes over each member: the ones that are null or undefined become never (which disappears when unioned), and the rest stay intact. That's why NonNullable<string | null | undefined> gives exactly 'string', with no special logic needed to handle the union.",
    codigoRepregunta: `type Resultado = NonNullable<string | null | undefined>;
// se distribuye sobre cada miembro del union:
// (string extends null|undefined ? never : string)
// | (null extends null|undefined ? never : null)
// | (undefined extends null|undefined ? never : undefined)
// => Resultado es "string"`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo derivarías el tipo de retorno de una función existente sin escribirlo a mano, y qué cuidado hay que tener?",
    respuestaEs:
      "Con `ReturnType<typeof miFuncion>`, que extrae el tipo de retorno automáticamente. Internamente es un conditional type con infer, igual que un ReturnType propio: `T extends (...args: any[]) => infer R ? R : never`. El cuidado a tener es que el tipo derivado cambia automáticamente si la función cambia — generalmente algo bueno para mantenimiento, pero puede ser sorpresivo si en algún lugar se esperaba explícitamente el tipo anterior y no se detecta el cambio hasta que aparece un error de compilación en un punto de uso lejano, sin contexto claro de qué lo originó.",
    respuestaEn:
      "With `ReturnType<typeof myFunction>`, which extracts the return type automatically. Internally it's a conditional type with infer, just like a custom ReturnType: `T extends (...args: any[]) => infer R ? R : never`. The thing to watch for is that the derived type changes automatically if the function changes — usually good for maintenance, but it can be surprising if somewhere the previous type was implicitly expected, and the change isn't noticed until a compile error shows up at some distant usage site, without clear context on what caused it.",
    codigo: `function crearPedido() {
  return { id: crypto.randomUUID(), items: [] as string[] };
}

type Pedido = ReturnType<typeof crearPedido>;
// se actualiza solo si crearPedido cambia su forma de retorno`,
  },
];
