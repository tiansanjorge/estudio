"use client";

import { useState } from "react";
import {
  ESTRATEGIAS,
  MINUTO_EDICION,
  resumir,
  simular,
  type EstrategiaId,
} from "@/lib/modules/nextjs/ssr-ssg-isr";

export function EstrategiasRenderSimulador() {
  const [seleccionada, setSeleccionada] = useState<EstrategiaId>("isr-tiempo");
  const estrategia = ESTRATEGIAS.find((e) => e.id === seleccionada) ?? ESTRATEGIAS[0];
  const filas = simular(seleccionada);
  const { renders, desactualizadas } = resumir(filas);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Estrategia de renderizado">
        {ESTRATEGIAS.map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={e.id === seleccionada}
            onClick={() => setSeleccionada(e.id)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
              e.id === seleccionada
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground">
        {estrategia.codigo}
      </pre>

      <p className="text-sm text-muted-foreground">
        Escenario: un post se genera en el build (v1) y el editor lo modifica en el minuto{" "}
        {MINUTO_EDICION} (v2). Llegan cinco visitas.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-4 font-normal">Minuto</th>
              <th className="py-2 pr-4 font-normal">Recibe</th>
              <th className="py-2 pr-4 font-normal">Render</th>
              <th className="py-2 font-normal">Respuesta</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => {
              const vieja = f.versionServida < f.versionActual;
              return (
                <tr key={f.minuto} className="border-b border-border">
                  <td className="py-2 pr-4 text-foreground">{f.minuto}</td>
                  <td className={`py-2 pr-4 ${vieja ? "text-warning" : "text-success"}`}>
                    v{f.versionServida}
                    {vieja && " (vieja)"}
                  </td>
                  <td className="py-2 pr-4 text-foreground">{f.render}</td>
                  <td className="py-2 text-muted-foreground">
                    {f.desdeCache ? "HTML ya generado (CDN)" : "se renderiza y se espera"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
          Renders en el servidor: {renders}
        </span>
        <span
          className={`rounded-lg border px-3 py-1 font-mono text-xs ${
            desactualizadas === 0
              ? "border-success/30 bg-success-soft text-success"
              : "border-warning/30 bg-warning-soft text-warning"
          }`}
        >
          Visitas con contenido viejo: {desactualizadas}
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        El trade-off siempre es el mismo: cuánto trabajo hace el servidor por visita frente a
        cuánto tiempo se puede mostrar un dato viejo.
      </p>
    </div>
  );
}
