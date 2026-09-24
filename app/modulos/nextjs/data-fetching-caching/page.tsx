import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CacheLifeSimulador } from "@/components/modulo/CacheLifeSimulador";
import { entrevistaDataFetchingCaching } from "@/lib/modules/nextjs/data-fetching-caching-entrevista";

const preguntasPorNivel = {
  1: entrevistaDataFetchingCaching.filter((p) => p.nivel === 1),
  2: entrevistaDataFetchingCaching.filter((p) => p.nivel === 2),
  3: entrevistaDataFetchingCaching.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Data fetching & caching — Dev Study Lab",
  description:
    "Pedir datos en Server Components, evitar cascadas, y el modelo de caching de Next.js 16: use cache, cacheLife, cacheTag y revalidación.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Dos Server Components del mismo render hacen el mismo fetch GET. ¿Cuántas veces se ejecuta?",
    opciones: [
      "Una: Next memoiza los fetch iguales dentro del render",
      "Dos: cada componente hace su propio request",
      "Una, pero solo si el fetch tiene cache: 'force-cache'",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es memoización por request, no un cache persistente. Para un ORM se usa React.cache.",
  },
  {
    pregunta: "Tres consultas independientes con await una tras otra. ¿Cuánto tarda la page?",
    opciones: [
      "Lo que tarda la más lenta, porque Next las paraleliza solo",
      "La suma de las tres",
      "Lo que tarda la primera, porque el resto se hace en streaming",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es una cascada. Con Promise.all o Suspense separados tarda lo de la más lenta.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con Cache Components habilitado, ¿se cachea un fetch por defecto?",
    opciones: [
      "Sí: todos los fetch GET se cachean salvo que digas lo contrario",
      "Sí, pero solo durante el build; en runtime siempre va a la red",
      "No: el caching es opt-in con \"use cache\"",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Nada se cachea si no lo pedís explícitamente.",
  },
  {
    pregunta: "Un usuario edita su perfil y tiene que ver el cambio al instante. ¿Qué usás en la Server Action?",
    opciones: [
      "updateTag('perfil')",
      "revalidateTag('perfil')",
      "router.refresh()",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "updateTag expira de inmediato (read-your-own-writes); revalidateTag serviría la versión vieja una vez.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "En serverless, ¿por qué una función con \"use cache\" puede ejecutarse más de lo esperado?",
    opciones: [
      "Porque en serverless el caché se desactiva y cada request vuelve a ejecutar",
      "Porque el store por defecto es memoria por instancia, y arrancan vacías",
      "Porque \"use cache\" se invalida automáticamente en cada deploy nuevo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "\"use cache: remote\" lo lleva a un store compartido, si el hit rate lo justifica.",
  },
  {
    pregunta: "¿Por qué no se puede leer cookies() dentro de un \"use cache\" compartido?",
    opciones: [
      "Porque cookies() es asíncrona y \"use cache\" solo admite código síncrono",
      "Porque las cookies no llegan al servidor en requests cacheados",
      "Porque el resultado de un usuario podría guardarse y servirse a otro",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Se extrae el valor afuera y se pasa como argumento (parte de la clave), o se usa \"use cache: private\".",
  },
];

export default function DataFetchingCachingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="Data fetching & caching"
      descripcion="Pedir datos donde se usan, sin cascadas, y decidir explícitamente qué se cachea, cuánto vive y cómo se invalida."
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
            En el App Router los datos se piden en{" "}
            <strong className="text-foreground">Server Components async</strong>
            , en el componente que los usa. Los <code>fetch</code> GET iguales
            dentro de un mismo render se memoizan (se ejecutan una vez); para
            otras consultas está <code>React.cache</code>. Esa memoización
            dura un request: no es un cache.
          </p>
          <p>
            Dos reglas de performance: evitar{" "}
            <strong className="text-foreground">cascadas</strong> (awaits
            independientes en serie; se arreglan con <code>Promise.all</code>)
            y no bloquear toda la página por la parte lenta (
            <code>&lt;Suspense&gt;</code> o <code>loading.tsx</code> para hacer
            streaming).
          </p>
          <p>
            En Next.js 16, <code>fetch</code> no se cachea por defecto: el
            caching es una decisión explícita. Una función cacheada tiene un
            tiempo de vida; mientras está fresca se sirve sin tocar la base
            (HIT), cuando vence se sirve lo viejo y se regenera en segundo
            plano (STALE), y si expiró el request espera (MISS). El detalle de
            la API está en el nivel 2.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CacheLifeSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pasar datos por props desde la page &quot;para no repetir el
              fetch&quot;.
            </strong>{" "}
            La memoización ya lo evita; cada componente puede pedir lo suyo.
          </li>
          <li>
            <strong className="text-foreground">Awaits en serie sin necesidad.</strong>{" "}
            La latencia se suma.
          </li>
          <li>
            <strong className="text-foreground">
              Pedir datos del servidor con <code>useEffect</code>.
            </strong>{" "}
            Agrega un round trip y un estado de carga que el servidor podía
            evitar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un dashboard con widgets independientes, cada uno en su propio{" "}
            <code>&lt;Suspense&gt;</code>.
          </li>
          <li>
            Un <code>getUsuarioActual</code> envuelto en{" "}
            <code>React.cache</code> que usan el header y la page sin duplicar
            la consulta.
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
            Con <code>cacheComponents: true</code>, el caching es opt-in:{" "}
            <code>&quot;use cache&quot;</code> en una función o componente
            cachea su resultado, con los argumentos como parte de la clave.{" "}
            <code>cacheLife</code> fija <code>revalidate</code> (regeneración
            en segundo plano) y <code>expire</code> (a partir de cuándo el
            request espera); <code>cacheTag</code> permite invalidar a demanda.
          </p>
          <p>
            Después de una mutación: <code>revalidateTag</code> sirve lo viejo
            una vez y regenera en segundo plano; <code>updateTag</code> expira
            ya, para que quien editó vea su cambio. Probá las dos en el
            simulador del nivel 1.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Mutar sin invalidar.</strong>{" "}
            El cache sigue sirviendo la versión anterior hasta que vence.
          </li>
          <li>
            <strong className="text-foreground">
              <code>revalidatePath(&quot;/&quot;)</code> para todo.
            </strong>{" "}
            Invalida de más; los tags son más precisos.
          </li>
          <li>
            <strong className="text-foreground">
              <code>use cache</code> sin <code>cacheLife</code>.
            </strong>{" "}
            Aplica el perfil <code>default</code>, que quizás no es lo que el
            dato necesita.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Contenido de un CMS con <code>cacheLife(&quot;max&quot;)</code> y un
            webhook que llama a <code>revalidateTag</code> al publicar.
          </li>
          <li>
            Un formulario de edición cuya Server Action termina con{" "}
            <code>updateTag</code> y <code>redirect</code>.
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
            Lo cacheado vive en tres lugares: el{" "}
            <strong className="text-foreground">HTML prerenderizado</strong>{" "}
            (shell estático), un store en memoria{" "}
            <strong className="text-foreground">por instancia</strong> (efímero
            en serverless; <code>use cache: remote</code> lo hace compartido y
            durable) y el <strong className="text-foreground">navegador</strong>{" "}
            (durante <code>stale</code>; <code>use cache: private</code> vive
            solo ahí). Todo se descarta en cada deploy.
          </p>
          <p>
            Un <code>use cache</code> compartido no puede leer cookies ni
            headers: el valor se extrae afuera, dentro de{" "}
            <code>&lt;Suspense&gt;</code>, y se pasa como argumento para que
            forme parte de la clave.
          </p>
          <p>
            Sin Cache Components, Next usa el modelo anterior (opciones de{" "}
            <code>fetch</code> como <code>next.revalidate</code> y config de
            segmento). Este proyecto, por ejemplo, no lo tiene habilitado.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar hit rate alto en serverless con el store en memoria.
            </strong>{" "}
            Cada instancia arranca vacía.
          </li>
          <li>
            <strong className="text-foreground">
              Cachear algo que depende del usuario sin que el usuario sea
              parte de la clave.
            </strong>{" "}
            Es una filtración de datos entre usuarios.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Una consulta cara y muy compartida con{" "}
            <code>use cache: remote</code> sobre Redis.
          </li>
          <li>
            Recomendaciones por usuario con{" "}
            <code>use cache: private</code> para que entren en el prefetch.
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
            Un usuario cambia su nombre, el formulario redirige a su perfil y
            sigue viendo el nombre anterior hasta recargar un par de veces.
            ¿Qué pasa y cómo lo arreglás?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`async function getPerfil(id: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(\`perfil-\${id}\`);
  return db.usuario.findUnique({ where: { id } });
}

export async function guardarNombre(id: string, nombre: string) {
  "use server";
  await db.usuario.update({ where: { id }, data: { nombre } });
  revalidateTag(\`perfil-\${id}\`, "max");
  redirect(\`/perfil/\${id}\`);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>revalidateTag</code> usa stale-while-revalidate: el primer
              request después de invalidar recibe la versión vieja y dispara la
              regeneración, que recién sirve el siguiente. Es justo el request
              del redirect, así que el usuario ve su propio cambio
              &quot;perdido&quot;. Es un caso de read-your-own-writes: la
              Server Action tiene que usar{" "}
              <code>updateTag(`perfil-${"{id}"}`)</code>, que expira la entrada
              de inmediato y hace que el request del perfil espere los datos
              nuevos.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
