import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { MemorySimulador } from "@/components/modulo/MemorySimulador";
import { MemoryReachability } from "@/components/modulo/MemoryReachability";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosMemory } from "@/lib/modules/memory/escenarios";
import { entrevistaMemory } from "@/lib/modules/memory/entrevista";

const preguntasPorNivel = {
  1: entrevistaMemory.filter((p) => p.nivel === 1),
  2: entrevistaMemory.filter((p) => p.nivel === 2),
  3: entrevistaMemory.filter((p) => p.nivel === 3),
};

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

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué V8 divide el heap en una generación joven y una vieja?",
    opciones: [
      "Para ahorrar espacio en disco",
      "Porque la mayoría de los objetos mueren jóvenes: recolectar la generación joven seguido con un algoritmo rápido es más eficiente que tratar todo el heap igual",
      "Es un requisito de la spec de ECMAScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los objetos nuevos van a una generación joven pequeña, recolectada muy seguido (Scavenger). Los que sobreviven se promueven a la generación vieja, recolectada con menos frecuencia usando Mark-Compact.",
  },
  {
    pregunta:
      "¿Qué perdés al usar WeakMap en vez de Map para evitar leaks?",
    opciones: [
      "Nada, son funcionalmente idénticos",
      "No podés iterar sus entradas ni conocer su tamaño (no tiene .size), porque su contenido puede desaparecer en cualquier momento por el GC",
      "WeakMap es mucho más lento en cada operación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las claves de un WeakMap son referencias débiles: si nada más referencia la clave, la entrada desaparece sola. A cambio de esa limpieza automática, se pierde la capacidad de iterar o medir el tamaño.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Guardás una referencia a un solo nodo hijo de un árbol del DOM removido. ¿Qué queda retenido en memoria?",
    opciones: [
      "Solo ese nodo hijo puntual",
      "Todo el subárbol completo, porque los nodos del DOM tienen referencias bidireccionales padre-hijo (parentNode)",
      "Nada, el navegador libera todo lo removido del documento automáticamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La referencia alcanza hacia arriba a través de parentNode hasta la raíz del subárbol, así que todo ese subárbol queda 'detached' pero vivo en memoria, no solo el nodo guardado.",
  },
  {
    pregunta:
      "¿Por qué no conviene depender de FinalizationRegistry para lógica de negocio crítica?",
    opciones: [
      "Porque solo funciona en Node, no en el navegador",
      "Porque la spec no garantiza cuándo (ni si) el callback de finalización va a correr",
      "Porque tiene un límite de 100 registros por proceso",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El momento de ejecución depende de la heurística interna del motor y puede tardar arbitrariamente o no correr antes de que el proceso termine. Solo sirve para limpieza de 'mejor esfuerzo', no para lógica determinística.",
  },
];

export default function MemoryPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Memory"
      descripcion="JavaScript no te obliga a liberar memoria manualmente, pero eso no significa que las fugas sean imposibles — solo que pasan de otra forma."
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
        <ul className="flex flex-col gap-3 prosa">
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
        <ul className="flex flex-col gap-3 prosa">
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

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
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
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Los motores modernos dividen el heap en una{" "}
            <strong className="text-foreground">generación joven</strong>{" "}
            (donde nace todo objeto nuevo, recolectada muy seguido con un
            algoritmo rápido llamado Scavenger) y una{" "}
            <strong className="text-foreground">generación vieja</strong>{" "}
            (objetos que sobrevivieron varias rondas y se
            &ldquo;promovieron&rdquo;, recolectados con menos frecuencia
            usando Mark-Compact, más costoso pero justificado). Es una
            optimización basada en que la mayoría de los objetos mueren
            jóvenes.
          </p>
          <p>
            Para evitar retener referencias más tiempo del necesario,{" "}
            <code>WeakMap</code> y <code>WeakSet</code> usan referencias{" "}
            <strong className="text-foreground">débiles</strong>: no
            impiden que el GC recolecte la clave si nada más la referencia,
            y en ese caso la entrada desaparece sola. A cambio, no se
            pueden iterar ni conocer su tamaño — su contenido puede
            desaparecer en cualquier momento.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar un Map normal como cache sin invalidación manual.
            </strong>{" "}
            Mantiene referencias fuertes: mientras el Map exista, todas sus
            claves y valores quedan vivos, aunque nadie más los use.
          </li>
          <li>
            <strong className="text-foreground">
              Retener artificialmente objetos temporales en la generación
              vieja.
            </strong>{" "}
            Una closure que vive más de lo necesario fuerza a sus
            capturas a promoverse, aumentando el costo de los ciclos de
            Mark-Compact.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar WeakMap para asociar metadata a objetos de dominio (por
            ejemplo, un caché de resultados calculados por elemento del
            DOM) sin impedir que se liberen cuando el elemento se remueve.
          </li>
          <li>
            Diagnosticar leaks con heap snapshots comparativos en Chrome
            DevTools: dos snapshots en el mismo estado lógico, revisando
            qué tipos de objetos crecen sin bajar y sus retainers.
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
            Los nodos del DOM mantienen referencias bidireccionales entre
            padre e hijo (<code>parentNode</code>, <code>childNodes</code>).
            Si guardás una referencia a un solo nodo hijo de un subárbol
            removido del documento, esa referencia alcanza hacia arriba
            hasta la raíz del subárbol completo — todo ese subárbol queda
            &ldquo;detached&rdquo; pero vivo en memoria, no solo el nodo
            que guardaste.
          </p>
          <p>
            <code>WeakRef</code> y <code>FinalizationRegistry</code> son
            primitivas de bajo nivel para referencias débiles y limpieza
            post-recolección, pero la spec no garantiza CUÁNDO ni SI un
            callback de finalización va a correr — depende de la
            heurística interna del motor. Solo sirven para optimizaciones
            de &ldquo;mejor esfuerzo&rdquo; (invalidar un cache, telemetría),
            nunca para lógica que la app necesite de forma determinística.
          </p>
          <p>
            Un mark-and-sweep clásico es &ldquo;stop-the-world&rdquo;:
            pausa todo el programa mientras recorre el heap alcanzable, y
            esa pausa crece con el tamaño del heap. Motores modernos (V8
            Orinoco) hacen la mayor parte del marcado incremental y
            concurrente en background, dejando solo una breve pausa
            atómica final — así un heap grande ya no se traduce
            directamente en un frame perdido.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Subestimar cuánto retiene una sola referencia a un nodo
              detached.
            </strong>{" "}
            No es solo ese nodo: es el subárbol completo, por las
            referencias padre-hijo bidireccionales.
          </li>
          <li>
            <strong className="text-foreground">
              Depender de FinalizationRegistry para cerrar un recurso
              crítico.
            </strong>{" "}
            El timing no está garantizado; para eso hace falta un cleanup
            explícito, no basado en GC.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Diagnosticar OOM en un proceso Node de larga duración con{" "}
            <code>--max-old-space-size</code> y heap snapshots tomados en
            producción sin bloquear el proceso por mucho tiempo.
          </li>
          <li>
            Usar FinalizationRegistry solo como red de seguridad para
            telemetría de cache eviction, nunca como mecanismo principal
            de liberación de recursos.
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
