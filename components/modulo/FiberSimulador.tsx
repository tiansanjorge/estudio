"use client";

import { useState } from "react";
import type { EscenarioFiber, EstadoUnidad } from "@/lib/modules/react-rendering/fiber-escenarios";

interface FiberSimuladorProps {
  escenarios: EscenarioFiber[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

function claseUnidad(estado: EstadoUnidad): string {
  switch (estado) {
    case "procesando":
      return "border-accent bg-accent-soft text-accent";
    case "completada":
      return "border-success/30 bg-success-soft text-success";
    case "pendiente":
      return "border-border bg-surface text-muted-foreground";
  }
}

export function FiberSimulador({ escenarios }: FiberSimuladorProps) {
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

      <div className="flex flex-wrap gap-2">
        {paso.unidades.map((unidad, index) => (
          <span
            key={index}
            className={`rounded-lg border px-3 py-2 text-sm font-mono ${claseUnidad(unidad.estado)}`}
          >
            {unidad.nombre} · {unidad.estado}
          </span>
        ))}
      </div>

      <span
        className={`w-fit rounded-lg border px-3 py-1 text-xs font-medium ${
          paso.inputAtendido
            ? "border-success/30 bg-success-soft text-success"
            : "border-warning/30 bg-warning-soft text-warning"
        }`}
      >
        {paso.inputAtendido ? "Input del usuario: atendido" : "Input del usuario: esperando..."}
      </span>

      <p className="min-h-12 text-sm leading-6 text-muted-foreground">{paso.descripcion}</p>

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
          onClick={() => setPasoIndex((i) => Math.min(i + 1, escenario.pasos.length - 1))}
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
