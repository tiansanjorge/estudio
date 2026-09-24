"use client";

import { useState } from "react";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { EJERCICIOS, type EjercicioId } from "@/lib/modules/system-design/ejercicios-guiados";

export function EjercicioGuiado() {
  const [ejercicioId, setEjercicioId] = useState<EjercicioId>("acortador");
  const [indice, setIndice] = useState(0);
  const ejercicio = EJERCICIOS.find((e) => e.id === ejercicioId) ?? EJERCICIOS[0];
  const paso = ejercicio.pasos[indice];

  function elegir(id: EjercicioId) {
    setEjercicioId(id);
    setIndice(0);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Ejercicio">
        {EJERCICIOS.map((e) => (
          <button
            key={e.id}
            type="button"
            role="radio"
            aria-checked={e.id === ejercicioId}
            onClick={() => elegir(e.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              e.id === ejercicioId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {e.nombre}
          </button>
        ))}
      </div>

      <p className="text-sm leading-6 text-foreground">{ejercicio.enunciado}</p>

      <ol className="flex flex-wrap gap-2" aria-label="Pasos">
        {ejercicio.pasos.map((p, i) => (
          <li key={p.titulo}>
            <button
              type="button"
              onClick={() => setIndice(i)}
              aria-current={i === indice ? "step" : undefined}
              className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                i === indice ? "border-accent text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.titulo}
            </button>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4">
        <span className="text-sm font-medium text-foreground">{paso.titulo}</span>
        <p className="text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">Antes de revelar:</strong> {paso.consigna}
        </p>
        {/* la key reinicia el estado de "revelado" al cambiar de paso o de ejercicio */}
        <RevelarSolucion
          key={`${ejercicioId}-${indice}`}
          idRespuesta={`${ejercicioId}-${indice}`}
          etiqueta="Ver una respuesta posible"
        >
          <ul className="flex list-disc flex-col gap-2 pl-5">
            {paso.respuesta.map((linea) => (
              <li key={linea}>{linea}</li>
            ))}
          </ul>
        </RevelarSolucion>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setIndice((i) => i - 1)}
          disabled={indice === 0}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setIndice((i) => i + 1)}
          disabled={indice === ejercicio.pasos.length - 1}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          Siguiente paso
        </button>
      </div>
    </div>
  );
}
