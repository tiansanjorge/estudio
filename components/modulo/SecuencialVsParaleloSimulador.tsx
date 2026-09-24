"use client";

import { useState } from "react";
import { BloqueCodigo } from "./BloqueCodigo";

const DURACION_MS = 800;
const TAREAS = [1, 2, 3];

function tareaSimulada(id: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Tarea ${id} lista`), DURACION_MS);
  });
}

type Modo = "secuencial" | "paralelo";

const CODIGO: Record<Modo, { titulo: string; codigo: string; clave: number[] }> = {
  secuencial: {
    titulo: "Secuencial — await uno por uno",
    codigo: `
async function cargarTodo() {
  const resultados = [];
  for (const id of [1, 2, 3]) {
    // cada await frena el loop hasta que termina la tarea anterior
    resultados.push(await tarea(id));
  }
  return resultados;
}`,
    clave: [4, 5],
  },
  paralelo: {
    titulo: "Paralelo — Promise.all",
    codigo: `
async function cargarTodo() {
  // las 3 tareas arrancan YA: map crea las promesas sin esperar
  const promesas = [1, 2, 3].map((id) => tarea(id));
  // un solo await, que espera a que terminen todas
  return await Promise.all(promesas);
}`,
    clave: [3, 5],
  },
};

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function SecuencialVsParaleloSimulador() {
  const [ejecutando, setEjecutando] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [tiempoTotal, setTiempoTotal] = useState<number | null>(null);
  const [modo, setModo] = useState<Modo | null>(null);

  async function ejecutarSecuencial() {
    setModo("secuencial");
    setEjecutando(true);
    setLog([]);
    setTiempoTotal(null);
    const inicio = performance.now();

    for (const id of TAREAS) {
      const resultado = await tareaSimulada(id);
      const transcurrido = Math.round(performance.now() - inicio);
      setLog((prev) => [...prev, `t=${transcurrido}ms → ${resultado}`]);
    }

    setTiempoTotal(Math.round(performance.now() - inicio));
    setEjecutando(false);
  }

  async function ejecutarParalelo() {
    setModo("paralelo");
    setEjecutando(true);
    setLog([]);
    setTiempoTotal(null);
    const inicio = performance.now();

    const promesas = TAREAS.map(async (id) => {
      const resultado = await tareaSimulada(id);
      const transcurrido = Math.round(performance.now() - inicio);
      setLog((prev) => [...prev, `t=${transcurrido}ms → ${resultado}`]);
      return resultado;
    });

    await Promise.all(promesas);
    setTiempoTotal(Math.round(performance.now() - inicio));
    setEjecutando(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        3 tareas de {DURACION_MS}ms cada una, independientes entre sí.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(["secuencial", "paralelo"] as Modo[]).map((m) => (
          <div key={m} className="flex flex-col gap-3">
            <BloqueCodigo
              titulo={CODIGO[m].titulo}
              codigo={CODIGO[m].codigo}
              resaltadas={modo === m ? CODIGO[m].clave : []}
            />
            <button
              type="button"
              onClick={m === "secuencial" ? ejecutarSecuencial : ejecutarParalelo}
              disabled={ejecutando}
              className={botonBase}
            >
              {m === "secuencial" ? "Ejecutar secuencial" : "Ejecutar en paralelo"}
            </button>
          </div>
        ))}
      </div>

      {tiempoTotal !== null && (
        <span className="w-fit rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm font-medium text-success">
          Tiempo total: {tiempoTotal}ms
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
