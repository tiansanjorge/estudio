import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EstimacionSimulador } from "@/components/modulo/EstimacionSimulador";
import { entrevistaEstimacion } from "@/lib/modules/system-design/estimacion-entrevista";

const preguntasPorNivel = {
  1: entrevistaEstimacion.filter((p) => p.nivel === 1),
  2: entrevistaEstimacion.filter((p) => p.nivel === 2),
  3: entrevistaEstimacion.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Estimación back of the envelope — Dev Study Lab",
  description:
    "Estimar QPS, almacenamiento y ancho de banda con números redondos, qué números saber de memoria, cómo pasar a decisiones, errores típicos y ley de Little.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "100 millones de acciones por día, ¿cuántas por segundo aproximadamente?",
    opciones: ["100", "1.000", "100.000"],
    respuestaCorrecta: 1,
    explicacion: "Un día tiene unos 10⁵ segundos: 10⁸ / 10⁵ = 10³.",
  },
  {
    pregunta: "¿Qué importa más en una estimación de entrevista?",
    opciones: ["El número exacto", "El orden de magnitud y los supuestos explícitos", "Usar calculadora"],
    respuestaCorrecta: 1,
    explicacion: "La decisión de diseño no cambia entre 1.150 y 1.200 requests por segundo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "El almacenamiento estimado es de petabytes de imágenes. ¿Dónde van?",
    opciones: ["En una columna de la base", "En almacenamiento de objetos, con metadatos en la base", "En memoria"],
    respuestaCorrecta: 1,
    explicacion: "Son dos problemas distintos: archivos grandes y metadatos chicos.",
  },
  {
    pregunta: "La relación lecturas/escrituras es 100 a 1. ¿Dónde ponés el esfuerzo?",
    opciones: ["Optimizar las escrituras", "Caché, réplicas de lectura y CDN", "Colas de escritura"],
    respuestaCorrecta: 1,
    explicacion: "El volumen está en las lecturas.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "3.000 req/s y cada una tarda 20 ms. ¿Cuántas están en curso en promedio?",
    opciones: ["60", "150", "3.000"],
    respuestaCorrecta: 0,
    explicacion: "Ley de Little: 3.000 × 0,02 = 60.",
  },
  {
    pregunta: "Un enlace de red de 1 Gbps, ¿cuántos megabytes por segundo transfiere como máximo?",
    opciones: ["1.000 MB/s", "Unos 125 MB/s", "8.000 MB/s"],
    respuestaCorrecta: 1,
    explicacion: "Gbps son bits: se divide por 8.",
  },
];

export default function EstimacionPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Estimación back of the envelope"
      descripcion="Calcular en dos minutos el tamaño de un sistema, con números redondos, para diseñar con fundamento."
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
            Un cálculo rápido, con supuestos explícitos y números redondos, para
            conocer el <strong className="text-foreground">orden de magnitud</strong>:
            requests por segundo, almacenamiento y ancho de banda.
          </p>
          <p>
            Números base: un día ≈ 10⁵ segundos, cada prefijo es ×1.000, y
            algunas latencias de referencia de memoria, disco y red.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EstimacionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Estimar sin decir los supuestos.</strong>{" "}
            Nadie puede discutir ni corregir un número que sale de la nada.
          </li>
          <li>
            <strong className="text-foreground">Perseguir la precisión.</strong>{" "}
            Diez minutos de cuentas exactas que no cambian ninguna decisión.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Los primeros cinco minutos de una entrevista de system design.</li>
          <li>Decidir si una funcionalidad nueva necesita infraestructura aparte.</li>
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
            <strong className="text-foreground">Del número a la decisión</strong>:
            QPS pico para instancias y caché, relación lecturas/escrituras para
            dónde optimizar, almacenamiento para qué va dónde, ancho de banda
            para el CDN.
          </p>
          <p>
            Metadatos y archivos se estiman por separado: son problemas
            distintos, con soluciones distintas.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Estimar y no usar el resultado.</strong>{" "}
            Los números tienen que aparecer después en las decisiones del diseño.
          </li>
          <li>
            <strong className="text-foreground">Una sola cifra de almacenamiento.</strong>{" "}
            Mezcla bytes de metadatos con megabytes de archivos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Justificar un CDN con el ancho de banda estimado de las imágenes.</li>
          <li>Descartar el sharding porque las escrituras entran cómodas en un primario.</li>
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
            <strong className="text-foreground">Errores típicos</strong>: diseñar
            para el promedio, olvidar réplicas e índices, confundir bits con
            bytes, ignorar las cuentas gigantes y no hacer un chequeo de sentido
            común.
          </p>
          <p>
            <strong className="text-foreground">Ley de Little</strong>: en curso
            = tasa × tiempo. Dimensiona pools, workers e instancias.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Pool de conexiones por instancia sin mirar el total.</strong>{" "}
            20 instancias × 50 conexiones superan lo que admite la base.
          </li>
          <li>
            <strong className="text-foreground">Promedios de seguidores o de tamaño.</strong>{" "}
            Esconden los casos extremos que concentran la carga.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Dimensionar el pool de conexiones a partir de QPS y latencia.</li>
          <li>Calcular cuántos workers necesita una cola para no acumular atraso.</li>
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
            Estimá un servicio de notificaciones push: 200 millones de usuarios
            con la app instalada, cada uno recibe en promedio 10 notificaciones
            por día, pero las campañas de marketing mandan a todos a la vez; cada
            notificación, con su registro de entrega, ocupa 1 KB, y se guarda el
            historial 90 días. El proveedor de push acepta cada envío en unos 50
            ms. ¿Cuántas notificaciones por segundo, cuánto almacenamiento y
            cuántos envíos concurrentes?
          </p>
          <RevelarSolucion>
            <p>
              Volumen: 200M × 10 = 2.000 millones por día, unas 20.000 por
              segundo en promedio (2 × 10⁹ / 10⁵). Pero el promedio engaña: una
              campaña a los 200 millones, si se quiere enviar en 10 minutos,
              exige 200M / 600 s ≈ 330.000 por segundo. Ese es el número que
              dimensiona el sistema, o se decide enviarla más lento. Almacenamiento:
              2.000 millones × 1 KB = 2 TB por día, 180 TB en 90 días, más
              réplicas: del orden de medio petabyte, lo que pide una base
              pensada para escrituras masivas y expiración por tiempo (o
              particiones por día que se borran enteras). Concurrencia, por ley
              de Little: 330.000 envíos/s × 0,05 s ≈ 16.500 envíos en curso a la
              vez durante una campaña, lo que implica muchas conexiones HTTP/2
              reutilizadas hacia el proveedor y una cola que absorba la campaña
              y la entregue al ritmo que el proveedor acepte.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
