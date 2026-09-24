"use client";

import { useState } from "react";
import {
  ESCENARIOS,
  NIVELES_AISLAMIENTO,
  esError,
  resultadoPaso,
  type NivelAislamiento,
} from "@/lib/modules/bases-de-datos/transacciones-acid";

function Selector<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; nombre: string }[];
  valor: T;
  onCambio: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === valor ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TransaccionesSimulador() {
  const [escenarioId, setEscenarioId] = useState(ESCENARIOS[0].id);
  const [nivel, setNivel] = useState<NivelAislamiento>("read-committed");
  const [ejecutados, setEjecutados] = useState(0);
  const escenario = ESCENARIOS.find((e) => e.id === escenarioId) ?? ESCENARIOS[0];
  const terminado = ejecutados === escenario.pasos.length;
  const desenlace = escenario.desenlace[nivel];

  function elegirEscenario(id: string) {
    setEscenarioId(id);
    setEjecutados(0);
  }

  return (
    <div className="flex flex-col gap-6">
      <Selector
        etiqueta="Escenario"
        opciones={ESCENARIOS.map((e) => ({ id: e.id, nombre: e.titulo }))}
        valor={escenarioId}
        onCambio={elegirEscenario}
      />
      <Selector etiqueta="Nivel de aislamiento" opciones={NIVELES_AISLAMIENTO} valor={nivel} onCambio={setNivel} />

      <p className="text-sm leading-6 text-muted-foreground">{escenario.contexto}</p>

      <ol className="flex flex-col gap-2">
        {escenario.pasos.map((paso, i) => {
          const visible = i < ejecutados;
          const resultado = resultadoPaso(paso, nivel);
          return (
            <li
              key={i}
              className={`flex flex-col gap-1 rounded-xl border px-3 py-2 sm:w-4/5 ${paso.tx === "T2" ? "sm:self-end" : ""} ${
                visible ? "border-border bg-surface" : "border-dashed border-border opacity-50"
              }`}
            >
              <span className="text-xs font-medium text-muted-foreground">{paso.tx}</span>
              <code className="break-words font-mono text-xs text-foreground">{paso.sql}</code>
              {visible && (
                <span className={`font-mono text-xs ${esError(resultado) ? "text-error" : "text-success"}`}>→ {resultado}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEjecutados((n) => n + 1)}
          disabled={terminado}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          Ejecutar paso {Math.min(ejecutados + 1, escenario.pasos.length)}
        </button>
        <button
          type="button"
          onClick={() => setEjecutados(0)}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Reiniciar
        </button>
      </div>

      <div aria-live="polite">
        {terminado && (
          <div
            className={`flex flex-col gap-2 rounded-2xl border p-4 ${
              desenlace.correcto ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
            }`}
          >
            <span className={`text-sm font-medium ${desenlace.correcto ? "text-success" : "text-error"}`}>
              {desenlace.correcto ? "Resultado consistente" : "Anomalía"}
            </span>
            <p className="text-sm text-foreground">{desenlace.texto}</p>
          </div>
        )}
      </div>
    </div>
  );
}
