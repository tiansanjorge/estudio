import type { PreguntaEntrevista } from "./types";
import { entrevistaEventLoop } from "./event-loop/entrevista";
import { entrevistaClosures } from "./closures/entrevista";
import { entrevistaPromises } from "./promises/entrevista";
import { entrevistaAsync } from "./async/entrevista";
import { entrevistaScope } from "./scope/entrevista";
import { entrevistaHoisting } from "./hoisting/entrevista";
import { entrevistaMemory } from "./memory/entrevista";
import { entrevistaPrototypes } from "./prototypes/entrevista";
import { entrevistaModulosEsmCjs } from "./modulos-esm-cjs/entrevista";
import { entrevistaIteradores } from "./iteradores/entrevista";
import { entrevistaGenericos } from "./generics/entrevista";
import { entrevistaUtilityTypes } from "./utility-types/entrevista";
import { entrevistaDiscriminatedUnions } from "./discriminated-unions/entrevista";
import { entrevistaStructuralVsNominal } from "./structural-vs-nominal/entrevista";
import { entrevistaStrictMode } from "./strict-mode/entrevista";
import { entrevistaComponentes } from "./react-core/componentes-entrevista";
import { entrevistaProps } from "./react-core/props-entrevista";
import { entrevistaState } from "./react-core/state-entrevista";
import { entrevistaComposicion } from "./react-core/composicion-entrevista";
import { entrevistaKeys } from "./react-core/keys-entrevista";
import { entrevistaContext } from "./react-core/context-entrevista";
import { entrevistaForms } from "./react-core/forms-entrevista";
import { entrevistaErrorBoundaries } from "./react-core/error-boundaries-entrevista";
import { entrevistaPortals } from "./react-core/portals-entrevista";
import { entrevistaRender } from "./react-rendering/render-entrevista";
import { entrevistaCommit } from "./react-rendering/commit-entrevista";
import { entrevistaReconciliation } from "./react-rendering/reconciliation-entrevista";
import { entrevistaFiber } from "./react-rendering/fiber-entrevista";
import { entrevistaVirtualDom } from "./react-rendering/virtual-dom-entrevista";
import { entrevistaConcurrent } from "./react-rendering/concurrent-entrevista";
import { entrevistaHydration } from "./react-rendering/hydration-entrevista";
import { entrevistaUseState } from "./hooks/use-state-entrevista";
import { entrevistaUseEffect } from "./hooks/use-effect-entrevista";
import { entrevistaUseMemo } from "./hooks/use-memo-entrevista";
import { entrevistaUseCallback } from "./hooks/use-callback-entrevista";
import { entrevistaUseRef } from "./hooks/use-ref-entrevista";
import { entrevistaUseReducer } from "./hooks/use-reducer-entrevista";

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
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "modulos-esm-cjs",
    moduloTitulo: "Módulos: ESM vs CommonJS",
    preguntas: entrevistaModulosEsmCjs,
  },
  {
    categoriaSlug: "javascript-profundo",
    categoriaTitulo: "JavaScript profundo",
    moduloSlug: "iteradores-generadores",
    moduloTitulo: "Iteradores y Generadores",
    preguntas: entrevistaIteradores,
  },
  {
    categoriaSlug: "typescript-avanzado",
    categoriaTitulo: "TypeScript avanzado",
    moduloSlug: "genericos",
    moduloTitulo: "Genéricos",
    preguntas: entrevistaGenericos,
  },
  {
    categoriaSlug: "typescript-avanzado",
    categoriaTitulo: "TypeScript avanzado",
    moduloSlug: "utility-types",
    moduloTitulo: "Utility types",
    preguntas: entrevistaUtilityTypes,
  },
  {
    categoriaSlug: "typescript-avanzado",
    categoriaTitulo: "TypeScript avanzado",
    moduloSlug: "discriminated-unions",
    moduloTitulo: "Discriminated unions & type narrowing",
    preguntas: entrevistaDiscriminatedUnions,
  },
  {
    categoriaSlug: "typescript-avanzado",
    categoriaTitulo: "TypeScript avanzado",
    moduloSlug: "structural-vs-nominal",
    moduloTitulo: "Structural typing vs nominal",
    preguntas: entrevistaStructuralVsNominal,
  },
  {
    categoriaSlug: "typescript-avanzado",
    categoriaTitulo: "TypeScript avanzado",
    moduloSlug: "strict-mode",
    moduloTitulo: "Trade-offs de strict mode",
    preguntas: entrevistaStrictMode,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "componentes",
    moduloTitulo: "Componentes",
    preguntas: entrevistaComponentes,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "props",
    moduloTitulo: "Props",
    preguntas: entrevistaProps,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "state",
    moduloTitulo: "State",
    preguntas: entrevistaState,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "composition",
    moduloTitulo: "Composition",
    preguntas: entrevistaComposicion,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "keys",
    moduloTitulo: "Keys",
    preguntas: entrevistaKeys,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "context",
    moduloTitulo: "Context",
    preguntas: entrevistaContext,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "forms",
    moduloTitulo: "Forms",
    preguntas: entrevistaForms,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "error-boundaries",
    moduloTitulo: "Error Boundaries",
    preguntas: entrevistaErrorBoundaries,
  },
  {
    categoriaSlug: "react-core",
    categoriaTitulo: "React Core",
    moduloSlug: "portals",
    moduloTitulo: "Portals",
    preguntas: entrevistaPortals,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "render",
    moduloTitulo: "Render",
    preguntas: entrevistaRender,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "commit",
    moduloTitulo: "Commit",
    preguntas: entrevistaCommit,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "reconciliation",
    moduloTitulo: "Reconciliation",
    preguntas: entrevistaReconciliation,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "fiber",
    moduloTitulo: "Fiber",
    preguntas: entrevistaFiber,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "virtual-dom",
    moduloTitulo: "Virtual DOM",
    preguntas: entrevistaVirtualDom,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "concurrent-rendering",
    moduloTitulo: "Concurrent Rendering",
    preguntas: entrevistaConcurrent,
  },
  {
    categoriaSlug: "react-rendering",
    categoriaTitulo: "React Rendering",
    moduloSlug: "hydration",
    moduloTitulo: "Hydration",
    preguntas: entrevistaHydration,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-state",
    moduloTitulo: "useState",
    preguntas: entrevistaUseState,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-effect",
    moduloTitulo: "useEffect",
    preguntas: entrevistaUseEffect,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-memo",
    moduloTitulo: "useMemo",
    preguntas: entrevistaUseMemo,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-callback",
    moduloTitulo: "useCallback",
    preguntas: entrevistaUseCallback,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-ref",
    moduloTitulo: "useRef",
    preguntas: entrevistaUseRef,
  },
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "use-reducer",
    moduloTitulo: "useReducer",
    preguntas: entrevistaUseReducer,
  },
];
