"use client";

import { memo, useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

const CODIGO = `
function Padre() {
  const [contador, setContador] = useState(0);
  return (
    <>
      <button onClick={() => setContador(contador + 1)}>...</button>
      <HijoNormal etiqueta="fijo" /> {/* se vuelve a ejecutar */}
      <HijoMemo etiqueta="fijo" />   {/* React lo saltea */}
    </>
  );
}

function HijoNormal({ etiqueta }) { /* ... */ }

// memo compara las props (Object.is) antes de llamar a la función
const HijoMemo = memo(function HijoMemo({ etiqueta }) { /* ... */ });`;

function huella() {
  return Math.random().toFixed(4);
}

function HijoNormal({ etiqueta }: { etiqueta: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        HijoNormal (sin memo)
      </span>
      <span className="text-sm text-foreground">prop fija: {etiqueta}</span>
      <span className="font-mono text-xs text-warning">huella de este render: {huella()}</span>
    </div>
  );
}

const HijoMemo = memo(function HijoMemo({ etiqueta }: { etiqueta: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-background p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        HijoMemo (con React.memo)
      </span>
      <span className="text-sm text-foreground">prop fija: {etiqueta}</span>
      <span className="font-mono text-xs text-success">huella de este render: {huella()}</span>
    </div>
  );
});

export function RenderHuellaDemo() {
  const [contador, setContador] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Los dos hijos reciben la MISMA prop fija (&apos;fijo&apos;), que
        nunca cambia. La &ldquo;huella&rdquo; es un número random que solo
        cambia si la función del componente se vuelve a ejecutar.
      </p>

      <button
        type="button"
        onClick={() => setContador((c) => c + 1)}
        className="w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
      >
        Re-renderizar Padre (contador: {contador})
      </button>

      <BloqueCodigo codigo={CODIGO} resaltadas={contador > 0 ? [6, 7, 15] : []} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <HijoNormal etiqueta="fijo" />
        <HijoMemo etiqueta="fijo" />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Cada click cambia la huella de <strong className="text-foreground">HijoNormal</strong> —
        se re-renderiza solo porque Padre se re-renderizó, aunque su prop
        no cambió. <strong className="text-foreground">HijoMemo</strong> mantiene
        la misma huella: React ve que su prop sigue siendo igual y se
        salta por completo el llamado a su función.
      </p>
    </div>
  );
}
