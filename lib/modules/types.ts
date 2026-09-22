export type EstadoModulo = "disponible" | "proximamente";

export interface Modulo {
  slug: string;
  titulo: string;
  estado: EstadoModulo;
}

export interface Categoria {
  slug: string;
  titulo: string;
  modulos: Modulo[];
}

/**
 * Nivel 1: fundamentos aplicados — de concepto a producción.
 * Nivel 2: trade-offs y buenas prácticas — lo que distingue a un senior hablando.
 * Nivel 3: edge cases y profundidad interna.
 */
export type Nivel = 1 | 2 | 3;

export interface PreguntaEntrevista {
  pregunta: string;
  respuestaEs: string;
  respuestaEn: string;
  /** Snippet de código opcional, solo cuando clarifica más que la prosa (ej: "¿qué imprime esto?"). No todas las preguntas lo necesitan. */
  codigo?: string;
  tradeoffs?: string;
  repregunta?: string;
  respuestaRepreguntaEs?: string;
  respuestaRepreguntaEn?: string;
  /** Snippet de código opcional para la repregunta, con el mismo criterio que `codigo`. */
  codigoRepregunta?: string;
  nivel: Nivel;
}
