import type { PreguntaEntrevista } from "./types";
import { entrevistaEventLoop } from "./event-loop/entrevista";
import { entrevistaClosures } from "./closures/entrevista";
import { entrevistaPromises } from "./promises/entrevista";
import { entrevistaAsync } from "./async/entrevista";
import { entrevistaScope } from "./scope/entrevista";
import { entrevistaHoisting } from "./hoisting/entrevista";
import { entrevistaMemory } from "./memory/entrevista";
import { entrevistaPrototypes } from "./prototypes/entrevista";

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
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "promises",
    moduloTitulo: "Promises",
    preguntas: entrevistaPromises,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "async",
    moduloTitulo: "Async",
    preguntas: entrevistaAsync,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "scope",
    moduloTitulo: "Scope",
    preguntas: entrevistaScope,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "hoisting",
    moduloTitulo: "Hoisting",
    preguntas: entrevistaHoisting,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "memory",
    moduloTitulo: "Memory",
    preguntas: entrevistaMemory,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "prototypes-clases",
    moduloTitulo: "Prototypes & Clases",
    preguntas: entrevistaPrototypes,
  },
];
