import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ApiTestSuiteSimulador } from "@/components/modulo/ApiTestSuiteSimulador";
import { entrevistaTestingApis } from "@/lib/modules/testing/testing-apis-entrevista";

const preguntasPorNivel = {
  1: entrevistaTestingApis.filter((p) => p.nivel === 1),
  2: entrevistaTestingApis.filter((p) => p.nivel === 2),
  3: entrevistaTestingApis.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Testing de APIs — Dev Study Lab",
  description:
    "Qué casos cubrir en un endpoint, cómo testear sin levantar el servidor, datos de prueba, servicios externos, concurrencia y contratos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un POST con datos inválidos responde 400. ¿Qué más verificás?",
    opciones: [
      "Nada más",
      "Que no se haya guardado nada en la base",
      "Que tarde menos de 1 segundo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Una respuesta de error con un registro guardado igual es un bug.",
  },
  {
    pregunta: "¿Qué hace Supertest?",
    opciones: [
      "Mockea la base de datos",
      "Hace requests a la app en memoria, sin abrir un puerto",
      "Genera documentación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Ejercita el pipeline real (routing, middlewares, validación) con velocidad de test.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué preferir factories a fixtures gigantes compartidas?",
    opciones: [
      "Son más rápidas",
      "Cada test crea y declara solo los datos que le importan, sin depender de otros",
      "No hay diferencia",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las fixtures compartidas acoplan tests entre sí y esconden qué dato usa cada uno.",
  },
  {
    pregunta: "¿Qué escenarios de un servicio de pagos conviene testear sí o sí?",
    opciones: [
      "Solo el pago aprobado",
      "Rechazos, timeouts, respuestas inesperadas y webhooks duplicados",
      "Ninguno, es un tercero",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El camino feliz es el que menos sorpresas trae en producción.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo se testea una condición de carrera en un endpoint?",
    opciones: [
      "Con requests secuenciales",
      "Disparando requests en paralelo contra una base real y verificando el estado final",
      "Con mocks de la base",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Suelen revelar que falta un constraint, un lock o una actualización atómica.",
  },
  {
    pregunta: "¿Qué hace una herramienta como Schemathesis a partir de un OpenAPI?",
    opciones: [
      "Genera el frontend",
      "Genera cientos de requests automáticos para encontrar 500s y violaciones del contrato",
      "Traduce la documentación",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es testing basado en propiedades sobre la especificación.",
  },
];

export default function TestingApisPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Testing"
      titulo="Testing de APIs"
      descripcion="Verificar un endpoint de punta a punta: respuesta, estado de la base, permisos, datos expuestos y lo que pasa con requests simultáneos."
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
            Un test de API manda un request a la aplicación{" "}
            <strong className="text-foreground">en memoria</strong> (Supertest,{" "}
            <code>fastify.inject</code>, o llamando al Route Handler) y verifica
            status, headers, body y el estado de la base.
          </p>
          <p>
            Los casos se piensan por categoría: camino feliz, validación,
            autenticación, <strong className="text-foreground">autorización</strong>,
            reglas de negocio, <strong className="text-foreground">exposición de
            datos</strong> e idempotencia. Las dos resaltadas son las que más se
            olvidan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ApiTestSuiteSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Testear solo el camino feliz.</strong>{" "}
            Los bugs caros están en permisos y validaciones.
          </li>
          <li>
            <strong className="text-foreground">Verificar solo la respuesta.</strong>{" "}
            El endpoint puede responder bien y no haber guardado, o haber
            guardado de más.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una suite por recurso con los mismos bloques de casos.</li>
          <li>Tests de autorización para cada rol en endpoints administrativos.</li>
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
            <strong className="text-foreground">Datos de prueba</strong>: base
            real aislada por test (transacción revertida, truncado o una base
            por worker) y factories con valores por defecto válidos.
          </p>
          <p>
            <strong className="text-foreground">Servicios externos</strong>: se
            corta en la red (MSW, nock) o en un adaptador propio con un fake, y
            se testean los escenarios feos: rechazos, timeouts, respuestas raras
            y webhooks duplicados.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Llamar al sandbox del proveedor en cada test.</strong>{" "}
            Lento y dependiente de un tercero; va en un pipeline aparte.
          </li>
          <li>
            <strong className="text-foreground">Tests que dependen de datos de otro test.</strong>{" "}
            Fallan al correrlos solos o en paralelo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un fake de <code>PasarelaPagos</code> configurable por test.</li>
          <li>Tests en paralelo con una base por worker.</li>
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
            Las <strong className="text-foreground">condiciones de carrera</strong>{" "}
            solo aparecen con requests simultáneos: se testean con{" "}
            <code>Promise.all</code> contra una base real, verificando el estado
            final.
          </p>
          <p>
            La especificación <strong className="text-foreground">OpenAPI</strong>{" "}
            se vuelve un contrato verificable: validar respuestas contra el
            schema, generar tipos y mocks, fuzzing automático y detección de
            breaking changes entre versiones.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Leer y después escribir sin atomicidad.</strong>{" "}
            Dos requests leen el mismo stock y los dos venden.
          </li>
          <li>
            <strong className="text-foreground">Documentación escrita a mano que nadie verifica.</strong>{" "}
            Se desincroniza con el primer cambio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un test de concurrencia para el último ítem en stock.</li>
          <li>Validar cada respuesta de la suite contra el OpenAPI.</li>
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
            Esta es toda la suite de un endpoint de transferencias bancarias.
            ¿Qué le falta?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`it("transfiere dinero", async () => {
  const res = await request(app)
    .post("/transferencias")
    .set("Cookie", sesionDe(ana))
    .send({ destino: beto.cuenta, monto: 1000 });
  expect(res.status).toBe(201);
});`}
          </pre>
          <RevelarSolucion>
            <p>
              Verificar saldos después (Ana bajó 1000, Beto subió 1000). Validación:
              monto negativo, cero, con decimales inválidos, cuenta inexistente,
              transferirse a sí mismo. Reglas: saldo insuficiente, sin que se
              mueva nada. Autenticación (401) y autorización: que Ana no pueda
              debitar de una cuenta ajena cambiando el origen. Idempotencia con{" "}
              <code>Idempotency-Key</code> para que un reintento no transfiera
              dos veces. Concurrencia: dos transferencias simultáneas que juntas
              superan el saldo, y solo una debe pasar. Y que la respuesta no
              exponga datos de la cuenta del destinatario.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
