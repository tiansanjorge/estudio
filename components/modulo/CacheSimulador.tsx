"use client";

import { useRef, useState } from "react";
import {
  ejecutarPeticion,
  type DirectivaCacheSimulada,
  type EntradaCache,
  type TipoResultadoCache,
} from "@/lib/modules/http/cache";

const directivas: { valor: DirectivaCacheSimulada; etiqueta: string }[] = [
  { valor: "no-store", etiqueta: "no-store" },
  { valor: "no-cache", etiqueta: "no-cache" },
  { valor: "max-age", etiqueta: "max-age" },
];

const opcionesMaxAge = [5, 10, 30];

function claseTipo(tipo: TipoResultadoCache): string {
  switch (tipo) {
    case "red":
      return "border-border bg-surface text-foreground";
    case "cache":
      return "border-success/30 bg-success-soft text-success";
    case "revalidacion":
      return "border-info/30 bg-info-soft text-info";
  }
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent";

interface EntradaLog {
  mensaje: string;
  tipo: TipoResultadoCache;
}

export function CacheSimulador() {
  const [directiva, setDirectiva] = useState<DirectivaCacheSimulada>("max-age");
  const [maxAgeSegundos, setMaxAgeSegundos] = useState(10);
  const [tiempoActual, setTiempoActual] = useState(0);
  const [cache, setCache] = useState<EntradaCache | null>(null);
  const [etagServidor, setEtagServidor] = useState("v1");
  const [log, setLog] = useState<EntradaLog[]>([]);
  const contadorVersion = useRef(1);

  function reiniciar(nuevaDirectiva: DirectivaCacheSimulada) {
    setDirectiva(nuevaDirectiva);
    setTiempoActual(0);
    setCache(null);
    setEtagServidor("v1");
    setLog([]);
    contadorVersion.current = 1;
  }

  function hacerPeticion() {
    const resultado = ejecutarPeticion({
      directiva,
      maxAgeSegundos,
      tiempoActual,
      cache,
      etagServidor,
    });
    setCache(resultado.entradaCache);
    setLog((prev) => [{ mensaje: resultado.mensaje, tipo: resultado.tipo }, ...prev].slice(0, 6));
  }

  function avanzarTiempo(segundos: number) {
    setTiempoActual((t) => t + segundos);
  }

  function cambiarContenidoServidor() {
    contadorVersion.current += 1;
    const nuevaVersion = `v${contadorVersion.current}`;
    setEtagServidor(nuevaVersion);
    setLog((prev) =>
      [
        { mensaje: `El servidor actualizó el contenido (nuevo ETag: ${nuevaVersion}).`, tipo: "red" as TipoResultadoCache },
        ...prev,
      ].slice(0, 6),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Cache-Control
        </span>
        <div className="flex flex-wrap gap-2">
          {directivas.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => reiniciar(item.valor)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                item.valor === directiva
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </div>
        {directiva === "max-age" && (
          <div className="flex flex-wrap gap-2">
            {opcionesMaxAge.map((segundos) => (
              <button
                key={segundos}
                type="button"
                onClick={() => setMaxAgeSegundos(segundos)}
                className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                  segundos === maxAgeSegundos
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                max-age={segundos}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-foreground">
          t = {tiempoActual}s
        </span>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-foreground">
          ETag servidor: {etagServidor}
        </span>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-foreground">
          Caché local: {cache ? `${cache.etag} (guardado en t=${cache.guardadoEn}s)` : "vacío"}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={hacerPeticion} className={botonBase}>
          Hacer petición
        </button>
        <button type="button" onClick={() => avanzarTiempo(5)} className={botonBase}>
          Avanzar 5s
        </button>
        <button type="button" onClick={cambiarContenidoServidor} className={botonBase}>
          Cambiar contenido del servidor
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {log.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Todavía no hiciste ninguna petición.
          </span>
        ) : (
          log.map((entrada, index) => (
            <span
              key={index}
              className={`rounded-lg border px-3 py-2 text-sm ${claseTipo(entrada.tipo)}`}
            >
              {entrada.mensaje}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
