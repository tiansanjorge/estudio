import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ResponsabilidadSimulador } from "@/components/modulo/ResponsabilidadSimulador";
import { entrevistaResponsabilidadCompartida } from "@/lib/modules/cloud/responsabilidad-compartida-entrevista";

const preguntasPorNivel = {
  1: entrevistaResponsabilidadCompartida.filter((p) => p.nivel === 1),
  2: entrevistaResponsabilidadCompartida.filter((p) => p.nivel === 2),
  3: entrevistaResponsabilidadCompartida.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Modelo de responsabilidad compartida — Dev Study Lab",
  description:
    "Qué se ocupa el proveedor cloud y qué el cliente según el modelo de servicio, por qué fallan los clientes, disponibilidad, backups, compliance y servicios gestionados.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "En EC2, ¿quién parchea el sistema operativo?",
    opciones: ["AWS", "El cliente", "Nadie, se actualiza solo"],
    respuestaCorrecta: 1,
    explicacion: "En IaaS, del sistema operativo para arriba es responsabilidad del cliente.",
  },
  {
    pregunta: "¿Qué nunca pasa a ser responsabilidad del proveedor, en ningún modelo?",
    opciones: ["El hardware", "Los datos, los accesos y la configuración", "El runtime"],
    respuestaCorrecta: 1,
    explicacion: "Incluso en SaaS, quién accede a tus datos lo decidís vos.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué evita que alguien haga público un bucket por error en toda la cuenta?",
    opciones: [
      "Revisarlo a mano cada semana",
      "Bloquear el acceso público a S3 a nivel de cuenta",
      "Usar nombres de bucket difíciles de adivinar",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un guardrail de cuenta gana aunque una política individual lo permita.",
  },
  {
    pregunta: "Una zona de AWS se cae y tu app, con una sola instancia en esa zona, también. ¿De quién es el problema de tus usuarios?",
    opciones: [
      "De AWS, que pagará todas las pérdidas",
      "Tuyo: la resiliencia multi-zona es una decisión de arquitectura del cliente",
      "De nadie",
    ],
    respuestaCorrecta: 1,
    explicacion: "El SLA da créditos sobre la factura, no cubre el impacto en tu negocio.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Tu app corre en AWS, que tiene certificación PCI. ¿Tu sistema es PCI compliant?",
    opciones: [
      "Sí, automáticamente",
      "No: heredás controles del proveedor, pero los tuyos los tenés que implementar y demostrar",
      "Solo si usás Lambda",
    ],
    respuestaCorrecta: 1,
    explicacion: "La certificación del proveedor cubre su parte del modelo, no la tuya.",
  },
  {
    pregunta: "En RDS, ¿de quién es que la base sea accesible desde internet?",
    opciones: ["De AWS", "Del cliente: security groups y acceso público son configuración suya", "Compartida por igual"],
    respuestaCorrecta: 1,
    explicacion: "El servicio es gestionado, pero la exposición de red la configurás vos.",
  },
];

export default function ResponsabilidadCompartidaPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="Modelo de responsabilidad compartida"
      descripcion="Qué te resuelve el proveedor cloud, qué sigue siendo tuyo, y por qué la línea se mueve según el servicio."
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
            El proveedor se ocupa de la seguridad <strong className="text-foreground">de</strong>{" "}
            la nube (datacenters, hardware, virtualización); el cliente, de la
            seguridad <strong className="text-foreground">en</strong> la nube
            (datos, accesos, configuración, código).
          </p>
          <p>
            Cuanto más gestionado el servicio (IaaS → contenedores → serverless →
            SaaS), más capas pasan al proveedor. Datos, identidades y
            configuración nunca pasan.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ResponsabilidadSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">&quot;Está en la nube, entonces es seguro&quot;.</strong>{" "}
            La infraestructura lo es; tu configuración, no necesariamente.
          </li>
          <li>
            <strong className="text-foreground">No reconstruir las imágenes de contenedores.</strong>{" "}
            Las librerías de la imagen base son tuyas aunque el host sea gestionado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Elegir Lambda para no tener que parchear sistemas operativos.</li>
          <li>Revisar qué capas quedan de tu lado antes de migrar a un servicio gestionado.</li>
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
            <strong className="text-foreground">Incidentes del cliente</strong>:
            configuración expuesta, IAM demasiado amplio, claves filtradas. Se
            mitigan con mínimo privilegio, guardrails de cuenta, infraestructura
            como código y detección continua.
          </p>
          <p>
            <strong className="text-foreground">Disponibilidad y backups</strong>:
            el proveedor da el SLA de su servicio; que tu app sobreviva y que tus
            datos se puedan recuperar depende de tu arquitectura.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Backups en la misma cuenta y con los mismos permisos.</strong>{" "}
            Quien borra la base puede borrar también sus snapshots.
          </li>
          <li>
            <strong className="text-foreground">Cambios a mano en la consola.</strong>{" "}
            Nadie los revisa y nadie sabe por qué están.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Políticas de organización que prohíben desactivar el cifrado.</li>
          <li>Copias de backups en una cuenta separada con object lock.</li>
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
            <strong className="text-foreground">Compliance</strong>: se heredan
            los controles del proveedor, no la certificación. Residencia de
            datos, claves propias en KMS y logs de auditoría quedan de tu lado.
          </p>
          <p>
            <strong className="text-foreground">Servicios gestionados</strong>:
            la línea pasa por el medio del servicio. Y cuando falla el
            proveedor, el impacto en tus usuarios depende de tu diseño.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Backups replicados a otra región sin mirar la regulación.</strong>{" "}
            Los datos pueden terminar fuera de la jurisdicción permitida.
          </li>
          <li>
            <strong className="text-foreground">Una base gestionada con acceso público.</strong>{" "}
            El motor está parcheado, pero cualquiera puede intentar entrar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Presentar los reportes de AWS Artifact en una auditoría SOC 2.</li>
          <li>CloudTrail enviado a una cuenta de auditoría que el equipo no puede modificar.</li>
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
            Una startup de salud corre en AWS con una sola cuenta: la API en
            EC2 con Node 16, un Postgres en RDS con acceso público &quot;para
            conectarse desde las laptops&quot;, los estudios médicos en un
            bucket de S3, y un usuario IAM compartido con permisos de
            administrador. Los backups son los automáticos de RDS con 7 días de
            retención. Listá qué es responsabilidad de ellos y qué cambiarías
            primero.
          </p>
          <RevelarSolucion>
            <p>
              Casi todo es de ellos: nada de lo listado es infraestructura del
              proveedor. Prioridad por riesgo: 1) RDS sin acceso público,
              dentro de subredes privadas, y conexión de los desarrolladores por
              un bastión o Session Manager. 2) Eliminar el usuario compartido:
              identidades individuales con SSO y MFA, roles con permisos
              mínimos, y rotar las claves existentes. 3) S3 con Block Public
              Access a nivel de cuenta, cifrado con claves propias en KMS por
              ser datos de salud, y acceso solo mediante URLs firmadas. 4) Node
              16 ya no recibe parches: en EC2 el runtime y el sistema operativo
              son de ellos, así que actualizar, o pasar a un servicio donde el
              proveedor los mantenga (Fargate, Lambda). 5) Backups: más
              retención, copias en otra cuenta, y probar la restauración. 6)
              Separar producción en su propia cuenta, activar CloudTrail, y
              revisar qué exige la regulación de salud sobre residencia de datos.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
