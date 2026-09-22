"use client";

import { useState } from "react";
import {
  resolverImportCircular,
  type ConfiguracionCircular,
  type SistemaModulos,
  type MomentoDeUso,
} from "@/lib/modules/modulos-esm-cjs/resolver";

export function ImportCircularResolver() {
  const [config, setConfig] = useState<ConfiguracionCircular>({
    sistema: "cjs",
    momento: "duranteCiclo",
  });

  const resultado = resolverImportCircular(config);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Módulo A y módulo B se requieren/importan mutuamente. B necesita un
        valor exportado por A. Elegí el sistema de módulos y cuándo se usa
        ese valor.
      </p>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sistema de módulos
        </span>
        <div className="inline-flex w-fit rounded-xl border border-border p-1">
          {(["cjs", "esm"] as SistemaModulos[]).map((sistema) => (
            <button
              key={sistema}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, sistema }))}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                config.sistema === sistema
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sistema === "cjs" ? "CommonJS (require)" : "ESM (import)"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cuándo se usa el valor importado
        </span>
        <div className="inline-flex w-fit rounded-xl border border-border p-1">
          {(
            [
              { clave: "duranteCiclo", etiqueta: "Durante el ciclo (nivel superior)" },
              { clave: "enFuncionDiferida", etiqueta: "Dentro de una función, después" },
            ] as { clave: MomentoDeUso; etiqueta: string }[]
          ).map((opcion) => (
            <button
              key={opcion.clave}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, momento: opcion.clave }))}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                config.momento === opcion.clave
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opcion.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Qué ve el módulo B
        </span>
        <p className="text-sm leading-6 text-muted-foreground">{resultado.explicacion}</p>
      </div>

      <span
        className={`w-fit rounded-lg border px-3 py-2 text-sm font-medium ${
          resultado.esError
            ? "border-error/30 bg-error-soft text-error"
            : "border-success/30 bg-success-soft text-success"
        }`}
      >
        Valor visto: {resultado.valorVisto}
      </span>
    </div>
  );
}
