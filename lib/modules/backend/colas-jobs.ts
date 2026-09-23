export interface Job {
  id: string;
  duracionS: number;
  /** Cuántos intentos fallan antes del primero exitoso (Infinity = siempre falla). */
  fallasAntesDeExito: number;
}

export const JOBS: Job[] = [
  { id: "email-1", duracionS: 1, fallasAntesDeExito: 0 },
  { id: "pdf-2", duracionS: 3, fallasAntesDeExito: 0 },
  { id: "email-3", duracionS: 1, fallasAntesDeExito: 2 },
  { id: "webhook-4", duracionS: 1, fallasAntesDeExito: 0 },
  { id: "email-5", duracionS: 1, fallasAntesDeExito: Infinity },
  { id: "pdf-6", duracionS: 3, fallasAntesDeExito: 1 },
];

export interface ConfigCola {
  concurrencia: number;
  maxIntentos: number;
  backoffExponencial: boolean;
}

export interface Intento {
  inicio: number;
  fin: number;
  ok: boolean;
  worker: number;
}

export interface ResultadoJob {
  job: Job;
  intentos: Intento[];
  estado: "completado" | "fallido";
}

const BACKOFF_BASE_S = 1;

function demoraReintento(intentoFallido: number, exponencial: boolean): number {
  return exponencial ? BACKOFF_BASE_S * 2 ** (intentoFallido - 1) : BACKOFF_BASE_S;
}

/** Scheduler simple: cada worker toma el job listo más antiguo apenas se libera. */
export function procesarCola(config: ConfigCola): { resultados: ResultadoJob[]; duracionTotal: number } {
  const workersLibresDesde = Array.from({ length: config.concurrencia }, () => 0);
  const resultados = new Map<string, ResultadoJob>(
    JOBS.map((j) => [j.id, { job: j, intentos: [], estado: "completado" as const }]),
  );
  const pendientes = JOBS.map((job) => ({ job, listoEn: 0, orden: 0 }));
  let orden = 0;

  while (pendientes.length > 0) {
    const worker = workersLibresDesde.indexOf(Math.min(...workersLibresDesde));
    pendientes.sort((a, b) => a.listoEn - b.listoEn || a.orden - b.orden);
    const siguiente = pendientes.shift()!;
    const resultado = resultados.get(siguiente.job.id)!;

    const inicio = Math.max(workersLibresDesde[worker], siguiente.listoEn);
    const fin = inicio + siguiente.job.duracionS;
    const numeroIntento = resultado.intentos.length + 1;
    const ok = numeroIntento > siguiente.job.fallasAntesDeExito;
    resultado.intentos.push({ inicio, fin, ok, worker: worker + 1 });
    workersLibresDesde[worker] = fin;

    if (!ok) {
      if (numeroIntento < config.maxIntentos) {
        pendientes.push({
          job: siguiente.job,
          listoEn: fin + demoraReintento(numeroIntento, config.backoffExponencial),
          orden: ++orden,
        });
      } else {
        resultado.estado = "fallido";
      }
    }
  }

  const lista = [...resultados.values()];
  const duracionTotal = Math.max(...lista.flatMap((r) => r.intentos.map((i) => i.fin)));
  return { resultados: lista, duracionTotal };
}
