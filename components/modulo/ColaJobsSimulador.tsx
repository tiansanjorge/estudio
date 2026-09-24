"use client";

import { useState } from "react";
import { procesarCola, type ConfigCola } from "@/lib/modules/backend/colas-jobs";
import { BloqueCodigo } from "./BloqueCodigo";

function generarCodigo({ concurrencia, maxIntentos, backoffExponencial }: ConfigCola): string {
  return [
    'const cola = new Queue("emails", { connection: redis });',
    "",
    'await cola.add("enviar", { para, asunto }, {',
    `  attempts: ${maxIntentos}, // ${maxIntentos === 1 ? "sin reintentos" : `hasta ${maxIntentos - 1} reintento${maxIntentos === 2 ? "" : "s"}`}`,
    backoffExponencial
      ? '  backoff: { type: "exponential", delay: 1000 }, // 1s, 2s, 4s…'
      : "  // sin backoff: reintenta de inmediato",
    "});",
    "",
    'new Worker("emails", async (job) => {',
    "  await enviarEmail(job.data); // si lanza, BullMQ lo reintenta",
    `}, { connection: redis, concurrency: ${concurrencia} });`,
    "// agotados los intentos, el job queda en la lista de fallidos",
  ].join("\n");
}

const ESCALA_MINIMA_S = 16;

function Opciones({
  etiqueta,
  valores,
  actual,
  alCambiar,
}: {
  etiqueta: string;
  valores: number[];
  actual: number;
  alCambiar: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{etiqueta}</span>
      <div className="flex gap-1.5" role="group" aria-label={etiqueta}>
        {valores.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === actual}
            onClick={() => alCambiar(v)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-xs transition-colors ${
              v === actual ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColaJobsSimulador() {
  const [config, setConfig] = useState<ConfigCola>({ concurrencia: 1, maxIntentos: 1, backoffExponencial: false });
  const { resultados, duracionTotal } = procesarCola(config);
  const fallidos = resultados.filter((r) => r.estado === "fallido");
  const escala = Math.max(ESCALA_MINIMA_S, duracionTotal);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-6">
        <Opciones
          etiqueta="Workers en paralelo"
          valores={[1, 2, 4]}
          actual={config.concurrencia}
          alCambiar={(concurrencia) => setConfig((c) => ({ ...c, concurrencia }))}
        />
        <Opciones
          etiqueta="Intentos máximos"
          valores={[1, 3, 4]}
          actual={config.maxIntentos}
          alCambiar={(maxIntentos) => setConfig((c) => ({ ...c, maxIntentos }))}
        />
        <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={config.backoffExponencial}
            onChange={(e) => setConfig((c) => ({ ...c, backoffExponencial: e.target.checked }))}
            className="accent-accent"
          />
          Backoff exponencial (1 s, 2 s, 4 s…)
        </label>
      </div>

      <BloqueCodigo titulo="BullMQ" codigo={generarCodigo(config)} resaltadas={[4, 5, 10]} />

      <ul className="flex flex-col gap-3">
        {resultados.map((r) => (
          <li key={r.job.id} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="font-mono text-foreground">{r.job.id}</span>
              <span className={`font-mono ${r.estado === "completado" ? "text-success" : "text-error"}`}>
                {r.estado === "completado"
                  ? `completado en el intento ${r.intentos.length}`
                  : `fallido tras ${r.intentos.length} intento(s) → cola de fallidos`}
              </span>
            </div>
            <div className="relative h-5 rounded bg-border/40" aria-hidden="true">
              {r.intentos.map((i, k) => (
                <span
                  key={k}
                  className={`absolute inset-y-0.5 flex items-center justify-center rounded font-mono text-[9px] text-background ${
                    i.ok ? "bg-success" : "bg-error"
                  }`}
                  style={{ left: `${(i.inicio / escala) * 100}%`, width: `${((i.fin - i.inicio) / escala) * 100}%` }}
                >
                  w{i.worker}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        <p className="rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
          La cola se vacía a los {duracionTotal} s
        </p>
        <p
          className={`rounded-xl border px-3 py-2 font-mono text-xs ${
            fallidos.length ? "border-error/30 bg-error-soft text-error" : "border-success/30 bg-success-soft text-success"
          }`}
        >
          Cola de fallidos: {fallidos.length ? fallidos.map((f) => f.job.id).join(", ") : "vacía"}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        email-3 y pdf-6 fallan transitoriamente (se recuperan si se reintentan); email-5 falla siempre
        (un dato inválido): ningún reintento lo arregla, y termina en la cola de fallidos para que
        alguien lo revise. Cada barra es un intento y <code>wN</code> es el worker que lo ejecutó.
      </p>
    </div>
  );
}
