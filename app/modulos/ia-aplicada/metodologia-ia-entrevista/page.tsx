import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { RespuestaIaSimulador } from "@/components/modulo/RespuestaIaSimulador";
import { entrevistaMetodologiaIa } from "@/lib/modules/ia-aplicada/metodologia-ia-entrevista-entrevista";

const preguntasPorNivel = {
  1: entrevistaMetodologiaIa.filter((p) => p.nivel === 1),
  2: entrevistaMetodologiaIa.filter((p) => p.nivel === 2),
  3: entrevistaMetodologiaIa.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Cómo comunicar tu metodología de trabajo con IA — Dev Study Lab",
  description:
    "Cómo responder en una entrevista sobre tu uso de IA: criterio, proceso, verificación y responsabilidad, historias de errores, live coding y take-home, adopción en equipos y medición.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué frase preocupa más a quien entrevista?",
    opciones: [
      "Todo lo que genera pasa por tests y mi revisión",
      "Le pido lo que necesito y, si funciona, lo subo",
      "La uso como sparring en decisiones de diseño",
    ],
    respuestaCorrecta: 1,
    explicacion: "'Si funciona' no es verificación.",
  },
  {
    pregunta: "¿Qué vale más en una respuesta sobre tu uso de IA?",
    opciones: ["La lista de herramientas que usás", "Un ejemplo real con lo que hizo la IA, lo que hiciste vos y el resultado", "El porcentaje de código generado"],
    respuestaCorrecta: 1,
    explicacion: "Un caso concreto muestra criterio mejor que cualquier generalización.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "En un take-home donde se permite IA, ¿qué conviene hacer?",
    opciones: [
      "No mencionarlo",
      "Declarar en el README qué partes hiciste con ayuda y qué decisiones fueron tuyas",
      "Usarla para todo sin revisar",
    ],
    respuestaCorrecta: 1,
    explicacion: "Muestra cómo trabajarías con el equipo, y te prepara para la entrevista de seguimiento.",
  },
  {
    pregunta: "Te preguntan por una vez que la IA te llevó por mal camino. ¿Qué se evalúa?",
    opciones: [
      "Que la IA se haya equivocado",
      "Cómo lo detectaste y qué cambiaste en tu forma de trabajar",
      "Qué herramienta usabas",
    ],
    respuestaCorrecta: 1,
    explicacion: "Que la IA se equivoque es esperable; lo que importa es tu proceso.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué métrica muestra mejor si la IA mejora la entrega de un equipo?",
    opciones: ["Líneas de código generadas", "Tiempo de ciclo y tasa de defectos", "Sugerencias aceptadas"],
    respuestaCorrecta: 1,
    explicacion: "Las métricas de uso miden actividad, no resultados.",
  },
  {
    pregunta: "¿Qué conviene evitar al introducir IA en un equipo?",
    opciones: [
      "Un piloto acotado con medición",
      "Imponerla o prohibirla por decreto",
      "Una política de qué datos se pueden compartir",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las dos cosas generan uso a escondidas y sin cuidado.",
  },
];

export default function MetodologiaIaEntrevistaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="IA aplicada al desarrollo"
      titulo="Cómo comunicar tu metodología de trabajo con IA"
      descripcion="Cómo contar en una entrevista la forma en que trabajás con IA, para que transmita criterio y no dependencia."
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
            Una buena respuesta sobre tu uso de IA muestra{" "}
            <strong className="text-foreground">criterio, proceso,
            verificación y responsabilidad</strong>, con un ejemplo real.
          </p>
          <p>
            Lo que el equipo quiere saber es si va a poder confiar en lo que
            mergeás. Los fundamentos están en los otros módulos de esta
            categoría; este es cómo contarlos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <RespuestaIaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Presumir porcentajes de código generado.</strong>{" "}
            Suena a falta de criterio, no a productividad.
          </li>
          <li>
            <strong className="text-foreground">Una respuesta genérica sin ejemplo.</strong>{" "}
            Cualquiera puede decir &quot;la uso con cuidado&quot;.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Preparar una respuesta de dos minutos con un caso propio.</li>
          <li>Tener claro qué tareas delegás y cuáles no, y por qué.</li>
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
            <strong className="text-foreground">Historias</strong>: una vez que
            la IA se equivocó, cómo lo detectaste y qué cambiaste. Muestra que
            tu proceso funciona.
          </p>
          <p>
            <strong className="text-foreground">Procesos de selección</strong>:
            preguntar las reglas, pensar en voz alta, declarar el uso en un
            take-home, y poder defender cada línea.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Usar IA en un proceso que la prohíbe.</strong>{" "}
            Se nota en la entrevista de seguimiento y rompe la confianza.
          </li>
          <li>
            <strong className="text-foreground">Una historia de error sin aprendizaje.</strong>{" "}
            Lo que se evalúa es qué cambiaste después.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Una sección &quot;Uso de IA&quot; en el README de un take-home.</li>
          <li>Una historia preparada de un error detectado por tu proceso.</li>
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
            <strong className="text-foreground">Liderazgo</strong>: introducir
            la IA en un equipo con objetivo, bases de seguridad, un piloto y
            ajustes al proceso de revisión.
          </p>
          <p>
            <strong className="text-foreground">Medición</strong>: resultados
            (tiempo de ciclo, defectos, revisión, retrabajo) en vez de
            actividad, y una conclusión matizada.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">&quot;Me hace diez veces más productivo&quot;.</strong>{" "}
            Sin medición, suena a exageración.
          </li>
          <li>
            <strong className="text-foreground">Medir sugerencias aceptadas.</strong>{" "}
            Mide uso, no si el equipo entrega mejor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un piloto de un mes con métricas antes y después.</li>
          <li>Una guía de uso de IA escrita por el equipo y versionada en el repo.</li>
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
            Escribí tu propia respuesta de dos minutos a &quot;¿cómo usás la IA
            para programar?&quot;, con un caso real tuyo. Después revisala con
            esta lista.
          </p>
          <RevelarSolucion etiqueta="Ver la lista de revisión">
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>¿Dice dónde la usás y dónde no, con una razón?</li>
              <li>¿Describe un proceso concreto (contexto, plan, iteración)?</li>
              <li>¿Explica cómo verificás lo que genera?</li>
              <li>¿Deja claro que el código que mergeás es tu responsabilidad?</li>
              <li>¿Tiene un ejemplo real, con lo que hizo la IA, lo que hiciste vos y un resultado?</li>
              <li>¿Menciona cómo cuidás datos y secretos?</li>
              <li>¿Evita listas de herramientas, porcentajes y frases del tipo &quot;si funciona lo subo&quot;?</li>
              <li>¿Es verdad? Te van a repreguntar por los detalles.</li>
            </ul>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
