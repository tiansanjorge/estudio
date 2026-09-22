import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HoistingSimulador } from "@/components/modulo/HoistingSimulador";
import { HoistingExplorador } from "@/components/modulo/HoistingExplorador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosHoisting } from "@/lib/modules/hoisting/escenarios";
import { casosHoisting } from "@/lib/modules/hoisting/casos";
import { entrevistaHoisting } from "@/lib/modules/hoisting/entrevista";

const preguntasPorNivel = {
  1: entrevistaHoisting.filter((p) => p.nivel === 1),
  2: entrevistaHoisting.filter((p) => p.nivel === 2),
  3: entrevistaHoisting.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Hoisting — Dev Study Lab",
  description:
    "Antes de ejecutar una sola línea, JS ya escaneó el scope y registró declaraciones en memoria. Eso es hoisting, y no funciona igual para var, let, const y funciones.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa si accedés a una variable var antes de la línea donde se declara?",
    opciones: ["Da ReferenceError", "Devuelve undefined, sin error", "Devuelve null"],
    respuestaCorrecta: 1,
    explicacion:
      "var se hoistea con valor undefined desde la fase de creación. Leerla antes de su asignación no da error, solo undefined.",
  },
  {
    pregunta: "¿Qué pasa si accedés a una variable let antes de la línea donde se declara?",
    opciones: ["Devuelve undefined", "ReferenceError, por la Temporal Dead Zone", "Devuelve el valor por defecto del tipo"],
    respuestaCorrecta: 1,
    explicacion:
      "let (y const) se hoistean, pero quedan en la TDZ: no tienen un valor accesible hasta que se ejecuta su línea de declaración.",
  },
  {
    pregunta: "¿Se puede llamar a una function declaration antes de la línea donde está escrita?",
    opciones: ["No, nunca", "Sí, porque se hoistea completa con su cuerpo incluido", "Solo si es una arrow function"],
    respuestaCorrecta: 1,
    explicacion:
      "A diferencia de var/let/const, una function declaration se hoistea entera — el motor ya tiene la función completa disponible desde la fase de creación.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Una class declaration se puede usar antes de su línea, igual que una function declaration?",
    opciones: [
      "Sí, las clases se hoistean completas igual que las funciones",
      "No: se hoistea pero queda en la Temporal Dead Zone, como let/const",
      "No se hoistea en absoluto",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Aunque sintácticamente se parece a una function declaration, para hoisting una clase sigue las reglas de let/const: usarla antes de su línea lanza ReferenceError.",
  },
  {
    pregunta:
      "¿Por qué reglas de lint como no-use-before-define prohíben confiar en el hoisting de funciones?",
    opciones: [
      "Porque el hoisting de funciones no funciona en todos los navegadores",
      "Es una regla de legibilidad: hace que el código se lea en el mismo orden en que se ejecuta, y evita bugs si la función se reemplaza por una const con arrow function",
      "Porque las function declarations están deprecadas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "No es un problema de corrección técnica sino de mantenibilidad: forzar declarar-antes-de-usar evita saltos hacia adelante en el archivo y protege contra un futuro refactor a arrow function, que sí tiene TDZ.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "function f(a = b, b) {} — ¿qué pasa al llamar a f()?",
    opciones: [
      "Funciona normalmente, b es undefined",
      "Lanza ReferenceError, porque b todavía está en la TDZ del scope de parámetros cuando se evalúa el default de a",
      "a queda como undefined silenciosamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los parámetros se inicializan en orden de izquierda a derecha en su propio scope. Un default puede usar un parámetro anterior ya inicializado, pero no uno posterior, que todavía está en TDZ.",
  },
  {
    pregunta:
      "¿Cuándo se evalúa la cláusula extends de una clase?",
    opciones: [
      "Recién cuando se hace new de la clase",
      "Inmediatamente cuando se ejecuta la declaración de la clase",
      "Nunca se evalúa si la clase no se instancia",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso class B extends A {} lanza ReferenceError en ese momento si A todavía está en su propia TDZ, no cuando se hace new B().",
  },
];

export default function HoistingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Hoisting"
      descripcion="Antes de correr la primera línea de un scope, JS ya escaneó ese scope entero y registró sus declaraciones en memoria. Eso es hoisting — y el comportamiento cambia según cómo declaraste la variable."
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            La ejecución de un scope tiene dos fases.{" "}
            <strong className="text-foreground">Fase de creación</strong>:
            antes de correr cualquier línea, JS escanea todo el scope y
            registra sus declaraciones en memoria.{" "}
            <strong className="text-foreground">Fase de ejecución</strong>:
            recién ahí corre el código línea por línea. &ldquo;Hoisting&rdquo;
            es el nombre que le damos a ese registro previo — el código no
            se mueve físicamente, solo se procesa antes de ejecutarse.
          </p>
          <p>
            Lo que se guarda en esa fase de creación depende de cómo
            declaraste algo:{" "}
            <code>var</code> queda registrada con valor{" "}
            <strong className="text-foreground">undefined</strong> hasta
            que corre su línea de asignación.{" "}
            <code>let</code> y <code>const</code> también se registran,
            pero quedan en un estado inaccesible llamado{" "}
            <strong className="text-foreground">
              Temporal Dead Zone (TDZ)
            </strong>{" "}
            — leerlas antes de su línea tira un{" "}
            <code>ReferenceError</code>, no undefined. Una{" "}
            <em>function declaration</em> se registra{" "}
            <strong className="text-foreground">completa</strong>, con su
            cuerpo incluido, así que se puede llamar antes de la línea
            donde está escrita.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <HoistingSimulador escenarios={escenariosHoisting} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Elegí una forma de declarar x y mirá qué pasa si la usás ANTES de
          esa línea.
        </p>
        <HoistingExplorador casos={casosHoisting} />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Pensar que hoisting mueve el código arriba.
            </strong>{" "}
            No mueve nada. Solo registra las declaraciones en memoria
            durante la fase de creación; la posición del código en el
            archivo no cambia.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar undefined de una let/const no inicializada.
            </strong>{" "}
            A diferencia de var, da ReferenceError por la TDZ — un error
            real, no un valor &ldquo;vacío&rdquo;.
          </li>
          <li>
            <strong className="text-foreground">
              Confiar en que una función asignada a una variable se comporta como function declaration.
            </strong>{" "}
            <code>const saludar = () =&gt; {"{}"}</code> sigue las reglas
            de const (TDZ), no las de una function declaration.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Diagnosticar un &ldquo;Cannot access X before initialization&rdquo;
            reconociendo que es la TDZ, no un bug misterioso.
          </li>
          <li>
            Entender por qué algunos linters exigen declarar funciones
            auxiliares antes de usarlas, aunque el hoisting técnicamente
            lo permita — es una regla de legibilidad, no de necesidad.
          </li>
          <li>
            Elegir function declarations para funciones que necesitás
            poder referenciar antes de su definición en el archivo (por
            ejemplo, handlers organizados al final del módulo).
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>¿Qué imprime esto, y por qué no da &ldquo;undefined&rdquo;?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`console.log(typeof saludar);

var saludar = 'hola';

function saludar() {
  return 'hey';
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">&apos;function&apos;</strong>.
            </p>
            <p className="mt-2">
              En la fase de creación, tanto <code>var saludar</code> como{" "}
              <code>function saludar() {"{}"}</code> se registran en el
              mismo scope. Las function declarations tienen prioridad: se
              hoistean con su cuerpo completo, y el registro de{" "}
              <code>var saludar</code> (que técnicamente también ocurre)
              no la pisa durante esta fase — solo la pisaría la{" "}
              <em>asignación</em> <code>{"saludar = 'hola'"}</code>, que
              todavía no corrió en la línea del console.log. Por eso{" "}
              <code>saludar</code> sigue siendo la función en ese punto.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Una <strong className="text-foreground">class declaration</strong>{" "}
            se hoistea, pero con las reglas de <code>let</code>/
            <code>const</code>, no las de function: queda registrada en
            memoria pero en la TDZ hasta que se ejecuta su línea. Usarla o
            extenderla antes lanza <code>ReferenceError</code> — a
            diferencia de una function declaration, que se puede llamar
            libremente antes de su definición.
          </p>
          <p>
            Los <strong className="text-foreground">imports</strong> de un
            módulo ES también se hoistean al tope del archivo: el grafo de
            módulos se resuelve y sus bindings se registran antes de
            ejecutar el cuerpo de cualquiera. Los named imports son{" "}
            <em>live bindings</em> (referencias en vivo, no copias del
            valor), lo que hace que dependencias circulares entre módulos
            funcionen en muchos casos, siempre que el valor importado se
            use recién dentro de una función y no en el nivel superior del
            módulo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Asumir que una clase se comporta como una function
              declaration para hoisting.
            </strong>{" "}
            Sintácticamente se parecen, pero la clase tiene TDZ igual que
            let/const.
          </li>
          <li>
            <strong className="text-foreground">
              Usar un valor importado directamente en el nivel superior de
              un módulo con dependencia circular.
            </strong>{" "}
            Aunque los named imports sean live bindings, si el módulo
            exportador todavía no llegó a esa asignación, el valor no está
            disponible en ese punto del nivel superior.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Diagnosticar un &quot;Cannot access &apos;X&apos; before
            initialization&quot; en una clase revisando el orden de
            declaración/importación, igual que con let/const.
          </li>
          <li>
            Configurar no-use-before-define en el linter para forzar
            declarar-antes-de-usar como norma de legibilidad, más allá de
            lo que el hoisting técnicamente permita.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Los parámetros de una función viven en su propio scope,
            intermedio entre el externo y el cuerpo de la función, y se
            inicializan de izquierda a derecha. Un valor por defecto puede
            usar un parámetro anterior ya inicializado (
            <code>function f(a, b = a) {"{}"}</code> funciona), pero no uno
            posterior: <code>function f(a = b, b) {"{}"}</code> lanza{" "}
            <code>ReferenceError</code>, porque <code>b</code> todavía está
            en la TDZ de ese scope de parámetros cuando se evalúa el
            default de <code>a</code>.
          </p>
          <p>
            La cláusula <code>extends</code> de una clase se evalúa
            inmediatamente cuando se ejecuta la declaración de la clase, no
            cuando se instancia. <code>class B extends A {"{}"}</code>{" "}
            lanza ReferenceError en ese mismo momento si <code>A</code>{" "}
            todavía está en su propia TDZ.
          </p>
          <p>
            Una function declaration dentro de un bloque se hoistea distinto
            según el modo: en strict mode queda block-scoped, como un let.
            En modo no estricto, además se asigna como var en el scope
            contenedor (comportamiento legacy &ldquo;Annex B&rdquo;),
            visible incluso fuera del bloque una vez que este corre — el
            mismo código puede comportarse distinto entre motores o modos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Referenciar un parámetro posterior en el default de uno
              anterior.
            </strong>{" "}
            El scope de parámetros respeta TDZ igual que let/const, en
            orden de izquierda a derecha.
          </li>
          <li>
            <strong className="text-foreground">
              Confiar en el comportamiento Annex B de function declarations
              en bloques.
            </strong>{" "}
            Varía entre strict y sloppy mode, y entre motores — mejor
            evitarlo directamente con function expressions asignadas a
            let/const.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Diagnosticar un ReferenceError en la declaración de una clase
            (no en su instanciación) como un problema de orden de
            declaración o dependencia circular entre módulos.
          </li>
          <li>
            Evitar function declarations sueltas dentro de if/for en código
            que deba comportarse igual en Node y en el navegador.
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
