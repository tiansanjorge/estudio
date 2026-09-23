import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { FrameworksNodeComparador } from "@/components/modulo/FrameworksNodeComparador";
import { entrevistaFrameworksNode } from "@/lib/modules/backend/frameworks-node-entrevista";

const preguntasPorNivel = {
  1: entrevistaFrameworksNode.filter((p) => p.nivel === 1),
  2: entrevistaFrameworksNode.filter((p) => p.nivel === 2),
  3: entrevistaFrameworksNode.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Fastify / Express / NestJS — Dev Study Lab",
  description:
    "Trade-offs entre los frameworks de Node: middlewares, performance, validación, guards e inyección de dependencias, y cuándo elegir otra cosa.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué framework impone una estructura de módulos, controllers e inyección de dependencias?",
    opciones: ["Express", "Fastify", "NestJS"],
    respuestaCorrecta: 2,
    explicacion:
      "Express y Fastify dejan la estructura a criterio del equipo.",
  },
  {
    pregunta: "En Express, ¿dónde se registra el manejador de errores?",
    opciones: [
      "Al principio, antes de todo",
      "Al final, con la firma (err, req, res, next)",
      "Dentro de cada ruta",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los middlewares corren en orden; el de errores recibe lo que se pasa con next(err).",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué le da velocidad a Fastify al responder?",
    opciones: [
      "Usa otro lenguaje",
      "Compila la serialización a partir del schema de respuesta",
      "Desactiva la validación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Además filtra los campos que no están en el schema.",
  },
  {
    pregunta: "En NestJS, ¿qué pieza decide si un request está autorizado?",
    opciones: ["Pipe", "Guard", "Interceptor"],
    respuestaCorrecta: 1,
    explicacion:
      "Los pipes validan/transforman parámetros; los interceptors envuelven la ejecución.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué permite overrideProvider en un test de NestJS?",
    opciones: [
      "Cambiar el puerto",
      "Reemplazar una dependencia (por ejemplo la pasarela de pagos) por un fake",
      "Saltear los guards",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es uno de los beneficios concretos de la inyección de dependencias.",
  },
  {
    pregunta: "Necesitás que el mismo código corra en Node, Bun y Cloudflare Workers. ¿Qué encaja mejor?",
    opciones: ["Express", "Hono, basado en APIs web estándar", "NestJS"],
    respuestaCorrecta: 1,
    explicacion:
      "Usa Request/Response estándar, disponibles en todos esos runtimes.",
  },
];

export default function FrameworksNodePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Fastify / Express / NestJS"
      descripcion="Tres formas de construir un backend en Node: minimalismo, performance con opiniones, o estructura completa. Cuándo conviene cada una."
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
            <strong className="text-foreground">Express</strong>: minimalista y
            universal, pero todo lo demás lo elegís vos.{" "}
            <strong className="text-foreground">Fastify</strong>: igual de
            simple, moderno y rápido, con validación por schema y logging
            incluidos. <strong className="text-foreground">NestJS</strong>:
            framework completo con módulos, inyección de dependencias y
            decoradores, sobre Express o Fastify.
          </p>
          <p>
            No hay un ganador absoluto: depende del tamaño del equipo, de
            cuánta estructura hace falta y de la experiencia que ya existe.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Comparador">
        <FrameworksNodeComparador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Handlers async en Express 4 sin try/catch.</strong>{" "}
            El error no llega al manejador y queda como promesa rechazada.
          </li>
          <li>
            <strong className="text-foreground">Elegir por benchmarks.</strong>{" "}
            Si el handler espera 50 ms a la base, el framework no es el cuello
            de botella.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un servicio nuevo en Fastify con type provider de Zod.</li>
          <li>Un backend de varios equipos organizado en módulos de NestJS.</li>
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
            <strong className="text-foreground">Fastify</strong> compila la
            validación y la serialización a partir de los schemas, y tiene un
            router y un core con menos overhead. La diferencia importa en
            servicios de mucho tráfico con handlers livianos.
          </p>
          <p>
            <strong className="text-foreground">NestJS</strong> saca las
            preocupaciones transversales de los handlers: guards (autorización),
            pipes (validación), interceptors (logging, formato) y exception
            filters (errores).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Schemas de respuesta desincronizados con los tipos.</strong>{" "}
            Un type provider los deriva de una sola fuente.
          </li>
          <li>
            <strong className="text-foreground">Lógica de negocio en un interceptor.</strong>{" "}
            Queda escondida donde nadie la busca.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un interceptor que envuelve todas las respuestas en un formato común.</li>
          <li>Un guard global con <code>@Public()</code> para las rutas abiertas.</li>
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
            La <strong className="text-foreground">inyección de dependencias</strong>{" "}
            de NestJS desacopla, facilita los tests (reemplazar providers) y
            maneja el ciclo de vida. Ojo con el scope por request (caro) y con{" "}
            <code>forwardRef</code> (suele indicar un problema de diseño).
          </p>
          <p>
            A veces la respuesta es otra: Route Handlers de Next para un BFF,
            Hono para varios runtimes, tRPC en un monorepo TypeScript, o una
            herramienta que genera el CRUD.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Providers con scope por request sin necesidad.</strong>{" "}
            Se crean en cada request y ese costo se propaga a quien los usa.
          </li>
          <li>
            <strong className="text-foreground">Dependencias circulares entre módulos.</strong>{" "}
            Suelen indicar que el límite entre módulos está mal trazado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Tests de integración de Nest con la pasarela de pagos reemplazada por un fake.</li>
          <li>Un servicio edge en Hono sobre Cloudflare Workers.</li>
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
            Tu equipo de 3 personas mantiene una API en Express 4 con 80 rutas,
            sin validación ni estructura clara, y alguien propone reescribirla
            en NestJS. ¿Qué respondés?
          </p>
          <RevelarSolucion>
            <p>
              Antes de reescribir, identificar el dolor concreto: si son bugs
              por datos inválidos, falta validación; si es que nadie sabe dónde
              va cada cosa, falta estructura; si es performance, medir primero.
              Una reescritura completa congela features y trae riesgo. Opciones
              incrementales: subir a Express 5 (manejo de promesas rechazadas),
              agregar validación con Zod en un middleware por ruta, ordenar en
              capas (rutas, servicios, repositorios) y un manejador de errores
              central. Si igual se quiere NestJS, puede montarse sobre el mismo
              Express y migrar módulo por módulo. Para 3 personas, la estructura
              de Nest puede ser más ceremonia que ayuda; Fastify es otra
              alternativa si se arranca un servicio nuevo.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
