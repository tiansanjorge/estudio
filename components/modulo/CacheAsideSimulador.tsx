"use client";

import { useReducer } from "react";
import {
  TTL_SEGUNDOS,
  estadoInicial,
  reducirCache,
  type EntradaLog,
} from "@/lib/modules/bases-de-datos/redis-caching";

const COLOR_LOG: Record<EntradaLog["tipo"], string> = {
  hit: "text-success",
  miss: "text-info",
  "hit-viejo": "text-error",
  escritura: "text-foreground",
  expira: "text-warning",
};

const BOTON =
  "rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground";

export function CacheAsideSimulador() {
  const [estado, despachar] = useReducer(reducirCache, undefined, () => estadoInicial());
  const restante = estado.cache ? estado.cache.expiraEn - estado.segundo : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <span className="text-xs text-muted-foreground">Redis · producto:7</span>
          <span className="font-mono text-sm text-foreground">
            {estado.cache ? `$${estado.cache.precio} · expira en ${restante}s` : "(no existe)"}
          </span>
        </div>
        <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
          <span className="text-xs text-muted-foreground">Postgres · productos.id = 7</span>
          <span className="font-mono text-sm text-foreground">${estado.precioDb}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={estado.invalidarAlEscribir}
          onChange={(e) => despachar({ tipo: "invalidacion", activa: e.target.checked })}
          className="accent-accent"
        />
        Borrar la clave de Redis al actualizar el precio
      </label>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => despachar({ tipo: "leer" })} className={BOTON}>
          GET /productos/7
        </button>
        <button type="button" onClick={() => despachar({ tipo: "escribir" })} className={BOTON}>
          Actualizar precio
        </button>
        <button type="button" onClick={() => despachar({ tipo: "avanzar", segundos: 30 })} className={BOTON}>
          +30 s
        </button>
        <button type="button" onClick={() => despachar({ tipo: "reiniciar" })} className={BOTON}>
          Reiniciar
        </button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border p-4" aria-live="polite">
        <span className="text-xs font-medium text-muted-foreground">Log (segundo {estado.segundo})</span>
        {estado.log.length === 0 ? (
          <span className="text-sm text-muted-foreground">Hacé un GET para empezar.</span>
        ) : (
          <ol className="flex flex-col gap-1 font-mono text-xs">
            {estado.log.map((e, i) => (
              <li key={`${e.segundo}-${i}-${e.tipo}`} className={COLOR_LOG[e.tipo]}>
                [{e.segundo}s] {e.texto}
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Probá: GET, actualizar precio y GET otra vez, con y sin borrar la clave. Sin invalidación, el dato viejo se sirve
        hasta que vence el TTL de {TTL_SEGUNDOS}s.
      </p>
    </div>
  );
}
