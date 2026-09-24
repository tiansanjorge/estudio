import type { PreguntaEntrevista } from "../types";

export const entrevistaPostgresEspecifico: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "Si ya valido los datos en la aplicación, ¿para qué poner constraints en la base?",
    respuestaEs:
      "Porque la validación de la aplicación no alcanza para garantizar la integridad. Primero, la base tiene más de un cliente: otro servicio, un script de migración, un job, alguien corriendo un UPDATE a mano; los constraints se cumplen para todos. Segundo, la concurrencia: 'verificar que el email no exista y después insertar' tiene una condición de carrera, dos requests simultáneas pasan la verificación y las dos insertan; un UNIQUE lo impide de forma atómica, y la aplicación captura el error (código 23505) y responde 409. Tercero, los bugs: la validación de la app cambia con cada deploy, y un constraint es una red de seguridad que no se regresiona. Los básicos: NOT NULL por default en todas las columnas que no tienen un motivo para ser nulas, UNIQUE para claves naturales, FOREIGN KEY para las relaciones, y CHECK para reglas simples de una fila (precio positivo, fecha fin posterior a inicio). La validación en la app sigue siendo necesaria para dar buenos mensajes de error; el constraint es la garantía.",
    respuestaEn:
      "Because application validation isn't enough to guarantee integrity. First, the database has more than one client: another service, a migration script, a job, someone running an UPDATE by hand; constraints hold for all of them. Second, concurrency: 'check the email doesn't exist then insert' has a race condition, two simultaneous requests pass the check and both insert; a UNIQUE prevents it atomically, and the application catches the error (code 23505) and returns 409. Third, bugs: app validation changes with every deploy, and a constraint is a safety net that doesn't regress. The basics: NOT NULL by default on every column without a reason to be nullable, UNIQUE for natural keys, FOREIGN KEY for relations, and CHECK for simple single-row rules (positive price, end date after start). App validation is still needed for good error messages; the constraint is the guarantee.",
  },
  {
    nivel: 1,
    pregunta: "¿Cuándo usás una columna JSONB y cuándo columnas normales?",
    respuestaEs:
      "JSONB guarda un documento JSON en formato binario, indexable y consultable, dentro de una fila. Encaja cuando la estructura varía de verdad entre filas o no la controlás: atributos que dependen de la categoría del producto (una remera tiene talle, un monitor tiene pulgadas), el payload de un webhook de un tercero, preferencias de usuario, metadatos. Ahí evita tener decenas de columnas casi siempre nulas o una tabla clave-valor incómoda. Para todo lo que tiene estructura conocida y estable, columnas normales: tienen tipos, NOT NULL, foreign keys y CHECKs; las estadísticas del planner son mejores; y las consultas son más simples. El antipatrón es usar JSONB para no pensar el modelo: meter el cliente o los ítems del pedido en un JSON pierde las foreign keys, complica las actualizaciones parciales y los reportes. Un criterio práctico: si filtrás, unís o agregás por un campo seguido, probablemente merece ser columna. Y conviene JSONB antes que JSON, que guarda el texto tal cual y lo re-parsea en cada consulta.",
    respuestaEn:
      "JSONB stores a JSON document in a binary, indexable and queryable format, inside a row. It fits when the structure truly varies between rows or you don't control it: attributes depending on the product category (a t-shirt has a size, a monitor has inches), a third party's webhook payload, user preferences, metadata. There it avoids dozens of mostly-null columns or an awkward key-value table. For everything with a known, stable structure, regular columns: they have types, NOT NULL, foreign keys and CHECKs; planner statistics are better; and queries are simpler. The anti-pattern is using JSONB to avoid thinking about the model: putting the customer or the order items in a JSON loses foreign keys and complicates partial updates and reports. A practical criterion: if you often filter, join or aggregate by a field, it probably deserves to be a column. And prefer JSONB over JSON, which stores the text as-is and re-parses it on each query.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué tipos de Postgres elegís para fechas, dinero, texto e ids?",
    respuestaEs:
      "FECHAS: `timestamptz`, casi siempre. Guarda un instante absoluto (internamente en UTC) y lo convierte a la zona de la sesión al leer; `timestamp` sin zona guarda una hora de reloj sin contexto, y mezclar zonas termina en bugs de horas corridas. DINERO: `numeric(12,2)` o enteros en centavos, nunca `float` ni `real`, que no representan exactamente 0,1 y acumulan errores de redondeo; el tipo `money` depende de la configuración regional y conviene evitarlo. TEXTO: `text`; en Postgres `varchar(n)` no es más eficiente, solo agrega un límite, y si el límite es una regla de negocio se expresa mejor con un CHECK que se puede cambiar sin reescribir. IDS: `bigint GENERATED ALWAYS AS IDENTITY` (estándar SQL, reemplaza a `serial`) para ids internos, o UUID cuando se generan fuera de la base o no deben ser adivinables; en ese caso UUID v7, que es ordenado por tiempo e inserta al final del índice, en vez de v4, que es aleatorio y fragmenta el B-tree. ENUMS: un tipo `enum` es compacto pero agregar valores es fácil y quitarlos no; una tabla de referencia con foreign key o un CHECK con la lista son más flexibles.",
    respuestaEn:
      "DATES: `timestamptz`, almost always. It stores an absolute instant (internally in UTC) and converts it to the session's zone on read; `timestamp` without zone stores a wall-clock time without context, and mixing zones ends in shifted-hour bugs. MONEY: `numeric(12,2)` or integer cents, never `float` or `real`, which can't represent 0.1 exactly and accumulate rounding errors; the `money` type depends on locale settings and is best avoided. TEXT: `text`; in Postgres `varchar(n)` isn't more efficient, it only adds a limit, and if the limit is a business rule it's better expressed with a CHECK that can change without a rewrite. IDS: `bigint GENERATED ALWAYS AS IDENTITY` (SQL standard, replaces `serial`) for internal ids, or UUIDs when generated outside the database or they must not be guessable; in that case UUID v7, which is time-ordered and inserts at the end of the index, rather than v4, which is random and fragments the B-tree. ENUMS: an `enum` type is compact but adding values is easy and removing them isn't; a reference table with a foreign key or a CHECK with the list are more flexible.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo consultás e indexás una columna JSONB?",
    respuestaEs:
      "Los operadores básicos: `->` devuelve un valor JSON (`atributos -> 'medidas'`), `->>` lo devuelve como texto (`atributos ->> 'color'`), `@>` pregunta si el documento contiene otro (`atributos @> '{\"color\": \"rojo\"}'`), y `?` si existe una clave. Para indexar hay dos caminos según la consulta. Un índice GIN sobre la columna entera acelera `@>` y `?` para cualquier clave: con el operator class por default (`jsonb_ops`) soporta todos esos operadores; con `jsonb_path_ops` solo soporta `@>` y similares, pero es más chico y rápido. Si siempre se filtra u ordena por la misma clave, es mejor un índice B-tree de expresión sobre ella: `CREATE INDEX ON productos ((atributos ->> 'color'))`, que sirve para igualdad, rangos y ORDER BY, cosa que GIN no hace. Una trampa: la consulta tiene que coincidir con lo indexado. Un índice GIN no ayuda a `atributos ->> 'color' = 'rojo'` (hay que escribirla con `@>`), y el índice de expresión solo sirve si la consulta usa exactamente la misma expresión. Y si un campo de JSONB se consulta tanto que necesita su propio índice, es buena señal de que tal vez debería ser una columna, o una columna generada a partir del JSON.",
    respuestaEn:
      "The basic operators: `->` returns a JSON value (`attributes -> 'dimensions'`), `->>` returns it as text (`attributes ->> 'color'`), `@>` asks whether the document contains another (`attributes @> '{\"color\": \"red\"}'`), and `?` whether a key exists. For indexing there are two paths depending on the query. A GIN index on the whole column speeds up `@>` and `?` for any key: with the default operator class (`jsonb_ops`) it supports all those operators; with `jsonb_path_ops` it only supports `@>` and similar, but it's smaller and faster. If you always filter or sort by the same key, a B-tree expression index on it is better: `CREATE INDEX ON products ((attributes ->> 'color'))`, which serves equality, ranges and ORDER BY, which GIN doesn't. A trap: the query must match what's indexed. A GIN index doesn't help `attributes ->> 'color' = 'red'` (write it with `@>`), and the expression index only works if the query uses exactly the same expression. And if a JSONB field is queried so much it needs its own index, that's a good sign it should maybe be a column, or a generated column derived from the JSON.",
    codigo: `-- GIN: cualquier clave, con @> y ?
CREATE INDEX ON productos USING gin (atributos jsonb_path_ops);
SELECT * FROM productos WHERE atributos @> '{"color": "rojo"}';

-- B-tree de expresión: una clave puntual, también para rangos y orden
CREATE INDEX ON productos ((atributos ->> 'marca'));
SELECT * FROM productos WHERE atributos ->> 'marca' = 'Logitech';

-- columna generada: el campo caliente pasa a ser una columna real
ALTER TABLE productos
  ADD COLUMN pulgadas numeric GENERATED ALWAYS AS ((atributos ->> 'pulgadas')::numeric) STORED;`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué constraints avanzados de Postgres conocés y cuándo los usás?",
    respuestaEs:
      "UNIQUE PARCIAL, con un índice único con WHERE: email único solo entre usuarios no borrados (`WHERE borrado_el IS NULL`), algo imposible con un UNIQUE común cuando hay soft delete. Si además el email tiene que ser único sin distinguir mayúsculas, el índice va sobre `lower(email)`. EXCLUDE: generaliza UNIQUE a cualquier operador; con un índice GiST y el operador de superposición `&&` garantiza que dos reservas de la misma sala no se pisen en el tiempo, sin condiciones de carrera y sin importar el nivel de aislamiento. CHECK entre columnas de la misma fila: `CHECK (precio_oferta < precio)` o `CHECK (fin > inicio)`. DEFERRABLE: por default los constraints se chequean en cada sentencia; `DEFERRABLE INITIALLY DEFERRED` los posterga al COMMIT, útil para intercambiar dos valores únicos (swap de posiciones) o insertar filas con foreign keys circulares dentro de una transacción. ON DELETE en las foreign keys: CASCADE para hijos que no existen sin el padre (los ítems de un pedido), RESTRICT por default para lo demás, SET NULL cuando la relación es opcional. Los CHECK no pueden consultar otras tablas; esas reglas van con foreign keys, triggers o en la aplicación con bloqueos.",
    respuestaEn:
      "PARTIAL UNIQUE, with a unique index with WHERE: email unique only among non-deleted users (`WHERE deleted_at IS NULL`), impossible with a plain UNIQUE when there's soft delete. If the email must also be case-insensitively unique, the index goes on `lower(email)`. EXCLUDE: generalizes UNIQUE to any operator; with a GiST index and the overlap operator `&&` it guarantees two bookings for the same room don't overlap in time, with no race conditions and regardless of isolation level. CHECK across columns of the same row: `CHECK (sale_price < price)` or `CHECK (end > start)`. DEFERRABLE: by default constraints are checked on each statement; `DEFERRABLE INITIALLY DEFERRED` postpones them to COMMIT, useful for swapping two unique values (position swaps) or inserting rows with circular foreign keys within a transaction. ON DELETE on foreign keys: CASCADE for children that don't exist without the parent (an order's items), RESTRICT by default for the rest, SET NULL when the relation is optional. CHECKs can't query other tables; those rules go with foreign keys, triggers, or in the application with locks.",
    codigo: `-- email único entre usuarios activos, sin distinguir mayúsculas
CREATE UNIQUE INDEX usuarios_email_activo
  ON usuarios (lower(email)) WHERE borrado_el IS NULL;

-- reservas sin superposición (requiere btree_gist)
ALTER TABLE reservas ADD CONSTRAINT sin_superposicion
  EXCLUDE USING gist (sala_id WITH =, tstzrange(desde, hasta) WITH &&);

-- posiciones únicas que se pueden intercambiar en una transacción
ALTER TABLE items ADD CONSTRAINT posicion_unica
  UNIQUE (lista_id, posicion) DEFERRABLE INITIALLY DEFERRED;`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué features de Postgres te ahorran agregar otro servicio, y cuándo no alcanzan?",
    respuestaEs:
      "Varias, y conviene conocerlas antes de sumar infraestructura. COLAS: una tabla de jobs consumida con `SELECT ... FOR UPDATE SKIP LOCKED`, donde varios workers toman trabajos distintos sin pisarse; con la ventaja de que encolar es transaccional junto con el dato de negocio (el patrón outbox sale gratis). BÚSQUEDA DE TEXTO: `tsvector` y `tsquery` con índice GIN, stemming por idioma y ranking; y `pg_trgm` para búsqueda parcial y tolerante a errores de tipeo. NOTIFICACIONES: `LISTEN/NOTIFY` para avisar a otros procesos que algo cambió. LOCKS DISTRIBUIDOS: advisory locks para que un cron corra una sola vez entre varias réplicas. MULTI-TENANT: Row Level Security, políticas que filtran por tenant dentro de la base aunque la consulta se olvide del WHERE. Y documentos con JSONB. Cuándo no alcanzan: colas con miles de mensajes por segundo, fan-out a muchos consumidores o retención y replay de eventos (ahí Kafka, SQS o Redis con BullMQ); búsqueda con relevancia sofisticada, facetas y sinónimos a gran escala (Elasticsearch, Meilisearch); NOTIFY no persiste mensajes si nadie escucha; y todo lo que corre en Postgres compite por los mismos recursos que las consultas transaccionales. El criterio: empezar con Postgres y migrar a un servicio dedicado cuando haya una métrica que lo justifique.",
    respuestaEn:
      "Several, and they're worth knowing before adding infrastructure. QUEUES: a jobs table consumed with `SELECT ... FOR UPDATE SKIP LOCKED`, where several workers take different jobs without colliding; with the advantage that enqueuing is transactional together with the business data (the outbox pattern comes for free). TEXT SEARCH: `tsvector` and `tsquery` with a GIN index, per-language stemming and ranking; and `pg_trgm` for partial, typo-tolerant search. NOTIFICATIONS: `LISTEN/NOTIFY` to tell other processes something changed. DISTRIBUTED LOCKS: advisory locks so a cron runs only once across replicas. MULTI-TENANT: Row Level Security, policies filtering by tenant inside the database even if a query forgets the WHERE. And documents with JSONB. When they fall short: queues with thousands of messages per second, fan-out to many consumers or event retention and replay (then Kafka, SQS or Redis with BullMQ); search with sophisticated relevance, facets and synonyms at scale (Elasticsearch, Meilisearch); NOTIFY doesn't persist messages if nobody is listening; and everything running in Postgres competes for the same resources as transactional queries. The criterion: start with Postgres and move to a dedicated service when a metric justifies it.",
    tradeoffs:
      "Una pieza menos de infraestructura y consistencia transaccional gratis, a cambio de techo de escala y de compartir recursos con la carga principal.",
    codigo: `-- worker: toma un job sin chocar con los demás
UPDATE jobs SET estado = 'procesando', tomado_el = now()
WHERE id = (
  SELECT id FROM jobs
  WHERE estado = 'pendiente'
  ORDER BY creado_el
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING *;`,
  },
];
