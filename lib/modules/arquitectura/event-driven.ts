export type Modo = "sincronico" | "eventos";

export interface ConfigFlujo {
  modo: Modo;
  emailCaido: boolean;
  entregaDuplicada: boolean;
  consumidorIdempotente: boolean;
}

interface Servicio {
  id: "inventario" | "facturacion" | "email";
  nombre: string;
  ms: number;
}

const SERVICIOS: Servicio[] = [
  { id: "inventario", nombre: "Inventario", ms: 300 },
  { id: "facturacion", nombre: "Facturación", ms: 400 },
  { id: "email", nombre: "Email", ms: 500 },
];

/** Tiempo de guardar el pedido y, en modo eventos, publicar en la cola. */
const MS_PEDIDO = 100;
const MS_PUBLICAR = 10;

export type EstadoLinea = "ok" | "error" | "pendiente" | "duplicado";

export interface LineaFlujo {
  servicio: string;
  estado: EstadoLinea;
  texto: string;
}

export interface ResultadoFlujo {
  latenciaMs: number;
  checkoutOk: boolean;
  lineas: LineaFlujo[];
}

export function simularFlujo(config: ConfigFlujo): ResultadoFlujo {
  const lineas: LineaFlujo[] = [];

  if (config.modo === "sincronico") {
    let latencia = MS_PEDIDO;
    for (const s of SERVICIOS) {
      if (s.id === "email" && config.emailCaido) {
        lineas.push({
          servicio: s.nombre,
          estado: "error",
          texto: "Timeout: la llamada falla y el checkout devuelve error, aunque el stock y la factura ya se procesaron.",
        });
        return { latenciaMs: latencia + 5000, checkoutOk: false, lineas };
      }
      latencia += s.ms;
      lineas.push({ servicio: s.nombre, estado: "ok", texto: `Llamada HTTP: ${s.ms} ms, el usuario espera.` });
    }
    return { latenciaMs: latencia, checkoutOk: true, lineas };
  }

  for (const s of SERVICIOS) {
    if (s.id === "email" && config.emailCaido) {
      lineas.push({
        servicio: s.nombre,
        estado: "pendiente",
        texto: "El consumidor está caído: el evento queda en la cola y se procesa cuando vuelva (con reintentos o DLQ).",
      });
      continue;
    }
    if (s.id === "facturacion" && config.entregaDuplicada) {
      lineas.push(
        config.consumidorIdempotente
          ? {
              servicio: s.nombre,
              estado: "ok",
              texto: "Recibe el evento dos veces (at-least-once); detecta el id repetido y lo ignora: una sola factura.",
            }
          : {
              servicio: s.nombre,
              estado: "duplicado",
              texto: "Recibe el evento dos veces y factura dos veces: el consumidor no es idempotente.",
            },
      );
      continue;
    }
    lineas.push({
      servicio: s.nombre,
      estado: "ok",
      texto: `Consume "PedidoCreado" en segundo plano (${s.ms} ms, el usuario no espera).`,
    });
  }

  return { latenciaMs: MS_PEDIDO + MS_PUBLICAR, checkoutOk: true, lineas };
}
