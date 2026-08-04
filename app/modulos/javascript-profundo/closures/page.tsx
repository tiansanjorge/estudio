import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ClosureSimulador } from "@/components/modulo/ClosureSimulador";
import { FabricaDeContadores } from "@/components/modulo/FabricaDeContadores";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosClosures } from "@/lib/modules/closures/escenarios";

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

export default function ClosuresPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Closures"
      descripcion="Una función no solo lleva su código: lleva también el scope donde nació, y puede seguir usándolo aunque ese scope 'debería' haber desaparecido."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
