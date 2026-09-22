import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PromiseSimulador } from "@/components/modulo/PromiseSimulador";
import { CombinadoresSimulador } from "@/components/modulo/CombinadoresSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosPromises } from "@/lib/modules/promises/escenarios";
import { entrevistaPromises } from "@/lib/modules/promises/entrevista";

const preguntasPorNivel = {
  1: entrevistaPromises.filter((p) => p.nivel === 1),
  2: entrevistaPromises.filter((p) => p.nivel === 2),
  3: entrevistaPromises.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Promises — Dev Study Lab",
  description:
    "Los tres estados de una Promise, cómo se propagan los errores en una cadena, y las diferencias entre Promise.all, race, allSettled y any.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Una promesa rechazada llega a un .then() que solo tiene manejador de éxito. ¿Qué pasa?",
    opciones: [
      "Se ejecuta igual, con el error como argumento",
      "Se salta ese .then() y el rechazo sigue propagándose hasta encontrar un catch",
      "La aplicación se rompe",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un .then() sin segundo argumento (o sin manejar el rechazo) no intercepta errores: simplemente los deja pasar a la siguiente promesa de la cadena.",
  },
  {
    pregunta: "¿Qué diferencia a Promise.all de Promise.allSettled?",
    opciones: [
      "all espera a todas, allSettled solo a la primera",
      "all se rechaza apenas una falla; allSettled siempre espera a todas y te da el resultado de cada una",
      "Son exactamente lo mismo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Promise.all corta apenas la primera rechaza. Promise.allSettled nunca rechaza: espera que todas terminen (éxito o error) y te devuelve un resumen de cada resultado.",
  },
  {
    pregunta: "¿Cuándo rechaza Promise.any?",
    opciones: [
      "Apenas rechaza la primera promesa",
      "Solo si TODAS las promesas rechazan",
      "Nunca rechaza",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Promise.any se cumple con la primera que tenga éxito, e ignora los rechazos individuales. Solo rechaza si absolutamente todas fallan.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Necesitás el usuario y sus preferencias, dos llamadas independientes. ¿Qué código conserva el paralelismo?",
    opciones: [
      "const usuario = await getUsuario(); const preferencias = await getPreferencias();",
      "const [usuario, preferencias] = await Promise.all([getUsuario(), getPreferencias()]);",
      "Da igual, ambos tardan lo mismo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Await secuenciales serializan dos operaciones independientes: la segunda ni arranca hasta que termina la primera. Promise.all las inicia a ambas antes de esperar cualquiera.",
  },
  {
    pregunta:
      "¿Qué pasa si una Promise rechaza y nadie la maneja con .catch() o try/catch?",
    opciones: [
      "Se ignora silenciosamente sin ningún efecto",
      "Se dispara un evento de unhandled rejection, que en Node puede terminar el proceso",
      "JavaScript la reintenta automáticamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un error peligroso porque no rompe la ejecución de inmediato como una excepción síncrona: puede pasar desapercibido en desarrollo y aparecer en producción bajo cierta condición de timing.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Si una Promise ya está cumplida cuando le agregás un .then(), ¿el callback corre sincrónicamente?",
    opciones: [
      "Sí, porque el valor ya está disponible",
      "No, siempre se encola como microtask, sin importar si la promesa ya estaba resuelta",
      "Depende del motor de JavaScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es una garantía deliberada de la spec para evitar 'Zalgo': que el comportamiento síncrono o asincrónico de una función dependa de una condición de carrera, rompiendo el razonamiento sobre el orden de ejecución.",
  },
  {
    pregunta:
      "¿Cómo se implementa cancelación real de una operación asincrónica, ya que las Promises no son cancelables?",
    opciones: [
      "Llamando a promise.cancel()",
      "Con AbortController: se aborta la operación underlying, que rechaza la promesa con un AbortError",
      "No es posible cancelar una operación una vez iniciada",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La Promise en sí nunca se cancela — lo que se cancela es la operación subyacente (por ejemplo, la request de red), y esa cancelación se comunica de vuelta como un rechazo.",
  },
];

export default function PromisesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Promises"
      descripcion="Una Promise representa un valor que todavía no existe. Lo interesante no es el valor final, sino cómo se propagan el éxito y el error a través de una cadena."
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
            Una Promise tiene tres estados:{" "}
            <strong className="text-foreground">pendiente</strong>,{" "}
            <strong className="text-foreground">cumplida</strong> (resuelta
            con un valor) o{" "}
            <strong className="text-foreground">rechazada</strong> (falló
            con un error). Una vez que pasa de pendiente a cumplida o
            rechazada, queda así para siempre — no puede cambiar de
            estado de nuevo.
          </p>
          <p>
            Cada <code>.then()</code>, <code>.catch()</code> y{" "}
            <code>.finally()</code> devuelve una promesa{" "}
            <strong className="text-foreground">nueva</strong>, no la
            misma. Eso es lo que permite encadenarlos. Si un{" "}
            <code>.then()</code> lanza un error (o retorna una promesa que
            rechaza), la promesa que devuelve queda rechazada, y ese
            rechazo se propaga saltando todos los <code>.then()</code>{" "}
            siguientes que no manejen errores, hasta encontrar un{" "}
            <code>.catch()</code>.
          </p>
          <p>
            Cuando necesitás combinar varias promesas a la vez, JavaScript
            da cuatro combinadores con reglas distintas:{" "}
            <code>Promise.all</code> (todas o nada),{" "}
            <code>Promise.race</code> (la primera que termine, gane o
            pierda), <code>Promise.allSettled</code> (esperá a todas, sin
            cortar por errores) y <code>Promise.any</code> (la primera que
            tenga éxito).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <PromiseSimulador escenarios={escenariosPromises} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Configurá 3 tareas (éxito/error y duración) y compará cómo se
          comporta cada combinador con Promises reales, no una simulación
          escrita a mano.
        </p>
        <CombinadoresSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Olvidarse el return dentro de un .then().
            </strong>{" "}
            Si el callback de un .then() llama a una función que devuelve
            una promesa pero no la retorna, la cadena no espera a que esa
            promesa termine.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que .catch() solo atrapa errores del .then() inmediatamente anterior.
            </strong>{" "}
            Atrapa cualquier rechazo de toda la cadena que viene antes,
            sin importar en qué eslabón haya ocurrido.
          </li>
          <li>
            <strong className="text-foreground">
              Usar Promise.all cuando en realidad no importa si alguna falla.
            </strong>{" "}
            Si querés el resultado de las que sí funcionaron aunque otras
            fallen, Promise.all no sirve — corta todo apenas la primera
            rechaza. Ahí es Promise.allSettled.
          </li>
          <li>
            <strong className="text-foreground">
              Anidar .then() en vez de encadenarlos.
            </strong>{" "}
            Crea el clásico &ldquo;pyramid of doom&rdquo; y complica el
            manejo de errores — casi siempre se puede aplanar
            retornando la promesa interna.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Promise.all para cargar en paralelo varios recursos que la
            pantalla necesita todos sí o sí antes de renderizar.
          </li>
          <li>
            Promise.allSettled para mandar varias peticiones independientes
            (ej: subir 5 archivos) donde el fallo de una no debe cancelar
            las demás.
          </li>
          <li>
            Promise.race para implementar un timeout: correr un fetch
            contra una promesa que rechaza pasado cierto tiempo.
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
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Necesitás pedirle datos a 3 servicios distintos. Si cualquiera
            de los 3 falla, igual querés mostrar los que sí funcionaron
            (no toda la pantalla en blanco). ¿Qué combinador usarías, y
            por qué Promise.all sería la elección incorrecta acá?
          </p>
          <RevelarSolucion>
            <p>
              <code>Promise.allSettled</code> es la elección correcta.
              Devuelve un array con el resultado de{" "}
              <strong className="text-foreground">cada</strong> promesa,
              marcando cada una como <code>fulfilled</code> o{" "}
              <code>rejected</code>, sin cortar la ejecución de las demás.
            </p>
            <p className="mt-2">
              <code>Promise.all</code> sería incorrecto porque corta y
              rechaza toda la operación apenas UNA de las tres falla —
              perderías también los resultados de las que sí funcionaron,
              justo lo que no querés.
            </p>
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            async/await es azúcar sintáctico sobre Promises — no hay
            diferencia de comportamiento con <code>.then()</code>, solo de
            legibilidad y de dónde vive el manejo de errores.
            async/await lee como código síncrono y permite usar{" "}
            <code>try/catch</code>, lo que suele ser más claro con lógica
            condicional o loops.
          </p>
          <p>
            El riesgo real está en el mal uso: encadenar{" "}
            <code>await</code> secuenciales para operaciones independientes
            serializa lo que podría correr en paralelo. Si dos llamadas no
            dependen una de la otra, conviene iniciarlas antes de esperar
            cualquiera —{" "}
            <code>
              Promise.all([tarea1(), tarea2()])
            </code>{" "}
            — en vez de un <code>await</code> detrás del otro.
          </p>
          <p>
            Del lado de errores, una Promise rechazada sin{" "}
            <code>.catch()</code> ni <code>try/catch</code> dispara un{" "}
            <em>unhandled rejection</em>: un evento (
            <code>unhandledrejection</code> en el navegador, en el{" "}
            <code>process</code> en Node) que en Node puede terminar el
            proceso si nadie lo escucha.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Serializar operaciones independientes por usar await en
              secuencia.
            </strong>{" "}
            Cada await bloquea el progreso de la función async hasta
            resolverse; la siguiente llamada ni arranca hasta entonces.
          </li>
          <li>
            <strong className="text-foreground">
              Dejar una Promise sin manejar dentro de una función async.
            </strong>{" "}
            Un await dentro de un try sin catch, o una promesa &quot;fire and
            forget&quot; sin .catch(), termina en un unhandled rejection.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Promisify de APIs basadas en callbacks (Node legacy) para poder
            usarlas con async/await.
          </li>
          <li>
            Reintentos con backoff exponencial: envolver una operación en
            un loop que espera cada vez más tiempo entre intentos fallidos.
          </li>
          <li>
            Escuchar <code>process.on(&apos;unhandledRejection&apos;, ...)</code>{" "}
            en un servicio Node como red de seguridad para loguear y
            alertar, no como estrategia principal de manejo de errores.
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
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            El callback de <code>.then()</code> nunca corre sincrónicamente,
            ni siquiera si la promesa ya estaba cumplida en el momento de
            registrarlo — siempre se encola como microtask. Es una garantía
            deliberada de la spec para evitar &ldquo;liberar Zalgo&rdquo;:
            funciones cuyo comportamiento síncrono o asincrónico depende de
            una condición de carrera, lo cual rompe el razonamiento sobre
            el orden de ejecución.
          </p>
          <p>
            Relacionado con esto está el concepto de{" "}
            <strong className="text-foreground">thenable</strong>: cualquier
            objeto con un método <code>.then()</code>, sea o no una Promise
            nativa. <code>Promise.resolve()</code> detecta thenables y
            &ldquo;asimila&rdquo; su estado en vez de envolverlos
            directamente, garantizando que el resultado final sea siempre
            una Promise nativa genuina.
          </p>
          <p>
            Las Promises no son cancelables nativamente. Para cancelación
            real se usa <code>AbortController</code>: no se cancela la
            Promise en sí, sino la operación subyacente, y esa cancelación
            se comunica de vuelta como un rechazo con <code>AbortError</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Asumir que un valor ya disponible se resuelve sincrónicamente.
            </strong>{" "}
            Aunque la promesa ya esté cumplida, el .then() siempre corre
            en la siguiente vuelta como microtask.
          </li>
          <li>
            <strong className="text-foreground">
              Creer que se puede &quot;cancelar&quot; una Promise directamente.
            </strong>{" "}
            No existe promise.cancel(): hay que cancelar la operación
            subyacente (fetch, timer) y dejar que eso produzca el rechazo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Cancelar un fetch con AbortController cuando el usuario navega
            fuera de una pantalla antes de que termine la request.
          </li>
          <li>
            Envolver librerías legacy que devuelven objetos
            &quot;promise-like&quot; (thenables) sabiendo que
            Promise.resolve() los asimila correctamente en una Promise
            nativa.
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
