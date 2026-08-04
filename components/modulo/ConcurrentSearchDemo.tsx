"use client";

import { useMemo, useState, useTransition } from "react";
import { productosDemo } from "@/lib/modules/react-rendering/productos-lista";

const LIMITE_RENDER = 2000;

export function ConcurrentSearchDemo() {
  const [conTransition, setConTransition] = useState(true);
  const [query, setQuery] = useState("");
  const [queryFiltro, setQueryFiltro] = useState("");
  const [isPending, startTransition] = useTransition();

  const filtrados = useMemo(() => {
    const buscado = queryFiltro.toLowerCase();
    return productosDemo.filter((producto) => producto.toLowerCase().includes(buscado));
  }, [queryFiltro]);

  function manejarCambio(valor: string) {
    setQuery(valor);
    if (conTransition) {
      startTransition(() => {
        setQueryFiltro(valor);
      });
    } else {
      setQueryFiltro(valor);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        8000 productos reales, filtrados y re-renderizados en cada tecla
        (hasta {LIMITE_RENDER} filas a la vez). El lag depende de tu
        dispositivo — en modo desarrollo se nota más que en producción.
      </p>

      <button
        type="button"
        onClick={() => setConTransition((v) => !v)}
        className={`w-fit rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
          conTransition
            ? "border-success/30 bg-success-soft text-success"
            : "border-warning/30 bg-warning-soft text-warning"
        }`}
      >
        {conTransition ? "CON startTransition" : "SIN startTransition"}
      </button>

      <input
        value={query}
        onChange={(event) => manejarCambio(event.target.value)}
        placeholder="Buscá entre 8000 productos..."
        className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
      />

      <div className="flex items-center gap-3">
        {isPending && (
          <span className="rounded-lg border border-warning/30 bg-warning-soft px-3 py-1 text-xs font-medium text-warning">
            Actualizando lista…
          </span>
        )}
        <span className="text-xs text-muted-foreground">
          {filtrados.length} resultados (mostrando hasta {LIMITE_RENDER})
        </span>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-xl border border-border bg-background p-2">
        {filtrados.slice(0, LIMITE_RENDER).map((producto, index) => (
          <div key={index} className="px-2 py-1 font-mono text-xs text-foreground">
            {producto}
          </div>
        ))}
      </div>
    </div>
  );
}
