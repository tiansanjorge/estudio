import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { NivelesTestComparador } from "@/components/modulo/NivelesTestComparador";
import { entrevistaUnitIntegrationE2e } from "@/lib/modules/testing/unit-integration-e2e-entrevista";

const preguntasPorNivel = {
  1: entrevistaUnitIntegrationE2e.filter((p) => p.nivel === 1),
  2: entrevistaUnitIntegrationE2e.filter((p) => p.nivel === 2),
  3: entrevistaUnitIntegrationE2e.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Unit vs integration vs e2e — Dev Study Lab",
  description:
    "Qué prueba cada nivel, qué bugs atrapa y cuáles se le escapan, con la misma feature testeada de tres formas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "La API renombra un campo y el test de integración con MSW sigue en verde. ¿Por qué?",
    opciones: [
      "Porque el mock sigue devolviendo la forma vieja: es una suposición",
      "Porque MSW ignora los campos que el componente no renderiza",
      "Porque el test de integración no llega a ejecutar el fetch",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Lo detecta un e2e contra la API real o un contract test.",
  },
  {
    pregunta: "¿Qué nivel conviene para cubrir 30 casos borde de una función de redondeo?",
    opciones: [
      "E2E",
      "Unit",
      "Integración",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada caso cuesta milisegundos; en e2e serían minutos.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un test verifica que se llamó a setState con cierto valor. ¿Qué problema tiene?",
    opciones: [
      "Ninguno: verificar el setState es la forma más precisa de testear estado",
      "Que setState es asíncrono y el test puede leer el valor antes de tiempo",
      "Prueba implementación: se rompe en un refactor sin cambios de comportamiento",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Mejor verificar lo que ve el usuario.",
  },
  {
    pregunta: "Tu app corre en Postgres. ¿Qué base usás en los tests de integración del backend?",
    opciones: [
      "Postgres real (contenedor o rama efímera), con cada test aislado",
      "SQLite en memoria, que es compatible y mucho más rápido",
      "Un mock del cliente de base que devuelve datos fijos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las diferencias entre motores hacen pasar tests que fallan en producción.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué reemplaza a waitForTimeout(2000) en un e2e estable?",
    opciones: [
      "Un timeout más largo, de 5 s, para cubrir el CI lento",
      "Esperar una condición concreta con reintentos automáticos",
      "Correr el test en serie para que no compita por recursos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las esperas fijas son la causa número uno de flakiness.",
  },
  {
    pregunta: "¿Dónde rinden más los tests de regresión visual?",
    opciones: [
      "En todas las páginas, para detectar cualquier cambio de píxel",
      "En páginas con contenido dinámico, que cambian en cada carga",
      "En design systems y pantallas críticas, con captura estable",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Cubrir todo genera ruido y aprobaciones constantes.",
  },
];

export default function UnitIntegrationE2ePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="Unit vs integration vs e2e"
      descripcion="Qué parte del sistema real ejercita cada tipo de test, y qué bugs atrapa cada uno que los otros no ven."
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
            <strong className="text-foreground">Unit</strong>: una unidad
            aislada, sin DOM ni red. <strong className="text-foreground">Integración</strong>:
            varias piezas juntas, con lo externo simulado (en frontend,
            Testing Library + MSW). <strong className="text-foreground">E2E</strong>:
            la app completa en un navegador real, contra la API y la base.
          </p>
          <p>
            Cada nivel tiene puntos ciegos. El unit no ve cómo se conectan los
            componentes; la integración confía en mocks que pueden quedar
            desactualizados y no calcula layout; el e2e es lento y frágil para
            cubrir casos borde. Por eso se combinan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <NivelesTestComparador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Llamar &quot;unitario&quot; a cualquier test de Jest.</strong>{" "}
            Renderizar una página con su store y sus hijos ya es integración.
          </li>
          <li>
            <strong className="text-foreground">Confiar ciegamente en los mocks.</strong>{" "}
            Son suposiciones sobre el sistema externo que pueden quedar viejas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Decidir en qué nivel testear cada parte de una feature nueva.</li>
          <li>Explicar en un postmortem por qué los tests no atraparon un bug.</li>
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
            En cualquier nivel, un buen test prueba{" "}
            <strong className="text-foreground">comportamiento</strong>, es
            determinístico, está aislado, sigue Arrange-Act-Assert, falla por
            una razón clara y tiene un nombre que describe qué se espera.
          </p>
          <p>
            En el backend, la integración usa la{" "}
            <strong className="text-foreground">misma base que producción</strong>{" "}
            (Postgres en un contenedor o una rama efímera), con cada test
            aislado por transacción o truncado. Los mocks del ORM quedan para
            unitarios de la lógica de negocio.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">SQLite para testear una app en Postgres.</strong>{" "}
            Constraints, tipos y JSONB se comportan distinto.
          </li>
          <li>
            <strong className="text-foreground">Tests que dependen del orden.</strong>{" "}
            Pasan juntos y fallan solos, o al revés.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Testcontainers con Postgres para los tests de repositorios.</li>
          <li>Renombrar tests para que describan comportamiento.</li>
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
            Un e2e estable espera{" "}
            <strong className="text-foreground">condiciones</strong>, no
            tiempos; selecciona por rol y nombre accesible; crea sus propios
            datos por API; y no depende de terceros reales. Uno rápido
            paraleliza, shardea y reutiliza el estado de login.
          </p>
          <p>
            La <strong className="text-foreground">regresión visual</strong>{" "}
            atrapa lo que ningún assert ve (layout, estilos), a cambio de ruido
            y aprobaciones: vale en design systems y pantallas críticas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Loguearse por la UI en cada e2e.</strong>{" "}
            Suma minutos y un punto de falla a cada test.
          </li>
          <li>
            <strong className="text-foreground">Capturas visuales generadas en máquinas distintas.</strong>{" "}
            Cada diferencia de fuentes es un falso positivo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Shardear 40 e2e en 4 máquinas del CI.</li>
          <li>Chromatic sobre el Storybook del design system.</li>
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
            Este e2e falla una de cada cinco veces en el CI y nunca en local.
            ¿Qué lo hace frágil?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`test("editar perfil", async ({ page }) => {
  await page.goto("/login");
  await page.fill("#email", "admin@test.com");
  await page.fill("#pass", "123456");
  await page.click(".btn-primary");
  await page.waitForTimeout(3000);
  await page.goto("/perfil");
  await page.fill("input:nth-child(2)", "Nuevo nombre");
  await page.click("text=Guardar");
  expect(await page.textContent(".toast")).toBe("Guardado");
});`}
          </pre>
          <RevelarSolucion>
            <p>
              1) <code>waitForTimeout(3000)</code>: en un CI más lento el login
              puede tardar más; hay que esperar una condición (la URL o un
              elemento del dashboard). 2) Selectores frágiles (
              <code>.btn-primary</code>, <code>nth-child(2)</code>): cambian con
              el diseño; mejor <code>getByRole</code> y <code>getByLabel</code>.
              3) <code>expect(await textContent())</code> lee una sola vez y no
              reintenta: si el toast todavía no apareció, falla; hay que usar{" "}
              <code>await expect(locator).toHaveText()</code>, que reintenta. 4)
              Usa un usuario compartido: si otro test en paralelo lo modifica,
              chocan; cada test debería crear su usuario o usar datos aislados.
              5) Loguearse por la UI en cada test: mejor un setup con{" "}
              <code>storageState</code>.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
