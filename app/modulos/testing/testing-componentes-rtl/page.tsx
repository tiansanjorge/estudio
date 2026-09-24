import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { QueriesRtlExplorador } from "@/components/modulo/QueriesRtlExplorador";
import { entrevistaTestingComponentesRtl } from "@/lib/modules/testing/testing-componentes-rtl-entrevista";

const preguntasPorNivel = {
  1: entrevistaTestingComponentesRtl.filter((p) => p.nivel === 1),
  2: entrevistaTestingComponentesRtl.filter((p) => p.nivel === 2),
  3: entrevistaTestingComponentesRtl.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Testing de componentes React (RTL) — Dev Study Lab",
  description:
    "React Testing Library: queries accesibles, getBy/queryBy/findBy, userEvent, providers y los errores comunes con act y waitFor.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué query conviene para encontrar un botón?",
    opciones: [
      "getByRole('button', { name: 'Guardar' })",
      "getByTestId('boton-guardar')",
      "getByText('Guardar')",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Busca como el usuario y verifica de paso rol y nombre accesible.",
  },
  {
    pregunta: "¿Cómo afirmás que un mensaje de error NO se muestra?",
    opciones: [
      "expect(getByRole('alert')).not.toBeInTheDocument()",
      "expect(queryByRole('alert')).not.toBeInTheDocument()",
      "expect(await findByRole('alert')).toBeNull()",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "getBy lanza si no encuentra; queryBy devuelve null.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué userEvent en vez de fireEvent para escribir en un input?",
    opciones: [
      "Porque fireEvent está deprecado desde React 18",
      "Porque userEvent es síncrono y evita los warnings de act",
      "Simula la secuencia real de eventos y respeta disabled",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Atrapa bugs que un único evento sintético no dispara.",
  },
  {
    pregunta: "¿Por qué crear un QueryClient nuevo en cada test?",
    opciones: [
      "Para que el cache de un test no contamine al siguiente",
      "Porque un QueryClient solo puede usarse con un render",
      "Para que los reintentos arranquen de cero en cada test",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Y con retry: false, para que los tests de error no esperen reintentos.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Aparece el warning 'not wrapped in act(...)'. ¿Cuál es el arreglo correcto?",
    opciones: [
      "Envolver el render en act() para silenciar el warning",
      "Esperar el resultado de la actualización con findBy o waitFor",
      "Pasar a fake timers para que el efecto corra en el acto",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El warning indica que el test no esperó algo que el componente seguía haciendo.",
  },
  {
    pregunta: "¿Qué no va adentro de un waitFor?",
    opciones: [
      "Assertions con expect",
      "Queries con getBy",
      "Acciones como clicks",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "waitFor reintenta la función: la acción se ejecutaría varias veces.",
  },
];

export default function TestingComponentesRtlPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="Testing de componentes React (RTL)"
      descripcion="Testear componentes como los usa una persona: encontrar elementos por lo que se ve y se anuncia, interactuar como un usuario, y esperar lo asincrónico."
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
            React Testing Library renderiza al DOM y no expone estado ni props:
            los tests <strong className="text-foreground">encuentran elementos
            como un usuario</strong> y verifican lo que ve. Un refactor que no
            cambia el comportamiento no rompe los tests.
          </p>
          <p>
            Prioridad de queries: <code>getByRole</code> (con{" "}
            <code>name</code>) → <code>getByLabelText</code> →{" "}
            <code>getByPlaceholderText</code> → <code>getByText</code> → … →{" "}
            <code>getByTestId</code> como último recurso. Y la variante según
            la situación: <code>getBy</code> (tiene que estar),{" "}
            <code>queryBy</code> (verificar ausencia), <code>findBy</code>{" "}
            (aparece después).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <QueriesRtlExplorador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>data-testid</code> para todo.</strong>{" "}
            El test pasa aunque el componente sea inaccesible.
          </li>
          <li>
            <strong className="text-foreground"><code>getBy</code> para algo que aparece después.</strong>{" "}
            Falla porque todavía no está; hace falta <code>findBy</code>.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Testear un formulario de login: campos, validación y mensaje de error.</li>
          <li>Usar el Testing Playground para encontrar la mejor query.</li>
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
            <strong className="text-foreground">userEvent</strong> simula la
            interacción completa (foco, teclas, input, disabled);{" "}
            <code>fireEvent</code> dispara un solo evento sintético. Desde v14
            se usa <code>const user = userEvent.setup()</code> y cada acción es
            async.
          </p>
          <p>
            Los componentes que dependen de <strong className="text-foreground">providers</strong>{" "}
            (router, React Query, auth, tema) se testean con un{" "}
            <code>render</code> custom que los arma, en vez de mockear los
            hooks. Un <code>QueryClient</code> nuevo por test, sin reintentos, y
            la red con MSW.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">QueryClient compartido entre tests.</strong>{" "}
            El cache de uno hace pasar o fallar al siguiente.
          </li>
          <li>
            <strong className="text-foreground">Olvidar el <code>await</code> en userEvent.</strong>{" "}
            El assert corre antes de que termine la interacción.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un <code>test-utils.tsx</code> con <code>renderConProviders</code>.</li>
          <li>Testear navegación con un router en memoria y una ruta inicial.</li>
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
            El warning de <strong className="text-foreground">act</strong>{" "}
            indica una actualización de estado que el test no esperó. Se
            resuelve esperando el resultado visible (<code>findBy</code>,{" "}
            <code>waitFor</code>), no envolviendo código en <code>act</code> a
            mano.
          </p>
          <p>
            <strong className="text-foreground">waitFor</strong>: un solo assert
            adentro, nunca acciones, preferir <code>findBy</code> cuando alcanza
            y <code>waitForElementToBeRemoved</code> para esperar que algo
            desaparezca.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Subir el timeout de waitFor.</strong>{" "}
            Suele esconder reintentos o timers reales mal configurados.
          </li>
          <li>
            <strong className="text-foreground">Ignorar los warnings de act.</strong>{" "}
            Son la antesala de un test flaky.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Configurar la regla de ESLint <code>testing-library</code> para atrapar estos errores.</li>
          <li>Revisar tests flaky buscando waitFor con acciones adentro.</li>
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
          <p>Reescribí este test siguiendo las prácticas de RTL.</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`it("agrega un comentario", async () => {
  const { container } = render(<Comentarios />);
  fireEvent.change(container.querySelector("textarea"), {
    target: { value: "Buen post" },
  });
  fireEvent.click(screen.getByTestId("btn-enviar"));
  await waitFor(() => {
    expect(screen.getByText("Buen post")).toBeInTheDocument();
    expect(container.querySelectorAll(".comentario").length).toBe(1);
  });
});`}
          </pre>
          <RevelarSolucion>
            <p>
              Con <code>const user = userEvent.setup()</code>:{" "}
              <code>await user.type(screen.getByRole(&quot;textbox&quot;, {"{ name: \"Comentario\" }"}), &quot;Buen post&quot;)</code>{" "}
              y{" "}
              <code>await user.click(screen.getByRole(&quot;button&quot;, {"{ name: \"Enviar\" }"}))</code>.
              Después,{" "}
              <code>expect(await screen.findByText(&quot;Buen post&quot;)).toBeInTheDocument()</code>{" "}
              y, si importa la cantidad,{" "}
              <code>expect(screen.getAllByRole(&quot;listitem&quot;)).toHaveLength(1)</code>.
              Se van el <code>querySelector</code> por clases, el{" "}
              <code>data-testid</code>, los <code>fireEvent</code> y el{" "}
              <code>waitFor</code> con dos asserts. Si el textarea no se
              encuentra por rol y nombre, el test acaba de descubrir que le
              falta un label.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
