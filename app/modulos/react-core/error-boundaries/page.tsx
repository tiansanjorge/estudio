import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ErrorBoundaryDemo } from "@/components/modulo/ErrorBoundaryDemo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaErrorBoundaries } from "@/lib/modules/react-core/error-boundaries-entrevista";

const preguntasPorNivel = {
  1: entrevistaErrorBoundaries.filter((p) => p.nivel === 1),
  2: entrevistaErrorBoundaries.filter((p) => p.nivel === 2),
  3: entrevistaErrorBoundaries.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Error Boundaries — Dev Study Lab",
  description:
    "Un componente de React que captura errores en su árbol de descendientes y muestra un fallback en vez de tumbar toda la aplicación.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué tipo de componente puede ser un error boundary?",
    opciones: [
      "Cualquier componente de función con un try/catch",
      "Solo un componente de clase, con getDerivedStateFromError y/o componentDidCatch",
      "Un hook llamado useErrorBoundary",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "No existe un equivalente nativo con hooks. React no ofrece (todavía) una forma de implementar un error boundary con function components sin usar una clase por debajo.",
  },
  {
    pregunta: "¿Qué pasa si envolvés toda la app en un único error boundary en la raíz?",
    opciones: [
      "Es la mejor práctica recomendada siempre",
      "Un error en cualquier parte de la app tumba TODO lo que ese boundary envuelve, dejando a los usuarios sin poder usar nada",
      "No cambia nada respecto a no tener ningún boundary",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Conviene colocar boundaries más granulares alrededor de secciones independientes, para que el fallo de una parte no arrastre al resto de la app.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Un error dentro de un onClick es capturado por un error boundary que envuelve ese botón?",
    opciones: [
      "Sí, cualquier error del árbol es capturado",
      "No, los error boundaries solo cubren errores durante render y lifecycle, no dentro de event handlers",
      "Solo si el botón está en un componente de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un error dentro de un event handler necesita su propio try/catch. Tampoco se capturan errores en código asincrónico ni en el propio boundary.",
  },
  {
    pregunta:
      "¿Dónde conviene loguear un error capturado a un servicio externo como Sentry?",
    opciones: [
      "En getDerivedStateFromError",
      "En componentDidCatch, porque corre en la fase de commit, segura para efectos secundarios",
      "Da igual, ambos son equivalentes",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "getDerivedStateFromError corre en la fase de render, que React puede llamar múltiples veces o descartar — debe ser puro. componentDidCatch corre en commit, seguro para efectos secundarios.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿En qué se diferencia lo que captura Suspense de lo que captura un error boundary?",
    opciones: [
      "Son exactamente el mismo mecanismo con nombres distintos",
      "Suspense captura una Promise lanzada (señal de 'todavía no'), un error boundary captura errores reales (señal de 'esto se rompió')",
      "Suspense solo funciona en el servidor",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Ambos usan el mecanismo de lanzar algo durante el render, pero versionan situaciones distintas: espera vs falla real. Pueden convivir en el mismo árbol.",
  },
  {
    pregunta:
      "Si el fallback de un error boundary lanza un error al renderizarse, ¿quién lo captura?",
    opciones: [
      "El mismo boundary, en un segundo intento automático",
      "El error boundary ancestro más cercano, si existe; si no hay ninguno, la app entera se desmonta",
      "React lo ignora silenciosamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El boundary que falló no puede capturar su propio error de render. Por eso el fallback debe ser deliberadamente simple y robusto — es la última línea de defensa.",
  },
];

export default function ErrorBoundariesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Error Boundaries"
      descripcion="Un componente que captura errores en su árbol de descendientes y muestra un fallback, en vez de dejar que un bug en cualquier parte tumbe toda la aplicación."
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
            Un{" "}
            <strong className="text-foreground">error boundary</strong> es
            un componente (obligatoriamente de clase) que captura errores
            de JavaScript lanzados durante el render, en métodos de ciclo
            de vida, o en constructores de cualquier descendiente en su
            árbol. En vez de dejar que ese error tumbe toda la aplicación
            (la clásica pantalla en blanco), muestra una UI de fallback.
          </p>
          <p>
            Se implementa con el método estático{" "}
            <code>getDerivedStateFromError</code> (calcula el estado de
            fallback) y/o <code>componentDidCatch</code> (para efectos
            secundarios, como loguear el error). No existe un equivalente
            con hooks — solo un componente de clase puede ser error
            boundary.
          </p>
          <p>
            Envolver toda la app en un único boundary en la raíz no es
            suficiente: un error en cualquier parte tumba TODO lo que ese
            boundary envuelve. Conviene colocar boundaries más granulares
            alrededor de secciones independientes.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ErrorBoundaryDemo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar un hook useErrorBoundary nativo.
            </strong>{" "}
            No existe en React; hay que escribir la clase o usar una
            librería como react-error-boundary.
          </li>
          <li>
            <strong className="text-foreground">
              Un único boundary para toda la aplicación.
            </strong>{" "}
            Un bug en cualquier sección deja a los usuarios sin poder usar
            nada, incluidas las partes que funcionan bien.
          </li>
          <li>
            <strong className="text-foreground">
              Esperar que capture errores de un onClick.
            </strong>{" "}
            Los event handlers necesitan su propio try/catch — el
            boundary no los cubre.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver un widget de terceros o una sección riesgosa (un
            gráfico complejo, contenido user-generated) en su propio
            boundary, aislado del resto de la app.
          </li>
          <li>
            Un fallback con botón &quot;Reintentar&quot; que resetea el
            estado del boundary, sin recargar toda la página.
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
          <p>
            ¿Por qué este botón no activa el error boundary que lo
            envuelve?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`<ErrorBoundary>
  <button onClick={() => { throw new Error('falló'); }}>
    Click
  </button>
</ErrorBoundary>`}
          </pre>
          <RevelarSolucion>
            <p>
              Los error boundaries solo capturan errores durante el
              render, en métodos de ciclo de vida o en constructores — no
              dentro de event handlers. El <code>throw</code> dentro del{" "}
              <code>onClick</code> ocurre en respuesta a un evento del
              DOM, fuera del flujo de render de React.
            </p>
            <p className="mt-2">
              El fix es manejarlo con try/catch directamente en el
              handler:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`<button onClick={() => {
  try {
    throw new Error('falló');
  } catch (e) {
    manejarErrorManualmente(e);
  }
}}>
  Click
</button>`}
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
            Un error boundary NO captura errores dentro de event handlers,
            código asincrónico (setTimeout, promesas), server-side
            rendering, ni errores lanzados en el propio boundary — solo
            cubre el flujo síncrono de render y lifecycle de React.
          </p>
          <p>
            <code>getDerivedStateFromError</code> corre en la fase de{" "}
            <strong className="text-foreground">render</strong> (React
            puede llamarla múltiples veces o descartarla, debe ser pura,
            sin efectos secundarios). <code>componentDidCatch</code> corre
            en la fase de <strong className="text-foreground">
            commit</strong>, segura para efectos secundarios como enviar
            el error a un servicio de logging (Sentry).
          </p>
          <p>
            Para resetear el boundary sin recargar la página, se puede
            guardar una bandera en el estado y exponer un botón que la
            limpie, o cambiar la <code>key</code> del boundary para
            forzar un remount completo (útil al navegar a otra ruta).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Loguear efectos secundarios en getDerivedStateFromError.
            </strong>{" "}
            Puede correr varias veces o descartarse; el lugar correcto es
            componentDidCatch.
          </li>
          <li>
            <strong className="text-foreground">
              Un botón &quot;reintentar&quot; que no soluciona la causa
              real del error.
            </strong>{" "}
            Si el estado subyacente sigue roto, reintentar solo vuelve a
            disparar el mismo error.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Enviar error y stack a Sentry desde componentDidCatch, con
            contexto adicional (usuario, ruta) para diagnosticar más
            rápido.
          </li>
          <li>
            <code>{"<ErrorBoundary key={rutaActual}>"}</code> para que un
            error en una ruta no persista al navegar a otra.
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
            Suspense captura una Promise lanzada por un componente sin
            datos listos todavía — una señal de &quot;esperá&quot;, no un
            error. Un error boundary captura errores reales durante el
            render. Ambos usan el mismo mecanismo de fondo (lanzar algo
            durante el render y que un ancestro lo intercepte), pero
            versionan situaciones distintas, y pueden convivir en el mismo
            árbol: Suspense maneja la espera, un error boundary por fuera
            maneja el fallo real si la carga termina rechazando.
          </p>
          <p>
            Si el propio fallback de un error boundary lanza un error al
            renderizarse, ese error se propaga al boundary ANCESTRO más
            cercano — el boundary que falló no puede capturar su propio
            error de render. Sin ningún boundary más arriba, la app entera
            se desmonta. Por eso el fallback debe ser deliberadamente
            simple y robusto: es la última línea de defensa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Un fallback complejo que depende de datos que también
              podrían fallar.
            </strong>{" "}
            Si el fallback mismo lanza un error, sube al boundary
            ancestro o tumba la app si no hay ninguno.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir el propósito de Suspense con el de un error
              boundary.
            </strong>{" "}
            Uno es para esperar datos, el otro para manejar fallos reales
            — se necesitan ambos, no uno en reemplazo del otro.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Envolver un Suspense con un error boundary por fuera, para
            manejar tanto la carga (spinner) como el fallo real si la
            promesa que suspende termina rechazando.
          </li>
          <li>
            Diseñar fallbacks de error boundary con contenido estático,
            sin dependencias de datos que puedan estar en el mismo estado
            roto que causó el error original.
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
