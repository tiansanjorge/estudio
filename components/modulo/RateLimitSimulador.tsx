"use client";

import { useState } from "react";
import { ALGORITMOS, LIMITE, PATRONES, VENTANA_S, aplicar } from "@/lib/modules/backend/rate-limiting";
import { BloqueCodigo } from "./BloqueCodigo";

type AlgoritmoId = (typeof ALGORITMOS)[number]["id"];

/** Cómo se implementa cada algoritmo en un middleware con Redis. */
const CODIGO: Record<AlgoritmoId, { codigo: string; clave: number[] }> = {
  "ventana-fija": {
    codigo: `
// Un contador por cliente y por ventana de ${VENTANA_S}s
const ventana = Math.floor(Date.now() / ${VENTANA_S * 1000});
const clave = \`rl:\${cliente}:\${ventana}\`;
const n = await redis.incr(clave);
if (n === 1) await redis.expire(clave, ${VENTANA_S});
if (n > ${LIMITE}) return res.status(429).end();`,
    clave: [2, 6],
  },
  "ventana-deslizante": {
    codigo: `
// Log de timestamps: cuenta los últimos ${VENTANA_S}s exactos
const ahora = Date.now();
await redis.zremrangebyscore(clave, 0, ahora - ${VENTANA_S * 1000});
const n = await redis.zcard(clave);
if (n >= ${LIMITE}) return res.status(429).end();
await redis.zadd(clave, ahora, crypto.randomUUID());`,
    clave: [3, 4],
  },
  "token-bucket": {
    codigo: `
// Balde de ${LIMITE} fichas que se recarga de a ${LIMITE / VENTANA_S} por segundo
const { fichas, ultimo } = await leerBalde(cliente);
const segundos = (Date.now() - ultimo) / 1000;
const disponibles = Math.min(${LIMITE}, fichas + segundos * ${LIMITE / VENTANA_S});
if (disponibles < 1) return res.status(429).end();
await guardarBalde(cliente, { fichas: disponibles - 1, ultimo: Date.now() });
// en producción: todo esto en un script Lua, para que sea atómico`,
    clave: [4, 5],
  },
};

const ESCALA_S = 13;

export function RateLimitSimulador() {
  const [patronId, setPatronId] = useState(PATRONES[0].id);
  const patron = PATRONES.find((p) => p.id === patronId) ?? PATRONES[0];
  const [algoritmoCodigo, setAlgoritmoCodigo] = useState<AlgoritmoId>("ventana-fija");

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

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Ver la implementación de">
          {ALGORITMOS.map((a) => (
            <button
              key={a.id}
              type="button"
              aria-pressed={a.id === algoritmoCodigo}
              onClick={() => setAlgoritmoCodigo(a.id)}
              className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                a.id === algoritmoCodigo
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Código: {a.nombre}
            </button>
          ))}
        </div>
        <BloqueCodigo
          titulo="Middleware con Redis"
          codigo={CODIGO[algoritmoCodigo].codigo}
          resaltadas={CODIGO[algoritmoCodigo].clave}
        />
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        Mirá la ráfaga en el borde: la ventana fija deja pasar 10 requests en menos de 2 segundos,
        el doble del límite, porque se reparten entre dos ventanas.
      </p>
    </div>
  );
}
