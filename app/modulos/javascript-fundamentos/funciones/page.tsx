import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaFunciones } from "@/lib/modules/javascript-fundamentos/funciones-entrevista";

const preguntasPorNivel = {
  1: entrevistaFunciones.filter((p) => p.nivel === 1),
  2: entrevistaFunciones.filter((p) => p.nivel === 2),
  3: entrevistaFunciones.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Funciones — Dev Study Lab",
  description:
    "Declaración vs expresión vs arrow, parámetros por defecto y rest, this, call/apply/bind: cómo se definen y se invocan las funciones.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia de hoisting hay entre function declaration y function expression?",
    opciones: [
      "La declaration se puede llamar antes de su línea; la expression no, porque la variable queda undefined hasta la asignación",
      "Ninguna: ambas se pueden llamar antes de su línea sin problema",
      "La expression se puede llamar antes; la declaration lanza un error si se llama antes de su línea",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "function saludar() {} sufre hoisting completo. const saludar = function() {} solo hace hoisting de la variable (queda undefined), no de la asignación.",
  },
  {
    pregunta: "¿Qué hace sumarTodo(1, 2, 3) con function sumarTodo(primero, ...resto)?",
    opciones: [
      "primero vale 1, y resto es el array [2, 3]",
      "primero vale 1, y resto es el objeto arguments completo",
      "Lanza un error: no se puede combinar un parámetro nombrado con rest",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El rest parameter junta todos los argumentos que no tienen un parámetro nombrado propio, como un array real.",
  },
  {
    pregunta: "¿Qué distingue principalmente a una arrow function de una función regular?",
    opciones: [
      "No tiene su propio this ni arguments: los toma del scope donde fue definida",
      "No puede recibir parámetros con valores por defecto",
      "Siempre debe escribirse en una sola línea, sin llaves",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las arrow functions heredan this y arguments léxicamente, como si fueran variables normales del scope que las contiene.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Dentro de un método de objeto, ¿por qué conviene una arrow function como callback de setTimeout?",
    opciones: [
      "Porque hereda el this del método, en vez de tener el suyo propio (undefined o global)",
      "Porque las arrow functions ejecutan setTimeout de forma síncrona",
      "Porque solo las arrow functions pueden recibir un delay como segundo argumento",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Una función regular pasada a setTimeout tiene su propio this (no el del objeto). La arrow hereda el this del método que la contiene.",
  },
  {
    pregunta: "¿Qué diferencia hay entre .call() y .apply()?",
    opciones: [
      "call recibe los argumentos uno por uno; apply los recibe como un array",
      "call fija el this para siempre; apply solo lo fija para esa llamada",
      "apply ejecuta la función de forma asincrónica; call la ejecuta sincrónicamente",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Ambos invocan la función inmediatamente con un this explícito; la única diferencia real es la forma de pasar los argumentos.",
  },
  {
    pregunta: "¿Qué devuelve fn.bind(objeto) sin llamarla?",
    opciones: [
      "Una nueva función con ese this fijado, lista para ejecutarse después",
      "El resultado de ejecutar fn con ese this inmediatamente",
      "Un error: bind necesita también los argumentos para funcionar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "A diferencia de call/apply, bind no ejecuta la función: devuelve una nueva función con this (y opcionalmente argumentos) ya fijados.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa si usás arguments dentro de una arrow function?",
    opciones: [
      "Resuelve al arguments de la función regular más cercana que la contiene (o da error si no hay ninguna)",
      "Funciona igual que en una función regular: refleja los argumentos de la arrow",
      "Siempre devuelve un array vacío, porque las arrow no reciben argumentos posicionales",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las arrow functions no tienen su propio arguments: al usarlo, JavaScript busca uno en el scope léxico exterior, como con this.",
  },
  {
    pregunta: "¿Qué ventaja da nombrar una function expression asignada a una variable?",
    opciones: [
      "El nombre queda disponible dentro del cuerpo para recursión estable, aunque la variable externa se reasigne",
      "El nombre reemplaza automáticamente a la variable en todo el scope exterior",
      "Permite que la función se ejecute antes de la línea donde se define, como una declaration",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El nombre interno es estable frente a reasignaciones de la variable externa, y además mejora los stack traces al debuggear.",
  },
  {
    pregunta: "¿Qué diferencia hay entre arguments y un rest parameter?",
    opciones: [
      "arguments es array-like (sin métodos de Array); el rest parameter es un array real",
      "Son exactamente lo mismo, solo cambia la sintaxis para declararlos",
      "arguments incluye el valor de this; el rest parameter nunca lo incluye",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "arguments tiene length e índices pero no .map/.filter/etc. El rest parameter es un Array real con todos sus métodos disponibles.",
  },
];

export default function FuncionesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Funciones"
      descripcion="Declaración vs expresión vs arrow, parámetros y this: cómo JavaScript define, invoca y liga el contexto de una función."
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
            Hay tres formas de definir una función.{" "}
            <strong className="text-foreground">function declaration</strong>{" "}
            (<code>function saludar() {"{}"}</code>) sufre hoisting
            completo: se puede llamar antes de su línea.{" "}
            <strong className="text-foreground">function expression</strong>{" "}
            (<code>const saludar = function() {"{}"}</code>) es una función
            asignada a una variable, y solo existe después de esa línea.{" "}
            <strong className="text-foreground">Arrow function</strong> (
            <code>const saludar = () =&gt; {"{}"}</code>) es sintaxis corta
            sin su propio <code>this</code> ni <code>arguments</code>.
          </p>
          <p>
            Los parámetros pueden tener un{" "}
            <strong className="text-foreground">valor por defecto</strong> (
            <code>function f(x = 10)</code>), que se usa cuando no se pasa
            ese argumento. El{" "}
            <strong className="text-foreground">rest parameter</strong> (
            <code>function f(...args)</code>) junta todos los argumentos
            restantes en un array real.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="hoisting-de-funciones.js"
            codigo={`saludar(); // funciona: hoisting completo
function saludar() { console.log("hola"); }

decir(); // TypeError: decir is not a function
var decir = function () { console.log("hola"); };`}
          />
          <BloqueCodigo
            titulo="parametros.js"
            codigo={`function sumarTodo(primero = 0, ...resto) {
  return resto.reduce((acc, n) => acc + n, primero);
}

sumarTodo();          // 0
sumarTodo(1, 2, 3);   // 6 (primero=1, resto=[2,3])`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que toda función sufre hoisting completo.
            </strong>{" "}
            Solo las function declarations lo hacen. Una function
            expression o arrow asignada a const/let no se puede usar antes
            de su línea.
          </li>
          <li>
            <strong className="text-foreground">
              Usar una arrow function como método de un objeto.
            </strong>{" "}
            Como no tiene this propio, this dentro de una arrow definida
            directamente en el objeto literal no apunta al objeto — apunta
            al scope exterior.
          </li>
          <li>
            <strong className="text-foreground">
              Declarar parámetros por defecto después de uno sin default.
            </strong>{" "}
            function f(a = 1, b) funciona, pero si se llama f(undefined, 2)
            el orden importa: solo undefined activa el default, no omitir
            el argumento sin más.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar function declarations para funciones &quot;de nivel superior&quot;
            que se quieren poder llamar antes en el archivo por
            legibilidad (por ejemplo, un helper usado varias veces).
          </li>
          <li>
            Usar rest parameters para funciones con cantidad variable de
            argumentos (sumar(...numeros)), en vez de pedir un array
            explícito.
          </li>
          <li>
            Preferir arrow functions para callbacks cortos (.map, .filter,
            event handlers) donde no se necesita this propio.
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
{`const persona = {
  nombre: "Ana",
  saludarRegular: function () {
    return \`Hola, soy \${this.nombre}\`;
  },
  saludarFlecha: () => {
    return \`Hola, soy \${this.nombre}\`;
  },
};

console.log(persona.saludarRegular());
console.log(persona.saludarFlecha());`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime{" "}
              <strong className="text-foreground">
                &quot;Hola, soy Ana&quot;
              </strong>{" "}
              y después{" "}
              <strong className="text-foreground">
                &quot;Hola, soy undefined&quot;
              </strong>
              .
            </p>
            <p className="mt-2">
              saludarRegular es una función regular: this se determina al
              llamarla como método (persona.saludarRegular()), así que
              apunta a persona. saludarFlecha es una arrow function
              definida directamente en el objeto literal: no tiene this
              propio, así que hereda el this del scope exterior (en este
              contexto, no es persona), y persona.nombre ahí es undefined.
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
            Una función regular tiene su propio <code>this</code>,
            determinado en el momento en que se la <em>llama</em> (no donde
            se define). Una arrow function no tiene this propio: lo hereda
            léxicamente del scope donde fue definida. Por eso las arrow
            functions son ideales como callbacks dentro de un método, para
            no perder la referencia al objeto contenedor.
          </p>
          <p>
            <code>call</code>, <code>apply</code> y <code>bind</code>{" "}
            sirven para invocar una función con un <code>this</code>{" "}
            explícito. <code>call</code>/<code>apply</code> ejecutan
            inmediatamente (difieren solo en cómo reciben los argumentos);{" "}
            <code>bind</code> no ejecuta, devuelve una función nueva con
            ese this fijado para siempre.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="this-en-callback.js"
            codigo={`const contador = {
  valor: 0,
  incrementar() {
    setTimeout(function () {
      this.valor++; // this acá NO es contador
    }, 100);
    setTimeout(() => {
      this.valor++; // this acá SÍ es contador (heredado)
    }, 100);
  },
};`}
          />
          <BloqueCodigo
            titulo="call-apply-bind.js"
            codigo={`function saludar(saludo) {
  return \`\${saludo}, \${this.nombre}\`;
}
const persona = { nombre: "Ana" };

saludar.call(persona, "Hola");     // "Hola, Ana" — ejecuta ya
saludar.apply(persona, ["Hola"]);  // "Hola, Ana" — args como array
const saludarAna = saludar.bind(persona);
saludarAna("Hola");                // "Hola, Ana" — ejecuta después`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pasar un método como callback sin bind ni arrow.
            </strong>{" "}
            boton.addEventListener(&apos;click&apos;, objeto.metodo) pierde el this
            de objeto: adentro, this apunta al elemento del DOM, no al
            objeto original.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir call/apply (ejecutan ya) con bind (ejecuta
              después).
            </strong>{" "}
            Usar bind cuando se necesita el resultado inmediato deja una
            función sin invocar, no el valor esperado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar .bind(this) en el constructor de una clase (o arrow
            functions como class fields) para que los métodos pasados como
            callback conserven el this de la instancia.
          </li>
          <li>
            Usar Function.prototype.apply para pasar un array como lista
            de argumentos a una función que espera argumentos posicionales
            (hoy en general reemplazado por el spread operator).
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
            <code>arguments</code> es un objeto array-like (tiene{" "}
            <code>length</code> e índices, pero no métodos de Array como{" "}
            <code>map</code>) y no existe dentro de arrow functions — ahí
            resuelve al <code>arguments</code> de la función regular más
            cercana que la contiene. El{" "}
            <strong className="text-foreground">rest parameter</strong> es
            un array real y sí funciona en arrow functions, porque es solo
            sintaxis de parámetros.
          </p>
          <p>
            Nombrar una function expression (
            <code>const f = function nombre() {"{}"}</code>) deja ese
            nombre disponible <em>dentro</em> del cuerpo para recursión
            estable, sin depender de la variable externa — que podría
            reasignarse después. También mejora los stack traces al
            debuggear.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="arguments-vs-rest.js"
            codigo={`function normal() {
  console.log(arguments.length); // funciona
}

const flecha = () => {
  console.log(arguments); // ReferenceError sin función regular contenedora
};`}
          />
          <BloqueCodigo
            titulo="funcion-nombrada.js"
            codigo={`let factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // "fact" es estable
};
const otraRef = factorial;
factorial = null;
console.log(otraRef(5)); // 120 — sigue funcionando`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Intentar usar métodos de array sobre arguments directamente.
            </strong>{" "}
            arguments.map no existe. Hace falta convertirlo primero
            (Array.from(arguments) o [...arguments]), o usar un rest
            parameter desde el inicio.
          </li>
          <li>
            <strong className="text-foreground">
              Recursión indirecta por el nombre de la variable externa.
            </strong>{" "}
            Si esa variable se reasigna antes de que termine la recursión,
            una llamada por el nombre externo (no el interno) puede fallar
            o comportarse distinto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Nombrar function expressions largas o recursivas en código de
            librería, donde el stack trace con nombre facilita mucho el
            debugging en producción.
          </li>
          <li>
            Migrar código legacy que usa arguments a rest parameters al
            tocarlo, para poder usar métodos de array directamente sin
            conversión previa.
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
