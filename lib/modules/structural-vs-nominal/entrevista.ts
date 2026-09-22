import type { PreguntaEntrevista } from "../types";

export const entrevistaStructuralVsNominal: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa que TypeScript use 'structural typing' en vez de 'nominal typing'?",
    respuestaEs:
      "En un sistema nominal (como Java o C#), dos tipos son compatibles solo si uno declara explícitamente que implementa o extiende al otro — el NOMBRE del tipo importa. En un sistema estructural, como el de TypeScript, dos tipos son compatibles si tienen la misma FORMA (las mismas propiedades con los mismos tipos), sin importar cómo se llamen ni si uno declaró heredar del otro. Por eso dos interfaces con idénticas propiedades son intercambiables entre sí aunque nunca se hayan relacionado explícitamente.",
    respuestaEn:
      "In a nominal system (like Java or C#), two types are compatible only if one explicitly declares that it implements or extends the other — the type's NAME matters. In a structural system, like TypeScript's, two types are compatible if they have the same SHAPE (the same properties with the same types), regardless of what they're called or whether one declared inheriting from the other. That's why two interfaces with identical properties are interchangeable even if they were never explicitly related.",
    codigo: `interface Punto { x: number; y: number; }
interface Vector { x: number; y: number; }

function mover(p: Punto) { /* ... */ }

const v: Vector = { x: 1, y: 2 };
mover(v); // válido: misma forma, aunque son "tipos" distintos por nombre`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué implica el structural typing al pasar un objeto a una función que espera un tipo específico?",
    respuestaEs:
      "Que no hace falta que el objeto declare explícitamente 'ser' de ese tipo — alcanza con que tenga (al menos) las propiedades requeridas. Esto hace que funciones que reciben una interfaz chica sean muy flexibles: cualquier objeto que 'calce' con esa forma sirve, sin necesidad de conversión ni de que ambos lados coordinen sobre el mismo tipo nominal. Es una de las razones por las que TypeScript se lleva bien con JSON y con datos que vienen de fuentes externas sin tipos propios.",
    respuestaEn:
      "That the object doesn't need to explicitly declare 'being' of that type — it's enough that it has (at least) the required properties. This makes functions that receive a small interface very flexible: any object that 'fits' that shape works, without needing conversion or both sides coordinating on the same nominal type. It's one of the reasons TypeScript plays well with JSON and with data coming from external, untyped sources.",
    codigo: `interface ConNombre { nombre: string }

function saludar(algo: ConNombre) {
  return \`Hola, \${algo.nombre}\`;
}

saludar({ nombre: 'Ana', edad: 30 }); // funciona: tiene "nombre" y de sobra`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es el 'excess property check' y por qué solo se aplica a object literals, no a variables?",
    respuestaEs:
      "Es una verificación extra que TypeScript hace SOLO cuando le pasás un objeto literal directamente (no una variable) a algo que espera un tipo con forma conocida: si el literal tiene una propiedad que no existe en el tipo esperado, es un error, aunque estructuralmente 'sobrar' una propiedad no debería romper la compatibilidad estructural normal. Existe porque, al escribir un literal en el lugar, es casi seguro un typo o una propiedad de más que el autor no quiso incluir — y ahí TypeScript prioriza detectar el error por sobre la flexibilidad estructural pura. Con una variable, en cambio, no se aplica: se asume que quien la armó pudo tener razones legítimas para incluir propiedades extra.",
    respuestaEn:
      "It's an extra check TypeScript does ONLY when you pass an object literal directly (not a variable) to something expecting a type with a known shape: if the literal has a property that doesn't exist in the expected type, it's an error, even though structurally an 'extra' property shouldn't normally break structural compatibility. It exists because, when writing a literal right there, it's almost certainly a typo or an unintended extra property — and there TypeScript prioritizes catching the mistake over pure structural flexibility. With a variable, it doesn't apply: it's assumed whoever built it may have had legitimate reasons to include extra properties.",
    codigo: `interface Config { nombre: string }

function usar(c: Config) {}

usar({ nombre: 'app', extra: true }); // Error: excess property check

const obj = { nombre: 'app', extra: true };
usar(obj); // OK: es una variable, no un literal directo`,
    tradeoffs:
      "El excess property check sacrifica algo de la pureza estructural del sistema de tipos a cambio de atrapar errores de tipeo comunes — un buen ejemplo de TypeScript priorizando ergonomía práctica sobre teoría estricta.",
    repregunta:
      "¿Cómo simularías nominal typing en TypeScript cuando de verdad necesitás que dos tipos con la misma forma NO sean intercambiables (por ejemplo, un UserId y un ProductId, ambos strings)?",
    respuestaRepreguntaEs:
      "Con el patrón 'branded types' (o 'nominal typing simulado'): se agrega una propiedad extra, imposible de tener en la práctica, que actúa como marca distintiva — típicamente una propiedad con un Symbol único o un campo `__brand` con un tipo literal distinto por caso. `type UserId = string & { __brand: 'UserId' }`. Como esa propiedad no existe en un string común, no podés pasar un string plano donde se espera un UserId sin pasar explícitamente por una función de construcción, recuperando la seguridad nominal que el structural typing no da por defecto.",
    respuestaRepreguntaEn:
      "With the 'branded types' pattern (or 'simulated nominal typing'): you add an extra property, impossible to have in practice, that acts as a distinguishing mark — typically a property with a unique Symbol or a `__brand` field with a different literal type per case. `type UserId = string & { __brand: 'UserId' }`. Since that property doesn't exist on a plain string, you can't pass a plain string where a UserId is expected without explicitly going through a construction function, recovering the nominal safety that structural typing doesn't give by default.",
    codigoRepregunta: `type UserId = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

function crearUserId(id: string): UserId {
  return id as UserId;
}

function buscarUsuario(id: UserId) {}

buscarUsuario('abc' as ProductId); // Error: brands distintos, aunque ambos son "string"`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo afecta el structural typing a la compatibilidad de funciones — qué se compara exactamente?",
    respuestaEs:
      "Para que una función sea asignable donde se espera otra, sus parámetros y su tipo de retorno también se comparan estructuralmente, con una regla clave: una función es compatible si acepta IGUAL O MENOS parámetros que los esperados (puede ignorar los que le sobran) y si su retorno es igual o más específico. Esto permite pasar un callback que solo usa parte de los argumentos que el que llama le va a dar — un patrón extremadamente común en callbacks de array (`.map((item) => ...)`, ignorando el índice y el array completo que `.map` provee).",
    respuestaEn:
      "For a function to be assignable where another is expected, its parameters and return type are also compared structurally, with one key rule: a function is compatible if it accepts EQUAL OR FEWER parameters than expected (it can ignore extra ones) and if its return type is equal or more specific. This allows passing a callback that only uses part of the arguments the caller will provide — an extremely common pattern in array callbacks (`.map((item) => ...)`, ignoring the index and full array that `.map` provides).",
    codigo: `const numeros = [1, 2, 3];

numeros.map((item) => item * 2); // ignora index y array, es válido
numeros.forEach((item, index) => console.log(index, item)); // usa 2 de 3`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es la varianza bivariante de los parámetros de métodos en TypeScript, y por qué se considera un 'unsound' deliberado?",
    respuestaEs:
      "En un sistema de tipos completamente 'sound', los parámetros de una función deberían ser contravariantes: una función que reemplaza a otra solo debería aceptar parámetros iguales o MÁS GENERALES, nunca más específicos (porque el que llama podría pasarle cualquier cosa del tipo esperado original). TypeScript, sin embargo, trata los parámetros de MÉTODOS (no de funciones sueltas asignadas a variables) como bivariantes: acepta tanto contravarianza como covarianza, lo cual técnicamente permite escribir código que compila pero podría fallar en runtime. Es una decisión deliberada de diseño para que patrones comunes de POO con jerarquías de clases (por ejemplo, sobreescribir un método de evento con un tipo de evento más específico) sigan compilando sin fricción, priorizando la practicidad sobre el rigor matemático completo.",
    respuestaEn:
      "In a fully 'sound' type system, a function's parameters should be contravariant: a function replacing another should only accept equal or MORE GENERAL parameters, never more specific ones (because the caller might pass anything of the original expected type). TypeScript, however, treats METHOD parameters (not standalone functions assigned to variables) as bivariant: it accepts both contravariance and covariance, which technically allows writing code that compiles but could fail at runtime. It's a deliberate design decision so common OOP patterns with class hierarchies (e.g. overriding an event method with a more specific event type) keep compiling without friction, prioritizing practicality over full mathematical rigor.",
    codigo: `class ManejadorBase { manejar(e: { tipo: string }) {} }
class ManejadorClick extends ManejadorBase {
  // parámetro MÁS ESPECÍFICO que el de la clase base — unsound, pero compila
  manejar(e: { tipo: string; x: number; y: number }) {}
}`,
    repregunta:
      "¿Este mismo unsoundness aplica igual si las funciones se comparan como propiedades (function types) en vez de como métodos de clase?",
    respuestaRepreguntaEs:
      "No. Con el flag `strictFunctionTypes` activado (parte de `strict: true`), TypeScript aplica contravarianza estricta a los tipos de función asignados a variables o propiedades — ahí sí es 'sound' y rechaza el mismo patrón que permite en métodos. La bivarianza se mantiene exclusivamente para métodos declarados con sintaxis de método (`manejar(e) {}` dentro de una clase o interfaz) por compatibilidad histórica con patrones de POO existentes, mientras que las funciones asignadas explícitamente (`manejar: (e) => {}`) sí quedan sujetas a la verificación estricta.",
    respuestaRepreguntaEn:
      "No. With `strictFunctionTypes` enabled (part of `strict: true`), TypeScript applies strict contravariance to function types assigned to variables or properties — there it IS sound and rejects the same pattern it allows for methods. Bivariance is kept exclusively for methods declared with method syntax (`handle(e) {}` inside a class or interface) for historical compatibility with existing OOP patterns, while explicitly assigned functions (`handle: (e) => {}`) are subject to the strict check.",
    codigoRepregunta: `interface ManejadorMetodo { manejar(e: { tipo: string }): void; }
interface ManejadorPropiedad { manejar: (e: { tipo: string }) => void; }

// con strictFunctionTypes: la versión "propiedad" SÍ rechaza el parámetro
// más específico; la versión "método" lo sigue permitiendo (bivariante)`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué pasa con clases que tienen exactamente las mismas propiedades públicas pero miembros privados distintos? ¿TypeScript las trata como compatibles?",
    respuestaEs:
      "No, y este es uno de los pocos casos donde TypeScript SÍ se comporta de forma nominal en vez de estructural: dos clases con miembros `private` o `protected` solo son estructuralmente compatibles si esos miembros privados provienen literalmente de la MISMA declaración (por ejemplo, una hereda de la otra), no si simplemente tienen un miembro privado con igual nombre y tipo declarado por separado en cada una. Es una excepción deliberada: sin ella, cualquier clase con un campo privado del mismo nombre sería intercambiable con cualquier otra, rompiendo la intención de encapsulación de `private`.",
    respuestaEn:
      "No, and this is one of the few cases where TypeScript DOES behave nominally instead of structurally: two classes with `private` or `protected` members are only structurally compatible if those private members literally come from the SAME declaration (e.g. one inherits from the other), not if they simply have a private member with the same name and type declared separately in each. It's a deliberate exception: without it, any class with a private field of the same name would be interchangeable with any other, breaking `private`'s encapsulation intent.",
    codigo: `class A { private secreto: string = ''; }
class B { private secreto: string = ''; } // mismo nombre y tipo, declarado aparte

let a: A = new B(); // Error: los "secreto" privados no son el mismo miembro

class C extends A {}
let c: A = new C(); // OK: C hereda el "secreto" de A, es el mismo miembro`,
  },
];
