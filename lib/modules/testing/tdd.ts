export type Fase = "red" | "green" | "refactor";

export interface EstadoTest {
  nombre: string;
  pasa: boolean;
}

export interface PasoKata {
  fase: Fase;
  titulo: string;
  explicacion: string;
  codigo: string;
  tests: EstadoTest[];
}

const T1 = "envío gratis desde $50.000";
const T2 = "cobra $3.000 por debajo de $50.000";
const T3 = "la zona sur cobra $5.000";
const T4 = "rechaza subtotales negativos";

export const KATA: PasoKata[] = [
  {
    fase: "red",
    titulo: "Primer test: el caso más simple",
    explicacion:
      "Se escribe el test antes que el código. Falla porque la función ni existe: eso confirma que el test puede fallar.",
    codigo: `it("${T1}", () => {
  expect(costoEnvio(60000, "centro")).toBe(0);
});`,
    tests: [{ nombre: T1, pasa: false }],
  },
  {
    fase: "green",
    titulo: "La implementación mínima",
    explicacion:
      "Lo mínimo para pasar, aunque parezca trampa. El próximo test va a forzar la lógica real: así cada línea existe porque un test la pidió.",
    codigo: `function costoEnvio(subtotal: number, zona: string) {
  return 0;
}`,
    tests: [{ nombre: T1, pasa: true }],
  },
  {
    fase: "red",
    titulo: "Un test que obliga a generalizar",
    explicacion: "Ahora el `return 0` no alcanza.",
    codigo: `it("${T2}", () => {
  expect(costoEnvio(20000, "centro")).toBe(3000);
});`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: false },
    ],
  },
  {
    fase: "green",
    titulo: "Aparece la regla",
    explicacion: "El umbral surge de los dos tests, no de adivinar el diseño de antemano.",
    codigo: `function costoEnvio(subtotal: number, zona: string) {
  if (subtotal >= 50000) return 0;
  return 3000;
}`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
    ],
  },
  {
    fase: "red",
    titulo: "Nuevo requisito: zonas",
    explicacion: "El test documenta el requisito de negocio antes de tocar el código.",
    codigo: `it("${T3}", () => {
  expect(costoEnvio(20000, "sur")).toBe(5000);
});`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
      { nombre: T3, pasa: false },
    ],
  },
  {
    fase: "green",
    titulo: "Pasar rápido, aunque quede feo",
    explicacion: "Un if más. La prioridad de esta fase es volver a verde, no el diseño.",
    codigo: `function costoEnvio(subtotal: number, zona: string) {
  if (subtotal >= 50000) return 0;
  if (zona === "sur") return 5000;
  return 3000;
}`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
      { nombre: T3, pasa: true },
    ],
  },
  {
    fase: "refactor",
    titulo: "Refactor con red de seguridad",
    explicacion:
      "Con todo en verde se mejora el diseño: una tabla de tarifas en vez de ifs. Si algo se rompe, los tests lo dicen enseguida.",
    codigo: `const TARIFAS: Record<string, number> = { centro: 3000, sur: 5000 };
const UMBRAL_GRATIS = 50000;

function costoEnvio(subtotal: number, zona: string) {
  if (subtotal >= UMBRAL_GRATIS) return 0;
  return TARIFAS[zona] ?? TARIFAS.centro;
}`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
      { nombre: T3, pasa: true },
    ],
  },
  {
    fase: "red",
    titulo: "Un caso borde",
    explicacion: "Los casos borde también se agregan como test primero.",
    codigo: `it("${T4}", () => {
  expect(() => costoEnvio(-1, "centro")).toThrow("Subtotal inválido");
});`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
      { nombre: T3, pasa: true },
      { nombre: T4, pasa: false },
    ],
  },
  {
    fase: "green",
    titulo: "Verde de nuevo",
    explicacion:
      "Cuatro tests que describen el comportamiento completo, y un código que no tiene nada que no haya pedido un test.",
    codigo: `function costoEnvio(subtotal: number, zona: string) {
  if (subtotal < 0) throw new Error("Subtotal inválido");
  if (subtotal >= UMBRAL_GRATIS) return 0;
  return TARIFAS[zona] ?? TARIFAS.centro;
}`,
    tests: [
      { nombre: T1, pasa: true },
      { nombre: T2, pasa: true },
      { nombre: T3, pasa: true },
      { nombre: T4, pasa: true },
    ],
  },
];
