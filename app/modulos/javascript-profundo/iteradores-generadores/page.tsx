import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { GeneradorSimulador } from "@/components/modulo/GeneradorSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosGeneradores } from "@/lib/modules/iteradores/escenarios";
import { entrevistaIteradores } from "@/lib/modules/iteradores/entrevista";

const preguntasPorNivel = {
  1: entrevistaIteradores.filter((p) => p.nivel === 1),
  2: entrevistaIteradores.filter((p) => p.nivel === 2),
  3: entrevistaIteradores.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Iteradores y Generadores — Dev Study Lab",
  description:
    "El protocolo que hace que for...of, spread y destructuring funcionen con cualquier objeto, y cómo function* simplifica escribirlo a mano.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué necesita implementar un objeto para ser iterable?",
    opciones: [
      "Un método llamado iterate()",
      "El método Symbol.iterator, que devuelve un iterator con .next()",
      "Heredar de Array",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "for...of, spread y destructuring usan este protocolo por debajo. No son casos especiales para arrays: funcionan con cualquier objeto que implemente Symbol.iterator.",
  },
  {
    pregunta: "¿Qué devuelve llamar a una función generadora (function*)?",
    opciones: [
      "Ejecuta el cuerpo completo inmediatamente y devuelve el resultado final",
      "Un objeto iterator pausado antes de la primera línea, listo para avanzar con .next()",
      "undefined hasta que se le haga await",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Llamar a una función generadora NO ejecuta su cuerpo. Recién avanza cuando se llama a .next(), y se pausa en cada yield.",
  },
  {
    pregunta: "Después de que un generador termina (done: true), ¿qué devuelve una llamada extra a .next()?",
    opciones: [
      "Vuelve a ejecutar el generador desde el principio",
      "Siempre { value: undefined, done: true }",
      "Lanza un error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un generador (o iterator) ya agotado no se reinicia solo. Cualquier llamada posterior a .next() devuelve consistentemente done: true.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué pasa si hacés Array.from() sobre un generador que representa una secuencia infinita?",
    opciones: [
      "Devuelve un array vacío inmediatamente",
      "El proceso se cuelga: Array.from agota el iterable llamando a .next() hasta done: true, que nunca llega",
      "JavaScript detecta la secuencia infinita y lanza un error controlado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un generador infinito debe consumirse con un límite explícito (un break en for...of, o tomar N valores manualmente), nunca materializarse entero con Array.from o spread.",
  },
  {
    pregunta:
      "¿Qué hace yield* que un loop manual con yield uno por uno no garantiza?",
    opciones: [
      "Es solo una forma más corta de escribir lo mismo, sin diferencia funcional",
      "Reenvía correctamente next(valor), throw() y return() al generador delegado, además de iterar sus valores",
      "Convierte el generador delegado en síncrono",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un loop manual que reemite valores con yield no reenvía automáticamente llamadas a throw()/return() al generador delegado — yield* sí lo hace, siendo la forma correcta de componer generadores.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Un for...of sobre un generador se corta con un break. Si el generador tiene un try/finally, ¿corre el finally?",
    opciones: [
      "No, el finally solo corre si el generador llega a completarse solo",
      "Sí: el break invoca automáticamente a gen.return(), que fuerza al generador a ejecutar el finally pendiente",
      "Solo si se llama a gen.return() explícitamente en el código",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El motor llama a .return() del iterator cuando un for...of se corta antes de tiempo. En un generador, eso dispara el finally pendiente, permitiendo cleanup.",
  },
  {
    pregunta:
      "¿En qué se diferencia el .next() de un async iterator del de un iterator síncrono?",
    opciones: [
      "No hay diferencia, ambos devuelven {value, done} directamente",
      "El de un async iterator devuelve una Promise que resuelve a {value, done}, porque producir el siguiente valor puede ser asincrónico",
      "Un async iterator no tiene método next()",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Symbol.asyncIterator define un .next() que devuelve una Promise. for await...of consume ese protocolo esperando cada Promise antes de continuar.",
  },
];

export default function IteradoresGeneradoresPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Iteradores y Generadores"
      descripcion="El protocolo que hace que for...of, spread y destructuring funcionen con cualquier objeto — y function*, la forma moderna de implementarlo sin escribir el estado a mano."
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
            Un objeto es <strong className="text-foreground">iterable</strong>{" "}
            si implementa <code>Symbol.iterator</code>, un método que debe
            devolver un <strong className="text-foreground">iterator</strong>:
            un objeto con <code>.next()</code> que devuelve{" "}
            <code>{"{ value, done }"}</code>. <code>for...of</code>, el
            spread (<code>...</code>) y el destructuring de arrays usan
            este protocolo por debajo — funcionan con cualquier objeto que
            lo implemente, no solo con arrays.
          </p>
          <p>
            Un <strong className="text-foreground">generador</strong> (
            <code>function*</code>) es la forma moderna de crear un
            iterator sin escribir el estado a mano: cada{" "}
            <code>yield</code> pausa la función y produce un valor, y la
            siguiente llamada a <code>.next()</code> la reanuda justo
            donde quedó, con todo su estado local intacto.
          </p>
          <p>
            Array, String, Map, Set y muchos objetos del DOM (como{" "}
            <code>NodeList</code>) ya implementan{" "}
            <code>Symbol.iterator</code> — por eso funcionan con{" "}
            <code>for...of</code> aunque no todos tengan métodos como{" "}
            <code>.map()</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <GeneradorSimulador escenarios={escenariosGeneradores} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Confundir un iterable con un array.
            </strong>{" "}
            Un Set, un Map o un generador son iterables, pero no tienen
            .map()/.filter() directamente — hay que convertirlos primero
            con Array.from() o spread.
          </li>
          <li>
            <strong className="text-foreground">
              Reusar un iterator ya agotado esperando que se reinicie.
            </strong>{" "}
            Una vez que devuelve done: true, sigue devolviendo done: true
            para siempre. Hace falta un iterator nuevo (llamando de nuevo a
            Symbol.iterator, o a la función generadora).
          </li>
          <li>
            <strong className="text-foreground">
              Usar for...in para iterar valores.
            </strong>{" "}
            for...in itera claves enumerables (incluidas heredadas), no
            está pensado para recorrer valores de un iterable — para eso
            es for...of.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Implementar Symbol.iterator en una clase propia (por ejemplo,
            un Rango) para que funcione con for...of y spread de forma
            nativa.
          </li>
          <li>
            Usar un generador para simplificar la creación de un iterator,
            evitando escribir manualmente el objeto con .next() y su
            estado en variables de closure.
          </li>
          <li>
            Tomar los primeros N elementos de cualquier iterable con
            destructuring: <code>const [primero, segundo] = iterable</code>.
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
          <p>
            ¿Por qué el segundo for...of de este código no imprime nada?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function* numeros() {
  yield 1;
  yield 2;
}

const gen = numeros();

for (const n of gen) {
  console.log(n);
}

for (const n of gen) {
  console.log(n);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El primer for...of imprime{" "}
              <strong className="text-foreground">1 y 2</strong>, y el
              segundo <strong className="text-foreground">no imprime nada</strong>.
            </p>
            <p className="mt-2">
              <code>gen</code> es un único iterator, ya agotado por el
              primer for...of (que lo consumió hasta done: true). Un
              generador no se reinicia solo — para volver a iterar los
              valores hace falta llamar de nuevo a{" "}
              <code>numeros()</code> y obtener un iterator nuevo.
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
            Los generadores son{" "}
            <strong className="text-foreground">lazy</strong>: no calculan
            ningún valor hasta que se lo piden explícitamente con{" "}
            <code>.next()</code>. Esto permite representar secuencias
            infinitas o muy costosas de calcular completas sin el
            problema de memoria que tendría construir un array con todos
            los valores de una — el costo se paga de a un valor por vez.
          </p>
          <p>
            <code>yield*</code> delega la iteración a otro iterable (otro
            generador, un array): en vez de un loop manual que reemite
            cada valor, reenvía automáticamente cada valor Y las llamadas
            a <code>.next(valor)</code>, <code>.throw()</code> y{" "}
            <code>.return()</code> al generador delegado — algo que un
            loop manual reimplementaría mal o incompleto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Materializar un generador infinito con Array.from o spread.
            </strong>{" "}
            Ambos agotan el iterable llamando a .next() hasta done: true,
            que en una secuencia infinita nunca llega — el proceso se
            cuelga.
          </li>
          <li>
            <strong className="text-foreground">
              Reimplementar la delegación con un loop manual en vez de
              yield*.
            </strong>{" "}
            Pierde el reenvío correcto de throw()/return() al generador
            delegado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Generar secuencias infinitas o muy grandes de forma perezosa
            (ids, fechas, paginación) sin materializar todo en memoria de
            una.
          </li>
          <li>
            Componer generadores con yield* para pipelines de
            transformación de datos lazy (map/filter que solo procesan lo
            que realmente se consume).
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
            Cuando un <code>for...of</code> se corta antes de tiempo (
            <code>break</code>, <code>return</code>, una excepción dentro
            del loop), el motor llama automáticamente al método{" "}
            <code>.return()</code> del iterator, si lo implementa. Un
            generador ya lo implementa por vos: si tiene un{" "}
            <code>try/finally</code> alrededor del cuerpo, ese finally
            corre igual, porque internamente el break invoca{" "}
            <code>gen.return()</code>.
          </p>
          <p>
            <code>gen.throw(error)</code> inyecta una excepción
            exactamente en el punto donde el generador está pausado (en el{" "}
            <code>yield</code> actual). Si hay un <code>try/catch</code>{" "}
            alrededor de ese yield, lo captura normalmente — es la forma
            de propagar cancelación o errores &quot;hacia adentro&quot; de
            un generador desde el código que lo consume.
          </p>
          <p>
            Un <strong className="text-foreground">async iterator</strong>{" "}
            implementa <code>Symbol.asyncIterator</code>, cuyo{" "}
            <code>.next()</code> devuelve una <code>Promise</code> que
            resuelve a <code>{"{ value, done }"}</code>, porque producir
            el siguiente valor puede ser asincrónico.{" "}
            <code>for await...of</code> consume ese protocolo esperando
            cada Promise. Un <code>async function*</code> combina{" "}
            <code>await</code> y <code>yield</code>, armando ese objeto
            automáticamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Implementar un iterator custom sin .return().
            </strong>{" "}
            Si un for...of se corta antes de tiempo, ese iterator no tiene
            oportunidad de liberar recursos (cerrar un archivo, cancelar
            un timer).
          </li>
          <li>
            <strong className="text-foreground">
              Confundir gen.throw() con lanzar un error fuera del
              generador.
            </strong>{" "}
            gen.throw() inyecta la excepción DENTRO del generador, en el
            punto de pausa — es capturable con try/catch en su cuerpo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Usar try/finally dentro de un generador para garantizar
            cleanup (cerrar una conexión) incluso si el consumidor corta
            la iteración con un break.
          </li>
          <li>
            Consumir un stream o una API paginada con un async generator y{" "}
            <code>for await...of</code>, procesando cada chunk a medida
            que llega sin cargar todo en memoria.
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
