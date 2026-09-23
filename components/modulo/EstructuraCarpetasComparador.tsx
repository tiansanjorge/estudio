"use client";

import { useState } from "react";
import {
  ARBOLES,
  CAMBIOS,
  carpetasTocadas,
  type Estructura,
} from "@/lib/modules/arquitectura/estructura-carpetas";

const TITULO: Record<Estructura, string> = {
  capas: "Por capas (layer-based)",
  features: "Por features (feature-based)",
};

function Arbol({ estructura, tocados }: { estructura: Estructura; tocados: Set<string> }) {
  const archivos = ARBOLES[estructura];
  const carpetas = carpetasTocadas(archivos.filter((a) => tocados.has(a)));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{TITULO[estructura]}</span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {tocados.size} archivos en {carpetas} {carpetas === 1 ? "carpeta" : "carpetas"}
        </span>
      </div>
      <ul className="flex flex-col gap-0.5 rounded-xl border border-border bg-background p-3 font-mono text-[11px]">
        {archivos.map((archivo) => {
          const tocado = tocados.has(archivo);
          return (
            <li
              key={archivo}
              className={`rounded px-1.5 py-0.5 ${tocado ? "bg-accent-soft text-accent" : "text-muted-foreground"}`}
            >
              {archivo.replace("src/", "")}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function EstructuraCarpetasComparador() {
  const [cambioId, setCambioId] = useState(CAMBIOS[0].id);
  const cambio = CAMBIOS.find((c) => c.id === cambioId) ?? CAMBIOS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Cambio a realizar">
        {CAMBIOS.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === cambioId}
            onClick={() => setCambioId(c.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              c.id === cambioId
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.descripcion}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Arbol estructura="capas" tocados={new Set(cambio.archivos.capas)} />
        <Arbol estructura="features" tocados={new Set(cambio.archivos.features)} />
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        {cambio.nota}
      </p>
    </div>
  );
}
