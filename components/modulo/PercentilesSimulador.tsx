"use client";

import { useId, useState } from "react";
import {
  OBJETIVO_SLO,
  TOTAL_REQUESTS,
  UMBRAL_SLO_MS,
  generarLatencias,
  resumir,
} from "@/lib/modules/ci-cd/observabilidad";

const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

export function PercentilesSimulador() {
  const [porcentajeLentas, setPorcentajeLentas] = useState(0.5);
  const idRango = useId();
  const resumen = resumir(generarLatencias(porcentajeLentas));
  const maximoBucket = Math.max(...resumen.buckets.map((b) => b.cantidad));
  const cumpleSlo = resumen.cumplimiento >= OBJETIVO_SLO;

  const metricas = [
    { nombre: "Promedio", valor: resumen.promedio },
    { nombre: "p50", valor: resumen.p50 },
    { nombre: "p95", valor: resumen.p95 },
    { nombre: "p99", valor: resumen.p99 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={idRango} className="text-sm font-medium text-foreground">
          Requests lentas (1 a 3 s): {formato.format(porcentajeLentas)}% de {TOTAL_REQUESTS}
        </label>
        <input
          id={idRango}
          type="range"
          min={0}
          max={10}
          step={0.5}
          value={porcentajeLentas}
          onChange={(e) => setPorcentajeLentas(Number(e.target.value))}
          className="accent-accent"
        />
      </div>

      <div className="flex h-32 items-end gap-2" aria-hidden="true">
        {resumen.buckets.map((b) => (
          <div key={b.etiqueta} className="flex h-full flex-1 flex-col justify-end gap-1">
            <div
              className="rounded-t-md bg-accent"
              style={{ height: `${maximoBucket === 0 ? 0 : Math.max((b.cantidad / maximoBucket) * 100, b.cantidad > 0 ? 3 : 0)}%` }}
            />
            <span className="text-center text-[10px] text-muted-foreground">{b.etiqueta}</span>
          </div>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        {metricas.map((m) => (
          <div key={m.nombre} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
            <dt className="text-xs text-muted-foreground">{m.nombre}</dt>
            <dd className="font-mono text-sm text-foreground">{formato.format(m.valor)} ms</dd>
          </div>
        ))}
      </dl>

      <div
        className={`flex flex-col gap-1 rounded-2xl border p-4 text-sm ${
          cumpleSlo ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
        }`}
      >
        <span className={`font-medium ${cumpleSlo ? "text-success" : "text-error"}`}>
          SLO: {OBJETIVO_SLO}% de las requests en menos de {UMBRAL_SLO_MS} ms →{" "}
          {formato.format(resumen.cumplimiento)}% {cumpleSlo ? "(se cumple)" : "(no se cumple)"}
        </span>
        <span className="text-foreground">
          Con 2% de requests lentas, el promedio sigue en unos 150 ms y parece sano, pero el p99 ya está en segundos. Y
          un usuario que hace 50 requests por sesión tiene un 64% de probabilidad de cruzarse con al menos una lenta.
        </span>
      </div>
    </div>
  );
}
