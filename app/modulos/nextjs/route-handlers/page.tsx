import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { RouteHandlerCliente } from "@/components/modulo/RouteHandlerCliente";
import { entrevistaRouteHandlers } from "@/lib/modules/nextjs/route-handlers-entrevista";

const preguntasPorNivel = {
  1: entrevistaRouteHandlers.filter((p) => p.nivel === 1),
  2: entrevistaRouteHandlers.filter((p) => p.nivel === 2),
  3: entrevistaRouteHandlers.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Route handlers — Dev Study Lab",
  description:
    "Endpoints HTTP en el App Router: métodos, Request y Response, cuándo usarlos frente a Server Actions y Server Components, seguridad y caching.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un route.ts exporta GET y POST. Llega un PATCH. ¿Qué pasa?",
    opciones: [
      "Se ejecuta POST",
      "Next responde 405 Method Not Allowed automáticamente",
      "Da error de build",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada método es un export; lo que no está exportado recibe 405.",
  },
  {
    pregunta: "Tu page necesita la lista de productos. ¿Cómo la obtenés?",
    opciones: [
      "Con fetch a tu propio /api/productos",
      "Consultando la fuente directamente desde el Server Component",
      "Con una Server Action",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Pasar por tu propio endpoint agrega un viaje HTTP y rompe el prerender en el build.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "El body de un POST no pasa la validación con Zod. ¿Qué status corresponde?",
    opciones: ["200", "400", "500"],
    respuestaCorrecta: 1,
    explicacion:
      "Es un error del cliente (datos inválidos), no del servidor.",
  },
  {
    pregunta: "Con el modelo clásico, ¿qué métodos de un Route Handler se pueden cachear?",
    opciones: ["Todos", "Solo GET", "Solo POST"],
    respuestaCorrecta: 1,
    explicacion:
      "Los demás métodos nunca se cachean, aunque estén en el mismo archivo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Si no exportás OPTIONS, ¿qué responde Next a un OPTIONS?",
    opciones: [
      "405",
      "204 con el header Allow listando los métodos implementados",
      "Los headers de CORS necesarios para cualquier origen",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "No agrega headers de CORS: para un preflight de otro origen hay que exportar OPTIONS propio.",
  },
  {
    pregunta: "Un handler serverless guarda un contador de requests en una variable. ¿Qué problema tiene?",
    opciones: [
      "Ninguno",
      "Cada instancia tiene su propia memoria efímera: el contador no es global ni persistente",
      "Las variables no existen en serverless",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El estado compartido va a un store externo como Redis.",
  },
];

export default function RouteHandlersPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="Route handlers (API routes)"
      descripcion="Endpoints HTTP dentro del App Router: cómo se definen, cuándo conviene uno frente a una Server Action, y qué cuidar en seguridad y despliegue."
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
            Un <code>route.ts</code> exporta una función por método HTTP y
            define un endpoint. Usa <code>Request</code> y{" "}
            <code>Response</code> estándar (con los helpers{" "}
            <code>NextRequest</code>/<code>NextResponse</code>). Lo que no se
            exporta responde 405. No puede estar en el mismo segmento que un{" "}
            <code>page.tsx</code>.
          </p>
          <p>
            <strong className="text-foreground">Cuándo usarlo</strong>: cuando
            hace falta un endpoint HTTP real, porque lo consume una app mobile,
            un tercero o un webhook, o porque hay que controlar status, headers
            o el formato de la respuesta. Para leer datos de tu propia UI está
            el Server Component; para mutarlos, la Server Action.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <RouteHandlerCliente />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Hacer fetch a tu propio Route Handler desde un Server Component.
            </strong>{" "}
            Viaje HTTP de más, y el build falla si la página se prerenderiza.
          </li>
          <li>
            <strong className="text-foreground">Responder todo con 200.</strong>{" "}
            El cliente no puede distinguir un error de validación de un éxito.
          </li>
          <li>
            <strong className="text-foreground">
              <code>route.ts</code> y <code>page.tsx</code> en la misma carpeta.
            </strong>{" "}
            Es un conflicto: cada uno toma todos los métodos de la ruta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Webhook de Stripe o del CMS.</li>
          <li>API pública consumida por una app mobile.</li>
          <li>Generar un RSS, un CSV o un sitemap.</li>
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
            Un Route Handler es un{" "}
            <strong className="text-foreground">endpoint público</strong>:
            autenticación y autorización adentro del handler, validación del
            body con un esquema (400 si falla), rate limiting (429) en lo
            sensible, verificación de firma en webhooks, y cuidado con qué
            headers y datos se devuelven.
          </p>
          <p>
            <strong className="text-foreground">Caching</strong>: nada por
            defecto. En el modelo clásico, solo los GET con{" "}
            <code>dynamic = &apos;force-static&apos;</code> o{" "}
            <code>revalidate</code>. Con Cache Components, los GET se
            prerenderizan si no leen datos del request, y las consultas se
            cachean extrayéndolas a una función con{" "}
            <code>&quot;use cache&quot;</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Confiar en el body sin validar.</strong>{" "}
            Cualquiera puede mandar cualquier cosa.
          </li>
          <li>
            <strong className="text-foreground">Devolver el error interno al cliente.</strong>{" "}
            Puede exponer consultas, rutas o secretos.
          </li>
          <li>
            <strong className="text-foreground">
              <code>&quot;use cache&quot;</code> en el cuerpo del handler.
            </strong>{" "}
            No está permitido; va en una función auxiliar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un webhook del CMS que verifica la firma y llama a{" "}
            <code>revalidateTag</code>.
          </li>
          <li>Un endpoint de login con rate limiting por IP.</li>
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
            Next implementa solo <code>HEAD</code> (con el handler de{" "}
            <code>GET</code>) y <code>OPTIONS</code> (204 con{" "}
            <code>Allow</code>). El resto de los métodos no exportados reciben
            405 sin <code>Allow</code>. El OPTIONS automático no responde
            preflights de CORS: eso hay que implementarlo.
          </p>
          <p>
            Desplegado como <strong className="text-foreground">función
            serverless</strong>: sin estado en memoria entre requests, sistema
            de archivos efímero, timeout máximo y sin conexiones persistentes.
            El trabajo largo se encola y el handler responde 202.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Rate limiter en un Map en memoria.</strong>{" "}
            Cada instancia cuenta por separado.
          </li>
          <li>
            <strong className="text-foreground">Procesar un archivo grande dentro del request.</strong>{" "}
            El timeout lo corta a mitad de camino.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un endpoint que recibe un video, lo encola y responde 202 con la URL
            para consultar el estado.
          </li>
          <li>Un OPTIONS propio para una API consumida desde otro dominio.</li>
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
            Este webhook de pagos marca pedidos como pagados. ¿Qué problemas
            tiene?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// app/api/webhooks/pagos/route.ts
export async function POST(request: Request) {
  const evento = await request.json();
  await db.pedido.update({
    where: { id: evento.pedidoId },
    data: { estado: "pagado" },
  });
  await enviarFacturaPorMail(evento.pedidoId); // tarda ~20 s
  return Response.json({ ok: true });
}`}
          </pre>
          <RevelarSolucion>
            <p>
              1) No verifica la firma: cualquiera puede mandar un POST y marcar
              un pedido como pagado. Hay que leer el body como texto y validar
              la firma del proveedor con el secreto antes de parsear. 2) No
              valida el evento: tipo de evento, que el pedido exista y que el
              monto coincida. 3) No es idempotente: los proveedores reintentan
              webhooks, así que el mismo evento puede llegar dos veces; hay que
              guardar el id del evento y descartar duplicados. 4) Hace el mail
              dentro del request: puede superar el timeout del proveedor o de
              la función. Lo correcto es encolar la factura y responder 200 de
              inmediato.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
