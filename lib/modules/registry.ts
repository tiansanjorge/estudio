import type { Categoria } from "./types";

export const categorias: Categoria[] = [
  {
    slug: "javascript-profundo",
    titulo: "JavaScript profundo",
    modulos: [
      { slug: "event-loop", titulo: "Event Loop", estado: "disponible" },
      { slug: "closures", titulo: "Closures", estado: "disponible" },
      { slug: "promises", titulo: "Promises", estado: "disponible" },
      { slug: "async", titulo: "Async", estado: "disponible" },
      { slug: "scope", titulo: "Scope", estado: "disponible" },
      { slug: "hoisting", titulo: "Hoisting", estado: "disponible" },
      { slug: "memory", titulo: "Memory", estado: "disponible" },
    ],
  },
  {
    slug: "react-core",
    titulo: "React Core",
    modulos: [
      { slug: "componentes", titulo: "Componentes", estado: "disponible" },
      { slug: "props", titulo: "Props", estado: "disponible" },
      { slug: "state", titulo: "State", estado: "disponible" },
      { slug: "composition", titulo: "Composition", estado: "disponible" },
      { slug: "keys", titulo: "Keys", estado: "disponible" },
      { slug: "context", titulo: "Context", estado: "disponible" },
      { slug: "forms", titulo: "Forms", estado: "disponible" },
    ],
  },
  {
    slug: "react-rendering",
    titulo: "React Rendering",
    modulos: [
      { slug: "render", titulo: "Render", estado: "disponible" },
      { slug: "commit", titulo: "Commit", estado: "disponible" },
      { slug: "reconciliation", titulo: "Reconciliation", estado: "disponible" },
      { slug: "fiber", titulo: "Fiber", estado: "disponible" },
      { slug: "virtual-dom", titulo: "Virtual DOM", estado: "disponible" },
      { slug: "concurrent-rendering", titulo: "Concurrent Rendering", estado: "disponible" },
      { slug: "hydration", titulo: "Hydration", estado: "disponible" },
    ],
  },
  {
    slug: "hooks",
    titulo: "Hooks",
    modulos: [
      { slug: "use-state", titulo: "useState", estado: "proximamente" },
      { slug: "use-effect", titulo: "useEffect", estado: "proximamente" },
      { slug: "use-memo", titulo: "useMemo", estado: "proximamente" },
      { slug: "use-callback", titulo: "useCallback", estado: "proximamente" },
      { slug: "use-ref", titulo: "useRef", estado: "proximamente" },
      { slug: "use-reducer", titulo: "useReducer", estado: "proximamente" },
      { slug: "custom-hooks", titulo: "Custom Hooks", estado: "proximamente" },
    ],
  },
  {
    slug: "performance",
    titulo: "Performance",
    modulos: [
      { slug: "memoization", titulo: "Memoization", estado: "proximamente" },
      { slug: "lazy-loading", titulo: "Lazy Loading", estado: "proximamente" },
      { slug: "code-splitting", titulo: "Code Splitting", estado: "proximamente" },
      { slug: "suspense", titulo: "Suspense", estado: "proximamente" },
      { slug: "virtualization", titulo: "Virtualization", estado: "proximamente" },
      { slug: "bundle-size", titulo: "Bundle Size", estado: "proximamente" },
    ],
  },
  { slug: "accesibilidad", titulo: "Accesibilidad", modulos: [] },
  { slug: "nextjs", titulo: "Next.js", modulos: [] },
  {
    slug: "http-networking",
    titulo: "HTTP y Networking",
    modulos: [
      { slug: "metodos-y-status-codes", titulo: "Métodos y status codes", estado: "disponible" },
      { slug: "headers-y-cors", titulo: "Headers y CORS", estado: "disponible" },
      { slug: "fetch-y-requests", titulo: "Fetch/XHR y manejo de requests", estado: "disponible" },
      { slug: "caching-http", titulo: "Caching HTTP", estado: "disponible" },
      { slug: "rest-graphql-websockets", titulo: "REST vs GraphQL vs WebSockets", estado: "disponible" },
      { slug: "http1-http2-http3", titulo: "HTTP/1.1 vs HTTP/2 vs HTTP/3", estado: "disponible" },
    ],
  },
  {
    slug: "estado",
    titulo: "Estado",
    modulos: [
      { slug: "context", titulo: "Context", estado: "proximamente" },
      { slug: "zustand", titulo: "Zustand", estado: "proximamente" },
      { slug: "redux-toolkit", titulo: "Redux Toolkit", estado: "proximamente" },
      { slug: "tanstack-query", titulo: "TanStack Query", estado: "proximamente" },
    ],
  },
  { slug: "typescript-avanzado", titulo: "TypeScript avanzado", modulos: [] },
  { slug: "testing", titulo: "Testing", modulos: [] },
  { slug: "arquitectura", titulo: "Arquitectura", modulos: [] },
  { slug: "seguridad", titulo: "Seguridad", modulos: [] },
  { slug: "backend", titulo: "Backend", modulos: [] },
  { slug: "devops", titulo: "DevOps", modulos: [] },
  { slug: "ia-aplicada", titulo: "IA aplicada al desarrollo", modulos: [] },
];

export function obtenerCategoria(slug: string): Categoria | undefined {
  return categorias.find((categoria) => categoria.slug === slug);
}

export function rutaModulo(categoriaSlug: string, moduloSlug: string): string {
  return `/modulos/${categoriaSlug}/${moduloSlug}`;
}
