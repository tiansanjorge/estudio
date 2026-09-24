import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaLazyLoading } from "@/lib/modules/performance/lazy-loading-entrevista";

const preguntasPorNivel = {
  1: entrevistaLazyLoading.filter((p) => p.nivel === 1),
  2: entrevistaLazyLoading.filter((p) => p.nivel === 2),
  3: entrevistaLazyLoading.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Lazy Loading — Dev Study Lab",
  description:
    "React.lazy retrasa la descarga de código hasta que realmente se necesita. Siempre junto a Suspense para el estado de carga, y a un error boundary para cuando falla.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué React.lazy siempre se usa junto con Suspense?",
    opciones: [
      "Porque mientras se descarga el código, React necesita un fallback que mostrar",
      "Porque Suspense es el que dispara el import() dinámico del componente",
      "Porque sin Suspense el componente lazy se renderiza en el servidor",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Suspense muestra un fallback mientras el componente lazy todavía no está disponible, y lo reemplaza automáticamente por el componente real en cuanto termina de cargar.",
  },
  {
    pregunta: "¿Qué tipo de componentes conviene cargar de forma lazy?",
    opciones: [
      "Los más pesados de la página, aunque se vean apenas carga",
      "Los que no se ven de entrada: modales, pestañas secundarias, rutas poco usadas",
      "Todos los que tengan estado, porque son los más caros de hidratar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cargar de forma perezosa contenido 'above the fold' es contraproducente: agrega una espera donde antes no la había.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué riesgo tiene el lazy loading demasiado agresivo (muchos chunks chicos)?",
    opciones: [
      "Que el bundler deja de hacer tree-shaking en los módulos cargados con import()",
      "Que los componentes lazy pierden su estado cada vez que se vuelven a mostrar",
      "Cada import() es otra request: muchas chicas pueden costar más que pocas grandes",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El punto óptimo suele estar en dividir por unidades de navegación reales, no en fragmentar cada componente individual.",
  },
  {
    pregunta:
      "¿Cómo evitarías que el usuario vea el fallback de Suspense al hacer click en un enlace que probablemente va a visitar?",
    opciones: [
      "Disparando el import() en el onMouseEnter del enlace, antes del click",
      "Poniendo el fallback en null, así no se muestra nada mientras carga",
      "Envolviendo la navegación en startTransition para que espere la descarga",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Si la descarga ya terminó (o está en curso) cuando el usuario hace click, el fallback se muestra por mucho menos tiempo o directamente no se muestra.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Si el import() de un componente lazy falla, ¿Suspense captura ese error?",
    opciones: [
      "Sí: Suspense muestra el fallback hasta que el import() se reintente con éxito",
      "No: Suspense maneja la carga; el error lo tiene que capturar un error boundary",
      "Sí, y lo reintenta automáticamente hasta tres veces antes de mostrar el error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un componente lazy siempre debería envolverse tanto en Suspense (para la carga) como en un error boundary (para el caso de fallo de descarga).",
  },
  {
    pregunta:
      "Si un import() lazy falló y el usuario hace click en 'reintentar', ¿alcanza con re-renderizar el mismo componente?",
    opciones: [
      "Sí: cada render vuelve a ejecutar el import() del componente lazy",
      "Sí, siempre que el error boundary se resetee antes de re-renderizar",
      "No: React.lazy cachea la Promise rechazada; hay que cambiar la key",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Cambiar la key del componente lazy (o del boundary que lo envuelve) hace que React lo trate como una instancia nueva y dispare el import() de cero.",
  },
];

export default function LazyLoadingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Lazy Loading"
      descripcion="React.lazy retrasa la descarga de código hasta que realmente se necesita — siempre junto a Suspense para el estado de carga, y a un error boundary para cuando la descarga falla."
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
            <code>{"React.lazy(() => import('./Componente'))"}</code>{" "}
            retrasa la descarga del código de ese componente hasta el
            momento en que realmente se necesita renderizarlo, en vez de
            incluirlo en el bundle inicial. Mientras se descarga (la
            primera vez que se renderiza), React necesita mostrar algo en
            su lugar — eso es exactamente lo que resuelve{" "}
            <code>Suspense</code>: un fallback visible durante la carga,
            reemplazado automáticamente por el componente real al
            terminar.
          </p>
          <p>
            Conviene cargar de forma perezosa componentes que NO son
            visibles de inmediato: un modal, una pestaña secundaria, una
            sección avanzada, o rutas a las que no todos los usuarios
            navegan. Hacerlo con contenido &ldquo;above the fold&rdquo;
            es contraproducente — agrega una espera donde antes no la
            había.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Aplicar lazy loading a contenido visible de inmediato.
            </strong>{" "}
            Agrega una espera innecesaria para algo que igual se va a
            mostrar enseguida.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidar envolver el componente lazy en Suspense.
            </strong>{" "}
            React lanza un error si intenta renderizar un componente lazy
            sin un Suspense ancestro.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un modal de configuración avanzada, cargado solo cuando el
            usuario efectivamente lo abre.
          </li>
          <li>
            Rutas completas de una app (dashboard, ajustes) cargadas solo
            cuando el usuario navega a ellas.
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
          <p>¿Por qué este código lanza un error apenas se monta App?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const PanelAvanzado = React.lazy(() => import('./PanelAvanzado'));

function App() {
  return <PanelAvanzado />; // sin Suspense
}`}
          </pre>
          <RevelarSolucion>
            <p>
              React necesita saber qué mostrar mientras el código de{" "}
              <code>PanelAvanzado</code> se descarga — sin un{" "}
              <code>Suspense</code> ancestro, no tiene ningún fallback
              definido para ese lapso, y lanza un error.
            </p>
            <p className="mt-2">El fix es envolverlo en Suspense:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <PanelAvanzado />
    </Suspense>
  );
}`}
            </pre>
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
            Sin ninguna división, el usuario descarga TODO el código de
            la app antes de poder interactuar con cualquier cosa. Lazy
            loading demasiado agresivo (decenas de chunks muy chicos)
            tiene su propio costo: cada <code>import()</code> dinámico es
            una request adicional, y muchas requests chicas pueden
            generar más overhead que unos pocos chunks bien elegidos. El
            punto óptimo suele estar en dividir por unidades de
            navegación reales.
          </p>
          <p>
            Con <strong className="text-foreground">preloading</strong>,
            se dispara el <code>import()</code> antes de que el usuario
            navegue efectivamente — por ejemplo, en el{" "}
            <code>onMouseEnter</code> de un enlace — reduciendo o
            eliminando el tiempo que se ve el fallback de Suspense al
            hacer click.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Fragmentar cada componente individual en su propio chunk.
            </strong>{" "}
            El overhead acumulado de muchas requests chicas puede superar
            el beneficio de dividir el código.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir loading=&quot;lazy&quot; de imágenes con
              React.lazy.
            </strong>{" "}
            El primero es una optimización de red nativa del navegador;
            el segundo retrasa la descarga de código JS.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Preloading de una ruta en el hover del link correspondiente
            en una barra de navegación.
          </li>
          <li>
            Agrupar componentes relacionados en un mismo chunk (por
            sección de la app) en vez de fragmentar cada uno por
            separado.
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
            Un <code>import()</code> que falla rechaza la Promise, y
            React.lazy propaga ese rechazo como un ERROR durante el
            render — Suspense no captura errores, solo maneja el estado
            de carga. Por eso un componente lazy debería envolverse tanto
            en Suspense como en un error boundary por fuera, para mostrar
            un mensaje de reintento en vez de tumbar toda la app.
          </p>
          <p>
            React.lazy cachea internamente la Promise devuelta por el{" "}
            <code>import()</code> la primera vez que se llama: si esa
            Promise rechazó, re-renderizar el mismo componente lazy
            reusa esa Promise rechazada, sin reintentar la descarga. Para
            forzar un reintento real hay que cambiar la <code>key</code>{" "}
            del componente (o del boundary que lo envuelve).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Envolver un componente lazy solo en Suspense, sin error
              boundary.
            </strong>{" "}
            Un fallo de red al descargar el chunk tumba toda la
            aplicación sin ningún mensaje útil.
          </li>
          <li>
            <strong className="text-foreground">
              Reintentar sin cambiar la key, esperando una descarga
              nueva.
            </strong>{" "}
            React.lazy sigue usando la Promise rechazada cacheada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un error boundary específico para secciones lazy, con botón
            de reintentar que cambia la key del boundary.
          </li>
          <li>
            Diagnosticar fallos intermitentes de carga de chunks en
            producción como problema de red, no de código, cuando el
            error viene de un import() lazy.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
