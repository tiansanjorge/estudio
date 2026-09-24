"use client";

import { useId, useState } from "react";
import { PRESETS, estimar, formatear, type Supuestos } from "@/lib/modules/system-design/estimacion";

const CAMPOS: { clave: keyof Supuestos; etiqueta: string; min: number }[] = [
  { clave: "usuariosDiarios", etiqueta: "Usuarios activos por día", min: 1 },
  { clave: "accionesPorUsuario", etiqueta: "Acciones por usuario por día", min: 1 },
  { clave: "lecturasPorEscritura", etiqueta: "Lecturas por cada escritura", min: 0 },
  { clave: "bytesPorEscritura", etiqueta: "Bytes por registro", min: 1 },
  { clave: "anios", etiqueta: "Años de retención", min: 1 },
  { clave: "factorPico", etiqueta: "Pico / promedio", min: 1 },
];

export function EstimacionSimulador() {
  const [supuestos, setSupuestos] = useState<Supuestos>(PRESETS[0].supuestos);
  const idBase = useId();
  const resultados = Object.entries(estimar(supuestos));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSupuestos(p.supuestos)}
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Cargar: {p.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {CAMPOS.map(({ clave, etiqueta, min }) => (
          <div key={clave} className="flex flex-col gap-1">
            <label htmlFor={`${idBase}-${clave}`} className="text-xs text-muted-foreground">
              {etiqueta}
            </label>
            <input
              id={`${idBase}-${clave}`}
              type="number"
              min={min}
              value={supuestos[clave]}
              onChange={(e) => {
                const valor = Number(e.target.value);
                if (!Number.isNaN(valor) && valor >= min) setSupuestos((s) => ({ ...s, [clave]: valor }));
              }}
              className="rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
            />
          </div>
        ))}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2" aria-live="polite">
        {resultados.map(([nombre, r]) => (
          <div key={nombre} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
            <dt className="text-xs text-muted-foreground">{nombre}</dt>
            <dd className="font-mono text-lg text-foreground">{formatear(r.valor, r.unidad)}</dd>
            <dd className="font-mono text-[11px] text-muted-foreground">{r.formula}</dd>
          </div>
        ))}
      </dl>

      <p className="rounded-2xl border border-border p-4 text-sm leading-6 text-foreground">
        En una entrevista no importa el número exacto sino el orden de magnitud y el razonamiento: 86.400 segundos por
        día se redondea a 10⁵, y un resultado de &quot;unos miles de requests por segundo&quot; o &quot;unos pocos
        terabytes&quot; alcanza para decidir si hace falta caché, réplicas o sharding.
      </p>
    </div>
  );
}
