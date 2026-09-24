"use client";

import { useState } from "react";
import type { PasoArbol } from "@/lib/modules/react-core/arbol";
import { arbolAJsx } from "@/lib/modules/react-core/arbol";
import { BloqueCodigo } from "./BloqueCodigo";
import { ArbolComponentes } from "./ArbolComponentes";

interface ComponentesSimuladorProps {
  pasos: PasoArbol[];
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function ComponentesSimulador({ pasos }: ComponentesSimuladorProps) {
  const [pasoIndex, setPasoIndex] = useState(0);
  const paso = pasos[pasoIndex];

  return (
    <div className="flex flex-col gap-6">
      <ArbolComponentes nodo={paso.arbol} />
      <BloqueCodigo titulo="JSX equivalente" {...arbolAJsx(paso.arbol)} />

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
          onClick={() => setPasoIndex((i) => Math.min(i + 1, pasos.length - 1))}
          disabled={pasoIndex === pasos.length - 1}
          className={botonBase}
        >
          Siguiente
        </button>
        <button type="button" onClick={() => setPasoIndex(0)} className={botonBase}>
          Reiniciar
        </button>
        <span className="text-xs text-muted-foreground">
          Paso {pasoIndex + 1} / {pasos.length}
        </span>
      </div>
    </div>
  );
}
