import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseMemo } from "@/lib/modules/hooks/use-memo-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseMemo.filter((p) => p.nivel === 1),
  2: entrevistaUseMemo.filter((p) => p.nivel === 2),
  3: entrevistaUseMemo.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useMemo — Dev Study Lab",
  description:
    "useMemo memoiza el resultado de un cálculo entre renders. Es una optimización de performance, nunca una garantía semántica sobre la que apoyar correctitud.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace useMemo?",
    opciones: [
      "Memoiza el resultado de un cálculo y lo recalcula cuando cambian sus deps",
      "Memoiza el componente y evita su re-render si las props no cambiaron",
      "Guarda el resultado entre montajes, aunque el componente se desmonte",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Si ninguna dependencia del array cambió, useMemo devuelve el valor ya calculado en el render anterior sin volver a ejecutar la función.",
  },
  {
    pregunta: "¿useMemo garantiza que el valor memoizado nunca se recalcule si las deps no cambiaron?",
    opciones: [
      "Sí: mientras las dependencias no cambien, el valor es siempre el mismo",
      "No: es una optimización y React puede recalcular; no dependas de eso",
      "Sí, salvo que el componente se desmonte y se vuelva a montar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React puede 'olvidar' un valor memoizado en casos raros (por ejemplo, para liberar memoria). useMemo es para performance, nunca para lógica que dependa de que se ejecute exactamente una vez.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo tiene sentido usar useMemo para un objeto trivial como { a, b }?",
    opciones: [
      "Nunca: crear un objeto chico siempre es más barato que memoizarlo",
      "Cuando el objeto tiene más de un par de propiedades anidadas",
      "Cuando va a un componente memo o a deps de otro hook: importa su identidad",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un objeto literal nuevo en cada render rompe la comparación superficial de memo o dispara efectos innecesariamente, aunque calcularlo sea trivial.",
  },
  {
    pregunta:
      "Si el array de dependencias de un useMemo no incluye todo lo que la función usa, ¿qué bug produce?",
    opciones: [
      "Stale closure: el valor memoizado queda desactualizado sin avisar",
      "Un loop infinito: el cálculo se vuelve a ejecutar en cada render",
      "Un error en runtime: React valida que las deps cubran todo lo usado",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La función queda capturando el valor viejo de la variable omitida, y como no está en las deps, nunca se recalcula cuando esa variable cambia de verdad.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿El React Compiler vuelve inútil aprender useMemo?",
    opciones: [
      "Sí: el compilador memoiza todo y los useMemo manuales pasan a ignorarse",
      "No: hace falta para diagnosticar lo que el compilador no memoiza",
      "Sí, salvo en componentes de clase, que el compilador no llega a procesar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El cambio de énfasis es hacia escribir componentes que sigan las reglas de React estrictamente, para que el compilador pueda optimizar con confianza.",
  },
  {
    pregunta:
      "¿Por qué useMemo no garantiza preservar la identidad de un valor entre cualquier par de renders?",
    opciones: [
      "Porque useMemo se reinicia en cada commit, aunque las deps no cambien",
      "Porque en modo concurrente el cálculo se ejecuta en un worker aparte",
      "Porque React puede descartar un render en progreso y reintentarlo sin caché",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "En un modelo de render que puede pausarse, descartarse y reintentarse (visto en el módulo de Fiber), prometer identidad absoluta no sería una promesa que React pudiera cumplir siempre.",
  },
];

export default function UseMemoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useMemo"
      descripcion="useMemo memoiza el resultado de un cálculo entre renders. Es una herramienta de performance, no una garantía semántica — la diferencia importa más de lo que parece."
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
            <code>useMemo</code> memoiza el RESULTADO de una función entre
            renders: solo la vuelve a ejecutar cuando alguna de las
            dependencias de su array cambió. Si ninguna cambió, devuelve
            el valor ya calculado en el render anterior.
          </p>
          <p>
            React documenta esto como una optimización de{" "}
            <strong className="text-foreground">performance</strong>, no
            como una garantía semántica absoluta: en casos raros, React
            podría &ldquo;olvidar&rdquo; un valor memoizado y recalcularlo
            igual. Nunca hay que depender de useMemo para correctitud,
            solo para evitar recalcular algo costoso innecesariamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Memoizar cálculos triviales (sumar dos números, formatear un string corto).
            </strong>{" "}
            El costo de comparar las dependencias puede superar al de
            simplemente recalcular el valor.
          </li>
          <li>
            <strong className="text-foreground">
              Depender de useMemo para que algo ocurra exactamente una vez.
            </strong>{" "}
            No es una garantía — para eso existe useRef o una variable
            fuera del componente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Ordenar o filtrar una lista grande solo cuando los datos de
            origen realmente cambiaron.
          </li>
          <li>
            Cálculos con mucha iteración (agregaciones, transformaciones
            de datasets) que se repetirían innecesariamente en cada
            render sin memoización.
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
          <p>
            Este useMemo no evita recalcular cuando debería no hacerlo. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Lista({ items }) {
  const ordenados = useMemo(() => [...items].sort(comparar), [items]);
  return <ul>{ordenados.map((i) => <li key={i.id}>{i.nombre}</li>)}</ul>;
}

function Padre() {
  const items = [{ id: 1, nombre: 'Ana' }, { id: 2, nombre: 'Luis' }];
  return <Lista items={items} />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>items</code> se crea como un array literal NUEVO en
              cada render de <code>Padre</code> — aunque su contenido sea
              idéntico, la referencia cambia siempre. useMemo compara por
              referencia, así que ve una dependencia &ldquo;distinta&rdquo;
              en cada render y recalcula igual, perdiendo el beneficio de
              la memoización.
            </p>
            <p className="mt-2">
              El fix es que <code>Padre</code> también memoice{" "}
              <code>items</code> (o lo defina fuera del componente si es
              verdaderamente constante), para que su referencia sea
              estable entre renders.
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
            useMemo también sirve para mantener la{" "}
            <strong className="text-foreground">identidad</strong> de un
            objeto o array, más allá de ahorrar cálculo: si ese valor se
            pasa como prop a un componente envuelto en{" "}
            <code>React.memo</code>, o como <code>value</code> de un
            Context Provider, lo que importa es que sea la MISMA
            referencia entre renders cuando su contenido no cambió.
          </p>
          <p>
            Si el array de dependencias de un useMemo no incluye todo lo
            que la función usa internamente, produce el mismo problema de
            stale closure que un useEffect mal configurado: el valor
            memoizado queda desactualizado silenciosamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Memoizar por costo de cálculo cuando el problema real es de
              identidad de referencia.
            </strong>{" "}
            Un objeto trivial igual necesita useMemo si su identidad
            importa para memo o para otro hook.
          </li>
          <li>
            <strong className="text-foreground">
              Omitir una dependencia real del useMemo.
            </strong>{" "}
            El valor memoizado queda congelado con datos viejos, sin
            ningún error visible.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Memoizar el value de un Context Provider para que los
            consumidores no re-rendericen por una referencia nueva en
            cada render del Provider.
          </li>
          <li>
            Memoizar props objeto/array pasadas a un componente hijo
            envuelto en React.memo, para que la memoización del hijo
            funcione de verdad.
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
            El <strong className="text-foreground">React Compiler</strong>{" "}
            puede insertar memoización automáticamente en tiempo de
            compilación, donde detecta que es segura y beneficiosa, sin
            que el desarrollador escriba useMemo a mano. Esto no vuelve
            inútil entenderlo: sigue siendo necesario para diagnosticar
            por qué algo NO se memoiza automáticamente, y para código
            legacy que todavía no adoptó el compiler.
          </p>
          <p>
            useMemo no garantiza preservar la identidad de un valor entre
            cualquier par de renders porque, bajo renderizado concurrente,
            React puede descartar un árbol de trabajo-en-progreso a medio
            calcular (el double buffering visto en Fiber) y reintentar
            desde cero — los valores memoizados de ese intento descartado
            se pierden junto con el resto del trabajo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que el React Compiler elimina toda necesidad de
              entender memoización.
            </strong>{" "}
            El foco cambia hacia escribir código que siga las reglas de
            React estrictamente, no hacia ignorar el tema por completo.
          </li>
          <li>
            <strong className="text-foreground">
              Prometer identidad absoluta de un valor memoizado en
              documentación o comentarios de código.
            </strong>{" "}
            No es una garantía que React pueda mantener bajo renderizado
            concurrente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Auditar useMemo manuales existentes al migrar un proyecto al
            React Compiler, identificando cuáles el compilador ya cubre
            automáticamente.
          </li>
          <li>
            Explicar en una entrevista de nivel staff por qué
            &quot;memoizado&quot; no significa &quot;garantizado idéntico
            para siempre&quot; en un modelo de render interrumpible.
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
