export type EstrategiaCarga = "n-mas-1" | "include" | "join";

export interface Estrategia {
  id: EstrategiaCarga;
  nombre: string;
  codigo: string;
  nota: string;
}

export const ESTRATEGIAS: Estrategia[] = [
  {
    id: "n-mas-1",
    nombre: "Loop con findUnique",
    codigo: `const pedidos = await prisma.pedido.findMany({ take: n });
const clientes = [];
for (const p of pedidos) {
  clientes.push(await prisma.cliente.findUnique({ where: { id: p.clienteId } }));
}`,
    nota: "Una query para la lista y otra por cada fila: el costo crece con n, y cada una paga un viaje de red a la base.",
  },
  {
    id: "include",
    nombre: "include",
    codigo: `const pedidos = await prisma.pedido.findMany({
  take: n,
  include: { cliente: true },
});`,
    nota: "Prisma trae los pedidos y después todos los clientes juntos con WHERE id IN (...), y los une en la aplicación. Siempre son 2 queries.",
  },
  {
    id: "join",
    nombre: 'relationLoadStrategy: "join"',
    codigo: `const pedidos = await prisma.pedido.findMany({
  take: n,
  relationLoadStrategy: "join",
  include: { cliente: true },
});`,
    nota: "Una sola query con JOIN (LATERAL + agregación JSON en Postgres): la base arma el resultado anidado.",
  },
];

// latencia de ida y vuelta a la base: domina cuando hay muchas queries chicas
export const LATENCIA_MS = 2;

export function queriesGeneradas(estrategia: EstrategiaCarga, n: number): string[] {
  switch (estrategia) {
    case "n-mas-1":
      return [
        `SELECT * FROM pedidos LIMIT ${n}`,
        ...Array.from({ length: n }, (_, i) => `SELECT * FROM clientes WHERE id = ${(i % 7) + 1}`),
      ];
    case "include":
      return [`SELECT * FROM pedidos LIMIT ${n}`, "SELECT * FROM clientes WHERE id IN (1, 2, 3, 4, 5, 6, 7)"];
    case "join":
      return [
        `SELECT p.*, c.cliente FROM pedidos p LEFT JOIN LATERAL (SELECT json_build_object(...) AS cliente FROM clientes WHERE id = p.cliente_id) c ON true LIMIT ${n}`,
      ];
  }
}
