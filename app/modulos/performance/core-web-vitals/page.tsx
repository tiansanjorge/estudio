import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { LayoutShiftSimulador } from "@/components/modulo/LayoutShiftSimulador";
import { entrevistaCoreWebVitals } from "@/lib/modules/performance/core-web-vitals-entrevista";
import { UMBRALES, type Metrica } from "@/lib/modules/performance/core-web-vitals";

const preguntasPorNivel = {
  1: entrevistaCoreWebVitals.filter((p) => p.nivel === 1),
  2: entrevistaCoreWebVitals.filter((p) => p.nivel === 2),
  3: entrevistaCoreWebVitals.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Core Web Vitals — Dev Study Lab",
  description:
    "LCP, INP y CLS: qué mide cada métrica, cómo se calculan, la diferencia entre datos de laboratorio y de campo, y cómo mejorarlas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿En qué percentil se evalúan las Core Web Vitals?",
    opciones: [
      "En el promedio de todas las visitas",
      "En el percentil 75 de usuarios reales",
      "En el mejor resultado de Lighthouse",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El p75 exige que la gran mayoría de las visitas tenga buena experiencia, no solo el promedio.",
  },
  {
    pregunta: "¿Qué métrica NO se puede medir en un test de laboratorio como Lighthouse?",
    opciones: ["LCP", "CLS", "INP"],
    respuestaCorrecta: 2,
    explicacion:
      "INP necesita interacciones reales. En laboratorio se usa Total Blocking Time como aproximación.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "La imagen principal de la home tiene loading=\"lazy\". ¿Qué efecto tiene en el LCP?",
    opciones: [
      "Lo mejora, porque descarga menos datos al inicio",
      "Lo empeora, porque el navegador demora la descarga hasta calcular el layout",
      "Ninguno, lazy solo afecta imágenes fuera de pantalla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Una imagen que siempre va a estar visible tiene que pedirse lo antes posible, con prioridad alta.",
  },
  {
    pregunta: "Filtrar una lista grande al tipear hace que el input se trabe. ¿Qué mejora el INP?",
    opciones: [
      "Mover el filtrado a un startTransition para que el input se pinte primero",
      "Agregar más useEffect",
      "Aumentar el tamaño de la fuente del input",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La actualización urgente (el texto) se pinta enseguida; el filtrado se procesa como trabajo interrumpible.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo agrega el CLS los layout shifts de una sesión?",
    opciones: [
      "Suma todos los shifts desde que se abrió la página",
      "Toma la peor 'session window' (shifts a menos de 1 s entre sí, máximo 5 s)",
      "Promedia los shifts de la carga inicial",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La suma total castigaba a las páginas de larga duración, como las SPA.",
  },
  {
    pregunta: "Un acordeón que el usuario abre empuja el contenido hacia abajo. ¿Suma CLS?",
    opciones: [
      "Sí, siempre",
      "No, los shifts dentro de los 500 ms posteriores a una interacción se excluyen",
      "Solo si la animación dura más de 1 segundo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un movimiento que el usuario provocó es esperado; CLS mide solo los inesperados.",
  },
];

export default function CoreWebVitalsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Core Web Vitals"
      descripcion="LCP, INP y CLS: las tres métricas que miden la experiencia real de carga, respuesta y estabilidad visual, cómo se calculan y cómo mejorarlas."
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

function formatearUmbral(valor: number, unidad: string) {
  return `${valor}${unidad ? ` ${unidad}` : ""}`;
}

function TablaUmbrales() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-muted-foreground">
          <tr className="border-b border-border">
            <th className="py-2 pr-4 font-normal">Métrica</th>
            <th className="py-2 pr-4 font-normal">Qué mide</th>
            <th className="py-2 pr-4 font-normal">Bueno</th>
            <th className="py-2 font-normal">Malo</th>
          </tr>
        </thead>
        <tbody>
          {(Object.keys(UMBRALES) as Metrica[]).map((metrica) => {
            const u = UMBRALES[metrica];
            return (
              <tr key={metrica} className="border-b border-border align-top">
                <td className="py-3 pr-4">
                  <span className="font-mono font-semibold text-foreground">{metrica}</span>
                  <span className="block text-xs text-muted-foreground">{u.nombre}</span>
                </td>
                <td className="py-3 pr-4 text-muted-foreground">{u.mide}</td>
                <td className="py-3 pr-4 font-mono text-success">
                  ≤ {formatearUmbral(u.bueno, u.unidad)}
                </td>
                <td className="py-3 font-mono text-error">
                  &gt; {formatearUmbral(u.mejorable, u.unidad)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Las Core Web Vitals son tres métricas que miden la experiencia
            desde el lado del usuario: si la página muestra rápido lo
            importante, si responde cuando se la toca y si el contenido se
            queda quieto. Google las usa como señal de ranking, pero su valor
            real es que dan un lenguaje común para hablar de rendimiento con
            números.
          </p>
          <TablaUmbrales />
          <p>
            Se evalúan en el{" "}
            <strong className="text-foreground">percentil 75</strong> de las
            visitas reales. Y hay dos fuentes de datos que no hay que
            confundir: los de{" "}
            <strong className="text-foreground">laboratorio</strong>{" "}
            (Lighthouse, una carga simulada reproducible, útil para
            diagnosticar) y los de{" "}
            <strong className="text-foreground">campo</strong> (CrUX o tu
            propio RUM, lo que vivieron usuarios reales, que es lo que
            cuenta).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <LayoutShiftSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Optimizar solo para el puntaje de Lighthouse.
            </strong>{" "}
            Un 100 en laboratorio no garantiza buenos datos de campo.
          </li>
          <li>
            <strong className="text-foreground">
              Imágenes, iframes o anuncios sin dimensiones.
            </strong>{" "}
            Son la causa más común de CLS: el contenido salta cuando cargan.
          </li>
          <li>
            <strong className="text-foreground">
              Medir en la computadora del equipo.
            </strong>{" "}
            El p75 de usuarios reales suele estar en dispositivos y redes
            bastante más lentos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Instalar la librería <code>web-vitals</code> y mandar las métricas
            a analytics para tener datos de campo propios, segmentados por
            ruta y dispositivo.
          </li>
          <li>
            Priorizar el trabajo de performance según qué métrica falla en
            Search Console, en vez de optimizar a ciegas.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <strong className="text-foreground">LCP</strong> se descompone en
            tiempo hasta el primer byte, demora hasta que se pide el recurso,
            descarga y demora de render. La imagen LCP tiene que estar en el
            HTML inicial, con <code>fetchpriority=&quot;high&quot;</code> y sin
            lazy loading; en Next.js, <code>next/image</code> con{" "}
            <code>priority</code>.
          </p>
          <p>
            <strong className="text-foreground">INP</strong> empeora cuando el
            hilo principal está ocupado al momento de interactuar. Se mejora
            partiendo tareas largas, cediendo el hilo para que el navegador
            pinte, marcando lo no urgente con <code>startTransition</code> y
            reduciendo el JavaScript que corre durante la carga y la
            hidratación.
          </p>
          <p>
            <strong className="text-foreground">CLS</strong> se previene
            reservando espacio: <code>width</code>/<code>height</code> o{" "}
            <code>aspect-ratio</code> en imágenes y videos, contenedores de
            tamaño fijo para anuncios y embeds, y fuentes con métricas
            ajustadas (<code>next/font</code> lo hace automáticamente).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Lazy loading en la imagen principal.
            </strong>{" "}
            Retrasa justo el recurso que define el LCP.
          </li>
          <li>
            <strong className="text-foreground">
              Imagen principal como <code>background-image</code> de CSS.
            </strong>{" "}
            El navegador no la descubre hasta descargar y aplicar el CSS.
          </li>
          <li>
            <strong className="text-foreground">
              Insertar banners (cookies, promos) arriba del contenido después
              de la carga.
            </strong>{" "}
            Mejor superponerlos o reservarles espacio desde el HTML.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un buscador con filtros sobre miles de filas donde el input se
            traba: <code>useDeferredValue</code> para la lista filtrada.
          </li>
          <li>
            Un e-commerce donde el LCP es la foto del producto: moverla del
            JS al HTML servido y darle prioridad alta.
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
            Cada layout shift vale{" "}
            <strong className="text-foreground">
              impact fraction × distance fraction
            </strong>
            , como en el playground. Pero el CLS no es la suma de todos: los
            shifts se agrupan en session windows (separados por menos de 1 s,
            hasta 5 s por ventana) y se reporta la peor. Los shifts dentro de
            los 500 ms posteriores a una interacción no cuentan, y animar con{" "}
            <code>transform</code> no genera shifts porque no cambia el
            layout.
          </p>
          <p>
            <strong className="text-foreground">INP</strong> reemplazó a FID
            en marzo de 2024. FID solo medía la demora de la primera
            interacción hasta que arrancaba el handler. INP mide todas las
            interacciones, reporta una de las peores, y separa la latencia en
            input delay, processing time y presentation delay. Cada parte
            apunta a un arreglo distinto.
          </p>
          <p>
            El candidato a LCP puede cambiar mientras la página carga (primero
            un título, después una imagen más grande), y el navegador deja de
            reportar candidatos en la primera interacción del usuario. En una
            SPA, las navegaciones del lado del cliente no generan un LCP
            nuevo: la métrica refleja solo la carga inicial.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Animar posición con <code>top</code>/<code>left</code> o{" "}
              <code>height</code>.
            </strong>{" "}
            Genera layout shifts y recalcula el layout en cada frame; usar{" "}
            <code>transform</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Atacar INP solo optimizando el handler.
            </strong>{" "}
            Si el problema es input delay, el hilo estaba ocupado con otra
            tarea antes de que el handler arrancara.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Usar el build de attribution de <code>web-vitals</code> para saber
            qué elemento movió el layout o qué fase dominó una interacción
            lenta en producción.
          </li>
          <li>
            Explicar en un postmortem por qué una SPA con buen LCP puede
            sentirse lenta en las navegaciones internas.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este toast de notificación genera CLS cada vez que aparece,
            aunque está arriba de todo. ¿Por qué, y cómo lo arreglás sin
            cambiar el diseño?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`.toast {
  position: relative;
  height: 0;
  transition: height 300ms;
}
.toast.visible {
  height: 64px;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Está en el flujo del documento (<code>position: relative</code>)
              y anima <code>height</code>: cada frame empuja todo el contenido
              de abajo, y como el toast aparece sin que el usuario haga nada,
              ningún shift queda excluido por la ventana de 500 ms. El fix es
              sacarlo del flujo con <code>position: fixed</code> para que no
              desplace a nadie, y animar su entrada con{" "}
              <code>transform: translateY(...)</code> y <code>opacity</code>,
              que no afectan el layout.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
