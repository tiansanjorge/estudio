"use client";

import { useState } from "react";
import {
  CANTIDAD_SHARDS,
  ESTRATEGIAS_SHARDING,
  maximoFilas,
  type ClaveSharding,
} from "@/lib/modules/bases-de-datos/escalabilidad-db";

const formato = new Intl.NumberFormat("es-AR");

export function ShardingSimulador() {
  const [claveId, setClaveId] = useState<ClaveSharding>("hash-usuario");
  const estrategia = ESTRATEGIAS_SHARDING.find((e) => e.id === claveId) ?? ESTRATEGIAS_SHARDING[0];
  const maximo = maximoFilas(estrategia);
  const promedio = estrategia.filasPorShard.reduce((a, b) => a + b, 0) / CANTIDAD_SHARDS;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Clave de sharding de la tabla pedidos</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Clave de sharding">
          {ESTRATEGIAS_SHARDING.map((e) => (
            <button
              key={e.id}
              type="button"
              role="radio"
              aria-checked={e.id === claveId}
              onClick={() => setClaveId(e.id)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                e.id === claveId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {e.nombre}
            </button>
          ))}
        </div>
        <span className="font-mono text-xs text-muted-foreground">{estrategia.descripcion}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        {estrategia.filasPorShard.map((filas, i) => {
          const caliente = filas > promedio * 1.3;
          const escribe = estrategia.shardsEscrituraHoy.includes(i);
          return (
            <div
              key={i}
              className={`flex flex-col gap-2 rounded-xl border p-3 ${
                caliente ? "border-warning/30 bg-warning-soft" : "border-border bg-surface"
              }`}
            >
              <span className="text-xs font-medium text-foreground">Shard {i + 1}</span>
              <div className="flex h-20 items-end rounded-md bg-background">
                <div
                  className={`w-full rounded-md ${caliente ? "bg-warning" : "bg-accent"}`}
                  style={{ height: `${(filas / maximo) * 100}%` }}
                />
              </div>
              <span className="font-mono text-xs text-muted-foreground">{formato.format(filas)} mil filas</span>
              <span className={`text-xs ${escribe ? "text-foreground" : "text-muted-foreground"}`}>
                {escribe ? "recibe escrituras hoy" : "sin escrituras hoy"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Shards que toca cada consulta</span>
        <ul className="flex flex-col gap-1">
          {estrategia.consultas.map((c) => (
            <li key={c.sql} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{c.sql}</span>
              <span className={`font-mono text-xs ${c.shardsTocados === 1 ? "text-success" : "text-warning"}`}>
                {c.shardsTocados === 1 ? "1 shard" : `${c.shardsTocados} shards`}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="rounded-2xl border border-border p-4 text-sm leading-6 text-foreground">{estrategia.veredicto}</p>
    </div>
  );
}
