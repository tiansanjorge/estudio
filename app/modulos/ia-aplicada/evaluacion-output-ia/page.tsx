import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CodeReviewIaSimulador } from "@/components/modulo/CodeReviewIaSimulador";
import { entrevistaEvaluacionOutputIa } from "@/lib/modules/ia-aplicada/evaluacion-output-ia-entrevista";

const preguntasPorNivel = {
  1: entrevistaEvaluacionOutputIa.filter((p) => p.nivel === 1),
  2: entrevistaEvaluacionOutputIa.filter((p) => p.nivel === 2),
  3: entrevistaEvaluacionOutputIa.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Evaluación de output de IA / code review de IA — Dev Study Lab",
  description:
    "Cómo revisar código generado por IA, errores típicos, verificación con tests, IA como revisora, evaluación de LLMs en producto y cambios en el proceso del equipo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Quién es responsable del código que genera un asistente y se mergea?",
    opciones: ["El modelo", "La persona que abre y aprueba el PR", "Nadie"],
    respuestaCorrecta: 1,
    explicacion: "'Lo generó la IA' no explica un bug en producción.",
  },
  {
    pregunta: "El asistente usa un método de una librería que no te suena. ¿Qué hacés?",
    opciones: [
      "Confiar, seguro existe",
      "Verificar que exista en la versión que usa el proyecto",
      "Borrar la librería",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las APIs inventadas o de otra versión son un error típico.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué riesgo hay en que el mismo asistente escriba el código y sus tests?",
    opciones: [
      "Ninguno",
      "Pueden compartir el mismo malentendido y validarse entre sí",
      "Los tests quedan más lentos",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso conviene definir o revisar primero los tests que expresan lo esperado.",
  },
  {
    pregunta: "¿Para qué conviene usar IA en el code review?",
    opciones: [
      "Para reemplazar la revisión humana",
      "Como primera pasada para lo mecánico, liberando a la persona para el criterio",
      "Para aprobar PRs grandes más rápido",
    ],
    respuestaCorrecta: 1,
    explicacion: "No conoce la intención del producto ni decide si el diseño es el correcto.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Cambiás el prompt de una funcionalidad con LLM. ¿Cómo sabés que no empeoró?",
    opciones: [
      "Probando dos o tres preguntas a mano",
      "Corriendo el conjunto de evaluación antes y después del cambio",
      "Esperando quejas de los usuarios",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un cambio que mejora un caso puede empeorar otros diez.",
  },
  {
    pregunta: "¿Qué pasa con el cuello de botella cuando generar código se vuelve barato?",
    opciones: ["Desaparece", "Se muda a la revisión", "Se muda al diseño gráfico"],
    respuestaCorrecta: 1,
    explicacion: "Por eso el proceso protege la revisión: PRs chicos y verificación automática.",
  },
];

export default function EvaluacionOutputIaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="IA aplicada al desarrollo"
      titulo="Evaluación de output de IA / code review de IA"
      descripcion="Cómo decidir si lo que devolvió un asistente se puede mergear, y cómo evaluar un LLM que forma parte de tu producto."
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
            El código generado se revisa como cualquier PR, con foco en sus
            fallas típicas: <strong className="text-foreground">APIs inventadas,
            dependencias innecesarias, casos borde, seguridad, tests vacíos y
            exceso de alcance</strong>.
          </p>
          <p>
            Lo que tienen en común: el código se ve plausible. La
            responsabilidad del merge es de quien lo aprueba.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CodeReviewIaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Aprobar porque compila.</strong>{" "}
            Los errores del playground compilan y pasan una prueba rápida.
          </li>
          <li>
            <strong className="text-foreground">Aceptar dependencias sin verificarlas.</strong>{" "}
            Un paquete inexistente o equivocado es una puerta de entrada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Revisar un endpoint generado buscando de dónde sale cada dato del request.</li>
          <li>Rechazar un diff que mezcla el cambio pedido con refactors no pedidos.</li>
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">Verificación</strong>: tests
            como especificación, leídos con desconfianza, herramientas
            automáticas en el CI, diffs chicos y ejecución real.
          </p>
          <p>
            <strong className="text-foreground">IA como revisora</strong>:
            primera pasada exhaustiva y mecánica; el criterio de diseño y la
            responsabilidad siguen siendo humanos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Tests que verifican el mock.</strong>{" "}
            Pasan siempre y no dicen nada del comportamiento real.
          </li>
          <li>
            <strong className="text-foreground">Un test modificado para que pase.</strong>{" "}
            Es la señal de que el código tiene un bug, no el test.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Escribir los tests de un cálculo de impuestos antes de pedir la implementación.</li>
          <li>Un revisor automático en el CI que comenta patrones riesgosos.</li>
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
            <strong className="text-foreground">LLMs en producto</strong>:
            conjuntos de evaluación, comprobaciones exactas, rúbricas y LLM como
            juez calibrado, corridos ante cada cambio, y alimentados con las
            fallas de producción.
          </p>
          <p>
            <strong className="text-foreground">Proceso del equipo</strong>: la
            revisión es el nuevo cuello de botella; PRs chicos, autoría clara,
            verificación automática, cadena de suministro y métricas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Cambiar el modelo o el prompt sin evals.</strong>{" "}
            Las regresiones aparecen en producción, contadas por los usuarios.
          </li>
          <li>
            <strong className="text-foreground">Partes críticas que nadie entiende.</strong>{" "}
            Nadie puede depurarlas en un incidente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un eval de 200 casos que corre en el CI ante cada cambio de prompt.</li>
          <li>Un límite de tamaño de PR y revisión obligatoria de dependencias nuevas.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Un equipo adoptó asistentes de IA hace tres meses. Los PRs se
            triplicaron en tamaño, el tiempo de revisión se duplicó, subieron
            los reverts y hubo un incidente por una dependencia con un nombre
            parecido a una popular. El equipo quiere seguir usando IA. ¿Qué
            cambiás en el proceso?
          </p>
          <RevelarSolucion>
            <p>
              El problema no es la herramienta sino que el proceso siguió
              pensado para cuando escribir código era lo caro. 1) Límite de
              tamaño de PR y descomposición en cambios chicos, uno por
              objetivo, con el alcance pedido y nada más. 2) El autor responde
              por cada línea: en la descripción del PR explica qué hace y cómo
              lo verificó, no solo qué pidió. 3) Verificación automática
              obligatoria en el CI: typecheck estricto, tests con cobertura en
              lo crítico, análisis de seguridad. 4) Toda dependencia nueva pasa
              por una revisión específica (que exista, que sea la oficial, que
              esté mantenida) y, si hace falta, un allowlist. 5) Un revisor
              automático como primera pasada para liberar a las personas. 6)
              Archivos de instrucciones del proyecto versionados, con las
              convenciones que hoy se corrigen a mano en cada review. 7) Medir
              reverts, defectos y tiempo de revisión mes a mes para ver si los
              cambios funcionan.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
