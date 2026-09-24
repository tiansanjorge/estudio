import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { DelegacionIaSimulador } from "@/components/modulo/DelegacionIaSimulador";
import { entrevistaRiesgosLimitesIa } from "@/lib/modules/ia-aplicada/riesgos-limites-ia-entrevista";

const preguntasPorNivel = {
  1: entrevistaRiesgosLimitesIa.filter((p) => p.nivel === 1),
  2: entrevistaRiesgosLimitesIa.filter((p) => p.nivel === 2),
  3: entrevistaRiesgosLimitesIa.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Riesgos y límites del desarrollo asistido por IA — Dev Study Lab",
  description:
    "Dónde rinde la IA y dónde no, deuda de comprensión, privacidad y propiedad del código, agentes con permisos y límites estructurales de los modelos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué decide cuánto delegar una tarea a la IA?",
    opciones: [
      "Cuánto cuesta un error y qué tan fácil es detectarlo",
      "Qué tan larga es la tarea y cuánto tiempo ahorra",
      "Qué tan nueva es la tecnología para el equipo",
    ],
    respuestaCorrecta: 0,
    explicacion: "Una tarea difícil pero bien verificable se puede delegar; una fácil pero irreversible, no tanto.",
  },
  {
    pregunta: "¿Qué es la deuda de comprensión?",
    opciones: [
      "Documentación que quedó desactualizada respecto del código",
      "Código mergeado que nadie del equipo entiende del todo",
      "Tiempo que tarda una persona nueva en entender el proyecto",
    ],
    respuestaCorrecta: 1,
    explicacion: "Se paga el día que ese código falla y nadie sabe depurarlo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Necesitás depurar un error con datos de un cliente real. ¿Qué hacés?",
    opciones: [
      "Pegar los datos en el asistente, que no guarda nada",
      "Usar un asistente local, así los datos no salen",
      "Usar datos anonimizados o de ejemplo que lo reproduzcan",
    ],
    respuestaCorrecta: 2,
    explicacion: "Todo lo que entra en el contexto se envía al proveedor.",
  },
  {
    pregunta: "Un PR tiene código que el autor no puede explicar. ¿Qué corresponde?",
    opciones: [
      "No mergearlo hasta que el autor lo entienda",
      "Mergearlo si los tests y el CI pasan",
      "Mergearlo y dejar un ticket para revisarlo",
    ],
    respuestaCorrecta: 0,
    explicacion: "Quien abre el PR responde por cada línea.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Con qué credenciales debería trabajar un agente de código autónomo?",
    opciones: [
      "Las de la persona que lo lanzó, para heredar sus permisos",
      "Las de desarrollo, con el mínimo acceso necesario",
      "Las de producción, para poder verificar el resultado real",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un error de un agente con credenciales de producción tiene efectos reales inmediatos.",
  },
  {
    pregunta: "El modelo responde con total seguridad. ¿Qué indica eso sobre la corrección?",
    opciones: [
      "Que la respuesta está respaldada por varias fuentes",
      "Que la pregunta estaba dentro de su entrenamiento",
      "Nada: el tono es igual cuando acierta y cuando inventa",
    ],
    respuestaCorrecta: 2,
    explicacion: "Por eso la verificación la hacen los tests y las herramientas, no la confianza del modelo.",
  },
];

export default function RiesgosLimitesIaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="IA aplicada al desarrollo"
      titulo="Riesgos y límites del desarrollo asistido por IA"
      descripcion="Dónde conviene delegar, dónde no, y qué se pierde si el equipo deja de entender lo que construye."
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
            La IA rinde en patrones claros y verificación rápida; menos en
            arquitectura, requisitos ambiguos, comportamiento en producción y
            código crítico de seguridad.
          </p>
          <p>
            Delegar depende de <strong className="text-foreground">cuánto cuesta
            un error y qué tan fácil es detectarlo</strong>. Cómo revisar el
            código generado está en el módulo de Evaluación.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <DelegacionIaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Delegar por dificultad y no por riesgo.</strong>{" "}
            Una migración &quot;simple&quot; de producción es irreversible.
          </li>
          <li>
            <strong className="text-foreground">Confundir velocidad con avance.</strong>{" "}
            Generar rápido código que nadie entiende mueve el costo a los incidentes.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Delegar tests y componentes que siguen patrones existentes.</li>
          <li>Usar la IA como sparring para una decisión de arquitectura, sin delegar la decisión.</li>
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
            <strong className="text-foreground">Privacidad y propiedad</strong>:
            lo que entra al contexto va al proveedor; herramientas aprobadas con
            garantías, nada de secretos ni datos personales, y atención a
            licencias.
          </p>
          <p>
            <strong className="text-foreground">Comprensión</strong>: el autor
            explica, las áreas críticas tienen dueños, las decisiones se
            documentan y quienes aprenden practican sin atajos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un .env dentro de lo que el asistente puede leer.</strong>{" "}
            Los secretos terminan en el contexto sin que nadie lo decida.
          </li>
          <li>
            <strong className="text-foreground">Un junior que solo copia soluciones.</strong>{" "}
            Nunca desarrolla el criterio que necesita para revisarlas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una política del equipo sobre qué datos se pueden compartir con asistentes.</li>
          <li>ADRs escritos por personas para las decisiones de fondo.</li>
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
            <strong className="text-foreground">Agentes</strong>: mínimo
            privilegio, sandbox, aprobación para lo irreversible, allowlists,
            cambios en ramas, límites de costo y registro de acciones.
          </p>
          <p>
            <strong className="text-foreground">Límites de los modelos</strong>:
            no determinismo, fecha de corte, contexto limitado, confianza mal
            calibrada y sin acceso a producción salvo el que se les da.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un agente con acceso a producción &quot;para que sea más útil&quot;.</strong>{" "}
            Un malentendido se convierte en un incidente.
          </li>
          <li>
            <strong className="text-foreground">Confiar en una API porque el modelo la sugirió seguro.</strong>{" "}
            Puede ser de una versión vieja o no existir.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un agente en un contenedor, sin red externa y con aprobación para cada push.</li>
          <li>Tipos estrictos y tests como red de seguridad para código humano y generado.</li>
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
            Tu equipo quiere dejar un agente de IA trabajando de noche: toma
            issues etiquetados como &quot;fáciles&quot;, los implementa, corre los
            tests y abre PRs. Tiene acceso al repositorio, a la base de
            staging y a las variables de entorno del CI. Diseñá los límites
            para que sea útil sin que pueda causar un incidente.
          </p>
          <RevelarSolucion>
            <p>
              Entorno: un contenedor efímero por tarea, con el repositorio
              clonado y red restringida a lo necesario (registro de paquetes,
              la API de GitHub). Credenciales: un token de GitHub que solo
              puede crear ramas y PRs, nunca hacer push a main ni mergear; una
              base de datos descartable por tarea en vez de staging compartido;
              y ninguna variable de entorno del CI, que suele tener secretos de
              despliegue. Alcance: solo issues con la etiqueta, con límite de
              archivos tocados y de tamaño del diff; si lo supera, el PR se
              marca para revisión especial en vez de abrirse sin más. Nuevas
              dependencias: prohibidas o marcadas explícitamente para revisión.
              Límites de tiempo y costo por tarea, para cortar bucles.
              Registro de todos los comandos que ejecutó, adjunto al PR. Y
              revisión humana obligatoria de cada PR con los mismos criterios
              que cualquier otro, además de medir cuántos se mergean sin cambios
              para decidir si ampliar o recortar su alcance.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
