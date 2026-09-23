import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaSuspense } from "@/lib/modules/performance/suspense-entrevista";

const preguntasPorNivel = {
  1: entrevistaSuspense.filter((p) => p.nivel === 1),
  2: entrevistaSuspense.filter((p) => p.nivel === 2),
  3: entrevistaSuspense.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Suspense — Dev Study Lab",
  description:
    "Suspense aplicado a data fetching: un componente lee datos que todavía no están listos, y un límite ancestro muestra un fallback mientras tanto — sin isLoading manual en cada componente.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "En 'Suspense para data fetching', ¿cómo se comunica un componente con su Suspense ancestro cuando los datos no están listos?",
    opciones: [
      "Llamando a una función especial suspend()",
      "Lanzando (throw) una Promise sin resolver durante el render — React la intercepta en vez de tratarla como un error",
      "Devolviendo null desde el componente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es el mismo mecanismo que Suspense usa para code splitting, pero ahora la Promise representa datos en tránsito en vez de un chunk de código.",
  },
  {
    pregunta:
      "¿Qué ventaja tiene sobre manejar isLoading con useState en cada componente?",
    opciones: [
      "Ninguna, es solo otra forma de escribir lo mismo",
      "Elimina la lógica condicional de carga de cada componente individual, delegándola a un único límite de Suspense que puede envolver varios a la vez",
      "Hace que los datos lleguen más rápido",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El componente se escribe como si los datos siempre hubieran estado disponibles; el fallback de carga se maneja aparte, en el Suspense ancestro.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es un 'request waterfall' en el contexto de fetch-on-render?",
    opciones: [
      "Un patrón deseable de carga progresiva",
      "Peticiones de red que terminan encadenadas secuencialmente porque cada componente hijo recién dispara su fetch al montar, dependiendo de que el padre monte primero",
      "Un error de sintaxis en useEffect",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Render-as-you-fetch evita esto disparando las peticiones ANTES de montar los componentes, para que arranquen todas en paralelo.",
  },
  {
    pregunta:
      "¿Por qué conviene usar varios Suspense boundaries anidados en vez de uno solo para toda la pantalla?",
    opciones: [
      "No hay diferencia, es solo estilo de código",
      "Cada sección puede mostrar su contenido apenas está lista, en vez de esperar a que TODO lo que está bajo un único Suspense grande esté disponible",
      "Un solo Suspense grande es más rápido",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es el mismo principio de selective hydration aplicado al momento de mostrar contenido: progresivo, sección por sección.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace internamente use(promesa) si la Promise todavía está pendiente?",
    opciones: [
      "Devuelve undefined",
      "Lanza la Promise misma (throw promesa), y React la reconoce como señal de Suspense en vez de propagarla como error",
      "Bloquea el hilo principal hasta que resuelva",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React distingue una Promise lanzada de un Error real: la primera activa Suspense, el segundo va a un error boundary.",
  },
  {
    pregunta:
      "¿Por qué no se puede llamar a use() con una Promise creada de nuevo en cada render?",
    opciones: [
      "Sí se puede, no hay ningún problema",
      "Cada render crearía una Promise nueva que empieza pendiente desde cero, causando un ciclo de suspender indefinidamente",
      "React lanza un error de sintaxis en ese caso",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La Promise debe crearse una sola vez fuera del ciclo de render (cache de peticiones, prop del padre, o librería de data fetching).",
  },
];

export default function SuspensePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Suspense"
      descripcion="Un componente lee datos que todavía no están listos y suspende su render; un límite Suspense ancestro muestra un fallback mientras tanto — la misma pieza que ya conocés de code splitting, ahora aplicada a datos."
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
            Ya viste Suspense pausando el render mientras el CÓDIGO de un
            componente se descarga (React.lazy). &quot;Suspense para data
            fetching&quot; es el mismo mecanismo, aplicado a esperar DATOS: un
            componente intenta leer datos que todavía no llegaron, y en vez de
            manejar manualmente un estado <code>isLoading</code> con{" "}
            <code>useState</code>, simplemente suspende — el Suspense ancestro
            muestra el fallback, y el componente se escribe como si los datos
            SIEMPRE hubieran estado disponibles de forma síncrona.
          </p>
          <p>
            El hook <code>use()</code> es la forma más directa de este
            patrón: recibe una Promise, y si todavía no resolvió, suspende el
            componente automáticamente.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Perfil({ promesaUsuario }) {
  const usuario = use(promesaUsuario); // suspende si no resolvió aún
  return <p>{usuario.nombre}</p>;
}

<Suspense fallback={<Spinner />}>
  <Perfil promesaUsuario={obtenerUsuario(id)} />
</Suspense>`}
          </pre>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Mezclar Suspense para datos con un isLoading manual del mismo
              dato.
            </strong>{" "}
            Son dos formas de resolver lo mismo — elegir una, no las dos a la
            vez sobre el mismo fetch.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que Suspense capture errores de la petición.
            </strong>{" "}
            Suspense solo maneja el estado de carga; un fetch que falla
            necesita un error boundary por fuera, igual que con React.lazy.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un componente de perfil de usuario que lee sus datos con{" "}
            <code>use()</code>, sin ningún condicional de carga interno.
          </li>
          <li>
            Server Components (App Router) que hacen <code>await</code>{" "}
            directamente, con un <code>loading.tsx</code> como fallback de
            Suspense a nivel de ruta.
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
            Con <strong className="text-foreground">fetch-on-render</strong>{" "}
            (el patrón clásico de <code>useEffect</code>), un componente
            recién pide sus datos cuando se monta. Si un padre necesita
            renderizarse primero para que su hijo exista y dispare SU propio
            fetch, las peticiones terminan encadenadas — un{" "}
            <strong className="text-foreground">request waterfall</strong> —
            en vez de dispararse en paralelo.
          </p>
          <p>
            <strong className="text-foreground">Render-as-you-fetch</strong>{" "}
            invierte el orden: la petición arranca ANTES de renderizar (por
            ejemplo, en el manejador de navegación de una ruta), y los
            componentes solo LEEN datos que ya están en tránsito. Esto permite
            que todos los fetches necesarios arranquen en paralelo desde el
            primer instante.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// fetch-on-render: cada nivel dispara su fetch al montar (waterfall)
function Pagina() {
  useEffect(() => { fetchUsuario().then(setUsuario); }, []);
}

// render-as-you-fetch: se arranca ANTES de montar componentes
const promesaUsuario = fetchUsuario(); // en paralelo con cualquier otro fetch
function Pagina() {
  return (
    <Suspense fallback={<Spinner />}>
      <Perfil promesaUsuario={promesaUsuario} />
    </Suspense>
  );
}`}
          </pre>
          <p>
            Además, conviene usar{" "}
            <strong className="text-foreground">
              varios Suspense anidados
            </strong>{" "}
            en vez de uno solo envolviendo toda la pantalla: cada sección
            muestra su contenido apenas está lista, en vez de esperar a que
            todo lo demás también lo esté.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Dejar que cada nivel del árbol dispare su propio fetch al
              montar.
            </strong>{" "}
            Genera waterfalls silenciosos que crecen a medida que la app
            gana profundidad de componentes.
          </li>
          <li>
            <strong className="text-foreground">
              Un único Suspense envolviendo toda la pantalla.
            </strong>{" "}
            La sección más lenta bloquea la aparición de todas las demás,
            aunque estén listas hace rato.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Server Components hermanos, cada uno con su propio{" "}
            <code>await</code>, resolviendo datos en paralelo en el servidor
            sin depender de un ciclo de montaje del cliente.
          </li>
          <li>
            Un dashboard con Suspense boundaries independientes por widget,
            para que el más lento no retrase la aparición de los demás.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel2} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[2]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            ¿Por qué esta página tiene un waterfall de red, aunque use
            Suspense?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Pagina({ id }) {
  return (
    <Suspense fallback={<Spinner />}>
      <Perfil promesaUsuario={obtenerUsuario(id)} />
    </Suspense>
  );
}

function Perfil({ promesaUsuario }) {
  const usuario = use(promesaUsuario);
  return (
    <Suspense fallback={<Spinner />}>
      {/* este fetch recién arranca cuando Perfil ya renderizó */}
      <Posts promesaPosts={obtenerPosts(usuario.id)} />
    </Suspense>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>obtenerPosts(usuario.id)</code> necesita el{" "}
              <code>id</code> del usuario, que solo se conoce DESPUÉS de que{" "}
              <code>Perfil</code> haya leído <code>usuario</code> con{" "}
              <code>use()</code> — el segundo fetch no puede arrancar antes de
              que el primero resuelva. Esto es un waterfall real e
              inevitable cuando hay una dependencia genuina de datos (el id
              de los posts depende del usuario). Render-as-you-fetch elimina
              los waterfalls INNECESARIOS (los que existen solo por el ciclo
              de montaje), no los que reflejan una dependencia real entre
              peticiones.
            </p>
          </RevelarSolucion>
        </div>
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
            <code>use(promesa)</code> chequea el estado interno de la
            Promise: si ya resolvió, devuelve su valor de forma síncrona. Si
            todavía está pendiente, LANZA la Promise misma (
            <code>throw promesa</code>) — no un error, la promesa en sí.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// conceptualmente, así funciona use() por debajo:
function use(promesa) {
  if (promesa.status === 'fulfilled') return promesa.value;
  if (promesa.status === 'rejected') throw promesa.reason; // error real
  throw promesa; // pendiente: React lo interpreta como señal de Suspense
}`}
          </pre>
          <p>
            React, al procesar el árbol de fibers, reconoce cuando lo
            lanzado durante el render es una Promise (no un Error real): en
            ese caso lo intercepta como señal de &quot;este componente
            todavía no puede completar su render&quot;, pausa ese trabajo, y
            cuando la Promise resuelve, programa un reintento — mostrando
            mientras tanto el fallback del Suspense ancestro más cercano.
          </p>
          <p>
            Por esto mismo, <code>use()</code> nunca debe recibir una
            Promise creada de nuevo en cada render: si se instancia dentro
            del cuerpo del componente, cada render la reemplaza por una
            Promise nueva que empieza pendiente desde cero, y el componente
            entra en un ciclo de suspender indefinidamente. La Promise tiene
            que crearse UNA vez fuera del ciclo de render — en un cache de
            peticiones, como prop desde un padre, o devuelta por una
            librería de data fetching con su propio cacheo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Llamar a use() con una Promise creada inline en cada render.
            </strong>{" "}
            Provoca un ciclo de suspender infinito, ya que la Promise nunca
            tiene tiempo de resolver antes de ser reemplazada.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir una Promise rechazada con una pendiente.
            </strong>{" "}
            Una rechazada debe propagarse como error real hacia un error
            boundary, no tratarse como señal de Suspense.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Diagnosticar un loop de renders donde el fallback de Suspense
            nunca desaparece: sospechar primero de una Promise recreada en
            cada render.
          </li>
          <li>
            Diseñar un cache de peticiones (por id, por query) para que{" "}
            <code>use()</code> siempre reciba la MISMA Promise entre renders
            mientras los datos no cambien.
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
