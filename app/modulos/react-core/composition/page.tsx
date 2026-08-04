import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PropsArbolSimulador } from "@/components/modulo/PropsArbolSimulador";
import { PanelComposable } from "@/components/modulo/PanelComposable";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosComposicion } from "@/lib/modules/react-core/composicion";

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

export default function CompositionPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Composition"
      descripcion="React no tiene herencia de componentes. La forma de escalar y reutilizar UI es combinando piezas chicas — no agregando cada vez más props a un componente gigante."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          SplitPane no sabe qué es una &ldquo;Lista&rdquo; ni un
          &ldquo;Formulario&rdquo; — solo posiciona lo que le pasás en
          cada slot.
        </p>
        <PanelComposable />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
