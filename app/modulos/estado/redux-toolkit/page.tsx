import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaReduxToolkit } from "@/lib/modules/estado/redux-toolkit-entrevista";

const preguntasPorNivel = {
  1: entrevistaReduxToolkit.filter((p) => p.nivel === 1),
  2: entrevistaReduxToolkit.filter((p) => p.nivel === 2),
  3: entrevistaReduxToolkit.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Redux Toolkit — Dev Study Lab",
  description:
    "Redux Toolkit es la forma oficial de usar Redux hoy: createSlice genera actions y reducer solos, e Immer permite escribir 'mutaciones' que son inmutables por debajo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué genera automáticamente createSlice?",
    opciones: [
      "Los action creators y el reducer, a partir de un solo objeto",
      "El store completo, con middleware y DevTools ya configurados",
      "Los selectores memoizados de cada propiedad del estado",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "RTK elimina el boilerplate del Redux clásico: constantes de tipos de acción, action creators y reducers con switch grandes escritos a mano.",
  },
  {
    pregunta: "¿Con qué hooks se conecta un componente al store de Redux?",
    opciones: [
      "useStore para leer el estado y useReducer para disparar acciones",
      "useSelector para leer el estado y useDispatch para disparar acciones",
      "useContext con el Provider del store y useState para las acciones",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "useSelector re-renderiza el componente cuando el resultado del selector cambia — por eso conviene seleccionar solo lo que el componente realmente necesita.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cómo permite RTK escribir código que 'muta' el estado directamente dentro de un reducer?",
    opciones: [
      "Clona el estado completo con structuredClone antes de pasarlo al reducer",
      "Congela el estado con Object.freeze y descarta las mutaciones inválidas",
      "Envuelve los reducers con Immer, que traduce las mutaciones a un objeto nuevo",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Esto solo aplica dentro de reducers creados con createSlice — Redux 'a mano' sigue exigiendo el patrón de spread manual explícito.",
  },
  {
    pregunta:
      "¿Qué pasa si un reducer de createSlice muta el draft Y ADEMÁS retorna explícitamente un valor nuevo?",
    opciones: [
      "Immer lanza un error: no puede combinar los dos enfoques",
      "Gana el valor retornado y las mutaciones se descartan",
      "Immer fusiona las mutaciones con el valor retornado",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La regla es: o se muta el draft sin retornar nada, o se retorna un estado nuevo sin tocar el draft — nunca ambas cosas en el mismo reducer.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué se recomienda normalizar el estado (entidades por id) en vez de arrays anidados?",
    opciones: [
      "Porque Redux no puede serializar arrays anidados en las DevTools",
      "Porque buscar o actualizar una entidad pasa de O(n) a O(1) por clave",
      "Porque Immer solo detecta mutaciones en el primer nivel del estado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "RTK incluye createEntityAdapter específicamente para generar esta estructura normalizada y sus reducers/selectors asociados sin escribirlos a mano.",
  },
  {
    pregunta:
      "¿Cuándo elegirías RTK Query sobre TanStack Query?",
    opciones: [
      "Cuando necesitás cache con invalidación, que TanStack Query no ofrece",
      "Cuando la API es GraphQL, porque TanStack Query solo soporta REST",
      "Cuando ya usás Redux y conviene integrar el fetching al mismo store",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "TanStack Query es agnóstico de cualquier librería de estado global, con una API más liviana para el caso puro de cachear datos del servidor sin adoptar todo el ecosistema de Redux.",
  },
];

export default function ReduxToolkitPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Estado"
      titulo="Redux Toolkit"
      descripcion="Redux Toolkit es la forma oficial de usar Redux hoy: createSlice genera actions y reducer solos, e Immer permite escribir 'mutaciones' que en realidad son inmutables por debajo."
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
            El Redux original requería mucho código repetitivo: constantes
            de tipos de acción, action creators, un reducer con un switch
            grande. Redux Toolkit (RTK) es la forma oficial y recomendada
            de usar Redux hoy:{" "}
            <code>createSlice</code> genera automáticamente los action
            creators y el reducer a partir de un solo objeto de
            definiciones, y <code>configureStore</code> arma el store con
            buenas prácticas por defecto.
          </p>
          <p>
            Un componente se conecta al store con los hooks de{" "}
            <code>react-redux</code>: <code>useSelector</code> para leer
            una porción del estado, y <code>useDispatch</code> para
            disparar acciones. Igual que con otras soluciones de estado,{" "}
            <code>useSelector</code> re-renderiza el componente cuando el
            resultado del selector cambia — conviene seleccionar solo lo
            que realmente se necesita.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Seleccionar el estado completo del slice en vez de la
              propiedad puntual necesaria.
            </strong>{" "}
            Re-renderiza el componente ante cualquier cambio del slice,
            no solo el que le importa.
          </li>
          <li>
            <strong className="text-foreground">
              Escribir Redux desde cero sin usar Redux Toolkit hoy en día.
            </strong>{" "}
            RTK es la forma oficialmente recomendada; el patrón
            &quot;clásico&quot; de Redux ya no es la referencia a seguir.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Apps grandes con múltiples equipos, donde la estructura más
            rígida de Redux facilita la consistencia entre distintos
            slices de estado.
          </li>
          <li>
            Proyectos que ya necesitan las Redux DevTools (time-travel
            debugging, inspección de acciones) como herramienta central
            de debugging.
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
            ¿Por qué este reducer de createSlice sí es válido, aunque
            &quot;mute&quot; el estado directamente?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const slice = createSlice({
  name: 'tareas',
  initialState: { items: [] },
  reducers: {
    agregar: (estado, accion) => {
      estado.items.push(accion.payload);
    },
  },
});`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>createSlice</code> envuelve cada reducer con Immer por
              debajo. Immer usa un Proxy que registra qué propiedades del
              &quot;borrador&quot; (draft) del estado se modifican dentro
              de la función, y al final construye un objeto completamente
              nuevo con esos cambios aplicados de forma inmutable — el
              código se ve como una mutación directa, pero Redux recibe
              un objeto distinto en memoria como nuevo estado.
            </p>
            <p className="mt-2">
              Esto solo funciona dentro de reducers de un slice creado
              con createSlice — escribir Redux &quot;a mano&quot; sin RTK
              sigue exigiendo el spread manual explícito.
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
            Immer usa un Proxy para registrar qué propiedades del draft se
            modifican dentro del reducer, y construye un objeto nuevo con
            esos cambios aplicados de forma inmutable. Si un reducer muta
            el draft Y ADEMÁS retorna explícitamente un valor distinto de{" "}
            <code>undefined</code>, Immer lanza un error en runtime — no
            puede reconciliar ambos enfoques a la vez.
          </p>
          <p>
            Para lógica asincrónica, <code>createAsyncThunk</code> genera
            automáticamente tres tipos de acción (pending, fulfilled,
            rejected) asociados al ciclo de vida de una promesa. El
            componente hace <code>dispatch(miThunk(argumento))</code>, y
            el slice maneja esos tres casos en su{" "}
            <code>extraReducers</code>, sin que ningún reducer individual
            necesite ser async.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Mezclar mutación del draft con un return explícito en el
              mismo reducer.
            </strong>{" "}
            Immer lanza un error inmediato en runtime.
          </li>
          <li>
            <strong className="text-foreground">
              Escribir la lógica de pending/fulfilled/rejected a mano en
              vez de usar createAsyncThunk.
            </strong>{" "}
            Reimplementa algo que RTK ya estandariza.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un createAsyncThunk para cargar datos de una API, manejando
            loading/success/error en el extraReducers del slice
            correspondiente.
          </li>
          <li>
            Auditar reducers existentes que mezclen mutación del draft con
            returns explícitos, como fuente de errores intermitentes.
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
            Normalizar el estado (entidades indexadas por id, con un array
            separado de ids para el orden) evita que actualizar o buscar
            una entidad puntual requiera recorrer arrays completos — pasa
            de O(n) a O(1). <code>createEntityAdapter</code> genera esa
            estructura y sus reducers/selectors asociados sin escribirlos
            a mano.
          </p>
          <p>
            <strong className="text-foreground">RTK Query</strong> y{" "}
            <strong className="text-foreground">TanStack Query</strong>{" "}
            resuelven el mismo problema (cachear y sincronizar datos del
            servidor). RTK Query tiene sentido cuando el proyecto ya usa
            Redux y quiere integrar el data fetching al mismo store y
            DevTools; TanStack Query es agnóstico de cualquier librería de
            estado global, con una API más liviana para el caso puro de
            fetching.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Guardar listas de entidades relacionales como arrays
              anidados sin normalizar.
            </strong>{" "}
            Cualquier actualización puntual se vuelve costosa a medida
            que crece la lista.
          </li>
          <li>
            <strong className="text-foreground">
              Elegir RTK Query o TanStack Query por popularidad en vez de
              por si el proyecto ya usa Redux.
            </strong>{" "}
            La decisión rara vez es puramente técnica — depende del
            contexto del proyecto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar createEntityAdapter para una lista grande de entidades
            (productos, usuarios) con actualizaciones frecuentes por id.
          </li>
          <li>
            Adoptar RTK Query en un proyecto que ya tiene Redux Toolkit
            establecido, en vez de sumar una segunda librería de data
            fetching en paralelo.
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
