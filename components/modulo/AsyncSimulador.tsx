"use client";

import { useState } from "react";
import type { EscenarioAsync } from "@/lib/modules/async/escenarios";

interface AsyncSimuladorProps {
  escenarios: EscenarioAsync[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function AsyncSimulador({ escenarios }: AsyncSimuladorProps) {
  const [pasoIndex, setPasoIndex] = useState(0);
  const escenario = escenarios[0];
  const paso = escenario.pasos[pasoIndex];

  return (
    <div className="flex flex-col gap-6">
      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
        {escenario.codigo.join("\n")}
      </pre>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Call Stack
          </span>
          <div className="flex min-h-16 flex-col gap-1">
            {paso.callStack.length === 0 ? (
              <span className="text-sm text-muted-foreground">vacío</span>
            ) : (
              paso.callStack.map((item, index) => (
                <span
                  key={index}
                  className="truncate rounded-lg border border-accent/30 bg-accent-soft px-2 py-1 text-xs text-accent"
                >
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Consola</span>
          <div className="mt-2 flex flex-col gap-1">
            {paso.consola.length === 0 ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              paso.consola.map((linea, index) => (
                <span key={index} className="text-foreground">
                  &gt; {linea}
                </span>
              ))
            )}
          </div>
        </div>
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
