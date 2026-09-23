import type { PreguntaEntrevista } from "../types";

export const entrevistaHttpVersiones: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué mejoras trajo HTTP/2 sobre HTTP/1.1, y HTTP/3 sobre HTTP/2?",
    respuestaEs:
      "HTTP/1.1 procesa un request a la vez por conexión: si un recurso es lento, los demás esperan detrás (head-of-line blocking a nivel de aplicación), y los navegadores abren unas 6 conexiones por dominio para paralelizar. HTTP/2 introduce multiplexado: muchos streams intercalados sobre una sola conexión TCP, con un formato binario y compresión de headers (HPACK), lo que elimina la necesidad de múltiples conexiones y de trucos como el sprite de imágenes. Pero sigue sobre TCP, que entrega los bytes en orden: si se pierde un paquete, se frenan TODOS los streams hasta retransmitirlo. HTTP/3 reemplaza TCP por QUIC, sobre UDP: cada stream es independiente, así que una pérdida solo afecta a su stream; además integra TLS 1.3 en el handshake (un round trip para establecer la conexión cifrada) y permite migrar la conexión cuando cambia la red. La mejora de HTTP/3 se nota sobre todo en redes con pérdida de paquetes, como la móvil.",
    respuestaEn:
      "HTTP/1.1 handles one request at a time per connection: if a resource is slow, the rest wait behind it (application-level head-of-line blocking), and browsers open about 6 connections per domain to parallelize. HTTP/2 introduces multiplexing: many interleaved streams over a single TCP connection, with a binary format and header compression (HPACK), removing the need for multiple connections and tricks like image sprites. But it still runs on TCP, which delivers bytes in order: if a packet is lost, ALL streams stall until it's retransmitted. HTTP/3 replaces TCP with QUIC, over UDP: each stream is independent, so a loss only affects its own stream; it also integrates TLS 1.3 into the handshake (one round trip to set up the encrypted connection) and allows migrating the connection when the network changes. HTTP/3's improvement is most noticeable on lossy networks, like mobile.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué optimizaciones de la era HTTP/1.1 dejan de tener sentido con HTTP/2?",
    respuestaEs:
      "Las que existían para esquivar el límite de conexiones y el costo de cada request. Domain sharding (repartir assets entre static1, static2, static3 para tener más conexiones): con HTTP/2 es contraproducente, porque cada dominio agrega DNS, TCP y TLS y rompe el multiplexado sobre una conexión. Concatenar todo el JS o el CSS en un solo archivo gigante: con multiplexado, archivos más chicos son baratos de pedir y se cachean mejor, porque cambiar un módulo no invalida todo el bundle (igual se mantiene algo de agrupación, porque miles de archivos tienen su propio costo). Sprites de imágenes e inlinear recursos en base64: dificultan el cache y agrandan el HTML. Lo que sigue valiendo en cualquier versión: reducir bytes, comprimir, cachear bien y evitar requests innecesarios.",
    respuestaEn:
      "Those that existed to work around the connection limit and per-request cost. Domain sharding (spreading assets across static1, static2, static3 to get more connections): with HTTP/2 it's counterproductive, since each domain adds DNS, TCP and TLS and breaks multiplexing over one connection. Concatenating all JS or CSS into one giant file: with multiplexing, smaller files are cheap to request and cache better, since changing one module doesn't invalidate the whole bundle (some grouping is still kept, since thousands of files have their own cost). Image sprites and inlining resources as base64: they hurt caching and bloat the HTML. What still holds in any version: reducing bytes, compressing, caching well and avoiding unnecessary requests.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué pasó con HTTP/2 Server Push y qué lo reemplazó?",
    respuestaEs:
      "Server Push permitía que el servidor mandara recursos (por ejemplo el CSS) antes de que el navegador los pidiera, junto con el HTML. En la práctica funcionó mal: el servidor no sabe qué tiene el navegador en cache, así que muchas veces empujaba recursos que ya estaban, desperdiciando ancho de banda y compitiendo con lo que sí hacía falta; y era difícil de configurar bien. Chrome lo desactivó y HTTP/3 casi no lo implementa en la práctica. Lo reemplazaron dos mecanismos donde decide el navegador: `<link rel=\"preload\">` para indicar recursos críticos que se van a necesitar, y la respuesta `103 Early Hints`, que el servidor manda ANTES de la respuesta final con headers `Link: rel=preload`, para que el navegador empiece a pedir (o conectarse) mientras el servidor todavía genera el HTML. Como el navegador conoce su cache, no pide lo que ya tiene.",
    respuestaEn:
      "Server Push let the server send resources (e.g. CSS) before the browser asked, along with the HTML. In practice it worked poorly: the server doesn't know what the browser has cached, so it often pushed resources already present, wasting bandwidth and competing with what was actually needed; and it was hard to configure well. Chrome disabled it and HTTP/3 barely implements it in practice. It was replaced by two mechanisms where the browser decides: `<link rel=\"preload\">` to flag critical resources that will be needed, and the `103 Early Hints` response, which the server sends BEFORE the final response with `Link: rel=preload` headers, so the browser starts fetching (or connecting) while the server is still generating the HTML. Since the browser knows its cache, it doesn't request what it already has.",
    codigo: `HTTP/1.1 103 Early Hints
Link: </estilos.css>; rel=preload; as=style
Link: <https://cdn.ejemplo.com>; rel=preconnect

HTTP/1.1 200 OK
Content-Type: text/html
...`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo sabe el navegador si puede usar HTTP/2 o HTTP/3 con un servidor?",
    respuestaEs:
      "Para HTTP/2 se usa ALPN (Application-Layer Protocol Negotiation), una extensión de TLS: durante el handshake el cliente anuncia qué protocolos soporta (`h2`, `http/1.1`) y el servidor elige, sin round trips extra. Por eso, en la práctica, HTTP/2 en navegadores siempre va sobre HTTPS. HTTP/3 es distinto porque va sobre UDP, y el navegador no puede saber de antemano si el servidor lo habla ni si la red deja pasar UDP. La primera conexión suele ser por TCP (HTTP/2), y el servidor anuncia que también habla HTTP/3 con el header `Alt-Svc: h3=\":443\"` (o con un registro DNS de tipo HTTPS); en las conexiones siguientes el navegador intenta QUIC, y si falla (por ejemplo, un firewall corporativo bloquea UDP) vuelve a HTTP/2 de forma transparente. Por eso HTTP/3 nunca es un requisito: siempre existe el fallback.",
    respuestaEn:
      "For HTTP/2, ALPN (Application-Layer Protocol Negotiation), a TLS extension, is used: during the handshake the client advertises which protocols it supports (`h2`, `http/1.1`) and the server picks, with no extra round trips. That's why, in practice, HTTP/2 in browsers always runs over HTTPS. HTTP/3 is different because it runs over UDP, and the browser can't know in advance whether the server speaks it or whether the network lets UDP through. The first connection is usually over TCP (HTTP/2), and the server advertises HTTP/3 support with the `Alt-Svc: h3=\":443\"` header (or a DNS HTTPS record); on later connections the browser tries QUIC, and if it fails (e.g. a corporate firewall blocks UDP) it transparently falls back to HTTP/2. That's why HTTP/3 is never a requirement: the fallback always exists.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es la migración de conexión en QUIC y por qué no existe en TCP?",
    respuestaEs:
      "Una conexión TCP se identifica por la cuádrupla IP y puerto de origen, IP y puerto de destino. Si cambia tu IP (pasás del WiFi al 4G al salir de casa), para TCP es otra conexión: la anterior muere y hay que rehacer los handshakes de TCP y TLS, perdiendo los requests en curso. QUIC identifica cada conexión con un connection ID propio, independiente de las IPs: cuando cambia la red, el cliente sigue mandando paquetes con el mismo ID desde la dirección nueva y el servidor los reconoce como la misma conexión, que continúa sin handshakes nuevos. Para evitar que un observador correlacione al usuario entre redes, se rotan los connection IDs. En mobile, donde los cambios de red son constantes, esto evita cortes en descargas, videollamadas o requests largos, y es una de las ventajas más concretas de HTTP/3.",
    respuestaEn:
      "A TCP connection is identified by the 4-tuple of source IP and port, destination IP and port. If your IP changes (you switch from WiFi to 4G leaving home), to TCP it's a different connection: the old one dies and TCP and TLS handshakes must be redone, losing in-flight requests. QUIC identifies each connection with its own connection ID, independent of IPs: when the network changes, the client keeps sending packets with the same ID from the new address and the server recognizes them as the same connection, which continues without new handshakes. To prevent an observer from correlating the user across networks, connection IDs are rotated. On mobile, where network changes are constant, this avoids interruptions in downloads, video calls or long requests, and it's one of HTTP/3's most concrete advantages.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el HTTP request smuggling y por qué se relaciona con HTTP/1.1?",
    respuestaEs:
      "Es un ataque que explota que dos servidores en la misma cadena (típicamente un proxy o load balancer delante del backend) interpreten distinto DÓNDE termina un request. En HTTP/1.1 el largo del body se puede indicar con `Content-Length` o con `Transfer-Encoding: chunked`; si un request manda los dos (o variantes ambiguas), el proxy puede usar uno y el backend el otro. Como la conexión entre ellos se reutiliza para varios usuarios, el atacante logra que una parte de su request quede 'pegada' al comienzo del request del siguiente usuario: puede evadir controles del proxy, robar la respuesta de otro o envenenar el cache. Se previene rechazando requests ambiguos, normalizando en el borde, y usando HTTP/2 de punta a punta, porque su formato binario con frames de largo explícito elimina la ambigüedad (aunque el downgrade de HTTP/2 a HTTP/1.1 dentro de la infraestructura puede reintroducirla).",
    respuestaEn:
      "It's an attack exploiting that two servers in the same chain (typically a proxy or load balancer in front of the backend) interpret differently WHERE a request ends. In HTTP/1.1 body length can be indicated with `Content-Length` or `Transfer-Encoding: chunked`; if a request sends both (or ambiguous variants), the proxy may use one and the backend the other. Since the connection between them is reused for multiple users, the attacker gets part of their request 'stuck' to the start of the next user's request: they can bypass proxy controls, steal another user's response or poison the cache. It's prevented by rejecting ambiguous requests, normalizing at the edge, and using HTTP/2 end to end, since its binary format with explicit-length frames removes the ambiguity (though downgrading from HTTP/2 to HTTP/1.1 inside the infrastructure can reintroduce it).",
  },
];
