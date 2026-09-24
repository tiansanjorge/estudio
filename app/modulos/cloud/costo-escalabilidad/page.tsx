import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CostoSimulador } from "@/components/modulo/CostoSimulador";
import { entrevistaCostoEscalabilidad } from "@/lib/modules/cloud/costo-escalabilidad-entrevista";

const preguntasPorNivel = {
  1: entrevistaCostoEscalabilidad.filter((p) => p.nivel === 1),
  2: entrevistaCostoEscalabilidad.filter((p) => p.nivel === 2),
  3: entrevistaCostoEscalabilidad.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Trade-offs de costo/escalabilidad — Dev Study Lab",
  description:
    "Cómo se cobra la nube, serverless vs instancias, reservas y spot, métricas unitarias y FinOps, costos ocultos de arquitectura, y cuándo optimizar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué componente de la factura cloud se subestima más seguido?",
    opciones: [
      "La transferencia de datos",
      "El cómputo",
      "El almacenamiento",
    ],
    respuestaCorrecta: 0,
    explicacion: "Salida a internet, tráfico entre zonas y NAT se cobran por gigabyte.",
  },
  {
    pregunta: "Con tráfico bajo e irregular, ¿qué suele ser más barato?",
    opciones: [
      "Instancias reservadas",
      "Serverless",
      "Contenedores siempre prendidos",
    ],
    respuestaCorrecta: 1,
    explicacion: "No se paga capacidad ociosa mientras no hay requests.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué parte del uso conviene cubrir con un compromiso anual?",
    opciones: [
      "El pico máximo del año",
      "Todo el uso actual",
      "La base que va a existir sí o sí",
    ],
    respuestaCorrecta: 2,
    explicacion: "Comprometerse con los picos es pagar capacidad que la mayor parte del tiempo no se usa.",
  },
  {
    pregunta: "La factura subió 30% y el costo por pedido bajó 10%. ¿Cómo se lee?",
    opciones: [
      "El negocio creció y cada pedido cuesta menos: crecimiento sano",
      "Hay un desperdicio del 30% que hay que recortar cuanto antes",
      "Se abarató el cloud, pero la app se volvió menos eficiente",
    ],
    respuestaCorrecta: 0,
    explicacion: "Las métricas unitarias separan crecimiento de ineficiencia.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué protege de una función con un bug que se reinvoca a sí misma?",
    opciones: [
      "Un presupuesto mensual con aviso por email al superarlo",
      "Un límite de concurrencia y alertas de anomalía de costo",
      "Un timeout más corto en la configuración de la función",
    ],
    respuestaCorrecta: 1,
    explicacion: "Sin límite, el escalado automático convierte el bug en una factura enorme.",
  },
  {
    pregunta: "¿Cuándo tiene sentido reescribir un servicio para ahorrar costo?",
    opciones: [
      "Cuando la factura del servicio sube más de un 20%",
      "Cuando existe una tecnología más eficiente para ese caso",
      "Cuando el ahorro supera con margen el tiempo del equipo",
    ],
    respuestaCorrecta: 2,
    explicacion: "El tiempo de ingeniería también es un costo, y el más caro al principio.",
  },
];

export default function CostoEscalabilidadPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Cloud"
      titulo="Trade-offs de costo/escalabilidad"
      descripcion="Qué hace crecer la factura cloud, cómo elegir entre pagar por uso o por capacidad, y cuándo vale la pena optimizar."
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
            La nube cobra por <strong className="text-foreground">cómputo</strong>,{" "}
            <strong className="text-foreground">almacenamiento</strong> y{" "}
            <strong className="text-foreground">red</strong>, más la prima de los
            servicios gestionados y la observabilidad.
          </p>
          <p>
            Pagar por uso gana con poco tráfico; pagar por capacidad gana con
            tráfico alto y constante. El punto de equilibrio depende de tus
            números.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CostoSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Estimar solo el cómputo.</strong>{" "}
            La red, los logs y el almacenamiento aparecen después en la factura.
          </li>
          <li>
            <strong className="text-foreground">Recursos sin etiquetas.</strong>{" "}
            Nadie puede explicar qué parte del costo es de qué proyecto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Estimar el costo de un MVP con la calculadora del proveedor.</li>
          <li>Decidir si un servicio con tráfico constante sale de serverless.</li>
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
            <strong className="text-foreground">Descuentos</strong>: compromiso
            (reservas, savings plans) para la base estable, on-demand para lo
            variable, spot para lo que tolera interrupciones.
          </p>
          <p>
            <strong className="text-foreground">FinOps</strong>: etiquetas,
            presupuestos, detección de anomalías y costo por unidad de negocio,
            visible para cada equipo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Spot para la base de datos.</strong>{" "}
            Una interrupción con minutos de aviso es una caída.
          </li>
          <li>
            <strong className="text-foreground">Comprometerse con el uso de hoy sin mirar la tendencia.</strong>{" "}
            Si el uso baja, se paga capacidad que no se usa.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Runners de CI en instancias spot.</li>
          <li>Un dashboard de costo por cliente activo, por equipo.</li>
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
            <strong className="text-foreground">Costos ocultos</strong>:
            transferencia entre zonas y a internet, observabilidad, recursos
            sobredimensionados, almacenamiento que solo crece y escalado sin
            límite.
          </p>
          <p>
            <strong className="text-foreground">Cuándo optimizar</strong>:
            cuando el ahorro supera el costo del tiempo del equipo, empezando por
            los pocos servicios que explican la mayor parte de la factura.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Loguear cada request con el payload completo.</strong>{" "}
            La observabilidad termina costando más que la aplicación.
          </li>
          <li>
            <strong className="text-foreground">Optimizar costos antes de tener usuarios.</strong>{" "}
            Se ahorra en infraestructura lo que se pierde en velocidad.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Reglas de ciclo de vida para logs y backups con más de 90 días.</li>
          <li>Rightsizing trimestral de las instancias y bases más caras.</li>
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
            Un SaaS factura 40.000 dólares por mes y su factura de AWS pasó de
            4.000 a 11.000 en seis meses, mientras los clientes crecieron un 20%.
            El desglose: 35% cómputo (Lambda), 25% CloudWatch Logs, 20% NAT
            Gateway, 15% RDS, 5% otros. ¿Por dónde empezás?
          </p>
          <RevelarSolucion>
            <p>
              El costo crece mucho más rápido que el negocio: la factura se
              multiplicó por 2,75 con 20% más de clientes, así que el costo por
              cliente se multiplicó por 2,3. Vale la pena actuar. Por impacto y
              facilidad: 1) NAT (unos 2.200 dólares): ver qué tráfico pasa por
              ahí; si es S3, un endpoint gateway gratuito lo elimina en una
              tarde. 2) Logs (unos 2.750): bajar el nivel en producción, dejar de
              loguear payloads completos, muestrear los logs de éxito y acortar
              la retención. 3) Lambda (unos 3.850): revisar las funciones más
              caras, con memoria ajustada a lo que usan, y ver si alguna con
              tráfico alto y constante sale más barata en contenedores; también
              buscar reinvocaciones o loops. 4) RDS: rightsizing y, si el uso es
              estable, un compromiso anual. Sumar etiquetas por servicio, alertas
              de anomalías y una métrica de costo por cliente para que no vuelva
              a crecer sin que nadie lo vea.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
