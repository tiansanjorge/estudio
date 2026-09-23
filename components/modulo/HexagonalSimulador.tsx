"use client";

import { useState } from "react";
import {
  CAPAS,
  CODIGO_DOMINIO,
  CODIGO_PUERTOS,
  NOMBRE_PAGOS,
  NOMBRE_REPO,
  codigoCasoDeUso,
  codigoComposicion,
  consecuencias,
  type AdaptadorPagos,
  type AdaptadorRepo,
} from "@/lib/modules/arquitectura/clean-hexagonal";

const REPO_INICIAL: AdaptadorRepo = "prisma";
const PAGOS_INICIAL: AdaptadorPagos = "stripe";

function Opciones<T extends string>({
  etiqueta,
  opciones,
  actual,
  alCambiar,
}: {
  etiqueta: string;
  opciones: Record<T, string>;
  actual: T;
  alCambiar: (valor: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={etiqueta}>
        {(Object.keys(opciones) as T[]).map((valor) => (
          <button
            key={valor}
            type="button"
            aria-pressed={valor === actual}
            onClick={() => alCambiar(valor)}
            className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] transition-colors ${
              valor === actual
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {opciones[valor]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HexagonalSimulador() {
  const [repo, setRepo] = useState<AdaptadorRepo>(REPO_INICIAL);
  const [pagos, setPagos] = useState<AdaptadorPagos>(PAGOS_INICIAL);
  const [violacion, setViolacion] = useState(false);
  const efecto = consecuencias(violacion, repo !== REPO_INICIAL, pagos !== PAGOS_INICIAL);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-6">
        <Opciones etiqueta="Adaptador de persistencia" opciones={NOMBRE_REPO} actual={repo} alCambiar={setRepo} />
        <Opciones etiqueta="Adaptador de pagos" opciones={NOMBRE_PAGOS} actual={pagos} alCambiar={setPagos} />
        <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
          <input
            type="checkbox"
            checked={violacion}
            onChange={(e) => setViolacion(e.target.checked)}
            className="accent-accent"
          />
          Violar la regla de dependencias
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-background p-3">
        <p className="mb-2 font-mono text-[11px] text-muted-foreground">
          {CAPAS[2].nombre}: {CAPAS[2].descripcion}
        </p>
        <div className="rounded-xl border border-border bg-surface p-3">
          <p className="mb-2 font-mono text-[11px] text-muted-foreground">
            {CAPAS[1].nombre}: {CAPAS[1].descripcion}
          </p>
          <div className="rounded-lg border border-accent/30 bg-accent-soft p-3">
            <p className="font-mono text-[11px] text-accent">
              {CAPAS[0].nombre}: {CAPAS[0].descripcion}
            </p>
          </div>
        </div>
        <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
          las dependencias apuntan siempre hacia adentro →{" "}
          {violacion ? <span className="text-error">salvo acá: el caso de uso importa infraestructura</span> : "✓"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
          {CODIGO_DOMINIO}
          {"\n\n"}
          {CODIGO_PUERTOS}
        </pre>
        <pre
          className={`overflow-x-auto rounded-xl border p-3 font-mono text-[11px] leading-5 text-foreground ${
            violacion ? "border-error/30 bg-error-soft" : "border-border bg-background"
          }`}
        >
          {codigoCasoDeUso(violacion)}
        </pre>
      </div>

      {!violacion && (
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
          {codigoComposicion(repo, pagos)}
        </pre>
      )}

      <div
        className={`flex flex-col gap-2 rounded-xl border px-4 py-3 text-sm ${
          efecto.testeableSinInfra
            ? "border-success/30 bg-success-soft"
            : "border-error/30 bg-error-soft"
        }`}
        aria-live="polite"
      >
        <p className="font-mono text-xs text-foreground">
          Archivos que cambian: {efecto.archivosQueCambian.join(", ")}
        </p>
        <p className="text-xs text-foreground">{efecto.nota}</p>
      </div>
    </div>
  );
}
