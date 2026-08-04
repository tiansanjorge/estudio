"use client";

import { useState } from "react";

function medirCrearNodosDom(cantidad: number): number {
  const inicio = performance.now();
  const contenedor = document.createElement("div");
  for (let i = 0; i < cantidad; i++) {
    const nodo = document.createElement("div");
    nodo.className = "item";
    nodo.textContent = `Item ${i}`;
    contenedor.appendChild(nodo);
  }
  return performance.now() - inicio;
}

function medirCrearObjetosVirtuales(cantidad: number): number {
  const inicio = performance.now();
  const elementos: Array<{ type: string; props: { className: string; children: string } }> = [];
  for (let i = 0; i < cantidad; i++) {
    elementos.push({ type: "div", props: { className: "item", children: `Item ${i}` } });
  }
  return performance.now() - inicio;
}

const opcionesCantidad = [100, 1000, 5000];

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

export function CostoDomDemo() {
  const [cantidad, setCantidad] = useState(1000);
  const [resultado, setResultado] = useState<{ dom: number; virtual: number } | null>(null);

  function medir() {
    const dom = medirCrearNodosDom(cantidad);
    const virtual = medirCrearObjetosVirtuales(cantidad);
    setResultado({ dom, virtual });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cantidad de elementos
        </span>
        <div className="flex flex-wrap gap-2">
          {opcionesCantidad.map((valor) => (
            <button
              key={valor}
              type="button"
              onClick={() => setCantidad(valor)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                valor === cantidad
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {valor}
            </button>
          ))}
        </div>
      </div>

      <button type="button" onClick={medir} className={`w-fit ${botonBase}`}>
        Medir tiempo real en este navegador
      </button>

      {resultado && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-xl border border-warning/30 bg-warning-soft p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-warning">
              Crear {cantidad} nodos DOM reales
            </span>
            <span className="font-mono text-2xl text-warning">{resultado.dom.toFixed(2)}ms</span>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-success/30 bg-success-soft p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-success">
              Crear {cantidad} objetos JS livianos
            </span>
            <span className="font-mono text-2xl text-success">
              {resultado.virtual.toFixed(2)}ms
            </span>
          </div>
        </div>
      )}

      <p className="text-sm leading-6 text-muted-foreground">
        Esto no mide a React contra JS &ldquo;vanilla&rdquo; — mide algo
        más específico y honesto: crear nodos DOM reales tiene un costo
        medible, mientras que crear objetos JS planos (la materia prima
        del Virtual DOM) es órdenes de magnitud más barato. Ese costo
        real es la razón por la que conviene calcular primero en objetos
        livianos qué cambió, antes de tocar el DOM.
      </p>
    </div>
  );
}
