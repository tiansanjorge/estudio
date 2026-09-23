"use client";

import { useState } from "react";
import { CASOS } from "@/lib/modules/seguridad/owasp-top-10";

export function OwaspCazador() {
  const [respuestas, setRespuestas] = useState<Record<string, number>>({});
  const aciertos = CASOS.filter((c) => respuestas[c.id] === c.correcta).length;
  const respondidas = Object.keys(respuestas).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">¿Qué categoría del OWASP Top 10 aplica a cada fragmento?</p>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
          {aciertos}/{respondidas} aciertos
        </span>
      </div>

      <ul className="flex flex-col gap-4">
        {CASOS.map((caso) => {
          const respuesta = respuestas[caso.id];
          const respondida = respuesta !== undefined;
          return (
            <li key={caso.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
              <p className="text-sm font-medium text-foreground">{caso.titulo}</p>
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-5 text-foreground">
                {caso.codigo}
              </pre>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`Categoría para ${caso.titulo}`}>
                {caso.opciones.map((opcion, i) => {
                  const esCorrecta = i === caso.correcta;
                  const elegida = respuesta === i;
                  return (
                    <button
                      key={opcion}
                      type="button"
                      disabled={respondida}
                      onClick={() => setRespuestas((r) => ({ ...r, [caso.id]: i }))}
                      className={`rounded-xl border px-3 py-1.5 text-xs transition-colors disabled:cursor-default ${
                        !respondida
                          ? "border-border text-muted-foreground hover:border-accent hover:text-accent"
                          : esCorrecta
                            ? "border-success/30 bg-success-soft text-success"
                            : elegida
                              ? "border-error/30 bg-error-soft text-error"
                              : "border-border text-muted-foreground opacity-60"
                      }`}
                    >
                      {opcion}
                    </button>
                  );
                })}
              </div>
              {respondida && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-foreground">{caso.explicacion}</p>
                  <pre className="overflow-x-auto rounded-lg border border-success/30 bg-success-soft p-3 font-mono text-xs leading-5 text-foreground">
                    {caso.fix}
                  </pre>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
