export type BugId =
  | "ninguno"
  | "sin-dueno"
  | "sin-validacion"
  | "entidad-completa"
  | "status-200"
  | "sin-idempotencia";

export const BUGS: { id: BugId; nombre: string }[] = [
  { id: "ninguno", nombre: "Implementación correcta" },
  { id: "status-200", nombre: "Responde 200 en vez de 201" },
  { id: "sin-validacion", nombre: "Validación del body desactivada" },
  { id: "sin-dueno", nombre: "No verifica el dueño del pedido" },
  { id: "entidad-completa", nombre: "Devuelve la fila completa de la DB" },
  { id: "sin-idempotencia", nombre: "Ignora la Idempotency-Key" },
];

export interface CasoTest {
  id: string;
  categoria: string;
  nombre: string;
  codigo: string;
  /** Bug que hace fallar a este caso. */
  fallaCon: BugId;
}

export const CASOS: CasoTest[] = [
  {
    id: "happy",
    categoria: "Camino feliz",
    nombre: "crea el pedido y responde 201 con Location",
    fallaCon: "status-200",
    codigo: `const res = await request(app)
  .post("/pedidos")
  .set("Cookie", sesionDe(ana))
  .send({ productoId: "p1", cantidad: 2 });

expect(res.status).toBe(201);
expect(res.headers.location).toBe(\`/pedidos/\${res.body.id}\`);
expect(await db.pedido.count()).toBe(1);`,
  },
  {
    id: "validacion",
    categoria: "Validación",
    nombre: "rechaza cantidades inválidas con 400",
    fallaCon: "sin-validacion",
    codigo: `const res = await request(app)
  .post("/pedidos")
  .set("Cookie", sesionDe(ana))
  .send({ productoId: "p1", cantidad: -3 });

expect(res.status).toBe(400);
expect(res.body.errores[0].campo).toBe("cantidad");
expect(await db.pedido.count()).toBe(0);`,
  },
  {
    id: "autenticacion",
    categoria: "Autenticación",
    nombre: "responde 401 sin sesión",
    fallaCon: "ninguno",
    codigo: `const res = await request(app)
  .post("/pedidos")
  .send({ productoId: "p1", cantidad: 1 });

expect(res.status).toBe(401);`,
  },
  {
    id: "autorizacion",
    categoria: "Autorización",
    nombre: "no permite ver el pedido de otro usuario",
    fallaCon: "sin-dueno",
    codigo: `const pedidoDeBeto = await crearPedido(beto);

const res = await request(app)
  .get(\`/pedidos/\${pedidoDeBeto.id}\`)
  .set("Cookie", sesionDe(ana));

expect(res.status).toBe(404);`,
  },
  {
    id: "exposicion",
    categoria: "Exposición de datos",
    nombre: "no expone campos internos",
    fallaCon: "entidad-completa",
    codigo: `const res = await request(app)
  .get(\`/pedidos/\${pedido.id}\`)
  .set("Cookie", sesionDe(ana));

expect(res.body).not.toHaveProperty("costoInterno");
expect(res.body.cliente).not.toHaveProperty("passwordHash");`,
  },
  {
    id: "idempotencia",
    categoria: "Idempotencia",
    nombre: "no duplica el pedido con la misma Idempotency-Key",
    fallaCon: "sin-idempotencia",
    codigo: `const enviar = () =>
  request(app)
    .post("/pedidos")
    .set("Cookie", sesionDe(ana))
    .set("Idempotency-Key", "abc-123")
    .send({ productoId: "p1", cantidad: 1 });

const [a, b] = [await enviar(), await enviar()];
expect(b.body.id).toBe(a.body.id);
expect(await db.pedido.count()).toBe(1);`,
  },
];

export function pasa(caso: CasoTest, bug: BugId): boolean {
  return bug === "ninguno" || caso.fallaCon !== bug;
}
