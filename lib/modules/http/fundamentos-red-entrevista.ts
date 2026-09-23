import type { PreguntaEntrevista } from "../types";

export const entrevistaFundamentosRed: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué pasa desde que escribís una URL en el navegador hasta que ves la página?",
    respuestaEs:
      "El navegador parsea la URL y primero busca si tiene la respuesta en su cache. Si no, resuelve el dominio a una IP con DNS: revisa su cache, la del sistema operativo y, si hace falta, consulta al resolver configurado, que recorre la jerarquía (servidores raíz, luego el del TLD como .com, luego el autoritativo del dominio). Con la IP abre una conexión TCP (handshake de tres pasos) y, como es HTTPS, negocia TLS: verifica el certificado del servidor y acuerda las claves de cifrado. Recién ahí manda el request HTTP (método, ruta, headers, cookies). El servidor, muchas veces detrás de un CDN y un load balancer, procesa y responde con un status, headers y el HTML. El navegador parsea el HTML, construye el DOM, descubre y pide los recursos (CSS, JS, imágenes, fuentes), construye el CSSOM, ejecuta el JavaScript, calcula el layout y pinta. Cada una de esas etapas es una oportunidad de optimización.",
    respuestaEn:
      "The browser parses the URL and first checks whether it has the response cached. If not, it resolves the domain to an IP via DNS: it checks its cache, the OS cache and, if needed, queries the configured resolver, which walks the hierarchy (root servers, then the TLD server like .com, then the domain's authoritative server). With the IP it opens a TCP connection (three-way handshake) and, since it's HTTPS, negotiates TLS: it verifies the server certificate and agrees on encryption keys. Only then does it send the HTTP request (method, path, headers, cookies). The server, often behind a CDN and a load balancer, processes it and responds with a status, headers and the HTML. The browser parses the HTML, builds the DOM, discovers and requests resources (CSS, JS, images, fonts), builds the CSSOM, runs JavaScript, computes layout and paints. Each of these stages is an optimization opportunity.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre latencia y ancho de banda, y cuál importa más al cargar una web?",
    respuestaEs:
      "El ancho de banda es cuántos datos por segundo entran por el caño; la latencia es cuánto tarda un paquete en ir y volver (el RTT, round-trip time), que depende sobre todo de la distancia física y de los saltos intermedios. Para la web, la latencia suele importar más: una página típica hace muchos requests chicos, y cada conexión nueva paga varios round trips antes de transferir un solo byte (DNS, TCP, TLS, el request mismo). Duplicar el ancho de banda casi no cambia esos tiempos; bajar el RTT de 150 ms a 10 ms, sirviendo desde un CDN cercano, sí. Por eso las optimizaciones de red más efectivas atacan la cantidad de round trips (reutilizar conexiones, TLS 1.3, HTTP/2 y HTTP/3, preconnect) y la distancia (CDN), no el tamaño del caño.",
    respuestaEn:
      "Bandwidth is how much data per second fits through the pipe; latency is how long a packet takes to go and come back (RTT, round-trip time), which depends mostly on physical distance and intermediate hops. For the web, latency usually matters more: a typical page makes many small requests, and each new connection pays several round trips before transferring a single byte (DNS, TCP, TLS, the request itself). Doubling bandwidth barely changes those times; lowering RTT from 150 ms to 10 ms by serving from a nearby CDN does. That's why the most effective network optimizations target the number of round trips (connection reuse, TLS 1.3, HTTP/2 and HTTP/3, preconnect) and distance (CDN), not pipe size.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué optimizaciones aplicarías para reducir el tiempo de conexión de una web?",
    respuestaEs:
      "Primero acercar el contenido: un CDN sirve desde un edge cercano al usuario y termina ahí el TLS, así que los handshakes cuestan un RTT corto. Segundo, reducir handshakes: TLS 1.3 (un round trip en lugar de dos), HTTP/2 o HTTP/3 para multiplexar muchos requests sobre una sola conexión en vez de abrir varias, y keep-alive para reutilizar conexiones. Tercero, adelantar trabajo: `<link rel=\"preconnect\">` a los orígenes críticos que se van a usar seguro (el de las fuentes, la API) hace DNS, TCP y TLS mientras se parsea el HTML, y `dns-prefetch` resuelve solo el DNS para los menos seguros. Cuarto, reducir la cantidad de orígenes distintos: cada dominio de terceros agrega su propia resolución y conexión. Y no abusar de preconnect: cada conexión abierta y no usada consume recursos y el navegador la cierra a los pocos segundos.",
    respuestaEn:
      "First, bring content closer: a CDN serves from an edge near the user and terminates TLS there, so handshakes cost a short RTT. Second, reduce handshakes: TLS 1.3 (one round trip instead of two), HTTP/2 or HTTP/3 to multiplex many requests over a single connection instead of opening several, and keep-alive to reuse connections. Third, get ahead of the work: `<link rel=\"preconnect\">` to critical origins that will definitely be used (the fonts origin, the API) performs DNS, TCP and TLS while HTML is being parsed, and `dns-prefetch` resolves only DNS for less certain ones. Fourth, reduce the number of distinct origins: each third-party domain adds its own resolution and connection. And don't overuse preconnect: each open, unused connection consumes resources and the browser closes it after a few seconds.",
    codigo: `<!-- origen que se usa sí o sí: DNS + TCP + TLS por adelantado -->
<link rel="preconnect" href="https://api.miapp.com" />
<!-- origen probable: solo DNS -->
<link rel="dns-prefetch" href="https://analytics.ejemplo.com" />`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué es el TTL de un registro DNS y qué trade-off tiene?",
    respuestaEs:
      "Es el tiempo, en segundos, que los resolvers y clientes pueden guardar en cache la respuesta DNS antes de volver a preguntar. Un TTL alto (horas o un día) hace que casi todas las resoluciones salgan de cache: más rápido para el usuario y menos carga sobre los servidores DNS. La contracara es que un cambio (migrar a otro servidor, cambiar de proveedor, sacar de rotación una IP caída) tarda hasta ese tiempo en propagarse, porque hay caches con la IP vieja. Un TTL bajo (60 segundos) permite cambiar rápido y hacer failover, pero agrega resoluciones. La práctica habitual en una migración es bajar el TTL unos días antes, hacer el cambio, verificar, y volver a subirlo. Algunos resolvers no respetan TTL muy bajos, así que no conviene depender de que un cambio se vea en segundos.",
    respuestaEn:
      "It's the time, in seconds, resolvers and clients may cache the DNS answer before asking again. A high TTL (hours or a day) means almost all resolutions come from cache: faster for the user and less load on DNS servers. The flip side is that a change (migrating servers, switching providers, removing a dead IP from rotation) takes up to that long to propagate, since caches hold the old IP. A low TTL (60 seconds) allows fast changes and failover, but adds resolutions. The usual practice in a migration is lowering the TTL a few days before, making the change, verifying, and raising it again. Some resolvers don't honor very low TTLs, so don't count on a change being visible within seconds.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el slow start de TCP y por qué se habla de mantener el HTML crítico por debajo de ~14 KB?",
    respuestaEs:
      "TCP no sabe de antemano cuánta capacidad tiene la red, así que al empezar una conexión manda poco y va aumentando: arranca con una ventana de congestión inicial (típicamente 10 segmentos, unos 14 KB) y la duplica con cada round trip exitoso hasta detectar pérdida. Consecuencia: la primera respuesta entra en un solo round trip solo si pesa menos que esa ventana inicial; si pesa 50 KB, necesita varios round trips aunque el ancho de banda sobre. De ahí la recomendación de que el HTML inicial, con el CSS crítico inlineado, quepa en esos ~14 KB comprimidos, para que el navegador pueda empezar a renderizar después del primer viaje. Es una regla aproximada, no exacta (depende del sistema operativo, del overhead de TLS y de HTTP/2 o 3), pero explica por qué en conexiones nuevas y lejanas importa tanto el peso del primer documento.",
    respuestaEn:
      "TCP doesn't know the network's capacity in advance, so at connection start it sends little and ramps up: it begins with an initial congestion window (typically 10 segments, about 14 KB) and doubles it each successful round trip until it detects loss. Consequence: the first response fits in a single round trip only if it's smaller than that initial window; if it's 50 KB, it needs several round trips even with bandwidth to spare. Hence the advice that the initial HTML, with critical CSS inlined, fit in ~14 KB compressed, so the browser can start rendering after the first trip. It's an approximate rule, not exact (it depends on the OS, TLS overhead and HTTP/2 or 3), but it explains why the first document's weight matters so much on new, distant connections.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el 0-RTT de TLS 1.3 y QUIC, y qué riesgo tiene?",
    respuestaEs:
      "Cuando un cliente ya se conectó antes a un servidor, puede guardar una clave de resumption y, en la conexión siguiente, mandar datos de aplicación (el request HTTP) en el primer paquete, junto con el handshake, sin esperar ningún round trip: por eso se llama 0-RTT. Ahorra una ida y vuelta completa en visitas repetidas, lo que se nota mucho con servidores lejanos. El riesgo es el replay: esos datos iniciales no tienen la protección completa del handshake, y un atacante que los capture puede reenviarlos al servidor, que los procesaría otra vez. Por eso 0-RTT solo debe usarse para requests idempotentes y sin efectos (un GET), nunca para un POST que cree un pedido o mueva dinero. Los servidores y CDNs suelen limitarlo a métodos seguros o rechazarlo con un status 425 Too Early para que el cliente repita el request después del handshake completo.",
    respuestaEn:
      "When a client has connected to a server before, it can store a resumption key and, on the next connection, send application data (the HTTP request) in the first packet, alongside the handshake, without waiting for any round trip: hence 0-RTT. It saves a full round trip on repeat visits, very noticeable with distant servers. The risk is replay: that early data lacks the full handshake's protection, and an attacker who captures it can resend it to the server, which would process it again. So 0-RTT should only be used for idempotent, side-effect-free requests (a GET), never for a POST that creates an order or moves money. Servers and CDNs usually restrict it to safe methods or reject it with a 425 Too Early status so the client retries after the full handshake.",
  },
];
