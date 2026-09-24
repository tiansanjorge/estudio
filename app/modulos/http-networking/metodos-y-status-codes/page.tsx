import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { MetodosExplorador } from "@/components/modulo/MetodosExplorador";
import { StatusCodeExplorador } from "@/components/modulo/StatusCodeExplorador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { metodosHttp } from "@/lib/modules/http/metodos";
import { statusCodes } from "@/lib/modules/http/status-codes";
import { entrevistaMetodosStatus } from "@/lib/modules/http/metodos-status-entrevista";

const preguntasPorNivel = {
  1: entrevistaMetodosStatus.filter((p) => p.nivel === 1),
  2: entrevistaMetodosStatus.filter((p) => p.nivel === 2),
  3: entrevistaMetodosStatus.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Métodos y status codes — Dev Study Lab",
  description:
    "Los métodos HTTP y los códigos de status que devuelve el servidor en cada respuesta.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estos métodos es idempotente?",
    opciones: [
      "POST",
      "PUT",
      "PATCH",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "PUT reemplaza el recurso entero: llamarlo N veces con el mismo body da siempre el mismo resultado. POST y PATCH no garantizan eso.",
  },
  {
    pregunta: "Mandaste un token vencido a un endpoint protegido. ¿Qué status esperás?",
    opciones: [
      "403 Forbidden",
      "400 Bad Request",
      "401 Unauthorized",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "401 es 'no sé quién sos' (falla la autenticación). 403 es 'sé quién sos, pero no tenés permiso' (falla la autorización).",
  },
  {
    pregunta: "¿Qué dispara el navegador antes de un POST cross-origin con headers custom?",
    opciones: [
      "Un OPTIONS (preflight)",
      "Un HEAD de verificación",
      "Un GET al mismo endpoint",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El navegador manda un OPTIONS preflight para preguntarle al servidor si el método y los headers están permitidos antes de mandar la petición real.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un cliente reintenta un POST de pago tras un timeout. ¿Qué evita el doble cobro?",
    opciones: [
      "Cambiar el POST por un PUT, que es idempotente por definición",
      "Una idempotency key: si se repite, el servidor devuelve el resultado guardado",
      "Que el cliente espere más antes de reintentar, con backoff exponencial",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Convierte una operación no idempotente en segura de reintentar.",
  },
  {
    pregunta: "Aceptás un pedido para generar un reporte que tarda minutos. ¿Qué status devolvés?",
    opciones: [
      "201 Created",
      "102 Processing",
      "202 Accepted",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "202 indica que se aceptó pero todavía no terminó; se acompaña con una URL para consultar el estado.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Después de procesar un formulario POST, ¿qué redirect evita el reenvío al refrescar?",
    opciones: [
      "303 See Other",
      "307 Temporary Redirect",
      "301 Moved Permanently",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "303 fuerza un GET a la página de resultado (patrón Post/Redirect/Get). 307 y 308 conservan el POST.",
  },
  {
    pregunta: "¿Por qué una API respondería 404 ante un recurso que existe pero es de otro usuario?",
    opciones: [
      "Porque 403 obliga al cliente a reautenticarse y cortaría la sesión",
      "Para no revelar que el recurso existe y evitar la enumeración",
      "Porque el recurso no existe para ese usuario, que es lo que define 404",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La especificación permite 404 cuando el servidor no quiere revelar la existencia del recurso.",
  },
];

export default function MetodosYStatusCodesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Métodos y status codes"
      descripcion="Cada petición HTTP declara una intención con su método, y cada respuesta declara un resultado con su status code."
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
            Un método HTTP le dice al servidor{" "}
            <strong className="text-foreground">qué querés hacer</strong> con
            un recurso: leerlo (<code>GET</code>), crearlo (
            <code>POST</code>), reemplazarlo (<code>PUT</code>), modificarlo
            parcialmente (<code>PATCH</code>) o borrarlo (<code>DELETE</code>
            ). Dos propiedades importan para razonar sobre ellos:{" "}
            <strong className="text-foreground">seguro</strong> (no modifica
            nada en el servidor) e{" "}
            <strong className="text-foreground">idempotente</strong> (llamarlo
            una vez o cien veces con los mismos datos produce el mismo
            estado final).
          </p>
          <p>
            El status code de la respuesta le dice al cliente{" "}
            <strong className="text-foreground">qué pasó</strong>. Se agrupan
            por el primer dígito: <code>2xx</code> es éxito, <code>3xx</code>{" "}
            es redirección, <code>4xx</code> es un error causado por el
            cliente (algo que mandaste está mal) y <code>5xx</code> es un
            error del servidor (algo se rompió del otro lado, no es tu
            culpa).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <MetodosExplorador metodos={metodosHttp} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Filtrá por categoría y elegí un código para ver cuándo se usa.
        </p>
        <StatusCodeExplorador codigos={statusCodes} />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Devolver 200 para todo, incluso errores.
            </strong>{" "}
            Si algo falló, el status tiene que reflejarlo — el cliente (y las
            herramientas de monitoreo) confían en el código, no solo en el
            body.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir 401 con 403.
            </strong>{" "}
            401 es &ldquo;no sé quién sos&rdquo;, 403 es &ldquo;sé quién sos,
            pero no podés&rdquo;.
          </li>
          <li>
            <strong className="text-foreground">
              Usar GET para acciones con efectos secundarios.
            </strong>{" "}
            Un GET se supone &ldquo;seguro&rdquo;: navegadores, proxies y crawlers
            pueden repetirlo o precargarlo sin avisar.
          </li>
          <li>
            <strong className="text-foreground">
              Tratar PATCH como si fuera idempotente por default.
            </strong>{" "}
            Depende de cómo lo implementes (ej: un PATCH que hace{" "}
            <code>contador++</code> no lo es).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Elegir el método correcto al diseñar un endpoint REST nuevo, para
            que se comporte como espera cualquier cliente HTTP.
          </li>
          <li>
            Debuggear un error de CORS entendiendo que el preflight{" "}
            <code>OPTIONS</code> es una petición aparte, separada de la real.
          </li>
          <li>
            Decidir si un error de red conviene reintentarlo automáticamente:
            un 503 sí tiene sentido reintentar, un 404 no.
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
            Estás diseñando el endpoint <code>PUT /carritos/42/items/7</code>{" "}
            para actualizar la cantidad de un ítem del carrito. El item con
            id 7 no existe en el carrito 42. ¿Qué método usarías y qué
            status code deberías devolver?
          </p>
          <RevelarSolucion>
            <p>
              El método <strong className="text-foreground">PUT</strong> está
              bien elegido: estás reemplazando el estado de un recurso
              identificado por una URL, y hacerlo dos veces con la misma
              cantidad da el mismo resultado (es idempotente).
            </p>
            <p className="mt-2">
              El status correcto es{" "}
              <strong className="text-foreground">404 Not Found</strong>: el
              recurso <code>/carritos/42/items/7</code> no existe. No es un
              400 (la petición está bien formada) ni un 409 (no hay
              conflicto con un estado existente, directamente no hay
              recurso).
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
            Un POST no es idempotente, pero se puede volver{" "}
            <strong className="text-foreground">seguro de reintentar</strong>{" "}
            con una <code>Idempotency-Key</code>: el cliente manda un id único
            por operación y el servidor, si lo recibe de nuevo, devuelve el
            resultado guardado en vez de ejecutar otra vez.
          </p>
          <p>
            Los status más precisos comunican qué hacer después:{" "}
            <code>201</code> + <code>Location</code> al crear, <code>202</code>{" "}
            para trabajo asíncrono, <code>204</code> sin body,{" "}
            <code>409</code> ante un conflicto de estado, <code>422</code> para
            datos bien formados pero inválidos, <code>429</code> y{" "}
            <code>503</code> con <code>Retry-After</code>.
          </p>
          <p>
            Para el body de los errores existe un formato estándar, Problem
            Details (<code>application/problem+json</code>), con{" "}
            <code>type</code>, <code>title</code>, <code>status</code> y{" "}
            <code>detail</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Reintentar POST sin idempotency key.</strong>{" "}
            Un timeout no significa que la operación falló.
          </li>
          <li>
            <strong className="text-foreground">
              429 sin <code>Retry-After</code>.
            </strong>{" "}
            El cliente no sabe cuándo volver y reintenta enseguida, empeorando
            la carga.
          </li>
          <li>
            <strong className="text-foreground">Errores con formatos distintos por endpoint.</strong>{" "}
            El cliente no puede manejarlos de forma genérica.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Checkout con idempotency key para que el botón &quot;Pagar&quot; se pueda reintentar.</li>
          <li>Exportación de reportes que responde 202 y se consulta por polling.</li>
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
            Los <strong className="text-foreground">redirects</strong> varían
            en permanencia y en si conservan el método: <code>301</code>/
            <code>302</code> (históricos, el POST suele volverse GET),{" "}
            <code>307</code>/<code>308</code> (conservan método y body) y{" "}
            <code>303</code> (fuerza GET, base del patrón Post/Redirect/Get).
            Los permanentes quedan cacheados.
          </p>
          <p>
            Hay decisiones de <strong className="text-foreground">seguridad</strong>{" "}
            escondidas en los status: responder <code>404</code> en vez de{" "}
            <code>403</code> para no revelar qué recursos existen, y no dar
            pistas en el login (&quot;el usuario no existe&quot; frente a
            &quot;contraseña incorrecta&quot;).
          </p>
          <p>
            La especificación exige que un <code>405</code> incluya el header{" "}
            <code>Allow</code> con los métodos válidos; no todos los frameworks
            lo cumplen (por ejemplo, el 405 automático de los Route Handlers de
            Next.js no lo manda).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un 301 puesto por error.</strong>{" "}
            Navegadores y buscadores lo cachean y cuesta revertirlo.
          </li>
          <li>
            <strong className="text-foreground">
              Redirigir un POST con 302 esperando que siga siendo POST.
            </strong>{" "}
            Para eso está 307.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Migrar URLs de un sitio con 308 para no perder posicionamiento.</li>
          <li>Definir una política de 404 vs 403 para toda una API multi-tenant.</li>
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
            Revisá este diseño de endpoints y corregí método y status donde haga
            falta.
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`GET  /usuarios/42/borrar         → 200 { "ok": true }
POST /pedidos                    → 200 { "id": 981 }
POST /reportes (tarda 3 min)     → 200 (cuando termina)
GET  /pedidos/981 (de otro user) → 403`}
          </pre>
          <RevelarSolucion>
            <p>
              1) Borrar con GET es peligroso: un crawler o un prefetch lo puede
              ejecutar. Tiene que ser <code>DELETE /usuarios/42</code> →{" "}
              <code>204</code>. 2) Crear un pedido es <code>201 Created</code>{" "}
              con <code>Location: /pedidos/981</code>, idealmente con{" "}
              <code>Idempotency-Key</code>. 3) Un request que tarda 3 minutos
              va a chocar con timeouts: <code>202 Accepted</code> enseguida con
              una URL de estado (<code>/reportes/77</code>) para consultar. 4)
              Si la existencia del pedido es sensible, <code>404</code> en vez
              de <code>403</code>, y usar ids no secuenciales para que no se
              puedan enumerar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
