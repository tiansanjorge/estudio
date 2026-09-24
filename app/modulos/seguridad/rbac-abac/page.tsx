import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { PoliticasAccesoSimulador } from "@/components/modulo/PoliticasAccesoSimulador";
import { entrevistaRbacAbac } from "@/lib/modules/seguridad/rbac-abac-entrevista";

const preguntasPorNivel = {
  1: entrevistaRbacAbac.filter((p) => p.nivel === 1),
  2: entrevistaRbacAbac.filter((p) => p.nivel === 2),
  3: entrevistaRbacAbac.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "RBAC / ABAC — Dev Study Lab",
  description:
    "Modelos de autorización: roles, atributos, multi-tenancy, mínimo privilegio, ReBAC y motores de políticas.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "'Un editor solo puede editar documentos de su departamento'. ¿Qué modelo lo expresa naturalmente?",
    opciones: ["RBAC puro", "ABAC", "Ninguno"],
    respuestaCorrecta: 1,
    explicacion:
      "Depende de atributos del usuario y del recurso; con RBAC puro haría falta un rol por departamento.",
  },
  {
    pregunta: "¿Qué conviene chequear en el código?",
    opciones: [
      "usuario.rol === 'admin' en cada endpoint",
      "puede(usuario, 'pedido:reembolsar'), con el mapeo rol → permisos en un solo lugar",
      "Nada, lo resuelve el frontend",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Mover un permiso de rol no obliga a buscar ifs por todo el código.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "En un SaaS, un usuario es admin de la org A y lector de la org B. ¿Dónde vive el rol?",
    opciones: ["En el usuario", "En la membresía (usuario + organización)", "En el token para siempre"],
    respuestaCorrecta: 1,
    explicacion:
      "El rol depende de la organización activa.",
  },
  {
    pregunta: "¿Qué permisos debería tener el usuario de base de datos de la aplicación?",
    opciones: [
      "Superusuario, por comodidad",
      "Lectura y escritura sobre sus tablas, sin poder borrar tablas ni cambiar el esquema",
      "Solo lectura",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Mínimo privilegio: las migraciones usan otro usuario con más permisos.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué modelo usa un sistema tipo Google Drive, con carpetas y documentos compartidos?",
    opciones: ["RBAC", "ReBAC (relaciones en un grafo)", "Listas de IPs"],
    respuestaCorrecta: 1,
    explicacion:
      "Los permisos se heredan por relaciones: carpeta, equipo, organización.",
  },
  {
    pregunta: "¿Cuándo rinde un motor de políticas como OPA o Cedar?",
    opciones: [
      "Siempre",
      "Con muchos servicios, reglas complejas o requisitos fuertes de auditoría",
      "Nunca",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para reglas moderadas, una capa de autorización centralizada en el código suele alcanzar.",
  },
];

export default function RbacAbacPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="RBAC / ABAC"
      descripcion="Cómo modelar quién puede hacer qué: roles, atributos, relaciones, y dónde hacer cumplir esas reglas."
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
            <strong className="text-foreground">RBAC</strong>: permisos por
            rol. Simple de entender y auditar, pero no expresa reglas que
            dependen del recurso. <strong className="text-foreground">ABAC</strong>:
            reglas sobre atributos del usuario, del recurso y del contexto. Más
            expresivo, más difícil de auditar.
          </p>
          <p>
            En el código conviene modelar <strong className="text-foreground">permisos</strong>{" "}
            (<code>pedido:reembolsar</code>) y preguntar{" "}
            <code>puede(usuario, permiso)</code>, en vez de comparar roles en
            cada endpoint.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PoliticasAccesoSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Explosión de roles.</strong>{" "}
            &quot;editor-ventas-borradores&quot; es una regla ABAC disfrazada.
          </li>
          <li>
            <strong className="text-foreground"><code>if (rol === &quot;admin&quot;)</code> repartido por todo el código.</strong>{" "}
            Cambiar un permiso es una búsqueda manual.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un guard <code>@RequierePermiso(&quot;pedido:reembolsar&quot;)</code> en NestJS.</li>
          <li>Reglas de edición según estado y autor en un CMS.</li>
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
            En <strong className="text-foreground">multi-tenant</strong>, el
            tenant es el atributo que nunca se negocia: filtro por organización
            en cada consulta (o Row Level Security en Postgres) y roles por
            membresía.
          </p>
          <p>
            <strong className="text-foreground">Mínimo privilegio</strong> para
            todos los actores, también los no humanos: usuarios de base de
            datos, credenciales de cloud, tokens del CI y API keys de terceros.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Confiar en que cada consulta recuerde el filtro por tenant.</strong>{" "}
            Una sola que lo olvide es una fuga entre clientes.
          </li>
          <li>
            <strong className="text-foreground">La app conectándose a la base como superusuario.</strong>{" "}
            Una inyección SQL puede borrar todo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un cliente de Prisma extendido que agrega <code>organizacionId</code> a cada consulta.</li>
          <li>Tests de aislamiento entre tenants en la suite de API.</li>
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
            <strong className="text-foreground">ReBAC</strong> modela permisos
            como relaciones en un grafo, con herencia por carpetas, equipos y
            organizaciones: el modelo de Drive o GitHub, implementado por
            SpiceDB u OpenFGA.
          </p>
          <p>
            Los <strong className="text-foreground">motores de políticas</strong>{" "}
            (OPA, Cedar, Casbin) separan las reglas del código para versionarlas,
            auditarlas y reutilizarlas entre servicios, a costa de otro lenguaje,
            latencia y de alimentar al motor con los atributos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Adoptar un motor de políticas para cinco reglas.</strong>{" "}
            Complejidad operativa sin retorno.
          </li>
          <li>
            <strong className="text-foreground">Relaciones de ReBAC desincronizadas con la base.</strong>{" "}
            Accesos fantasma o permisos que no se revocan.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Compartir documentos con personas y equipos usando OpenFGA.</li>
          <li>Políticas en Rego revisadas por el equipo de seguridad.</li>
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
            Un sistema de clínica tiene los roles <code>medico</code>,{" "}
            <code>recepcion</code> y <code>admin</code>. Aparece un requisito:
            &quot;un médico solo puede ver las historias clínicas de SUS
            pacientes, salvo urgencias, donde puede ver cualquiera pero queda
            registrado&quot;. ¿Cómo lo modelás?
          </p>
          <RevelarSolucion>
            <p>
              El rol sigue sirviendo (solo un médico ve historias clínicas),
              pero la regla necesita atributos: ABAC sobre RBAC. Regla normal:{" "}
              <code>rol === &quot;medico&quot;</code> y existe una relación
              médico-paciente (turno o asignación vigente), verificado en la
              consulta a la base. Excepción de urgencia (&quot;break
              glass&quot;): el médico declara explícitamente la urgencia con un
              motivo, se le da acceso temporal a esa historia, y el acceso queda
              en un log de auditoría inmutable revisado después. Todo en el
              servidor, centralizado en una función{" "}
              <code>puedeVerHistoria(medico, paciente, contexto)</code> con
              tests para cada caso.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
