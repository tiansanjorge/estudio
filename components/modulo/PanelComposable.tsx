"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Pieza = "lista" | "formulario" | "vacio";

const opciones: { valor: Pieza; etiqueta: string }[] = [
  { valor: "lista", etiqueta: "Lista" },
  { valor: "formulario", etiqueta: "Formulario" },
  { valor: "vacio", etiqueta: "Vacío" },
];

function renderPieza(pieza: Pieza): ReactNode {
  if (pieza === "lista") {
    return (
      <ul className="flex flex-col gap-1 text-sm text-foreground">
        <li>📋 Item uno</li>
        <li>📋 Item dos</li>
        <li>📋 Item tres</li>
      </ul>
    );
  }
  if (pieza === "formulario") {
    return (
      <div className="flex flex-col gap-2 text-sm text-foreground">
        <span>📝 Nombre: ___________</span>
        <span>📝 Email: ___________</span>
      </div>
    );
  }
  return <span className="text-sm text-muted-foreground">(vacío)</span>;
}

function SplitPane({ izquierda, derecha }: { izquierda: ReactNode; derecha: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-surface p-4">{izquierda}</div>
      <div className="rounded-lg border border-border bg-surface p-4">{derecha}</div>
    </div>
  );
}

export function PanelComposable() {
  const [piezaIzquierda, setPiezaIzquierda] = useState<Pieza>("lista");
  const [piezaDerecha, setPiezaDerecha] = useState<Pieza>("formulario");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        SplitPane recibe DOS slots independientes (izquierda y derecha),
        no un solo children. No sabe ni le importa qué hay adentro de
        cada uno.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Selector etiqueta="Slot izquierdo" valor={piezaIzquierda} onCambio={setPiezaIzquierda} />
        <Selector etiqueta="Slot derecho" valor={piezaDerecha} onCambio={setPiezaDerecha} />
      </div>

      <SplitPane izquierda={renderPieza(piezaIzquierda)} derecha={renderPieza(piezaDerecha)} />
    </div>
  );
}

function Selector({
  etiqueta,
  valor,
  onCambio,
}: {
  etiqueta: string;
  valor: Pieza;
  onCambio: (pieza: Pieza) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {etiqueta}
      </span>
      <div className="flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <button
            key={opcion.valor}
            type="button"
            onClick={() => onCambio(opcion.valor)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              opcion.valor === valor
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}
