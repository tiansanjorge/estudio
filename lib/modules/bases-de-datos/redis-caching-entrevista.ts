import type { PreguntaEntrevista } from "../types";

export const entrevistaRedisCaching: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es Redis y para qué lo usarías?",
    respuestaEs:
      "Es un almacén clave-valor en memoria: todos los datos viven en RAM, así que las operaciones tardan microsegundos del lado del servidor, y la latencia real queda dominada por la red (alrededor de un milisegundo). No guarda solo strings: tiene hashes, listas, sets, sorted sets y streams, cada uno con operaciones atómicas propias. Ejecuta los comandos de a uno por vez, así que cada comando es atómico sin necesidad de locks. Usos típicos: CACHÉ de resultados caros (consultas, respuestas de APIs externas); SESIONES compartidas entre varias instancias de la app; RATE LIMITING con `INCR` y `EXPIRE`; COLAS de jobs (BullMQ corre sobre Redis); rankings con sorted sets; pub/sub para notificar entre procesos; y locks distribuidos simples. Puede persistir a disco (snapshots RDB o un log AOF), pero su modelo es otro: la memoria es cara y limitada, y en el caso típico de caché los datos se pueden perder y reconstruir desde la base. No reemplaza a la base de datos principal.",
    respuestaEn:
      "It's an in-memory key-value store: all data lives in RAM, so operations take microseconds server-side, and real latency is dominated by the network (around a millisecond). It doesn't just store strings: it has hashes, lists, sets, sorted sets and streams, each with its own atomic operations. It executes commands one at a time, so each command is atomic without locks. Typical uses: CACHING expensive results (queries, external API responses); SESSIONS shared across app instances; RATE LIMITING with `INCR` and `EXPIRE`; job QUEUES (BullMQ runs on Redis); leaderboards with sorted sets; pub/sub to notify between processes; and simple distributed locks. It can persist to disk (RDB snapshots or an AOF log), but its model is different: memory is expensive and limited, and in the typical cache case data can be lost and rebuilt from the database. It doesn't replace the primary database.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo implementás una caché con Redis delante de la base?",
    respuestaEs:
      "El patrón más común es CACHE-ASIDE (o lazy loading): la aplicación, no Redis, maneja la caché. Al leer, busca la clave en Redis; si está (hit), la devuelve; si no está (miss), consulta la base, guarda el resultado en Redis con un TTL y lo devuelve. Al escribir, actualiza la base y BORRA la clave, para que la próxima lectura traiga el dato nuevo. El TTL es la red de seguridad: si alguna invalidación falla o se olvida, el dato viejo se sirve como mucho hasta que venza. Cuánto TTL depende de cuánto tiempo es aceptable mostrar un dato desactualizado: segundos para un stock, horas para un catálogo que cambia poco. Detalles de implementación: claves con un esquema predecible (`producto:7`, `usuario:42:permisos`) para poder invalidarlas; serializar a JSON con cuidado con las fechas; y tratar a Redis como opcional: si no responde, la app debería seguir funcionando contra la base, más lenta, en vez de caerse.",
    respuestaEn:
      "The most common pattern is CACHE-ASIDE (or lazy loading): the application, not Redis, manages the cache. On read, it looks the key up in Redis; if present (hit), it returns it; if not (miss), it queries the database, stores the result in Redis with a TTL and returns it. On write, it updates the database and DELETES the key, so the next read fetches fresh data. The TTL is the safety net: if an invalidation fails or is forgotten, stale data is served at most until it expires. How long a TTL depends on how long showing outdated data is acceptable: seconds for stock, hours for a rarely changing catalog. Implementation details: keys with a predictable scheme (`product:7`, `user:42:permissions`) so you can invalidate them; serializing to JSON carefully with dates; and treating Redis as optional: if it doesn't respond, the app should keep working against the database, slower, instead of going down.",
    codigo: `async function obtenerProducto(id: number) {
  const clave = \`producto:\${id}\`;
  const enCache = await redis.get(clave);
  if (enCache) return JSON.parse(enCache);

  const producto = await prisma.producto.findUnique({ where: { id } });
  await redis.set(clave, JSON.stringify(producto), "EX", 300);
  return producto;
}

async function actualizarPrecio(id: number, precio: number) {
  await prisma.producto.update({ where: { id }, data: { precio } });
  await redis.del(\`producto:\${id}\`); // después de que la base confirmó
}`,
  },
  {
    nivel: 2,
    pregunta: "Al escribir, ¿por qué borrar la clave en vez de actualizarla con el valor nuevo?",
    respuestaEs:
      "Por las condiciones de carrera. Si al escribir hago SET con el valor nuevo, dos escrituras concurrentes pueden terminar en distinto orden en la base y en Redis: la base queda con B y la caché con A, y ese dato incorrecto vive hasta que venza el TTL. Con DEL, la próxima lectura va a la base y trae lo que esté ahí, sea cual sea el orden. Además, el valor en caché a veces no es la fila tal cual sino algo derivado (el producto con su categoría y su stock calculado), y recalcularlo en cada escritura es trabajo que quizá nadie lee. Igual queda una ventana de inconsistencia: una lectura que hizo miss y consultó la base justo antes de la escritura puede guardar el valor viejo después del DEL. Es poco probable y el TTL la acota; si no es aceptable, hay técnicas como un DEL retrasado (borrar de nuevo unos cientos de milisegundos después) o versionar las claves. Otro detalle: el DEL va después de confirmar la transacción de la base, no adentro, porque si la transacción se revierte habrías invalidado sin motivo, y si borrás antes del commit una lectura concurrente puede recachear el valor viejo.",
    respuestaEn:
      "Because of race conditions. If on write I SET the new value, two concurrent writes can finish in different orders in the database and in Redis: the database ends with B and the cache with A, and that wrong value lives until the TTL expires. With DEL, the next read goes to the database and fetches whatever is there, regardless of order. Also, the cached value is sometimes not the raw row but something derived (the product with its category and computed stock), and recomputing it on every write is work nobody might read. There's still a window of inconsistency: a read that missed and queried the database just before the write can store the old value after the DEL. It's unlikely and the TTL bounds it; if it's not acceptable, there are techniques like a delayed DEL (deleting again a few hundred milliseconds later) or versioned keys. Another detail: the DEL goes after the database transaction commits, not inside it, because if the transaction rolls back you'd have invalidated for nothing, and if you delete before commit a concurrent read can re-cache the old value.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué cacheás, y dónde: en memoria del proceso, en Redis o en el CDN?",
    respuestaEs:
      "Primero, qué: datos que se leen mucho más de lo que se escriben, que son caros de calcular, y donde un dato levemente desactualizado es tolerable. Un catálogo, la configuración, permisos de un usuario, la respuesta de una API externa lenta o con rate limit. No conviene cachear lo que cambia en cada lectura, lo que se lee una sola vez, ni datos donde la frescura es crítica (el saldo que se usa para autorizar un pago). Y antes de cachear, vale la pena ver si un índice resuelve la consulta lenta, porque la caché suma complejidad e invalidación. Después, dónde. EN MEMORIA DEL PROCESO (un LRU en Node): lo más rápido, sin red, pero cada instancia tiene su copia, así que invalidar en todas es difícil y la memoria se multiplica por réplica; sirve para datos casi estáticos y chicos. REDIS: compartido entre instancias, se invalida en un solo lugar, sobrevive a los deploys; cuesta un viaje de red y otra pieza de infraestructura. CDN o caché HTTP: para respuestas públicas iguales para todos, se sirve sin llegar al servidor; la invalidación es más gruesa (por URL o tag). Se pueden combinar en capas, sabiendo que cada capa suma un lugar donde el dato puede estar viejo.",
    respuestaEn:
      "First, what: data read far more often than written, expensive to compute, and where slightly outdated data is tolerable. A catalog, configuration, a user's permissions, the response of a slow or rate-limited external API. It's not worth caching what changes on every read, what's read only once, or data where freshness is critical (the balance used to authorize a payment). And before caching, check whether an index solves the slow query, because a cache adds complexity and invalidation. Then, where. IN-PROCESS MEMORY (an LRU in Node): fastest, no network, but each instance has its own copy, so invalidating everywhere is hard and memory multiplies per replica; good for small, nearly static data. REDIS: shared across instances, invalidated in one place, survives deploys; costs a network round trip and one more piece of infrastructure. CDN or HTTP cache: for public responses identical for everyone, served without reaching the server; invalidation is coarser (by URL or tag). They can be layered, knowing each layer adds a place where data can be stale.",
    tradeoffs:
      "Cada capa de caché cambia latencia y carga en la base por complejidad de invalidación y una ventana de datos desactualizados.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es un cache stampede y cómo lo evitás?",
    respuestaEs:
      "Pasa cuando una clave muy consultada expira (o se invalida) y, en ese instante, cientos de requests hacen miss a la vez y todas van a la base a recalcular lo mismo. La base recibe un pico de consultas caras idénticas, se pone lenta, las requests tardan más, y en el peor caso la caída se retroalimenta. También pasa a gran escala cuando muchas claves se crearon juntas con el mismo TTL (después de un deploy o un reinicio de Redis) y vencen juntas. Soluciones, combinables. JITTER en el TTL: sumar un valor aleatorio (300 s más o menos 10%) para que las claves no venzan todas juntas. SINGLE-FLIGHT con un lock: la primera request que hace miss toma un lock en Redis (`SET clave:lock 1 NX PX 5000`) y recalcula; las demás esperan un poco y reintentan leer la caché, o devuelven el valor viejo si lo hay. STALE-WHILE-REVALIDATE: guardar junto al valor un 'fresco hasta' menor que el TTL real; pasado ese momento se sigue sirviendo el valor viejo mientras una sola request lo refresca en segundo plano. EXPIRACIÓN TEMPRANA PROBABILÍSTICA: cada lectura cercana al vencimiento tiene una probabilidad creciente de refrescar antes de tiempo. Y para claves críticas, precalentar o refrescar desde un job en vez de esperar al miss.",
    respuestaEn:
      "It happens when a heavily requested key expires (or is invalidated) and, at that instant, hundreds of requests miss at once and all go to the database to recompute the same thing. The database gets a spike of identical expensive queries, slows down, requests take longer, and in the worst case the failure feeds itself. It also happens at scale when many keys were created together with the same TTL (after a deploy or a Redis restart) and expire together. Solutions, combinable. TTL JITTER: add a random value (300 s plus or minus 10%) so keys don't all expire together. SINGLE-FLIGHT with a lock: the first request that misses takes a lock in Redis (`SET key:lock 1 NX PX 5000`) and recomputes; the rest wait briefly and retry the cache, or return the old value if there is one. STALE-WHILE-REVALIDATE: store alongside the value a 'fresh until' shorter than the real TTL; after that point the old value keeps being served while a single request refreshes it in the background. PROBABILISTIC EARLY EXPIRATION: each read close to expiry has a growing probability of refreshing early. And for critical keys, prewarm or refresh from a job instead of waiting for the miss.",
    codigo: `const lock = await redis.set(\`\${clave}:lock\`, "1", "PX", 5000, "NX");
if (lock === "OK") {
  const valor = await calcularDesdeLaBase();
  const ttl = 300 + Math.floor(Math.random() * 30); // jitter
  await redis.set(clave, JSON.stringify(valor), "EX", ttl);
  await redis.del(\`\${clave}:lock\`);
  return valor;
}
// otra request ya está recalculando: esperar y reintentar leer la caché
await esperar(50);
return obtenerConCache(clave);`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué tenés en cuenta al operar Redis en producción?",
    respuestaEs:
      "MEMORIA: todo vive en RAM, así que se configura `maxmemory` y una política de eviction. Para una caché, `allkeys-lru` (o `allkeys-lfu`) descarta las claves menos usadas al llenarse. Para datos que no se pueden perder, como las colas de BullMQ, la política tiene que ser `noeviction`: si no, Redis borra jobs en silencio. Por eso conviene separar caché y colas en instancias distintas. UN SOLO HILO para ejecutar comandos: un comando lento bloquea a todos los demás. `KEYS *` en producción recorre todo el keyspace y congela el servidor (se usa `SCAN`, que itera de a partes), y las claves gigantes (un hash con millones de campos) hacen lento cualquier comando que las toque. PERSISTENCIA: RDB toma snapshots periódicos (puede perder los últimos minutos); AOF registra cada escritura (con `everysec` pierde como mucho un segundo). ALTA DISPONIBILIDAD: réplicas con Sentinel para failover automático, o Redis Cluster para repartir datos entre nodos. La replicación es asíncrona, así que un failover puede perder las últimas escrituras confirmadas: un lock en Redis no es una garantía fuerte de exclusión mutua. Y un dato de contexto: en 2024 Redis cambió su licencia y surgió Valkey, un fork mantenido bajo la Linux Foundation que varios proveedores cloud ofrecen como reemplazo compatible.",
    respuestaEn:
      "MEMORY: everything lives in RAM, so you set `maxmemory` and an eviction policy. For a cache, `allkeys-lru` (or `allkeys-lfu`) drops the least used keys when full. For data that can't be lost, like BullMQ queues, the policy must be `noeviction`: otherwise Redis silently deletes jobs. That's why it's worth separating cache and queues into different instances. A SINGLE THREAD executes commands: one slow command blocks everything else. `KEYS *` in production walks the whole keyspace and freezes the server (use `SCAN`, which iterates in chunks), and huge keys (a hash with millions of fields) slow down any command touching them. PERSISTENCE: RDB takes periodic snapshots (it can lose the last few minutes); AOF logs every write (with `everysec` it loses at most one second). HIGH AVAILABILITY: replicas with Sentinel for automatic failover, or Redis Cluster to shard data across nodes. Replication is asynchronous, so a failover can lose the last acknowledged writes: a lock in Redis isn't a strong mutual exclusion guarantee. And some context: in 2024 Redis changed its license and Valkey emerged, a fork maintained under the Linux Foundation that several cloud providers offer as a compatible replacement.",
  },
];
