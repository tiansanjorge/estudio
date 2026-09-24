import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FormsSimulador } from "@/components/modulo/FormsSimulador";
import { InputControladoDemo } from "@/components/modulo/InputControladoDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosForms } from "@/lib/modules/react-core/forms-escenarios";
import { entrevistaForms } from "@/lib/modules/react-core/forms-entrevista";

const preguntasPorNivel = {
  1: entrevistaForms.filter((p) => p.nivel === 1),
  2: entrevistaForms.filter((p) => p.nivel === 2),
  3: entrevistaForms.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Forms — Dev Study Lab",
  description:
    "Un input controlado no solo lee lo que el usuario tipea: React decide qué mostrar en cada render. Sin setState, el input deja de responder.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace que un input sea 'controlado' en React?",
    opciones: [
      "Que su value venga del estado y el onChange lo actualice",
      "Que tenga un onChange, aunque su valor no esté atado al estado",
      "Que tenga una ref de React apuntando al elemento del DOM",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Un input controlado recibe su value desde el estado de React. React 'decide' qué mostrar en cada render — el DOM no maneja el valor por su cuenta.",
  },
  {
    pregunta: "Si un input controlado no llama a setState en su onChange, ¿qué pasa al escribir?",
    opciones: [
      "Se ve lo que escribís, pero el estado queda desincronizado del DOM",
      "No se ve lo que escribís: React vuelve a forzar el value viejo",
      "React lo pasa a no controlado y muestra un warning en consola",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Como React controla el value del input, sin un setState que lo actualice, sigue forzando el mismo valor de siempre — el input parece 'trabado', aunque el usuario esté tipeando.",
  },
  {
    pregunta: "¿Cuál es la ventaja principal de un input no controlado (uncontrolled) con ref?",
    opciones: [
      "Que el valor queda disponible en el estado sin escribir un onChange",
      "Que se puede validar en vivo sin disparar renders en el componente",
      "Que el DOM maneja el valor sin re-renderizar en cada tecla",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un input no controlado deja que el navegador maneje el valor internamente. React no re-renderiza en cada tecla — se accede al valor puntualmente vía ref cuando hace falta.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué React Hook Form re-renderiza menos que un formulario armado con useState por campo?",
    opciones: [
      "Porque registra los inputs como no controlados vía refs, en vez de un useState por campo",
      "Porque memoiza cada campo con React.memo y solo re-renderiza el que cambió",
      "Porque agrupa todos los cambios y re-renderiza el formulario una vez por segundo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Con useState por campo, escribir en un input dispara un render del formulario entero. React Hook Form evita eso usando refs internamente vía register().",
  },
  {
    pregunta:
      "¿Qué ventaja tiene compartir un schema de validación (Zod) entre cliente y servidor?",
    opciones: [
      "Que el servidor ya no necesita validar, porque confía en lo que validó el cliente",
      "Que la regla se define una vez y el form y el backend no se desincronizan",
      "Que la validación corre una sola vez, en el cliente, y el resultado viaja al server",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El servidor nunca debe confiar en que el cliente ya validó. Un schema compartido evita mantener dos implementaciones de la misma regla que eventualmente divergen.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué ventaja tiene required/type='email' en HTML sobre validar todo con JavaScript?",
    opciones: [
      "Que valida el formato del email contra el servidor de correo del dominio",
      "Que reemplaza la validación del servidor, porque el navegador no se puede saltear",
      "Que funciona aunque JS no cargue, con foco y mensajes accesibles del navegador",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Para reglas básicas y universales conviene apoyarse en la validación nativa. Reglas de negocio específicas siguen necesitando JavaScript, pero no hace falta reemplazar todo.",
  },
  {
    pregunta:
      "¿Qué ventaja de 'progressive enhancement' da el modelo de form actions de React 19 sobre un onSubmit tradicional?",
    opciones: [
      "El formulario funciona aunque JavaScript no haya cargado, usando el action nativo",
      "El formulario se valida en el servidor sin tener que escribir un endpoint aparte",
      "El formulario hace optimistic updates automáticamente mientras se envía",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Con <form action={fn}>, React se apoya en el submit nativo del navegador en vez de depender por completo de interceptar el evento con JavaScript.",
  },
];

export default function FormsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Forms"
      descripcion="En un input controlado, React no observa lo que escribís: decide qué mostrar. Esa diferencia explica tanto su poder como su bug más común."
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
            Un input HTML normal maneja su propio valor: el navegador lo
            actualiza solo cuando el usuario tipea.{" "}
            <strong className="text-foreground">Controlado</strong>{" "}
            significa otra cosa: le pasás un <code>value</code> que sale
            del estado de React, y en cada render, React fuerza al DOM a
            mostrar exactamente ese valor — no lo que el usuario acaba
            de tipear.
          </p>
          <p>
            Por eso el <code>onChange</code> no es opcional en un input
            controlado: es lo único que actualiza el estado que después
            se usa como <code>value</code>. Sin ese <code>setState</code>,
            el ciclo se corta — el usuario tipea, el estado no cambia, y
            en el próximo render React vuelve a poner el value de
            siempre. El input parece &ldquo;trabado&rdquo;.
          </p>
          <p>
            La alternativa es un input{" "}
            <strong className="text-foreground">no controlado</strong>:
            el DOM maneja el valor por su cuenta, y React solo lo
            consulta cuando hace falta (con un <code>ref</code>, por
            ejemplo al hacer submit). Menos re-renders, pero también
            menos control — no podés validar o formatear en cada tecla
            si no sabés qué se tipeó hasta el final.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <FormsSimulador escenarios={escenariosForms} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Apagá el toggle y probá escribir — es el mismo bug del
          escenario anterior, pero reproducido en vivo.
        </p>
        <InputControladoDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Olvidarse el onChange (o no actualizar el estado adentro).
            </strong>{" "}
            El input queda &ldquo;trabado&rdquo; — no muestra lo que se
            tipea, aunque el evento sí se dispare.
          </li>
          <li>
            <strong className="text-foreground">
              Mezclar controlado y no controlado en el mismo input.
            </strong>{" "}
            Si value pasa de undefined a un string entre renders (por
            ejemplo, por un dato que tarda en llegar), React tira un
            warning: &ldquo;A component is changing an uncontrolled input
            to be controlled&rdquo;. Inicializá siempre el estado con un
            string vacío, no undefined.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidarse e.preventDefault() en el submit del form.
            </strong>{" "}
            Sin eso, el navegador hace un submit HTML tradicional y
            recarga la página entera.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Inputs controlados cuando necesitás validar, formatear o
            deshabilitar algo en base a lo que se tipea en tiempo real.
          </li>
          <li>
            Inputs no controlados para formularios simples y grandes,
            donde re-renderizar en cada tecla no aporta nada (por
            ejemplo, un formulario de registro que solo valida al
            enviar).
          </li>
          <li>
            Combinar ambos enfoques según el campo: un buscador con
            autocompletado necesita ser controlado; un campo de
            comentario largo puede no necesitarlo.
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
            Este input tira un warning en consola la primera vez que el
            usuario tipea algo: &ldquo;A component is changing an
            uncontrolled input to be controlled&rdquo;. ¿Por qué, y cómo
            lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Formulario({ datosIniciales }) {
  const [nombre, setNombre] = useState(datosIniciales.nombre);

  return <input value={nombre} onChange={(e) => setNombre(e.target.value)} />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Si <code>datosIniciales.nombre</code> llega como{" "}
              <code>undefined</code> en el primer render (por ejemplo,
              porque los datos todavía no cargaron), el input arranca sin{" "}
              <code>value</code> — React lo trata como{" "}
              <strong className="text-foreground">no controlado</strong>.
              En cuanto <code>datosIniciales.nombre</code> pasa a tener
              un string real, el input &ldquo;se convierte&rdquo; en
              controlado a mitad de camino, y React avisa con el warning.
            </p>
            <p className="mt-2">El fix es asegurar un string vacío como fallback, para que el input sea controlado desde el primer render:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-surface p-3 font-mono text-xs text-muted-foreground">
{`const [nombre, setNombre] = useState(datosIniciales.nombre ?? '');`}
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
            Librerías como{" "}
            <strong className="text-foreground">React Hook Form</strong>{" "}
            usan inputs no controlados por defecto (registrados con refs
            vía <code>register()</code>), en vez de un{" "}
            <code>useState</code> por campo. Esto evita que el componente
            completo re-renderice en cada tecla de cualquier campo —
            relevante en formularios grandes con validaciones complejas.
          </p>
          <p>
            Compartir un schema de validación (como Zod) entre cliente y
            servidor evita definir la misma regla dos veces: el cliente
            lo usa para mostrar errores en tiempo real, el servidor lo
            usa para validar de verdad (nunca confiando en que los datos
            que llegan ya fueron validados del lado del cliente).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Validar en cada tecla sin dar margen a terminar de escribir.
            </strong>{" "}
            Muestra errores prematuros mientras el usuario todavía está
            completando el campo — mejor validar en onBlur o con un
            pequeño debounce.
          </li>
          <li>
            <strong className="text-foreground">
              Duplicar reglas de validación entre frontend y backend sin
              un schema compartido.
            </strong>{" "}
            Eventualmente se desincronizan cuando alguien actualiza una
            sin la otra.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            React Hook Form para formularios grandes (10+ campos) donde
            minimizar re-renders por tecla importa de verdad.
          </li>
          <li>
            Un schema de Zod compartido entre el formulario del cliente y
            el endpoint que recibe esos mismos datos.
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
            Atributos HTML como <code>required</code>,{" "}
            <code>type=&quot;email&quot;</code>, <code>pattern</code>{" "}
            disparan la validación nativa del navegador sin necesitar
            JavaScript. Conviene apoyarse en ella para reglas básicas y
            universales, porque funciona incluso si JavaScript falla en
            cargar, y el navegador maneja foco y accesibilidad de forma
            consistente.
          </p>
          <p>
            El modelo de <strong className="text-foreground">
            form actions</strong> de React 19 (
            <code>{"<form action={fn}>"}</code>) permite pasar una función
            (posiblemente una Server Action) como el action nativo del
            formulario, en vez de interceptar todo con{" "}
            <code>onSubmit</code>. La ventaja es progressive enhancement:
            el formulario funciona incluso si JavaScript no cargó todavía,
            porque se engancha al mecanismo nativo del navegador en vez
            de reemplazarlo por completo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Reemplazar toda la validación nativa con JavaScript
              innecesariamente.
            </strong>{" "}
            Pierde el beneficio de accesibilidad y resiliencia que da la
            validación del navegador para las reglas básicas.
          </li>
          <li>
            <strong className="text-foreground">
              Depender 100% de onSubmit sin considerar progressive
              enhancement en apps críticas.
            </strong>{" "}
            Si JavaScript falla en cargar, un formulario con onSubmit
            tradicional deja de funcionar por completo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar required/type nativo para las validaciones básicas de un
            formulario público de alto tráfico, donde la resiliencia
            importa.
          </li>
          <li>
            Migrar un formulario crítico a form actions con
            useActionState para obtener progressive enhancement gratis.
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
