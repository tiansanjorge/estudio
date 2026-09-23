"use client";

import { useState } from "react";
import {
  PROBLEMAS,
  contarAciertos,
  type Deteccion,
} from "@/lib/modules/accesibilidad/testing-accesibilidad";

const OPCIONES: { valor: Deteccion; etiqueta: string }[] = [
  { valor: "si", etiqueta: "axe lo detecta" },
  { valor: "no", etiqueta: "Hace falta prueba manual" },
];

export function AxeDeteccionJuego() {
  const [respuestas, setRespuestas] = useState<Record<string, Deteccion>>({});
  const { aciertos, respondidas } = contarAciertos(respuestas);
  const detectables = PROBLEMAS.filter((p) => p.deteccion === "si").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Para cada problema: ¿lo encuentra una herramienta automática como axe?
        </p>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
          {aciertos}/{respondidas} aciertos
        </span>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {PROBLEMAS.map((problema) => {
          const respuesta = respuestas[problema.id];
          const acerto = respuesta === problema.deteccion;
          return (
            <li
              key={problema.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <p className="text-sm font-medium text-foreground">{problema.descripcion}</p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground">
                {problema.codigo}
              </pre>
              {respuesta ? (
                <div
                  className={`rounded-lg border px-3 py-2 text-xs text-foreground ${
                    acerto ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
                  }`}
                >
                  <p className={`font-medium ${acerto ? "text-success" : "text-error"}`}>
                    {acerto ? "Correcto" : "No"}:{" "}
                    {problema.deteccion === "si"
                      ? `axe lo reporta (${problema.regla})`
                      : "axe no lo ve"}
                  </p>
                  <p className="mt-1">{problema.explicacion}</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {OPCIONES.map(({ valor, etiqueta }) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => setRespuestas((r) => ({ ...r, [problema.id]: valor }))}
                      className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {etiqueta}
                    </button>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {respondidas === PROBLEMAS.length && (
        <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
          De estos {PROBLEMAS.length} problemas, axe detecta {detectables}. Lo que se escapa
          es justamente lo que más afecta la experiencia: comportamiento, foco,
          significado. Las herramientas automáticas son el piso, no el techo.
        </p>
      )}
    </div>
  );
}
