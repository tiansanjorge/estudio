"use client";

import { useState } from "react";
import {
  CAPACIDAD_POR_INSTANCIA,
  MODELOS_COMPUTO,
  TRAFICO,
  resumen,
  simular,
  type ModeloComputo,
} from "@/lib/modules/cloud/computo";

const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const MAXIMO = Math.max(...TRAFICO, CAPACIDAD_POR_INSTANCIA * 4);

export function ComputoSimulador() {
  const [modeloId, setModeloId] = useState<ModeloComputo>("vm");
  const modelo = MODELOS_COMPUTO.find((m) => m.id === modeloId) ?? MODELOS_COMPUTO[0];
  const minutos = simular(modelo);
  const r = resumen(minutos);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Modelo de cómputo">
        {MODELOS_COMPUTO.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={m.id === modeloId}
            onClick={() => setModeloId(m.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              m.id === modeloId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex h-36 items-end gap-1" aria-hidden="true">
          {minutos.map((m, i) => {
            const capacidad = m.instancias * CAPACIDAD_POR_INSTANCIA;
            return (
              <div key={i} className="relative flex h-full flex-1 items-end">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-sm border border-dashed border-accent/50"
                  style={{ height: `${(capacidad / MAXIMO) * 100}%` }}
                />
                <div className="relative flex w-full flex-col justify-end" style={{ height: `${(m.trafico / MAXIMO) * 100}%` }}>
                  {m.sinAtender > 0 && <div className="bg-error" style={{ height: `${(m.sinAtender / m.trafico) * 100}%` }} />}
                  <div className="flex-1 bg-success" />
                </div>
                {m.coldStarts > 0 && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] text-warning">❄{m.coldStarts}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span><span className="mr-1 inline-block h-2 w-2 bg-success" />atendidas</span>
          <span><span className="mr-1 inline-block h-2 w-2 bg-error" />sin atender a tiempo</span>
          <span><span className="mr-1 inline-block h-2 w-2 border border-dashed border-accent" />capacidad</span>
          <span className="text-warning">❄ cold starts</span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <dt className="text-xs text-muted-foreground">Requests sin atender a tiempo</dt>
          <dd className="font-mono text-sm text-foreground">{formato.format(r.porcentajeSinAtender)}%</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <dt className="text-xs text-muted-foreground">Capacidad ociosa</dt>
          <dd className="font-mono text-sm text-foreground">{formato.format(r.ociosa)}%</dd>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <dt className="text-xs text-muted-foreground">Cold starts</dt>
          <dd className="font-mono text-sm text-foreground">{r.coldStarts}</dd>
        </div>
      </dl>

      <p className="rounded-2xl border border-border p-4 text-sm leading-6 text-foreground">{modelo.nota}</p>
    </div>
  );
}
