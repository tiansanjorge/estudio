import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaTanstackQuery } from "@/lib/modules/estado/tanstack-query-entrevista";

const preguntasPorNivel = {
  1: entrevistaTanstackQuery.filter((p) => p.nivel === 1),
  2: entrevistaTanstackQuery.filter((p) => p.nivel === 2),
  3: entrevistaTanstackQuery.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "TanStack Query — Dev Study Lab",
  description:
    "Server state no es lo mismo que client state: son datos que viven en otro lugar y pueden desactualizarse. TanStack Query trata eso como su unidad central de trabajo.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia hay entre 'client state' y 'server state'?",
    opciones: [
      "Client state es del frontend; server state es una copia de datos ajenos que envejece",
      "Client state vive en el navegador; server state vive en el render del servidor",
      "Client state se guarda en memoria; server state se guarda en localStorage",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Meter server state en Redux/Zustand obliga a reimplementar a mano cacheo, deduplicación y revalidación — exactamente lo que TanStack Query resuelve out of the box.",
  },
  {
    pregunta: "Dos componentes usan useQuery con la misma queryKey al mismo tiempo. ¿Qué pasa?",
    opciones: [
      "Se hacen dos peticiones y gana la última en llegar",
      "Deduplica: hace una sola petición y comparte el resultado",
      "El segundo espera a que termine el primero y vuelve a pedir",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Resuelve de fábrica un problema que, manejado a mano, requeriría coordinar manualmente qué componente es responsable de pedir el dato.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuál es la diferencia entre staleTime y gcTime?",
    opciones: [
      "staleTime es cada cuánto se refetchea solo; gcTime, cuánto tarda en expirar",
      "staleTime es cuánto dura en memoria sin uso; gcTime, cuánto se considera fresco",
      "staleTime es cuánto se considera fresco; gcTime, cuánto dura en memoria sin uso",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un dato puede estar 'viejo' (stale) pero seguir en caché — useQuery lo muestra igual mientras revalida en segundo plano.",
  },
  {
    pregunta:
      "¿Por qué no conviene guardar los datos de una query también en Redux o Zustand 'por las dudas'?",
    opciones: [
      "Porque crea dos fuentes de verdad, y la copia manual deja de sincronizarse",
      "Porque TanStack Query no permite leer sus datos desde fuera de un hook",
      "Porque duplicar los datos en memoria hace que el GC los recolecte antes",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "TanStack Query ya es el lugar donde vive el server state — duplicarlo reintroduce el problema que la librería vino a resolver.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué riesgo hay que manejar explícitamente al implementar una optimistic update?",
    opciones: [
      "Que el cambio optimista se aplique dos veces si el usuario hace doble click",
      "Que la mutación falle: hay que revertir el cambio al estado anterior",
      "Que la UI quede bloqueada hasta que el servidor confirme la mutación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los hooks onMutate, onError y onSettled estructuran ese flujo: aplicar el cambio, revertirlo si falla, y revalidar contra el servidor pase lo que pase.",
  },
  {
    pregunta:
      "¿Por qué es importante cancelar queries en curso antes de aplicar un cambio optimista?",
    opciones: [
      "Para liberar la conexión y que la mutación salga más rápido",
      "Porque TanStack Query no permite mutar mientras hay una query activa",
      "Para que un refetch en vuelo no traiga datos viejos y pise el cambio",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Cancelar asegura que el próximo dato que llegue a esa key sea posterior al cambio optimista, no uno anterior que llegó tarde.",
  },
];

export default function TanstackQueryPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Estado"
      titulo="TanStack Query"
      descripcion="Server state no es lo mismo que client state: son datos que en realidad viven en otro lugar y pueden desactualizarse. TanStack Query trata eso como su unidad central de trabajo."
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
            &ldquo;Client state&rdquo; le pertenece por completo al
            frontend (un modal abierto, un formulario a medio completar).
            &ldquo;Server state&rdquo; es una COPIA de datos que en
            realidad viven en otro lugar (una base de datos, detrás de
            una API): puede desactualizarse sin que el frontend lo sepa,
            y necesita revalidarse periódicamente.
          </p>
          <p>
            Meter server state directamente en Redux o Zustand obliga a
            reimplementar a mano cacheo, deduplicación y revalidación en
            segundo plano — exactamente lo que TanStack Query ya resuelve,
            tratando &ldquo;los datos que pedí a esta URL con estos
            parámetros&rdquo; como la unidad central de trabajo.
          </p>
          <p>
            Si dos componentes distintos usan <code>useQuery</code> con la
            misma <code>queryKey</code> al mismo tiempo, la librería hace
            UNA sola petición de red y comparte el resultado entre ambos,
            sin que ninguno sepa que el otro también lo está pidiendo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Guardar server state en useState/Redux manualmente.
            </strong>{" "}
            Reimplementa a mano lo que TanStack Query resuelve de fábrica.
          </li>
          <li>
            <strong className="text-foreground">
              Usar queryKeys inconsistentes para el mismo dato.
            </strong>{" "}
            Rompe la deduplicación y el cacheo compartido entre
            componentes.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Cualquier dato que venga de una API: listados, detalles de
            entidad, resultados de búsqueda paginados.
          </li>
          <li>
            Reemplazar patrones manuales de fetch + useState + useEffect
            para cargar datos, con cacheo y revalidación automáticos.
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
            Este componente reimplementa a mano lo que useQuery ya resuelve. ¿Qué problemas tiene esta versión manual?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Perfil({ id }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    fetch(\`/api/usuarios/\${id}\`)
      .then((r) => r.json())
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [id]);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              No deduplica peticiones si otro componente pide el mismo{" "}
              <code>id</code> al mismo tiempo, no cachea el resultado
              para futuros montajes del mismo componente, no revalida en
              segundo plano, y no maneja race conditions si{" "}
              <code>id</code> cambia rápido (el patrón visto en el módulo
              de useEffect, con cleanup manual).
            </p>
            <p className="mt-2">Con useQuery, todo eso viene resuelto:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Perfil({ id }) {
  const { data: datos, isLoading: cargando } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => fetch(\`/api/usuarios/\${id}\`).then((r) => r.json()),
  });
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
            <code>staleTime</code> es cuánto tiempo un dato se considera
            &ldquo;fresco&rdquo; (sin refetch); <code>gcTime</code> es
            cuánto dura en memoria DESPUÉS de que nadie lo usa, antes de
            eliminarse de la caché. Son ejes independientes: un dato
            puede estar viejo pero seguir en caché, mostrándose
            inmediatamente mientras se revalida en segundo plano.
          </p>
          <p>
            No conviene duplicar los datos de una query también en Redux
            o Zustand: crea dos fuentes de verdad, y la copia manual pierde
            la sincronización automática que TanStack Query ya provee.
          </p>
          <p>
            <strong className="text-foreground">Invalidar</strong> una
            query le dice a la librería &ldquo;este dato ya no es
            confiable, volvé a pedirlo&rdquo; sin borrarlo de la UI de
            inmediato. El patrón típico: después de una mutación exitosa,
            se invalida la queryKey relacionada para que refleje el
            cambio recién hecho.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confundir staleTime con gcTime al configurar una query.
            </strong>{" "}
            Uno controla cuándo refetchear, el otro cuánto dura en
            memoria — son ejes distintos.
          </li>
          <li>
            <strong className="text-foreground">
              Actualizar manualmente el estado local después de una
              mutación en vez de invalidar la query relacionada.
            </strong>{" "}
            Pierde la sincronización automática con el servidor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            staleTime alto para datos que cambian poco (configuración de
            la app), reduciendo peticiones de red innecesarias.
          </li>
          <li>
            Invalidar la queryKey de una lista después de crear/editar/
            borrar un elemento, en vez de mantener sincronizado un estado
            local a mano.
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
            Una <strong className="text-foreground">
            optimistic update</strong> actualiza la UI inmediatamente con
            el resultado esperado de una mutación, antes de la respuesta
            real del servidor. El riesgo a manejar es qué pasa si la
            mutación FALLA: hay que revertir explícitamente el cambio con{" "}
            <code>onError</code>, usando una copia del estado anterior
            guardada en <code>onMutate</code>.
          </p>
          <p>
            Es importante cancelar queries en curso (
            <code>cancelQueries</code>) antes de aplicar el cambio
            optimista: si un refetch en vuelo trae datos viejos DESPUÉS
            del cambio optimista, pisaría silenciosamente ese cambio con
            información desactualizada — una race condition clásica que
            cancelar la query en curso elimina de raíz.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Implementar optimistic updates sin manejar el caso de
              fallo.
            </strong>{" "}
            Deja la UI mostrando un estado que nunca se confirmó del lado
            del servidor.
          </li>
          <li>
            <strong className="text-foreground">
              No cancelar queries en curso antes de un cambio optimista.
            </strong>{" "}
            Abre una ventana de race condition entre el cambio aplicado y
            un refetch que trae datos viejos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un botón de &quot;me gusta&quot; con optimistic update,
            revirtiendo visualmente si la mutación falla.
          </li>
          <li>
            Explicar en una entrevista el flujo completo
            onMutate/onError/onSettled como patrón estándar de
            actualizaciones optimistas seguras.
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
