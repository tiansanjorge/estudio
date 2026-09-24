"use client";

import { useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

const CODIGO = {
  mismoTipo: `
// Mismo tipo en la misma posición: React reutiliza la instancia
// y solo actualiza la prop → el estado (clics) sobrevive
<ContadorA etiqueta={\`Modo \${modo}\`} />`,
  distintoTipo: `
// Cambia el TIPO en esa posición: React desmonta ContadorA
// y monta ContadorB desde cero → el estado se pierde
{modo === "A" ? <ContadorA /> : <ContadorB />}`,
};

function FilaContador({
  etiqueta,
  clics,
  onClick,
}: {
  etiqueta: string;
  clics: number;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-2">
      <span className="text-sm text-foreground">{etiqueta}</span>
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-1 text-sm font-medium text-accent"
      >
        Clics: {clics}
      </button>
    </div>
  );
}

function ContadorA({ etiqueta }: { etiqueta: string }) {
  const [clics, setClics] = useState(0);
  return <FilaContador etiqueta={etiqueta} clics={clics} onClick={() => setClics((c) => c + 1)} />;
}

function ContadorB({ etiqueta }: { etiqueta: string }) {
  const [clics, setClics] = useState(0);
  return <FilaContador etiqueta={etiqueta} clics={clics} onClick={() => setClics((c) => c + 1)} />;
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function ReconciliationEnVivo() {
  const [modo, setModo] = useState<"A" | "B">("A");
  const [mismoTipo, setMismoTipo] = useState(true);

  function cambiarModo() {
    setModo((m) => (m === "A" ? "B" : "A"));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Hacé clic un par de veces para subir el contador, después cambiá
        de modo y mirá si el contador sobrevive.
      </p>

      <button
        type="button"
        onClick={() => setMismoTipo((v) => !v)}
        className={`w-fit rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
          mismoTipo
            ? "border-success/30 bg-success-soft text-success"
            : "border-warning/30 bg-warning-soft text-warning"
        }`}
      >
        {mismoTipo ? "Mismo componente, prop distinta" : "Componente distinto según el modo"}
      </button>

      {mismoTipo ? (
        <ContadorA etiqueta={`Modo ${modo}`} />
      ) : modo === "A" ? (
        <ContadorA etiqueta="Modo A (ContadorA)" />
      ) : (
        <ContadorB etiqueta="Modo B (ContadorB)" />
      )}

      <BloqueCodigo
        codigo={mismoTipo ? CODIGO.mismoTipo : CODIGO.distintoTipo}
        resaltadas={[3]}
      />

      <button type="button" onClick={cambiarModo} className={botonBase}>
        Cambiar a modo {modo === "A" ? "B" : "A"}
      </button>
    </div>
  );
}
