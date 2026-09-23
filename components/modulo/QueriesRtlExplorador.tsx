"use client";

import { useState } from "react";
import {
  ELEMENTOS,
  SITUACIONES,
  type Calidad,
} from "@/lib/modules/testing/testing-componentes-rtl";

const ESTILO_CALIDAD: Record<Calidad, string> = {
  recomendada: "border-success/30 bg-success-soft text-success",
  aceptable: "border-warning/30 bg-warning-soft text-warning",
  "ultimo-recurso": "border-error/30 bg-error-soft text-error",
};

const NOMBRE_CALIDAD: Record<Calidad, string> = {
  recomendada: "recomendada",
  aceptable: "aceptable",
  "ultimo-recurso": "último recurso",
};

function Selector({
  etiqueta,
  opciones,
  actual,
  alCambiar,
}: {
  etiqueta: string;
  opciones: { id: string; texto: string }[];
  actual: string;
  alCambiar: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={o.id === actual}
          onClick={() => alCambiar(o.id)}
          className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
            o.id === actual
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}

export function QueriesRtlExplorador() {
  const [elementoId, setElementoId] = useState(ELEMENTOS[0].id);
  const [situacionId, setSituacionId] = useState(SITUACIONES[0].id);
  const elemento = ELEMENTOS.find((e) => e.id === elementoId) ?? ELEMENTOS[0];
  const situacion = SITUACIONES.find((s) => s.id === situacionId) ?? SITUACIONES[0];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">¿Con qué query lo encontrás?</p>
        <Selector
          etiqueta="Elemento a encontrar"
          opciones={ELEMENTOS.map((e) => ({ id: e.id, texto: e.nombre }))}
          actual={elementoId}
          alCambiar={setElementoId}
        />
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground">
          {elemento.html}
        </pre>
        <ul className="flex flex-col gap-2">
          {elemento.queries.map((q) => (
            <li key={q.codigo} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-xs text-foreground">{q.codigo}</code>
                <span className={`rounded-md border px-1.5 py-0.5 text-[10px] ${ESTILO_CALIDAD[q.calidad]}`}>
                  {NOMBRE_CALIDAD[q.calidad]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{q.nota}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">¿getBy, queryBy o findBy?</p>
        <Selector
          etiqueta="Situación"
          opciones={SITUACIONES.map((s) => ({ id: s.id, texto: s.descripcion }))}
          actual={situacionId}
          alCambiar={setSituacionId}
        />
        <div className="flex flex-col gap-2 rounded-xl border border-info/30 bg-info-soft p-3">
          <span className="font-mono text-sm text-info">{situacion.variante}</span>
          <code className="font-mono text-xs text-foreground">{situacion.codigo}</code>
          <p className="text-xs text-foreground">{situacion.explicacion}</p>
        </div>
      </div>
    </div>
  );
}
