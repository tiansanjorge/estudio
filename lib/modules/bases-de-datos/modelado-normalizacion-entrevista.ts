import type { PreguntaEntrevista } from "../types";

export const entrevistaModeladoNormalizacion: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es la normalización y qué problemas evita?",
    respuestaEs:
      "Es organizar las tablas para que cada dato viva en UN solo lugar, separando las entidades (clientes, productos, pedidos) y relacionándolas con claves foráneas en vez de repetir sus datos. Evita las anomalías clásicas de una tabla 'tipo planilla'. De actualización: si el email de Ana está repetido en cada uno de sus pedidos, cambiarlo exige actualizar todas las filas, y si una se olvida, Ana queda con dos emails distintos. De borrado: si el único lugar donde existe un producto es un pedido, al borrar el pedido se pierde el producto y su precio. De inserción: no se puede registrar un producto que todavía no tiene pedidos sin inventar una fila falsa. Con el modelo normalizado, el email vive en `clientes`, el producto en `productos`, y el pedido solo guarda referencias. La base además puede hacer cumplir las relaciones con foreign keys, así un pedido no puede apuntar a un cliente que no existe.",
    respuestaEn:
      "It's organizing tables so each piece of data lives in ONE place, separating entities (customers, products, orders) and relating them with foreign keys instead of repeating their data. It avoids the classic anomalies of a 'spreadsheet-like' table. Update: if Ana's email is repeated in each of her orders, changing it requires updating every row, and if one is missed, Ana ends up with two different emails. Delete: if the only place a product exists is an order, deleting the order loses the product and its price. Insert: you can't record a product with no orders yet without inventing a fake row. With the normalized model, the email lives in `customers`, the product in `products`, and the order only stores references. The database can also enforce relationships with foreign keys, so an order can't point to a nonexistent customer.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo modelás una relación muchos a muchos?",
    respuestaEs:
      "Con una tabla intermedia (de unión o asociativa) que tiene una foreign key hacia cada lado. Por ejemplo, alumnos y cursos: un alumno se inscribe en muchos cursos y un curso tiene muchos alumnos, así que se crea `inscripciones (alumno_id, curso_id)` con una clave primaria o un constraint único sobre el par, para que no haya inscripciones duplicadas. Esa tabla muchas veces deja de ser 'solo de unión' y pasa a ser una entidad con datos propios de la relación: la fecha de inscripción, la nota final, el estado del pago, el progreso. En el ejemplo de pedidos pasa lo mismo: `items_pedido (pedido_id, producto_id, cantidad, precio_unitario)` relaciona pedidos y productos y guarda la cantidad y el precio al momento de la compra. Los ORMs como Prisma pueden manejar la tabla intermedia de forma implícita, pero en cuanto la relación tiene atributos conviene declararla explícita.",
    respuestaEn:
      "With an intermediate (join or associative) table holding a foreign key to each side. For example, students and courses: a student enrolls in many courses and a course has many students, so you create `enrollments (student_id, course_id)` with a primary key or unique constraint on the pair, so there are no duplicate enrollments. That table often stops being 'just a join' and becomes an entity with its own relationship data: enrollment date, final grade, payment status, progress. The orders example is the same: `order_items (order_id, product_id, quantity, unit_price)` relates orders and products and stores quantity and price at purchase time. ORMs like Prisma can handle the join table implicitly, but as soon as the relationship has attributes it's better to declare it explicitly.",
    codigo: `CREATE TABLE inscripciones (
  alumno_id  bigint REFERENCES alumnos(id) ON DELETE CASCADE,
  curso_id   bigint REFERENCES cursos(id),
  inscripto_el timestamptz NOT NULL DEFAULT now(),
  nota       numeric(4, 2),
  PRIMARY KEY (alumno_id, curso_id)
);`,
  },
  {
    nivel: 2,
    pregunta: "¿Cuándo tiene sentido desnormalizar?",
    respuestaEs:
      "Cuando una lectura crítica es demasiado cara con el modelo normalizado y medirlo lo demuestra, o cuando el dato duplicado representa en realidad otra cosa. Casos típicos: contadores precalculados (`cantidad_comentarios` en el post, en vez de contar cada vez), totales guardados en el pedido, datos copiados a propósito como FOTO histórica (el precio y el nombre del producto en cada ítem del pedido: si el producto cambia de precio mañana, la factura de ayer no debería cambiar, así que no es duplicación sino un dato distinto), vistas materializadas o tablas de reportes que se recalculan, y réplicas de lectura en un motor de búsqueda. El costo es que la aplicación (o triggers, o jobs) tiene que mantener las copias sincronizadas, y cada punto de sincronización es un lugar donde puede aparecer una inconsistencia. La regla: normalizar por defecto, desnormalizar de forma deliberada y documentada, con un mecanismo claro de actualización.",
    respuestaEn:
      "When a critical read is too expensive with the normalized model and measurement proves it, or when the duplicated data actually represents something else. Typical cases: precomputed counters (`comment_count` on the post, instead of counting every time), totals stored on the order, data copied on purpose as a historical SNAPSHOT (product price and name in each order item: if the product's price changes tomorrow, yesterday's invoice shouldn't change, so it isn't duplication but a different fact), materialized views or reporting tables that get recomputed, and read replicas in a search engine. The cost is that the application (or triggers, or jobs) must keep the copies in sync, and each sync point is a place where inconsistency can appear. The rule: normalize by default, denormalize deliberately and documented, with a clear update mechanism.",
    tradeoffs:
      "Desnormalizar acelera lecturas a costa de escrituras más complejas y riesgo de inconsistencia; conviene reservarlo para lecturas críticas medidas o para fotos históricas.",
  },
  {
    nivel: 2,
    pregunta: "¿Clave primaria natural o sustituta? ¿UUID o autoincremental?",
    respuestaEs:
      "Una clave NATURAL es un dato del negocio que identifica al registro (el email, el CUIT, el código de producto); una SUSTITUTA es un identificador sin significado generado por el sistema. Casi siempre conviene la sustituta como clave primaria: los datos del negocio cambian (un email se cambia, un código se reformatea) y cambiar una clave primaria obliga a actualizar todas las referencias; la natural se protege igual con un constraint UNIQUE. Entre sustitutas: el autoincremental (`bigint GENERATED ALWAYS AS IDENTITY`) es compacto y eficiente para los índices, pero es predecible (expone volumen de negocio y facilita la enumeración si se muestra en URLs) y exige a la base para generarlo. El UUID se puede generar en cualquier lado (el cliente, varios servicios) sin coordinación y no revela nada, pero el UUID v4 aleatorio fragmenta los índices B-tree porque inserta en posiciones aleatorias; el UUID v7, ordenado por tiempo, resuelve eso y es hoy una muy buena opción por defecto. También existe el patrón mixto: bigint interno y un id público aleatorio para exponer.",
    respuestaEn:
      "A NATURAL key is business data identifying the record (email, tax id, product code); a SURROGATE is a meaningless system-generated identifier. The surrogate is almost always better as primary key: business data changes (an email gets changed, a code reformatted) and changing a primary key forces updating every reference; the natural one is still protected with a UNIQUE constraint. Among surrogates: the auto-increment (`bigint GENERATED ALWAYS AS IDENTITY`) is compact and index-efficient, but predictable (it exposes business volume and eases enumeration if shown in URLs) and requires the database to generate it. A UUID can be generated anywhere (the client, several services) without coordination and reveals nothing, but random UUID v4 fragments B-tree indexes because it inserts at random positions; time-ordered UUID v7 fixes that and is now a very good default. There's also the mixed pattern: an internal bigint plus a random public id for exposure.",
  },
  {
    nivel: 3,
    pregunta: "Explicá 1FN, 2FN y 3FN con un ejemplo.",
    respuestaEs:
      "PRIMERA forma normal: cada columna tiene valores atómicos y no hay grupos repetidos; una columna `telefonos` con '11-1234, 11-5678' o columnas `producto1`, `producto2`, `producto3` la violan, y se resuelve con una tabla aparte (una fila por teléfono). SEGUNDA: estando en 1FN, ninguna columna depende de solo PARTE de una clave compuesta. En `items_pedido (pedido_id, producto_id, cantidad, nombre_producto)`, el nombre del producto depende solo de `producto_id`, no del par completo: se mueve a `productos`. TERCERA: estando en 2FN, ninguna columna que no es clave depende de otra columna que no es clave (dependencias transitivas). En `pedidos (id, cliente_id, email_cliente)`, el email depende del cliente, no del pedido: se mueve a `clientes`. Una forma de recordarlo: cada atributo depende 'de la clave, de toda la clave y de nada más que la clave'. Existen formas superiores (Boyce-Codd, 4FN, 5FN) para casos más raros; en la práctica, llegar a 3FN y desnormalizar deliberadamente donde haga falta cubre casi todo.",
    respuestaEn:
      "FIRST normal form: every column holds atomic values and there are no repeating groups; a `phones` column with '11-1234, 11-5678' or columns `product1`, `product2`, `product3` violate it, fixed with a separate table (one row per phone). SECOND: already in 1NF, no column depends on only PART of a composite key. In `order_items (order_id, product_id, quantity, product_name)`, the product name depends only on `product_id`, not the full pair: it moves to `products`. THIRD: already in 2NF, no non-key column depends on another non-key column (transitive dependencies). In `orders (id, customer_id, customer_email)`, the email depends on the customer, not the order: it moves to `customers`. A way to remember it: every attribute depends 'on the key, the whole key, and nothing but the key'. Higher forms exist (Boyce-Codd, 4NF, 5NF) for rarer cases; in practice, reaching 3NF and deliberately denormalizing where needed covers almost everything.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo modelás datos que cambian en el tiempo cuando necesitás el historial?",
    respuestaEs:
      "Depende de qué preguntas hay que responder. Si solo importa el valor en el momento de una transacción, se guarda una FOTO en la transacción (el precio en el ítem del pedido, la dirección de envío en el pedido). Si hay que saber qué valor tenía algo en cualquier fecha (el precio de un producto en marzo, el plan de un cliente), se usan tablas con VIGENCIA: `precios (producto_id, precio, vigente_desde, vigente_hasta)`, con un constraint de exclusión en Postgres para que no se superpongan dos períodos del mismo producto, y la consulta busca la fila vigente en la fecha pedida. Si hay que auditar quién cambió qué y cuándo, una tabla de auditoría alimentada por triggers o por la aplicación (con el valor anterior, el nuevo, el usuario y el momento). Y si el historial ES el modelo (cada cambio es un evento de negocio, como en contabilidad), event sourcing: se guardan los eventos y el estado actual se deriva de ellos. Borrar con `deleted_at` (soft delete) es otra forma parcial de conservar historia, con el costo de acordarse de filtrarlo en cada consulta.",
    respuestaEn:
      "It depends on which questions must be answered. If only the value at the time of a transaction matters, store a SNAPSHOT in the transaction (price on the order item, shipping address on the order). If you need the value of something at any date (a product's price in March, a customer's plan), use tables with VALIDITY periods: `prices (product_id, price, valid_from, valid_to)`, with an exclusion constraint in Postgres so two periods for the same product don't overlap, and the query finds the row valid at the requested date. If you need to audit who changed what and when, an audit table fed by triggers or the application (with old value, new value, user and timestamp). And if history IS the model (each change is a business event, as in accounting), event sourcing: events are stored and current state is derived from them. Deleting with `deleted_at` (soft delete) is another partial way to keep history, at the cost of remembering to filter it in every query.",
    codigo: `CREATE TABLE precios (
  producto_id bigint REFERENCES productos(id),
  precio      numeric(12, 2) NOT NULL,
  vigencia    tstzrange NOT NULL,
  EXCLUDE USING gist (producto_id WITH =, vigencia WITH &&)  -- sin superposiciones
);

SELECT precio FROM precios
WHERE producto_id = 3 AND vigencia @> '2026-03-15'::timestamptz;`,
  },
];
