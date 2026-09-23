export type ModoEjecucion = "hilo-principal" | "worker-threads" | "cluster";

export interface RequestEntrante {
  id: string;
  descripcion: string;
  llegadaMs: number;
  cpuMs: number;
  pesado: boolean;
}

export const REQUESTS: RequestEntrante[] = [
  { id: "R1", descripcion: "Generar PDF (CPU intensivo)", llegadaMs: 0, cpuMs: 400, pesado: true },
  { id: "R2", descripcion: "GET /productos", llegadaMs: 10, cpuMs: 5, pesado: false },
  { id: "R3", descripcion: "GET /carrito", llegadaMs: 20, cpuMs: 5, pesado: false },
  { id: "R4", descripcion: "POST /login", llegadaMs: 30, cpuMs: 5, pesado: false },
  { id: "R5", descripcion: "GET /salud", llegadaMs: 40, cpuMs: 5, pesado: false },
];

export const PROCESOS_CLUSTER = 4;
/** Costo de pasarle el trabajo a un worker y recibir el resultado. */
const OVERHEAD_WORKER_MS = 3;

export interface ResultadoRequest {
  request: RequestEntrante;
  inicioMs: number;
  finMs: number;
  latenciaMs: number;
  dondeCorre: string;
}

/** Simula la ejecución no apropiativa: un hilo corre una tarea de CPU hasta terminarla. */
function correrEnCola(requests: RequestEntrante[], etiqueta: (r: RequestEntrante) => string): ResultadoRequest[] {
  let libreDesde = 0;
  return requests.map((r) => {
    const inicio = Math.max(r.llegadaMs, libreDesde);
    const fin = inicio + r.cpuMs;
    libreDesde = fin;
    return { request: r, inicioMs: inicio, finMs: fin, latenciaMs: fin - r.llegadaMs, dondeCorre: etiqueta(r) };
  });
}

export function simular(modo: ModoEjecucion): ResultadoRequest[] {
  if (modo === "hilo-principal") {
    return correrEnCola(REQUESTS, () => "hilo principal");
  }

  if (modo === "worker-threads") {
    const livianos = correrEnCola(REQUESTS.filter((r) => !r.pesado), () => "hilo principal");
    const pesados = REQUESTS.filter((r) => r.pesado).map((r) => {
      const fin = r.llegadaMs + r.cpuMs + OVERHEAD_WORKER_MS;
      return { request: r, inicioMs: r.llegadaMs, finMs: fin, latenciaMs: fin - r.llegadaMs, dondeCorre: "worker thread" };
    });
    return [...pesados, ...livianos].sort((a, b) => a.request.llegadaMs - b.request.llegadaMs);
  }

  // cluster: el primario reparte round-robin entre procesos independientes
  const porProceso = new Map<number, RequestEntrante[]>();
  REQUESTS.forEach((r, i) => {
    const proceso = i % PROCESOS_CLUSTER;
    porProceso.set(proceso, [...(porProceso.get(proceso) ?? []), r]);
  });
  return [...porProceso.entries()]
    .flatMap(([proceso, rs]) => correrEnCola(rs, () => `proceso ${proceso + 1}`))
    .sort((a, b) => a.request.llegadaMs - b.request.llegadaMs);
}
