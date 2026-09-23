// ── Strategy ───────────────────────────────────────────────────────────────

export interface Envio {
  pesoKg: number;
  distanciaKm: number;
}

export interface EstrategiaEnvio {
  id: string;
  nombre: string;
  calcular(envio: Envio): number;
}

export const ESTRATEGIAS_ENVIO: EstrategiaEnvio[] = [
  {
    id: "estandar",
    nombre: "Estándar",
    calcular: ({ pesoKg, distanciaKm }) => 1500 + pesoKg * 200 + distanciaKm * 10,
  },
  {
    id: "express",
    nombre: "Express",
    calcular: ({ pesoKg, distanciaKm }) => (1500 + pesoKg * 200 + distanciaKm * 10) * 1.8,
  },
  {
    id: "retiro",
    nombre: "Retiro en sucursal",
    calcular: () => 0,
  },
];

/** El contexto no sabe qué estrategia usa: solo delega. */
export function cotizarEnvio(envio: Envio, estrategia: EstrategiaEnvio): number {
  return Math.round(estrategia.calcular(envio));
}

// ── Observer ───────────────────────────────────────────────────────────────

export type Suscriptor<T> = (evento: T) => void;

export class Emisor<T> {
  private suscriptores = new Set<Suscriptor<T>>();

  suscribir(suscriptor: Suscriptor<T>): () => void {
    this.suscriptores.add(suscriptor);
    return () => this.suscriptores.delete(suscriptor);
  }

  emitir(evento: T): void {
    for (const suscriptor of this.suscriptores) suscriptor(evento);
  }
}

export interface PedidoConfirmado {
  id: string;
  total: number;
}

export const OBSERVADORES: { id: string; nombre: string; reaccion: (p: PedidoConfirmado) => string }[] = [
  { id: "inventario", nombre: "Inventario", reaccion: (p) => `Inventario: reservo el stock del pedido ${p.id}` },
  { id: "email", nombre: "Email", reaccion: (p) => `Email: mando la confirmación de $${p.total}` },
  { id: "analytics", nombre: "Analytics", reaccion: (p) => `Analytics: registro una venta de $${p.total}` },
];

// ── Factory ────────────────────────────────────────────────────────────────

export type Canal = "email" | "sms" | "push";

export interface Notificador {
  enviar(mensaje: string): string;
}

class NotificadorEmail implements Notificador {
  enviar(mensaje: string) {
    return `📧 Email con asunto y HTML: "${mensaje}"`;
  }
}

class NotificadorSms implements Notificador {
  enviar(mensaje: string) {
    return `📱 SMS recortado a 160 caracteres: "${mensaje.slice(0, 160)}"`;
  }
}

class NotificadorPush implements Notificador {
  enviar(mensaje: string) {
    return `🔔 Push con título y deep link: "${mensaje}"`;
  }
}

/** El que llama pide "un notificador para este canal" sin conocer las clases concretas. */
export function crearNotificador(canal: Canal): Notificador {
  switch (canal) {
    case "email":
      return new NotificadorEmail();
    case "sms":
      return new NotificadorSms();
    case "push":
      return new NotificadorPush();
  }
}
