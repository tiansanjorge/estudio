"use client";

import { useState } from "react";

function bloquearPor(ms: number) {
  const fin = performance.now() + ms;
  let acumulador = 0;
  while (performance.now() < fin) {
    acumulador += Math.random();
  }
  return acumulador;
}

function procesarEnChunks(chunksRestantes: number, msPorChunk: number, alTerminar: () => void) {
  if (chunksRestantes <= 0) {
    alTerminar();
    return;
  }
  bloquearPor(msPorChunk);
  setTimeout(() => procesarEnChunks(chunksRestantes - 1, msPorChunk, alTerminar), 0);
}

const DURACION_TOTAL_MS = 1500;
const CANTIDAD_CHUNKS = 10;

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function TrabajoEnChunksDemo() {
  const [texto, setTexto] = useState("");
  const [corriendo, setCorriendo] = useState(false);
  const [ultimoResultado, setUltimoResultado] = useState<string | null>(null);

  function correrBloqueante() {
    setCorriendo(true);
    setUltimoResultado(null);
    // Esto bloquea el hilo principal por completo: ni siquiera el "Corriendo..."
    // de acá abajo llega a pintarse hasta que termine, porque el navegador
    // no puede repintar la pantalla en medio de una función síncrona.
    bloquearPor(DURACION_TOTAL_MS);
    setCorriendo(false);
    setUltimoResultado(`Terminó el trabajo SIN pausas (bloqueó el hilo ${DURACION_TOTAL_MS}ms de una).`);
  }

  function correrEnChunks() {
    setCorriendo(true);
    setUltimoResultado(null);
    procesarEnChunks(CANTIDAD_CHUNKS, DURACION_TOTAL_MS / CANTIDAD_CHUNKS, () => {
      setCorriendo(false);
      setUltimoResultado(
        `Terminó el mismo trabajo en ${CANTIDAD_CHUNKS} chunks, cediendo el control entre cada uno.`,
      );
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Esto es trabajo real bloqueando el hilo principal, no una animación.
        Escribí algo en el input y, mientras escribís, probá cada botón —
        vas a sentir la diferencia de verdad.
      </p>

      <input
        value={texto}
        onChange={(event) => setTexto(event.target.value)}
        placeholder="Escribí acá antes y durante cada prueba..."
        className="rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-accent"
      />

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={correrBloqueante}
          disabled={corriendo}
          className={botonBase}
        >
          Trabajo SIN pausas (bloquea 1.5s)
        </button>
        <button
          type="button"
          onClick={correrEnChunks}
          disabled={corriendo}
          className={botonBase}
        >
          Mismo trabajo, EN CHUNKS (no bloquea)
        </button>
      </div>

      {corriendo && (
        <span className="w-fit rounded-lg border border-info/30 bg-info-soft px-3 py-1 text-xs font-medium text-info">
          Corriendo… probá seguir escribiendo
        </span>
      )}
      {ultimoResultado && (
        <span className="text-sm text-muted-foreground">{ultimoResultado}</span>
      )}
    </div>
  );
}
