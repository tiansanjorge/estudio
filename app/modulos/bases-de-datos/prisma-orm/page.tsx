import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PrismaNmas1Simulador } from "@/components/modulo/PrismaNmas1Simulador";
import { entrevistaPrismaOrm } from "@/lib/modules/bases-de-datos/prisma-orm-entrevista";

const preguntasPorNivel = {
  1: entrevistaPrismaOrm.filter((p) => p.nivel === 1),
  2: entrevistaPrismaOrm.filter((p) => p.nivel === 2),
  3: entrevistaPrismaOrm.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Prisma / ORM — trade-offs — Dev Study Lab",
  description:
    "Qué resuelve un ORM, el problema N+1, Prisma vs Drizzle vs SQL crudo, $queryRaw seguro, conexiones en serverless y trampas de performance.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Traés 50 pedidos y, en un loop, buscás el cliente de cada uno. ¿Cuántas queries son?",
    opciones: ["1", "2", "51"],
    respuestaCorrecta: 2,
    explicacion: "1 para la lista y 1 por pedido: el problema N+1.",
  },
  {
    pregunta: "¿Cuántas queries hace Prisma con include por defecto?",
    opciones: ["Una por fila", "2: la lista y los relacionados con WHERE id IN (...)", "Siempre 1 con JOIN"],
    respuestaCorrecta: 1,
    explicacion: 'Para una sola query con JOIN existe relationLoadStrategy: "join".',
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estas formas es vulnerable a inyección SQL?",
    opciones: [
      "prisma.$queryRaw`... WHERE email = ${email}`",
      "prisma.$queryRawUnsafe(`... WHERE email = '${email}'`)",
      "prisma.usuario.findUnique({ where: { email } })",
    ],
    respuestaCorrecta: 1,
    explicacion: "El tagged template parametriza los valores; la versión Unsafe concatena el string.",
  },
  {
    pregunta: "El equipo piensa en SQL y la app tiene muchos reportes complejos. ¿Qué encaja mejor?",
    opciones: ["Drizzle o un query builder como Kysely", "Solo Prisma, sin SQL crudo", "Guardar todo en JSON"],
    respuestaCorrecta: 0,
    explicacion: "Su API es SQL tipado, así que las consultas complejas se expresan mejor.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué el hot reload de Next.js puede agotar las conexiones a la base?",
    opciones: [
      "Porque desactiva el pool",
      "Porque cada recarga crea un PrismaClient nuevo con su propio pool",
      "Porque abre una conexión por componente",
    ],
    respuestaCorrecta: 1,
    explicacion: "Se evita guardando la instancia en globalThis fuera de producción.",
  },
  {
    pregunta: "¿Contra qué URL conviene correr las migraciones si la app usa un pooler en modo transacción?",
    opciones: ["La del pooler", "La conexión directa a la base", "Da igual"],
    respuestaCorrecta: 1,
    explicacion: "El pooler no mantiene estado de sesión, que las migraciones pueden necesitar.",
  },
];

export default function PrismaOrmPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Prisma / ORM — trade-offs"
      descripcion="Qué te da un ORM, qué SQL genera por debajo, y cuándo conviene salir de él."
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
            Un <strong className="text-foreground">ORM</strong> traduce entre
            tablas y objetos. Prisma parte de un <code>schema.prisma</code> y
            genera un cliente tipado, con consultas parametrizadas y migraciones.
          </p>
          <p>
            El costo es que el SQL queda escondido. El caso clásico es el{" "}
            <strong className="text-foreground">N+1</strong>: una query por la
            lista y otra por cada fila, en vez de pedir la relación de una vez.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PrismaNmas1Simulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Queries adentro de un loop.</strong>{" "}
            Con 5 filas en desarrollo no se nota; con 500 en producción, sí.
          </li>
          <li>
            <strong className="text-foreground">No mirar nunca el SQL generado.</strong>{" "}
            <code>log: [&apos;query&apos;]</code> en el cliente muestra cada consulta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>CRUD tipado de punta a punta en una API con TypeScript.</li>
          <li>Listar pedidos con su cliente usando <code>include</code>.</li>
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
            Un espectro de abstracción:{" "}
            <strong className="text-foreground">Prisma</strong> (schema propio,
            API no-SQL), <strong className="text-foreground">Drizzle</strong> y
            Kysely (SQL tipado), y <strong className="text-foreground">SQL crudo</strong>{" "}
            (control total, tipos a mano).
          </p>
          <p>
            Dentro de Prisma, <code>$queryRaw</code> con tagged template para lo
            que la API no expresa bien, siempre parametrizado.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground"><code>$queryRawUnsafe</code> con input del usuario.</strong>{" "}
            Es inyección SQL; los nombres de columna dinámicos van contra una lista blanca.
          </li>
          <li>
            <strong className="text-foreground">Forzar todo por la API del ORM.</strong>{" "}
            Un reporte con window functions es más claro y rápido en SQL.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un ranking de clientes con <code>$queryRaw</code> y GROUP BY.</li>
          <li>Elegir Drizzle en un proyecto serverless con muchas consultas complejas.</li>
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
            <strong className="text-foreground">Conexiones</strong>: cada
            PrismaClient tiene su pool y Postgres admite pocas conexiones. En
            serverless se usa un pooler; en desarrollo, una sola instancia en{" "}
            <code>globalThis</code>.
          </p>
          <p>
            <strong className="text-foreground">Performance</strong>:{" "}
            <code>select</code> contra el overfetching, <code>_count</code> en vez
            de traer relaciones enteras, <code>createMany</code> en vez de loops,
            y transacciones interactivas cortas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Migrar contra la URL del pooler.</strong>{" "}
            El modo transacción no mantiene estado de sesión.
          </li>
          <li>
            <strong className="text-foreground">Include anidado sin <code>take</code>.</strong>{" "}
            Una lista de posts con todos sus comentarios puede traer miles de filas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Una app Next.js en Vercel contra el endpoint pooled de Neon.</li>
          <li>Importar un CSV de 10.000 filas con <code>createMany</code> por lotes.</li>
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
            El endpoint del feed tarda 1,2 s. Muestra 20 posts con el nombre del
            autor y la cantidad de comentarios. ¿Qué problemas tiene y cómo lo
            reescribís?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const posts = await prisma.post.findMany({
  take: 20,
  include: { comentarios: true },
});

return Promise.all(posts.map(async (p) => ({
  titulo: p.titulo,
  autor: (await prisma.usuario.findUnique({ where: { id: p.autorId } }))?.nombre,
  comentarios: p.comentarios.length,
})));`}
          </pre>
          <RevelarSolucion>
            <p>
              Tres problemas: un N+1 para los autores (20 queries extra), traer
              todos los comentarios completos solo para contarlos, y traer todas
              las columnas del post y del autor. Todo entra en una consulta:{" "}
              <code>
                prisma.post.findMany(&#123; take: 20, select: &#123; titulo: true,
                autor: &#123; select: &#123; nombre: true &#125; &#125;, _count:
                &#123; select: &#123; comentarios: true &#125; &#125; &#125; &#125;)
              </code>
              . El conteo se resuelve en la base, sin transferir los comentarios,
              y el autor viene con la relación. Después, verificar con el log de
              queries que sean pocas y fijas, no una por post (con{" "}
              <code>relationLoadStrategy: &quot;join&quot;</code>, una sola), y que exista un índice sobre <code>comentarios.post_id</code>.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
