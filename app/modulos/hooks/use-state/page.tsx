import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseState } from "@/lib/modules/hooks/use-state-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseState.filter((p) => p.nivel === 1),
  2: entrevistaUseState.filter((p) => p.nivel === 2),
  3: entrevistaUseState.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useState — Dev Study Lab",
  description:
    "React identifica cada hook por el orden exacto en que se llama, no por nombre. Esa regla explica por qué los hooks condicionales rompen todo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué no se puede llamar a useState dentro de un if?",
    opciones: [
      "Es solo una convención de estilo recomendada",
      "React identifica cada hook por el orden exacto en que se llama; un hook condicional cambia ese orden entre renders y desalinea todos los hooks",
      "JavaScript no permite hooks dentro de bloques condicionales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React guarda los hooks en una lista interna por orden de llamada, no por nombre. Si el orden cambia entre renders, React empareja mal cada llamada con su estado correspondiente.",
  },
  {
    pregunta: "¿Cuándo conviene usar la forma de función (lazy initializer) en useState?",
    opciones: [
      "Siempre, es la única forma correcta",
      "Cuando calcular el valor inicial es costoso, para que solo se ejecute una vez en el montaje",
      "Nunca, agrega complejidad innecesaria",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Pasar el valor directo ejecuta el cálculo en cada render, aunque el resultado se descarte después del primero. La forma de función solo se ejecuta en el montaje.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo conviene agrupar datos relacionados en un solo useState con un objeto, en vez de varios useState separados?",
    opciones: [
      "Siempre es mejor un solo objeto para todo el estado",
      "Cuando esos valores casi siempre cambian juntos (como x e y de una posición), para mantenerlos atómicos entre renders",
      "Nunca, siempre conviene separar cada valor",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si se actualizan de forma independiente la mayoría de las veces, separarlos es más simple. Si siempre cambian juntos, un objeto evita estados intermedios inconsistentes.",
  },
  {
    pregunta:
      "¿Hace falta incluir el setter de useState en el array de dependencias de un useEffect?",
    opciones: [
      "Sí, siempre, o el linter falla",
      "No, React garantiza que su identidad es estable entre renders — nunca cambia mientras el componente esté montado",
      "Solo si el setter se usa dentro de una condición",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es la misma garantía de estabilidad que tiene el objeto devuelto por useRef. Los linters de exhaustive-deps lo saben y no lo marcan como dependencia faltante.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "const [operacion] = useState(suma) donde suma es una función — ¿qué guarda operacion?",
    opciones: [
      "La función suma sin ejecutar",
      "El resultado de EJECUTAR suma, porque React trata cualquier función pasada a useState como lazy initializer",
      "undefined, porque useState no acepta funciones",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para guardar una función como valor de estado hay que envolverla: useState(() => suma), así React ejecuta la función externa (que devuelve suma) en vez de ejecutar suma directamente.",
  },
  {
    pregunta:
      "¿Dónde guarda React internamente el estado de cada useState de un componente?",
    opciones: [
      "En una variable global indexada por nombre de componente",
      "En una lista enlazada de hooks colgando del fiber del componente, en el orden exacto de las llamadas",
      "En el DOM, como un atributo data-*",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React avanza un puntero por esa lista en cada render, en el mismo orden. Un hook condicional desalinea ese puntero respecto a los nodos reales, devolviendo el estado equivocado.",
  },
];

export default function UseStatePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useState"
      descripcion="React identifica cada hook por el orden exacto en que se llama en cada render, no por nombre ni ningún otro identificador — esa regla de fondo explica casi todo lo demás sobre cómo usarlo bien."
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <code>useState</code> le da a un componente una variable que
            persiste entre renders y una función para actualizarla. React
            no identifica cada llamada a <code>useState</code> por nombre
            de variable — las guarda en una lista interna, en el ORDEN
            exacto en que se llamaron. Por eso los hooks tienen que
            llamarse siempre en el mismo orden, en cada render: si una
            llamada es condicional (dentro de un if, después de un return
            temprano), el orden cambia entre renders y React empareja mal
            cada hook con su estado correspondiente.
          </p>
          <p>
            Cuando calcular el valor inicial es costoso, conviene la
            forma de función (<em>lazy initializer</em>):{" "}
            <code>{"useState(() => calculoCostoso())"}</code> en vez de{" "}
            <code>{"useState(calculoCostoso())"}</code>. La segunda forma
            ejecuta el cálculo en CADA render, aunque el resultado se
            descarte después del primero; la primera solo lo ejecuta una
            vez, en el montaje.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Llamar a useState dentro de un if, un loop, o después de un
              return temprano.
            </strong>{" "}
            Rompe el orden que React necesita para identificar cada hook
            correctamente entre renders.
          </li>
          <li>
            <strong className="text-foreground">
              Pasar un cálculo costoso directo en vez de la forma de
              función.
            </strong>{" "}
            Se ejecuta en cada render sin necesidad, aunque el resultado
            solo se use en el primero.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Cualquier dato que cambia por interacción del usuario y
            necesita disparar un re-render: contadores, toggles, valores
            de formulario.
          </li>
          <li>
            Lazy initializer para leer y parsear un valor de localStorage
            solo una vez, al montar el componente.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>¿Por qué este componente falla de forma impredecible al alternar mostrarExtra?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Formulario({ mostrarExtra }) {
  if (mostrarExtra) {
    const [extra, setExtra] = useState('');
  }
  const [nombre, setNombre] = useState('');
  return <input value={nombre} onChange={(e) => setNombre(e.target.value)} />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Cuando <code>mostrarExtra</code> es <code>true</code>, hay
              dos llamadas a <code>useState</code>; cuando es{" "}
              <code>false</code>, solo hay una. El &quot;orden&quot; de{" "}
              <code>nombre</code> en la lista interna de hooks cambia
              entre esos dos casos — React puede terminar devolviéndole
              a <code>nombre</code> el estado que le correspondía a{" "}
              <code>extra</code>, o viceversa.
            </p>
            <p className="mt-2">
              El fix es que ningún hook dependa de una condición: ambos{" "}
              <code>useState</code> deben llamarse siempre, sin importar
              el valor de <code>mostrarExtra</code>, y usar esa condición
              solo para decidir qué renderizar, no qué hooks llamar.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Agrupar datos relacionados en un solo <code>useState</code>{" "}
            con un objeto tiene sentido cuando esos valores casi siempre
            cambian juntos (por ejemplo, x e y de una posición) — evita un
            render intermedio donde uno cambió y el otro no. Cuando se
            actualizan de forma independiente la mayoría de las veces,
            separarlos en <code>useState</code> individuales es más
            simple: no hace falta hacer spread del objeto anterior en
            cada actualización parcial.
          </p>
          <p>
            No hace falta incluir el setter de <code>useState</code> en el
            array de dependencias de un <code>useEffect</code> — React
            garantiza que su identidad es{" "}
            <strong className="text-foreground">estable</strong> entre
            renders, la misma garantía que tiene el objeto de{" "}
            <code>useRef</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Agrupar en un objeto y olvidarse el spread en una
              actualización parcial.
            </strong>{" "}
            Borra silenciosamente las demás propiedades del objeto.
          </li>
          <li>
            <strong className="text-foreground">
              Incluir el setter en un array de dependencias &quot;por las
              dudas&quot;.
            </strong>{" "}
            No rompe nada, pero es ruido innecesario — su identidad nunca
            cambia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un objeto { "{ x, y }" } para la posición de un elemento
            arrastrable, manteniendo ambos valores siempre sincronizados.
          </li>
          <li>
            useState separados para cada campo de un formulario simple,
            donde el usuario edita uno por vez.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            React interpreta CUALQUIER función pasada a{" "}
            <code>useState</code> (o a su setter) como un lazy
            initializer/updater, y la EJECUTA para obtener el valor real
            — nunca la guarda tal cual. Para guardar una función como el
            dato de estado en sí, hay que envolverla:{" "}
            <code>{"useState(() => miFuncion)"}</code>.
          </p>
          <p>
            Internamente, cada fiber tiene una lista enlazada de hooks, en
            el orden exacto en que se llamaron la primera vez. En cada
            render, React avanza un puntero por esa lista, en el mismo
            orden, para saber qué nodo corresponde a cada llamada — el
            mismo mecanismo que explica por qué los hooks condicionales
            desalinean todo el estado del componente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Guardar una función como estado sin envolverla en un lazy
              initializer.
            </strong>{" "}
            React la ejecuta de inmediato, guardando su resultado en vez
            de la función misma.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que el orden de los hooks es solo una convención de
              estilo.
            </strong>{" "}
            Es un requisito estructural: React depende de él para
            recorrer correctamente la lista enlazada de hooks del fiber.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Guardar un callback como valor de estado (por ejemplo, una
            función de validación seleccionable dinámicamente) usando el
            patrón de lazy initializer correctamente.
          </li>
          <li>
            Explicar en una entrevista de nivel staff, con precisión
            técnica, por qué los hooks condicionales rompen React —
            conectando con la estructura de Fiber vista antes.
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
