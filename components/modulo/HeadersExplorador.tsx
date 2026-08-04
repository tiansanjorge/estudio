"use client";

import { useState } from "react";
import type { HeaderHttp, TipoHeader } from "@/lib/modules/http/headers";

interface HeadersExploradorProps {
  headers: HeaderHttp[];
}

const tipos: { valor: TipoHeader; etiqueta: string }[] = [
  { valor: "request", etiqueta: "Request headers" },
  { valor: "response", etiqueta: "Response headers" },
];

export function HeadersExplorador({ headers }: HeadersExploradorProps) {
  const [tipoActivo, setTipoActivo] = useState<TipoHeader>("request");
  const [seleccionado, setSeleccionado] = useState<HeaderHttp | null>(null);

  const visibles = headers.filter((h) => h.tipo === tipoActivo);

  function elegirTipo(tipo: TipoHeader) {
    setTipoActivo(tipo);
    setSeleccionado(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {tipos.map((item) => (
          <button
            key={item.valor}
            type="button"
            onClick={() => elegirTipo(item.valor)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              item.valor === tipoActivo
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.etiqueta}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {visibles.map((header) => (
          <button
            key={`${header.tipo}-${header.nombre}`}
            type="button"
            onClick={() => setSeleccionado(header)}
            className="rounded-xl border border-border bg-surface px-3 py-1.5 font-mono text-sm text-foreground transition-colors hover:border-accent/60 hover:text-accent"
          >
            {header.nombre}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background p-5">
        {seleccionado ? (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-sm font-semibold text-foreground">
              {seleccionado.nombre}
            </span>
            <p className="text-sm leading-6 text-muted-foreground">
              {seleccionado.descripcion}
            </p>
            <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
              {seleccionado.ejemplo}
            </pre>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">
            Elegí un header para ver el detalle.
          </span>
        )}
      </div>
    </div>
  );
}
