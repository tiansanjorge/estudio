import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { RovingToolbarSimulador } from "@/components/modulo/RovingToolbarSimulador";
import { entrevistaNavegacionTeclado } from "@/lib/modules/accesibilidad/navegacion-teclado-entrevista";

const preguntasPorNivel = {
  1: entrevistaNavegacionTeclado.filter((p) => p.nivel === 1),
  2: entrevistaNavegacionTeclado.filter((p) => p.nivel === 2),
  3: entrevistaNavegacionTeclado.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Navegación por teclado — Dev Study Lab",
  description:
    "Convenciones de teclado, skip links, orden de foco vs orden visual, roving tabindex y atajos accesibles.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué tecla se espera que active un botón, además de Enter?",
    opciones: [
      "Espacio",
      "Tab",
      "Flecha abajo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los botones se activan con Enter y Espacio; los links, solo con Enter.",
  },
  {
    pregunta: "¿Para qué sirve un skip link?",
    opciones: [
      "Para saltear los elementos decorativos al leer la página",
      "Para ir directo al contenido sin atravesar toda la navegación",
      "Para volver al principio de la página desde cualquier punto",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es el atajo que el usuario de mouse ya tiene: ir directo al contenido.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con flex-direction: row-reverse, ¿en qué orden recorre Tab los elementos?",
    opciones: [
      "En el orden visual: el navegador sigue lo que se ve en pantalla",
      "En el orden visual, salvo que los elementos tengan tabIndex",
      "En el orden del DOM, que queda invertido respecto de lo que se ve",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Tab y los lectores de pantalla siguen el DOM; CSS solo cambia la presentación.",
  },
  {
    pregunta: "En una toolbar con roving tabindex, ¿cuántos elementos tienen tabIndex=0?",
    opciones: [
      "Uno: el activo",
      "Todos los botones",
      "Ninguno: la toolbar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Uno solo, para que el grupo sea una única parada de Tab; el resto tiene -1.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué un combobox suele usar aria-activedescendant en vez de roving tabindex?",
    opciones: [
      "Porque roving tabindex no funciona dentro de listas con scroll",
      "Porque el foco tiene que quedar en el input para seguir escribiendo",
      "Porque aria-activedescendant es obligatorio en el rol combobox",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "activedescendant indica la opción activa sin sacarle el foco al campo de texto.",
  },
  {
    pregunta: "¿Qué pide WCAG para los atajos de una sola tecla?",
    opciones: [
      "Que usen siempre un modificador, como Ctrl o Alt",
      "Que estén listados en una página de ayuda del sitio",
      "Que se puedan desactivar, reasignar o funcionar solo con foco",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Protege a usuarios de control por voz y de lectores de pantalla (criterio 2.1.4).",
  },
];

export default function NavegacionTecladoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Accesibilidad"
      titulo="Navegación por teclado"
      descripcion="Todo lo que se puede hacer con el mouse se tiene que poder hacer con el teclado, siguiendo convenciones que el usuario ya conoce."
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

const TECLAS = [
  { tecla: "Tab / Shift+Tab", accion: "Moverse entre controles" },
  { tecla: "Enter", accion: "Activar links y botones, enviar formularios" },
  { tecla: "Espacio", accion: "Activar botones, marcar checkboxes" },
  { tecla: "Flechas", accion: "Moverse dentro de un control compuesto (radios, tabs, menús)" },
  { tecla: "Escape", accion: "Cerrar modales, menús y popovers" },
];

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Mucha gente navega sin mouse: usuarios de lectores de pantalla,
            personas con movilidad reducida o temblores, quien usa switches o
            control por voz (que emulan teclado), y usuarios avanzados que
            simplemente son más rápidos así. WCAG exige que toda la
            funcionalidad sea operable con teclado (2.1.1) y que nunca quede
            atrapado sin salida (2.1.2).
          </p>
          <p>
            El teclado tiene convenciones que el usuario ya trae aprendidas del
            sistema operativo. Respetarlas es la mitad del trabajo:
          </p>
          <dl className="grid gap-2 font-mono text-xs sm:grid-cols-[10rem_1fr]">
            {TECLAS.map(({ tecla, accion }) => (
              <div key={tecla} className="contents">
                <dt className="text-foreground">{tecla}</dt>
                <dd className="text-muted-foreground">{accion}</dd>
              </div>
            ))}
          </dl>
          <p>
            Y un <strong className="text-foreground">skip link</strong> al
            inicio de la página permite saltear la navegación e ir directo al
            contenido.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <RovingToolbarSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Menús que solo se abren con hover.</strong>{" "}
            El teclado no puede llegar a su contenido.
          </li>
          <li>
            <strong className="text-foreground">
              Controles custom que no responden a Enter o Espacio.
            </strong>{" "}
            Cada <code>onClick</code> en un elemento no nativo necesita su
            equivalente de teclado.
          </li>
          <li>
            <strong className="text-foreground">Trampas de teclado.</strong>{" "}
            Un widget (un editor, un iframe, un mapa) del que no se puede
            salir con Tab ni con Escape.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Agregar un skip link al layout raíz de la app.</li>
          <li>
            Hacer una prueba de cinco minutos sin mouse antes de cada release
            de un flujo crítico (checkout, login).
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
            El orden de Tab es el{" "}
            <strong className="text-foreground">orden del DOM</strong>. Si CSS
            reordena visualmente (<code>order</code>,{" "}
            <code>row-reverse</code>, posicionamiento en grid o absoluto), el
            foco salta de forma impredecible y el lector de pantalla lee en
            otro orden. El DOM tiene que reflejar el orden lógico.
          </p>
          <p>
            <strong className="text-foreground">Roving tabindex</strong>{" "}
            convierte un grupo de controles en una sola parada de Tab: solo el
            activo tiene <code>tabIndex=0</code> y las flechas mueven cuál es,
            como en el playground.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar <code>order</code> en mobile para subir un bloque.
            </strong>{" "}
            Visualmente arriba, en el recorrido de Tab sigue abajo.
          </li>
          <li>
            <strong className="text-foreground">
              Implementar flechas sin cambiar los tabIndex.
            </strong>{" "}
            Si todos siguen en 0, las flechas funcionan pero Tab todavía
            recorre cada elemento.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Toolbars de editores, grupos de filtros, selectores de color.</li>
          <li>
            Revisar un layout responsive con Tab en cada breakpoint, no solo
            en desktop.
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
            <code>aria-activedescendant</code> es la alternativa a roving
            tabindex: el foco real se queda en el contenedor o en un input, y
            un atributo indica qué opción está activa. Es la base del
            combobox, donde el usuario sigue escribiendo mientras recorre las
            sugerencias. El costo: el indicador visual y el scroll se manejan a
            mano.
          </p>
          <p>
            Los <strong className="text-foreground">atajos de una sola tecla</strong>{" "}
            chocan con el control por voz y con los comandos de lectura de los
            lectores de pantalla. Tienen que poder desactivarse o reasignarse,
            ser descubribles, y no dispararse mientras se escribe en un campo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Atajos globales que se disparan al escribir.
            </strong>{" "}
            Escribir &quot;joya&quot; en un comentario no debería saltar al post
            siguiente.
          </li>
          <li>
            <strong className="text-foreground">
              Pisar atajos del navegador o del lector.
            </strong>{" "}
            Ctrl+F, Ctrl+L o las teclas sueltas del modo lectura.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un buscador con autocompletado (combobox con{" "}
            <code>aria-activedescendant</code>).
          </li>
          <li>
            Un panel de atajos accesible con &quot;?&quot; y una opción para
            desactivarlos en la configuración.
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
            En mobile, este layout muestra el formulario de compra arriba del
            detalle del producto. Un usuario de teclado en una tablet reporta
            que &quot;el foco empieza por abajo&quot;. ¿Por qué, y cuál es el
            arreglo correcto?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`<div className="flex flex-col md:flex-row">
  <DetalleProducto />                 {/* con links y tabs */}
  <FormularioCompra className="order-first md:order-none" />
</div>`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>order-first</code> sube el formulario solo visualmente: en
              el DOM sigue después del detalle, así que Tab recorre primero
              todos los links y tabs del detalle (que se ven abajo) y recién
              después el formulario (que se ve arriba). El arreglo es poner los
              elementos en el DOM en el orden lógico que se quiere para el
              flujo principal y ajustar con CSS la disposición en desktop, o,
              si el orden lógico realmente cambia entre breakpoints, renderizar
              estructuras distintas en vez de reordenar con <code>order</code>.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
