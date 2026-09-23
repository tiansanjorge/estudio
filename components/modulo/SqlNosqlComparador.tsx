"use client";

import { useState } from "react";
import {
  MODELO_DOCUMENTO,
  MODELO_RELACIONAL,
  OPERACIONES,
  type Veredicto,
} from "@/lib/modules/bases-de-datos/sql-vs-nosql";

const ESTILO: Record<Veredicto, string> = {
  natural: "border-success/30 bg-success-soft text-success",
  posible: "border-warning/30 bg-warning-soft text-warning",
  costoso: "border-error/30 bg-error-soft text-error",
};

export function SqlNosqlComparador() {
  const [operacionId, setOperacionId] = useState(OPERACIONES[0].id);
  const operacion = OPERACIONES.find((o) => o.id === operacionId) ?? OPERACIONES[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Relacional (Postgres)</span>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
            {MODELO_RELACIONAL}
          </pre>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">Documentos (MongoDB)</span>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
            {MODELO_DOCUMENTO}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Operación">
        {OPERACIONES.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={o.id === operacionId}
            onClick={() => setOperacionId(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === operacionId
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
        {(
          [
            ["SQL", operacion.sql],
            ["Documentos", operacion.documento],
          ] as const
        ).map(([titulo, lado]) => (
          <div key={titulo} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">{titulo}</span>
              <span className={`rounded-md border px-2 py-0.5 text-[11px] ${ESTILO[lado.veredicto]}`}>{lado.veredicto}</span>
            </div>
            <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
              {lado.codigo}
            </pre>
            <p className="text-xs text-foreground">{lado.nota}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        El modelo de documentos optimiza para leer juntos los datos que se usan juntos; el
        relacional, para no duplicar y poder combinar los datos de cualquier forma. Ninguno es
        mejor en todas las operaciones.
      </p>
    </div>
  );
}
