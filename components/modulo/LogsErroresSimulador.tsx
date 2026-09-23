"use client";

import { useId, useState } from "react";
import {
  lineasDeLog,
  respuestaAlCliente,
  type EstiloError,
} from "@/lib/modules/backend/errores-logging";

const COLOR_NIVEL = { info: "text-muted-foreground", warn: "text-warning", error: "text-error" } as const;

export function LogsErroresSimulador() {
  const idFiltro = useId();
  const [estructurado, setEstructurado] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [estilo, setEstilo] = useState<EstiloError>("generico");
  const [exponer, setExponer] = useState(true);

  const lineas = lineasDeLog(estructurado).filter((l) =>
    filtro.trim() === "" ? true : l.texto.toLowerCase().includes(filtro.trim().toLowerCase()),
  );
  const respuesta = respuestaAlCliente(estilo, exponer);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-foreground">
          Tres requests concurrentes. Uno de los pedidos falla. Encontrá qué le pasó al usuario{" "}
          <code className="font-mono">u_42</code>.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
            <input type="checkbox" checked={estructurado} onChange={(e) => setEstructurado(e.target.checked)} className="accent-accent" />
            Logs estructurados (JSON con requestId)
          </label>
          <label htmlFor={idFiltro} className="flex flex-col gap-1 text-xs text-muted-foreground">
            Filtrar
            <input
              id={idFiltro}
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder={estructurado ? 'probá "u_42" y después "req_b2"' : 'probá "u_42"'}
              className="rounded-lg border border-border bg-surface px-2 py-1 font-mono text-xs text-foreground"
            />
          </label>
        </div>
        <ol className="flex flex-col gap-0.5 rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5">
          {lineas.length === 0 ? (
            <li className="text-muted-foreground">(sin resultados)</li>
          ) : (
            lineas.map((l, i) => (
              <li key={i} className={`break-all ${COLOR_NIVEL[l.nivel]}`}>
                {l.texto}
              </li>
            ))
          )}
        </ol>
        <p className="text-xs text-muted-foreground">
          {estructurado
            ? "Con el requestId se reconstruye todo el recorrido del request que falló, aunque las líneas estén intercaladas con las de otros."
            : "En texto libre, las líneas de los tres requests se mezclan: no hay forma de saber qué \"Stock ok\" corresponde al pedido que falló, ni por qué falló."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Y la respuesta que recibe el cliente</p>
        <div className="flex flex-wrap items-center gap-4 text-xs text-foreground">
          <div className="flex gap-2" role="group" aria-label="Manejo del error">
            {(
              [
                ["generico", "throw genérico + 500"],
                ["tipado", "error de dominio tipado"],
              ] as const
            ).map(([id, texto]) => (
              <button
                key={id}
                type="button"
                aria-pressed={estilo === id}
                onClick={() => setEstilo(id)}
                className={`rounded-xl border px-3 py-1.5 transition-colors ${
                  estilo === id ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {texto}
              </button>
            ))}
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={exponer} onChange={(e) => setExponer(e.target.checked)} className="accent-accent" />
            Mandar detalles internos al cliente
          </label>
        </div>
        <pre
          className={`overflow-x-auto rounded-xl border p-3 font-mono text-[11px] leading-5 text-foreground ${
            estilo === "generico" && exponer ? "border-error/30 bg-error-soft" : "border-border bg-background"
          }`}
        >
          {`HTTP ${respuesta.status}\n${JSON.stringify(respuesta.body, null, 2)}`}
        </pre>
        <p className="text-xs text-muted-foreground">
          {estilo === "generico" && exponer
            ? "El stack trace le muestra al mundo rutas, librerías y versiones, y el cliente no sabe si reintentar."
            : estilo === "generico"
              ? "Seguro, pero inútil: el cliente no sabe qué pasó ni si puede reintentar, y soporte no puede buscar el caso."
              : "El cliente recibe un código estable, sabe que puede reintentar, y el requestId conecta el reporte del usuario con los logs."}
        </p>
      </div>
    </div>
  );
}
