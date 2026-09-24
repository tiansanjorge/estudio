import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { FocoDialogoSimulador } from "@/components/modulo/FocoDialogoSimulador";
import { entrevistaFocusManagement } from "@/lib/modules/accesibilidad/focus-management-entrevista";

const preguntasPorNivel = {
  1: entrevistaFocusManagement.filter((p) => p.nivel === 1),
  2: entrevistaFocusManagement.filter((p) => p.nivel === 2),
  3: entrevistaFocusManagement.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Focus management — Dev Study Lab",
  description:
    "Dónde está el foco en cada momento: modales, navegación en SPAs, elementos que se desmontan, y el indicador de foco visible.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Al cerrar un modal, ¿a dónde debería volver el foco?",
    opciones: [
      "Al inicio del documento",
      "Al elemento que abrió el modal",
      "A ningún lado, el navegador lo decide",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Así el usuario de teclado sigue exactamente donde estaba antes de abrirlo.",
  },
  {
    pregunta: "¿Qué pseudo-clase permite mostrar el indicador de foco solo a usuarios de teclado?",
    opciones: [":focus", ":focus-visible", ":hover"],
    respuestaCorrecta: 1,
    explicacion:
      "El navegador aplica :focus-visible cuando el foco llega por teclado, no al hacer click con el mouse.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "En una SPA, ¿qué pasa con el foco al navegar a otra ruta si no hacés nada?",
    opciones: [
      "Vuelve al inicio del documento, como en una carga normal",
      "Queda en el link clickeado (o se pierde) y el lector no anuncia el cambio",
      "Se mueve al h1 de la nueva página automáticamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "No hay carga de documento nueva, así que el comportamiento del navegador hay que replicarlo a mano.",
  },
  {
    pregunta: "El usuario borra el ítem enfocado de una lista. ¿Qué conviene hacer con el foco?",
    opciones: [
      "Nada, el navegador lo mueve al ítem siguiente",
      "Moverlo explícitamente al ítem vecino o al título si la lista quedó vacía",
      "Recargar la página",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si no se maneja, el foco cae al body y el usuario pierde su lugar.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace showModal() de <dialog> que un focus trap manual con Tab no hace?",
    opciones: [
      "Nada, son equivalentes",
      "Vuelve inerte el resto de la página, también para los comandos de lectura del lector de pantalla",
      "Solo agrega una animación de entrada",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los lectores navegan sin Tab (modo lectura); solo sacar el fondo del árbol lo bloquea de verdad.",
  },
  {
    pregunta: "¿Para qué se usa tabIndex={-1}?",
    opciones: [
      "Para ocultar el elemento visualmente",
      "Para hacerlo enfocable por código sin agregarlo al recorrido con Tab",
      "Para que sea el primero en el orden de Tab",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es el valor para destinos de foco programático, como un h1 al navegar.",
  },
];

export default function FocusManagementPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Accesibilidad"
      titulo="Focus management"
      descripcion="Dónde está el foco en cada momento, y quién es responsable de moverlo cuando la interfaz cambia sin que el navegador lo sepa."
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
            El foco es el elemento que recibe la entrada del teclado. Para
            quien navega con teclado o lector de pantalla, es su posición en
            la página. El navegador lo maneja bien en páginas estáticas, pero
            cuando la interfaz cambia por JavaScript (un modal que aparece, un
            elemento que se borra, una ruta nueva) el navegador no sabe a
            dónde debería ir: esa decisión es tuya.
          </p>
          <p>
            El caso canónico es el modal:{" "}
            <strong className="text-foreground">mover</strong> el foco adentro
            al abrir, <strong className="text-foreground">contenerlo</strong>{" "}
            mientras está abierto, y{" "}
            <strong className="text-foreground">devolverlo</strong> al
            disparador al cerrar.
          </p>
          <p>
            Y el foco tiene que verse: <code>:focus-visible</code> permite un
            indicador claro para el teclado sin mostrarlo al hacer click.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <FocoDialogoSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>outline: none</code> sin reemplazo.
            </strong>{" "}
            El usuario de teclado queda sin saber dónde está.
          </li>
          <li>
            <strong className="text-foreground">
              Modales que no mueven el foco al abrirse.
            </strong>{" "}
            El lector no anuncia nada y el teclado sigue en la página de
            atrás.
          </li>
          <li>
            <strong className="text-foreground">
              No devolver el foco al cerrar.
            </strong>{" "}
            El usuario vuelve al principio del documento.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Diálogos de confirmación, drawers laterales y menús desplegables.</li>
          <li>
            Un design system que define un estilo de <code>:focus-visible</code>{" "}
            común para todos los controles.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
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
            En una <strong className="text-foreground">SPA</strong>, navegar
            no carga un documento nuevo: el foco no vuelve al inicio y el
            lector no anuncia la página. Hay que mover el foco a algo
            significativo de la vista nueva (el <code>h1</code> con{" "}
            <code>tabIndex={"{-1}"}</code>) o anunciar el cambio. Next.js
            incluye un route announcer, pero conviene verificarlo.
          </p>
          <p>
            Cuando se <strong className="text-foreground">desmonta</strong> el
            elemento enfocado, el foco cae al <code>body</code>. Cada acción
            que elimina o reemplaza el elemento activo tiene que decidir a
            dónde va el foco: al vecino, al contenedor, o mantener el
            elemento con un estado de carga en vez de reemplazarlo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Reemplazar el botón de submit por un spinner.
            </strong>{" "}
            El foco se pierde; mejor mantener el botón con{" "}
            <code>aria-busy</code> o <code>disabled</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Mover el foco sin que el usuario lo espere.
            </strong>{" "}
            Robarle el foco mientras escribe (por un autoguardado, por ejemplo)
            es tan grave como perderlo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Borrar ítems de un carrito o de una lista de tareas.</li>
          <li>
            Un wizard de varios pasos: al avanzar, mover el foco al título del
            paso nuevo.
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
            El focus trap del playground intercepta Tab, pero los lectores de
            pantalla también navegan en modo lectura (flechas, encabezados,
            landmarks) sin mover el foco. Para bloquear el fondo de verdad hay
            que sacarlo del árbol de accesibilidad con{" "}
            <code>inert</code>, que es lo que hace{" "}
            <code>&lt;dialog&gt;.showModal()</code> con todo lo que está fuera
            del diálogo, además de mover el foco, cerrar con Escape y usar el
            top layer.
          </p>
          <p>
            <code>tabIndex</code>: <code>0</code> suma al orden natural,{" "}
            <code>-1</code> habilita foco solo por código, y los valores
            positivos crean un orden global paralelo que rompe la relación
            entre orden visual y orden de foco.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar solo en <code>aria-modal</code>.
            </strong>{" "}
            Informa, pero no impide llegar al fondo.
          </li>
          <li>
            <strong className="text-foreground">
              Arreglar el orden de foco con <code>tabIndex</code> positivos.
            </strong>{" "}
            Se arregla ordenando el DOM.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Migrar modales custom con z-index y focus trap manual a{" "}
            <code>&lt;dialog&gt;</code> nativo.
          </li>
          <li>
            Un drawer que necesita animación compleja: estructura custom +{" "}
            <code>inert</code> en el resto de la app.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Este botón de &quot;Eliminar&quot; en una lista funciona con mouse,
            pero los usuarios de teclado reportan que &quot;después de borrar
            quedan en cualquier lado&quot;. ¿Qué pasa y cómo lo arreglás?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`{tareas.map((t) => (
  <li key={t.id}>
    {t.texto}
    <button onClick={() => borrar(t.id)}>Eliminar</button>
  </li>
))}`}
          </pre>
          <RevelarSolucion>
            <p>
              El foco está en el botón &quot;Eliminar&quot; de la tarea
              borrada; al desmontarse su <code>&lt;li&gt;</code>, el foco cae
              al <code>body</code> y el siguiente Tab arranca desde el
              principio de la página. Hay que guardar refs a los botones (o a
              los ítems) y, después de borrar, enfocar el de la tarea que
              quedó en esa posición, el anterior si era la última, o el título
              de la lista si quedó vacía. Además conviene anunciar
              &quot;Tarea eliminada&quot; en un <code>role=&quot;status&quot;</code>{" "}
              y darle a cada botón un nombre único (
              <code>{"aria-label={`Eliminar ${t.texto}`}"}</code>) para que no sean diez botones &quot;Eliminar&quot; iguales.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
