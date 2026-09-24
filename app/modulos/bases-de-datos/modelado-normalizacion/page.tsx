import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { NormalizacionSimulador } from "@/components/modulo/NormalizacionSimulador";
import { entrevistaModeladoNormalizacion } from "@/lib/modules/bases-de-datos/modelado-normalizacion-entrevista";

const preguntasPorNivel = {
  1: entrevistaModeladoNormalizacion.filter((p) => p.nivel === 1),
  2: entrevistaModeladoNormalizacion.filter((p) => p.nivel === 2),
  3: entrevistaModeladoNormalizacion.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Modelado relacional & normalización — Dev Study Lab",
  description:
    "Anomalías de una tabla plana, normalización, relaciones muchos a muchos, cuándo desnormalizar, claves primarias y datos históricos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "El email de un cliente está repetido en cada pedido. ¿Qué anomalía puede aparecer?",
    opciones: [
      "De actualización: el cliente queda con emails distintos",
      "De inserción: no se puede crear un pedido sin email",
      "De borrado: al borrar el cliente se borran sus pedidos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Si se actualiza una fila y no las otras, el dato queda inconsistente.",
  },
  {
    pregunta: "¿Cómo se modela una relación muchos a muchos entre alumnos y cursos?",
    opciones: [
      "Un array de ids de cursos en la tabla de alumnos",
      "Una tabla intermedia con una foreign key a cada lado",
      "Una foreign key a cursos en la tabla de alumnos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Y suele tener datos propios de la relación: fecha, nota, estado.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Guardar el precio en cada ítem del pedido es desnormalizar mal?",
    opciones: [
      "Sí: el precio tiene que leerse siempre del producto para estar actualizado",
      "Sí, salvo que se sincronice con un trigger cuando cambia el del producto",
      "No: es una foto histórica; el precio de compra no cambia con el del producto",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es un dato distinto: el precio al momento de la compra.",
  },
  {
    pregunta: "¿Por qué el UUID v4 puede empeorar los índices?",
    opciones: [
      "Porque es aleatorio e inserta en lugares dispersos del B-tree",
      "Porque ocupa 36 bytes como texto y el índice no lo comprime",
      "Porque no se puede indexar con B-tree, solo con hash",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El UUID v7, ordenado por tiempo, evita esa fragmentación.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "En pedidos(id, cliente_id, email_cliente), ¿qué forma normal se viola?",
    opciones: [
      "1FN: el email no es un valor atómico",
      "3FN: el email depende del cliente, no del pedido",
      "2FN: el email depende de parte de la clave",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es una dependencia transitiva; el email va a la tabla clientes.",
  },
  {
    pregunta: "¿Qué evita el constraint EXCLUDE sobre el rango de vigencia?",
    opciones: [
      "Que un período termine antes de empezar",
      "Que un producto quede sin ningún período vigente",
      "Que dos períodos del mismo producto se superpongan",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Así en cada fecha hay un solo precio vigente.",
  },
];

export default function ModeladoNormalizacionPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Modelado relacional & normalización"
      descripcion="Diseñar tablas donde cada dato vive en un solo lugar, entender qué se rompe cuando no, y saber cuándo duplicar a propósito."
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
            <strong className="text-foreground">Normalizar</strong> es separar
            entidades en tablas y relacionarlas con foreign keys, para que cada
            dato viva en un solo lugar.
          </p>
          <p>
            Una tabla tipo planilla sufre tres{" "}
            <strong className="text-foreground">anomalías</strong>: de
            actualización (copias que quedan distintas), de borrado (perder
            datos al borrar otros) y de inserción (no poder guardar algo sin
            inventar datos). Las relaciones muchos a muchos se modelan con una
            tabla intermedia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <NormalizacionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Listas separadas por comas en una columna.</strong>{" "}
            Imposibles de consultar, indexar o relacionar.
          </li>
          <li>
            <strong className="text-foreground">Relaciones sin foreign keys.</strong>{" "}
            La base no impide referencias a registros que no existen.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Modelar clientes, productos, pedidos e ítems de un e-commerce.</li>
          <li>Pasar a tablas un Excel que el negocio usaba como base de datos.</li>
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
            <strong className="text-foreground">Desnormalizar</strong> de forma
            deliberada: contadores, totales, vistas materializadas o fotos
            históricas (el precio de compra), con un mecanismo claro para
            mantenerlas.
          </p>
          <p>
            <strong className="text-foreground">Claves</strong>: sustitutas como
            primaria (el dato de negocio con UNIQUE). Autoincremental compacto
            pero predecible; UUID v7 generable en cualquier lado y amigable con
            los índices.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">El email como clave primaria.</strong>{" "}
            Cuando el usuario lo cambia, hay que actualizar cada referencia.
          </li>
          <li>
            <strong className="text-foreground">Desnormalizar &quot;por performance&quot; sin medir.</strong>{" "}
            Se paga en consistencia sin haber confirmado el problema.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un contador de comentarios mantenido por trigger.</li>
          <li>Ids internos bigint y un id público para las URLs.</li>
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
            <strong className="text-foreground">Formas normales</strong>: 1FN
            (valores atómicos), 2FN (nada depende de parte de la clave), 3FN
            (nada depende de columnas que no son clave). &quot;La clave, toda la
            clave y nada más que la clave&quot;.
          </p>
          <p>
            <strong className="text-foreground">Datos en el tiempo</strong>:
            fotos en la transacción, tablas con vigencia (con{" "}
            <code>EXCLUDE</code> para evitar superposiciones), auditoría o event
            sourcing, según las preguntas que haya que responder.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Sobrescribir el precio del producto sin historial.</strong>{" "}
            Los reportes de meses anteriores cambian solos.
          </li>
          <li>
            <strong className="text-foreground">Soft delete sin filtro centralizado.</strong>{" "}
            Registros &quot;borrados&quot; que reaparecen en consultas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una tabla de precios con vigencia para listas de precios por fecha.</li>
          <li>Auditoría de cambios en datos sensibles con triggers.</li>
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
          <p>Normalizá esta tabla de una clínica.</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`turnos (
  id, fecha, paciente_nombre, paciente_dni, paciente_telefonos,
  medico_nombre, medico_especialidad, obra_social, costo_consulta
)`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>pacientes (id, nombre, dni UNIQUE, obra_social_id)</code> y{" "}
              <code>telefonos_paciente (paciente_id, numero)</code> (los
              teléfonos múltiples violan 1FN).{" "}
              <code>medicos (id, nombre, especialidad_id)</code> y{" "}
              <code>especialidades (id, nombre)</code>.{" "}
              <code>obras_sociales (id, nombre)</code>.{" "}
              <code>turnos (id, fecha, paciente_id, medico_id, costo)</code>:
              el costo se guarda en el turno como foto, porque las tarifas
              cambian y el turno ya cobrado no. Si hace falta saber la tarifa
              vigente en cualquier fecha, una tabla de tarifas con vigencia por
              especialidad y obra social. Constraints: foreign keys, DNI único,
              y un único turno por médico y horario (UNIQUE o EXCLUDE sobre el
              rango de tiempo).
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
