import type { PreguntaEntrevista } from "../types";

export const entrevistaStrictMode: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué activa realmente el flag `strict: true` en tsconfig.json?",
    respuestaEs:
      "No es un chequeo único, sino un paraguas que activa un conjunto de flags independientes a la vez: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis y alwaysStrict, entre otros. Cada uno endurece una verificación puntual del compilador. Activar strict de una es la forma recomendada de empezar un proyecto nuevo, porque agregarlos de a uno más tarde sobre una base grande de código sin tipos estrictos suele generar cientos de errores a resolver de golpe.",
    respuestaEn:
      "It's not a single check, but an umbrella that activates a set of independent flags at once: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitThis, and alwaysStrict, among others. Each one tightens one specific compiler check. Turning on strict from day one is the recommended way to start a new project, because adding them one by one later on a large codebase without strict types usually generates hundreds of errors to fix all at once.",
    codigo: `// tsconfig.json
{
  "compilerOptions": {
    "strict": true
    // equivale a activar noImplicitAny, strictNullChecks,
    // strictFunctionTypes, strictPropertyInitialization, etc. todos juntos
  }
}`,
  },
  {
    nivel: 1,
    pregunta:
      "¿Qué diferencia práctica trae strictNullChecks al día a día de escribir código?",
    respuestaEs:
      "Sin strictNullChecks, `null` y `undefined` son asignables a cualquier tipo, así que el compilador nunca te avisa si una variable que asumís siempre presente en realidad puede no estarlo — el clásico 'Cannot read property of undefined' se descubre recién en runtime. Con strictNullChecks, `null`/`undefined` solo son válidos donde el tipo los permite explícitamente (`string | null`), obligando a manejar el caso ausente en el mismo lugar donde el compilador lo detecta, antes de que el código llegue a producción.",
    respuestaEn:
      "Without strictNullChecks, `null` and `undefined` are assignable to any type, so the compiler never warns you if a variable you assume is always present might not be — the classic 'Cannot read property of undefined' is only discovered at runtime. With strictNullChecks, `null`/`undefined` are only valid where the type explicitly allows them (`string | null`), forcing you to handle the absent case right where the compiler catches it, before the code reaches production.",
    codigo: `function saludar(nombre: string) {
  return nombre.toUpperCase();
}

// sin strictNullChecks: esto compila y explota en runtime
saludar(null);

// con strictNullChecks: error de compilación, obliga a decidir qué hacer
saludar(null); // Error: Argument of type 'null' is not assignable`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuál es el trade-off real de activar strict mode en un proyecto legacy grande que nunca lo tuvo?",
    respuestaEs:
      "El beneficio es real: se destapan bugs latentes que el código ya tenía (nulls no manejados, anys implícitos escondiendo mal tipado) antes de que sigan causando fallas en producción. El costo es que la migración no es gratuita: en un codebase grande puede generar cientos o miles de errores de golpe, muchos de ellos en código que 'funciona bien' en la práctica porque nunca se ejecutó el path problemático. La estrategia recomendada no es activar `strict: true` de una, sino migrar de a un flag por vez (empezando por noImplicitAny, después strictNullChecks) y usar `// @ts-expect-error` puntual o archivos excluidos temporalmente para no bloquear el resto del equipo mientras se resuelve gradualmente.",
    respuestaEn:
      "The benefit is real: it uncovers latent bugs the code already had (unhandled nulls, implicit anys hiding bad typing) before they keep causing failures in production. The cost is that migration isn't free: on a large codebase it can generate hundreds or thousands of errors at once, many of them in code that 'works fine' in practice because the problematic path was never exercised. The recommended strategy isn't turning on `strict: true` all at once, but migrating one flag at a time (starting with noImplicitAny, then strictNullChecks) and using targeted `// @ts-expect-error` or temporarily excluded files so the rest of the team isn't blocked while it's resolved gradually.",
    tradeoffs:
      "Strict mode de entrada en un proyecto nuevo: costo casi nulo, beneficio completo desde el día uno. Migrarlo en un proyecto legacy grande: beneficio real pero con un costo de migración que hay que planificar, no improvisar de un día para el otro.",
    repregunta:
      "Si el equipo no puede migrar todo strict de una, ¿cómo evitarías que el código NUEVO que se escribe mientras tanto siga sin las verificaciones estrictas?",
    respuestaRepreguntaEs:
      "Con `strict: false` a nivel global pero activando los flags estrictos por carpeta usando un `tsconfig.json` adicional que extienda del base solo para los directorios nuevos, o más simple: activar `strict: true` globalmente y usar la opción `// @ts-nocheck` (o excluir explícitamente en `tsconfig.json`) únicamente en los archivos legacy identificados como pendientes de migrar. Así todo el código nuevo queda forzado a cumplir las reglas estrictas desde el primer commit, y la lista de archivos legacy pendientes se puede rastrear y achicar con el tiempo, en vez de tener toda la base mezclada sin distinción.",
    respuestaRepreguntaEn:
      "With `strict: false` globally but turning on the strict flags per folder using an additional `tsconfig.json` that extends the base one only for new directories, or more simply: turn on `strict: true` globally and use `// @ts-nocheck` (or explicit excludes in `tsconfig.json`) only on the legacy files identified as pending migration. That way all new code is forced to comply with the strict rules from the first commit, and the list of pending legacy files can be tracked and shrunk over time, instead of having the whole codebase mixed together with no distinction.",
    codigoRepregunta: `// tsconfig.json
{
  "compilerOptions": { "strict": true },
  "exclude": ["src/legacy/**"] // pendiente de migrar, trackeado aparte
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué hace específicamente noUncheckedIndexedAccess, y por qué no está incluido dentro de strict?",
    respuestaEs:
      "Sin este flag, acceder a un array o Record por índice (`arr[i]`, `record[clave]`) da un tipo que asume que el elemento siempre existe, aunque el índice esté fuera de rango o la clave no exista — TypeScript no puede verificar eso estáticamente en el caso general. Con `noUncheckedIndexedAccess`, ese acceso devuelve `T | undefined`, forzando a manejar el caso de que no exista. No está incluido en `strict` porque es una verificación particularmente ruidosa: en código que accede mucho a arrays/records por índice, puede generar una cantidad grande de chequeos adicionales que muchos equipos consideran que no vale la pena forzar en todos los casos.",
    respuestaEn:
      "Without this flag, accessing an array or Record by index (`arr[i]`, `record[key]`) gives a type that assumes the element always exists, even if the index is out of range or the key doesn't exist — TypeScript can't statically verify that in the general case. With `noUncheckedIndexedAccess`, that access returns `T | undefined`, forcing you to handle the case where it doesn't exist. It's not included in `strict` because it's a particularly noisy check: in code that heavily indexes into arrays/records, it can generate a large amount of additional checks that many teams don't consider worth forcing everywhere.",
    codigo: `const nombres = ['Ana', 'Luis'];

// sin noUncheckedIndexedAccess: TS cree que siempre es string
const tercero = nombres[2]; // undefined en runtime, pero TS dice string

// con noUncheckedIndexedAccess: TS obliga a manejar el caso
const tercero: string | undefined = nombres[2];`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué diferencia hay entre strictPropertyInitialization y strictNullChecks, y por qué el primero depende del segundo?",
    respuestaEs:
      "strictNullChecks controla si null/undefined son asignables donde no se declararon explícitamente. strictPropertyInitialization va un paso más allá para clases: exige que toda propiedad NO opcional de una clase esté inicializada en su declaración o en el constructor, para todos los paths posibles de ese constructor — si hay un camino donde la propiedad queda sin asignar, es error. Depende de strictNullChecks porque, sin este último activo, una propiedad sin inicializar simplemente 'sería' undefined en runtime sin que el sistema de tipos lo modele como un problema; con strictNullChecks, el compilador SÍ distingue entre 'declarado como string' y 'declarado como string, pero podría no estarlo todavía', y ahí es donde strictPropertyInitialization tiene algo concreto que verificar.",
    respuestaEn:
      "strictNullChecks controls whether null/undefined are assignable where not explicitly declared. strictPropertyInitialization goes a step further for classes: it requires every non-optional class property to be initialized in its declaration or in the constructor, across every possible path through that constructor — if there's a path where the property ends up unassigned, it's an error. It depends on strictNullChecks because, without it enabled, an uninitialized property would simply 'be' undefined at runtime without the type system modeling that as a problem; with strictNullChecks, the compiler DOES distinguish between 'declared as string' and 'declared as string, but might not be yet', and that's where strictPropertyInitialization has something concrete to check.",
    codigo: `class Usuario {
  nombre: string; // Error con strictPropertyInitialization: nunca se asigna

  constructor(condicion: boolean) {
    if (condicion) {
      this.nombre = 'Ana'; // solo se asigna en UN path posible
    }
    // si condicion es false, "nombre" queda sin asignar
  }
}`,
    repregunta:
      "¿Cómo se relaciona esto con los 'definite assignment assertions' (`propiedad!: string`)? ¿Cuándo son legítimas y cuándo un code smell?",
    respuestaRepreguntaEs:
      "El operador `!` después del nombre de una propiedad (o variable) le dice al compilador 'confiá en mí, esto va a estar asignado antes de usarse, aunque no lo pueda verificar por mi cuenta' — desactiva la verificación de strictPropertyInitialization para ese campo puntual. Es legítimo cuando la inicialización ocurre por un mecanismo externo al constructor que TypeScript no puede rastrear (por ejemplo, un framework que llama a un método de inicialización después de construir la instancia, como Angular con `@Input()`, o un decorator de inyección de dependencias). Es un code smell cuando se usa simplemente para silenciar el error sin haber garantizado realmente esa inicialización — en ese caso, el bug que strictPropertyInitialization buscaba prevenir sigue latente, solo que ahora sin el aviso del compilador.",
    respuestaRepreguntaEn:
      "The `!` operator after a property (or variable) name tells the compiler 'trust me, this will be assigned before use, even though I can't verify it myself' — it disables the strictPropertyInitialization check for that specific field. It's legitimate when initialization happens through a mechanism external to the constructor that TypeScript can't track (e.g. a framework that calls an initialization method after constructing the instance, like Angular's `@Input()`, or a dependency injection decorator). It's a code smell when it's used just to silence the error without actually guaranteeing that initialization — in that case, the bug strictPropertyInitialization was meant to prevent is still lurking, just now without the compiler's warning.",
    codigoRepregunta: `class ComponenteAngular {
  @Input() valor!: string; // legítimo: Angular lo asigna después del constructor
}

class Riesgoso {
  config!: Config; // code smell si nada garantiza asignarlo antes de usarlo
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es 'sound' vs 'unsound' en un sistema de tipos, y por qué TypeScript acepta ser deliberadamente unsound en varios puntos?",
    respuestaEs:
      "Un sistema de tipos es 'sound' si garantiza matemáticamente que un programa que compila nunca va a tener un error de tipo en runtime. TypeScript es deliberadamente unsound en varios puntos — la bivarianza de parámetros de método, el uso de `any` como escape hatch universal, el comportamiento de `as` para forzar un cast sin verificación real, o el hecho de que un array `T[]` no verifica límites al indexar (sin noUncheckedIndexedAccess) — porque priorizar el soundness completo, como hacen lenguajes como Haskell o Rust, haría que escribir JavaScript con tipos gradualmente fuera mucho más rígido y verboso. La filosofía de TypeScript es dar la mayor seguridad de tipos posible SIN romper la ergonomía de JavaScript ni obligar a reescribir código existente de formas poco naturales — aceptando puntos de unsoundness conocidos y documentados a cambio de eso.",
    respuestaEn:
      "A type system is 'sound' if it mathematically guarantees a program that compiles will never have a type error at runtime. TypeScript is deliberately unsound at several points — method parameter bivariance, using `any` as a universal escape hatch, `as`'s behavior forcing a cast without real verification, or the fact that a `T[]` array doesn't check bounds when indexing (without noUncheckedIndexedAccess) — because prioritizing full soundness, like languages such as Haskell or Rust do, would make writing gradually-typed JavaScript far more rigid and verbose. TypeScript's philosophy is to give as much type safety as possible WITHOUT breaking JavaScript's ergonomics or forcing existing code to be rewritten in unnatural ways — accepting known, documented unsoundness points in exchange for that.",
    codigo: `const valor: any = 'texto';
const numero: number = valor; // unsound: compila, pero numero es un string en runtime

const arr: string[] = ['a', 'b'];
const x: string = arr[10]; // unsound sin noUncheckedIndexedAccess: undefined en runtime`,
  },
];
