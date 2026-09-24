import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { StateSimulador } from "@/components/modulo/StateSimulador";
import { ContadorBatching } from "@/components/modulo/ContadorBatching";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosState } from "@/lib/modules/react-core/state-escenarios";
import { entrevistaState } from "@/lib/modules/react-core/state-entrevista";

const preguntasPorNivel = {
  1: entrevistaState.filter((p) => p.nivel === 1),
  2: entrevistaState.filter((p) => p.nivel === 2),
  3: entrevistaState.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "State — Dev Study Lab",
  description:
    "El estado que actualizás con setState no cambia en el momento — programa un re-render. Esa asincronía explica casi todos los bugs de contadores en React.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "Justo después de llamar a setCuenta(cuenta + 1), ¿qué valor tiene la variable 'cuenta' en ESA misma ejecución de la función?",
    opciones: [
      "El valor nuevo, ya actualizado",
      "El valor viejo: sigue siendo el de la closure de este render",
      "undefined",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "setState no muta nada de forma síncrona. Programa un re-render; la variable local de esta ejecución sigue apuntando al valor que tenía cuando arrancó este render.",
  },
  {
    pregunta:
      "¿Por qué llamar tres veces a setCuenta(cuenta + 1) seguidas no suma 3, sino 1?",
    opciones: [
      "Porque React ignora llamadas repetidas",
      "Porque las tres usan el mismo valor de 'cuenta' capturado en la closure, así que las tres calculan lo mismo",
      "Porque hay un límite de un setState por evento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las tres llamadas leen la misma variable 'cuenta' (no cambia durante la ejecución), así que las tres terminan pidiendo 'poné el estado en cuenta + 1' con el mismo valor.",
  },
  {
    pregunta: "¿Cuál es la forma correcta de acumular varias actualizaciones basadas en el valor anterior?",
    opciones: [
      "setCuenta(cuenta + 1) repetido",
      "setCuenta((c) => c + 1), pasando una función que recibe el valor más reciente",
      "Llamar a setCuenta dentro de un setTimeout",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La función updater recibe el valor pendiente más actualizado en el momento en que React la procesa, no el valor capturado en la closure del render.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "En React 18, ¿qué pasa si llamás a dos setState dentro de un setTimeout?",
    opciones: [
      "Cada uno dispara su propio render por separado, igual que en React 17",
      "Se agrupan automáticamente en un solo render (automatic batching), igual que dentro de un onClick",
      "React ignora el segundo setState",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Antes de React 18, el batching solo ocurría dentro de handlers de eventos de React. Desde React 18, también aplica dentro de setTimeout, promesas y handlers nativos del DOM.",
  },
  {
    pregunta:
      "¿Por qué sincronizar estado derivado con un useEffect es casi siempre un antipatrón?",
    opciones: [
      "Porque useEffect no puede actualizar estado",
      "Porque cuesta un render extra (el efecto corre después del render) y puede desincronizarse temporalmente; calcularlo directo durante el render es más simple",
      "Porque useEffect solo funciona con props, no con estado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si un valor se puede calcular a partir de props o de otro estado existente, hacerlo directo en el render (o con useMemo si es costoso) evita el render extra y elimina el riesgo de desincronización.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "setN(5) cuando el estado n ya vale 5 — ¿React re-renderiza el componente?",
    opciones: [
      "Sí, siempre re-renderiza al llamar al setter",
      "No: React usa Object.is para comparar, y si el valor primitivo es igual al actual, evita el re-render",
      "Solo si el componente está envuelto en React.memo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Esto aplica a valores primitivos comparados por valor. Con objetos/arrays, Object.is compara por referencia: un objeto nuevo con el mismo contenido sí dispara re-render.",
  },
  {
    pregunta:
      "¿Cuándo conviene useReducer en vez de varios useState sueltos?",
    opciones: [
      "Siempre, useReducer es preferible en todos los casos",
      "Cuando hay varias piezas de estado relacionadas que cambian juntas según distintas acciones — centraliza la lógica de transición en una función testeable aparte",
      "Solo en componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con useState disperso, la lógica de mantener sincronizadas varias piezas de estado relacionadas queda repartida en handlers, más fácil de romper al agregar una acción nueva.",
  },
];

export default function StatePage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="State"
      descripcion="Llamar al setter de useState no cambia una variable al instante: programa un re-render. Esa diferencia explica casi todos los bugs de 'el contador no suma lo que debería'."
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
            <code>useState</code> le da a un componente una variable que
            persiste entre renders, y una función para pedirle a React
            que la actualice. Cada render de un componente tiene su
            propia <strong className="text-foreground">closure</strong>{" "}
            con el valor de ese estado congelado en el momento en que
            corrió ese render — por eso a esa variable se la conoce como
            &ldquo;stale&rdquo; (vieja) una vez que pasó el tiempo.
          </p>
          <p>
            Llamar al setter (<code>setCuenta(...)</code>) no muta esa
            variable local ni fuerza un re-render inmediato: solo le dice
            a React &ldquo;el próximo render debería usar este valor&rdquo;.
            El resto del código que sigue ejecutándose en esa misma
            función todavía ve el valor viejo.
          </p>
          <p>
            Cuando necesitás calcular el nuevo estado a partir del{" "}
            <em>anterior</em> — sobre todo si vas a llamar al setter más
            de una vez seguida — hay que usar la forma funcional:{" "}
            <code>setCuenta((c) =&gt; c + 1)</code>. Esa función recibe
            el valor pendiente más reciente, no el de la closure, así
            que las actualizaciones se acumulan correctamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <StateSimulador escenarios={escenariosState} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Mismo botón, dos formas de sumar 3. Comprobalo con estado real
          de React, no una simulación.
        </p>
        <ContadorBatching />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Leer el estado inmediatamente después de actualizarlo, esperando el valor nuevo.
            </strong>{" "}
            La actualización es asincrónica respecto al resto de la
            función — el valor nuevo recién existe en el próximo render.
          </li>
          <li>
            <strong className="text-foreground">
              Encadenar setState(valor + 1) varias veces esperando que se sumen.
            </strong>{" "}
            Todas parten del mismo valor stale. Usar la forma funcional
            cuando dependés del valor anterior.
          </li>
          <li>
            <strong className="text-foreground">
              Mutar el estado directamente (ej: array.push()) en vez de crear uno nuevo.
            </strong>{" "}
            React compara referencias para decidir si re-renderizar; mutar
            el mismo objeto no dispara nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Contadores, toggles, formularios — cualquier dato que cambia
            por interacción del usuario y necesita disparar un re-render.
          </li>
          <li>
            Usar la forma funcional del setter en handlers que pueden
            dispararse varias veces rápido (doble click, teclas
            repetidas) para no perder actualizaciones.
          </li>
          <li>
            Derivar estado calculado en el render en vez de duplicarlo en
            otro useState — menos estado sincronizado, menos bugs.
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
            Este botón de &ldquo;me gusta&rdquo; a veces no suma cuando se
            clickea rápido varias veces seguidas. ¿Por qué, y cómo lo
            arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function BotonMeGusta() {
  const [likes, setLikes] = useState(0);

  function manejarDobleClick() {
    setLikes(likes + 1);
    setLikes(likes + 1);
  }

  return <button onDoubleClick={manejarDobleClick}>{likes} likes</button>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Al hacer doble click, se espera sumar 2, pero solo suma 1.
              Las dos llamadas a <code>setLikes(likes + 1)</code> usan el
              mismo <code>likes</code> capturado en esta ejecución del
              handler — las dos calculan exactamente el mismo valor.
            </p>
            <p className="mt-2">El fix es usar la forma funcional, para que cada llamada parta del valor pendiente más reciente:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function manejarDobleClick() {
  setLikes((valorActual) => valorActual + 1);
  setLikes((valorActual) => valorActual + 1);
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
            <strong className="text-foreground">Automatic batching</strong>{" "}
            significa que React agrupa varias llamadas a setState del
            mismo tick en un único re-render. Antes de React 18, esto solo
            pasaba dentro de handlers de eventos de React; dentro de un{" "}
            <code>setTimeout</code>, una promesa resuelta, o un handler
            nativo del DOM, cada setState disparaba su propio render.
            Desde React 18, el batching es automático en todos esos
            contextos también.
          </p>
          <p>
            Guardar estado derivado en un <code>useState</code> propio
            sincronizado con un <code>useEffect</code> es casi siempre un
            antipatrón: si el valor se puede calcular a partir de props o
            de otro estado existente, calcularlo directo durante el
            render (o con <code>useMemo</code> si es costoso) evita un
            render extra y el riesgo de que ambos estados queden
            temporalmente desincronizados.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar un valor de estado &quot;ya actualizado&quot; inmediatamente
              después de un setState dentro de un callback async.
            </strong>{" "}
            El batching automático no cambia esto: el valor nuevo sigue
            sin estar disponible hasta el siguiente render.
          </li>
          <li>
            <strong className="text-foreground">
              Un useEffect que solo existe para mantener sincronizados dos
              estados.
            </strong>{" "}
            Casi siempre señala que uno de los dos no debería ser estado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Lazy initializer (<code>useState(() =&gt; calculoCostoso())</code>)
            para evitar recalcular un estado inicial costoso en cada
            render, solo se ejecuta en el montaje.
          </li>
          <li>
            Confiar en el batching automático de React 18 al disparar
            varias actualizaciones relacionadas dentro de un handler
            async, sin necesidad de agruparlas manualmente.
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
            React usa <code>Object.is</code> para comparar el valor nuevo
            con el actual antes de programar un re-render: si son iguales,
            React &quot;bail-outea&quot; ese render, incluso sin
            memoización explícita. Para valores primitivos, esto compara
            por valor. Para objetos y arrays, compara por referencia — un
            objeto nuevo con el mismo contenido SÍ dispara re-render.
          </p>
          <p>
            Cuando varias piezas de estado relacionadas cambian juntas
            según distintas &quot;acciones&quot;,{" "}
            <code>useReducer</code> centraliza la lógica de transición en
            una función pura, testeable de forma aislada. Con{" "}
            <code>useState</code> disperso, esa misma lógica queda
            repartida entre varios handlers, más fácil de romper al
            agregar una acción nueva y olvidar actualizar una pieza
            relacionada.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Crear un objeto nuevo con el mismo contenido esperando que
              React lo trate como &quot;sin cambios&quot;.
            </strong>{" "}
            Object.is compara por referencia en objetos — sí dispara
            re-render aunque el contenido sea idéntico.
          </li>
          <li>
            <strong className="text-foreground">
              Mantener múltiples useState relacionados sin centralizar su
              lógica de transición.
            </strong>{" "}
            Facilita bugs donde una acción nueva actualiza algunas piezas
            de estado pero olvida otras.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Migrar a useReducer un estado de UI con transiciones tipo
            idle/cargando/éxito/error, testeando el reducer de forma
            aislada sin renderizar componentes.
          </li>
          <li>
            Usar flushSync puntualmente cuando una medición del DOM
            necesita que una actualización de estado ya se haya aplicado,
            sabiendo que reintroduce el costo que el batching evita.
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
