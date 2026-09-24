"use client";

import { useReducer } from "react";
import { estadoInicial, reducirCap, type EntradaLog, type Lado, type Modo } from "@/lib/modules/system-design/cap-consistencia";

const COLOR: Record<EntradaLog["tipo"], string> = {
  ok: "text-success",
  error: "text-error",
  viejo: "text-warning",
  info: "text-muted-foreground",
  perdida: "text-error",
};

const MODOS: { id: Modo; nombre: string; detalle: string }[] = [
  { id: "cp", nombre: "CP", detalle: "ante una partición, el lado sin mayoría deja de responder" },
  { id: "ap", nombre: "AP", detalle: "ante una partición, todos responden aunque diverjan" },
];

const BOTON = "rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground";

export function CapSimulador() {
  const [estado, despachar] = useReducer(reducirCap, undefined, () => estadoInicial());
  const lados: { id: Lado; nombre: string }[] = [
    { id: "mayoria", nombre: "Réplicas A y B" },
    { id: "minoria", nombre: "Réplica C" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Modo del sistema">
          {MODOS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={m.id === estado.modo}
              onClick={() => despachar({ tipo: "modo", modo: m.id })}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                m.id === estado.modo ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.nombre}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{MODOS.find((m) => m.id === estado.modo)?.detalle}</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        {lados.map((lado, i) => (
          <div key={lado.id} className={`contents`}>
            {i === 1 && (
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => despachar({ tipo: "particion" })}
                  aria-pressed={estado.particion}
                  className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                    estado.particion ? "border-error/30 bg-error-soft text-error" : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {estado.particion ? "✂ Partición: curar" : "Cortar la red"}
                </button>
              </div>
            )}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
              <span className="text-sm font-medium text-foreground">{lado.nombre}</span>
              <span className="font-mono text-2xl text-foreground">saldo = {estado[lado.id].valor}</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => despachar({ tipo: "escribir", lado: lado.id })} className={BOTON}>
                  Escribir +10
                </button>
                <button type="button" onClick={() => despachar({ tipo: "leer", lado: lado.id })} className={BOTON}>
                  Leer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-border p-4" aria-live="polite">
        {estado.log.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Probá: cortá la red, escribí en los dos lados y curala. Después repetí en el otro modo.
          </span>
        ) : (
          <ol className="flex flex-col gap-1 text-sm">
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
