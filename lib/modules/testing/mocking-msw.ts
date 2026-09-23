export const CAPAS = [
  { id: "componente", nombre: "<ListaProductos />", detalle: "Renderiza, maneja loading y error" },
  { id: "hook", nombre: "useProductos()", detalle: "Estado, cache, reintentos" },
  { id: "cliente", nombre: "apiClient.get()", detalle: "Headers, auth, parseo de errores" },
  { id: "fetch", nombre: "fetch()", detalle: "API del navegador / Node" },
  { id: "red", nombre: "Red HTTP", detalle: "Request y response reales" },
  { id: "servidor", nombre: "API real", detalle: "Backend, base de datos" },
] as const;

export type CapaId = (typeof CAPAS)[number]["id"];

export interface Estrategia {
  id: string;
  nombre: string;
  /** Primera capa que se reemplaza: todo lo que está arriba corre real. */
  cortaEn: CapaId | null;
  codigo: string;
  ventaja: string;
  riesgo: string;
}

export const ESTRATEGIAS: Estrategia[] = [
  {
    id: "mock-hook",
    nombre: "vi.mock del hook",
    cortaEn: "hook",
    codigo: `vi.mock("./useProductos", () => ({
  useProductos: () => ({ data: [{ id: 1, nombre: "Teclado" }], isLoading: false }),
}));`,
    ventaja: "Simplísimo para probar solo cómo se ve el componente con ciertos datos.",
    riesgo:
      "No prueba el hook, ni el cliente, ni el manejo real de loading y error. Si el hook cambia su forma de retorno, el test sigue pasando.",
  },
  {
    id: "mock-cliente",
    nombre: "vi.mock del apiClient",
    cortaEn: "cliente",
    codigo: `vi.mock("@/lib/apiClient", () => ({
  apiClient: { get: vi.fn().mockResolvedValue([{ id: 1, nombre: "Teclado" }]) },
}));`,
    ventaja: "Ejercita el componente y el hook reales.",
    riesgo:
      "El test queda atado a la firma interna del cliente (qué método, qué argumentos). Refactorizar el cliente rompe tests sin cambiar el comportamiento.",
  },
  {
    id: "spy-fetch",
    nombre: "vi.spyOn(globalThis, 'fetch')",
    cortaEn: "fetch",
    codigo: `vi.spyOn(globalThis, "fetch").mockResolvedValue(
  new Response(JSON.stringify([{ id: 1, nombre: "Teclado" }])),
);`,
    ventaja: "Todo tu código corre real, incluido el apiClient.",
    riesgo:
      "Hay que imitar a mano objetos Response, y no distingue URLs ni métodos sin lógica extra. Si pasás de fetch a otra librería (axios), el mock deja de aplicar.",
  },
  {
    id: "msw",
    nombre: "MSW (interceptar la red)",
    cortaEn: "red",
    codigo: `const server = setupServer(
  http.get("/api/productos", () =>
    HttpResponse.json([{ id: 1, nombre: "Teclado" }]),
  ),
);`,
    ventaja:
      "Tu código hace requests HTTP de verdad y MSW responde a nivel de red: no importa si usás fetch, axios o React Query. Los mismos handlers sirven en tests, en Storybook y en desarrollo.",
    riesgo:
      "Sigue siendo una suposición sobre la API: si el backend cambia el contrato, los handlers quedan viejos (se mitiga con tipos generados o contract tests).",
  },
  {
    id: "real",
    nombre: "Sin mocks (API real)",
    cortaEn: null,
    codigo: `// e2e: el test habla con la API desplegada
await page.goto("/productos");`,
    ventaja: "Máxima confianza: verifica también el contrato y el backend.",
    riesgo:
      "Lento, depende de datos y de que el backend esté arriba, y no permite forzar casos como un 500 o una respuesta lenta con facilidad.",
  },
];

export function capaEsReal(capa: CapaId, estrategia: Estrategia): boolean {
  if (estrategia.cortaEn === null) return true;
  const indiceCorte = CAPAS.findIndex((c) => c.id === estrategia.cortaEn);
  const indiceCapa = CAPAS.findIndex((c) => c.id === capa);
  return indiceCapa < indiceCorte;
}
