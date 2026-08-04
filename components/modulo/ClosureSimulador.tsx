"use client";

import { useState } from "react";
import type { EscenarioClosure } from "@/lib/modules/closures/escenarios";

interface ClosureSimuladorProps {
  escenarios: EscenarioClosure[];
  mostrarSelector?: boolean;
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function ClosureSimulador({ escenarios, mostrarSelector = false }: ClosureSimuladorProps) {
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {paso.scopes.map((scope) => (
          <div
            key={scope.nombre}
            className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent-soft p-4"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-accent">
              {scope.nombre}
            </span>
            <div className="flex flex-col gap-1 font-mono text-xs text-foreground">
              {Object.entries(scope.variables).map(([clave, valor]) => (
                <span key={clave}>
                  {clave} = {valor}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">{paso.descripcion}</p>

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
          onClick={() =>
            setPasoIndex((i) => Math.min(i + 1, escenario.pasos.length - 1))
          }
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
