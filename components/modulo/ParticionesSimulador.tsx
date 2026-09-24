"use client";

import { useId, useState } from "react";
import { MENSAJES, distribuir, type Clave } from "@/lib/modules/system-design/colas-pub-sub";

const COLORES = ["bg-accent", "bg-success", "bg-warning", "bg-info", "bg-error", "bg-foreground"];
const PEDIDO_COLOR: Record<string, string> = { p1: COLORES[0], p2: COLORES[1], p3: COLORES[2], p4: COLORES[3], p5: COLORES[4], p6: COLORES[5] };

export function ParticionesSimulador() {
  const [clave, setClave] = useState<Clave>("pedido");
  const [particiones, setParticiones] = useState(3);
  const [consumidores, setConsumidores] = useState(3);
  const idParticiones = useId();
  const idConsumidores = useId();
  const d = distribuir(clave, particiones, consumidores);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Clave de partición">
        {(
          [
            { id: "pedido", nombre: "Clave = id del pedido" },
            { id: "sin-clave", nombre: "Sin clave" },
          ] as const
        ).map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={o.id === clave}
            onClick={() => setClave(o.id)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              o.id === clave ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={idParticiones} className="text-sm text-foreground">
            Particiones del topic: {particiones}
          </label>
          <input id={idParticiones} type="range" min={1} max={6} value={particiones} onChange={(e) => setParticiones(Number(e.target.value))} className="accent-accent" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor={idConsumidores} className="text-sm text-foreground">
            Consumidores en el grupo: {consumidores}
          </label>
          <input id={idConsumidores} type="range" min={1} max={8} value={consumidores} onChange={(e) => setConsumidores(Number(e.target.value))} className="accent-accent" />
        </div>
      </div>

      <div className="flex flex-col gap-2" aria-live="polite">
        {d.porParticion.map((mensajes, p) => {
          const consumidor = d.asignacion.findIndex((ps) => ps.includes(p));
          return (
            <div key={p} className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-3">
              <span className="text-xs text-muted-foreground">
                Partición {p} → consumidor {consumidor + 1} · {mensajes.length} mensajes
              </span>
              <div className="flex flex-wrap gap-1">
                {mensajes.map((m) => (
                  <span
                    key={m.indice}
                    title={`${m.pedido}: ${m.etapa}`}
                    className={`rounded px-1.5 py-0.5 font-mono text-[10px] text-background ${PEDIDO_COLOR[m.pedido]}`}
                  >
                    {m.pedido}·{m.etapa.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-1 rounded-2xl border border-border p-4 text-sm">
        <span className={d.pedidosSinOrden.length > 0 ? "text-error" : "text-success"}>
          {d.pedidosSinOrden.length > 0
            ? `Orden no garantizado para ${d.pedidosSinOrden.join(", ")}: sus eventos están en particiones distintas, y un consumidor puede procesar "entregado" antes que "pagado".`
            : "Cada pedido vive en una sola partición: sus eventos se procesan en orden."}
        </span>
        <span className={d.consumidoresOciosos > 0 ? "text-warning" : "text-foreground"}>
          {d.consumidoresOciosos > 0
            ? `${d.consumidoresOciosos} consumidor${d.consumidoresOciosos === 1 ? "" : "es"} ocioso${d.consumidoresOciosos === 1 ? "" : "s"}: hay más consumidores que particiones, y una partición la lee uno solo.`
            : "Todos los consumidores tienen particiones asignadas."}
        </span>
        <span className="text-muted-foreground">
          {MENSAJES.length} mensajes; el consumidor más cargado tarda {d.segundosParaVaciar.toLocaleString("es-AR")} s en vaciar su parte.
        </span>
      </div>
    </div>
  );
}
