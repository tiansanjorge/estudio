import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { FronteraUseClientSimulador } from "@/components/modulo/FronteraUseClientSimulador";
import { entrevistaServerVsClientComponents } from "@/lib/modules/nextjs/server-vs-client-components-entrevista";

const preguntasPorNivel = {
  1: entrevistaServerVsClientComponents.filter((p) => p.nivel === 1),
  2: entrevistaServerVsClientComponents.filter((p) => p.nivel === 2),
  3: entrevistaServerVsClientComponents.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Server vs Client Components — Dev Study Lab",
  description:
    "Qué corre dónde en el App Router, la frontera de 'use client', props serializables, composición con children y cómo proteger el código de servidor.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué puede hacer un Server Component que un Client Component no?",
    opciones: [
      "Leer la base o usar secretos sin mandar ese código al navegador",
      "Renderizarse a HTML en la carga inicial, antes de hidratar",
      "Usar hooks como useState y useEffect en el servidor",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Corre solo en el servidor: su código no está en el bundle del cliente.",
  },
  {
    pregunta: "¿Un Client Component se renderiza en el servidor en la carga inicial?",
    opciones: [
      "No: solo se renderiza en el navegador, después de descargar su JS",
      "Sí: se prerenderiza a HTML y después se hidrata",
      "Solo si no usa hooks; si usa, se renderiza recién en el cliente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "'use client' significa que también existe en el cliente, no que solo corre ahí.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un Client Component recibe <Carrito /> como children desde la page. ¿Qué es Carrito?",
    opciones: [
      "Un Client Component: todo lo que está dentro de uno pasa al cliente",
      "Depende: es cliente si Carrito usa algún hook, y servidor si no",
      "Un Server Component, porque lo importa y renderiza la page",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "La frontera sigue el grafo de imports, no la posición visual en el árbol.",
  },
  {
    pregunta: "¿Cuál de estas props NO se puede pasar de un Server Component a un Client Component?",
    opciones: [
      "Una función común como onClick",
      "Una Promise sin resolver",
      "Un objeto Date",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las funciones no se serializan; sí se pueden pasar Server Actions.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace import \"server-only\" en un módulo?",
    opciones: [
      "Marca el módulo para que corra solo en el runtime de Node",
      "Hace fallar el build si se importa desde el cliente",
      "Oculta sus exports del bundle, pero deja que el cliente lo importe",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Vuelve verificable la frontera en vez de depender de la disciplina del equipo.",
  },
  {
    pregunta: "¿Cómo se comparten datos del servidor con muchos Client Components sin bloquear el render?",
    opciones: [
      "Resolviendo los datos en el layout y pasándolos por props a cada componente",
      "Guardándolos en un store global que el servidor serializa en el HTML",
      "Pasando la Promise sin await a un Provider y leyéndola con use()",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El render no espera la consulta, y los consumidores suspenden hasta que se resuelve.",
  },
];

export default function ServerVsClientComponentsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Next.js"
      titulo="Server Components vs Client Components"
      descripcion="Qué corre en el servidor, qué llega al navegador, y dónde poner la frontera de 'use client' para mandar el menor JavaScript posible."
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
            En el App Router todo componente es{" "}
            <strong className="text-foreground">Server Component</strong> por
            defecto: corre en el servidor, puede ser async, leer datos y usar
            secretos, y su código no llega al navegador. Lo que viaja es el
            resultado, dentro del RSC payload.
          </p>
          <p>
            Un <strong className="text-foreground">Client Component</strong>{" "}
            (<code>&quot;use client&quot;</code>) es el componente de React de
            siempre: se prerenderiza a HTML y se hidrata en el navegador, donde
            tiene estado, efectos y eventos. Su código va al bundle.
          </p>
          <p>
            Regla práctica: Client Components solo donde hace falta
            interactividad o APIs del navegador, lo más cerca posible de las
            hojas del árbol.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <FronteraUseClientSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              <code>&quot;use client&quot;</code> en el layout o la page para
              que &quot;funcione&quot;.
            </strong>{" "}
            Arrastra todo lo que importan al bundle.
          </li>
          <li>
            <strong className="text-foreground">
              Creer que un Client Component no corre en el servidor.
            </strong>{" "}
            Usar <code>window</code> en el render rompe el prerender.
          </li>
          <li>
            <strong className="text-foreground">
              Hacer fetch en <code>useEffect</code> para datos que podría leer
              el servidor.
            </strong>{" "}
            Agrega un viaje de red y un estado de carga innecesarios.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Una ficha de producto como Server Component con un{" "}
            <code>&lt;BotonAgregar&gt;</code> de cliente.
          </li>
          <li>
            Renderizar markdown en el servidor para no mandar el parser al
            navegador.
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
            <code>&quot;use client&quot;</code> marca una{" "}
            <strong className="text-foreground">
              frontera en el grafo de módulos
            </strong>
            : el archivo y todo lo que importa pasan al cliente. Lo que se
            recibe como <code>children</code> u otra prop no se importa, así
            que un Server Component puede quedar visualmente adentro de uno de
            cliente.
          </p>
          <p>
            Las props del servidor al cliente viajan en el RSC payload y tienen
            que ser <strong className="text-foreground">serializables</strong>:
            datos planos, Date, Map, Set, Promises, JSX y Server Actions. No
            funciones comunes ni instancias de clases.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pasar un callback desde la page.
            </strong>{" "}
            No se serializa; el comportamiento va en el Client Component o en
            una Server Action.
          </li>
          <li>
            <strong className="text-foreground">
              Pasar el registro completo de la DB como prop.
            </strong>{" "}
            Engorda el payload y puede exponer campos sensibles.
          </li>
          <li>
            <strong className="text-foreground">
              Librerías de terceros sin <code>&quot;use client&quot;</code>.
            </strong>{" "}
            Se envuelven en un archivo propio que la reexporta con la
            directiva.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un <code>&lt;Modal&gt;</code> de cliente que recibe como children
            un carrito renderizado en el servidor.
          </li>
          <li>
            Un ThemeProvider de cliente que envuelve solo{" "}
            <code>children</code> en el layout raíz.
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
            La frontera se puede{" "}
            <strong className="text-foreground">verificar</strong>:{" "}
            <code>import &quot;server-only&quot;</code> hace fallar el build si
            un módulo de servidor termina en el cliente. Solo las variables{" "}
            <code>NEXT_PUBLIC_</code> llegan al bundle. Una capa de acceso a
            datos que devuelve DTOs completa la protección.
          </p>
          <p>
            Context no existe en Server Components: no tienen estado ni se
            re-renderizan. Los datos del servidor se comparten pasando valores
            o <strong className="text-foreground">Promises</strong> a un
            Provider de cliente (leídas con <code>use()</code>), y entre Server
            Components alcanza con llamar a la misma función: la memoización
            del request evita repetir la consulta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en que nadie va a importar el módulo de la DB desde el
              cliente.
            </strong>{" "}
            Tarde o temprano pasa; <code>server-only</code> lo impide.
          </li>
          <li>
            <strong className="text-foreground">
              Envolver toda la app en un Provider en el{" "}
              <code>&lt;html&gt;</code>.
            </strong>{" "}
            Ponerlo lo más abajo posible deja más partes estáticas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un <code>lib/dal.ts</code> con <code>server-only</code> que
            verifica la sesión y devuelve DTOs.
          </li>
          <li>
            Pasar la Promise del usuario a un <code>UserProvider</code> para
            que el header no bloquee el render de la página.
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
            Esta page no funciona: el build se queja de que un Client
            Component no puede ser async ni acceder a la base de datos. ¿Qué
            dos cambios harías para que funcione mandando el menor JavaScript
            posible?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// app/reportes/page.tsx
"use client";
import { Grafico } from "pesada-lib-graficos";
import { db } from "@/lib/db";

export default async function Reportes() {
  const datos = await db.venta.findMany();
  return <Grafico datos={datos} onPuntoClick={(p) => console.log(p)} />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              1) Sacar <code>&quot;use client&quot;</code> de la page: con la
              directiva, la page (y <code>db</code>, y la librería) pasan al
              cliente, donde no se puede consultar la base ni ser async. La page
              vuelve a ser Server Component que consulta los datos. 2) Crear un{" "}
              <code>GraficoCliente.tsx</code> con{" "}
              <code>&quot;use client&quot;</code> que importe la librería y
              defina ahí el <code>onPuntoClick</code>: así el callback no cruza
              la frontera (no es serializable) y la page le pasa solo los datos
              necesarios, idealmente mapeados a un DTO liviano en vez del
              registro completo de la DB. Si el gráfico está debajo del
              pliegue, además se puede cargar con{" "}
              <code>next/dynamic</code> para sacarlo del bundle inicial.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
