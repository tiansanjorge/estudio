"use client";

import { useState } from "react";
import { COMPARACIONES } from "@/lib/modules/nextjs/app-vs-pages-router";

export function RouterComparador() {
  const [seleccionada, setSeleccionada] = useState(COMPARACIONES[0].id);
  const comparacion = COMPARACIONES.find((c) => c.id === seleccionada) ?? COMPARACIONES[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Tema a comparar">
        {COMPARACIONES.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === seleccionada}
            onClick={() => setSeleccionada(c.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              c.id === seleccionada
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.tema}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["Pages Router", comparacion.pages],
            ["App Router", comparacion.app],
          ] as const
        ).map(([titulo, lado]) => (
          <div key={titulo} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{titulo}</span>
              <span className="font-mono text-xs text-muted-foreground">{lado.archivo}</span>
            </div>
            <pre className="h-full overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
              {lado.codigo}
            </pre>
          </div>
        ))}
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        {comparacion.nota}
      </p>
    </div>
  );
}
