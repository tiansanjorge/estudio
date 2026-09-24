import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { CommitPipeline } from "@/components/modulo/CommitPipeline";
import { OrdenEfectosDemo } from "@/components/modulo/OrdenEfectosDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { pasosCommit } from "@/lib/modules/react-rendering/commit-escenarios";
import { entrevistaCommit } from "@/lib/modules/react-rendering/commit-entrevista";

const preguntasPorNivel = {
  1: entrevistaCommit.filter((p) => p.nivel === 1),
  2: entrevistaCommit.filter((p) => p.nivel === 2),
  3: entrevistaCommit.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Commit — Dev Study Lab",
  description:
    "Commit es el momento en que React realmente toca el DOM. Ahí conectan los refs, corren los layout effects, y recién después el navegador pinta la pantalla.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa durante la fase de Commit?",
    opciones: [
      "React aplica al DOM, de forma síncrona, los cambios que decidió Reconciliation",
      "React compara el árbol nuevo con el anterior para decidir qué nodos tienen que cambiar",
      "El navegador pinta la pantalla y recién después React escribe los cambios en el DOM",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Commit es la fase donde React efectivamente muta el DOM: inserta, actualiza y elimina nodos, y conecta los refs a sus elementos reales.",
  },
  {
    pregunta: "¿Cuándo corren los useLayoutEffect en relación al paint del navegador?",
    opciones: [
      "Después del paint, igual que useEffect pero con más prioridad",
      "Antes del paint: el navegador espera a que terminen para pintar",
      "Durante el render, antes de que React toque el DOM",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "useLayoutEffect corre sincrónicamente justo después de que React mutó el DOM, mientras el navegador todavía no pintó nada. Por eso sirve para medir o ajustar el DOM sin que el usuario vea un parpadeo.",
  },
  {
    pregunta: "¿Cuándo corren los useEffect normales?",
    opciones: [
      "Durante el commit, justo después de mutar el DOM y antes del paint",
      "Durante el render, en el mismo orden en que se declararon",
      "Después de que el navegador pintó, de forma asincrónica",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "useEffect corre después del paint, sin bloquear al navegador. Es el lugar correcto para la mayoría de los side effects (fetch, suscripciones) que no necesitan estar listos antes de que el usuario vea la pantalla.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué puede hacer getSnapshotBeforeUpdate que useLayoutEffect no puede?",
    opciones: [
      "Leer el DOM justo antes de que React lo mute, cosa que useLayoutEffect ya no ve",
      "Cancelar el commit en curso si detecta que el cambio no es necesario para la UI",
      "Leer el DOM después del paint, cuando los tamaños de los elementos ya son definitivos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es útil para restaurar posición de scroll al agregar elementos arriba de una lista (por ejemplo, un chat), comparando el estado del DOM antes y después del cambio.",
  },
  {
    pregunta:
      "Un Padre y su Hijo tienen ambos useLayoutEffect. ¿En qué orden corren?",
    opciones: [
      "Padre primero, después Hijo: de arriba hacia abajo",
      "Hijo primero, después Padre: de abajo hacia arriba",
      "En paralelo, porque cada uno pertenece a otro fiber",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para cuando el layout effect del padre corre, el hijo ya terminó de aplicar el suyo, permitiendo que el padre mida un DOM ya en su estado final para esa actualización.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Si Commit es sincrónico y sin interrupciones, ¿por qué los useEffect de una actualización grande pueden tardar en correr?",
    opciones: [
      "Porque los useEffect corren en un hilo aparte que espera a que el principal se libere",
      "Porque React ejecuta los efectos recién cuando el usuario deja de interactuar",
      "Porque useEffect corre después del paint y React decide cuándo según la prioridad",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es intencional: prioriza que el usuario vea la pantalla actualizada cuanto antes, por sobre que los efectos (generalmente invisibles) corran de inmediato.",
  },
  {
    pregunta:
      "¿Un componente que se re-renderiza siempre genera una mutación real durante Commit?",
    opciones: [
      "No: si el resultado es idéntico al anterior, no hay nada que mutar en ese nodo",
      "Sí: cada render termina reescribiendo los nodos del componente en el DOM",
      "Sí, aunque el navegador descarta los cambios que no alteran lo visible",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El componente completa su fase de Render (la función corrió), pero su participación en Commit puede ser nula si no hay diffs que aplicar al DOM.",
  },
];

export default function CommitPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Commit"
      descripcion="Render solo describe qué debería mostrarse. Commit es el momento en que React realmente toca el DOM — y ahí es donde entran en juego los refs y los layout effects."
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
            Después de Render (qué debería mostrarse) y Reconciliation
            (qué cambió realmente), React entra en{" "}
            <strong className="text-foreground">Commit</strong>: la única
            fase donde efectivamente toca el DOM del navegador. Inserta
            nodos nuevos, actualiza atributos y texto, elimina lo que ya
            no hace falta, y conecta los <code>ref</code> a sus elementos
            reales — por eso un <code>ref.current</code> apunta a{" "}
            <code>null</code> durante el render y recién tiene un nodo
            real después del commit.
          </p>
          <p>
            A diferencia de Render (que en renderizado concurrente puede
            pausarse o descartarse), Commit corre de{" "}
            <strong className="text-foreground">
              una sola vez, sin interrupciones
            </strong>
            . React no puede permitirse mostrar al usuario una UI a
            medio actualizar.
          </p>
          <p>
            Inmediatamente después del commit —{" "}
            <strong className="text-foreground">
              todavía antes de que el navegador pinte nada en pantalla
            </strong>{" "}
            — corren los <code>useLayoutEffect</code>, de forma
            sincrónica. Recién después de eso el navegador pinta, y ahí
            sí, de forma asincrónica, corren los <code>useEffect</code>{" "}
            normales.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <CommitPipeline pasos={pasosCommit} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          useLayoutEffect y useEffect reales, no simulados. Disparás un
          render y ves en qué orden corre cada uno, siempre.
        </p>
        <OrdenEfectosDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Leer un ref durante el render, esperando que ya apunte al DOM.
            </strong>{" "}
            Los refs recién se conectan durante Commit. Durante el
            render (o antes del primer commit) valen <code>null</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Usar useLayoutEffect por costumbre en vez de useEffect.
            </strong>{" "}
            useLayoutEffect bloquea el paint del navegador hasta que
            termina. Usarlo sin necesidad (para fetch, suscripciones,
            cosas que no afectan el layout visual) hace la UI menos
            responsiva sin ninguna ventaja real.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que un useEffect corra antes de que el usuario vea algo en pantalla.
            </strong>{" "}
            Corre después del paint — si necesitás evitar un parpadeo
            visual, la herramienta correcta es useLayoutEffect.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            useLayoutEffect para medir el tamaño de un elemento del DOM y
            ajustar su posición antes de que el usuario lo vea (por
            ejemplo, un tooltip que no se sale de la pantalla).
          </li>
          <li>
            useEffect para la gran mayoría de side effects: fetch de
            datos, suscripciones a eventos, sincronizar con
            localStorage.
          </li>
          <li>
            Acceder a un nodo del DOM recién después del commit —
            típicamente con un <code>ref</code> leído dentro de un
            useEffect o useLayoutEffect, nunca directamente en el cuerpo
            del componente.
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
            Este tooltip aparece brevemente en la esquina superior
            izquierda antes de saltar a su posición correcta — un
            parpadeo visible. ¿Por qué, y cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Tooltip({ elementoAncla }) {
  const ref = useRef(null);

  useEffect(() => {
    const posicion = calcularPosicion(elementoAncla, ref.current);
    ref.current.style.transform = \`translate(\${posicion.x}px, \${posicion.y}px)\`;
  }, [elementoAncla]);

  return <div ref={ref} className="tooltip">...</div>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>useEffect</code> corre DESPUÉS de que el navegador ya
              pintó el tooltip en su posición inicial (0,0, la que le
              dio el CSS por default). Recién ahí se calcula la posición
              correcta y se mueve — el usuario alcanza a ver ese salto
              como un parpadeo.
            </p>
            <p className="mt-2">El fix es usar useLayoutEffect: el reposicionamiento pasa a ocurrir ANTES del paint, así que el usuario nunca ve la posición intermedia.</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`useLayoutEffect(() => {
  const posicion = calcularPosicion(elementoAncla, ref.current);
  ref.current.style.transform = \`translate(\${posicion.x}px, \${posicion.y}px)\`;
}, [elementoAncla]);`}
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
            <code>getSnapshotBeforeUpdate</code> (componentes de clase)
            captura información del DOM justo ANTES de que React lo mute
            — por ejemplo, la posición de scroll antes de agregar
            mensajes arriba de un chat. Ese valor se pasa a{" "}
            <code>componentDidUpdate</code>, ya después del commit,
            permitiendo comparar el antes y el después. Es algo que{" "}
            <code>useLayoutEffect</code> (que corre después de la
            mutación) no puede ver por sí solo.
          </p>
          <p>
            En un árbol con varios <code>useLayoutEffect</code>, corren
            de abajo hacia arriba: los de los hijos antes que los del
            padre, para que este último pueda medir un DOM ya en su
            estado final de esa actualización. Lo mismo aplica a{" "}
            <code>useEffect</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Intentar comparar antes/después de una mutación solo con
              useLayoutEffect.
            </strong>{" "}
            Corre después de la mutación; para el &quot;antes&quot; hace
            falta getSnapshotBeforeUpdate o guardar el valor manualmente
            antes.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que el orden de los layout effects entre componentes
              no importa.
            </strong>{" "}
            Un padre que mide el DOM en su layout effect depende de que
            los hijos ya hayan corrido el suyo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Restaurar la posición de scroll de una lista de chat al
            agregar mensajes nuevos arriba, usando getSnapshotBeforeUpdate
            o su equivalente con refs en componentes de función.
          </li>
          <li>
            useInsertionEffect en una librería de CSS-in-JS propia, para
            inyectar estilos antes de que cualquier layout effect intente
            medir el DOM.
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
            El commit en sí (la mutación del DOM) es sincrónico y no se
            puede pausar. Pero los <code>useEffect</code> se programan
            para correr DESPUÉS del paint, y React puede diferir cuándo
            exactamente los ejecuta según la prioridad del trabajo
            pendiente — en actualizaciones grandes, puede pasar más
            tiempo del esperado antes de que todos terminen de correr,
            aunque el commit ya haya finalizado hace rato. Es intencional:
            prioriza que el usuario vea la pantalla actualizada cuanto
            antes.
          </p>
          <p>
            Un componente puede completar su fase de Render (la función
            corrió de nuevo) sin generar ninguna mutación real en Commit,
            si Reconciliation determina que el resultado es idéntico al
            anterior — distinto de un bail-out por memo, que directamente
            evita re-ejecutar la función.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que un useEffect corre inmediatamente después del
              commit que lo originó.
            </strong>{" "}
            React puede diferir su ejecución según la prioridad del
            trabajo pendiente.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir &quot;la función corrió de nuevo&quot; con
              &quot;el DOM cambió&quot;.
            </strong>{" "}
            Un render puede no generar ninguna mutación real si el
            resultado es idéntico al anterior.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            No asumir timing exacto de useEffect en código crítico de
            performance — medir con el Profiler en vez de suponer.
          </li>
          <li>
            Diagnosticar por qué un componente &quot;renderiza&quot; en el
            Profiler sin que el DOM visualmente cambie: Reconciliation
            concluyó que no había diffs que commitear.
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
