import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaGenericos } from "@/lib/modules/generics/entrevista";

const preguntasPorNivel = {
  1: entrevistaGenericos.filter((p) => p.nivel === 1),
  2: entrevistaGenericos.filter((p) => p.nivel === 2),
  3: entrevistaGenericos.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Genéricos — Dev Study Lab",
  description:
    "Parámetros de tipo que permiten escribir código reutilizable sin perder la relación entre el tipo de entrada y el de salida, a diferencia de any.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia a un genérico de usar any?",
    opciones: [
      "any descarta el tipo; un genérico preserva la relación entre entrada y salida",
      "Ninguna en compilación; el genérico solo documenta mejor la intención",
      "El genérico valida los tipos en runtime; any los valida solo al compilar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Con any, el compilador deja de verificar cualquier cosa sobre ese valor. Con un genérico, TypeScript sabe exactamente qué tipo entró y lo propaga a la salida.",
  },
  {
    pregunta: "¿Cuándo tiene sentido usar un genérico en vez de duplicar una función por tipo?",
    opciones: [
      "Cuando la función recibe muchos parámetros de tipos distintos entre sí",
      "Cuando la lógica es la misma sin importar el tipo, como un repositorio CRUD",
      "Siempre que la función sea pública, para que acepte cualquier tipo de entrada",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Duplicar la función por cada tipo es código repetido que mantener en varios lugares. Un genérico lo escribe una sola vez, y el compilador garantiza que cada uso mantenga su propio tipo correcto.",
  },
  {
    pregunta: "¿Los genéricos existen en el JavaScript compilado final?",
    opciones: [
      "Sí: TypeScript los compila a chequeos de tipo que corren en runtime",
      "Sí, pero solo cuando el target es ES2022 o posterior",
      "No: son solo información de compilación y desaparecen al emitir",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un genérico nunca puede usarse para decisiones en runtime. Para distinguir tipos en tiempo de ejecución hace falta información que sobreviva a la compilación (typeof, instanceof, discriminantes explícitos).",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué pasa si escribís function f<T>(x: T) { return x.length; } sin constraint?",
    opciones: [
      "Error de compilación: TS no puede asegurar que todo T tenga length",
      "Compila: TS infiere que T tiene length porque la función la usa",
      "Compila, pero devuelve undefined si T no tiene length en runtime",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Sin un constraint (T extends { length: number }), TypeScript trata a T como completamente desconocido y no permite acceder a ninguna propiedad sobre él.",
  },
  {
    pregunta: "function getProp<T, K extends keyof T>(obj: T, key: K): T[K] — ¿qué garantiza el constraint K extends keyof T?",
    opciones: [
      "Que key sea un string, y que el retorno sea del tipo unión de todas las propiedades",
      "Que key sea una propiedad que existe en T, con el tipo exacto de esa propiedad",
      "Que T tenga al menos una propiedad, para que keyof T no quede vacío",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El compilador rechaza en tiempo de compilación cualquier key que no exista en el objeto, y el retorno T[K] es el tipo real de esa propiedad puntual, no any.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "type SoloString<T> = T extends string ? T : never; aplicado a SoloString<string | number> — ¿qué pasa?",
    opciones: [
      "Da never: string | number no extiende string como un todo",
      "Da string | number: la condición se evalúa solo para el primer miembro",
      "Se distribuye por cada miembro del union y el resultado es string",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Cuando T es un parámetro genérico 'naked' y se le pasa un union, TypeScript distribuye la condición sobre cada miembro automáticamente, en vez de evaluarla contra el union completo.",
  },
  {
    pregunta:
      "¿Para qué sirve la palabra clave infer dentro de un conditional type?",
    opciones: [
      "Para declarar un tipo nuevo que TS deduce al hacer match contra el evaluado",
      "Para pedirle a TS que infiera el tipo de retorno de cualquier función genérica",
      "Para convertir un tipo en un valor que se puede usar en runtime",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Permite 'extraer' una parte de un tipo complejo sin descomponerlo manualmente — por ejemplo, capturar el tipo de retorno de una función dentro de la rama extends de un conditional type.",
  },
];

export default function GenericosPage() {
  return (
    <ModuloLayout
      categoriaTitulo="TypeScript avanzado"
      titulo="Genéricos"
      descripcion="Parámetros de tipo que permiten escribir código reutilizable sin perder la relación entre el tipo de entrada y el de salida — la alternativa correcta a any cuando la lógica es la misma para cualquier tipo."
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
            Los <strong className="text-foreground">genéricos</strong> son
            parámetros de tipo: permiten escribir una función, clase o
            interfaz que funciona con cualquier tipo, pero preservando la
            relación entre el tipo de entrada y el de salida. A diferencia
            de <code>any</code> (que acepta cualquier tipo pero descarta
            toda la información), un genérico deja que TypeScript sepa
            exactamente qué tipo entró y lo propague a la salida.
          </p>
          <p>
            La sintaxis básica es <code>{"function f<T>(valor: T): T"}</code>
            . En la mayoría de los casos ni siquiera hace falta especificar{" "}
            <code>T</code> explícitamente al llamar la función: TypeScript
            lo infiere solo a partir del argumento pasado.
          </p>
          <p>
            Estructuras built-in ya usan genéricos todo el tiempo:{" "}
            <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>,{" "}
            <code>Map&lt;K, V&gt;</code>. Un{" "}
            <strong className="text-foreground">constraint</strong> (
            <code>T extends Forma</code>) limita qué tipos son válidos,
            para poder acceder con seguridad a propiedades específicas
            dentro de la función.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar any cuando en realidad se necesita preservar el tipo.
            </strong>{" "}
            any descarta toda verificación posterior; un genérico mantiene
            el autocompletado y el chequeo de tipos intactos.
          </li>
          <li>
            <strong className="text-foreground">
              No poner un constraint cuando la función accede a una
              propiedad específica de T.
            </strong>{" "}
            Sin él, TypeScript no puede garantizar que ese acceso sea
            seguro, ni siquiera para algo tan básico como .length.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que T es un tipo que existe en runtime.
            </strong>{" "}
            Es pura información de compilación (type erasure) — se borra
            por completo al generar el JavaScript final.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver una respuesta de API con un tipo genérico:{" "}
            <code>ApiResponse&lt;T&gt;</code>, reutilizable para cualquier
            endpoint sin perder el tipo del payload.
          </li>
          <li>
            Un hook de React genérico como{" "}
            <code>useLocalStorage&lt;T&gt;</code>, con la misma lógica de
            persistencia sin importar qué tipo de valor se guarde.
          </li>
          <li>
            Un repositorio genérico (<code>Repository&lt;TEntity&gt;</code>)
            con operaciones CRUD tipadas según la entidad concreta.
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
            ¿Por qué esta función no compila, y cómo la arreglarías sin
            usar any?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function primeroDelArray<T>(items: T) {
  return items[0]; // Error: Element implicitly has an 'any' type
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>T</code> no tiene ningún constraint, así que TypeScript
              no sabe que es indexable — podría ser un número, un booleano,
              cualquier cosa sin posición <code>[0]</code>.
            </p>
            <p className="mt-2">El fix es constreñir T a un array de algo:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function primeroDelArray<T>(items: T[]): T | undefined {
  return items[0]; // TS sabe que items es un array de T
}`}
            </pre>
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
            Combinar un genérico con <code>keyof</code> permite acceso
            type-safe a propiedades dinámicas:{" "}
            <code>{"function getProp<T, K extends keyof T>(obj: T, key: K): T[K]"}</code>
            . El compilador rechaza cualquier <code>key</code> que no
            exista en <code>T</code>, y el retorno es exactamente el tipo
            de esa propiedad, no <code>any</code>.
          </p>
          <p>
            Un <strong className="text-foreground">default type
            parameter</strong> (<code>{"<T = string>"}</code>) permite usar
            el genérico sin especificar el tipo cuando el caso más común
            ya está cubierto por el default, sin perder la posibilidad de
            sobreescribirlo. Útil en APIs donde la mayoría de los usos
            comparten un mismo tipo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Sobre-genericizar donde un union type simple bastaría.
            </strong>{" "}
            Un genérico agrega complejidad; si el conjunto de tipos
            posibles es finito y conocido, un union suele ser más claro.
          </li>
          <li>
            <strong className="text-foreground">
              No usar keyof y terminar con overloads manuales redundantes.
            </strong>{" "}
            Un getProp bien tipado con keyof reemplaza varias
            declaraciones repetidas de la misma función.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Una función getProp genérica para acceder a propiedades
            dinámicas de un objeto de configuración sin perder el tipo.
          </li>
          <li>
            Un componente de formulario con default type parameter para
            que el caso común (campos de texto) no requiera especificar
            el tipo en cada uso.
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
            Un <strong className="text-foreground">conditional type</strong>{" "}
            (<code>T extends U ? X : Y</code>) elige entre dos tipos según
            si T es asignable a U. Cuando T es un parámetro genérico
            &quot;naked&quot; y se le pasa un union, TypeScript{" "}
            <strong className="text-foreground">distribuye</strong>{" "}
            automáticamente la condición sobre cada miembro por separado —
            para evitar esto, hay que envolver ambos lados en tuplas:{" "}
            <code>[T] extends [U] ? X : Y</code>.
          </p>
          <p>
            <code>infer</code> declara una variable de tipo nueva dentro de
            la rama <code>extends</code>, que TypeScript infiere
            automáticamente al hacer match estructural — es la forma de
            &quot;extraer&quot; una parte de un tipo complejo sin
            descomponerlo manualmente (por ejemplo, el tipo de retorno de
            una función).
          </p>
          <p>
            Por type erasure, un genérico nunca puede usarse para
            decisiones en runtime: <code>T</code> no existe como valor en
            el JavaScript final. Para distinguir tipos en tiempo de
            ejecución hace falta información que sí sobreviva a la
            compilación: <code>typeof</code>/<code>instanceof</code> sobre
            el valor real, o un discriminante explícito en el objeto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No anticipar la distribución de un conditional type sobre un
              union.
            </strong>{" "}
            Puede dar un resultado inesperado si se asumía que la
            condición evaluaba contra el union completo de una vez.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar chequear un genérico en runtime (if (T === ...)).
            </strong>{" "}
            No compila y no tendría sentido — T no existe como valor,
            solo el valor concreto que se pasó.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Implementar utility types propios con conditional types e
            infer, como una versión simplificada de ReturnType o
            Parameters.
          </li>
          <li>
            Usar discriminated unions (una propiedad literal como{" "}
            <code>tipo: &apos;exito&apos; | &apos;error&apos;</code>) para
            distinguir variantes en runtime, ya que un genérico solo no
            alcanza para eso.
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
