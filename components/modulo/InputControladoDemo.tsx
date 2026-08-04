"use client";

import { useState } from "react";

export function InputControladoDemo() {
  const [texto, setTexto] = useState("");
  const [sincronizar, setSincronizar] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => setSincronizar((v) => !v)}
        className={`w-fit rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
          sincronizar
            ? "border-success/30 bg-success-soft text-success"
            : "border-warning/30 bg-warning-soft text-warning"
        }`}
      >
        onChange {sincronizar ? "SÍ llama a setTexto" : "NO llama a setTexto"}
      </button>

      <input
        value={texto}
        onChange={(event) => {
          if (sincronizar) setTexto(event.target.value);
        }}
        placeholder="Probá escribir acá..."
        className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
      />

      {!sincronizar && (
        <p className="text-sm text-warning">
          Probá tipear: el input no muestra nada, porque React sigue
          forzando value=&quot;{texto}&quot; en cada render — nadie le
          pidió que cambie.
        </p>
      )}

      <span className="w-fit rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-muted-foreground">
        estado actual: &quot;{texto}&quot;
      </span>
    </div>
  );
}
