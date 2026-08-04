"use client";

import { useState } from "react";
import type { PasoVirtualDom } from "@/lib/modules/react-rendering/virtual-dom-escenarios";

interface VirtualDomSimuladorProps {
  pasos: PasoVirtualDom[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function VirtualDomSimulador({ pasos }: VirtualDomSimuladorProps) {
  const [pasoIndex, setPasoIndex] = useState(0);
  const paso = pasos[pasoIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {pasos.map((item, index) => (
          <button
            key={item.etiqueta}
            type="button"
            onClick={() => setPasoIndex(index)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              index === pasoIndex
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.etiqueta}
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
        {paso.codigo}
      </pre>

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
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {pasos.length}
        </span>
      </div>
    </div>
  );
}
