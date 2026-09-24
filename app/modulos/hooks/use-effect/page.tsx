import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaUseEffect } from "@/lib/modules/hooks/use-effect-entrevista";

const preguntasPorNivel = {
  1: entrevistaUseEffect.filter((p) => p.nivel === 1),
  2: entrevistaUseEffect.filter((p) => p.nivel === 2),
  3: entrevistaUseEffect.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "useEffect — Dev Study Lab",
  description:
    "useEffect sincroniza un componente con algo externo a React, después del commit. El array de dependencias decide cuándo se vuelve a ejecutar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia hay entre useEffect(fn), useEffect(fn, []) y useEffect(fn, [a, b])?",
    opciones: [
      "Sin array: en cada render; []: solo al montar; [a, b]: al montar y cuando cambien",
      "Sin array: solo al montar; []: en cada render; [a, b]: cuando cambien",
      "Sin array: nunca; []: solo al montar; [a, b]: cuando cambien, no al montar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El array de dependencias controla cuándo React decide volver a ejecutar el efecto, comparando cada valor contra el del render anterior.",
  },
  {
    pregunta: "¿Cuándo hace falta una función de cleanup en un useEffect?",
    opciones: [
      "Cuando el efecto cambia estado, para deshacer el cambio al desmontar",
      "Cuando el efecto deja algo vivo: un listener, un timer, una suscripción",
      "Cuando el efecto es async, para esperar a que termine la promesa",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin cleanup, cada re-ejecución del efecto (o el desmontaje del componente) deja esa suscripción viva, acumulándose — listeners duplicados, timers sin cancelar, memory leaks.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Un fetch dentro de un useEffect depende de un query que cambia rápido. ¿Qué riesgo hay sin protección adicional?",
    opciones: [
      "Que React cancela el fetch anterior y el componente queda sin datos",
      "Un loop infinito: cada respuesta cambia el query y dispara otro fetch",
      "Race condition: una respuesta vieja puede llegar después y pisar la nueva",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "La solución estándar es usar el cleanup como bandera de 'ya no vigente', o un AbortController para cancelar la request anterior cuando el efecto se vuelve a ejecutar.",
  },
  {
    pregunta:
      "¿Conviene un único useEffect con varias responsabilidades, o varios chicos y enfocados?",
    opciones: [
      "Varios chicos: uno grande se re-ejecuta entero por cambios ajenos a sus partes",
      "Uno solo: cada useEffect extra agrega un render adicional al componente",
      "Uno solo: React no garantiza el orden entre efectos y podrían pisarse entre sí",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Separarlos deja que cada efecto reaccione solo a lo que realmente le importa, y facilita razonar sobre qué efecto hace qué cuando algo falla.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué problema resuelve useEffectEvent que omitir una dependencia a mano no resuelve bien?",
    opciones: [
      "Correr el efecto de forma síncrona antes del paint, como useLayoutEffect",
      "Leer siempre el valor más reciente sin que ese valor dispare el efecto",
      "Omitir dependencias sin que el linter se queje, con el mismo resultado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Separa explícitamente qué dispara el efecto (las dependencias reales) de qué valores necesita leer siempre actualizados, sin disparar nada.",
  },
  {
    pregunta:
      "¿Por qué Strict Mode invoca dos veces el ciclo montar→limpiar→montar de los efectos en desarrollo?",
    opciones: [
      "Para medir cuánto tarda cada efecto y avisar si supera un frame",
      "Porque en desarrollo React desactiva el batching y repite cada efecto",
      "Para exponer cleanups faltantes, que dejan suscripciones duplicadas",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Un bug que en un solo montaje normal podría pasar desapercibido en desarrollo aparece de inmediato con el patrón doble de Strict Mode.",
  },
];

export default function UseEffectPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="useEffect"
      descripcion="useEffect sincroniza un componente con algo externo a React — no es un lugar general para 'código que corre después del render', es específicamente para conectar con sistemas fuera de React."
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
            El array de dependencias de <code>useEffect</code> decide
            cuándo React vuelve a ejecutar el efecto. Sin array, corre
            después de CADA render. Con <code>[]</code>, corre una sola
            vez, después del montaje. Con{" "}
            <code>{"[a, b]"}</code>, corre al montar y cada vez que{" "}
            <code>a</code> o <code>b</code> cambiaron respecto al render
            anterior.
          </p>
          <p>
            Cuando el efecto se suscribe a algo que sigue existiendo
            después de correr (un event listener, un{" "}
            <code>setInterval</code>, una suscripción), hace falta una
            función de <strong className="text-foreground">
            cleanup</strong>: la función que el efecto retorna, y que
            React corre automáticamente antes de la próxima ejecución del
            efecto, y al desmontar el componente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Omitir una dependencia real del array.
            </strong>{" "}
            El efecto queda con una closure sobre el valor viejo de esa
            variable — un bug silencioso conocido como stale closure.
          </li>
          <li>
            <strong className="text-foreground">
              Usar un objeto, array o función nuevo como dependencia en
              cada render.
            </strong>{" "}
            Su referencia cambia siempre, así que el efecto se dispara en
            cada render, aunque el contenido sea el mismo — riesgo de loop
            infinito si el efecto además actualiza estado.
          </li>
          <li>
            <strong className="text-foreground">
              Usar useEffect para calcular algo que se podría derivar
              directo en el render.
            </strong>{" "}
            Cuesta un render extra y agrega complejidad innecesaria.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Suscribirse a un evento del navegador (resize, scroll) y
            desuscribirse en el cleanup.
          </li>
          <li>
            Sincronizar con localStorage, un WebSocket, o cualquier
            sistema externo a React.
          </li>
          <li>
            Hacer fetch de datos al montar o cuando cambia un parámetro
            relevante (un id de recurso, un filtro).
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
            Este componente sigue mostrando el conteo de clicks del
            elemento anterior después de cambiar de elementoId. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function ContadorClicks({ elementoId }) {
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const el = document.getElementById(elementoId);
    const manejar = () => setClicks((c) => c + 1);
    el.addEventListener('click', manejar);
  }, [elementoId]);

  return <p>{clicks}</p>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El efecto agrega un listener cada vez que{" "}
              <code>elementoId</code> cambia, pero nunca remueve el
              anterior — no hay función de cleanup. Con cada cambio, se
              acumula un listener más, todos incrementando el mismo{" "}
              <code>clicks</code>.
            </p>
            <p className="mt-2">El fix es remover el listener en el cleanup:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`useEffect(() => {
  const el = document.getElementById(elementoId);
  const manejar = () => setClicks((c) => c + 1);
  el.addEventListener('click', manejar);
  return () => el.removeEventListener('click', manejar);
}, [elementoId]);`}
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
            Si un fetch dentro de un efecto depende de un valor que puede
            cambiar rápido (un query de búsqueda), no hay garantía de que
            las respuestas lleguen en el mismo orden en que se enviaron —
            una{" "}
            <strong className="text-foreground">race condition</strong>{" "}
            donde un fetch viejo sobreescribe el resultado de uno más
            nuevo. La solución estándar es usar el cleanup como bandera de
            &quot;ya no vigente&quot;, o un <code>AbortController</code>{" "}
            para cancelar la request en curso cuando el efecto se vuelve a
            ejecutar.
          </p>
          <p>
            Mezclar varias responsabilidades no relacionadas en un solo
            efecto obliga a que su array de dependencias combine todo lo
            que cualquiera de ellas necesita, disparando el efecto
            completo por cambios que solo le importan a una parte.
            Preferir varios <code>useEffect</code> chicos y enfocados.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No proteger un fetch dependiente de un valor que cambia
              rápido.
            </strong>{" "}
            Puede terminar mostrando el resultado de una búsqueda vieja.
          </li>
          <li>
            <strong className="text-foreground">
              Un solo useEffect gigante con varias responsabilidades
              mezcladas.
            </strong>{" "}
            Dispara todo por cambios que solo afectan a una parte de la
            lógica.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            AbortController en un buscador con autocompletado, para
            cancelar la request anterior en cada tecla nueva.
          </li>
          <li>
            Separar el efecto que sincroniza el título del documento del
            que hace fetch de datos, aunque estén en el mismo componente.
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
            <code>useEffectEvent</code> resuelve el caso donde un efecto
            necesita reaccionar a UN valor, pero también usa otro que
            cambia seguido y NO debería disparar el efecto de nuevo.
            Omitir ese segundo valor de las dependencias a mano deja una
            closure sobre su valor VIEJO para siempre (stale closure);{" "}
            <code>useEffectEvent</code> envuelve esa lógica en una función
            que siempre ve la versión más reciente, sin necesitar estar en
            el array de dependencias.
          </p>
          <p>
            React Strict Mode invoca dos veces el ciclo montar→limpiar→
            montar de los efectos en desarrollo específicamente para
            exponer cleanups faltantes o incorrectos: si el cleanup no
            desuscribe bien, el segundo montaje deja dos suscripciones
            activas, visibles de inmediato en desarrollo en vez de
            aparecer como un bug intermitente en producción.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Omitir una dependencia &quot;por comodidad&quot; en vez de
              usar useEffectEvent cuando corresponde.
            </strong>{" "}
            Introduce un stale closure silencioso.
          </li>
          <li>
            <strong className="text-foreground">
              Ignorar un log duplicado en desarrollo asumiendo que es un
              bug de Strict Mode.
            </strong>{" "}
            Casi siempre es un cleanup real faltante que se manifestaría
            en producción bajo otro patrón de uso.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar useEffectEvent para loguear un valor de configuración
            actual dentro de un efecto de conexión que solo debe
            reconectar cuando cambia el id de la sala, no la configuración.
          </li>
          <li>
            Confiar en Strict Mode durante desarrollo para detectar
            suscripciones duplicadas antes de que lleguen a producción.
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
