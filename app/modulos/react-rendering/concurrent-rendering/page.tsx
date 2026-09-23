import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ConcurrentSimulador } from "@/components/modulo/ConcurrentSimulador";
import { ConcurrentSearchDemo } from "@/components/modulo/ConcurrentSearchDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { pasosConcurrente } from "@/lib/modules/react-rendering/concurrent-escenarios";
import { entrevistaConcurrent } from "@/lib/modules/react-rendering/concurrent-entrevista";

const preguntasPorNivel = {
  1: entrevistaConcurrent.filter((p) => p.nivel === 1),
  2: entrevistaConcurrent.filter((p) => p.nivel === 2),
  3: entrevistaConcurrent.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Concurrent Rendering — Dev Study Lab",
  description:
    "No todas las actualizaciones son igual de urgentes. startTransition le dice a React cuáles puede posponer, interrumpir o descartar sin que el usuario lo note.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema resuelve marcar una actualización con startTransition?",
    opciones: [
      "Hace que el componente use menos memoria",
      "Evita que una actualización costosa (como re-renderizar una lista grande) bloquee la actualización urgente de otra cosa, como un input",
      "Reemplaza la necesidad de usar keys en listas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin startTransition, una actualización costosa y una urgente disparadas juntas se procesan como una sola unidad — la urgente tiene que esperar a la costosa. startTransition le dice a React que puede priorizar la urgente y posponer la otra.",
  },
  {
    pregunta: "Si el usuario sigue tipeando mientras una transición todavía está calculando, ¿qué hace React?",
    opciones: [
      "Termina la transición vieja igual, y después arranca la nueva",
      "Puede descartar el trabajo de la transición en curso (que ya iba a quedar obsoleto) y arrancar una transición nueva con el valor más reciente",
      "Ignora la tecla nueva hasta que la transición anterior termine",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "A diferencia de un debounce (que solo retrasa cuándo arranca el trabajo), una transición puede empezar de inmediato y ser abandonada a mitad de camino si llega una actualización más nueva, evitando mostrar (o terminar de calcular) un resultado que ya quedó viejo.",
  },
  {
    pregunta: "¿Qué indica isPending, el segundo valor que devuelve useTransition?",
    opciones: [
      "Que hubo un error en la actualización",
      "Que hay una transición en curso, todavía no reflejada en pantalla",
      "Que el componente todavía no montó",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "isPending es true mientras la actualización marcada como transición sigue procesándose en segundo plano — útil para mostrar un indicador sutil sin bloquear el resto de la UI.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿En qué se diferencia startTransition de useDeferredValue?",
    opciones: [
      "Son exactamente lo mismo con nombres distintos",
      "startTransition envuelve una actualización de estado que vos disparás; useDeferredValue envuelve un valor cuyo origen no controlás (por ejemplo, una prop)",
      "useDeferredValue solo funciona en Server Components",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Ambos usan el mismo mecanismo de lanes de baja prioridad por debajo, pero se aplican en puntos distintos: uno en el origen del cambio, el otro en el consumo de un valor externo.",
  },
  {
    pregunta:
      "Si una actualización en startTransition hace que un componente suspenda, ¿React muestra el fallback de Suspense inmediatamente?",
    opciones: [
      "Sí, siempre muestra el fallback de inmediato",
      "No: mantiene visible el contenido anterior mientras el nuevo se prepara en segundo plano, con isPending en true",
      "Solo si el componente está envuelto en React.memo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Esto evita el parpadeo de mostrar un fallback de carga en cada navegación o cambio de pestaña, prefiriendo mantener la pantalla anterior visible un poco más de tiempo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué es 'tearing' en renderizado concurrente?",
    opciones: [
      "Un error de sintaxis en componentes concurrentes",
      "Cuando distintas partes de la UI, en el mismo frame, muestran valores inconsistentes de un mismo store externo porque este mutó durante un render pausado",
      "Un problema exclusivo de Server Components",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React garantiza consistencia para su propio estado (useState), pero un store externo mutable puede cambiar en cualquier momento, incluso mientras un render está pausado esperando retomar.",
  },
  {
    pregunta:
      "¿Cómo evita useSyncExternalStore el tearing?",
    opciones: [
      "Bloqueando todas las mutaciones del store mientras React renderiza",
      "Verificando que el snapshot del store no haya cambiado entre el inicio del render y el commit; si cambió, fuerza un re-render síncrono adicional",
      "Copiando el store completo dentro del estado de React en cada render",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es la razón por la que librerías como Redux y Zustand migraron a usar este hook por debajo en vez de su propia lógica de suscripción ad-hoc.",
  },
];

export default function ConcurrentRenderingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Concurrent Rendering"
      descripcion="Fiber hace posible que React pause y priorice trabajo. Concurrent Rendering es la API que te deja aprovechar eso: decirle a React qué actualizaciones son urgentes y cuáles pueden esperar."
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
            Sin renderizado concurrente, todas las actualizaciones de
            estado dentro de un mismo evento se tratan como una sola
            unidad: si un <code>onChange</code> actualiza el valor de un
            input Y dispara el re-render de una lista costosa, React no
            puede pintar el input actualizado hasta que TODO el trabajo
            termine — el input se siente trabado, aunque en teoría
            debería responder al instante.
          </p>
          <p>
            <code>startTransition</code> le dice a React: &ldquo;esta
            actualización puntual no es urgente, podés posponerla,
            interrumpirla, o incluso descartarla si llega algo más nuevo
            antes de que termine&rdquo;. React prioriza todo lo que no
            está envuelto en una transición (como el valor del input) y
            procesa la transición en segundo plano, exponiendo un flag{" "}
            <code>isPending</code> mientras tanto.
          </p>
          <p>
            La diferencia clave con un simple <em>debounce</em>: un
            debounce retrasa CUÁNDO arranca el trabajo. Una transición
            puede arrancar de inmediato, pero si el usuario sigue
            interactuando antes de que termine, React puede tirar ese
            trabajo a medio hacer y empezar de nuevo con el valor más
            reciente — sin gastar tiempo terminando un cálculo que ya iba
            a quedar obsoleto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ConcurrentSimulador pasos={pasosConcurrente} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          useTransition real, no simulado. Probá tipear rápido en modo
          &ldquo;SIN startTransition&rdquo; y después en modo
          &ldquo;CON&rdquo; — el input es el mismo, la lista es la misma,
          la única diferencia es esta API.
        </p>
        <ConcurrentSearchDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Envolver TODA actualización en startTransition, por las dudas.
            </strong>{" "}
            Si algo realmente necesita sentirse instantáneo (como el
            valor de un input), no debe ir en una transición — envolver
            de más solo agrega complejidad sin beneficio.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir esto con hacer la actualización más rápida.
            </strong>{" "}
            startTransition no acelera el cálculo — lo despriorizada,
            para que no bloquee cosas más urgentes. El trabajo total
            sigue siendo el mismo (o más, si hay descartes).
          </li>
          <li>
            <strong className="text-foreground">
              Usar startTransition para efectos secundarios (fetch, mutaciones).
            </strong>{" "}
            Solo aplica a actualizaciones de estado que producen un
            re-render; no está pensado para código async en general.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Buscadores con filtrado costoso sobre listas grandes, como en
            el Playground de este módulo.
          </li>
          <li>
            Cambios de pestaña/tab donde el contenido nuevo tarda en
            renderizar: mantener la pestaña anterior visible (con
            isPending) en vez de mostrar una pantalla en blanco.
          </li>
          <li>
            <code>useDeferredValue</code>, la otra mitad de esta API: útil
            cuando no controlás directamente el setState de origen (por
            ejemplo, un valor que viene de props) pero igual querés
            despriorizar el trabajo derivado de él.
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
            Este buscador tiene el input laggy porque re-renderiza una
            lista pesada en el mismo update. ¿Cómo lo arreglarías con lo
            que aprendiste acá?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Buscador() {
  const [query, setQuery] = useState('');
  const resultados = filtrarListaGrande(query);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ListaResultados items={resultados} />
    </>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Acá <code>query</code> controla directamente tanto el
              input como el filtrado de la lista pesada — son la misma
              actualización, así que se bloquean mutuamente. El fix es
              separar el estado &ldquo;urgente&rdquo; (lo que ve el
              input) del estado que dispara el trabajo costoso, y envolver
              este último en <code>startTransition</code>:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Buscador() {
  const [query, setQuery] = useState('');
  const [queryFiltro, setQueryFiltro] = useState('');
  const [isPending, startTransition] = useTransition();

  function manejarCambio(valor) {
    setQuery(valor);
    startTransition(() => setQueryFiltro(valor));
  }

  const resultados = filtrarListaGrande(queryFiltro);

  return (
    <>
      <input value={query} onChange={(e) => manejarCambio(e.target.value)} />
      {isPending && <span>Actualizando…</span>}
      <ListaResultados items={resultados} />
    </>
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
            <code>startTransition</code> envuelve una{" "}
            <strong className="text-foreground">actualización</strong>{" "}
            que vos mismo disparás.{" "}
            <code>useDeferredValue</code> envuelve un{" "}
            <strong className="text-foreground">valor</strong> cuyo
            origen no controlás directamente (una prop, un valor de
            Context) — React mantiene una versión diferida de baja
            prioridad, mientras la versión inmediata sigue disponible
            para lo que necesite reaccionar al instante.
          </p>
          <p>
            Si una transición hace que un componente suspenda, React NO
            muestra el fallback de Suspense de inmediato: mantiene visible
            el contenido anterior mientras el nuevo se prepara en segundo
            plano, con <code>isPending</code> en true, y recién reemplaza
            todo de una vez cuando está listo — evitando el parpadeo de
            mostrar un fallback en cada navegación.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Usar startTransition cuando en realidad no controlás el
              setState de origen.
            </strong>{" "}
            Si el valor viene de props o Context, useDeferredValue es la
            herramienta correcta.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que dos transiciones sucesivas se procesen en
              orden, una después de la otra.
            </strong>{" "}
            React puede abandonar la primera si la segunda ya la volvió
            obsoleta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            useDeferredValue para despriorizar el renderizado de una lista
            que depende de un query recibido por props, sin control
            directo sobre el setState que lo origina.
          </li>
          <li>
            Combinar startTransition con Suspense para navegación entre
            pestañas sin mostrar un spinner en cada cambio.
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
            <strong className="text-foreground">Tearing</strong> es cuando
            distintas partes de la misma UI, en el mismo frame, muestran
            valores inconsistentes de un mismo estado compartido — típico
            con stores externos mutables, que pueden cambiar en cualquier
            momento, incluso mientras un render concurrente está pausado
            a mitad de camino. React garantiza consistencia para su
            propio estado (useState) porque controla completamente cuándo
            se aplican los cambios; un store externo no tiene esa
            garantía por sí solo.
          </p>
          <p>
            <code>useSyncExternalStore</code> evita el tearing forzando
            que la lectura del store pase por una función de snapshot que
            React puede re-verificar: si el snapshot cambió entre el
            inicio del render y el commit, fuerza un re-render síncrono
            adicional para que todos los componentes vean la misma
            versión consistente. Es la razón por la que librerías como
            Redux y Zustand migraron a usar este hook por debajo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Leer un store externo mutable directamente en el render sin
              useSyncExternalStore.
            </strong>{" "}
            Abre la puerta a tearing bajo renderizado concurrente.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que tearing es un bug de React.
            </strong>{" "}
            Es una consecuencia inevitable de tener estado mutable fuera
            del control de React combinado con renders interrumpibles —
            de ahí la necesidad de una API específica para resolverlo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Usar useSyncExternalStore al integrar una fuente de estado
            externa a React (una librería de terceros, un valor global)
            de forma segura bajo Concurrent Rendering.
          </li>
          <li>
            Explicar en una entrevista de nivel staff por qué Redux/Zustand
            migraron su lógica de suscripción a este hook en vez de
            mantener la propia.
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
