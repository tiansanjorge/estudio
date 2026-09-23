"use client";

import { useState } from "react";
import {
  CAPAS_SEPARADAS,
  CONTROLLER_GORDO,
  RESPONSABILIDADES,
  type Linea,
  type Responsabilidad,
} from "@/lib/modules/backend/arquitectura-capas";

const COLOR: Record<Responsabilidad, { fondo: string; texto: string }> = {
  http: { fondo: "bg-info-soft", texto: "text-info" },
  negocio: { fondo: "bg-accent-soft", texto: "text-accent" },
  datos: { fondo: "bg-warning-soft", texto: "text-warning" },
};

function Codigo({ lineas, resaltada }: { lineas: Linea[]; resaltada: Responsabilidad | null }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5">
      {lineas.map((l, i) => {
        const activa = l.resp && (resaltada === null || resaltada === l.resp);
        return (
          <div
            key={i}
            className={`rounded px-1 ${
              activa && l.resp ? `${COLOR[l.resp].fondo} text-foreground` : "text-muted-foreground"
            } ${resaltada && l.resp !== resaltada ? "opacity-40" : ""}`}
          >
            {l.texto}
          </div>
        );
      })}
    </pre>
  );
}

export function CapasRefactorVisor() {
  const [vista, setVista] = useState<"antes" | "despues">("antes");
  const [resaltada, setResaltada] = useState<Responsabilidad | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            ["antes", "Controller gordo"],
            ["despues", "Separado en capas"],
          ] as const
        ).map(([id, texto]) => (
          <button
            key={id}
            type="button"
            aria-pressed={vista === id}
            onClick={() => setVista(id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              vista === id ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {texto}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Resaltar responsabilidad">
        {RESPONSABILIDADES.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-pressed={resaltada === r.id}
            onClick={() => setResaltada((actual) => (actual === r.id ? null : r.id))}
            className={`rounded-lg border px-2.5 py-1 text-xs ${COLOR[r.id].texto} ${
              resaltada === r.id ? `${COLOR[r.id].fondo} border-current` : "border-border"
            }`}
          >
            {r.nombre} → {r.capa}
          </button>
        ))}
      </div>

      {vista === "antes" ? (
        <Codigo lineas={CONTROLLER_GORDO} resaltada={resaltada} />
      ) : (
        <div className="flex flex-col gap-3">
          {CAPAS_SEPARADAS.map((archivo) => (
            <div key={archivo.archivo} className="flex flex-col gap-1">
              <span className="font-mono text-xs text-muted-foreground">{archivo.archivo}</span>
              <Codigo lineas={archivo.lineas} resaltada={resaltada} />
            </div>
          ))}
        </div>
      )}

      <ul className="grid gap-2 sm:grid-cols-3">
        {RESPONSABILIDADES.map((r) => (
          <li key={r.id} className={`rounded-xl border border-border p-3 text-xs ${COLOR[r.id].fondo}`}>
            <p className={`font-medium ${COLOR[r.id].texto}`}>{r.capa}</p>
            <p className="mt-1 text-foreground">{r.descripcion}</p>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        {vista === "antes"
          ? "Todo mezclado en un handler: para testear la regla del descuento hace falta levantar HTTP y una base, y reutilizarla desde un job es imposible."
          : "La regla del descuento vive en el servicio, sin HTTP ni SQL: se testea con un repositorio falso y se reutiliza desde cualquier entrada. El reloj también se inyecta, así el vencimiento se prueba sin depender de la fecha real."}
      </p>
    </div>
  );
}
