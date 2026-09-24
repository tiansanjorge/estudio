import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PiramideTestingSimulador } from "@/components/modulo/PiramideTestingSimulador";
import { entrevistaPiramideTesting } from "@/lib/modules/testing/piramide-testing-entrevista";

const preguntasPorNivel = {
  1: entrevistaPiramideTesting.filter((p) => p.nivel === 1),
  2: entrevistaPiramideTesting.filter((p) => p.nivel === 2),
  3: entrevistaPiramideTesting.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Pirámide de testing — Dev Study Lab",
  description:
    "Cómo repartir el esfuerzo entre tests unitarios, de integración y e2e: costo, velocidad, confianza y flakiness.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué nivel de la pirámide da feedback más rápido y localiza mejor el error?",
    opciones: ["E2E", "Integración", "Unit"],
    respuestaCorrecta: 2,
    explicacion:
      "Corre en milisegundos y apunta a una unidad concreta; a cambio, prueba menos partes juntas.",
  },
  {
    pregunta: "Una suite con 200 e2e y 20 unitarios es un ejemplo de...",
    opciones: ["Pirámide", "Trofeo", "Cono de helado"],
    respuestaCorrecta: 2,
    explicacion:
      "La pirámide invertida: lenta, frágil y cara de mantener.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Dónde pone el grueso del esfuerzo el testing trophy?",
    opciones: ["Unit", "Integración", "E2E"],
    respuestaCorrecta: 1,
    explicacion:
      "Tests que usan varias piezas juntas como un usuario, sin llegar al costo de un e2e.",
  },
  {
    pregunta: "Un test pasa al segundo reintento en el CI. ¿Qué es?",
    opciones: [
      "Un test sano",
      "Un test flaky que hay que registrar y arreglar",
      "Un bug del CI",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los reintentos esconden la flakiness si no se reportan.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué mide el mutation testing?",
    opciones: [
      "Qué líneas se ejecutan",
      "Si los tests detectan cambios introducidos a propósito en el código",
      "La velocidad de la suite",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si un mutante sobrevive, hay comportamiento que ningún test verifica.",
  },
  {
    pregunta: "¿Qué reemplaza a los e2e que levantan todos los microservicios?",
    opciones: ["Más e2e en paralelo", "Contract tests (por ejemplo Pact)", "Tests manuales"],
    respuestaCorrecta: 1,
    explicacion:
      "Cada proveedor verifica en su CI los contratos de sus consumidores, sin levantarlos.",
  },
];

export default function PiramideTestingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="Pirámide de testing"
      descripcion="Cómo repartir el esfuerzo de testing para tener confianza en los deploys sin una suite lenta, frágil y cara de mantener."
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
            La <strong className="text-foreground">pirámide de testing</strong>{" "}
            propone muchos tests unitarios en la base, menos de integración en
            el medio y pocos end-to-end arriba. Subir en la pirámide da más
            confianza por test, pero cada test es más lento, más caro, más
            frágil y más difícil de diagnosticar.
          </p>
          <p>
            Debajo de todo está el{" "}
            <strong className="text-foreground">análisis estático</strong>{" "}
            (TypeScript, ESLint), que atrapa una clase entera de errores sin
            escribir tests. Y arriba, los e2e se reservan para los flujos que
            no pueden fallar: login, checkout, alta de cliente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PiramideTestingSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Testear todo por la UI.</strong>{" "}
            Validar 30 reglas de un formulario con e2e en vez de unitarios.
          </li>
          <li>
            <strong className="text-foreground">Cero e2e.</strong>{" "}
            Todas las piezas pasan sus tests y el login igual está roto en
            producción.
          </li>
          <li>
            <strong className="text-foreground">Una suite que tarda 40 minutos.</strong>{" "}
            Nadie la corre antes de pushear y el feedback llega tarde.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Definir la estrategia de testing de un proyecto nuevo.</li>
          <li>Diagnosticar por qué el CI tarda tanto y falla sin bugs.</li>
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
            El <strong className="text-foreground">testing trophy</strong> pone
            el grueso en integración: tests que renderizan varias piezas
            juntas, con la red simulada, y las usan como un usuario. En
            frontend suele dar más confianza por test que muchos unitarios
            atados a detalles de implementación.
          </p>
          <p>
            La <strong className="text-foreground">flakiness</strong> es el
            enemigo de cualquier forma: se mide, se pone en cuarentena con un
            responsable y se arregla la causa (esperas fijas, estado compartido,
            datos no aislados, reloj, servicios reales).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Tests atados a la implementación.</strong>{" "}
            Se rompen con cada refactor sin haber encontrado un bug.
          </li>
          <li>
            <strong className="text-foreground">Reintentos automáticos sin reporte.</strong>{" "}
            Esconden la flakiness hasta que se vuelve inmanejable.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un dashboard de tests flaky con su responsable y fecha.</li>
          <li>Reemplazar 50 unitarios de un formulario por 5 tests de integración.</li>
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
            La <strong className="text-foreground">cobertura</strong> mide qué se
            ejecutó, no qué se verificó; como meta obligatoria se vuelve
            engañosa. El <strong className="text-foreground">mutation testing</strong>{" "}
            mide si los tests detectan cambios en el código.
          </p>
          <p>
            Con muchos servicios, los e2e que levantan todo no escalan. Los{" "}
            <strong className="text-foreground">contract tests</strong> verifican
            en el CI de cada proveedor que cumple lo que sus consumidores
            esperan, y la observabilidad en producción cubre lo que solo aparece
            con tráfico real.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">&quot;90% de cobertura o no se mergea&quot;.</strong>{" "}
            Genera tests sin asserts para cumplir el número.
          </li>
          <li>
            <strong className="text-foreground">Un entorno de staging compartido para todos los e2e.</strong>{" "}
            Un servicio roto bloquea a todos los equipos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Correr Stryker sobre el módulo de cálculo de precios.</li>
          <li>Contratos con Pact entre el frontend y la API de pedidos.</li>
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
            Heredás un proyecto con 180 tests e2e (45 minutos de CI, 1 de cada 3
            corridas falla sin bug) y 12 unitarios. El equipo ya re-ejecuta el
            CI hasta que pase. ¿Cuál es tu plan?
          </p>
          <RevelarSolucion>
            <p>
              Primero frenar el daño: medir qué tests son flaky y ponerlos en
              cuarentena con responsable, para que una corrida roja vuelva a
              significar algo. Después clasificar los e2e: los que cubren flujos
              críticos de negocio se quedan (y se estabilizan esperando
              condiciones en vez de tiempos fijos, con datos aislados); los que
              validan reglas o variantes se reescriben como tests unitarios o de
              integración, refactorizando para separar la lógica de la UI donde
              haga falta. En paralelo, paralelizar o shardear los e2e que quedan
              en el CI. La meta no es un número de tests, sino un CI rápido
              (pocos minutos), confiable y que falle solo cuando hay un problema
              real.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
