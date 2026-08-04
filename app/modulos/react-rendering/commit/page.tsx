import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { CommitPipeline } from "@/components/modulo/CommitPipeline";
import { OrdenEfectosDemo } from "@/components/modulo/OrdenEfectosDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { pasosCommit } from "@/lib/modules/react-rendering/commit-escenarios";

export const metadata: Metadata = {
  title: "Commit — Frontend Study Lab",
  description:
    "Commit es el momento en que React realmente toca el DOM. Ahí conectan los refs, corren los layout effects, y recién después el navegador pinta la pantalla.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa durante la fase de Commit?",
    opciones: [
      "React vuelve a llamar a la función del componente",
      "React aplica al DOM real, de forma sincrónica, los cambios que Reconciliation decidió que hacían falta",
      "El navegador pinta la pantalla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Commit es la fase donde React efectivamente muta el DOM: inserta, actualiza y elimina nodos, y conecta los refs a sus elementos reales.",
  },
  {
    pregunta: "¿Cuándo corren los useLayoutEffect en relación al paint del navegador?",
    opciones: [
      "Después del paint, igual que useEffect",
      "Antes del paint: el navegador espera a que terminen para pintar la pantalla",
      "Durante la fase de Render",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "useLayoutEffect corre sincrónicamente justo después de que React mutó el DOM, mientras el navegador todavía no pintó nada. Por eso sirve para medir o ajustar el DOM sin que el usuario vea un parpadeo.",
  },
  {
    pregunta: "¿Cuándo corren los useEffect normales?",
    opciones: [
      "Antes de que React mute el DOM",
      "Después de que el navegador ya pintó la pantalla, de forma asincrónica",
      "Durante la fase de Reconciliation",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "useEffect corre después del paint, sin bloquear al navegador. Es el lugar correcto para la mayoría de los side effects (fetch, suscripciones) que no necesitan estar listos antes de que el usuario vea la pantalla.",
  },
];

export default function CommitPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Commit"
      descripcion="Render solo describe qué debería mostrarse. Commit es el momento en que React realmente toca el DOM — y ahí es donde entran en juego los refs y los layout effects."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          useLayoutEffect y useEffect reales, no simulados. Disparás un
          render y ves en qué orden corre cada uno, siempre.
        </p>
        <OrdenEfectosDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
