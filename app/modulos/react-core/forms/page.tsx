import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { FormsSimulador } from "@/components/modulo/FormsSimulador";
import { InputControladoDemo } from "@/components/modulo/InputControladoDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosForms } from "@/lib/modules/react-core/forms-escenarios";

export const metadata: Metadata = {
  title: "Forms — Frontend Study Lab",
  description:
    "Un input controlado no solo lee lo que el usuario tipea: React decide qué mostrar en cada render. Sin setState, el input deja de responder.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace que un input sea 'controlado' en React?",
    opciones: [
      "Que tenga un placeholder",
      "Que su value esté atado al estado de React, y el onChange sea el único lugar que actualiza ese estado",
      "Que use TypeScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un input controlado recibe su value desde el estado de React. React 'decide' qué mostrar en cada render — el DOM no maneja el valor por su cuenta.",
  },
  {
    pregunta: "Si un input controlado no llama a setState en su onChange, ¿qué pasa al escribir?",
    opciones: [
      "El input funciona normal, como uno nativo",
      "El input no muestra lo que se tipea: React sigue forzando el value viejo en cada render",
      "Da un error en consola y detiene la app",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Como React controla el value del input, sin un setState que lo actualice, sigue forzando el mismo valor de siempre — el input parece 'trabado', aunque el usuario esté tipeando.",
  },
  {
    pregunta: "¿Cuál es la ventaja principal de un input no controlado (uncontrolled) con ref?",
    opciones: [
      "Es más seguro",
      "El DOM maneja su propio valor sin re-renderizar el componente en cada tecla; se lee recién cuando hace falta (ej: al submit)",
      "Permite usar TypeScript más estricto",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un input no controlado deja que el navegador maneje el valor internamente. React no re-renderiza en cada tecla — se accede al valor puntualmente vía ref cuando hace falta.",
  },
];

export default function FormsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Forms"
      descripcion="En un input controlado, React no observa lo que escribís: decide qué mostrar. Esa diferencia explica tanto su poder como su bug más común."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Apagá el toggle y probá escribir — es el mismo bug del
          escenario anterior, pero reproducido en vivo.
        </p>
        <InputControladoDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`const [nombre, setNombre] = useState(datosIniciales.nombre ?? '');`}
            </pre>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
