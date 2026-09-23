import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { ReconciliationSimulador } from "@/components/modulo/ReconciliationSimulador";
import { ReconciliationEnVivo } from "@/components/modulo/ReconciliationEnVivo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosReconciliation } from "@/lib/modules/react-rendering/reconciliation-escenarios";
import { entrevistaReconciliation } from "@/lib/modules/react-rendering/reconciliation-entrevista";

const preguntasPorNivel = {
  1: entrevistaReconciliation.filter((p) => p.nivel === 1),
  2: entrevistaReconciliation.filter((p) => p.nivel === 2),
  3: entrevistaReconciliation.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Reconciliation — Dev Study Lab",
  description:
    "React decide qué reutilizar y qué destruir comparando tipos, posición y keys — no comparando el árbol entero elemento por elemento.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "Un componente <Boton color='blanco' /> pasa a renderizar <Boton color='negro' /> en la misma posición. ¿Qué hace React?",
    opciones: [
      "Destruye la instancia anterior y monta una nueva desde cero",
      "Reutiliza la misma instancia, solo actualiza la prop color",
      "Ignora el cambio de color",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Mismo tipo de componente en la misma posición: React reutiliza la instancia existente y actualiza las props que cambiaron. El estado interno sobrevive.",
  },
  {
    pregunta:
      "Un <BotonClaro /> pasa a renderizar <BotonOscuro /> en la misma posición. ¿Qué pasa con el estado interno de BotonClaro?",
    opciones: [
      "Se transfiere automáticamente a BotonOscuro",
      "Se pierde por completo: BotonOscuro arranca con estado inicial nuevo",
      "Queda 'congelado' hasta que se vuelva a mostrar BotonClaro",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Al ser tipos distintos, React da por hecho que producen árboles distintos: destruye toda la subrama de BotonClaro (con su estado) y monta BotonOscuro desde cero.",
  },
  {
    pregunta: "¿Por qué el algoritmo de reconciliation de React es heurístico en vez de comparar el árbol entero de forma exhaustiva?",
    opciones: [
      "Porque React es un framework simple que no necesita ser preciso",
      "Porque un diff exhaustivo de árboles es computacionalmente muy caro (cúbico); las heurísticas de tipo+posición+key lo resuelven en tiempo lineal",
      "Porque los navegadores no soportan comparaciones complejas",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Comparar dos árboles de forma exhaustiva es O(n³). React asume que elementos de distinto tipo producen árboles distintos y usa las keys para identidad en listas — con eso baja el costo a O(n), a cambio de estas reglas que hay que conocer.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿React reconcilia listas keyed con un único pase por key, o hay algo más sofisticado?",
    opciones: [
      "Solo un mapeo simple por key, siempre",
      "Primero escanea desde ambos extremos buscando prefijo/sufijo sin cambios; solo usa un mapa de keys para la sección del medio que realmente se reordenó",
      "Recorre el árbol completo comparando cada nodo contra todos los demás",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es una heurística en capas: resuelve gratis los casos de agregar/quitar al final o al principio, reservando el mapeo por key (más costoso) solo para reordenamientos genuinos.",
  },
  {
    pregunta:
      "Un componente renderiza a veces un elemento suelto y a veces un array en la misma posición. ¿Qué riesgo tiene esto?",
    opciones: [
      "Ninguno, React lo maneja de forma transparente",
      "React puede tratarlo como un cambio de tipo, generando destrucciones y remontajes innecesarios",
      "Solo funciona si ambos casos usan la misma key",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La práctica recomendada es ser consistente: envolver siempre en un array, aunque tenga un solo elemento, para que React reconcilie esa posición siempre como 'una lista'.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿React.Children.map trata a children siempre como un array plano y predecible?",
    opciones: [
      "Sí, children siempre es un array normal de JavaScript",
      "No: children es una estructura opaca (elemento único, array, Fragment, texto, null) y estas utilidades existen justamente para manejar esa variabilidad",
      "Solo es un array si el componente usa TypeScript",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Aun así tienen limitaciones (React.Children.only lanza excepción con más de un hijo). Componentes que necesitan manipular children de forma compleja suelen preferir un array explícito como prop.",
  },
  {
    pregunta:
      "En una lista de 100 items donde solo uno cambió sus props, ¿cómo se complementan reconciliation y React.memo?",
    opciones: [
      "Son la misma cosa, memo reemplaza a reconciliation",
      "Reconciliation resuelve que los 100 siguen siendo 'los mismos' por su key; memo evita que los 99 sin cambios de props vuelvan a ejecutar su función",
      "Reconciliation decide qué re-renderiza; memo decide qué se destruye",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Reconciliation determina identidad (misma key, mismo tipo). Memo, una vez resuelta esa identidad, decide si vale la pena re-ejecutar la función comparando props actuales contra las anteriores.",
  },
];

export default function ReconciliationPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Rendering"
      titulo="Reconciliation"
      descripcion="Reconciliation es el algoritmo que compara el árbol nuevo con el anterior para decidir qué reutilizar y qué destruir — la razón de fondo detrás de las reglas de Keys que ya vimos."
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
            Comparar dos árboles completos, elemento por elemento, de
            forma exhaustiva es carísimo computacionalmente. React lo
            evita con dos reglas heurísticas simples, aplicadas posición
            por posición en el árbol.
          </p>
          <p>
            Regla uno:{" "}
            <strong className="text-foreground">
              elementos del mismo tipo en la misma posición se consideran
              &ldquo;el mismo&rdquo;
            </strong>{" "}
            — React mantiene la instancia (y su estado interno), y solo
            actualiza las props que cambiaron. Regla dos:{" "}
            <strong className="text-foreground">
              elementos de tipo distinto en la misma posición se
              consideran árboles completamente distintos
            </strong>{" "}
            — React destruye la instancia vieja (con todo su estado) y
            monta una nueva desde cero, aunque visualmente el resultado
            se parezca.
          </p>
          <p>
            Esto es exactamente lo que ya vimos con las{" "}
            <strong className="text-foreground">keys</strong> en listas:
            la key es la forma de decirle a React &ldquo;este elemento es
            el mismo que antes&rdquo; cuando la posición en el array no
            alcanza para saberlo. Fuera de las listas, es el{" "}
            <em>tipo</em> del elemento el que cumple ese rol.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <ReconciliationSimulador escenarios={escenariosReconciliation} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ReconciliationEnVivo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Renderizar condicionalmente componentes distintos en la misma posición.
            </strong>{" "}
            <code>{"{condicion ? <FormularioA /> : <FormularioB />}"}</code>{" "}
            reinicia todo el estado interno cada vez que la condición
            cambia, aunque visualmente parezcan &ldquo;el mismo
            formulario&rdquo;.
          </li>
          <li>
            <strong className="text-foreground">
              No darse cuenta de que un ternario cambia el tipo de elemento raíz.
            </strong>{" "}
            <code>{"{cargando ? <div className='spinner' /> : <div className='contenido' />}"}</code>{" "}
            son ambos <code>div</code>, así que React SÍ reutiliza el
            nodo — puede arrastrar estilos o listeners que ya no
            corresponden si no se limpian explícitamente.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir esto con las keys de una lista.
            </strong>{" "}
            Son la misma idea (identidad estable entre renders) aplicada
            en dos contextos distintos: tipo para una posición fija,
            key para elementos dentro de una lista.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Usar una <code>key</code> distinta a propósito para FORZAR
            que React destruya y remonte un componente (reseteando su
            estado interno), sin necesidad de un useEffect manual.
          </li>
          <li>
            Extraer un componente único con una prop condicional en vez
            de dos componentes distintos renderizados
            condicionalmente, cuando el estado interno debería
            sobrevivir al cambio.
          </li>
          <li>
            Debuggear por qué un formulario &ldquo;pierde&rdquo; lo que el
            usuario tipeó al cambiar de paso — buscando si el paso
            anterior y el nuevo son técnicamente componentes distintos
            en la misma posición.
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
            Este wizard de dos pasos pierde lo que el usuario escribió en
            el paso 1 si vuelve atrás y adelante. ¿Por qué, y cómo lo
            arreglarías sin duplicar el estado afuera?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Wizard({ paso }) {
  if (paso === 1) {
    return <FormularioDatosPersonales />;
  }
  return <FormularioDatosEnvio />;
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>FormularioDatosPersonales</code> y{" "}
              <code>FormularioDatosEnvio</code> son componentes
              distintos en la misma posición. Cada vez que{" "}
              <code>paso</code> cambia, React destruye por completo el
              que estaba montado — con cualquier estado interno que
              tuviera — y monta el otro desde cero.
            </p>
            <p className="mt-2">
              En este caso puntual el problema no es que haga falta
              &ldquo;preservar&rdquo; el mismo componente (son
              formularios distintos, con campos distintos) — el fix real
              es que el estado de cada paso NO debería vivir dentro de
              cada formulario, sino en el componente padre (
              <code>Wizard</code>), pasado como props. Así sobrevive al
              cambio de paso sin importar qué componente esté montado en
              cada momento.
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
            React no reconcilia listas keyed con un mapa por key de forma
            uniforme: primero escanea desde ambos extremos de la lista
            vieja y la nueva, buscando un prefijo y un sufijo que
            coincidan sin cambios — esto resuelve gratis los casos de
            agregar o quitar al final o al principio. Solo para la
            sección del medio que realmente se reordenó, arma un mapa de
            keys a elementos para hacer el diff más fino.
          </p>
          <p>
            Si un componente renderiza a veces un elemento suelto y a
            veces un array en la misma posición, React puede tratarlo
            como un cambio de tipo, generando destrucciones innecesarias.
            La práctica recomendada es ser consistente: envolver siempre
            en un array, aunque tenga un solo elemento.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Asumir que cualquier reordenamiento de lista tiene el mismo
              costo.
            </strong>{" "}
            Agregar/quitar al final es prácticamente gratis; reordenar el
            medio de la lista cae al camino más costoso del algoritmo.
          </li>
          <li>
            <strong className="text-foreground">
              Alternar entre un elemento suelto y un array en la misma
              posición del árbol.
            </strong>{" "}
            Genera destrucciones y remontajes evitables.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Diseñar operaciones de UI que agreguen/quiten preferentemente
            al final de una lista, aprovechando el camino rápido del
            algoritmo cuando el orden de UX lo permite.
          </li>
          <li>
            Envolver siempre en array un valor que eventualmente podría
            tener más de un elemento, para mantener consistencia de tipo
            en esa posición del árbol.
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
            <code>children</code> es una estructura opaca: puede ser un
            único elemento, un array, un Fragment con más elementos
            adentro, texto, o <code>null</code>. Utilidades como{" "}
            <code>React.Children.map</code> existen para manejar esa
            variabilidad, pero tienen límites propios —{" "}
            <code>React.Children.only</code> lanza una excepción si
            recibe más de un hijo.
          </p>
          <p>
            Reconciliation (identidad por tipo+posición/key) y{" "}
            <code>React.memo</code> (bail-out de re-render) son
            mecanismos independientes que se complementan: reconciliation
            decide qué instancia reutilizar en cada posición; memo, una
            vez resuelta esa identidad, decide si vale la pena volver a
            ejecutar la función del componente comparando props actuales
            contra las anteriores.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Manipular children complejo asumiendo que es un array plano
              normal.
            </strong>{" "}
            Fragments anidados o children mixtos pueden dar resultados no
            intuitivos con las utilidades de React.Children.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir la identidad que da reconciliation con la
              decisión de re-renderizar que da memo.
            </strong>{" "}
            Son capas separadas: una decide &quot;es el mismo&quot;, la
            otra decide &quot;vale la pena recalcular&quot;.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Preferir un array explícito como prop en vez de children
            cuando un componente necesita reordenar o filtrar por tipo de
            forma compleja.
          </li>
          <li>
            Envolver items de una lista grande en React.memo para que
            reconciliation resuelva identidad por key, y memo evite
            recalcular los que no cambiaron props.
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
