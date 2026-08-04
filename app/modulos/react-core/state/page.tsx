import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { StateSimulador } from "@/components/modulo/StateSimulador";
import { ContadorBatching } from "@/components/modulo/ContadorBatching";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosState } from "@/lib/modules/react-core/state-escenarios";

export const metadata: Metadata = {
  title: "State — Frontend Study Lab",
  description:
    "El estado que actualizás con setState no cambia en el momento — programa un re-render. Esa asincronía explica casi todos los bugs de contadores en React.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "Justo después de llamar a setCuenta(cuenta + 1), ¿qué valor tiene la variable 'cuenta' en ESA misma ejecución de la función?",
    opciones: [
      "El valor nuevo, ya actualizado",
      "El valor viejo: sigue siendo el de la closure de este render",
      "undefined",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "setState no muta nada de forma síncrona. Programa un re-render; la variable local de esta ejecución sigue apuntando al valor que tenía cuando arrancó este render.",
  },
  {
    pregunta:
      "¿Por qué llamar tres veces a setCuenta(cuenta + 1) seguidas no suma 3, sino 1?",
    opciones: [
      "Porque React ignora llamadas repetidas",
      "Porque las tres usan el mismo valor de 'cuenta' capturado en la closure, así que las tres calculan lo mismo",
      "Porque hay un límite de un setState por evento",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las tres llamadas leen la misma variable 'cuenta' (no cambia durante la ejecución), así que las tres terminan pidiendo 'poné el estado en cuenta + 1' con el mismo valor.",
  },
  {
    pregunta: "¿Cuál es la forma correcta de acumular varias actualizaciones basadas en el valor anterior?",
    opciones: [
      "setCuenta(cuenta + 1) repetido",
      "setCuenta((c) => c + 1), pasando una función que recibe el valor más reciente",
      "Llamar a setCuenta dentro de un setTimeout",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La función updater recibe el valor pendiente más actualizado en el momento en que React la procesa, no el valor capturado en la closure del render.",
  },
];

export default function StatePage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="State"
      descripcion="Llamar al setter de useState no cambia una variable al instante: programa un re-render. Esa diferencia explica casi todos los bugs de 'el contador no suma lo que debería'."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            <code>useState</code> le da a un componente una variable que
            persiste entre renders, y una función para pedirle a React
            que la actualice. Cada render de un componente tiene su
            propia <strong className="text-foreground">closure</strong>{" "}
            con el valor de ese estado congelado en el momento en que
            corrió ese render — por eso a esa variable se la conoce como
            &ldquo;stale&rdquo; (vieja) una vez que pasó el tiempo.
          </p>
          <p>
            Llamar al setter (<code>setCuenta(...)</code>) no muta esa
            variable local ni fuerza un re-render inmediato: solo le dice
            a React &ldquo;el próximo render debería usar este valor&rdquo;.
            El resto del código que sigue ejecutándose en esa misma
            función todavía ve el valor viejo.
          </p>
          <p>
            Cuando necesitás calcular el nuevo estado a partir del{" "}
            <em>anterior</em> — sobre todo si vas a llamar al setter más
            de una vez seguida — hay que usar la forma funcional:{" "}
            <code>setCuenta((c) =&gt; c + 1)</code>. Esa función recibe
            el valor pendiente más reciente, no el de la closure, así
            que las actualizaciones se acumulan correctamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <StateSimulador escenarios={escenariosState} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Mismo botón, dos formas de sumar 3. Comprobalo con estado real
          de React, no una simulación.
        </p>
        <ContadorBatching />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Leer el estado inmediatamente después de actualizarlo, esperando el valor nuevo.
            </strong>{" "}
            La actualización es asincrónica respecto al resto de la
            función — el valor nuevo recién existe en el próximo render.
          </li>
          <li>
            <strong className="text-foreground">
              Encadenar setState(valor + 1) varias veces esperando que se sumen.
            </strong>{" "}
            Todas parten del mismo valor stale. Usar la forma funcional
            cuando dependés del valor anterior.
          </li>
          <li>
            <strong className="text-foreground">
              Mutar el estado directamente (ej: array.push()) en vez de crear uno nuevo.
            </strong>{" "}
            React compara referencias para decidir si re-renderizar; mutar
            el mismo objeto no dispara nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Contadores, toggles, formularios — cualquier dato que cambia
            por interacción del usuario y necesita disparar un re-render.
          </li>
          <li>
            Usar la forma funcional del setter en handlers que pueden
            dispararse varias veces rápido (doble click, teclas
            repetidas) para no perder actualizaciones.
          </li>
          <li>
            Derivar estado calculado en el render en vez de duplicarlo en
            otro useState — menos estado sincronizado, menos bugs.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Este botón de &ldquo;me gusta&rdquo; a veces no suma cuando se
            clickea rápido varias veces seguidas. ¿Por qué, y cómo lo
            arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function BotonMeGusta() {
  const [likes, setLikes] = useState(0);

  function manejarDobleClick() {
    setLikes(likes + 1);
    setLikes(likes + 1);
  }

  return <button onDoubleClick={manejarDobleClick}>{likes} likes</button>;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              Al hacer doble click, se espera sumar 2, pero solo suma 1.
              Las dos llamadas a <code>setLikes(likes + 1)</code> usan el
              mismo <code>likes</code> capturado en esta ejecución del
              handler — las dos calculan exactamente el mismo valor.
            </p>
            <p className="mt-2">El fix es usar la forma funcional, para que cada llamada parta del valor pendiente más reciente:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function manejarDobleClick() {
  setLikes((valorActual) => valorActual + 1);
  setLikes((valorActual) => valorActual + 1);
}`}
            </pre>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
