"use client";

import { useState } from "react";
import { ESTRATEGIAS_DEPLOY, type EstadoInstancia, type EstrategiaDeploy } from "@/lib/modules/ci-cd/estrategias-deploy";

function claseInstancia(estado: EstadoInstancia, hayBug: boolean): string {
  if (estado === "off") return "border-dashed border-border text-muted-foreground";
  if (estado === "v1") return "border-info/30 bg-info-soft text-info";
  return hayBug ? "border-error/30 bg-error-soft text-error" : "border-success/30 bg-success-soft text-success";
}

export function DeploySimulador() {
  const [estrategiaId, setEstrategiaId] = useState<EstrategiaDeploy>("rolling");
  const [indice, setIndice] = useState(0);
  const [hayBug, setHayBug] = useState(false);
  const estrategia = ESTRATEGIAS_DEPLOY.find((e) => e.id === estrategiaId) ?? ESTRATEGIAS_DEPLOY[0];
  const paso = estrategia.pasos[indice];
  const sinServicio = paso.instancias.every((i) => i === "off");

  function elegir(id: EstrategiaDeploy) {
    setEstrategiaId(id);
    setIndice(0);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estrategia de deploy">
        {ESTRATEGIAS_DEPLOY.map((e) => (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={e.id === estrategiaId}
            onClick={() => elegir(e.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              e.id === estrategiaId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={hayBug} onChange={(e) => setHayBug(e.target.checked)} className="accent-accent" />
        v2 tiene un bug que los tests no detectaron
      </label>

      <div className="flex flex-col gap-3" aria-live="polite">
        <span className="text-sm font-medium text-foreground">
          Paso {indice + 1} de {estrategia.pasos.length}: {paso.titulo}
        </span>
        <div className="flex flex-wrap gap-2">
          {paso.instancias.map((estado, i) => (
            <span key={i} className={`w-12 rounded-lg border py-2 text-center font-mono text-xs ${claseInstancia(estado, hayBug)}`}>
              {estado === "off" ? "—" : estado}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full ${hayBug ? "bg-error" : "bg-success"}`}
              style={{ width: `${paso.traficoV2}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {sinServicio
              ? "Sin instancias activas: el servicio está caído"
              : hayBug
                ? `${paso.traficoV2}% de los usuarios ve errores`
                : `${paso.traficoV2}% del tráfico en v2`}
          </span>
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
          disabled={indice === estrategia.pasos.length - 1}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          Siguiente paso
        </button>
      </div>

      <dl className="grid gap-3 rounded-2xl border border-border p-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Capacidad extra</dt>
          <dd className="text-foreground">{estrategia.capacidadExtra}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Rollback</dt>
          <dd className="text-foreground">{estrategia.rollback}</dd>
        </div>
        <p className="text-muted-foreground sm:col-span-2">{estrategia.resumen}</p>
      </dl>
    </div>
  );
}
