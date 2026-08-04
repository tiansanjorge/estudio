export interface Protocolo {
  nombre: string;
  transporte: string;
  multiplexado: string;
  headOfLineBlocking: string;
  headers: string;
  descripcion: string;
}

export const protocolosHttp: Protocolo[] = [
  {
    nombre: "HTTP/1.1",
    transporte: "TCP. Una petición a la vez por conexión, hasta que llega la respuesta.",
    multiplexado:
      "No. El navegador abre hasta ~6 conexiones TCP en paralelo por dominio para compensar.",
    headOfLineBlocking:
      "Sí, a nivel de conexión: una respuesta lenta bloquea el resto de las peticiones en esa conexión.",
    headers: "Texto plano, sin compresión — se repiten enteros en cada petición.",
    descripcion:
      "El estándar desde 1997. Simple y soportado en todos lados, pero cada conexión solo puede tener una petición 'en vuelo' a la vez.",
  },
  {
    nombre: "HTTP/2",
    transporte: "TCP. Una sola conexión reutilizada para todo el dominio.",
    multiplexado: "Sí: múltiples streams binarios intercalados sobre la misma conexión TCP.",
    headOfLineBlocking:
      "Ya no a nivel de aplicación, pero sigue existiendo a nivel de TCP: un paquete perdido bloquea todos los streams hasta que se retransmite.",
    headers: "Comprimidos con HPACK.",
    descripcion:
      "Framing binario y multiplexado real sobre una sola conexión. Elimina la necesidad de 6 conexiones paralelas y trucos como el spriting de imágenes.",
  },
  {
    nombre: "HTTP/3",
    transporte: "QUIC sobre UDP, no TCP.",
    multiplexado: "Sí, y cada stream es independiente de verdad.",
    headOfLineBlocking:
      "No. Al no depender del orden estricto que exige TCP, un paquete perdido de un stream no bloquea a los demás.",
    headers: "Comprimidos con QPACK (variante de HPACK adaptada a QUIC).",
    descripcion:
      "Resuelve el head-of-line blocking que HTTP/2 todavía sufría a nivel de transporte, y acorta el tiempo de conexión inicial (TLS integrado en el handshake).",
  },
];
