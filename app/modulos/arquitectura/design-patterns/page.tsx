import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PatronesPlayground } from "@/components/modulo/PatronesPlayground";
import { entrevistaDesignPatterns } from "@/lib/modules/arquitectura/design-patterns-entrevista";

const preguntasPorNivel = {
  1: entrevistaDesignPatterns.filter((p) => p.nivel === 1),
  2: entrevistaDesignPatterns.filter((p) => p.nivel === 2),
  3: entrevistaDesignPatterns.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Design patterns comunes — Dev Study Lab",
  description:
    "Strategy, Observer, Factory y otros patrones del día a día en JavaScript y TypeScript, y cuándo empeoran el código.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un switch por tipo de envío crece con cada opción nueva. ¿Qué patrón lo resuelve?",
    opciones: [
      "Strategy",
      "Singleton",
      "Observer",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Cada opción es una estrategia; agregar una no toca el código que las usa.",
  },
  {
    pregunta: "¿Cuál de estos es un ejemplo de Observer en el navegador?",
    opciones: [
      "fetch",
      "addEventListener",
      "document.createElement",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El elemento notifica a los listeners suscriptos cuando ocurre el evento.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuándo sobra una Factory?",
    opciones: [
      "Cuando el objeto necesita varias dependencias para construirse",
      "Cuando la implementación depende del entorno de ejecución",
      "Cuando hay una sola implementación y construirla es trivial",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Ahí un new directo es más claro.",
  },
  {
    pregunta: "Un middleware de Express que agrega logging a cada request es un ejemplo de...",
    opciones: [
      "Decorator",
      "Adapter",
      "Factory",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Agrega comportamiento envolviendo, sin modificar el handler original.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué propone la 'regla de tres'?",
    opciones: [
      "Que una función no tenga más de tres parámetros",
      "Esperar dos o tres casos reales antes de abstraer",
      "Que cada módulo tenga como máximo tres dependencias",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Evita anticipar variaciones que quizás nunca lleguen (YAGNI).",
  },
  {
    pregunta: "¿Qué gana un emisor de eventos tipado con un mapa de eventos?",
    opciones: [
      "Que los eventos se entregan en orden garantizado",
      "Que los listeners se registran y se limpian solos",
      "Error de compilación ante un payload o evento inválido",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Y los suscriptores reciben el tipo correcto sin anotaciones.",
  },
];

export default function DesignPatternsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Design patterns comunes"
      descripcion="Soluciones con nombre para problemas que se repiten: cuándo ayudan, cómo se ven en JavaScript, y cuándo solo agregan indirección."
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
            Un patrón de diseño es una solución con nombre a un problema que se
            repite. Su valor es doble: la solución en sí y el{" "}
            <strong className="text-foreground">vocabulario compartido</strong>{" "}
            (&quot;hagamos un Strategy&quot; explica mucho en tres palabras).
          </p>
          <p>
            <strong className="text-foreground">Strategy</strong>: algoritmos
            intercambiables tras una interfaz.{" "}
            <strong className="text-foreground">Observer</strong>: un emisor
            notifica a suscriptores que no conoce.{" "}
            <strong className="text-foreground">Factory</strong>: centraliza qué
            objeto concreto se crea. En JavaScript muchos se expresan con
            funciones y objetos, sin jerarquías de clases.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PatronesPlayground />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Olvidar desuscribirse.</strong>{" "}
            Un observer que nunca se quita es un memory leak.
          </li>
          <li>
            <strong className="text-foreground">Traducir patrones de Java literalmente.</strong>{" "}
            En JS, una estrategia puede ser una función y una factory, una
            función que devuelve un objeto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Métodos de pago o de envío como estrategias.</li>
          <li>Un bus de eventos de dominio entre módulos.</li>
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
            Otros patrones del día a día:{" "}
            <strong className="text-foreground">Adapter</strong> (envolver una
            API externa), <strong className="text-foreground">Facade</strong>{" "}
            (interfaz simple sobre algo complejo, como un{" "}
            <code>apiClient</code>), <strong className="text-foreground">Decorator</strong>{" "}
            (middlewares, HOCs), <strong className="text-foreground">Composite</strong>{" "}
            (el árbol de componentes) y{" "}
            <strong className="text-foreground">Singleton</strong>, que en JS
            sale natural con un módulo.
          </p>
          <p>
            Una Factory conviene cuando la clase depende de datos de runtime o
            construirla es complejo; con una sola implementación trivial, sobra.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Singleton con estado mutable global.</strong>{" "}
            Acopla todo y el estado sobrevive entre tests.
          </li>
          <li>
            <strong className="text-foreground">Recitar el catálogo en una entrevista.</strong>{" "}
            Lo que importa es qué problema resuelve cada uno.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una factory de clientes de pago por país.</li>
          <li>Un facade <code>apiClient</code> sobre fetch.</li>
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
            Cada patrón agrega <strong className="text-foreground">indirección</strong>,
            y solo se justifica si compra algo concreto: extensibilidad real,
            testeabilidad o aislar algo que cambia. La regla de tres y YAGNI
            evitan abstraer por anticipado.
          </p>
          <p>
            Con TypeScript, los patrones ganan seguridad: un emisor de eventos
            tipado con un mapa de eventos, o estrategias tipadas con{" "}
            <code>Record&lt;Tipo, Fn&gt;</code> que obligan a cubrir todos los
            casos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Interfaces con una sola implementación &quot;por si acaso&quot;.</strong>{" "}
            Costo de lectura sin beneficio.
          </li>
          <li>
            <strong className="text-foreground">Suscriptores que lanzan sin aislar.</strong>{" "}
            Un error corta la notificación al resto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un <code>EmisorTipado&lt;EventosDeDominio&gt;</code> compartido.</li>
          <li>Revisar un PR que introduce tres capas para un CRUD.</li>
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
            Esta función crece cada vez que se agrega un medio de pago, y además
            dispara el mail y la factura desde adentro. ¿Qué patrones aplicarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`async function pagar(pedido, medio) {
  if (medio === "tarjeta") { /* 40 líneas con el SDK de tarjetas */ }
  else if (medio === "transferencia") { /* 30 líneas */ }
  else if (medio === "billetera") { /* 35 líneas */ }
  await enviarMail(pedido);
  await generarFactura(pedido);
  await actualizarStock(pedido);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Strategy para los medios de pago: una interfaz{" "}
              <code>MedioDePago</code> con <code>cobrar(pedido)</code>, una
              implementación por medio (cada una un Adapter sobre su SDK), y un{" "}
              <code>Record&lt;TipoMedio, MedioDePago&gt;</code> (o una factory si
              la construcción depende de configuración) para elegirla. Observer
              para los efectos posteriores: <code>pagar</code> emite{" "}
              <code>pagoAprobado</code> y el mail, la factura y el stock se
              suscriben; así sumar un efecto no toca el cobro. Queda un{" "}
              <code>pagar</code> de pocas líneas que elige estrategia, cobra y
              emite. Para efectos que no pueden perderse (facturar), el evento
              conviene que vaya a una cola persistente en vez de un emisor en
              memoria.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
