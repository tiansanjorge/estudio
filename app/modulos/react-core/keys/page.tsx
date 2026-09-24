import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { KeysSimulador } from "@/components/modulo/KeysSimulador";
import { ListaConKeys } from "@/components/modulo/ListaConKeys";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosKeys } from "@/lib/modules/react-core/keys-escenarios";
import { entrevistaKeys } from "@/lib/modules/react-core/keys-entrevista";

const preguntasPorNivel = {
  1: entrevistaKeys.filter((p) => p.nivel === 1),
  2: entrevistaKeys.filter((p) => p.nivel === 2),
  3: entrevistaKeys.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Keys — Dev Study Lab",
  description:
    "React usa las keys para saber qué elemento de una lista es 'el mismo' entre renders. Elegirlas mal hace que el estado se pegue a la posición equivocada.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué usa React las keys en una lista?",
    opciones: [
      "Para ordenar la lista: React renderiza los elementos según el valor de su key",
      "Para saber qué elemento es 'el mismo' entre renders y decidir qué reutilizar",
      "Para indexar los elementos y acceder a ellos más rápido desde el DOM",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las keys son la forma en que React empareja elementos entre renders durante la reconciliación: con la misma key, reutiliza la instancia (y su estado); con una key distinta, la trata como un elemento nuevo.",
  },
  {
    pregunta: "¿Por qué usar el índice del array como key es riesgoso si la lista puede reordenarse?",
    opciones: [
      "Porque dos listas distintas en la misma página pueden repetir los mismos índices",
      "Porque React re-renderiza toda la lista cada vez que cambia su largo",
      "Porque React empareja por posición: al reordenar, el estado de una fila queda en otra",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Si insertás o eliminás en el medio de la lista, la posición de cada elemento cambia, pero su key (el índice) puede coincidir con la de otro dato distinto — React reutiliza esa instancia con su estado viejo pegado al dato nuevo.",
  },
  {
    pregunta: "¿Se puede leer el valor de key dentro del componente hijo como this.props.key o props.key?",
    opciones: [
      "No: React la usa para reconciliar y no la pasa como prop",
      "Sí, como props.key, igual que cualquier otra prop que le pases",
      "Solo en componentes de clase, leyendo this.props.key",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "key es un atributo especial que React consume para hacer el matching entre renders. Si el componente necesita ese valor, hay que pasarlo también como otro prop con otro nombre.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué pasa si le cambiás la key a un componente puntual (no a un elemento de lista)?",
    opciones: [
      "Nada: la key solo tiene efecto dentro de una lista renderizada con map",
      "React lo desmonta y monta uno nuevo, reseteando su estado: es una técnica deliberada",
      "React lo re-renderiza con las mismas props, pero conserva su estado interno",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es el patrón típico para resetear un formulario reutilizado entre distintos registros: key={registro.id} fuerza un reset completo al cambiar de registro, sin necesidad de un useEffect manual.",
  },
  {
    pregunta:
      "¿Cómo le asignás una key a un item de lista que necesita renderizar dos nodos raíz (dt y dd) sin un div extra?",
    opciones: [
      "Con la forma corta <key={id}>...</>, que acepta la key como único atributo",
      "Poniendo la misma key en el <dt> y en el <dd>, para que React los agrupe",
      "Con <React.Fragment key={id}>, porque la forma corta <>...</> no acepta props",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El Fragment abreviado no acepta props. Cuando un item de lista necesita más de un elemento raíz y también una key, hace falta la forma larga de Fragment.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué React puede reconciliar listas en tiempo lineal en vez de usar el algoritmo general de diffing de árboles (mucho más costoso)?",
    opciones: [
      "Por heurísticas: tipos distintos dan árboles distintos, y las keys emparejan elementos sin comparar todo",
      "Porque compara los elementos por su contenido serializado, que es más rápido que recorrer el árbol",
      "Porque mantiene un índice de todos los nodos del DOM y lo actualiza en cada commit",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El diffing general de árboles es O(n³). Las keys le permiten a React recorrer ambas listas una sola vez y saber exactamente qué mover, agregar o eliminar, en tiempo lineal.",
  },
  {
    pregunta:
      "Combinás usuarios y productos en una lista, ambos con id que puede coincidir numéricamente. ¿Qué riesgo hay si usás el id crudo como key?",
    opciones: [
      "Ninguno: React ya combina la key con el tipo de componente para distinguirlos",
      "Colisión entre hermanos: React no distingue el usuario 1 del producto 1",
      "Solo un warning en consola; el renderizado sigue siendo correcto",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las keys solo necesitan ser únicas entre hermanos de esa lista puntual. El fix es namespacar la key con el tipo de entidad, por ejemplo `usuario-${id}` y `producto-${id}`.",
  },
];

export default function KeysPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Keys"
      descripcion="Cuando React compara una lista entre renders, necesita saber qué elemento de antes es 'el mismo' que uno de ahora. Eso es exactamente para lo que sirve key."
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
            Cuando un componente renderiza una lista, React necesita
            emparejar cada elemento del render anterior con uno del
            render nuevo para decidir qué reutilizar, qué actualizar y
            qué eliminar. La <code>key</code> es el identificador que usa
            para ese emparejamiento — y solo necesita ser única entre los
            elementos <strong className="text-foreground">hermanos</strong>{" "}
            de esa lista, no en toda la app.
          </p>
          <p>
            El error clásico es usar el índice del array como key. Cuando
            la lista nunca cambia de orden ni gana/pierde elementos en el
            medio, no pasa nada. Pero en cuanto insertás o eliminás algo
            que no sea al final, los índices de los elementos existentes
            cambian — y React, emparejando por key, termina reutilizando
            una instancia (con su estado interno) para un dato que ya no
            es el mismo.
          </p>
          <p>
            La solución es usar un identificador{" "}
            <strong className="text-foreground">estable</strong>: algo
            que le pertenece al dato, no a su posición en el array (un id
            de base de datos, un UUID generado al crear el item).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <KeysSimulador escenarios={escenariosKeys} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ListaConKeys />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar el índice del array como key en listas que se reordenan o editan en el medio.
            </strong>{" "}
            Funciona visualmente la mayoría de las veces, hasta que algún
            elemento tiene estado propio (un input, un checkbox, una
            animación) — ahí aparece el bug.
          </li>
          <li>
            <strong className="text-foreground">
              Generar una key nueva en cada render (Math.random(), Date.now()).
            </strong>{" "}
            Es peor que el índice: React nunca reconoce ningún elemento
            como &ldquo;el mismo&rdquo;, así que remonta toda la lista en
            cada render.
          </li>
          <li>
            <strong className="text-foreground">
              Keys duplicadas entre hermanos.
            </strong>{" "}
            React no puede distinguir esos elementos — el comportamiento
            queda indefinido y React avisa con un warning en consola.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el id que ya viene de la base de datos o la API como
            key, en vez de generarlo en el cliente.
          </li>
          <li>
            Cuando no hay id natural, generarlo una sola vez al crear el
            item (por ejemplo con <code>crypto.randomUUID()</code>), no
            en cada render.
          </li>
          <li>
            El índice SÍ es una key aceptable cuando la lista es
            estrictamente estática: nunca se reordena, ni se inserta ni
            se elimina nada en el medio.
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
            Cada fila tiene un input editable. Si eliminás la tarea del
            medio, el texto de otro input aparece en el lugar
            equivocado. ¿Por qué, y cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function ListaEditable({ tareas, onEliminar }) {
  return (
    <ul>
      {tareas.map((tarea, index) => (
        <li key={index}>
          <CampoEditable valorInicial={tarea.texto} />
          <button onClick={() => onEliminar(index)}>Eliminar</button>
        </li>
      ))}
    </ul>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>CampoEditable</code> mantiene su propio estado interno
              (lo que el usuario tipeó) ligado a la instancia del
              componente, no al dato <code>tarea</code>. Al usar el
              índice como key, eliminar un elemento del medio corre las
              keys de todos los que venían después — React reutiliza esas
              instancias con el texto que el usuario ya había tipeado,
              ahora asociado a la tarea equivocada.
            </p>
            <p className="mt-2">El fix es usar el id de cada tarea como key:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`{tareas.map((tarea) => (
  <li key={tarea.id}>
    <CampoEditable valorInicial={tarea.texto} />
    <button onClick={() => onEliminar(tarea.id)}>Eliminar</button>
  </li>
))}`}
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
            Cambiar la <code>key</code> de un componente puntual (no de un
            elemento de lista) fuerza a React a desmontar la instancia
            vieja y montar una nueva, con todo su estado reinicializado —
            una técnica deliberada. Es el patrón típico para un
            formulario de edición reutilizado entre distintos registros:{" "}
            <code>key={"{registro.id}"}</code> resetea todo el estado
            interno al cambiar de registro, sin useEffect manual.
          </p>
          <p>
            Cuando un item de lista necesita renderizar más de un nodo
            raíz (por ejemplo <code>&lt;dt&gt;</code> y{" "}
            <code>&lt;dd&gt;</code>) sin envolverlos en un div extra, hace
            falta la forma larga de Fragment (
            <code>{"<React.Fragment key={id}>"}</code>), porque la
            abreviada <code>{"<>...</>"}</code> no acepta props.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Cambiar una key sin querer y sorprenderse por la pérdida de
              estado.
            </strong>{" "}
            Un cambio de key siempre implica desmontaje/montaje completo,
            sea intencional o accidental.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidar la key en un Fragment de un item con múltiples nodos
              raíz.
            </strong>{" "}
            React sigue necesitando emparejar ese item con los del render
            anterior, aunque el contenido sean dos elementos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Resetear un formulario de edición reutilizado con key={"{"}id
            del registro{"}"}, evitando lógica manual de limpieza de
            estado.
          </li>
          <li>
            Usar Fragment con key en una lista de definiciones que
            renderiza pares dt/dd sin div extra.
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
            El problema general de encontrar la diferencia mínima entre
            dos árboles es computacionalmente costoso (O(n³)). React lo
            evita con dos heurísticas: tipos de elemento distintos
            producen árboles distintos (reemplaza directo, sin comparar
            contenido interno), y las keys le permiten emparejar
            elementos de listas entre renders sin comparar todo el árbol
            — recorriendo ambas listas una sola vez, en tiempo lineal.
          </p>
          <p>
            Las keys solo necesitan ser únicas entre{" "}
            <strong className="text-foreground">hermanos</strong>. Si se
            combinan arrays de fuentes distintas con ids que pueden
            coincidir numéricamente, usar el id crudo como key genera una
            colisión real — el fix es namespacar la key con el tipo de
            entidad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Combinar listas de fuentes distintas sin namespacar la key.
            </strong>{" "}
            Ids que coinciden numéricamente entre entidades distintas
            colisionan como hermanos en la lista combinada.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que las keys deben ser únicas en toda la app.
            </strong>{" "}
            Solo necesitan serlo entre hermanos de esa lista puntual.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Namespacar keys con el tipo de entidad al renderizar un feed
            combinado de distintas fuentes de datos (posts, anuncios,
            sugerencias).
          </li>
          <li>
            Auditar listas grandes donde los ids vienen de sistemas
            distintos (una API interna y una externa) como fuente
            probable de colisiones de key.
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
