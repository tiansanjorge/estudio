export type SistemaModulos = "cjs" | "esm";
export type MomentoDeUso = "duranteCiclo" | "enFuncionDiferida";

export interface ConfiguracionCircular {
  sistema: SistemaModulos;
  momento: MomentoDeUso;
}

export interface ResultadoCircular {
  valorVisto: string;
  explicacion: string;
  esError: boolean;
}

export function resolverImportCircular({ sistema, momento }: ConfiguracionCircular): ResultadoCircular {
  if (sistema === "cjs") {
    if (momento === "duranteCiclo") {
      return {
        valorVisto: "undefined (el exports de A todavía es {})",
        explicacion:
          "require() en CJS devuelve el objeto module.exports de A tal como está en ese instante: A quedó pausado en su propio require(), así que todavía no llegó a la línea que asigna el valor. Leerlo en el nivel superior da undefined. Ojo: si A después reemplaza module.exports por otro objeto (module.exports = {...}), B se queda para siempre con el objeto viejo.",
        esError: false,
      };
    }
    return {
      valorVisto: "el valor final asignado",
      explicacion:
        "B guardó una referencia al MISMO objeto exports de A (no una copia). Si la lectura ocurre dentro de una función que se llama después de que el ciclo terminó, A ya asignó exports.valor sobre ese objeto, y la función lee el valor correcto.",
      esError: false,
    };
  }

  if (momento === "duranteCiclo") {
    return {
      valorVisto: "ReferenceError (Temporal Dead Zone del binding)",
      explicacion:
        "Los named exports de ESM son live bindings, pero mientras el módulo exportador no ejecute la línea de asignación, ese binding está en su propia TDZ. Usarlo en el nivel superior durante el ciclo, antes de esa línea, lanza un error — no da undefined.",
      esError: true,
    };
  }
  return {
    valorVisto: "el valor final, actualizado en vivo",
    explicacion:
      "Como el binding es una referencia en vivo (no una copia), para cuando la función diferida se ejecuta, el módulo exportador ya completó su asignación y el binding ya refleja el valor correcto.",
    esError: false,
  };
}
