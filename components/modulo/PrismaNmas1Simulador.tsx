"use client";

import { useId, useState } from "react";
import {
  ESTRATEGIAS,
  LATENCIA_MS,
  queriesGeneradas,
  type EstrategiaCarga,
} from "@/lib/modules/bases-de-datos/prisma-orm";

const LINEAS_VISIBLES = 6;

export function PrismaNmas1Simulador() {
  const [estrategiaId, setEstrategiaId] = useState<EstrategiaCarga>("n-mas-1");
  const [n, setN] = useState(20);
  const idRango = useId();
  const estrategia = ESTRATEGIAS.find((e) => e.id === estrategiaId) ?? ESTRATEGIAS[0];
  const queries = queriesGeneradas(estrategiaId, n);
  const ocultas = queries.length - LINEAS_VISIBLES;
  const esNmas1 = estrategiaId === "n-mas-1";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Cómo se cargan los clientes de cada pedido</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estrategia de carga">
          {ESTRATEGIAS.map((e) => (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={e.id === estrategiaId}
              onClick={() => setEstrategiaId(e.id)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                e.id === estrategiaId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {e.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={idRango} className="text-sm font-medium text-foreground">
          Pedidos en la página: {n}
        </label>
        <input
          id={idRango}
          type="range"
          min={5}
          max={200}
          step={5}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="accent-accent"
        />
      </div>

      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
        {estrategia.codigo}
      </pre>

      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 ${
          esNmas1 ? "border-warning/30 bg-warning-soft" : "border-success/30 bg-success-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${esNmas1 ? "text-warning" : "text-success"}`}>
          {queries.length} {queries.length === 1 ? "query" : "queries"} · ~{queries.length * LATENCIA_MS} ms solo en viajes de red
        </span>
        <ol className="flex flex-col gap-1 font-mono text-[11px] text-foreground">
          {queries.slice(0, LINEAS_VISIBLES).map((q, i) => (
            <li key={i} className="break-words">
              {q}
            </li>
          ))}
          {ocultas > 0 && <li className="text-muted-foreground">… y {ocultas} queries más</li>}
        </ol>
        <p className="text-sm text-foreground">{estrategia.nota}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Supone {LATENCIA_MS} ms de ida y vuelta por query, típico de una base en la misma región. Con la base en otra
        región, cada viaje puede costar decenas de milisegundos.
      </p>
    </div>
  );
}
