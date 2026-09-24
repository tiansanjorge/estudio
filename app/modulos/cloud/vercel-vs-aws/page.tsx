import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PlataformaSimulador } from "@/components/modulo/PlataformaSimulador";
import { entrevistaVercelVsAws } from "@/lib/modules/cloud/vercel-vs-aws-entrevista";

const preguntasPorNivel = {
  1: entrevistaVercelVsAws.filter((p) => p.nivel === 1),
  2: entrevistaVercelVsAws.filter((p) => p.nivel === 2),
  3: entrevistaVercelVsAws.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Vercel/Netlify vs AWS — Dev Study Lab",
  description:
    "Plataformas vs bloques de infraestructura: qué da cada una, cuándo elegirlas, costo total, limitaciones, arquitecturas híbridas y auto-hospedar Next.js.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué viene incluido en una plataforma tipo Vercel sin configurar infraestructura?",
    opciones: [
      "Colas de mensajes y bases gestionadas",
      "Deploys por push, previews por PR, CDN y rollback",
      "Redes privadas con VPC",
    ],
    respuestaCorrecta: 1,
    explicacion: "Lo que no incluye (colas, redes privadas, cómputo largo) es lo que suele llevar a AWS.",
  },
  {
    pregunta: "Un worker que procesa una cola todo el día, ¿dónde lo corrés?",
    opciones: ["En una función de la plataforma", "En contenedores, por ejemplo en AWS", "En el navegador"],
    respuestaCorrecta: 1,
    explicacion: "Las plataformas no están pensadas para procesos permanentes.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Las funciones corren en Virginia y la base en São Paulo. ¿Qué pasa?",
    opciones: [
      "Nada",
      "Cada consulta paga la latencia entre regiones",
      "La plataforma mueve la base sola",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las funciones van cerca de los datos, no del usuario.",
  },
  {
    pregunta: "Para un equipo de tres personas sin gente de infraestructura, ¿qué pesa más en el costo total?",
    opciones: [
      "El precio por unidad de la plataforma",
      "El tiempo de ingeniería que haría falta para operar AWS",
      "El dominio",
    ],
    respuestaCorrecta: 1,
    explicacion: "Con poco tráfico, la diferencia de factura rara vez paga ese tiempo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Next.js en tres contenedores, sin caché compartida: ¿qué pasa con una revalidación on-demand?",
    opciones: [
      "Se aplica en todas las instancias",
      "Se aplica solo en la instancia que la recibió",
      "Falla el build",
    ],
    respuestaCorrecta: 1,
    explicacion: "Para propagarla hace falta un cacheHandler compartido.",
  },
  {
    pregunta: "Frontend en app.ejemplo.com y API en api.ejemplo.com: ¿cómo se comparte la sesión?",
    opciones: [
      "Guardando el token en localStorage",
      "Cookie para el dominio padre y CORS con credenciales para el origen del frontend",
      "No se puede",
    ],
    respuestaCorrecta: 1,
    explicacion: "Usar subdominios del mismo dominio simplifica cookies y CORS.",
  },
];

export default function VercelVsAwsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="Vercel/Netlify vs AWS"
      descripcion="Comprar una plataforma opinada o construir con bloques de infraestructura, y cómo combinarlas."
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
            <strong className="text-foreground">Vercel y Netlify</strong> son
            plataformas: del repo a producción con previews, CDN, funciones y
            rollback incluidos. <strong className="text-foreground">AWS</strong>{" "}
            da bloques con más control y más servicios, que hay que armar y operar.
          </p>
          <p>
            Plataforma para velocidad con equipos chicos; AWS para procesos
            largos, redes privadas o escala; y muchas veces, ambas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PlataformaSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Montar AWS completo para un MVP.</strong>{" "}
            Semanas de infraestructura antes de validar el producto.
          </li>
          <li>
            <strong className="text-foreground">Forzar en la plataforma lo que no encaja.</strong>{" "}
            Workers disfrazados de crons cada minuto o WebSockets que se cortan.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un SaaS temprano en Vercel con Postgres gestionado en Neon.</li>
          <li>Un backend con colas y workers en AWS, y el frontend en una plataforma.</li>
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
            <strong className="text-foreground">Costo total</strong>: la
            plataforma cuesta más por unidad y casi nada en operación; AWS al
            revés. Límites y alertas de gasto en ambos casos.
          </p>
          <p>
            <strong className="text-foreground">Limitaciones</strong>: duración
            de funciones, sin procesos permanentes, conexiones a la base, región
            de las funciones, y acoplamiento a funcionalidades propias.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Sin límite de gasto.</strong>{" "}
            Un bot o una imagen sin cachear se convierten en una factura inesperada.
          </li>
          <li>
            <strong className="text-foreground">Funciones lejos de la base.</strong>{" "}
            Cada página paga varios cruces de región.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Mover a un servicio de jobs las tareas que superan la duración máxima.</li>
          <li>Un servicio de tiempo real externo para notificaciones en vivo.</li>
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
            <strong className="text-foreground">Híbrido</strong>: misma región
            para funciones y backend, solo la API expuesta, cookies y CORS entre
            subdominios, trazas propagadas y contratos compatibles.
          </p>
          <p>
            <strong className="text-foreground">Auto-hospedar Next.js</strong>:{" "}
            <code>next start</code> soporta todo; con varias instancias hace falta
            caché compartida, y hay que reconstruir CDN, previews y rollback.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Exponer la base a internet para que la plataforma llegue.</strong>{" "}
            Se expone la API, no la base.
          </li>
          <li>
            <strong className="text-foreground">Varias instancias de Next.js sin caché compartida.</strong>{" "}
            Cada instancia sirve su propia versión de las páginas revalidadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Next.js en contenedores con <code>output: &quot;standalone&quot;</code> y caché en Redis.</li>
          <li>Una traza que va del frontend en la plataforma a la API en AWS.</li>
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
            Un marketplace en Next.js sobre Vercel creció: la factura mensual se
            multiplicó, aparecieron procesos de conciliación de pagos que tardan
            20 minutos, y un cliente corporativo exige que sus datos estén en una
            red privada con auditoría. El equipo pasó de 3 a 15 personas, con 2
            dedicadas a infraestructura. ¿Migran todo a AWS?
          </p>
          <RevelarSolucion>
            <p>
              Probablemente no todo, y no de golpe. Primero entender la factura:
              qué componente creció (ancho de banda, imágenes, funciones) y si
              hay desperdicio corregible (caché, imágenes, bots) antes de
              migrar. Después mover lo que no encaja en la plataforma: la
              conciliación de 20 minutos a contenedores o tareas por lote en
              AWS, disparadas por una cola; los datos del cliente corporativo a
              una base en subredes privadas con auditoría, detrás de una API.
              El frontend puede quedarse en Vercel, con las funciones en la misma
              región que la API. Si la factura sigue concentrada en el frontend
              y el equipo de infraestructura puede operarlo, recién ahí evaluar
              auto-hospedar Next.js en contenedores, con caché compartida para
              ISR, CDN y un pipeline que reemplace previews y rollback. Cada paso
              se decide con números: cuánto se ahorra contra cuánto tiempo del
              equipo cuesta.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
