import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PromptSimulador } from "@/components/modulo/PromptSimulador";
import { entrevistaPromptEngineering } from "@/lib/modules/ia-aplicada/prompt-engineering-entrevista";

const preguntasPorNivel = {
  1: entrevistaPromptEngineering.filter((p) => p.nivel === 1),
  2: entrevistaPromptEngineering.filter((p) => p.nivel === 2),
  3: entrevistaPromptEngineering.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Prompt engineering aplicado a desarrollo — Dev Study Lab",
  description:
    "Qué hace funcionar un pedido a un asistente de código, contexto persistente del proyecto, plan antes del código, debugging asistido, límites del contexto e instrucciones como artefactos del equipo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué suele pasar si el prompt no dice qué stack usa el proyecto?",
    opciones: [
      "Genera código para otro framework u ORM",
      "Pregunta siempre antes de escribir código",
      "Detecta el stack solo, leyendo el prompt",
    ],
    respuestaCorrecta: 0,
    explicacion: "Completa lo que falta con lo más probable en general, no con lo de tu proyecto.",
  },
  {
    pregunta: "¿Dónde conviene guardar las convenciones del proyecto para el asistente?",
    opciones: [
      "En cada prompt, copiadas al principio",
      "En un archivo de instrucciones del repo",
      "En la memoria del chat de cada persona",
    ],
    respuestaCorrecta: 1,
    explicacion: "Se cargan siempre, se versionan y además le sirven a las personas nuevas.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué pedir un plan antes del código en una tarea ambigua?",
    opciones: [
      "Porque el modelo escribe mejor código si primero lo planifica en texto",
      "Porque así el asistente consume menos tokens en la respuesta final",
      "Porque corregir un plan cuesta mucho menos que corregir código",
    ],
    respuestaCorrecta: 2,
    explicacion: "El malentendido aparece en el plan, antes de las doscientas líneas.",
  },
  {
    pregunta: "El asistente propone envolver el error en un try/catch vacío. ¿Qué hacés?",
    opciones: [
      "Pedir el diagnóstico de la causa antes de aceptar un arreglo",
      "Aceptarlo y agregar un log adentro para no perder el error",
      "Aceptarlo si los tests pasan con el cambio",
    ],
    respuestaCorrecta: 0,
    explicacion: "Esconder el síntoma no arregla el problema.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Una conversación lleva 150 mensajes y el asistente olvida decisiones del principio. ¿Qué hacés?",
    opciones: [
      "Repetirle las decisiones importantes en cada mensaje nuevo",
      "Resumir en una sesión nueva y llevar lo permanente al archivo de instrucciones",
      "Seguir en la misma conversación, porque tiene todo el contexto",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las conversaciones largas acumulan ruido y el contexto importante pierde peso.",
  },
  {
    pregunta: "¿Qué instrucción es más útil en un archivo de reglas del proyecto?",
    opciones: [
      "Escribí código limpio y de buena calidad",
      "Seguí las mejores prácticas de la industria",
      "Corré npx tsc --noEmit y los tests antes de terminar",
    ],
    respuestaCorrecta: 2,
    explicacion: "Concreta y verificable: se sabe si se cumplió.",
  },
];

export default function PromptEngineeringPage() {
  return (
    <ModuloLayout
      categoriaTitulo="IA aplicada al desarrollo"
      titulo="Prompt engineering aplicado a desarrollo"
      descripcion="Cómo pedirle trabajo a un asistente de código para que el resultado sirva, y cómo hacer que eso no dependa de la suerte."
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
            Un buen pedido es un buen ticket: <strong className="text-foreground">contexto,
            objetivo concreto, restricciones, un ejemplo del repo, formato y
            criterios de verificación</strong>.
          </p>
          <p>
            Lo que el modelo no ve, lo completa con lo más probable en general.
            El contexto permanente va en archivos de instrucciones del
            repositorio.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PromptSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;Hacé X&quot; sin más.</strong>{" "}
            El tiempo que no se invirtió en el pedido se gasta revisando código equivocado.
          </li>
          <li>
            <strong className="text-foreground">Describir el código en vez de mostrarlo.</strong>{" "}
            Un archivo de ejemplo transmite la convención mejor que un párrafo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un AGENTS.md con el stack, los comandos y las convenciones del proyecto.</li>
          <li>Pedir un endpoint nuevo señalando uno existente como modelo.</li>
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
            <strong className="text-foreground">Tareas grandes</strong>: plan
            antes del código, pasos verificables, permiso para preguntar,
            ejemplos del repo y feedback concreto al iterar.
          </p>
          <p>
            <strong className="text-foreground">Debugging</strong>: síntoma
            exacto, reproducción, lo ya descartado, y diagnóstico antes que
            arreglo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;No funciona, arreglalo&quot;.</strong>{" "}
            Sin decir qué falla ni por qué, el siguiente intento es otra adivinanza.
          </li>
          <li>
            <strong className="text-foreground">Aceptar el parche que calla el error.</strong>{" "}
            El síntoma desaparece y el bug queda.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Implementar una funcionalidad en tres pasos con tests entre cada uno.</li>
          <li>Pegar el stack trace completo y pedir hipótesis antes que cambios.</li>
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
            <strong className="text-foreground">Contexto</strong>: capacidad,
            atención y deriva en conversaciones largas. Incluir lo relevante,
            sesiones acotadas y lo permanente en archivos de instrucciones.
          </p>
          <p>
            <strong className="text-foreground">Prompts del equipo</strong>:
            versionados, revisados, convertidos en comandos reutilizables,
            precisos y evaluados contra tareas conocidas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Volcar todo el repositorio en el contexto.</strong>{" "}
            Lo importante queda diluido entre lo irrelevante.
          </li>
          <li>
            <strong className="text-foreground">Instrucciones vagas del tipo &quot;hacelo bien&quot;.</strong>{" "}
            No se pueden cumplir ni verificar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un comando de equipo para crear migraciones con sus tests.</li>
          <li>Revisar en un PR el cambio a las instrucciones del asistente.</li>
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
            Reescribí este pedido para que dé un resultado útil a la primera:
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`el login a veces falla, fijate y arreglalo`}
          </pre>
          <RevelarSolucion>
            <p>
              Un pedido útil incluye el síntoma, la reproducción y lo que se
              espera, y pide diagnóstico antes que cambios. Por ejemplo:
              &quot;El POST /api/login devuelve 500 en alrededor del 5% de los
              intentos, solo en producción. Adjunto el stack trace
              (TypeError en lib/auth/sesion.ts:42, lectura de propiedad sobre
              undefined) y dos logs de requests fallidas. Pasa con usuarios
              que se registraron con Google. Ya descarté la base: las consultas
              responden bien. Antes de cambiar código, explicame qué creés que
              causa el error, qué evidencia lo confirmaría y cómo lo
              reproduciría en un test. Restricciones: no cambies el formato de
              la cookie de sesión. El proyecto usa Next.js y las reglas están
              en AGENTS.md.&quot; Después: validar la hipótesis con el test,
              pedir el arreglo mínimo, y correr tsc y los tests.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
