import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ComponentesSimulador } from "@/components/modulo/ComponentesSimulador";
import { ConstructorDeUI } from "@/components/modulo/ConstructorDeUI";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { pasosArbolComponentes } from "@/lib/modules/react-core/arbol";
import { entrevistaComponentes } from "@/lib/modules/react-core/componentes-entrevista";

const preguntasPorNivel = {
  1: entrevistaComponentes.filter((p) => p.nivel === 1),
  2: entrevistaComponentes.filter((p) => p.nivel === 2),
  3: entrevistaComponentes.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Componentes — Dev Study Lab",
  description:
    "Un componente de React es una función que describe UI. Componer esas funciones es lo que arma toda la interfaz.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué un componente de React debe empezar con mayúscula?",
    opciones: [
      "Es solo una convención de estilo sin efecto real",
      "Para que JSX lo distinga de una etiqueta HTML nativa (minúscula = tag del DOM)",
      "Porque JavaScript lo exige para cualquier función",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "JSX usa la primera letra para decidir cómo tratar un tag: minúscula lo interpreta como elemento HTML nativo (<div>), mayúscula lo busca como un componente definido por vos (<Boton />).",
  },
  {
    pregunta: "¿En qué dirección fluyen los props en un árbol de componentes?",
    opciones: [
      "De hijo a padre",
      "De padre a hijo, en un solo sentido",
      "En cualquier dirección, según convenga",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los props son de solo lectura y viajan en una sola dirección: un padre se los pasa a un hijo. Un hijo nunca modifica los props de su padre directamente.",
  },
  {
    pregunta: "¿Qué problema genera definir un componente dentro del cuerpo de otro componente?",
    opciones: [
      "Ninguno, es una práctica común",
      "Se vuelve a crear en cada render del padre, así que React lo trata como un componente distinto cada vez y pierde su estado",
      "No se puede, da un error de sintaxis",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React identifica componentes por su referencia de función. Si la función se redefine en cada render, React ve un tipo 'nuevo' cada vez, desmonta la instancia anterior (perdiendo su estado) y monta una nueva.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cuándo conviene un input no controlado (con ref) en vez de controlado?",
    opciones: [
      "Nunca, siempre es mejor controlado",
      "Cuando no necesitás reaccionar a cada tecla, para evitar un re-render en cada cambio",
      "Solo funciona con componentes de clase",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "En formularios grandes, controlar cada campo genera renders innecesarios en cada tecla. Un input no controlado deja que el DOM maneje su propio valor y se lee con una ref solo cuando hace falta.",
  },
  {
    pregunta:
      "¿Qué problema resuelve el patrón compound components (Tabs/Tab)?",
    opciones: [
      "Mejora la performance de renderizado",
      "Evita una API con muchos props de coordinación, compartiendo estado implícito entre padre e hijos vía Context",
      "Permite usar componentes de clase junto a hooks",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "En vez de que el padre le pase explícitamente cada dato a cada hijo por props, comparten estado a través de Context — una API declarativa donde la relación es implícita pero clara por convención.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Un if renderiza <FormularioA/> o <FormularioB/> en la misma posición del árbol según una condición. Si la condición cambia, ¿qué pasa?",
    opciones: [
      "React actualiza el componente existente con los nuevos props",
      "React desmonta por completo la instancia anterior (perdiendo su estado) y monta una nueva del otro tipo",
      "React mantiene ambos montados y alterna cuál se muestra",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React decide reconciliar o reemplazar comparando el TIPO del elemento en cada posición. Si el tipo cambia, es un reemplazo completo, no una actualización incremental.",
  },
  {
    pregunta:
      "<Hijo onClick={() => algo()} /> envuelto en React.memo — ¿evita el re-render de Hijo cuando Padre renderiza de nuevo?",
    opciones: [
      "Sí, siempre, porque memo compara profundamente las props",
      "No: la función inline es una referencia nueva en cada render de Padre, y memo hace comparación superficial",
      "Solo si Hijo no usa la prop onClick internamente",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Para que memo funcione ahí, la función necesita una referencia estable con useCallback, o pasarse desde afuera del componente si es verdaderamente constante.",
  },
];

export default function ComponentesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Componentes"
      descripcion="Un componente es una función que recibe datos (props) y devuelve una descripción de UI. Componer funciones chicas es cómo se arma cualquier interfaz en React."
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
            Un componente de React es, en esencia, una función de
            JavaScript que retorna JSX — una descripción de qué UI
            mostrar, no el DOM en sí. React llama a esa función y usa lo
            que retorna para construir un{" "}
            <strong className="text-foreground">árbol de componentes</strong>
            , donde cada nodo puede ser una etiqueta nativa (
            <code>&lt;div&gt;</code>) o otro componente propio (
            <code>&lt;ProductCard /&gt;</code>).
          </p>
          <p>
            Los datos entran a un componente a través de sus{" "}
            <strong className="text-foreground">props</strong> — un objeto
            que el padre le pasa al hijo. Los props son de solo lectura y
            fluyen en una sola dirección: de arriba hacia abajo en el
            árbol. Un componente nunca modifica los props que recibió.
          </p>
          <p>
            La ventaja real de pensar en componentes es la{" "}
            <strong className="text-foreground">reutilización</strong>: el
            mismo <code>ProductCard</code> se puede usar N veces con
            props distintos, en vez de repetir el mismo JSX copiado y
            pegado con pequeños cambios.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ComponentesSimulador pasos={pasosArbolComponentes} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Activá o desactivá secciones y cambiá cuántos ProductCard se
          renderizan — el árbol se recalcula en vivo con el mismo código
          de componente reutilizado.
        </p>
        <ConstructorDeUI />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Definir un componente dentro de otro componente.
            </strong>{" "}
            Se recrea en cada render del padre, perdiendo el estado
            interno y generando renders innecesarios.
          </li>
          <li>
            <strong className="text-foreground">
              Intentar mutar props directamente.
            </strong>{" "}
            Son de solo lectura. Si un hijo necesita cambiar algo, el
            padre le tiene que pasar una función para eso (callback), no
            dejar que el hijo modifique el objeto de props.
          </li>
          <li>
            <strong className="text-foreground">
              Retornar múltiples elementos raíz sin envolverlos.
            </strong>{" "}
            Un componente tiene que retornar un único nodo — usá un
            Fragment (<code>&lt;&gt;...&lt;/&gt;</code>) si no querés
            agregar un <code>&lt;div&gt;</code> extra.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Extraer un componente reutilizable en cuanto ves el mismo JSX
            repetido con datos distintos.
          </li>
          <li>
            Componer UIs complejas a partir de piezas chicas, testeables y
            entendibles por separado.
          </li>
          <li>
            Parametrizar variantes de un mismo componente con props (ej:{" "}
            <code>&lt;Boton variante=&quot;primario&quot; /&gt;</code>).
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
            Cada vez que escribís una letra en este input, pierde el foco
            después de cada tecla. ¿Por qué, y cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Formulario() {
  const [texto, setTexto] = useState('');

  function CampoTexto() {
    return <input value={texto} onChange={(e) => setTexto(e.target.value)} />;
  }

  return (
    <div>
      <CampoTexto />
    </div>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>CampoTexto</code> se define de nuevo cada vez que{" "}
              <code>Formulario</code> renderiza. React identifica
              componentes por su referencia de función, así que en cada
              tecla ve un componente &ldquo;distinto&rdquo; (aunque haga
              lo mismo), desmonta el <code>&lt;input&gt;</code> anterior y
              monta uno nuevo — por eso pierde el foco.
            </p>
            <p className="mt-2">El fix es mover CampoTexto afuera de Formulario, pasándole lo que necesita como props:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function CampoTexto({ texto, onCambiar }) {
  return <input value={texto} onChange={onCambiar} />;
}

function Formulario() {
  const [texto, setTexto] = useState('');

  return (
    <div>
      <CampoTexto texto={texto} onCambiar={(e) => setTexto(e.target.value)} />
    </div>
  );
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
            Un input <strong className="text-foreground">controlado</strong>{" "}
            (el valor vive en <code>useState</code> y se actualiza en cada{" "}
            <code>onChange</code>) tiene sentido cuando necesitás
            reaccionar a cada cambio en tiempo real: validación inline,
            formatear el valor mientras se escribe. Uno{" "}
            <strong className="text-foreground">no controlado</strong> (el
            DOM maneja su propio valor, leído con una ref cuando hace
            falta) evita un re-render de React en cada tecla — relevante
            en formularios grandes.
          </p>
          <p>
            El patrón{" "}
            <strong className="text-foreground">
              compound components
            </strong>{" "}
            (<code>Tabs</code>/<code>Tab</code>, <code>Select</code>/
            <code>Option</code>) hace que varios componentes relacionados
            compartan estado implícito vía Context, en vez de que el padre
            le pase explícitamente cada dato a cada hijo por props —
            reemplaza una API con muchos props de coordinación por
            composición declarativa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Descomponer en demasiados subcomponentes muy chicos, demasiado pronto.
            </strong>{" "}
            Agrega indirección y a menudo reintroduce el prop drilling que
            se quería evitar.
          </li>
          <li>
            <strong className="text-foreground">
              Controlar todos los campos de un formulario grande sin
              necesidad.
            </strong>{" "}
            Genera renders innecesarios del árbol completo en cada tecla
            cuando no hace falta reaccionar por campo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Compound components para una API de Tabs o Select más
            declarativa, sin exponer props de coordinación al consumidor.
          </li>
          <li>
            Inputs no controlados con ref + FormData para formularios
            simples que solo necesitan el valor al enviar.
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
            Si dos ramas de un if renderizan componentes DISTINTOS en la
            misma posición del árbol, React no actualiza el existente: lo{" "}
            <strong className="text-foreground">desmonta por completo</strong>{" "}
            (perdiendo su estado interno) y monta una instancia nueva del
            otro tipo. React decide reconciliar o reemplazar comparando el
            tipo del elemento en cada posición, no la intención semántica
            del código.
          </p>
          <p>
            <code>React.memo</code> hace una comparación superficial de
            props. Una prop objeto, array o función creada inline en el
            JSX del padre es una referencia NUEVA en cada render, aunque
            su contenido sea idéntico — memo no evita el re-render en ese
            caso. Hace falta estabilizar esas referencias con{" "}
            <code>useMemo</code>/<code>useCallback</code> para que memo
            funcione de verdad.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar que React preserve el estado al cambiar de tipo de
              componente en la misma posición.
            </strong>{" "}
            Cambiar el tipo siempre implica desmontar y montar de nuevo,
            sin importar cuán similares sean los dos componentes.
          </li>
          <li>
            <strong className="text-foreground">
              Envolver un componente en React.memo sin estabilizar las
              props que le pasan.
            </strong>{" "}
            Si el padre sigue creando objetos/funciones inline, memo no
            aporta nada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar una key explícita para forzar el reseteo de un componente
            (por ejemplo, un formulario al cambiar de entidad editada) en
            vez de manejarlo con efectos.
          </li>
          <li>
            Auditar props inline en componentes envueltos en memo como
            primer paso al diagnosticar re-renders innecesarios.
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
