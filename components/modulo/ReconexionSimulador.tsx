"use client";

import { useState } from "react";
import {
  DESCONEXION,
  TOTAL_MENSAJES,
  simularCliente,
  type ConfigCliente,
} from "@/lib/modules/backend/websockets-tiempo-real";
import { BloqueCodigo } from "./BloqueCodigo";

function generarCodigo({ resync, dedup }: ConfigCliente): string {
  return [
    "let ultimoId = 0;",
    "const vistos = new Set();",
    "",
    'socket.on("mensaje", (m) => {',
    dedup ? "  if (vistos.has(m.id)) return; // ya lo mostré: descartar" : "  // (sin dedup: un mensaje repetido se muestra dos veces)",
    "  vistos.add(m.id);",
    "  ultimoId = m.id;",
    "  mostrar(m);",
    "});",
    "",
    'socket.on("reconnect", () => {',
    resync
      ? '  socket.emit("resync", { desde: ultimoId }); // pedir lo perdido'
      : "  // (sin resync: lo emitido durante el corte se pierde)",
    "});",
  ].join("\n");
}

export function ReconexionSimulador() {
  const [config, setConfig] = useState<ConfigCliente>({ resync: false, dedup: false });
  const { recibidos, perdidos } = simularCliente(config);
  const duplicados = recibidos.filter((m) => m.duplicado).length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-foreground">
        Un chat: el servidor emite m1…m{TOTAL_MENSAJES}, uno por segundo. El cliente pierde la
        conexión en el segundo {DESCONEXION.desde} (entra a un túnel) y reconecta en el{" "}
        {DESCONEXION.hasta}.
      </p>

      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: TOTAL_MENSAJES }, (_, i) => i + 1).map((t) => {
          const caido = t >= DESCONEXION.desde && t < DESCONEXION.hasta;
          return (
            <div key={t} className="flex flex-1 flex-col items-center gap-1">
              <span className={`h-2 w-full rounded-full ${caido ? "bg-error/60" : "bg-success/60"}`} />
              <span className="font-mono text-[10px] text-muted-foreground">t{t}</span>
            </div>
          );
        })}
      </div>

      <fieldset className="flex flex-wrap gap-4 text-xs text-foreground">
        <legend className="sr-only">Estrategia del cliente</legend>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.resync}
            onChange={(e) => setConfig((c) => ({ ...c, resync: e.target.checked }))}
            className="accent-accent"
          />
          Al reconectar, pedir lo perdido desde el último id
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={config.dedup}
            onChange={(e) => setConfig((c) => ({ ...c, dedup: e.target.checked }))}
            className="accent-accent"
          />
          Descartar ids ya vistos
        </label>
      </fieldset>

      <BloqueCodigo titulo="Cliente" codigo={generarCodigo(config)} resaltadas={[5, 12]} />

      <div className="flex flex-col gap-2" aria-live="polite">
        <span className="text-sm font-medium text-foreground">Lo que muestra el cliente</span>
        <ul className="flex flex-wrap gap-1.5">
          {recibidos.map((m, i) => (
            <li
              key={i}
              className={`rounded-md border px-2 py-1 font-mono text-xs ${
                m.duplicado
                  ? "border-error/30 bg-error-soft text-error"
                  : m.via === "replay"
                    ? "border-info/30 bg-info-soft text-info"
                    : "border-border bg-surface text-foreground"
              }`}
            >
              m{m.id}
              {m.via === "replay" && " ↺"}
            </li>
          ))}
        </ul>
        <p className={`font-mono text-xs ${perdidos.length || duplicados ? "text-error" : "text-success"}`}>
          perdidos: {perdidos.length ? perdidos.map((p) => `m${p}`).join(", ") : "ninguno"} · duplicados:{" "}
          {duplicados || "ninguno"}
        </p>
      </div>

      <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
        {!config.resync
          ? "Un WebSocket no guarda nada mientras no hay conexión: lo que se emitió en el túnel se perdió para siempre."
          : !config.dedup
            ? "Con replay se recuperan los mensajes perdidos, pero el servidor reenvía desde el último id inclusive: m3 aparece dos veces. El cliente tiene que ser idempotente."
            : "Replay + deduplicación por id: entrega efectivamente una vez, aunque la red y el servidor entreguen al menos una vez."}
      </p>
    </div>
  );
}
