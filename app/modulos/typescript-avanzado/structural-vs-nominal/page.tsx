import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaStructuralVsNominal } from "@/lib/modules/structural-vs-nominal/entrevista";

const preguntasPorNivel = {
  1: entrevistaStructuralVsNominal.filter((p) => p.nivel === 1),
  2: entrevistaStructuralVsNominal.filter((p) => p.nivel === 2),
  3: entrevistaStructuralVsNominal.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Structural typing vs nominal — Dev Study Lab",
  description:
    "TypeScript compara tipos por su forma, no por su nombre. Entender esto explica por qué dos interfaces sin relación son intercambiables, y cuándo eso es un problema.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué determina si dos tipos son compatibles en TypeScript?",
    opciones: [
      "Que tengan exactamente el mismo nombre",
      "Que tengan la misma forma (las mismas propiedades con los mismos tipos), sin importar el nombre",
      "Que uno declare explícitamente heredar del otro",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es structural typing: dos interfaces con propiedades idénticas son intercambiables aunque nunca se hayan relacionado explícitamente, a diferencia de sistemas nominales como Java.",
  },
  {
    pregunta: "Una función espera { nombre: string }. ¿Podés pasarle un objeto con más propiedades de las que pide?",
    opciones: [
      "No, nunca",
      "Sí, alcanza con que tenga (al menos) las propiedades requeridas",
      "Solo si esas propiedades extra son opcionales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El structural typing permite que cualquier objeto que 'calce' con la forma esperada sirva, sin necesidad de declarar explícitamente ser de ese tipo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué usar({ nombre: 'app', extra: true }) da error pero usar(variableConEsaMismaForma) no?",
    opciones: [
      "Es un bug de TypeScript",
      "El excess property check solo se aplica a object literals directos, no a variables",
      "Las variables siempre tienen prioridad sobre los literales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "TypeScript asume que un literal con una propiedad de más es casi seguro un error de tipeo. Con una variable, no aplica esa verificación extra.",
  },
  {
    pregunta:
      "¿Cómo simularías nominal typing para que un UserId y un ProductId (ambos strings) no sean intercambiables?",
    opciones: [
      "No es posible en TypeScript",
      "Con branded types: agregar una propiedad de marca imposible de tener en la práctica, como { __brand: 'UserId' }",
      "Usando enum en vez de string",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Como esa propiedad no existe en un string común, no se puede pasar un string plano donde se espera el tipo marcado sin pasar por una función de construcción explícita.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué es la bivarianza de parámetros de método en TypeScript?",
    opciones: [
      "Un error del compilador que se va a corregir en el futuro",
      "Una decisión de diseño deliberada: los métodos aceptan tanto covarianza como contravarianza en sus parámetros, priorizando patrones comunes de POO sobre el rigor estricto",
      "Solo aplica a funciones async",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Permite que jerarquías de clases sobreescriban métodos con parámetros más específicos sin fricción, aunque técnicamente sea 'unsound'. Con strictFunctionTypes, esto NO aplica a funciones asignadas como propiedades.",
  },
  {
    pregunta:
      "Dos clases con un campo private del mismo nombre y tipo, declaradas por separado — ¿son estructuralmente compatibles?",
    opciones: [
      "Sí, siempre, porque TypeScript es 100% estructural",
      "No: los miembros private/protected solo son compatibles si vienen de la misma declaración (herencia), no por coincidencia de nombre",
      "Solo si ambas clases están en el mismo archivo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es una de las pocas excepciones nominales en TypeScript, deliberada para no romper la encapsulación que private busca garantizar.",
  },
];

export default function StructuralVsNominalPage() {
  return (
    <ModuloLayout
      categoriaTitulo="TypeScript avanzado"
      titulo="Structural typing vs nominal"
      descripcion="TypeScript compara tipos por su forma, no por su nombre. Esa decisión de diseño explica gran parte de cómo se siente escribir TypeScript, para bien y para mal."
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
            En un sistema{" "}
            <strong className="text-foreground">nominal</strong> (como
            Java o C#), dos tipos son compatibles solo si uno declara
            explícitamente implementar o extender al otro — el nombre del
            tipo importa. En un sistema{" "}
            <strong className="text-foreground">estructural</strong>, como
            el de TypeScript, dos tipos son compatibles si tienen la misma
            forma, sin importar cómo se llamen ni si se relacionaron
            explícitamente alguna vez.
          </p>
          <p>
            Esto implica que, al pasar un objeto a una función, no hace
            falta que declare explícitamente &quot;ser&quot; de un tipo
            específico — alcanza con que tenga, al menos, las propiedades
            requeridas. Es una de las razones por las que TypeScript se
            lleva bien con JSON y datos externos sin tipos propios.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Esperar que TypeScript rechace un objeto por no declarar
              explícitamente un tipo.
            </strong>{" "}
            Si la forma calza, es compatible, venga de donde venga.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que dos interfaces con el mismo nombre en archivos
              distintos son automáticamente el mismo tipo.
            </strong>{" "}
            Lo que importa es la forma, no el nombre — pueden coincidir en
            nombre y ser completamente distintas si sus formas difieren.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Escribir funciones que aceptan una interfaz mínima, permitiendo
            que cualquier objeto compatible la use sin conversión.
          </li>
          <li>
            Aprovechar la compatibilidad estructural para mockear
            dependencias en tests, pasando un objeto plano donde se espera
            una clase con esa misma forma pública.
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
          <p>¿Por qué esta llamada compila sin ningún cast ni conversión?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`interface Serializable { toJSON(): string; }

class Fecha {
  toJSON() { return new Date().toISOString(); }
}

function guardar(s: Serializable) { /* ... */ }

guardar(new Fecha()); // Fecha nunca declaró "implements Serializable"`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>Fecha</code> nunca declaró explícitamente implementar{" "}
              <code>Serializable</code>, pero no hace falta: TypeScript
              compara estructuralmente. Como <code>Fecha</code> tiene un
              método <code>toJSON(): string</code>, su forma calza
              exactamente con lo que <code>Serializable</code> exige.
            </p>
            <p className="mt-2">
              En un lenguaje nominal como Java, esto sería un error de
              compilación hasta declarar explícitamente{" "}
              <code>implements Serializable</code>.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            El{" "}
            <strong className="text-foreground">
              excess property check
            </strong>{" "}
            aplica SOLO cuando pasás un object literal directamente (no
            una variable) a algo que espera una forma conocida: una
            propiedad de más en el literal es error, aunque
            estructuralmente &quot;sobrar&quot; una propiedad no debería
            romper la compatibilidad normal. Es una excepción deliberada
            para atrapar typos, priorizando ergonomía sobre pureza
            estructural.
          </p>
          <p>
            Cuando de verdad necesitás que dos tipos con la misma forma NO
            sean intercambiables (por ejemplo, un{" "}
            <code>UserId</code> y un <code>ProductId</code>, ambos
            strings), se simula nominal typing con{" "}
            <strong className="text-foreground">branded types</strong>: una
            propiedad de marca imposible de tener en la práctica,{" "}
            <code>{"type UserId = string & { __brand: 'UserId' }"}</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Confundirse por qué un literal falla pero la misma forma en
              una variable no.
            </strong>{" "}
            El excess property check solo mira literales directos, no el
            tipo inferido de una variable.
          </li>
          <li>
            <strong className="text-foreground">
              Usar el mismo tipo string para IDs de dominios distintos.
            </strong>{" "}
            Sin branded types, nada impide pasar un ProductId donde se
            espera un UserId — ambos son &quot;solo un string&quot;.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Branded types para IDs de distintas entidades en un dominio
            con muchas relaciones (UserId, OrderId, ProductId), evitando
            mezclarlos por accidente.
          </li>
          <li>
            Aprovechar el excess property check como red de seguridad al
            construir objetos de configuración a mano, detectando typos
            de nombres de propiedad.
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
            TypeScript trata los parámetros de{" "}
            <strong className="text-foreground">métodos</strong> (no
            funciones sueltas asignadas a variables) como{" "}
            <strong className="text-foreground">bivariantes</strong>:
            acepta tanto covarianza como contravarianza, lo cual es
            técnicamente &quot;unsound&quot; pero permite que jerarquías
            de clases comunes en POO compilen sin fricción. Con{" "}
            <code>strictFunctionTypes</code>, esto no aplica a funciones
            asignadas como propiedades — ahí sí se exige contravarianza
            estricta.
          </p>
          <p>
            Los miembros <code>private</code>/<code>protected</code> son
            una de las pocas excepciones nominales: dos clases con un
            campo privado del mismo nombre y tipo, declarado por separado,
            NO son compatibles entre sí. Solo lo son si ese miembro viene
            literalmente de la misma declaración (por herencia) —
            protegiendo la intención de encapsulación de{" "}
            <code>private</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Confiar en la bivarianza de métodos para patrones que
              deberían ser type-safe en runtime.
            </strong>{" "}
            Compila, pero puede fallar en runtime si el objeto real recibe
            un evento distinto al que su método sobreescrito espera.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que dos clases con miembros private iguales son
              intercambiables.
            </strong>{" "}
            No lo son, salvo que compartan la misma declaración por
            herencia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Activar strictFunctionTypes (parte de strict) para que
            callbacks asignados como propiedades reciban verificación
            estricta de contravarianza.
          </li>
          <li>
            Usar clases con miembros private para lograr encapsulación
            real que ni siquiera la compatibilidad estructural pueda
            eludir accidentalmente.
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
