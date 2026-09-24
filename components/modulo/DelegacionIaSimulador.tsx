"use client";

import { useState } from "react";
import { CUADRANTES, DECISIONES, TAREAS, type Decision } from "@/lib/modules/ia-aplicada/riesgos-limites-ia";

const NOMBRE_DECISION = Object.fromEntries(DECISIONES.map((d) => [d.id, d.nombre])) as Record<Decision, string>;

export function DelegacionIaSimulador() {
  const [respuestas, setRespuestas] = useState<Record<string, Decision>>({});
  const [revelado, setRevelado] = useState(false);
  const completas = TAREAS.every((t) => respuestas[t.id]);
  const aciertos = TAREAS.filter((t) => respuestas[t.id] === t.recomendada).length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        Para cada tarea, decidí cuánto se la dejarías a un asistente de IA.
      </p>

      <ul className="flex flex-col gap-3">
        {TAREAS.map((t) => {
          const elegida = respuestas[t.id];
          const acierto = elegida === t.recomendada;
          return (
            <li key={t.id} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3">
              <span className="text-sm text-foreground">{t.descripcion}</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.descripcion}>
                {DECISIONES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    role="radio"
                    aria-checked={elegida === d.id}
                    disabled={revelado}
                    onClick={() => setRespuestas((r) => ({ ...r, [t.id]: d.id }))}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors disabled:cursor-default ${
                      elegida === d.id ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d.nombre}
                  </button>
                ))}
              </div>
              {revelado && (
                <p className={`text-xs ${acierto ? "text-success" : "text-warning"}`}>
                  {acierto ? "✓ " : `Recomendado: ${NOMBRE_DECISION[t.recomendada]}. `}
                  <span className="text-muted-foreground">{t.razon}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRevelado(true)}
          disabled={!completas || revelado}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          {completas ? "Revelar" : `Faltan ${TAREAS.filter((t) => !respuestas[t.id]).length} tareas`}
        </button>
        <button
          type="button"
          onClick={() => {
            setRespuestas({});
            setRevelado(false);
          }}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Reiniciar
        </button>
      </div>

      {revelado && (
        <div className="flex flex-col gap-3" aria-live="polite">
          <span className="text-sm font-medium text-foreground">
            {aciertos} de {TAREAS.length} coinciden con la recomendación
          </span>
          <div className="grid gap-3 sm:grid-cols-2">
            {CUADRANTES.map((c) => {
              const tareas = TAREAS.filter((t) => t.costoError === c.costoError && t.verificable === c.verificable);
              return (
                <div key={c.titulo} className="flex flex-col gap-1 rounded-2xl border border-border p-3">
                  <span className="text-xs font-medium text-foreground">{c.titulo}</span>
                  {tareas.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Ninguna de estas tareas</span>
                  ) : (
                    <ul className="flex list-disc flex-col gap-0.5 pl-4 text-xs text-muted-foreground">
                      {tareas.map((t) => (
                        <li key={t.id}>{t.descripcion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Lo que decide no es qué tan difícil es la tarea para la IA, sino cuánto cuesta un error y qué tan fácil es
            detectarlo antes de que llegue a producción.
          </p>
        </div>
      )}
    </div>
  );
}
