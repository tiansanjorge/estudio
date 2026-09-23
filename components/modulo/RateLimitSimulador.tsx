"use client";

import { useState } from "react";
import { ALGORITMOS, LIMITE, PATRONES, VENTANA_S, aplicar } from "@/lib/modules/backend/rate-limiting";

const ESCALA_S = 13;

export function RateLimitSimulador() {
  const [patronId, setPatronId] = useState(PATRONES[0].id);
  const patron = PATRONES.find((p) => p.id === patronId) ?? PATRONES[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-foreground">
          Límite: {LIMITE} requests cada {VENTANA_S} segundos por cliente.
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Patrón de tráfico">
          {PATRONES.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={p.id === patronId}
              onClick={() => setPatronId(p.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                p.id === patronId
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.nombre}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex flex-col gap-5">
        {ALGORITMOS.map((a) => {
          const resultado = aplicar(a.id, patron.tiempos);
          const aceptados = resultado.filter(Boolean).length;
          return (
            <li key={a.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{a.nombre}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {aceptados} aceptados · {resultado.length - aceptados} con 429
                </span>
              </div>
              <div className="relative h-8 rounded-lg border border-border bg-background" aria-hidden="true">
                <div
                  className="absolute inset-y-0 border-l border-dashed border-muted-foreground/50"
                  style={{ left: `${(VENTANA_S / ESCALA_S) * 100}%` }}
                />
                {patron.tiempos.map((t, i) => (
                  <span
                    key={i}
                    className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      resultado[i] ? "bg-success" : "bg-error"
                    }`}
                    style={{ left: `${(t / ESCALA_S) * 100}%` }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{a.descripcion}</p>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground" aria-hidden="true">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-success" /> aceptado</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-error" /> rechazado (429)</span>
        <span>línea punteada: segundo {VENTANA_S}, borde de la ventana fija</span>
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        Mirá la ráfaga en el borde: la ventana fija deja pasar 10 requests en menos de 2 segundos,
        el doble del límite, porque se reparten entre dos ventanas.
      </p>
    </div>
  );
}
