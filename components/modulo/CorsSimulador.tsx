"use client";

import { useState } from "react";
import { evaluarCors, type MetodoCors } from "@/lib/modules/http/cors";

const metodos: { valor: MetodoCors; etiqueta: string }[] = [
  { valor: "GET", etiqueta: "GET" },
  { valor: "POST-form", etiqueta: "POST (form)" },
  { valor: "POST-json", etiqueta: "POST (JSON)" },
  { valor: "PUT", etiqueta: "PUT" },
];

export function CorsSimulador() {
  const [metodo, setMetodo] = useState<MetodoCors>("GET");
  const [origenPermitido, setOrigenPermitido] = useState(true);

  const resultado = evaluarCors({ metodo, origenPermitido });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Método de la petición
        </span>
        <div className="flex flex-wrap gap-2">
          {metodos.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => setMetodo(item.valor)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                item.valor === metodo
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          El servidor incluye tu origen en Access-Control-Allow-Origin
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrigenPermitido(true)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              origenPermitido
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => setOrigenPermitido(false)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              !origenPermitido
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {resultado.requierePreflight
            ? "Requiere preflight (OPTIONS)"
            : "Request simple, sin preflight"}
        </span>
        <ol className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
          {resultado.pasos.map((paso, index) => (
            <li key={index}>
              <span className="text-foreground">{index + 1}.</span> {paso}
            </li>
          ))}
        </ol>
        <span
          className={`w-fit rounded-lg border px-3 py-1 text-sm font-medium ${
            resultado.resultado === "permitido"
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          {resultado.resultado === "permitido" ? "Permitido" : "Bloqueado"}
        </span>
      </div>
    </div>
  );
}
