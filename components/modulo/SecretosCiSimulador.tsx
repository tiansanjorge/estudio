"use client";

import { useState } from "react";
import {
  ENTORNOS,
  EVENTOS,
  resolverAcceso,
  type EntornoJob,
  type EventoWorkflow,
} from "@/lib/modules/ci-cd/variables-secretos-ci";

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

export function SecretosCiSimulador() {
  const [evento, setEvento] = useState<EventoWorkflow>("pr-interno");
  const [entorno, setEntorno] = useState<EntornoJob>("staging");
  const resultado = resolverAcceso(evento, entorno);

  return (
    <div className="flex flex-col gap-6">
      <Opciones etiqueta="Qué disparó el workflow" opciones={EVENTOS} valor={evento} onCambio={setEvento} />
      <Opciones etiqueta="Environment del job" opciones={ENTORNOS} valor={entorno} onCambio={setEntorno} />

      <div className="flex flex-col gap-3 rounded-2xl border border-border p-4" aria-live="polite">
        {resultado.bloqueo ? (
          <span className="text-sm font-medium text-error">{resultado.bloqueo}</span>
        ) : (
          <>
            {resultado.requiereAprobacion && (
              <span className="text-sm font-medium text-warning">Esperando aprobación de un revisor…</span>
            )}
            <ul className="flex flex-col gap-2">
              {resultado.secretos.map((s) => (
                <li key={`${s.nombre}-${s.origen}`} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                  <span>
                    <code className="font-mono text-xs text-foreground">secrets.{s.nombre}</code>{" "}
                    <span className="text-xs text-muted-foreground">({s.origen})</span>
                  </span>
                  <span className={`font-mono text-xs ${s.disponible ? "text-success" : "text-muted-foreground"}`}>
                    {s.disponible ? "***" : "vacío"}
                  </span>
                </li>
              ))}
            </ul>
            <span className="text-sm text-foreground">
              <code className="font-mono text-xs">GITHUB_TOKEN</code>: {resultado.token}
            </span>
          </>
        )}
        <p className="text-sm text-muted-foreground">{resultado.nota}</p>
      </div>
    </div>
  );
}
