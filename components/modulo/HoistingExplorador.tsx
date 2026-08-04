"use client";

import { useState } from "react";
import type { CasoHoisting, ResultadoHoisting } from "@/lib/modules/hoisting/casos";

interface HoistingExploradorProps {
  casos: CasoHoisting[];
}

function claseResultado(resultado: ResultadoHoisting): string {
  switch (resultado) {
    case "undefined":
      return "border-warning/30 bg-warning-soft text-warning";
    case "referenceerror":
      return "border-error/30 bg-error-soft text-error";
    case "funciona":
      return "border-success/30 bg-success-soft text-success";
  }
}

function textoResultado(resultado: ResultadoHoisting): string {
  switch (resultado) {
    case "undefined":
      return "console.log(x) antes de esta línea → undefined";
    case "referenceerror":
      return "console.log(x) antes de esta línea → ReferenceError (TDZ)";
    case "funciona":
      return "x() antes de esta línea → funciona normalmente";
  }
}

export function HoistingExplorador({ casos }: HoistingExploradorProps) {
  const [seleccionado, setSeleccionado] = useState<CasoHoisting>(casos[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {casos.map((caso) => (
          <button
            key={caso.clave}
            type="button"
            onClick={() => setSeleccionado(caso)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              caso.clave === seleccionado.clave
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {caso.codigo}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground">
          {seleccionado.codigo}
        </pre>
        <span
          className={`w-fit rounded-lg border px-3 py-1 text-sm font-medium ${claseResultado(
            seleccionado.resultado,
          )}`}
        >
          {textoResultado(seleccionado.resultado)}
        </span>
        <p className="text-sm leading-6 text-muted-foreground">{seleccionado.explicacion}</p>
      </div>
    </div>
  );
}
