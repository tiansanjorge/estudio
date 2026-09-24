export interface JobPipeline {
  id: string;
  nombre: string;
  // minutos de trabajo propio, sin contar checkout + instalación de dependencias
  duracion: number;
  needs: string[];
  // deploy usa el artefacto de build: no instala dependencias
  instala: boolean;
}

export const JOBS: JobPipeline[] = [
  { id: "lint", nombre: "lint", duracion: 1, needs: [], instala: true },
  { id: "typecheck", nombre: "typecheck", duracion: 1.5, needs: [], instala: true },
  { id: "test", nombre: "test", duracion: 4, needs: [], instala: true },
  { id: "build", nombre: "build", duracion: 3, needs: ["lint", "typecheck", "test"], instala: true },
  { id: "e2e", nombre: "e2e", duracion: 5, needs: ["build"], instala: true },
  { id: "deploy", nombre: "deploy", duracion: 1, needs: ["build", "e2e"], instala: false },
];

export const SETUP_SIN_CACHE = 2.5;
export const SETUP_CON_CACHE = 0.5;

export type EstadoJob = "ok" | "fallo" | "salteado";

export interface EjecucionJob {
  id: string;
  nombre: string;
  estado: EstadoJob;
  inicio: number;
  fin: number;
}

export interface ConfigPipeline {
  paralelo: boolean;
  cache: boolean;
  fallaTest: boolean;
}

export interface ResultadoPipeline {
  jobs: EjecucionJob[];
  total: number;
  // cuándo se entera el autor del PR de que algo falló
  feedbackFallo: number | null;
}

export function ejecutarPipeline({ paralelo, cache, fallaTest }: ConfigPipeline): ResultadoPipeline {
  const setup = cache ? SETUP_CON_CACHE : SETUP_SIN_CACHE;
  const jobs: EjecucionJob[] = [];

  if (!paralelo) {
    // un solo job con todos los pasos: instala una vez, pero todo va en fila
    let t = setup;
    let fallo = false;
    for (const job of JOBS) {
      if (fallo) {
        jobs.push({ id: job.id, nombre: job.nombre, estado: "salteado", inicio: t, fin: t });
        continue;
      }
      const falla = fallaTest && job.id === "test";
      jobs.push({ id: job.id, nombre: job.nombre, estado: falla ? "fallo" : "ok", inicio: t, fin: t + job.duracion });
      t += job.duracion;
      fallo = falla;
    }
  } else {
    // JOBS ya está en orden topológico: cada job aparece después de sus needs
    for (const job of JOBS) {
      const previos = jobs.filter((j) => job.needs.includes(j.id));
      const inicio = Math.max(0, ...previos.map((j) => j.fin));
      if (previos.some((j) => j.estado !== "ok")) {
        jobs.push({ id: job.id, nombre: job.nombre, estado: "salteado", inicio, fin: inicio });
        continue;
      }
      const falla = fallaTest && job.id === "test";
      const duracion = job.duracion + (job.instala ? setup : 0);
      jobs.push({ id: job.id, nombre: job.nombre, estado: falla ? "fallo" : "ok", inicio, fin: inicio + duracion });
    }
  }

  const total = Math.max(...jobs.map((j) => j.fin));
  const fallido = jobs.find((j) => j.estado === "fallo");
  return { jobs, total, feedbackFallo: fallido ? fallido.fin : null };
}
