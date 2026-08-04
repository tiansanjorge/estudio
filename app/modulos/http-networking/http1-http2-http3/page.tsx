import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ProtocolosExplorador } from "@/components/modulo/ProtocolosExplorador";
import { CascadaSimulador } from "@/components/modulo/CascadaSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { protocolosHttp } from "@/lib/modules/http/protocolos";

export const metadata: Metadata = {
  title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 — Dev Study Lab",
  description:
    "Cómo evolucionó el transporte de HTTP para dejar de bloquear peticiones entre sí.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué los navegadores abrían hasta 6 conexiones TCP por dominio en HTTP/1.1?",
    opciones: [
      "Para balancear carga entre servidores",
      "Porque cada conexión solo podía tener una petición en vuelo a la vez",
      "Por seguridad",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin multiplexado, una sola conexión HTTP/1.1 procesa una petición a la vez. Abrir varias conexiones en paralelo era el workaround para cargar recursos simultáneamente.",
  },
  {
    pregunta: "¿Qué problema de HTTP/1.1 resuelve el multiplexado de HTTP/2?",
    opciones: [
      "La necesidad de abrir múltiples conexiones TCP para paralelizar peticiones",
      "La pérdida de paquetes en la red",
      "La compresión de imágenes",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "HTTP/2 intercala múltiples streams sobre una sola conexión TCP, así que ya no hace falta abrir 6 conexiones para cargar recursos en paralelo.",
  },
  {
    pregunta:
      "Un paquete se pierde en la red. ¿En cuál de estos protocolos bloquea a los demás streams?",
    opciones: ["Solo en HTTP/1.1", "En HTTP/2 (por TCP), pero no en HTTP/3", "En ninguno"],
    respuestaCorrecta: 1,
    explicacion:
      "TCP garantiza orden estricto de entrega, así que un paquete perdido bloquea todos los streams de HTTP/2 hasta que se retransmite. QUIC (HTTP/3) trata cada stream de forma independiente, así que la pérdida no afecta a los demás.",
  },
];

export default function Http1Http2Http3Page() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="HTTP/1.1 vs HTTP/2 vs HTTP/3"
      descripcion="La misma semántica de siempre (métodos, headers, status codes) sobre transportes cada vez menos propensos a bloquearse entre sí."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Elegí cuántos recursos hay que cargar y compará cuánto tarda
          HTTP/1.1 (conexiones limitadas) contra HTTP/2 (multiplexado).
        </p>
        <CascadaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
