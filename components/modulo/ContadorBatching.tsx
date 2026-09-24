"use client";

import { useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

type Modo = "directo" | "updater";

const CODIGO: Record<Modo, { titulo: string; codigo: string }> = {
  directo: {
    titulo: "Valor directo",
    codigo: `
function sumarTres() {
  // cuenta vale lo mismo en las 3 líneas (ej. 0)
  setCuenta(cuenta + 1); // setCuenta(1)
  setCuenta(cuenta + 1); // setCuenta(1)
  setCuenta(cuenta + 1); // setCuenta(1)
}`,
  },
  updater: {
    titulo: "Función updater",
    codigo: `
function sumarTres() {
  // c es el valor pendiente más reciente
  setCuenta((c) => c + 1); // 0 → 1
  setCuenta((c) => c + 1); // 1 → 2
  setCuenta((c) => c + 1); // 2 → 3
}`,
  },
};

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function ContadorBatching() {
  const [cuenta, setCuenta] = useState(0);
  const [ultimaAccion, setUltimaAccion] = useState<string | null>(null);
  const [modo, setModo] = useState<Modo | null>(null);

  function sumarTresDirecto() {
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setUltimaAccion("Sumar 3 (valor directo): las tres llamadas usaron el mismo 'cuenta' de esta closure.");
    setModo("directo");
  }

  function sumarTresConFuncion() {
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
    setCuenta((c) => c + 1);
    setUltimaAccion("Sumar 3 (función updater): cada llamada partió del valor pendiente más reciente.");
    setModo("updater");
  }

  function reiniciar() {
    setCuenta(0);
    setUltimaAccion(null);
    setModo(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 rounded-xl border border-border bg-background p-6">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          cuenta
        </span>
        <span className="font-mono text-4xl text-foreground">{cuenta}</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["directo", "updater"] as Modo[]).map((m) => (
          <div key={m} className="flex flex-col gap-3">
            <BloqueCodigo
              titulo={CODIGO[m].titulo}
              codigo={CODIGO[m].codigo}
              resaltadas={modo === m ? [3, 4, 5] : []}
            />
            <button
              type="button"
              onClick={m === "directo" ? sumarTresDirecto : sumarTresConFuncion}
              className={botonBase}
            >
              {m === "directo" ? "Sumar 3 (valor directo)" : "Sumar 3 (función updater)"}
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={reiniciar} className={`${botonBase} w-fit`}>
        Reiniciar
      </button>

      {ultimaAccion && (
        <p className="text-sm leading-6 text-muted-foreground">{ultimaAccion}</p>
      )}
    </div>
  );
}
