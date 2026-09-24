import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { VirtualizacionSimulador } from "@/components/modulo/VirtualizacionSimulador";
import { entrevistaVirtualization } from "@/lib/modules/performance/virtualization-entrevista";

const preguntasPorNivel = {
  1: entrevistaVirtualization.filter((p) => p.nivel === 1),
  2: entrevistaVirtualization.filter((p) => p.nivel === 2),
  3: entrevistaVirtualization.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Virtualization — Dev Study Lab",
  description:
    "Virtualización de listas: renderizar en el DOM real solo los elementos visibles en el viewport, sin importar cuántos haya en total en los datos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema resuelve virtualizar una lista larga?",
    opciones: [
      "Evita tener miles de nodos en el DOM cuando casi ninguno se ve",
      "Evita descargar todos los datos de la lista en el primer request",
      "Evita re-renderizar la lista cuando cambia un solo elemento",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es un problema de CANTIDAD de nodos en el DOM, no de re-renders — por eso memo no lo resuelve, hace falta una técnica distinta.",
  },
  {
    pregunta: "¿A partir de qué tamaño de lista tiene sentido virtualizar?",
    opciones: [
      "Desde unas decenas, porque cada nodo del DOM ya es caro de mantener",
      "Desde cientos o miles, donde la cantidad de nodos ya es el problema",
      "Solo si los elementos tienen imágenes, que es lo que realmente pesa",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para listas cortas, virtualizar agrega complejidad sin ningún beneficio medible.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Con filas de altura FIJA, ¿cómo se calcula la posición de un elemento que todavía no se montó?",
    opciones: [
      "Midiendo cada fila con getBoundingClientRect al montarla",
      "Con un ResizeObserver que observa todas las filas",
      "Con aritmética: offset = índice × alturaFila",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Por eso las alturas fijas son mucho más simples de virtualizar que las variables, que necesitan medir cada elemento.",
  },
  {
    pregunta:
      "¿Qué problema de accesibilidad introduce virtualizar sin cuidado?",
    opciones: [
      "Lo que sale del viewport se desmonta: se pierde el foco y falla el Ctrl+F",
      "Los lectores de pantalla leen las filas en orden inverso al visual",
      "El scroll con teclado deja de funcionar dentro del contenedor",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El texto de los elementos no montados no existe en el DOM, así que el navegador no puede encontrarlo ni el foco puede quedar ahí.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué sirve el 'overscan' en una lista virtualizada?",
    opciones: [
      "Para precargar los datos de la página siguiente antes de llegar al final",
      "Para montar algunos elementos extra fuera del rango visible y evitar parpadeos",
      "Para medir la altura real de las filas antes de mostrarlas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin overscan, el montaje no instantáneo de elementos nuevos se ve como un flash de espacio en blanco durante scrolls rápidos.",
  },
  {
    pregunta:
      "¿Qué cuidado hay que tener con useState al reciclar nodos del DOM en una lista virtualizada?",
    opciones: [
      "Que el estado se reinicia en cada scroll y hay que guardarlo en una ref",
      "Que useState no funciona dentro de filas que se montan y desmontan seguido",
      "Que el estado queda en el nodo reciclado aunque ahora muestre otro item",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Como el componente no se desmonta (solo cambian sus props), el estado 'hereda' visualmente al nuevo item si no se maneja con cuidado.",
  },
];

export default function VirtualizationPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Virtualization"
      descripcion="Renderizar en el DOM real solo los elementos visibles en el viewport, sin importar cuántos haya en total en los datos — la respuesta cuando el problema es la CANTIDAD de nodos, no la cantidad de re-renders."
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
            Cuando una lista tiene miles de elementos, renderizar TODOS en el
            DOM real es costoso incluso si cada item es barato: el navegador
            tiene que crear, mantener en memoria y calcular el layout de
            miles de nodos, la mayoría fuera de pantalla en un momento dado.
            La virtualización renderiza únicamente los elementos que están
            (o están por entrar) en el viewport visible — el resto de la
            lista existe solo como datos en memoria, no como nodos del DOM.
          </p>
          <p>
            Esto es distinto del problema que resuelve la memoización: memo
            evita RE-RENDERIZAR items que no cambiaron, pero no evita
            mantener miles de nodos montados. Virtualizar ataca la CANTIDAD
            de nodos existentes, no la cantidad de veces que se re-renderiza
            cada uno.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <VirtualizacionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Virtualizar listas cortas por costumbre.
            </strong>{" "}
            Para una docena de elementos, la complejidad adicional no aporta
            ningún beneficio medible.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir el problema de re-renders con el de cantidad de
              nodos.
            </strong>{" "}
            React.memo no reemplaza a la virtualización, ni viceversa —
            resuelven problemas distintos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Un feed infinito con miles de posts cargados progresivamente.
          </li>
          <li>
            Una tabla de datos con decenas de miles de filas en un panel
            administrativo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
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
            Con filas de altura FIJA, calcular dónde va cada elemento es
            aritmética simple: <code>offset = índice * alturaFila</code>. El
            contenedor externo se dimensiona con una altura total falsa (
            <code>cantidadTotal * alturaFila</code>) para que la scrollbar
            refleje el tamaño real de la lista completa, y a medida que el
            usuario scrollea se recalcula qué rango de índices cae en el
            viewport visible.
          </p>
          <p>
            Con alturas VARIABLES, ya no alcanza con multiplicar: hace falta
            un cache de alturas medidas (con estimaciones por defecto para lo
            que todavía no se midió), lo que puede causar pequeños saltos de
            posición mientras las estimaciones se corrigen con datos reales.
          </p>
          <p>
            Virtualizar también tiene un costo en accesibilidad: un elemento
            fuera del viewport se DESMONTA del DOM, no solo se oculta — si
            tenía el foco del teclado, ese foco se pierde, y el &quot;buscar
            en la página&quot; (Ctrl+F) del navegador no encuentra texto que
            no existe en el DOM.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que Ctrl+F sigue funcionando igual en una lista
              virtualizada.
            </strong>{" "}
            El navegador solo puede buscar texto que exista en el DOM en ese
            momento.
          </li>
          <li>
            <strong className="text-foreground">
              No manejar explícitamente el foco al desmontar el elemento
              enfocado.
            </strong>{" "}
            El foco simplemente se pierde si no se redirige a otro elemento.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Chat con mensajes de longitud variable, donde cada burbuja tiene
            distinta altura según su contenido.
          </li>
          <li>
            Evaluar, en una lista crítica para accesibilidad, si el costo de
            UX de virtualizar realmente se justifica frente al beneficio de
            rendimiento.
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
            Si se renderizaran EXACTAMENTE los elementos visibles y ni uno
            más, un scroll rápido dejaría ver, por una fracción de segundo,
            espacio en blanco mientras React monta los elementos que acaban
            de entrar al viewport. El <strong className="text-foreground">
              overscan
            </strong>{" "}
            renderiza unos pocos elementos adicionales antes y después del
            rango visible para que ya estén montados cuando el scroll los
            revele.
          </p>
          <p>
            Otra técnica de las librerías más optimizadas es{" "}
            <strong className="text-foreground">reciclar nodos</strong>: en
            vez de desmontar y montar un componente nuevo en cada scroll,
            mantienen las MISMAS instancias montadas y solo actualizan sus
            props con los datos correspondientes a la posición actual —
            aprovechando el camino de actualización de React, más barato que
            un montaje desde cero.
          </p>
          <p>
            Esto trae un cuidado extra: como el componente no se desmonta,
            cualquier estado interno (<code>useState</code>) persiste en la
            instancia reciclada aunque ahora represente un item distinto —
            hay que derivar ese estado de los datos actuales o resetearlo
            explícitamente cuando cambia el id del item que el nodo
            representa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              No usar overscan y ver flashes de espacio en blanco en scroll
              rápido.
            </strong>{" "}
            El montaje de nuevos elementos no es instantáneo.
          </li>
          <li>
            <strong className="text-foreground">
              Guardar estado local ligado a la posición del nodo en vez de a
              la identidad del item.
            </strong>{" "}
            Al reciclar, ese estado &quot;hereda&quot; visualmente al nuevo
            item.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Diagnosticar un bug donde un item de lista &quot;recuerda&quot;
            un estado de edición que pertenecía a otro item, tras scrollear.
          </li>
          <li>
            Ajustar el tamaño del overscan según qué tan rápido puede
            scrollear el usuario en un caso de uso concreto (trackpad vs
            rueda de mouse vs touch).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Esta fila de una lista virtualizada con nodos reciclados tiene un
            bug: al scrollear, algunos items aparecen &quot;expandidos&quot;
            sin que el usuario haya hecho click en ellos. ¿Por qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Fila({ item }) {
  const [expandido, setExpandido] = useState(false); // no depende de item.id
  return (
    <div onClick={() => setExpandido((e) => !e)}>
      {item.titulo}
      {expandido && <p>{item.detalle}</p>}
    </div>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El nodo del DOM se recicla para representar items distintos a
              medida que se scrollea, pero <code>expandido</code> vive en la
              instancia del componente, no en el item de datos — si el nodo
              que ahora muestra el item B fue antes el nodo del item A (que
              estaba expandido), <code>expandido</code> sigue en{" "}
              <code>true</code> aunque B nunca fue clickeado. El fix es
              derivar ese estado de una estructura externa indexada por{" "}
              <code>item.id</code> (o resetearlo explícitamente cuando el id
              cambia), en vez de guardarlo como estado local del componente.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
