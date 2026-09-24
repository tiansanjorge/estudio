import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ArquitecturaEscenarios } from "@/components/modulo/ArquitecturaEscenarios";
import { entrevistaMonolitoMicroservicios } from "@/lib/modules/arquitectura/monolito-microservicios-entrevista";

const preguntasPorNivel = {
  1: entrevistaMonolitoMicroservicios.filter((p) => p.nivel === 1),
  2: entrevistaMonolitoMicroservicios.filter((p) => p.nivel === 2),
  3: entrevistaMonolitoMicroservicios.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Monolito vs microservicios vs microfrontends — Dev Study Lab",
  description:
    "Qué problema resuelve cada arquitectura, qué cuesta, el monolito modular, el monolito distribuido y cómo migrar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema resuelven principalmente los microservicios?",
    opciones: [
      "Que el código sea más rápido",
      "Que muchos equipos desplieguen de forma independiente y escalar partes por separado",
      "Eliminar los bugs",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Son sobre todo una solución organizacional y de escala, con costo de sistema distribuido.",
  },
  {
    pregunta: "Para una startup de 4 devs, ¿qué arquitectura suele convenir?",
    opciones: ["Microservicios", "Monolito modular", "Microfrontends"],
    respuestaCorrecta: 1,
    explicacion:
      "Máxima velocidad y refactors baratos mientras el dominio todavía cambia.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Cada deploy obliga a desplegar tres servicios juntos. ¿Qué es?",
    opciones: ["Microservicios bien hechos", "Un monolito distribuido", "Un monolito modular"],
    respuestaCorrecta: 1,
    explicacion:
      "Toda la complejidad de la red sin la independencia de despliegue.",
  },
  {
    pregunta: "¿Cómo se sostienen los límites de un monolito modular?",
    opciones: [
      "Con documentación",
      "Verificándolos con reglas de dependencias en el CI",
      "No se pueden sostener",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un límite que no se verifica se erosiona con el primer atajo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué propone el patrón Strangler Fig?",
    opciones: [
      "Reescribir todo el sistema de una vez",
      "Extraer funcionalidades de a una detrás de una capa de ruteo, hasta reemplazar el sistema viejo",
      "Duplicar el monolito",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Migración incremental, con posibilidad de volver atrás en cada paso.",
  },
  {
    pregunta: "Según la Ley de Conway, ¿qué determina los límites de un sistema?",
    opciones: [
      "El lenguaje de programación",
      "La estructura de comunicación de la organización",
      "El proveedor de cloud",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso partir un sistema es una decisión organizacional además de técnica.",
  },
];

export default function MonolitoMicroserviciosPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Monolito vs microservicios vs microfrontends"
      descripcion="Tres formas de partir (o no) un sistema: qué problema resuelve cada una, qué cuesta, y por qué la respuesta depende más del equipo que de la tecnología."
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
            Un <strong className="text-foreground">monolito</strong> es una
            aplicación con un deploy y una base: simple de desarrollar, testear
            y depurar. Los <strong className="text-foreground">microservicios</strong>{" "}
            son servicios independientes con su propia base, comunicados por
            red: permiten deploys y escalado independientes, a cambio de todos
            los problemas de un sistema distribuido.
          </p>
          <p>
            Los <strong className="text-foreground">microfrontends</strong>{" "}
            aplican la misma idea a la UI: partes que despliegan equipos
            distintos, integradas en una shell. Las tres resuelven problemas
            distintos, y ninguna es mejor en abstracto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Escenarios">
        <ArquitecturaEscenarios />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Microservicios desde el día uno.</strong>{" "}
            Los límites se fijan antes de entender el dominio.
          </li>
          <li>
            <strong className="text-foreground">Creer que un monolito es sinónimo de código desordenado.</strong>{" "}
            El desorden es un problema de diseño, no de despliegue.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Justificar la arquitectura de un proyecto nuevo con trade-offs concretos.</li>
          <li>Responder en una entrevista de system design por qué no arrancás con microservicios.</li>
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
            El <strong className="text-foreground">monolito modular</strong>{" "}
            tiene módulos por dominio con interfaces públicas y límites
            verificados, en un solo deploy: da casi todo el beneficio de diseño
            de los microservicios sin la red.
          </p>
          <p>
            El <strong className="text-foreground">monolito distribuido</strong>{" "}
            es lo contrario: servicios separados pero acoplados (deploys
            coordinados, base compartida, cadenas de llamadas sincrónicas). Se
            evita partiendo por dominio, con una base por servicio, eventos y
            contratos compatibles hacia atrás.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Partir por capas técnicas.</strong>{" "}
            Un &quot;servicio de base de datos&quot; y un &quot;servicio de lógica&quot; se
            despliegan siempre juntos.
          </li>
          <li>
            <strong className="text-foreground">Servicios que leen las tablas de otros.</strong>{" "}
            El acoplamiento por datos anula la independencia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Reglas de dependency-cruiser que impiden importar internos de otro módulo.</li>
          <li>Diagnosticar un sistema donde cada feature requiere cinco PRs.</li>
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
            Para migrar, el <strong className="text-foreground">Strangler Fig</strong>:
            una capa de ruteo delante del monolito, extracción de a una
            funcionalidad, redirección gradual del tráfico y sincronización de
            datos hasta cortar. Antes de extraer, modularizar adentro.
          </p>
          <p>
            La <strong className="text-foreground">Ley de Conway</strong>: los
            sistemas copian la estructura de comunicación de la organización.
            Los límites del sistema y los de los equipos tienen que coincidir.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">La gran reescritura.</strong>{" "}
            El sistema viejo sigue cambiando y la versión nueva nunca lo alcanza.
          </li>
          <li>
            <strong className="text-foreground">Extraer servicios sin observabilidad distribuida.</strong>{" "}
            Los errores se vuelven imposibles de rastrear entre servicios.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Extraer el módulo de notificaciones como primer servicio.</li>
          <li>Reorganizar equipos por dominio antes de partir el sistema.</li>
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
            Un equipo de 6 personas migró su monolito a 14 microservicios hace un
            año. Ahora cada feature toca 4 servicios, los deploys se coordinan
            por Slack y un bug tarda días en encontrarse. ¿Qué pasó y qué
            propondrías?
          </p>
          <RevelarSolucion>
            <p>
              Construyeron un monolito distribuido: más servicios que personas,
              probablemente partidos por capas o por entidades en vez de por
              dominios, con acoplamiento fuerte entre ellos. El costo operativo
              (deploys, red, observabilidad) supera cualquier beneficio, porque
              no hay varios equipos que necesiten independencia. Propuesta:
              identificar los grupos de servicios que siempre cambian juntos y
              consolidarlos (volver a un monolito modular o a 2-3 servicios
              alineados a dominios reales), instalar trazas distribuidas para
              los que queden, y recién volver a partir cuando aparezca una razón
              concreta (un equipo nuevo, un componente con escala distinta).
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
