"use client";

import { useState } from "react";

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function ContadorBatching() {
  const [cuenta, setCuenta] = useState(0);
  const [ultimaAccion, setUltimaAccion] = useState<string | null>(null);

  function sumarTresDirecto() {
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setUltimaAccion("Sumar 3 (valor directo): las tres llamadas usaron el mismo 'cuenta' de esta closure.");
  }

  function sumarTresConFuncion() {
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
    setUltimaAccion("Sumar 3 (función updater): cada llamada partió del valor pendiente más reciente.");
  }

  function reiniciar() {
    setCuenta(0);
    setUltimaAccion(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-6">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          cuenta
        </span>
        <span className="font-mono text-4xl text-foreground">{cuenta}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={sumarTresDirecto} className={botonBase}>
          Sumar 3 (valor directo)
        </button>
        <button type="button" onClick={sumarTresConFuncion} className={botonBase}>
          Sumar 3 (función updater)
        </button>
        <button type="button" onClick={reiniciar} className={botonBase}>
          Reiniciar
        </button>
      </div>

      {ultimaAccion && (
        <p className="text-sm leading-6 text-muted-foreground">{ultimaAccion}</p>
      )}
    </div>
  );
}
