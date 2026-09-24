import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUtilityTypes } from "@/lib/modules/utility-types/entrevista";

const preguntasPorNivel = {
  1: entrevistaUtilityTypes.filter((p) => p.nivel === 1),
  2: entrevistaUtilityTypes.filter((p) => p.nivel === 2),
  3: entrevistaUtilityTypes.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Utility types — Dev Study Lab",
  description:
    "Partial, Pick, Omit, Record y compañía: tipos genéricos que transforman otros tipos sin duplicarlos, manteniendo todo sincronizado con la fuente original.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace Partial<T>?",
    opciones: [
      "Hace opcionales las propiedades de T, incluidas las anidadas",
      "Hace opcionales todas las propiedades de T",
      "Toma solo algunas propiedades de T, las que le indiques",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Útil para representar actualizaciones parciales: un objeto que puede traer solo algunas de las propiedades del tipo original.",
  },
  {
    pregunta: "¿En qué se diferencian Pick<T, K> y Omit<T, K>?",
    opciones: [
      "Pick exige que K exista en T; Omit también, pero además las vuelve opcionales",
      "Pick copia las propiedades K; Omit las marca como never sin quitarlas",
      "Pick se queda solo con las K; Omit se queda con todas menos las K",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Pick construye un tipo quedándose únicamente con las claves indicadas. Omit hace lo inverso: todas las propiedades del tipo original excepto las indicadas.",
  },
  {
    pregunta: "¿Por qué conviene derivar un tipo con Pick/Omit en vez de copiarlo a mano?",
    opciones: [
      "Porque una copia manual se desincroniza si cambia el tipo original",
      "Porque los tipos derivados compilan más rápido que los escritos a mano",
      "Porque solo los tipos derivados se pueden exportar entre módulos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los utility types no existen en runtime — la ventaja es en compilación: si el tipo base cambia, el derivado lo refleja automáticamente y el compilador avisa donde haga falta ajustar código.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "type Nullable<T> = { [K in keyof T]: T[K] | null } — ¿qué mecanismo usa?",
    opciones: [
      "Un conditional type que distribuye null sobre cada propiedad",
      "Un mapped type, el mismo mecanismo que Partial y Readonly",
      "Un index signature que agrega null a cualquier clave nueva",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "keyof T obtiene la unión de claves de T, y [K in keyof T] itera sobre cada una. Los utility types built-in no tienen magia especial: son mapped types que TS ya trae escritos.",
  },
  {
    pregunta: "Readonly<Config> donde Config tiene una propiedad anidada objeto — ¿protege esa propiedad anidada?",
    opciones: [
      "Sí: Readonly se aplica recursivamente a todos los niveles del objeto",
      "Sí, pero solo en compilación; en runtime el objeto sigue siendo mutable",
      "No: protege el primer nivel, y el objeto anidado sigue siendo mutable",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "TypeScript no incluye un DeepReadonly nativo. Para inmutabilidad real en todos los niveles hay que escribir un mapped type recursivo propio o usar una librería.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué permite la cláusula 'as' dentro de un mapped type (key remapping)?",
    opciones: [
      "Renombrar cada clave al mapear, incluso con template literal types",
      "Castear el valor de cada propiedad a otro tipo durante el mapeo",
      "Filtrar solo las claves opcionales del tipo original",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Combinado con template literal types permite generar, por ejemplo, un getter por cada propiedad con un nombre derivado (getNombre, getEdad). Mapear una clave a never la excluye del resultado.",
  },
  {
    pregunta:
      "NonNullable<string | null | undefined> da como resultado 'string'. ¿Por qué funciona así con un union?",
    opciones: [
      "Porque TypeScript elimina null y undefined de cualquier union al compilar",
      "Porque distribuye la condición por cada miembro, y null y undefined dan never",
      "Porque NonNullable toma solo el primer miembro de la union",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "NonNullable<T> se define como 'T extends null | undefined ? never : T'. Al ser T un parámetro genérico naked, la distribución sobre el union ocurre automáticamente.",
  },
];

export default function UtilityTypesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="TypeScript avanzado"
      titulo="Utility types"
      descripcion="Partial, Pick, Omit, Record y compañía: tipos genéricos ya escritos que transforman otros tipos, manteniendo todo sincronizado con la fuente original en vez de duplicar definiciones a mano."
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
            Los <strong className="text-foreground">utility types</strong>{" "}
            son tipos genéricos incluidos en TypeScript que transforman
            otro tipo sin tener que escribirlo de nuevo a mano.{" "}
            <code>Partial&lt;T&gt;</code> hace que todas las propiedades de{" "}
            <code>T</code> sean opcionales.{" "}
            <code>Pick&lt;T, K&gt;</code> construye un tipo nuevo quedándose
            solo con las propiedades <code>K</code>.{" "}
            <code>Omit&lt;T, K&gt;</code> hace lo inverso: todas las
            propiedades excepto las <code>K</code>.
          </p>
          <p>
            <code>Record&lt;K, V&gt;</code> construye un tipo objeto con
            claves del tipo <code>K</code> y valores del tipo{" "}
            <code>V</code> — útil para mapas tipados donde las claves son
            un conjunto conocido.
          </p>
          <p>
            Todos derivan un tipo nuevo a partir de uno existente: si el
            tipo original cambia, el derivado se actualiza solo, sin
            necesidad de tocar nada más.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Duplicar una interfaz a mano en vez de derivarla.
            </strong>{" "}
            Crea una segunda fuente de verdad que puede desincronizarse
            silenciosamente cuando el tipo original cambia.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir Partial (todas opcionales) con Required (todas
              obligatorias).
            </strong>{" "}
            Required elimina el undefined implícito de las propiedades
            opcionales, en vez de agregarlo.
          </li>
          <li>
            <strong className="text-foreground">
              Usar Record&lt;string, T&gt; cuando las claves son un
              conjunto finito conocido.
            </strong>{" "}
            Record&lt;&apos;a&apos; | &apos;b&apos;, T&gt; da mucha más
            seguridad de tipos que un string genérico.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un tipo de errores de formulario como{" "}
            <code>Partial&lt;Record&lt;keyof FormValues, string&gt;&gt;</code>
            , para representar que solo algunos campos pueden tener error.
          </li>
          <li>
            Props de un componente derivadas con Omit de un modelo
            completo, quitando campos que no aplican a la UI (por ejemplo,
            passwordHash).
          </li>
          <li>
            <code>Record&lt;Ruta, Componente&gt;</code> para mapear rutas
            a componentes de forma tipada, sin claves sueltas sin
            verificar.
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
            ¿Cómo derivarías el tipo de props de este componente a partir
            de Usuario, sin repetir los campos a mano?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`interface Usuario {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
}

// PropsTarjetaUsuario debería tener nombre y email, sin id ni passwordHash`}
          </pre>
          <RevelarSolucion>
            <p>Combinando Pick para quedarse solo con lo necesario:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`type PropsTarjetaUsuario = Pick<Usuario, 'nombre' | 'email'>;`}
            </pre>
            <p className="mt-2">
              También funcionaría con{" "}
              <code>Omit&lt;Usuario, &apos;id&apos; | &apos;passwordHash&apos;&gt;</code>
              , pero Pick es más explícito acá: dice exactamente qué se
              expone, en vez de listar qué se excluye — más seguro si a
              Usuario se le agregan campos sensibles en el futuro.
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
            Un utility type propio se escribe con un{" "}
            <strong className="text-foreground">mapped type</strong>:{" "}
            <code>{"type Nullable<T> = { [K in keyof T]: T[K] | null }"}</code>
            . Es exactamente el mismo mecanismo que usan Partial o Readonly
            por debajo — no hay magia especial, son mapped types que
            TypeScript ya trae escritos.
          </p>
          <p>
            <code>Readonly&lt;T&gt;</code> solo protege el{" "}
            <strong className="text-foreground">primer nivel</strong>: si
            una propiedad es a su vez un objeto, ese objeto interno sigue
            siendo mutable. TypeScript no incluye un DeepReadonly nativo.
          </p>
          <p>
            <code>Extract&lt;T, U&gt;</code> y <code>Exclude&lt;T, U&gt;</code>{" "}
            filtran miembros de un union: Extract se queda con los
            asignables a U, Exclude descarta esos. Igual que Pick/Omit,
            derivarlos mantiene sincronización automática con el union
            original.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Reinventar un mapped type que ya existe como built-in.
            </strong>{" "}
            Si Partial/Pick/Omit ya cubren la necesidad, escribir uno
            propio solo agrega código a mantener sin beneficio real.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que Readonly es profundo.
            </strong>{" "}
            Solo protege las propiedades directas del tipo, no las
            anidadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un DeepPartial propio para actualizaciones anidadas de un
            objeto de configuración complejo.
          </li>
          <li>
            Extract/Exclude para derivar subconjuntos de un union de
            acciones de un reducer (por ejemplo, separar las de éxito de
            las de error).
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
            El <strong className="text-foreground">key remapping</strong>{" "}
            (cláusula <code>as</code>, TS 4.1+) permite transformar el
            NOMBRE de cada clave al mapear, no solo su tipo. Combinado con
            template literal types, se pueden generar claves nuevas
            derivadas de las originales (por ejemplo, un getter por cada
            propiedad). Mapear una clave a <code>never</code> la excluye
            por completo del resultado.
          </p>
          <p>
            <code>NonNullable&lt;T&gt;</code> se implementa como un
            conditional type distributivo:{" "}
            <code>T extends null | undefined ? never : T</code>. Al ser T
            un parámetro genérico &quot;naked&quot;, la condición se
            distribuye automáticamente sobre cada miembro cuando se le
            pasa un union.
          </p>
          <p>
            <code>{"ReturnType<typeof fn>"}</code> deriva el tipo de
            retorno de una función existente sin escribirlo a mano — el
            cuidado es que el tipo derivado cambia automáticamente si la
            función cambia, lo cual puede ser sorpresivo si en algún punto
            de uso lejano se esperaba implícitamente la forma anterior.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No anticipar que ReturnType se actualiza solo.
            </strong>{" "}
            Un cambio en la función origen puede romper compilación en un
            punto de uso lejano, sin contexto claro de qué lo causó.
          </li>
          <li>
            <strong className="text-foreground">
              Sobrecomplicar con key remapping cuando un tipo simple
              alcanza.
            </strong>{" "}
            Es potente pero menos legible; usarlo solo cuando el patrón de
            transformación de nombres realmente lo justifica.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Generar un tipo de handlers de eventos (
            <code>onClick</code>, <code>onHover</code>) a partir de un
            union de nombres de eventos, con key remapping y template
            literal types.
          </li>
          <li>
            Tipar el valor de retorno de un hook custom con ReturnType en
            vez de escribirlo dos veces (en el hook y en quien lo consume).
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
