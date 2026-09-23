"use client";

import { useMemo, useState } from "react";
import { calcularRangoVisible } from "@/lib/modules/performance/virtualization";

const TOTAL_ITEMS = 5000;
const ALTURA_FILA = 32;
const ALTURA_VIEWPORT = 240;
const OVERSCAN = 3;

export function VirtualizacionSimulador() {
  const [virtualizado, setVirtualizado] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);

  const rango = useMemo(
    () => calcularRangoVisible(scrollTop, ALTURA_FILA, ALTURA_VIEWPORT, TOTAL_ITEMS, OVERSCAN),
    [scrollTop],
  );

  const items = virtualizado
    ? Array.from({ length: rango.fin - rango.inicio }, (_, i) => rango.inicio + i)
    : Array.from({ length: TOTAL_ITEMS }, (_, i) => i);

  const nodosEnDom = items.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setVirtualizado(true)}
          className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
            virtualizado
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Virtualizado
        </button>
        <button
          type="button"
          onClick={() => setVirtualizado(false)}
          className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
            !virtualizado
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Sin virtualizar
        </button>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
          Nodos montados en el DOM: {nodosEnDom} / {TOTAL_ITEMS}
        </span>
      </div>

      <div
        className="overflow-y-auto rounded-xl border border-border bg-background"
        style={{ height: ALTURA_VIEWPORT }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: TOTAL_ITEMS * ALTURA_FILA, position: "relative" }}>
          {items.map((indice) => (
            <div
              key={indice}
              className="flex items-center border-b border-border px-3 font-mono text-xs text-muted-foreground"
              style={{
                height: ALTURA_FILA,
                position: virtualizado ? "absolute" : "static",
                top: virtualizado ? indice * ALTURA_FILA : undefined,
                width: "100%",
              }}
            >
              Fila #{indice}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Scrolleá la lista. Con &quot;Sin virtualizar&quot; los {TOTAL_ITEMS}{" "}
        nodos están montados en el DOM desde el inicio, aunque casi ninguno
        sea visible — probá scrollear y notá la diferencia de fluidez.
      </p>
    </div>
  );
}
