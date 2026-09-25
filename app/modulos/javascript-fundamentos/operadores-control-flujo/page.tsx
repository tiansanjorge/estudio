import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaOperadoresControlFlujo } from "@/lib/modules/javascript-fundamentos/operadores-control-flujo-entrevista";

const preguntasPorNivel = {
  1: entrevistaOperadoresControlFlujo.filter((p) => p.nivel === 1),
  2: entrevistaOperadoresControlFlujo.filter((p) => p.nivel === 2),
  3: entrevistaOperadoresControlFlujo.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Operadores & control de flujo — Dev Study Lab",
  description:
    "Truthy/falsy, los loops (for, while, do...while, for...of, for...in), switch y los operadores que definen cómo se ramifica y repite el código.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estos valores es truthy?",
    opciones: [
      "El string '0' (un cero como texto, no como número)",
      "El número 0",
      "El string vacío ''",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "'0' es un string no vacío, así que es truthy. El número 0 y el string vacío '' son dos de los siete valores falsy.",
  },
  {
    pregunta: "Al recorrer un array, ¿qué entrega for...in en cada vuelta?",
    opciones: [
      "El índice de cada posición, como string",
      "El valor de cada posición, en el tipo original",
      "Un par [índice, valor] en cada vuelta",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "for...in itera claves enumerables. Sobre un array, esas claves son los índices, entregados como string — no como number.",
  },
  {
    pregunta:
      "Si cantidad vale 0, ¿qué devuelve cantidad ?? 10 y qué devuelve cantidad || 10?",
    opciones: [
      "?? devuelve 0 (respeta el valor); || devuelve 10 (0 es falsy)",
      "Ambos devuelven 0, porque los dos evalúan solo null/undefined",
      "Ambos devuelven 10, porque 0 es falsy para los dos operadores",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "?? solo reemplaza null/undefined, así que respeta el 0 como valor válido. || reemplaza cualquier falsy, incluyendo 0.",
  },
  {
    pregunta:
      "¿Qué diferencia hay entre while y do...while?",
    opciones: [
      "while evalúa la condición antes de cada vuelta; do...while la evalúa después, así que el cuerpo corre al menos una vez",
      "No hay ninguna diferencia real, son dos formas de escribir lo mismo",
      "do...while solo puede usarse con números; while funciona con cualquier condición",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Por evaluar la condición al final, do...while garantiza al menos una ejecución del cuerpo, aunque la condición sea false desde el inicio.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál es el riesgo principal de usar switch en vez de if/else?",
    opciones: [
      "El fallthrough implícito: olvidar un break ejecuta también los casos siguientes",
      "switch no admite comparar strings, solo números",
      "switch es siempre más lento en tiempo de ejecución que if/else",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Si un case no termina en break (o return), la ejecución continúa cayendo en el case siguiente, sin volver a evaluar su condición.",
  },
  {
    pregunta:
      "¿Por qué for...in es riesgoso para recorrer un array, más allá de dar índices como string?",
    opciones: [
      "Puede iterar también propiedades heredadas del prototipo, no solo los índices del array",
      "No funciona con arrays: solo está pensado para objetos planos",
      "Recorre el array en orden inverso por definición del spec",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "for...in enumera todas las propiedades enumerables, incluidas las agregadas al prototipo (por ejemplo, por una librería vieja que extiende Array.prototype).",
  },
  {
    pregunta:
      "En TypeScript, ¿qué patrón permite detectar en compile-time si a un switch le falta cubrir un caso de un union?",
    opciones: [
      "Asignar el valor no cubierto a una variable de tipo never en el default",
      "Agregar un comentario @exhaustive arriba del switch",
      "TypeScript lo detecta automáticamente sin ningún patrón adicional",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Si el union está bien tipado y falta un case, el valor que llega al default no es asignable a never, y TypeScript marca el error en esa línea.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué se usa típicamente el comma operator en JavaScript?",
    opciones: [
      "Para actualizar más de una variable en la cláusula de incremento de un for clásico",
      "Para separar los argumentos de una función, igual que una coma normal",
      "Para encadenar promesas de forma secuencial sin usar .then()",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Fuera de esa cláusula del for, el comma operator casi no se usa a propósito: evalúa varias expresiones y devuelve solo la última.",
  },
  {
    pregunta: "¿Qué hace continue con una etiqueta (continue externo) en loops anidados?",
    opciones: [
      "Salta directo a la siguiente iteración del loop externo, saltándose el resto del interno",
      "Es equivalente a un continue normal: solo afecta al loop donde está escrito",
      "Termina completamente ambos loops, igual que un break etiquetado",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "continue etiqueta identifica el loop externo por su label y avanza su siguiente iteración, en vez de solo la del loop interno.",
  },
  {
    pregunta:
      "¿Qué problema evita usar for...of en vez de for...in para recorrer los valores de un array?",
    opciones: [
      "Evita depender del orden de enumeración de claves y de posibles propiedades heredadas del prototipo",
      "Evita que el array se copie por valor antes de iterarlo",
      "Evita que TypeScript infiera any en el tipo de cada elemento",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "for...of usa el protocolo de iteración del array (sus valores reales, en orden), sin pasar por las claves enumerables del objeto.",
  },
];

export default function OperadoresControlFlujoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Operadores & control de flujo"
      descripcion="Truthy/falsy, for, while, do...while, for...of, for...in y switch: cómo el código decide qué ejecutar y cuántas veces."
    >
      <NivelTabs
        niveles={{
          1: <NivelUno />,
          2: <NivelDos />,
          3: <NivelTres />,
        }}
      />
    </ModuloLayout>
  );
}

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Cualquier valor se puede evaluar como booleano en un{" "}
            <code>if</code> o con <code>!!</code>. Hay exactamente siete
            valores{" "}
            <strong className="text-foreground">falsy</strong>:{" "}
            <code>false</code>, <code>0</code>, <code>-0</code>,{" "}
            <code>0n</code>, <code>&apos;&apos;</code>, <code>null</code>,{" "}
            <code>undefined</code> y <code>NaN</code>. Todo lo demás es{" "}
            <strong className="text-foreground">truthy</strong> — incluyendo
            un array vacío <code>[]</code> y un objeto vacío{" "}
            <code>{"{}"}</code>, que suelen sorprender.
          </p>
          <p>
            Para repetir código hay varias herramientas.{" "}
            <code>for</code> es el loop clásico con contador explícito
            (inicialización; condición; incremento) — se usa cuando se
            sabe de antemano cuántas vueltas dar (o se puede calcular).{" "}
            <code>while</code> repite mientras una condición sea true,
            evaluándola <em>antes</em> de cada vuelta — se usa cuando no
            se sabe de antemano cuántas vueltas van a hacer falta.{" "}
            <code>do...while</code> es igual a while, pero evalúa la
            condición <em>después</em> de cada vuelta, así que el cuerpo
            se ejecuta siempre al menos una vez, aunque la condición sea
            false desde el principio.
          </p>
          <p>
            <code>for...of</code> itera <em>valores</em> de cualquier
            iterable (arrays, strings, Maps, Sets) y <code>for...in</code>{" "}
            itera <em>claves enumerables</em> de un objeto. Para elegir
            entre varias ramas hay <code>if/else</code> y{" "}
            <code>switch</code>, que compara un mismo valor contra varios
            casos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="truthy-falsy.js"
            codigo={`if ([]) console.log("array vacío: truthy");   // se imprime
if ({}) console.log("objeto vacío: truthy");    // se imprime
if ("0") console.log("string '0': truthy");     // se imprime
if (0) console.log("nunca se imprime — 0 es falsy");`}
          />
          <BloqueCodigo
            titulo="tipos-de-loop.js"
            codigo={`const frutas = ["manzana", "banana", "cereza"];

for (let i = 0; i < frutas.length; i++) {
  console.log(i, frutas[i]);        // acceso manual por índice
}

for (const fruta of frutas) {
  console.log(fruta);               // itera los valores directamente
}

for (const indice in frutas) {
  console.log(typeof indice);       // "string" — no "number"
}`}
          />
          <BloqueCodigo
            titulo="while-y-do-while.js"
            codigo={`let intentos = 0;

while (intentos < 3) {
  console.log("intento", intentos);
  intentos++;
}
// se ejecuta 3 veces: la condición se chequea ANTES de cada vuelta

let n = 5;
do {
  console.log("n vale", n);
  n++;
} while (n < 3);
// se ejecuta 1 vez igual, aunque n < 3 ya es false desde el inicio:
// do...while chequea la condición DESPUÉS de cada vuelta`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar || para un valor por defecto que puede ser 0.
            </strong>{" "}
            cantidad || 10 reemplaza un 0 legítimo por 10. Para eso existe
            ??, que solo reacciona a null/undefined.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidar el break dentro de un case de switch.
            </strong>{" "}
            Sin break, la ejecución sigue cayendo en los casos siguientes
            (fallthrough), un bug clásico y silencioso.
          </li>
          <li>
            <strong className="text-foreground">
              Usar for...in para recorrer un array.
            </strong>{" "}
            Da los índices como string y puede iterar propiedades
            heredadas. Para arrays conviene for...of o los métodos de
            array.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidar actualizar la variable de la condición dentro de un
              while.
            </strong>{" "}
            A diferencia de for (que fuerza a escribir el incremento en la
            misma línea), en while es fácil olvidar esa línea dentro del
            cuerpo y terminar con un loop infinito.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar ?? para valores de configuración que legítimamente pueden
            ser 0, &apos;&apos; o false (por ejemplo, un descuento de 0%).
          </li>
          <li>
            Elegir switch para mapear un estado discreto (idle/cargando/
            listo/error) a un mensaje o componente, en vez de encadenar
            varios else if.
          </li>
          <li>
            Preferir for...of (o .forEach/.map) sobre for clásico cuando
            solo hace falta el valor, no el índice — es más legible y
            menos propenso a errores de límites (off-by-one).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>¿Qué imprime este código?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function describir(nota) {
  switch (true) {
    case nota >= 7:
      console.log("aprobado");
    case nota >= 9:
      console.log("con mención");
      break;
    default:
      console.log("desaprobado");
  }
}

describir(8);`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime{" "}
              <strong className="text-foreground">
                &quot;aprobado&quot;
              </strong>{" "}
              y después{" "}
              <strong className="text-foreground">
                &quot;con mención&quot;
              </strong>
              .
            </p>
            <p className="mt-2">
              switch (true) compara true contra cada case: nota &gt;= 7 es
              true con nota = 8, así que entra ahí. Pero ese case no tiene
              break, así que cae (fallthrough) al siguiente case sin volver
              a evaluar su condición, y también imprime &quot;con
              mención&quot; — aunque 8 no es &gt;= 9. El bug es justamente
              el fallthrough que faltaba cortar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            switch conviene cuando se compara un mismo valor contra varios
            casos discretos: suele leerse mejor que una cadena larga de{" "}
            <code>else if</code>. En TypeScript, además, un switch sobre
            una <em>union discriminada</em> permite verificar exhaustividad
            en compile-time: si falta cubrir un caso, asignarlo a una
            variable de tipo <code>never</code> en el <code>default</code>{" "}
            marca error.
          </p>
          <p>
            for...in tiene un riesgo más allá de dar índices como string:
            enumera <em>todas</em> las propiedades enumerables de un
            objeto, incluidas las heredadas del prototipo. Si algo agregó
            una propiedad a <code>Array.prototype</code> (una librería
            vieja, un polyfill mal hecho), for...in la va a iterar también.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <BloqueCodigo
          titulo="exhaustividad.ts"
          codigo={`type Estado = "cargando" | "listo" | "error";

function mensaje(estado: Estado): string {
  switch (estado) {
    case "cargando":
      return "Cargando...";
    case "listo":
      return "Listo";
    default: {
      const _exhaustivo: never = estado;
      // Si se agrega "error" al union y no se cubre acá,
      // TypeScript marca error en esta línea.
      return _exhaustivo;
    }
  }
}`}
        />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Extender Array.prototype o Object.prototype directamente.
            </strong>{" "}
            Cualquier for...in en el proyecto (propio o de una dependencia)
            empieza a iterar esas propiedades agregadas.
          </li>
          <li>
            <strong className="text-foreground">
              Agregar un caso nuevo a un union sin actualizar todos los
              switch.
            </strong>{" "}
            Sin el patrón never en el default, TypeScript no avisa que
            falta cubrirlo — el caso nuevo cae silenciosamente en default.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el patrón de exhaustividad con never en cualquier switch
            sobre un union de estados (máquinas de estado, reducers) para
            que el compilador avise si se agrega un estado nuevo.
          </li>
          <li>
            Preferir Object.keys()/values()/entries() en vez de for...in
            cuando se necesita iterar solo las propiedades propias de un
            objeto, sin las heredadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel2} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[2]} />
      </Seccion>
    </>
  );
}

function NivelTres() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            El <strong className="text-foreground">comma operator</strong>{" "}
            evalúa varias expresiones separadas por comas de izquierda a
            derecha y devuelve el valor de la última. Su único uso
            razonable es en la cláusula de incremento de un{" "}
            <code>for</code> clásico, para actualizar más de una variable
            por vuelta; fuera de ahí, casi siempre es un error de tipeo.
          </p>
          <p>
            <code>break</code> y <code>continue</code> pueden llevar una{" "}
            <strong className="text-foreground">etiqueta</strong> (label)
            para afectar a un loop externo, no solo al más interno. Es una
            herramienta rara en código moderno porque casi siempre se puede
            reemplazar con una función que hace return temprano, más
            legible que un label.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="comma-operator.js"
            codigo={`for (let i = 0, j = 10; i < j; i++, j--) {
  console.log(i, j); // actualiza dos variables en cada vuelta
}`}
          />
          <BloqueCodigo
            titulo="break-etiquetado.js"
            codigo={`externo: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue externo; // salta a la siguiente i
    console.log(i, j);
  }
}`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Abusar de labels para simular goto.
            </strong>{" "}
            Suele ser más difícil de seguir que extraer el loop a una
            función y usar return para cortar la ejecución temprano.
          </li>
          <li>
            <strong className="text-foreground">
              Confiar en el orden de for...in para claves no numéricas.
            </strong>{" "}
            El spec garantiza orden para claves tipo entero, pero para el
            resto el orden es el de inserción — mejor no depender de eso
            para lógica crítica.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Reconocer un comma operator en código legacy (a veces generado
            por minificadores) para no confundirlo con un bug.
          </li>
          <li>
            Usar break etiquetado como salida puntual de una búsqueda
            anidada (matriz de matrices) cuando extraer una función no es
            práctico por la cantidad de variables locales compartidas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
