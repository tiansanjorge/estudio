import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { VirtualDomSimulador } from "@/components/modulo/VirtualDomSimulador";
import { CostoDomDemo } from "@/components/modulo/CostoDomDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { pasosVirtualDom } from "@/lib/modules/react-rendering/virtual-dom-escenarios";
import { entrevistaVirtualDom } from "@/lib/modules/react-rendering/virtual-dom-entrevista";

const preguntasPorNivel = {
  1: entrevistaVirtualDom.filter((p) => p.nivel === 1),
  2: entrevistaVirtualDom.filter((p) => p.nivel === 2),
  3: entrevistaVirtualDom.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Virtual DOM — Dev Study Lab",
  description:
    "El Virtual DOM no es una tecnología misteriosa: son árboles de objetos JavaScript planos, baratos de crear y comparar, antes de tocar el DOM real.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es, literalmente, un elemento de React (lo que devuelve React.createElement)?",
    opciones: [
      "Un objeto JavaScript plano con type y props",
      "Un nodo del DOM creado fuera del documento",
      "Una instancia de la clase del componente",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Un elemento de React es un objeto común: { type: 'button', props: {...} }. No toca el DOM ni sabe nada del navegador — es la 'materia prima' del Virtual DOM.",
  },
  {
    pregunta: "¿Por qué es más barato crear y comparar objetos del Virtual DOM que manipular el DOM real directamente?",
    opciones: [
      "Porque el Virtual DOM se procesa en la GPU y el DOM real en la CPU",
      "Porque un nodo real es pesado y mutarlo puede disparar layout y repintado",
      "Porque el DOM real se sincroniza con el servidor en cada modificación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El costo real está del lado del DOM: cada mutación puede disparar trabajo interno del navegador (layout, estilos, repintado). Comparar objetos JS planos no toca nada de eso.",
  },
  {
    pregunta: "¿Es cierto que 'el Virtual DOM siempre hace que React sea más rápido que JavaScript vanilla'?",
    opciones: [
      "Sí: siempre hace menos operaciones sobre el DOM que cualquier código manual equivalente",
      "Sí, salvo en listas muy cortas, donde el costo del diffing no llega a compensarse",
      "No: el vanilla optimizado puede ganar; el valor es poder escribir UI declarativa",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es un mito común. El Virtual DOM no gana benchmarks contra manipulación DOM optimizada a mano — su valor es dejar escribir 'así debería verse la UI' de forma declarativa, mientras mantiene un rendimiento razonable evitando tocar el DOM de más.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Crear el árbol de elementos de React en cada render tiene costo cero?",
    opciones: [
      "No: es barato pero medible en árboles grandes, y memo también ahorra ese costo",
      "Sí: los elementos son objetos que React reutiliza de un render al otro sin volver a crearlos",
      "Sí: el único costo real aparece cuando React muta el DOM durante la fase de commit",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "En árboles grandes con muchos re-renders innecesarios, el costo acumulado de crear objetos se nota. Memo evita re-ejecutar la función y recrear esa porción del árbol.",
  },
  {
    pregunta:
      "¿Cómo evitan frameworks como Solid o Svelte el Virtual DOM por completo?",
    opciones: [
      "Mutando el DOM en cada cambio de estado, sin ningún tipo de diffing",
      "Con reactividad fina: el compilador sabe qué nodo depende de qué estado",
      "Renderizando todo en el servidor y mandando al cliente solo HTML",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El trade-off es distinto: menos overhead por actualización, a cambio de un modelo mental diferente (los componentes no se re-ejecutan como funciones) y mayor dependencia de un paso de compilación inteligente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Para qué sirve la propiedad interna $$typeof (un Symbol) en los elementos de React?",
    opciones: [
      "Para que React distinga elementos de componentes de clase y de función",
      "Para que el reconciler compare tipos más rápido que por string",
      "Para frenar XSS: un objeto inyectado vía JSON no puede traer un Symbol real",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Si datos controlados por un atacante se guardan como JSON y se intentan hacer pasar por un elemento de React, nunca van a tener el $$typeof real — React los rechaza como elementos válidos.",
  },
  {
    pregunta:
      "¿Por qué React usa delegación de eventos en la raíz en vez de un listener nativo por cada elemento con onClick?",
    opciones: [
      "Porque un listener en la raíz sale mucho más barato que miles de listeners sueltos",
      "Porque los listeners nativos no funcionan sobre elementos que React crea y destruye seguido",
      "Porque los eventos nativos no burbujean fuera de los portales y así se perderían",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Desde React 17, ese listener se adjunta al contenedor de cada raíz de React (no a document), permitiendo que múltiples versiones de React convivan en la misma página sin interferir entre sí.",
  },
];

export default function VirtualDomPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Virtual DOM"
      descripcion="El Virtual DOM no es una pieza más de infraestructura misteriosa: es, literalmente, el árbol de objetos JS que ya venimos usando en Render, Reconciliation y Commit."
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
            Cuando escribís JSX, el compilador lo convierte en llamados a{" "}
            <code>React.createElement()</code>. Esa función no toca el
            DOM ni sabe nada del navegador — devuelve un{" "}
            <strong className="text-foreground">objeto JavaScript plano</strong>{" "}
            con un <code>type</code> y unas <code>props</code>. Un árbol
            de esos objetos es, literalmente, lo que se conoce como
            &ldquo;Virtual DOM&rdquo;.
          </p>
          <p>
            La razón de ser de esto es de costo: un nodo del DOM real es
            un objeto pesado del navegador, con cientos de propiedades y
            métodos heredados, y tocarlo puede disparar trabajo interno
            caro (recalcular layout, estilos, repintar). Crear y comparar
            objetos JS planos, en cambio, es prácticamente gratis. React
            aprovecha esa diferencia: arma el árbol nuevo en objetos
            livianos (Render), lo compara con el anterior (Reconciliation)
            y recién con ese resultado toca el DOM real lo mínimo posible
            (Commit).
          </p>
          <p>
            Un mito común: que el Virtual DOM hace a React
            &ldquo;más rápido que JavaScript&rdquo; en general. No es
            así — manipulación DOM optimizada a mano puede ganarle en
            benchmarks puntuales. El valor real es otro: escribir{" "}
            <em>qué debería mostrarse</em> de forma declarativa, sin
            perder un rendimiento razonable, en vez de programar a mano
            cada mutación imperativa del DOM.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <VirtualDomSimulador pasos={pasosVirtualDom} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Medición real en tu navegador, no un número inventado.
        </p>
        <CostoDomDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Repetir que &apos;React es rápido porque usa Virtual DOM&apos; sin matices.
            </strong>{" "}
            Es una simplificación excesiva. El Virtual DOM ayuda a
            minimizar el trabajo sobre el DOM real, pero no es magia que
            garantice velocidad en cualquier escenario.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que el Virtual DOM es una tecnología separada del render normal.
            </strong>{" "}
            No es un sistema aparte: es simplemente cómo se llaman los
            árboles de elementos que ya se producen en cada render.
          </li>
          <li>
            <strong className="text-foreground">
              Manipular el DOM real manualmente (fuera de React) sin necesidad.
            </strong>{" "}
            Se pierde la comparación barata en objetos JS y se vuelve a
            pagar el costo caro de tocar el DOM directamente, sin que
            React pueda optimizar nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Entender que un componente que renderiza distinto en cada
            llamado (por ejemplo, con <code>Math.random()</code> en el
            JSX) sigue siendo barato de calcular — el costo real
            aparece recién si eso se traduce en mutaciones reales del
            DOM.
          </li>
          <li>
            Explicar con precisión por qué evitar re-renders innecesarios
            (con memoización) ayuda: menos árboles de objetos que armar
            y comparar, no menos HTML &ldquo;mágico&rdquo;.
          </li>
          <li>
            Reconocer cuándo una librería de animación necesita
            manipular el DOM directamente (fuera del ciclo de React) por
            performance, y por qué eso es una excepción deliberada, no
            la norma.
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
            Un compañero dice: &ldquo;Vamos a reescribir esta pantalla en
            JS puro, sin React, porque el Virtual DOM le agrega overhead
            innecesario y la va a hacer más lenta&rdquo;. ¿Qué le
            responderías con lo que aprendiste acá?
          </p>
          <RevelarSolucion>
            <p>
              No es necesariamente cierto que reescribirla en JS puro la
              vaya a hacer más rápida — depende de qué tan bien
              optimizada quede esa reescritura. El Virtual DOM sí agrega
              un costo (crear y comparar objetos JS), pero ese costo es
              mucho menor que el que ahorra al evitar tocar el DOM real
              de más.
            </p>
            <p className="mt-2">
              La pregunta correcta no es &ldquo;Virtual DOM sí o
              no&rdquo; en abstracto, sino si esa pantalla puntual tiene
              un cuello de botella de performance medido de verdad (con
              el Profiler), y si ese cuello de botella viene de renders
              innecesarios (solucionable con memoización, sin salir de
              React) o de algo que realmente necesita manipulación DOM
              directa (animaciones muy finas, por ejemplo).
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
            Crear el árbol de elementos en cada render es barato, pero no
            gratis: en árboles grandes o profundamente anidados, tiene un
            costo medible, sobre todo si un padre re-renderiza hijos que
            no necesitaban recalcular nada. Por eso{" "}
            <code>React.memo</code> tiene un efecto real más allá de
            evitar mutaciones del DOM: evita re-ejecutar la función y
            recrear esa porción del árbol de elementos, ahorrando también
            ese costo de creación de objetos.
          </p>
          <p>
            Frameworks como Solid o Svelte evitan el Virtual DOM por
            completo con{" "}
            <strong className="text-foreground">
              reactividad de grano fino
            </strong>
            : el compilador sabe de antemano qué nodo del DOM depende de
            qué pieza de estado, y genera código que actualiza ESE nodo
            directamente, sin re-ejecutar funciones de componente ni
            diffear ningún árbol. El trade-off es menos overhead por
            actualización, a cambio de un modelo mental distinto y mayor
            dependencia de un compilador inteligente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que memo solo ahorra mutaciones del DOM.
            </strong>{" "}
            También ahorra la creación del árbol de elementos, que tiene
            costo propio en árboles grandes.
          </li>
          <li>
            <strong className="text-foreground">
              Comparar el modelo de React con Solid/Svelte sin entender
              el trade-off.
            </strong>{" "}
            No es &quot;uno mejor que el otro&quot; en abstracto — son
            modelos mentales distintos con costos distintos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver en React.memo componentes de listas grandes donde la
            mayoría de los items no cambia entre renders del padre.
          </li>
          <li>
            Explicar en una entrevista el trade-off entre el modelo de
            React (VDOM + diffing) y el de frameworks con reactividad de
            grano fino, con criterio y sin caer en &quot;X es mejor que
            Y&quot;.
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
            Cada elemento de React lleva internamente{" "}
            <code>{"$$typeof: Symbol.for('react.element')"}</code>. Esto
            previene un vector de XSS específico: JSON no puede
            serializar Symbols, así que un objeto malicioso inyectado vía
            JSON (por ejemplo, desde una API comprometida) nunca puede
            tener ese <code>$$typeof</code> real, aunque imite la forma
            exacta de un elemento — React lo rechaza como elemento
            válido.
          </p>
          <p>
            React usa{" "}
            <strong className="text-foreground">
              delegación de eventos
            </strong>{" "}
            en vez de un listener nativo por cada elemento: un único
            listener en la raíz del árbol reduce drásticamente el costo
            de crear y destruir nodos con handlers. Desde React 17, ese
            listener se adjunta al contenedor de cada raíz de React (no a{" "}
            <code>document</code>), permitiendo que múltiples versiones
            de React convivan en la misma página sin interferir entre sí.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en que cualquier objeto con forma de elemento de
              React es seguro de renderizar.
            </strong>{" "}
            El $$typeof es precisamente la defensa contra eso cuando el
            dato viene de una fuente no confiable.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que cada onClick agrega un listener nativo nuevo al
              DOM.
            </strong>{" "}
            React delega desde la raíz; el costo de agregar handlers es
            prácticamente nulo comparado con listeners nativos por nodo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Explicar en una entrevista de seguridad por qué renderizar
            JSON no confiable directamente como &quot;elemento de
            React&quot; no es un vector de XSS viable, gracias al
            $$typeof.
          </li>
          <li>
            Entender por qué migrar múltiples apps de React a una sola
            página (micro-frontends) es más seguro desde React 17, gracias
            al cambio de listener raíz por document.
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
