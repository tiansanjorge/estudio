export type Transporte = "tcp-tls12" | "tcp-tls13" | "quic";
export type Distancia = "cdn" | "mismo-pais" | "otro-continente";

export interface ConfigRed {
  dnsEnCache: boolean;
  conexionReutilizada: boolean;
  transporte: Transporte;
  distancia: Distancia;
}

/** Round-trip time aproximado según dónde está el servidor. */
export const RTT_MS: Record<Distancia, number> = {
  cdn: 10,
  "mismo-pais": 30,
  "otro-continente": 150,
};

export const ETIQUETA_DISTANCIA: Record<Distancia, string> = {
  cdn: "Edge de un CDN cercano",
  "mismo-pais": "Servidor en el mismo país",
  "otro-continente": "Servidor en otro continente",
};

export const ETIQUETA_TRANSPORTE: Record<Transporte, string> = {
  "tcp-tls12": "TCP + TLS 1.2",
  "tcp-tls13": "TCP + TLS 1.3",
  quic: "QUIC (HTTP/3)",
};

/** Resolución DNS sin cache: consultas al resolver y, si hace falta, a la jerarquía. */
const DNS_SIN_CACHE_MS = 60;
/** Tiempo que el servidor tarda en generar la respuesta. */
const TIEMPO_SERVIDOR_MS = 40;

export interface Etapa {
  id: "dns" | "tcp" | "tls" | "request" | "servidor";
  nombre: string;
  ms: number;
  detalle: string;
}

export function calcularEtapas(config: ConfigRed): Etapa[] {
  const rtt = RTT_MS[config.distancia];
  const etapas: Etapa[] = [];

  etapas.push({
    id: "dns",
    nombre: "DNS",
    ms: config.dnsEnCache ? 0 : DNS_SIN_CACHE_MS,
    detalle: config.dnsEnCache
      ? "La IP ya estaba en el cache (navegador, sistema operativo o resolver)."
      : "El resolver consulta la jerarquía (raíz → .com → dominio) hasta obtener la IP.",
  });

  if (!config.conexionReutilizada) {
    if (config.transporte === "quic") {
      etapas.push({
        id: "tls",
        nombre: "QUIC + TLS 1.3",
        ms: rtt,
        detalle: "QUIC combina el handshake de transporte y el de cifrado en un solo round trip (sobre UDP).",
      });
    } else {
      etapas.push({
        id: "tcp",
        nombre: "TCP",
        ms: rtt,
        detalle: "SYN → SYN-ACK: un round trip antes de poder mandar datos.",
      });
      const rttsTls = config.transporte === "tcp-tls12" ? 2 : 1;
      etapas.push({
        id: "tls",
        nombre: config.transporte === "tcp-tls12" ? "TLS 1.2" : "TLS 1.3",
        ms: rtt * rttsTls,
        detalle:
          rttsTls === 2
            ? "Dos round trips para negociar el cifrado y las claves."
            : "TLS 1.3 negocia todo en un solo round trip.",
      });
    }
  }

  etapas.push({
    id: "request",
    nombre: "Request / respuesta",
    ms: rtt,
    detalle: "El request viaja al servidor y el primer byte de la respuesta vuelve: un round trip más.",
  });
  etapas.push({
    id: "servidor",
    nombre: "Servidor",
    ms: TIEMPO_SERVIDOR_MS,
    detalle: "Tiempo de procesamiento para generar la respuesta.",
  });

  return etapas;
}

export function totalMs(etapas: Etapa[]): number {
  return etapas.reduce((acc, e) => acc + e.ms, 0);
}
