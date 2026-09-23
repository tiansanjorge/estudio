"use client";

import { useState } from "react";
import {
  DESCRIPCION_FORMA,
  PERFILES,
  PRESETS,
  clasificarForma,
  formatearDuracion,
  probabilidadCorridaRoja,
  tiempoSuiteMs,
  type Distribucion,
  type Nivel,
} from "@/lib/modules/testing/piramide-testing";

const MAXIMOS: Record<Nivel, number> = { unit: 1000, integracion: 500, e2e: 250 };

/** De arriba hacia abajo, como se dibuja la pirámide. */
const ORDEN_VISUAL: Nivel[] = ["e2e", "integracion", "unit"];

const COLOR: Record<Nivel, string> = {
  e2e: "bg-warning",
  integracion: "bg-info",
  unit: "bg-success",
};

export function PiramideTestingSimulador() {
  const [distribucion, setDistribucion] = useState<Distribucion>(PRESETS[0].distribucion);
  const forma = clasificarForma(distribucion);
  const tiempo = tiempoSuiteMs(distribucion);
  const rojo = probabilidadCorridaRoja(distribucion);
  const mayor = Math.max(...Object.values(distribucion), 1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Distribuciones de ejemplo">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setDistribucion(p.distribucion)}
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {(Object.keys(PERFILES) as Nivel[]).map((nivel) => (
            <label key={nivel} className="flex flex-col gap-1 text-sm text-foreground">
              <span className="flex justify-between font-mono text-xs">
                <span>{PERFILES[nivel].nombre}</span>
                <span>
                  {distribucion[nivel]} tests · ~{formatearDuracion(PERFILES[nivel].msPorTest)} c/u
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={MAXIMOS[nivel]}
                value={distribucion[nivel]}
                onChange={(e) =>
                  setDistribucion((d) => ({ ...d, [nivel]: Number(e.target.value) }))
                }
                className="accent-accent"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1" aria-hidden="true">
          {ORDEN_VISUAL.map((nivel) => (
            <div
              key={nivel}
              className={`${COLOR[nivel]} flex h-10 items-center justify-center rounded-md font-mono text-[11px] text-background transition-all duration-500`}
              style={{ width: `${Math.max(8, (distribucion[nivel] / mayor) * 100)}%` }}
            >
              {PERFILES[nivel].nombre}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <p className="rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
          Suite secuencial: <strong>{formatearDuracion(tiempo)}</strong>
        </p>
        <p
          className={`rounded-xl border px-3 py-2 font-mono text-xs ${
            rojo < 0.05
              ? "border-success/30 bg-success-soft text-success"
              : rojo < 0.3
                ? "border-warning/30 bg-warning-soft text-warning"
                : "border-error/30 bg-error-soft text-error"
          }`}
        >
          Corridas rojas sin bug real: {(rojo * 100).toFixed(1)}%
        </p>
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        {DESCRIPCION_FORMA[forma]}
      </p>

      <p className="text-xs text-muted-foreground">
        Tiempos y tasas de flakiness son órdenes de magnitud típicos, no mediciones. Con 200
        e2e al 1% de flakiness cada uno, la mayoría de las corridas falla sin que haya un bug:
        el equipo aprende a ignorar el CI.
      </p>
    </div>
  );
}
