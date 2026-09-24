import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseCallback } from "@/lib/modules/hooks/use-callback-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseCallback.filter((p) => p.nivel === 1),
  2: entrevistaUseCallback.filter((p) => p.nivel === 2),
  3: entrevistaUseCallback.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useCallback — Dev Study Lab",
  description:
    "useCallback memoiza la referencia de una función entre renders. Por sí solo no evita nada — necesita un consumidor (memo, deps de otro hook) que aproveche esa estabilidad.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué relación hay entre useCallback(fn, deps) y useMemo?",
    opciones: [
      "No tienen ninguna relación, son mecanismos completamente distintos",
      "useCallback(fn, deps) es equivalente a useMemo(() => fn, deps) — memoiza específicamente una función",
      "useCallback reemplaza por completo a useMemo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es más legible y directo que escribir useMemo a mano cuando lo que se quiere memoizar es específicamente una referencia de función.",
  },
  {
    pregunta: "Si el componente hijo que recibe un callback NO está en React.memo, ¿useCallback evita su re-render?",
    opciones: [
      "Sí, siempre",
      "No: el hijo re-renderiza igual en cada render del padre, sin importar si la prop cambió de referencia",
      "Solo si el callback no tiene parámetros",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "useCallback y React.memo trabajan juntos: uno mantiene estable la referencia, el otro es el que aprovecha esa estabilidad para evitar el re-render.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo tiene sentido estabilizar un callback con useCallback en un componente padre?",
    opciones: [
      "Siempre, en cualquier función definida en el componente",
      "Cuando el hijo que lo recibe lo usa como dependencia de un useEffect, para que ese efecto no se dispare de más en cada render del padre",
      "Nunca, useCallback no tiene ningún caso de uso real",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin useCallback en el padre, el callback es una referencia nueva en cada render, disparando el efecto del hijo aunque la lógica no haya cambiado.",
  },
  {
    pregunta:
      "Un useCallback tiene como dependencia un objeto creado como literal en el JSX del padre. ¿Funciona la memoización?",
    opciones: [
      "Sí, siempre, porque el contenido del objeto es el mismo",
      "No: la comparación es por referencia, y un objeto literal nuevo en cada render anula la memoización",
      "Solo si el objeto tiene menos de 3 propiedades",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para que funcione de verdad, esa dependencia también necesita una referencia estable, típicamente memoizada con su propio useMemo donde se crea.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Un useCallback con array de dependencias vacío lee un estado que cambia después. ¿Qué ve el callback?",
    opciones: [
      "El valor más reciente del estado, siempre",
      "El valor VIEJO del estado, congelado desde el momento en que se creó esa versión memoizada",
      "undefined, porque el array está vacío",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Como las deps están vacías, React nunca recrea el callback, así que su closure queda atada para siempre al valor que existía quando se memoizó la primera vez.",
  },
  {
    pregunta:
      "¿Cómo evitarías ese stale closure sin agregar la dependencia (si necesitás mantener la referencia del callback totalmente estable)?",
    opciones: [
      "No es posible, hay que agregar la dependencia sí o sí",
      "Guardando el valor en una ref sincronizada con un efecto, y leyendo ref.current dentro del callback en vez del estado directo",
      "Usando useMemo en vez de useCallback",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Separa 'qué dispara una nueva versión del callback' (nada) de 'qué valor necesito leer siempre actualizado' (el estado, vía ref) — el mismo patrón conceptual que resuelve useEffectEvent para efectos.",
  },
];

export default function UseCallbackPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useCallback"
      descripcion="useCallback memoiza la referencia de una función entre renders. Por sí solo no evita ningún re-render — necesita un consumidor (memo, deps de otro hook) que realmente aproveche esa estabilidad."
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
            Cada vez que un componente renderiza, cualquier función
            definida en su cuerpo es una referencia NUEVA, aunque haga
            exactamente lo mismo. <code>useCallback</code> memoiza esa
            referencia entre renders, devolviendo la misma función
            mientras las dependencias de su array no cambien.
          </p>
          <p>
            Técnicamente no hace nada que <code>useMemo</code> no pudiera
            hacer —{" "}
            <code>{"useCallback(fn, deps)"}</code> equivale a{" "}
            <code>{"useMemo(() => fn, deps)"}</code> — pero es más
            legible cuando lo que se quiere memoizar es específicamente
            una función.
          </p>
          <p>
            Por sí solo, envolver una función en useCallback no evita
            nada: si el componente hijo que la recibe como prop NO está
            envuelto en <code>React.memo</code>, ese hijo re-renderiza
            igual en cada render del padre, sin importar si la prop
            cambió de referencia. Los dos hooks trabajan juntos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Envolver cualquier función en useCallback &quot;por las
              dudas&quot;.
            </strong>{" "}
            Sin un consumidor real que aproveche la estabilidad de
            referencia, solo agrega complejidad sin beneficio medible.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que useCallback evite el re-render de un hijo sin
              React.memo.
            </strong>{" "}
            Necesita el memo del lado del hijo para que la estabilidad de
            referencia tenga algún efecto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Pasar un callback estable a un componente hijo envuelto en
            React.memo, para que la memoización del hijo funcione de
            verdad.
          </li>
          <li>
            Estabilizar un callback que se usa como dependencia de otro
            hook (useEffect, otro useCallback/useMemo).
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
          <p>¿Por qué Hijo sigue re-renderizando en cada render de Padre, a pesar del useCallback?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Padre() {
  const [contador, setContador] = useState(0);
  const manejarClick = useCallback(() => console.log('click'), []);

  return (
    <div>
      <button onClick={() => setContador((c) => c + 1)}>{contador}</button>
      <Hijo onClick={manejarClick} />
    </div>
  );
}

function Hijo({ onClick }) {
  console.log('Hijo renderizó');
  return <button onClick={onClick}>Hijo</button>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>manejarClick</code> sí mantiene la misma referencia
              entre renders gracias a useCallback — ese no es el
              problema. El problema es que <code>Hijo</code> no está
              envuelto en <code>React.memo</code>, así que React lo
              re-renderiza siempre que <code>Padre</code> renderiza, sin
              siquiera comparar si sus props cambiaron.
            </p>
            <p className="mt-2">El fix es envolver Hijo en memo:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`const Hijo = React.memo(function Hijo({ onClick }) {
  console.log('Hijo renderizó');
  return <button onClick={onClick}>Hijo</button>;
});`}
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
            Estabilizar un callback con useCallback en un componente padre
            tiene sentido cuando el hijo que lo recibe lo usa como
            dependencia de un <code>useEffect</code> — sin esa
            estabilización, el callback es una referencia nueva en cada
            render del padre, disparando el efecto del hijo de más,
            aunque la lógica del callback no haya cambiado.
          </p>
          <p>
            useCallback compara sus dependencias por referencia (
            <code>Object.is</code>). Si una de esas dependencias es un
            objeto creado como literal en el JSX del padre, es una
            referencia nueva en cada render, y anula la memoización por
            completo — React recrea el callback siempre, aunque el
            contenido del objeto sea idéntico.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No estabilizar un callback pasado a un hijo que lo usa en un
              useEffect.
            </strong>{" "}
            El efecto del hijo se dispara en cada render del padre
            innecesariamente.
          </li>
          <li>
            <strong className="text-foreground">
              Usar un objeto o array literal como dependencia de
              useCallback.
            </strong>{" "}
            Anula la memoización sin que sea obvio por qué, porque el
            contenido &quot;parece&quot; el mismo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Estabilizar un callback de guardado que un componente hijo usa
            en un useEffect de auto-guardado periódico.
          </li>
          <li>
            Memoizar también las dependencias objeto/array de un
            useCallback, no solo el callback en sí, para que la cadena
            completa de memoización funcione.
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
            Un useCallback con array de dependencias vacío queda con una
            closure sobre los valores que existían en el momento en que
            se creó esa versión memoizada — como React nunca vuelve a
            crear el callback, sigue &quot;viendo&quot; para siempre el
            valor viejo de cualquier estado que use internamente, aunque
            el componente haya renderizado de nuevo con un valor
            distinto. Es un bug fácil de pasar por alto porque compila
            sin errores y solo se manifiesta en runtime.
          </p>
          <p>
            Si de verdad se necesita que la referencia del callback se
            mantenga estable sin incluir esa dependencia, la solución es
            guardar el valor cambiante en una <code>ref</code>{" "}
            sincronizada con un efecto, y leer <code>ref.current</code>{" "}
            dentro del callback en vez del estado directo — el mismo
            patrón conceptual que resuelve <code>useEffectEvent</code>{" "}
            para efectos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Dejar un array de dependencias vacío &quot;para que sea
              estable&quot; sin pensar en qué valores usa el callback.
            </strong>{" "}
            Introduce un stale closure silencioso sobre cualquier estado
            leído adentro.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir este bug con un problema de timing o de red.
            </strong>{" "}
            El síntoma (&quot;veo un valor atrasado&quot;) se parece a
            otros bugs asincrónicos, pero la causa acá es puramente de
            dependencias.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el patrón ref + efecto de sincronización para un
            callback de analytics que necesita loguear el estado actual
            sin recrearse en cada cambio de ese estado.
          </li>
          <li>
            Auditar useCallback con arrays de dependencias vacíos en un
            codebase existente, buscando lecturas de estado que deberían
            estar en las deps.
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
