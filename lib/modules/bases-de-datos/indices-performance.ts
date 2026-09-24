export const FILAS_TABLA = 1_000_000;

export type IndiceId = "email" | "lower-email" | "cliente-fecha" | "fecha" | "estado";

export const INDICES: { id: IndiceId; ddl: string }[] = [
  { id: "email", ddl: "CREATE INDEX ON pedidos (email)" },
  { id: "lower-email", ddl: "CREATE INDEX ON pedidos (lower(email))" },
  { id: "cliente-fecha", ddl: "CREATE INDEX ON pedidos (cliente_id, fecha)" },
  { id: "fecha", ddl: "CREATE INDEX ON pedidos (fecha)" },
  { id: "estado", ddl: "CREATE INDEX ON pedidos (estado)" },
];

interface OpcionPlan {
  plan: string;
  filasExaminadas: number;
  nota: string;
}

export interface ConsultaEjemplo {
  id: string;
  sql: string;
  filasResultado: number;
  // cómo la resolvería cada índice útil; los que no aparecen no sirven para esta consulta
  conIndice: Partial<Record<IndiceId, OpcionPlan>>;
  sinIndiceUtil: string;
}

export const CONSULTAS: ConsultaEjemplo[] = [
  {
    id: "email",
    sql: "SELECT * FROM pedidos WHERE email = 'ana@mail.com'",
    filasResultado: 12,
    conIndice: {
      email: { plan: "Index Scan using pedidos_email_idx", filasExaminadas: 12, nota: "Búsqueda en el B-tree: unas pocas páginas y las 12 filas." },
    },
    sinIndiceUtil: "Sin índice sobre email hay que leer toda la tabla y filtrar fila por fila.",
  },
  {
    id: "lower",
    sql: "SELECT * FROM pedidos WHERE lower(email) = 'ana@mail.com'",
    filasResultado: 12,
    conIndice: {
      "lower-email": {
        plan: "Index Scan using pedidos_lower_idx",
        filasExaminadas: 12,
        nota: "El índice de expresión guarda lower(email) ya calculado, así que coincide con la consulta.",
      },
    },
    sinIndiceUtil:
      "El índice sobre email NO sirve: guarda email, no lower(email). Aplicar una función a la columna impide usarlo.",
  },
  {
    id: "cliente-fecha",
    sql: "SELECT * FROM pedidos WHERE cliente_id = 42 AND fecha >= '2026-01-01'",
    filasResultado: 30,
    conIndice: {
      "cliente-fecha": {
        plan: "Index Scan using pedidos_cliente_fecha_idx",
        filasExaminadas: 30,
        nota: "Igualdad en la primera columna y rango en la segunda: el índice compuesto va directo a las 30 filas.",
      },
      fecha: {
        plan: "Index Scan using pedidos_fecha_idx (Filter: cliente_id = 42)",
        filasExaminadas: 180_000,
        nota: "Encuentra los pedidos desde enero de TODOS los clientes y después descarta los que no son del 42.",
      },
    },
    sinIndiceUtil: "Sin índice útil, lectura completa de la tabla.",
  },
  {
    id: "solo-fecha",
    sql: "SELECT * FROM pedidos WHERE fecha >= '2026-09-01'",
    filasResultado: 20_000,
    conIndice: {
      fecha: { plan: "Index Scan using pedidos_fecha_idx", filasExaminadas: 20_000, nota: "Rango sobre la columna indexada." },
    },
    sinIndiceUtil:
      "El índice (cliente_id, fecha) no ayuda: está ordenado primero por cliente, y la consulta no filtra por la columna de la izquierda.",
  },
  {
    id: "estado",
    sql: "SELECT * FROM pedidos WHERE estado = 'entregado'",
    filasResultado: 900_000,
    conIndice: {},
    sinIndiceUtil:
      "Aunque exista el índice sobre estado, el 90% de las filas coincide: saltar del índice a la tabla 900.000 veces es más caro que leerla entera de corrido, y el planner elige Seq Scan.",
  },
];

export interface ResultadoPlan {
  plan: string;
  filasExaminadas: number;
  nota: string;
  usaIndice: boolean;
}

export function planificar(consulta: ConsultaEjemplo, activos: IndiceId[]): ResultadoPlan {
  const opciones = activos
    .map((id) => consulta.conIndice[id])
    .filter((o): o is OpcionPlan => o !== undefined)
    .sort((a, b) => a.filasExaminadas - b.filasExaminadas);

  const mejor = opciones[0];
  if (mejor) return { ...mejor, usaIndice: true };
  return {
    plan: "Seq Scan on pedidos",
    filasExaminadas: FILAS_TABLA,
    nota: consulta.sinIndiceUtil,
    usaIndice: false,
  };
}

// cada índice también cuesta: se actualiza en cada INSERT/UPDATE que toque sus columnas
export function costoEscritura(activos: IndiceId[]): number {
  return 1 + activos.length;
}
