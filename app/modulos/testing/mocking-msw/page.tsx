import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { MockingCapasSimulador } from "@/components/modulo/MockingCapasSimulador";
import { entrevistaMockingMsw } from "@/lib/modules/testing/mocking-msw-entrevista";

const preguntasPorNivel = {
  1: entrevistaMockingMsw.filter((p) => p.nivel === 1),
  2: entrevistaMockingMsw.filter((p) => p.nivel === 2),
  3: entrevistaMockingMsw.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Mocking strategies (MSW) — Dev Study Lab",
  description:
    "Test doubles, dónde cortar con un mock, MSW para interceptar la red, y cómo evitar que los mocks mientan.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ventaja tiene MSW sobre hacer vi.mock del cliente de API?",
    opciones: [
      "Es más rápido de escribir",
      "Tu código corre completo y el test no depende de cómo hacés los requests",
      "No necesita handlers",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Intercepta en la red: fetch, axios o React Query funcionan igual.",
  },
  {
    pregunta: "Una base de datos en memoria que implementa el mismo repositorio es un...",
    opciones: ["Stub", "Spy", "Fake"],
    respuestaCorrecta: 2,
    explicacion:
      "Un fake es una implementación funcional pero simplificada.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué simula HttpResponse.error() en MSW?",
    opciones: [
      "Un status 500",
      "Un error de red: el fetch rechaza como si se cortara la conexión",
      "Un timeout de 30 segundos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un 500 resuelve el fetch con un status; un error de red lo rechaza. Son caminos distintos.",
  },
  {
    pregunta: "¿Dónde conviene mockear?",
    opciones: [
      "En todos los módulos para aislar al máximo",
      "En los bordes: red, reloj, terceros y APIs que el entorno no tiene",
      "En ningún lado",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Lo propio queda real; así el test verifica integración de verdad.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ayuda a que los handlers de MSW no queden desactualizados?",
    opciones: [
      "Nada, es inevitable",
      "Tiparlos con tipos generados del contrato (OpenAPI o schema GraphQL)",
      "Escribirlos en JavaScript en vez de TypeScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si el contrato cambia, el handler deja de compilar.",
  },
  {
    pregunta: "Con fake timers y userEvent, el test se cuelga. ¿Qué falta?",
    opciones: [
      "Más timeout",
      "userEvent.setup({ advanceTimers: vi.advanceTimersByTime })",
      "Quitar userEvent",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "userEvent usa timers internos que tienen que avanzar con el reloj falso.",
  },
];

export default function MockingMswPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="Mocking strategies (MSW)"
      descripcion="Qué reemplazar en un test, dónde cortar, y por qué interceptar la red suele ser mejor que mockear tus propios módulos."
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
            Un <strong className="text-foreground">test double</strong>{" "}
            reemplaza una dependencia real: <em>stub</em> (respuestas fijas),{" "}
            <em>spy</em> (registra llamadas), <em>mock</em> (con expectativas) y{" "}
            <em>fake</em> (implementación simplificada).
          </p>
          <p>
            La pregunta clave es <strong className="text-foreground">dónde
            cortar</strong>: todo lo que queda por encima del corte se ejecuta
            real; lo de abajo, no. Cuanto más abajo se corta, más código tuyo
            se prueba de verdad. <strong className="text-foreground">MSW</strong>{" "}
            corta en la red: tu componente, tu hook y tu cliente de API corren
            completos, y el test no depende de qué librería hace los requests.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <MockingCapasSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Mockear el hook para testear el componente.</strong>{" "}
            El manejo real de loading y error queda sin probar.
          </li>
          <li>
            <strong className="text-foreground">Requests sin handler que llegan a la red real.</strong>{" "}
            Con <code>onUnhandledRequest: &quot;error&quot;</code> fallan en vez de
            pasar desapercibidos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un archivo <code>mocks/handlers.ts</code> compartido entre tests y Storybook.</li>
          <li>Desarrollar el frontend contra MSW mientras el backend todavía no existe.</li>
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
            Los casos límite se prueban con{" "}
            <strong className="text-foreground">overrides por test</strong>:{" "}
            <code>server.use()</code> con un 500, <code>HttpResponse.error()</code>{" "}
            para un error de red, o <code>delay()</code> para ver el estado de
            carga; <code>server.resetHandlers()</code> los limpia después.
          </p>
          <p>
            Se mockea en los <strong className="text-foreground">bordes</strong>:
            red, reloj, terceros, APIs que jsdom no tiene. Si un test necesita
            mockear medio mundo, el problema suele ser de diseño.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Olvidar <code>resetHandlers</code>.</strong>{" "}
            Un override de error contamina a los tests siguientes.
          </li>
          <li>
            <strong className="text-foreground">Verificar que se llamó a una función interna.</strong>{" "}
            El test se rompe con cada refactor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un test por cada estado de una pantalla: carga, vacío, error, datos.</li>
          <li>Reemplazar mocks de módulos internos por handlers de MSW.</li>
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
            Todo mock es una suposición que puede quedar vieja. Se mantiene
            honesta tipando los handlers con el contrato generado, validando
            respuestas con un esquema en runtime, con contract tests y con unos
            pocos e2e.
          </p>
          <p>
            El tiempo se controla con{" "}
            <strong className="text-foreground">fake timers</strong>{" "}
            (<code>vi.useFakeTimers</code>, <code>advanceTimersByTime</code>,{" "}
            <code>setSystemTime</code>), cuidando la integración con userEvent y
            las Promises, o inyectando el reloj como dependencia.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Handlers escritos a mano sin tipos.</strong>{" "}
            Se desincronizan en silencio.
          </li>
          <li>
            <strong className="text-foreground">No restaurar los timers reales.</strong>{" "}
            Afecta a los tests que corren después.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Handlers generados desde el OpenAPI del backend.</li>
          <li>Probar un buscador con debounce sin esperar tiempo real.</li>
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
            Este test pasa, pero producción mostró &quot;Total: $NaN&quot;
            después de un deploy del backend. ¿Por qué el test no lo atrapó y
            qué cambiarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`vi.mock("@/lib/api", () => ({
  getCarrito: vi.fn().mockResolvedValue({ items: [{ precio: 100, cantidad: 2 }] }),
}));

it("muestra el total", async () => {
  render(<Carrito />);
  expect(await screen.findByText("Total: $200")).toBeInTheDocument();
  expect(getCarrito).toHaveBeenCalledWith("usuario-1");
});`}
          </pre>
          <RevelarSolucion>
            <p>
              El mock devuelve una forma de datos escrita a mano que ya no
              coincide con la API real (probablemente el backend cambió{" "}
              <code>precio</code> por otro campo). El test verifica el mock, no
              el contrato, y además está atado a la firma interna de{" "}
              <code>getCarrito</code>. Mejoras: interceptar en la red con MSW en
              vez de mockear el módulo; tipar el handler con los tipos generados
              del contrato para que el cambio rompa la compilación; validar la
              respuesta con Zod en el cliente para que un cambio de forma falle
              de manera explícita; sacar el <code>toHaveBeenCalledWith</code>{" "}
              (es implementación); y cubrir el flujo con un e2e o un contract
              test contra la API real.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
