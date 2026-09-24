import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { VpcSimulador } from "@/components/modulo/VpcSimulador";
import { entrevistaRedesBasicas } from "@/lib/modules/cloud/redes-basicas-entrevista";

const preguntasPorNivel = {
  1: entrevistaRedesBasicas.filter((p) => p.nivel === 1),
  2: entrevistaRedesBasicas.filter((p) => p.nivel === 2),
  3: entrevistaRedesBasicas.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Redes básicas (VPC, load balancer, CDN) — Dev Study Lab",
  description:
    "VPC y subredes públicas y privadas, Internet y NAT Gateway, security groups vs NACLs, ALB vs NLB vs API Gateway, CDN y conectividad privada.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿En qué subred va la base de datos?",
    opciones: ["Pública, para poder conectarse", "Privada, sin ruta desde internet", "Da igual"],
    respuestaCorrecta: 1,
    explicacion: "Solo la aplicación, dentro de la VPC, necesita llegar a ella.",
  },
  {
    pregunta: "¿Cómo sale a internet un recurso de una subred privada?",
    opciones: ["Por el Internet Gateway directo", "Por un NAT Gateway en una subred pública", "No puede salir"],
    respuestaCorrecta: 1,
    explicacion: "El NAT permite conexiones salientes pero no entrantes.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ventaja tiene referenciar un security group en vez de un rango de IPs?",
    opciones: [
      "Es más rápido",
      "La regla sigue valiendo aunque las instancias cambien de IP al escalar",
      "Permite reglas de denegar",
    ],
    respuestaCorrecta: 1,
    explicacion: "Expresa la intención: la API puede hablar con la base, sea cual sea su IP.",
  },
  {
    pregunta: "Un cliente necesita permitir tu IP fija en su firewall. ¿Qué balanceador?",
    opciones: ["ALB", "NLB", "Cualquiera"],
    respuestaCorrecta: 1,
    explicacion: "El NLB ofrece IPs estáticas por zona.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué conviene para que un deploy nuevo no requiera invalidar el CDN?",
    opciones: ["TTL de 1 segundo", "Nombres de assets con hash del contenido", "Desactivar el CDN"],
    respuestaCorrecta: 1,
    explicacion: "Un contenido nuevo tiene un nombre nuevo; el viejo puede cachearse para siempre.",
  },
  {
    pregunta: "VPC A conectada por peering con B, y B con C. ¿A llega a C?",
    opciones: ["Sí", "No: el peering no es transitivo", "Solo por DNS"],
    respuestaCorrecta: 1,
    explicacion: "Con muchas VPCs se usa un Transit Gateway como hub.",
  },
];

export default function RedesBasicasPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="Redes básicas (VPC, load balancer, CDN)"
      descripcion="Por dónde entra y sale el tráfico de tu aplicación en la nube, y qué queda inalcanzable a propósito."
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
            Una <strong className="text-foreground">VPC</strong> se divide en
            subredes públicas (con ruta a internet) y privadas (sin ella). El
            balanceador va en las públicas; la API y la base, en las privadas,
            con un NAT para salir.
          </p>
          <p>
            El <strong className="text-foreground">load balancer</strong>{" "}
            reparte y verifica instancias; el <strong className="text-foreground">CDN</strong>{" "}
            cachea cerca del usuario. DNS, TCP y TLS están en el módulo de
            fundamentos de red.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <VpcSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Base de datos en una subred pública.</strong>{" "}
            La única protección que queda es la contraseña.
          </li>
          <li>
            <strong className="text-foreground">Todo en una sola zona.</strong>{" "}
            Una falla de la zona se lleva toda la aplicación.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una VPC con subredes públicas y privadas en dos zonas.</li>
          <li>CloudFront delante del frontend y del balanceador de la API.</li>
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
        <div className="flex flex-col gap-4 prosa">
          <p>
            <strong className="text-foreground">Security groups</strong>{" "}
            (stateful, por recurso, solo permitir, pueden referenciarse entre sí)
            contra <strong className="text-foreground">NACLs</strong> (stateless,
            por subred, permitir y denegar).
          </p>
          <p>
            <strong className="text-foreground">Balanceadores</strong>: ALB para
            HTTP, NLB para TCP e IPs fijas, API Gateway para gestión de APIs.
            Balanceo como concepto de diseño se ve en System Design.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Health checks que dependen de la base.</strong>{" "}
            Un problema momentáneo de la base saca a todas las instancias a la vez.
          </li>
          <li>
            <strong className="text-foreground">NACLs sin puertos efímeros.</strong>{" "}
            Las respuestas no vuelven y todo parece un timeout.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un ALB que rutea <code>/api</code> y <code>/admin</code> a servicios distintos.</li>
          <li>Un NLB para un servicio TCP que un cliente permite por IP.</li>
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
            <strong className="text-foreground">CDN</strong>: clave de caché
            correcta, nada privado en caché compartida, assets con hash en vez de
            invalidaciones, y el origen protegido.
          </p>
          <p>
            <strong className="text-foreground">Conectividad privada</strong>:
            VPC endpoints gateway o de interfaz, peering o Transit Gateway, y
            rangos de IP planificados para no superponerse.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cachear en el CDN una página con datos del usuario.</strong>{" "}
            El siguiente visitante ve los datos del anterior.
          </li>
          <li>
            <strong className="text-foreground">Todas las VPCs con 10.0.0.0/16.</strong>{" "}
            El día que hay que conectarlas, no se puede.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un bucket S3 que solo puede leer CloudFront.</li>
          <li>Un endpoint de interfaz para leer Secrets Manager sin pasar por el NAT.</li>
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
            Después de migrar la API a subredes privadas, pasan tres cosas: los
            webhooks a un proveedor de pagos fallan por timeout, la factura de
            NAT Gateway se triplicó, y los usuarios de Europa se quejan de que
            la app tarda en cargar. ¿Qué revisás en cada caso?
          </p>
          <RevelarSolucion>
            <p>
              Webhooks con timeout: las subredes privadas no tienen ruta a
              internet salvo por un NAT; verificar que la tabla de rutas tenga
              0.0.0.0/0 hacia un NAT Gateway (idealmente uno por zona, para que
              la caída de una zona no corte la salida de las demás) y que el
              security group de la API permita la salida. Factura de NAT: el
              tráfico que antes salía directo ahora pasa por el NAT y se cobra
              por gigabyte; lo típico es que sea S3 (imágenes, backups) o ECR
              (descarga de imágenes de contenedores), que se resuelve con un
              endpoint gateway para S3 (gratis) y endpoints de interfaz para
              ECR. Latencia en Europa: la migración no la causó, pero la
              expone; poner un CDN delante con los assets cacheados con hash, y
              cachear en el borde las respuestas públicas; si la API misma es
              lenta desde lejos, evaluar una réplica de lectura o un despliegue
              en una región europea.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
