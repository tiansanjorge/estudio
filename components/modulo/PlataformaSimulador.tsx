"use client";

import { useState } from "react";
import { REQUISITOS, recomendar } from "@/lib/modules/cloud/vercel-vs-aws";

export function PlataformaSimulador() {
  const [activos, setActivos] = useState<string[]>(["sin-infra", "nextjs"]);
  const recomendacion = recomendar(activos);

  function alternar(id: string) {
    setActivos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Requisitos del proyecto</legend>
        {REQUISITOS.map((r) => (
          <label key={r.id} className="flex items-start gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={activos.includes(r.id)}
              onChange={() => alternar(r.id)}
              className="mt-1 accent-accent"
            />
            <span>
              {r.etiqueta}{" "}
              <span className="text-xs text-muted-foreground">({r.lado === "aws" ? "empuja a AWS" : "empuja a la plataforma"})</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4" aria-live="polite">
        <span className="text-sm font-medium text-foreground">{recomendacion.titulo}</span>
        <p className="text-sm text-foreground">{recomendacion.resumen}</p>
        {recomendacion.razones.length > 0 && (
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
            {recomendacion.razones.map((razon) => (
              <li key={razon}>{razon}</li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Es una heurística para ordenar la conversación, no una regla: en una entrevista, lo que suma es explicar qué
        requisito empuja la decisión hacia cada lado.
      </p>
    </div>
  );
}
