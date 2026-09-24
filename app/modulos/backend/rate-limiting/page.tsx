import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { RateLimitSimulador } from "@/components/modulo/RateLimitSimulador";
import { entrevistaRateLimiting } from "@/lib/modules/backend/rate-limiting-entrevista";

const preguntasPorNivel = {
  1: entrevistaRateLimiting.filter((p) => p.nivel === 1),
  2: entrevistaRateLimiting.filter((p) => p.nivel === 2),
  3: entrevistaRateLimiting.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Rate limiting — Dev Study Lab",
  description:
    "Limitar requests por cliente: algoritmos (ventana fija, deslizante, token bucket), Redis, login, cuotas y load shedding.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué status y header se devuelven al superar el límite?",
    opciones: ["500 y Location", "429 y Retry-After", "403 y Allow"],
    respuestaCorrecta: 1,
    explicacion:
      "Retry-After le dice al cliente cuándo puede volver a intentar.",
  },
  {
    pregunta: "Con 4 instancias y un limitador en memoria de 100/min, ¿cuánto puede hacer un cliente?",
    opciones: ["100", "Hasta 400, según cómo reparta el balanceador", "25"],
    respuestaCorrecta: 1,
    explicacion:
      "Cada instancia cuenta por su lado; hace falta un store compartido como Redis.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué algoritmo permite el doble del límite en el borde entre dos ventanas?",
    opciones: ["Token bucket", "Ventana fija", "Ventana deslizante"],
    respuestaCorrecta: 1,
    explicacion:
      "Los contadores se reinician en bloques alineados.",
  },
  {
    pregunta: "¿Por qué no bloquear del todo una cuenta tras 5 intentos fallidos?",
    opciones: [
      "Porque es lento",
      "Porque un atacante puede dejar sin acceso a cualquier usuario a propósito",
      "Porque no funciona",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Backoff progresivo, CAPTCHA y notificación son alternativas sin ese riesgo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "El servicio está saturado y empieza a rechazar reportes para salvar el checkout. ¿Qué es?",
    opciones: ["Rate limiting", "Load shedding", "Una cuota"],
    respuestaCorrecta: 1,
    explicacion:
      "Una defensa del sistema entero, priorizando lo crítico.",
  },
  {
    pregunta: "¿Por qué el token bucket en Redis se implementa con un script Lua?",
    opciones: [
      "Porque Lua es más rápido que JavaScript",
      "Para que leer, calcular y descontar sea atómico y no haya carreras entre instancias",
      "Porque Redis no tiene INCR",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Redis ejecuta el script sin intercalar otros comandos.",
  },
];

export default function RateLimitingPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Rate limiting"
      descripcion="Cuántos requests puede hacer cada cliente, cómo se cuenta, dónde se aplica, y qué pasa cuando se supera."
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
            El <strong className="text-foreground">rate limiting</strong>{" "}
            protege contra abuso, clientes con bugs y costos descontrolados.
            Al superar el límite: <code>429</code> con <code>Retry-After</code>,
            y headers con el estado del límite.
          </p>
          <p>
            Con varias instancias, el contador tiene que ser{" "}
            <strong className="text-foreground">compartido</strong> (Redis) o
            aplicarse en el borde (gateway, CDN, WAF). La clave puede ser el
            usuario, la API key, la IP o una combinación.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <RateLimitSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Limitar solo por IP.</strong>{" "}
            Una botnet la esquiva y una oficina entera comparte la misma.
          </li>
          <li>
            <strong className="text-foreground">429 sin Retry-After.</strong>{" "}
            El cliente reintenta enseguida y empeora la carga.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Limitar el endpoint que llama a un LLM por usuario.</li>
          <li>Límites por plan en una API pública.</li>
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
            <strong className="text-foreground">Ventana fija</strong> (barata,
            doble en el borde), <strong className="text-foreground">ventana
            deslizante</strong> (precisa; exacta con un log o aproximada con
            dos contadores) y <strong className="text-foreground">token
            bucket</strong> (ráfagas cortas y promedio acotado).
          </p>
          <p>
            En el <strong className="text-foreground">login</strong>, límites
            combinados por IP y por cuenta, con backoff progresivo y CAPTCHA en
            vez de bloqueos duros.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Bloquear cuentas tras N fallos.</strong>{" "}
            Se convierte en una herramienta de denegación de servicio.
          </li>
          <li>
            <strong className="text-foreground">El mismo límite para todos los endpoints.</strong>{" "}
            El login y el listado de productos no tienen el mismo riesgo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Token bucket para una API móvil con ráfagas al abrir la app.</li>
          <li>Backoff progresivo en el login con CAPTCHA después del tercer fallo.</li>
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
            Rate limiting (rechazar por cliente), throttling (demorar), cuotas
            (uso acumulado del plan) y load shedding (rechazar tráfico para
            salvar al sistema entero, por prioridad) resuelven problemas
            distintos.
          </p>
          <p>
            En Redis, el token bucket se implementa con un{" "}
            <strong className="text-foreground">script Lua atómico</strong>, con
            expiración de claves y una decisión explícita de qué hacer si Redis
            no responde.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Leer, calcular y escribir con comandos separados.</strong>{" "}
            Dos instancias consumen la misma ficha.
          </li>
          <li>
            <strong className="text-foreground">No decidir qué pasa si el store de rate limiting cae.</strong>{" "}
            La app entera puede quedar fuera por un componente secundario.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li><code>@upstash/ratelimit</code> en Route Handlers de Next.js.</li>
          <li>Priorizar el tráfico del checkout sobre el de reportes en un pico.</li>
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
            Este limitador se desplegó en 3 instancias serverless. ¿Por qué no
            limita nada y qué cambiarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`const intentos = new Map<string, number>();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "desconocida";
  const n = (intentos.get(ip) ?? 0) + 1;
  intentos.set(ip, n);
  if (n > 5) return new Response("Muchos intentos", { status: 429 });
  return login(req);
}`}
          </pre>
          <RevelarSolucion>
            <p>
              El <code>Map</code> vive en la memoria de cada instancia, que en
              serverless es efímera y se multiplica: el contador casi nunca pasa
              de 1. Además nunca se resetea (no hay ventana de tiempo), así que
              en una instancia longeva bloquearía para siempre, y el{" "}
              <code>x-forwarded-for</code> sin validar puede venir falsificado
              por el cliente si no lo pone un proxy de confianza. Corrección: un
              store compartido (Redis) con un algoritmo de ventana deslizante o
              token bucket y expiración, límites por IP (tomada del proxy
              confiable) y por cuenta, <code>Retry-After</code> en la respuesta,
              y backoff progresivo en vez de un corte duro.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
