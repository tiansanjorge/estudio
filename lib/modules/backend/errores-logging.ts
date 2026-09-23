interface EventoLog {
  requestId: string;
  nivel: "info" | "warn" | "error";
  mensaje: string;
  contexto?: Record<string, unknown>;
  textoLibre: string;
}

/** Tres requests concurrentes con sus líneas de log intercaladas, como en producción. */
const EVENTOS: EventoLog[] = [
  { requestId: "req_a1", nivel: "info", mensaje: "request recibido", contexto: { ruta: "POST /pedidos", usuarioId: "u_17" }, textoLibre: "Llegó un pedido" },
  { requestId: "req_b2", nivel: "info", mensaje: "request recibido", contexto: { ruta: "POST /pedidos", usuarioId: "u_42" }, textoLibre: "Llegó un pedido" },
  { requestId: "req_a1", nivel: "info", mensaje: "stock reservado", contexto: { productoId: "p_9" }, textoLibre: "Stock ok" },
  { requestId: "req_c3", nivel: "info", mensaje: "request recibido", contexto: { ruta: "GET /pedidos/88", usuarioId: "u_5" }, textoLibre: "Consultando pedido" },
  { requestId: "req_b2", nivel: "info", mensaje: "stock reservado", contexto: { productoId: "p_3" }, textoLibre: "Stock ok" },
  { requestId: "req_a1", nivel: "info", mensaje: "pago aprobado", contexto: { monto: 15000 }, textoLibre: "Pago ok" },
  { requestId: "req_b2", nivel: "error", mensaje: "falló el cobro", contexto: { proveedor: "pasarela", status: 502, reintentos: 3, duracionMs: 9120 }, textoLibre: "Error: Request failed" },
  { requestId: "req_c3", nivel: "info", mensaje: "respuesta enviada", contexto: { status: 200, duracionMs: 34 }, textoLibre: "OK" },
  { requestId: "req_a1", nivel: "info", mensaje: "respuesta enviada", contexto: { status: 201, duracionMs: 412 }, textoLibre: "OK" },
  { requestId: "req_b2", nivel: "info", mensaje: "respuesta enviada", contexto: { status: 502, duracionMs: 9180 }, textoLibre: "Respondí error" },
];

export function lineasDeLog(estructurado: boolean): { requestId: string; nivel: EventoLog["nivel"]; texto: string }[] {
  return EVENTOS.map((e, i) => ({
    requestId: e.requestId,
    nivel: e.nivel,
    texto: estructurado
      ? JSON.stringify({
          t: `12:00:0${i}.${100 + i * 37}Z`,
          nivel: e.nivel,
          requestId: e.requestId,
          msg: e.mensaje,
          ...e.contexto,
        })
      : e.textoLibre,
  }));
}

export type EstiloError = "generico" | "tipado";

export function respuestaAlCliente(estilo: EstiloError, exponerDetalles: boolean) {
  if (estilo === "generico") {
    return {
      status: 500,
      body: exponerDetalles
        ? {
            error: "AxiosError: Request failed with status code 502",
            stack: "at settle (node_modules/axios/lib/core/settle.js:19:12)\n    at cobrar (src/pagos.ts:41:11)",
          }
        : { error: "Error interno" },
    };
  }
  return {
    status: 502,
    body: {
      type: "https://api.tienda.com/errores/pago-no-disponible",
      title: "No pudimos procesar el pago",
      codigo: "PAGO_NO_DISPONIBLE",
      reintentable: true,
      requestId: "req_b2",
      ...(exponerDetalles ? { detalle: "Pasarela respondió 502 tras 3 reintentos" } : {}),
    },
  };
}
