import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { RouterComparador } from "@/components/modulo/RouterComparador";
import { entrevistaAppVsPagesRouter } from "@/lib/modules/nextjs/app-vs-pages-router-entrevista";

const preguntasPorNivel = {
  1: entrevistaAppVsPagesRouter.filter((p) => p.nivel === 1),
  2: entrevistaAppVsPagesRouter.filter((p) => p.nivel === 2),
  3: entrevistaAppVsPagesRouter.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "App Router vs Pages Router — Dev Study Lab",
  description:
    "Los dos routers de Next.js: convenciones de archivos, data fetching, layouts, navegación, y cómo migrar de uno al otro.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "En el App Router, ¿qué archivo hace que una carpeta sea una ruta pública?",
    opciones: ["index.tsx", "page.tsx", "layout.tsx"],
    respuestaCorrecta: 1,
    explicacion:
      "Sin page.tsx (o route.ts) la carpeta no expone URL; por eso se pueden colocar otros archivos adentro.",
  },
  {
    pregunta: "¿Qué reemplaza a getServerSideProps en el App Router?",
    opciones: [
      "getServerData",
      "Un Server Component async que pide los datos directamente",
      "Un useEffect con fetch",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El fetch vive en el componente, que corre en el servidor y no manda su código al cliente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa al navegar de una ruta de pages/ a una de app/ en una app que migra de a poco?",
    opciones: [
      "Una navegación del lado del cliente, sin recarga",
      "Una navegación completa (hard navigation), sin prefetch entre routers",
      "Un error de build",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Son dos routers distintos; por eso conviene migrar juntas las secciones que se navegan juntas.",
  },
  {
    pregunta: "¿Por qué un layout del App Router no puede leer searchParams?",
    opciones: [
      "Porque los layouts no pueden ser async",
      "Porque no se re-renderiza al navegar, y el valor quedaría desactualizado",
      "Porque searchParams solo existe en Pages Router",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Se leen en la page (prop searchParams) o en un Client Component con useSearchParams.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "En una navegación del lado del cliente en el App Router, ¿qué descarga el router?",
    opciones: [
      "El HTML completo de la página nueva",
      "El RSC payload de los segmentos que cambian",
      "Todo el bundle de JavaScript de nuevo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los layouts compartidos ya están; React reconcilia el payload nuevo con el árbol actual.",
  },
  {
    pregunta: "¿Qué reemplaza a fallback de getStaticPaths?",
    opciones: [
      "dynamicParams, que por defecto genera bajo demanda las rutas no pregeneradas",
      "fallback sigue igual en generateStaticParams",
      "Nada: las rutas no pregeneradas siempre dan 404",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Con dynamicParams = false, las rutas fuera de generateStaticParams devuelven 404.",
  },
];

export default function AppVsPagesRouterPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="App Router vs Pages Router"
      descripcion="Dos formas de construir una app en Next.js: qué cambia en rutas, datos, layouts y navegación, y cómo pasar de una a la otra."
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
            El <strong className="text-foreground">Pages Router</strong> es el
            modelo original: cada archivo de <code>pages/</code> es una ruta,
            los componentes se renderizan en el servidor y se hidratan enteros
            en el cliente, y los datos se piden con funciones de página (
            <code>getServerSideProps</code>, <code>getStaticProps</code>).
          </p>
          <p>
            El <strong className="text-foreground">App Router</strong> usa
            carpetas para las rutas y archivos especiales para la UI de cada
            segmento: <code>page</code>, <code>layout</code>,{" "}
            <code>loading</code>, <code>error</code>, <code>not-found</code>.
            Está construido sobre React Server Components: por defecto los
            componentes corren en el servidor, pueden ser async y no mandan su
            código al navegador. Solo lo marcado con{" "}
            <code>&quot;use client&quot;</code> se hidrata.
          </p>
          <p>
            Ambos conviven y Pages sigue soportado, pero los proyectos nuevos
            arrancan con App Router.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Comparador">
        <RouterComparador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Importar <code>useRouter</code> de <code>next/router</code> en{" "}
              <code>app/</code>.
            </strong>{" "}
            En App se usa <code>next/navigation</code>, con otra API.
          </li>
          <li>
            <strong className="text-foreground">
              Poner <code>&quot;use client&quot;</code> en todo por costumbre.
            </strong>{" "}
            Se pierde el beneficio principal del App Router: menos JS en el
            cliente.
          </li>
          <li>
            <strong className="text-foreground">
              Crear API routes solo para pedir datos desde el cliente.
            </strong>{" "}
            Un Server Component puede leerlos directo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Arrancar un proyecto nuevo con App Router.</li>
          <li>
            Mantener una app en Pages que funciona bien, sin migrarla solo por
            moda.
          </li>
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
            La migración es{" "}
            <strong className="text-foreground">incremental</strong>:{" "}
            <code>app/</code> y <code>pages/</code> conviven, y se mueve ruta
            por ruta. El costo de la convivencia es que navegar entre routers
            es una navegación completa, sin prefetch.
          </p>
          <p>
            Los <strong className="text-foreground">layouts anidados</strong>{" "}
            se preservan al navegar: no se re-renderizan ni pierden estado. A
            cambio, no pueden leer <code>searchParams</code> ni depender del
            pathname en el servidor. Cada segmento puede tener su propio{" "}
            <code>loading</code> y <code>error</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Migrar rutas sueltas que se navegan juntas.
            </strong>{" "}
            El usuario sufre recargas completas entre ellas.
          </li>
          <li>
            <strong className="text-foreground">
              Librerías que asumen un provider global en <code>_app</code>.
            </strong>{" "}
            En App necesitan un componente provider con{" "}
            <code>&quot;use client&quot;</code> en el layout.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Migrar primero el dashboard autenticado, que se navega como una
            unidad, y dejar el marketing para después.
          </li>
          <li>
            Usar <code>next/compat/router</code> en componentes compartidos
            durante la transición.
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
            En la carga inicial el servidor manda HTML y el{" "}
            <strong className="text-foreground">RSC payload</strong>. En las
            navegaciones siguientes, el router pide solo el payload de los
            segmentos que cambian, lo reconcilia con el árbol actual y guarda
            los segmentos visitados en un cache del cliente. Después de una
            mutación hay que invalidar para no mostrar datos viejos.
          </p>
          <p>
            Pages decide estático o dinámico{" "}
            <strong className="text-foreground">por ruta</strong>. App Router,
            con Partial Prerendering y <code>use cache</code>, lo decide{" "}
            <strong className="text-foreground">por componente</strong>: un
            shell estático, partes cacheadas y partes dinámicas en la misma
            respuesta. El costo es de infraestructura: streaming, invalidación
            coordinada entre instancias y consistencia entre HTML y payload.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Self-hosting con varias instancias sin cache compartido.
            </strong>{" "}
            Una revalidación llega a una instancia y las demás siguen sirviendo
            la versión vieja.
          </li>
          <li>
            <strong className="text-foreground">
              Mutar datos sin invalidar.
            </strong>{" "}
            El cache del router muestra la versión anterior hasta un refresh.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Una ficha de producto con shell estático y stock en vivo por
            streaming, sin volver dinámica toda la página.
          </li>
          <li>
            Evaluar el costo de self-hosting frente a una plataforma que ya
            resuelve el cache distribuido.
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
            Este layout del dashboard muestra &quot;Filtro: ventas&quot; al
            entrar, pero al cambiar de filtro con links (
            <code>?filtro=compras</code>) el texto no se actualiza. ¿Por qué, y
            cómo lo arreglás?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// app/dashboard/layout.tsx
export default async function Layout({ children, searchParams }) {
  const { filtro } = await searchParams;
  return (
    <>
      <p>Filtro: {filtro}</p>
      {children}
    </>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Los layouts no reciben <code>searchParams</code> (esa prop solo
              existe en <code>page</code>) y, además, no se re-renderizan al
              navegar entre rutas hijas: aunque pudiera leerlo, quedaría
              congelado en el valor de la primera carga. El arreglo es mover
              el indicador a un Client Component que use{" "}
              <code>useSearchParams()</code>, que sí se actualiza en cada
              navegación, o mostrarlo desde la <code>page</code>, que recibe{" "}
              <code>searchParams</code> en cada request.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
