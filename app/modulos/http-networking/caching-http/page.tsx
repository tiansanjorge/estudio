import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { DirectivasCacheExplorador } from "@/components/modulo/DirectivasCacheExplorador";
import { CacheSimulador } from "@/components/modulo/CacheSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { directivasCache } from "@/lib/modules/http/cache-directivas";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaCachingHttp } from "@/lib/modules/http/caching-http-entrevista";

const preguntasPorNivel = {
  1: entrevistaCachingHttp.filter((p) => p.nivel === 1),
  2: entrevistaCachingHttp.filter((p) => p.nivel === 2),
  3: entrevistaCachingHttp.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Caching HTTP — Dev Study Lab",
  description:
    "Cómo Cache-Control, ETag y la revalidación deciden si una petición va al servidor o se resuelve con una copia local.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia hay entre no-store y no-cache?",
    opciones: [
      "no-store nunca guarda; no-cache guarda, pero revalida antes de usar la copia",
      "no-cache nunca guarda; no-store guarda, pero solo en el cache del navegador",
      "Ninguna en la práctica: los dos obligan a pedir siempre la respuesta completa",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "no-store prohíbe guardar cualquier copia. no-cache sí permite guardarla, pero obliga a revalidar con el servidor antes de reutilizarla.",
  },
  {
    pregunta: "Con max-age=3600 vencido, el servidor confirma que el contenido no cambió. ¿Qué status responde?",
    opciones: [
      "200 OK con el mismo body, para que el cliente lo vuelva a guardar",
      "304 Not Modified, sin body",
      "204 No Content, porque no hay nada nuevo que mandar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "304 le dice al cliente 'seguí usando tu copia', sin volver a mandar el body — solo se transfieren los headers.",
  },
  {
    pregunta: "¿Para qué sirve stale-while-revalidate?",
    opciones: [
      "Para extender max-age automáticamente mientras el contenido no cambie",
      "Para servir la copia vieja solo cuando el servidor está caído",
      "Para servir la copia vieja al instante mientras revalida en segundo plano",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Prioriza velocidad: el usuario ve la respuesta cacheada inmediatamente, y el navegador actualiza la copia en background para la próxima vez.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué un archivo app.3f9a1c.js puede cachearse un año?",
    opciones: [
      "Porque el hash cambia con cada versión: esa URL siempre tiene el mismo contenido",
      "Porque los .js se cachean por defecto un año en todos los navegadores",
      "Porque el hash le permite al CDN invalidar la copia vieja cuando hay deploy",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es cache busting: un deploy nuevo genera nombres nuevos, que el HTML (sin cachear) referencia.",
  },
  {
    pregunta: "¿Qué directiva impide que un CDN compartido guarde una respuesta por usuario?",
    opciones: [
      "no-cache",
      "private",
      "must-revalidate",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "private permite guardarla solo en el navegador de ese usuario.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué explota un ataque de cache poisoning típico?",
    opciones: [
      "Un max-age demasiado largo, que deja una respuesta vieja servida por días",
      "Un ETag predecible, que permite fabricar una versión válida del recurso",
      "Headers que cambian la respuesta pero no forman parte de la clave del cache",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El CDN guarda la respuesta manipulada bajo la URL normal y se la sirve a todos.",
  },
  {
    pregunta: "Una entrada muy pedida vence y el backend se cae por la avalancha. ¿Qué ayuda?",
    opciones: [
      "stale-while-revalidate y request coalescing",
      "Bajar el max-age para que venza de a poco",
      "Pasar la respuesta a no-cache con ETag",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Se sigue sirviendo la copia vieja y un solo request regenera la entrada.",
  },
];

export default function CachingHttpPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Caching HTTP"
      descripcion="Cachear bien es la diferencia entre pegarle al servidor en cada click o resolver instantáneo con una copia local válida."
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
            El servidor le dice al cliente cómo cachear una respuesta con el
            header <code>Cache-Control</code>. La directiva más común es{" "}
            <code>max-age=N</code>: durante N segundos, el navegador ni
            siquiera le pregunta al servidor, usa directamente la copia
            local.
          </p>
          <p>
            Cuando esa ventana vence (o la directiva es{" "}
            <code>no-cache</code>), el navegador no necesariamente vuelve a
            descargar todo: puede{" "}
            <strong className="text-foreground">revalidar</strong> mandando
            el <code>ETag</code> guardado en el header{" "}
            <code>If-None-Match</code>. Si el servidor confirma que el
            recurso no cambió, responde{" "}
            <strong className="text-foreground">304 Not Modified</strong> sin
            body — ahorra transferir los datos, pero igual hubo un
            round-trip de red.
          </p>
          <p>
            <code>no-store</code> es el único caso donde no hay ninguna
            copia guardada: siempre se pide todo de nuevo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <DirectivasCacheExplorador directivas={directivasCache} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Elegí una directiva, hacé peticiones y avanzá el reloj simulado
          para ver cuándo hay HIT, MISS o revalidación.
        </p>
        <CacheSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que no-cache significa &ldquo;no cachear&rdquo;.
            </strong>{" "}
            Sí cachea; lo que hace es forzar la revalidación antes de usar
            la copia.
          </li>
          <li>
            <strong className="text-foreground">
              Cachear con max-age largo un recurso que cambia seguido.
            </strong>{" "}
            Los usuarios van a ver contenido viejo hasta que venza la
            ventana, sin ningún aviso.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir una revalidación (304) con un cache HIT real.
            </strong>{" "}
            Ambos evitan re-descargar el body, pero 304 sí implica un
            viaje de red — no es gratis como un HIT dentro de max-age.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Assets con hash en el nombre (<code>app.a1b2c3.js</code>) con{" "}
            <code>max-age</code> larguísimo: si cambia el contenido, cambia
            el nombre del archivo.
          </li>
          <li>
            APIs con datos que cambian seguido: <code>no-cache</code> con
            ETag para ahorrar transferencia sin arriesgar mostrar datos
            viejos.
          </li>
          <li>
            Endpoints con información sensible por usuario:{" "}
            <code>private, no-store</code> para que ni el navegador la
            guarde en disco.
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
          <p>
            Tenés un endpoint <code>/api/perfil</code> que cambia cada vez
            que el usuario edita su perfil, pero no muy seguido. Necesitás
            que la mayoría de las veces sea instantáneo, pero nunca mostrar
            datos desactualizados por más de unos segundos. ¿Qué
            Cache-Control usarías?
          </p>
          <RevelarSolucion>
            <p>
              <code>Cache-Control: private, max-age=5, must-revalidate</code>
            </p>
            <p className="mt-2">
              <code>max-age=5</code> da una ventana corta de HIT instantáneo
              sin pegarle al servidor. Pasados esos 5 segundos,{" "}
              <code>must-revalidate</code> obliga a confirmar con el
              servidor (probablemente con un 304 barato si no cambió nada)
              en vez de seguir sirviendo la copia vieja indefinidamente.{" "}
              <code>private</code> evita que un proxy compartido cachee
              datos de un perfil que son por-usuario.
            </p>
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
            La política depende del tipo de recurso. Assets con hash en el
            nombre: <code>public, max-age=31536000, immutable</code> (cache
            busting). HTML: <code>no-cache</code>, para que cada deploy se vea.
            Datos por usuario: <code>private</code>, y <code>no-store</code> si
            son sensibles. <code>s-maxage</code> permite que el CDN cachee más
            tiempo que el navegador.
          </p>
          <p>
            <code>Vary</code> declara qué headers del request forman parte de
            la clave del cache: <code>Accept-Encoding</code> o{" "}
            <code>Accept-Language</code> cuando cambian la respuesta. Variar de
            más (<code>Cookie</code>, <code>User-Agent</code>) hace que el cache
            deje de servir.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cachear el HTML con max-age largo.</strong>{" "}
            Los usuarios siguen viendo la versión anterior después del deploy.
          </li>
          <li>
            <strong className="text-foreground">Respuestas personalizadas sin <code>private</code>.</strong>{" "}
            Un CDN puede servirle a un usuario los datos de otro.
          </li>
          <li>
            <strong className="text-foreground"><code>Vary: Cookie</code> en contenido público.</strong>{" "}
            Cada usuario genera su propia entrada y el CDN no cachea nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Definir la tabla de Cache-Control por tipo de ruta de una app.</li>
          <li>Un catálogo con <code>s-maxage</code> y <code>stale-while-revalidate</code> en el CDN.</li>
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
            <strong className="text-foreground">Cache poisoning</strong>: si la
            app usa un header que no forma parte de la clave del cache para
            generar la respuesta, un atacante puede lograr que el CDN guarde
            una versión manipulada y la sirva a todos.
          </p>
          <p>
            <strong className="text-foreground">Cache stampede</strong>: al
            vencer una entrada muy pedida, todos los requests van al origen a
            la vez. Se mitiga con <code>stale-while-revalidate</code>, request
            coalescing, jitter en los TTL y <code>stale-if-error</code>.
          </p>
          <p>
            Sin <code>Cache-Control</code>, los navegadores aplican una
            frescura heurística (una fracción del tiempo desde{" "}
            <code>Last-Modified</code>): mejor declarar siempre la política
            explícitamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cachear respuestas de error en el CDN.</strong>{" "}
            Un 500 transitorio queda servido a todos durante el TTL.
          </li>
          <li>
            <strong className="text-foreground">TTLs idénticos para miles de entradas.</strong>{" "}
            Vencen juntas y generan picos en el origen.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Revisar qué headers usa el backend para armar URLs antes de poner un CDN adelante.</li>
          <li>Invalidar por tags (surrogate keys) en el CDN en vez de purgar todo.</li>
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
            Después de un deploy, algunos usuarios ven la página rota: el HTML
            nuevo carga un JS viejo, o al revés. Esta es la configuración.
            ¿Qué está mal?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`/index.html     Cache-Control: public, max-age=86400
/static/app.js  Cache-Control: public, max-age=86400`}
          </pre>
          <RevelarSolucion>
            <p>
              El JS no tiene hash en el nombre y los dos se cachean un día de
              forma independiente: un usuario puede tener el HTML nuevo y el JS
              viejo en cache (o al revés), y quedan desincronizados hasta que
              ambos vencen. La corrección es cache busting: generar el JS con
              hash de contenido (<code>app.3f9a1c.js</code>) y servirlo con{" "}
              <code>max-age=31536000, immutable</code>, y servir el HTML con{" "}
              <code>no-cache</code> para que siempre se revalide y apunte a los
              nombres correctos. Así cada versión del HTML trae exactamente sus
              assets.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
