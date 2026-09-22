import type { PreguntaEntrevista } from "./types";
import { entrevistaEventLoop } from "./event-loop/entrevista";
import { entrevistaClosures } from "./closures/entrevista";

export interface BancoEntrevistaModulo {
  categoriaSlug: string;
  categoriaTitulo: string;
  moduloSlug: string;
  moduloTitulo: string;
  preguntas: PreguntaEntrevista[];
}

/**
 * Se va sumando una entrada por módulo a medida que se escribe su
 * entrevista.ts. No todos los módulos disponibles tienen banco todavía.
 */
export const bancoEntrevista: BancoEntrevistaModulo[] = [
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "event-loop",
    moduloTitulo: "Event Loop",
    preguntas: entrevistaEventLoop,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "closures",
    moduloTitulo: "Closures",
    preguntas: entrevistaClosures,
  },
];
