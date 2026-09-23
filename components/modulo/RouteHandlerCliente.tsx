"use client";

import { useState } from "react";
import {
  CODIGO_ROUTES,
  METODOS,
  RUTAS,
  manejarRequest,
  type RequestSimulado,
} from "@/lib/modules/nextjs/route-handlers";

function claseStatus(status: number) {
  if (status < 300) return "border-success/30 bg-success-soft text-success";
  if (status < 500) return "border-warning/30 bg-warning-soft text-warning";
  return "border-error/30 bg-error-soft text-error";
}

export function RouteHandlerCliente() {
  const [req, setReq] = useState<RequestSimulado>({
    metodo: "POST",
    ruta: "/api/productos",
    autenticado: false,
    cuerpoValido: true,
  });
  const respuesta = manejarRequest(req);

  function actualizar(cambios: Partial<RequestSimulado>) {
    setReq((r) => ({ ...r, ...cambios }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <pre className="max-h-[32rem] overflow-auto rounded-xl border border-border bg-background p-4 font-mono text-[11px] leading-5 text-foreground">
        {CODIGO_ROUTES}
      </pre>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="rh-metodo">
            Método
          </label>
          <select
            id="rh-metodo"
            value={req.metodo}
            onChange={(e) => actualizar({ metodo: e.target.value as RequestSimulado["metodo"] })}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-xs text-foreground"
          >
            {METODOS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="rh-ruta">
            Ruta
          </label>
          <select
            id="rh-ruta"
            value={req.ruta}
            onChange={(e) => actualizar({ ruta: e.target.value as RequestSimulado["ruta"] })}
            className="flex-1 rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-xs text-foreground"
          >
            {RUTAS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Opciones del request</legend>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-foreground">
            <input
              type="checkbox"
              checked={req.autenticado}
              onChange={(e) => actualizar({ autenticado: e.target.checked })}
              className="accent-accent"
            />
            Cookie de sesión válida
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-foreground">
            <input
              type="checkbox"
              checked={req.cuerpoValido}
              onChange={(e) => actualizar({ cuerpoValido: e.target.checked })}
              className="accent-accent"
            />
            Body válido (solo POST): {"{"} &quot;nombre&quot;: &quot;Monitor&quot;, &quot;precio&quot;:{" "}
            {req.cuerpoValido ? "250000" : '"caro"'} {"}"}
          </label>
        </fieldset>

        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-lg border px-2 py-0.5 font-mono text-xs ${claseStatus(respuesta.status)}`}>
              {respuesta.status} {respuesta.textoStatus}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{respuesta.origen}</span>
          </div>
          {Object.keys(respuesta.headers).length > 0 && (
            <ul className="font-mono text-xs text-muted-foreground">
              {Object.entries(respuesta.headers).map(([clave, valor]) => (
                <li key={clave}>
                  {clave}: <span className="text-foreground">{valor}</span>
                </li>
              ))}
            </ul>
          )}
          <pre className="overflow-x-auto rounded-lg bg-background p-2 font-mono text-xs text-foreground">
            {respuesta.cuerpo ?? "(sin body)"}
          </pre>
        </div>

        <p className="text-xs text-muted-foreground">
          Probá un PATCH: ningún archivo lo exporta, así que Next responde 405 sin que escribas
          nada. Además implementa solo <code>HEAD</code> (a partir de <code>GET</code>) y{" "}
          <code>OPTIONS</code> (204 con el header <code>Allow</code>). Cada status tiene un
          significado que el cliente puede usar.
        </p>
      </div>
    </div>
  );
}
