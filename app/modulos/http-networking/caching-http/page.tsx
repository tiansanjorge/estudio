import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { DirectivasCacheExplorador } from "@/components/modulo/DirectivasCacheExplorador";
import { CacheSimulador } from "@/components/modulo/CacheSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { directivasCache } from "@/lib/modules/http/cache-directivas";

export const metadata: Metadata = {
  title: "Caching HTTP — Dev Study Lab",
  description:
    "Cómo Cache-Control, ETag y la revalidación deciden si una petición va al servidor o se resuelve con una copia local.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia hay entre no-store y no-cache?",
    opciones: [
      "Son sinónimos",
      "no-store nunca guarda nada; no-cache sí guarda, pero revalida antes de usar la copia",
      "no-cache es más estricto que no-store",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "no-store prohíbe guardar cualquier copia. no-cache sí permite guardarla, pero obliga a revalidar con el servidor antes de reutilizarla.",
  },
  {
    pregunta: "Con max-age=3600 vencido, el servidor confirma que el contenido no cambió. ¿Qué status responde?",
    opciones: ["200 con el body completo de nuevo", "304 Not Modified, sin body", "204 No Content"],
    respuestaCorrecta: 1,
    explicacion:
      "304 le dice al cliente 'seguí usando tu copia', sin volver a mandar el body — solo se transfieren los headers.",
  },
  {
    pregunta: "¿Para qué sirve stale-while-revalidate?",
    opciones: [
      "Para bloquear al usuario hasta que termine de revalidar",
      "Para servir la copia vieja al instante mientras revalida en segundo plano",
      "Para forzar que nunca se cachee nada",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Prioriza velocidad: el usuario ve la respuesta cacheada inmediatamente, y el navegador actualiza la copia en background para la próxima vez.",
  },
];

export default function CachingHttpPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Caching HTTP"
      descripcion="Cachear bien es la diferencia entre pegarle al servidor en cada click o resolver instantáneo con una copia local válida."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Elegí una directiva, hacé peticiones y avanzá el reloj simulado
          para ver cuándo hay HIT, MISS o revalidación.
        </p>
        <CacheSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
