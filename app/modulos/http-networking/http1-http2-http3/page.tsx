import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ProtocolosExplorador } from "@/components/modulo/ProtocolosExplorador";
import { CascadaSimulador } from "@/components/modulo/CascadaSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { protocolosHttp } from "@/lib/modules/http/protocolos";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaHttpVersiones } from "@/lib/modules/http/http-versiones-entrevista";

const preguntasPorNivel = {
  1: entrevistaHttpVersiones.filter((p) => p.nivel === 1),
  2: entrevistaHttpVersiones.filter((p) => p.nivel === 2),
  3: entrevistaHttpVersiones.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 — Dev Study Lab",
  description:
    "Cómo evolucionó el transporte de HTTP para dejar de bloquear peticiones entre sí.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué los navegadores abrían hasta 6 conexiones TCP por dominio en HTTP/1.1?",
    opciones: [
      "Porque cada conexión podía tener una sola petición en vuelo a la vez",
      "Porque el estándar HTTP/1.1 fija un máximo de 6 conexiones por dominio",
      "Porque TCP limita el ancho de banda de cada conexión a un sexto del total",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Sin multiplexado, una sola conexión HTTP/1.1 procesa una petición a la vez. Abrir varias conexiones en paralelo era el workaround para cargar recursos simultáneamente.",
  },
  {
    pregunta: "¿Qué problema de HTTP/1.1 resuelve el multiplexado de HTTP/2?",
    opciones: [
      "El head-of-line blocking a nivel de paquetes de TCP",
      "Tener que abrir varias conexiones TCP para paralelizar",
      "El handshake TLS extra en cada request nuevo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "HTTP/2 intercala múltiples streams sobre una sola conexión TCP, así que ya no hace falta abrir 6 conexiones para cargar recursos en paralelo.",
  },
  {
    pregunta:
      "Un paquete se pierde en la red. ¿En cuál de estos protocolos bloquea a los demás streams?",
    opciones: [
      "En HTTP/3, porque UDP no retransmite paquetes perdidos",
      "En los dos: cualquier pérdida frena la conexión entera",
      "En HTTP/2 (por TCP), pero no en HTTP/3",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "TCP garantiza orden estricto de entrega, así que un paquete perdido bloquea todos los streams de HTTP/2 hasta que se retransmite. QUIC (HTTP/3) trata cada stream de forma independiente, así que la pérdida no afecta a los demás.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué reemplazó a HTTP/2 Server Push?",
    opciones: [
      "preload y 103 Early Hints: el navegador decide qué pedir",
      "HTTP/3 Push, que empuja recursos sobre streams de QUIC",
      "Service Workers que precargan todo en el primer request",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El servidor no conoce el cache del navegador; con Early Hints el navegador no pide lo que ya tiene.",
  },
  {
    pregunta: "¿Cómo descubre el navegador que un servidor habla HTTP/3?",
    opciones: [
      "Por la URL: los sitios con HTTP/3 usan el esquema https3://",
      "Por Alt-Svc (o un registro DNS HTTPS) y después intenta QUIC",
      "Probando QUIC primero en cada conexión y cayendo a TCP si falla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "HTTP/2 se negocia con ALPN dentro de TLS; HTTP/3, al ir sobre UDP, se anuncia aparte.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Pasás del WiFi al 4G en medio de una descarga. ¿Qué protocolo la mantiene viva?",
    opciones: [
      "HTTP/2, porque multiplexa todo en una sola conexión",
      "Ninguno: al cambiar la IP, cualquier conexión se corta",
      "HTTP/3 sobre QUIC",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "QUIC identifica la conexión por connection ID, no por la IP.",
  },
  {
    pregunta: "¿Qué ambigüedad explota el request smuggling?",
    opciones: [
      "Content-Length vs Transfer-Encoding: dónde termina el body",
      "Host vs X-Forwarded-Host: a qué dominio va el request",
      "GET vs HEAD: si la respuesta debería llevar body o no",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Proxy y backend interpretan distinto el largo del request sobre una conexión compartida.",
  },
];

export default function Http1Http2Http3Page() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="HTTP/1.1 vs HTTP/2 vs HTTP/3"
      descripcion="La misma semántica de siempre (métodos, headers, status codes) sobre transportes cada vez menos propensos a bloquearse entre sí."
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

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            <strong className="text-foreground">HTTP/1.1</strong> procesa una
            petición a la vez por conexión TCP. Para cargar varios recursos
            en paralelo, el navegador abre varias conexiones (~6 por
            dominio) — de ahí prácticas como el spriting de imágenes o
            concatenar archivos JS, que existían para reducir la cantidad
            de recursos a pedir.
          </p>
          <p>
            <strong className="text-foreground">HTTP/2</strong> resuelve eso
            con multiplexado real: muchos streams binarios intercalados
            sobre una única conexión TCP. Pero TCP garantiza que los bytes
            lleguen en orden estricto — así que si se pierde un paquete de{" "}
            <em>cualquier</em> stream, TCP frena la entrega de{" "}
            <em>todos</em> los streams hasta retransmitirlo. Esto se conoce
            como head-of-line blocking a nivel de transporte, y HTTP/2 no
            lo puede evitar porque vive sobre TCP.
          </p>
          <p>
            <strong className="text-foreground">HTTP/3</strong> cambia el
            transporte de raíz: usa QUIC sobre UDP en vez de TCP. Cada
            stream de QUIC es independiente, así que un paquete perdido
            solo afecta a su propio stream — los demás siguen fluyendo. De
            paso, QUIC integra TLS en el handshake inicial, acortando el
            tiempo hasta la primera petición útil.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ProtocolosExplorador protocolos={protocolosHttp} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Elegí cuántos recursos hay que cargar y compará cuánto tarda
          HTTP/1.1 (conexiones limitadas) contra HTTP/2 (multiplexado).
        </p>
        <CascadaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Seguir usando spriting/concatenación agresiva en HTTP/2.
            </strong>{" "}
            Esas técnicas nacieron para evitar el límite de 6 conexiones
            de HTTP/1.1. Con multiplexado real, pueden ser contraproducentes
            (invalidan más caché del necesario cuando cambia un archivo).
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que HTTP/2 eliminó el head-of-line blocking por completo.
            </strong>{" "}
            Lo eliminó a nivel de aplicación, pero sigue existiendo a nivel
            de TCP. Es exactamente lo que HTTP/3 vino a resolver.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que HTTP/3 está disponible en cualquier red.
            </strong>{" "}
            Al usar UDP, algunos firewalls o redes corporativas lo
            bloquean; los navegadores hacen fallback a HTTP/2 en esos
            casos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Decidir si vale la pena seguir combinando archivos JS/CSS en un
            bundle único, o si con HTTP/2 conviene servir chunks más
            chicos y cacheables por separado.
          </li>
          <li>
            Elegir HTTP/3 para apps usadas en redes con pérdida de
            paquetes frecuente (móvil, wifi inestable), donde el
            head-of-line blocking de TCP más se nota.
          </li>
          <li>
            Entender por qué migrar a HTTP/2 no requiere cambiar nada del
            código de la aplicación — la semántica de HTTP (métodos,
            headers, status) es la misma en los tres.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Tu app se usa mayormente desde celulares en redes móviles con
            pérdida de paquetes frecuente, y la página carga ~30 recursos
            (imágenes, JS, CSS). Tenés HTTP/2 configurado. ¿A qué protocolo
            conviene migrar, y por qué el motivo NO es &ldquo;más
            multiplexado&rdquo;?
          </p>
          <RevelarSolucion>
            <p>
              Conviene migrar a{" "}
              <strong className="text-foreground">HTTP/3</strong>. El
              motivo no es la cantidad de streams multiplexados — HTTP/2 ya
              multiplexa los 30 recursos sobre una conexión. El motivo real
              es el <strong className="text-foreground">
                head-of-line blocking a nivel de TCP
              </strong>
              : en una red móvil con pérdida de paquetes frecuente, cada
              paquete perdido en HTTP/2 congela los 30 streams hasta que
              se retransmite. QUIC (HTTP/3) hace que cada stream sea
              independiente, así que solo se frena el recurso afectado por
              esa pérdida puntual, no los otros 29.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Con HTTP/2 dejan de tener sentido las optimizaciones que esquivaban
            el límite de conexiones:{" "}
            <strong className="text-foreground">domain sharding</strong>,
            sprites y bundles gigantes. Una sola conexión multiplexada rinde
            más, y archivos más chicos se cachean mejor.
          </p>
          <p>
            <strong className="text-foreground">Server Push</strong> fracasó
            porque el servidor no conoce el cache del navegador. Lo reemplazan{" "}
            <code>preload</code> y <code>103 Early Hints</code>, donde decide el
            navegador.
          </p>
          <p>
            HTTP/2 se negocia con <strong className="text-foreground">ALPN</strong>{" "}
            dentro del handshake de TLS. HTTP/3 se anuncia con{" "}
            <code>Alt-Svc</code> y siempre tiene fallback a HTTP/2 si UDP está
            bloqueado.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Mantener domain sharding con HTTP/2.</strong>{" "}
            Suma handshakes y rompe el multiplexado.
          </li>
          <li>
            <strong className="text-foreground">Preload de todo.</strong>{" "}
            Si todo es prioritario, nada lo es; compite con los recursos
            realmente críticos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Habilitar 103 Early Hints en el CDN para el CSS crítico.</li>
          <li>Revisar la columna Protocol de DevTools para ver qué versión se negoció.</li>
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
        <div className="flex flex-col gap-4 prosa">
          <p>
            QUIC identifica la conexión con un{" "}
            <strong className="text-foreground">connection ID</strong>, no con
            IP y puerto: al cambiar de red la conexión sigue, sin handshakes
            nuevos. También trae 0-RTT al reconectar y corre en espacio de
            usuario, lo que permite evolucionar el protocolo sin actualizar el
            sistema operativo, a cambio de más uso de CPU.
          </p>
          <p>
            HTTP/1.1 tiene una ambigüedad clásica entre{" "}
            <code>Content-Length</code> y <code>Transfer-Encoding</code> que
            habilita el <strong className="text-foreground">request smuggling</strong>{" "}
            entre proxy y backend. HTTP/2, con frames de largo explícito, la
            elimina, aunque tuvo sus propios ataques (como el Rapid Reset de
            2023, que abusaba de abrir y cancelar streams en masa).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">HTTP/2 en el borde y HTTP/1.1 hacia el backend sin normalizar.</strong>{" "}
            El downgrade puede reintroducir el smuggling.
          </li>
          <li>
            <strong className="text-foreground">Esperar que HTTP/3 lo arregle todo.</strong>{" "}
            En redes sin pérdida de paquetes la diferencia con HTTP/2 es chica.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Justificar HTTP/3 para una app mobile con usuarios en redes inestables.</li>
          <li>Auditar la cadena CDN → load balancer → backend en busca de downgrades.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Migraste el sitio a HTTP/2, pero la carga no mejoró. En la pestaña
            Network ves assets repartidos en <code>static1.tuapp.com</code>,{" "}
            <code>static2.tuapp.com</code> y <code>static3.tuapp.com</code>, un{" "}
            <code>bundle.js</code> de 2 MB y un sprite de 400 íconos. ¿Qué
            cambiarías?
          </p>
          <RevelarSolucion>
            <p>
              Son optimizaciones de la era HTTP/1.1 que ahora juegan en contra.
              El sharding en tres dominios obliga a tres DNS, TCP y TLS y reparte
              los recursos en tres conexiones en vez de multiplexarlos en una:
              conviene servir todo desde un solo origen (o dejar que el CDN
              coalesca conexiones). El bundle de 2 MB se invalida entero con
              cada cambio: partirlo por ruta y por vendor mejora el cache y el
              tiempo hasta interactivo. El sprite obliga a descargar 400 íconos
              para usar 10: mejor SVGs individuales o un sprite SVG por sección.
              Y para lo crítico, <code>preload</code> o 103 Early Hints.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
