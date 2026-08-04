"use client";

import { useState } from "react";
import type { NodoComponente } from "@/lib/modules/react-core/arbol";
import { ArbolComponentes } from "./ArbolComponentes";

const opcionesCantidad = [1, 3, 5];

export function ConstructorDeUI() {
  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [mostrarFooter, setMostrarFooter] = useState(true);
  const [cantidadProductos, setCantidadProductos] = useState(3);

  const arbol: NodoComponente = {
    nombre: "App",
    hijos: [
      ...(mostrarHeader ? [{ nombre: "Header" }] : []),
      {
        nombre: "Main",
        hijos: [
          {
            nombre: "ProductList",
            props: { productos: `${cantidadProductos} items` },
            hijos: Array.from({ length: cantidadProductos }, (_, index) => ({
              nombre: "ProductCard",
              props: { nombre: `Producto ${index + 1}` },
            })),
          },
        ],
      },
      ...(mostrarFooter ? [{ nombre: "Footer" }] : []),
    ],
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMostrarHeader((v) => !v)}
          className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
            mostrarHeader
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Header {mostrarHeader ? "✓" : ""}
        </button>
        <button
          type="button"
          onClick={() => setMostrarFooter((v) => !v)}
          className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
            mostrarFooter
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Footer {mostrarFooter ? "✓" : ""}
        </button>
        {opcionesCantidad.map((cantidad) => (
          <button
            key={cantidad}
            type="button"
            onClick={() => setCantidadProductos(cantidad)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              cantidad === cantidadProductos
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cantidad} ProductCard
          </button>
        ))}
      </div>

      <ArbolComponentes nodo={arbol} />

      <p className="text-sm leading-6 text-muted-foreground">
        Fijate que <code>ProductCard</code> es EL MISMO componente repetido{" "}
        {cantidadProductos} {cantidadProductos === 1 ? "vez" : "veces"} con
        props distintos — no se copió código, se reutilizó.
      </p>
    </div>
  );
}
