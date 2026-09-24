import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { SqlNosqlComparador } from "@/components/modulo/SqlNosqlComparador";
import { entrevistaSqlVsNosql } from "@/lib/modules/bases-de-datos/sql-vs-nosql-entrevista";

const preguntasPorNivel = {
  1: entrevistaSqlVsNosql.filter((p) => p.nivel === 1),
  2: entrevistaSqlVsNosql.filter((p) => p.nivel === 2),
  3: entrevistaSqlVsNosql.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "SQL vs NoSQL — Dev Study Lab",
  description:
    "Relacional vs documentos, clave-valor y otros modelos: cuándo elegir cada uno, embeber vs referenciar, JSONB, ACID vs BASE y DynamoDB.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué base conviene por defecto para una aplicación de negocio típica?",
    opciones: ["Una NoSQL, porque escala", "Una relacional como Postgres", "Redis"],
    respuestaCorrecta: 1,
    explicacion:
      "Consistencia, SQL flexible y JSONB para lo variable; NoSQL se elige por una necesidad concreta.",
  },
  {
    pregunta: "¿Qué operación es costosa si el nombre del cliente está embebido en cada pedido?",
    opciones: ["Mostrar un pedido", "Cambiar el nombre del cliente", "Crear un pedido"],
    respuestaCorrecta: 1,
    explicacion:
      "Hay que actualizar todas las copias, o aceptar que queden desactualizadas.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuándo referenciar en vez de embeber en una base de documentos?",
    opciones: [
      "Cuando se lee siempre junto al padre",
      "Cuando el dato se comparte, cambia seguido o la lista puede crecer sin límite",
      "Nunca",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Embeber es ideal para lo que pertenece al documento y está acotado.",
  },
  {
    pregunta: "¿Qué permite JSONB en Postgres?",
    opciones: [
      "Solo guardar texto",
      "Guardar JSON indexable y consultable junto a columnas tipadas",
      "Reemplazar las transacciones",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un modelo híbrido: lo crítico en columnas, lo variable en JSONB.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Según CAP, ante una partición de red un sistema distribuido tiene que elegir entre...",
    opciones: ["Velocidad y costo", "Consistencia y disponibilidad", "SQL y NoSQL"],
    respuestaCorrecta: 1,
    explicacion:
      "Muchas bases permiten elegir el nivel de consistencia por operación.",
  },
  {
    pregunta: "¿Desde dónde se diseña una tabla de DynamoDB?",
    opciones: [
      "Desde las entidades y la normalización",
      "Desde los patrones de acceso que va a tener la aplicación",
      "Desde el frontend",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada consulta tiene que ser una lectura por clave o un rango; no hay JOINs.",
  },
];

export default function SqlVsNosqlPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="SQL vs NoSQL"
      descripcion="Distintos modelos de datos optimizan distintas operaciones: cuándo conviene cada uno y por qué Postgres es un buen punto de partida."
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
            Una base <strong className="text-foreground">relacional</strong>{" "}
            guarda cada dato una vez, en tablas con relaciones, y permite
            combinarlos de cualquier forma con SQL, con transacciones y
            constraints. Las <strong className="text-foreground">NoSQL</strong>{" "}
            agrupan modelos distintos (documentos, clave-valor, columnar, grafos)
            que optimizan patrones de acceso específicos.
          </p>
          <p>
            La elección sale de <strong className="text-foreground">cómo se
            van a leer y escribir los datos</strong> y qué garantías hacen
            falta, no de la moda.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Comparador">
        <SqlNosqlComparador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;Usamos MongoDB porque no hay que definir esquema&quot;.</strong>{" "}
            El esquema existe igual, en el código.
          </li>
          <li>
            <strong className="text-foreground">Modelar documentos como si fueran tablas.</strong>{" "}
            Muchas colecciones con referencias y $lookup: lo peor de los dos mundos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Postgres para un e-commerce; Redis para sesiones y cache.</li>
          <li>Un catálogo con atributos variables por tipo de producto.</li>
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
            En documentos, <strong className="text-foreground">embeber</strong>{" "}
            lo que se lee junto y está acotado;{" "}
            <strong className="text-foreground">referenciar</strong> lo
            compartido, lo que cambia seguido o lo que crece sin límite. Una
            copia embebida puede ser una foto intencional (el precio de
            compra).
          </p>
          <p>
            Postgres con <strong className="text-foreground">JSONB</strong>{" "}
            cubre muchos casos de documentos: columnas tipadas para lo crítico y
            JSONB indexado para lo variable, en la misma base y transacción.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Arrays embebidos que crecen sin límite.</strong>{" "}
            Documentos enormes, lentos y con tope de tamaño.
          </li>
          <li>
            <strong className="text-foreground">Todo en JSONB.</strong>{" "}
            Se pierden constraints, tipos y estadísticas del planner.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Guardar el precio y el nombre del producto en cada ítem del pedido.</li>
          <li>Metadata de integraciones en una columna JSONB con índice GIN.</li>
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
            <strong className="text-foreground">ACID vs BASE</strong> y el
            teorema CAP: consistencia fuerte vs disponibilidad ante particiones.
            En la práctica, muchas bases dejan elegir por operación.
          </p>
          <p>
            <strong className="text-foreground">DynamoDB</strong> se diseña desde
            los patrones de acceso, con claves compuestas y a menudo una sola
            tabla: latencia predecible a cualquier escala, a cambio de rigidez
            ante consultas nuevas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Scans en DynamoDB para consultas frecuentes.</strong>{" "}
            Cuestan tanto como leer toda la tabla.
          </li>
          <li>
            <strong className="text-foreground">Asumir lecturas consistentes en una réplica eventual.</strong>{" "}
            El usuario no ve lo que acaba de guardar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Diseño de tabla única para un sistema de reservas serverless.</li>
          <li>Elegir lecturas fuertes solo en el paso crítico del checkout.</li>
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
            Una startup arma una plataforma de cursos: usuarios, cursos,
            inscripciones, pagos, progreso por lección y un foro por curso. El
            equipo propone MongoDB &quot;para ir rápido&quot;. ¿Qué recomendás?
          </p>
          <RevelarSolucion>
            <p>
              El núcleo es fuertemente relacional y transaccional: inscripciones
              que relacionan usuarios y cursos, pagos que no pueden quedar a
              medias, reportes (ventas por curso, progreso promedio) que
              combinan datos de muchas formas. Postgres encaja mejor, con
              constraints para la integridad y transacciones para inscripción y
              pago juntos. Lo variable (contenido de lecciones de distintos
              tipos, configuración de cada curso) puede ir en JSONB. El foro y
              el progreso por lección también entran bien en tablas. Si más
              adelante aparece un patrón específico (millones de eventos de
              progreso por segundo, búsqueda avanzada), se suma una herramienta
              para eso. &quot;Ir rápido&quot; se logra igual con un ORM y
              migraciones; el costo de migrar datos inconsistentes después es
              mucho mayor.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
