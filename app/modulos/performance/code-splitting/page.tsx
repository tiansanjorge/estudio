import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaCodeSplitting } from "@/lib/modules/performance/code-splitting-entrevista";

const preguntasPorNivel = {
  1: entrevistaCodeSplitting.filter((p) => p.nivel === 1),
  2: entrevistaCodeSplitting.filter((p) => p.nivel === 2),
  3: entrevistaCodeSplitting.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Code Splitting — Dev Study Lab",
  description:
    "Dividir el bundle en chunks que se cargan bajo demanda, disparado por import() dinámico. El splitting por ruta es el que mejor relación beneficio/esfuerzo tiene.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué dispara técnicamente el code splitting en un bundler moderno?",
    opciones: [
      "Un comentario especial en el código",
      "El import() dinámico: a diferencia de un import estático, le dice al bundler que ese código puede vivir en un chunk separado",
      "Una configuración manual archivo por archivo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React.lazy es, por debajo, simplemente un wrapper sobre esta misma técnica aplicado a componentes.",
  },
  {
    pregunta: "¿Dónde ocurre el code splitting más importante en un framework como Next.js, sin pedirlo explícitamente?",
    opciones: [
      "A nivel de cada función individual",
      "A nivel de ruta: cada página se divide automáticamente en su propio chunk",
      "Solo si se instala un plugin adicional",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Coincide naturalmente con cómo los usuarios navegan una app, sin requerir que el desarrollador identifique manualmente qué envolver.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué ventaja de cacheo da separar un 'vendor chunk' del código propio de la app?",
    opciones: [
      "Ninguna, es solo una convención de organización",
      "El código de dependencias cambia poco entre deploys; separarlo permite que el navegador siga usando esa parte cacheada aunque el código propio cambie",
      "Hace que las dependencias se descarguen más rápido en general",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si están mezclados en el mismo chunk, cada deploy invalida la caché de TODO el archivo, incluidas las dependencias que no cambiaron.",
  },
  {
    pregunta:
      "¿Por qué dividir en demasiados chunks muy chicos puede generar un problema de 'waterfall'?",
    opciones: [
      "No hay ningún problema, cuantos más chunks mejor",
      "Si un chunk depende de otro que depende de otro, el navegador no puede pedirlos en paralelo — forma una cadena secuencial de requests",
      "Los chunks chicos siempre tardan más en parsear",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cuantos más niveles de chunks anidados haya, más larga la cadena secuencial, y el tiempo total puede terminar siendo mayor.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué exportar un objeto grande con muchas propiedades desde un módulo puede sabotear tree-shaking y code splitting a la vez?",
    opciones: [
      "No tiene ningún efecto en esas optimizaciones",
      "El bundler no puede saber qué propiedades del objeto se usan en cada punto, así que incluye el objeto completo y no puede separar sus partes en chunks distintos",
      "Solo afecta el tamaño del código fuente, no el bundle final",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con exports nombrados individuales, el bundler puede analizar estáticamente qué se usa y separar cada uno de forma independiente.",
  },
  {
    pregunta:
      "¿Qué diferencia hay en el costo de mantenimiento entre splitting por ruta y splitting manual a nivel de componente?",
    opciones: [
      "Son equivalentes en esfuerzo de mantenimiento",
      "El splitting por ruta es automático y casi gratis; el splitting manual requiere decisiones continuas que pueden quedar desactualizadas con el tiempo",
      "El splitting manual siempre es más simple de mantener",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La recomendación práctica es empezar por el splitting automático de rutas, y reservar el manual solo para casos puntuales medidos con un bundle analyzer.",
  },
];

export default function CodeSplittingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Code Splitting"
      descripcion="Dividir el bundle en chunks que se cargan bajo demanda, disparado por import() dinámico. El splitting por ruta es el que mejor relación beneficio/esfuerzo tiene."
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Code splitting es dividir el bundle de JavaScript en varios
            archivos (chunks) más chicos, cargados bajo demanda en vez de
            todos de una al inicio. El disparador técnico es el{" "}
            <code>import()</code> dinámico: a diferencia de un{" "}
            <code>import</code> estático (siempre en el mismo chunk), uno
            dinámico devuelve una Promise y le dice al bundler que ese
            código puede vivir en un archivo separado.
          </p>
          <p>
            El code splitting más importante ocurre a nivel de{" "}
            <strong className="text-foreground">ruta</strong>:
            frameworks como Next.js dividen automáticamente el código de
            cada página en su propio chunk, sin que el desarrollador
            tenga que identificar manualmente qué envolver en un{" "}
            <code>import()</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Ignorar el splitting automático de rutas y solo pensar en
              React.lazy manual.
            </strong>{" "}
            El splitting por ruta suele dar más beneficio con mucho menos
            esfuerzo.
          </li>
          <li>
            <strong className="text-foreground">
              Usar import estático para algo que solo se necesita
              condicionalmente.
            </strong>{" "}
            Pierde la oportunidad de separar ese código en un chunk
            aparte.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Aprovechar el splitting automático por ruta de Next.js sin
            configuración adicional.
          </li>
          <li>
            Envolver en import() dinámico una librería pesada usada solo
            en una funcionalidad puntual (por ejemplo, exportar a PDF).
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Esta librería de gráficos se usa solo en una pantalla de reportes poco visitada, pero está en el bundle inicial de toda la app. ¿Cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`import { GraficoDeBarras } from 'libreria-graficos-pesada';

function PantallaReportes() {
  return <GraficoDeBarras datos={datos} />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El <code>import</code> estático incluye la librería en el
              bundle principal, aunque solo se use en{" "}
              <code>PantallaReportes</code>, poco visitada. El fix es
              convertirlo en un componente lazy:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`const GraficoDeBarras = React.lazy(() =>
  import('libreria-graficos-pesada').then((m) => ({ default: m.GraficoDeBarras }))
);

function PantallaReportes() {
  return (
    <Suspense fallback={<Spinner />}>
      <GraficoDeBarras datos={datos} />
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Un <strong className="text-foreground">vendor chunk</strong>{" "}
            agrupa el código de terceros (React, dependencias de
            node_modules) separado del código propio de la app. La
            ventaja es de cacheo: las dependencias cambian mucho menos
            seguido que el código propio — separarlas permite que el
            navegador reuse el vendor chunk cacheado entre deploys
            sucesivos que no tocan dependencias.
          </p>
          <p>
            Dividir en demasiados chunks muy chicos puede generar un
            problema de <strong className="text-foreground">
            waterfall</strong>: si un chunk depende de otro que depende de
            otro, el navegador no puede pedirlos en paralelo, formando
            una cadena secuencial que puede terminar tardando más que
            unos pocos chunks descargables en paralelo desde el inicio.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Mezclar código de dependencias con código propio en el
              mismo chunk.
            </strong>{" "}
            Cada deploy invalida la caché de todo ese archivo, incluidas
            dependencias sin cambios.
          </li>
          <li>
            <strong className="text-foreground">
              Fragmentar excesivamente sin considerar dependencias entre
              chunks.
            </strong>{" "}
            Puede generar cadenas de carga secuenciales más lentas que
              descargas en paralelo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Configurar splitChunks (o el equivalente del bundler usado)
            para separar vendor de código propio en un proyecto grande.
          </li>
          <li>
            Revisar con un bundle analyzer si dos rutas que comparten una
            librería pesada efectivamente comparten un chunk común, en
            vez de duplicarla.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Tree-shaking depende de que el bundler analice estáticamente
            qué exports se usan realmente. Exportar un objeto grande con
            muchas propiedades en vez de exports nombrados individuales
            impide ese análisis: el bundler debe incluir el objeto
            completo, y tampoco puede separar sus partes en chunks
            distintos, aunque distintas rutas solo usen una porción de
            ese objeto.
          </p>
          <p>
            El splitting por ruta es casi gratis en mantenimiento (el
            framework lo maneja solo). El splitting manual a nivel de
            componente requiere decisiones activas que pueden quedar
            desactualizadas con el tiempo — la recomendación es
            empezar siempre por el automático, y reservar el manual para
            casos puntuales medidos con un bundle analyzer.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Exportar un objeto namespace grande en vez de exports
              nombrados.
            </strong>{" "}
            Sabotea tree-shaking y code splitting a la vez.
          </li>
          <li>
            <strong className="text-foreground">
              Dejar decisiones de lazy loading manual sin revisión
              periódica.
            </strong>{" "}
            Un componente que se volvió parte del flujo principal puede
            seguir innecesariamente detrás de un Suspense.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Refactorizar una librería interna que exporta un objeto
            namespace grande a exports nombrados individuales, para
            habilitar tree-shaking real.
          </li>
          <li>
            Auditar periódicamente los componentes con React.lazy manual,
            confirmando que siguen siendo casos que ameritan splitting.
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
