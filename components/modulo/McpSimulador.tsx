"use client";

import { useState } from "react";
import { PEDIDOS, SERVIDORES, trazarFlujo, type PasoFlujo, type ServidorId } from "@/lib/modules/ia-aplicada/mcp-servers";

const ESTILO: Record<PasoFlujo["tipo"], string> = {
  normal: "border-border bg-surface",
  alerta: "border-warning/30 bg-warning-soft",
  error: "border-error/30 bg-error-soft",
};

export function McpSimulador() {
  const [conectados, setConectados] = useState<ServidorId[]>(["postgres", "archivos"]);
  const [pedidoId, setPedidoId] = useState(PEDIDOS[0].id);
  const [inyectado, setInyectado] = useState(false);
  const pedido = PEDIDOS.find((p) => p.id === pedidoId) ?? PEDIDOS[0];
  const pasos = trazarFlujo(pedido, conectados, inyectado);

  function alternar(id: ServidorId) {
    setConectados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Servidores MCP conectados al host</legend>
        {SERVIDORES.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={conectados.includes(s.id)} onChange={() => alternar(s.id)} className="accent-accent" />
            {s.nombre} <span className="font-mono text-xs text-muted-foreground">({s.tools.join(", ")})</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">Lo que pide el usuario</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pedido">
          {PEDIDOS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={p.id === pedidoId}
              onClick={() => setPedidoId(p.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                p.id === pedidoId ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.texto}
            </button>
          ))}
        </div>
        {pedido.id === "readme" && (
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={inyectado} onChange={(e) => setInyectado(e.target.checked)} className="accent-accent" />
            El README tiene una instrucción escondida (prompt injection)
          </label>
        )}
      </div>

      <ol className="flex flex-col gap-2" aria-live="polite">
        {pasos.map((paso) => (
          <li key={paso.titulo} className={`flex flex-col gap-2 rounded-xl border p-3 ${ESTILO[paso.tipo]}`}>
            <span className="text-sm font-medium text-foreground">{paso.titulo}</span>
            <p className="text-sm text-muted-foreground">{paso.detalle}</p>
            {paso.codigo && (
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-3 font-mono text-[11px] text-foreground">
                {paso.codigo}
              </pre>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
