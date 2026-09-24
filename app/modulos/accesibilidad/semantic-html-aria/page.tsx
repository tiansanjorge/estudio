import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ArbolAccesibilidadExplorador } from "@/components/modulo/ArbolAccesibilidadExplorador";
import { entrevistaSemanticHtmlAria } from "@/lib/modules/accesibilidad/semantic-html-aria-entrevista";

const preguntasPorNivel = {
  1: entrevistaSemanticHtmlAria.filter((p) => p.nivel === 1),
  2: entrevistaSemanticHtmlAria.filter((p) => p.nivel === 2),
  3: entrevistaSemanticHtmlAria.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Semantic HTML & ARIA — Dev Study Lab",
  description:
    "El árbol de accesibilidad, el nombre accesible, por qué el HTML nativo gana y cuándo ARIA es la herramienta correcta.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué obtenés gratis al usar <button> en vez de <div onClick>?",
    opciones: [
      "Rol de botón, foco con Tab y activación con Enter y Espacio",
      "Rol de botón y foco con Tab; la activación con teclado es aparte",
      "Solo el rol: el foco y el teclado dependen del onClick",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El div funciona solo con mouse; el teclado y el lector de pantalla no lo reconocen como control.",
  },
  {
    pregunta: "Un botón contiene solo un ícono SVG. ¿Qué anuncia el lector de pantalla?",
    opciones: [
      "El nombre del archivo del ícono",
      "Solo 'botón', sin nombre accesible",
      "El contenido del atributo title del SVG",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Hace falta aria-label o texto visualmente oculto para que el control tenga un nombre.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace role=\"button\" en un div?",
    opciones: [
      "Lo convierte en un botón completo, con foco y teclado incluidos",
      "Le agrega foco con Tab, pero no la activación con teclado",
      "Cambia cómo se anuncia, sin agregar foco ni activación con teclado",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "ARIA cambia la semántica expuesta, no el comportamiento. El resto hay que implementarlo a mano.",
  },
  {
    pregunta: "Un mensaje de 'Guardado' se monta junto con su role=\"status\" y el lector no lo anuncia. ¿Por qué?",
    opciones: [
      "Las regiones vivas anuncian cambios dentro de una región que ya existía",
      "Porque role=\"status\" es cortés y espera a que el usuario deje de tipear",
      "Porque hace falta aria-live además de role=\"status\" para que se anuncie",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La región tiene que existir antes, vacía, y cambiar su contenido después.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué técnica oculta visualmente un texto pero lo deja disponible para el lector?",
    opciones: [
      "display: none",
      "Una clase sr-only (visually-hidden)",
      "aria-hidden=\"true\"",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "display: none lo saca de todo; aria-hidden hace lo inverso de lo buscado.",
  },
  {
    pregunta: "En un componente de tabs accesible, ¿cómo se mueve el usuario entre pestañas?",
    opciones: [
      "Con Tab, que pasa de una pestaña a la siguiente",
      "Con Tab entre pestañas y Enter para activarlas",
      "Con las flechas: la tablist es una sola parada de Tab",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Tab mueve entre controles; las flechas, dentro de un control compuesto (roving tabindex).",
  },
];

export default function SemanticHtmlAriaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Accesibilidad"
      titulo="Semantic HTML & ARIA"
      descripcion="Lo que el navegador expone en el árbol de accesibilidad, por qué el HTML nativo casi siempre gana, y cuándo ARIA es la herramienta correcta."
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
            Además del DOM, el navegador construye un{" "}
            <strong className="text-foreground">árbol de accesibilidad</strong>
            : para cada elemento relevante expone un rol (botón, link,
            encabezado), un nombre accesible y sus estados. Eso es lo que
            leen los lectores de pantalla, el control por voz y otras
            tecnologías asistivas.
          </p>
          <p>
            El HTML semántico llena ese árbol sin esfuerzo:{" "}
            <code>&lt;button&gt;</code>, <code>&lt;a href&gt;</code>,{" "}
            <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>,{" "}
            <code>&lt;h1&gt;</code>…<code>&lt;h6&gt;</code>. Un{" "}
            <code>&lt;div&gt;</code> con estilos puede verse idéntico, pero
            para el árbol es un contenedor genérico: no se enfoca, no se
            activa con teclado, no se anuncia como control.
          </p>
          <p>
            El <strong className="text-foreground">nombre accesible</strong>{" "}
            es lo que se anuncia antes del rol. Sale de{" "}
            <code>aria-labelledby</code>, <code>aria-label</code>, la
            asociación nativa (<code>&lt;label&gt;</code>, <code>alt</code>) o
            el texto del elemento, en ese orden de prioridad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ArbolAccesibilidadExplorador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>&lt;div onClick&gt;</code> como botón o link.
            </strong>{" "}
            Solo funciona con mouse.
          </li>
          <li>
            <strong className="text-foreground">Botones de ícono sin nombre.</strong>{" "}
            El lector anuncia &quot;botón&quot; sin decir qué hace.
          </li>
          <li>
            <strong className="text-foreground">
              Elegir el encabezado por su tamaño visual.
            </strong>{" "}
            Los niveles <code>h1</code>–<code>h6</code> son la estructura de la
            página; el tamaño se ajusta con CSS.
          </li>
          <li>
            <strong className="text-foreground">
              Usar <code>&lt;button&gt;</code> para navegar o{" "}
              <code>&lt;a&gt;</code> para acciones.
            </strong>{" "}
            Un link lleva a otro lugar (URL); un botón hace algo en la página.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Inspeccionar el panel Accessibility de las DevTools para ver qué
            rol y nombre recibe realmente un componente.
          </li>
          <li>
            Estructurar una página con landmarks (<code>header</code>,{" "}
            <code>nav</code>, <code>main</code>, <code>footer</code>) para que
            se pueda navegar por regiones.
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
            La primera regla de ARIA: si existe un elemento nativo con la
            semántica y el comportamiento que necesitás, usalo.{" "}
            <strong className="text-foreground">
              ARIA cambia lo que se anuncia, no lo que el elemento hace
            </strong>
            . <code>role=&quot;button&quot;</code> no agrega foco ni teclado; lo
            viste en el playground.
          </p>
          <p>
            ARIA es la herramienta correcta para lo que el HTML no puede
            expresar: estados (<code>aria-expanded</code>,{" "}
            <code>aria-current</code>, <code>aria-invalid</code>), relaciones
            (<code>aria-controls</code>, <code>aria-describedby</code>),
            regiones vivas para anunciar cambios, y widgets sin equivalente
            nativo.
          </p>
          <p>
            Las <strong className="text-foreground">regiones vivas</strong>{" "}
            (<code>aria-live</code>, <code>role=&quot;status&quot;</code>,{" "}
            <code>role=&quot;alert&quot;</code>) anuncian cambios que ocurren
            sin mover el foco. Solo anuncian cambios dentro de una región que
            ya existía en el árbol.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Agregar ARIA &quot;por las dudas&quot;.
            </strong>{" "}
            ARIA incorrecto es peor que ninguno: promete algo que el elemento
            no cumple.
          </li>
          <li>
            <strong className="text-foreground">
              Usar <code>aria-live=&quot;assertive&quot;</code> para todo.
            </strong>{" "}
            Interrumpe lo que el lector estaba diciendo; reservarlo para lo
            urgente.
          </li>
          <li>
            <strong className="text-foreground">
              Estados que no se actualizan.
            </strong>{" "}
            Un <code>aria-expanded=&quot;false&quot;</code> fijo en un menú que
            se abre informa algo falso.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un botón que despliega un menú: <code>aria-expanded</code> y{" "}
            <code>aria-controls</code> sincronizados con el estado.
          </li>
          <li>
            Anunciar &quot;12 resultados&quot; al filtrar con un{" "}
            <code>role=&quot;status&quot;</code> que existe desde el inicio.
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
            Hay cuatro formas de &quot;ocultar&quot; con efectos distintos:{" "}
            <code>display: none</code> y <code>visibility: hidden</code> ocultan
            para todos; <code>aria-hidden</code> oculta solo del árbol de
            accesibilidad (para decoración); una clase{" "}
            <code>sr-only</code> oculta solo visualmente (para texto que solo
            necesita el lector). El atributo <code>inert</code> desactiva un
            subárbol entero, útil detrás de un modal.
          </p>
          <p>
            Los <strong className="text-foreground">widgets compuestos</strong>{" "}
            (tabs, menús, listbox, tree) no tienen equivalente nativo y siguen
            los patrones de la ARIA Authoring Practices Guide: roles,
            relaciones y un modelo de teclado. Suelen ser una sola parada de
            Tab (roving tabindex) y se recorren con flechas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>aria-hidden</code> sobre un elemento enfocable.
            </strong>{" "}
            El teclado llega a algo que el lector no puede describir.
          </li>
          <li>
            <strong className="text-foreground">
              Usar un rol sin implementar su modelo de teclado.
            </strong>{" "}
            <code>role=&quot;menu&quot;</code> hace que el lector espere
            flechas; si no funcionan, el usuario queda atrapado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Evaluar Radix o React Aria para un design system en vez de
            implementar combobox y tabs desde cero.
          </li>
          <li>
            Marcar con <code>inert</code> el contenido de la página mientras
            hay un modal abierto.
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
            Este toggle de &quot;modo oscuro&quot; tiene tres problemas de
            accesibilidad. ¿Cuáles son?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`<span
  role="switch"
  onClick={() => setOscuro(!oscuro)}
  className={oscuro ? "on" : "off"}
>
  <IconoLuna />
</span>`}
          </pre>
          <RevelarSolucion>
            <p>
              1) No es enfocable ni responde a teclado: falta{" "}
              <code>tabIndex</code> y manejar Espacio (y Enter). 2) No expone
              su estado: un <code>role=&quot;switch&quot;</code> necesita{" "}
              <code>aria-checked</code> sincronizado con <code>oscuro</code>; la
              clase CSS no llega al árbol. 3) No tiene nombre accesible: el
              ícono no aporta texto, falta <code>aria-label=&quot;Modo
              oscuro&quot;</code> y <code>aria-hidden</code> en el ícono. La
              versión más robusta arranca de un{" "}
              <code>&lt;button role=&quot;switch&quot; aria-checked&gt;</code>,
              que ya resuelve foco y teclado.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
