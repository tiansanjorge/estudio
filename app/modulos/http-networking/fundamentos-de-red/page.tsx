import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { LatenciaConexionSimulador } from "@/components/modulo/LatenciaConexionSimulador";
import { entrevistaFundamentosRed } from "@/lib/modules/http/fundamentos-red-entrevista";

const preguntasPorNivel = {
  1: entrevistaFundamentosRed.filter((p) => p.nivel === 1),
  2: entrevistaFundamentosRed.filter((p) => p.nivel === 2),
  3: entrevistaFundamentosRed.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Fundamentos de red — Dev Study Lab",
  description:
    "Qué pasa cuando escribís una URL: DNS, TCP, TLS, latencia vs ancho de banda y cómo reducir round trips.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace el DNS?",
    opciones: [
      "Cifra la conexión",
      "Traduce un nombre de dominio a una dirección IP",
      "Comprime el HTML",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin la IP no se puede abrir la conexión; por eso es el primer paso.",
  },
  {
    pregunta: "Una página hace 40 requests chicos a un servidor lejano. ¿Qué la acelera más?",
    opciones: [
      "Duplicar el ancho de banda",
      "Reducir la latencia (CDN cercano, menos round trips)",
      "Usar imágenes más grandes",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con muchos requests chicos, el costo dominante son los round trips, no el volumen.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace <link rel=\"preconnect\">?",
    opciones: [
      "Descarga el recurso por adelantado",
      "Resuelve DNS y abre la conexión TCP + TLS con ese origen por adelantado",
      "Cachea la página",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Adelanta los handshakes para cuando llegue el request real.",
  },
  {
    pregunta: "Vas a migrar el dominio a otro servidor. ¿Qué hacés con el TTL del DNS?",
    opciones: [
      "Lo subo a una semana",
      "Lo bajo unos días antes, migro, verifico y lo vuelvo a subir",
      "No importa",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con un TTL alto, los caches siguen apuntando a la IP vieja hasta que vence.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué el HTML inicial conviene que pese menos de ~14 KB comprimido?",
    opciones: [
      "Porque los navegadores no aceptan más",
      "Porque es la ventana inicial de TCP: cabe en el primer round trip",
      "Porque es el límite de gzip",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "TCP slow start arranca con ~10 segmentos y va duplicando por round trip.",
  },
  {
    pregunta: "¿Para qué requests es seguro usar 0-RTT?",
    opciones: [
      "Para cualquiera",
      "Solo para requests idempotentes y sin efectos, como un GET",
      "Solo para POST",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los datos 0-RTT se pueden reenviar (replay); un POST podría ejecutarse dos veces.",
  },
];

export default function FundamentosDeRedPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Fundamentos de red"
      descripcion="Qué pasa entre que escribís una URL y llega el primer byte: DNS, TCP, TLS, y por qué la latencia importa más que el ancho de banda."
    >
      <NivelTabs
        niveles={{
          1: <NivelUno />,
          2: <NivelDos />,
          3: <NivelTres />,
        }}
      />
    </ModuloLayout>
  );
}

const PASOS = [
  ["DNS", "El dominio se traduce a una IP (cache del navegador, del sistema, o consulta al resolver)."],
  ["TCP", "Handshake para abrir una conexión confiable con esa IP."],
  ["TLS", "Se verifica el certificado y se acuerdan las claves de cifrado (HTTPS)."],
  ["HTTP", "Se manda el request; el servidor responde con status, headers y HTML."],
  ["Render", "El navegador parsea el HTML, pide CSS, JS e imágenes, ejecuta el JS y pinta."],
] as const;

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Antes de que el servidor vea tu request pasan varias cosas, y casi
            todas son <strong className="text-foreground">idas y vueltas</strong>{" "}
            por la red:
          </p>
          <ol className="flex flex-col gap-2">
            {PASOS.map(([paso, descripcion], i) => (
              <li key={paso} className="flex gap-3">
                <span className="font-mono text-xs text-accent">{i + 1}.</span>
                <span>
                  <strong className="text-foreground">{paso}</strong>: {descripcion}
                </span>
              </li>
            ))}
          </ol>
          <p>
            La <strong className="text-foreground">latencia</strong> (RTT, lo
            que tarda un paquete en ir y volver) depende de la distancia. El{" "}
            <strong className="text-foreground">ancho de banda</strong> es
            cuántos datos entran por segundo. Para la web, con muchos requests
            chicos, suele pesar más la latencia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <LatenciaConexionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Medir solo desde la oficina, cerca del servidor.
            </strong>{" "}
            Un usuario en otro continente paga cada round trip muchas veces
            más.
          </li>
          <li>
            <strong className="text-foreground">Creer que más ancho de banda lo resuelve todo.</strong>{" "}
            No acorta los handshakes.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Leer la pestaña Network (timing de cada request) para ver dónde se va el tiempo.</li>
          <li>Responder en una entrevista &quot;¿qué pasa cuando escribís una URL?&quot;.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Hay que reducir <strong className="text-foreground">round trips</strong>{" "}
            y <strong className="text-foreground">distancia</strong>: CDN para
            servir y terminar TLS cerca del usuario, TLS 1.3, HTTP/2 o HTTP/3
            para multiplexar sobre una conexión, keep-alive, y{" "}
            <code>preconnect</code> / <code>dns-prefetch</code> para adelantar
            handshakes a orígenes críticos.
          </p>
          <p>
            El <strong className="text-foreground">TTL</strong> de DNS decide
            cuánto se cachea una resolución: alto es más rápido, bajo permite
            cambiar y hacer failover. En migraciones se baja antes y se sube
            después.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Preconnect a diez orígenes.</strong>{" "}
            Las conexiones no usadas se descartan y compiten con las
            importantes.
          </li>
          <li>
            <strong className="text-foreground">Muchos dominios de terceros.</strong>{" "}
            Cada uno suma DNS, TCP y TLS propios.
          </li>
          <li>
            <strong className="text-foreground">Migrar con TTL de un día.</strong>{" "}
            Parte de los usuarios sigue yendo al servidor viejo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Preconnect al origen de las fuentes y de la API principal.</li>
          <li>Planificar el cambio de proveedor de hosting con TTL bajo.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel2} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[2]} />
      </Seccion>
    </>
  );
}

function NivelTres() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">TCP slow start</strong>: una
            conexión nueva arranca con una ventana de ~10 segmentos (~14 KB) y
            la duplica por round trip. Un HTML inicial que cabe en esa ventana
            llega en un solo viaje.
          </p>
          <p>
            <strong className="text-foreground">0-RTT</strong> (TLS 1.3 y QUIC)
            permite mandar el request en el primer paquete al reconectar. Ahorra
            un round trip, pero esos datos se pueden reenviar (replay): solo
            para requests idempotentes.
          </p>
          <p>
            Los CDNs usan <strong className="text-foreground">anycast</strong>:
            la misma IP se anuncia desde muchas ubicaciones y la red enruta al
            edge más cercano.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Habilitar 0-RTT para todo.</strong>{" "}
            Un POST repetido por replay puede duplicar un pago.
          </li>
          <li>
            <strong className="text-foreground">Un HTML inicial de 200 KB.</strong>{" "}
            En una conexión nueva necesita varios round trips antes de poder
            renderizar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Inlinear el CSS crítico y diferir el resto para que el primer documento sea chico.</li>
          <li>Configurar el CDN para aceptar 0-RTT solo en GET.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Usuarios de Europa reportan que tu app, alojada en Buenos Aires,
            tarda ~1,5 s en mostrar algo, aunque el servidor responde en 50 ms.
            El HTML carga una fuente de Google Fonts, un script de analytics de
            otro dominio y la API está en <code>api.tuapp.com</code>. ¿Dónde se
            va el tiempo y qué harías?
          </p>
          <RevelarSolucion>
            <p>
              Con un RTT de ~250 ms entre Europa y Buenos Aires, una conexión
              nueva con TLS 1.2 paga DNS + TCP (1 RTT) + TLS (2 RTT) + request
              (1 RTT): más de 1 s antes del primer byte, y el HTML pesado
              suma round trips por slow start. Después, cada origen extra
              (fuentes, analytics, API) repite DNS, TCP y TLS. Arreglos: poner
              un CDN que sirva lo estático desde Europa y termine TLS allá;
              TLS 1.3 y HTTP/2 o 3; <code>preconnect</code> a la API y al
              origen de las fuentes (o autoalojar las fuentes en el propio
              dominio); cargar analytics de forma diferida; y achicar el HTML
              inicial. Para la API dinámica, evaluar una réplica o caché más
              cerca de esos usuarios.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
