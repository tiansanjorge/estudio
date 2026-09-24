import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PropsArbolSimulador } from "@/components/modulo/PropsArbolSimulador";
import { PanelComposable } from "@/components/modulo/PanelComposable";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosComposicion } from "@/lib/modules/react-core/composicion";
import { entrevistaComposicion } from "@/lib/modules/react-core/composicion-entrevista";

const preguntasPorNivel = {
  1: entrevistaComposicion.filter((p) => p.nivel === 1),
  2: entrevistaComposicion.filter((p) => p.nivel === 2),
  3: entrevistaComposicion.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Composition — Dev Study Lab",
  description:
    "React no tiene herencia de componentes. En su lugar, arma UIs complejas combinando piezas chicas — composición en vez de configuración.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema tiene un componente con muchos props booleanos como esPrimario, esGrande, tieneIcono?",
    opciones: [
      "Ninguno, es la forma recomendada de escalar un componente",
      "Cada variante nueva agrega otro prop, y el componente tiene que saber renderizar internamente todas las combinaciones posibles",
      "TypeScript no permite más de 3 props booleanos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Este patrón (configuración) escala mal: el componente termina con una explosión combinatoria de casos internos. Composición resuelve esto delegando cada variante a una pieza chica y reutilizable.",
  },
  {
    pregunta: "¿Qué es 'composición' en el contexto de componentes de React?",
    opciones: [
      "Heredar de una clase base compartida",
      "Combinar componentes chicos y enfocados para armar comportamientos más complejos",
      "Escribir todo el CSS en un solo archivo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React no tiene herencia entre componentes. La forma de reutilizar y extender comportamiento es combinando piezas más simples, no extendiendo una clase.",
  },
  {
    pregunta: "¿Qué diferencia hay entre usar children y usar props con nombre (como izquierda/derecha) para pasar contenido?",
    opciones: [
      "Son exactamente lo mismo",
      "children sirve para un único slot de contenido; props con nombre permiten varios slots independientes en el mismo componente",
      "props con nombre solo funcionan con texto, no con JSX",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "children es la prop especial para un solo bloque de contenido. Cuando un componente necesita más de un punto de inserción (como un panel con izquierda y derecha), se usan props normales cuyo valor es JSX.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué los hooks reemplazaron a los HOC en la mayoría de los casos de reuso de lógica?",
    opciones: [
      "Los HOC fueron eliminados de React",
      "Los hooks comparten la misma lógica sin agregar componentes envolventes al árbol ni riesgo de colisión de props inyectadas",
      "Los HOC solo funcionan con TypeScript, los hooks no",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Componer varios HOC anidados genera 'wrapper hell' visible en las devtools y colisiones de nombres de props. Un hook se llama directo dentro del componente, sin wrapping.",
  },
  {
    pregunta:
      "¿Qué ventaja da tipar los slots de un componente compuesto con props explícitas en vez de un solo children?",
    opciones: [
      "Ninguna, TypeScript trata ambos casos igual",
      "TypeScript puede exigir que cada slot esté presente y el editor sugiere exactamente qué props existen",
      "Solo funciona si el componente es una clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Con children genérico no hay forma de expresar 'necesito exactamente dos elementos, uno por lado' — el error de uso incorrecto recién se nota en runtime, no en compilación.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué problema resuelve el patrón 'asChild' usado en librerías como Radix UI?",
    opciones: [
      "Mejora la performance de renderizado",
      "Permite que un componente de comportamiento renderice como distintos elementos HTML finales (button, a) sin duplicar su lógica para cada uno",
      "Reemplaza la necesidad de props en un componente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Usa React.cloneElement para fusionar las props del componente de comportamiento con el único elemento hijo recibido, en vez de forzar siempre su propio elemento envolvente.",
  },
  {
    pregunta:
      "¿Cuál es el riesgo principal de usar React.cloneElement para inyectar props en children?",
    opciones: [
      "Ninguno, es una API completamente segura",
      "Asume que sabés exactamente qué tipo de elemento(s) va a recibir como children; se rompe si el consumidor pasa algo distinto a lo esperado",
      "Solo funciona con componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un patrón frágil que depende de una convención implícita. Para coordinación más general entre padre e hijos, un compound component basado en Context es más robusto.",
  },
];

export default function CompositionPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Composition"
      descripcion="React no tiene herencia de componentes. La forma de escalar y reutilizar UI es combinando piezas chicas — no agregando cada vez más props a un componente gigante."
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
            Cuando un componente necesita cubrir cada vez más variantes,
            hay dos caminos.{" "}
            <strong className="text-foreground">Configuración</strong>:
            agregarle más props booleanos y condicionales internos hasta
            que sabe hacer de todo (y se vuelve difícil de mantener).{" "}
            <strong className="text-foreground">Composición</strong>:
            dejarlo simple, y armar las variantes combinándolo con otras
            piezas chicas desde afuera.
          </p>
          <p>
            Ya vimos <code>children</code> como una forma de composición
            — un componente que envuelve &ldquo;lo que sea&rdquo; sin
            saber qué es. Pero a veces un componente necesita más de un
            punto de inserción: ahí se usan props normales cuyo valor es
            JSX (como <code>izquierda</code> y <code>derecha</code> en un
            panel dividido), en vez de forzar todo por{" "}
            <code>children</code>.
          </p>
          <p>
            La idea de fondo es la misma que con funciones puras: piezas
            chicas, con una sola responsabilidad, que se combinan para
            lograr comportamientos complejos — en vez de una pieza
            gigante que intenta anticipar cada caso posible.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <PropsArbolSimulador escenarios={escenariosComposicion} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          SplitPane no sabe qué es una &ldquo;Lista&rdquo; ni un
          &ldquo;Formulario&rdquo; — solo posiciona lo que le pasás en
          cada slot.
        </p>
        <PanelComposable />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Agregar un prop booleano por cada variante nueva.
            </strong>{" "}
            Es la señal más clara de que un componente debería dividirse
            en piezas más chicas.
          </li>
          <li>
            <strong className="text-foreground">
              Forzar todo por children cuando hacen falta varios slots.
            </strong>{" "}
            Si un componente necesita insertar contenido en dos o más
            lugares distintos de su layout, un solo children no alcanza —
            usá props con nombre.
          </li>
          <li>
            <strong className="text-foreground">
              Buscar herencia entre componentes.
            </strong>{" "}
            React no tiene (ni necesita) extends entre componentes de
            función. El equivalente es componer, no heredar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Layouts genéricos (<code>Modal</code>, <code>Panel</code>,{" "}
            <code>Card</code>) que reciben su contenido desde afuera en
            vez de conocerlo de antemano.
          </li>
          <li>
            Componentes con múltiples slots (un <code>Layout</code> con{" "}
            <code>header</code>, <code>sidebar</code> y{" "}
            <code>contenido</code> como props separados).
          </li>
          <li>
            El patrón de &ldquo;compound components&rdquo; (como{" "}
            <code>{"<Tabs><Tabs.Tab /></Tabs>"}</code>), donde varias
            piezas relacionadas se componen juntas y comparten estado por
            detrás — algo que se apoya en Context, más adelante en el
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
        <div className="flex flex-col gap-4 prosa">
          <p>
            Este componente creció con cada feature nueva. ¿Cómo lo
            reescribirías usando composición en vez de más props?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Alerta({ tipo, tieneIcono, tieneBoton, textoBoton, onCerrar, mensaje }) {
  return (
    <div className={tipo}>
      {tieneIcono && <Icono tipo={tipo} />}
      <span>{mensaje}</span>
      {tieneBoton && <button onClick={onCerrar}>{textoBoton}</button>}
    </div>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              En vez de que <code>Alerta</code> sepa renderizar ícono y
              botón condicionalmente, que reciba children — el que la usa
              decide qué poner adentro:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function Alerta({ tipo, children }) {
  return <div className={tipo}>{children}</div>;
}

// uso:
<Alerta tipo="error">
  <Icono tipo="error" />
  <span>Algo salió mal</span>
  <button onClick={cerrar}>Cerrar</button>
</Alerta>

// otro uso, sin tocar Alerta:
<Alerta tipo="info">
  <span>Todo bien, sin ícono ni botón</span>
</Alerta>`}
            </pre>
            <p className="mt-2">
              Alerta quedó simple y no necesita crecer cada vez que
              aparece una combinación nueva de ícono/botón/texto.
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
            Un <strong className="text-foreground">
            Higher-Order Component (HOC)</strong> es una función que
            recibe un componente y devuelve otro con comportamiento
            agregado (<code>withAuth(Componente)</code>). Antes de los
            hooks, era el patrón principal para compartir lógica con
            estado. Componer varios HOCs anidados genera &quot;wrapper
            hell&quot; y riesgo de colisión de props inyectadas — los
            hooks resuelven lo mismo sin agregar componentes extra al
            árbol.
          </p>
          <p>
            Tipar los slots de un componente compuesto con props
            explícitas (<code>{"{ izquierda, derecha }"}</code>) en vez de
            un solo <code>children</code> genérico le permite a TypeScript
            exigir que cada slot esté presente, algo que un{" "}
            <code>children</code> sin tipar no puede expresar.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Anidar varios HOCs sin necesidad, en vez de usar hooks.
            </strong>{" "}
            Genera una pila de componentes envolventes difícil de seguir
            en las devtools.
          </li>
          <li>
            <strong className="text-foreground">
              Usar children genérico cuando el componente necesita slots
              obligatorios.
            </strong>{" "}
            El compilador no puede avisar si falta uno.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un HOC todavía tiene sentido para algo que un hook no puede
            hacer: un error boundary, que solo se puede implementar como
            clase.
          </li>
          <li>
            Tipar un layout de dos columnas con props{" "}
            <code>{"{ izquierda: ReactNode; derecha: ReactNode }"}</code>{" "}
            obligatorias, en vez de children sin estructura.
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
            El patrón <strong className="text-foreground">asChild</strong>{" "}
            (Radix UI y similares) permite que un componente de
            comportamiento delegue qué elemento HTML final renderizar al
            hijo recibido, usando <code>React.cloneElement</code>{" "}
            internamente para fusionar props en vez de envolver en un
            elemento extra — así una lógica de accesibilidad y eventos se
            puede renderizar a veces como <code>&lt;button&gt;</code>, a
            veces como <code>&lt;a&gt;</code>, sin duplicarla.
          </p>
          <p>
            <code>cloneElement</code> es frágil: asume conocer exactamente
            qué va a recibir como children. Si el consumidor pasa más de
            un hijo, texto plano, o un componente que no espera esas
            props inyectadas, el comportamiento se rompe de formas no
            siempre obvias. Para coordinación más general entre padre e
            hijos, un compound component basado en Context es más
            robusto, porque no depende de la forma exacta del árbol de
            children.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar cloneElement asumiendo un único hijo sin validarlo.
            </strong>{" "}
            Se rompe silenciosamente si el consumidor pasa un array de
            children, un fragment, o texto.
          </li>
          <li>
            <strong className="text-foreground">
              Implementar asChild sin fusionar correctamente los event
              handlers existentes del hijo.
            </strong>{" "}
            Puede pisar un onClick que el consumidor ya le había puesto al
            elemento hijo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Implementar un `Tooltip.Trigger` con asChild para que funcione
            igual sobre un botón, un link o un ícono, sin duplicar la
            lógica de posicionamiento del tooltip.
          </li>
          <li>
            Preferir un compound component con Context sobre cloneElement
            cuando la coordinación entre padre e hijos es más compleja que
            inyectar una o dos props puntuales.
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
