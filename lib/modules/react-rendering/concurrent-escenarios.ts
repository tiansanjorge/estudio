export interface PasoConcurrente {
  descripcion: string;
  inputPendiente: boolean;
  transicionPendiente: boolean;
  queryInput: string;
  queryLista: string;
}

export const pasosConcurrente: PasoConcurrente[] = [
  {
    descripcion:
      "El usuario tipea 'a'. React arranca dos trabajos: actualizar el input (urgente) y re-filtrar la lista completa (marcada como transición, de baja prioridad).",
    inputPendiente: false,
    transicionPendiente: true,
    queryInput: "a",
    queryLista: "",
  },
  {
    descripcion:
      "El input se actualiza y se pinta al instante — es de alta prioridad, nunca espera a la lista.",
    inputPendiente: false,
    transicionPendiente: true,
    queryInput: "a",
    queryLista: "",
  },
  {
    descripcion:
      "Mientras la transición de la lista todavía está calculando, el usuario tipea 'ab'. React DESCARTA el trabajo de la transición anterior (todavía no había terminado) y arranca una transición nueva con 'ab'.",
    inputPendiente: false,
    transicionPendiente: true,
    queryInput: "ab",
    queryLista: "",
  },
  {
    descripcion:
      "La lista nunca llega a mostrar el resultado intermedio de 'a' — pasa directo del resultado vacío al de 'ab', ahorrando trabajo que se iba a descartar igual.",
    inputPendiente: false,
    transicionPendiente: true,
    queryInput: "ab",
    queryLista: "",
  },
  {
    descripcion:
      "Recién cuando el usuario deja de tipear, la transición pendiente termina y la lista se actualiza — isPending vuelve a false.",
    inputPendiente: false,
    transicionPendiente: false,
    queryInput: "ab",
    queryLista: "ab",
  },
];
