"use client";

import { useState, type ReactNode } from "react";
import type { Nivel } from "@/lib/modules/types";

interface NivelTabsProps {
  niveles: Partial<Record<Nivel, ReactNode>>;
}

const ETIQUETAS: Record<Nivel, string> = {
  1: "Nivel 1",
  2: "Nivel 2",
  3: "Nivel 3",
};

export function NivelTabs({ niveles }: NivelTabsProps) {
  const disponibles = ([1, 2, 3] as Nivel[]).filter((n) => niveles[n]);
  const [activo, setActivo] = useState<Nivel>(disponibles[0] ?? 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="inline-flex w-fit rounded-xl border border-border p-1">
        {disponibles.map((nivel) => (
          <button
            key={nivel}
            type="button"
            onClick={() => setActivo(nivel)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              activo === nivel
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {ETIQUETAS[nivel]}
          </button>
        ))}
      </div>
      <div key={activo} className="flex flex-col gap-8">{niveles[activo]}</div>
    </div>
  );
}
