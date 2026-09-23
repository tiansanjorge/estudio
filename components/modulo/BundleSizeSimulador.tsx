"use client";

import { useState } from "react";
import {
  calcularBundle,
  totalizar,
  KB_POR_SEGUNDO_RED_LENTA,
  PRESUPUESTO_KB_GZIP,
  type OptimizacionId,
} from "@/lib/modules/performance/bundle-size";

const OPCIONES: { id: OptimizacionId; etiqueta: string; detalle: string }[] = [
  {
    id: "tree-shaking",
    etiqueta: "Tree-shaking",
    detalle: "import { debounce } from 'lodash-es' en vez de import _ from 'lodash'",
  },
  {
    id: "reemplazar-dependencia",
    etiqueta: "Reemplazar dependencia",
    detalle: "moment → date-fns, que es modular y sin locales embebidos",
  },
  {
    id: "import-dinamico",
    etiqueta: "Import dinámico",
    detalle: "los gráficos solo se usan en /reportes: import() los saca del chunk inicial",
  },
];

export function BundleSizeSimulador() {
  const [activas, setActivas] = useState<Set<OptimizacionId>>(new Set());

  const piezas = calcularBundle(activas);
  const iniciales = piezas.filter((p) => !p.diferido);
  const diferidas = piezas.filter((p) => p.diferido);
  const total = totalizar(iniciales);
  const segundos = total.kbGzip / KB_POR_SEGUNDO_RED_LENTA;
  const dentroDelPresupuesto = total.kbGzip <= PRESUPUESTO_KB_GZIP;
  // la barra se escala contra el peor caso para que las mejoras se vean como reducción
  const escala = totalizar(calcularBundle(new Set())).kbGzip;

  function alternar(id: OptimizacionId) {
    setActivas((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Optimizaciones aplicadas
        </legend>
        {OPCIONES.map((opcion) => (
          <label
            key={opcion.id}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-3 text-sm"
          >
            <input
              type="checkbox"
              checked={activas.has(opcion.id)}
              onChange={() => alternar(opcion.id)}
              className="mt-1 accent-accent"
            />
            <span className="flex flex-col gap-1">
              <span className="font-medium text-foreground">{opcion.etiqueta}</span>
              <span className="font-mono text-xs text-muted-foreground">
                {opcion.detalle}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
          <span className="font-medium text-foreground">Chunk inicial</span>
          <span
            className={`rounded-lg border px-2 py-0.5 font-mono text-xs ${
              dentroDelPresupuesto
                ? "border-success/30 bg-success-soft text-success"
                : "border-warning/30 bg-warning-soft text-warning"
            }`}
          >
            {total.kbGzip} KB gzip / presupuesto {PRESUPUESTO_KB_GZIP} KB
          </span>
        </div>
        <div
          className="relative h-3 overflow-hidden rounded-full bg-border"
          role="img"
          aria-label={`El chunk inicial pesa ${total.kbGzip} KB comprimido`}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              dentroDelPresupuesto ? "bg-success" : "bg-warning"
            }`}
            style={{ width: `${(total.kbGzip / escala) * 100}%` }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground/60"
            style={{ left: `${(PRESUPUESTO_KB_GZIP / escala) * 100}%` }}
          />
        </div>
      </div>

      <table className="w-full text-left font-mono text-xs">
        <thead className="text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 font-normal">Pieza</th>
            <th className="py-2 text-right font-normal">Transferido (gzip)</th>
            <th className="py-2 text-right font-normal">A parsear (sin comprimir)</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          {iniciales.map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2">{p.nombre}</td>
              <td className="py-2 text-right">{p.kbGzip} KB</td>
              <td className="py-2 text-right">{p.kbSinComprimir} KB</td>
            </tr>
          ))}
          <tr className="font-semibold">
            <td className="py-2">Total inicial</td>
            <td className="py-2 text-right">{total.kbGzip} KB</td>
            <td className="py-2 text-right">{total.kbSinComprimir} KB</td>
          </tr>
        </tbody>
      </table>

      {diferidas.length > 0 && (
        <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-xs text-foreground">
          Chunk diferido (se descarga al entrar a la ruta que lo usa):{" "}
          {diferidas.map((p) => `${p.nombre} — ${p.kbGzip} KB`).join(", ")}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        En una red móvil lenta (~{KB_POR_SEGUNDO_RED_LENTA} KB/s) el chunk inicial
        tarda ≈ {segundos.toFixed(1)} s solo en descargarse — y después el
        navegador todavía tiene que parsear y ejecutar {total.kbSinComprimir} KB
        de JavaScript. Los tamaños son ilustrativos, del orden de magnitud real
        de cada caso.
      </p>
    </div>
  );
}
