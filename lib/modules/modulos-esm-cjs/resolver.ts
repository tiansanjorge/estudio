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
        valorVisto: "{} (objeto vacío / incompleto)",
        explicacion:
          "require() en CJS devuelve una COPIA del estado de module.exports en el momento exacto de la llamada. Si el módulo exportador todavía no llegó a la línea que asigna el valor, lo que se recibe es el exports parcial de ese instante — no se actualiza después.",
        esError: false,
      };
    }
    return {
      valorVisto: "el valor final asignado",
      explicacion:
        "Si el uso ocurre dentro de una función que se llama DESPUÉS de que el ciclo de carga terminó, para ese momento module.exports ya tiene la asignación completa — la función lee el valor correcto porque ya pasó el punto de asignación.",
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
