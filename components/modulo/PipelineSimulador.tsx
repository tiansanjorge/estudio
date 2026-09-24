"use client";

import { useState } from "react";
import { ejecutarPipeline, type ConfigPipeline, type EstadoJob } from "@/lib/modules/ci-cd/pipelines-github-actions";

const OPCIONES: { clave: keyof ConfigPipeline; etiqueta: string }[] = [
  { clave: "paralelo", etiqueta: "Jobs en paralelo (con needs)" },
  { clave: "cache", etiqueta: "Cache de dependencias" },
  { clave: "fallaTest", etiqueta: "Un test falla" },
];

const COLOR_BARRA: Record<EstadoJob, string> = {
  ok: "bg-success",
  fallo: "bg-error",
  salteado: "bg-transparent",
};

const minutos = (m: number) => `${m.toLocaleString("es-AR", { maximumFractionDigits: 1 })} min`;

export function PipelineSimulador() {
  const [config, setConfig] = useState<ConfigPipeline>({ paralelo: false, cache: false, fallaTest: false });
  const resultado = ejecutarPipeline(config);
  // escala fija al peor caso para que las barras sean comparables entre configuraciones
  const escala = Math.max(ejecutarPipeline({ paralelo: false, cache: false, fallaTest: false }).total, resultado.total);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Configuración del workflow</legend>
        {OPCIONES.map(({ clave, etiqueta }) => (
          <label key={clave} className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={config[clave]}
              onChange={(e) => setConfig((c) => ({ ...c, [clave]: e.target.checked }))}
              className="accent-accent"
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2" aria-live="polite">
        {resultado.jobs.map((job) => (
          <div key={job.id} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
            <span className="font-mono text-xs text-foreground">{job.nombre}</span>
            <div className="relative h-6 rounded-md bg-surface">
              {job.estado === "salteado" ? (
                <span className="absolute inset-y-0 flex items-center text-xs text-muted-foreground" style={{ left: `${(job.inicio / escala) * 100}%` }}>
                  salteado
                </span>
              ) : (
                <div
                  className={`absolute inset-y-0 rounded-md ${COLOR_BARRA[job.estado]}`}
                  style={{ left: `${(job.inicio / escala) * 100}%`, width: `${((job.fin - job.inicio) / escala) * 100}%` }}
                  title={`${minutos(job.inicio)} → ${minutos(job.fin)}`}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 rounded-2xl border border-border p-4 text-sm">
        <span className="text-foreground">
          Duración total: <strong>{minutos(resultado.total)}</strong>
        </span>
        {resultado.feedbackFallo !== null && (
          <span className="text-error">El autor del PR se entera del fallo a los {minutos(resultado.feedbackFallo)}.</span>
        )}
        <span className="text-muted-foreground">
          {config.paralelo
            ? "Cada job corre en un runner nuevo y paga su propio checkout e instalación: el cache pesa más."
            : "Un solo job instala una vez, pero cada paso espera al anterior."}
        </span>
      </div>
    </div>
  );
}
