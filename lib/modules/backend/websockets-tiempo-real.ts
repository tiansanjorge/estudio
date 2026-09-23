/** El servidor emite un mensaje por segundo, con id secuencial (m1 en t=1, m2 en t=2...). */
export const TOTAL_MENSAJES = 10;
/** El cliente pierde la conexión en t=4 y reconecta en t=7. */
export const DESCONEXION = { desde: 4, hasta: 7 };

export interface ConfigCliente {
  resync: boolean;
  dedup: boolean;
}

export interface MensajeRecibido {
  id: number;
  via: "en vivo" | "replay";
  duplicado: boolean;
}

export function simularCliente(config: ConfigCliente) {
  const recibidos: MensajeRecibido[] = [];
  const vistos = new Set<number>();
  let ultimoId = 0;

  const recibir = (id: number, via: MensajeRecibido["via"]) => {
    const duplicado = vistos.has(id);
    if (duplicado && config.dedup) return;
    recibidos.push({ id, via, duplicado });
    vistos.add(id);
    ultimoId = Math.max(ultimoId, id);
  };

  for (let t = 1; t <= TOTAL_MENSAJES; t++) {
    if (t === DESCONEXION.hasta && config.resync) {
      // al reconectar, el cliente manda su último id; el servidor reenvía desde ahí
      // (inclusive, como muchos buffers): el último ya visto llega repetido
      for (let id = ultimoId; id < t; id++) recibir(id, "replay");
    }
    const conectado = t < DESCONEXION.desde || t >= DESCONEXION.hasta;
    if (conectado) recibir(t, "en vivo");
  }

  const perdidos = Array.from({ length: TOTAL_MENSAJES }, (_, i) => i + 1).filter((id) => !vistos.has(id));
  return { recibidos, perdidos };
}
