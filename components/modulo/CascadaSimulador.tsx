"use client";

import { useState } from "react";
import {
  calcularCascadaHttp1,
  calcularCascadaHttp2,
  tiempoTotal,
} from "@/lib/modules/http/cascada";

const opcionesCantidad = [6, 12, 20];

interface PanelProps {
  titulo: string;
  timeline: { id: number; inicio: number; fin: number }[];
  escala: number;
}

function Panel({ titulo, timeline, escala }: PanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-foreground">{titulo}</span>
        <span className="text-xs text-muted-foreground">
          Tiempo total: {tiempoTotal(timeline)} {tiempoTotal(timeline) === 1 ? "unidad" : "unidades"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {timeline.map((recurso) => (
          <div key={recurso.id} className="h-2 w-full rounded-full bg-surface">
            <div
              className="h-2 rounded-full bg-accent"
              style={{
                marginLeft: `${(recurso.inicio / escala) * 100}%`,
                width: `${((recurso.fin - recurso.inicio) / escala) * 100}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CascadaSimulador() {
  const [cantidad, setCantidad] = useState(12);

  const timelineHttp1 = calcularCascadaHttp1(cantidad);
  const timelineHttp2 = calcularCascadaHttp2(cantidad);
  const escala = tiempoTotal(timelineHttp1);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Recursos a cargar (imágenes, JS, CSS...)
        </span>
        <div className="flex flex-wrap gap-2">
          {opcionesCantidad.map((valor) => (
            <button
              key={valor}
              type="button"
              onClick={() => setCantidad(valor)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                valor === cantidad
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {valor}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel titulo="HTTP/1.1 (máx. 6 conexiones)" timeline={timelineHttp1} escala={escala} />
        <Panel titulo="HTTP/2 (multiplexado)" timeline={timelineHttp2} escala={escala} />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        Simplificado: en HTTP/1.1 los recursos se cargan en tandas de a 6. En
        HTTP/2 arrancan todos juntos sobre la misma conexión. HTTP/3 se ve
        igual que HTTP/2 en este gráfico — la diferencia entre ambos no es
        cuántos recursos multiplexan, sino qué pasa cuando se pierde un
        paquete (lo ves en la Explicación).
      </p>
    </div>
  );
}
