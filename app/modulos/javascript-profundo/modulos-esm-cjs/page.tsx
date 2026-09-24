import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ImportCircularResolver } from "@/components/modulo/ImportCircularResolver";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaModulosEsmCjs } from "@/lib/modules/modulos-esm-cjs/entrevista";

const preguntasPorNivel = {
  1: entrevistaModulosEsmCjs.filter((p) => p.nivel === 1),
  2: entrevistaModulosEsmCjs.filter((p) => p.nivel === 2),
  3: entrevistaModulosEsmCjs.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Módulos: ESM vs CommonJS — Dev Study Lab",
  description:
    "CommonJS resuelve módulos en runtime, dinámico y síncrono. ES Modules se analiza de forma estática antes de ejecutar nada. Esa diferencia explica casi todo lo demás.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia fundamental hay entre require() e import?",
    opciones: [
      "Ninguna, son intercambiables siempre",
      "require() es dinámico y se resuelve en runtime; import es estático y se analiza antes de ejecutar cualquier código",
      "import solo funciona en el navegador, nunca en Node",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "require() es una llamada a función común, puede estar condicionada. import se hoistea y no puede ser condicional — eso permite el análisis estático del grafo de módulos.",
  },
  {
    pregunta: "¿Qué campo de package.json determina si un .js se trata como ESM o CommonJS?",
    opciones: ['"main"', '"type"', '"scripts"'],
    respuestaCorrecta: 1,
    explicacion:
      '"type": "module" trata los .js como ESM; sin ese campo (o con "commonjs") se tratan como CJS. Las extensiones .mjs/.cjs fuerzan el modo sin importar package.json.',
  },
  {
    pregunta: "¿Se puede hacer un import condicional, como dentro de un if?",
    opciones: [
      "Sí, igual que require()",
      "No con import estático; para eso existe el import() dinámico, que devuelve una Promise",
      "No, JavaScript no permite carga condicional de ningún tipo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "import estático se hoistea al tope del módulo y no puede depender de una condición en runtime. import() dinámico sí permite carga condicional, pero es asincrónico.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué ESM permite mejor tree-shaking que CommonJS?",
    opciones: [
      "Porque ESM es más rápido de parsear",
      "Porque los imports/exports estáticos permiten a un bundler saber de antemano, sin ejecutar código, qué se usa y qué se puede eliminar",
      "CommonJS no soporta tree-shaking por una limitación de sintaxis, no de análisis",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con CJS, un require() puede estar condicionado y module.exports puede mutarse dinámicamente, así que el bundler no puede garantizar con certeza qué es seguro eliminar.",
  },
  {
    pregunta:
      "¿Qué es el 'dual package hazard'?",
    opciones: [
      "Un error de sintaxis al mezclar require e import",
      "Una librería publicada en ambos formatos termina cargada dos veces en el mismo proceso, con estado module-level duplicado e independiente",
      "Un warning de ESLint sin consecuencias reales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si la librería mantiene un singleton o caché a nivel de módulo, cada copia (CJS y ESM) tiene su propio estado, rompiendo la garantía de instancia única compartida.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "En una dependencia circular, ¿qué ve un módulo B que usa un valor de A dentro de una función que corre DESPUÉS del ciclo de carga?",
    opciones: [
      "Con CJS, siempre ve el valor final actualizado; con ESM, siempre falla",
      "Con CJS puede quedarse con una copia incompleta del require original; con ESM, el live binding ya refleja el valor final",
      "Ambos sistemas se comportan exactamente igual en este caso",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "require() devuelve una copia fija del momento de la llamada. Los named exports de ESM son referencias en vivo que se actualizan cuando el módulo exportador completa su asignación.",
  },
  {
    pregunta:
      "¿Para qué sirve \"sideEffects\": false en package.json?",
    opciones: [
      "Desactiva el motor de JavaScript de efectos secundarios",
      "Le dice al bundler que puede eliminar archivos completos del paquete si nada importa nombres específicos de ellos, no solo exports no usados",
      "Es solo metadata informativa sin efecto en el bundle",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Permite tree-shaking agresivo a nivel de archivo completo. Archivos con efectos reales (CSS, polyfills) deben excluirse explícitamente en un array dentro de ese mismo campo.",
  },
];

export default function ModulosEsmCjsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Módulos: ESM vs CommonJS"
      descripcion="CommonJS resuelve módulos en runtime, de forma dinámica y síncrona. ES Modules se analiza de forma estática antes de ejecutar nada. Esa diferencia de raíz explica casi todo lo demás: tree-shaking, dependencias circulares, interop."
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
            <strong className="text-foreground">CommonJS</strong> (
            <code>require</code>/<code>module.exports</code>) resuelve y
            carga módulos de forma síncrona y dinámica, en tiempo de
            ejecución: <code>require()</code> es una llamada a función
            común, que puede estar dentro de un <code>if</code> o un{" "}
            <code>try/catch</code>.
          </p>
          <p>
            <strong className="text-foreground">ES Modules</strong> (
            <code>import</code>/<code>export</code>) se analizan de forma
            estática antes de ejecutar cualquier código: los imports se
            hoistean al tope del archivo y no pueden ser condicionales.
            Eso le permite a herramientas (bundlers, el motor) saber de
            antemano exactamente qué depende de qué, sin ejecutar nada.
          </p>
          <p>
            En Node, el campo <code>&quot;type&quot;</code> de{" "}
            <code>package.json</code> decide el modo por defecto:{" "}
            <code>&quot;module&quot;</code> trata los <code>.js</code>{" "}
            como ESM; sin ese campo (o con{" "}
            <code>&quot;commonjs&quot;</code>) se tratan como CJS. Las
            extensiones <code>.mjs</code> y <code>.cjs</code> fuerzan el
            modo sin importar lo que diga <code>package.json</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ImportCircularResolver />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Mezclar require e import en el mismo archivo sin saber en
              qué modo está.
            </strong>{" "}
            El modo (CJS o ESM) de un archivo depende de package.json o su
            extensión — no se puede combinar libremente dentro del mismo
            archivo.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar un import condicional como con require.
            </strong>{" "}
            import estático no acepta condiciones. Para carga condicional
            existe <code>import()</code> dinámico, que es asincrónico.
          </li>
          <li>
            <strong className="text-foreground">
              Reasignar module.exports esperando que exports siga
              apuntando a lo mismo.
            </strong>{" "}
            <code>exports</code> es solo un alias inicial de{" "}
            <code>module.exports</code>; reasignar este último rompe esa
            referencia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar <code>import()</code> dinámico para code splitting: cargar
            un módulo pesado solo cuando realmente se necesita.
          </li>
          <li>
            Publicar una librería en ambos formatos (CJS y ESM) para
            compatibilidad con proyectos legacy y modernos.
          </li>
          <li>
            Elegir <code>&quot;type&quot;: &quot;module&quot;</code> en
            proyectos Node nuevos, para alinearse con el estándar y con
            cómo funciona el navegador.
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
            ¿Por qué este código funciona en CommonJS pero no tiene
            equivalente directo en ESM estático?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`let logger;

if (process.env.NODE_ENV === 'production') {
  logger = require('./logger-produccion');
} else {
  logger = require('./logger-debug');
}`}
          </pre>
          <RevelarSolucion>
            <p>
              require() es una llamada a función común: puede estar
              condicionada por cualquier lógica de runtime, incluida una
              variable de entorno evaluada en ese momento.
            </p>
            <p className="mt-2">
              import estático, en cambio, se hoistea al tope del módulo y
              se resuelve antes de ejecutar cualquier código — no puede
              depender de una condición evaluada en runtime. El
              equivalente en ESM requiere{" "}
              <code>import()</code> dinámico (asincrónico, devuelve una
              Promise) dentro de una función async, o resolver la
              condición en tiempo de build en vez de en runtime.
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
            El tree-shaking necesita saber, sin ejecutar código, qué
            exports se usan realmente para poder descartar el resto. Como
            los imports/exports de ESM son estáticos, un bundler puede
            analizar el grafo completo de dependencias de antemano. Con
            CommonJS, un <code>require()</code> puede estar condicionado y{" "}
            <code>module.exports</code> mutarse dinámicamente, así que el
            bundler no puede garantizar con la misma certeza qué es
            seguro eliminar.
          </p>
          <p>
            El campo <code>&quot;exports&quot;</code> condicional en
            package.json declara explícitamente qué archivo cargar según
            el consumidor: una condición{" "}
            <code>&quot;import&quot;</code> apunta al build ESM, una{" "}
            <code>&quot;require&quot;</code> al build CJS. Sin este campo,
            la resolución del entry point es menos predecible.
          </p>
          <p>
            El{" "}
            <strong className="text-foreground">dual package hazard</strong>{" "}
            ocurre cuando una librería publicada en ambos formatos termina
            cargada DOS VECES en el mismo proceso — una copia vía require,
            otra vía import. Si esa librería mantiene estado a nivel de
            módulo (un singleton, una caché), cada copia tiene su propio
            estado independiente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Publicar una librería sin el campo exports en package.json.
            </strong>{" "}
            Deja la resolución del entry point a convenciones menos
            predecibles y aumenta el riesgo de dual package hazard.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que tree-shaking de CJS funciona igual que en ESM.
            </strong>{" "}
            En la práctica es mucho más limitado o directamente no ocurre.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Configurar <code>&quot;exports&quot;</code> condicional para
            servir ESM a bundlers modernos y CJS a consumidores legacy
            desde el mismo paquete.
          </li>
          <li>
            Evitar barrel files que reexportan todo un directorio sin
            declarar <code>sideEffects: false</code>, porque dificultan el
            tree-shaking incluso en ESM.
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
            En una dependencia circular, <code>require()</code> devuelve
            una copia de <code>module.exports</code> en el momento exacto
            de la llamada: si el módulo todavía no llegó a la asignación
            necesitada, esa copia queda incompleta y no se actualiza
            después. Los named exports de ESM son bindings en vivo: si el
            valor se usa dentro de una función que corre después de que el
            ciclo terminó, el binding ya refleja el valor final. El caso
            que sigue fallando en ambos sistemas es usar el valor
            directamente en el nivel superior mientras el ciclo está en
            curso.
          </p>
          <p>
            Node no permite, en general, hacer <code>require()</code> de
            un módulo ESM de forma síncrona: un ESM puede tener top-level
            await, lo que lo vuelve inherentemente asincrónico de cargar.
            La forma soportada de consumir un ESM desde CJS es{" "}
            <code>import()</code> dinámico, que devuelve una Promise.
          </p>
          <p>
            <code>&quot;sideEffects&quot;: false</code> en package.json le
            dice al bundler que ningún archivo del paquete tiene efectos
            secundarios al importarse, así que puede eliminar archivos
            completos si nada importa nombres específicos de ellos — no
            solo exports no usados dentro de un archivo. Archivos con
            efectos reales (CSS, polyfills) deben excluirse explícitamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Intentar requerir un ESM síncronamente desde CJS.
            </strong>{" "}
            No es soportado de forma general; hace falta import() dinámico
            o el flag experimental de Node en casos específicos.
          </li>
          <li>
            <strong className="text-foreground">
              Marcar sideEffects: false sin excluir archivos con efectos
              reales.
            </strong>{" "}
            El bundler puede eliminar por error un CSS o un polyfill que
            sí necesita ejecutarse por su solo import.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Diagnosticar un valor undefined o incompleto en una dependencia
            circular CJS revisando el orden de requires, no asumiendo un
            bug del motor.
          </li>
          <li>
            Declarar sideEffects con un array explícito de excepciones
            (CSS, polyfills) en una librería que además quiere habilitar
            tree-shaking agresivo del resto de sus archivos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
