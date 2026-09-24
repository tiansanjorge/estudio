import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { TddKata } from "@/components/modulo/TddKata";
import { entrevistaTdd } from "@/lib/modules/testing/tdd-entrevista";

const preguntasPorNivel = {
  1: entrevistaTdd.filter((p) => p.nivel === 1),
  2: entrevistaTdd.filter((p) => p.nivel === 2),
  3: entrevistaTdd.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "TDD — Dev Study Lab",
  description:
    "Test-Driven Development: el ciclo red-green-refactor, cuándo conviene, sus escuelas y cómo aplicarlo sobre código legacy.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué se hace en la fase GREEN?",
    opciones: [
      "Diseñar la solución definitiva",
      "Escribir lo mínimo para que el test pase",
      "Escribir todos los tests de la feature",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El diseño se mejora en REFACTOR, con los tests en verde como red de seguridad.",
  },
  {
    pregunta: "¿Por qué ver fallar el test antes de implementar?",
    opciones: [
      "Por costumbre",
      "Para confirmar que el test realmente puede detectar el problema",
      "Para que el CI tarde más",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un test que nunca falló puede estar pasando por la razón equivocada.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿En cuál de estos casos TDD rinde más?",
    opciones: [
      "Un prototipo de UI que probablemente se tire",
      "Las reglas de cálculo de impuestos de una factura",
      "La configuración del bundler",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Lógica con reglas claras y muchos casos: el escenario ideal.",
  },
  {
    pregunta: "¿Qué es triangular en TDD?",
    opciones: [
      "Escribir tres tests por función",
      "Agregar ejemplos distintos hasta que la implementación constante ya no alcance y surja la regla",
      "Testear en tres navegadores",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La generalización aparece forzada por los casos, no anticipada.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es un test de caracterización?",
    opciones: [
      "Un test del comportamiento deseado",
      "Un test que fija lo que el código hace hoy, para poder refactorizar con seguridad",
      "Un test de performance",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es la red de seguridad para empezar a trabajar sobre código legacy.",
  },
  {
    pregunta: "¿Qué caracteriza al TDD outside-in (escuela de Londres)?",
    opciones: [
      "Empieza por las funciones de dominio sin mocks",
      "Empieza por un test de aceptación y baja diseñando cada capa con mocks",
      "No usa tests unitarios",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Descubre las interfaces desde el uso, a costa de tests más acoplados a interacciones.",
  },
];

export default function TddPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="TDD"
      descripcion="Escribir el test primero: un ciclo corto que guía el diseño y deja una suite que describe el comportamiento."
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
            <strong className="text-foreground">TDD</strong> invierte el orden:
            primero el test, después el código, en ciclos de tres fases.{" "}
            <strong className="text-error">Red</strong>: un test que falla.{" "}
            <strong className="text-success">Green</strong>: lo mínimo para
            pasar. <strong className="text-info">Refactor</strong>: mejorar el
            diseño con los tests como red de seguridad.
          </p>
          <p>
            Es, sobre todo, una técnica de diseño: pensar primero cómo se usa
            una función obliga a definir una interfaz clara, y cada línea de
            código existe porque un test la pidió.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Kata paso a paso">
        <TddKata />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Saltarse el refactor.</strong>{" "}
            Sin esa fase, TDD produce código que pasa los tests pero se degrada.
          </li>
          <li>
            <strong className="text-foreground">Pasos enormes.</strong>{" "}
            Escribir cinco tests juntos y después todo el código pierde el
            feedback del ciclo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Corregir un bug: primero el test que lo reproduce.</li>
          <li>Implementar reglas de negocio con muchos casos.</li>
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
            <strong className="text-foreground">Fake it till you make it</strong>{" "}
            y <strong className="text-foreground">triangulación</strong>:
            empezar con la implementación más tonta y dejar que ejemplos
            distintos obliguen a generalizar. Con experiencia, los pasos se
            agrandan cuando la implementación es obvia.
          </p>
          <p>
            TDD rinde en lógica con reglas claras, cálculos, validaciones y
            bugs; rinde menos en prototipos y exploración, o en código de
            pegamento, donde conviene un test de integración escrito después.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Aplicar TDD como dogma en un spike.</strong>{" "}
            Se tiran los tests junto con el prototipo.
          </li>
          <li>
            <strong className="text-foreground">Testear implementación en vez de comportamiento.</strong>{" "}
            El refactor rompe los tests y deja de ser seguro.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un parser de CSV con formatos variados.</li>
          <li>Las reglas de descuento de un checkout.</li>
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
            Hay dos escuelas: <strong className="text-foreground">inside-out</strong>{" "}
            (clásica, desde el dominio, pocos mocks) y{" "}
            <strong className="text-foreground">outside-in</strong> (Londres,
            desde un test de aceptación, diseñando capas con mocks). El double
            loop TDD las combina.
          </p>
          <p>
            Sobre código <strong className="text-foreground">legacy</strong>{" "}
            primero van los tests de caracterización (fijan lo que el código
            hace hoy), después refactors chicos que abren costuras, y recién
            ahí TDD sobre la parte aislada.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;Arreglar&quot; bugs mientras se caracteriza.</strong>{" "}
            Primero se fija el comportamiento actual; los cambios van después y
            por separado.
          </li>
          <li>
            <strong className="text-foreground">Reescribir el módulo legacy de cero.</strong>{" "}
            Sin tests de caracterización, se pierden reglas que nadie documentó.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Approval tests sobre un generador de PDFs heredado.</li>
          <li>Un test de aceptación por endpoint que guía el desarrollo de la feature.</li>
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
            Tenés que agregar un descuento por cantidad a esta función de 300
            líneas, sin tests, que además consulta la base y manda un mail.
            ¿Cómo lo encarás con TDD?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`async function procesarPedido(pedidoId) {
  const pedido = await db.pedido.findUnique({ where: { id: pedidoId } });
  let total = 0;
  for (const item of pedido.items) { /* 250 líneas de reglas de precio */ }
  await db.pedido.update({ where: { id: pedidoId }, data: { total } });
  await enviarMail(pedido.email, total);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              1) Tests de caracterización del comportamiento actual: con la base
              de test y el mail interceptado, ejecutar{" "}
              <code>procesarPedido</code> con pedidos representativos y fijar
              los totales que calcula hoy. 2) Refactor seguro: extraer las 250
              líneas a una función pura <code>calcularTotal(items)</code>, sin
              base ni mail; los tests de caracterización tienen que seguir en
              verde. 3) Ahora sí TDD sobre <code>calcularTotal</code>: test en
              rojo para el descuento por cantidad, implementación mínima,
              refactor, y casos borde. 4) <code>procesarPedido</code> queda como
              orquestador fino (leer, calcular, guardar, avisar), cubierto por
              un test de integración.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
