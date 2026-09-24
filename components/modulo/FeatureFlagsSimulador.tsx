"use client";

import { useId, useState } from "react";
import { CLAVE_FLAG, USUARIOS, evaluar, type ConfigFlag } from "@/lib/modules/ci-cd/feature-flags";

const REGLAS: { clave: "activa" | "empleados" | "betaPro"; etiqueta: string }[] = [
  { clave: "activa", etiqueta: "Flag activa (apagarla es el kill switch)" },
  { clave: "empleados", etiqueta: "Regla 1: encendida para empleados" },
  { clave: "betaPro", etiqueta: "Regla 2: encendida para el plan pro" },
];

export function FeatureFlagsSimulador() {
  const [config, setConfig] = useState<ConfigFlag>({ activa: true, empleados: true, betaPro: false, porcentaje: 10 });
  const idRango = useId();
  const evaluaciones = USUARIOS.map((u) => ({ usuario: u, ...evaluar(config, u) }));
  const encendidos = evaluaciones.filter((e) => e.encendida).length;

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">
          Flag <code className="font-mono">{CLAVE_FLAG}</code>
        </legend>
        {REGLAS.map(({ clave, etiqueta }) => (
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
        <label htmlFor={idRango} className="mt-2 text-sm text-foreground">
          Regla 3: rollout al {config.porcentaje}% del resto
        </label>
        <input
          id={idRango}
          type="range"
          min={0}
          max={100}
          step={5}
          value={config.porcentaje}
          onChange={(e) => setConfig((c) => ({ ...c, porcentaje: Number(e.target.value) }))}
          className="accent-accent"
        />
      </fieldset>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-live="polite">
        {evaluaciones.map(({ usuario, encendida, motivo }) => (
          <li
            key={usuario.id}
            className={`flex flex-col gap-0.5 rounded-xl border px-3 py-2 ${
              encendida ? "border-success/30 bg-success-soft" : "border-border bg-surface"
            }`}
          >
            <span className="flex items-center justify-between font-mono text-xs text-foreground">
              {usuario.id}
              <span className={encendida ? "text-success" : "text-muted-foreground"}>{encendida ? "ON" : "OFF"}</span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              {usuario.plan}
              {usuario.empleado ? " · empleado" : ""}
            </span>
            <span className="text-[11px] text-muted-foreground">{motivo}</span>
          </li>
        ))}
      </ul>

      <p className="rounded-2xl border border-border p-4 text-sm text-foreground">
        {encendidos} de {USUARIOS.length} usuarios ven el checkout nuevo. Subí el porcentaje: los que ya lo tenían lo
        siguen teniendo, porque cada usuario cae siempre en el mismo bucket (un hash de la flag y su id), no en uno
        aleatorio por request.
      </p>
    </div>
  );
}
