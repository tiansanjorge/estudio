import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HoistingSimulador } from "@/components/modulo/HoistingSimulador";
import { HoistingExplorador } from "@/components/modulo/HoistingExplorador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosHoisting } from "@/lib/modules/hoisting/escenarios";
import { casosHoisting } from "@/lib/modules/hoisting/casos";

export const metadata: Metadata = {
  title: "Hoisting — Frontend Study Lab",
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

export default function HoistingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Hoisting"
      descripcion="Antes de correr la primera línea de un scope, JS ya escaneó ese scope entero y registró sus declaraciones en memoria. Eso es hoisting — y el comportamiento cambia según cómo declaraste la variable."
    >
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
    </ModuloLayout>
  );
}
