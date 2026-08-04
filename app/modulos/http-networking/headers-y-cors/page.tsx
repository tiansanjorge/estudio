import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { HeadersExplorador } from "@/components/modulo/HeadersExplorador";
import { CorsSimulador } from "@/components/modulo/CorsSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { headersHttp } from "@/lib/modules/http/headers";

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

export default function HeadersYCorsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Headers y CORS"
      descripcion="Los headers llevan metadata de cada petición y respuesta. CORS es la política que decide qué código JavaScript puede leer una respuesta cross-origin."
    >
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
    </ModuloLayout>
  );
}
