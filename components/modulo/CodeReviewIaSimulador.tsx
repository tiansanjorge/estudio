"use client";

import { useState } from "react";
import {
  LINEAS_CODIGO,
  PEDIDO_ORIGINAL,
  revisar,
  type Categoria,
  type Problema,
} from "@/lib/modules/ia-aplicada/evaluacion-output-ia";

const COLOR_CATEGORIA: Record<Categoria, string> = {
  seguridad: "text-error",
  bug: "text-warning",
  rendimiento: "text-info",
  mantenimiento: "text-muted-foreground",
};

function ListaProblemas({ titulo, problemas, clase }: { titulo: string; problemas: Problema[]; clase: string }) {
  if (problemas.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-sm font-medium ${clase}`}>{titulo}</span>
      <ul className="flex flex-col gap-2">
        {problemas.map((p) => (
          <li key={p.titulo} className="text-sm">
            <span className={`text-xs font-medium uppercase ${COLOR_CATEGORIA[p.categoria]}`}>{p.categoria}</span>{" "}
            <strong className="text-foreground">{p.titulo}</strong>{" "}
            <span className="text-xs text-muted-foreground">(línea {p.lineas.map((l) => l + 1).join(", ")})</span>
            <p className="text-muted-foreground">{p.explicacion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function CodeReviewIaSimulador() {
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const [revelado, setRevelado] = useState(false);
  const resultado = revisar(marcadas);

  function alternar(linea: number) {
    if (revelado || LINEAS_CODIGO[linea].trim() === "") return;
    setMarcadas((prev) => (prev.includes(linea) ? prev.filter((l) => l !== linea) : [...prev, linea]));
  }

  function reiniciar() {
    setMarcadas([]);
    setRevelado(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">Lo que se pidió:</strong> {PEDIDO_ORIGINAL} Marcá las líneas que no
        aprobarías en el code review.
      </p>

      <ol className="overflow-x-auto rounded-xl border border-border bg-background py-2 font-mono text-xs">
        {LINEAS_CODIGO.map((linea, i) => {
          const marcada = marcadas.includes(i);
          const conProblema = revelado && resultado.encontrados.concat(resultado.omitidos).some((p) => p.lineas.includes(i));
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => alternar(i)}
                aria-pressed={marcada}
                className={`flex w-full gap-3 whitespace-pre px-3 py-0.5 text-left transition-colors ${
                  marcada ? "bg-accent-soft" : "hover:bg-surface"
                } ${conProblema ? "border-l-2 border-error" : "border-l-2 border-transparent"}`}
              >
                <span className="w-5 shrink-0 select-none text-right text-muted-foreground">{i + 1}</span>
                <span className="text-foreground">{linea || " "}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRevelado(true)}
          disabled={revelado}
          className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-foreground transition-colors disabled:opacity-50"
        >
          Revelar ({marcadas.length} línea{marcadas.length === 1 ? "" : "s"} marcada{marcadas.length === 1 ? "" : "s"})
        </button>
        <button
          type="button"
          onClick={reiniciar}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Reiniciar
        </button>
      </div>

      {revelado && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border p-4" aria-live="polite">
          <span className="text-sm text-foreground">
            Encontraste {resultado.encontrados.length} de {resultado.encontrados.length + resultado.omitidos.length}{" "}
            problemas
            {resultado.falsosPositivos.length > 0 &&
              ` · ${resultado.falsosPositivos.length} línea${resultado.falsosPositivos.length === 1 ? "" : "s"} marcada${resultado.falsosPositivos.length === 1 ? "" : "s"} sin problema`}
            .
          </span>
          <ListaProblemas titulo="Encontrados" problemas={resultado.encontrados} clase="text-success" />
          <ListaProblemas titulo="Se te escaparon" problemas={resultado.omitidos} clase="text-error" />
          <p className="text-xs text-muted-foreground">
            El código compila y probablemente pasa una prueba manual rápida con un usuario de ejemplo. Ninguno de estos
            problemas se ve sin leerlo con atención.
          </p>
        </div>
      )}
    </div>
  );
}
