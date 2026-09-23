export const MODELO_RELACIONAL = `clientes (id, nombre, email)
productos (id, nombre, precio)
pedidos   (id, cliente_id → clientes, fecha, estado)
items     (pedido_id → pedidos, producto_id → productos, cantidad, precio_unitario)`;

export const MODELO_DOCUMENTO = `// colección "pedidos": el pedido con todo lo que se muestra junto
{
  _id: "p_1042",
  fecha: "2026-09-20",
  estado: "pagado",
  cliente: { id: "c_7", nombre: "Ana García" },      // copia embebida
  items: [
    { productoId: "pr_3", nombre: "Teclado", precio: 45000, cantidad: 1 },
    { productoId: "pr_9", nombre: "Mouse",   precio: 18000, cantidad: 2 }
  ]
}`;

export type Veredicto = "natural" | "posible" | "costoso";

export interface Operacion {
  id: string;
  nombre: string;
  sql: { codigo: string; veredicto: Veredicto; nota: string };
  documento: { codigo: string; veredicto: Veredicto; nota: string };
}

export const OPERACIONES: Operacion[] = [
  {
    id: "detalle",
    nombre: "Mostrar un pedido completo",
    sql: {
      codigo: `SELECT * FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
JOIN items i ON i.pedido_id = p.id
JOIN productos pr ON pr.id = i.producto_id
WHERE p.id = 1042;`,
      veredicto: "posible",
      nota: "Tres JOINs: con índices es rápido, pero hay que reconstruir el objeto.",
    },
    documento: {
      codigo: `db.pedidos.findOne({ _id: "p_1042" })`,
      veredicto: "natural",
      nota: "Una lectura trae exactamente lo que la pantalla muestra.",
    },
  },
  {
    id: "reporte",
    nombre: "Ventas por producto del mes",
    sql: {
      codigo: `SELECT pr.nombre, SUM(i.cantidad * i.precio_unitario)
FROM items i JOIN pedidos p ON p.id = i.pedido_id
JOIN productos pr ON pr.id = i.producto_id
WHERE p.fecha >= '2026-09-01'
GROUP BY pr.nombre;`,
      veredicto: "natural",
      nota: "SQL está hecho para esto: agregaciones sobre cualquier combinación de datos.",
    },
    documento: {
      codigo: `db.pedidos.aggregate([
  { $match: { fecha: { $gte: "2026-09-01" } } },
  { $unwind: "$items" },
  { $group: { _id: "$items.productoId", total: { $sum: ... } } }
])`,
      veredicto: "posible",
      nota: "Se puede con el pipeline de agregación, pero hay que desarmar cada documento.",
    },
  },
  {
    id: "renombrar",
    nombre: "Cambiar el nombre de un cliente",
    sql: {
      codigo: `UPDATE clientes SET nombre = 'Ana G. Pérez' WHERE id = 7;`,
      veredicto: "natural",
      nota: "El dato vive en un solo lugar: una fila, y todos los pedidos lo ven actualizado.",
    },
    documento: {
      codigo: `db.clientes.updateOne(...)
db.pedidos.updateMany({ "cliente.id": "c_7" },
  { $set: { "cliente.nombre": "Ana G. Pérez" } })`,
      veredicto: "costoso",
      nota: "La copia embebida está en cada pedido: hay que actualizar muchos documentos (o aceptar que queden con el nombre viejo).",
    },
  },
  {
    id: "transaccion",
    nombre: "Crear el pedido y descontar stock atómicamente",
    sql: {
      codigo: `BEGIN;
INSERT INTO pedidos ...;
INSERT INTO items ...;
UPDATE productos SET stock = stock - 1 WHERE id = 3 AND stock > 0;
COMMIT;`,
      veredicto: "natural",
      nota: "Transacciones ACID sobre varias tablas, con constraints que la base hace cumplir.",
    },
    documento: {
      codigo: `session.withTransaction(async () => {
  await pedidos.insertOne(...);
  await productos.updateOne(...);
})`,
      veredicto: "posible",
      nota: "MongoDB soporta transacciones multi-documento desde la 4.0, con más costo; el modelo invita a mantener la atomicidad dentro de un documento.",
    },
  },
];
