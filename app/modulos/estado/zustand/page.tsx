import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaZustand } from "@/lib/modules/estado/zustand-entrevista";

const preguntasPorNivel = {
  1: entrevistaZustand.filter((p) => p.nivel === 1),
  2: entrevistaZustand.filter((p) => p.nivel === 2),
  3: entrevistaZustand.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Zustand — Dev Study Lab",
  description:
    "Zustand arma un store externo a React y lo expone como un hook con selección granular — sin Context, sin Provider, y sin el problema de re-render masivo de Context.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Zustand necesita envolver la app en un Provider, como Context?",
    opciones: [
      "No: create() arma un store externo a React, expuesto como hook",
      "Sí: sin Provider, cada componente crea su propia copia del store",
      "Solo en SSR, donde el Provider evita compartir estado entre requests",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Cualquier componente puede importar el hook del store y usarlo directamente, sin envolver la app en nada.",
  },
  {
    pregunta: "¿Por qué es importante usar un selector al leer del store?",
    opciones: [
      "Porque sin selector el hook devuelve undefined hasta la primera acción",
      "Para suscribirse solo a esa porción y re-renderizar cuando ella cambia",
      "Porque el selector congela el estado leído y evita mutaciones accidentales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Leer el store completo sin selector suscribe al componente a TODO el store, re-renderizando ante cualquier cambio de cualquier propiedad.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué trade-off hay entre Zustand y Redux Toolkit?",
    opciones: [
      "Zustand no soporta middleware; Redux Toolkit sí, pero con más boilerplate",
      "Zustand solo sirve para estado local; Redux Toolkit, para estado global",
      "Zustand es mínimo y flexible; RTK impone estructura y tiene mejor tooling",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "En equipos grandes sin convenciones propias, la flexibilidad de Zustand puede llevar a stores organizados de forma inconsistente entre sí.",
  },
  {
    pregunta:
      "¿Cómo se evita el boilerplate de spread manual para actualizar estado anidado en Zustand?",
    opciones: [
      "Con el middleware immer, que deja escribir la actualización como una mutación",
      "Con el middleware persist, que aplana el estado antes de guardarlo",
      "Mutando el estado directo: Zustand detecta el cambio con un Proxy",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es la misma técnica de 'mutación aparente, inmutabilidad real' que usa Redux Toolkit internamente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Sobre qué API está implementado el hook que devuelve create() de Zustand?",
    opciones: [
      "useContext, con un Provider implícito que Zustand monta en la raíz",
      "useSyncExternalStore, que permite selectores y evita el tearing",
      "useReducer, con un reducer genérico que aplica cada set()",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React se encarga de comparar la porción seleccionada entre notificaciones del store y re-renderizar solo si cambió, sin exponerse a tearing.",
  },
  {
    pregunta:
      "Un selector devuelve un objeto literal nuevo en cada llamada (useStore((s) => ({ a: s.a, b: s.b }))). ¿Qué problema causa?",
    opciones: [
      "Ninguno: Zustand compara el resultado del selector con igualdad profunda",
      "Un error en desarrollo: los selectores tienen que devolver primitivos",
      "Re-renderiza en cada cambio del store: el objeto siempre es 'distinto'",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Se soluciona pasando un comparador shallow como segundo argumento del hook, para comparar propiedades en vez de referencia.",
  },
];

export default function ZustandPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Estado"
      titulo="Zustand"
      descripcion="Zustand arma un store externo a React y lo expone como un hook con selección granular — sin Context, sin Provider, resolviendo el problema de re-render masivo que Context tiene por diseño."
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
            Zustand no usa Context ni Provider por defecto:{" "}
            <code>create()</code> arma un store externo a React (un
            objeto simple con estado y funciones para actualizarlo), y lo
            expone como un hook que cualquier componente puede importar y
            usar directamente. Cada componente que llama al hook puede
            elegir leer solo una PORCIÓN específica del estado con un{" "}
            <strong className="text-foreground">selector</strong>,
            re-renderizando únicamente cuando esa porción cambia.
          </p>
          <p>
            Leer con un selector (
            <code>{"useStore((estado) => estado.contador)"}</code>)
            suscribe al componente SOLO a esa porción. Leer el store
            completo sin selector suscribe al componente a TODO el
            store, re-renderizando ante cualquier cambio — perdiendo la
            ventaja principal de Zustand frente a Context.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Desestructurar todo el store sin selector.
            </strong>{" "}
            Anula la ventaja de selección granular, re-renderizando por
            cualquier cambio del store.
          </li>
          <li>
            <strong className="text-foreground">
              Crear un store por cada componente en vez de uno compartido.
            </strong>{" "}
            El punto de Zustand es tener un store accesible desde
            cualquier parte de la app sin prop drilling.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Estado global de una app mediana/grande donde Context+
            useReducer empieza a mostrar sus límites de selección
            granular.
          </li>
          <li>
            Estado compartido entre componentes en ramas distintas del
            árbol sin necesidad de envolver la app en Providers.
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
            Este componente re-renderiza cada vez que CUALQUIER propiedad
            del store cambia, aunque solo use &quot;nombre&quot;. ¿Por
            qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Perfil() {
  const estado = useStore();
  return <p>{estado.nombre}</p>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>useStore()</code> sin selector suscribe al componente
              a TODO el store — cualquier cambio en cualquier propiedad
              (aunque no sea <code>nombre</code>) dispara un re-render de{" "}
              <code>Perfil</code>.
            </p>
            <p className="mt-2">
              El fix es usar un selector para suscribirse solo a lo que
              realmente se usa:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Perfil() {
  const nombre = useStore((estado) => estado.nombre);
  return <p>{nombre}</p>;
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
            Zustand es deliberadamente minimalista: no exige actions ni
            reducers separados, no necesita Provider. Esa simplicidad es
            una ventaja en proyectos chicos, pero también significa menos
            estructura impuesta — en equipos grandes, sin convenciones
            propias, es más fácil terminar con stores organizados de
            forma inconsistente. Redux Toolkit impone más estructura, a
            cambio de más ceremonia inicial.
          </p>
          <p>
            <code>set()</code> hace un merge SUPERFICIAL del objeto que
            se le pasa — para propiedades anidadas hay que hacer spread
            manual en cada nivel. El middleware <code>immer</code> de
            Zustand permite escribir la actualización como si se mutara
            el estado directamente, mientras por debajo genera un nuevo
            objeto inmutable.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No tener convenciones de equipo para organizar stores de
              Zustand.
            </strong>{" "}
            Su flexibilidad puede volverse inconsistencia en proyectos
            grandes sin acuerdos claros.
          </li>
          <li>
            <strong className="text-foreground">
              Hacer spread manual repetitivo en cada actualización
              anidada sin considerar el middleware immer.
            </strong>{" "}
            Agrega boilerplate evitable para estado con estructura
            profunda.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el middleware immer en un store con estado anidado
            (perfil de usuario con varias sub-secciones) para simplificar
            las actualizaciones.
          </li>
          <li>
            Definir convenciones de equipo (un store por dominio, nombres
            de acciones consistentes) para mantener orden en proyectos
            grandes con Zustand.
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
            El hook que devuelve <code>create()</code> está implementado
            sobre <code>useSyncExternalStore</code>: cada componente se
            suscribe directamente al store externo, pasándole a React una
            función que extrae solo la porción de estado que le
            interesa. React se encarga de comparar esa porción y
            re-renderizar solo si cambió, sin exponerse al problema de
            tearing bajo renderizado concurrente.
          </p>
          <p>
            Un selector que devuelve un objeto literal NUEVO cada vez (
            <code>{"useStore((s) => ({ a: s.a, b: s.b }))"}</code>) hace
            que la comparación por referencia siempre detecte un cambio,
            aunque el contenido sea idéntico. La solución es pasar un
            comparador shallow como segundo argumento del hook, que
            Zustand ofrece específicamente para este caso.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Devolver un objeto/array nuevo desde un selector sin
              comparador shallow.
            </strong>{" "}
            Anula la optimización de selección granular, re-renderizando
            en cada actualización del store.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que Zustand necesita que React sepa algo de su store.
            </strong>{" "}
            El store es completamente externo; useSyncExternalStore es el
            puente que lo integra de forma segura.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar shallow de zustand/shallow al seleccionar varias
            propiedades relacionadas en un mismo selector, evitando
            re-renders por referencias nuevas.
          </li>
          <li>
            Explicar en una entrevista de nivel staff por qué Zustand
            necesitó adoptar useSyncExternalStore para ser seguro bajo
            React 18+.
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
