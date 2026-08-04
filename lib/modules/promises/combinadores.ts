export type ResultadoTarea = "exito" | "error";
export type EstadoTarea = "pendiente" | "cumplida" | "rechazada";
export type TipoCombinador = "all" | "race" | "allSettled" | "any";

export interface Tarea {
  id: number;
  resultado: ResultadoTarea;
  duracionMs: number;
}

export function crearPromesaTarea(
  tarea: Tarea,
  onEstablecido: (estado: EstadoTarea, detalle: string) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (tarea.resultado === "exito") {
        const valor = `Tarea ${tarea.id} OK`;
        onEstablecido("cumplida", valor);
        resolve(valor);
      } else {
        const mensaje = `Tarea ${tarea.id} falló`;
        onEstablecido("rechazada", mensaje);
        reject(new Error(mensaje));
      }
    }, tarea.duracionMs);
  });
}
