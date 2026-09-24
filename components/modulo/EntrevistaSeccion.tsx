"use client";

import { useState } from "react";
import type { PreguntaEntrevista } from "@/lib/modules/types";

interface EntrevistaSeccionProps {
  preguntas: PreguntaEntrevista[];
}

export function EntrevistaSeccion({ preguntas }: EntrevistaSeccionProps) {
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  if (preguntas.length === 0) {
    return (
      <p className="text-base text-muted-foreground">
        Todavía no hay preguntas de entrevista para este nivel.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-border p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setIdioma("es")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              idioma === "es"
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setIdioma("en")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              idioma === "en"
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {preguntas.map((item, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 rounded-xl border border-border p-4"
          >
            <p className="font-medium text-foreground">{item.pregunta}</p>
            <p className="prosa">
              {idioma === "es" ? item.respuestaEs : item.respuestaEn}
            </p>
            {item.codigo && (
              <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground">
                {item.codigo}
              </pre>
            )}
            {item.tradeoffs && (
              <p className="prosa">
                <span className="font-medium text-foreground">
                  Trade-offs:{" "}
                </span>
                {item.tradeoffs}
              </p>
            )}
            {item.repregunta && (
              <div className="flex flex-col gap-1 rounded-lg bg-accent-soft/50 p-3">
                <p className="text-base font-medium text-accent">
                  Repregunta: {item.repregunta}
                </p>
                {(item.respuestaRepreguntaEs || item.respuestaRepreguntaEn) && (
                  <p className="prosa">
                    {idioma === "es"
                      ? item.respuestaRepreguntaEs
                      : item.respuestaRepreguntaEn}
                  </p>
                )}
                {item.codigoRepregunta && (
                  <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs text-foreground">
                    {item.codigoRepregunta}
                  </pre>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
