"use client";

import { useState } from "react";
import {
  ACCIONES,
  NORMALIZADO_INICIAL,
  PLANILLA_INICIAL,
  aplicarNormalizado,
  aplicarPlanilla,
  type AccionId,
} from "@/lib/modules/bases-de-datos/modelado-normalizacion";

function Tabla({ titulo, columnas, filas }: { titulo: string; columnas: string[]; filas: (string | number)[][] }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-xs text-muted-foreground">{titulo}</span>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-surface text-muted-foreground">
            <tr>
              {columnas.map((c) => (
                <th key={c} className="px-2 py-1 font-normal">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-foreground">
            {filas.map((fila, i) => (
              <tr key={i} className="border-t border-border">
                {fila.map((celda, j) => (
                  <td key={j} className="px-2 py-1">
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function NormalizacionSimulador() {
  const [accion, setAccion] = useState<AccionId | null>(null);
  const planilla = accion ? aplicarPlanilla(PLANILLA_INICIAL, accion) : null;
  const normalizado = accion ? aplicarNormalizado(NORMALIZADO_INICIAL, accion) : null;
  const filasPlanilla = planilla?.filas ?? PLANILLA_INICIAL;
  const datos = normalizado?.datos ?? NORMALIZADO_INICIAL;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Operación">
        {ACCIONES.map((a) => (
          <button
            key={a.id}
            type="button"
            aria-pressed={accion === a.id}
            onClick={() => setAccion(a.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              accion === a.id ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.nombre}
          </button>
        ))}
        <button type="button" onClick={() => setAccion(null)} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
          reiniciar
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground">Una sola tabla (como una planilla)</span>
          <Tabla
            titulo="pedidos_planos"
            columnas={["pedido", "cliente", "email", "producto", "precio", "cant."]}
            filas={filasPlanilla.map((f) => [f.pedido, f.cliente, f.email, f.producto, f.precio, f.cantidad])}
          />
          {planilla && (
            <p
              className={`rounded-lg border px-3 py-2 text-xs text-foreground ${
                planilla.problema ? "border-error/30 bg-error-soft" : "border-success/30 bg-success-soft"
              }`}
            >
              <span className={`font-medium ${planilla.problema ? "text-error" : "text-success"}`}>
                {ACCIONES.find((a) => a.id === accion)?.anomalia}:{" "}
              </span>
              {planilla.resultado}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-foreground">Normalizado (3 tablas)</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <Tabla titulo="clientes" columnas={["id", "nombre", "email"]} filas={datos.clientes.map((c) => [c.id, c.nombre, c.email])} />
            <Tabla titulo="productos" columnas={["id", "nombre", "precio"]} filas={datos.productos.map((p) => [p.id, p.nombre, p.precio])} />
          </div>
          <Tabla
            titulo="pedidos"
            columnas={["id", "cliente_id", "producto_id", "cant."]}
            filas={datos.pedidos.map((p) => [p.id, p.clienteId, p.productoId, p.cantidad])}
          />
          {normalizado && (
            <p className="rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-xs text-foreground">
              {normalizado.resultado}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
