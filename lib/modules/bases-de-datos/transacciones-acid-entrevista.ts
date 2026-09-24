import type { PreguntaEntrevista } from "../types";

export const entrevistaTransaccionesAcid: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es una transacción y qué significa ACID?",
    respuestaEs:
      "Una transacción agrupa varias operaciones para que la base las trate como una unidad. ACID son las cuatro garantías que da. ATOMICIDAD: se aplican todas o ninguna; si algo falla a mitad de camino, un ROLLBACK deja todo como estaba, así que nunca queda un débito sin su crédito. CONSISTENCIA: la transacción lleva la base de un estado válido a otro válido, respetando los constraints (foreign keys, UNIQUE, CHECK); si uno se viola, la transacción falla. Ojo que las reglas de negocio que no están expresadas como constraints son responsabilidad de la aplicación. AISLAMIENTO (isolation): las transacciones concurrentes no deberían ver los estados intermedios de las otras; cuánto se aíslan depende del nivel de aislamiento configurado, y es la garantía con más matices. DURABILIDAD: una vez que el COMMIT responde OK, el cambio sobrevive a un corte de luz o un crash, porque se escribió antes en el write-ahead log (WAL) en disco.",
    respuestaEn:
      "A transaction groups several operations so the database treats them as a unit. ACID are the four guarantees it provides. ATOMICITY: all of them apply or none do; if something fails midway, a ROLLBACK leaves everything as it was, so there's never a debit without its credit. CONSISTENCY: the transaction moves the database from one valid state to another, respecting constraints (foreign keys, UNIQUE, CHECK); if one is violated, the transaction fails. Note that business rules not expressed as constraints are the application's responsibility. ISOLATION: concurrent transactions shouldn't see each other's intermediate states; how isolated they are depends on the configured isolation level, and it's the guarantee with the most nuance. DURABILITY: once COMMIT returns OK, the change survives a power cut or crash, because it was first written to the write-ahead log (WAL) on disk.",
  },
  {
    nivel: 1,
    pregunta: "¿Cuándo usás una transacción en una aplicación?",
    respuestaEs:
      "Cuando varias escrituras tienen que quedar todas o ninguna: crear un pedido con sus ítems y descontar stock, una transferencia entre cuentas, registrar un usuario junto con su perfil. Si falla la tercera escritura sin transacción, quedan datos a medias que después hay que limpiar a mano. También cuando una lectura y una escritura dependen entre sí (leer el stock y decidir si se puede vender), aunque ahí la transacción sola no alcanza y hay que pensar en el aislamiento o en bloqueos. En la práctica se usa lo que da el ORM o el driver (`prisma.$transaction`, `BEGIN/COMMIT` con el cliente de pg), y la regla es mantenerlas cortas: nada de llamadas HTTP a servicios externos, envío de emails ni esperas del usuario adentro, porque la transacción mantiene bloqueos y una conexión del pool ocupada mientras dura. Una sola sentencia ya es atómica por sí misma, no hace falta envolverla.",
    respuestaEn:
      "When several writes must all happen or none: creating an order with its items and decrementing stock, a transfer between accounts, registering a user with their profile. If the third write fails without a transaction, half-written data is left that someone must clean up by hand. Also when a read and a write depend on each other (reading stock and deciding whether to sell), though there a transaction alone isn't enough and you must think about isolation or locks. In practice you use what the ORM or driver offers (`prisma.$transaction`, `BEGIN/COMMIT` with the pg client), and the rule is to keep them short: no HTTP calls to external services, sending emails or waiting on the user inside, because the transaction holds locks and a pool connection for as long as it lasts. A single statement is already atomic on its own; no need to wrap it.",
    codigo: `await prisma.$transaction(async (tx) => {
  const pedido = await tx.pedido.create({ data: { clienteId } });
  await tx.item.createMany({ data: items.map((i) => ({ ...i, pedidoId: pedido.id })) });
  await tx.producto.update({
    where: { id: productoId },
    data: { stock: { decrement: 1 } },
  });
}); // si algo tira error, se revierte todo

await enviarEmailConfirmacion(); // afuera: no retener la transacción`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué niveles de aislamiento existen y qué anomalías previene cada uno?",
    respuestaEs:
      "El estándar SQL define cuatro niveles por las anomalías que permiten. READ UNCOMMITTED permite dirty reads (leer cambios no commiteados de otra transacción). READ COMMITTED las evita: cada sentencia ve lo commiteado hasta ese momento, pero dos lecturas de la misma fila en una transacción pueden dar valores distintos (lectura no repetible). REPEATABLE READ garantiza que una fila leída no cambia durante la transacción; en el estándar todavía permite phantoms (filas nuevas que aparecen en un rango), pero en Postgres se implementa como snapshot isolation y no los permite. SERIALIZABLE garantiza que el resultado es equivalente a ejecutar las transacciones una detrás de otra. Dos detalles de Postgres que conviene saber: el default es READ COMMITTED (en MySQL/InnoDB es REPEATABLE READ), y READ UNCOMMITTED se comporta como READ COMMITTED, así que no hay dirty reads nunca. El trade-off general es que más aislamiento significa más transacciones abortadas o bloqueadas que la aplicación tiene que reintentar.",
    respuestaEn:
      "The SQL standard defines four levels by the anomalies they allow. READ UNCOMMITTED allows dirty reads (reading another transaction's uncommitted changes). READ COMMITTED prevents them: each statement sees what was committed up to that point, but two reads of the same row within a transaction may return different values (non-repeatable read). REPEATABLE READ guarantees a row that was read doesn't change during the transaction; the standard still allows phantoms (new rows appearing in a range), but Postgres implements it as snapshot isolation and doesn't allow them. SERIALIZABLE guarantees the result is equivalent to running the transactions one after another. Two Postgres details worth knowing: the default is READ COMMITTED (in MySQL/InnoDB it's REPEATABLE READ), and READ UNCOMMITTED behaves as READ COMMITTED, so there are never dirty reads. The general trade-off is that more isolation means more aborted or blocked transactions the application must retry.",
    tradeoffs:
      "READ COMMITTED alcanza para la mayoría de las operaciones si las escrituras concurrentes se resuelven con updates atómicos o bloqueos puntuales; SERIALIZABLE da la garantía más simple de razonar a cambio de reintentos.",
  },
  {
    nivel: 2,
    pregunta: "Dos requests leen el stock, restan 1 y lo guardan. ¿Qué pasa y cómo lo arreglás?",
    respuestaEs:
      "Es un lost update: las dos leen stock = 1, las dos calculan 0 en la aplicación y las dos escriben 0. Se vendieron dos unidades de un producto que tenía una, y la segunda escritura pisó la primera sin que nadie se entere. En READ COMMITTED, que es el default de Postgres, pasa sin ningún error. Hay tres soluciones, de más simple a más general. UPDATE ATÓMICO: que la base haga la cuenta, `UPDATE productos SET stock = stock - 1 WHERE id = 7 AND stock > 0`, y mirar cuántas filas afectó; si es 0, no había stock. Es la mejor opción cuando la lógica entra en una sentencia. BLOQUEO PESIMISTA: `SELECT ... FOR UPDATE` bloquea la fila hasta el fin de la transacción, y la segunda request espera y lee el valor ya actualizado; sirve cuando la decisión necesita lógica en la aplicación, a costa de serializar las requests sobre esa fila. BLOQUEO OPTIMISTA: una columna `version` que se compara al escribir (`WHERE id = 7 AND version = 3`); si otra transacción ya la cambió, el update afecta 0 filas y se reintenta. Encaja cuando los conflictos son raros o cuando entre la lectura y la escritura pasa tiempo, como un formulario que el usuario edita durante minutos.",
    respuestaEn:
      "It's a lost update: both read stock = 1, both compute 0 in the application and both write 0. Two units were sold of a product that had one, and the second write silently overwrote the first. In READ COMMITTED, Postgres's default, it happens without any error. There are three solutions, from simplest to most general. ATOMIC UPDATE: let the database do the math, `UPDATE products SET stock = stock - 1 WHERE id = 7 AND stock > 0`, and check how many rows it affected; if 0, there was no stock. It's the best option when the logic fits in one statement. PESSIMISTIC LOCKING: `SELECT ... FOR UPDATE` locks the row until the transaction ends, and the second request waits and reads the already updated value; useful when the decision needs application logic, at the cost of serializing requests on that row. OPTIMISTIC LOCKING: a `version` column compared on write (`WHERE id = 7 AND version = 3`); if another transaction already changed it, the update affects 0 rows and you retry. It fits when conflicts are rare or when time passes between read and write, like a form the user edits for minutes.",
    codigo: `-- atómico: la base resuelve la concurrencia
UPDATE productos SET stock = stock - 1
WHERE id = 7 AND stock > 0;          -- 0 filas afectadas = sin stock

-- pesimista: la segunda transacción espera acá
BEGIN;
SELECT stock FROM productos WHERE id = 7 FOR UPDATE;
-- ...lógica en la aplicación...
UPDATE productos SET stock = 0 WHERE id = 7;
COMMIT;

-- optimista: falla si alguien la cambió desde que la leí
UPDATE productos SET stock = 0, version = version + 1
WHERE id = 7 AND version = 3;`,
  },
  {
    nivel: 3,
    pregunta: "¿Cómo implementa Postgres el aislamiento sin bloquear las lecturas?",
    respuestaEs:
      "Con MVCC (multiversion concurrency control). Un UPDATE no modifica la fila en su lugar: escribe una versión nueva y marca la vieja como reemplazada, y cada versión guarda qué transacción la creó (xmin) y cuál la borró (xmax). Cada transacción o sentencia trabaja con una SNAPSHOT: la lista de transacciones que estaban commiteadas cuando se tomó. Al leer, se queda con las versiones visibles para esa snapshot. Por eso los lectores nunca bloquean a los escritores ni al revés; solo dos escrituras sobre la misma fila se esperan entre sí. En READ COMMITTED se toma una snapshot por sentencia; en REPEATABLE READ y SERIALIZABLE, una por transacción. El costo son las versiones muertas: quedan en la tabla hasta que VACUUM (normalmente autovacuum) las limpia, y ocupan espacio (bloat) y hacen más lentos los scans. De ahí un problema clásico de producción: una transacción que queda abierta horas (un `idle in transaction` por un bug o una consulta analítica eterna) impide que VACUUM limpie cualquier versión posterior a su snapshot, y la base crece y se degrada. Se previene con `idle_in_transaction_session_timeout` y monitoreando `pg_stat_activity`.",
    respuestaEn:
      "With MVCC (multiversion concurrency control). An UPDATE doesn't modify the row in place: it writes a new version and marks the old one as superseded, and each version stores which transaction created it (xmin) and which deleted it (xmax). Each transaction or statement works with a SNAPSHOT: the list of transactions that were committed when it was taken. When reading, it keeps the versions visible to that snapshot. That's why readers never block writers or vice versa; only two writes to the same row wait on each other. In READ COMMITTED a snapshot is taken per statement; in REPEATABLE READ and SERIALIZABLE, one per transaction. The cost is dead versions: they stay in the table until VACUUM (usually autovacuum) cleans them, taking space (bloat) and slowing scans. Hence a classic production problem: a transaction left open for hours (an `idle in transaction` from a bug or an endless analytical query) prevents VACUUM from cleaning any version newer than its snapshot, and the database grows and degrades. You prevent it with `idle_in_transaction_session_timeout` and by monitoring `pg_stat_activity`.",
    repregunta: "¿Qué es un deadlock y cómo lo evitás?",
    respuestaRepreguntaEs:
      "Dos transacciones que se esperan mutuamente: T1 bloqueó la fila A y quiere la B, T2 bloqueó la B y quiere la A. Ninguna puede avanzar. Postgres lo detecta (después de `deadlock_timeout`, 1 segundo por default), aborta una de las dos con un error y la otra sigue. No se pueden eliminar del todo, así que la aplicación tiene que estar preparada para reintentar. Para que sean raros: tomar los bloqueos siempre en el mismo orden (por ejemplo, actualizar las cuentas de una transferencia ordenadas por id, no 'origen y después destino'), mantener las transacciones cortas, y bloquear lo necesario desde el principio con `SELECT ... FOR UPDATE` en vez de ir escalando.",
    respuestaRepreguntaEn:
      "Two transactions waiting on each other: T1 locked row A and wants B, T2 locked B and wants A. Neither can proceed. Postgres detects it (after `deadlock_timeout`, 1 second by default), aborts one of them with an error and the other continues. They can't be fully eliminated, so the application must be ready to retry. To make them rare: always acquire locks in the same order (for example, update a transfer's accounts sorted by id, not 'source then destination'), keep transactions short, and lock what's needed up front with `SELECT ... FOR UPDATE` instead of escalating.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué implica usar SERIALIZABLE en producción?",
    respuestaEs:
      "En Postgres, SERIALIZABLE se implementa con SSI (serializable snapshot isolation): las transacciones corren sobre snapshots como en REPEATABLE READ, sin bloquear de más, y la base además registra qué leyó cada una. Si detecta un patrón de dependencias lectura/escritura que no podría darse en ninguna ejecución en serie, aborta una transacción con el error 40001 (serialization_failure). Eso atrapa anomalías que REPEATABLE READ deja pasar, como el write skew: dos transacciones leen el mismo conjunto, cada una modifica una fila distinta basándose en lo leído, y juntas rompen una regla (quedan cero médicos de guardia). Implicancias: la aplicación TIENE que reintentar la transacción completa ante 40001 (y ante 40P01, deadlock), así que la lógica debe ser idempotente y sin efectos externos adentro; el nivel se fija por transacción, no hace falta usarlo en toda la app; y hay falsos positivos (aborta transacciones que en realidad no conflictuaban), que aumentan con transacciones largas o que leen mucho. La alternativa, si solo un flujo tiene el problema, es resolverlo en READ COMMITTED con un bloqueo explícito o un constraint que exprese la regla.",
    respuestaEn:
      "In Postgres, SERIALIZABLE is implemented with SSI (serializable snapshot isolation): transactions run on snapshots like in REPEATABLE READ, without extra blocking, and the database also tracks what each one read. If it detects a pattern of read/write dependencies that couldn't occur in any serial execution, it aborts a transaction with error 40001 (serialization_failure). That catches anomalies REPEATABLE READ lets through, like write skew: two transactions read the same set, each modifies a different row based on what it read, and together they break a rule (zero doctors on call). Implications: the application MUST retry the whole transaction on 40001 (and on 40P01, deadlock), so the logic must be idempotent with no external side effects inside; the level is set per transaction, you don't need it across the whole app; and there are false positives (it aborts transactions that didn't really conflict), which grow with long or read-heavy transactions. The alternative, if only one flow has the problem, is to solve it in READ COMMITTED with an explicit lock or a constraint expressing the rule.",
    codigo: `async function conReintentos<T>(fn: () => Promise<T>, intentos = 3): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const reintentable = ["40001", "40P01"].includes(codigoPg(e));
    if (!reintentable || intentos <= 1) throw e;
    return conReintentos(fn, intentos - 1); // la transacción completa, desde cero
  }
}`,
  },
];
