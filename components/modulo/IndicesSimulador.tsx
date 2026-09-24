"use client";

import { useState } from "react";
import {
  CONSULTAS,
  FILAS_TABLA,
  INDICES,
  costoEscritura,
  planificar,
  type IndiceId,
} from "@/lib/modules/bases-de-datos/indices-performance";

const formato = new Intl.NumberFormat("es-AR");

export function IndicesSimulador() {
  const [activos, setActivos] = useState<IndiceId[]>(["email"]);
  const [consultaId, setConsultaId] = useState(CONSULTAS[0].id);
  const consulta = CONSULTAS.find((c) => c.id === consultaId) ?? CONSULTAS[0];
  const resultado = planificar(consulta, activos);
  const proporcion = resultado.filasExaminadas / FILAS_TABLA;

  function alternar(id: IndiceId) {
    setActivos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Índices sobre <code className="font-mono">pedidos</code> ({formato.format(FILAS_TABLA)} filas)
        </legend>
        {INDICES.map((i) => (
          <label key={i.id} className="flex items-center gap-2 font-mono text-xs text-foreground">
            <input type="checkbox" checked={activos.includes(i.id)} onChange={() => alternar(i.id)} className="accent-accent" />
            {i.ddl}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Consulta</span>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Consulta">
          {CONSULTAS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={c.id === consultaId}
              onClick={() => setConsultaId(c.id)}
              className={`rounded-xl border px-3 py-2 text-left font-mono text-xs transition-colors ${
                c.id === consultaId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.sql}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`flex flex-col gap-3 rounded-2xl border p-4 ${
          resultado.usaIndice ? "border-success/30 bg-success-soft" : "border-warning/30 bg-warning-soft"
        }`}
        aria-live="polite"
      >
        <span className={`font-mono text-sm font-medium ${resultado.usaIndice ? "text-success" : "text-warning"}`}>
          → {resultado.plan}
        </span>
        <div className="flex flex-col gap-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full ${resultado.usaIndice ? "bg-success" : "bg-warning"}`}
              style={{ width: `${Math.max(proporcion * 100, 0.5)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Filas examinadas: {formato.format(resultado.filasExaminadas)} · devueltas: {formato.format(consulta.filasResultado)}
          </span>
        </div>
        <p className="text-sm text-foreground">{resultado.nota}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        Costo de cada INSERT: escribir la fila + {activos.length} índice{activos.length === 1 ? "" : "s"} ={" "}
        {costoEscritura(activos)} estructuras a actualizar.
      </p>
    </div>
  );
}
