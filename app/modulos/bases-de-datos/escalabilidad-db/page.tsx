import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ShardingSimulador } from "@/components/modulo/ShardingSimulador";
import { entrevistaEscalabilidadDb } from "@/lib/modules/bases-de-datos/escalabilidad-db-entrevista";

const preguntasPorNivel = {
  1: entrevistaEscalabilidadDb.filter((p) => p.nivel === 1),
  2: entrevistaEscalabilidadDb.filter((p) => p.nivel === 2),
  3: entrevistaEscalabilidadDb.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Réplicas y sharding — Dev Study Lab",
  description:
    "Cómo escalar una base: escalado vertical, réplicas de lectura y replication lag, read-your-writes, particionado, shard keys y failover.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "La base está al 100% de CPU. ¿Qué revisás primero?",
    opciones: [
      "Shardear",
      "Qué consultas consumen más (pg_stat_statements)",
      "Agregar tres réplicas",
    ],
    respuestaCorrecta: 1,
    explicacion: "Unas pocas consultas sin índice suelen explicar la mayor parte de la carga.",
  },
  {
    pregunta: "Un usuario guarda su perfil y al recargar ve los datos viejos. ¿Qué pasó probablemente?",
    opciones: [
      "La escritura falló",
      "La lectura fue a una réplica con replication lag",
      "El navegador cacheó el formulario",
    ],
    respuestaCorrecta: 1,
    explicacion: "La réplica todavía no había aplicado el cambio del primario.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ventaja da particionar por mes una tabla de eventos?",
    opciones: [
      "Más capacidad de escritura en otra máquina",
      "Borrar un mes viejo con un DROP instantáneo y consultas que leen solo las particiones necesarias",
      "Joins más rápidos entre servidores",
    ],
    respuestaCorrecta: 1,
    explicacion: "Particionar sigue siendo un solo servidor; no agrega capacidad.",
  },
  {
    pregunta: "¿Qué garantiza la replicación sincrónica?",
    opciones: [
      "Escrituras más rápidas",
      "Que una transacción confirmada ya está en la réplica",
      "Que no hace falta backup",
    ],
    respuestaCorrecta: 1,
    explicacion: "A cambio, cada COMMIT espera la confirmación de la réplica.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué una fecha es mala shard key para repartir escrituras?",
    opciones: [
      "Porque no es numérica",
      "Porque todas las escrituras nuevas caen en el shard del período actual",
      "Porque no se puede hashear",
    ],
    respuestaCorrecta: 1,
    explicacion: "Una clave monótona concentra la carga en un solo shard.",
  },
  {
    pregunta: "¿Qué protege contra un DELETE sin WHERE ejecutado por error?",
    opciones: ["Una réplica sincrónica", "Backups con point-in-time recovery", "Sharding"],
    respuestaCorrecta: 1,
    explicacion: "La réplica copia el error en milisegundos.",
  },
];

export default function EscalabilidadDbPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Réplicas y sharding"
      descripcion="Qué hacer cuando una base ya no alcanza: el orden de las opciones y lo que cada una complica."
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
            El orden: optimizar consultas, pooler, caché, escalar verticalmente,{" "}
            <strong className="text-foreground">réplicas de lectura</strong>,
            particionar y, al final,{" "}
            <strong className="text-foreground">shardear</strong>.
          </p>
          <p>
            Las réplicas reparten lecturas, pero van atrasadas respecto del
            primario (replication lag). El sharding reparte datos y escrituras
            entre servidores según una shard key.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ShardingSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Shardear antes de optimizar.</strong>{" "}
            Una máquina grande con buenos índices aguanta mucho más de lo que parece.
          </li>
          <li>
            <strong className="text-foreground">Leer de una réplica justo después de escribir.</strong>{" "}
            El usuario ve sus datos viejos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Mandar los reportes pesados a una réplica.</li>
          <li>Escalar verticalmente antes de una campaña de ventas.</li>
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
            <strong className="text-foreground">Read-your-writes</strong>: leer
            del primario lo que el usuario acaba de escribir, rutear por tipo de
            dato, o esperar a que la réplica alcance el LSN de la escritura.
          </p>
          <p>
            <strong className="text-foreground">Particionar</strong> divide una
            tabla dentro del mismo servidor; <strong className="text-foreground">shardear</strong>{" "}
            la reparte entre servidores. CAP y el escalado de la aplicación se ven
            en System Design.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Tomar decisiones con datos de una réplica.</strong>{" "}
            Validar stock o saldo contra un dato atrasado.
          </li>
          <li>
            <strong className="text-foreground">Particionar esperando más capacidad.</strong>{" "}
            Sigue siendo una sola máquina.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Leer del primario durante 5 segundos después de cada escritura del usuario.</li>
          <li>Particionar logs por mes y borrar los de hace más de un año.</li>
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
            <strong className="text-foreground">Shard key</strong>: buena
            distribución, escrituras repartidas y consultas frecuentes que se
            resuelvan en un solo shard. Resharding con muchos shards lógicos.
          </p>
          <p>
            <strong className="text-foreground">Failover</strong>: RPO y RTO,
            replicación sincrónica o asíncrona, consenso contra el split brain, y
            backups con point-in-time recovery aparte de las réplicas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Secuencias como ids en un sistema shardeado.</strong>{" "}
            Cada shard genera los mismos ids; hacen falta ids globales.
          </li>
          <li>
            <strong className="text-foreground">No probar nunca el failover ni la restauración.</strong>{" "}
            Se descubre que no funcionan el día que hacen falta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un SaaS multi-tenant shardeado por tenant con Citus.</li>
          <li>Replicación sincrónica a una réplica en la misma región para RPO cero.</li>
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
            Un SaaS de facturación tiene 3.000 empresas en un Postgres de 2 TB.
            Las escrituras crecen un 15% por mes y el primario ya está en la
            máquina más grande disponible. Una empresa sola genera el 30% de las
            facturas. Proponé cómo escalar.
          </p>
          <RevelarSolucion>
            <p>
              Antes de shardear, confirmar que no hay margen barato: consultas
              caras, índices que sobran (cada uno cuesta en escrituras) y
              reportes que podrían ir a réplicas. Si igual hay que repartir
              escrituras, la shard key natural es <code>empresa_id</code>: casi
              todo se consulta por empresa y los joins (facturas, ítems,
              clientes) quedan dentro de un shard. El problema es la empresa
              gigante: con hash de empresa, el shard que la tiene carga con el
              30% más su parte del resto. Se resuelve dándole un shard propio
              (mapeo explícito empresa → shard en una tabla de directorio, en
              vez de hash puro) y usando muchos shards lógicos sobre pocos
              servidores para poder mover empresas después. Los ids pasan a
              UUID v7, los reportes globales van a un almacén analítico
              alimentado por CDC en vez de consultas scatter-gather, y la
              migración se hace empresa por empresa, empezando por las chicas.
              Citus automatiza buena parte de este esquema en Postgres.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
