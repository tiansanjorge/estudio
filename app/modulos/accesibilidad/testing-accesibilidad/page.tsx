import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { AxeDeteccionJuego } from "@/components/modulo/AxeDeteccionJuego";
import { entrevistaTestingAccesibilidad } from "@/lib/modules/accesibilidad/testing-accesibilidad-entrevista";

const preguntasPorNivel = {
  1: entrevistaTestingAccesibilidad.filter((p) => p.nivel === 1),
  2: entrevistaTestingAccesibilidad.filter((p) => p.nivel === 2),
  3: entrevistaTestingAccesibilidad.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Testing de accesibilidad — Dev Study Lab",
  description:
    "Qué encuentran las herramientas automáticas como axe, qué no, y cómo combinar tests automáticos, teclado y lector de pantalla.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué significa un 100 en accesibilidad en Lighthouse?",
    opciones: [
      "Que la página cumple WCAG",
      "Que no se encontraron las violaciones que las reglas automáticas pueden detectar",
      "Que la probó un lector de pantalla",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las reglas automáticas no juzgan comportamiento ni significado; el 100 es un piso.",
  },
  {
    pregunta: "¿Cuál de estos problemas NO detecta axe?",
    opciones: [
      "Una imagen sin alt",
      "Un div con onClick que no responde al teclado",
      "Un input sin label",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "axe no ve los event listeners: no sabe que el div es interactivo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Un test usa getByRole('button', { name: 'Guardar' }) y alguien cambia el botón por un div. ¿Qué pasa?",
    opciones: [
      "El test sigue pasando",
      "El test falla, porque el div no tiene rol de botón",
      "El test se saltea",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las queries por rol cubren de paso la accesibilidad del componente.",
  },
  {
    pregunta: "Un proyecto legacy tiene 400 violaciones de axe. ¿Cómo lo sumás al CI?",
    opciones: [
      "Desactivando axe hasta arreglar todo",
      "Con una línea base: el CI falla solo ante violaciones nuevas",
      "Haciendo que el CI falle desde hoy con las 400",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Frena el crecimiento sin bloquear al equipo, y la deuda se paga de a poco.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué se suele desactivar la regla color-contrast en jest-axe?",
    opciones: [
      "Porque el contraste no importa en tests",
      "Porque jsdom no tiene layout ni estilos computados reales, y la regla no puede calcularse",
      "Porque es una regla deprecada",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El contraste se chequea con axe en un navegador real, por ejemplo con Playwright.",
  },
  {
    pregunta: "¿Qué hacés con los resultados 'incomplete' de axe?",
    opciones: [
      "Romper el build",
      "Ignorarlos siempre",
      "No bloquear el CI, pero revisarlos a mano",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Son casos que axe no pudo decidir; bloquear con ellos generaría ruido.",
  },
];

export default function TestingAccesibilidadPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Accesibilidad"
      titulo="Testing de accesibilidad (axe)"
      descripcion="Qué encuentran las herramientas automáticas, qué se les escapa, y cómo armar una estrategia que combine CI, teclado y lector de pantalla."
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
            <strong className="text-foreground">axe-core</strong> es el motor
            de reglas de accesibilidad más usado: está detrás de Lighthouse,
            de la extensión axe DevTools y de las integraciones con tests.
            Analiza el DOM renderizado y el árbol de accesibilidad y reporta
            violaciones concretas, con la regla, el elemento y cómo
            arreglarlo.
          </p>
          <p>
            Su límite es estructural: verifica lo que se puede comprobar
            mirando el DOM (que un atributo exista, que un rol sea válido, que
            el contraste alcance). No puede juzgar si un texto alternativo
            tiene sentido ni cómo se comporta la interfaz con el teclado.
            Por eso la estrategia es en capas:{" "}
            <strong className="text-foreground">automático</strong>,{" "}
            <strong className="text-foreground">teclado</strong> y{" "}
            <strong className="text-foreground">lector de pantalla</strong>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <AxeDeteccionJuego />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Tomar el puntaje de Lighthouse como certificación.
            </strong>{" "}
            Una página con 100 puede ser inusable con teclado.
          </li>
          <li>
            <strong className="text-foreground">
              Auditar solo el estado inicial.
            </strong>{" "}
            Menús abiertos, modales y errores de validación también son
            estados de la página.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Pasar la extensión axe DevTools por cada página nueva antes del
            review.
          </li>
          <li>
            Agregar <code>eslint-plugin-jsx-a11y</code> para detectar errores
            mientras se escribe el código.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            En el pipeline, axe entra en tres lugares: tests de componentes
            (<code>jest-axe</code> / <code>vitest-axe</code>), tests e2e (
            <code>@axe-core/playwright</code>, con navegador real) y Storybook
            (addon a11y). En CI, las violaciones rompen el build; en proyectos
            legacy se arranca con una línea base.
          </p>
          <p>
            Las queries por rol de Testing Library son un test de
            accesibilidad implícito: <code>getByRole</code> encuentra los
            elementos como lo hace un lector de pantalla, así que un botón sin
            nombre o un div con onClick hacen fallar el test.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Usar <code>getByTestId</code> para todo.
            </strong>{" "}
            El test pasa aunque el componente sea inaccesible.
          </li>
          <li>
            <strong className="text-foreground">
              Desactivar reglas para que el CI pase.
            </strong>{" "}
            Si una regla se desactiva, que sea con un comentario de por qué y
            un ticket para volver.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Un test de Playwright que recorre las rutas principales y corre axe
            en cada una.
          </li>
          <li>
            Tests de componente del design system con axe en cada variante y
            estado.
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
            En <strong className="text-foreground">jsdom</strong> no hay
            layout: el contraste, el contenido oculto visualmente y los
            problemas de viewport no se pueden auditar. Los tests de
            componente cubren la estructura; el navegador real cubre el
            resto.
          </p>
          <p>
            axe apuesta por <strong className="text-foreground">cero falsos
            positivos</strong>: lo que reporta como violación es casi siempre
            real, y lo dudoso va a <code>incomplete</code>. Eso lo vuelve
            confiable para bloquear el CI, a cambio de cobertura.
          </p>
          <p>
            Para lectores de pantalla, las combinaciones que importan son las
            reales: NVDA o JAWS con Chrome en Windows, VoiceOver con Safari en
            macOS e iOS, TalkBack con Chrome en Android.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Creer que jest-axe verifica el contraste.
            </strong>{" "}
            En jsdom esa regla no puede funcionar.
          </li>
          <li>
            <strong className="text-foreground">
              Probar VoiceOver con Chrome y sacar conclusiones.
            </strong>{" "}
            No es una combinación que use la mayoría de los usuarios.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Registrar los <code>incomplete</code> de axe en un reporte que se
            revisa a mano antes de cada release.
          </li>
          <li>
            Definir qué flujos se prueban con lector de pantalla en cada
            release y cuáles solo en auditorías.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este test pasa, pero el dropdown tiene problemas graves de
            accesibilidad cuando está abierto. ¿Por qué el test no los ve y
            cómo lo mejorarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`it("Dropdown es accesible", async () => {
  const { container } = render(<Dropdown opciones={opciones} />);
  expect(await axe(container)).toHaveNoViolations();
});`}
          </pre>
          <RevelarSolucion>
            <p>
              axe solo audita el DOM en el momento en que se lo llama, y el
              test lo llama con el dropdown cerrado: la lista de opciones, sus
              roles y sus atributos ni siquiera están en el DOM. Hay que
              abrirlo antes (<code>await userEvent.click(screen.getByRole(&quot;button&quot;,
              {"{ name: /elegí/i }"}))</code>) y correr axe en ese estado. Y como
              axe no ve comportamiento, sumar asserts de teclado: que{" "}
              <code>aria-expanded</code> cambie, que las flechas muevan la
              opción activa, que Escape cierre y devuelva el foco al botón.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
