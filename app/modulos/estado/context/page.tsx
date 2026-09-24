import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaEstadoContext } from "@/lib/modules/estado/context-entrevista";

const preguntasPorNivel = {
  1: entrevistaEstadoContext.filter((p) => p.nivel === 1),
  2: entrevistaEstadoContext.filter((p) => p.nivel === 2),
  3: entrevistaEstadoContext.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Context como estado global — Dev Study Lab",
  description:
    "Context + useReducer arman un store de estado global sin ninguna librería externa — el mismo patrón que Redux implementa por debajo, con sus propios límites.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo se combinan Context y useReducer para armar un store global?",
    opciones: [
      "Un Provider expone { estado, dispatch } y cualquier descendiente lee y dispara acciones",
      "useReducer crea el store global y Context lo sincroniza con localStorage entre pestañas",
      "Cada componente llama a useReducer y Context mantiene todos esos estados sincronizados",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es, en esencia, el mismo patrón que implementan por debajo librerías como Redux, armado únicamente con herramientas nativas de React.",
  },
  {
    pregunta: "¿Por qué conviene separar estado y dispatch en dos Contexts distintos?",
    opciones: [
      "Porque un Context no puede transportar funciones y datos en el mismo value",
      "dispatch es estable: separarlo evita re-renders en quienes solo disparan acciones",
      "Porque dispatch cambia en cada render y contaminaría el Context del estado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si viajan juntos, un componente que solo necesita dispatch igual re-renderiza cada vez que el estado cambia, porque el value combinado del Provider cambió de referencia.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo empieza a quedarse corto Context + useReducer como store global de toda una app?",
    opciones: [
      "Cuando el estado supera cierto tamaño, porque Context lo copia en cada render",
      "Cuando hay más de un Provider, porque no se pueden combinar entre sí",
      "Cuando hace falta selección granular, devtools con time-travel o middleware",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Context no soporta suscripción parcial nativamente, y no ofrece herramientas de debugging avanzadas ni un sistema de middleware de fábrica.",
  },
  {
    pregunta:
      "¿Cómo implementarías un middleware simple de logging para este patrón, sin librerías externas?",
    opciones: [
      "Envolviendo el dispatch en una función que loguea y después delega al original",
      "Agregando un console.log dentro de cada case del reducer",
      "Con un useEffect que compara el estado nuevo con el anterior en cada render",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es un patrón manual y limitado comparado con el sistema de middleware configurable de Redux, pero cubre el caso simple de loguear acciones en desarrollo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué Context + useReducer no sufre el problema de tearing bajo renderizado concurrente?",
    opciones: [
      "Porque Context congela el value durante todo el render concurrente",
      "Porque es estado nativo de React, no un store externo mutable",
      "Porque useReducer siempre renderiza en modo síncrono, nunca concurrente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Esto distingue a este patrón de un store externo (variable global mutable con suscripción manual), que sí necesitaría useSyncExternalStore para ser seguro bajo concurrencia.",
  },
  {
    pregunta:
      "Si el tearing no aplica a Context + useReducer, ¿por qué Zustand igual usa useSyncExternalStore?",
    opciones: [
      "Porque Zustand está implementado arriba de Context y hereda sus limitaciones",
      "Porque useSyncExternalStore es la única forma de compartir estado sin Provider",
      "Porque guarda el estado fuera de React, y eso sí lo expone al tearing",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Es el trade-off inverso: Context+useReducer evita tearing por estar 'adentro' de React pero sin selección granular; un store externo logra selección granular pero necesita resolver tearing explícitamente.",
  },
];

export default function EstadoContextPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Estado"
      titulo="Context (como estado global)"
      descripcion="Context + useReducer arman un store de estado global sin ninguna librería externa — el mismo patrón que Redux implementa por debajo, con sus propios límites de escala."
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
            Context distribuye un valor a cualquier descendiente sin prop
            drilling; useReducer centraliza la lógica de cómo cambia el
            estado ante distintas acciones. Combinados, un Provider
            expone <code>{"{ estado, dispatch }"}</code> a través de
            Context, y cualquier componente descendiente puede leer el
            estado actual y disparar cambios con{" "}
            <code>{"dispatch({ tipo: '...' })"}</code>, sin que ningún
            componente intermedio necesite saber que ese estado existe.
          </p>
          <p>
            Es, en esencia, el mismo patrón que implementan por debajo
            librerías como Redux, armado únicamente con herramientas
            nativas de React — sin ninguna dependencia externa.
          </p>
          <p>
            Conviene separar el estado y el dispatch en dos Contexts
            distintos: <code>dispatch</code> tiene identidad estable,
            mientras que el estado cambia constantemente. Si viajan
            juntos en un mismo Context, un componente que solo necesita{" "}
            <code>dispatch</code> igual re-renderiza en cada cambio de
            estado, porque el value combinado del Provider cambió de
            referencia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Combinar estado y dispatch en un único Context.
            </strong>{" "}
            Hace que componentes que solo disparan acciones re-rendericen
            innecesariamente en cada cambio de estado.
          </li>
          <li>
            <strong className="text-foreground">
              Duplicar este patrón manualmente en varios lugares de la
              app sin encapsularlo.
            </strong>{" "}
            Conviene un único AppProvider + un par de hooks (useEstado,
            useDispatch) que envuelvan el acceso a ambos Contexts.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Estado global de una app chica o mediana (tema, usuario,
            configuración) sin necesidad de agregar una librería externa.
          </li>
          <li>
            Prototipar rápido la forma del estado de una app antes de
            decidir si conviene migrar a una librería dedicada.
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
            Este AppProvider hace que TODOS los consumidores re-rendericen en cada dispatch, incluso los que solo necesitan disparar acciones. ¿Cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const AppContext = createContext(null);

function AppProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, inicial);
  return (
    <AppContext.Provider value={{ estado, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El objeto <code>{"{ estado, dispatch }"}</code> es un
              literal nuevo en cada render (porque <code>estado</code>{" "}
              cambió), así que TODO consumidor de <code>AppContext</code>{" "}
              re-renderiza, incluidos los que solo usan{" "}
              <code>dispatch</code> para disparar acciones sin leer el
              estado.
            </p>
            <p className="mt-2">El fix es separar en dos Contexts:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`const EstadoContext = createContext(null);
const DispatchContext = createContext(null);

function AppProvider({ children }) {
  const [estado, dispatch] = useReducer(reducer, inicial);
  return (
    <EstadoContext.Provider value={estado}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </EstadoContext.Provider>
  );
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
            Context + useReducer empieza a quedarse corto en tres
            escenarios: cuando hace falta{" "}
            <strong className="text-foreground">
              selección granular
            </strong>{" "}
            del estado (Context no soporta suscripción parcial
            nativamente), cuando se necesitan{" "}
            <strong className="text-foreground">
              devtools avanzadas
            </strong>{" "}
            (time-travel debugging, historial de acciones), o cuando hace
            falta un sistema de{" "}
            <strong className="text-foreground">middleware</strong>{" "}
            reutilizable (logging, persistencia, sincronización).
          </p>
          <p>
            Un middleware simple de logging se puede armar a mano
            envolviendo el dispatch real en una función que registra la
            acción antes de delegar — un patrón manual y limitado
            comparado con el sistema de middleware configurable de Redux,
            pero suficiente para el caso simple de loguear en desarrollo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Insistir con Context + useReducer cuando el estado necesita
              selección granular real.
            </strong>{" "}
            Sin un Context por cada slice de estado, cualquier cambio
            re-renderiza a todos los consumidores.
          </li>
          <li>
            <strong className="text-foreground">
              Reimplementar un sistema de middleware complejo a mano.
            </strong>{" "}
            Más allá de logging simple, conviene migrar a una librería
            dedicada en vez de reinventar composición de middleware.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Loguear cada acción despachada en desarrollo con un dispatch
            envuelto, sin agregar Redux DevTools todavía.
          </li>
          <li>
            Reconocer la señal de &quot;necesito una librería
            dedicada&quot; cuando
            el estado global empieza a requerir selectors, persistencia
            automática o debugging de historial.
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
            El estado de useReducer es estado NATIVO de React, no un
            store externo mutable — React garantiza consistencia interna
            para su propio estado durante un render concurrente, así que
            Context + useReducer no sufre el problema de tearing visto en
            Concurrent Rendering, sin necesitar{" "}
            <code>useSyncExternalStore</code>.
          </p>
          <p>
            Librerías como Zustand igual usan{" "}
            <code>useSyncExternalStore</code> por debajo porque guardan su
            estado en un store completamente EXTERNO a React (para lograr
            la selección granular que Context no ofrece nativamente) — al
            ser mutable y externo, sí está expuesto a tearing bajo
            renderizado concurrente, y necesita resolverlo explícitamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que cualquier solución de estado global necesita
              useSyncExternalStore.
            </strong>{" "}
            Solo aplica a stores externos al sistema de estado de React,
            no a useReducer/useState nativos.
          </li>
          <li>
            <strong className="text-foreground">
              Subestimar el trade-off al elegir entre Context+useReducer
              y un store externo.
            </strong>{" "}
            Uno evita tearing por estar &quot;adentro&quot; de React; el
            otro logra selección granular pero paga el costo de resolver
            tearing.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Explicar en una entrevista de nivel senior/staff la diferencia
            arquitectónica real entre Context+useReducer y una librería
            como Zustand, más allá de la sintaxis superficial.
          </li>
          <li>
            Decidir con criterio técnico (no solo por popularidad) cuándo
            un store externo realmente aporta algo que Context+useReducer
            no puede dar.
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
