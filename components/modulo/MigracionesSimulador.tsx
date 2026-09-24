"use client";

import { useState } from "react";
import { ESTRATEGIAS_MIGRACION, PASOS, type EstrategiaMigracion } from "@/lib/modules/bases-de-datos/migraciones";

export function MigracionesSimulador() {
  const [estrategia, setEstrategia] = useState<EstrategiaMigracion>("directo");
  const [indice, setIndice] = useState(0);
  const pasos = PASOS[estrategia];
  const paso = pasos[indice];
  const hayErrores = paso.instancias.some((i) => !i.ok);

  function elegir(id: EstrategiaMigracion) {
    setEstrategia(id);
    setIndice(0);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estrategia">
        {ESTRATEGIAS_MIGRACION.map((e) => (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={e.id === estrategia}
            onClick={() => elegir(e.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              e.id === estrategia ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <ol className="flex flex-wrap gap-2" aria-label="Pasos">
        {pasos.map((p, i) => (
          <li key={p.titulo}>
            <button
              type="button"
              onClick={() => setIndice(i)}
              aria-current={i === indice ? "step" : undefined}
              className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                i === indice ? "border-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {i + 1}. {p.titulo}
            </button>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-4" aria-live="polite">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Acción</span>
          <code className="break-words rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground">
            {paso.accion}
          </code>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">Columnas de usuarios</span>
          <div className="flex flex-wrap gap-2">
            {paso.columnas.map((c) => (
              <span key={c} className="rounded-lg border border-border bg-surface px-2 py-1 font-mono text-xs text-foreground">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 rounded-2xl border p-4 ${
            hayErrores ? "border-error/30 bg-error-soft" : "border-success/30 bg-success-soft"
          }`}
        >
          <span className="text-xs font-medium text-muted-foreground">Instancias corriendo</span>
          {paso.instancias.map((inst) => (
            <div key={inst.version} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className={`font-mono font-medium ${inst.ok ? "text-success" : "text-error"}`}>
                {inst.version} {inst.ok ? "✓" : "✗"}
              </span>
              <span className="text-foreground">{inst.nota}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIndice((i) => i - 1)}
          disabled={indice === 0}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setIndice((i) => i + 1)}
          disabled={indice === pasos.length - 1}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          Siguiente paso
        </button>
      </div>
    </div>
  );
}
