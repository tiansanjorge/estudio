export type TipoTest = "unit" | "integracion" | "e2e";

export interface TestEjemplo {
  tipo: TipoTest;
  titulo: string;
  herramientas: string;
  alcance: string;
  codigo: string;
}

export const TESTS: TestEjemplo[] = [
  {
    tipo: "unit",
    titulo: "Unit",
    herramientas: "Vitest / Jest",
    alcance: "Una función pura, sin DOM ni red.",
    codigo: `import { calcularTotal } from "./carrito";

it("aplica el cupón del 10% sobre el subtotal", () => {
  const items = [{ precio: 1000, cantidad: 2 }];
  expect(calcularTotal(items, { descuento: 0.1 })).toBe(1800);
});`,
  },
  {
    tipo: "integracion",
    titulo: "Integración",
    herramientas: "Testing Library + MSW (jsdom)",
    alcance: "Varios componentes juntos, con la red simulada.",
    codigo: `server.use(
  http.get("/api/carrito", () =>
    HttpResponse.json({ items: [{ precio: 1000, cantidad: 2 }] }),
  ),
);

it("muestra el total con el cupón aplicado", async () => {
  render(<PaginaCarrito />);
  await userEvent.type(screen.getByLabelText("Cupón"), "PROMO10");
  await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));
  expect(await screen.findByText("Total: $1.800")).toBeInTheDocument();
});`,
  },
  {
    tipo: "e2e",
    titulo: "E2E",
    herramientas: "Playwright (navegador real)",
    alcance: "La app desplegada completa: front, API, base.",
    codigo: `test("aplicar un cupón en el carrito", async ({ page }) => {
  await page.goto("/productos/teclado");
  await page.getByRole("button", { name: "Agregar al carrito" }).click();
  await page.goto("/carrito");
  await page.getByLabel("Cupón").fill("PROMO10");
  await page.getByRole("button", { name: "Aplicar" }).click();
  await expect(page.getByText("Total: $1.800")).toBeVisible();
});`,
  },
];

export interface BugEjemplo {
  id: string;
  descripcion: string;
  detecta: Record<TipoTest, boolean>;
  explicacion: string;
}

export const BUGS: BugEjemplo[] = [
  {
    id: "logica",
    descripcion: "El descuento se aplica dos veces",
    detecta: { unit: true, integracion: true, e2e: true },
    explicacion:
      "Los tres lo ven, pero el unit lo señala en milisegundos y apunta a la función exacta.",
  },
  {
    id: "borde",
    descripcion: "Redondeo incorrecto con precios de $0,005",
    detecta: { unit: true, integracion: false, e2e: false },
    explicacion:
      "Los casos borde son baratos de cubrir en unit (decenas de casos en un test). Nadie escribe un e2e por cada uno.",
  },
  {
    id: "handler",
    descripcion: "El botón “Aplicar” quedó sin onClick tras un refactor",
    detecta: { unit: false, integracion: true, e2e: true },
    explicacion:
      "La función de cálculo está bien; lo roto es la conexión entre componentes, que el unit no ejercita.",
  },
  {
    id: "contrato",
    descripcion: "La API renombró “precio” a “price”",
    detecta: { unit: false, integracion: false, e2e: true },
    explicacion:
      "El mock de MSW sigue devolviendo la forma vieja, así que el test de integración pasa. Solo la API real lo revela (o un contract test).",
  },
  {
    id: "layout",
    descripcion: "Un banner de cookies tapa el botón en mobile",
    detecta: { unit: false, integracion: false, e2e: true },
    explicacion:
      "jsdom no calcula layout ni superposiciones; un navegador real no puede hacer click en un elemento tapado.",
  },
];
