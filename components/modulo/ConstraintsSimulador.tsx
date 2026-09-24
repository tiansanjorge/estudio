"use client";

import { useId, useState } from "react";
import {
  CATEGORIAS_EXISTENTES,
  DDL_PRODUCTOS,
  FILA_INICIAL,
  SKUS_EXISTENTES,
  insertar,
  type FilaProducto,
} from "@/lib/modules/bases-de-datos/postgres-especifico";

const CAMPOS: { campo: keyof FilaProducto; etiqueta: string }[] = [
  { campo: "sku", etiqueta: "sku" },
  { campo: "nombre", etiqueta: "nombre" },
  { campo: "precio", etiqueta: "precio" },
  { campo: "stock", etiqueta: "stock (vacío = default 0)" },
  { campo: "categoriaId", etiqueta: "categoria_id" },
];

export function ConstraintsSimulador() {
  const [fila, setFila] = useState<FilaProducto>(FILA_INICIAL);
  const idBase = useId();
  const resultado = insertar(fila);

  return (
    <div className="flex flex-col gap-6">
      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
        {DDL_PRODUCTOS}
      </pre>

      <p className="text-xs text-muted-foreground">
        Ya existen los SKU {SKUS_EXISTENTES.join(" y ")}, y las categorías {CATEGORIAS_EXISTENTES.join(", ")}. Un
        campo vacío se envía como NULL (en Postgres, un string vacío no es NULL).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {CAMPOS.map(({ campo, etiqueta }) => (
          <div key={campo} className="flex flex-col gap-1">
            <label htmlFor={`${idBase}-${campo}`} className="font-mono text-xs text-muted-foreground">
              {etiqueta}
            </label>
            <input
              id={`${idBase}-${campo}`}
              value={fila[campo]}
              onChange={(e) => setFila((f) => ({ ...f, [campo]: e.target.value }))}
              className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div
        className={`flex flex-col gap-2 rounded-2xl border p-4 ${
          resultado.ok ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${resultado.ok ? "text-success" : "text-error"}`}>
          {resultado.ok ? "La base acepta la fila" : `Rechazada por: ${resultado.constraint}`}
        </span>
        <pre className="whitespace-pre-wrap break-words font-mono text-xs text-foreground">{resultado.mensaje}</pre>
      </div>

      <p className="text-xs text-muted-foreground">
        Probá dejar el nombre vacío, un precio de 0, stock negativo, el SKU TEC-001 o la categoría 9. Estas reglas se
        cumplen aunque la fila venga de otro servicio, de un script o de una consulta manual.
      </p>
    </div>
  );
}
