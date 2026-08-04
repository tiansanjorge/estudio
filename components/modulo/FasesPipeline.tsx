"use client";

import { useState } from "react";
import type { Fase, PasoFase } from "@/lib/modules/react-rendering/fases";

interface FasesPipelineProps {
  pasos: PasoFase[];
}

const etapas: { valor: Fase; etiqueta: string }[] = [
  { valor: "trigger", etiqueta: "Trigger" },
  { valor: "render", etiqueta: "Render" },
  { valor: "reconciliation", etiqueta: "Reconciliation" },
  { valor: "commit", etiqueta: "Commit" },
];

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function FasesPipeline({ pasos }: FasesPipelineProps) {
  const [pasoIndex, setPasoIndex] = useState(0);
  const paso = pasos[pasoIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {etapas.map((etapa) => {
          const activa = etapa.valor === paso.faseActiva;
          return (
            <div
              key={etapa.valor}
              className={`rounded-xl border p-3 text-center transition-colors ${
                activa
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              <span className="font-mono text-sm font-semibold">{etapa.etiqueta}</span>
            </div>
          );
        })}
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
