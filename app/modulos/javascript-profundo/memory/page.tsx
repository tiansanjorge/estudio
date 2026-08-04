import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { MemorySimulador } from "@/components/modulo/MemorySimulador";
import { MemoryReachability } from "@/components/modulo/MemoryReachability";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosMemory } from "@/lib/modules/memory/escenarios";

export const metadata: Metadata = {
  title: "Memory — Dev Study Lab",
  description:
    "Cómo decide el motor de JavaScript qué objetos liberar de memoria, y las fugas más comunes en apps de frontend.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué determina si un objeto es candidato a ser liberado por el Garbage Collector?",
    opciones: [
      "Que hayan pasado más de unos segundos desde que se creó",
      "Que ya no sea alcanzable desde ningún root (variables globales, el scope en ejecución, etc.)",
      "Que ocupe más de cierto tamaño en memoria",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El criterio es reachability, no tiempo ni tamaño: si no existe ningún camino de referencias desde un root hasta ese objeto, es basura recolectable.",
  },
  {
    pregunta: "Dos objetos se referencian mutuamente (A → B y B → A), pero nada externo los referencia. ¿El motor de JS los recolecta?",
    opciones: [
      "No, porque se referencian entre sí y nunca llegan a cero referencias",
      "Sí: el algoritmo de mark-and-sweep no los considera alcanzables aunque formen un ciclo",
      "Depende del navegador",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "A diferencia de un conteo simple de referencias, mark-and-sweep parte desde los roots. Un ciclo que nadie alcanza desde afuera queda igual de recolectable.",
  },
  {
    pregunta: "¿Cuál de estas es una causa típica de fuga de memoria en frontend?",
    opciones: [
      "Declarar demasiadas variables const",
      "No remover un event listener que retiene una closure con datos grandes",
      "Usar arrow functions en vez de function declarations",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un listener nunca removido mantiene viva su closure (y todo lo que esa closure capture) mientras el elemento exista, aunque nadie vuelva a necesitar esos datos.",
  },
];

export default function MemoryPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Memory"
      descripcion="JavaScript no te obliga a liberar memoria manualmente, pero eso no significa que las fugas sean imposibles — solo que pasan de otra forma."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            El motor de JavaScript decide qué liberar usando{" "}
            <strong className="text-foreground">reachability</strong>: un
            objeto sigue vivo mientras exista al menos un camino de
            referencias desde un <strong className="text-foreground">root</strong>{" "}
            (variables globales, el scope actualmente en ejecución, closures
            activas) hasta ese objeto. Si ningún camino lo alcanza, es{" "}
            <strong className="text-foreground">basura</strong> — candidato
            a que el Garbage Collector libere esa memoria.
          </p>
          <p>
            El algoritmo que usan los motores modernos se llama{" "}
            <strong className="text-foreground">mark-and-sweep</strong>:
            arranca desde los roots, marca todo lo que puede alcanzar, y
            todo lo que quedó sin marcar se recolecta. Esto es más
            inteligente que un simple conteo de referencias: un ciclo
            entre dos objetos que nadie más referencia también se
            recolecta, porque ninguno es alcanzable desde un root.
          </p>
          <p>
            En la práctica, casi ninguna &ldquo;fuga de memoria&rdquo; en
            frontend es un bug del motor de JS — es código que, sin
            querer, mantiene una referencia viva más tiempo del necesario:
            un listener nunca removido, un timer que nunca se cancela, una
            closure que retiene datos que ya no hacen falta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <MemorySimulador escenarios={escenariosMemory} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <MemoryReachability />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Event listeners que nunca se remueven.
            </strong>{" "}
            Cada uno retiene su closure (y todo lo que esa closure
            capture) mientras el elemento exista en el DOM.
          </li>
          <li>
            <strong className="text-foreground">
              setInterval que nunca se cancela.
            </strong>{" "}
            El callback queda referenciado por el propio timer, que sigue
            vivo (y corriendo) hasta un clearInterval explícito.
          </li>
          <li>
            <strong className="text-foreground">
              Guardar referencias a nodos del DOM en variables globales o caches.
            </strong>{" "}
            Aunque quites el nodo del árbol visible, sigue vivo en memoria
            (&ldquo;detached DOM node&rdquo;) mientras algo lo referencie.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir un ciclo de referencias con &ldquo;nunca se libera&rdquo;.
            </strong>{" "}
            En JS (a diferencia de otros lenguajes con conteo simple de
            referencias) los ciclos sin conexión a un root sí se
            recolectan.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Limpiar listeners y timers en el cleanup de un efecto (por
            ejemplo, el <code>return</code> de un <code>useEffect</code>)
            para que no sobrevivan al desmontaje del componente.
          </li>
          <li>
            Usar <code>WeakMap</code>/<code>WeakSet</code> para asociar
            metadata a un objeto sin impedir que se recolecte cuando ya
            nadie más lo use.
          </li>
          <li>
            Diagnosticar un consumo de memoria creciente en el navegador
            usando el profiler de memoria de DevTools, buscando qué sigue
            referenciando objetos que deberían haber desaparecido.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>Este componente de React tiene una fuga de memoria. ¿Dónde está y cómo la arreglarías?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Reloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setHora(new Date());
    }, 1000);
  }, []);

  return <span>{hora.toLocaleTimeString()}</span>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El <code>setInterval</code> nunca se cancela. Cuando el
              componente <code>Reloj</code> se desmonta, el intervalo
              sigue corriendo cada segundo, llamando a{" "}
              <code>setHora</code> de un componente que ya no existe —
              retiene en memoria todo lo que esa closure capturó,
              indefinidamente.
            </p>
            <p className="mt-2">El fix es cancelarlo en el cleanup del efecto:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`useEffect(() => {
  const id = setInterval(() => {
    setHora(new Date());
  }, 1000);

  return () => clearInterval(id);
}, []);`}
            </pre>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
