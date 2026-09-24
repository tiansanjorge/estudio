import type { PreguntaEntrevista } from "../types";

export const entrevistaPrismaOrm: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un ORM y qué ganás y perdés al usarlo?",
    respuestaEs:
      "Un ORM (object-relational mapper) traduce entre las tablas de la base y los objetos del lenguaje: en vez de escribir SQL y mapear filas a mano, llamás métodos como `prisma.usuario.findMany({ where: { activo: true } })`. Prisma en particular parte de un schema declarativo (`schema.prisma`) del que genera un cliente con tipos exactos para cada consulta, incluidas las relaciones que pediste, y además maneja las migraciones. Lo que ganás: productividad en el CRUD, que es la mayoría del código; tipos de punta a punta que atrapan en compilación una columna renombrada; consultas parametrizadas por default, sin inyección SQL; y un modelo compartido por el equipo. Lo que perdés: control sobre el SQL exacto que se ejecuta, así que es fácil generar consultas ineficientes sin darte cuenta (el N+1 es el caso clásico); consultas complejas (agregaciones, window functions, CTEs) que el ORM no expresa bien; y una capa más que aprender y depurar. La postura madura es usar el ORM para lo común, mirar el SQL que genera, y bajar a SQL crudo cuando hace falta, sin culpa.",
    respuestaEn:
      "An ORM (object-relational mapper) translates between database tables and language objects: instead of writing SQL and mapping rows by hand, you call methods like `prisma.user.findMany({ where: { active: true } })`. Prisma specifically starts from a declarative schema (`schema.prisma`) and generates a client with exact types for each query, including the relations you requested, and it also handles migrations. What you gain: productivity on CRUD, which is most of the code; end-to-end types that catch a renamed column at compile time; parameterized queries by default, no SQL injection; and a model shared by the team. What you lose: control over the exact SQL executed, so it's easy to generate inefficient queries without noticing (N+1 is the classic case); complex queries (aggregations, window functions, CTEs) the ORM doesn't express well; and one more layer to learn and debug. The mature stance is using the ORM for the common case, looking at the SQL it generates, and dropping to raw SQL when needed, guilt-free.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué es el problema N+1 y cómo lo detectás y resolvés?",
    respuestaEs:
      "Pasa cuando traés una lista con una query y después, por cada elemento, hacés otra query para su relación: 1 para los 50 pedidos más 50 para sus clientes. Cada query es rápida, así que en desarrollo con 5 filas nadie lo nota, pero en producción son cientos de viajes de red a la base por request, y la latencia se suma. Es fácil de introducir con un ORM porque la segunda query queda escondida adentro de un loop o de un resolver de GraphQL. Se detecta activando el log de queries (`new PrismaClient({ log: ['query'] })`) y viendo la misma consulta repetida con distinto id, o en el APM, donde un endpoint muestra decenas de spans de base iguales. Se resuelve pidiendo la relación en la consulta original: con `include` o `select` anidado Prisma hace 2 queries (la lista y todos los relacionados con `WHERE id IN (...)`), sin importar cuántas filas haya; con `relationLoadStrategy: 'join'` lo resuelve en una sola query con JOIN. En GraphQL, donde cada resolver pide lo suyo por separado, la herramienta es DataLoader, que agrupa las cargas de un mismo tick.",
    respuestaEn:
      "It happens when you fetch a list with one query and then, for each element, run another query for its relation: 1 for the 50 orders plus 50 for their customers. Each query is fast, so in development with 5 rows nobody notices, but in production it's hundreds of network round trips to the database per request, and latency adds up. It's easy to introduce with an ORM because the second query hides inside a loop or a GraphQL resolver. You detect it by enabling query logging (`new PrismaClient({ log: ['query'] })`) and seeing the same query repeated with different ids, or in the APM, where an endpoint shows dozens of identical database spans. You fix it by requesting the relation in the original query: with `include` or nested `select`, Prisma runs 2 queries (the list and all related rows with `WHERE id IN (...)`), regardless of row count; with `relationLoadStrategy: 'join'` it does a single query with a JOIN. In GraphQL, where each resolver fetches on its own, the tool is DataLoader, which batches loads within the same tick.",
    codigo: `// N+1: 1 query + 1 por pedido
const pedidos = await prisma.pedido.findMany();
for (const p of pedidos) {
  await prisma.cliente.findUnique({ where: { id: p.clienteId } });
}

// 2 queries, sin importar cuántos pedidos haya
const conCliente = await prisma.pedido.findMany({
  include: { cliente: true },
});`,
  },
  {
    nivel: 2,
    pregunta: "Prisma, Drizzle, TypeORM, un query builder o SQL crudo: ¿cómo elegís?",
    respuestaEs:
      "Depende de cuánto querés que la herramienta se parezca a SQL. PRISMA abstrae más: su propio schema, un cliente generado con muy buenos tipos, migraciones integradas y una API que no se parece a SQL. Es muy productivo para CRUD y equipos mixtos; el costo es menos control sobre el SQL y un paso de generación. DRIZZLE define el schema en TypeScript y su API es casi SQL tipado (`db.select().from(usuarios).where(eq(...))`): si sabés SQL sabés Drizzle, las consultas complejas se expresan mejor, es liviano y encaja bien en serverless y edge. TYPEORM y MikroORM siguen el patrón clásico de entidades con decoradores (Active Record o Data Mapper); son habituales en proyectos NestJS existentes, pero TypeORM tiene tipado más débil en las consultas y un historial de bugs y mantenimiento irregular. Un QUERY BUILDER como Kysely da SQL tipado sin modelo de entidades. SQL CRUDO (pg, postgres.js) da control total y cero abstracción, a costa de tipar y mapear a mano. Mi criterio: Prisma o Drizzle para un proyecto nuevo en TypeScript (Drizzle si el equipo piensa en SQL o hay muchas consultas complejas), y SQL crudo puntual en cualquiera de los dos para reportes y consultas críticas.",
    respuestaEn:
      "It depends on how close to SQL you want the tool to be. PRISMA abstracts the most: its own schema, a generated client with very good types, built-in migrations and an API that doesn't look like SQL. It's very productive for CRUD and mixed teams; the cost is less control over SQL and a generation step. DRIZZLE defines the schema in TypeScript and its API is nearly typed SQL (`db.select().from(users).where(eq(...))`): if you know SQL you know Drizzle, complex queries are expressed better, it's lightweight and fits serverless and edge well. TYPEORM and MikroORM follow the classic decorator-based entity pattern (Active Record or Data Mapper); they're common in existing NestJS projects, but TypeORM has weaker query typing and a history of bugs and irregular maintenance. A QUERY BUILDER like Kysely gives typed SQL without an entity model. RAW SQL (pg, postgres.js) gives full control and zero abstraction, at the cost of typing and mapping by hand. My criterion: Prisma or Drizzle for a new TypeScript project (Drizzle if the team thinks in SQL or there are many complex queries), and targeted raw SQL in either one for reports and critical queries.",
    tradeoffs:
      "Más abstracción da productividad y consistencia en lo común; menos abstracción da control y previsibilidad en lo complejo. Ninguna opción elimina la necesidad de saber SQL.",
  },
  {
    nivel: 2,
    pregunta: "¿Cuándo bajás a SQL crudo en Prisma y cómo lo hacés de forma segura?",
    respuestaEs:
      "Cuando la consulta no se expresa bien con la API: reportes con agregaciones y GROUP BY complejos, window functions, CTEs recursivos, operadores específicos de Postgres (búsqueda de texto, JSONB avanzado), o cuando el SQL que genera Prisma es ineficiente y hay una forma mejor. Prisma ofrece `$queryRaw` y `$executeRaw` como tagged templates: los valores interpolados con `${}` se envían como parámetros, no se concatenan al texto, así que no hay inyección SQL. El peligro está en `$queryRawUnsafe` y `$executeRawUnsafe`, que aceptan un string armado a mano: si ahí entra input del usuario, es inyección. Si necesitás partes dinámicas que no son valores (un nombre de columna para ordenar), se validan contra una lista blanca, nunca se interpolan directo. El resultado de `$queryRaw` no está tipado por defecto; se puede declarar el tipo con un genérico, o usar TypedSQL (archivos `.sql` de los que Prisma genera funciones tipadas), que da tipos reales a partir de la consulta.",
    respuestaEn:
      "When the query isn't expressed well through the API: reports with complex aggregations and GROUP BY, window functions, recursive CTEs, Postgres-specific operators (text search, advanced JSONB), or when the SQL Prisma generates is inefficient and there's a better way. Prisma offers `$queryRaw` and `$executeRaw` as tagged templates: values interpolated with `${}` are sent as parameters, not concatenated into the text, so there's no SQL injection. The danger is `$queryRawUnsafe` and `$executeRawUnsafe`, which take a hand-built string: if user input gets in there, it's injection. If you need dynamic parts that aren't values (a column name to sort by), validate them against an allowlist, never interpolate directly. The result of `$queryRaw` isn't typed by default; you can declare the type with a generic, or use TypedSQL (`.sql` files from which Prisma generates typed functions), which gives real types derived from the query.",
    codigo: `// seguro: \${} se envía como parámetro ($1)
const top = await prisma.$queryRaw<{ clienteId: number; total: number }[]>\`
  SELECT cliente_id AS "clienteId", sum(total)::float AS total
  FROM pedidos WHERE creado_el >= \${desde}
  GROUP BY cliente_id ORDER BY total DESC LIMIT 10\`;

// inyección: el string se arma con input del usuario
await prisma.$queryRawUnsafe(\`SELECT * FROM usuarios WHERE email = '\${email}'\`);`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué problemas de conexiones tiene Prisma en serverless y en desarrollo con Next.js?",
    respuestaEs:
      "Cada instancia de PrismaClient abre su propio pool de conexiones a la base, y Postgres tiene un límite bajo de conexiones simultáneas (del orden de 100 por default), porque cada una es un proceso con su memoria. En DESARROLLO con Next.js, el hot reload re-evalúa los módulos y, si el cliente se crea en el top level de un archivo, cada recarga crea un PrismaClient nuevo con su pool, hasta agotar las conexiones; la solución es guardarlo en `globalThis` fuera de producción para reutilizar la misma instancia. En SERVERLESS el problema es de escala: cada instancia de la función tiene su propio cliente, y cien invocaciones concurrentes son cien pools. La solución es un connection pooler entre la app y la base, como PgBouncer, el endpoint pooled de Neon o Supabase, o Prisma Accelerate, y achicar el pool de cada instancia (con `connection_limit` en la URL o, con driver adapters, en la configuración del pool del adapter). El pooler en modo transacción tiene letra chica: no mantiene estado de sesión entre transacciones, así que los prepared statements, `SET` de sesión o advisory locks por sesión no funcionan como esperás, y las migraciones deben correr contra la URL directa, no la del pooler.",
    respuestaEn:
      "Each PrismaClient instance opens its own connection pool to the database, and Postgres has a low limit on concurrent connections (around 100 by default), because each is a process with its own memory. In DEVELOPMENT with Next.js, hot reload re-evaluates modules and, if the client is created at a file's top level, each reload creates a new PrismaClient with its pool, until connections are exhausted; the fix is storing it on `globalThis` outside production to reuse the same instance. In SERVERLESS the problem is scale: each function instance has its own client, and a hundred concurrent invocations are a hundred pools. The fix is a connection pooler between the app and the database, like PgBouncer, Neon's or Supabase's pooled endpoint, or Prisma Accelerate, and shrinking each instance's pool (with `connection_limit` in the URL or, with driver adapters, in the adapter's pool config). A transaction-mode pooler has fine print: it doesn't keep session state between transactions, so prepared statements, session `SET`s or session-level advisory locks don't behave as expected, and migrations must run against the direct URL, not the pooler's.",
    codigo: `// lib/prisma.ts: una sola instancia aunque el módulo se re-evalúe
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalParaPrisma.prisma = prisma;`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué trampas de performance de Prisma aparecen recién en producción?",
    respuestaEs:
      "Varias que no se ven con pocos datos. OVERFETCHING: `findMany` sin `select` trae todas las columnas, incluidos textos largos o JSON pesados que la pantalla no usa; con `select` se piden solo los campos necesarios, y eso además habilita índices cubrientes. INCLUDES ANIDADOS sin límite: `include: { comentarios: { include: { autor: true } } }` en una lista puede traer miles de filas; hay que paginar también las relaciones (`take` dentro del include) o traer conteos con `_count` en vez de las filas. ESCRITURAS EN LOOP: crear 1.000 registros con `create` en un `for` son 1.000 viajes; `createMany` hace una sola inserción (y `createManyAndReturn` si necesitás los registros). TRANSACCIONES INTERACTIVAS: `$transaction(async (tx) => ...)` retiene una conexión del pool mientras dura y tiene un timeout por defecto de unos segundos; si adentro hay una llamada HTTP lenta, la transacción expira o agota el pool bajo carga. Y en general, no confiar a ciegas: activar el log de queries o el tracing de OpenTelemetry y revisar con EXPLAIN el SQL que realmente se genera para los endpoints calientes.",
    respuestaEn:
      "Several that don't show with little data. OVERFETCHING: `findMany` without `select` fetches every column, including long texts or heavy JSON the screen doesn't use; with `select` you request only the needed fields, which also enables covering indexes. UNBOUNDED NESTED INCLUDES: `include: { comments: { include: { author: true } } }` on a list can pull thousands of rows; you must paginate relations too (`take` inside the include) or fetch counts with `_count` instead of the rows. WRITES IN A LOOP: creating 1,000 records with `create` in a `for` is 1,000 round trips; `createMany` does a single insert (and `createManyAndReturn` if you need the records). INTERACTIVE TRANSACTIONS: `$transaction(async (tx) => ...)` holds a pool connection while it runs and has a default timeout of a few seconds; with a slow HTTP call inside, the transaction expires or exhausts the pool under load. And in general, don't trust blindly: enable query logging or OpenTelemetry tracing and check with EXPLAIN the SQL actually generated for hot endpoints.",
  },
];
