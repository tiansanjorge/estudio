export const productosDemo: string[] = Array.from(
  { length: 8000 },
  (_, i) => `Producto ${i} — referencia ${(i * 37) % 9999}`,
);
