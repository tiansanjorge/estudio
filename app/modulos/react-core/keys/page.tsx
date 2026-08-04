import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { KeysSimulador } from "@/components/modulo/KeysSimulador";
import { ListaConKeys } from "@/components/modulo/ListaConKeys";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosKeys } from "@/lib/modules/react-core/keys-escenarios";

export const metadata: Metadata = {
  title: "Keys — Frontend Study Lab",
  description:
    "React usa las keys para saber qué elemento de una lista es 'el mismo' entre renders. Elegirlas mal hace que el estado se pegue a la posición equivocada.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué usa React las keys en una lista?",
    opciones: [
      "Solo para ordenar los elementos alfabéticamente",
      "Para identificar qué elemento es 'el mismo' entre un render y el siguiente, y decidir qué reutilizar",
      "Para aplicarles estilos CSS únicos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las keys son la forma en que React empareja elementos entre renders durante la reconciliación: con la misma key, reutiliza la instancia (y su estado); con una key distinta, la trata como un elemento nuevo.",
  },
  {
    pregunta: "¿Por qué usar el índice del array como key es riesgoso si la lista puede reordenarse?",
    opciones: [
      "Porque React tarda más en calcular índices",
      "Porque React empareja por posición: si el orden cambia, termina asociando el estado de una fila con datos de otra",
      "Porque los índices no son números válidos como key",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si insertás o eliminás en el medio de la lista, la posición de cada elemento cambia, pero su key (el índice) puede coincidir con la de otro dato distinto — React reutiliza esa instancia con su estado viejo pegado al dato nuevo.",
  },
  {
    pregunta: "¿Se puede leer el valor de key dentro del componente hijo como this.props.key o props.key?",
    opciones: [
      "Sí, siempre",
      "No, React la reserva internamente para reconciliación y no la expone como prop",
      "Solo en componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "key es un atributo especial que React consume para hacer el matching entre renders. Si el componente necesita ese valor, hay que pasarlo también como otro prop con otro nombre.",
  },
];

export default function KeysPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Keys"
      descripcion="Cuando React compara una lista entre renders, necesita saber qué elemento de antes es 'el mismo' que uno de ahora. Eso es exactamente para lo que sirve key."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
