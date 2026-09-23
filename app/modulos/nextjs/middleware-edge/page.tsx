import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ProxySimulador } from "@/components/modulo/ProxySimulador";
import { entrevistaMiddlewareEdge } from "@/lib/modules/nextjs/middleware-edge-entrevista";

const preguntasPorNivel = {
  1: entrevistaMiddlewareEdge.filter((p) => p.nivel === 1),
  2: entrevistaMiddlewareEdge.filter((p) => p.nivel === 2),
  3: entrevistaMiddlewareEdge.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Proxy & Edge runtime — Dev Study Lab",
  description:
    "El Proxy de Next.js 16 (antes Middleware): redirects, rewrites, matcher, sus límites como capa de seguridad, y la historia del Edge runtime.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia visible tiene un rewrite respecto de un redirect?",
    opciones: [
      "Ninguna",
      "Con rewrite la URL del navegador no cambia; con redirect sí",
      "El rewrite solo funciona en desarrollo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El redirect provoca un segundo request a otra URL; el rewrite se resuelve dentro del servidor.",
  },
  {
    pregunta: "En Next.js 16, ¿cómo se llama el archivo que antes era middleware.ts?",
    opciones: ["edge.ts", "proxy.ts", "server.ts"],
    respuestaCorrecta: 1,
    explicacion:
      "Misma funcionalidad, nuevo nombre; hay un codemod para migrar.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Sin matcher, un redirect de auth en el Proxy manda todo a /login. ¿Qué se rompe?",
    opciones: [
      "Nada",
      "Los requests de JS, CSS e imágenes también se redirigen y la página de login queda rota",
      "Solo las API routes",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin matcher, el Proxy corre también sobre _next/static, _next/image y public.",
  },
  {
    pregunta: "¿Dónde tiene que estar la verificación de autorización definitiva?",
    opciones: [
      "Solo en el Proxy",
      "Cerca de los datos: capa de acceso a datos, Server Actions y Route Handlers",
      "En el cliente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El Proxy hace chequeos optimistas; un matcher mal configurado deja rutas sin cubrir.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasó con runtime = 'edge' en Next.js 16?",
    opciones: [
      "Pasó a ser el default",
      "Quedó deprecado; el Proxy usa Node.js por defecto",
      "Se volvió obligatorio en el Proxy",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Además, el Edge runtime es incompatible con Cache Components.",
  },
  {
    pregunta: "Un redirect está en next.config y otro en el Proxy para la misma ruta. ¿Cuál gana?",
    opciones: [
      "El del Proxy",
      "El de next.config, porque se evalúa antes",
      "Ninguno, da error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Orden: headers y redirects de next.config, después el Proxy, después los rewrites.",
  },
];

export default function MiddlewareEdgePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="Proxy (ex Middleware) & Edge runtime"
      descripcion="La capa que corre antes de cada request: qué puede hacer, por qué no es una frontera de seguridad, y cómo cambió su runtime entre versiones."
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
            <code>proxy.ts</code>, en la raíz del proyecto, exporta una función
            que corre <strong className="text-foreground">antes</strong> de que
            el request llegue a la ruta. Puede redirigir, reescribir,
            modificar headers o responder directamente.
          </p>
          <p>
            Hasta Next 15 se llamaba <strong className="text-foreground">Middleware</strong>{" "}
            (<code>middleware.ts</code>). En Next 16 se renombró a Proxy, con la
            misma funcionalidad, para dejar claro que es una capa de red delante
            de la app, no una cadena de middlewares estilo Express, y que
            conviene usarla como último recurso.
          </p>
          <p>
            <strong className="text-foreground">Redirect</strong>: el navegador
            va a otra URL. <strong className="text-foreground">Rewrite</strong>:
            se renderiza otra ruta pero la URL no cambia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ProxySimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Usar el Proxy para redirects fijos.
            </strong>{" "}
            <code>redirects</code> en <code>next.config</code> es más simple.
          </li>
          <li>
            <strong className="text-foreground">Consultar la base de datos en el Proxy.</strong>{" "}
            Corre en cada request, incluidos los prefetch.
          </li>
          <li>
            <strong className="text-foreground">Confundir redirect con rewrite.</strong>{" "}
            Un A/B test con redirect cambia la URL y se nota.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Redirigir a /login si no hay cookie de sesión.</li>
          <li>Detectar el idioma y redirigir a /es o /en.</li>
          <li>Servir cada subdominio de un SaaS multi-tenant con un rewrite.</li>
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
            El <strong className="text-foreground">matcher</strong> define
            dónde corre el Proxy. Sin él corre en todo, incluidos JS, CSS e
            imágenes: un redirect de auth puede romper la propia página de
            login. Los valores tienen que ser constantes.
          </p>
          <p>
            El Proxy <strong className="text-foreground">no es una frontera de
            seguridad</strong>. Sirve para chequeos optimistas (hay cookie o
            no), pero un matcher mal configurado o una Server Action movida a
            otra ruta quedan sin cubrir. La autorización real va cerca de los
            datos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Proxy sin matcher.</strong>{" "}
            Ejecuta lógica en cada asset estático.
          </li>
          <li>
            <strong className="text-foreground">
              Proteger solo con el Proxy.
            </strong>{" "}
            Las Server Actions son POST a la ruta donde se usan: si el matcher
            no la cubre, quedan expuestas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Proxy que redirige sin sesión + <code>verifySession()</code> en la
            capa de datos.
          </li>
          <li>Agregar headers de seguridad (CSP con nonce) por request.</li>
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
            El <strong className="text-foreground">Edge runtime</strong> era un
            entorno reducido (APIs web estándar, sin <code>fs</code> ni módulos
            nativos) con arranque rápido y ejecución cerca del usuario. El
            middleware corrió solo en Edge durante años. La dirección cambió:
            desde 15.5 el middleware puede usar Node.js, en 16 el Proxy usa
            Node.js por defecto y <code>runtime = &apos;edge&apos;</code> en las
            rutas quedó deprecado.
          </p>
          <p>
            Orden de resolución: <code>headers</code> y <code>redirects</code>{" "}
            de <code>next.config</code> → Proxy → rewrites{" "}
            <code>beforeFiles</code> → rutas del sistema de archivos → rewrites{" "}
            <code>afterFiles</code> → rutas dinámicas → rewrites{" "}
            <code>fallback</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Elegir Edge &quot;por performance&quot; con la base en una sola
              región.
            </strong>{" "}
            Cada consulta cruza la distancia igual.
          </li>
          <li>
            <strong className="text-foreground">
              Hacer un proxy a mano con <code>fetch</code>.
            </strong>{" "}
            Hay que reenviar los headers RSC que <code>NextResponse.rewrite</code>{" "}
            propaga solo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Migrar un <code>middleware.ts</code> en Edge a{" "}
            <code>proxy.ts</code> con el codemod <code>middleware-to-proxy</code>.
          </li>
          <li>
            Mandar analytics desde el Proxy con <code>event.waitUntil()</code>{" "}
            sin demorar la respuesta.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este Proxy protege el panel de admin. Un pentest encontró que
            igual se puede borrar un usuario sin ser admin. ¿Cómo, y qué
            cambiarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// proxy.ts
export function proxy(req: NextRequest) {
  if (req.cookies.get("rol")?.value !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
export const config = { matcher: "/admin/:path*" };

// app/usuarios/acciones.ts
"use server";
export async function borrarUsuario(id: string) {
  await db.usuario.delete({ where: { id } });
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Hay dos problemas. La Server Action vive y se usa fuera de{" "}
              <code>/admin</code>, así que el POST que la invoca no matchea y el
              Proxy nunca corre; además, cualquier Server Action es un endpoint
              público que se puede llamar directamente. Y el rol sale de una
              cookie que el propio usuario puede editar si no está firmada. El
              arreglo: verificar sesión y rol DENTRO de{" "}
              <code>borrarUsuario</code> (o en una capa de acceso a datos que la
              acción use), a partir de una sesión firmada o validada en el
              servidor. El Proxy puede quedar como redirect de conveniencia,
              pero nunca como la única barrera.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
