"use client";

import { useEffect, useRef, useState } from "react";

type EstadoBusqueda = "idle" | "buscando" | "listo";

function claseEstado(estado: EstadoBusqueda): string {
  switch (estado) {
    case "idle":
      return "border-border text-muted-foreground";
    case "buscando":
      return "border-info/30 bg-info-soft text-info";
    case "listo":
      return "border-success/30 bg-success-soft text-success";
  }
}

const textoEstado: Record<EstadoBusqueda, string> = {
  idle: "Inactivo",
  buscando: "Buscando…",
  listo: "Listo",
};

export function BusquedaConCancelacion() {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState<EstadoBusqueda>("idle");
  const [resultado, setResultado] = useState<string | null>(null);
  const [eventos, setEventos] = useState<string[]>([]);
  const idRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Solo para limpiar el timer pendiente si el componente se desmonta.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function manejarCambio(value: string) {
    setQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      const idCancelado = idRef.current;
      setEventos((prev) =>
        [`Request #${idCancelado} cancelada (llegó un input nuevo)`, ...prev].slice(0, 6),
      );
    }

    if (value.trim() === "") {
      setEstado("idle");
      setResultado(null);
      return;
    }

    idRef.current += 1;
    const idActual = idRef.current;
    setEstado("buscando");
    setEventos((prev) => [`Request #${idActual} iniciada para "${value}"`, ...prev].slice(0, 6));

    timeoutRef.current = setTimeout(() => {
      setEstado("listo");
      setResultado(`Resultados para "${value}"`);
      setEventos((prev) => [`Request #${idActual} completada`, ...prev].slice(0, 6));
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Esto simula un fetch con un timer de 900ms (no pega a una red real).
        Escribí rápido para ver cómo se cancela cada búsqueda anterior.
      </p>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="busqueda-simulada"
          className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Buscar
        </label>
        <input
          id="busqueda-simulada"
          value={query}
          onChange={(event) => manejarCambio(event.target.value)}
          placeholder="Escribí algo..."
          className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-lg border px-3 py-1 text-xs font-medium ${claseEstado(estado)}`}>
          {textoEstado[estado]}
        </span>
        {resultado && <span className="text-sm text-foreground">{resultado}</span>}
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Log de requests
        </span>
        <div className="mt-2 flex flex-col gap-1">
          {eventos.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            eventos.map((evento, index) => (
              <span key={index} className="text-muted-foreground">
                {evento}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
