import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { AsyncSimulador } from "@/components/modulo/AsyncSimulador";
import { SecuencialVsParaleloSimulador } from "@/components/modulo/SecuencialVsParaleloSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosAsync } from "@/lib/modules/async/escenarios";
import { entrevistaAsync } from "@/lib/modules/async/entrevista";

const preguntasPorNivel = {
  1: entrevistaAsync.filter((p) => p.nivel === 1),
  2: entrevistaAsync.filter((p) => p.nivel === 2),
  3: entrevistaAsync.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Async — Dev Study Lab",
  description:
    "async/await es azúcar sintáctico sobre Promises: cómo se pausa una función async sin bloquear el resto del programa.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué devuelve siempre una función declarada como async?",
    opciones: [
      "El valor del return, si adentro no hay ningún await",
      "Una Promise, pero solo si adentro hay al menos un await",
      "Una Promise, aunque el return sea un valor común",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Aunque hagas return de un valor normal, una función async siempre envuelve ese valor en una Promise automáticamente.",
  },
  {
    pregunta: "Al llegar a un await, ¿qué pasa con el resto del programa?",
    opciones: [
      "Solo esa función se pausa; quien la llamó sigue ejecutando su código",
      "El hilo se bloquea hasta que la promesa resuelve, como una llamada síncrona",
      "Se pausan esa función y quien la llamó, hasta que termine toda la cadena",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "await no bloquea el hilo principal. Pausa esa función async puntual y le devuelve el control a quien la llamó, que sigue ejecutando su código síncrono.",
  },
  {
    pregunta: "¿Por qué usar await dentro del callback de array.forEach no funciona como uno esperaría?",
    opciones: [
      "forEach sí espera cada await, pero los errores de adentro no llegan al try/catch de afuera",
      "forEach ignora la promesa que devuelve el callback, así que no espera a ninguna",
      "Los callbacks async se ejecutan recién cuando el forEach terminó de recorrer el array",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "forEach ignora el valor de retorno de su callback. Si el callback es async y devuelve una Promise, forEach no la espera — sigue a la siguiente iteración inmediatamente.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo empieza a ejecutarse el código dentro de una función async?",
    opciones: [
      "En la próxima microtask: una función async siempre arranca diferida",
      "Cuando alguien hace await o .then() sobre la promesa que devuelve",
      "En el acto, de forma síncrona, hasta llegar al primer await",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Igual que cualquier función normal, corre síncrono en el momento en que se la llama. Recién en el primer await se pausa y le devuelve el control al llamador.",
  },
  {
    pregunta:
      "¿Qué te da un async generator (async function*) que una función async normal no da?",
    opciones: [
      "Emitir varios valores a lo largo del tiempo, consumidos con for await...of",
      "Ejecutar sus awaits en paralelo, en vez de uno detrás del otro",
      "Correr en un hilo aparte, así no bloquea el event loop mientras produce",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Es útil para procesar datos que llegan de a poco (streams, paginación) sin cargar todo en memoria, dejando que el consumidor procese cada valor a medida que se emite.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Qué es una 'floating promise' y por qué es riesgosa?",
    opciones: [
      "Una Promise que queda pendiente para siempre porque nadie llamó a resolve()",
      "Una Promise que se llama sin await ni .catch(): si rechaza, nadie se entera",
      "Una Promise creada fuera de una función async, que corre sin manejo de errores",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si esa operación rechaza, nadie la está observando: el error puede pasar desapercibido en desarrollo y aparecer recién en producción. Reglas de lint como no-floating-promises existen para detectarlas.",
  },
  {
    pregunta:
      "¿Qué riesgo tiene usar top-level await si hay una dependencia circular entre módulos?",
    opciones: [
      "Que el módulo importado se evalúe dos veces, una por cada lado del ciclo",
      "Que los imports del ciclo reciban undefined en vez de un error de TDZ",
      "Un deadlock: cada módulo espera a otro que sigue pausado en su await",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Top-level await pausa la evaluación de todo el grafo de módulos que dependen de él. Con dependencia circular entre dos módulos que lo usan, se puede llegar a un deadlock que el runtime suele detectar y reportar como error.",
  },
];

export default function AsyncPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Async"
      descripcion="async/await no es una forma distinta de manejar asincronismo: es la misma mecánica de Promises, con una sintaxis que se lee como código síncrono."
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
            Una función marcada con <code>async</code> siempre devuelve una{" "}
            <strong className="text-foreground">Promise</strong>, aunque
            adentro hagas un <code>return</code> normal. Dentro de esa
            función, <code>await</code> hace algo puntual: pausa{" "}
            <em>esa función</em> hasta que la promesa que le pasaste se
            resuelva, y mientras tanto le devuelve el control a quien la
            llamó — que sigue ejecutando su código sin esperar nada.
          </p>
          <p>
            Es exactamente la misma mecánica que ya viste con Promises:{" "}
            <code>await promesa</code> es más o menos equivalente a
            encadenar un <code>.then()</code> con el resto del código que
            sigue. La ventaja es que se lee de arriba a abajo, como código
            síncrono, y los errores se manejan con{" "}
            <code>try/catch</code> en vez de <code>.catch()</code>.
          </p>
          <p>
            Como no bloquea nada, una función async que llega a un{" "}
            <code>await</code> no &ldquo;congela&rdquo; el programa: el
            resto del código síncrono que viene después de llamarla sigue
            corriendo primero.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <AsyncSimulador escenarios={escenariosAsync} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          El error de performance más común con async/await: awaits
          secuenciales para operaciones que son independientes entre sí.
          Medido con tiempo real, no simulado.
        </p>
        <SecuencialVsParaleloSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Encadenar awaits para operaciones independientes.
            </strong>{" "}
            Si tres peticiones no dependen entre sí, esperarlas una por
            una suma sus tiempos en vez de correr en paralelo con
            Promise.all.
          </li>
          <li>
            <strong className="text-foreground">
              Usar await dentro de forEach esperando que funcione como un loop secuencial.
            </strong>{" "}
            No espera nada. Si necesitás recorrer secuencialmente, usá un{" "}
            <code>for...of</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidarse el try/catch alrededor de un await.
            </strong>{" "}
            Un await que rechaza sin manejar se comporta como un throw:
            corta la ejecución de la función con una excepción no
            capturada.
          </li>
          <li>
            <strong className="text-foreground">
              Marcar una función como async sin usar await adentro.
            </strong>{" "}
            No rompe nada, pero agrega una Promise innecesaria — una señal
            de que probablemente no hacía falta.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Reemplazar cadenas largas de .then() por código lineal más
            fácil de leer y depurar.
          </li>
          <li>
            Procesar una lista donde el orden importa (ej: transacciones
            que dependen unas de otras) con un for...of y await adentro.
          </li>
          <li>
            Combinar con Promise.all cuando las operaciones son
            independientes y el orden no importa, para minimizar el
            tiempo total de espera.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>Esta función tarda el triple de lo necesario. ¿Por qué, y cómo la arreglarías?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`async function cargarDashboard() {
  const usuario = await fetch('/api/usuario').then((r) => r.json());
  const pedidos = await fetch('/api/pedidos').then((r) => r.json());
  const notificaciones = await fetch('/api/notificaciones').then((r) => r.json());

  return { usuario, pedidos, notificaciones };
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Las tres peticiones no dependen entre sí, pero al hacer{" "}
              <code>await</code> una por una, cada fetch arranca recién
              cuando terminó el anterior — sus tiempos se suman en vez de
              solaparse.
            </p>
            <p className="mt-2">El fix es arrancar las tres al mismo tiempo y esperar juntas con Promise.all:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`async function cargarDashboard() {
  const [usuario, pedidos, notificaciones] = await Promise.all([
    fetch('/api/usuario').then((r) => r.json()),
    fetch('/api/pedidos').then((r) => r.json()),
    fetch('/api/notificaciones').then((r) => r.json()),
  ]);

  return { usuario, pedidos, notificaciones };
}`}
            </pre>
          </RevelarSolucion>
        </div>
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
            El código dentro de una función async no espera a nada para
            empezar: corre <strong className="text-foreground">
            síncronamente</strong>, igual que cualquier función normal,
            desde el momento en que se la llama. Recién al llegar al
            primer <code>await</code> se pausa y le devuelve el control al
            llamador. Esto importa para debugging: un error lanzado antes
            del primer await se comporta como una excepción síncrona
            común, mientras que uno después de un await solo se puede
            capturar en la promesa que devuelve la función.
          </p>
          <p>
            La granularidad del manejo de errores es una decisión de
            diseño: un único <code>try/catch</code> alrededor de toda la
            función es más simple, pero no distingue qué operación falló.
            Un <code>try/catch</code> por cada <code>await</code> permite
            reaccionar distinto a cada fallo (reintentar solo una,
            usar un valor por defecto para otra), a costa de más código.
          </p>
          <p>
            Los <strong className="text-foreground">async generators</strong>{" "}
            (<code>async function*</code>) combinan generadores con async:
            en vez de una sola Promise, producen un async iterable que
            emite valores en el tiempo, consumido con{" "}
            <code>for await...of</code>. Sirven para procesar streams o
            paginación sin cargar todo en memoria de una vez.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Asumir que una función async siempre difiere su ejecución.
            </strong>{" "}
            El código antes del primer await corre inmediato y síncrono,
            no en una futura vuelta del Event Loop.
          </li>
          <li>
            <strong className="text-foreground">
              Usar un solo try/catch cuando necesitás distinguir qué
              operación falló.
            </strong>{" "}
            Un catch genérico alrededor de todo pierde la información de
            cuál de varios awaits fue el que rechazó.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Consumir una API paginada con un async generator que hace un
            fetch por página y emite los items a medida que llegan.
          </li>
          <li>
            Procesar un archivo grande en streaming con{" "}
            <code>for await...of</code> sobre un ReadableStream, sin
            cargarlo entero en memoria.
          </li>
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
            Una <strong className="text-foreground">floating promise</strong>{" "}
            es llamar a algo que devuelve una Promise sin{" "}
            <code>await</code>, <code>.then()</code> ni{" "}
            <code>.catch()</code>: nadie observa su resultado. Si esa
            operación rechaza, se vuelve un unhandled rejection silencioso,
            típico en código que dispara efectos secundarios (loguear,
            notificar) sin esperar su resultado. Reglas de lint como{" "}
            <code>no-floating-promises</code> existen para detectarlas en
            build time.
          </p>
          <p>
            Cada <code>await</code> reanuda en una microtask nueva, y por
            defecto el motor no conserva el stack de lo que corría antes de
            la suspensión: un error async puede llegar con un stack trace
            incompleto, sin la cadena de llamadas original. Motores
            modernos mitigan esto con &ldquo;zero-cost async stack
            traces&rdquo;, pero no es garantía universal — loguear contexto
            explícito (request id) sigue siendo más confiable.
          </p>
          <p>
            <code>top-level await</code> pausa la evaluación de todo el
            grafo de módulos que dependen de él. Con dependencia circular
            entre dos módulos que lo usan, se puede llegar a un deadlock:
            uno espera al otro, que a su vez necesita algo del primero
            todavía no disponible.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Dejar una llamada async &quot;fire and forget&quot; sin manejar.
            </strong>{" "}
            Si rechaza, se convierte en un unhandled rejection que puede
            pasar desapercibido hasta producción.
          </li>
          <li>
            <strong className="text-foreground">
              Confiar solo en el stack trace de un error async para
              debuggear.
            </strong>{" "}
            Puede faltar la cadena de llamadas previa a un await; conviene
            loguear contexto explícito además del error.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Configurar la regla <code>no-floating-promises</code> de
            typescript-eslint para detectar promesas sin manejar antes de
            que lleguen a producción.
          </li>
          <li>
            Evitar top-level await lento en módulos compartidos por muchas
            rutas, para no retrasar el arranque de toda la aplicación.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
