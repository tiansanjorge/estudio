"use client";

import { useState } from "react";
import {
  ETIQUETA_DISTANCIA,
  ETIQUETA_TRANSPORTE,
  RTT_MS,
  calcularEtapas,
  totalMs,
  type ConfigRed,
  type Distancia,
  type Etapa,
  type Transporte,
} from "@/lib/modules/http/fundamentos-red";

const COLOR_ETAPA: Record<Etapa["id"], string> = {
  dns: "bg-info",
  tcp: "bg-warning",
  tls: "bg-accent",
  request: "bg-success",
  servidor: "bg-muted-foreground",
};

/** Escala fija para que los cambios de config se vean como barras más cortas o largas. */
const ESCALA_MS = 800;

function Opciones<T extends string>({
  etiqueta,
  valores,
  actual,
  nombres,
  alCambiar,
}: {
  etiqueta: string;
  valores: T[];
  actual: T;
  nombres: Record<T, string>;
  alCambiar: (valor: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{etiqueta}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={etiqueta}>
        {valores.map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={v === actual}
            onClick={() => alCambiar(v)}
            className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
              v === actual
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {nombres[v]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LatenciaConexionSimulador() {
  const [config, setConfig] = useState<ConfigRed>({
    dnsEnCache: false,
    conexionReutilizada: false,
    transporte: "tcp-tls12",
    distancia: "otro-continente",
  });
  const etapas = calcularEtapas(config);
  const total = totalMs(etapas);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Opciones<Distancia>
          etiqueta={`Distancia (RTT ≈ ${RTT_MS[config.distancia]} ms)`}
          valores={["otro-continente", "mismo-pais", "cdn"]}
          actual={config.distancia}
          nombres={ETIQUETA_DISTANCIA}
          alCambiar={(distancia) => setConfig((c) => ({ ...c, distancia }))}
        />
        <Opciones<Transporte>
          etiqueta="Transporte y cifrado"
          valores={["tcp-tls12", "tcp-tls13", "quic"]}
          actual={config.transporte}
          nombres={ETIQUETA_TRANSPORTE}
          alCambiar={(transporte) => setConfig((c) => ({ ...c, transporte }))}
        />
      </div>
      <fieldset className="flex flex-wrap gap-4 text-sm text-foreground">
        <legend className="sr-only">Estado previo</legend>
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={config.dnsEnCache}
            onChange={(e) => setConfig((c) => ({ ...c, dnsEnCache: e.target.checked }))}
            className="accent-accent"
          />
          DNS ya resuelto (en cache)
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={config.conexionReutilizada}
            onChange={(e) => setConfig((c) => ({ ...c, conexionReutilizada: e.target.checked }))}
            className="accent-accent"
          />
          Conexión ya abierta (keep-alive)
        </label>
      </fieldset>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
        <div
          className="flex h-6 overflow-hidden rounded-lg bg-border"
          role="img"
          aria-label={`Tiempo hasta el primer byte: ${total} milisegundos`}
        >
          {etapas
            .filter((e) => e.ms > 0)
            .map((e) => (
              <div
                key={e.id}
                className={`${COLOR_ETAPA[e.id]} h-full transition-all duration-500`}
                style={{ width: `${(e.ms / ESCALA_MS) * 100}%` }}
                title={`${e.nombre}: ${e.ms} ms`}
              />
            ))}
        </div>
        <p className="font-mono text-sm text-foreground">
          Tiempo hasta el primer byte (TTFB): <strong>{total} ms</strong>
        </p>
        <ul className="flex flex-col gap-2">
          {etapas.map((e) => (
            <li key={e.id} className="flex items-start gap-3 text-xs">
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-sm ${COLOR_ETAPA[e.id]}`} aria-hidden="true" />
              <span className="w-32 shrink-0 font-mono text-foreground">
                {e.nombre} · {e.ms} ms
              </span>
              <span className="text-muted-foreground">{e.detalle}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted-foreground">
        Valores aproximados. Fijate que casi todo el costo son round trips: con un servidor lejos,
        cada ida y vuelta pesa mucho más que el tiempo de procesamiento. Por eso CDN, reutilizar
        conexiones y protocolos con menos handshakes ayudan tanto.
      </p>
    </div>
  );
}
