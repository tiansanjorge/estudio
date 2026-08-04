import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { VirtualDomSimulador } from "@/components/modulo/VirtualDomSimulador";
import { CostoDomDemo } from "@/components/modulo/CostoDomDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { pasosVirtualDom } from "@/lib/modules/react-rendering/virtual-dom-escenarios";

export const metadata: Metadata = {
  title: "Virtual DOM — Dev Study Lab",
  description:
    "El Virtual DOM no es una tecnología misteriosa: son árboles de objetos JavaScript planos, baratos de crear y comparar, antes de tocar el DOM real.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es, literalmente, un elemento de React (lo que devuelve React.createElement)?",
    opciones: [
      "Un nodo del DOM real, todavía sin insertar",
      "Un objeto JavaScript plano con type y props",
      "Un string de HTML",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un elemento de React es un objeto común: { type: 'button', props: {...} }. No toca el DOM ni sabe nada del navegador — es la 'materia prima' del Virtual DOM.",
  },
  {
    pregunta: "¿Por qué es más barato crear y comparar objetos del Virtual DOM que manipular el DOM real directamente?",
    opciones: [
      "Porque los objetos JS son mágicamente más rápidos por definición",
      "Porque un nodo DOM real es un objeto pesado del navegador, y crearlo o mutarlo puede disparar cálculos de layout y repintado",
      "Porque el Virtual DOM usa un lenguaje distinto a JavaScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El costo real está del lado del DOM: cada mutación puede disparar trabajo interno del navegador (layout, estilos, repintado). Comparar objetos JS planos no toca nada de eso.",
  },
  {
    pregunta: "¿Es cierto que 'el Virtual DOM siempre hace que React sea más rápido que JavaScript vanilla'?",
    opciones: [
      "Sí, siempre, en cualquier escenario",
      "No necesariamente: código vanilla bien optimizado a mano puede ser más rápido; el valor real del Virtual DOM es poder escribir UI declarativa sin perder demasiado rendimiento",
      "No, el Virtual DOM siempre es más lento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un mito común. El Virtual DOM no gana benchmarks contra manipulación DOM optimizada a mano — su valor es dejar escribir 'así debería verse la UI' de forma declarativa, mientras mantiene un rendimiento razonable evitando tocar el DOM de más.",
  },
];

export default function VirtualDomPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Virtual DOM"
      descripcion="El Virtual DOM no es una pieza más de infraestructura misteriosa: es, literalmente, el árbol de objetos JS que ya venimos usando en Render, Reconciliation y Commit."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Medición real en tu navegador, no un número inventado.
        </p>
        <CostoDomDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
