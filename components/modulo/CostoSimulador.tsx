"use client";

import { useId, useState } from "react";
import { EQUILIBRIO_MILLONES, VOLUMENES, costos } from "@/lib/modules/cloud/costo-escalabilidad";

const usd = new Intl.NumberFormat("es-AR", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const numero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

export function CostoSimulador() {
  const [indice, setIndice] = useState(2);
  const idRango = useId();
  const millones = VOLUMENES[indice];
  const opciones = costos(millones);
  const minimo = Math.min(...opciones.map((o) => o.costo));
  const maximo = Math.max(...opciones.map((o) => o.costo));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor={idRango} className="text-sm font-medium text-foreground">
          Tráfico: {numero.format(millones)} millones de requests por mes (≈ {numero.format((millones * 1e6) / 2_592_000)} por segundo en promedio)
        </label>
        <input
          id={idRango}
          type="range"
          min={0}
          max={VOLUMENES.length - 1}
          value={indice}
          onChange={(e) => setIndice(Number(e.target.value))}
          className="accent-accent"
        />
      </div>

      <ul className="flex flex-col gap-3" aria-live="polite">
        {opciones.map((o) => {
          const masBarata = o.costo === minimo;
          return (
            <li key={o.id} className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-foreground">
                  {o.nombre}
                  {masBarata && <span className="ml-2 text-xs text-success">más barata</span>}
                </span>
                <span className="font-mono text-foreground">{usd.format(o.costo)}/mes</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full rounded-full ${masBarata ? "bg-success" : "bg-accent"}`}
                  style={{ width: `${maximo === 0 ? 0 : Math.max((o.costo / maximo) * 100, 1)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {o.detalle} · {usd.format(o.costo / millones)} por millón de requests
              </span>
            </li>
          );
        })}
      </ul>

      <p className="rounded-2xl border border-border p-4 text-sm leading-6 text-foreground">
        Con estos precios, el mínimo de contenedores empieza a ganarle a serverless alrededor de los{" "}
        {numero.format(EQUILIBRIO_MILLONES)} millones de requests por mes. Por debajo, pagar por uso es más barato que
        tener instancias ociosas; por encima, el costo por request de serverless sigue igual mientras el de los
        contenedores baja. Los precios son ilustrativos: el punto de equilibrio real depende de la duración y la memoria
        de cada request, y conviene calcularlo con tus números.
      </p>
    </div>
  );
}
