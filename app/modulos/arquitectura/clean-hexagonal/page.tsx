import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { HexagonalSimulador } from "@/components/modulo/HexagonalSimulador";
import { entrevistaCleanHexagonal } from "@/lib/modules/arquitectura/clean-hexagonal-entrevista";

const preguntasPorNivel = {
  1: entrevistaCleanHexagonal.filter((p) => p.nivel === 1),
  2: entrevistaCleanHexagonal.filter((p) => p.nivel === 2),
  3: entrevistaCleanHexagonal.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Clean / Hexagonal architecture — Dev Study Lab",
  description:
    "Puertos, adaptadores y la regla de dependencias: proteger la lógica de negocio de frameworks, bases y proveedores.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "En hexagonal, ¿qué es un puerto?",
    opciones: [
      "Un puerto TCP del servidor",
      "Una interfaz que el núcleo declara para lo que necesita del exterior",
      "Un controller HTTP",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los adaptadores implementan los puertos con tecnología concreta.",
  },
  {
    pregunta: "Según la regla de dependencias, ¿puede una entidad de dominio importar Prisma?",
    opciones: ["Sí", "No: las dependencias apuntan hacia adentro", "Solo en tests"],
    respuestaCorrecta: 1,
    explicacion:
      "El dominio no conoce la infraestructura; la infraestructura conoce al dominio.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿En cuál de estos casos Clean suele ser sobre-ingeniería?",
    opciones: [
      "Un sistema de seguros con reglas complejas",
      "Un CRUD simple de un backoffice interno",
      "Un core bancario",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin reglas de negocio, las capas agregan ceremonia sin proteger nada.",
  },
  {
    pregunta: "¿Qué es el composition root?",
    opciones: [
      "La carpeta raíz del repo",
      "El único lugar donde se crean los objetos concretos y se conectan",
      "El componente raíz de React",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cambiar una implementación es tocar una línea ahí.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué cumple el rol de 'caso de uso' en un frontend React bien organizado?",
    opciones: ["El JSX", "Los hooks que orquestan lógica y datos", "El CSS"],
    respuestaCorrecta: 1,
    explicacion:
      "Los componentes quedan como adaptadores de presentación.",
  },
  {
    pregunta: "¿Qué nunca debería llegar a una respuesta de la API?",
    opciones: [
      "Un DTO",
      "El objeto del ORM con sus campos internos",
      "Un status code",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Aunque se use el modelo del ORM como entidad, hacia afuera va un DTO explícito.",
  },
];

export default function CleanHexagonalPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Clean / Hexagonal architecture"
      descripcion="Organizar una aplicación para que la lógica de negocio no dependa de frameworks, bases de datos ni proveedores."
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
            En el centro, el <strong className="text-foreground">dominio</strong>{" "}
            y los <strong className="text-foreground">casos de uso</strong>.
            Cuando necesitan algo de afuera, declaran un{" "}
            <strong className="text-foreground">puerto</strong> (una interfaz).
            Afuera, los <strong className="text-foreground">adaptadores</strong>{" "}
            lo implementan con Prisma, Stripe o HTTP.
          </p>
          <p>
            La <strong className="text-foreground">regla de dependencias</strong>:
            los imports apuntan siempre hacia adentro. Así se puede cambiar de
            base o de proveedor sin tocar la lógica, y testear los casos de uso
            con adaptadores en memoria.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <HexagonalSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Lógica de negocio en el controller.</strong>{" "}
            Queda atada a HTTP y no se puede reutilizar desde un job o una cola.
          </li>
          <li>
            <strong className="text-foreground">SDKs de terceros usados directamente en la lógica.</strong>{" "}
            Cambiar de proveedor obliga a tocar reglas de negocio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Migrar de Stripe a Mercado Pago cambiando un adaptador.</li>
          <li>Testear casos de uso con un repositorio en memoria.</li>
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
            Vale la pena con <strong className="text-foreground">lógica de
            negocio real</strong>, sistemas longevos, varios canales de entrada
            o mucha lógica para testear. Es sobre-ingeniería en un CRUD sin
            reglas, en prototipos o en equipos chicos.
          </p>
          <p>
            El <strong className="text-foreground">composition root</strong>{" "}
            concentra la creación y conexión de los objetos concretos; el resto
            del código recibe dependencias ya armadas y solo conoce interfaces.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Interfaces para todo, con una sola implementación.</strong>{" "}
            Indirección sin beneficio.
          </li>
          <li>
            <strong className="text-foreground"><code>new</code> de dependencias concretas en cualquier parte.</strong>{" "}
            Rompe la inversión de dependencias en silencio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un <code>main.ts</code> que arma el grafo de dependencias a mano.</li>
          <li>Aislar solo los proveedores externos en un CRUD que no necesita más.</li>
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
            En <strong className="text-foreground">React</strong>: reglas de
            negocio en funciones puras, acceso a datos detrás de un cliente
            propio, hooks como casos de uso y componentes como adaptadores de
            presentación.
          </p>
          <p>
            <strong className="text-foreground">Entidades vs modelos del ORM</strong>:
            separarlos protege al dominio a costa de mapeos; muchos equipos los
            unifican mientras el dominio es simple. Lo que no se negocia: hacia
            afuera, un DTO explícito.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>fetch</code> en cada componente.</strong>{" "}
            Cambiar un endpoint obliga a buscar por todo el código.
          </li>
          <li>
            <strong className="text-foreground">Devolver entidades del ORM en la API.</strong>{" "}
            Filtra campos internos y acopla el contrato al esquema.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un módulo <code>analytics.ts</code> que envuelve al SDK del proveedor.</li>
          <li>Mappers entre el modelo de Prisma y la entidad de dominio en un core complejo.</li>
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
            Esta función se usa desde un endpoint y, desde el mes que viene,
            también desde un job nocturno. ¿Qué problemas tiene y cómo la
            reorganizarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`export async function renovarSuscripcion(req, res) {
  const sub = await prisma.suscripcion.findUnique({ where: { id: req.params.id } });
  if (sub.estado === "cancelada") return res.status(409).json({ error: "Cancelada" });
  const cobro = await stripe.charges.create({ amount: sub.precio, customer: sub.clienteStripe });
  await prisma.suscripcion.update({ where: { id: sub.id }, data: { venceEl: sumarMes(sub.venceEl) } });
  res.json({ ok: true, cobro: cobro.id });
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Mezcla HTTP (<code>req</code>, <code>res</code>, status), reglas de
              negocio (no renovar si está cancelada, sumar un mes), persistencia
              (Prisma) y un proveedor (Stripe): el job no puede reutilizarla y
              testear la regla exige base y SDK. Reorganización: un caso de uso{" "}
              <code>RenovarSuscripcion</code> que recibe por constructor un{" "}
              <code>SuscripcionesRepo</code> y una <code>PasarelaPagos</code>{" "}
              (puertos), aplica las reglas y lanza errores de dominio (
              <code>SuscripcionCancelada</code>). Adaptadores: Prisma para el
              repo y Stripe para los pagos. Adaptadores de entrada: el
              controller HTTP traduce el error de dominio a 409 y el job lo
              registra en logs. Los dos llaman al mismo caso de uso, armado en
              el composition root.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
