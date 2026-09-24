import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseReducer } from "@/lib/modules/hooks/use-reducer-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseReducer.filter((p) => p.nivel === 1),
  2: entrevistaUseReducer.filter((p) => p.nivel === 2),
  3: entrevistaUseReducer.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useReducer — Dev Study Lab",
  description:
    "useReducer centraliza la lógica de transición de estado en una función pura, testeable de forma aislada, en vez de repartirla entre varios useState y handlers.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué recibe y qué devuelve una función reducer?",
    opciones: [
      "Recibe el estado anterior y una acción, y devuelve el nuevo estado",
      "Recibe una acción y modifica el estado anterior en el lugar",
      "Recibe el estado y devuelve la acción que React tiene que aplicar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es la misma idea que array.reduce: en vez de mutar el estado anterior, el reducer calcula y devuelve el estado siguiente sin efectos secundarios.",
  },
  {
    pregunta: "¿Cuándo conviene useReducer en vez de varios useState sueltos?",
    opciones: [
      "Cuando el estado es un número o un booleano que cambia muy seguido",
      "Cuando varios estados relacionados cambian juntos según distintas acciones",
      "Cuando el estado tiene que compartirse entre varios componentes",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Centraliza la lógica de transición en una función testeable de forma aislada, en vez de repartirla entre varios handlers que actualizan useState por separado.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué el reducer debe ser una función pura, sin fetch ni efectos secundarios?",
    opciones: [
      "Porque el reducer corre en un worker sin acceso a fetch ni al DOM",
      "Porque React lo ejecuta en el servidor y no puede esperar promesas",
      "Porque React puede llamarlo más de una vez por acción, duplicando efectos",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un reducer puro también es trivial de testear: se le pasa un estado y una acción, y se compara el resultado, sin mocks ni entorno de renderizado.",
  },
  {
    pregunta:
      "¿Qué ventaja da el tercer argumento de useReducer (la función 'init')?",
    opciones: [
      "Calcula el estado inicial de forma perezosa, una sola vez al montar",
      "Resetea el estado al valor inicial cada vez que cambian las props",
      "Se ejecuta antes de cada acción para normalizar el estado",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es útil cuando el estado inicial depende de props y ese cálculo no es trivial, y permite reusar la misma función para resetear el estado en una acción de reset.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cómo se relaciona internamente useState con useReducer?",
    opciones: [
      "useReducer está implementado arriba de useState, con un switch encima",
      "useState es un useReducer cuyo reducer devuelve la acción como estado",
      "Son independientes: guardan su estado en estructuras internas distintas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso comparten garantías: identidad estable de dispatch/setter, mismo sistema de batching, y la misma comparación Object.is para decidir si programar un re-render.",
  },
  {
    pregunta:
      "¿Por qué useReducer + Context suele ser mejor que Context + varios useState sueltos?",
    opciones: [
      "Porque useReducer evita que los consumidores re-rendericen al cambiar el estado",
      "Porque Context no puede transportar varios useState, pero sí un solo reducer",
      "dispatch es estable y la lógica queda centralizada y testeable en el reducer",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Los componentes consumidores solo necesitan disparar una acción, no saber cómo se calcula el resultado — más limpio que exponer media docena de setters por Context.",
  },
];

export default function UseReducerPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useReducer"
      descripcion="useReducer centraliza la lógica de transición de estado en una función pura y testeable, en vez de repartirla entre varios useState y handlers dispersos."
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
            <code>useReducer</code> maneja estado a través de una función
            pura llamada &ldquo;reducer&rdquo;: recibe el estado ACTUAL y
            una &ldquo;acción&rdquo; (un objeto que describe qué pasó), y
            devuelve el NUEVO estado, sin mutar el anterior. Es la misma
            idea que <code>array.reduce</code>, aplicada a actualizaciones
            de estado: en vez de llamar directamente a un setter, se hace{" "}
            <code>{"dispatch({ tipo: 'incrementar' })"}</code>, y el
            reducer decide qué hacer con esa acción.
          </p>
          <p>
            Tiene sentido cuando hay varias piezas de estado relacionadas
            que cambian juntas según distintas acciones — un formulario
            con varios pasos, un estado de UI con transiciones tipo
            idle/cargando/éxito/error. Con useState disperso, esa lógica
            queda repartida en varios handlers; useReducer la centraliza
            en una sola función, fácil de testear de forma aislada sin
            renderizar ningún componente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar useReducer para un estado simple e independiente.
            </strong>{" "}
            Un booleano de toggle no necesita un reducer — es más
            complejidad de la que aporta.
          </li>
          <li>
            <strong className="text-foreground">
              Mutar el estado directamente dentro del reducer.
            </strong>{" "}
            El reducer debe devolver un objeto/valor NUEVO, no modificar
            el estado anterior in place.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un formulario multi-paso donde cada paso valida y actualiza
            distintas partes de un mismo estado.
          </li>
          <li>
            Un estado de petición async con transiciones bien definidas
            (idle, cargando, éxito con datos, error con mensaje).
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
            Este reducer tiene un bug: el estado nunca cambia visualmente. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function reducer(estado, accion) {
  if (accion.tipo === 'agregar') {
    estado.items.push(accion.item); // ⚠️
    return estado;
  }
  return estado;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El reducer MUTA el array <code>items</code> del estado
              anterior (con <code>push</code>) y después devuelve la
              MISMA referencia de <code>estado</code>. React compara el
              estado nuevo contra el anterior por referencia — como es
              literalmente el mismo objeto, React no detecta ningún
              cambio y no dispara el re-render.
            </p>
            <p className="mt-2">El fix es devolver un objeto/array nuevo, sin mutar el anterior:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function reducer(estado, accion) {
  if (accion.tipo === 'agregar') {
    return { ...estado, items: [...estado.items, accion.item] };
  }
  return estado;
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
            El reducer tiene que ser una función pura, sin fetch ni
            efectos secundarios: React puede llamarlo más de una vez para
            la misma actualización (por ejemplo, en Strict Mode, para
            ayudar a detectar impurezas). Un reducer puro también es
            trivial de testear: se le pasa un estado y una acción, se
            compara el resultado, sin mocks ni entorno de renderizado.
          </p>
          <p>
            El tercer argumento de <code>useReducer</code> (la función{" "}
            <code>init</code>) permite calcular el estado inicial de
            forma perezosa, igual que el lazy initializer de useState —
            útil cuando el estado inicial depende de props, y reutilizable
            para resetear el estado a su forma inicial sin duplicar
            lógica.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Hacer fetch o mutar algo externo dentro del reducer.
            </strong>{" "}
            Se dispara duplicado en Strict Mode, y rompe la testabilidad
            aislada del reducer.
          </li>
          <li>
            <strong className="text-foreground">
              Calcular el estado inicial directo en vez de usar la función init.
            </strong>{" "}
            Si el cálculo es costoso, se repite en cada render sin
            necesidad.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Modelar las acciones de un reducer complejo con un
            discriminated union de TypeScript, aprovechando exhaustiveness
            checking con never en el default del switch.
          </li>
          <li>
            Usar la función init para resetear un formulario a sus
            valores iniciales con una acción de reset, sin duplicar la
            lógica de inicialización.
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
            Internamente, <code>useState</code> es, conceptualmente, un
            caso particular de <code>useReducer</code> con un reducer
            trivial que devuelve la &ldquo;acción&rdquo; recibida como
            nuevo estado (o la ejecuta si es una función). Por eso ambos
            comparten las mismas garantías: identidad estable de{" "}
            <code>dispatch</code>/setter, el mismo sistema de batching, y
            la misma comparación <code>Object.is</code> para decidir si
            programar un re-render.
          </p>
          <p>
            Combinar useReducer con Context separa responsabilidades que
            Context + useState sueltos tienden a mezclar: el Context solo
            distribuye el estado actual y <code>dispatch</code> (estable,
            sin necesitar useCallback), mientras que TODA la lógica de
            transición queda centralizada y testeable en el reducer, en
            vez de dispersa en múltiples setters pasados también por
            Context.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Exponer media docena de setters individuales por Context en
              vez de un único dispatch.
            </strong>{" "}
            Dispersa la lógica de transición en vez de centralizarla en
            un reducer testeable.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que useReducer es una API completamente distinta de
              useState.
            </strong>{" "}
            Comparten el mismo mecanismo interno de fondo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un Context de estado global de la app que expone solo{" "}
            {"{ estado, dispatch }"}, con toda la lógica de transición en
            un reducer aparte, testeado sin renderizar componentes.
          </li>
          <li>
            Explicar en una entrevista la relación interna entre
            useState y useReducer para demostrar profundidad más allá del
            uso superficial de la API.
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
