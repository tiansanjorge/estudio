import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ConstraintsSimulador } from "@/components/modulo/ConstraintsSimulador";
import { entrevistaPostgresEspecifico } from "@/lib/modules/bases-de-datos/postgres-especifico-entrevista";

const preguntasPorNivel = {
  1: entrevistaPostgresEspecifico.filter((p) => p.nivel === 1),
  2: entrevistaPostgresEspecifico.filter((p) => p.nivel === 2),
  3: entrevistaPostgresEspecifico.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Postgres: constraints y JSONB — Dev Study Lab",
  description:
    "Constraints como garantía de integridad, cuándo usar JSONB, tipos correctos, índices GIN y de expresión, EXCLUDE, DEFERRABLE y features que evitan otro servicio.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Dos requests registran el mismo email al mismo tiempo. ¿Qué lo impide de verdad?",
    opciones: [
      "Un constraint UNIQUE en la base",
      "Un SELECT previo que verifique el email",
      "Una transacción con READ COMMITTED",
    ],
    respuestaCorrecta: 0,
    explicacion: "La verificación previa tiene una condición de carrera; UNIQUE es atómico.",
  },
  {
    pregunta: "¿Dónde encaja mejor una columna JSONB?",
    opciones: [
      "Datos que se filtran y se unen con otras tablas en cada consulta",
      "Atributos que varían según la categoría del producto",
      "Relaciones entre entidades, para evitar las foreign keys",
    ],
    respuestaCorrecta: 1,
    explicacion: "Estructura variable entre filas; los ítems merecen su tabla con foreign keys.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué tipo usás para guardar precios?",
    opciones: [
      "double precision, con dos decimales al mostrar",
      "money, el tipo nativo de Postgres para montos",
      "numeric(12,2) o enteros en centavos",
    ],
    respuestaCorrecta: 2,
    explicacion: "Los flotantes no representan exactamente 0,1 y acumulan errores de redondeo.",
  },
  {
    pregunta: "Hay un índice GIN sobre atributos. ¿Qué consulta lo aprovecha?",
    opciones: [
      "WHERE atributos @> '{\"color\": \"rojo\"}'",
      "WHERE atributos->>'color' LIKE 'ro%'",
      "WHERE (atributos->>'precio')::numeric > 100",
    ],
    respuestaCorrecta: 0,
    explicacion: "GIN sirve para contención (@>) y existencia de claves (?), no para ->> ni para ordenar.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Con soft delete, ¿cómo hacés que el email sea único solo entre usuarios activos?",
    opciones: [
      "Un UNIQUE compuesto por email y borrado_el",
      "Un índice único parcial con WHERE borrado_el IS NULL",
      "Un trigger que verifica el email antes de insertar",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un CHECK no puede consultar otras filas; el índice parcial sí resuelve la unicidad condicional.",
  },
  {
    pregunta: "¿Qué permite que varios workers tomen jobs distintos de una tabla sin bloquearse?",
    opciones: [
      "LOCK TABLE ... IN SHARE MODE",
      "SERIALIZABLE",
      "FOR UPDATE SKIP LOCKED",
    ],
    respuestaCorrecta: 2,
    explicacion: "Cada worker saltea las filas que otro ya bloqueó.",
  },
];

export default function PostgresEspecificoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Postgres: constraints y JSONB"
      descripcion="Usar Postgres como algo más que un lugar donde guardar filas: reglas que la base garantiza y documentos flexibles donde hacen falta."
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
            Los <strong className="text-foreground">constraints</strong> (NOT
            NULL, UNIQUE, FOREIGN KEY, CHECK) son reglas que la base garantiza
            para cualquier cliente y sin condiciones de carrera. La validación en
            la app da buenos mensajes; el constraint da la garantía.
          </p>
          <p>
            <strong className="text-foreground">JSONB</strong> guarda documentos
            consultables e indexables dentro de una fila: para estructura
            variable, no para evitar modelar.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ConstraintsSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Unicidad solo en la aplicación.</strong>{" "}
            Dos requests simultáneas pasan la verificación y las dos insertan.
          </li>
          <li>
            <strong className="text-foreground">Todo en un JSONB.</strong>{" "}
            Se pierden tipos, foreign keys y reportes simples.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Responder 409 al capturar el error 23505 de un UNIQUE.</li>
          <li>Guardar el payload crudo de un webhook en JSONB.</li>
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
            <strong className="text-foreground">Tipos</strong>:{" "}
            <code>timestamptz</code> para instantes, <code>numeric</code> para
            dinero, <code>text</code> para texto, identity o UUID v7 para ids.
          </p>
          <p>
            <strong className="text-foreground">JSONB</strong>: GIN para{" "}
            <code>@&gt;</code> y <code>?</code> sobre cualquier clave, B-tree de
            expresión para una clave puntual, y columnas generadas para los
            campos más consultados.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>timestamp</code> sin zona.</strong>{" "}
            Guarda una hora de reloj sin contexto y termina en horas corridas.
          </li>
          <li>
            <strong className="text-foreground">Consultar con <code>-&gt;&gt;</code> y esperar que use el GIN.</strong>{" "}
            El índice GIN sirve para <code>@&gt;</code>.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Filtrar productos por atributos variables con <code>@&gt;</code> y un GIN.</li>
          <li>UUID v7 como id público de recursos expuestos en la API.</li>
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
            <strong className="text-foreground">Constraints avanzados</strong>:
            unique parcial, EXCLUDE para superposiciones, CHECK entre columnas,
            DEFERRABLE para chequear al COMMIT, y la acción ON DELETE correcta.
          </p>
          <p>
            <strong className="text-foreground">Postgres como plataforma</strong>:
            colas con SKIP LOCKED, búsqueda de texto, advisory locks y Row Level
            Security, antes de sumar otro servicio.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">ON DELETE CASCADE en todo.</strong>{" "}
            Borrar un cliente se lleva sus facturas; para lo que tiene valor propio, RESTRICT.
          </li>
          <li>
            <strong className="text-foreground">Confiar en NOTIFY como cola.</strong>{" "}
            Si nadie escucha en ese momento, el mensaje se pierde.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Turnos sin superposición con EXCLUDE.</li>
          <li>Una cola de emails con SKIP LOCKED, encolada en la misma transacción que el pedido.</li>
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
            Un SaaS multi-tenant tiene esta tabla. Expresá en la base estas
            reglas: el SKU es único por organización (no global), solo entre
            productos no archivados; el precio de oferta, si existe, es menor al
            precio; y ningún query puede ver productos de otra organización.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`CREATE TABLE productos (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  organizacion_id bigint NOT NULL REFERENCES organizaciones (id),
  sku             text NOT NULL,
  precio          numeric(12,2) NOT NULL,
  precio_oferta   numeric(12,2),
  archivado_el    timestamptz
);`}
          </pre>
          <RevelarSolucion>
            <p>
              Unicidad condicional con un índice parcial compuesto:{" "}
              <code>
                CREATE UNIQUE INDEX ON productos (organizacion_id, sku) WHERE
                archivado_el IS NULL
              </code>
              . La regla de precios, con un CHECK entre columnas; un NULL en{" "}
              <code>precio_oferta</code> hace que el CHECK pase, que es lo
              buscado: <code>CHECK (precio &gt; 0 AND precio_oferta &lt; precio)</code>.
              El aislamiento entre organizaciones, con Row Level Security:{" "}
              <code>ALTER TABLE productos ENABLE ROW LEVEL SECURITY</code> y una
              política{" "}
              <code>
                USING (organizacion_id = current_setting(&apos;app.organizacion_id&apos;)::bigint)
              </code>
              , seteando esa variable al principio de cada transacción. Ojo: el
              dueño de la tabla y los superusuarios saltean RLS salvo con{" "}
              <code>FORCE ROW LEVEL SECURITY</code>, así que la app tiene que
              conectarse con un rol sin esos privilegios.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
