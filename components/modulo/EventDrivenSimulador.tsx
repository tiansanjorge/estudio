"use client";

import { useState } from "react";
import {
  simularFlujo,
  type ConfigFlujo,
  type EstadoLinea,
  type Modo,
} from "@/lib/modules/arquitectura/event-driven";

const ESTILO_ESTADO: Record<EstadoLinea, string> = {
  ok: "border-success/30 bg-success-soft text-success",
  error: "border-error/30 bg-error-soft text-error",
  pendiente: "border-warning/30 bg-warning-soft text-warning",
  duplicado: "border-error/30 bg-error-soft text-error",
};

const ICONO: Record<EstadoLinea, string> = { ok: "✓", error: "✗", pendiente: "⏳", duplicado: "✗✗" };

const MODOS: { id: Modo; nombre: string }[] = [
  { id: "sincronico", nombre: "Llamadas sincrónicas" },
  { id: "eventos", nombre: "Evento en una cola" },
];

export function EventDrivenSimulador() {
  const [config, setConfig] = useState<ConfigFlujo>({
    modo: "sincronico",
    emailCaido: false,
    entregaDuplicada: false,
    consumidorIdempotente: false,
  });
  const resultado = simularFlujo(config);
  const esEventos = config.modo === "eventos";

  function cambiar<K extends keyof ConfigFlujo>(clave: K, valor: ConfigFlujo[K]) {
    setConfig((c) => ({ ...c, [clave]: valor }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Forma de comunicación">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            aria-pressed={config.modo === m.id}
            onClick={() => cambiar("modo", m.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              config.modo === m.id
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.nombre}
          </button>
        ))}
      </div>

      <fieldset className="flex flex-wrap gap-4 text-xs text-foreground">
        <legend className="sr-only">Condiciones</legend>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={config.emailCaido} onChange={(e) => cambiar("emailCaido", e.target.checked)} className="accent-accent" />
          El servicio de email está caído
        </label>
        <label className={`flex items-center gap-2 ${esEventos ? "cursor-pointer" : "opacity-50"}`}>
          <input
            type="checkbox"
            disabled={!esEventos}
            checked={config.entregaDuplicada}
            onChange={(e) => cambiar("entregaDuplicada", e.target.checked)}
            className="accent-accent"
          />
          La cola entrega el evento dos veces
        </label>
        <label className={`flex items-center gap-2 ${esEventos ? "cursor-pointer" : "opacity-50"}`}>
          <input
            type="checkbox"
            disabled={!esEventos}
            checked={config.consumidorIdempotente}
            onChange={(e) => cambiar("consumidorIdempotente", e.target.checked)}
            className="accent-accent"
          />
          Consumidor idempotente
        </label>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <p
          className={`rounded-xl border px-3 py-2 font-mono text-xs ${
            resultado.checkoutOk
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          Checkout: {resultado.checkoutOk ? "pedido confirmado" : "error para el usuario"}
        </p>
        <p className="rounded-xl border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
          El usuario espera: {resultado.latenciaMs.toLocaleString("es-AR")} ms
        </p>
      </div>

      <ul className="flex flex-col gap-2" aria-live="polite">
        {resultado.lineas.map((l) => (
          <li key={l.servicio} className={`rounded-xl border px-3 py-2 text-xs ${ESTILO_ESTADO[l.estado]}`}>
            <span className="font-mono">
              {ICONO[l.estado]} {l.servicio}
            </span>
            <span className="ml-2 text-foreground">{l.texto}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground">
        Con eventos, el checkout solo guarda el pedido y publica &quot;PedidoCreado&quot;: los demás
        servicios reaccionan después. Se gana latencia y resiliencia, a cambio de consistencia
        eventual y de tener que manejar reintentos y duplicados.
      </p>
    </div>
  );
}
