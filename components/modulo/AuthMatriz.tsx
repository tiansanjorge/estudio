"use client";

import { useState } from "react";
import { ACCIONES, USUARIOS, evaluar } from "@/lib/modules/seguridad/authn-authz";

function claseStatus(status: number) {
  if (status === 200) return "border-success/30 bg-success-soft text-success";
  if (status === 401) return "border-warning/30 bg-warning-soft text-warning";
  return "border-error/30 bg-error-soft text-error";
}

export function AuthMatriz() {
  const [celda, setCelda] = useState({ usuario: "beto", accion: "pedido-ana" });
  const usuario = USUARIOS.find((u) => u.id === celda.usuario) ?? USUARIOS[0];
  const accion = ACCIONES.find((a) => a.id === celda.accion) ?? ACCIONES[0];
  const detalle = evaluar(usuario, accion);

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-2 pr-3 font-normal">Usuario ↓ / Request →</th>
              {ACCIONES.map((a) => (
                <th key={a.id} className="py-2 pr-3 font-mono font-normal">
                  {a.nombre}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {USUARIOS.map((u) => (
              <tr key={u.id} className="border-b border-border">
                <th scope="row" className="py-2 pr-3 font-normal text-foreground">
                  {u.nombre}
                </th>
                {ACCIONES.map((a) => {
                  const r = evaluar(u, a);
                  const activa = celda.usuario === u.id && celda.accion === a.id;
                  return (
                    <td key={a.id} className="py-1.5 pr-3">
                      <button
                        type="button"
                        aria-pressed={activa}
                        aria-label={`${u.nombre}, ${a.nombre}: ${r.status}`}
                        onClick={() => setCelda({ usuario: u.id, accion: a.id })}
                        className={`w-full rounded-lg border px-2 py-1 font-mono ${claseStatus(r.status)} ${
                          activa ? "ring-2 ring-accent" : ""
                        }`}
                      >
                        {r.status}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4" aria-live="polite">
        <p className="font-mono text-xs text-foreground">
          {usuario.nombre} → {accion.nombre}
        </p>
        <ol className="flex flex-col gap-1.5 text-xs">
          <li className={detalle.etapa === "publica" ? "text-muted-foreground" : detalle.etapa === "authn" ? "text-warning" : "text-success"}>
            1. Autenticación (¿quién sos?):{" "}
            {detalle.etapa === "publica" ? "no aplica" : detalle.etapa === "authn" ? "falla → 401" : "ok"}
          </li>
          <li
            className={
              detalle.etapa === "authz"
                ? "text-error"
                : detalle.etapa === "ok"
                  ? "text-success"
                  : "text-muted-foreground"
            }
          >
            2. Autorización (¿podés hacer esto?):{" "}
            {detalle.etapa === "authz"
              ? `falla → ${detalle.status}`
              : detalle.etapa === "ok"
                ? "ok"
                : "no se llega a evaluar"}
          </li>
        </ol>
        <p className="text-sm text-foreground">{detalle.explicacion}</p>
      </div>
    </div>
  );
}
