"use client";

import { useRef, useState } from "react";

function crearContador() {
  let cuenta = 0;
  return () => {
    cuenta += 1;
    return cuenta;
  };
}

interface Contador {
  id: number;
  incrementar: () => number;
  valor: number;
}

const botonBase =
  "rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function FabricaDeContadores() {
  const [contadores, setContadores] = useState<Contador[]>([]);
  const idRef = useRef(0);

  function agregarContador() {
    idRef.current += 1;
    setContadores((prev) => [
      ...prev,
      { id: idRef.current, incrementar: crearContador(), valor: 0 },
    ]);
  }

  function incrementar(id: number) {
    const contador = contadores.find((item) => item.id === id);
    if (!contador) return;

    // La closure muta su propia `cuenta`: se llama acá, una sola vez por
    // click, y no dentro del updater (que Strict Mode ejecuta dos veces).
    const valor = contador.incrementar();
    setContadores((prev) =>
      prev.map((item) => (item.id === id ? { ...item, valor } : item)),
    );
  }

  function quitar(id: number) {
    setContadores((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Cada &ldquo;Nuevo contador&rdquo; ejecuta{" "}
        <code>crearContador()</code> otra vez, generando una closure nueva
        con su propia variable <code>cuenta</code>. Incrementar uno no
        afecta a los demás.
      </p>

      <button type="button" onClick={agregarContador} className={botonBase}>
        + Nuevo contador
      </button>

      {contadores.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          Todavía no creaste ningún contador.
        </span>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contadores.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"
            >
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Contador #{item.id}
                </span>
                <span className="font-mono text-lg text-foreground">{item.valor}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => incrementar(item.id)}
                  className="rounded-xl border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:border-accent/60"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => quitar(item.id)}
                  className="rounded-xl border border-error/30 bg-error-soft px-3 py-1.5 text-sm font-medium text-error transition-colors hover:border-error/60"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
