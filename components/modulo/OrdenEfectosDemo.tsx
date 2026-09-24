"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

const CODIGO = `
function Componente() {
  const [contador, setContador] = useState(0);

  // 2. después de mutar el DOM, ANTES de que el navegador pinte
  useLayoutEffect(() => {
    log("useLayoutEffect corrió");
  }, [contador]);

  // 3. después de que la pantalla ya se pintó
  useEffect(() => {
    log("useEffect corrió");
  }, [contador]);

  // 1. render: calcula el JSX (todavía no toca el DOM)
  return <button onClick={() => setContador(contador + 1)}>...</button>;
}`;

export function OrdenEfectosDemo() {
  const [contador, setContador] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  useLayoutEffect(() => {
    // El objetivo del demo ES observar el orden real de ejecución de los
    // efectos — no hay forma de derivarlo durante el render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLog((prev) => [...prev, `useLayoutEffect corrió (contador=${contador})`]);
  }, [contador]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLog((prev) => [...prev, `useEffect corrió (contador=${contador})`]);
  }, [contador]);

  function dispararRender() {
    setLog([]);
    setContador((c) => c + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={dispararRender}
        className="w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
      >
        Disparar un nuevo render (contador: {contador})
      </button>

      <BloqueCodigo codigo={CODIGO} resaltadas={contador > 0 ? [5, 6, 10, 11] : []} />

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Orden real de ejecución
        </span>
        <div className="mt-2 flex flex-col gap-1">
          {log.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            log.map((linea, index) => (
              <span
                key={index}
                className={linea.includes("useLayoutEffect") ? "text-warning" : "text-info"}
              >
                {index + 1}. {linea}
              </span>
            ))
          )}
        </div>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        useLayoutEffect siempre aparece primero: corre justo después de que
        React mutó el DOM, pero antes de que el navegador pinte la
        pantalla. useEffect corre después, con la pantalla ya actualizada
        y visible.
      </p>
    </div>
  );
}
