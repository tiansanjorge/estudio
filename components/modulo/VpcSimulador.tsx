"use client";

import { useState } from "react";
import { CONFIG_INICIAL, INTERRUPTORES, llega, trazar, type ConfigRed } from "@/lib/modules/cloud/redes-basicas";

export function VpcSimulador() {
  const [config, setConfig] = useState<ConfigRed>(CONFIG_INICIAL);
  const recorridos = trazar(config);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Configuración de la VPC</legend>
        {INTERRUPTORES.map(({ clave, etiqueta }) => (
          <label key={clave} className="flex items-start gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={config[clave]}
              onChange={(e) => setConfig((c) => ({ ...c, [clave]: e.target.checked }))}
              className="mt-1 accent-accent"
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        {recorridos.map((r) => {
          const alcanza = llega(r);
          // bien = llega lo que tiene que llegar y no llega lo que no
          const bien = alcanza === r.deseado;
          return (
            <div
              key={r.titulo}
              className={`flex flex-col gap-2 rounded-2xl border p-4 ${bien ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"}`}
            >
              <span className="text-sm font-medium text-foreground">{r.titulo}</span>
              <ol className="flex flex-col gap-1">
                {r.saltos.map((s) => (
                  <li key={s.descripcion} className="text-xs">
                    <span className={`font-mono ${s.ok ? "text-success" : "text-error"}`}>{s.ok ? "✓" : "✗"}</span>{" "}
                    <span className="text-foreground">{s.descripcion}</span>
                    <span className="block pl-4 text-muted-foreground">{s.motivo}</span>
                  </li>
                ))}
              </ol>
              <span className={`text-xs font-medium ${bien ? "text-success" : "text-error"}`}>
                {alcanza ? "Llega" : "No llega"}
                {bien ? " (correcto)" : r.deseado ? " (debería llegar)" : " (¡no debería llegar!)"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
