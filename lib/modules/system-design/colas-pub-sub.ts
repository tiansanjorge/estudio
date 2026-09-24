export type Clave = "pedido" | "sin-clave";

export const ETAPAS = ["creado", "pagado", "enviado", "entregado"] as const;
export const PEDIDOS = ["p1", "p2", "p3", "p4", "p5", "p6"];
// mensajes por segundo que procesa un consumidor
export const RITMO_CONSUMIDOR = 50;

export interface Mensaje {
  indice: number;
  pedido: string;
  etapa: (typeof ETAPAS)[number];
}

// los eventos llegan intercalados: todos los "creado", después todos los "pagado", etc.
export const MENSAJES: Mensaje[] = ETAPAS.flatMap((etapa) => PEDIDOS.map((pedido) => ({ pedido, etapa }))).map((m, indice) => ({
  ...m,
  indice,
}));

function hash(texto: string): number {
  let h = 0x811c9dc5;
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  return h;
}

export function particionDe(m: Mensaje, clave: Clave, particiones: number): number {
  // sin clave, el productor reparte sin mirar el pedido: mensajes del mismo pedido caen en particiones distintas
  return clave === "pedido" ? hash(m.pedido) % particiones : hash(`mensaje-${m.indice}`) % particiones;
}

export interface Distribucion {
  porParticion: Mensaje[][];
  // consumidor → particiones asignadas; una partición la lee un solo consumidor del grupo
  asignacion: number[][];
  consumidoresOciosos: number;
  // pedidos cuyos eventos quedaron repartidos en más de una partición: su orden no está garantizado
  pedidosSinOrden: string[];
  segundosParaVaciar: number;
}

export function distribuir(clave: Clave, particiones: number, consumidores: number): Distribucion {
  const porParticion: Mensaje[][] = Array.from({ length: particiones }, () => []);
  for (const m of MENSAJES) porParticion[particionDe(m, clave, particiones)].push(m);

  const asignacion: number[][] = Array.from({ length: consumidores }, () => []);
  for (let p = 0; p < particiones; p++) asignacion[p % consumidores].push(p);

  const pedidosSinOrden = PEDIDOS.filter(
    (pedido) => new Set(MENSAJES.filter((m) => m.pedido === pedido).map((m) => particionDe(m, clave, particiones))).size > 1,
  );

  const cargaMaxima = Math.max(...asignacion.map((ps) => ps.reduce((s, p) => s + porParticion[p].length, 0)));
  return {
    porParticion,
    asignacion,
    consumidoresOciosos: asignacion.filter((ps) => ps.length === 0).length,
    pedidosSinOrden,
    segundosParaVaciar: cargaMaxima / RITMO_CONSUMIDOR,
  };
}
