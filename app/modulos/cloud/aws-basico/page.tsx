import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { IamSimulador } from "@/components/modulo/IamSimulador";
import { entrevistaAwsBasico } from "@/lib/modules/cloud/aws-basico-entrevista";

const preguntasPorNivel = {
  1: entrevistaAwsBasico.filter((p) => p.nivel === 1),
  2: entrevistaAwsBasico.filter((p) => p.nivel === 2),
  3: entrevistaAwsBasico.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "AWS básico (EC2, S3, Lambda, RDS) — Dev Study Lab",
  description:
    "Los servicios base de AWS, IAM con roles en vez de claves, S3 con URLs firmadas, cómo elegir base de datos, evaluación de políticas y costos inesperados.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Dónde guardás los PDFs que suben los usuarios?",
    opciones: [
      "En un bucket de S3",
      "En el disco de la instancia EC2",
      "En una columna de RDS",
    ],
    respuestaCorrecta: 0,
    explicacion: "Almacenamiento de objetos barato y durable, fuera del servidor.",
  },
  {
    pregunta: "¿Cómo obtiene credenciales una función Lambda para leer de S3?",
    opciones: [
      "Con access keys guardadas en sus variables de entorno",
      "Asumiendo su rol de ejecución, con credenciales temporales",
      "Con las credenciales del usuario que la desplegó",
    ],
    respuestaCorrecta: 1,
    explicacion: "El SDK las toma solo; no hay ninguna clave de larga vida.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo dejás que el navegador suba un archivo a un bucket privado?",
    opciones: [
      "Haciendo público el bucket solo para escritura",
      "Mandando al navegador credenciales de un usuario IAM",
      "Con una URL firmada que genera la API, válida unos minutos",
    ],
    respuestaCorrecta: 2,
    explicacion: "Da permiso temporal sobre un objeto puntual, sin exponer el bucket.",
  },
  {
    pregunta: "¿Qué base conviene para una app de negocio con relaciones y reportes?",
    opciones: [
      "RDS Postgres",
      "DynamoDB",
      "ElastiCache",
    ],
    respuestaCorrecta: 0,
    explicacion: "DynamoDB exige conocer los patrones de acceso de antemano y no tiene joins.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Un rol tiene Allow s3:* y la bucket policy tiene un Deny para ese rol. ¿Resultado?",
    opciones: [
      "Permitido: el Allow del rol es más específico",
      "Denegado: un Deny explícito gana siempre",
      "Depende de cuál de las dos políticas es más nueva",
    ],
    respuestaCorrecta: 1,
    explicacion: "No importa cuántos Allow haya.",
  },
  {
    pregunta: "¿Qué evita pagar NAT Gateway por el tráfico de una Lambda en VPC hacia S3?",
    opciones: [
      "Poner la Lambda en una subred pública",
      "Un Internet Gateway en la VPC",
      "Un VPC endpoint gateway para S3",
    ],
    respuestaCorrecta: 2,
    explicacion: "Es gratuito y el tráfico a S3 no pasa por el NAT.",
  },
];

export default function AwsBasicoPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="AWS básico (EC2, S3, Lambda, RDS)"
      descripcion="Los cuatro servicios con los que se arma casi cualquier backend en AWS, y los permisos que los conectan."
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
            <strong className="text-foreground">EC2</strong> (máquinas
            virtuales), <strong className="text-foreground">S3</strong>{" "}
            (archivos), <strong className="text-foreground">Lambda</strong>{" "}
            (funciones por evento) y <strong className="text-foreground">RDS</strong>{" "}
            (bases relacionales gestionadas).
          </p>
          <p>
            <strong className="text-foreground">IAM</strong> los conecta: todo
            denegado por defecto, un Allow habilita, un Deny explícito gana. Roles
            con credenciales temporales en vez de usuarios con claves.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <IamSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Access keys en variables de entorno de una EC2.</strong>{" "}
            La instancia ya tiene un rol; la clave solo agrega algo que se puede filtrar.
          </li>
          <li>
            <strong className="text-foreground">Archivos de usuarios en el disco del servidor.</strong>{" "}
            Se pierden al reemplazar la instancia y no se comparten entre réplicas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una Lambda que genera una miniatura cuando se sube una imagen a S3.</li>
          <li>Una API con su rol IAM que solo puede leer y escribir su propio bucket.</li>
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
            <strong className="text-foreground">S3</strong>: privado por
            defecto, URLs firmadas para archivos de usuarios, CDN para lo
            público, clases de almacenamiento, ciclo de vida y versionado.
          </p>
          <p>
            <strong className="text-foreground">Bases</strong>: RDS como
            default relacional, Aurora cuando la escala lo justifica, DynamoDB
            para acceso por clave a escala muy alta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Subir archivos a través de la API.</strong>{" "}
            Ocupa memoria y ancho de banda del servidor; la URL firmada lo evita.
          </li>
          <li>
            <strong className="text-foreground">Elegir DynamoDB sin conocer los patrones de acceso.</strong>{" "}
            Cada consulta nueva obliga a rediseñar las claves o los índices.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Mover a Glacier los comprobantes con más de un año de antigüedad.</li>
          <li>RDS Postgres Multi-AZ para la base principal de producción.</li>
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
            <strong className="text-foreground">Evaluación de políticas</strong>:
            Deny explícito, después SCPs y permission boundaries, después Allow
            de identidad o de recurso (los dos entre cuentas), y conditions para
            afinar.
          </p>
          <p>
            <strong className="text-foreground">Sorpresas</strong>: NAT
            Gateway, transferencia entre zonas, recursos olvidados, service
            quotas, una sola zona y una sola cuenta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Tráfico a S3 por el NAT Gateway.</strong>{" "}
            Se paga por gigabyte procesado cuando existe un endpoint gratuito.
          </li>
          <li>
            <strong className="text-foreground">Producción y experimentos en la misma cuenta.</strong>{" "}
            Un error en un experimento puede tocar datos de producción.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una bucket policy que solo acepta tráfico por el VPC endpoint.</li>
          <li>Alertas de presupuesto por proyecto usando etiquetas.</li>
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
            Diseñá en AWS el backend de una app de reintegros de gastos: los
            empleados suben fotos de tickets desde el celular, un proceso extrae
            el monto con un servicio de OCR, y un panel web muestra el estado de
            cada reintegro. Unos 5.000 usuarios, con más uso a fin de mes.
          </p>
          <RevelarSolucion>
            <p>
              Fotos: el cliente pide a la API una URL firmada y sube directo a
              un bucket S3 privado, con Block Public Access, cifrado y una regla
              de ciclo de vida que pasa a una clase más barata después de un
              año. Procesamiento: el evento de subida a S3 dispara una Lambda
              (vía una cola SQS, para absorber el pico de fin de mes y
              reintentar si el OCR falla) con concurrencia máxima acotada. API:
              Lambda detrás de API Gateway, o un contenedor en Fargate si se
              prefiere un servidor tradicional. Datos: RDS Postgres Multi-AZ en
              subredes privadas, con RDS Proxy si la API es Lambda. Permisos: un
              rol por pieza (la API genera URLs y escribe en la base; el
              procesador lee el bucket y actualiza la base), sin access keys.
              Red: VPC endpoint gateway para S3 para no pagar NAT. Y producción
              en su propia cuenta, con alertas de presupuesto.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
