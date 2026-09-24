import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseRef } from "@/lib/modules/hooks/use-ref-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseRef.filter((p) => p.nivel === 1),
  2: entrevistaUseRef.filter((p) => p.nivel === 2),
  3: entrevistaUseRef.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useRef — Dev Study Lab",
  description:
    "useRef guarda un valor mutable que persiste entre renders sin disparar ninguno al cambiar. Esa diferencia con useState es la que define cuándo usar cada uno.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa cuando cambiás ref.current de un useRef?",
    opciones: [
      "No dispara un re-render: el valor persiste, pero React no se entera",
      "Dispara un re-render como setState, pero fuera del batching",
      "El valor se pierde en el próximo render, porque la ref se reinicia",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Esa es la diferencia clave con useState: useRef sirve para guardar datos que sobreviven entre renders pero no deberían afectar visualmente lo que se muestra.",
  },
  {
    pregunta: "¿Cuándo está disponible ref.current cuando el ref apunta a un elemento del DOM?",
    opciones: [
      "Durante el render, apenas el elemento se crea en el JSX",
      "Después del commit, cuando React conecta el ref al nodo real",
      "Cuando lo lee el primer useEffect, que es quien dispara la asignación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Antes del commit, ref.current vale null. Por eso acceder al DOM vía ref se hace dentro de un useEffect o useLayoutEffect, nunca en el cuerpo del componente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuál es la pregunta clave para decidir entre useState y useRef para un valor?",
    opciones: [
      "Si el valor cambia seguido: useRef; si cambia poco, useState",
      "Si el valor es un objeto: useRef; si es un primitivo, useState",
      "Si el valor tiene que verse en la UI: useState; si es interno, useRef",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "useRef evita re-renders innecesarios para datos que nunca se muestran directamente, como el id de un timer o el valor anterior de una prop para comparar.",
  },
  {
    pregunta:
      "En React 19, ¿sigue haciendo falta forwardRef para pasarle un ref a un componente de función propio?",
    opciones: [
      "No: ref se recibe como cualquier otra prop",
      "Sí: sin forwardRef, React descarta el ref antes de llegar",
      "Solo si el componente es un Server Component",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Antes de React 19, React interceptaba ref especialmente y hacía falta envolver el componente en forwardRef((props, ref) => ...) para reenviarlo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué problema resuelve useImperativeHandle cuando un componente expone un ref hacia afuera?",
    opciones: [
      "Exponer el nodo del DOM de un hijo sin necesidad de forwardRef",
      "Exponer solo los métodos que tiene sentido usar, no el nodo completo",
      "Sincronizar el ref con el estado para que sus cambios disparen un render",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin useImperativeHandle, reenviar un ref expone todo el nodo del DOM, sin ningún control sobre qué se filtra hacia el consumidor externo del componente.",
  },
  {
    pregunta:
      "¿Qué ventaja tiene un callback ref sobre un ref de objeto (useRef)?",
    opciones: [
      "Se ejecuta en cada render, así que siempre tiene el nodo actualizado",
      "Permite leer el nodo durante el render, antes de que termine el commit",
      "React lo llama con el nodo al montar y con null al desmontar",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es especialmente útil para listas dinámicas donde se necesita un ref por item, guardando cada nodo en un Map dentro de la función callback.",
  },
];

export default function UseRefPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useRef"
      descripcion="useRef guarda un valor mutable que persiste entre renders sin disparar ninguno al cambiar. Esa diferencia con useState es la que define cuándo usar cada uno."
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
            <code>useRef</code> devuelve un objeto mutable con una única
            propiedad, <code>.current</code>, que persiste entre renders
            — igual que <code>useState</code>. La diferencia clave:
            cambiar <code>ref.current</code> NUNCA dispara un re-render,
            mientras que llamar al setter de useState siempre programa
            uno. useRef sirve para guardar datos que necesitan sobrevivir
            entre renders pero que NO deberían afectar visualmente lo que
            se muestra en pantalla.
          </p>
          <p>
            Uno de sus usos más comunes es acceder a un nodo del DOM:
            pasando el ref como prop especial (<code>{"<input ref={miRef} />"}</code>
            ), React lo conecta al nodo real durante el commit — antes de
            eso, <code>miRef.current</code> es <code>null</code>. Por eso
            leer un ref de DOM se hace dentro de un{" "}
            <code>useEffect</code>, nunca en el cuerpo del componente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar que cambiar ref.current actualice la UI.
            </strong>{" "}
            No dispara ningún render — si el usuario necesita ver ese
            cambio, tiene que ser useState.
          </li>
          <li>
            <strong className="text-foreground">
              Leer ref.current de un elemento del DOM en el cuerpo del
              componente.
            </strong>{" "}
            Todavía vale null hasta después del commit — hay que leerlo
            dentro de un efecto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Poner foco en un input al montar un formulario.
          </li>
          <li>
            Guardar el id de un setInterval o setTimeout para poder
            cancelarlo después, sin necesidad de mostrarlo en pantalla.
          </li>
          <li>
            Integrar una librería externa (un gráfico, un editor de
            texto) que necesita un nodo real del DOM.
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
            Este componente intenta mostrar cuántas veces se re-renderizó, pero siempre muestra 0. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Componente() {
  const renders = useRef(0);
  renders.current++;

  return <p>Renders: {renders.current}</p>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              En realidad <code>renders.current</code> sí se incrementa
              correctamente en cada render — el problema es otro: como
              cambiar un ref no dispara ningún re-render, este componente
              NUNCA se vuelve a renderizar solo, así que siempre queda
              mostrando el valor de su primer (y único) render.
            </p>
            <p className="mt-2">
              Si el objetivo es mostrar en pantalla cuántas veces
              renderizó, hace falta useState, precisamente porque su
              cambio SÍ dispara el re-render necesario para reflejar el
              nuevo valor:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Componente() {
  const [renders, setRenders] = useState(0);
  // (ejemplo simplificado: normalmente se incrementaría en un efecto)
  return <p>Renders: {renders}</p>;
}`}
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
            La pregunta clave para elegir entre <code>useState</code> y{" "}
            <code>useRef</code> es: ¿el usuario necesita VER este valor
            reflejado en la UI? Si sí, tiene que ser useState. Si el
            valor es puramente interno (el id de un timer, el valor
            anterior de una prop para comparar), useRef evita re-renders
            innecesarios sin ningún beneficio visual.
          </p>
          <p>
            En React 19, <code>ref</code> se puede declarar y recibir
            como cualquier otro prop en un componente de función, sin
            necesitar <code>forwardRef</code>. Antes, React interceptaba{" "}
            <code>ref</code> especialmente, y hacía falta envolver el
            componente explícitamente para reenviarlo a su DOM interno.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar useRef para un valor que la UI necesita reflejar.
            </strong>{" "}
            El cambio nunca se ve, porque no dispara re-render.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar pasar ref a un componente de función sin
              forwardRef en versiones anteriores a React 19.
            </strong>{" "}
            React tira un warning: los componentes de función no podían
            recibir refs directamente antes de esa versión.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            useRef para guardar el valor anterior de una prop y
            compararlo contra el actual, sin causar un render extra.
          </li>
          <li>
            Diseñar un componente de design system que reenvíe ref hacia
            su elemento nativo, aprovechando el prop ref directo de
            React 19.
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
            Cuando un componente reenvía un ref a su nodo del DOM interno,
            el consumidor externo obtiene acceso al nodo COMPLETO, sin
            control sobre qué se expone. <code>useImperativeHandle</code>{" "}
            permite exponer un objeto custom con solo los métodos que
            tiene sentido usar desde afuera, manteniendo una API pública
            controlada en vez de filtrar toda la implementación interna.
          </p>
          <p>
            Un ref de objeto (<code>useRef(null)</code>) es un contenedor
            pasivo: hay que leerlo dentro de un efecto para saber cuándo
            se conectó. Un{" "}
            <strong className="text-foreground">callback ref</strong> (
            <code>{"ref={(nodo) => {...}}"}</code>) es una función que
            React invoca directamente con el nodo al montar y con{" "}
            <code>null</code> al desmontar — útil para listas dinámicas
            donde se necesita un ref por item, o para reaccionar al
            instante exacto de conexión sin esperar un ciclo de efectos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Reenviar el nodo del DOM completo sin useImperativeHandle en
              un componente de librería reutilizable.
            </strong>{" "}
            Expone toda la implementación interna sin ningún control de
            API pública.
          </li>
          <li>
            <strong className="text-foreground">
              Usar useRef + useEffect cuando un callback ref resolvería
              lo mismo más directo.
            </strong>{" "}
            Para reaccionar al montaje/desmontaje de un nodo puntual, el
            callback ref evita la indirección de un efecto aparte.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            useImperativeHandle en un componente de Modal reutilizable,
            exponiendo solo open()/close() en vez del div interno
            completo.
          </li>
          <li>
            Callback refs para mantener un Map de nodos de una lista
            dinámica, usado por ejemplo para medir posiciones al
            implementar drag and drop.
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
