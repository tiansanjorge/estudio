"use client";

import { useState } from "react";
import { ALGORITMOS, CAPACIDAD, REQUESTS, balancear, type Algoritmo } from "@/lib/modules/system-design/load-balancing";

const TRABAJO_TOTAL = REQUESTS.reduce((s, r) => s + r.duracion, 0);

export function BalanceoSimulador() {
  const [algoritmo, setAlgoritmo] = useState<Algoritmo>("round-robin");
  const resultado = balancear(algoritmo);
  const maximoTrabajo = Math.max(...resultado.map((r) => r.trabajo));
  const actual = ALGORITMOS.find((a) => a.id === algoritmo) ?? ALGORITMOS[0];
  const sobrecargados = resultado.filter((r) => r.maxSimultaneas > CAPACIDAD).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Algoritmo de balanceo">
          {ALGORITMOS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={a.id === algoritmo}
              onClick={() => setAlgoritmo(a.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                a.id === algoritmo ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {a.nombre}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {actual.descripcion}. Tráfico: {REQUESTS.length} requests, 2 por segundo; 1 de cada 4 es pesada (8 s) y un
          cliente grande genera el 40%.
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        {resultado.map((r, i) => {
          const sobrecargado = r.maxSimultaneas > CAPACIDAD;
          return (
            <div
              key={i}
              className={`flex flex-col gap-2 rounded-xl border p-3 ${
                sobrecargado ? "border-error/30 bg-error-soft" : "border-border bg-surface"
              }`}
            >
              <span className="text-xs font-medium text-foreground">Servidor {i + 1}</span>
              <div className="flex h-20 items-end rounded-md bg-background">
                <div
                  className={`w-full rounded-md ${sobrecargado ? "bg-error" : "bg-accent"}`}
                  style={{ height: `${(r.trabajo / maximoTrabajo) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {r.requests} requests · {Math.round((r.trabajo / TRABAJO_TOTAL) * 100)}% del trabajo
              </span>
              <span className={`text-xs font-medium ${sobrecargado ? "text-error" : "text-foreground"}`}>
                Pico: {r.maxSimultaneas} simultáneas {sobrecargado ? `(capacidad ${CAPACIDAD})` : ""}
              </span>
            </div>
          );
        })}
      </div>

      <p className="rounded-2xl border border-border p-4 text-sm leading-6 text-foreground">
        {sobrecargados > 0
          ? `${sobrecargados} servidor${sobrecargados === 1 ? "" : "es"} supera${sobrecargados === 1 ? "" : "n"} su capacidad mientras otros están casi ociosos: repartir la misma cantidad de requests no es repartir la misma carga.`
          : "Ningún servidor supera su capacidad: el algoritmo mira la carga real de cada uno, no solo cuántas requests le mandó."}
      </p>
    </div>
  );
}
