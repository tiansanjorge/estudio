import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { MetodosExplorador } from "@/components/modulo/MetodosExplorador";
import { StatusCodeExplorador } from "@/components/modulo/StatusCodeExplorador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { metodosHttp } from "@/lib/modules/http/metodos";
import { statusCodes } from "@/lib/modules/http/status-codes";

export const metadata: Metadata = {
  title: "Métodos y status codes — Frontend Study Lab",
  description:
    "Los métodos HTTP y los códigos de status que devuelve el servidor en cada respuesta.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estos métodos es idempotente?",
    opciones: ["POST", "PATCH", "PUT"],
    respuestaCorrecta: 2,
    explicacion:
      "PUT reemplaza el recurso entero: llamarlo N veces con el mismo body da siempre el mismo resultado. POST y PATCH no garantizan eso.",
  },
  {
    pregunta: "Mandaste un token vencido a un endpoint protegido. ¿Qué status esperás?",
    opciones: ["403 Forbidden", "401 Unauthorized", "400 Bad Request"],
    respuestaCorrecta: 1,
    explicacion:
      "401 es 'no sé quién sos' (falla la autenticación). 403 es 'sé quién sos, pero no tenés permiso' (falla la autorización).",
  },
  {
    pregunta: "¿Qué dispara el navegador antes de un POST cross-origin con headers custom?",
    opciones: ["Un GET", "Un OPTIONS (preflight)", "Un HEAD"],
    respuestaCorrecta: 1,
    explicacion:
      "El navegador manda un OPTIONS preflight para preguntarle al servidor si el método y los headers están permitidos antes de mandar la petición real.",
  },
];

export default function MetodosYStatusCodesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="HTTP y Networking"
      titulo="Métodos y status codes"
      descripcion="Cada petición HTTP declara una intención con su método, y cada respuesta declara un resultado con su status code."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Filtrá por categoría y elegí un código para ver cuándo se usa.
        </p>
        <StatusCodeExplorador codigos={statusCodes} />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
