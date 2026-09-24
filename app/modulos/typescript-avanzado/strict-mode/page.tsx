import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaStrictMode } from "@/lib/modules/strict-mode/entrevista";

const preguntasPorNivel = {
  1: entrevistaStrictMode.filter((p) => p.nivel === 1),
  2: entrevistaStrictMode.filter((p) => p.nivel === 2),
  3: entrevistaStrictMode.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Trade-offs de strict mode — Dev Study Lab",
  description:
    "strict: true no es un solo chequeo, sino un paraguas de flags independientes. Entender cada uno permite decidir con criterio qué activar y cuándo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es realmente `strict: true` en tsconfig.json?",
    opciones: [
      "Un modo que activa 'use strict' de JavaScript en todos los archivos emitidos",
      "Un paraguas que activa varios flags a la vez, como strictNullChecks y noImplicitAny",
      "Un flag que hace que cualquier warning del compilador pase a ser error",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada flag endurece una verificación puntual distinta. Activarlos todos juntos desde el día uno de un proyecto nuevo es mucho más simple que agregarlos de a uno sobre una base grande.",
  },
  {
    pregunta: "Sin strictNullChecks, ¿qué pasa si le pasás null a una función que espera un string?",
    opciones: [
      "Error de compilación: null no es asignable a string",
      "Compila, y TypeScript agrega un chequeo de null en runtime",
      "Compila sin avisar, y el error aparece recién en runtime",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Sin strictNullChecks, null y undefined son asignables a cualquier tipo. El clásico error de runtime 'Cannot read property of undefined' se descubre recién ahí, no en compilación.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuál es la estrategia recomendada para migrar strict mode en un proyecto legacy grande?",
    opciones: [
      "De a un flag por vez, empezando por noImplicitAny y excluyendo lo legacy",
      "Activar strict completo y silenciar cada error con // @ts-ignore",
      "Reescribir primero los módulos legacy en JavaScript y después activarlo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Activar todo de golpe en un codebase grande puede generar cientos o miles de errores simultáneos. Migrar gradualmente permite que el resto del equipo no quede bloqueado mientras se resuelve.",
  },
  {
    pregunta:
      "¿Por qué noUncheckedIndexedAccess no está incluido dentro de strict?",
    opciones: [
      "Porque todavía es experimental y puede cambiar de comportamiento",
      "Porque es muy ruidoso: agrega undefined a cada acceso por índice",
      "Porque solo aplica a arrays y strict agrupa flags de objetos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin el flag, arr[i] asume que el elemento siempre existe aunque el índice esté fuera de rango. Muchos equipos no consideran que valga la pena forzar ese chequeo en todo el código.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué strictPropertyInitialization depende de que strictNullChecks esté activo?",
    opciones: [
      "Porque los dos flags se agregaron en la misma versión de TypeScript",
      "Porque sin él, los constructores no pueden inicializar propiedades",
      "Porque sin él no se distingue 'declarado' de 'todavía sin asignar'",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "strictPropertyInitialization exige que toda propiedad no opcional esté inicializada en todos los paths del constructor. Sin strictNullChecks, no habría nada concreto que verificar ahí.",
  },
  {
    pregunta:
      "¿Qué significa que un sistema de tipos sea 'sound', y por qué TypeScript acepta ser unsound en ciertos puntos?",
    opciones: [
      "Sound: si compila, no falla por tipos en runtime; TS lo resigna en puntos para ser ergonómico",
      "Sound: detecta todos los bugs lógicos; TS lo resigna porque analizar lógica es muy lento",
      "Sound: cada tipo existe en runtime; TS lo resigna porque borra los tipos al compilar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La bivarianza de métodos, any como escape hatch, o el indexado sin chequeo son unsoundness deliberado: TypeScript prioriza dar la mayor seguridad posible sin forzar reescrituras poco naturales de JavaScript existente.",
  },
];

export default function StrictModePage() {
  return (
    <ModuloLayout
      categoriaTitulo="TypeScript avanzado"
      titulo="Trade-offs de strict mode"
      descripcion="strict: true no es un interruptor único: es un paraguas de flags independientes, cada uno con su propio costo y beneficio. Entenderlos permite decidir con criterio, no solo prenderlos todos a ciegas."
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
            <code>strict: true</code> no es un chequeo único, sino un
            paraguas que activa un conjunto de flags independientes a la
            vez: <code>strictNullChecks</code>, <code>noImplicitAny</code>,{" "}
            <code>strictFunctionTypes</code>,{" "}
            <code>strictPropertyInitialization</code>,{" "}
            <code>noImplicitThis</code>, entre otros. Cada uno endurece una
            verificación puntual del compilador.
          </p>
          <p>
            <code>strictNullChecks</code> es probablemente el más
            impactante en el día a día: sin él, <code>null</code> y{" "}
            <code>undefined</code> son asignables a cualquier tipo, así
            que el compilador nunca avisa si una variable que asumís
            siempre presente en realidad puede no estarlo. Con él activo,
            hay que manejar el caso ausente en el mismo lugar donde el
            compilador lo detecta, antes de que llegue a producción.
          </p>
          <p>
            Activar <code>strict: true</code> desde el día uno de un
            proyecto nuevo tiene un costo casi nulo. Agregarlo más tarde
            sobre una base grande de código sin tipos estrictos es una
            historia distinta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Desactivar strict por completo para &quot;avanzar más
              rápido&quot;.
            </strong>{" "}
            Cambia bugs de compilación por bugs de runtime, descubiertos
            más tarde y más caros de rastrear.
          </li>
          <li>
            <strong className="text-foreground">
              No saber qué flag puntual está causando un error.
            </strong>{" "}
            Cada flag de strict es independiente; entender cuál activa
            cada verificación ayuda a decidir si desactivarlo puntualmente
            tiene sentido o es tapar el síntoma.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Activar strict: true desde el primer commit en cualquier
            proyecto nuevo, sin excepciones.
          </li>
          <li>
            Usar strictNullChecks para forzar manejo explícito de
            respuestas de API que pueden no traer ciertos campos.
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
            ¿Por qué esta función es un riesgo real sin strictNullChecks,
            aunque compile perfecto?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function obtenerUsuario(id: string): Usuario {
  return usuarios.find((u) => u.id === id); // .find puede devolver undefined
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>Array.prototype.find</code> devuelve{" "}
              <code>T | undefined</code>: si ningún elemento coincide,
              devuelve <code>undefined</code>. Sin strictNullChecks, TS no
              se queja de que la función declara devolver{" "}
              <code>Usuario</code> pero en la práctica puede devolver{" "}
              <code>undefined</code> — el error explota recién cuando
              alguien intenta usar una propiedad de un usuario inexistente.
            </p>
            <p className="mt-2">
              Con strictNullChecks, TypeScript marca el error en la
              declaración misma de la función, obligando a decidir qué
              hacer con el caso &quot;no encontrado&quot; ahí mismo.
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
            En un proyecto legacy grande, el beneficio de activar strict es
            real: destapa bugs latentes (nulls no manejados, anys
            implícitos) antes de que sigan causando fallas. El costo es
            que puede generar cientos o miles de errores de golpe. La
            estrategia recomendada es migrar{" "}
            <strong className="text-foreground">
              de a un flag por vez
            </strong>{" "}
            (empezando por <code>noImplicitAny</code>, después{" "}
            <code>strictNullChecks</code>), excluyendo temporalmente
            archivos legacy pendientes sin bloquear al resto del equipo.
          </p>
          <p>
            <code>noUncheckedIndexedAccess</code> no forma parte de{" "}
            <code>strict</code> a pesar de ser útil: hace que acceder a un
            array o Record por índice devuelva{" "}
            <code>T | undefined</code> en vez de asumir que el elemento
            siempre existe. Queda fuera de strict porque es
            particularmente ruidoso en código que indexa mucho.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Intentar migrar todo strict de golpe en un proyecto grande.
            </strong>{" "}
            Puede bloquear al equipo entero con cientos de errores
            simultáneos sin un plan de priorización.
          </li>
          <li>
            <strong className="text-foreground">
              No activar noUncheckedIndexedAccess creyendo que strict ya
              cubre ese caso.
            </strong>{" "}
            Es un flag aparte, deliberadamente excluido de strict.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Excluir explícitamente carpetas legacy en tsconfig.json
            mientras se migra gradualmente el resto del código a strict.
          </li>
          <li>
            Activar noUncheckedIndexedAccess en módulos que acceden mucho
            a diccionarios o arrays por índice con datos externos.
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
            <code>strictPropertyInitialization</code> exige que toda
            propiedad no opcional de una clase esté inicializada en todos
            los paths posibles del constructor. Depende de{" "}
            <code>strictNullChecks</code> porque, sin este último, el
            sistema de tipos no distingue &quot;declarado&quot; de
            &quot;declarado, pero podría no estar asignado todavía&quot;.
          </p>
          <p>
            El operador <code>!</code> (definite assignment assertion)
            desactiva esa verificación para un campo puntual — legítimo
            cuando la inicialización ocurre por un mecanismo externo que
            TypeScript no puede rastrear (un framework como Angular
            asignando después del constructor), un code smell cuando solo
            se usa para silenciar el error sin garantizar realmente esa
            asignación.
          </p>
          <p>
            TypeScript es deliberadamente{" "}
            <strong className="text-foreground">unsound</strong> en varios
            puntos (bivarianza de métodos, <code>any</code>,{" "}
            <code>as</code>, indexado sin chequeo) porque un sistema 100%
            &quot;sound&quot; como Haskell o Rust haría que escribir
            JavaScript con tipos gradualmente fuera mucho más rígido — la
            filosofía es dar la mayor seguridad posible sin romper la
            ergonomía de JavaScript existente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar `!` como forma automática de silenciar errores de
              strictPropertyInitialization.
            </strong>{" "}
            Si nada garantiza realmente la asignación, el bug que el flag
            buscaba prevenir sigue latente, solo que sin aviso.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir que TypeScript compile con que el programa sea
              type-safe en runtime.
            </strong>{" "}
            Los puntos de unsoundness conocidos (any, as, bivarianza)
            siguen siendo responsabilidad del desarrollador.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar `!` de forma legítima en propiedades inicializadas por
            decorators de un framework (Angular, NestJS con inyección de
            dependencias).
          </li>
          <li>
            Auditar el uso de `any` y `as` en un codebase como puntos
            conocidos de unsoundness que ameritan revisión de código más
            estricta.
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
