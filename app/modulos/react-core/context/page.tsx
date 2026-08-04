import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PropsArbolSimulador } from "@/components/modulo/PropsArbolSimulador";
import { ContextEnVivo } from "@/components/modulo/ContextEnVivo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosContext } from "@/lib/modules/react-core/context-escenarios";

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

export default function ContextPage() {
  return (
    <ModuloLayout
      categoriaTitulo="React Core"
      titulo="Context"
      descripcion="Context resuelve el prop drilling que veníamos arrastrando desde Props: un valor disponible para cualquier descendiente, sin que los componentes del medio tengan que saber que existe."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
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
        <p className="mb-4 text-sm text-muted-foreground">
          Context real de React, no una simulación. Cambiá el tema y
          mirá cómo el botón, tres niveles adentro, se actualiza sin que
          ningún componente intermedio reciba ese dato como prop.
        </p>
        <ContextEnVivo />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
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

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
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
    </ModuloLayout>
  );
}
