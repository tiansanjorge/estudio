import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaCustomHooks } from "@/lib/modules/hooks/custom-hooks-entrevista";

const preguntasPorNivel = {
  1: entrevistaCustomHooks.filter((p) => p.nivel === 1),
  2: entrevistaCustomHooks.filter((p) => p.nivel === 2),
  3: entrevistaCustomHooks.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Custom Hooks — Dev Study Lab",
  description:
    "Un custom hook es una función que empieza con 'use' y llama a otros hooks — la forma nativa de React de compartir lógica con estado sin HOCs ni render props.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace que una función sea un 'custom hook'?",
    opciones: [
      "Que devuelva JSX",
      "Que su nombre empiece con 'use' y llame internamente a otros hooks",
      "Que esté definida en un archivo separado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Esa combinación permite compartir lógica con estado entre componentes, sin duplicar código ni recurrir a HOCs o render props.",
  },
  {
    pregunta: "Dos componentes distintos usan el mismo custom hook. ¿Comparten el mismo estado?",
    opciones: [
      "Sí, es una única instancia compartida",
      "No, cada componente obtiene su propia instancia independiente del estado del hook",
      "Solo si están en el mismo archivo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es como si el código del hook se copiara y pegara en cada componente que lo usa — cada llamada tiene su propio useState/useEffect internos, sin relación entre sí.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo conviene que un custom hook devuelva un array en vez de un objeto?",
    opciones: [
      "Siempre, un array es la única forma correcta",
      "Cuando hay pocos valores relacionados y simétricos, dando libertad de renombrar por posición al destructurar (como useState)",
      "Nunca, los objetos son siempre preferibles",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con varios valores de roles distintos, un objeto es más autodocumentado — no hay que memorizar en qué posición del array está cada cosa.",
  },
  {
    pregunta:
      "¿Qué ventaja tiene componer un custom hook específico sobre uno más genérico (como useUsuario sobre useFetch)?",
    opciones: [
      "Ninguna, siempre es mejor duplicar la lógica en cada hook",
      "Aísla cambios: si la lógica genérica se ajusta, todos los hooks específicos que la usan se benefician automáticamente desde un solo lugar",
      "Hace que el hook específico sea más lento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Evita reimplementar el manejo de estados de carga/error en cada hook puntual, formando capas de abstracción reutilizables.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué el prefijo 'use' en un custom hook no es solo estilo?",
    opciones: [
      "Es puramente estético, sin ningún efecto técnico",
      "eslint-plugin-react-hooks usa ese patrón de nombre para saber qué funciones auditar con las reglas de los hooks — sin el prefijo, no las verifica",
      "React rechaza en runtime cualquier función que no empiece con 'use'",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin el prefijo correcto, el linter no reconoce la función como hook y deja pasar violaciones reales de las reglas de los hooks sin ningún aviso.",
  },
  {
    pregunta:
      "¿Por qué no se puede llamar a un custom hook como una función normal fuera de un componente para testearlo?",
    opciones: [
      "Sí se puede, sin ninguna restricción",
      "Porque los hooks internos dependen de un fiber activo de React al cual asociar su estado — sin eso, React lanza un error de 'Invalid hook call'",
      "Porque los custom hooks solo funcionan en TypeScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para testear de forma aislada se usa renderHook, que monta un componente de prueba mínimo solo para darle al hook un contexto de renderizado válido.",
  },
];

export default function CustomHooksPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Hooks"
      titulo="Custom Hooks"
      descripcion="Un custom hook es simplemente una función que empieza con 'use' y llama a otros hooks — la forma nativa de React de compartir lógica con estado entre componentes, sin HOCs ni render props."
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
            Un custom hook es una función cuyo nombre empieza con{" "}
            <code>use</code>, y que internamente llama a otros hooks (
            <code>useState</code>, <code>useEffect</code>, u otros custom
            hooks). Esa combinación permite compartir LÓGICA CON ESTADO
            entre componentes distintos, sin duplicar código ni recurrir
            a HOCs o render props.
          </p>
          <p>
            Cada componente que llama al custom hook obtiene su propia
            instancia independiente de ese estado — como si el código del
            hook se hubiera copiado y pegado directamente en cada
            componente que lo usa, no una instancia única compartida
            entre todos.
          </p>
          <p>
            La señal para extraer un custom hook es la misma que para
            extraer un componente: ver la misma combinación de hooks
            repetida en dos o más lugares resolviendo el mismo problema —
            no la posibilidad teórica de reutilización futura.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              No prefijar la función con &quot;use&quot;.
            </strong>{" "}
            Rompe el reconocimiento del linter de reglas de hooks y
            confunde el modelo mental de que es un hook.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que dos componentes que usan el mismo custom hook
              comparten el mismo estado.
            </strong>{" "}
            Cada llamada crea su propia instancia independiente, sin
            relación entre sí.
          </li>
          <li>
            <strong className="text-foreground">
              Extraer un custom hook antes de ver la repetición real.
            </strong>{" "}
            Igual que con componentes, la extracción prematura agrega
            indirección sin necesidad concreta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <code>useLocalStorage</code> para leer y sincronizar un valor
            con localStorage desde cualquier componente.
          </li>
          <li>
            <code>useToggle</code> para un booleano con función de
            alternar, reutilizado en varios lugares de la app.
          </li>
          <li>
            <code>useMediaQuery</code> para suscribirse a un breakpoint
            de CSS desde JavaScript, sin repetir la lógica de
            addEventListener/cleanup en cada componente.
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
          <p>
            Dos componentes usan este hook. Uno de los dos, sin embargo,
            no ve el contador del otro actualizarse. ¿Es un bug?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function useContadorGlobal() {
  const [cuenta, setCuenta] = useState(0);
  return { cuenta, incrementar: () => setCuenta((c) => c + 1) };
}

function ComponenteA() {
  const { cuenta, incrementar } = useContadorGlobal();
  return <button onClick={incrementar}>A: {cuenta}</button>;
}

function ComponenteB() {
  const { cuenta } = useContadorGlobal();
  return <p>B: {cuenta}</p>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              No es un bug — es el comportamiento esperado. Cada
              componente que llama a <code>useContadorGlobal()</code>{" "}
              obtiene su PROPIA instancia de <code>cuenta</code>, con su
              propio <code>useState</code> interno. Incrementar el
              contador de <code>ComponenteA</code> no tiene ninguna
              relación con el de <code>ComponenteB</code>, aunque el
              nombre del hook sugiera algo &quot;global&quot;.
            </p>
            <p className="mt-2">
              Si de verdad se necesita un contador compartido entre
              ambos, un custom hook no alcanza — hace falta levantar el
              estado a un padre común (o usar Context) y pasarlo hacia
              abajo, en vez de que cada componente tenga su propia
              instancia independiente.
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
            Devolver un ARRAY (<code>{"[valor, setValor]"}</code>) le da a
            quien usa el hook libertad de renombrar cada elemento
            libremente al destructurar, por posición — cómodo para usarlo
            varias veces con nombres distintos. Devolver un OBJETO (
            <code>{"{ valor, setValor }"}</code>) es más autodocumentado
            cuando hay varios valores con roles distintos, aunque obliga
            a renombrar explícitamente si hay colisión de nombres.
          </p>
          <p>
            Un custom hook puede llamar a otros custom hooks internamente,
            formando capas de abstracción: un <code>useFetch</code>{" "}
            genérico que maneja el ciclo de carga/éxito/error, y un{" "}
            <code>useUsuario(id)</code> más específico construido sobre
            él. Esto aísla cambios: si la lógica genérica necesita
            ajustarse, todos los hooks específicos se benefician
            automáticamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Devolver un objeto con muchos valores sin agrupar por rol.
            </strong>{" "}
            Dificulta saber de un vistazo qué se está usando realmente en
            cada destructuring.
          </li>
          <li>
            <strong className="text-foreground">
              Duplicar lógica de manejo de estados de carga en cada hook
              específico en vez de componer sobre uno genérico.
            </strong>{" "}
            Cualquier ajuste futuro hay que replicarlo en cada copia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un useFetch genérico reutilizado por useUsuario, useProductos,
            usePedidos, cada uno dándole forma al resultado para su caso.
          </li>
          <li>
            Varios useState del mismo tipo devueltos como array, para
            usarlos con nombres distintos en el mismo componente (como
            varias dimensiones de una ventana).
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
            El prefijo <code>use</code> no es solo legible para humanos:{" "}
            <code>eslint-plugin-react-hooks</code> usa ese patrón de
            nombre (<code>use[A-Z]</code>) para saber qué funciones tratar
            como hooks y verificar las reglas de los hooks dentro de
            ellas. Sin el prefijo correcto, el linter no reconoce la
            función y deja pasar violaciones reales sin ningún aviso.
          </p>
          <p>
            Un custom hook no puede llamarse como función suelta fuera de
            un componente: los hooks internos dependen de un fiber activo
            de React al cual asociar su estado. Para testearlo de forma
            aislada se usa <code>renderHook</code> (React Testing
            Library), que monta un componente de prueba mínimo solo para
            darle al hook un contexto de renderizado válido.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Confiar en que el linter detecta violaciones en una función
              sin el prefijo use.
            </strong>{" "}
            Simplemente no la analiza como hook.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar llamar a un custom hook directamente en un test
              sin renderHook.
            </strong>{" "}
            React lanza &quot;Invalid hook call&quot; al no haber un fiber
            activo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Testear un custom hook complejo (con múltiples transiciones
            de estado) de forma aislada con renderHook, sin montar
            ningún componente real de la app.
          </li>
          <li>
            Auditar nombres de funciones que usan hooks internamente pero
            no siguen la convención use-, como fuente de bugs silenciosos
            no detectados por el linter.
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
