export type ResultadoHoisting = "undefined" | "referenceerror" | "funciona";

export interface CasoHoisting {
  clave: string;
  codigo: string;
  resultado: ResultadoHoisting;
  explicacion: string;
}

export const casosHoisting: CasoHoisting[] = [
  {
    clave: "var-valor",
    codigo: "var x = 5;",
    resultado: "undefined",
    explicacion:
      "var se hoistea con valor undefined hasta que se ejecuta la línea de asignación.",
  },
  {
    clave: "let-valor",
    codigo: "let x = 5;",
    resultado: "referenceerror",
    explicacion:
      "let se hoistea, pero queda en la Temporal Dead Zone: no se puede leer antes de esta línea.",
  },
  {
    clave: "const-valor",
    codigo: "const x = 5;",
    resultado: "referenceerror",
    explicacion: "Igual que let: const también queda en la TDZ hasta su línea de declaración.",
  },
  {
    clave: "function-declaracion",
    codigo: "function x() {}",
    resultado: "funciona",
    explicacion:
      "Las function declarations se hoistean COMPLETAS, con su cuerpo incluido. Se pueden llamar antes de la línea donde están escritas.",
  },
  {
    clave: "var-function-expression",
    codigo: "var x = function () {};",
    resultado: "undefined",
    explicacion:
      "Acá x es una variable var normal: se hoistea como undefined. La función recién se asigna cuando se ejecuta esta línea.",
  },
  {
    clave: "let-arrow-function",
    codigo: "let x = () => {};",
    resultado: "referenceerror",
    explicacion:
      "x es una variable let: queda en la TDZ igual que cualquier otra let, sin importar que el valor sea una función.",
  },
];
