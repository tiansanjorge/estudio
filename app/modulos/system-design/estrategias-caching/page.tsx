import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EscrituraCacheSimulador } from "@/components/modulo/EscrituraCacheSimulador";
import { entrevistaEstrategiasCaching } from "@/lib/modules/system-design/estrategias-caching-entrevista";

const preguntasPorNivel = {
  1: entrevistaEstrategiasCaching.filter((p) => p.nivel === 1),
  2: entrevistaEstrategiasCaching.filter((p) => p.nivel === 2),
  3: entrevistaEstrategiasCaching.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Estrategias de caching — Dev Study Lab",
  description:
    "Write-through, write-back, write-around y cache-aside; invalidación por TTL, eventos, versiones y tags; eviction y hit ratio; cachés en capas y carreras con la base.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué estrategia puede perder escrituras si el caché se cae?",
    opciones: ["Write-through", "Write-back", "Write-around"],
    respuestaCorrecta: 1,
    explicacion: "La base se actualiza después; lo que no se volcó, se pierde.",
  },
  {
    pregunta: "¿Qué hace una clave versionada como producto:7:v42?",
    opciones: [
      "Guarda todas las versiones para siempre",
      "Al cambiar el dato se usa una clave nueva, sin necesidad de borrar la vieja",
      "Encripta el valor",
    ],
    respuestaCorrecta: 1,
    explicacion: "Las claves viejas dejan de leerse y vencen solas.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Para qué dato es razonable write-back?",
    opciones: ["El estado de un pago", "Un contador de vistas", "El saldo de una cuenta"],
    respuestaCorrecta: 1,
    explicacion: "Perder algunos incrementos en una falla es tolerable; perder un pago no.",
  },
  {
    pregunta: "Un job recorre un millón de claves una sola vez y el hit ratio se desploma. ¿Qué política resiste mejor?",
    opciones: ["LRU", "LFU", "FIFO"],
    respuestaCorrecta: 1,
    explicacion: "LFU protege las claves populares de un recorrido masivo de uso único.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Hay caché en el CDN (5 min), en cada instancia (1 min) y en Redis (10 min). ¿Peor caso de dato viejo?",
    opciones: ["10 minutos", "La suma: hasta 16 minutos", "1 minuto"],
    respuestaCorrecta: 1,
    explicacion: "Cada capa puede recargar desde otra que ya tenía el dato viejo.",
  },
  {
    pregunta: "¿Qué evita que un lector lento guarde en el caché un valor viejo después de una invalidación?",
    opciones: ["Un TTL más largo", "Leases o escrituras condicionales por versión", "Más memoria en Redis"],
    respuestaCorrecta: 1,
    explicacion: "La invalidación anula el permiso del lector para escribir su valor.",
  },
];

export default function EstrategiasCachingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Estrategias de caching"
      descripcion="Cómo escribir e invalidar cuando hay un caché en el medio, y qué se rompe cuando hay muchos."
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
            <strong className="text-foreground">Escritura</strong>:
            cache-aside, write-through (siempre actualizado, escrituras más
            lentas), write-back (escrituras rápidas, riesgo de pérdida) y
            write-around (no llena el caché, puede dejarlo viejo).
          </p>
          <p>
            <strong className="text-foreground">Invalidación</strong>: TTL,
            eventos, claves versionadas y tags. Redis, cache-aside y stampede
            están en Bases de datos; las directivas HTTP, en HTTP y Networking.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EscrituraCacheSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Write-around sin invalidar.</strong>{" "}
            Si la clave ya estaba en caché, sigue sirviendo el valor viejo.
          </li>
          <li>
            <strong className="text-foreground">Invalidación explícita sin TTL.</strong>{" "}
            Una dependencia olvidada deja el dato viejo para siempre.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Write-through para la configuración de cada cliente, que se lee en cada request.</li>
          <li>Invalidación por tag de todas las páginas que muestran un producto.</li>
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
            <strong className="text-foreground">Write-back</strong> para
            contadores y picos, con caché persistente, volcados frecuentes e
            idempotentes, o una cola durable como alternativa.
          </p>
          <p>
            <strong className="text-foreground">Eviction y métricas</strong>:
            LRU como default, LFU contra recorridos masivos; hit ratio, tasa de
            evictions y carga quitada a la base.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un timestamp en la clave.</strong>{" "}
            Cada request genera una clave nueva y el hit ratio es cero.
          </li>
          <li>
            <strong className="text-foreground">Write-back para pedidos.</strong>{" "}
            Una caída del caché pierde compras que el usuario ya vio confirmadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Contador de vistas acumulado en Redis y volcado cada 10 segundos.</li>
          <li>Un dashboard de hit ratio y evictions por tipo de clave.</li>
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
            <strong className="text-foreground">Capas</strong>: ventanas de
            inconsistencia que se suman, invalidación por pub/sub para cachés en
            proceso, caché local para hot keys y cacheo negativo.
          </p>
          <p>
            <strong className="text-foreground">Carreras con la base</strong>:
            escrituras condicionales por versión, leases e invalidación por CDC.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Invalidar solo Redis.</strong>{" "}
            Las copias en memoria de cada instancia siguen sirviendo el valor viejo.
          </li>
          <li>
            <strong className="text-foreground">Cachear en el navegador datos que pueden necesitar corrección urgente.</strong>{" "}
            Desde el servidor no se pueden invalidar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un canal de pub/sub que avisa a todas las instancias qué claves invalidar.</li>
          <li>Debezium leyendo el WAL de Postgres para invalidar el caché de productos.</li>
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
            Un e-commerce cachea la ficha de producto en tres capas: CDN (10
            min), memoria de cada una de las 20 instancias (2 min) y Redis (30
            min). El equipo de precios cargó un precio con un cero de menos y
            necesita que desaparezca en menos de un minuto. Además, a veces
            queda en caché un precio viejo aunque se haya invalidado. Rediseñá
            la estrategia.
          </p>
          <RevelarSolucion>
            <p>
              Hoy el peor caso es 42 minutos de dato viejo y no hay forma rápida
              de corregirlo. 1) Invalidación por evento en cadena: al cambiar un
              precio, borrar la clave en Redis, publicar un mensaje de pub/sub
              que las 20 instancias escuchan para borrar su copia local, e
              invalidar en el CDN por tag del producto. 2) Invalidación por CDC
              desde el WAL de la base, para que cualquier cambio de precio (del
              backoffice, de un script, de una importación) dispare la cadena, sin
              depender de que cada código se acuerde. 3) Para la carrera que deja
              precios viejos: guardar en Redis la versión de la fila junto al
              valor y escribir solo si es más nueva. 4) Revisar si el precio
              necesita estar en el HTML cacheado en el CDN: sacarlo a un pedido
              aparte con caché corto separa lo que cambia seguido de lo que no.
              5) Mantener TTLs como red de seguridad, más cortos en las capas más
              difíciles de invalidar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
