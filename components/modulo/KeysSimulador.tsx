"use client";

import { useState } from "react";
import type { EscenarioKeys } from "@/lib/modules/react-core/keys-escenarios";

interface KeysSimuladorProps {
  escenarios: EscenarioKeys[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function KeysSimulador({ escenarios }: KeysSimuladorProps) {
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

      <div className="flex flex-col gap-2">
        {paso.filas.map((fila) => (
          <div
            key={fila.key}
            className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
          >
            <span className="rounded border border-accent/30 bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">
              key={fila.key}
            </span>
            <span
              className={`h-4 w-4 flex-shrink-0 rounded border ${
                fila.marcada ? "border-success bg-success" : "border-border"
              }`}
            />
            <span
              className={`text-sm ${
                fila.marcada ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {fila.texto}
            </span>
          </div>
        ))}
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
