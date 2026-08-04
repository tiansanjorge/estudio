"use client";

import { useState } from "react";
import { resolverVariable, type ConfiguracionScope, type NivelScope } from "@/lib/modules/scope/resolver";

const niveles: { clave: keyof ConfiguracionScope; etiqueta: string }[] = [
  { clave: "declaradoEnInterna", etiqueta: "Interna" },
  { clave: "declaradoEnExterna", etiqueta: "Externa" },
  { clave: "declaradoEnGlobal", etiqueta: "Global" },
];

export function ScopeResolver() {
  const [config, setConfig] = useState<ConfiguracionScope>({
    declaradoEnGlobal: true,
    declaradoEnExterna: false,
    declaradoEnInterna: false,
  });

  const resultado = resolverVariable(config);

  function toggle(clave: keyof ConfiguracionScope) {
    setConfig((prev) => ({ ...prev, [clave]: !prev[clave] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Desde <code>interna()</code> se hace <code>console.log(valor)</code>.
        Elegí en qué niveles existe una declaración de <code>valor</code> y
        mirá cómo cambia la resolución.
      </p>

      <div className="flex flex-col gap-2">
        {niveles.map((nivel) => (
          <button
            key={nivel.clave}
            type="button"
            onClick={() => toggle(nivel.clave)}
            className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm transition-colors ${
              config[nivel.clave]
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>
              Declarar <code>valor</code> en {nivel.etiqueta}
            </span>
            <span className="font-mono text-xs">{config[nivel.clave] ? "sí" : "no"}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ruta de búsqueda
        </span>
        <ol className="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          {resultado.rutaBusqueda.map((paso, index) => (
            <li key={index}>{paso}</li>
          ))}
        </ol>
      </div>

      <ResultadoBadge encontradoEn={resultado.encontradoEn} />
    </div>
  );
}

function ResultadoBadge({ encontradoEn }: { encontradoEn: NivelScope | null }) {
  if (encontradoEn === null) {
    return (
      <span className="w-fit rounded-lg border border-error/30 bg-error-soft px-3 py-2 text-sm font-medium text-error">
        ReferenceError: valor is not defined
      </span>
    );
  }
  return (
    <span className="w-fit rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm font-medium text-success">
      console.log(valor) usa la de: {encontradoEn}
    </span>
  );
}
