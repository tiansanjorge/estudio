import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { McpSimulador } from "@/components/modulo/McpSimulador";
import { entrevistaMcpServers } from "@/lib/modules/ia-aplicada/mcp-servers-entrevista";

const preguntasPorNivel = {
  1: entrevistaMcpServers.filter((p) => p.nivel === 1),
  2: entrevistaMcpServers.filter((p) => p.nivel === 2),
  3: entrevistaMcpServers.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "MCP servers — qué son y para qué sirven — Dev Study Lab",
  description:
    "Model Context Protocol: host, cliente y servidor; tools, resources y prompts; transportes y autorización; cuándo usarlo; riesgos de seguridad y diseño de un servidor propio.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema resuelve MCP?",
    opciones: [
      "Estandariza cómo la IA se conecta a herramientas y datos",
      "Entrena al modelo con los datos privados de la empresa",
      "Reemplaza el function calling de cada proveedor de modelos",
    ],
    respuestaCorrecta: 0,
    explicacion: "Un servicio se expone una vez y lo usa cualquier aplicación compatible.",
  },
  {
    pregunta: "¿Quién decide cuándo se llama a una tool?",
    opciones: [
      "El servidor MCP",
      "El modelo",
      "El usuario, en cada llamada",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las tools son model-controlled; los prompts, user-controlled; los resources, application-controlled.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "En el transporte stdio, ¿de dónde saca el servidor sus credenciales?",
    opciones: [
      "Del token OAuth del usuario",
      "De los mensajes del modelo",
      "Del entorno, como variables de entorno",
    ],
    respuestaCorrecta: 2,
    explicacion: "El marco de autorización de la especificación es para los transportes HTTP.",
  },
  {
    pregunta: "Una sola app propia necesita que el LLM llame a tu API. ¿Qué es lo más simple?",
    opciones: [
      "Function calling de la API del modelo",
      "Un servidor MCP remoto con OAuth",
      "Un servidor MCP local por stdio",
    ],
    respuestaCorrecta: 0,
    explicacion: "MCP rinde cuando la integración la comparten varias herramientas.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué es el token passthrough en un servidor MCP remoto?",
    opciones: [
      "Reenviarle al modelo el token del usuario para que llame a la API",
      "Aceptar tokens no emitidos para el servidor y reenviarlos a otra API",
      "Renovar los tokens del usuario sin pedirle permiso otra vez",
    ],
    respuestaCorrecta: 1,
    explicacion: "La especificación lo prohíbe: el servidor solo acepta tokens emitidos para él.",
  },
  {
    pregunta: "Una tool devuelve 10.000 filas. ¿Qué problema trae?",
    opciones: [
      "El protocolo MCP corta la respuesta a mil filas",
      "El servidor tarda demasiado y la llamada da timeout",
      "Llena el contexto del modelo y diluye lo importante",
    ],
    respuestaCorrecta: 2,
    explicacion: "Las tools bien diseñadas paginan y resumen.",
  },
];

export default function McpServersPage() {
  return (
    <ModuloLayout
      categoriaTitulo="IA aplicada al desarrollo"
      titulo="MCP servers — qué son y para qué sirven"
      descripcion="El protocolo que conecta asistentes de IA con bases, repositorios y servicios, y lo que implica darle a un modelo la capacidad de actuar."
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
            <strong className="text-foreground">MCP</strong> estandariza la
            conexión entre aplicaciones de IA y herramientas: el{" "}
            <strong className="text-foreground">host</strong> contiene al modelo,
            un <strong className="text-foreground">cliente</strong> por cada
            conexión, y cada <strong className="text-foreground">servidor</strong>{" "}
            expone capacidades, con mensajes JSON-RPC 2.0.
          </p>
          <p>
            Tools (las decide el modelo), resources (la aplicación) y prompts
            (el usuario).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <McpSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Conectar servidores sin mirar qué pueden hacer.</strong>{" "}
            Cada tool es una acción que el modelo puede decidir ejecutar.
          </li>
          <li>
            <strong className="text-foreground">Descripciones de tools vagas.</strong>{" "}
            El modelo decide qué llamar leyéndolas; si son ambiguas, elige mal.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un asistente de código que consulta la base de desarrollo en solo lectura.</li>
          <li>Un servidor con la documentación interna para todos los asistentes del equipo.</li>
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
            <strong className="text-foreground">Transportes</strong>: stdio
            para servidores locales (credenciales del entorno) y Streamable HTTP
            para remotos (autorización con OAuth 2.1).
          </p>
          <p>
            <strong className="text-foreground">Cuándo usarlo</strong>: cuando
            la integración la comparten varias herramientas; para una sola app,
            function calling directo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un servidor MCP para una integración de una sola app.</strong>{" "}
            Una pieza más para operar sin ningún beneficio de reutilización.
          </li>
          <li>
            <strong className="text-foreground">Credenciales de administrador en un servidor local.</strong>{" "}
            El modelo hereda todo ese poder.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un servidor stdio de Postgres con un usuario de solo lectura.</li>
          <li>Un servidor HTTP interno con OAuth para el sistema de tickets.</li>
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
            <strong className="text-foreground">Seguridad</strong>: servidores
            locales como código ejecutable, prompt injection en los resultados,
            mínimo privilegio, aprobación humana, y los antipatrones de token
            passthrough y confused deputy.
          </p>
          <p>
            <strong className="text-foreground">Diseño</strong>: pocas tools
            orientadas a tareas, descripciones claras, resultados acotados,
            errores útiles y lectura separada de escritura.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Instalar siempre la última versión de un servidor.</strong>{" "}
            Un cambio malicioso llega directo a tu máquina.
          </li>
          <li>
            <strong className="text-foreground">Una tool por cada endpoint.</strong>{" "}
            El modelo tiene que coordinar llamadas que una tool orientada a la tarea resolvería.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Aprobación obligatoria para toda tool que crea, modifica o borra.</li>
          <li>Un registro de auditoría de cada llamada a un servidor interno.</li>
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
            El equipo de soporte quiere que su asistente de IA pueda consultar
            pedidos, ver el historial de un cliente y emitir reembolsos, usando
            la API interna. Diseñá el servidor MCP: qué tools, con qué
            permisos y qué controles.
          </p>
          <RevelarSolucion>
            <p>
              Transporte HTTP, porque lo comparte todo el equipo, con OAuth para
              que cada agente de soporte actúe con su propia identidad y el
              servidor aplique sus permisos (un agente junior no puede
              reembolsar montos grandes). Tools orientadas a la tarea:{" "}
              <code>buscar_pedidos</code> (por cliente, número o fecha, con
              paginación), <code>resumen_cliente</code> (historial resumido, no
              todas las filas) y <code>emitir_reembolso</code>. Las dos primeras,
              de solo lectura. El reembolso, marcado como operación de escritura
              para que el host pida aprobación humana, con idempotency key por
              pedido para que un reintento no reembolse dos veces, y un límite
              de monto por encima del cual se deriva a un supervisor.
              Descripciones precisas y errores accionables. Los datos que
              devuelve el servidor (notas de clientes, mensajes) pueden contener
              instrucciones inyectadas, por eso la aprobación del reembolso no
              depende de lo que decida el modelo. Registro de auditoría de cada
              llamada con el usuario y los argumentos, y límites de uso por
              agente.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
