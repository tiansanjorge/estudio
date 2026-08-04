"use client";

import { useState } from "react";
import { calcularAlcanzables, type ConfiguracionReferencias, type NodoObjeto } from "@/lib/modules/memory/reachability";

const nodos: NodoObjeto[] = ["A", "B", "C"];

export function MemoryReachability() {
  const [config, setConfig] = useState<ConfiguracionReferencias>({
    rootHaciaA: true,
    aHaciaB: true,
    bHaciaC: true,
    cHaciaA: false,
  });

  const alcanzables = calcularAlcanzables(config);

  function toggle(clave: keyof ConfiguracionReferencias) {
    setConfig((prev) => ({ ...prev, [clave]: !prev[clave] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Activá o desactivá referencias entre root (global) y tres objetos.
        Un objeto solo sobrevive si existe un camino de referencias desde
        el root — ni siquiera un ciclo entre B y C lo salva si nadie desde
        afuera los alcanza.
      </p>

      <div className="flex flex-col gap-2">
        <Toggle
          etiqueta="root → A"
          activo={config.rootHaciaA}
          onClick={() => toggle("rootHaciaA")}
        />
        <Toggle etiqueta="A → B" activo={config.aHaciaB} onClick={() => toggle("aHaciaB")} />
        <Toggle etiqueta="B → C" activo={config.bHaciaC} onClick={() => toggle("bHaciaC")} />
        <Toggle
          etiqueta="C → A (ciclo)"
          activo={config.cHaciaA}
          onClick={() => toggle("cHaciaA")}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {nodos.map((nodo) => {
          const esAlcanzable = alcanzables.has(nodo);
          return (
            <div
              key={nodo}
              className={`flex flex-col items-center gap-1 rounded-xl border p-4 ${
                esAlcanzable
                  ? "border-success/30 bg-success-soft"
                  : "border-warning/30 bg-warning-soft"
              }`}
            >
              <span
                className={`font-mono text-lg font-semibold ${
                  esAlcanzable ? "text-success" : "text-warning"
                }`}
              >
                {nodo}
              </span>
              <span className={`text-xs ${esAlcanzable ? "text-success" : "text-warning"}`}>
                {esAlcanzable ? "alcanzable" : "elegible para GC"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Toggle({ etiqueta, activo, onClick }: { etiqueta: string; activo: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm font-mono transition-colors ${
        activo
          ? "border-accent bg-accent-soft text-accent"
          : "border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <span>{etiqueta}</span>
      <span className="text-xs">{activo ? "sí" : "no"}</span>
    </button>
  );
}
