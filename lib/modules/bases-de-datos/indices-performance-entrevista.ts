import type { PreguntaEntrevista } from "../types";

export const entrevistaIndicesPerformance: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un índice y por qué acelera las consultas?",
    respuestaEs:
      "Es una estructura aparte, mantenida por la base, que guarda los valores de una o más columnas ORDENADOS junto con un puntero a la fila. El tipo por defecto en Postgres y MySQL es el B-tree: un árbol balanceado donde encontrar un valor cuesta del orden de log(n) pasos en vez de recorrer la tabla entera. Sin índice, `WHERE email = 'x'` en una tabla de un millón de filas implica leer el millón (Seq Scan); con índice, bajar unos pocos niveles del árbol y leer las filas que coinciden. Como está ordenado, también sirve para rangos (`fecha >= ...`), `ORDER BY` y `JOIN`s. No es gratis: ocupa espacio y se actualiza en cada INSERT, UPDATE y DELETE que toque sus columnas, así que cada índice hace más lentas las escrituras. Por eso se crean para las consultas reales, no 'por las dudas' en cada columna. Las primary keys y los UNIQUE crean su índice automáticamente; las foreign keys en Postgres NO, y conviene indexarlas.",
    respuestaEn:
      "It's a separate structure, maintained by the database, that stores the values of one or more columns SORTED along with a pointer to the row. The default type in Postgres and MySQL is the B-tree: a balanced tree where finding a value takes about log(n) steps instead of scanning the whole table. Without an index, `WHERE email = 'x'` on a million-row table means reading the million (Seq Scan); with one, descending a few tree levels and reading the matching rows. Being sorted, it also serves ranges (`date >= ...`), `ORDER BY` and `JOIN`s. It isn't free: it takes space and is updated on every INSERT, UPDATE and DELETE touching its columns, so each index slows writes. That's why you create them for real queries, not 'just in case' on every column. Primary keys and UNIQUE create their index automatically; foreign keys in Postgres do NOT, and they're worth indexing.",
  },
  {
    nivel: 1,
    pregunta: "Una consulta está lenta. ¿Cómo la investigás?",
    respuestaEs:
      "Primero confirmo cuál es: con `pg_stat_statements` (o el panel de consultas lentas del proveedor) veo qué consultas consumen más tiempo total, porque a veces el problema no es una consulta lentísima sino una rápida ejecutada miles de veces (un N+1 del ORM). Después corro `EXPLAIN ANALYZE` sobre esa consulta con parámetros reales: muestra el plan que eligió la base, cuántas filas estimó y cuántas encontró de verdad, y el tiempo de cada nodo. Busco señales: un Seq Scan sobre una tabla grande con un filtro que devuelve pocas filas (falta un índice), una estimación de filas muy distinta de la real (estadísticas desactualizadas, se arregla con `ANALYZE`), un Sort o un Hash que usa disco, o un Nested Loop que se ejecuta miles de veces. Arreglo lo que el plan muestra (un índice, reescribir la consulta, traer menos columnas o filas), vuelvo a medir, y verifico que el cambio no empeore las escrituras.",
    respuestaEn:
      "First I confirm which one it is: with `pg_stat_statements` (or the provider's slow query panel) I see which queries consume the most total time, because sometimes the problem isn't one very slow query but a fast one executed thousands of times (an ORM N+1). Then I run `EXPLAIN ANALYZE` on that query with real parameters: it shows the plan the database chose, how many rows it estimated versus actually found, and each node's time. I look for signals: a Seq Scan on a big table with a filter returning few rows (missing index), a row estimate far from reality (stale statistics, fixed with `ANALYZE`), a Sort or Hash spilling to disk, or a Nested Loop running thousands of times. I fix what the plan shows (an index, rewriting the query, fetching fewer columns or rows), measure again, and check the change doesn't hurt writes.",
    codigo: `EXPLAIN ANALYZE
SELECT * FROM pedidos WHERE cliente_id = 42 ORDER BY fecha DESC LIMIT 20;

-- Seq Scan on pedidos (rows=20) (actual rows=20 loops=1)
--   Filter: (cliente_id = 42)
--   Rows Removed by Filter: 999950     <- leyó todo para quedarse con 50`,
  },
  {
    nivel: 2,
    pregunta: "¿Importa el orden de las columnas en un índice compuesto?",
    respuestaEs:
      "Sí, mucho. Un índice sobre `(cliente_id, fecha)` está ordenado primero por cliente y, dentro de cada cliente, por fecha, como una guía telefónica por apellido y después nombre. Sirve para `WHERE cliente_id = 42`, para `WHERE cliente_id = 42 AND fecha >= ...` y para `WHERE cliente_id = 42 ORDER BY fecha`, pero NO sirve (o sirve muy mal) para `WHERE fecha >= ...` solo, porque las fechas están dispersas dentro de cada cliente: es la regla del prefijo izquierdo. La guía práctica: primero las columnas que se filtran por igualdad, después la de rango u orden. Un índice `(a, b)` además cubre las consultas que un índice `(a)` resolvería, así que suele hacer redundante al simple. Y en vez de un índice por columna, conviene pensar qué consultas reales existen y diseñar pocos índices compuestos que las cubran.",
    respuestaEn:
      "Yes, a lot. An index on `(customer_id, date)` is sorted first by customer and, within each customer, by date, like a phone book by last name then first name. It serves `WHERE customer_id = 42`, `WHERE customer_id = 42 AND date >= ...` and `WHERE customer_id = 42 ORDER BY date`, but NOT (or very poorly) `WHERE date >= ...` alone, because dates are scattered within each customer: it's the leftmost prefix rule. The practical guide: equality-filtered columns first, then the range or order column. An `(a, b)` index also covers the queries an `(a)` index would, so it usually makes the single one redundant. And instead of one index per column, think about which real queries exist and design a few composite indexes that cover them.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué la base a veces no usa un índice que existe?",
    respuestaEs:
      "Por varias razones, y no todas son un problema. Poca SELECTIVIDAD: si el filtro coincide con gran parte de la tabla (`estado = 'entregado'` con el 90% de las filas), leer la tabla de corrido es más barato que saltar del índice a la tabla cientos de miles de veces, y el planner elige bien un Seq Scan. Tablas chicas: con pocas filas, un scan es más rápido que cualquier índice. Consultas que no coinciden con lo indexado: aplicar una función a la columna (`lower(email)`, `date(created_at)`), una conversión implícita de tipos, un `LIKE '%texto'` con comodín al principio, o no filtrar por la primera columna de un índice compuesto. Estadísticas viejas, que hacen que el planner estime mal cuántas filas va a encontrar. Las soluciones son específicas: índices de expresión (`CREATE INDEX ON t (lower(email))`), reescribir el filtro como rango (`created_at >= '2026-09-01' AND created_at < '2026-09-02'`), índices de trigramas para búsqueda parcial de texto, o correr `ANALYZE`.",
    respuestaEn:
      "For several reasons, and not all are a problem. Low SELECTIVITY: if the filter matches a large part of the table (`status = 'delivered'` with 90% of rows), reading the table sequentially is cheaper than jumping from the index to the table hundreds of thousands of times, and the planner rightly picks a Seq Scan. Small tables: with few rows, a scan beats any index. Queries that don't match what's indexed: applying a function to the column (`lower(email)`, `date(created_at)`), an implicit type cast, a `LIKE '%text'` with a leading wildcard, or not filtering on the first column of a composite index. Stale statistics, making the planner misestimate how many rows it will find. The fixes are specific: expression indexes (`CREATE INDEX ON t (lower(email))`), rewriting the filter as a range (`created_at >= '2026-09-01' AND created_at < '2026-09-02'`), trigram indexes for partial text search, or running `ANALYZE`.",
    tradeoffs:
      "Que el planner elija Seq Scan con un índice disponible no siempre es un error: con baja selectividad es lo más barato.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué son los índices cubrientes, parciales y los otros tipos además de B-tree?",
    respuestaEs:
      "Un índice CUBRIENTE contiene todas las columnas que la consulta necesita, así que la base responde solo con el índice sin tocar la tabla (Index Only Scan en Postgres); se logra agregando columnas con `INCLUDE (total)`, sin que formen parte del orden. Un índice PARCIAL indexa solo las filas que cumplen una condición (`WHERE estado = 'pendiente'`): si las consultas calientes buscan un subconjunto chico, el índice es mucho más pequeño y barato de mantener; también sirve para unicidad condicional, como un email único solo entre usuarios no borrados. Otros tipos en Postgres: HASH (solo igualdad, raramente mejor que B-tree), GIN (valores compuestos: arrays, JSONB, búsqueda de texto completo, trigramas), GiST (rangos, geometría, el constraint EXCLUDE), y BRIN (tablas enormes donde el orden físico acompaña a una columna, como logs por fecha: guarda resúmenes por bloque y ocupa casi nada). Elegir el tipo depende del operador que usa la consulta, no del tipo de dato.",
    respuestaEn:
      "A COVERING index contains every column the query needs, so the database answers from the index alone without touching the table (Index Only Scan in Postgres); you get it by adding columns with `INCLUDE (total)`, without them being part of the ordering. A PARTIAL index indexes only rows matching a condition (`WHERE status = 'pending'`): if hot queries look for a small subset, the index is much smaller and cheaper to maintain; it also serves conditional uniqueness, like an email unique only among non-deleted users. Other Postgres types: HASH (equality only, rarely better than B-tree), GIN (composite values: arrays, JSONB, full-text search, trigrams), GiST (ranges, geometry, the EXCLUDE constraint), and BRIN (huge tables whose physical order follows a column, like logs by date: it stores per-block summaries and takes almost no space). The type depends on the operator the query uses, not the data type.",
    codigo: `-- parcial + cubriente: la bandeja de pedidos pendientes
CREATE INDEX pedidos_pendientes_idx
  ON pedidos (creado_el)
  INCLUDE (cliente_id, total)
  WHERE estado = 'pendiente';

-- email único solo entre usuarios activos
CREATE UNIQUE INDEX ON usuarios (lower(email)) WHERE borrado_el IS NULL;`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué problemas tiene la paginación con OFFSET y cómo se resuelve?",
    respuestaEs:
      "`LIMIT 20 OFFSET 100000` obliga a la base a recorrer y descartar las primeras 100.000 filas en orden para devolver 20: el costo crece con el número de página, y las últimas páginas son lentísimas aunque haya índice. Además es inestable: si entre página y página se insertan o borran filas, se repiten o se saltean resultados. La alternativa es la paginación por CURSOR o keyset: en vez de 'saltá N filas', se pide 'las 20 siguientes después de la última que vi', con `WHERE (fecha, id) < ($ultimaFecha, $ultimoId) ORDER BY fecha DESC, id DESC LIMIT 20`, y un índice sobre `(fecha, id)`. Cada página cuesta lo mismo, porque el índice va directo al punto de partida, y los cambios intermedios no corren las páginas. El `id` desempata filas con la misma fecha para que el orden sea total. El costo: no se puede saltar a 'la página 37' directamente, así que encaja con scroll infinito y 'cargar más', y OFFSET sigue siendo aceptable en tablas chicas o paneles internos.",
    respuestaEn:
      "`LIMIT 20 OFFSET 100000` forces the database to walk and discard the first 100,000 rows in order to return 20: cost grows with page number, and the last pages are very slow even with an index. It's also unstable: if rows are inserted or deleted between pages, results repeat or get skipped. The alternative is CURSOR or keyset pagination: instead of 'skip N rows', ask for 'the next 20 after the last one I saw', with `WHERE (date, id) < ($lastDate, $lastId) ORDER BY date DESC, id DESC LIMIT 20`, and an index on `(date, id)`. Each page costs the same, since the index goes straight to the starting point, and intermediate changes don't shift pages. The `id` breaks ties between rows with the same date so the order is total. The cost: you can't jump directly to 'page 37', so it fits infinite scroll and 'load more', and OFFSET remains acceptable for small tables or internal panels.",
    codigo: `-- OFFSET: recorre y descarta 100.000 filas
SELECT * FROM posts ORDER BY fecha DESC, id DESC LIMIT 20 OFFSET 100000;

-- keyset: arranca justo después del último visto
SELECT * FROM posts
WHERE (fecha, id) < ('2026-09-20 10:00', 58213)
ORDER BY fecha DESC, id DESC
LIMIT 20;`,
  },
];
