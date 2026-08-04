import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ScopeSimulador } from "@/components/modulo/ScopeSimulador";
import { ScopeResolver } from "@/components/modulo/ScopeResolver";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosScope } from "@/lib/modules/scope/escenarios";

export const metadata: Metadata = {
  title: "Scope — Dev Study Lab",
  description:
    "Cómo JavaScript decide, para cada variable, en qué scope de la cadena la encuentra — y qué pasa cuando dos scopes usan el mismo nombre.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Cuando el motor de JS busca una variable, ¿en qué orden recorre los scopes?",
    opciones: [
      "Del scope global hacia adentro",
      "Del scope más interno (donde está el código) hacia afuera, hasta el global",
      "En un orden aleatorio",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La búsqueda empieza en el scope donde se ejecuta el código y sube nivel por nivel hasta encontrar la variable o llegar al global sin encontrarla.",
  },
  {
    pregunta: "¿Qué es shadowing?",
    opciones: [
      "Cuando una variable interna con el mismo nombre que una externa oculta a esta última dentro de su propio scope",
      "Un error de sintaxis por declarar una variable dos veces",
      "Un tipo de closure",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La búsqueda se detiene en la primera coincidencia (la más cercana). Si un scope interno declara una variable con el mismo nombre que uno externo, la interna 'tapa' a la externa mientras estás dentro de ese scope — la externa sigue existiendo intacta.",
  },
  {
    pregunta: "¿Cuál es la diferencia clave entre 'scope' y 'closure'?",
    opciones: [
      "Son exactamente lo mismo",
      "El scope es la regla de dónde se puede acceder a una variable; la closure es cuando una función retiene ese acceso después de que el scope externo debería haber desaparecido",
      "Closure es solo para var, scope es solo para let",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El scope define visibilidad mientras el código se ejecuta. La closure es lo que pasa cuando una función escapa de su scope de origen (se retorna, se guarda) y sigue teniendo acceso a esas variables aunque ya no deberían estar disponibles.",
  },
];

export default function ScopePage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Scope"
      descripcion="Cada variable vive en un scope, y cada scope está anidado dentro de otro. Entender esa cadena es la base para entender closures, hoisting y casi todo lo demás en JS."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
