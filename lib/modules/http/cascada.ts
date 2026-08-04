export interface RecursoTimeline {
  id: number;
  inicio: number;
  fin: number;
}

const DURACION_RECURSO = 1;
const CONEXIONES_HTTP1 = 6;

export function calcularCascadaHttp1(cantidadRecursos: number): RecursoTimeline[] {
  return Array.from({ length: cantidadRecursos }, (_, i) => {
    const inicio = Math.floor(i / CONEXIONES_HTTP1) * DURACION_RECURSO;
    return { id: i, inicio, fin: inicio + DURACION_RECURSO };
  });
}

export function calcularCascadaHttp2(cantidadRecursos: number): RecursoTimeline[] {
  return Array.from({ length: cantidadRecursos }, (_, i) => ({
    id: i,
    inicio: 0,
    fin: DURACION_RECURSO,
  }));
}

export function tiempoTotal(timeline: RecursoTimeline[]): number {
  return Math.max(...timeline.map((r) => r.fin));
}
