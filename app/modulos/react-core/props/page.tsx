import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PropsArbolSimulador } from "@/components/modulo/PropsArbolSimulador";
import { PropsInspector } from "@/components/modulo/PropsInspector";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosPropDrilling } from "@/lib/modules/react-core/prop-drilling";
import { entrevistaProps } from "@/lib/modules/react-core/props-entrevista";

const preguntasPorNivel = {
  1: entrevistaProps.filter((p) => p.nivel === 1),
  2: entrevistaProps.filter((p) => p.nivel === 2),
  3: entrevistaProps.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Props — Dev Study Lab",
  description:
    "Props es simplemente un objeto. Entender eso resuelve la mitad de las dudas típicas sobre cómo se comunican los componentes.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué tipo de dato es 'props' en un componente de función?",
    opciones: [
      "Una clase especial de React",
      "Un objeto JavaScript normal, con una clave por cada prop pasada",
      "Un array de valores en orden",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "<Tarjeta nombre='Ana' activo={true} /> simplemente llama a Tarjeta({ nombre: 'Ana', activo: true }). Es un objeto común, nada mágico.",
  },
  {
    pregunta: "¿Qué es 'children' en términos de props?",
    opciones: [
      "Una API completamente distinta a props",
      "Una prop más, cuyo valor es lo que se escribió entre las etiquetas de apertura y cierre del componente",
      "Solo existe en componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "children no es magia: es simplemente la prop que React arma automáticamente con el contenido que pusiste entre <Componente>...</Componente>.",
  },
  {
    pregunta: "¿Cuál es el problema principal del prop drilling?",
    opciones: [
      "Que React lo prohíbe explícitamente",
      "Que componentes intermedios terminan acoplados a datos que no usan, solo para reenviarlos",
      "Que hace que la app sea más lenta",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El problema no es de performance, es de mantenimiento: cada componente en el medio del camino tiene que conocer y reenviar props que no le importan, y agregar un dato nuevo obliga a tocarlos a todos.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué riesgo tiene hacer {...props} sin filtrar sobre un elemento del DOM?",
    opciones: [
      "Ninguno, React filtra automáticamente lo que no corresponde",
      "Cualquier prop que no sea un atributo HTML válido termina como atributo desconocido en el DOM, con warning en consola",
      "Hace que el componente sea más lento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Además del warning, se pierde control sobre la API pública del componente: cualquiera puede pasar cualquier prop, incluso colisionando con una manejada internamente.",
  },
  {
    pregunta:
      "¿Qué reemplaza a defaultProps en componentes de función modernos?",
    opciones: [
      "Ya no se pueden dar valores por defecto a props",
      "Valores por defecto en el destructuring de parámetros, JavaScript estándar sin API especial de React",
      "Un hook llamado useDefaultProps",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es más simple y explícito en el mismo lugar donde se leen los props, sin depender de una propiedad estática separada que sincronizar con la firma del componente.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Dentro de un componente, ¿podés leer props.key?",
    opciones: [
      "Sí, funciona como cualquier otro prop",
      "No, key es un prop reservado que React intercepta antes de que llegue al objeto de props del componente",
      "Solo en componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si necesitás ese valor dentro del componente, hay que pasarlo también como un prop distinto con otro nombre — leer props.key siempre da undefined.",
  },
  {
    pregunta:
      "¿Por qué pasar un árbol costoso como children (en vez de crearlo inline) puede evitar re-renders innecesarios?",
    opciones: [
      "Porque children siempre se memoiza automáticamente por React",
      "Porque quien creó ese elemento JSX más arriba no volvió a ejecutarse, así que sigue siendo la misma referencia y React puede saltear su reconciliación",
      "Porque children nunca se renderiza si el padre cambia de estado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es la base del patrón 'levantar el contenido, no el estado': si el padre que cambia de estado recibe ese árbol costoso como prop en vez de crearlo, React ve la misma referencia entre renders y salta esa parte.",
  },
];

export default function PropsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Props"
      descripcion="Props es, ni más ni menos, un objeto que un componente recibe como argumento. Todo lo demás — children, valores por defecto, prop drilling — sale de esa idea simple."
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
            <code>{"<Tarjeta nombre=\"Ana\" activo={true} />"}</code> es, en
            el fondo, un llamado a{" "}
            <code>{"Tarjeta({ nombre: 'Ana', activo: true })"}</code>. Los
            props no son un concepto especial de React — son el objeto
            que se le pasa a la función del componente. Nada más.
          </p>
          <p>
            <code>children</code> es una prop más, con un tratamiento
            especial por parte de JSX: es lo que se escribió entre la
            etiqueta de apertura y cierre del componente. Un componente
            que hace <code>{"{children}"}</code> en su JSX no necesita
            saber nada sobre qué le van a poner adentro.
          </p>
          <p>
            Cuando un dato tiene que atravesar varios niveles de
            componentes que no lo usan, solo lo reenvían, aparece el{" "}
            <strong className="text-foreground">prop drilling</strong>.
            No rompe nada, pero acopla componentes intermedios a datos que
            no les importan. Composición con <code>children</code> es una
            de las formas más simples de evitarlo cuando el problema es
            &ldquo;un componente de layout necesita envolver a otro&rdquo;.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <PropsArbolSimulador escenarios={escenariosPropDrilling} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Editá los props de TarjetaPerfil y mirá, en vivo, el objeto que
          realmente recibe el componente.
        </p>
        <PropsInspector />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Pasar demasiados props sueltos en vez de un objeto.
            </strong>{" "}
            Si un componente recibe 8 props relacionados, casi siempre
            conviene agruparlos en un objeto tipado en vez de listarlos
            todos sueltos.
          </li>
          <li>
            <strong className="text-foreground">
              Prop drilling forzado cuando children resolvía todo.
            </strong>{" "}
            Si el problema es &ldquo;este componente de layout tiene que
            envolver a otro&rdquo;, casi nunca hace falta pasar datos por
            props intermedios — con children alcanza.
          </li>
          <li>
            <strong className="text-foreground">
              No tipar los props (o usar any).
            </strong>{" "}
            Pierde la ventaja más grande de TypeScript acá: que el editor
            te avise si te olvidaste un prop obligatorio o le pasaste el
            tipo equivocado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Usar children para componentes de layout genéricos (
            <code>Modal</code>, <code>Card</code>,{" "}
            <code>PageContainer</code>) que no necesitan saber qué
            contenido específico van a envolver.
          </li>
          <li>
            Tipar los props con una interface para documentar la API del
            componente y detectar errores en tiempo de compilación.
          </li>
          <li>
            Reconocer cuándo el prop drilling ya es excesivo (3+ niveles
            de componentes que no usan el dato) como señal de que hace
            falta otra herramienta — Context, que viene más adelante en el
            roadmap.
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
            Este layout tiene prop drilling: <code>tema</code> atraviesa{" "}
            <code>Pagina</code> sin que ese componente lo use para nada.
            ¿Cómo lo simplificarías usando children?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Pagina({ tema, children }) {
  return <div className={tema}>{children}</div>;
}

function App() {
  const tema = 'oscuro';
  return (
    <Pagina tema={tema}>
      <Encabezado tema={tema} />
      <Contenido tema={tema} />
    </Pagina>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El código ya usa <code>children</code> para el layout — el
              drilling real está en pasarle <code>tema</code> a{" "}
              <code>Encabezado</code> y <code>Contenido</code> por
              separado. Si ambos solo necesitan aplicar una clase CSS
              según el tema, conviene resolverlo con Context (para no
              tener que pasar <code>tema</code> explícitamente a cada
              uno) — algo que vamos a ver en el módulo de Context más
              adelante.
            </p>
            <p className="mt-2">
              Por ahora, sin Context, la opción más simple es que{" "}
              <code>App</code> arme directamente el JSX ya &ldquo;vestido&rdquo;
              y se lo pase a <code>Pagina</code> como children, en vez de
              que <code>Pagina</code> reciba <code>tema</code> para nada:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Pagina({ children }) {
  return <div>{children}</div>;
}

function App() {
  const tema = 'oscuro';
  return (
    <Pagina>
      <div className={tema}>
        <Encabezado tema={tema} />
        <Contenido tema={tema} />
      </div>
    </Pagina>
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Hacer spread de props sin filtrar (<code>{"{...props}"}</code>)
            sobre un elemento del DOM arriesga terminar con atributos
            desconocidos en el HTML real (warning de React) y pierde
            control sobre la API pública del componente: cualquiera puede
            pasar cualquier prop, incluso una que colisione con una
            manejada internamente.
          </p>
          <p>
            Los hooks reemplazaron el patrón{" "}
            <strong className="text-foreground">render props</strong>{" "}
            (children como función) para la mayoría de los casos de reuso
            de lógica pura. Render props siguen siendo útiles cuando el
            componente también necesita controlar parte del renderizado —
            por ejemplo, un componente de lista que sabe paginar pero deja
            que el consumidor decida cómo se ve cada fila.
          </p>
          <p>
            <code>defaultProps</code> en componentes de función está en
            desuso: la forma moderna es un valor por defecto en el
            destructuring de parámetros, JavaScript estándar sin API
            especial de React.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Spread ciego de props hacia el DOM sin filtrar.
            </strong>{" "}
            Termina en atributos HTML desconocidos y una API de componente
            sin límites claros.
          </li>
          <li>
            <strong className="text-foreground">
              Usar defaultProps en componentes de función nuevos.
            </strong>{" "}
            Está deprecado; usar valores por defecto en el destructuring
            directamente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Render props para un componente de lista/tabla genérico que
            controla la paginación pero delega el renderizado de cada
            fila al consumidor.
          </li>
          <li>
            Filtrar explícitamente qué props se reenvían al DOM en
            componentes wrapper de un design system, en vez de spread
            ciego.
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
            <code>key</code> (y <code>ref</code> en componentes de función
            sin forwardRef) es un prop reservado que React intercepta
            antes de que llegue al objeto de props del componente. Leer{" "}
            <code>props.key</code> dentro del componente siempre da{" "}
            <code>undefined</code> — si se necesita ese valor internamente,
            hay que pasarlo también como otro prop con distinto nombre.
          </p>
          <p>
            Cuando un componente padre re-renderiza por un cambio de
            estado local, React igual reconcilia sus hijos — salvo que un
            elemento JSX se reciba como{" "}
            <strong className="text-foreground">prop</strong> (por ejemplo{" "}
            <code>children</code>) en vez de crearse en el cuerpo del
            componente que cambió de estado. Ahí React ve la misma
            referencia entre renders y puede saltear por completo la
            reconciliación de ese subárbol — la base del patrón
            &quot;levantar el contenido, no el estado&quot;.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Intentar leer props.key para lógica interna.
            </strong>{" "}
            Siempre es undefined; hay que duplicar el valor en otro prop.
          </li>
          <li>
            <strong className="text-foreground">
              Definir un árbol costoso dentro de un componente que cambia
              de estado seguido.
            </strong>{" "}
            Se recrea (y reconcilia) en cada render, aunque no dependa del
            estado que cambió — pasar como children desde más arriba lo
            evita.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Envolver un árbol pesado (un gráfico, una tabla grande) como
            children de un componente que maneja estado local frecuente
            (un contador, un tooltip), para que no se reconciliate en cada
            cambio de ese estado.
          </li>
          <li>
            Diseñar componentes genéricos con un prop `id` explícito
            además de `key`, sabiendo que key nunca es accesible
            internamente.
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
