"use client";

import { useState } from "react";
import {
  ORIGENES,
  PRINCIPALES,
  evaluar,
  type ConfigPermisos,
  type Origen,
  type Principal,
} from "@/lib/modules/cloud/aws-basico";

const INTERRUPTORES: { clave: "politicaIdentidad" | "politicaBucket" | "denyFueraDeVpc" | "blockPublicAccess"; etiqueta: string }[] = [
  { clave: "politicaIdentidad", etiqueta: "Política del rol: Allow s3:GetObject" },
  { clave: "politicaBucket", etiqueta: "Bucket policy: Allow a este principal" },
  { clave: "denyFueraDeVpc", etiqueta: "Bucket policy: Deny si no llega por el VPC endpoint" },
  { clave: "blockPublicAccess", etiqueta: "Block Public Access activado" },
];

function Opciones<T extends string>({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { id: T; nombre: string }[];
  valor: T;
  onCambio: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={etiqueta}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === valor}
            onClick={() => onCambio(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === valor ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}

export function IamSimulador() {
  const [config, setConfig] = useState<ConfigPermisos>({
    principal: "rol-misma-cuenta",
    origen: "vpc",
    politicaIdentidad: true,
    politicaBucket: false,
    denyFueraDeVpc: false,
    blockPublicAccess: true,
  });
  const decision = evaluar(config);

  return (
    <div className="flex flex-col gap-6">
      <Opciones<Principal>
        etiqueta="Quién pide"
        opciones={PRINCIPALES}
        valor={config.principal}
        onCambio={(principal) => setConfig((c) => ({ ...c, principal }))}
      />
      <Opciones<Origen>
        etiqueta="Desde dónde"
        opciones={ORIGENES}
        valor={config.origen}
        onCambio={(origen) => setConfig((c) => ({ ...c, origen }))}
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Políticas</legend>
        {INTERRUPTORES.map(({ clave, etiqueta }) => {
          const noAplica = clave === "politicaIdentidad" && config.principal === "anonimo";
          return (
            <label key={clave} className={`flex items-center gap-2 text-sm ${noAplica ? "text-muted-foreground" : "text-foreground"}`}>
              <input
                type="checkbox"
                checked={config[clave]}
                disabled={noAplica}
                onChange={(e) => setConfig((c) => ({ ...c, [clave]: e.target.checked }))}
                className="accent-accent"
              />
              {etiqueta}
              {noAplica && " (un anónimo no tiene identidad)"}
            </label>
          );
        })}
      </fieldset>

      <div
        className={`flex flex-col gap-2 rounded-2xl border p-4 ${
          decision.permitido ? "border-success/30 bg-success-soft" : "border-error/30 bg-error-soft"
        }`}
        aria-live="polite"
      >
        <span className={`text-sm font-medium ${decision.permitido ? "text-success" : "text-error"}`}>
          {decision.permitido ? "Permitido" : "Denegado"}
        </span>
        <ol className="flex flex-col gap-1 text-sm text-foreground">
          {decision.pasos.map((paso) => (
            <li key={paso}>{paso}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
