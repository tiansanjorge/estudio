import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaMemoization } from "@/lib/modules/performance/memoization-entrevista";

const preguntasPorNivel = {
  1: entrevistaMemoization.filter((p) => p.nivel === 1),
  2: entrevistaMemoization.filter((p) => p.nivel === 2),
  3: entrevistaMemoization.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Memoization — Dev Study Lab",
  description:
    "Más allá de la API de useMemo/useCallback: dónde colocar límites de memoización en un árbol de componentes, y cómo medir antes de memoizar a ciegas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace React.memo en términos de propagación de re-renders?",
    opciones: [
      "Si las props no cambiaron, corta el re-render del padre en ese subárbol",
      "Hace que el componente solo se re-renderice cuando cambia su estado propio",
      "Guarda el DOM del componente y lo reutiliza sin volver a reconciliarlo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Sin ningún límite de memoización, cualquier re-render de un componente re-renderiza también a todos sus descendientes, sin importar si sus props cambiaron.",
  },
  {
    pregunta: "¿Por qué no envolver todos los componentes en React.memo por costumbre?",
    opciones: [
      "Porque memo impide que el componente reciba cambios de Context",
      "Porque comparar props tiene costo, y puede superar al de re-renderizar",
      "Porque memo rompe los componentes que reciben children",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La memoización rinde donde el costo de renderizar es alto, no en cualquier lugar por sistema.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Un componente contenedor grande está envuelto en memo, pero recibe children creado como JSX nuevo en cada render del padre. ¿Sirve el memo?",
    opciones: [
      "Sí: memo ignora children y compara solo el resto de las props",
      "Sí, siempre que children tenga el mismo contenido que en el render anterior",
      "No del todo: children es un elemento nuevo en cada render y memo lo detecta",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El límite de memoización tiene que colocarse donde las props que realmente importan puedan mantenerse estables, no simplemente en el componente más externo.",
  },
  {
    pregunta:
      "¿Cómo confirmarías que un componente realmente tiene un costo de render alto antes de memoizarlo?",
    opciones: [
      "Con el Profiler de React DevTools, grabando una interacción real",
      "Contando cuántas veces se re-renderiza con un console.log en el cuerpo",
      "Con Lighthouse, mirando el Total Blocking Time de la página",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Memoizar sin medir primero es común terminar optimizando un componente que en realidad no era el cuello de botella real.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cómo cambia el React Compiler la estrategia general de dónde colocar límites de memoización?",
    opciones: [
      "Obliga a marcar a mano qué componentes memoizar con una directiva",
      "El trabajo pasa a escribir componentes que respeten las reglas de React",
      "Memoiza solo los componentes que ya estaban envueltos en React.memo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El compilador puede insertar memoización automáticamente donde detecta que es segura y útil, potencialmente con más granularidad que un desarrollador a mano.",
  },
  {
    pregunta:
      "Para una lista de miles de elementos, ¿alcanza con memoizar cada item?",
    opciones: [
      "Sí: con memo, React ya no crea los nodos de los items que no cambiaron",
      "Sí, si además las keys son estables y los callbacks usan useCallback",
      "No: evita re-renders, pero siguen existiendo miles de nodos en el DOM",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es un problema distinto al que memo resuelve: no es re-render, es la cantidad de nodos existentes en el DOM, que necesita una técnica distinta.",
  },
];

export default function MemoizationPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Memoization"
      descripcion="Más allá de la API de useMemo/useCallback: dónde colocar límites de memoización en un árbol de componentes, y cómo medir antes de memoizar a ciegas."
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
            Envolver un componente en <code>React.memo</code> crea un{" "}
            <strong className="text-foreground">
              límite de memoización
            </strong>
            : si las props que recibe no cambiaron de referencia, React
            corta por completo la propagación del re-render de su padre
            hacia ese subárbol. Sin ningún límite, el comportamiento por
            defecto de React es que cualquier re-render de un componente
            re-renderiza también a todos sus descendientes, sin importar
            si sus props cambiaron.
          </p>
          <p>
            No conviene envolver todos los componentes en memo por
            costumbre: cada uno tiene un costo propio de comparación de
            props en cada actualización. Para componentes muy baratos de
            renderizar, ese costo puede superar al de simplemente
            dejarlos re-renderizar sin memo. La memoización rinde donde
            el costo de RENDERIZAR es alto, no en cualquier lugar por
            sistema.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Envolver en memo componentes triviales (un span, un ícono).
            </strong>{" "}
            El costo de comparación puede ser mayor que el ahorro
            obtenido.
          </li>
          <li>
            <strong className="text-foreground">
              Memoizar sin haber medido primero dónde está el costo real.
            </strong>{" "}
            Termina optimizando componentes que no eran el cuello de
            botella.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver un componente que renderiza un cálculo pesado
            (gráfico, tabla grande) en React.memo, con props ya
            estabilizadas.
          </li>
          <li>
            Usar el Profiler de React DevTools para identificar qué
            componentes realmente valen la pena memoizar en una
            interacción concreta.
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
            Este ListaCostosa está en React.memo, pero sigue re-renderizando en cada tecla del input. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function App() {
  const [texto, setTexto] = useState('');
  return (
    <div>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <ListaCostosa config={{ orden: 'asc' }} />
    </div>
  );
}

const ListaCostosa = React.memo(function ListaCostosa({ config }) { ... });`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>{"{ orden: 'asc' }"}</code> es un objeto literal
              NUEVO en cada render de <code>App</code>, aunque su
              contenido sea siempre idéntico. La comparación superficial
              de memo ve una referencia distinta en cada render y
              considera que la prop &quot;cambió&quot;, así que
              re-renderiza igual.
            </p>
            <p className="mt-2">El fix es estabilizar esa referencia:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`const configEstable = useMemo(() => ({ orden: 'asc' }), []);
<ListaCostosa config={configEstable} />`}
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
            Colocar un límite de memoización &quot;demasiado alto&quot; en
            el árbol no siempre evita los re-renders buscados: si el
            componente memoizado recibe <code>children</code> creado como
            JSX en el padre, ese elemento se recrea en cada render del
            padre, y la comparación superficial de memo sigue detectando
            un cambio. El límite tiene que colocarse donde las props que
            realmente importan puedan mantenerse estables entre renders.
          </p>
          <p>
            Antes de memoizar, conviene confirmar el costo real con el{" "}
            <strong className="text-foreground">
              Profiler de React DevTools
            </strong>
            : graba una interacción y muestra cuánto tardó renderizar
            cada componente, reemplazando la intuición por datos
            concretos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Memoizar el componente contenedor más externo, esperando
              que eso resuelva todo debajo.
            </strong>{" "}
            Si children llega como JSX nuevo, el memo no corta esa
            propagación.
          </li>
          <li>
            <strong className="text-foreground">
              Adivinar qué componente es costoso en vez de medirlo con el
              Profiler.
            </strong>{" "}
            Lleva a optimizar el componente equivocado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Grabar una interacción con el Profiler antes de decidir dónde
            agregar memoización en una pantalla con problemas de
            performance reportados.
          </li>
          <li>
            Reestructurar dónde vive el estado que cambia seguido, para
            que el límite de memoización quede por debajo de ese estado,
            no por encima.
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
            El React Compiler puede insertar memoización automáticamente
            donde detecta que es segura y útil, sin que el desarrollador
            decida manualmente dónde colocar cada límite. El foco de la
            estrategia cambia: en vez de razonar activamente
            &quot;¿dónde pongo memo?&quot;, el trabajo pasa a escribir
            componentes que respeten las reglas de React estrictamente,
            para que el compilador optimice con confianza.
          </p>
          <p>
            Para una lista de miles de elementos, memoizar cada item
            evita re-renderizarlos, pero no evita que React y el
            navegador mantengan miles de nodos reales en el DOM — un
            problema distinto (cantidad de nodos, no re-render), que
            necesita{" "}
            <strong className="text-foreground">
              virtualización/windowing
            </strong>
            , renderizando en el DOM real solo los ítems visibles en el
            viewport.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en memoización manual extensiva en un proyecto que
              ya usa React Compiler.
            </strong>{" "}
            Puede volverse código redundante que el compilador ya cubre.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar resolver una lista de miles de elementos solo con
              memo.
            </strong>{" "}
            No reduce la cantidad de nodos reales en el DOM — hace falta
            virtualización.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Auditar memoización manual existente al migrar un proyecto al
            React Compiler, identificando qué ya cubre automáticamente.
          </li>
          <li>
            Combinar memoización de items con virtualización en una lista
            grande: memo evita recalcular, virtualización evita mantener
            nodos innecesarios.
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
