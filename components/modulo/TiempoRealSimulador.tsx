"use client";

import { useEffect, useRef, useState } from "react";

type Modo = "polling" | "websocket";
type TipoEvento = "salida" | "entrada" | "sistema";

interface EventoLog {
  texto: string;
  tipo: TipoEvento;
}

function claseEvento(tipo: TipoEvento): string {
  switch (tipo) {
    case "salida":
      return "text-muted-foreground";
    case "entrada":
      return "text-success";
    case "sistema":
      return "text-info";
  }
}

const botonBase =
  "rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent disabled:pointer-events-none disabled:opacity-40";

export function TiempoRealSimulador() {
  const [modo, setModo] = useState<Modo>("polling");
  const [conectado, setConectado] = useState(false);
  const [eventos, setEventos] = useState<EventoLog[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function agregarEvento(texto: string, tipo: TipoEvento) {
    setEventos((prev) => [{ texto, tipo }, ...prev].slice(0, 8));
  }

  function conectar() {
    setConectado(true);
    setEventos([]);

    if (modo === "polling") {
      agregarEvento("Arranca el polling: una petición nueva cada 2s, haya o no datos nuevos.", "sistema");
      intervalRef.current = setInterval(() => {
        agregarEvento("→ GET /mensajes/nuevos", "salida");
        const hayMensaje = Math.random() < 0.3;
        setTimeout(() => {
          agregarEvento(
            hayMensaje ? "← 200 OK, 1 mensaje nuevo" : "← 200 OK, 0 mensajes nuevos",
            "entrada",
          );
        }, 300);
      }, 2000);
    } else {
      agregarEvento("Handshake HTTP → upgrade a WebSocket. Conexión persistente abierta.", "sistema");
      intervalRef.current = setInterval(() => {
        const hayMensaje = Math.random() < 0.4;
        if (hayMensaje) {
          agregarEvento("← mensaje push del servidor (sin pedir nada)", "entrada");
        }
      }, 1500);
    }
  }

  function desconectar() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setConectado(false);
    agregarEvento(
      modo === "polling" ? "Se detiene el polling." : "Conexión WebSocket cerrada.",
      "sistema",
    );
  }

  function cambiarModo(nuevoModo: Modo) {
    if (conectado) desconectar();
    setModo(nuevoModo);
    setEventos([]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cambiarModo("polling")}
          className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
            modo === "polling"
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Polling (REST)
        </button>
        <button
          type="button"
          onClick={() => cambiarModo("websocket")}
          className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
            modo === "websocket"
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          WebSocket
        </button>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={conectar} disabled={conectado} className={botonBase}>
          Conectar
        </button>
        <button type="button" onClick={desconectar} disabled={!conectado} className={botonBase}>
          Desconectar
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Actividad de red
        </span>
        <div className="mt-2 flex flex-col gap-1">
          {eventos.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            eventos.map((evento, index) => (
              <span key={index} className={claseEvento(evento.tipo)}>
                {evento.texto}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
