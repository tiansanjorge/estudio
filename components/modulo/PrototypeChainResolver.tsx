"use client";

import { useState } from "react";
import {
  resolverPropiedad,
  type ConfiguracionPrototipo,
  type NivelPrototipo,
} from "@/lib/modules/prototypes/resolver";

const niveles: { clave: keyof ConfiguracionPrototipo; etiqueta: string }[] = [
  { clave: "enInstancia", etiqueta: "la instancia (propiedad propia)" },
  { clave: "enPrototipoDirecto", etiqueta: "Hijo.prototype" },
  { clave: "enPrototipoBase", etiqueta: "Padre.prototype" },
];

export function PrototypeChainResolver() {
  const [config, setConfig] = useState<ConfiguracionPrototipo>({
    enInstancia: true,
    enPrototipoDirecto: false,
    enPrototipoBase: false,
  });

  const resultado = resolverPropiedad(config);

  function toggle(clave: keyof ConfiguracionPrototipo) {
    setConfig((prev) => ({ ...prev, [clave]: !prev[clave] }));
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Se hace <code>instancia.metodo()</code>, con{" "}
        <code>Hijo</code> heredando de <code>Padre</code>. Elegí en qué
        nivel de la cadena existe <code>metodo</code> y mirá cómo cambia la
        búsqueda.
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
              Definir <code>metodo</code> en {nivel.etiqueta}
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

function ResultadoBadge({ encontradoEn }: { encontradoEn: NivelPrototipo | null }) {
  if (encontradoEn === null) {
    return (
      <span className="w-fit rounded-lg border border-error/30 bg-error-soft px-3 py-2 text-sm font-medium text-error">
        TypeError: instancia.metodo is not a function
      </span>
    );
  }
  return (
    <span className="w-fit rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm font-medium text-success">
      instancia.metodo() usa la definición de: {encontradoEn}
    </span>
  );
}
