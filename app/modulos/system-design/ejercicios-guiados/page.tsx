import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EjercicioGuiado } from "@/components/modulo/EjercicioGuiado";
import { entrevistaEjerciciosGuiados } from "@/lib/modules/system-design/ejercicios-guiados-entrevista";

const preguntasPorNivel = {
  1: entrevistaEjerciciosGuiados.filter((p) => p.nivel === 1),
  2: entrevistaEjerciciosGuiados.filter((p) => p.nivel === 2),
  3: entrevistaEjerciciosGuiados.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Ejercicios guiados de system design — Dev Study Lab",
  description:
    "Diseñar paso a paso un acortador de URLs, un feed paginado y un chat en tiempo real: requisitos, estimación, API, datos, arquitectura, profundización y trade-offs.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué se hace primero en una entrevista de system design?",
    opciones: ["Dibujar la arquitectura", "Acordar requisitos y alcance", "Elegir la base de datos"],
    respuestaCorrecta: 1,
    explicacion: "Sin requisitos claros, el diseño no tiene contra qué evaluarse.",
  },
  {
    pregunta: "En un acortador, ¿qué redirección permite contar cada clic?",
    opciones: ["301", "302", "Cualquiera"],
    respuestaCorrecta: 1,
    explicacion: "Los navegadores cachean las 301 y dejan de pasar por el servidor.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema tiene el fan-out on write con celebridades?",
    opciones: [
      "Las lecturas se vuelven lentas",
      "Un solo post genera millones de escrituras",
      "No se puede paginar",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso sus posts se buscan al leer, en un esquema híbrido.",
  },
  {
    pregunta: "¿Por qué el cursor del feed combina fecha e id?",
    opciones: ["Por estética", "Porque dos posts pueden tener la misma fecha", "Para encriptarlo"],
    respuestaCorrecta: 1,
    explicacion: "La posición tiene que ser única para no repetir ni saltear posts.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué define el orden de los mensajes de una conversación?",
    opciones: [
      "El reloj de cada dispositivo",
      "Un número secuencial que asigna el servidor al persistir",
      "El orden de llegada al gateway",
    ],
    respuestaCorrecta: 1,
    explicacion: "Los relojes de los dispositivos pueden estar desfasados.",
  },
  {
    pregunta: "Un cliente se desconecta 5 minutos. ¿Cómo recupera lo que se perdió?",
    opciones: [
      "El servidor le reenvía todo el historial",
      "Pide los mensajes posteriores al último número que vio",
      "No se puede recuperar",
    ],
    respuestaCorrecta: 1,
    explicacion: "El número secuencial hace que ponerse al día sea una consulta simple.",
  },
];

export default function EjerciciosGuiadosPage() {
  return (
    <ModuloLayout
      categoriaTitulo="System Design"
      titulo="Ejercicios guiados"
      descripcion="Tres diseños clásicos de entrevista resueltos paso a paso, del más acotado al más complejo."
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
            El mismo marco para cualquier diseño:{" "}
            <strong className="text-foreground">requisitos, estimación, API,
            datos, arquitectura, profundización y trade-offs</strong>. Cada
            nivel de este módulo aplica el marco a un ejercicio más complejo.
          </p>
          <p>
            Nivel 1: el <strong className="text-foreground">acortador de URLs</strong>,
            un sistema de lectura masiva cuyo problema interesante es generar los
            códigos. Probá responder cada paso antes de revelarlo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EjercicioGuiado />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Saltar a la arquitectura.</strong>{" "}
            Sin requisitos ni números, las decisiones no se pueden justificar.
          </li>
          <li>
            <strong className="text-foreground">Códigos secuenciales sin ofuscar.</strong>{" "}
            Cualquiera puede recorrerlos y descubrir URLs privadas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Practicar el marco completo en 45 minutos cronometrados.</li>
          <li>Reutilizar el razonamiento del acortador en cualquier servicio de lectura masiva.</li>
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
            Nivel 2: el <strong className="text-foreground">feed paginado</strong>.
            El problema central es el fan-out: copiar cada post a los feeds de
            los seguidores o buscarlos al leer, y el híbrido para celebridades.
          </p>
          <p>
            Y la paginación por cursor sobre una lista que cambia todo el tiempo.
            El recorrido completo está en el playground del nivel 1.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Fan-out on write para todos.</strong>{" "}
            Un post de una cuenta enorme genera millones de escrituras.
          </li>
          <li>
            <strong className="text-foreground">Paginar el feed con offset.</strong>{" "}
            Los posts nuevos corren las páginas y se repiten elementos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Feeds de actividad, notificaciones y timelines de cualquier producto social.</li>
          <li>Guardar solo ids en el feed e hidratar los posts desde una caché.</li>
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
            Nivel 3: el <strong className="text-foreground">chat en tiempo real</strong>.
            Conexiones con estado en gateways, un registro de sesiones y ruteo
            por pub/sub entre servidores.
          </p>
          <p>
            Lo difícil es la entrega: orden por número secuencial del servidor,
            recuperación al reconectar e idempotencia por id del cliente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">Enrutar antes de persistir.</strong>{" "}
            Si el gateway destino se cae, el mensaje se pierde.
          </li>
          <li>
            <strong className="text-foreground">Ordenar por el reloj del dispositivo.</strong>{" "}
            Un teléfono con la hora mal desordena la conversación.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>Chat de soporte, mensajería interna y comentarios en vivo.</li>
          <li>El mismo patrón de gateways sirve para notificaciones en tiempo real.</li>
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
            Aplicá el marco a un ejercicio nuevo: diseñá un sistema de
            reservas de entradas para recitales. Cuando salen a la venta, un
            millón de personas intenta comprar 50.000 entradas en los primeros
            minutos; cada asiento puede venderse una sola vez, y quien lo
            elige tiene 10 minutos para pagar.
          </p>
          <RevelarSolucion>
            <p>
              Requisitos: consistencia fuerte sobre cada asiento (nunca dos
              ventas), disponibilidad y equidad bajo un pico enorme, reserva
              temporal con vencimiento. Estimación: un millón de usuarios en
              pocos minutos son decenas de miles de requests por segundo contra
              solo 50.000 asientos: el problema no es el volumen de datos sino
              la contención. Diseño: una sala de espera virtual (una cola) que
              deja pasar usuarios al ritmo que el sistema soporta, en vez de
              recibir a todos a la vez. La reserva de un asiento es una escritura
              condicional atómica (UPDATE ... WHERE estado = &apos;libre&apos;, o un
              SET NX con TTL de 10 minutos en Redis, persistido después), y el
              vencimiento libera el asiento automáticamente. El mapa de asientos
              se sirve desde caché con disponibilidad aproximada; la verdad está
              en la escritura condicional. El pago usa una idempotency key para
              no cobrar dos veces, y la confirmación convierte la reserva en
              venta. Trade-offs: la sala de espera sacrifica inmediatez a cambio
              de estabilidad y equidad; la disponibilidad que ve el usuario
              puede estar levemente desactualizada, pero nunca se vende un
              asiento dos veces.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
