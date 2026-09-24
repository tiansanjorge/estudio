"use client";

import { useState } from "react";
import {
  crearPromesaTarea,
  type EstadoTarea,
  type ResultadoTarea,
  type Tarea,
  type TipoCombinador,
} from "@/lib/modules/promises/combinadores";
import { BloqueCodigo } from "./BloqueCodigo";

const duraciones = [300, 800, 1500];

const combinadores: { valor: TipoCombinador; etiqueta: string; descripcion: string }[] = [
  { valor: "all", etiqueta: "Promise.all", descripcion: "Se cumple cuando TODAS cumplen. Se rechaza apenas UNA rechaza." },
  { valor: "race", etiqueta: "Promise.race", descripcion: "Se resuelve (cumplida o rechazada) con la primera que termine, sea cual sea." },
  { valor: "allSettled", etiqueta: "Promise.allSettled", descripcion: "Siempre se cumple, esperando a todas, con el resultado de cada una (éxito o error)." },
  { valor: "any", etiqueta: "Promise.any", descripcion: "Se cumple con la primera que tenga éxito. Solo rechaza si TODAS fallan." },
];

function claseEstado(estado: EstadoTarea): string {
  switch (estado) {
    case "pendiente":
      return "border-border text-muted-foreground";
    case "cumplida":
      return "border-success/30 bg-success-soft text-success";
    case "rechazada":
      return "border-error/30 bg-error-soft text-error";
  }
}

/** Código equivalente a la configuración actual del playground. */
function generarCodigo(tareas: Tarea[], combinador: TipoCombinador): string {
  const declaraciones = tareas.map((t) =>
    t.resultado === "exito"
      ? `const t${t.id} = esperar(${t.duracionMs}).then(() => "Tarea ${t.id} OK");`
      : `const t${t.id} = esperar(${t.duracionMs}).then(() => { throw new Error("Tarea ${t.id} falló"); });`,
  );
  const lista = tareas.map((t) => `t${t.id}`).join(", ");
  return [
    ...declaraciones,
    "",
    "try {",
    `  const resultado = await Promise.${combinador}([${lista}]);`,
    '  console.log("cumplida:", resultado);',
    "} catch (error) {",
    '  console.log("rechazada:", error.message);',
    "}",
  ].join("\n");
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

interface EstadoUiTarea {
  id: number;
  estado: EstadoTarea;
}

export function CombinadoresSimulador() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: 1, resultado: "exito", duracionMs: 800 },
    { id: 2, resultado: "exito", duracionMs: 1500 },
    { id: 3, resultado: "error", duracionMs: 300 },
  ]);
  const [combinador, setCombinador] = useState<TipoCombinador>("all");
  const [ejecutando, setEjecutando] = useState(false);
  const [estados, setEstados] = useState<EstadoUiTarea[]>(
    tareas.map((t) => ({ id: t.id, estado: "pendiente" })),
  );
  const [log, setLog] = useState<string[]>([]);
  const [resultadoFinal, setResultadoFinal] = useState<{ texto: string; ok: boolean } | null>(null);

  function actualizarTarea(id: number, cambios: Partial<Tarea>) {
    setTareas((prev) => prev.map((t) => (t.id === id ? { ...t, ...cambios } : t)));
  }

  async function ejecutar() {
    setEjecutando(true);
    setResultadoFinal(null);
    setLog([]);
    setEstados(tareas.map((t) => ({ id: t.id, estado: "pendiente" })));

    const promesas = tareas.map((tarea) =>
      crearPromesaTarea(tarea, (estado, detalle) => {
        setEstados((prev) => prev.map((e) => (e.id === tarea.id ? { ...e, estado } : e)));
        setLog((prev) => [...prev, `t=${tarea.duracionMs}ms → Tarea ${tarea.id}: ${estado} (${detalle})`]);
      }),
    );

    try {
      let resultado: unknown;
      if (combinador === "all") resultado = await Promise.all(promesas);
      else if (combinador === "race") resultado = await Promise.race(promesas);
      else if (combinador === "allSettled") resultado = await Promise.allSettled(promesas);
      else resultado = await Promise.any(promesas);

      setResultadoFinal({ texto: `Se cumplió con: ${JSON.stringify(resultado)}`, ok: true });
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      setResultadoFinal({ texto: `Se rechazó: ${mensaje}`, ok: false });
    } finally {
      setEjecutando(false);
    }
  }

  // Líneas del snippet: declaraciones, línea en blanco, try, await, then / catch.
  const lineaAwait = tareas.length + 3;
  const resaltadas = ejecutando
    ? [lineaAwait]
    : resultadoFinal
      ? resultadoFinal.ok
        ? [lineaAwait, lineaAwait + 1]
        : [lineaAwait, lineaAwait + 2, lineaAwait + 3]
      : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Combinador
        </span>
        <div className="flex flex-wrap gap-2">
          {combinadores.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => setCombinador(item.valor)}
              disabled={ejecutando}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                item.valor === combinador
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {combinadores.find((c) => c.valor === combinador)?.descripcion}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {tareas.map((tarea) => {
          const estadoUi = estados.find((e) => e.id === tarea.id)?.estado ?? "pendiente";
          return (
            <div
              key={tarea.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-3"
            >
              <span className="font-mono text-sm text-foreground">Tarea {tarea.id}</span>
              <div className="flex gap-1">
                {(["exito", "error"] as ResultadoTarea[]).map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    disabled={ejecutando}
                    onClick={() => actualizarTarea(tarea.id, { resultado: valor })}
                    className={`rounded-lg border px-2 py-1 text-xs transition-colors ${
                      tarea.resultado === valor
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {valor}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                {duraciones.map((ms) => (
                  <button
                    key={ms}
                    type="button"
                    disabled={ejecutando}
                    onClick={() => actualizarTarea(tarea.id, { duracionMs: ms })}
                    className={`rounded-lg border px-2 py-1 font-mono text-xs transition-colors ${
                      tarea.duracionMs === ms
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ms}ms
                  </button>
                ))}
              </div>
              <span className={`ml-auto rounded-lg border px-2 py-1 text-xs ${claseEstado(estadoUi)}`}>
                {estadoUi}
              </span>
            </div>
          );
        })}
      </div>

      <BloqueCodigo
        titulo="Código equivalente"
        codigo={generarCodigo(tareas, combinador)}
        resaltadas={resaltadas}
      />

      <button type="button" onClick={ejecutar} disabled={ejecutando} className={botonBase}>
        {ejecutando ? "Ejecutando..." : "Ejecutar"}
      </button>

      {resultadoFinal && (
        <span
          className={`w-fit rounded-lg border px-3 py-2 text-sm font-medium ${
            resultadoFinal.ok
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          {resultadoFinal.texto}
        </span>
      )}

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Log</span>
        <div className="mt-2 flex flex-col gap-1">
          {log.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            log.map((linea, index) => (
              <span key={index} className="text-muted-foreground">
                {linea}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
