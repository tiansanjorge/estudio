"use client";

import { useState } from "react";
import { COMPONENTES, armarPrompt } from "@/lib/modules/ia-aplicada/prompt-engineering";

export function PromptSimulador() {
  const [activos, setActivos] = useState<string[]>([]);
  const { texto, riesgos } = armarPrompt(activos);

  function alternar(id: string) {
    setActivos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Qué incluye el prompt ({activos.length} de {COMPONENTES.length})
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {COMPONENTES.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={activos.includes(c.id)} onChange={() => alternar(c.id)} className="accent-accent" />
              {c.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Prompt resultante</span>
        <pre className="whitespace-pre-wrap rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
          {texto}
        </pre>
      </div>

      <div
        className={`flex flex-col gap-2 rounded-2xl border p-4 ${
          riesgos.length === 0 ? "border-success/30 bg-success-soft" : "border-warning/30 bg-warning-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${riesgos.length === 0 ? "text-success" : "text-warning"}`}>
          {riesgos.length === 0 ? "Pocas cosas quedan libradas a la interpretación" : "Lo que probablemente salga mal"}
        </span>
        {riesgos.length === 0 ? (
          <p className="text-sm text-foreground">
            Igual hay que revisar lo que devuelve: un buen prompt baja la probabilidad de error, no la elimina.
          </p>
        ) : (
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground">
            {riesgos.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
