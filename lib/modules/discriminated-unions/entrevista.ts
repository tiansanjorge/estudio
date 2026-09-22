import type { PreguntaEntrevista } from "../types";

export const entrevistaDiscriminatedUnions: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es una discriminated union y para qué sirve la propiedad discriminante?",
    respuestaEs:
      "Es un union type donde cada variante comparte una propiedad literal común (el 'discriminante') con un valor distinto por variante — típicamente algo como `tipo: 'exito' | 'error'`. TypeScript usa esa propiedad para 'estrechar' el tipo automáticamente: dentro de un `if (resultado.tipo === 'exito')`, sabe con certeza que estás en esa variante específica y te da acceso seguro a sus propiedades exclusivas, sin necesitar un cast manual.",
    respuestaEn:
      "It's a union type where each variant shares a common literal property (the 'discriminant') with a different value per variant — typically something like `type: 'success' | 'error'`. TypeScript uses that property to automatically 'narrow' the type: inside an `if (result.type === 'success')`, it knows for certain you're in that specific variant and gives you safe access to its exclusive properties, without needing a manual cast.",
    codigo: `type Resultado =
  | { tipo: 'exito'; datos: string[] }
  | { tipo: 'error'; mensaje: string };

function manejar(r: Resultado) {
  if (r.tipo === 'exito') {
    r.datos; // TS sabe que existe acá
  } else {
    r.mensaje; // y acá sabe que es la otra variante
  }
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué preferirías una discriminated union sobre una interfaz con propiedades opcionales para representar distintos estados?",
    respuestaEs:
      "Porque una interfaz con propiedades opcionales (`{ datos?: string[], error?: string }`) permite estados imposibles en la práctica: nada impide que datos y error estén ambos presentes, o ambos ausentes, al mismo tiempo. Una discriminated union hace que esos estados inválidos ni siquiera puedan construirse — cada variante define exactamente qué campos existen juntos, y el compilador lo hace cumplir. Es el patrón estándar para representar el estado de una petición async (idle/loading/success/error) sin dejar huecos de estados imposibles.",
    respuestaEn:
      "Because an interface with optional properties (`{ data?: string[], error?: string }`) allows practically impossible states: nothing stops both data and error from being present, or both absent, at the same time. A discriminated union makes those invalid states impossible to even construct — each variant defines exactly which fields exist together, and the compiler enforces it. It's the standard pattern for representing an async request's state (idle/loading/success/error) without leaving gaps for impossible states.",
    codigo: `// permite estados imposibles: ambos presentes, o ninguno
interface EstadoMalo { datos?: string[]; error?: string; cargando?: boolean }

// cada variante es válida por sí sola, sin combinaciones imposibles
type EstadoPeticion =
  | { estado: 'idle' }
  | { estado: 'cargando' }
  | { estado: 'exito'; datos: string[] }
  | { estado: 'error'; error: string };`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es un 'exhaustiveness check' con never, y qué problema de mantenimiento resuelve?",
    respuestaEs:
      "Es una técnica para que el compilador te avise si olvidaste manejar una variante de un union en un switch: en la rama `default`, asignás el valor (ya angostado por las ramas anteriores) a una variable de tipo `never`. Si todas las variantes fueron cubiertas, TypeScript infiere que ese valor es efectivamente `never` en ese punto y no hay error. Si en el futuro alguien agrega una nueva variante al union y se olvida de agregar su case, ese valor deja de ser `never` en el default, y la asignación falla en tiempo de compilación — convirtiendo un bug silencioso en un error de build inmediato.",
    respuestaEn:
      "It's a technique to make the compiler warn you if you forgot to handle a union variant in a switch: in the `default` branch, you assign the value (already narrowed by the previous branches) to a variable of type `never`. If every variant was covered, TypeScript infers that value is effectively `never` at that point and there's no error. If someone later adds a new variant to the union and forgets to add its case, that value stops being `never` in the default, and the assignment fails at compile time — turning a silent bug into an immediate build error.",
    codigo: `type Forma =
  | { tipo: 'circulo'; radio: number }
  | { tipo: 'cuadrado'; lado: number };

function area(f: Forma): number {
  switch (f.tipo) {
    case 'circulo': return Math.PI * f.radio ** 2;
    case 'cuadrado': return f.lado ** 2;
    default:
      const _exhaustivo: never = f; // si agregan 'triangulo' sin case, error acá
      throw new Error('caso no manejado');
  }
}`,
    tradeoffs:
      "El exhaustiveness check agrega unas líneas de boilerplate en cada switch, pero convierte errores de runtime (una variante no manejada silenciosamente) en errores de compilación — vale la pena en código que evoluciona con el tiempo.",
    repregunta:
      "¿Qué diferencia hay entre angostar un tipo con `typeof`, `instanceof` y una propiedad discriminante — cuándo usarías cada una?",
    respuestaRepreguntaEs:
      "`typeof` sirve para distinguir primitivos (string, number, boolean, etc.) dentro de un union de tipos básicos. `instanceof` sirve cuando las variantes son instancias de clases distintas, aprovechando la cadena de prototipos para verificar el tipo en runtime. La propiedad discriminante es la forma preferida cuando las variantes son objetos planos con formas distintas (no clases) — es más explícita, más fácil de serializar (por ejemplo, para mandar por una API) y no depende de la identidad de la clase, que puede romperse entre distintos bundles o realms de JavaScript.",
    respuestaRepreguntaEn:
      "`typeof` is for distinguishing primitives (string, number, boolean, etc.) within a union of basic types. `instanceof` is for when the variants are instances of different classes, leveraging the prototype chain to check the type at runtime. The discriminant property is the preferred approach when the variants are plain objects with different shapes (not classes) — it's more explicit, easier to serialize (e.g. to send over an API), and doesn't depend on class identity, which can break across different bundles or JavaScript realms.",
    codigoRepregunta: `function procesar(valor: string | number) {
  if (typeof valor === 'string') { /* ... */ } // typeof: primitivos
}

class Perro {} class Gato {}
function sonido(animal: Perro | Gato) {
  if (animal instanceof Perro) { /* ... */ } // instanceof: clases
}

// discriminante: objetos planos, serializables, sin depender de clases
type Evento = { tipo: 'click'; x: number } | { tipo: 'scroll'; y: number };`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es un 'user-defined type guard' (function con `es`/`is`), y cuándo lo necesitás en vez de un narrowing automático?",
    respuestaEs:
      "Es una función que declara explícitamente, en su tipo de retorno, que verifica si un valor pertenece a un tipo específico: `function esError(v: unknown): v is Error`. Dentro de esa función escribís la lógica de chequeo que quieras (una que TypeScript no podría inferir automáticamente), y afuera, cualquier `if (esError(valor))` angosta el tipo como si fuera un chequeo nativo. Hace falta cuando la lógica de discriminación no es un simple `typeof`/`instanceof`/propiedad literal, sino algo más elaborado (por ejemplo, validar la forma completa de un objeto que llegó de una API externa sin tipos).",
    respuestaEn:
      "It's a function that explicitly declares, in its return type, that it checks whether a value belongs to a specific type: `function isError(v: unknown): v is Error`. Inside that function you write whatever checking logic you need (something TypeScript couldn't infer automatically), and outside, any `if (isError(value))` narrows the type as if it were a native check. You need it when the discrimination logic isn't a simple `typeof`/`instanceof`/literal property, but something more elaborate (e.g. validating the full shape of an object that came from an untyped external API).",
    codigo: `interface Usuario { id: string; nombre: string; }

function esUsuario(v: unknown): v is Usuario {
  return typeof v === 'object' && v !== null && 'id' in v && 'nombre' in v;
}

function procesar(datos: unknown) {
  if (esUsuario(datos)) {
    datos.nombre; // angostado a Usuario, sin cast manual
  }
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo interactúan las discriminated unions con conditional types e infer para extraer la variante de un caso específico?",
    respuestaEs:
      "Se puede usar `Extract<T, U>` (que internamente es un conditional type distributivo) para quedarte con solo la variante cuyo discriminante coincide con un valor literal, sin escribir el tipo de esa variante a mano de nuevo: `Extract<Resultado, { tipo: 'error' }>`. Es la misma mecánica de distribución vista en genéricos: TypeScript evalúa la condición de asignabilidad contra cada miembro del union por separado y se queda con los que matchean — funciona naturalmente con discriminated unions porque cada variante es estructuralmente distinta gracias al discriminante.",
    respuestaEn:
      "You can use `Extract<T, U>` (which internally is a distributive conditional type) to keep only the variant whose discriminant matches a literal value, without writing that variant's type by hand again: `Extract<Result, { type: 'error' }>`. It's the same distribution mechanism seen with generics: TypeScript evaluates the assignability condition against each union member separately and keeps the ones that match — it works naturally with discriminated unions because each variant is structurally distinct thanks to the discriminant.",
    codigo: `type Resultado =
  | { tipo: 'exito'; datos: string[] }
  | { tipo: 'error'; mensaje: string };

type ResultadoError = Extract<Resultado, { tipo: 'error' }>;
// { tipo: 'error'; mensaje: string } — sin reescribirlo a mano`,
    repregunta:
      "¿Qué pasa si dos variantes de un union comparten exactamente la misma forma salvo por el discriminante? ¿TypeScript las sigue distinguiendo bien?",
    respuestaRepreguntaEs:
      "Sí, sin problema — el discriminante en sí ya es suficiente para que TypeScript las trate como tipos distintos, incluso si el resto de las propiedades son idénticas en nombre y tipo. Lo que sí hay que cuidar es que el discriminante sea un tipo LITERAL (`'a'`), no un tipo ancho (`string`): si dos variantes usan `tipo: string` en vez de `tipo: 'a'` y `tipo: 'b'`, TypeScript no puede angostar por ese campo porque ambos son 'compatibles' entre sí a nivel de tipo, y el narrowing basado en discriminante deja de funcionar.",
    respuestaRepreguntaEn:
      "Yes, no problem — the discriminant alone is already enough for TypeScript to treat them as distinct types, even if the rest of the properties are identical in name and type. What you do need to watch is that the discriminant is a LITERAL type (`'a'`), not a wide type (`string`): if two variants use `type: string` instead of `type: 'a'` and `type: 'b'`, TypeScript can't narrow on that field because both are 'compatible' with each other at the type level, and discriminant-based narrowing stops working.",
    codigoRepregunta: `// funciona: discriminante literal
type A = { tipo: 'a'; valor: number } | { tipo: 'b'; valor: number };

// NO funciona para narrowing: discriminante ancho
type B = { tipo: string; valor: number } | { tipo: string; valor: string };
// if (x.tipo === 'a') no angosta nada útil acá`,
  },
];
