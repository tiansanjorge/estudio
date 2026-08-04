"use client";

import { useState } from "react";
import type { FaseCommit, PasoCommit } from "@/lib/modules/react-rendering/commit-escenarios";

interface CommitPipelineProps {
  pasos: PasoCommit[];
}

const etapas: { valor: FaseCommit; etiqueta: string }[] = [
  { valor: "render", etiqueta: "Render" },
  { valor: "commit", etiqueta: "Commit" },
  { valor: "paint", etiqueta: "Paint (navegador)" },
  { valor: "effect", etiqueta: "Effect" },
];

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function CommitPipeline({ pasos }: CommitPipelineProps) {
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
              <span className="font-mono text-xs font-semibold sm:text-sm">{etapa.etiqueta}</span>
            </div>
          );
        })}
      </div>

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">{paso.descripcion}</p>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Consola</span>
        <div className="mt-2 flex flex-col gap-1">
          {paso.consola.map((linea, index) => (
            <span key={index} className="text-foreground">
              &gt; {linea}
            </span>
          ))}
        </div>
      </div>

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
