"use client";

import { useState } from "react";
import {
  ESCENARIOS,
  IMPLEMENTACIONES,
  simular,
  type Escenario,
  type Implementacion,
} from "@/lib/modules/system-design/idempotencia-rate-limiting";

function Opciones<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; nombre: string }[];
  valor: T;
  onCambio: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === valor ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IdempotenciaSimulador() {
  const [escenario, setEscenario] = useState<Escenario>("reintento");
  const [implementacion, setImplementacion] = useState<Implementacion>("memoria");
  const resultado = simular(escenario, implementacion);
  const descripcion = ESCENARIOS.find((e) => e.id === escenario)?.descripcion;

  return (
    <div className="flex flex-col gap-6">
      <Opciones etiqueta="Qué pasa" opciones={ESCENARIOS} valor={escenario} onCambio={setEscenario} />
      <p className="text-sm text-muted-foreground">{descripcion}</p>
      <Opciones etiqueta="Cómo está implementado" opciones={IMPLEMENTACIONES} valor={implementacion} onCambio={setImplementacion} />

      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 ${
          resultado.correcto ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${resultado.correcto ? "text-success" : "text-error"}`}>
          {resultado.cobros} cobro{resultado.cobros === 1 ? "" : "s"} · {resultado.correcto ? "resultado correcto" : "resultado incorrecto"}
        </span>
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm text-foreground">
          {resultado.pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
