"use client";

import { useState } from "react";
import type { EscenarioEventLoop } from "@/lib/modules/event-loop/escenarios";

interface EventLoopSimuladorProps {
  escenarios: EscenarioEventLoop[];
  mostrarSelector?: boolean;
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function EventLoopSimulador({
  escenarios,
  mostrarSelector = false,
}: EventLoopSimuladorProps) {
  const [escenarioIndex, setEscenarioIndex] = useState(0);
  const [pasoIndex, setPasoIndex] = useState(0);

  const escenario = escenarios[escenarioIndex];
  const paso = escenario.pasos[pasoIndex];

  function cambiarEscenario(index: number) {
    setEscenarioIndex(index);
    setPasoIndex(0);
  }

  return (
    <div className="flex flex-col gap-6">
      {mostrarSelector && escenarios.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {escenarios.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => cambiarEscenario(index)}
              className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                index === escenarioIndex
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.titulo}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-sm">
          {escenario.codigo.map((linea, index) => (
            <div
              key={index}
              className={`whitespace-pre rounded px-2 py-0.5 ${
                index === paso.lineaActiva
                  ? "bg-accent-soft text-accent"
                  : "text-foreground"
              }`}
            >
              {linea}
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background p-4 font-mono text-sm">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            Consola
          </span>
          <div className="mt-2 flex flex-col gap-1">
            {paso.consola.length === 0 ? (
              <span className="text-muted-foreground">—</span>
            ) : (
              paso.consola.map((linea, index) => (
                <span key={index} className="text-foreground">
                  &gt; {linea}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Columna titulo="Call Stack" items={paso.callStack} />
        <Columna titulo="Web APIs" items={paso.webApis} />
        <Columna titulo="Cola de Microtasks" items={paso.colaMicrotasks} />
      </div>
      <Columna titulo="Cola de Macrotasks" items={paso.colaMacrotasks} />

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">
        {paso.descripcion}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPasoIndex((i) => Math.max(i - 1, 0))}
          disabled={pasoIndex === 0}
          className={botonBase}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() =>
            setPasoIndex((i) => Math.min(i + 1, escenario.pasos.length - 1))
          }
          disabled={pasoIndex === escenario.pasos.length - 1}
          className={botonBase}
        >
          Siguiente
        </button>
        <button type="button" onClick={() => setPasoIndex(0)} className={botonBase}>
          Reiniciar
        </button>
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {escenario.pasos.length}
        </span>
      </div>
    </div>
  );
}

function Columna({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {titulo}
      </span>
      <div className="flex min-h-16 flex-col gap-1">
        {items.length === 0 ? (
          <span className="text-sm text-muted-foreground">vacío</span>
        ) : (
          items.map((item, index) => (
            <span
              key={index}
              className="truncate rounded-lg border border-accent/30 bg-accent-soft px-2 py-1 text-xs text-accent"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
