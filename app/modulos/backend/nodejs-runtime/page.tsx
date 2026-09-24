import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { NodeRuntimeSimulador } from "@/components/modulo/NodeRuntimeSimulador";
import { entrevistaNodejsRuntime } from "@/lib/modules/backend/nodejs-runtime-entrevista";

const preguntasPorNivel = {
  1: entrevistaNodejsRuntime.filter((p) => p.nivel === 1),
  2: entrevistaNodejsRuntime.filter((p) => p.nivel === 2),
  3: entrevistaNodejsRuntime.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Node.js runtime — Dev Study Lab",
  description:
    "Cómo atiende Node miles de conexiones con un hilo, qué bloquea el event loop, worker threads, cluster, libuv, memory leaks y graceful shutdown.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué Node escala bien con miles de conexiones que esperan a la base de datos?",
    opciones: [
      "Porque delega las esperas de I/O y el hilo sigue atendiendo",
      "Porque crea un thread del sistema por cada conexión abierta",
      "Porque cada request corre en un proceso aislado del resto",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La mayor parte del trabajo de un servidor web es esperar, no calcular.",
  },
  {
    pregunta: "Un handler genera un PDF durante 400 ms en el hilo principal. ¿Qué pasa con los demás requests?",
    opciones: [
      "Se atienden en paralelo en el thread pool de libuv",
      "Esperan: el event loop está bloqueado hasta que termine",
      "Se atienden normal, porque el handler es async",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Mientras corre código sincrónico, nadie más avanza.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué herramienta usás para sacar trabajo de CPU del event loop dentro de un servicio?",
    opciones: [
      "Promesas con async/await",
      "setImmediate para partir el trabajo",
      "Worker threads, con un pool",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Corren en otro hilo con su propio event loop; el principal queda libre.",
  },
  {
    pregunta: "¿Qué operaciones usan el thread pool de libuv?",
    opciones: [
      "fs, dns.lookup, y crypto/zlib asíncronos",
      "Todas las conexiones de red TCP y HTTP",
      "Los timers y las promesas pendientes",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La red va por los mecanismos asincrónicos del sistema operativo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué causa típica de memory leak aparece en servidores Node?",
    opciones: [
      "Muchas promesas pendientes a la vez durante picos de tráfico",
      "Una cache en un Map que solo crece, sin límite ni expiración",
      "Variables locales grandes dentro de handlers que se llaman seguido",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Se reemplaza por un LRU con tamaño máximo o un store externo.",
  },
  {
    pregunta: "Al recibir SIGTERM, ¿qué hace primero un graceful shutdown?",
    opciones: [
      "Cierra la conexión a la base para no dejar transacciones abiertas",
      "Llama a process.exit(0) para liberar el puerto cuanto antes",
      "Deja de aceptar conexiones nuevas y se marca como no listo",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Después espera los requests en curso y cierra conexiones ordenadamente.",
  },
];

export default function NodejsRuntimePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Node.js runtime"
      descripcion="Un hilo de JavaScript, muchas conexiones: qué lo hace escalar, qué lo bloquea, y cómo usar hilos y procesos cuando hace falta."
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
            El event loop ya se vio en JavaScript profundo; acá importa su
            consecuencia en un servidor. El JavaScript corre en{" "}
            <strong className="text-foreground">un solo hilo</strong>, pero las
            esperas de I/O (base, red, disco) se delegan al sistema operativo o
            al pool de libuv. Por eso Node atiende miles de conexiones con poca
            memoria.
          </p>
          <p>
            El límite es la <strong className="text-foreground">CPU</strong>:
            mientras el hilo principal calcula algo pesado, ningún otro request
            avanza.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <NodeRuntimeSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">APIs sincrónicas en un handler.</strong>{" "}
            <code>readFileSync</code> o <code>bcrypt.hashSync</code> bloquean a
            todos.
          </li>
          <li>
            <strong className="text-foreground">Regex vulnerables a ReDoS.</strong>{" "}
            Un input armado a propósito congela el servidor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Medir el lag del event loop con <code>monitorEventLoopDelay</code>.</li>
          <li>Diagnosticar por qué un endpoint liviano se vuelve lento bajo carga.</li>
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
            <strong className="text-foreground">Worker threads</strong> para CPU
            dentro de un servicio; <strong className="text-foreground">child
            processes</strong> para otros programas o aislamiento;{" "}
            <strong className="text-foreground">cluster</strong> o réplicas para
            usar todos los núcleos con tráfico general.
          </p>
          <p>
            El <strong className="text-foreground">thread pool de libuv</strong>{" "}
            (4 hilos por defecto) atiende <code>fs</code>,{" "}
            <code>dns.lookup</code> y crypto/zlib asincrónicos: con muchas
            operaciones de ese tipo, se vuelve el cuello de botella.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Crear un worker por request.</strong>{" "}
            Crear hilos es caro: se usa un pool.
          </li>
          <li>
            <strong className="text-foreground">Cluster dentro de un contenedor que ya escala por réplicas.</strong>{" "}
            Dos niveles de balanceo que se pisan.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Generar PDFs o redimensionar imágenes con Piscina.</li>
          <li>Ajustar <code>UV_THREADPOOL_SIZE</code> en un servicio con mucho hashing.</li>
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
            Los <strong className="text-foreground">memory leaks</strong> en
            servidores suelen ser caches sin límite, listeners que no se quitan
            y timers olvidados. Se encuentran comparando heap snapshots.
          </p>
          <p>
            El <strong className="text-foreground">graceful shutdown</strong>{" "}
            aprovecha el período entre SIGTERM y SIGKILL: dejar de recibir
            tráfico, terminar lo que está en curso, cerrar conexiones y salir.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Ignorar SIGTERM.</strong>{" "}
            Cada deploy corta requests en vuelo y deja jobs a medias.
          </li>
          <li>
            <strong className="text-foreground">&quot;Arreglar&quot; el leak con reinicios periódicos.</strong>{" "}
            Sirve de parche, no de solución.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un handler de SIGTERM con timeout menor al período de gracia de Kubernetes.</li>
          <li>Heap snapshots automáticos cerca del límite de memoria.</li>
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
            Este endpoint de exportación hace que todo el servidor se vuelva
            lento cuando alguien exporta, y la memoria crece día a día. ¿Por
            qué?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const cache = new Map();

app.get("/exportar", (req, res) => {
  const filas = JSON.parse(fs.readFileSync("./datos-grandes.json", "utf8"));
  const csv = filas.map((f) => Object.values(f).join(",")).join("\\n");
  cache.set(req.query.usuario + Date.now(), csv);
  res.send(csv);
});`}
          </pre>
          <RevelarSolucion>
            <p>
              Lentitud: <code>readFileSync</code>, el <code>JSON.parse</code>{" "}
              de un archivo grande y el armado del CSV corren sincrónicos en el
              hilo principal y bloquean el event loop para todos. Mejor: leer
              con streams, generar el CSV en streaming directo a la respuesta,
              o mover la exportación a un job en segundo plano (o a un worker)
              que deja el archivo en un storage y avisa al terminar. Memoria: la
              cache usa una clave con <code>Date.now()</code>, así que nunca se
              reutiliza y crece sin límite; es un leak. Si hace falta cachear, un
              LRU con tamaño máximo y TTL, o no cachear el CSV en absoluto.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
