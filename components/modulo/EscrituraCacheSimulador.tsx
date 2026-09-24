"use client";

import { useReducer } from "react";
import {
  ESTRATEGIAS,
  estadoInicial,
  reducirCaching,
  type EntradaLog,
} from "@/lib/modules/system-design/estrategias-caching";

const COLOR: Record<EntradaLog["tipo"], string> = {
  ok: "text-success",
  viejo: "text-warning",
  perdida: "text-error",
  info: "text-muted-foreground",
};

const BOTON = "rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";

export function EscrituraCacheSimulador() {
  const [estado, despachar] = useReducer(reducirCaching, undefined, () => estadoInicial());
  const actual = ESTRATEGIAS.find((e) => e.id === estado.estrategia) ?? ESTRATEGIAS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Estrategia de escritura">
          {ESTRATEGIAS.map((e) => (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={e.id === estado.estrategia}
              onClick={() => despachar({ tipo: "estrategia", estrategia: e.id })}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                e.id === estado.estrategia ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {e.nombre}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{actual.descripcion}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <span className="text-xs text-muted-foreground">Caché</span>
          <span className="font-mono text-lg text-foreground">
            {estado.cache === null ? "(vacío)" : estado.cache}
            {estado.sucio && <span className="ml-2 text-xs text-warning">sin guardar en la base</span>}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <span className="text-xs text-muted-foreground">Base de datos</span>
          <span className="font-mono text-lg text-foreground">{estado.db}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => despachar({ tipo: "escribir" })} className={BOTON}>
          Escribir +10
        </button>
        <button type="button" onClick={() => despachar({ tipo: "leer" })} className={BOTON}>
          Leer
        </button>
        {estado.estrategia === "write-back" && (
          <button type="button" onClick={() => despachar({ tipo: "flush" })} className={BOTON}>
            Flush a la base
          </button>
        )}
        <button type="button" onClick={() => despachar({ tipo: "caida" })} className={BOTON}>
          Se cae el caché
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border p-4" aria-live="polite">
        {estado.log.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Probá escribir y leer con cada estrategia. En write-back, escribí dos veces y tirá el caché antes del flush.
          </span>
        ) : (
          <ol className="flex flex-col gap-1 font-mono text-xs">
            {estado.log.map((e, i) => (
              <li key={`${estado.log.length - i}-${e.tipo}`} className={COLOR[e.tipo]}>
                {e.texto}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
