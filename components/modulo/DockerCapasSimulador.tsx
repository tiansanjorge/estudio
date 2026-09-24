"use client";

import { useState } from "react";
import { CAMBIOS, VARIANTES, construir, type Cambio } from "@/lib/modules/ci-cd/docker";

function Opciones<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; nombre: string }[];
  valor: T;
  onCambio: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === valor ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DockerCapasSimulador() {
  const [varianteId, setVarianteId] = useState(VARIANTES[0].id);
  const [cambio, setCambio] = useState<Cambio>("codigo");
  const variante = VARIANTES.find((v) => v.id === varianteId) ?? VARIANTES[0];
  const { capas, segundos } = construir(variante, cambio);

  return (
    <div className="flex flex-col gap-6">
      <Opciones etiqueta="Dockerfile" opciones={VARIANTES} valor={varianteId} onCambio={setVarianteId} />
      <Opciones etiqueta="Desde el último build" opciones={CAMBIOS} valor={cambio} onCambio={setCambio} />

      <ol className="flex flex-col gap-1 rounded-xl border border-border bg-background p-3" aria-live="polite">
        {capas.map((capa, i) => (
          <li key={i} className="flex items-center justify-between gap-3 font-mono text-xs">
            <span className="break-all text-foreground">{capa.instruccion}</span>
            <span className={`shrink-0 ${capa.cacheada ? "text-success" : "text-warning"}`}>
              {capa.cacheada ? "CACHED" : capa.segundos > 0 ? `${capa.segundos}s` : "rebuild"}
            </span>
          </li>
        ))}
      </ol>

      <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-border p-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Tiempo de build</dt>
          <dd className="font-medium text-foreground">{segundos} s</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-muted-foreground">Tamaño aproximado de la imagen</dt>
          <dd className="font-medium text-foreground">{variante.tamanioMb} MB</dd>
        </div>
        <p className="col-span-2 text-muted-foreground">{variante.nota}</p>
      </dl>
    </div>
  );
}
