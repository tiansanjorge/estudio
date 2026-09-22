import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaDiscriminatedUnions } from "@/lib/modules/discriminated-unions/entrevista";

const preguntasPorNivel = {
  1: entrevistaDiscriminatedUnions.filter((p) => p.nivel === 1),
  2: entrevistaDiscriminatedUnions.filter((p) => p.nivel === 2),
  3: entrevistaDiscriminatedUnions.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Discriminated unions & type narrowing — Dev Study Lab",
  description:
    "Cómo modelar estados que no pueden ser inválidos, usando una propiedad literal compartida para que TypeScript angoste el tipo automáticamente.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es el 'discriminante' en una discriminated union?",
    opciones: [
      "Cualquier propiedad opcional del tipo",
      "Una propiedad literal compartida por todas las variantes, con un valor distinto en cada una, que TypeScript usa para angostar el tipo",
      "El nombre del tipo en sí",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Dentro de un if que compara esa propiedad contra un valor literal, TypeScript sabe con certeza en qué variante estás y da acceso seguro a sus propiedades exclusivas.",
  },
  {
    pregunta:
      "¿Por qué una discriminated union es mejor que una interfaz con propiedades todas opcionales para representar distintos estados?",
    opciones: [
      "No hay diferencia real, es solo preferencia de estilo",
      "La interfaz con opcionales permite combinaciones imposibles (ej: datos y error presentes a la vez); la union no",
      "Las discriminated unions son más rápidas en runtime",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada variante de la union define exactamente qué campos existen juntos. El compilador impide construir un estado que mezcle campos de variantes distintas.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Para qué sirve asignar el valor en el default de un switch a una variable de tipo never?",
    opciones: [
      "Es solo una convención de estilo sin efecto real",
      "Hace que el compilador falle si en el futuro se agrega una variante nueva al union sin manejarla en el switch",
      "Mejora la performance del switch en runtime",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si todas las variantes fueron cubiertas, el valor restante es never y compila. Si alguien agrega una variante sin su case, deja de ser never y la asignación falla — un bug silencioso se vuelve error de build.",
  },
  {
    pregunta:
      "¿Cuándo necesitás un user-defined type guard (función con retorno 'v is Tipo') en vez de narrowing automático?",
    opciones: [
      "Siempre, para cualquier chequeo de tipo",
      "Cuando la lógica de discriminación es más elaborada que un simple typeof/instanceof/propiedad literal",
      "Nunca, TypeScript siempre puede inferir el narrowing solo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por ejemplo, validar la forma completa de un objeto que llegó sin tipos desde una API externa. La función declara explícitamente qué tipo verifica, y TypeScript confía en esa declaración fuera de la función.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué pasa si dos variantes de un union usan tipo: string en vez de tipo: 'a' y tipo: 'b'?",
    opciones: [
      "No cambia nada, TypeScript sigue angostando igual",
      "El narrowing basado en discriminante deja de funcionar, porque ambas variantes son compatibles entre sí a nivel de tipo",
      "TypeScript lanza un error de compilación al declarar el union",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El discriminante necesita ser un tipo literal para que TypeScript pueda distinguir las variantes. Con un tipo ancho (string) ambas variantes son indistinguibles para el narrowing.",
  },
  {
    pregunta:
      "¿Cómo extraerías solo la variante de error de un union Resultado sin reescribir su forma a mano?",
    opciones: [
      "Con Extract<Resultado, { tipo: 'error' }>, aprovechando que es un conditional type distributivo",
      "No es posible, hay que copiar la definición manualmente",
      "Con Omit<Resultado, 'exito'>",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Extract evalúa la condición de asignabilidad contra cada miembro del union por separado y se queda con los que matchean — funciona naturalmente con discriminated unions.",
  },
];

export default function DiscriminatedUnionsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="TypeScript avanzado"
      titulo="Discriminated unions & type narrowing"
      descripcion="Modelar estados que no pueden ser inválidos: una propiedad literal compartida entre variantes le permite al compilador angostar el tipo automáticamente, sin casts manuales."
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
            Una <strong className="text-foreground">discriminated
            union</strong> es un union type donde cada variante comparte
            una propiedad literal común (el{" "}
            <strong className="text-foreground">discriminante</strong>)
            con un valor distinto por variante — típicamente algo como{" "}
            <code>{"tipo: 'exito' | 'error'"}</code>. TypeScript usa esa
            propiedad para{" "}
            <strong className="text-foreground">angostar</strong> el tipo
            automáticamente: dentro de un{" "}
            <code>{"if (resultado.tipo === 'exito')"}</code>, sabe con certeza
            en qué variante estás y te da acceso seguro a sus propiedades
            exclusivas.
          </p>
          <p>
            Una interfaz con propiedades todas opcionales permite estados
            imposibles en la práctica: nada impide que dos campos
            mutuamente excluyentes estén ambos presentes, o ambos
            ausentes. Una discriminated union hace que esos estados
            inválidos ni siquiera puedan construirse — cada variante
            define exactamente qué campos existen juntos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Modelar estados con propiedades opcionales sueltas.
            </strong>{" "}
            Permite combinaciones imposibles que el compilador no puede
            detectar, a diferencia de una union bien discriminada.
          </li>
          <li>
            <strong className="text-foreground">
              Angostar accediendo a una propiedad antes de chequear el
              discriminante.
            </strong>{" "}
            TypeScript solo angosta después del chequeo explícito (if,
            switch), no antes.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Representar el estado de una petición async (idle/cargando/
            éxito/error) sin dejar huecos de estados imposibles.
          </li>
          <li>
            Modelar acciones de un reducer, cada una con su propio
            discriminante (<code>tipo</code>) y su propio payload.
          </li>
          <li>
            Parsear respuestas de una API que puede devolver distintas
            formas según un campo de estado explícito.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            ¿Qué estado imposible permite este tipo, y cómo lo
            arreglarías con una discriminated union?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`interface EstadoPeticion {
  cargando?: boolean;
  datos?: string[];
  error?: string;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Nada impide que <code>cargando: true</code>,{" "}
              <code>datos: [...]</code> y <code>error: &apos;algo&apos;</code>{" "}
              estén los tres presentes a la vez — un estado que no debería
              existir pero que el tipo permite construir.
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`type EstadoPeticion =
  | { estado: 'idle' }
  | { estado: 'cargando' }
  | { estado: 'exito'; datos: string[] }
  | { estado: 'error'; error: string };`}
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Un <strong className="text-foreground">exhaustiveness
            check</strong> asegura que el switch maneje TODAS las
            variantes: en la rama default, asignás el valor (ya angostado)
            a una variable de tipo <code>never</code>. Si todas las
            variantes fueron cubiertas, ese valor es efectivamente{" "}
            <code>never</code> ahí y compila. Si alguien agrega una
            variante nueva sin su case, deja de serlo y la compilación
            falla.
          </p>
          <p>
            Un{" "}
            <strong className="text-foreground">
              user-defined type guard
            </strong>{" "}
            (<code>function esX(v): v is X</code>) declara explícitamente
            qué tipo verifica, para casos donde la lógica de discriminación
            es más elaborada que un simple typeof/instanceof/propiedad
            literal — por ejemplo, validar la forma completa de datos sin
            tipos que llegaron de una API externa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              No usar exhaustiveness check en switches sobre unions que
              van a crecer.
            </strong>{" "}
            Sin él, agregar una variante nueva puede dejar una rama sin
            manejar sin que nadie se entere hasta que falle en producción.
          </li>
          <li>
            <strong className="text-foreground">
              Escribir un type guard que miente sobre lo que verifica.
            </strong>{" "}
            TypeScript confía ciegamente en la firma `v is X`; si la
            lógica interna no verifica realmente eso, el narrowing engaña.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Exhaustiveness check en el reducer de una máquina de estados,
            para que agregar un estado nuevo obligue a manejarlo en todos
            los switches relevantes.
          </li>
          <li>
            Un type guard esRespuestaValida(json: unknown) para validar
            datos de una API externa antes de tratarlos como tipados.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <code>Extract&lt;T, U&gt;</code> (un conditional type
            distributivo) permite quedarte con solo la variante cuyo
            discriminante coincide con un valor literal, sin reescribir
            esa variante a mano: evalúa la condición de asignabilidad
            contra cada miembro del union por separado y se queda con los
            que matchean.
          </p>
          <p>
            El discriminante en sí alcanza para distinguir variantes,
            incluso si el resto de las propiedades es idéntico. Lo que sí
            hay que cuidar es que sea un tipo{" "}
            <strong className="text-foreground">literal</strong> (
            <code>&apos;a&apos;</code>), no un tipo ancho (
            <code>string</code>): con un tipo ancho compartido entre
            variantes, el narrowing basado en discriminante deja de
            funcionar porque ambas son &quot;compatibles&quot; entre sí.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Tipar el discriminante como string en vez de un literal
              específico.
            </strong>{" "}
            Rompe el narrowing por completo, aunque el resto del union
            esté bien modelado.
          </li>
          <li>
            <strong className="text-foreground">
              Reescribir a mano el tipo de una variante puntual en vez de
              usar Extract.
            </strong>{" "}
            Pierde sincronización automática si la variante original
            cambia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Derivar el tipo de una acción específica de un reducer con
            Extract, para tipar un action creator sin duplicar la forma.
          </li>
          <li>
            Auditar un union grande verificando que cada discriminante sea
            realmente literal, no accidentalmente ensanchado por
            inferencia.
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
