"use client";

import { useState } from "react";
import {
  CAPAS,
  INCIDENTES,
  MATRIZ,
  MODELOS,
  NOTAS_COMPARTIDO,
  type ModeloServicio,
  type Responsable,
} from "@/lib/modules/cloud/responsabilidad-compartida";

const ESTILO: Record<Responsable, string> = {
  cliente: "border-accent/30 bg-accent-soft text-foreground",
  proveedor: "border-border bg-surface text-muted-foreground",
  compartido: "border-warning/30 bg-warning-soft text-foreground",
};

const ETIQUETA: Record<Responsable, string> = {
  cliente: "Vos",
  proveedor: "Proveedor",
  compartido: "Compartido",
};

export function ResponsabilidadSimulador() {
  const [modelo, setModelo] = useState<ModeloServicio>("iaas");
  const matriz = MATRIZ[modelo];
  const notas = NOTAS_COMPARTIDO[modelo] ?? {};
  const actual = MODELOS.find((m) => m.id === modelo) ?? MODELOS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Modelo de servicio">
          {MODELOS.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={m.id === modelo}
              onClick={() => setModelo(m.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                m.id === modelo ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.nombre}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Por ejemplo: {actual.ejemplo}</span>
      </div>

      <ol className="flex flex-col gap-1.5" aria-live="polite">
        {CAPAS.map((capa) => {
          const responsable = matriz[capa.id];
          const nota = notas[capa.id];
          return (
            <li key={capa.id} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${ESTILO[responsable]}`}>
              <span>{capa.nombre}</span>
              <span className="text-xs font-medium">
                {ETIQUETA[responsable]}
                {nota ? ` · ${nota}` : ""}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
        <span className="text-sm font-medium text-foreground">¿Quién tenía que evitarlo?</span>
        <ul className="flex flex-col gap-1.5">
          {INCIDENTES.map((incidente) => {
            const responsable = matriz[incidente.capa];
            return (
              <li key={incidente.descripcion} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{incidente.descripcion}</span>
                <span className={`text-xs font-medium ${responsable === "proveedor" ? "text-muted-foreground" : "text-accent"}`}>
                  {ETIQUETA[responsable]}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-muted-foreground">
          Los datos, los accesos y la configuración nunca pasan al proveedor, en ningún modelo: es donde ocurre la
          mayoría de los incidentes en la nube.
        </p>
      </div>
    </div>
  );
}
