"use client";

import { useState } from "react";
import type { PasoConcurrente } from "@/lib/modules/react-rendering/concurrent-escenarios";

interface ConcurrentSimuladorProps {
  pasos: PasoConcurrente[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function ConcurrentSimulador({ pasos }: ConcurrentSimuladorProps) {
  const [pasoIndex, setPasoIndex] = useState(0);
  const paso = pasos[pasoIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-xl border border-accent/30 bg-accent-soft p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-accent">
            Input (urgente)
          </span>
          <span className="font-mono text-xl text-accent">{paso.queryInput || "—"}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Lista renderizada (transición)
          </span>
          <span className="font-mono text-xl text-foreground">{paso.queryLista || "—"}</span>
        </div>
      </div>

      <span
        className={`w-fit rounded-lg border px-3 py-1 text-xs font-medium ${
          paso.transicionPendiente
            ? "border-warning/30 bg-warning-soft text-warning"
            : "border-success/30 bg-success-soft text-success"
        }`}
      >
        {paso.transicionPendiente ? "isPending: true" : "isPending: false"}
      </span>

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
          onClick={() => setPasoIndex((i) => Math.min(i + 1, pasos.length - 1))}
          disabled={pasoIndex === pasos.length - 1}
          className={botonBase}
        >
          Siguiente
        </button>
        <button type="button" onClick={() => setPasoIndex(0)} className={botonBase}>
          Reiniciar
        </button>
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {pasos.length}
        </span>
      </div>
    </div>
  );
}
