import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CacheAsideSimulador } from "@/components/modulo/CacheAsideSimulador";
import { entrevistaRedisCaching } from "@/lib/modules/bases-de-datos/redis-caching-entrevista";

const preguntasPorNivel = {
  1: entrevistaRedisCaching.filter((p) => p.nivel === 1),
  2: entrevistaRedisCaching.filter((p) => p.nivel === 2),
  3: entrevistaRedisCaching.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Redis / caching — Dev Study Lab",
  description:
    "Redis y sus estructuras, cache-aside con TTL, invalidación con DEL, dónde cachear, cache stampede y operación de Redis en producción.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "En cache-aside, ¿qué pasa en un miss?",
    opciones: [
      "La app lee de la base, guarda el resultado con TTL y lo devuelve",
      "Redis va a buscar el dato a la base y lo guarda solo",
      "La app devuelve un error y reintenta cuando el dato esté en caché",
    ],
    respuestaCorrecta: 0,
    explicacion: "La aplicación maneja la caché; Redis no sabe nada de la base.",
  },
  {
    pregunta: "¿Para qué sirve el TTL si ya se invalida al escribir?",
    opciones: [
      "Para liberar memoria de Redis con las claves que ya nadie consulta",
      "Es la red de seguridad: acota cuánto vive un dato viejo si falla el DEL",
      "Para que Redis priorice qué claves desalojar cuando se llena",
    ],
    respuestaCorrecta: 1,
    explicacion: "Una invalidación olvidada o fallida deja de ser un bug permanente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Al actualizar un producto, ¿qué conviene hacer con su clave?",
    opciones: [
      "SET con el valor nuevo antes de escribir en la base",
      "DEL antes de escribir en la base, para que nadie lea el viejo",
      "DEL después de que la base confirmó",
    ],
    respuestaCorrecta: 2,
    explicacion: "El SET concurrente puede dejar la caché con el valor equivocado; el DEL no depende del orden.",
  },
  {
    pregunta: "¿Qué desventaja tiene una caché en memoria del proceso con 10 réplicas?",
    opciones: [
      "Cada réplica tiene su copia: invalidar en todas es difícil",
      "Es más lenta que Redis, porque compite con la app por la CPU",
      "Se pierde el TTL, porque la memoria del proceso no expira",
    ],
    respuestaCorrecta: 0,
    explicacion: "Por eso conviene para datos chicos y casi estáticos.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "Una clave muy leída vence y la base recibe 500 consultas iguales. ¿Qué la protege?",
    opciones: [
      "Un TTL más corto, para que la clave se regenere más seguido",
      "Un lock de single-flight o stale-while-revalidate",
      "Una réplica de lectura más para absorber el pico",
    ],
    respuestaCorrecta: 1,
    explicacion: "Una sola request recalcula; las demás esperan o reciben el valor anterior.",
  },
  {
    pregunta: "¿Qué política de eviction necesita una instancia de Redis que guarda colas de BullMQ?",
    opciones: [
      "allkeys-lru",
      "volatile-ttl",
      "noeviction",
    ],
    respuestaCorrecta: 2,
    explicacion: "Con eviction, Redis podría borrar jobs en silencio al llenarse.",
  },
];

export default function RedisCachingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Bases de datos"
      titulo="Redis / caching"
      descripcion="Una caché hace rápidas las lecturas y difíciles las escrituras: cómo usar Redis sin servir datos viejos ni tirar la base."
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
            <strong className="text-foreground">Redis</strong> es un almacén
            clave-valor en memoria, con estructuras (hashes, listas, sets, sorted
            sets) y comandos atómicos. Se usa para caché, sesiones, rate limiting
            y colas.
          </p>
          <p>
            <strong className="text-foreground">Cache-aside</strong>: leer de
            Redis; si no está, leer de la base y guardar con TTL. Al escribir,
            actualizar la base y borrar la clave.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CacheAsideSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Claves sin TTL.</strong>{" "}
            Una invalidación olvidada sirve el dato viejo para siempre.
          </li>
          <li>
            <strong className="text-foreground">Que la app se caiga si Redis se cae.</strong>{" "}
            La caché debería ser opcional: más lento, pero funcionando.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Cachear el detalle de un producto que se lee miles de veces por minuto.</li>
          <li>Guardar sesiones compartidas entre varias instancias de la API.</li>
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
            <strong className="text-foreground">Invalidar con DEL</strong>,
            después del commit, en vez de actualizar la clave: evita que dos
            escrituras concurrentes dejen la caché con el valor equivocado.
          </p>
          <p>
            <strong className="text-foreground">Dónde cachear</strong>: memoria
            del proceso (rápido, una copia por réplica), Redis (compartido) o CDN
            (respuestas públicas). Las estrategias de escritura como
            write-through y write-back se ven en System Design.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cachear antes de indexar.</strong>{" "}
            Si un índice resuelve la consulta, la caché solo suma invalidación.
          </li>
          <li>
            <strong className="text-foreground">Invalidar dentro de la transacción.</strong>{" "}
            Una lectura concurrente puede recachear el valor viejo antes del commit.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Cachear la respuesta de una API externa con rate limit.</li>
          <li>Un LRU en memoria para la configuración, que cambia una vez por semana.</li>
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
            <strong className="text-foreground">Cache stampede</strong>: una
            clave caliente vence y todas las requests van a la base a la vez. Se
            mitiga con jitter, single-flight y stale-while-revalidate.
          </p>
          <p>
            <strong className="text-foreground">Operación</strong>:{" "}
            <code>maxmemory</code> y eviction según el uso, un solo hilo de
            comandos (nada de <code>KEYS *</code>), persistencia RDB/AOF y
            replicación asíncrona.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Caché y colas en la misma instancia.</strong>{" "}
            Necesitan políticas de eviction opuestas.
          </li>
          <li>
            <strong className="text-foreground">Todas las claves con el mismo TTL.</strong>{" "}
            Después de un reinicio, vencen juntas y la base recibe todo el tráfico.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>La home de un e-commerce en Black Friday, con stale-while-revalidate.</li>
          <li>Un ranking en tiempo real con sorted sets.</li>
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
            La página de ofertas recibe 5.000 requests por segundo y se cachea
            con TTL de 5 minutos. Dos problemas: cada 5 minutos la CPU de la base
            salta al 100% durante unos segundos, y cuando el equipo de marketing
            cambia un precio desde el backoffice (otro servicio, que no conoce la
            caché), la web muestra el precio viejo hasta 5 minutos. ¿Qué cambiás?
          </p>
          <RevelarSolucion>
            <p>
              El pico es un stampede: la clave vence y miles de requests hacen
              miss juntas. Se resuelve con stale-while-revalidate (guardar un
              &quot;fresco hasta&quot; de 4 minutos con TTL real de 10, y que una
              sola request refresque tomando un lock con <code>SET NX PX</code>)
              o refrescando la clave desde un job cada 4 minutos, así nunca
              vence en caliente. El precio viejo es un problema de invalidación
              entre servicios: el backoffice no puede depender de conocer las
              claves de la web. La opción desacoplada es que publique un evento
              &quot;precio actualizado&quot; (una cola, o el patrón outbox si
              tiene que ser confiable) y que el servicio web lo consuma y haga{" "}
              <code>DEL</code> de las claves afectadas. Mientras tanto, bajar el
              TTL acota el problema a costa de más carga en la base.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
