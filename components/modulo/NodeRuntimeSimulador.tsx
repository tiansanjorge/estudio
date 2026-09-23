"use client";

import { useState } from "react";
import { simular, type ModoEjecucion } from "@/lib/modules/backend/nodejs-runtime";

const MODOS: { id: ModoEjecucion; nombre: string; nota: string }[] = [
  {
    id: "hilo-principal",
    nombre: "Todo en el hilo principal",
    nota: "El PDF bloquea el event loop 400 ms: los requests livianos esperan detrás aunque solo necesiten 5 ms.",
  },
  {
    id: "worker-threads",
    nombre: "PDF en un worker thread",
    nota: "El trabajo de CPU corre en otro hilo; el event loop queda libre y los requests livianos responden al instante.",
  },
  {
    id: "cluster",
    nombre: "Cluster de 4 procesos",
    nota: "Hay 4 event loops independientes. Ayuda, pero el reparto round-robin puede mandar un request liviano al proceso ocupado (mirá R5).",
  },
];

const ESCALA_MS = 420;

export function NodeRuntimeSimulador() {
  const [modo, setModo] = useState<ModoEjecucion>("hilo-principal");
  const resultados = simular(modo);
  const actual = MODOS.find((m) => m.id === modo) ?? MODOS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Modo de ejecución">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={m.id === modo}
            onClick={() => setModo(m.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              m.id === modo
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-3">
        {resultados.map((r) => {
          const lento = !r.request.pesado && r.latenciaMs > 50;
          return (
            <li key={r.request.id} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                <span className="font-mono text-foreground">
                  {r.request.id} · {r.request.descripcion}
                </span>
                <span className={`font-mono ${lento ? "text-error" : "text-muted-foreground"}`}>
                  {r.dondeCorre} · latencia {r.latenciaMs} ms
                </span>
              </div>
              <div className="relative h-4 rounded bg-border/50" aria-hidden="true">
                <div
                  className="absolute inset-y-0 rounded-l bg-warning/40"
                  style={{
                    left: `${(r.request.llegadaMs / ESCALA_MS) * 100}%`,
                    width: `${((r.inicioMs - r.request.llegadaMs) / ESCALA_MS) * 100}%`,
                  }}
                />
                <div
                  className={`absolute inset-y-0 rounded ${r.request.pesado ? "bg-accent" : "bg-success"}`}
                  style={{
                    left: `${(r.inicioMs / ESCALA_MS) * 100}%`,
                    width: `${Math.max(0.8, (r.request.cpuMs / ESCALA_MS) * 100)}%`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-warning/40" /> esperando</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-success" /> ejecutando (liviano)</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent" /> ejecutando (CPU)</span>
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground" aria-live="polite">
        {actual.nota}
      </p>
    </div>
  );
}
