import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { AsyncSimulador } from "@/components/modulo/AsyncSimulador";
import { SecuencialVsParaleloSimulador } from "@/components/modulo/SecuencialVsParaleloSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosAsync } from "@/lib/modules/async/escenarios";

export const metadata: Metadata = {
  title: "Async — Frontend Study Lab",
  description:
    "async/await es azúcar sintáctico sobre Promises: cómo se pausa una función async sin bloquear el resto del programa.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué devuelve siempre una función declarada como async?",
    opciones: ["El valor que hace return", "Una Promise", "undefined hasta que termine"],
    respuestaCorrecta: 1,
    explicacion:
      "Aunque hagas return de un valor normal, una función async siempre envuelve ese valor en una Promise automáticamente.",
  },
  {
    pregunta: "Al llegar a un await, ¿qué pasa con el resto del programa?",
    opciones: [
      "Se congela todo hasta que resuelva",
      "Sigue ejecutándose normalmente; solo la función async se pausa y libera el control",
      "Se cancela la función que llamó a la async",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "await no bloquea el hilo principal. Pausa esa función async puntual y le devuelve el control a quien la llamó, que sigue ejecutando su código síncrono.",
  },
  {
    pregunta: "¿Por qué usar await dentro del callback de array.forEach no funciona como uno esperaría?",
    opciones: [
      "forEach no acepta funciones async",
      "forEach no espera las promesas que devuelve su callback: el loop 'termina' antes de que las operaciones async resuelvan",
      "Da un error de sintaxis",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "forEach ignora el valor de retorno de su callback. Si el callback es async y devuelve una Promise, forEach no la espera — sigue a la siguiente iteración inmediatamente.",
  },
];

export default function AsyncPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Async"
      descripcion="async/await no es una forma distinta de manejar asincronismo: es la misma mecánica de Promises, con una sintaxis que se lee como código síncrono."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          El error de performance más común con async/await: awaits
          secuenciales para operaciones que son independientes entre sí.
          Medido con tiempo real, no simulado.
        </p>
        <SecuencialVsParaleloSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
