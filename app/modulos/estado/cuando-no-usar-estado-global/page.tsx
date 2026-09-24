import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaCuandoNoUsarEstadoGlobal } from "@/lib/modules/estado/cuando-no-usar-estado-global-entrevista";

const preguntasPorNivel = {
  1: entrevistaCuandoNoUsarEstadoGlobal.filter((p) => p.nivel === 1),
  2: entrevistaCuandoNoUsarEstadoGlobal.filter((p) => p.nivel === 2),
  3: entrevistaCuandoNoUsarEstadoGlobal.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Cuándo NO usar estado global — Dev Study Lab",
  description:
    "Cada pieza de estado tiene un radio de influencia natural. Forzarla a un store global cuando solo le importa a un componente agrega acoplamiento sin ningún beneficio real.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué no todo el estado de una app debería vivir en un store global?",
    opciones: [
      "Porque suma acoplamiento y complejidad cuando el dato le importa a un solo lugar",
      "Porque los stores globales no pueden guardar estado que cambia muy seguido",
      "Porque cada dato global agrega peso al bundle inicial de la aplicación",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Cualquier componente de la app queda técnicamente habilitado para leer o modificar ese estado, dificultando razonar sobre quién lo cambia y por qué.",
  },
  {
    pregunta: "¿Qué tres categorías de estado NO deberían vivir en Redux/Zustand por costumbre?",
    opciones: [
      "Estado de formularios, preferencias del usuario y datos de sesión",
      "Estado de UI local, estado derivable de la URL y server state",
      "Estado de autenticación, feature flags y configuración del tema",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada una tiene un lugar más natural: useState local, query params, o una herramienta de data fetching, respectivamente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué ventaja tiene guardar un filtro de búsqueda en la URL en vez de en un store global?",
    opciones: [
      "Que la URL se lee más rápido que el store, sin disparar re-renders",
      "Que el filtro queda protegido: el usuario no lo puede modificar a mano",
      "Se comparte por link, sobrevive al refresh y atrás/adelante funciona solo",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "El costo es que solo se pueden guardar datos serializables a string, con límites prácticos de longitud de URL.",
  },
  {
    pregunta:
      "¿Cuál es el costo real de 'levantar' estado a un store global antes de tener una necesidad concreta?",
    opciones: [
      "Acoplamiento, re-renders de más y más indirección para saber quién es dueño del dato",
      "Más peso en el bundle, porque cada store se carga completo en el primer render",
      "Pérdida de datos al recargar, porque el store global no persiste entre sesiones",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Entender un estado local requiere mirar un solo componente; entender un estado global requiere rastrear todos los lugares que lo leen o modifican.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuál es el orden de niveles del principio de 'colocación de estado'?",
    opciones: [
      "Context → padre común → useState local → URL, bajando a medida que se usa menos",
      "Variable local → useState → URL → padre común → Context o librería global",
      "URL → useState local → Context → store global, según cuánto dura el dato",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La mayoría del estado de una app típica termina resuelto en los primeros dos o tres niveles, sin necesitar nunca llegar a un store global.",
  },
  {
    pregunta:
      "¿Por qué a veces el problema no es DÓNDE vive un estado, sino que ni siquiera debería ser estado?",
    opciones: [
      "Porque algunos datos conviene guardarlos en refs para no disparar renders",
      "Porque ciertos valores deberían vivir en el servidor y no en el cliente",
      "Porque un dato derivable se puede calcular en el render, sin ser estado",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Promoverlo a estado propio y encima subirlo a un store global combina dos errores: el dato innecesario en sí, y su ubicación innecesariamente alta en la jerarquía.",
  },
];

export default function CuandoNoUsarEstadoGlobalPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Estado"
      titulo="Cuándo NO usar estado global"
      descripcion="Cada pieza de estado tiene un radio de influencia natural. Forzarla a un store global cuando solo le importa a un componente agrega acoplamiento sin ningún beneficio real."
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
            Cada pieza de estado tiene un &ldquo;radio de
            influencia&rdquo; natural. Forzarla a vivir en un store
            global cuando en realidad solo le importa a un componente (o
            a una rama chica del árbol) agrega acoplamiento y complejidad
            sin ningún beneficio real: cualquier componente de la app
            queda técnicamente habilitado para leerla o modificarla.
          </p>
          <p>
            Tres categorías típicas de estado que NO deberían ir a un
            store global por costumbre: estado de UI puramente local (un
            modal abierto, un input mientras se escribe), estado
            derivable de la <strong className="text-foreground">
            URL</strong> (filtros, página actual, un id seleccionado), y{" "}
            <strong className="text-foreground">server state</strong>{" "}
            (datos que vienen de una API, que viven mejor en una
            herramienta como TanStack Query).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Poner el estado de un input o un modal en el store global
              &quot;por las dudas&quot;.
            </strong>{" "}
            Agrega acoplamiento sin que ningún otro componente lo
            necesite realmente.
          </li>
          <li>
            <strong className="text-foreground">
              Copiar server state a un store global en vez de usar una
              herramienta de data fetching.
            </strong>{" "}
            Pierde cacheo y revalidación automáticos, y crea una segunda
            fuente de verdad.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Mantener el estado de un acordeón, un tooltip, o un dropdown
            en useState local del componente correspondiente.
          </li>
          <li>
            Guardar un filtro de búsqueda o la página actual de una lista
            en los query params de la URL, en vez de en un store.
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
            Este store global guarda el estado de un modal que solo un componente usa. ¿Qué problema tiene, y cómo lo simplificarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const useUIStore = create((set) => ({
  modalConfirmacionAbierto: false,
  abrirModal: () => set({ modalConfirmacionAbierto: true }),
  cerrarModal: () => set({ modalConfirmacionAbierto: false }),
}));

function BotonBorrar() {
  const abrirModal = useUIStore((s) => s.abrirModal);
  return <button onClick={abrirModal}>Borrar</button>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Si <code>modalConfirmacionAbierto</code> solo lo usa{" "}
              <code>BotonBorrar</code> y el modal que renderiza junto a
              él, no hay ninguna razón para que viva en un store global
              — cualquier otro componente de la app queda técnicamente
              habilitado para abrir/cerrar ese modal, sin que eso tenga
              sentido lógico.
            </p>
            <p className="mt-2">El fix es useState local:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function BotonBorrar() {
  const [modalAbierto, setModalAbierto] = useState(false);
  return (
    <>
      <button onClick={() => setModalAbierto(true)}>Borrar</button>
      {modalAbierto && <ModalConfirmacion onCerrar={() => setModalAbierto(false)} />}
    </>
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
            Guardar un filtro en la URL da tres ventajas que ni un store
            global ni useState dan por sí solos: es{" "}
            <strong className="text-foreground">compartible</strong> por
            link, sobrevive a un{" "}
            <strong className="text-foreground">refresh</strong> de
            página, y el botón de atrás/adelante del navegador funciona
            solo. El costo es que solo se pueden guardar datos
            serializables a string, con límites de longitud.
          </p>
          <p>
            El costo real de levantar estado a un store global antes de
            tener una necesidad concreta es de{" "}
            <strong className="text-foreground">acoplamiento</strong> y{" "}
            <strong className="text-foreground">re-renders</strong>:
            cualquier componente que lo lea queda sujeto a re-renderizar
            por cambios que antes solo afectaban a un componente
            aislado, y entender el código requiere rastrear todos los
            lugares que lo leen o modifican, no solo un componente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Guardar un filtro compartible en un store en memoria en vez
              de en la URL.
            </strong>{" "}
            Se pierde al hacer refresh y no se puede compartir por link.
          </li>
          <li>
            <strong className="text-foreground">
              Levantar estado a global &quot;para no tener que hacerlo
              después&quot;.
            </strong>{" "}
            Paga el costo de acoplamiento sin ningún beneficio todavía.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Filtros de un listado de productos en query params, para que
            el link con filtros aplicados sea compartible.
          </li>
          <li>
            Reconocer cuándo usar Context/store global tiene sentido:
            solo cuando ramas lejanas y no relacionadas del árbol
            realmente necesitan el mismo dato.
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
            El principio de{" "}
            <strong className="text-foreground">
              colocación de estado
            </strong>{" "}
            propone moverse por niveles, empezando por el más chico:
            variable local sin estado → useState/useReducer local → URL →
            padre común más cercano → Context o librería global, subiendo
            de nivel solo cuando hay una necesidad real. La mayoría del
            estado de una app típica se resuelve en los primeros dos o
            tres niveles.
          </p>
          <p>
            Antes de preguntarse EN QUÉ NIVEL debería vivir un dato, hay
            que preguntarse si es realmente estado independiente, o si
            puede CALCULARSE a partir de datos que ya existen — un total,
            una lista filtrada, un booleano de validez casi siempre se
            derivan directo en el render (o con useMemo). Promoverlos a
            estado propio y encima subirlos a un store global combina dos
            errores a la vez.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Saltar directo a un store global sin descartar los niveles
              anteriores.
            </strong>{" "}
            La regla práctica es no subir de nivel sin haber descartado
            honestamente los más chicos.
          </li>
          <li>
            <strong className="text-foreground">
              Promover un dato derivable a estado propio en un store
              global.
            </strong>{" "}
            Combina el error del estado innecesario con el de su
            ubicación innecesariamente alta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar el framework de colocación como checklist en code review,
            cuestionando cada nuevo store global propuesto.
          </li>
          <li>
            Auditar un store global existente buscando datos que en
            realidad son derivables y no necesitan ser estado en
            absoluto.
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
