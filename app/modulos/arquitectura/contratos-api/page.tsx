import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { BreakingChangesDetector } from "@/components/modulo/BreakingChangesDetector";
import { entrevistaContratosApi } from "@/lib/modules/arquitectura/contratos-api-entrevista";

const preguntasPorNivel = {
  1: entrevistaContratosApi.filter((p) => p.nivel === 1),
  2: entrevistaContratosApi.filter((p) => p.nivel === 2),
  3: entrevistaContratosApi.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Contratos de API (OpenAPI) — Dev Study Lab",
  description:
    "OpenAPI como contrato: breaking changes, design-first vs code-first, versionado, expand/contract y verificación en el CI.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estos cambios es compatible hacia atrás?",
    opciones: [
      "Renombrar un campo de la respuesta",
      "Agregar un campo opcional a la respuesta",
      "Hacer obligatorio un campo del request",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los clientes ignoran lo que no conocen; los otros dos rompen a clientes existentes.",
  },
  {
    pregunta: "¿Qué se puede generar a partir de un contrato OpenAPI?",
    opciones: [
      "Solo documentación",
      "Tipos y clientes, mocks, validación y tests de contrato",
      "Solo el servidor",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El contrato es una fuente de verdad legible por máquinas.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ventaja principal tiene design-first?",
    opciones: [
      "El contrato nunca se desactualiza",
      "Front y back trabajan en paralelo sobre un contrato pensado para el consumidor",
      "No hace falta escribir código",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El riesgo es que la implementación se desvíe si no se valida.",
  },
  {
    pregunta: "¿Qué headers comunican que un endpoint está deprecado y cuándo se apaga?",
    opciones: ["Cache-Control y ETag", "Deprecation y Sunset", "Allow y Vary"],
    respuestaCorrecta: 1,
    explicacion:
      "Junto con deprecated: true en el contrato y comunicación directa a los clientes.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "En expand/contract, ¿cuándo se quita el campo viejo?",
    opciones: [
      "En el mismo deploy que se agrega el nuevo",
      "Cuando el monitoreo muestra que nadie lo usa o vence el plazo anunciado",
      "Nunca",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Clave con apps mobile, donde versiones viejas conviven durante meses.",
  },
  {
    pregunta: "¿Qué hace oasdiff en un pipeline?",
    opciones: [
      "Genera el frontend",
      "Compara el contrato del PR con el de main y detecta breaking changes",
      "Despliega la API",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un cambio incompatible falla el CI o exige aprobación explícita.",
  },
];

export default function ContratosApiPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Contratos de API (OpenAPI)"
      descripcion="La API como contrato explícito entre equipos: qué cambios lo rompen, cómo versionar, y cómo verificarlo en cada PR."
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
            <strong className="text-foreground">OpenAPI</strong> describe una
            API HTTP en YAML o JSON: endpoints, parámetros, schemas, status y
            autenticación. Más que documentación, es un{" "}
            <strong className="text-foreground">contrato</strong> legible por
            máquinas del que se generan tipos, clientes, mocks y tests.
          </p>
          <p>
            Un <strong className="text-foreground">breaking change</strong> hace
            fallar a un cliente que funcionaba sin que ese cliente cambie:
            quitar o renombrar campos, cambiar tipos, agregar campos
            obligatorios. Agregar endpoints o campos opcionales suele ser
            compatible.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Detector de breaking changes">
        <BreakingChangesDetector />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">&quot;Solo renombré un campo&quot;.</strong>{" "}
            Un renombre es un breaking change.
          </li>
          <li>
            <strong className="text-foreground">Documentación escrita a mano, aparte del código.</strong>{" "}
            Se desactualiza con el primer cambio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Generar los tipos del frontend con openapi-typescript.</li>
          <li>Acordar el contrato antes de implementar una feature entre dos equipos.</li>
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
            <strong className="text-foreground">Design-first</strong>: el
            contrato primero, diseñado para el consumidor, con trabajo en
            paralelo. <strong className="text-foreground">Code-first</strong>:
            el contrato generado desde el código, siempre fiel. La combinación
            habitual: schemas como fuente de verdad y revisión del diff del
            contrato en cada PR.
          </p>
          <p>
            <strong className="text-foreground">Versionado</strong>: primero
            evitarlo con cambios aditivos; si hace falta, por URL, header o
            fecha, con deprecación anunciada (<code>Deprecation</code>,{" "}
            <code>Sunset</code>) y período de convivencia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Una v2 por cada cambio.</strong>{" "}
            Cada versión mayor es una API más para mantener.
          </li>
          <li>
            <strong className="text-foreground">Apagar una versión sin medir quién la usa.</strong>{" "}
            El primer aviso es el cliente que se cae.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Schemas de Zod que generan el OpenAPI con zod-openapi.</li>
          <li>Una política de deprecación de 6 meses para la API pública.</li>
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
            <strong className="text-foreground">Expand/contract</strong>: un
            cambio incompatible en pasos compatibles. Se agrega lo nuevo
            conviviendo con lo viejo, los clientes migran a su ritmo, se mide el
            uso y recién después se quita lo viejo.
          </p>
          <p>
            En el <strong className="text-foreground">CI</strong>: validar
            respuestas contra el schema, fuzzing basado en el contrato, tipos y
            mocks generados en el frontend, diff de contrato entre ramas y
            contract tests dirigidos por el consumidor.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Asumir que todos los clientes se actualizan juntos.</strong>{" "}
            Las apps mobile viejas siguen instaladas meses.
          </li>
          <li>
            <strong className="text-foreground">Un contrato que ningún test verifica.</strong>{" "}
            Pasa a ser documentación decorativa.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Renombrar un campo usado por la app mobile sin romper versiones viejas.</li>
          <li>Un paso de oasdiff que bloquea merges con breaking changes.</li>
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
            Tenés que cambiar <code>precio</code> (number, en pesos) por{" "}
            <code>precio: {"{ monto: number, moneda: string }"}</code> para
            soportar dólares. La API la usan la web, una app mobile (con
            versiones de hace 8 meses todavía activas) y dos integraciones de
            clientes. ¿Cómo lo hacés?
          </p>
          <RevelarSolucion>
            <p>
              Es un breaking change (cambia el tipo), así que expand/contract.
              Expand: agregar un campo nuevo <code>precioDetalle</code> con el
              objeto, y seguir devolviendo <code>precio</code> como number en
              pesos (para productos en dólares, convertido); marcar{" "}
              <code>precio</code> como <code>deprecated</code> en el contrato y
              con headers <code>Deprecation</code>/<code>Sunset</code>. Migrate:
              la web se actualiza enseguida, la app mobile en su próxima versión,
              y se avisa a las integraciones con fecha; se mide el uso de{" "}
              <code>precio</code> por cliente y versión de la app. Contract:
              quitar <code>precio</code> cuando el uso caiga a cero o venza el
              plazo, y forzar actualización de versiones mobile muy viejas si
              hace falta. Alternativa: publicar una <code>v2</code> si hay más
              cambios incompatibles acumulados.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
