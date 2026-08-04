"use client";

import { useState } from "react";

const DURACION_MS = 800;
const TAREAS = [1, 2, 3];

function tareaSimulada(id: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Tarea ${id} lista`), DURACION_MS);
  });
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function SecuencialVsParaleloSimulador() {
  const [ejecutando, setEjecutando] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);

  async function ejecutarSecuencial() {
    setEjecutando(true);
    setLog([]);
    setTiempoTotal(null);
    const inicio = performance.now();

    for (const id of TAREAS) {
      const resultado = await tareaSimulada(id);
      const transcurrido = Math.round(performance.now() - inicio);
      setLog((prev) => [...prev, `t=${transcurrido}ms → ${resultado}`]);
    }

    setTiempoTotal(Math.round(performance.now() - inicio));
    setEjecutando(false);
  }

  async function ejecutarParalelo() {
    setEjecutando(true);
    setLog([]);
    setTiempoTotal(null);
    const inicio = performance.now();

    const promesas = TAREAS.map(async (id) => {
      const resultado = await tareaSimulada(id);
      const transcurrido = Math.round(performance.now() - inicio);
      setLog((prev) => [...prev, `t=${transcurrido}ms → ${resultado}`]);
      return resultado;
    });

    await Promise.all(promesas);
    setTiempoTotal(Math.round(performance.now() - inicio));
    setEjecutando(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        3 tareas de {DURACION_MS}ms cada una, independientes entre sí.
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={ejecutarSecuencial} disabled={ejecutando} className={botonBase}>
          Ejecutar secuencial (await uno por uno)
        </button>
        <button type="button" onClick={ejecutarParalelo} disabled={ejecutando} className={botonBase}>
          Ejecutar en paralelo (Promise.all)
        </button>
      </div>

      {tiempoTotal !== null && (
        <span className="w-fit rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm font-medium text-success">
          Tiempo total: {tiempoTotal}ms
        </span>
      )}

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Log</span>
        <div className="mt-2 flex flex-col gap-1">
          {log.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            log.map((linea, index) => (
              <span key={index} className="text-muted-foreground">
                {linea}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
