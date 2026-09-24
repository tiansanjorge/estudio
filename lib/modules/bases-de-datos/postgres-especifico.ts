export const DDL_PRODUCTOS = `CREATE TABLE productos (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku          text NOT NULL UNIQUE,
  nombre       text NOT NULL,
  precio       numeric(12,2) NOT NULL CHECK (precio > 0),
  stock        integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categoria_id bigint NOT NULL REFERENCES categorias (id)
);`;

export const SKUS_EXISTENTES = ["TEC-001", "MOU-002"];
export const CATEGORIAS_EXISTENTES = [1, 2, 3];

export interface FilaProducto {
  sku: string;
  nombre: string;
  precio: string;
  stock: string;
  categoriaId: string;
}

export const FILA_INICIAL: FilaProducto = {
  sku: "MON-003",
  nombre: "Monitor 27",
  precio: "250000",
  stock: "5",
  categoriaId: "1",
};

export interface ResultadoInsert {
  ok: boolean;
  mensaje: string;
  constraint?: string;
}

const vacio = (v: string) => v.trim() === "";

// Postgres chequea NOT NULL y CHECK al armar la fila, UNIQUE al insertar en el índice,
// y las foreign keys al final de la sentencia: este orden define qué error aparece primero
export function insertar(fila: FilaProducto): ResultadoInsert {
  const columnas: [keyof FilaProducto, string][] = [
    ["sku", "sku"],
    ["nombre", "nombre"],
    ["precio", "precio"],
    ["categoriaId", "categoria_id"],
  ];
  for (const [campo, columna] of columnas) {
    if (vacio(fila[campo])) {
      return {
        ok: false,
        constraint: "NOT NULL",
        mensaje: `ERROR: null value in column "${columna}" of relation "productos" violates not-null constraint`,
      };
    }
  }

  const precio = Number(fila.precio);
  const stock = vacio(fila.stock) ? 0 : Number(fila.stock);
  const categoria = Number(fila.categoriaId);
  if ([precio, stock, categoria].some(Number.isNaN) || !Number.isInteger(stock) || !Number.isInteger(categoria)) {
    return { ok: false, constraint: "Tipo", mensaje: "ERROR: invalid input syntax for type numeric/integer" };
  }

  if (precio <= 0) {
    return {
      ok: false,
      constraint: "CHECK",
      mensaje: 'ERROR: new row for relation "productos" violates check constraint "productos_precio_check"',
    };
  }
  if (stock < 0) {
    return {
      ok: false,
      constraint: "CHECK",
      mensaje: 'ERROR: new row for relation "productos" violates check constraint "productos_stock_check"',
    };
  }
  if (SKUS_EXISTENTES.includes(fila.sku.trim())) {
    return {
      ok: false,
      constraint: "UNIQUE",
      mensaje: `ERROR: duplicate key value violates unique constraint "productos_sku_key"\nDETAIL: Key (sku)=(${fila.sku.trim()}) already exists.`,
    };
  }
  if (!CATEGORIAS_EXISTENTES.includes(categoria)) {
    return {
      ok: false,
      constraint: "FOREIGN KEY",
      mensaje: `ERROR: insert or update on table "productos" violates foreign key constraint "productos_categoria_id_fkey"\nDETAIL: Key (categoria_id)=(${categoria}) is not present in table "categorias".`,
    };
  }
  return { ok: true, mensaje: "INSERT 0 1" };
}
