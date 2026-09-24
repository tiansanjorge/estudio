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
import { entrevistaFetchRequests } from "./http/fetch-requests-entrevista";
import { entrevistaCachingHttp } from "./http/caching-http-entrevista";
import { entrevistaRestGraphqlWebsockets } from "./http/rest-graphql-websockets-entrevista";
import { entrevistaHttpVersiones } from "./http/http-versiones-entrevista";
import { entrevistaPiramideTesting } from "./testing/piramide-testing-entrevista";
import { entrevistaUnitIntegrationE2e } from "./testing/unit-integration-e2e-entrevista";
import { entrevistaMockingMsw } from "./testing/mocking-msw-entrevista";
import { entrevistaTdd } from "./testing/tdd-entrevista";
import { entrevistaTestingComponentesRtl } from "./testing/testing-componentes-rtl-entrevista";
import { entrevistaTestingApis } from "./testing/testing-apis-entrevista";
import { entrevistaMonolitoMicroservicios } from "./arquitectura/monolito-microservicios-entrevista";
import { entrevistaCleanHexagonal } from "./arquitectura/clean-hexagonal-entrevista";
import { entrevistaDesignPatterns } from "./arquitectura/design-patterns-entrevista";
import { entrevistaEstructuraCarpetas } from "./arquitectura/estructura-carpetas-entrevista";
import { entrevistaContratosApi } from "./arquitectura/contratos-api-entrevista";
import { entrevistaEventDriven } from "./arquitectura/event-driven-entrevista";
import { entrevistaAuthnAuthz } from "./seguridad/authn-authz-entrevista";
import { entrevistaJwtSesiones } from "./seguridad/jwt-sesiones-entrevista";
import { entrevistaOwaspTop10 } from "./seguridad/owasp-top-10-entrevista";
import { entrevistaCorsCsrfXss } from "./seguridad/cors-csrf-xss-entrevista";
import { entrevistaRbacAbac } from "./seguridad/rbac-abac-entrevista";
import { entrevistaSecretsManagement } from "./seguridad/secrets-management-entrevista";
import { entrevistaNodejsRuntime } from "./backend/nodejs-runtime-entrevista";
import { entrevistaDisenoApisRest } from "./backend/diseno-apis-rest-entrevista";
import { entrevistaFrameworksNode } from "./backend/frameworks-node-entrevista";
import { entrevistaValidacionZod } from "./backend/validacion-zod-entrevista";
import { entrevistaErroresLogging } from "./backend/errores-logging-entrevista";
import { entrevistaRateLimiting } from "./backend/rate-limiting-entrevista";
import { entrevistaWebsocketsTiempoReal } from "./backend/websockets-tiempo-real-entrevista";
import { entrevistaColasJobs } from "./backend/colas-jobs-entrevista";
import { entrevistaArquitecturaCapas } from "./backend/arquitectura-capas-entrevista";
import { entrevistaSqlVsNosql } from "./bases-de-datos/sql-vs-nosql-entrevista";
import { entrevistaModeladoNormalizacion } from "./bases-de-datos/modelado-normalizacion-entrevista";
import { entrevistaIndicesPerformance } from "./bases-de-datos/indices-performance-entrevista";
import { entrevistaTransaccionesAcid } from "./bases-de-datos/transacciones-acid-entrevista";
import { entrevistaPrismaOrm } from "./bases-de-datos/prisma-orm-entrevista";
import { entrevistaMigraciones } from "./bases-de-datos/migraciones-entrevista";
import { entrevistaPostgresEspecifico } from "./bases-de-datos/postgres-especifico-entrevista";
import { entrevistaRedisCaching } from "./bases-de-datos/redis-caching-entrevista";
import { entrevistaEscalabilidadDb } from "./bases-de-datos/escalabilidad-db-entrevista";
import { entrevistaPipelinesGithubActions } from "./ci-cd/pipelines-github-actions-entrevista";
import { entrevistaEstrategiasDeploy } from "./ci-cd/estrategias-deploy-entrevista";
import { entrevistaDocker } from "./ci-cd/docker-entrevista";
import { entrevistaVariablesSecretosCi } from "./ci-cd/variables-secretos-ci-entrevista";
import { entrevistaObservabilidad } from "./ci-cd/observabilidad-entrevista";
import { entrevistaFeatureFlags } from "./ci-cd/feature-flags-entrevista";
import { entrevistaResponsabilidadCompartida } from "./cloud/responsabilidad-compartida-entrevista";
import { entrevistaComputo } from "./cloud/computo-entrevista";
import { entrevistaAwsBasico } from "./cloud/aws-basico-entrevista";
import { entrevistaRedesBasicas } from "./cloud/redes-basicas-entrevista";
import { entrevistaCostoEscalabilidad } from "./cloud/costo-escalabilidad-entrevista";
import { entrevistaVercelVsAws } from "./cloud/vercel-vs-aws-entrevista";
import { entrevistaCapConsistencia } from "./system-design/cap-consistencia-entrevista";
import { entrevistaEstrategiasCaching } from "./system-design/estrategias-caching-entrevista";
import { entrevistaLoadBalancing } from "./system-design/load-balancing-entrevista";
import { entrevistaColasPubSub } from "./system-design/colas-pub-sub-entrevista";

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
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "fetch-y-requests",
    moduloTitulo: "Fetch/XHR y manejo de requests",
    preguntas: entrevistaFetchRequests,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "caching-http",
    moduloTitulo: "Caching HTTP",
    preguntas: entrevistaCachingHttp,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "rest-graphql-websockets",
    moduloTitulo: "REST vs GraphQL vs WebSockets",
    preguntas: entrevistaRestGraphqlWebsockets,
  },
  {
    categoriaSlug: "http-networking",
    categoriaTitulo: "HTTP y Networking",
    moduloSlug: "http1-http2-http3",
    moduloTitulo: "HTTP/1.1 vs HTTP/2 vs HTTP/3",
    preguntas: entrevistaHttpVersiones,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "piramide-testing",
    moduloTitulo: "Pirámide de testing",
    preguntas: entrevistaPiramideTesting,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "unit-integration-e2e",
    moduloTitulo: "Unit vs integration vs e2e",
    preguntas: entrevistaUnitIntegrationE2e,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "mocking-msw",
    moduloTitulo: "Mocking strategies (MSW)",
    preguntas: entrevistaMockingMsw,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "tdd",
    moduloTitulo: "TDD",
    preguntas: entrevistaTdd,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "testing-componentes-rtl",
    moduloTitulo: "Testing de componentes React (RTL)",
    preguntas: entrevistaTestingComponentesRtl,
  },
  {
    categoriaSlug: "testing",
    categoriaTitulo: "Testing",
    moduloSlug: "testing-apis",
    moduloTitulo: "Testing de APIs",
    preguntas: entrevistaTestingApis,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "monolito-microservicios",
    moduloTitulo: "Monolito vs microservicios vs microfrontends",
    preguntas: entrevistaMonolitoMicroservicios,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "clean-hexagonal",
    moduloTitulo: "Clean / Hexagonal architecture",
    preguntas: entrevistaCleanHexagonal,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "design-patterns",
    moduloTitulo: "Design patterns comunes",
    preguntas: entrevistaDesignPatterns,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "estructura-carpetas",
    moduloTitulo: "Feature-based vs layer-based",
    preguntas: entrevistaEstructuraCarpetas,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "contratos-api",
    moduloTitulo: "Contratos de API (OpenAPI)",
    preguntas: entrevistaContratosApi,
  },
  {
    categoriaSlug: "arquitectura",
    categoriaTitulo: "Arquitectura",
    moduloSlug: "event-driven",
    moduloTitulo: "Event-driven architecture",
    preguntas: entrevistaEventDriven,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "authn-authz",
    moduloTitulo: "AuthN vs AuthZ",
    preguntas: entrevistaAuthnAuthz,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "jwt-sesiones",
    moduloTitulo: "JWT & sesiones",
    preguntas: entrevistaJwtSesiones,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "owasp-top-10",
    moduloTitulo: "OWASP Top 10 esencial",
    preguntas: entrevistaOwaspTop10,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "cors-csrf-xss",
    moduloTitulo: "CORS / CSRF / XSS",
    preguntas: entrevistaCorsCsrfXss,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "rbac-abac",
    moduloTitulo: "RBAC / ABAC",
    preguntas: entrevistaRbacAbac,
  },
  {
    categoriaSlug: "seguridad",
    categoriaTitulo: "Seguridad",
    moduloSlug: "secrets-management",
    moduloTitulo: "Secrets management",
    preguntas: entrevistaSecretsManagement,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "nodejs-runtime",
    moduloTitulo: "Node.js runtime",
    preguntas: entrevistaNodejsRuntime,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "diseno-apis-rest",
    moduloTitulo: "Diseño de APIs REST",
    preguntas: entrevistaDisenoApisRest,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "frameworks-node",
    moduloTitulo: "Fastify / Express / NestJS",
    preguntas: entrevistaFrameworksNode,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "validacion-zod",
    moduloTitulo: "Validación de datos (Zod)",
    preguntas: entrevistaValidacionZod,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "errores-logging",
    moduloTitulo: "Manejo de errores y logging",
    preguntas: entrevistaErroresLogging,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "rate-limiting",
    moduloTitulo: "Rate limiting",
    preguntas: entrevistaRateLimiting,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "websockets-tiempo-real",
    moduloTitulo: "WebSockets / tiempo real",
    preguntas: entrevistaWebsocketsTiempoReal,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "colas-jobs",
    moduloTitulo: "Colas y jobs asíncronos (BullMQ)",
    preguntas: entrevistaColasJobs,
  },
  {
    categoriaSlug: "backend",
    categoriaTitulo: "Backend",
    moduloSlug: "arquitectura-capas",
    moduloTitulo: "Arquitectura en capas",
    preguntas: entrevistaArquitecturaCapas,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "sql-vs-nosql",
    moduloTitulo: "SQL vs NoSQL",
    preguntas: entrevistaSqlVsNosql,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "modelado-normalizacion",
    moduloTitulo: "Modelado relacional & normalización",
    preguntas: entrevistaModeladoNormalizacion,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "indices-performance",
    moduloTitulo: "Índices y query performance",
    preguntas: entrevistaIndicesPerformance,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "transacciones-acid",
    moduloTitulo: "Transacciones & ACID",
    preguntas: entrevistaTransaccionesAcid,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "prisma-orm",
    moduloTitulo: "Prisma / ORM — trade-offs",
    preguntas: entrevistaPrismaOrm,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "migraciones",
    moduloTitulo: "Migraciones",
    preguntas: entrevistaMigraciones,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "postgres-especifico",
    moduloTitulo: "Postgres: constraints y JSONB",
    preguntas: entrevistaPostgresEspecifico,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "redis-caching",
    moduloTitulo: "Redis / caching",
    preguntas: entrevistaRedisCaching,
  },
  {
    categoriaSlug: "bases-de-datos",
    categoriaTitulo: "Bases de datos",
    moduloSlug: "escalabilidad-db",
    moduloTitulo: "Réplicas y sharding",
    preguntas: entrevistaEscalabilidadDb,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "pipelines-github-actions",
    moduloTitulo: "Pipelines (GitHub Actions)",
    preguntas: entrevistaPipelinesGithubActions,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "estrategias-deploy",
    moduloTitulo: "Estrategias de deploy",
    preguntas: entrevistaEstrategiasDeploy,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "docker",
    moduloTitulo: "Docker (nociones)",
    preguntas: entrevistaDocker,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "variables-secretos-ci",
    moduloTitulo: "Variables y secretos en CI",
    preguntas: entrevistaVariablesSecretosCi,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "observabilidad",
    moduloTitulo: "Observabilidad",
    preguntas: entrevistaObservabilidad,
  },
  {
    categoriaSlug: "ci-cd",
    categoriaTitulo: "CI/CD",
    moduloSlug: "feature-flags",
    moduloTitulo: "Feature flags",
    preguntas: entrevistaFeatureFlags,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "responsabilidad-compartida",
    moduloTitulo: "Modelo de responsabilidad compartida",
    preguntas: entrevistaResponsabilidadCompartida,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "computo",
    moduloTitulo: "Cómputo: VMs vs contenedores vs serverless",
    preguntas: entrevistaComputo,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "aws-basico",
    moduloTitulo: "AWS básico (EC2, S3, Lambda, RDS)",
    preguntas: entrevistaAwsBasico,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "redes-basicas",
    moduloTitulo: "Redes básicas (VPC, load balancer, CDN)",
    preguntas: entrevistaRedesBasicas,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "costo-escalabilidad",
    moduloTitulo: "Trade-offs de costo/escalabilidad",
    preguntas: entrevistaCostoEscalabilidad,
  },
  {
    categoriaSlug: "cloud",
    categoriaTitulo: "Cloud",
    moduloSlug: "vercel-vs-aws",
    moduloTitulo: "Vercel/Netlify vs AWS",
    preguntas: entrevistaVercelVsAws,
  },
  {
    categoriaSlug: "system-design",
    categoriaTitulo: "System Design",
    moduloSlug: "cap-consistencia",
    moduloTitulo: "CAP theorem, consistencia vs disponibilidad",
    preguntas: entrevistaCapConsistencia,
  },
  {
    categoriaSlug: "system-design",
    categoriaTitulo: "System Design",
    moduloSlug: "estrategias-caching",
    moduloTitulo: "Estrategias de caching",
    preguntas: entrevistaEstrategiasCaching,
  },
  {
    categoriaSlug: "system-design",
    categoriaTitulo: "System Design",
    moduloSlug: "load-balancing-escalado",
    moduloTitulo: "Load balancing y escalado horizontal vs vertical",
    preguntas: entrevistaLoadBalancing,
  },
  {
    categoriaSlug: "system-design",
    categoriaTitulo: "System Design",
    moduloSlug: "colas-pub-sub",
    moduloTitulo: "Colas de mensajes / pub-sub (Kafka, SQS)",
    preguntas: entrevistaColasPubSub,
  },
];
