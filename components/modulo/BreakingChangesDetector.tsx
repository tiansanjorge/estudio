"use client";

import { useState } from "react";
import { CAMBIOS, CONTRATO_BASE, evaluar } from "@/lib/modules/arquitectura/contratos-api";

export function BreakingChangesDetector() {
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  const { rompe, elegidos, recomendacion } = evaluar(seleccionados);

  function alternar(id: string) {
    setSeleccionados((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Contrato actual (openapi.yaml, recortado)</span>
        <pre className="max-h-[28rem] overflow-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
          {CONTRATO_BASE}
        </pre>
      </div>

      <div className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium text-foreground">Cambios propuestos</legend>
          {CAMBIOS.map((c) => {
            const activo = seleccionados.has(c.id);
            return (
              <label
                key={c.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 text-xs transition-colors ${
                  activo
                    ? c.breaking
                      ? "border-error/30 bg-error-soft"
                      : "border-success/30 bg-success-soft"
                    : "border-border bg-surface"
                }`}
              >
                <span className="flex items-start gap-2 text-foreground">
                  <input type="checkbox" checked={activo} onChange={() => alternar(c.id)} className="mt-0.5 accent-accent" />
                  {c.descripcion}
                </span>
                {activo && (
                  <span className={`pl-6 ${c.breaking ? "text-error" : "text-success"}`}>
                    {c.breaking ? "Breaking: " : "Compatible: "}
                    <span className="text-foreground">{c.razon}</span>
                  </span>
                )}
              </label>
            );
          })}
        </fieldset>

        <p
          className={`rounded-xl border px-3 py-2 text-sm text-foreground ${
            elegidos.length === 0
              ? "border-border bg-surface"
              : rompe.length === 0
                ? "border-success/30 bg-success-soft"
                : "border-warning/30 bg-warning-soft"
          }`}
          aria-live="polite"
        >
          {recomendacion}
        </p>
      </div>
    </div>
  );
}
