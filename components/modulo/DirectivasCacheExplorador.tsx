"use client";

import { useState } from "react";
import type { DirectivaCache } from "@/lib/modules/http/cache-directivas";

interface DirectivasCacheExploradorProps {
  directivas: DirectivaCache[];
}

export function DirectivasCacheExplorador({ directivas }: DirectivasCacheExploradorProps) {
  const [seleccionada, setSeleccionada] = useState<DirectivaCache>(directivas[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {directivas.map((item) => (
          <button
            key={item.directiva}
            type="button"
            onClick={() => setSeleccionada(item)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              item.directiva === seleccionada.directiva
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.directiva}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-5">
        <span className="font-mono text-sm font-semibold text-foreground">
          {seleccionada.directiva}
        </span>
        <p className="text-sm leading-6 text-muted-foreground">{seleccionada.descripcion}</p>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
          {seleccionada.ejemplo}
        </pre>
      </div>
    </div>
  );
}
