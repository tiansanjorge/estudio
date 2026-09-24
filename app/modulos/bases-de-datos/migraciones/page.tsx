import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { MigracionesSimulador } from "@/components/modulo/MigracionesSimulador";
import { entrevistaMigraciones } from "@/lib/modules/bases-de-datos/migraciones-entrevista";

const preguntasPorNivel = {
  1: entrevistaMigraciones.filter((p) => p.nivel === 1),
  2: entrevistaMigraciones.filter((p) => p.nivel === 2),
  3: entrevistaMigraciones.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Migraciones — Dev Study Lab",
  description:
    "Versionado del schema, migraciones en el pipeline, expand/contract sin downtime, roll forward, locks en Postgres y backfills por lotes.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué comando de Prisma se corre en producción?",
    opciones: ["prisma migrate dev", "prisma migrate deploy", "prisma db push"],
    respuestaCorrecta: 1,
    explicacion:
      "migrate deploy solo aplica las pendientes; migrate dev genera migraciones y es para desarrollo.",
  },
  {
    pregunta: "Una migración ya se aplicó en staging y tiene un error. ¿Qué hacés?",
    opciones: ["La edito", "Creo una migración nueva que lo corrija", "Borro la tabla de migraciones"],
    respuestaCorrecta: 1,
    explicacion: "Editar una migración aplicada hace que los entornos diverjan.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué un RENAME COLUMN directo rompe un rolling deploy?",
    opciones: [
      "Porque es lento",
      "Porque las instancias de la versión vieja siguen usando el nombre anterior",
      "Porque Postgres no lo permite",
    ],
    respuestaCorrecta: 1,
    explicacion: "Durante el deploy conviven las dos versiones de la app.",
  },
  {
    pregunta: "¿Qué hace que revertir un deploy sea seguro sin tocar la base?",
    opciones: [
      "Tener down migrations",
      "Que el schema nuevo sea compatible con la versión vieja del código",
      "Correr las migraciones al arrancar la app",
    ],
    respuestaCorrecta: 1,
    explicacion: "Es lo que garantiza expand/contract en cada paso.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo agregás una foreign key a una tabla de 100 millones de filas sin bloquearla?",
    opciones: [
      "ADD CONSTRAINT ... NOT VALID y después VALIDATE CONSTRAINT",
      "En una ventana de mantenimiento, siempre",
      "No se puede",
    ],
    respuestaCorrecta: 0,
    explicacion: "La validación posterior usa un lock que no bloquea escrituras.",
  },
  {
    pregunta: "¿Para qué sirve SET lock_timeout en una migración?",
    opciones: [
      "Para que termine más rápido",
      "Para que no quede esperando un lock y encole todas las consultas detrás",
      "Para evitar deadlocks entre migraciones",
    ],
    respuestaCorrecta: 1,
    explicacion: "Si no consigue el lock en pocos segundos, falla y se reintenta.",
  },
];

export default function MigracionesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Migraciones"
      descripcion="Cómo cambiar el schema de una base en producción sin perder datos ni cortar el servicio."
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
            Una <strong className="text-foreground">migración</strong> es un
            cambio de schema versionado en el repositorio. La base registra cuáles
            se aplicaron, así que todos los entornos llegan al mismo schema.
          </p>
          <p>
            Con Prisma: <code>migrate dev</code> genera y aplica en local,{" "}
            <code>migrate deploy</code> aplica las pendientes en producción, como
            paso del pipeline antes del deploy de la app.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <MigracionesSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">No leer el SQL generado.</strong>{" "}
            Un rename puede aparecer como DROP + ADD y perder la columna con sus datos.
          </li>
          <li>
            <strong className="text-foreground">Usar <code>db push</code> en producción.</strong>{" "}
            Sincroniza sin dejar historial de migraciones.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un job de CI que corre <code>migrate deploy</code> antes de desplegar.</li>
          <li>Probar una migración en una branch de Neon con datos reales.</li>
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
            <strong className="text-foreground">Expand / contract</strong>: cada
            estado del schema tiene que funcionar con las dos versiones de la app
            que pueden estar corriendo durante un deploy.
          </p>
          <p>
            <strong className="text-foreground">Roll forward</strong> antes que
            down migrations: si el schema es compatible hacia atrás, revertir el
            código alcanza.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Migración y código incompatible en el mismo deploy.</strong>{" "}
            Borrar una columna que la versión vieja todavía lee.
          </li>
          <li>
            <strong className="text-foreground">Confiar en down migrations sin probarlas.</strong>{" "}
            Muchas no pueden recuperar datos borrados.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Renombrar una columna de una tabla en uso en varios deploys.</li>
          <li>Separar un campo de dirección en calle, número y ciudad.</li>
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
            <strong className="text-foreground">Locks</strong>: la mayoría de los
            ALTER TABLE toman ACCESS EXCLUSIVE. El riesgo está en los que
            reescriben o recorren la tabla, y en quedar esperando un lock con
            consultas encoladas detrás.
          </p>
          <p>
            <strong className="text-foreground">Backfills</strong>: por lotes,
            idempotentes, recorriendo por clave primaria y separados de la
            migración de schema.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Cambiar int a bigint en caliente.</strong>{" "}
            Reescribe la tabla entera bajo lock exclusivo.
          </li>
          <li>
            <strong className="text-foreground">Un UPDATE de 50 millones de filas.</strong>{" "}
            Transacción gigante, réplicas atrasadas y todo se revierte si falla.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Agregar una foreign key con <code>NOT VALID</code> + <code>VALIDATE</code>.</li>
          <li>Un job de backfill que se puede pausar y retomar.</li>
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
            La tabla <code>eventos</code> tiene 200 millones de filas y su{" "}
            <code>id</code> es <code>integer</code>: se va a quedar sin ids en
            unos meses. Planificá la migración a <code>bigint</code> sin downtime.
          </p>
          <RevelarSolucion>
            <p>
              Un <code>ALTER COLUMN TYPE bigint</code> reescribe la tabla bajo
              lock exclusivo durante horas, así que se hace con expand/contract.
              1) Agregar <code>id_nuevo bigint</code> nullable (instantáneo). 2)
              Un trigger que copie <code>id</code> a <code>id_nuevo</code> en cada
              INSERT/UPDATE, para que las filas nuevas ya lleguen completas. 3)
              Backfill por lotes, recorriendo por id, idempotente. 4) Índice
              único con <code>CREATE UNIQUE INDEX CONCURRENTLY</code> sobre{" "}
              <code>id_nuevo</code> y un <code>CHECK (id_nuevo IS NOT NULL)
              NOT VALID</code> validado aparte. 5) En una transacción corta con{" "}
              <code>lock_timeout</code>: pasar la secuencia a la columna nueva,
              cambiar la primary key usando el índice ya creado (<code>ADD
              CONSTRAINT ... PRIMARY KEY USING INDEX</code>), renombrar las
              columnas y borrar el trigger. Las foreign keys de otras tablas que
              apuntan a <code>eventos.id</code> también tienen que pasar a bigint,
              con la misma técnica. Probarlo antes en una copia de la base con
              datos reales, midiendo cuánto tarda cada paso.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
