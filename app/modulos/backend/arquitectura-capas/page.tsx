import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { CapasRefactorVisor } from "@/components/modulo/CapasRefactorVisor";
import { entrevistaArquitecturaCapas } from "@/lib/modules/backend/arquitectura-capas-entrevista";

const preguntasPorNivel = {
  1: entrevistaArquitecturaCapas.filter((p) => p.nivel === 1),
  2: entrevistaArquitecturaCapas.filter((p) => p.nivel === 2),
  3: entrevistaArquitecturaCapas.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Arquitectura en capas — Dev Study Lab",
  description:
    "Controller, service y repository: responsabilidades, fat controllers, transacciones, cuándo sobra un repository, modelo anémico y relación con hexagonal.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿En qué capa va la regla 'un cupón vencido no se aplica'?",
    opciones: ["Controller", "Service", "Repository"],
    respuestaCorrecta: 1,
    explicacion:
      "Es lógica de negocio: no depende de HTTP ni de cómo se guardan los datos.",
  },
  {
    pregunta: "¿Qué sabe el service sobre HTTP?",
    opciones: [
      "Todo: lee req y responde con res",
      "Nada: recibe datos, aplica reglas y devuelve un resultado o lanza un error de dominio",
      "Solo los status codes",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La traducción a HTTP es trabajo del controller o del error middleware.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Quién decide la frontera de una transacción?",
    opciones: [
      "Cada repository por su cuenta",
      "El service, que sabe qué pasos forman una operación de negocio atómica",
      "El controller",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Sin exponer detalles de la base, con una unidad de trabajo o propagación implícita.",
  },
  {
    pregunta: "¿Cuándo sobra un repository sobre Prisma?",
    opciones: [
      "Nunca",
      "Cuando solo reenvía cada llamada al ORM sin agregar nada",
      "Siempre",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Suma valor con consultas complejas, reglas transversales o tests sin base.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué caracteriza a un modelo anémico?",
    opciones: [
      "Entidades con mucho comportamiento",
      "Entidades solo con datos y toda la lógica en servicios externos",
      "No usar base de datos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las invariantes quedan dispersas y nada impide estados inválidos.",
  },
  {
    pregunta: "¿Qué dependencia invierte Hexagonal respecto de las capas clásicas?",
    opciones: [
      "Controller → service",
      "Service → repository concreto: el service define la interfaz y el adaptador la implementa",
      "Ninguna",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Así el núcleo no depende de la base ni del ORM.",
  },
];

export default function ArquitecturaCapasPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Arquitectura en capas"
      descripcion="Separar HTTP, negocio y datos en controller, service y repository, para que la lógica importante se pueda leer, testear y reutilizar."
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
            <strong className="text-foreground">Controller</strong>: HTTP
            (leer, validar forma, responder). <strong className="text-foreground">Service</strong>:
            reglas de negocio, sin HTTP ni SQL.{" "}
            <strong className="text-foreground">Repository</strong>: acceso a
            datos con nombres de dominio. Dependencias en un solo sentido.
          </p>
          <p>
            El beneficio es concreto: la lógica se testea sin servidor ni base,
            se reutiliza desde jobs o colas, y un cambio de infraestructura toca
            una sola capa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <CapasRefactorVisor />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Services que reciben <code>req</code> o devuelven status.</strong>{" "}
            Quedan atados a HTTP y no se reutilizan.
          </li>
          <li>
            <strong className="text-foreground">Controllers de 200 líneas.</strong>{" "}
            La regla importante queda enterrada y sin tests.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Reutilizar el mismo servicio desde un endpoint y un job nocturno.</li>
          <li>Testear las reglas de precios con un repositorio en memoria.</li>
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
            Las <strong className="text-foreground">transacciones</strong> las
            delimita el service (operación de negocio atómica), pasando el
            contexto a los repositorios o propagándolo implícitamente. Nunca una
            transacción abierta mientras se llama a un servicio externo lento.
          </p>
          <p>
            El <strong className="text-foreground">repository</strong> sobre un
            ORM suma valor con consultas complejas, reglas transversales
            (filtro por tenant) o tests sin base; si solo reenvía llamadas,
            sobra.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Una transacción por repositorio.</strong>{" "}
            Dos pasos de la misma operación quedan sin atomicidad.
          </li>
          <li>
            <strong className="text-foreground">Repositories que exponen el ORM entero.</strong>{" "}
            El detalle de la base se filtra por todo el código.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li><code>@Transactional</code> con CLS en un servicio de NestJS.</li>
          <li>Un repository que siempre agrega el filtro de organización.</li>
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
            El <strong className="text-foreground">modelo anémico</strong> deja
            las invariantes dispersas en servicios; un modelo rico las pone en
            la entidad. Un punto medio habitual: funciones puras de dominio,
            en un solo lugar y testeadas.
          </p>
          <p>
            <strong className="text-foreground">Capas vs hexagonal</strong>:
            hexagonal invierte la dependencia del servicio hacia el repositorio
            concreto. Un service que recibe una interfaz por inyección y no
            importa el ORM ya está muy cerca.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">La misma regla copiada en tres servicios.</strong>{" "}
            Tarde o temprano una de las copias queda distinta.
          </li>
          <li>
            <strong className="text-foreground">Capas por ritual en un CRUD simple.</strong>{" "}
            Tres archivos por endpoint sin lógica que proteger.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li><code>pedido.aplicarCupon()</code> como único camino para cambiar el descuento.</li>
          <li>Migrar un proyecto en capas a puertos y adaptadores de forma gradual.</li>
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
            Este servicio &quot;en capas&quot; tiene problemas de diseño.
            ¿Cuáles?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`class PedidosService {
  async cancelar(req: Request, res: Response) {
    const pedido = await prisma.pedido.findUnique({ where: { id: req.params.id } });
    if (pedido.estado === "enviado") {
      return res.status(409).json({ error: "Ya fue enviado" });
    }
    await prisma.pedido.update({ where: { id: pedido.id }, data: { estado: "cancelado" } });
    await stripe.refunds.create({ payment_intent: pedido.pagoId });
    await prisma.stock.update({ ... });
    res.json({ ok: true });
  }
}`}
          </pre>
          <RevelarSolucion>
            <p>
              1) El servicio recibe <code>req</code> y <code>res</code> y decide
              status: es un controller con otro nombre; debería recibir el id
              (y el usuario) y lanzar un error de dominio (
              <code>PedidoYaEnviado</code>) que el controller traduce a 409. 2)
              Usa Prisma y Stripe directamente: no se puede testear sin base ni
              SDK; van detrás de un repository y de un adaptador de pagos. 3)
              Falta autorización: cualquiera cancela cualquier pedido. 4) No hay
              transacción entre el cambio de estado y el stock, y el reembolso a
              Stripe queda en el medio: si falla, el pedido queda cancelado sin
              reembolso. Mejor: transacción para estado y stock, y el reembolso
              como job idempotente (o con outbox) disparado al confirmar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
