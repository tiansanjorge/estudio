"use client";

import { useState } from "react";
import type { CategoriaStatus, StatusCode } from "@/lib/modules/http/status-codes";

interface StatusCodeExploradorProps {
  codigos: StatusCode[];
}

const categorias: { valor: CategoriaStatus; etiqueta: string }[] = [
  { valor: "2xx", etiqueta: "2xx · Éxito" },
  { valor: "3xx", etiqueta: "3xx · Redirección" },
  { valor: "4xx", etiqueta: "4xx · Error del cliente" },
  { valor: "5xx", etiqueta: "5xx · Error del servidor" },
];

function claseFiltro(categoria: CategoriaStatus, activa: boolean): string {
  if (!activa) {
    return "border-border text-muted-foreground hover:text-foreground";
  }
  switch (categoria) {
    case "2xx":
      return "border-success bg-success-soft text-success";
    case "3xx":
      return "border-info bg-info-soft text-info";
    case "4xx":
      return "border-warning bg-warning-soft text-warning";
    case "5xx":
      return "border-error bg-error-soft text-error";
  }
}

function claseChip(categoria: CategoriaStatus): string {
  switch (categoria) {
    case "2xx":
      return "border-success/30 bg-success-soft text-success";
    case "3xx":
      return "border-info/30 bg-info-soft text-info";
    case "4xx":
      return "border-warning/30 bg-warning-soft text-warning";
    case "5xx":
      return "border-error/30 bg-error-soft text-error";
  }
}

export function StatusCodeExplorador({ codigos }: StatusCodeExploradorProps) {
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaStatus>("2xx");
  const [seleccionado, setSeleccionado] = useState<StatusCode | null>(null);

  const visibles = codigos.filter((c) => c.categoria === categoriaActiva);

  function elegirCategoria(categoria: CategoriaStatus) {
    setCategoriaActiva(categoria);
    setSeleccionado(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {categorias.map((item) => (
          <button
            key={item.valor}
            type="button"
            onClick={() => elegirCategoria(item.valor)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${claseFiltro(
              item.valor,
              item.valor === categoriaActiva,
            )}`}
          >
            {item.etiqueta}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {visibles.map((codigo) => (
          <button
            key={codigo.codigo}
            type="button"
            onClick={() => setSeleccionado(codigo)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${claseChip(
              codigo.categoria,
            )}`}
          >
            {codigo.codigo} {codigo.nombre}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        {seleccionado ? (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">
              {seleccionado.codigo} {seleccionado.nombre}
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              {seleccionado.descripcion}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              <span className="text-foreground">Ejemplo: </span>
              {seleccionado.ejemplo}
            </p>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            Elegí un código para ver el detalle.
          </span>
        )}
      </div>
    </div>
  );
}
