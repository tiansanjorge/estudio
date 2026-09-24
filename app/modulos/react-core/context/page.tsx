import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PropsArbolSimulador } from "@/components/modulo/PropsArbolSimulador";
import { ContextEnVivo } from "@/components/modulo/ContextEnVivo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { escenariosContext } from "@/lib/modules/react-core/context-escenarios";
import { entrevistaContext } from "@/lib/modules/react-core/context-entrevista";

const preguntasPorNivel = {
  1: entrevistaContext.filter((p) => p.nivel === 1),
  2: entrevistaContext.filter((p) => p.nivel === 2),
  3: entrevistaContext.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Context — Dev Study Lab",
  description:
    "Context distribuye un valor a cualquier descendiente sin pasarlo por props en cada nivel intermedio — con sus propios trade-offs de performance.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué problema resuelve principalmente Context?",
    opciones: [
      "Hacer que los componentes rendericen más rápido",
      "Evitar pasar un dato por props manualmente a través de cada componente intermedio hasta llegar al que realmente lo necesita",
      "Reemplazar useState en todos los casos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Context deja que un componente profundo lea un valor directamente, sin que los componentes intermedios tengan que recibirlo y reenviarlo como prop.",
  },
  {
    pregunta: "¿Qué reciben los componentes intermedios que no usan useContext?",
    opciones: [
      "El valor del Context igual, por si lo necesitan después",
      "Nada relacionado al Context — ni siquiera saben que existe",
      "Una versión de solo lectura del valor",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los componentes que no llaman a useContext ni se enteran de que el dato existe. Solo los que explícitamente lo consumen quedan acoplados a ese Context.",
  },
  {
    pregunta:
      "¿Qué problema de performance puede generar pasar un objeto literal nuevo como value del Provider en cada render?",
    opciones: [
      "Ninguno, React lo optimiza automáticamente",
      "Todos los consumidores de ese Context re-renderizan en cada render del Provider, aunque los datos no hayan cambiado realmente",
      "El Context deja de funcionar",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "React compara el value por referencia. Un objeto literal ({...}) se crea de cero en cada render, así que 'cambia' aunque su contenido sea igual — disparando re-renders en cascada de todos los consumidores.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué conviene dividir un Context grande en varios más chicos según frecuencia de cambio?",
    opciones: [
      "Por una cuestión de organización de archivos únicamente",
      "Porque cualquier cambio en el value re-renderiza a TODOS los consumidores del Context, sin importar qué parte usen — dividirlo limita el radio de impacto",
      "Porque React solo permite un Context por árbol",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si un dato que cambia seguido (notificaciones) comparte Context con uno que cambia poco (usuario), cualquier cambio en el primero re-renderiza también a los consumidores del segundo.",
  },
  {
    pregunta:
      "¿Qué limitación tiene Context frente a Zustand/Redux en cuanto a re-renders selectivos?",
    opciones: [
      "Ninguna, son equivalentes en este aspecto",
      "Context no soporta suscripción parcial: cualquier cambio en el value re-renderiza a todos los consumidores, sin selectors por porción de estado",
      "Context es más rápido en todos los casos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Librerías con selectors permiten que cada componente se suscriba solo a la porción de estado que le importa. Context no tiene ese mecanismo incorporado.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Un componente envuelto en React.memo que usa useContext — ¿evita re-renderizar cuando cambia ese Context?",
    opciones: [
      "Sí, memo bloquea cualquier causa de re-render",
      "No: la suscripción de useContext es independiente de las props, memo no puede interceptar ni comparar el valor del Context",
      "Solo si el Context también está envuelto en memo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "memo compara props, no el valor de un Context consumido internamente. La única forma de reducir el impacto es dividir el Context o aislar el useContext en un hijo más chico.",
  },
  {
    pregunta:
      "¿Cuándo se usa el valor por defecto pasado a createContext(valorDefault)?",
    opciones: [
      "Como valor inicial dentro de cualquier Provider, hasta que se actualice",
      "Solo cuando no existe ningún Provider de ese Context por encima del componente que llama a useContext",
      "Nunca se usa si el Provider ya está definido en algún lugar de la app",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "En cuanto hay un Provider por encima, su value (aunque sea undefined) es lo que reciben los consumidores, sin ninguna influencia del default declarado en createContext.",
  },
];

export default function ContextPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Context"
      descripcion="Context resuelve el prop drilling que veníamos arrastrando desde Props: un valor disponible para cualquier descendiente, sin que los componentes del medio tengan que saber que existe."
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
            <code>createContext()</code> crea un canal. Un{" "}
            <code>{"<MiContext.Provider value={...}>"}</code> en algún
            punto del árbol define qué valor viaja por ese canal para
            todos sus descendientes. Cualquier componente hijo, sin
            importar qué tan profundo esté, puede leerlo con{" "}
            <code>useContext(MiContext)</code> — sin que nadie en el
            medio tenga que recibirlo ni reenviarlo como prop.
          </p>
          <p>
            Esto es exactamente lo que veníamos evitando &ldquo;a
            mano&rdquo; con <code>children</code> en el módulo de
            Composition: ahí funcionaba para layouts que envuelven
            contenido. Context resuelve el caso más general, cuando el
            dato lo necesitan varios componentes en ramas distintas del
            árbol, no solo uno que envuelve a otro.
          </p>
          <p>
            El costo: cuando el <code>value</code> del Provider cambia,{" "}
            <strong className="text-foreground">
              todos los componentes que consumen ese Context re-renderizan
            </strong>{" "}
            — aunque solo les importe una parte del valor. Por eso Context
            es ideal para datos que cambian poco (tema, usuario, idioma),
            no para estado que se actualiza todo el tiempo.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <PropsArbolSimulador escenarios={escenariosContext} />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-base text-muted-foreground">
          Context real de React, no una simulación. Cambiá el tema y
          mirá cómo el botón, tres niveles adentro, se actualiza sin que
          ningún componente intermedio reciba ese dato como prop.
        </p>
        <ContextEnVivo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar Context para todo el estado de la app.
            </strong>{" "}
            Mezclar datos que cambian todo el tiempo (por ejemplo, texto
            de un input) con Context genera re-renders innecesarios en
            cascada por todos los consumidores.
          </li>
          <li>
            <strong className="text-foreground">
              Pasar un objeto literal como value sin memoizarlo.
            </strong>{" "}
            <code>{"<Provider value={{ usuario, tema }}>"}</code> crea un
            objeto nuevo en cada render del Provider — todos los
            consumidores re-renderizan aunque nada haya cambiado
            realmente. Se resuelve con <code>useMemo</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que Context reemplaza a una librería de manejo de estado.
            </strong>{" "}
            Context distribuye un valor; no trae herramientas para
            actualizaciones optimizadas, selectors, ni evitar renders
            selectivos como sí lo hacen Zustand o Redux Toolkit.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Tema visual (claro/oscuro), como en el Playground de este
            módulo.
          </li>
          <li>
            Usuario autenticado / sesión, accesible desde cualquier
            componente sin pasarlo por props.
          </li>
          <li>
            Idioma o configuración de i18n.
          </li>
          <li>
            Coordinar piezas de un compound component (como{" "}
            <code>{"<Tabs><Tabs.Tab /></Tabs>"}</code>) para que se
            comuniquen entre sí sin que quien las usa tenga que pasarles
            props manualmente.
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
            Cada componente que usa este Context re-renderiza en CADA
            render de App, aunque el usuario y el tema no hayan cambiado.
            ¿Por qué, y cómo lo arreglarías?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Ana' });
  const [tema, setTema] = useState('claro');

  return (
    <AppContext.Provider value={{ usuario, tema, setTema }}>
      <Contenido />
    </AppContext.Provider>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              <code>{"{ usuario, tema, setTema }"}</code> es un objeto
              literal: se crea de cero en cada render de{" "}
              <code>App</code>. React compara el value del Provider por
              referencia, así que ese objeto &ldquo;cambió&rdquo; en cada
              render (aunque su contenido sea igual), disparando
              re-renders en todos los consumidores.
            </p>
            <p className="mt-2">El fix es memoizar ese objeto con useMemo, para que solo cambie de referencia cuando sus dependencias realmente cambian:</p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted-foreground">
{`function App() {
  const [usuario, setUsuario] = useState({ nombre: 'Ana' });
  const [tema, setTema] = useState('claro');

  const value = useMemo(
    () => ({ usuario, tema, setTema }),
    [usuario, tema],
  );

  return (
    <AppContext.Provider value={value}>
      <Contenido />
    </AppContext.Provider>
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
            Cuando el <code>value</code> de un Provider cambia, TODOS sus
            consumidores re-renderizan, sin importar qué parte del valor
            usen. Si un Context grande mezcla datos que cambian poco
            (usuario) con datos que cambian seguido (notificaciones), un
            cambio en cualquiera de los dos re-renderiza a todos los
            consumidores — dividir en Contexts más chicos, separados por
            frecuencia de cambio, limita ese radio de impacto.
          </p>
          <p>
            Context nativo no soporta{" "}
            <strong className="text-foreground">
              suscripción parcial
            </strong>{" "}
            al valor: cualquier cambio re-renderiza a todos, aunque un
            consumidor puntual solo lea una propiedad que no cambió.
            Librerías como Zustand o Redux con selectors sí permiten que
            cada componente se suscriba solo a la porción de estado que
            le importa.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Un solo Context gigante para toda la app.
            </strong>{" "}
            Cualquier cambio, sin importar cuán pequeño, re-renderiza a
            todos los consumidores de toda la aplicación.
          </li>
          <li>
            <strong className="text-foreground">
              Anidar muchos Providers directamente en el árbol principal.
            </strong>{" "}
            Genera &quot;provider hell&quot; — conviene centralizarlos en
            un componente compositor.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Separar UsuarioContext (cambia poco) de
            NotificacionesContext (cambia seguido) en vez de un solo
            AppContext.
          </li>
          <li>
            Un componente AppProviders que centraliza el anidamiento de
            varios Providers, manteniendo el árbol principal limpio.
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
            <code>React.memo</code> no puede evitar que un componente
            re-renderice cuando cambia un Context que consume: la
            suscripción de <code>useContext</code> es independiente de
            las props, y memo no tiene forma de interceptar ni comparar
            el valor del Context. La única forma de reducir ese impacto
            es dividir el Context o aislar el <code>useContext</code> en
            un componente hijo más chico.
          </p>
          <p>
            Librerías como Zustand evitan el problema de &quot;todo
            consumidor re-renderiza&quot; usando{" "}
            <code>useSyncExternalStore</code> con un selector por
            componente: cada uno se suscribe solo a la porción de estado
            que le importa, y el store solo lo notifica si ESA porción
            cambió — un mecanismo de suscripción granular que Context no
            ofrece nativamente.
          </p>
          <p>
            El valor por defecto de <code>createContext(default)</code>{" "}
            solo se usa cuando NO existe ningún Provider por encima del
            componente que llama a <code>useContext</code>. En cuanto hay
            un Provider, su value (aunque sea <code>undefined</code>) es
            lo que reciben todos los consumidores, sin ninguna influencia
            del default.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Envolver en memo un componente que usa useContext esperando
              que eso lo proteja de re-renders del Context.
            </strong>{" "}
            memo no tiene efecto sobre cambios de Context, solo sobre
            props.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que el default de createContext aplica dentro de un
              Provider.
            </strong>{" "}
            El value real del Provider siempre gana, sin importar el
            default declarado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Aislar un useContext en un componente hijo chico para que el
            memo del padre no se vea afectado por cambios de ese Context.
          </li>
          <li>
            Usar el default de createContext como valor seguro para tests
            unitarios de componentes que se renderizan sin su Provider
            real.
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
