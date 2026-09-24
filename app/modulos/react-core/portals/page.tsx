import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PortalDemo } from "@/components/modulo/PortalDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaPortals } from "@/lib/modules/react-core/portals-entrevista";

const preguntasPorNivel = {
  1: entrevistaPortals.filter((p) => p.nivel === 1),
  2: entrevistaPortals.filter((p) => p.nivel === 2),
  3: entrevistaPortals.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Portals — Dev Study Lab",
  description:
    "createPortal renderiza contenido en otro nodo del DOM sin salir del árbol lógico de React — la forma estándar de escapar de overflow y z-index en modales y tooltips.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace ReactDOM.createPortal(children, domNode)?",
    opciones: [
      "Crea un nuevo componente de React desde cero",
      "Renderiza children en un nodo del DOM distinto al del padre, aunque siga siendo hijo lógico en el árbol de React",
      "Mueve un componente a otra ruta de la aplicación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Resuelve el problema clásico de modales y tooltips atrapados por overflow: hidden o z-index de un contenedor padre — el portal escapa de esa jerarquía del DOM sin romper la jerarquía lógica de React.",
  },
  {
    pregunta: "¿Para qué tipo de UI se usa típicamente un portal?",
    opciones: [
      "Componentes que nunca cambian de estado",
      "Modales, tooltips, menús desplegables, notificaciones — UI que necesita renderizarse por encima de todo sin ser recortada",
      "Cualquier componente que use useState",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Todos comparten el mismo problema: si se renderizaran en su posición natural del árbol, quedarían atrapados por el overflow o z-index de algún contenedor padre.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Un evento disparado dentro de un portal, ¿burbujea por el DOM real o por el árbol de React?",
    opciones: [
      "Por el DOM real, siguiendo la posición física del nodo",
      "Por el árbol de React: sigue burbujeando hacia los componentes ancestros en JSX, no hacia los ancestros reales del DOM",
      "No burbujea en absoluto, queda aislado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Aunque el nodo físico esté en otro lugar del documento, React trata el contenido del portal como hijo lógico del componente que lo creó para efectos de bubbling de eventos.",
  },
  {
    pregunta:
      "¿Por qué un selector CSS como .padre > .contenido-modal no aplica estilos al contenido de un portal?",
    opciones: [
      "Porque los portales no soportan CSS",
      "Porque el selector depende de la relación de descendencia real en el DOM, que el portal específicamente rompe",
      "Porque hay que usar !important siempre con portales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "CSS no ve la jerarquía de React, solo el DOM real. El contenido del portal está montado en otro nodo completamente distinto, así que el selector falla silenciosamente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué llamar a createPortal con document.getElementById directamente puede romper el SSR en Next.js?",
    opciones: [
      "document no existe en el entorno de Node donde corre el server-side rendering",
      "createPortal solo funciona en producción, no en desarrollo",
      "Next.js prohíbe el uso de createPortal por completo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La solución estándar es renderizar null hasta que un useEffect confirme que el componente ya está montado en el cliente, donde document sí existe.",
  },
  {
    pregunta:
      "¿Un portal es inmune a quedar visualmente 'atrapado' por un z-index bajo, incluso montado cerca de la raíz del documento?",
    opciones: [
      "Sí, siempre queda por encima de todo lo demás",
      "No: si un ancestro real del nodo destino crea su propio stacking context (transform, filter, opacity < 1), puede acotar el z-index del contenido del portal igual",
      "Solo es un problema en navegadores antiguos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El portal resuelve el recorte por overflow: hidden, pero no es inmune a los stacking contexts creados por CSS en la cadena real de ancestros del DOM del nodo destino.",
  },
];

export default function PortalsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Portals"
      descripcion="createPortal renderiza contenido en otro nodo del DOM sin salir del árbol lógico de React — context, eventos y bubbling siguen funcionando como si nunca se hubiera movido de lugar."
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
            <code>{"ReactDOM.createPortal(children, domNode)"}</code>{" "}
            renderiza <code>children</code> dentro de un nodo del DOM
            distinto al del componente padre, aunque en el árbol de React
            siga siendo un hijo normal de ese componente. Resuelve el
            problema clásico de modales, tooltips y dropdowns anidados
            dentro de contenedores con <code>overflow: hidden</code> o un{" "}
            <code>z-index</code> que los recorta o los tapa visualmente.
          </p>
          <p>
            El portal &ldquo;escapa&rdquo; de esa jerarquía del DOM sin
            romper la jerarquía lógica de React: context, eventos y
            bubbling siguen funcionando exactamente igual que si el
            contenido nunca se hubiera movido de lugar.
          </p>
          <p>
            Se usa típicamente para cualquier UI que necesite renderizarse
            &ldquo;por encima&rdquo; de todo lo demás:{" "}
            <strong className="text-foreground">
              modales, tooltips, menús desplegables, notificaciones
            </strong>
            .
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PortalDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que el nodo destino del portal ya existe al montar.
            </strong>{" "}
            Si el target del DOM todavía no está disponible (por ejemplo,
            antes de la hidratación), createPortal falla.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que un portal también escapa del Context de React.
            </strong>{" "}
            El Context sigue fluyendo por el árbol lógico de React, sin
            importar en qué nodo del DOM se renderice el contenido.
          </li>
          <li>
            <strong className="text-foreground">
              No limpiar un nodo del DOM creado manualmente para el portal.
            </strong>{" "}
            Si se crea el target dinámicamente, hay que removerlo al
            desmontar para no dejar nodos huérfanos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Modales que necesitan renderizarse sobre toda la aplicación,
            sin importar en qué parte del árbol se abran.
          </li>
          <li>
            Tooltips y menús desplegables que se recortarían si quedaran
            atrapados por el overflow de un contenedor con scroll.
          </li>
          <li>
            Un sistema de notificaciones (toasts) montado en un único
            nodo cerca de la raíz del documento, apilando varias a la vez.
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
            Este tooltip queda recortado por el contenedor con scroll.
            ¿Cómo lo arreglarías con un portal?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Tarjeta() {
  return (
    <div style={{ overflow: 'hidden', height: 100 }}>
      <Tooltip texto="Info extra" />
    </div>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El <code>overflow: hidden</code> del contenedor recorta
              cualquier cosa que se renderice fuera de sus límites,
              incluido el tooltip si se posiciona de forma absoluta más
              allá del borde visible.
            </p>
            <p className="mt-2">
              El fix es que el tooltip renderice su contenido con
              createPortal, directo en un nodo fuera del contenedor
              recortado:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Tooltip({ texto }) {
  return createPortal(
    <div className="tooltip">{texto}</div>,
    document.body,
  );
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
            Un evento disparado dentro de un portal burbujea por el{" "}
            <strong className="text-foreground">árbol de React</strong>,
            no por el DOM real: aunque el nodo físico esté en otro lugar
            del documento, React sigue tratando el contenido del portal
            como hijo lógico del componente que lo creó, así que un{" "}
            <code>onClick</code> en un ancestro de React sigue disparándose
            por un click dentro del portal.
          </p>
          <p>
            Los selectores CSS que dependen de la relación de descendencia
            real en el DOM (
            <code>.padre &gt; .contenido-modal</code>) no aplican al
            contenido de un portal: CSS no puede &ldquo;ver&rdquo; la
            jerarquía de React, solo el DOM real, donde el contenido está
            montado en otro nodo completamente distinto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en stopPropagation a nivel DOM para bloquear un
              evento que viaja por React.
            </strong>{" "}
            Un listener nativo agregado fuera de React puede no
              interceptar lo que React sigue propagando por su propio
              árbol.
          </li>
          <li>
            <strong className="text-foreground">
              Estilar el contenido de un portal con selectores de
              descendencia CSS.
            </strong>{" "}
            Fallan silenciosamente porque el DOM real no refleja esa
            relación padre-hijo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Cerrar un menú desplegable al detectar un click &quot;afuera&quot;,
            aprovechando que un handler en el componente padre de React
            sigue recibiendo el evento aunque el menú esté en un portal.
          </li>
          <li>
            Implementar focus trap y aria-modal en un modal con portal,
            para compensar que el orden del DOM ya no coincide con el
            orden lógico esperado por lectores de pantalla.
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
            <code>createPortal</code> necesita un nodo real del DOM, y{" "}
            <code>document</code> no existe en el entorno de Node donde
            corre el server-side rendering. Llamarlo directamente durante
            el render puede causar un error o un mismatch de hidratación
            en Next.js — la solución estándar es renderizar{" "}
            <code>null</code> hasta que un <code>useEffect</code> confirme
            que el componente ya está montado en el cliente.
          </p>
          <p>
            Un portal escapa del recorte por <code>overflow: hidden</code>
            , pero NO es inmune a un stacking context creado por CSS en la
            cadena de ancestros reales del nodo destino: propiedades como{" "}
            <code>transform</code>, <code>filter</code> o{" "}
            <code>will-change</code> en cualquier ancestro pueden acotar
            el z-index de todo lo que esté adentro, incluido el contenido
            del portal, sin importar qué tan alto sea el z-index que se le
            puso.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Llamar a document.getElementById directamente en el cuerpo
              del componente sin guard de montaje.
            </strong>{" "}
            Rompe en SSR o genera un mismatch de hidratación.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que un z-index alto siempre gana, sin revisar la
              cadena de ancestros del nodo destino del portal.
            </strong>{" "}
            Un stacking context creado más arriba puede seguir acotando
            visualmente al contenido del portal.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un hook `useMontado` reutilizable para guardar cualquier
            componente que use createPortal, evitando repetir el guard de
            SSR en cada uno.
          </li>
          <li>
            Auditar la cadena de ancestros del nodo raíz de portales
            (#modal-root) cuando un modal aparece &quot;por debajo&quot; de
            otro elemento pese a tener z-index alto.
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
