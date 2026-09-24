import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ScopeSimulador } from "@/components/modulo/ScopeSimulador";
import { ScopeResolver } from "@/components/modulo/ScopeResolver";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosScope } from "@/lib/modules/scope/escenarios";
import { entrevistaScope } from "@/lib/modules/scope/entrevista";

const preguntasPorNivel = {
  1: entrevistaScope.filter((p) => p.nivel === 1),
  2: entrevistaScope.filter((p) => p.nivel === 2),
  3: entrevistaScope.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Scope — Dev Study Lab",
  description:
    "Cómo JavaScript decide, para cada variable, en qué scope de la cadena la encuentra — y qué pasa cuando dos scopes usan el mismo nombre.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Cuando el motor de JS busca una variable, ¿en qué orden recorre los scopes?",
    opciones: [
      "Desde el scope donde se llamó a la función hacia afuera, hasta el global",
      "Desde el scope donde está escrito el código hacia afuera, hasta el global",
      "Desde el global hacia adentro, hasta llegar al scope actual",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La búsqueda empieza en el scope donde se ejecuta el código y sube nivel por nivel hasta encontrar la variable o llegar al global sin encontrarla.",
  },
  {
    pregunta: "¿Qué es shadowing?",
    opciones: [
      "Que una variable interna con el mismo nombre reasigne el valor de la externa",
      "Declarar dos veces el mismo nombre en un scope, algo que let no permite",
      "Que una variable interna con el mismo nombre oculte a la externa en ese scope",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "La búsqueda se detiene en la primera coincidencia (la más cercana). Si un scope interno declara una variable con el mismo nombre que uno externo, la interna 'tapa' a la externa mientras estás dentro de ese scope — la externa sigue existiendo intacta.",
  },
  {
    pregunta: "¿Cuál es la diferencia clave entre 'scope' y 'closure'?",
    opciones: [
      "Scope define desde dónde se accede a una variable; closure es una función que conserva ese acceso después",
      "Scope es el conjunto de variables de una función; closure es la copia de ese conjunto que se hace al retornar",
      "Scope se resuelve al ejecutar el código; closure es lo que se resuelve al escribirlo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El scope define visibilidad mientras el código se ejecuta. La closure es lo que pasa cuando una función escapa de su scope de origen (se retorna, se guarda) y sigue teniendo acceso a esas variables aunque ya no deberían estar disponibles.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Un var declarado en el nivel superior de un módulo ES termina como propiedad de window?",
    opciones: [
      "Sí: un var en el nivel superior siempre crea una propiedad del objeto global",
      "No: cada módulo ES tiene su propio scope, aislado del objeto global",
      "Solo si el módulo no usa export; con algún export queda aislado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los módulos ES aíslan su scope de nivel superior de otros módulos y del objeto global. Un script clásico, en cambio, comparte un único scope global entre todos los <script> de la página.",
  },
  {
    pregunta:
      "¿Por qué se evita el statement `with` en JavaScript moderno?",
    opciones: [
      "Porque copia el objeto en cada acceso, lo que multiplica el uso de memoria",
      "Porque hace lo mismo que desestructurar, con una sintaxis que confunde a los linters",
      "Porque mete propiedades en el scope chain en runtime, frena optimizaciones y strict mode lo prohíbe",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El motor no puede saber en tiempo de compilación si un nombre es una variable o una propiedad del objeto. La alternativa moderna para lo mismo es destructuring explícito.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué diferencia a la Temporal Dead Zone de simplemente 'la variable no existe todavía'?",
    opciones: [
      "typeof de una variable no declarada da 'undefined'; en TDZ, lanza ReferenceError",
      "En TDZ la variable vale undefined; si no está declarada, lanza ReferenceError",
      "Ninguna: en los dos casos typeof devuelve 'undefined' sin lanzar error",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "let/const se hoistean pero no se inicializan: quedan en un estado 'muerto' desde el inicio del bloque hasta su declaración. Acceder ahí, incluso con typeof, lanza ReferenceError.",
  },
  {
    pregunta:
      "¿Por qué un `eval` dentro de una función puede afectar la performance de código que no lo usa directamente?",
    opciones: [
      "Porque recompila su string en cada llamada, pero el resto de la función no se ve afectado",
      "Porque el motor no sabe qué variables podría crear o tocar, y desoptimiza toda la función",
      "Porque eval corre en el scope global y obliga a buscar todas las variables ahí",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los motores optimizan la resolución de variables analizando estáticamente el scope en tiempo de compilación. Un eval (o with) rompe esa garantía y fuerza una resolución más lenta, tipo diccionario, en toda la función.",
  },
];

export default function ScopePage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Scope"
      descripcion="Cada variable vive en un scope, y cada scope está anidado dentro de otro. Entender esa cadena es la base para entender closures, hoisting y casi todo lo demás en JS."
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
            El <strong className="text-foreground">scope</strong> determina
            desde dónde se puede acceder a una variable. JavaScript tiene
            scope <strong className="text-foreground">global</strong>{" "}
            (visible en todo el archivo/módulo), scope{" "}
            <strong className="text-foreground">de función</strong> (lo
            que declarás con <code>var</code> dentro de una función), y
            scope <strong className="text-foreground">de bloque</strong>{" "}
            (lo que declarás con <code>let</code>/<code>const</code>{" "}
            dentro de <code>{"{}"}</code>, como un if o un for).
          </p>
          <p>
            Cuando el motor necesita resolver una variable, arranca en el
            scope más interno (donde está parado el código) y va subiendo
            nivel por nivel — eso se llama la{" "}
            <strong className="text-foreground">cadena de scopes</strong>{" "}
            (scope chain) — hasta encontrarla o llegar al global sin
            suerte (ahí es <code>ReferenceError</code>).
          </p>
          <p>
            La búsqueda se detiene en la primera coincidencia. Si un scope
            interno declara una variable con el mismo nombre que uno
            externo, la interna gana mientras estés adentro de ese scope
            — eso es <strong className="text-foreground">shadowing</strong>
            , y no modifica ni afecta a la variable externa.
          </p>
          <p className="text-xs text-muted-foreground">
            No confundir con closures (que ya vimos): scope es la regla de
            visibilidad mientras el código corre; closure es cuando una
            función se lleva ese acceso puesto, incluso después de que su
            scope de origen &ldquo;debería&rdquo; haber desaparecido.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ScopeSimulador escenarios={escenariosScope} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ScopeResolver />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar var esperando scope de bloque.
            </strong>{" "}
            var ignora los bloques ({"{}"}) — solo respeta límites de
            función. Un var dentro de un if &ldquo;se escapa&rdquo; al
            scope de la función completa.
          </li>
          <li>
            <strong className="text-foreground">
              Reusar nombres de variables sin darse cuenta del shadowing.
            </strong>{" "}
            Declarar una variable con el mismo nombre que un parámetro o
            una variable externa puede ocultar sin querer el valor que
            pensabas que ibas a usar.
          </li>
          <li>
            <strong className="text-foreground">
              Contaminar el scope global.
            </strong>{" "}
            Declarar variables sin var/let/const en un contexto no
            estricto las crea en el scope global sin querer, generando
            colisiones difíciles de rastrear.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar bloques ({"{}"}) a propósito con let/const para limitar la
            visibilidad de una variable temporal y evitar que se filtre al
            resto de la función.
          </li>
          <li>
            Entender por qué un parámetro de función con el mismo nombre
            que una variable externa no la modifica — solo la
            &ldquo;tapa&rdquo; dentro de esa función.
          </li>
          <li>
            Debuggear un bug de &ldquo;esta variable tiene un valor que no
            esperaba&rdquo; revisando si hay shadowing en algún nivel
            intermedio.
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
          <p>¿Qué imprime cada console.log, y por qué el segundo no da 15?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`let total = 10;

function sumar(total) {
  total = total + 5;
  console.log(total);
}

sumar(total);
console.log(total);`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">15</strong> y
              después <strong className="text-foreground">10</strong>.
            </p>
            <p className="mt-2">
              El parámetro <code>total</code> de <code>sumar()</code> es
              una variable NUEVA, propia del scope de esa función — hace
              shadowing sobre el <code>total</code> global, aunque se
              llame igual. Modificarla adentro de <code>sumar()</code> no
              toca la variable global en absoluto: por eso el segundo{" "}
              <code>console.log(total)</code>, ya fuera de la función,
              sigue viendo el valor original.
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
            Cada módulo ES tiene su propio scope de nivel superior, aislado
            de otros módulos y del objeto global: declarar algo con{" "}
            <code>let</code>/<code>const</code>/<code>function</code> ahí
            no lo cuelga de <code>window</code>. Un script clásico
            (<code>{"<script>"}</code> sin <code>type=&quot;module&quot;</code>)
            comparte, en cambio, un único scope global entre todos los
            scripts de la página — un <code>var</code> en su nivel superior
            sí termina como propiedad de <code>window</code>. Los módulos
            además son strict mode por defecto.
          </p>
          <p>
            El statement <code>with</code> mete las propiedades de un
            objeto en el scope chain de forma dinámica, así que el motor no
            puede saber en tiempo de compilación si un nombre es una
            variable o una propiedad del objeto — está prohibido en strict
            mode. La alternativa moderna para lo mismo, sin ambigüedad, es
            destructuring: <code>const {"{ a, b }"} = objeto</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que Node y el navegador manejan el scope de nivel
              superior igual.
            </strong>{" "}
            Node envuelve cada archivo CommonJS en una función (module
            wrapper), así que un var de &quot;nivel superior&quot; en
            realidad vive en el scope de esa función, no en el global real.
          </li>
          <li>
            <strong className="text-foreground">
              Usar with (o depender de código legacy que lo use).
            </strong>{" "}
            Rompe la resolución estática de variables y está prohibido en
            strict mode.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Preferir ES Modules sobre scripts clásicos para evitar
            colisiones de nombres en el scope global compartido entre
            librerías de terceros.
          </li>
          <li>
            Usar destructuring en vez de with para &quot;traer&quot;
            propiedades de un objeto de configuración al scope local de
            una función.
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
            <code>let</code> y <code>const</code> también se hoistean al
            tope de su scope de bloque, pero a diferencia de{" "}
            <code>var</code> no se inicializan con <code>undefined</code>:
            quedan en la{" "}
            <strong className="text-foreground">
              Temporal Dead Zone (TDZ)
            </strong>{" "}
            desde el inicio del bloque hasta su declaración. Acceder ahí
            lanza <code>ReferenceError</code>, incluso con{" "}
            <code>typeof</code> — a diferencia de una variable no
            declarada, donde <code>typeof</code> da <code>&apos;undefined&apos;</code>{" "}
            sin error.
          </p>
          <p>
            Una function declaration dentro de un bloque, en modo no
            estricto, tiene un comportamiento de compatibilidad legacy
            (&quot;Annex B&quot;) específico de navegadores: queda además
            asignada como var en el scope contenedor, visible incluso
            fuera del bloque. Motores no basados en navegador o en strict
            mode no están obligados a implementarlo, así que el mismo
            código puede comportarse distinto según el entorno.
          </p>
          <p>
            Un <code>eval</code> (o, históricamente, <code>with</code>)
            dentro de una función impide que el motor sepa en tiempo de
            compilación qué variables podrían crearse o modificarse
            dinámicamente, así que desactiva las optimizaciones de
            resolución de variables para{" "}
            <strong className="text-foreground">toda la función</strong>{" "}
            que lo contiene, no solo para el código dentro del eval.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confundir TDZ con &quot;la variable vale undefined&quot;.
            </strong>{" "}
            Acceder a una variable en TDZ lanza ReferenceError, no da
            undefined como pasaría con var.
          </li>
          <li>
            <strong className="text-foreground">
              Declarar function declarations sueltas dentro de bloques en
              modo no estricto.
            </strong>{" "}
            Su comportamiento (Annex B) varía entre motores y modos —
            preferir siempre strict mode y function expressions asignadas
            a let/const dentro de bloques.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar la TDZ a favor: declarar variables lo más cerca posible de
            su primer uso hace que cualquier acceso fuera de orden falle
            rápido y explícito, en vez de propagar un undefined silencioso.
          </li>
          <li>
            Evitar eval en código de alto rendimiento (parsers, hot paths)
            sabiendo que su sola presencia des-optimiza toda la función
            contenedora.
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
