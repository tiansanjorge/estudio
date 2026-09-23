export interface FilaPlana {
  pedido: number;
  cliente: string;
  email: string;
  producto: string;
  precio: number;
  cantidad: number;
}

export const PLANILLA_INICIAL: FilaPlana[] = [
  { pedido: 1, cliente: "Ana", email: "ana@mail.com", producto: "Teclado", precio: 45000, cantidad: 1 },
  { pedido: 2, cliente: "Beto", email: "beto@mail.com", producto: "Mouse", precio: 18000, cantidad: 2 },
  { pedido: 3, cliente: "Ana", email: "ana@mail.com", producto: "Monitor", precio: 250000, cantidad: 1 },
  { pedido: 4, cliente: "Ana", email: "ana@mail.com", producto: "Mouse", precio: 18000, cantidad: 1 },
];

export interface Normalizado {
  clientes: { id: number; nombre: string; email: string }[];
  productos: { id: number; nombre: string; precio: number }[];
  pedidos: { id: number; clienteId: number; productoId: number; cantidad: number }[];
}

export const NORMALIZADO_INICIAL: Normalizado = {
  clientes: [
    { id: 1, nombre: "Ana", email: "ana@mail.com" },
    { id: 2, nombre: "Beto", email: "beto@mail.com" },
  ],
  productos: [
    { id: 1, nombre: "Teclado", precio: 45000 },
    { id: 2, nombre: "Mouse", precio: 18000 },
    { id: 3, nombre: "Monitor", precio: 250000 },
  ],
  pedidos: [
    { id: 1, clienteId: 1, productoId: 1, cantidad: 1 },
    { id: 2, clienteId: 2, productoId: 2, cantidad: 2 },
    { id: 3, clienteId: 1, productoId: 3, cantidad: 1 },
    { id: 4, clienteId: 1, productoId: 2, cantidad: 1 },
  ],
};

export type AccionId = "email" | "borrar" | "producto-nuevo";

export const ACCIONES: { id: AccionId; nombre: string; anomalia: string }[] = [
  { id: "email", nombre: "Ana cambia su email (se actualiza una sola fila)", anomalia: "Anomalía de actualización" },
  { id: "borrar", nombre: "Se borra el pedido 3", anomalia: "Anomalía de borrado" },
  { id: "producto-nuevo", nombre: "Dar de alta el producto 'Webcam' sin pedidos", anomalia: "Anomalía de inserción" },
];

export function aplicarPlanilla(filas: FilaPlana[], accion: AccionId): { filas: FilaPlana[]; resultado: string; problema: boolean } {
  switch (accion) {
    case "email": {
      // el bug típico: se actualiza la fila que se estaba viendo, no todas
      let actualizada = false;
      const nuevas = filas.map((f) => {
        if (!actualizada && f.cliente === "Ana") {
          actualizada = true;
          return { ...f, email: "ana.garcia@mail.com" };
        }
        return f;
      });
      const emails = new Set(nuevas.filter((f) => f.cliente === "Ana").map((f) => f.email));
      return {
        filas: nuevas,
        resultado:
          emails.size > 1
            ? "Ana ahora tiene dos emails distintos según el pedido: ¿cuál es el correcto?"
            : "El email quedó consistente.",
        problema: emails.size > 1,
      };
    }
    case "borrar": {
      const nuevas = filas.filter((f) => f.pedido !== 3);
      const monitorExiste = nuevas.some((f) => f.producto === "Monitor");
      return {
        filas: nuevas,
        resultado: monitorExiste
          ? "El producto sigue existiendo."
          : "Con el pedido desapareció el único registro del Monitor y su precio: el catálogo perdió un producto.",
        problema: !monitorExiste,
      };
    }
    case "producto-nuevo":
      return {
        filas,
        resultado:
          "No hay dónde ponerlo: cada fila es un pedido, así que un producto sin pedidos no se puede guardar (salvo con una fila falsa llena de nulos).",
        problema: true,
      };
  }
}

export function aplicarNormalizado(datos: Normalizado, accion: AccionId): { datos: Normalizado; resultado: string } {
  switch (accion) {
    case "email":
      return {
        datos: {
          ...datos,
          clientes: datos.clientes.map((c) => (c.id === 1 ? { ...c, email: "ana.garcia@mail.com" } : c)),
        },
        resultado: "Una sola fila en clientes: todos los pedidos de Ana ven el email nuevo.",
      };
    case "borrar":
      return {
        datos: { ...datos, pedidos: datos.pedidos.filter((p) => p.id !== 3) },
        resultado: "Se borró el pedido; el Monitor sigue en productos.",
      };
    case "producto-nuevo":
      return {
        datos: {
          ...datos,
          productos: [...datos.productos, { id: datos.productos.length + 1, nombre: "Webcam", precio: 32000 }],
        },
        resultado: "Un INSERT en productos, sin necesidad de inventar un pedido.",
      };
  }
}
