import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EstrategiasRenderSimulador } from "@/components/modulo/EstrategiasRenderSimulador";
import { entrevistaSsrSsgIsr } from "@/lib/modules/nextjs/ssr-ssg-isr-entrevista";

const preguntasPorNivel = {
  1: entrevistaSsrSsgIsr.filter((p) => p.nivel === 1),
  2: entrevistaSsrSsgIsr.filter((p) => p.nivel === 2),
  3: entrevistaSsrSsgIsr.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "SSR / SSG / ISR — Dev Study Lab",
  description:
    "Cuándo se genera el HTML: en el build, en cada request o de forma incremental, y qué se gana y se pierde en cada caso.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuándo genera el HTML una página SSG?",
    opciones: [
      "En el build",
      "En cada request",
      "En el primer request",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Se sirve el mismo HTML hasta el próximo deploy (o una revalidación, si es ISR).",
  },
  {
    pregunta: "¿Qué hace que una ruta del App Router pase a renderizarse en cada request?",
    opciones: [
      "Tener un Client Component con estado en la página",
      "Usar APIs del request como cookies(), headers() o searchParams",
      "Hacer un fetch sin opciones de caché en un Server Component",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Next prerenderiza por defecto; lo que solo existe en el request fuerza el render dinámico.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con revalidate = 3600, llega un visitante 2 horas después de la última generación. ¿Qué recibe?",
    opciones: [
      "Espera a que se regenere y recibe la versión nueva",
      "Recibe un error, porque la versión cacheada ya venció",
      "La versión cacheada al instante, y se regenera en segundo plano",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Stale-while-revalidate: el siguiente visitante recibe la versión nueva.",
  },
  {
    pregunta: "200.000 productos: ¿qué hacés con generateStaticParams?",
    opciones: [
      "Devolver los más visitados y dejar que el resto se genere en la primera visita",
      "Devolver los 200.000, para que ninguna visita espere una generación",
      "No usarlo y marcar toda la ruta como dinámica para evitar el build largo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "dynamicParams es true por defecto: lo no pregenerado se genera bajo demanda y se cachea.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Con tres instancias y el cache por defecto, llamás a revalidatePath. ¿Qué pasa?",
    opciones: [
      "Se invalidan las tres, porque Next propaga la invalidación",
      "Solo se invalida la instancia que recibió la llamada",
      "No se invalida ninguna hasta el próximo deploy",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El cache por defecto es por instancia; hace falta un cache handler compartido.",
  },
  {
    pregunta: "¿Qué cambia Partial Prerendering respecto de SSG/SSR?",
    opciones: [
      "Que las páginas estáticas pasan a regenerarse en cada request",
      "Que el HTML se genera en el edge en vez de en el servidor de origen",
      "La decisión estático/dinámico pasa de la ruta a cada parte de la página",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Shell estático + huecos dinámicos por streaming en la misma respuesta.",
  },
];

export default function SsrSsgIsrPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="SSR / SSG / ISR"
      descripcion="Cuándo se genera el HTML de una página, y el equilibrio entre velocidad, costo del servidor y frescura del contenido."
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
            Las estrategias se diferencian por{" "}
            <strong className="text-foreground">cuándo</strong> se genera el
            HTML. <strong className="text-foreground">SSG</strong>: en el
            build, rapidísimo y barato, pero fijo hasta el próximo deploy.{" "}
            <strong className="text-foreground">SSR</strong>: en cada request,
            siempre fresco y personalizable, con costo por visita.{" "}
            <strong className="text-foreground">ISR</strong>: estático que se
            regenera por tiempo o a demanda, sin redeploy.
          </p>
          <p>
            En el App Router no se elige con una función: Next prerenderiza
            por defecto y pasa a render por request cuando el código usa algo
            que solo existe en el request (<code>cookies()</code>,{" "}
            <code>headers()</code>, <code>searchParams</code>). La salida de{" "}
            <code>next build</code> muestra qué quedó estático y qué dinámico.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EstrategiasRenderSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Leer cookies en un layout &quot;por las dudas&quot;.
            </strong>{" "}
            Puede volver dinámicas todas las rutas debajo.
          </li>
          <li>
            <strong className="text-foreground">SSR para contenido que casi no cambia.</strong>{" "}
            Se paga un render por visita para mostrar siempre lo mismo.
          </li>
          <li>
            <strong className="text-foreground">
              SSG para contenido que se edita seguido.
            </strong>{" "}
            Cada cambio requiere un deploy.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>SSG: landing, documentación, página &quot;Sobre nosotros&quot;.</li>
          <li>ISR: blog con CMS, catálogo de productos, noticias.</li>
          <li>SSR: dashboard, carrito, resultados de búsqueda por usuario.</li>
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
            <strong className="text-foreground">ISR por tiempo</strong> (
            <code>export const revalidate</code>) usa stale-while-revalidate:
            vencido el tiempo, el próximo visitante recibe la versión vieja y
            dispara la regeneración. <strong className="text-foreground">ISR a
            demanda</strong> (<code>revalidateTag</code> /{" "}
            <code>revalidatePath</code> desde un webhook o una Server Action)
            invalida justo cuando el contenido cambia.
          </p>
          <p>
            Para sitios con muchas páginas, <code>generateStaticParams</code>{" "}
            pregenera solo las más visitadas y <code>dynamicParams</code>{" "}
            (true por defecto) genera el resto en la primera visita. El header{" "}
            <code>x-nextjs-cache</code> muestra HIT, STALE, MISS o
            REVALIDATED.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>revalidate = 1</code> para &quot;casi tiempo real&quot;.
            </strong>{" "}
            Regenera sin parar y sigue sirviendo una versión vieja por request.
          </li>
          <li>
            <strong className="text-foreground">
              Datos volátiles (stock) dentro de la página estática.
            </strong>{" "}
            Van en un componente dinámico aparte.
          </li>
          <li>
            <strong className="text-foreground">
              Varios <code>fetch</code> con distinto <code>revalidate</code>.
            </strong>{" "}
            La ruta usa el menor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Webhook del CMS que llama a una Route Handler con{" "}
            <code>revalidateTag</code> al publicar.
          </li>
          <li>
            Pregenerar los 1.000 productos más vendidos y generar el resto bajo
            demanda.
          </li>
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
            Con varias instancias, el cache de ISR por defecto es{" "}
            <strong className="text-foreground">por instancia</strong>: una
            revalidación a demanda solo llega a una. Hace falta un cache handler
            compartido. La regeneración en segundo plano cuesta cómputo, el
            Proxy no corre en revalidaciones a demanda, e ISR no existe en un
            Static Export.
          </p>
          <p>
            <strong className="text-foreground">Partial Prerendering</strong>{" "}
            mueve la decisión de la ruta a cada parte de la página: shell
            estático al instante y huecos dinámicos por streaming. A cambio,
            exige una plataforma con streaming y capaz de continuar el render.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Escalar horizontalmente sin cache compartido.
            </strong>{" "}
            Usuarios distintos ven versiones distintas.
          </li>
          <li>
            <strong className="text-foreground">
              Revalidar la URL reescrita por el Proxy.
            </strong>{" "}
            Hay que revalidar la ruta real.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Self-hosting en Kubernetes con un cache handler sobre Redis.</li>
          <li>
            Una ficha de producto con shell estático y precio personalizado por
            streaming.
          </li>
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
            Todas las páginas del blog deberían ser estáticas con ISR, pero el
            build muestra todas como dinámicas y el servidor está saturado.
            ¿Dónde está el problema?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// app/layout.tsx
export default async function RootLayout({ children }) {
  const tema = (await cookies()).get("tema")?.value ?? "claro";
  return (
    <html data-theme={tema}>
      <body>{children}</body>
    </html>
  );
}

// app/blog/[slug]/page.tsx
export const revalidate = 3600;`}
          </pre>
          <RevelarSolucion>
            <p>
              El root layout lee <code>cookies()</code>, una API del request.
              Como el layout envuelve todas las rutas, todas pasan a
              renderizarse en cada request y el <code>revalidate</code> del blog
              no tiene efecto. Opciones: resolver el tema en el cliente (un
              script inline que lee la cookie o <code>localStorage</code> antes
              de pintar, para evitar el parpadeo) y dejar el layout estático; o,
              con Cache Components, mover la lectura a un componente dentro de{" "}
              <code>&lt;Suspense&gt;</code> para que no bloquee el shell. La
              regla es que los layouts altos no dependan del request salvo que
              sea imprescindible.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
