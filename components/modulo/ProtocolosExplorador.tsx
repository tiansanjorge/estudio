"use client";

import { useState } from "react";
import type { Protocolo } from "@/lib/modules/http/protocolos";

interface ProtocolosExploradorProps {
  protocolos: Protocolo[];
}

const filas: { clave: keyof Protocolo; etiqueta: string }[] = [
  { clave: "transporte", etiqueta: "Transporte" },
  { clave: "multiplexado", etiqueta: "Multiplexado" },
  { clave: "headOfLineBlocking", etiqueta: "Head-of-line blocking" },
  { clave: "headers", etiqueta: "Compresión de headers" },
];

export function ProtocolosExplorador({ protocolos }: ProtocolosExploradorProps) {
  const [activoIndex, setActivoIndex] = useState(0);
  const activo = protocolos[activoIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {protocolos.map((item, index) => (
          <button
            key={item.nombre}
            type="button"
            onClick={() => setActivoIndex(index)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              index === activoIndex
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.nombre}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5">
        <p className="text-sm leading-6 text-foreground">{activo.descripcion}</p>
        <dl className="flex flex-col gap-3 text-sm">
          {filas.map((fila) => (
            <div key={fila.clave} className="flex flex-col gap-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {fila.etiqueta}
              </dt>
              <dd className="leading-6 text-muted-foreground">{activo[fila.clave]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
