import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ComponentesSimulador } from "@/components/modulo/ComponentesSimulador";
import { ConstructorDeUI } from "@/components/modulo/ConstructorDeUI";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { pasosArbolComponentes } from "@/lib/modules/react-core/arbol";

export const metadata: Metadata = {
  title: "Componentes — Frontend Study Lab",
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

export default function ComponentesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Componentes"
      descripcion="Un componente es una función que recibe datos (props) y devuelve una descripción de UI. Componer funciones chicas es cómo se arma cualquier interfaz en React."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Activá o desactivá secciones y cambiá cuántos ProductCard se
          renderizan — el árbol se recalcula en vivo con el mismo código
          de componente reutilizado.
        </p>
        <ConstructorDeUI />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
