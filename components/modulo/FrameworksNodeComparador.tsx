"use client";

import { useState } from "react";
import {
  CRITERIOS,
  ESCENARIOS,
  FRAMEWORKS,
  type FrameworkId,
} from "@/lib/modules/backend/frameworks-node";

const boton = (activo: boolean) =>
  `rounded-xl border px-3 py-1.5 text-xs transition-colors ${
    activo ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
  }`;

export function FrameworksNodeComparador() {
  const [frameworkId, setFrameworkId] = useState<FrameworkId>("express");
  const [escenarioId, setEscenarioId] = useState(ESCENARIOS[0].id);
  const framework = FRAMEWORKS.find((f) => f.id === frameworkId) ?? FRAMEWORKS[0];
  const escenario = ESCENARIOS.find((e) => e.id === escenarioId) ?? ESCENARIOS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-foreground">El mismo endpoint: POST /pedidos con validación y autenticación.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Framework">
          {FRAMEWORKS.map((f) => (
            <button key={f.id} type="button" aria-pressed={f.id === frameworkId} onClick={() => setFrameworkId(f.id)} className={boton(f.id === frameworkId)}>
              {f.nombre}
            </button>
          ))}
        </div>
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-[11px] leading-5 text-foreground">
          {framework.codigo}
        </pre>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-3 font-normal">Criterio</th>
              {FRAMEWORKS.map((f) => (
                <th key={f.id} className={`py-2 pr-3 font-normal ${f.id === escenario.recomendado ? "text-accent" : ""}`}>
                  {f.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CRITERIOS.map((c) => (
              <tr key={c.nombre} className="border-b border-border align-top">
                <th scope="row" className="py-2 pr-3 font-medium text-foreground">
                  {c.nombre}
                </th>
                {FRAMEWORKS.map((f) => (
                  <td key={f.id} className="py-2 pr-3 text-muted-foreground">
                    {c.valores[f.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">¿Cuál elegirías?</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Escenario">
          {ESCENARIOS.map((e) => (
            <button key={e.id} type="button" aria-pressed={e.id === escenarioId} onClick={() => setEscenarioId(e.id)} className={boton(e.id === escenarioId)}>
              {e.descripcion}
            </button>
          ))}
        </div>
        <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground" aria-live="polite">
          <span className="font-medium text-info">
            {FRAMEWORKS.find((f) => f.id === escenario.recomendado)?.nombre}:{" "}
          </span>
          {escenario.razon}
        </p>
      </div>
    </div>
  );
}
