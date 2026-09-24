export const CANTIDAD_SHARDS = 4;

export type ClaveSharding = "hash-usuario" | "rango-fecha" | "tenant";

export interface ConsultaSharding {
  sql: string;
  shardsTocados: number;
}

export interface EstrategiaSharding {
  id: ClaveSharding;
  nombre: string;
  descripcion: string;
  // miles de filas en cada shard, para 1,2 millones de pedidos de ejemplo
  filasPorShard: number[];
  // a qué shards van los pedidos que se crean hoy
  shardsEscrituraHoy: number[];
  consultas: ConsultaSharding[];
  veredicto: string;
}

export const ESTRATEGIAS_SHARDING: EstrategiaSharding[] = [
  {
    id: "hash-usuario",
    nombre: "hash(usuario_id)",
    descripcion: "shard = hash(usuario_id) % 4",
    filasPorShard: [301, 298, 303, 298],
    shardsEscrituraHoy: [0, 1, 2, 3],
    consultas: [
      { sql: "Pedidos del usuario 42", shardsTocados: 1 },
      { sql: "Pedidos de la última semana (reporte)", shardsTocados: 4 },
      { sql: "Pedidos de la empresa Acme", shardsTocados: 4 },
    ],
    veredicto:
      "Datos y escrituras parejos, y la consulta principal (por usuario) va a un solo shard. Los reportes por fecha consultan los 4 y combinan resultados (scatter-gather).",
  },
  {
    id: "rango-fecha",
    nombre: "rango de fecha",
    descripcion: "un shard por trimestre del año",
    filasPorShard: [180, 250, 330, 440],
    shardsEscrituraHoy: [3],
    consultas: [
      { sql: "Pedidos del usuario 42", shardsTocados: 4 },
      { sql: "Pedidos de la última semana (reporte)", shardsTocados: 1 },
      { sql: "Pedidos de la empresa Acme", shardsTocados: 4 },
    ],
    veredicto:
      "Todas las escrituras de hoy caen en el último shard: es un hotspot, y los otros tres están ociosos. Encaja para datos históricos que se consultan por fecha, no para repartir carga de escritura.",
  },
  {
    id: "tenant",
    nombre: "tenant_id",
    descripcion: "shard = hash(empresa_id) % 4",
    filasPorShard: [620, 190, 205, 185],
    shardsEscrituraHoy: [0, 1, 2, 3],
    consultas: [
      { sql: "Pedidos del usuario 42", shardsTocados: 1 },
      { sql: "Pedidos de la última semana (reporte)", shardsTocados: 4 },
      { sql: "Pedidos de la empresa Acme", shardsTocados: 1 },
    ],
    veredicto:
      "Cada empresa vive entera en un shard, así que sus consultas y joins no cruzan shards. Pero Acme es la mitad del negocio y su shard carga con la mitad de los datos: los tenants gigantes necesitan un shard propio o una clave más fina.",
  },
];

export function maximoFilas(estrategia: EstrategiaSharding): number {
  return Math.max(...estrategia.filasPorShard);
}
