"use client";

import { useState } from "react";
import {
  ARQUITECTURAS,
  ESCENARIOS,
  type Veredicto,
} from "@/lib/modules/arquitectura/monolito-microservicios";

const ESTILO_VEREDICTO: Record<Veredicto, string> = {
  encaja: "border-success/30 bg-success-soft text-success",
  depende: "border-warning/30 bg-warning-soft text-warning",
  "no-encaja": "border-error/30 bg-error-soft text-error",
};

const NOMBRE_VEREDICTO: Record<Veredicto, string> = {
  encaja: "encaja bien",
  depende: "tiene costos",
  "no-encaja": "no conviene",
};

export function ArquitecturaEscenarios() {
  const [escenarioId, setEscenarioId] = useState(ESCENARIOS[0].id);
  const escenario = ESCENARIOS.find((e) => e.id === escenarioId) ?? ESCENARIOS[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Escenario">
        {ESCENARIOS.map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={e.id === escenarioId}
            onClick={() => setEscenarioId(e.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              e.id === escenarioId
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.titulo}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">{escenario.contexto}</p>

      <div className="grid gap-4 md:grid-cols-3">
        {ARQUITECTURAS.map((a) => {
          const evaluacion = escenario.evaluaciones[a.id];
          return (
            <article key={a.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-foreground">{a.nombre}</h3>
                <p className="text-xs text-muted-foreground">{a.resumen}</p>
              </div>
              <span
                className={`self-start rounded-md border px-2 py-0.5 text-[11px] ${ESTILO_VEREDICTO[evaluacion.veredicto]}`}
              >
                {NOMBRE_VEREDICTO[evaluacion.veredicto]}
              </span>
              <ul className="flex flex-col gap-2 text-xs leading-5 text-foreground">
                {evaluacion.detalle.map((d) => (
                  <li key={d} className="flex gap-2">
                    <span className="text-muted-foreground" aria-hidden="true">
                      ·
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Ninguna arquitectura gana en todos los escenarios: cada una cambia qué es barato y qué es
        caro. La pregunta no es cuál es mejor, sino qué problema concreto tiene hoy tu equipo.
      </p>
    </div>
  );
}
