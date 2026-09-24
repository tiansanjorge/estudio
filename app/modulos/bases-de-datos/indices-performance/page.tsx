import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { IndicesSimulador } from "@/components/modulo/IndicesSimulador";
import { entrevistaIndicesPerformance } from "@/lib/modules/bases-de-datos/indices-performance-entrevista";

const preguntasPorNivel = {
  1: entrevistaIndicesPerformance.filter((p) => p.nivel === 1),
  2: entrevistaIndicesPerformance.filter((p) => p.nivel === 2),
  3: entrevistaIndicesPerformance.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Índices y query performance — Dev Study Lab",
  description:
    "B-tree, EXPLAIN ANALYZE, índices compuestos, selectividad, índices de expresión, parciales y cubrientes, y paginación por cursor.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué costo tiene agregar un índice?",
    opciones: [
      "Ninguno",
      "Espacio y escrituras más lentas: se actualiza en cada INSERT/UPDATE/DELETE",
      "Hace más lentas las lecturas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso se crean para consultas reales, no en todas las columnas.",
  },
  {
    pregunta: "¿Qué herramienta muestra el plan real de una consulta en Postgres?",
    opciones: ["EXPLAIN ANALYZE", "VACUUM", "SHOW TABLES"],
    respuestaCorrecta: 0,
    explicacion:
      "Muestra el plan, las filas estimadas contra las reales y los tiempos.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con un índice (cliente_id, fecha), ¿qué consulta NO lo aprovecha bien?",
    opciones: [
      "WHERE cliente_id = 42",
      "WHERE cliente_id = 42 AND fecha >= '2026-01-01'",
      "WHERE fecha >= '2026-01-01'",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Regla del prefijo izquierdo: sin filtrar por cliente_id, las fechas están dispersas.",
  },
  {
    pregunta: "Hay índice sobre email, pero la consulta usa lower(email). ¿Qué pasa?",
    opciones: [
      "Usa el índice igual",
      "No lo usa: hace falta un índice de expresión sobre lower(email)",
      "Da error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El índice guarda email, no el resultado de la función.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué logra INCLUDE (total) en un índice?",
    opciones: [
      "Ordena por total",
      "Permite responder solo con el índice (Index Only Scan) sin tocar la tabla",
      "Hace el total único",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un índice cubriente: las columnas incluidas no forman parte del orden.",
  },
  {
    pregunta: "¿Por qué OFFSET 100000 es lento?",
    opciones: [
      "Porque no usa índices nunca",
      "Porque recorre y descarta las 100.000 filas previas",
      "Porque bloquea la tabla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La paginación por cursor arranca directo después de la última fila vista.",
  },
];

export default function IndicesPerformancePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Índices y query performance"
      descripcion="Qué hace un índice, cómo leer un plan de ejecución, y por qué a veces la base elige no usarlo."
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
            Un <strong className="text-foreground">índice</strong> (B-tree por
            defecto) guarda valores ordenados con punteros a las filas: buscar
            cuesta log(n) en vez de leer toda la tabla. Sirve para igualdad,
            rangos, orden y joins.
          </p>
          <p>
            Cuesta espacio y escrituras. Para investigar una consulta lenta:{" "}
            <code>pg_stat_statements</code> para encontrarla y{" "}
            <code>EXPLAIN ANALYZE</code> para ver su plan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <IndicesSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Foreign keys sin índice.</strong>{" "}
            Postgres no los crea solo; los joins y los borrados en cascada se
            vuelven lentos.
          </li>
          <li>
            <strong className="text-foreground">Un índice en cada columna.</strong>{" "}
            Escrituras más lentas y la mayoría nunca se usa.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Buscar un usuario por email en el login.</li>
          <li>Diagnosticar un endpoint lento con EXPLAIN ANALYZE.</li>
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
            <strong className="text-foreground">Índices compuestos</strong>:
            regla del prefijo izquierdo; columnas de igualdad primero, rango u
            orden al final.
          </p>
          <p>
            <strong className="text-foreground">Por qué no se usa un índice</strong>:
            baja selectividad (y está bien), tablas chicas, funciones sobre la
            columna, <code>LIKE &apos;%x&apos;</code>, estadísticas viejas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>WHERE date(created_at) = &apos;2026-09-01&apos;</code>.
            </strong>{" "}
            La función anula el índice; usar un rango.
          </li>
          <li>
            <strong className="text-foreground">Índices (a) y (a, b) a la vez.</strong>{" "}
            El compuesto ya cubre las consultas del simple.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un índice (usuario_id, creado_el) para el historial de un usuario.</li>
          <li>Un índice sobre lower(email) para login sin distinguir mayúsculas.</li>
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
            Índices <strong className="text-foreground">cubrientes</strong>{" "}
            (<code>INCLUDE</code>), <strong className="text-foreground">parciales</strong>{" "}
            (<code>WHERE</code>) y otros tipos: GIN (JSONB, texto), GiST
            (rangos), BRIN (tablas enormes ordenadas físicamente).
          </p>
          <p>
            <strong className="text-foreground">Paginación por cursor</strong>{" "}
            en vez de OFFSET: costo constante por página y resultados estables.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cursor sin desempate.</strong>{" "}
            Ordenar solo por fecha saltea filas con la misma fecha; sumar el id.
          </li>
          <li>
            <strong className="text-foreground">
              <code>CREATE INDEX</code> en producción sin <code>CONCURRENTLY</code>.
            </strong>{" "}
            Bloquea las escrituras sobre la tabla mientras se construye.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un índice parcial para la cola de pedidos pendientes.</li>
          <li>Un índice GIN sobre una columna JSONB de atributos.</li>
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
            Esta consulta, la más frecuente de la app, tarda 800 ms en una tabla
            de 5 millones de filas. Diseñá el índice.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`SELECT id, titulo, creado_el
FROM tickets
WHERE empresa_id = $1 AND estado = 'abierto'
ORDER BY creado_el DESC
LIMIT 50;`}
          </pre>
          <RevelarSolucion>
            <p>
              Igualdades primero, orden al final:{" "}
              <code>
                CREATE INDEX CONCURRENTLY ON tickets (empresa_id, creado_el
                DESC) INCLUDE (id, titulo) WHERE estado = &apos;abierto&apos;
              </code>
              . Es parcial (solo los abiertos, que suelen ser una fracción
              chica), el orden del índice coincide con el <code>ORDER BY</code>{" "}
              así que no hay Sort y el <code>LIMIT</code> corta después de 50
              entradas, e <code>INCLUDE (id, titulo)</code> lo hace cubriente:
              creado_el ya está en la clave, así que las tres columnas del{" "}
              <code>SELECT</code> salen del índice. Si se filtra por varios estados,
              la alternativa es <code>(empresa_id, estado, creado_el DESC)</code>.
              Verificar con <code>EXPLAIN ANALYZE</code> que aparezca un Index
              (Only) Scan sin Sort.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
