export type EjercicioId = "acortador" | "feed" | "chat";

export interface Paso {
  titulo: string;
  // qué tiene que decidir o calcular quien practica antes de mirar la respuesta
  consigna: string;
  respuesta: string[];
}

export interface Ejercicio {
  id: EjercicioId;
  nombre: string;
  enunciado: string;
  pasos: Paso[];
}

export const EJERCICIOS: Ejercicio[] = [
  {
    id: "acortador",
    nombre: "Acortador de URLs",
    enunciado: "Diseñá un servicio como bit.ly: convierte una URL larga en un código corto y redirige a quien lo visita.",
    pasos: [
      {
        titulo: "1. Requisitos",
        consigna: "¿Qué tiene que hacer y qué tan bien? Separá funcionales de no funcionales.",
        respuesta: [
          "Funcionales: crear un código para una URL, redirigir al visitarlo; opcionales: alias personalizado, expiración y conteo de clics.",
          "No funcionales: la redirección tiene que ser muy rápida y estar siempre disponible; las lecturas superan por mucho a las escrituras; los códigos no deberían ser fáciles de recorrer uno por uno.",
        ],
      },
      {
        titulo: "2. Estimación",
        consigna: "Con 100 millones de URLs nuevas por mes y 100 visitas por cada una: escrituras, lecturas, almacenamiento y largo del código.",
        respuesta: [
          "Escrituras: 10⁸ por mes / 2,5 × 10⁶ s ≈ 40 por segundo. Lecturas: × 100 ≈ 4.000 por segundo, unas 12.000 en pico.",
          "Almacenamiento: 100M × 12 meses × 5 años = 6.000 millones de URLs × 500 B ≈ 3 TB.",
          "Código: base62 con 7 caracteres da 62⁷ ≈ 3,5 × 10¹² combinaciones, sobra para 6 × 10⁹.",
        ],
      },
      {
        titulo: "3. API",
        consigna: "¿Qué endpoints expone y qué status devuelve la redirección?",
        respuesta: [
          "POST /urls { url, alias?, expiraEl? } → 201 { codigo, urlCorta }.",
          "GET /{codigo} → redirección con Location. 301 (permanente) lo cachean los navegadores y baja la carga, pero ya no se cuentan esos clics; 302 permite contar cada visita.",
        ],
      },
      {
        titulo: "4. Modelo de datos",
        consigna: "¿Qué se guarda y dónde?",
        respuesta: [
          "urls(codigo PK, url_larga, usuario_id, creada_el, expira_el): acceso siempre por clave, así que encaja en un almacén clave-valor o en Postgres con la PK.",
          "Los clics no se escriben en la misma tabla en cada redirección: van a una cola o stream y se agregan aparte.",
        ],
      },
      {
        titulo: "5. Arquitectura",
        consigna: "Dibujá el camino de una redirección y el de una creación.",
        respuesta: [
          "Redirección: balanceador → servicio de lectura → caché (Redis) con los códigos populares → base si hay miss. Un CDN puede cachear las redirecciones permanentes.",
          "Creación: servicio de escritura que genera el código y guarda en la base. Los clics se publican en una cola hacia un servicio de analítica.",
        ],
      },
      {
        titulo: "6. Profundización: el código",
        consigna: "¿Cómo generás códigos únicos sin coordinar cada escritura?",
        respuesta: [
          "Hash de la URL truncado: simple, pero con colisiones que hay que detectar, y la misma URL da siempre el mismo código.",
          "Contador global en base62: sin colisiones, pero secuencial (se puede recorrer) y el contador es un punto central; se resuelve asignando rangos a cada instancia y mezclando los bits.",
          "Aleatorio con UNIQUE y reintento: con 3,5 billones de combinaciones las colisiones son raras. Es la opción más simple para este volumen.",
        ],
      },
      {
        titulo: "7. Trade-offs y riesgos",
        consigna: "¿Qué dejarías dicho antes de terminar?",
        respuesta: [
          "301 vs 302: menos carga contra métricas completas.",
          "Abuso: rate limiting en la creación y verificación de URLs contra listas de phishing y malware.",
          "La redirección puede leer de réplicas o caché: un código recién creado puede tardar un instante en estar disponible en todas partes.",
        ],
      },
    ],
  },
  {
    id: "feed",
    nombre: "Feed paginado",
    enunciado: "Diseñá el feed de una red social: cada usuario ve los posts de quienes sigue, del más nuevo al más viejo, con scroll infinito.",
    pasos: [
      {
        titulo: "1. Requisitos",
        consigna: "¿Qué tiene que hacer y qué tan bien?",
        respuesta: [
          "Funcionales: publicar posts, seguir usuarios, ver un feed con los posts de los seguidos, cargar más al hacer scroll.",
          "No funcionales: el feed tiene que cargar rápido; que un post tarde unos segundos en aparecer es aceptable (consistencia eventual); hay cuentas con millones de seguidores.",
        ],
      },
      {
        titulo: "2. Estimación",
        consigna: "100 millones de usuarios diarios, 5 cargas de feed por día, 10 millones de posts por día, 200 seguidos en promedio.",
        respuesta: [
          "Lecturas: 5 × 10⁸ cargas por día ≈ 5.000 por segundo, unas 15.000 en pico.",
          "Escrituras: 10⁷ posts por día ≈ 100 por segundo.",
          "Si cada post se copia a los seguidores: 10⁷ × 200 = 2.000 millones de inserciones por día en feeds, unas 20.000 por segundo. Ese número decide la arquitectura.",
        ],
      },
      {
        titulo: "3. API",
        consigna: "¿Cómo pagina el feed?",
        respuesta: [
          "POST /posts; GET /feed?cursor=…&limite=20 → { posts, siguienteCursor }.",
          "Cursor opaco (fecha más id del último post), no offset: con posts nuevos llegando arriba, el offset repite o saltea elementos.",
        ],
      },
      {
        titulo: "4. Modelo de datos",
        consigna: "¿Qué tablas y qué estructura para el feed?",
        respuesta: [
          "posts(id, autor_id, cuerpo, creado_el) y seguimientos(seguidor_id, seguido_id), ambos indexados según cómo se consultan.",
          "Feed precalculado por usuario: una lista en Redis con los ids de los últimos cientos de posts, no los posts completos.",
        ],
      },
      {
        titulo: "5. Arquitectura",
        consigna: "¿Fan-out al escribir o al leer?",
        respuesta: [
          "Fan-out on write: al publicar, un worker agrega el id del post al feed de cada seguidor. Leer es barato, escribir es caro.",
          "Fan-out on read: al leer, se juntan los posts recientes de todos los seguidos. Escribir es barato, leer es caro.",
          "Híbrido: on write para cuentas normales, on read para celebridades (un post de alguien con 50 millones de seguidores no se copia 50 millones de veces), y se combinan al leer.",
        ],
      },
      {
        titulo: "6. Profundización: leer una página",
        consigna: "¿Qué pasa exactamente al pedir la página siguiente?",
        respuesta: [
          "Se leen del feed precalculado los ids posteriores al cursor, se suman los posts recientes de las celebridades seguidas, se ordena y se corta en 20.",
          "Se hidratan los ids con los posts completos desde una caché de posts, filtrando los borrados o bloqueados, y se arma el cursor con el último.",
        ],
      },
      {
        titulo: "7. Trade-offs y riesgos",
        consigna: "¿Qué dejarías dicho antes de terminar?",
        respuesta: [
          "Amplificación de escritura contra latencia de lectura: el híbrido reparte el costo.",
          "Orden cronológico contra ranking: el ranking agrega un paso de scoring y hace la paginación menos estable.",
          "Los feeds de usuarios inactivos no se precalculan: se construyen cuando vuelven.",
        ],
      },
    ],
  },
  {
    id: "chat",
    nombre: "Chat en tiempo real",
    enunciado: "Diseñá un chat con conversaciones 1:1 y grupos: los mensajes llegan al instante, se guardan y muestran si fueron leídos.",
    pasos: [
      {
        titulo: "1. Requisitos",
        consigna: "¿Qué tiene que hacer y qué tan bien?",
        respuesta: [
          "Funcionales: enviar y recibir mensajes en 1:1 y grupos, historial, estados de enviado, entregado y leído, presencia, notificación push si el usuario está offline.",
          "No funcionales: latencia baja, orden correcto dentro de cada conversación, ningún mensaje perdido ni duplicado, millones de conexiones abiertas a la vez.",
        ],
      },
      {
        titulo: "2. Estimación",
        consigna: "50 millones de usuarios diarios, 40 mensajes por usuario por día, 10 millones conectados a la vez.",
        respuesta: [
          "Mensajes: 2 × 10⁹ por día ≈ 20.000 por segundo, del orden de 100.000 en pico.",
          "Almacenamiento: 2 × 10⁹ × 200 B = 400 GB por día, unos 150 TB por año antes de réplicas.",
          "Conexiones: a unas 50.000 por servidor, hacen falta unos 200 servidores de conexión.",
        ],
      },
      {
        titulo: "3. API",
        consigna: "¿Qué protocolo para el tiempo real y qué para el historial?",
        respuesta: [
          "WebSocket para enviar y recibir: cada mensaje lleva un id generado por el cliente, para que un reenvío no lo duplique.",
          "REST para el historial: GET /conversaciones/{id}/mensajes?antes=cursor, paginado hacia atrás.",
        ],
      },
      {
        titulo: "4. Modelo de datos",
        consigna: "¿Cómo guardás los mensajes y los estados de lectura?",
        respuesta: [
          "mensajes particionados por conversacion_id, ordenados por un id secuencial dentro de la conversación: todas las lecturas son 'los últimos N de esta conversación'.",
          "Estado de lectura por usuario y conversación: el último id leído, no un flag por mensaje.",
        ],
      },
      {
        titulo: "5. Arquitectura",
        consigna: "¿Cómo llega un mensaje de A a B si están conectados a servidores distintos?",
        respuesta: [
          "Gateways de WebSocket, con estado: mantienen las conexiones. Un registro de sesiones (en Redis) sabe en qué gateway está cada usuario.",
          "El servicio de mensajes persiste el mensaje, le asigna su número de orden y lo publica por pub/sub al gateway de cada destinatario, que lo empuja por el socket.",
          "Si el destinatario está offline, se envía una notificación push y el mensaje queda esperando en el historial.",
        ],
      },
      {
        titulo: "6. Profundización: entrega garantizada",
        consigna: "¿Cómo garantizás que ningún mensaje se pierda ni se duplique, y que lleguen en orden?",
        respuesta: [
          "El servidor asigna un número secuencial por conversación al persistir: define el orden, sin depender de relojes de los clientes.",
          "El cliente confirma lo que recibe. Al reconectar, pide todo lo posterior al último número que vio, así se recupera lo perdido durante la desconexión.",
          "El id del cliente deduplica los reenvíos del emisor; el número secuencial deduplica en el receptor.",
        ],
      },
      {
        titulo: "7. Trade-offs y riesgos",
        consigna: "¿Qué dejarías dicho antes de terminar?",
        respuesta: [
          "WebSocket contra SSE o long polling: bidireccional y eficiente, a cambio de conexiones con estado que complican los deploys (los clientes tienen que reconectarse).",
          "Grupos enormes: el fan-out por mensaje a miles de miembros se vuelve caro; conviene que los clientes de grupos grandes lean el historial en vez de recibir cada mensaje empujado.",
          "Cifrado de punta a punta: más privacidad, pero el servidor ya no puede buscar ni moderar el contenido.",
        ],
      },
    ],
  },
];
