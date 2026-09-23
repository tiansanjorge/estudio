import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HeadersExplorador } from "@/components/modulo/HeadersExplorador";
import { CorsSimulador } from "@/components/modulo/CorsSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { headersHttp } from "@/lib/modules/http/headers";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaHeadersCors } from "@/lib/modules/http/headers-cors-entrevista";

const preguntasPorNivel = {
  1: entrevistaHeadersCors.filter((p) => p.nivel === 1),
  2: entrevistaHeadersCors.filter((p) => p.nivel === 2),
  3: entrevistaHeadersCors.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Headers y CORS — Dev Study Lab",
  description:
    "Los headers HTTP más comunes y cómo el navegador decide si una petición cross-origin está permitida.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué headers hacen que una petición deje de ser 'simple' y dispare preflight?",
    opciones: [
      "Accept y User-Agent",
      "Content-Type: application/json y headers custom",
      "Origin siempre",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un Content-Type distinto a los simples (form-urlencoded, text/plain, multipart) o cualquier header custom (como Authorization con un esquema no estándar) fuerza el preflight.",
  },
  {
    pregunta:
      "Un GET cross-origin sin Access-Control-Allow-Origin en la respuesta: ¿el servidor llegó a procesarlo?",
    opciones: [
      "No, el navegador lo bloqueó antes de mandarlo",
      "Sí, el servidor lo procesó igual; el navegador solo bloquea que el JS lea la respuesta",
      "Depende del método HTTP",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Al ser una request simple, el navegador la manda sin preflight. CORS no impide que el servidor la reciba y procese — solo impide que el JavaScript del cliente lea la respuesta.",
  },
  {
    pregunta: "¿Qué header identifica el estado actual de un recurso para validar caché?",
    opciones: ["Cache-Control", "ETag", "Content-Type"],
    respuestaCorrecta: 1,
    explicacion:
      "ETag es un identificador del estado del recurso. El cliente lo manda de vuelta en If-None-Match para preguntar si cambió.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con credentials: 'include', ¿qué valor de Access-Control-Allow-Origin es inválido?",
    opciones: ["https://app.ejemplo.com", "*", "El origen exacto reflejado desde una lista blanca"],
    respuestaCorrecta: 1,
    explicacion:
      "Con credenciales, el comodín no está permitido: hay que devolver el origen exacto.",
  },
  {
    pregunta: "¿CORS impide que un POST de formulario cross-origin llegue al servidor?",
    opciones: [
      "Sí, siempre",
      "No: el request simple se envía y se procesa; CORS solo bloquea que el JS lea la respuesta",
      "Solo si el servidor usa HTTPS",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso CORS no protege contra CSRF: para eso están SameSite, tokens o chequear Origin.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Un servidor valida el origen con origin.includes('ejemplo.com'). ¿Qué problema tiene?",
    opciones: [
      "Ninguno",
      "Acepta dominios de un atacante como ejemplo.com.atacante.com",
      "Es muy lento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La comparación tiene que ser por igualdad contra una lista blanca exacta.",
  },
  {
    pregunta: "¿Qué directiva de CSP evita que tu sitio se embeba en un iframe ajeno?",
    opciones: ["script-src", "frame-ancestors", "connect-src"],
    respuestaCorrecta: 1,
    explicacion:
      "frame-ancestors protege contra clickjacking y reemplaza a X-Frame-Options.",
  },
];

export default function HeadersYCorsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Headers y CORS"
      descripcion="Los headers llevan metadata de cada petición y respuesta. CORS es la política que decide qué código JavaScript puede leer una respuesta cross-origin."
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
            Los <strong className="text-foreground">headers</strong> son pares
            clave-valor que viajan junto a cada petición y respuesta HTTP,
            con metadata: qué formato tiene el body, quién sos, qué se
            puede cachear, qué dominios pueden leer la respuesta.
          </p>
          <p>
            <strong className="text-foreground">CORS</strong> (Cross-Origin
            Resource Sharing) es la política del navegador que decide si el
            JavaScript de tu página puede leer la respuesta de una petición
            hecha a otro origen. No es una restricción del servidor hacia
            &ldquo;quién puede pegarle&rdquo; — el servidor puede recibir y procesar la
            petición igual. CORS restringe qué puede{" "}
            <strong className="text-foreground">leer</strong> el navegador
            del lado del cliente.
          </p>
          <p>
            Si la petición no es &ldquo;simple&rdquo; (usa un método o
            headers no estándar), el navegador manda antes un{" "}
            <strong className="text-foreground">preflight</strong>: una
            petición <code>OPTIONS</code> que le pregunta al servidor si esa
            combinación de origen, método y headers está permitida, antes
            de mandar la petición real.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <HeadersExplorador headers={headersHttp} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Combiná método y permiso del servidor para ver si el navegador
          dispara preflight y si la respuesta termina permitida o
          bloqueada.
        </p>
        <CorsSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Pensar que CORS protege al servidor.
            </strong>{" "}
            CORS es una restricción que aplica el navegador del lado del
            cliente. Un curl o Postman ignoran CORS por completo.
          </li>
          <li>
            <strong className="text-foreground">
              Creer que un error de CORS significa que la petición no llegó.
            </strong>{" "}
            En requests simples, el servidor la recibe y procesa igual —
            el bloqueo es solo sobre la lectura de la respuesta.
          </li>
          <li>
            <strong className="text-foreground">
              Configurar Access-Control-Allow-Origin: * junto con cookies.
            </strong>{" "}
            Con credenciales (cookies), el navegador exige un origen
            explícito, no un wildcard.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Configurar un backend para que acepte peticiones desde el
            dominio del frontend en un entorno con dominios distintos.
          </li>
          <li>
            Usar <code>ETag</code> + <code>If-None-Match</code> para evitar
            re-descargar un recurso que no cambió.
          </li>
          <li>
            Leer <code>Authorization</code> para diferenciar
            autenticación (¿quién sos?) de autorización (403, ¿podés hacer
            esto?).
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
            Tu frontend en <code>https://app.miempresa.com</code> hace un{" "}
            <code>fetch</code> con método <code>PUT</code> y{" "}
            <code>Content-Type: application/json</code> contra{" "}
            <code>https://api.miempresa.com</code>. El servidor no tiene
            configurado CORS. ¿Qué va a pasar y por qué?
          </p>
          <RevelarSolucion>
            <p>
              PUT con <code>Content-Type: application/json</code> no es una
              request &ldquo;simple&rdquo;, así que el navegador manda
              primero un preflight <code>OPTIONS</code>.
            </p>
            <p className="mt-2">
              Como el servidor no tiene CORS configurado, la respuesta del
              preflight no incluye{" "}
              <code>Access-Control-Allow-Origin</code>. El navegador
              bloquea ahí mismo:{" "}
              <strong className="text-foreground">
                la petición PUT real nunca llega a mandarse
              </strong>
              . El error va a aparecer en la consola del navegador, no como
              un error de red normal.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Con <strong className="text-foreground">credenciales</strong>{" "}
            (cookies o auth del navegador), el cliente usa{" "}
            <code>credentials: &apos;include&apos;</code> y el servidor tiene
            que responder <code>Access-Control-Allow-Credentials: true</code>{" "}
            con el origen exacto, nunca <code>*</code>, más{" "}
            <code>Vary: Origin</code> para que ningún cache mezcle respuestas
            entre orígenes. La cookie necesita <code>SameSite=None; Secure</code>{" "}
            si el sitio es distinto.
          </p>
          <p>
            <code>Access-Control-Max-Age</code> cachea el preflight y ahorra un
            round trip por request; <code>Access-Control-Expose-Headers</code>{" "}
            permite que el JS lea headers de la respuesta que no son básicos.
          </p>
          <p>
            CORS protege al <strong className="text-foreground">usuario</strong>,
            no a la API: el request igual llega al servidor. Contra CSRF hacen
            falta cookies <code>SameSite</code>, tokens o verificar{" "}
            <code>Origin</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Reflejar el origen sin <code>Vary: Origin</code>.</strong>{" "}
            Un CDN puede servirle a un origen la respuesta de otro.
          </li>
          <li>
            <strong className="text-foreground">Confundir same-site con same-origin.</strong>{" "}
            app.ejemplo.com y api.ejemplo.com son cross-origin pero same-site.
          </li>
          <li>
            <strong className="text-foreground">Tratar CORS como control de acceso.</strong>{" "}
            Desde curl o un servidor no existe.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Configurar CORS de una API para un frontend en otro dominio con sesión por cookie.</li>
          <li>Leer un header <code>X-Total-Count</code> de paginación desde el cliente.</li>
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
            La configuración de CORS más peligrosa es{" "}
            <strong className="text-foreground">
              reflejar cualquier origen con credenciales
            </strong>
            : equivale a desactivar la same-origin policy para esa API.
            También lo son las validaciones con <code>includes</code> o regex
            mal anclados y aceptar el origen <code>null</code>.
          </p>
          <p>
            Los <strong className="text-foreground">headers de seguridad</strong>{" "}
            completan la defensa: <code>Strict-Transport-Security</code>,{" "}
            <code>Content-Security-Policy</code> (con nonces y{" "}
            <code>frame-ancestors</code>), <code>X-Content-Type-Options:
            nosniff</code>, <code>Referrer-Policy</code> y{" "}
            <code>Permissions-Policy</code>. Una CSP nueva arranca en modo{" "}
            <code>Report-Only</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">CSP con <code>unsafe-inline</code> en scripts.</strong>{" "}
            Anula buena parte de la protección contra XSS.
          </li>
          <li>
            <strong className="text-foreground">HSTS con <code>preload</code> sin estar listo.</strong>{" "}
            Si algún subdominio no tiene HTTPS, queda inaccesible por meses.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Auditar la configuración de CORS de una API en un pentest.</li>
          <li>Desplegar una CSP con nonce por request desde el servidor.</li>
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
            Esta configuración &quot;arregló&quot; un error de CORS en
            producción. ¿Qué riesgo introdujo y cómo la corregís?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin ?? "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});`}
          </pre>
          <RevelarSolucion>
            <p>
              Refleja cualquier origen con credenciales: cualquier sitio que
              visite un usuario logueado puede leer sus datos de la API con un
              fetch. Además no manda <code>Vary: Origin</code>, así que un CDN
              puede cachear la respuesta de un origen y servírsela a otro. La
              corrección: una lista blanca exacta de orígenes, comparada por
              igualdad; reflejar el origen solo si está en la lista; agregar{" "}
              <code>Vary: Origin</code>; listar explícitamente los headers y
              métodos permitidos; y responder los preflight con{" "}
              <code>Access-Control-Max-Age</code>.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
