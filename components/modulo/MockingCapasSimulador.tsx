"use client";

import { useState } from "react";
import { CAPAS, ESTRATEGIAS, capaEsReal } from "@/lib/modules/testing/mocking-msw";

export function MockingCapasSimulador() {
  const [estrategiaId, setEstrategiaId] = useState("msw");
  const estrategia = ESTRATEGIAS.find((e) => e.id === estrategiaId) ?? ESTRATEGIAS[0];
  const reales = CAPAS.filter((c) => capaEsReal(c.id, estrategia)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Estrategia de mocking">
        {ESTRATEGIAS.map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={e.id === estrategiaId}
            onClick={() => setEstrategiaId(e.id)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
              e.id === estrategiaId
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ol className="flex flex-col gap-1.5" aria-label="Capas que atraviesa el request">
          {CAPAS.map((capa) => {
            const real = capaEsReal(capa.id, estrategia);
            const esCorte = capa.id === estrategia.cortaEn;
            return (
              <li key={capa.id} className="flex flex-col gap-1.5">
                {esCorte && (
                  <span className="font-mono text-[11px] text-warning">
                    ✂ acá se reemplaza por el mock
                  </span>
                )}
                <div
                  className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors ${
                    real
                      ? "border-success/30 bg-success-soft"
                      : "border-dashed border-border bg-background opacity-60"
                  }`}
                >
                  <span className="font-mono text-xs text-foreground">{capa.nombre}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {real ? "real" : "no se ejecuta"} · {capa.detalle}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-3">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground">
            {estrategia.codigo}
          </pre>
          <p className="font-mono text-xs text-foreground">
            Código real ejercitado: {reales} de {CAPAS.length} capas
          </p>
          <p className="rounded-xl border border-success/30 bg-success-soft px-3 py-2 text-xs text-foreground">
            <span className="font-medium text-success">Ventaja: </span>
            {estrategia.ventaja}
          </p>
          <p className="rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-foreground">
            <span className="font-medium text-warning">Riesgo: </span>
            {estrategia.riesgo}
          </p>
        </div>
      </div>
    </div>
  );
}
