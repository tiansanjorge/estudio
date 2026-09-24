import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ClosureSimulador } from "@/components/modulo/ClosureSimulador";
import { FabricaDeContadores } from "@/components/modulo/FabricaDeContadores";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosClosures } from "@/lib/modules/closures/escenarios";
import { entrevistaClosures } from "@/lib/modules/closures/entrevista";

const preguntasPorNivel = {
  1: entrevistaClosures.filter((p) => p.nivel === 1),
  2: entrevistaClosures.filter((p) => p.nivel === 2),
  3: entrevistaClosures.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Closures — Dev Study Lab",
  description:
    "Cómo una función retiene acceso a las variables de su scope léxico, incluso después de que la función que la creó ya terminó.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es una closure?",
    opciones: [
      "Una función que se ejecuta sola sin ser llamada",
      "Una función que retiene acceso al scope donde fue creada, incluso después de que esa función externa ya retornó",
      "Un tipo de bucle en JavaScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La función interna 'cierra' sobre las variables de su scope léxico. Esas variables siguen vivas mientras la closure exista, aunque la función que las creó ya haya terminado de ejecutarse.",
  },
  {
    pregunta:
      "En el bug clásico de var dentro de un for con setTimeout, ¿por qué los 3 callbacks imprimen el mismo número?",
    opciones: [
      "Porque setTimeout siempre imprime el último valor",
      "Porque var crea una sola variable compartida por todas las vueltas del loop, y los timeouts corren después de que el loop ya terminó",
      "Porque hay un error de sintaxis",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "var es function-scoped, no block-scoped: hay una única i para todo el loop. Los timeouts se ejecutan como macrotasks, después de que el código síncrono (todo el loop) ya terminó y dejó i en su valor final.",
  },
  {
    pregunta:
      "Dos llamadas a la misma función factory (que retorna una closure) — ¿comparten el estado que capturan?",
    opciones: [
      "Sí, siempre comparten las mismas variables",
      "No, cada llamada crea un scope nuevo e independiente",
      "Depende de si se usa let o const",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada invocación de la función factory ejecuta el cuerpo de nuevo, creando un scope propio. Las closures que devuelve cada llamada capturan scopes distintos, sin importar que compartan el mismo código.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué las closures suelen pesar más en memoria que los métodos de una clase, a escala?",
    opciones: [
      "Porque las closures son más lentas de ejecutar",
      "Porque cada llamada a la función factory crea una copia nueva de los métodos internos, mientras que los métodos de una clase se comparten en el prototipo",
      "Porque las closures no se pueden recolectar por el garbage collector",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los métodos de una clase viven una sola vez en el prototipo y se comparten entre instancias. Con closures, cada invocación de la factory function define funciones internas nuevas, así que se duplican por instancia.",
  },
  {
    pregunta:
      "¿Qué reemplazó al module pattern (IIFE + closures) para encapsular código y evitar el scope global?",
    opciones: [
      "Los Web Workers",
      "Los ES Modules, que dan scope por archivo de forma nativa",
      "Las arrow functions",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los ES Modules le dan a cada archivo su propio scope sin necesidad de envolver el código en una IIFE, además de mejor soporte de tooling (tree-shaking, imports estáticos).",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Si dos closures distintas comparten el mismo scope léxico (están definidas dentro de la misma función), ¿qué pasa si solo una de ellas usa una variable pesada?",
    opciones: [
      "Solo esa closure retiene la variable, la otra no se ve afectada",
      "Ambas comparten el mismo contexto interno, así que la variable queda retenida mientras cualquiera de las dos exista",
      "V8 elimina la variable automáticamente si detecta que no se usa en ambas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Funciones que comparten scope léxico comparten el mismo 'contexto' interno en V8. Si una retiene una variable pesada, esa variable no se libera hasta que ninguna de las closures que comparten ese contexto siga viva.",
  },
  {
    pregunta:
      "En un loop con async/await usando var (no let), ¿qué valor leen las continuaciones async al resolverse?",
    opciones: [
      "El valor que tenía la variable en el momento de cada await",
      "El valor final que quedó en la variable compartida cuando el loop síncrono terminó",
      "Siempre undefined",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "var es function-scoped: todas las continuaciones comparten el mismo binding. Cuando finalmente se resuelven, leen el valor final que dejó el loop — el mismo bug clásico de var, ahora con async/await en vez de setTimeout.",
  },
];

export default function ClosuresPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Closures"
      descripcion="Una función no solo lleva su código: lleva también el scope donde nació, y puede seguir usándolo aunque ese scope 'debería' haber desaparecido."
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
            En JavaScript, cada función recuerda el{" "}
            <strong className="text-foreground">scope léxico</strong> en el
            que fue definida — el lugar en el código donde fue escrita, no
            desde dónde se la llama. Cuando una función interna usa una
            variable de una función externa y esa función interna{" "}
            <em>escapa</em> (se retorna, se guarda, se pasa como callback),
            sigue teniendo acceso a esa variable. Eso es una{" "}
            <strong className="text-foreground">closure</strong>.
          </p>
          <p>
            Lo contraintuitivo: la variable capturada normalmente
            desaparecería cuando la función externa termina de ejecutarse
            (así funciona el call stack). Pero como la closure todavía la
            necesita, el motor de JavaScript la mantiene viva en memoria
            en vez de descartarla.
          </p>
          <p>
            Cada <em>llamada</em> a la función externa crea un scope
            nuevo. Por eso dos closures generadas por la misma función no
            comparten estado entre sí — cada una tiene su propia copia de
            las variables capturadas, salvo que explícitamente compartan
            el mismo scope (por ejemplo, dos funciones internas definidas
            dentro de la misma llamada).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ClosureSimulador escenarios={escenariosClosures} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <FabricaDeContadores />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que una closure copia el valor en el momento de crearse.
            </strong>{" "}
            Captura la variable en sí (el binding), no una foto congelada.
            Si esa variable cambia después, la closure ve el valor nuevo —
            justo lo que causa el bug de var en loops.
          </li>
          <li>
            <strong className="text-foreground">
              Usar var en un loop que crea closures (event listeners, timeouts).
            </strong>{" "}
            Todas terminan compartiendo la misma variable. La solución
            moderna es simplemente usar let.
          </li>
          <li>
            <strong className="text-foreground">
              Closures que retienen referencias innecesarias a objetos grandes.
            </strong>{" "}
            Si una closure de larga vida (un listener que nunca se remueve)
            captura una variable que apunta a algo pesado, ese objeto no
            se puede liberar de memoria mientras la closure exista.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Encapsular estado privado sin usar clases: una función factory
            que retorna funciones con acceso a variables que nadie de
            afuera puede tocar directamente.
          </li>
          <li>
            Memoización: cachear el resultado de una función costosa en
            una variable capturada por la closure.
          </li>
          <li>
            Debounce y throttle: guardar el id del timer pendiente en una
            variable capturada entre llamadas sucesivas.
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
          <p>¿Qué imprime este código, y por qué duplicar y triplicar no se pisan entre sí aunque comparten el mismo código?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function crearMultiplicador(factor) {
  return function (n) {
    return n * factor;
  };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log(duplicar(5));
console.log(triplicar(5));
console.log(duplicar(10));`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">10, 15, 20</strong>.
            </p>
            <p className="mt-2">
              Cada llamada a <code>crearMultiplicador()</code> ejecuta el
              cuerpo de la función de nuevo, creando un scope propio con su
              propio <code>factor</code>. <code>duplicar</code> cierra
              sobre el scope donde <code>factor = 2</code>, y{" "}
              <code>triplicar</code> sobre uno completamente distinto donde{" "}
              <code>factor = 3</code>. Aunque el código de la función
              interna es idéntico, cada una quedó ligada a su propio scope
              — por eso no interfieren entre sí.
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
            Closures y clases con campos privados (<code>#campo</code>)
            resuelven la misma necesidad — encapsular estado — con costos
            distintos. Una función factory basada en closures crea, en cada
            llamada, funciones internas nuevas: cada instancia lleva su
            propia copia de esos métodos en memoria. Una clase define sus
            métodos una sola vez en el prototipo, compartidos por todas las
            instancias; solo los datos se duplican por instancia.
          </p>
          <p>
            El module pattern (envolver código en una IIFE para crear un
            scope propio y no ensuciar el scope global) fue durante años la
            forma de lograr encapsulación y evitar colisiones de nombres.
            Los ES Modules lo volvieron innecesario: cada archivo ya tiene
            su propio scope de forma nativa, con mejor soporte de tooling.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Elegir closures por costumbre en código con miles de
              instancias.
            </strong>{" "}
            La duplicación de métodos por instancia puede ser un costo de
            memoria real a escala; una clase comparte esos métodos en el
            prototipo.
          </li>
          <li>
            <strong className="text-foreground">
              No remover un event listener que captura una closure pesada.
            </strong>{" "}
            Mientras el listener siga vivo, la closure — y todo lo que
            capturó — no se puede liberar del heap.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Preferir closures/factory functions cuando la encapsulación
            real (no solo una convención de nombre) importa más que la
            cantidad de instancias, o en estilo funcional sin{" "}
            <code>this</code>.
          </li>
          <li>
            Currying y composición de funciones: cada nivel de la cadena
            cierra sobre los argumentos ya aplicados.
          </li>
          <li>
            Implementar debounce/throttle guardando el id del timer
            pendiente en una variable capturada entre llamadas sucesivas.
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
            V8 no retiene ciegamente todo el scope externo: en la mayoría de
            los casos, solo mantiene vivas las variables que la closure
            efectivamente referencia. Pero esto tiene un límite importante:
            si varias funciones internas comparten el mismo scope léxico
            (dos closures definidas dentro de la misma función), todas
            terminan compartiendo el mismo <em>contexto</em> interno. Si una
            sola de ellas usa una variable pesada, esa variable queda
            retenida mientras cualquiera de las closures que comparten ese
            contexto siga viva — aunque las demás no la usen.
          </p>
          <p>
            El mismo mecanismo de captura por binding (no por valor) que
            causa el bug clásico de <code>var</code> en loops con{" "}
            <code>setTimeout</code> aplica igual con <code>async/await</code>
            : cada <code>await</code> suspende y crea una continuación que
            cierra sobre las variables vivas en ese punto del scope.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que separar closures en el código también las separa en
              memoria.
            </strong>{" "}
            Si comparten scope léxico, comparten contexto interno: agrupar
            demasiadas funciones internas en un mismo scope puede retener
            más memoria de la esperada.
          </li>
          <li>
            <strong className="text-foreground">
              Usar var en loops con async/await esperando el mismo
              comportamiento que let.
            </strong>{" "}
            Todas las continuaciones comparten el mismo binding y leen el
            valor final del loop al resolverse — igual que con setTimeout.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Diagnosticar memory leaks en producción con heap snapshots
            comparativos (Chrome DevTools): tomar dos snapshots en el mismo
            estado lógico de la app y revisar qué objetos crecen sin bajar,
            y qué closure los retiene.
          </li>
          <li>
            Usar function expressions con nombre para recursión estable,
            independiente de si la variable externa a la que se asignó la
            función es reasignada.
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
