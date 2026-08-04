"use client";

import { useState } from "react";
import type { MetodoHttp } from "@/lib/modules/http/metodos";

interface MetodosExploradorProps {
  metodos: MetodoHttp[];
}

export function MetodosExplorador({ metodos }: MetodosExploradorProps) {
  const [activoIndex, setActivoIndex] = useState(0);
  const activo = metodos[activoIndex];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {metodos.map((item, index) => (
          <button
            key={item.metodo}
            type="button"
            onClick={() => setActivoIndex(index)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              index === activoIndex
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.metodo}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5">
        <p className="text-sm leading-6 text-foreground">{activo.descripcion}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <Etiqueta texto={`Idempotente: ${activo.idempotente ? "sí" : "no"}`} />
          <Etiqueta texto={`Seguro (safe): ${activo.seguro ? "sí" : "no"}`} />
          <Etiqueta texto={`Body en el request: ${activo.cuerpoEnRequest ? "sí" : "no"}`} />
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
          {activo.ejemplo}
        </pre>
      </div>
    </div>
  );
}

function Etiqueta({ texto }: { texto: string }) {
  return (
    <span className="rounded-lg border border-border bg-surface px-2 py-1 text-muted-foreground">
      {texto}
    </span>
  );
}
