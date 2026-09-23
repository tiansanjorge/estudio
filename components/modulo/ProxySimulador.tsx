"use client";

import { useState } from "react";
import {
  CODIGO_PROXY,
  RUTAS_EJEMPLO,
  ejecutarProxy,
  type ContextoRequest,
  type RutaEjemplo,
  type TipoAccion,
} from "@/lib/modules/nextjs/middleware-edge";

const ESTILO_ACCION: Record<TipoAccion, string> = {
  "no-corre": "border-border bg-surface text-muted-foreground",
  redirect: "border-warning/30 bg-warning-soft text-warning",
  rewrite: "border-info/30 bg-info-soft text-info",
  next: "border-success/30 bg-success-soft text-success",
};

const ETIQUETA_ACCION: Record<TipoAccion, string> = {
  "no-corre": "Proxy no se ejecuta",
  redirect: "NextResponse.redirect",
  rewrite: "NextResponse.rewrite",
  next: "NextResponse.next",
};

export function ProxySimulador() {
  const [ruta, setRuta] = useState<RutaEjemplo>("/dashboard");
  const [contexto, setContexto] = useState<ContextoRequest>({ sesion: false, varianteB: false });
  const resultado = ejecutarProxy(ruta, contexto);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-[11px] leading-5 text-foreground">
          {CODIGO_PROXY}
        </pre>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Request entrante</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Ruta del request">
              {RUTAS_EJEMPLO.map((r) => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={r === ruta}
                  onClick={() => setRuta(r)}
                  className={`rounded-lg border px-2 py-1 font-mono text-xs transition-colors ${
                    r === ruta
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <fieldset className="flex flex-col gap-2 text-sm text-foreground">
            <legend className="mb-1 text-sm font-medium">Cookies del request</legend>
            <label className="flex cursor-pointer items-center gap-2 font-mono text-xs">
              <input
                type="checkbox"
                checked={contexto.sesion}
                onChange={(e) => setContexto((c) => ({ ...c, sesion: e.target.checked }))}
                className="accent-accent"
              />
              sesion=abc123
            </label>
            <label className="flex cursor-pointer items-center gap-2 font-mono text-xs">
              <input
                type="checkbox"
                checked={contexto.varianteB}
                onChange={(e) => setContexto((c) => ({ ...c, varianteB: e.target.checked }))}
                className="accent-accent"
              />
              variante=b
            </label>
          </fieldset>

          <div className="flex flex-col gap-2">
            <span
              className={`self-start rounded-lg border px-3 py-1 font-mono text-xs ${ESTILO_ACCION[resultado.accion]}`}
            >
              {ETIQUETA_ACCION[resultado.accion]}
            </span>
            <dl className="grid grid-cols-[9rem_1fr] gap-1 font-mono text-xs">
              <dt className="text-muted-foreground">¿Matchea?</dt>
              <dd className="text-foreground">{resultado.coincideMatcher ? "sí" : "no"}</dd>
              <dt className="text-muted-foreground">URL en el navegador</dt>
              <dd className="text-foreground">{resultado.urlNavegador}</dd>
              <dt className="text-muted-foreground">Ruta renderizada</dt>
              <dd className="text-foreground">{resultado.rutaRenderizada}</dd>
            </dl>
            <p className="text-xs text-muted-foreground">{resultado.explicacion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
