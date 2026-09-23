"use client";

import { useState } from "react";
import { KATA, type Fase } from "@/lib/modules/testing/tdd";

const ESTILO_FASE: Record<Fase, string> = {
  red: "border-error/30 bg-error-soft text-error",
  green: "border-success/30 bg-success-soft text-success",
  refactor: "border-info/30 bg-info-soft text-info",
};

const NOMBRE_FASE: Record<Fase, string> = {
  red: "RED · escribir un test que falle",
  green: "GREEN · lo mínimo para pasar",
  refactor: "REFACTOR · mejorar sin cambiar comportamiento",
};

export function TddKata() {
  const [indice, setIndice] = useState(0);
  const paso = KATA[indice];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-lg border px-3 py-1 font-mono text-xs ${ESTILO_FASE[paso.fase]}`}>
          {NOMBRE_FASE[paso.fase]}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          Paso {indice + 1} de {KATA.length}
        </span>
      </div>

      <div className="flex gap-1" aria-hidden="true">
        {KATA.map((p, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i > indice
                ? "bg-border"
                : p.fase === "red"
                  ? "bg-error"
                  : p.fase === "green"
                    ? "bg-success"
                    : "bg-info"
            }`}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">{paso.titulo}</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
            {paso.codigo}
          </pre>
          <p className="text-sm text-muted-foreground">{paso.explicacion}</p>
        </div>

        <div className="flex flex-col gap-2" aria-live="polite">
          <p className="text-sm font-medium text-foreground">Suite</p>
          <ul className="flex flex-col gap-1.5">
            {paso.tests.map((t) => (
              <li
                key={t.nombre}
                className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] ${
                  t.pasa
                    ? "border-success/30 bg-success-soft text-success"
                    : "border-error/30 bg-error-soft text-error"
                }`}
              >
                {t.pasa ? "✓" : "✗"} {t.nombre}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0}
          className="rounded-xl border border-border px-4 py-2 text-sm text-foreground disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setIndice((i) => Math.min(KATA.length - 1, i + 1))}
          disabled={indice === KATA.length - 1}
          className="rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm text-accent disabled:opacity-40"
        >
          Siguiente paso
        </button>
      </div>
    </div>
  );
}
