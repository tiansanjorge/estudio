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
import { entrevistaCustomHooks } from "./hooks/custom-hooks-entrevista";
import { entrevistaEstadoContext } from "./estado/context-entrevista";
import { entrevistaZustand } from "./estado/zustand-entrevista";
import { entrevistaReduxToolkit } from "./estado/redux-toolkit-entrevista";
import { entrevistaTanstackQuery } from "./estado/tanstack-query-entrevista";
import { entrevistaCuandoNoUsarEstadoGlobal } from "./estado/cuando-no-usar-estado-global-entrevista";
import { entrevistaMemoization } from "./performance/memoization-entrevista";
import { entrevistaLazyLoading } from "./performance/lazy-loading-entrevista";
import { entrevistaCodeSplitting } from "./performance/code-splitting-entrevista";
import { entrevistaSuspense } from "./performance/suspense-entrevista";
import { entrevistaVirtualization } from "./performance/virtualization-entrevista";
import { entrevistaBundleSize } from "./performance/bundle-size-entrevista";
import { entrevistaCoreWebVitals } from "./performance/core-web-vitals-entrevista";
import { entrevistaSemanticHtmlAria } from "./accesibilidad/semantic-html-aria-entrevista";
import { entrevistaFocusManagement } from "./accesibilidad/focus-management-entrevista";
import { entrevistaNavegacionTeclado } from "./accesibilidad/navegacion-teclado-entrevista";
import { entrevistaFormulariosAccesibles } from "./accesibilidad/formularios-accesibles-entrevista";
import { entrevistaTestingAccesibilidad } from "./accesibilidad/testing-accesibilidad-entrevista";
import { entrevistaAppVsPagesRouter } from "./nextjs/app-vs-pages-router-entrevista";
import { entrevistaServerVsClientComponents } from "./nextjs/server-vs-client-components-entrevista";
import { entrevistaDataFetchingCaching } from "./nextjs/data-fetching-caching-entrevista";
import { entrevistaSsrSsgIsr } from "./nextjs/ssr-ssg-isr-entrevista";
import { entrevistaMiddlewareEdge } from "./nextjs/middleware-edge-entrevista";
import { entrevistaRouteHandlers } from "./nextjs/route-handlers-entrevista";
import { entrevistaFundamentosRed } from "./http/fundamentos-red-entrevista";
import { entrevistaMetodosStatus } from "./http/metodos-status-entrevista";
import { entrevistaHeadersCors } from "./http/headers-cors-entrevista";

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
  {
    categoriaSlug: "hooks",
    categoriaTitulo: "Hooks",
    moduloSlug: "custom-hooks",
    moduloTitulo: "Custom Hooks",
    preguntas: entrevistaCustomHooks,
  },
  {
    categoriaSlug: "estado",
    categoriaTitulo: "Estado",
    moduloSlug: "context",
    moduloTitulo: "Context (como estado global)",
    preguntas: entrevistaEstadoContext,
  },
  {
    categoriaSlug: "estado",
    categoriaTitulo: "Estado",
    moduloSlug: "zustand",
    moduloTitulo: "Zustand",
    preguntas: entrevistaZustand,
  },
  {
    categoriaSlug: "estado",
    categoriaTitulo: "Estado",
    moduloSlug: "redux-toolkit",
    moduloTitulo: "Redux Toolkit",
    preguntas: entrevistaReduxToolkit,
  },
  {
    categoriaSlug: "estado",
    categoriaTitulo: "Estado",
    moduloSlug: "tanstack-query",
    moduloTitulo: "TanStack Query",
    preguntas: entrevistaTanstackQuery,
  },
  {
    categoriaSlug: "estado",
    categoriaTitulo: "Estado",
    moduloSlug: "cuando-no-usar-estado-global",
    moduloTitulo: "Cuándo NO usar estado global",
    preguntas: entrevistaCuandoNoUsarEstadoGlobal,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "memoization",
    moduloTitulo: "Memoization",
    preguntas: entrevistaMemoization,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "lazy-loading",
    moduloTitulo: "Lazy Loading",
    preguntas: entrevistaLazyLoading,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "code-splitting",
    moduloTitulo: "Code Splitting",
    preguntas: entrevistaCodeSplitting,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "suspense",
    moduloTitulo: "Suspense",
    preguntas: entrevistaSuspense,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "virtualization",
    moduloTitulo: "Virtualization",
    preguntas: entrevistaVirtualization,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "bundle-size",
    moduloTitulo: "Bundle Size",
    preguntas: entrevistaBundleSize,
  },
  {
    categoriaSlug: "performance",
    categoriaTitulo: "Performance",
    moduloSlug: "core-web-vitals",
    moduloTitulo: "Core Web Vitals",
    preguntas: entrevistaCoreWebVitals,
  },
  {
    categoriaSlug: "accesibilidad",
    categoriaTitulo: "Accesibilidad",
    moduloSlug: "semantic-html-aria",
    moduloTitulo: "Semantic HTML & ARIA",
    preguntas: entrevistaSemanticHtmlAria,
  },
  {
    categoriaSlug: "accesibilidad",
    categoriaTitulo: "Accesibilidad",
    moduloSlug: "focus-management",
    moduloTitulo: "Focus management",
    preguntas: entrevistaFocusManagement,
  },
  {
    categoriaSlug: "accesibilidad",
    categoriaTitulo: "Accesibilidad",
    moduloSlug: "navegacion-teclado",
    moduloTitulo: "Navegación por teclado",
    preguntas: entrevistaNavegacionTeclado,
  },
  {
    categoriaSlug: "accesibilidad",
    categoriaTitulo: "Accesibilidad",
    moduloSlug: "formularios-accesibles",
    moduloTitulo: "Formularios accesibles",
    preguntas: entrevistaFormulariosAccesibles,
  },
  {
    categoriaSlug: "accesibilidad",
    categoriaTitulo: "Accesibilidad",
    moduloSlug: "testing-accesibilidad",
    moduloTitulo: "Testing de accesibilidad (axe)",
    preguntas: entrevistaTestingAccesibilidad,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "app-vs-pages-router",
    moduloTitulo: "App Router vs Pages Router",
    preguntas: entrevistaAppVsPagesRouter,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "server-vs-client-components",
    moduloTitulo: "Server Components vs Client Components",
    preguntas: entrevistaServerVsClientComponents,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "data-fetching-caching",
    moduloTitulo: "Data fetching & caching",
    preguntas: entrevistaDataFetchingCaching,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "ssr-ssg-isr",
    moduloTitulo: "SSR / SSG / ISR",
    preguntas: entrevistaSsrSsgIsr,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "middleware-edge",
    moduloTitulo: "Proxy (ex Middleware) & Edge runtime",
    preguntas: entrevistaMiddlewareEdge,
  },
  {
    categoriaSlug: "nextjs",
    categoriaTitulo: "Next.js",
    moduloSlug: "route-handlers",
    moduloTitulo: "Route handlers (API routes)",
    preguntas: entrevistaRouteHandlers,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "fundamentos-de-red",
    moduloTitulo: "Fundamentos de red",
    preguntas: entrevistaFundamentosRed,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "metodos-y-status-codes",
    moduloTitulo: "Métodos y status codes",
    preguntas: entrevistaMetodosStatus,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "headers-y-cors",
    moduloTitulo: "Headers y CORS",
    preguntas: entrevistaHeadersCors,
  },
];
