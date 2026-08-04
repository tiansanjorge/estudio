"use client";

import { useState } from "react";
import type { EscenarioReconciliation } from "@/lib/modules/react-rendering/reconciliation-escenarios";

interface ReconciliationSimuladorProps {
  escenarios: EscenarioReconciliation[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function ReconciliationSimulador({ escenarios }: ReconciliationSimuladorProps) {
  const [escenarioIndex, setEscenarioIndex] = useState(0);
  const [pasoIndex, setPasoIndex] = useState(0);

  const escenario = escenarios[escenarioIndex];
  const paso = escenario.pasos[pasoIndex];

  function cambiarEscenario(index: number) {
    setEscenarioIndex(index);
    setPasoIndex(0);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {escenarios.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => cambiarEscenario(index)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              index === escenarioIndex
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.titulo}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 rounded-xl border border-border bg-background p-6">
        <span className="font-mono text-lg text-foreground">&lt;{paso.tipoAnterior} /&gt;</span>
        <span className="text-muted-foreground">→</span>
        <span className="font-mono text-lg text-foreground">&lt;{paso.tipoNuevo} /&gt;</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-lg border px-3 py-1 text-xs font-medium ${
            paso.mismaInstancia
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          {paso.mismaInstancia ? "MISMA instancia" : "instancia DESTRUIDA + instancia NUEVA"}
        </span>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
          estado: {paso.estado}
        </span>
      </div>

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">{paso.descripcion}</p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPasoIndex((i) => Math.max(i - 1, 0))}
          disabled={pasoIndex === 0}
          className={botonBase}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setPasoIndex((i) => Math.min(i + 1, escenario.pasos.length - 1))}
          disabled={pasoIndex === escenario.pasos.length - 1}
          className={botonBase}
        >
          Siguiente
        </button>
        <button type="button" onClick={() => setPasoIndex(0)} className={botonBase}>
          Reiniciar
        </button>
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {escenario.pasos.length}
        </span>
      </div>
    </div>
  );
}
