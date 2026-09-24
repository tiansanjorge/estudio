import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { TransaccionesSimulador } from "@/components/modulo/TransaccionesSimulador";
import { entrevistaTransaccionesAcid } from "@/lib/modules/bases-de-datos/transacciones-acid-entrevista";

const preguntasPorNivel = {
  1: entrevistaTransaccionesAcid.filter((p) => p.nivel === 1),
  2: entrevistaTransaccionesAcid.filter((p) => p.nivel === 2),
  3: entrevistaTransaccionesAcid.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Transacciones & ACID — Dev Study Lab",
  description:
    "Atomicidad, consistencia, aislamiento y durabilidad; niveles de aislamiento, lost update, write skew, MVCC, deadlocks y SERIALIZABLE con reintentos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un pedido se crea, pero falla la inserción de sus ítems. Dentro de una transacción, ¿qué queda en la base?",
    opciones: ["El pedido sin ítems", "Nada: se revierte todo", "Depende del ORM"],
    respuestaCorrecta: 1,
    explicacion: "Atomicidad: todas las operaciones o ninguna.",
  },
  {
    pregunta: "¿Qué conviene NO hacer dentro de una transacción?",
    opciones: [
      "Insertar en dos tablas",
      "Llamar a una API externa o enviar un email",
      "Leer una fila antes de actualizarla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Retiene bloqueos y una conexión mientras espera, y el efecto externo no se revierte con un ROLLBACK.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál es el nivel de aislamiento por defecto en Postgres?",
    opciones: ["READ UNCOMMITTED", "READ COMMITTED", "SERIALIZABLE"],
    respuestaCorrecta: 1,
    explicacion: "En MySQL/InnoDB, en cambio, es REPEATABLE READ.",
  },
  {
    pregunta: "¿Cuál es la forma más simple de evitar un lost update al descontar stock?",
    opciones: [
      "Leer el stock, restar en la aplicación y guardar",
      "UPDATE ... SET stock = stock - 1 WHERE stock > 0",
      "Subir el pool de conexiones",
    ],
    respuestaCorrecta: 1,
    explicacion: "La base hace la cuenta sobre el valor actual, bloqueando la fila durante el UPDATE.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué nivel de Postgres detecta el write skew?",
    opciones: ["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"],
    respuestaCorrecta: 2,
    explicacion:
      "REPEATABLE READ es snapshot isolation y lo permite; SSI detecta la dependencia lectura/escritura y aborta una transacción.",
  },
  {
    pregunta: "¿Por qué una transacción abierta durante horas degrada la base?",
    opciones: [
      "Porque bloquea todas las lecturas",
      "Porque VACUUM no puede limpiar las versiones que su snapshot todavía podría ver",
      "Porque llena el WAL",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las versiones muertas se acumulan (bloat) y los scans se vuelven más lentos.",
  },
];

export default function TransaccionesAcidPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Transacciones & ACID"
      descripcion="Qué garantiza una transacción, qué pasa cuando dos corren a la vez, y cómo elegir entre aislamiento, bloqueos y reintentos."
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
            Una <strong className="text-foreground">transacción</strong> agrupa
            varias operaciones en una unidad: <code>BEGIN</code>, las sentencias,
            y <code>COMMIT</code> para confirmarlas o <code>ROLLBACK</code> para
            descartarlas.
          </p>
          <p>
            <strong className="text-foreground">ACID</strong>: atomicidad (todo o
            nada), consistencia (se respetan los constraints), aislamiento (las
            transacciones concurrentes no se pisan) y durabilidad (lo commiteado
            sobrevive a un crash, gracias al WAL).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <TransaccionesSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Escrituras relacionadas sin transacción.</strong>{" "}
            Si falla la segunda, queda un pedido sin ítems o un débito sin crédito.
          </li>
          <li>
            <strong className="text-foreground">Transacciones largas.</strong>{" "}
            Llamadas HTTP o emails adentro retienen bloqueos y conexiones del pool.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Crear un pedido con sus ítems y descontar el stock.</li>
          <li>Una transferencia entre dos cuentas.</li>
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
            <strong className="text-foreground">Niveles de aislamiento</strong>:
            READ COMMITTED (default en Postgres), REPEATABLE READ y SERIALIZABLE.
            Más aislamiento previene más anomalías a cambio de más transacciones
            abortadas que hay que reintentar.
          </p>
          <p>
            <strong className="text-foreground">Lost update</strong>: se resuelve
            con un update atómico, un bloqueo pesimista (<code>FOR UPDATE</code>)
            o uno optimista (columna <code>version</code>).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Leer, calcular en la app y escribir.</strong>{" "}
            En READ COMMITTED, dos requests simultáneas pisan el resultado sin error.
          </li>
          <li>
            <strong className="text-foreground">Creer que la transacción sola alcanza.</strong>{" "}
            Da atomicidad, pero no evita las anomalías de concurrencia del nivel elegido.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Descontar stock con <code>stock = stock - 1 WHERE stock &gt; 0</code>.</li>
          <li>Bloqueo optimista con <code>version</code> en un formulario de edición largo.</li>
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
            <strong className="text-foreground">MVCC</strong>: cada UPDATE crea
            una versión nueva de la fila y cada transacción lee desde una
            snapshot, así que las lecturas no bloquean a las escrituras. VACUUM
            limpia las versiones muertas.
          </p>
          <p>
            <strong className="text-foreground">SERIALIZABLE (SSI)</strong>{" "}
            detecta el write skew y aborta con el error 40001: la aplicación tiene
            que reintentar la transacción completa. Los deadlocks (40P01) también
            se reintentan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">SERIALIZABLE sin reintentos.</strong>{" "}
            Los 40001 llegan al usuario como errores 500.
          </li>
          <li>
            <strong className="text-foreground">Bloqueos en distinto orden.</strong>{" "}
            Dos transferencias cruzadas (A→B y B→A) se bloquean mutuamente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>SERIALIZABLE para reglas que abarcan varias filas, como reservas sin superposición.</li>
          <li><code>idle_in_transaction_session_timeout</code> para cortar transacciones olvidadas.</li>
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
            Un sistema de turnos no debe permitir dos reservas superpuestas en la
            misma sala. Este código corre en READ COMMITTED y, bajo carga, aparecen
            reservas duplicadas. ¿Por qué, y cómo lo arreglás?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`BEGIN;
SELECT count(*) FROM reservas
WHERE sala_id = $1 AND desde < $3 AND hasta > $2;
-- si es 0:
INSERT INTO reservas (sala_id, desde, hasta) VALUES ($1, $2, $3);
COMMIT;`}
          </pre>
          <RevelarSolucion>
            <p>
              Es un write skew: dos transacciones ven 0 superposiciones al mismo
              tiempo y las dos insertan. No hay una fila existente que bloquear,
              así que <code>FOR UPDATE</code> no ayuda. La mejor solución es
              expresar la regla en la base con un constraint de exclusión, que
              rechaza el segundo INSERT sin importar el nivel de aislamiento:{" "}
              <code>
                ALTER TABLE reservas ADD EXCLUDE USING gist (sala_id WITH =,
                tstzrange(desde, hasta) WITH &amp;&amp;)
              </code>{" "}
              (requiere la extensión <code>btree_gist</code>). Alternativas:
              correr la transacción en SERIALIZABLE con reintentos, o bloquear la
              fila de la sala (<code>SELECT ... FROM salas WHERE id = $1 FOR
              UPDATE</code>) para serializar las reservas de cada sala.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
