import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { FeatureFlagsSimulador } from "@/components/modulo/FeatureFlagsSimulador";
import { entrevistaFeatureFlags } from "@/lib/modules/ci-cd/feature-flags-entrevista";

const preguntasPorNivel = {
  1: entrevistaFeatureFlags.filter((p) => p.nivel === 1),
  2: entrevistaFeatureFlags.filter((p) => p.nivel === 2),
  3: entrevistaFeatureFlags.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Feature flags — Dev Study Lab",
  description:
    "Deploy vs release, tipos de flags, implementación y OpenFeature, rollouts con hash consistente, deuda de flags, sistemas distribuidos y experimentos A/B.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué permite separar un feature flag?",
    opciones: ["El frontend del backend", "El deploy del release", "Los tests de producción"],
    respuestaCorrecta: 1,
    explicacion: "El código llega a producción apagado y se activa cuando se decide.",
  },
  {
    pregunta: "¿Qué tipo de flag puede ser permanente?",
    opciones: ["Una release flag", "Un kill switch operacional", "Un experimento terminado"],
    respuestaCorrecta: 1,
    explicacion: "Las release flags y los experimentos se borran cuando terminan.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué el rollout usa un hash del usuario y no un número aleatorio por request?",
    opciones: [
      "Porque es más rápido",
      "Para que cada usuario vea siempre la misma versión y conserve la suya al subir el porcentaje",
      "Porque lo exige OpenFeature",
    ],
    respuestaCorrecta: 1,
    explicacion: "Un número aleatorio alternaría versiones entre requests del mismo usuario.",
  },
  {
    pregunta: "¿Qué hacer con una release flag que está al 100% hace tres meses?",
    opciones: ["Dejarla por las dudas", "Borrarla junto con el camino viejo", "Reutilizarla para otra funcionalidad"],
    respuestaCorrecta: 1,
    explicacion: "Es código muerto con riesgo; reutilizarla es todavía peor.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "El servicio de flags se cae y la app arranca en frío. ¿Qué valor usa?",
    opciones: [
      "Encendida para todos",
      "El default definido en el código, que debería ser el comportamiento seguro",
      "Falla el arranque",
    ],
    respuestaCorrecta: 1,
    explicacion: "Por eso el default suele ser el camino viejo, ya probado.",
  },
  {
    pregunta: "Un A/B configurado 50/50 muestra 53/47 con 200.000 usuarios. ¿Qué significa?",
    opciones: [
      "Una variante ganó",
      "Un sample ratio mismatch: algo sesga la asignación o el registro",
      "Nada, es normal",
    ],
    respuestaCorrecta: 1,
    explicacion: "Con esa muestra, la diferencia no es azar; los resultados no son confiables.",
  },
];

export default function FeatureFlagsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="CI/CD"
      titulo="Feature flags"
      descripcion="Cambiar qué ven los usuarios sin desplegar: rollouts graduales, kill switches y experimentos, sin llenar el código de ifs olvidados."
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
            Un <strong className="text-foreground">feature flag</strong> es un
            condicional decidido en configuración, en runtime. Separa el deploy
            del release: el código llega apagado y se activa gradualmente.
          </p>
          <p>
            Tipos: release (temporales), kill switches (operacionales),
            experimentos y permisos. Variables de entorno para lo simple, un
            servicio para rollouts y targeting.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <FeatureFlagsSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Un default peligroso.</strong>{" "}
            Si el servicio de flags no responde, se activa lo que no estaba listo.
          </li>
          <li>
            <strong className="text-foreground">Branches largos en vez de flags.</strong>{" "}
            Semanas sin integrar terminan en un merge enorme y riesgoso.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Lanzar un checkout nuevo al 5%, 25% y 100% de los usuarios.</li>
          <li>Un kill switch para apagar una integración con un proveedor caído.</li>
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
            <strong className="text-foreground">Rollout</strong>: hash de la
            flag y el usuario, estable entre requests. Evaluar en el servidor y
            pasar el resultado al cliente evita exponer reglas y parpadeos.
          </p>
          <p>
            <strong className="text-foreground">Deuda</strong>: responsable y
            vencimiento para cada flag de release, limpieza planificada, y nunca
            reutilizar una flag vieja.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Evaluar distinto en server y client.</strong>{" "}
            El HTML del servidor no coincide con el render del cliente.
          </li>
          <li>
            <strong className="text-foreground">Flags que dependen de otras flags.</strong>{" "}
            Las combinaciones se multiplican y nadie sabe cuáles se probaron.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Beta de una funcionalidad para clientes del plan pro.</li>
          <li>Un ticket de limpieza creado junto con cada flag de release.</li>
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
            <strong className="text-foreground">Distribuido</strong>: evaluación
            local con defaults seguros, un solo punto de decisión para flujos que
            cruzan servicios, migraciones antes de la flag, y la variante como
            parte de la clave de caché.
          </p>
          <p>
            <strong className="text-foreground">Experimentos</strong>: registrar
            la exposición, vigilar el sample ratio, no cortar al primer resultado
            significativo, y métricas guardrail.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Cachear una respuesta que depende de una flag.</strong>{" "}
            Un usuario recibe la variante de otro.
          </li>
          <li>
            <strong className="text-foreground">Mirar el A/B todos los días y cortar al primer éxito.</strong>{" "}
            Los falsos positivos se disparan.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un experimento de precios con guardrails de reembolsos y errores.</li>
          <li>Propagar la variante en un header entre la API y los workers.</li>
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
            Un e-commerce con Next.js va a reemplazar el motor de cálculo de
            envíos. El nuevo guarda un campo <code>zona_envio</code> en cada
            pedido. La página de producto se cachea en el CDN y muestra el costo
            de envío estimado. Diseñá el lanzamiento con feature flags.
          </p>
          <RevelarSolucion>
            <p>
              1) Primero la migración: <code>zona_envio</code> nullable, y el
              motor viejo tiene que tolerar pedidos que ya la tengan, porque
              apagar la flag no borra lo escrito. 2) Flag{" "}
              <code>motor-envios-v2</code> con default apagado, evaluada en el
              servidor con el id del usuario como clave. 3) Shadow mode primero:
              calcular con los dos motores, responder con el viejo y registrar
              las diferencias, hasta que coincidan en los casos esperados. 4)
              Rollout: empleados, 5%, 25%, 100%, mirando errores, tiempo de
              cálculo y tasa de checkout por variante. 5) El CDN: si la página
              cacheada incluye el costo, dos variantes compartirían la misma
              entrada. O se saca el costo del HTML cacheado y se pide aparte,
              o la variante entra en la clave de caché (con cuidado de no
              multiplicar el caché por usuario). 6) Al llegar al 100% y pasar
              un tiempo prudente, borrar la flag y el motor viejo.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
