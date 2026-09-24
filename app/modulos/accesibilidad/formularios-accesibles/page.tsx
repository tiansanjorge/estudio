import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { FormularioAccesibleSimulador } from "@/components/modulo/FormularioAccesibleSimulador";
import { entrevistaFormulariosAccesibles } from "@/lib/modules/accesibilidad/formularios-accesibles-entrevista";

const preguntasPorNivel = {
  1: entrevistaFormulariosAccesibles.filter((p) => p.nivel === 1),
  2: entrevistaFormulariosAccesibles.filter((p) => p.nivel === 2),
  3: entrevistaFormulariosAccesibles.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Formularios accesibles — Dev Study Lab",
  description:
    "Labels, errores asociados, foco al enviar, agrupación con fieldset, autocomplete y controles custom sin romper la accesibilidad.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa con el placeholder cuando el usuario empieza a escribir?",
    opciones: [
      "Queda visible arriba del texto",
      "Desaparece, y con él la única indicación visible de qué dato va en el campo",
      "Se convierte en el label",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso el label tiene que estar siempre visible; el placeholder solo complementa.",
  },
  {
    pregunta: "¿Qué atributo vincula un mensaje de error con su campo para el lector de pantalla?",
    opciones: ["aria-label", "aria-describedby", "aria-hidden"],
    respuestaCorrecta: 1,
    explicacion:
      "aria-describedby apunta al id del mensaje; aria-invalid indica el estado.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál es el momento más equilibrado para mostrar un error por primera vez?",
    opciones: [
      "En cada tecla, desde la primera",
      "Al salir del campo (blur) o al enviar",
      "Solo cuando el servidor responde",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Validar mientras escribe marca como error algo que el usuario todavía no terminó.",
  },
  {
    pregunta: "Un grupo de radio buttons responde a una pregunta. ¿Cómo se la asocia?",
    opciones: [
      "Con un <p> arriba del grupo",
      "Con <fieldset> y <legend>",
      "Con un title en cada radio",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El lector anuncia el legend al entrar al grupo, dando contexto a cada opción.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "El error aparece al hacer blur, y el lector no lo anuncia. ¿Por qué?",
    opciones: [
      "aria-describedby no funciona con errores",
      "La descripción se lee al recibir foco, y el foco ya se fue al campo siguiente",
      "Porque el error tiene color rojo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para errores dinámicos hace falta anunciarlos (región viva) o mover el foco al enviar.",
  },
  {
    pregunta: "¿Cuál es la forma más robusta de estilizar un checkbox?",
    opciones: [
      "Reemplazarlo por un div con role=\"checkbox\"",
      "Mantener el input nativo (visualmente oculto o con appearance: none) y estilizar con :checked",
      "Ocultarlo con display: none y usar una imagen",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El input nativo conserva teclado, estado, integración con el form y el foco.",
  },
];

export default function FormulariosAccesiblesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Accesibilidad"
      titulo="Formularios accesibles"
      descripcion="Que cada campo diga qué pide, que cada error llegue a quien no ve la pantalla, y que el usuario sepa qué corregir."
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
            Un formulario es donde la accesibilidad se vuelve concreta: si un
            usuario no puede completar el checkout o el registro, el producto
            no le sirve. Hay tres piezas mínimas.
          </p>
          <p>
            <strong className="text-foreground">Labels</strong> visibles y
            asociados (<code>&lt;label htmlFor&gt;</code>): dan el nombre
            accesible y agrandan el área clickeable.{" "}
            <strong className="text-foreground">Errores</strong> con texto
            (no solo color), vinculados con <code>aria-describedby</code> y
            con el estado en <code>aria-invalid</code>. Y{" "}
            <strong className="text-foreground">foco</strong>: al enviar con
            errores, llevar al usuario al primero.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <FormularioAccesibleSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Placeholder en lugar de label.</strong>{" "}
            Desaparece al escribir y suele tener bajo contraste.
          </li>
          <li>
            <strong className="text-foreground">Errores solo con color.</strong>{" "}
            Un borde rojo no le dice nada a quien no distingue colores ni a
            un lector de pantalla.
          </li>
          <li>
            <strong className="text-foreground">Mensajes genéricos.</strong>{" "}
            &quot;Campo inválido&quot; no dice qué hacer; &quot;El email tiene
            que tener el formato nombre@dominio.com&quot; sí.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Formularios de login, registro y checkout.</li>
          <li>
            Un componente <code>&lt;Campo&gt;</code> del design system que
            genera los ids y la asociación de label y error automáticamente
            (con <code>useId</code>).
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
            <strong className="text-foreground">Cuándo validar</strong>: al
            salir del campo la primera vez, revalidar al escribir una vez que
            hay error, y siempre al enviar. Validar en cada tecla desde el
            principio acusa al usuario de un error que todavía no cometió.
          </p>
          <p>
            <code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code> dan
            contexto a grupos de opciones, y <code>autocomplete</code> con
            valores estándar permite completar datos sin tipear, además de
            ser un requisito de WCAG para datos del usuario.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>autocomplete=&quot;off&quot;</code> por costumbre.
            </strong>{" "}
            Obliga a tipear todo y rompe los gestores de contraseñas.
          </li>
          <li>
            <strong className="text-foreground">Radios sin fieldset.</strong>{" "}
            &quot;Sí, radio button&quot; sin la pregunta no significa nada.
          </li>
          <li>
            <strong className="text-foreground">
              Indicar &quot;requerido&quot; solo con un asterisco rojo.
            </strong>{" "}
            Explicar el asterisco al inicio del formulario y usar el atributo{" "}
            <code>required</code>.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Formularios largos (alta de cliente, declaraciones) con resumen de
            errores arriba y links a cada campo.
          </li>
          <li>
            <code>autocomplete=&quot;one-time-code&quot;</code> en el campo de
            código SMS para que el sistema lo sugiera.
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
            <code>aria-describedby</code> se lee cuando el campo recibe el
            foco, no cuando la descripción cambia. Un error que aparece al
            salir del campo ya no se escucha, porque el lector está en el
            siguiente. La asociación resuelve el &quot;después&quot;; para el
            &quot;ahora&quot; hace falta anunciar o mover el foco.
          </p>
          <p>
            Los <strong className="text-foreground">controles custom</strong>{" "}
            pierden todo lo que el nativo daba: rol, estado, teclado,
            integración con el <code>&lt;form&gt;</code>, autocompletado y los
            pickers del sistema en mobile. La primera opción es estilizar el
            nativo; la segunda, una librería headless probada.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Ocultar el checkbox nativo con <code>display: none</code>.
            </strong>{" "}
            Desaparece del árbol de accesibilidad y del recorrido de Tab.
          </li>
          <li>
            <strong className="text-foreground">
              Referencias <code>aria-describedby</code> a ids que no existen.
            </strong>{" "}
            Pasa cuando el error se monta condicionalmente y el atributo no.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Auditar un date picker custom y decidir si reemplazarlo por{" "}
            <code>&lt;input type=&quot;date&quot;&gt;</code>.
          </li>
          <li>
            Integrar React Hook Form con un componente de campo que maneje{" "}
            <code>aria-invalid</code> y <code>aria-describedby</code> de forma
            consistente.
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
            Este campo tiene label, error asociado y <code>aria-invalid</code>.
            Aun así, un usuario de lector de pantalla escucha el mismo id en
            dos campos distintos del formulario. ¿Qué pasa?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Campo({ etiqueta, error, ...props }) {
  return (
    <>
      <label htmlFor="campo">{etiqueta}</label>
      <input id="campo" aria-describedby="campo-error"
             aria-invalid={!!error} {...props} />
      <p id="campo-error">{error}</p>
    </>
  );
}

<Campo etiqueta="Nombre" error={errores.nombre} />
<Campo etiqueta="Email" error={errores.email} />`}
          </pre>
          <RevelarSolucion>
            <p>
              Los ids están hardcodeados: los dos inputs tienen{" "}
              <code>id=&quot;campo&quot;</code>, así que los dos labels apuntan
              al primero (click en &quot;Email&quot; enfoca Nombre) y los dos{" "}
              <code>aria-describedby</code> resuelven al primer{" "}
              <code>campo-error</code>. Los ids tienen que ser únicos en el
              documento: se generan con <code>useId()</code> dentro del
              componente (<code>const id = useId()</code>, y{" "}
              <code>{"`${id}-error`"}</code> para el mensaje). Además, el{" "}
              <code>aria-describedby</code> debería estar solo cuando hay
              error, para no anunciar un párrafo vacío.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
