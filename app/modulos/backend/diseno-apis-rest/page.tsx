import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PaginacionSimulador } from "@/components/modulo/PaginacionSimulador";
import { entrevistaDisenoApisRest } from "@/lib/modules/backend/diseno-apis-rest-entrevista";

const preguntasPorNivel = {
  1: entrevistaDisenoApisRest.filter((p) => p.nivel === 1),
  2: entrevistaDisenoApisRest.filter((p) => p.nivel === 2),
  3: entrevistaDisenoApisRest.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Diseño de APIs REST — Dev Study Lab",
  description:
    "Recursos y URLs, paginación por offset y por cursor, formato de errores, operaciones largas, concurrencia optimista y HATEOAS.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuál de estas URLs sigue las convenciones REST?",
    opciones: ["POST /crearPedido", "POST /pedidos", "GET /pedidos/borrar/41"],
    respuestaCorrecta: 1,
    explicacion:
      "La URL nombra el recurso; el método indica la acción.",
  },
  {
    pregunta: "En un feed con scroll infinito, llega un post nuevo mientras el usuario lee. ¿Qué paginación evita duplicados?",
    opciones: ["Offset", "Cursor", "Ninguna"],
    respuestaCorrecta: 1,
    explicacion:
      "El cursor pide lo que viene después del último visto, sin importar lo que se insertó arriba.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué conviene incluir en el body de un error para que el cliente lo maneje?",
    opciones: [
      "El stack trace",
      "Un código estable legible por máquina, detalle por campo y un requestId",
      "Solo un mensaje en texto libre",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El cliente no debería parsear mensajes; el requestId conecta con los logs.",
  },
  {
    pregunta: "¿Cómo se responde a un POST que inicia un proceso de varios minutos?",
    opciones: [
      "Se espera y se responde 200 al terminar",
      "202 Accepted con la URL de un recurso de estado",
      "500 si tarda mucho",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El cliente consulta el estado o recibe un aviso al completar.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Dos usuarios editan el mismo pedido y el segundo pisa al primero. ¿Qué lo evita?",
    opciones: [
      "Un lock global de la tabla",
      "Concurrencia optimista con ETag e If-Match (412 si cambió)",
      "Hacer los PUT más rápidos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El servidor aplica el cambio solo si la versión que vio el cliente sigue siendo la actual.",
  },
  {
    pregunta: "La mayoría de las APIs 'REST' en producción están en qué nivel de Richardson?",
    opciones: ["Nivel 0", "Nivel 2: recursos más verbos HTTP", "Nivel 3: con hipermedia completa"],
    respuestaCorrecta: 1,
    explicacion:
      "HATEOAS completo rara vez justifica su complejidad para clientes conocidos.",
  },
];

export default function DisenoApisRestPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Diseño de APIs REST"
      descripcion="Decisiones de diseño que hacen a una API predecible y fácil de consumir: recursos, paginación, errores, operaciones largas y concurrencia."
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
            Las URLs nombran <strong className="text-foreground">recursos</strong>{" "}
            en plural y el método HTTP la acción. Anidamiento de un solo nivel
            para relaciones claras; filtros, orden y paginación como query
            params. Los métodos y status se vieron en HTTP y Networking; acá
            importa cómo se combinan en un diseño consistente.
          </p>
          <p>
            La <strong className="text-foreground">paginación</strong> es una
            de las decisiones con más consecuencias: offset es simple pero se
            desordena cuando los datos cambian y se vuelve lento en páginas
            lejanas; cursor escala y es estable, sin saltos a página arbitraria.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Offset vs cursor">
        <PaginacionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Verbos en las URLs.</strong>{" "}
            <code>/getUsuarios</code> duplica lo que ya dice el método.
          </li>
          <li>
            <strong className="text-foreground">Endpoints sin paginación.</strong>{" "}
            Funcionan con 50 filas y tiran el servidor con 500.000.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un feed con scroll infinito paginado por cursor.</li>
          <li>Una guía de estilo de API compartida por los equipos.</li>
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
            <strong className="text-foreground">Errores</strong> con un formato
            único (Problem Details como base), un código estable legible por
            máquina, detalle por campo y un id de request.
          </p>
          <p>
            <strong className="text-foreground">Operaciones largas</strong> como
            recursos: <code>202 Accepted</code>, una URL de estado, y aviso al
            terminar por webhook, SSE o email. Creación idempotente para que un
            reintento no las duplique.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Cada endpoint con su propio formato de error.</strong>{" "}
            El cliente termina con diez parsers distintos.
          </li>
          <li>
            <strong className="text-foreground">Requests que esperan minutos.</strong>{" "}
            Los cortan timeouts intermedios y ocupan recursos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Un middleware que convierte errores de dominio a Problem Details.</li>
          <li>Exportaciones con <code>POST /exportaciones</code> y polling del estado.</li>
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
            <strong className="text-foreground">Concurrencia optimista</strong>:{" "}
            <code>ETag</code> al leer, <code>If-Match</code> al escribir,{" "}
            <code>412</code> si cambió, y una columna <code>version</code> en la
            base. Evita que un guardado pise a otro en silencio.
          </p>
          <p>
            <strong className="text-foreground">HATEOAS</strong> es la
            restricción de REST más ignorada: links a acciones disponibles en
            cada respuesta. La versión liviana (links de paginación, acciones
            permitidas) sí suele aportar.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Leer-modificar-escribir para un contador.</strong>{" "}
            Una operación atómica en la base evita la carrera.
          </li>
          <li>
            <strong className="text-foreground">Discutir pureza REST en vez de consistencia.</strong>{" "}
            Una API consistente y documentada vale más que una &quot;pura&quot;.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Editar un documento compartido con detección de conflictos.</li>
          <li>Un campo <code>accionesPermitidas</code> para que la UI no duplique reglas.</li>
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
          <p>Rediseñá estos endpoints de una API de turnos médicos.</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`GET  /getTurnos?pagina=1            → todos los turnos del sistema
POST /turnos/nuevo
POST /turnos/cancelarTurno?id=88
GET  /medicos/3/pacientes/12/turnos/88/detalle
POST /turnos/88                     → reemplaza el turno completo`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>GET /turnos?medicoId=3&amp;desde=2026-10-01&amp;limit=20&amp;cursor=…</code>{" "}
              (filtros explícitos, paginación por cursor y, sobre todo,
              autorización: el paciente solo ve los suyos).{" "}
              <code>POST /turnos</code> → <code>201</code> con{" "}
              <code>Location</code>, con idempotency key para no duplicar
              reservas. La cancelación como acción sobre el recurso:{" "}
              <code>POST /turnos/88/cancelacion</code> (o{" "}
              <code>PATCH /turnos/88</code> con <code>estado: &quot;cancelado&quot;</code>).
              El detalle es simplemente <code>GET /turnos/88</code>: el
              anidamiento profundo no aporta si el turno tiene id propio. Y las
              modificaciones con <code>PATCH /turnos/88</code> e{" "}
              <code>If-Match</code>, para que dos secretarias no reprogramen el
              mismo turno a la vez.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
