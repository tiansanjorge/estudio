import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaVariablesTipos } from "@/lib/modules/javascript-fundamentos/variables-tipos-entrevista";

const preguntasPorNivel = {
  1: entrevistaVariablesTipos.filter((p) => p.nivel === 1),
  2: entrevistaVariablesTipos.filter((p) => p.nivel === 2),
  3: entrevistaVariablesTipos.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Variables & tipos — Dev Study Lab",
  description:
    "var, let y const; primitivos vs referencias; coerción de tipos — la base sobre la que se construye todo lo demás en JavaScript.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué pasa si accedés a una variable let antes de su línea de declaración, dentro del mismo bloque?",
    opciones: [
      "Lanza un ReferenceError, porque está en la Temporal Dead Zone",
      "Devuelve undefined, igual que pasaría con var",
      "Devuelve el valor que tenga una variable con ese nombre en el bloque exterior",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "let (y const) sufren hoisting igual que var, pero no se inicializan en undefined: quedan en la Temporal Dead Zone hasta que se ejecuta su línea de declaración.",
  },
  {
    pregunta:
      "¿Qué diferencia hay entre copiar un number y copiar un array a otra variable?",
    opciones: [
      "El number se copia por valor; el array se copia por referencia, así que ambas variables apuntan a los mismos datos",
      "Ambos se copian por valor: cada variable queda totalmente independiente de la otra",
      "Ambos se copian por referencia: modificar uno modifica el otro, sin importar el tipo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los primitivos se copian por valor. Los objetos y arrays se copian por referencia: la variable guarda un puntero a la misma estructura en memoria.",
  },
  {
    pregunta: "¿Por qué [] == false da true?",
    opciones: [
      "Porque ambos lados se convierten a number antes de comparar: [] se convierte en 0 y false también",
      "Porque un array vacío siempre se considera falsy al usar ==",
      "Porque JavaScript compara la longitud del array (0) directamente contra el booleano",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Con ==, el booleano se convierte a number (false → 0) y el array pasa por ToPrimitive (se vuelve '' y luego 0). 0 == 0 es true.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un objeto declarado con const, ¿se puede mutar (cambiar sus propiedades)?",
    opciones: [
      "Sí: const impide reasignar la variable, pero no impide modificar las propiedades del objeto",
      "No: const hace inmutable tanto la variable como el contenido del objeto",
      "Solo se pueden mutar propiedades primitivas, no arrays ni objetos anidados",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "const congela el binding, no el valor. Si ese valor es un objeto, sus propiedades se pueden seguir modificando libremente.",
  },
  {
    pregunta: "¿Qué limitación tiene Object.freeze para lograr inmutabilidad?",
    opciones: [
      "Es superficial: las propiedades anidadas que sean objetos siguen siendo mutables",
      "Solo funciona sobre arrays, no sobre objetos planos",
      "Impide leer las propiedades del objeto, no solo escribirlas",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Object.freeze solo congela el primer nivel. Un objeto anidado dentro de uno congelado sigue siendo completamente mutable.",
  },
  {
    pregunta: "¿Cuándo tiene sentido usar == en vez de ===?",
    opciones: [
      "Para comparar un valor contra null y undefined a la vez, con valor == null",
      "Nunca: == está deprecado y los linters lo bloquean por completo",
      "Cuando se comparan dos números, porque == es más rápido que ===",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "valor == null es true tanto si valor es null como si es undefined, gracias a la única regla de coerción entre esos dos que no sorprende.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "typeof null da \"object\". ¿Cómo se explica ese comportamiento?",
    opciones: [
      "Es un bug de la implementación original de JS que se mantiene por compatibilidad hacia atrás",
      "Porque null técnicamente es una instancia vacía de Object en el spec de ECMAScript",
      "Porque los motores modernos representan null como un puntero nulo a un objeto",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "En la implementación de 1995, los valores llevaban una etiqueta de tipo interna; el bit de null coincidía con la de los objetos. Se mantiene por compatibilidad.",
  },
  {
    pregunta: "¿Qué imprime {} + [] evaluado como sentencia en el top-level de un script?",
    opciones: [
      "0, porque {} se interpreta como un bloque vacío y +[] se convierte a number",
      "\"[object Object]\", porque {} se convierte primero a objeto y luego se concatena",
      "Un SyntaxError, porque no se puede sumar un bloque con un array",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "En posición de sentencia, {} se parsea como un bloque vacío, no como un objeto. Lo que queda es +[], que convierte el array a 0.",
  },
  {
    pregunta: "¿Qué diferencia hay entre la TDZ de let/const y el hoisting de var?",
    opciones: [
      "var se inicializa en undefined desde el inicio del scope; let/const existen pero no se pueden leer hasta su declaración",
      "var no sufre hoisting; let y const sí, y ambas se inicializan en undefined",
      "Ambas se comportan igual: la única diferencia es que let permite reasignar y var no",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los tres sufren hoisting (el motor los reconoce desde el inicio del scope), pero solo var queda inicializada en undefined de entrada.",
  },
];

export default function VariablesTiposPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Variables & tipos"
      descripcion="var, let, const, primitivos vs referencias y coerción de tipos: la base sobre la que se apoya todo lo demás en JavaScript."
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
            JavaScript tiene tres formas de declarar variables:{" "}
            <code>var</code>, <code>let</code> y <code>const</code>.{" "}
            <code>var</code> es function-scoped (o global si está fuera de
            una función) y sufre <em>hoisting</em>: el motor la reconoce
            desde el inicio del scope, inicializada en <code>undefined</code>.{" "}
            <code>let</code> y <code>const</code> son{" "}
            <strong className="text-foreground">block-scoped</strong>: solo
            existen dentro del bloque <code>{"{ }"}</code> donde se
            declaran. La diferencia entre <code>let</code> y{" "}
            <code>const</code> es que <code>const</code> no permite
            reasignar la variable a otro valor.
          </p>
          <p>
            Los tipos se dividen en dos familias.{" "}
            <strong className="text-foreground">Primitivos</strong> —{" "}
            <code>string</code>, <code>number</code>, <code>boolean</code>,{" "}
            <code>null</code>, <code>undefined</code>, <code>symbol</code>,{" "}
            <code>bigint</code> — se copian{" "}
            <strong className="text-foreground">por valor</strong>: cada
            variable tiene su propia copia independiente.{" "}
            <strong className="text-foreground">Objetos</strong> (incluyendo
            arrays y funciones) se copian{" "}
            <strong className="text-foreground">por referencia</strong>: la
            variable guarda un puntero a la misma estructura en memoria.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <p className="text-base text-muted-foreground">
            El scope de var vs let, y la diferencia entre copiar por valor
            y por referencia:
          </p>
          <BloqueCodigo
            titulo="scope.js"
            codigo={`if (true) {
  var x = 1;
  let y = 2;
}

console.log(x); // 1 — var "se escapó" del bloque
console.log(y); // ReferenceError — y no existe fuera del bloque`}
          />
          <BloqueCodigo
            titulo="valor-vs-referencia.js"
            codigo={`let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — a no se vio afectada

const obj1 = { valor: 5 };
const obj2 = obj1;
obj2.valor = 10;
console.log(obj1.valor); // 10 — misma referencia`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que const hace inmutable el valor.
            </strong>{" "}
            Solo impide reasignar la variable. Un objeto o array guardado en
            una const se puede seguir mutando (push, cambiar propiedades)
            sin ningún error.
          </li>
          <li>
            <strong className="text-foreground">
              Usar var por costumbre en código nuevo.
            </strong>{" "}
            Al ser function-scoped y permitir redeclaración, var facilita
            bugs de variables que &quot;se escapan&quot; de un bloque if o for. Hoy
            se prefiere let/const siempre.
          </li>
          <li>
            <strong className="text-foreground">
              Comparar objetos con === esperando que compare su contenido.
            </strong>{" "}
            === compara referencias en objetos: dos objetos con las mismas
            propiedades pero creados por separado nunca son ===.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            En React, entender por qué hay que crear un objeto/array nuevo
            para actualizar estado (setEstado({"{"}...estado, campo{"}"}))
            en vez de mutar el existente: React compara por referencia para
            decidir si re-renderizar.
          </li>
          <li>
            Elegir const por defecto para todo lo que no se reasigna,
            dejando let solo para contadores o variables que sí cambian de
            valor — mejora la legibilidad al comunicar intención.
          </li>
          <li>
            Usar === (no ==) en cualquier comparación, para evitar la
            coerción implícita de tipos y sus resultados poco intuitivos.
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
          <p>¿Qué imprime este código, y por qué?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const usuario = { nombre: "Ana" };

function actualizar(obj) {
  obj.nombre = "Beto";
  obj = { nombre: "Carla" };
}

actualizar(usuario);
console.log(usuario.nombre);`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">&quot;Beto&quot;</strong>.
            </p>
            <p className="mt-2">
              El parámetro <code>obj</code> recibe una copia de la{" "}
              <em>referencia</em> a <code>usuario</code>, no el objeto
              en sí. Por eso <code>obj.nombre = &quot;Beto&quot;</code> muta el mismo
              objeto que apunta <code>usuario</code>. Pero{" "}
              <code>{"obj = { nombre: \"Carla\" }"}</code> reasigna esa
              variable local a un objeto nuevo — no afecta a{" "}
              <code>usuario</code>, que sigue apuntando al objeto original
              (ya mutado a &quot;Beto&quot;).
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
            <code>===</code> se prefiere sobre <code>==</code> porque{" "}
            <code>==</code> aplica coerción de tipos siguiendo reglas del
            spec que no siempre son intuitivas. Usar <code>===</code> por
            defecto elimina esa fuente de bugs; <code>==</code> solo tiene
            un uso legítimo y acotado: <code>valor == null</code> para
            chequear null y undefined a la vez.
          </p>
          <p>
            Como const no hace inmutable el valor, para lograr eso existe{" "}
            <code>Object.freeze()</code>, que impide agregar, eliminar o
            reasignar propiedades de primer nivel. Es{" "}
            <strong className="text-foreground">superficial</strong>: si
            una propiedad es a su vez un objeto, ese objeto anidado sigue
            siendo mutable.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <BloqueCodigo
          titulo="freeze-superficial.js"
          codigo={`const config = Object.freeze({
  tema: "oscuro",
  opciones: { debug: true },
});

config.tema = "claro";         // no hace nada (falla en silencio)
config.opciones.debug = false; // esto SÍ funciona — freeze es superficial`}
        />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en Object.freeze para inmutabilidad profunda.
            </strong>{" "}
            Solo congela el primer nivel. Para objetos anidados hace falta
            congelar recursivamente o usar una librería (Immer).
          </li>
          <li>
            <strong className="text-foreground">
              Usar == &quot;por las dudas&quot; para comparar tipos distintos.
            </strong>{" "}
            La coerción puede dar resultados sorprendentes (&apos;&apos; == 0 es
            true). Si necesitás flexibilidad de tipo, convertí
            explícitamente antes de comparar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Congelar un objeto de configuración o constantes exportadas
            desde un módulo, para detectar en desarrollo si algo intenta
            mutarlas por error.
          </li>
          <li>
            Usar valor == null en validaciones para tratar null y
            undefined como equivalentes, en vez de escribir dos chequeos
            con ===.
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
            <code>let</code> y <code>const</code> también sufren hoisting
            —el motor las reconoce desde el inicio del bloque— pero, a
            diferencia de <code>var</code>, no se inicializan en{" "}
            <code>undefined</code>: quedan en la{" "}
            <strong className="text-foreground">
              Temporal Dead Zone
            </strong>{" "}
            (TDZ) hasta que se ejecuta su línea de declaración. Acceder a
            la variable en ese tramo lanza un{" "}
            <code>ReferenceError</code>, no devuelve undefined.
          </p>
          <p>
            El operador <code>+</code>, con al menos un operando objeto o
            array, fuerza la conversión de ambos lados a primitivo (
            <code>ToPrimitive</code>) antes de operar. Para arrays y
            objetos comunes eso llama a <code>toString()</code>:{" "}
            <code>[].toString()</code> es <code>&apos;&apos;</code>, y{" "}
            <code>{"{}"}.toString()</code> es{" "}
            <code>&apos;[object Object]&apos;</code>. También{" "}
            <code>typeof null</code> da <code>&quot;object&quot;</code>: un bug de la
            implementación original de 1995 que quedó por compatibilidad
            hacia atrás.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="tdz.js"
            codigo={`console.log(a); // undefined (hoisting de var)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;`}
          />
          <BloqueCodigo
            titulo="coercion-rara.js"
            codigo={`[] + []       // ""
[] + {}       // "[object Object]"
{} + []       // 0 — en top-level, {} se parsea como bloque, no objeto
[1,2] + [3,4] // "1,23,4"`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que let/const no sufren hoisting.
            </strong>{" "}
            Sí lo sufren — la diferencia con var es que no se inicializan,
            quedan en TDZ hasta su declaración.
          </li>
          <li>
            <strong className="text-foreground">
              Usar + para verificar si algo es un array o un objeto.
            </strong>{" "}
            El resultado depende de reglas de coerción poco intuitivas; usá
            Array.isArray() o typeof en su lugar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Diagnosticar un ReferenceError de &quot;Cannot access before
            initialization&quot; identificando que se está leyendo una
            let/const antes de su declaración en el mismo scope.
          </li>
          <li>
            Explicar en code review por qué value === null es más seguro
            que typeof value === &quot;object&quot; para detectar null.
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
