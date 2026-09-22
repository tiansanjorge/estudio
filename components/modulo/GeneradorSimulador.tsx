"use client";

import { useState } from "react";
import type { EscenarioGenerador } from "@/lib/modules/iteradores/escenarios";

interface GeneradorSimuladorProps {
  escenarios: EscenarioGenerador[];
  mostrarSelector?: boolean;
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function GeneradorSimulador({ escenarios, mostrarSelector = false }: GeneradorSimuladorProps) {
  const [escenarioIndex, setEscenarioIndex] = useState(0);
  const [pasoIndex, setPasoIndex] = useState(-1);

  const escenario = escenarios[escenarioIndex];
  const paso = pasoIndex >= 0 ? escenario.pasos[pasoIndex] : null;

  function cambiarEscenario(index: number) {
    setEscenarioIndex(index);
    setPasoIndex(-1);
  }

  return (
    <div className="flex flex-col gap-6">
      {mostrarSelector && escenarios.length > 1 && (
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
      )}

      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
        {escenario.codigo.join("\n")}
      </pre>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Llamada</span>
        <div className="mt-2 text-foreground">
          {paso ? paso.llamada : "// hacé click en Siguiente para empezar"}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Resultado</span>
        <div className="mt-2 text-accent">{paso ? paso.resultado : "—"}</div>
      </div>

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">
        {paso ? paso.descripcion : "Cada paso simula una llamada real a .next() sobre este generador."}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPasoIndex((i) => Math.max(i - 1, -1))}
          disabled={pasoIndex <= -1}
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
        <button type="button" onClick={() => setPasoIndex(-1)} className={botonBase}>
          Reiniciar
        </button>
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {escenario.pasos.length}
        </span>
      </div>
    </div>
  );
}
