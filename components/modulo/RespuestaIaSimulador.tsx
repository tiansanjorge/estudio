"use client";

import { useState } from "react";
import { FRAGMENTOS, PREGUNTA_ENTREVISTADOR, SENALES, evaluar } from "@/lib/modules/ia-aplicada/metodologia-ia-entrevista";

const NOMBRE_SENAL = Object.fromEntries(SENALES.map((s) => [s.id, s.nombre]));

export function RespuestaIaSimulador() {
  const [elegidos, setElegidos] = useState<string[]>([]);
  const { cubiertas, faltantes, debiles } = evaluar(elegidos);
  const respuesta = FRAGMENTOS.filter((f) => elegidos.includes(f.id))
    .map((f) => f.texto)
    .join(" ");

  function alternar(id: string) {
    setElegidos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-foreground">
        <strong>Entrevistador:</strong> &quot;{PREGUNTA_ENTREVISTADOR}&quot;
      </p>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Armá tu respuesta eligiendo frases</legend>
        {FRAGMENTOS.map((f) => (
          <label key={f.id} className="flex items-start gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={elegidos.includes(f.id)}
              onChange={() => alternar(f.id)}
              className="mt-1 accent-accent"
            />
            {f.texto}
          </label>
        ))}
      </fieldset>

      {elegidos.length > 0 && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4" aria-live="polite">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">Tu respuesta</span>
            <p className="text-sm leading-6 text-foreground">{respuesta}</p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              Señales que transmite: {cubiertas.length} de {SENALES.length}
            </span>
            <div className="flex flex-wrap gap-2">
              {SENALES.map((s) => (
                <span
                  key={s.id}
                  className={`rounded-lg border px-2 py-0.5 text-xs ${
                    cubiertas.includes(s.id) ? "border-success/30 bg-success-soft text-success" : "border-border text-muted-foreground"
                  }`}
                >
                  {cubiertas.includes(s.id) ? "✓" : "·"} {s.nombre}
                </span>
              ))}
            </div>
          </div>

          {debiles.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-error">Alertas para quien entrevista</span>
              <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-foreground">
                {debiles.map((f) => (
                  <li key={f.id}>
                    &quot;{f.texto}&quot; <span className="text-muted-foreground">{f.feedback}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {debiles.length === 0 && faltantes.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Podrías sumar: {faltantes.map((s) => NOMBRE_SENAL[s].toLowerCase()).join(", ")}.
            </p>
          )}
          {debiles.length === 0 && faltantes.length === 0 && (
            <p className="text-sm text-success">
              Respuesta completa. En una entrevista real, decila con tus palabras y con tu propio ejemplo: tiene que ser verdad.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
