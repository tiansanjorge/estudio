"use client";

import { useRef, useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

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

type Operacion =
  | { tipo: "crear"; id: number }
  | { tipo: "incrementar"; id: number; valor: number }
  | { tipo: "eliminar"; id: number };

const CODIGO = `
function crearContador() {
  let cuenta = 0;
  return () => {
    cuenta += 1;
    return cuenta;
  };
}`;

/** Líneas que se ejecutan en cada tipo de operación. */
const LINEAS_ACTIVAS: Record<Operacion["tipo"], number[]> = {
  crear: [2, 3, 6],
  incrementar: [4, 5],
  eliminar: [],
};

const botonBase =
  "rounded-xl border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

function describir(operacion: Operacion): string {
  const nombre = `contador${operacion.id}`;
  switch (operacion.tipo) {
    case "crear":
      return `const ${nombre} = crearContador();  // nuevo scope con cuenta = 0`;
    case "incrementar":
      return `${nombre}();  // → ${operacion.valor} (solo cambia SU cuenta)`;
    case "eliminar":
      return `${nombre} = null;  // nadie lo referencia: su scope puede ser recolectado`;
  }
}

export function FabricaDeContadores() {
  const [contadores, setContadores] = useState<Contador[]>([]);
  const [ultima, setUltima] = useState<Operacion | null>(null);
  const idRef = useRef(0);

  function agregarContador() {
    idRef.current += 1;
    const id = idRef.current;
    setContadores((prev) => [
      ...prev,
      { id, incrementar: crearContador(), valor: 0 },
    ]);
    setUltima({ tipo: "crear", id });
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
    setUltima({ tipo: "incrementar", id, valor });
  }

  function quitar(id: number) {
    setContadores((prev) => prev.filter((item) => item.id !== id));
    setUltima({ tipo: "eliminar", id });
  }

  const lineasActivas = ultima ? LINEAS_ACTIVAS[ultima.tipo] : [];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Cada &ldquo;Nuevo contador&rdquo; ejecuta{" "}
        <code>crearContador()</code> otra vez: se crea un scope nuevo con su
        propia variable <code>cuenta</code>, y la función que se retorna lo
        recuerda. Mirá qué líneas corren en cada click y cómo cada contador
        guarda su propia <code>cuenta</code>.
      </p>

      <BloqueCodigo codigo={CODIGO} resaltadas={lineasActivas} />

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={agregarContador} className={botonBase}>
          + Nuevo contador
        </button>
        <p
          aria-live="polite"
          className="min-w-0 flex-1 font-mono text-xs text-muted-foreground"
        >
          {ultima ? describir(ultima) : "Todavía no ejecutaste nada."}
        </p>
      </div>

      {contadores.length === 0 ? (
        <span className="text-sm text-muted-foreground">
          Todavía no creaste ningún contador.
        </span>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contadores.map((item) => {
            const tocado = ultima?.tipo !== "eliminar" && ultima?.id === item.id;
            return (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-xl border bg-background p-4 transition-colors ${
                  tocado ? "border-accent/60" : "border-border"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sm font-medium text-foreground">
                    contador{item.id}()
                  </span>
                  <span className="font-mono text-2xl text-foreground">
                    {item.valor}
                  </span>
                </div>

                <div className="flex flex-col gap-1 rounded-lg border border-dashed border-accent/40 bg-surface px-3 py-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Scope de la llamada #{item.id}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    cuenta: <span className="text-accent">{item.valor}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => incrementar(item.id)}
                    className="rounded-xl border border-accent/30 bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:border-accent/60"
                  >
                    Llamar (+1)
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
            );
          })}
        </div>
      )}
    </div>
  );
}
