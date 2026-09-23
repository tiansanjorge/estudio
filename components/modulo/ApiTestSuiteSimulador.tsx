"use client";

import { useState } from "react";
import { BUGS, CASOS, pasa, type BugId } from "@/lib/modules/testing/testing-apis";

export function ApiTestSuiteSimulador() {
  const [bug, setBug] = useState<BugId>("ninguno");
  const [casoId, setCasoId] = useState(CASOS[0].id);
  const caso = CASOS.find((c) => c.id === casoId) ?? CASOS[0];
  const fallados = CASOS.filter((c) => !pasa(c, bug)).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="api-bug" className="text-sm font-medium text-foreground">
          Estado del endpoint <code className="font-mono text-xs">/pedidos</code>
        </label>
        <select
          id="api-bug"
          value={bug}
          onChange={(e) => setBug(e.target.value as BugId)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
        >
          {BUGS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
        <div className="flex flex-col gap-2" aria-live="polite">
          <p
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
              fallados === 0
                ? "border-success/30 bg-success-soft text-success"
                : "border-error/30 bg-error-soft text-error"
            }`}
          >
            {CASOS.length - fallados} passed · {fallados} failed
          </p>
          <ul className="flex flex-col gap-1.5">
            {CASOS.map((c) => {
              const ok = pasa(c, bug);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-pressed={c.id === casoId}
                    onClick={() => setCasoId(c.id)}
                    className={`flex w-full flex-col items-start rounded-lg border px-3 py-2 text-left transition-colors ${
                      c.id === casoId ? "border-accent" : "border-border"
                    } ${ok ? "bg-surface" : "bg-error-soft"}`}
                  >
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {c.categoria}
                    </span>
                    <span className={`font-mono text-xs ${ok ? "text-success" : "text-error"}`}>
                      {ok ? "✓" : "✗"} {c.nombre}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-foreground">{caso.nombre}</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
            {caso.codigo}
          </pre>
          <p className="text-xs text-muted-foreground">
            Cada caso verifica la respuesta HTTP y, cuando importa, el estado de la base: un
            endpoint puede responder bien y aun así no haber guardado nada, o haber guardado de
            más.
          </p>
        </div>
      </div>
    </div>
  );
}
