import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { BundleSizeSimulador } from "@/components/modulo/BundleSizeSimulador";
import { entrevistaBundleSize } from "@/lib/modules/performance/bundle-size-entrevista";

const preguntasPorNivel = {
  1: entrevistaBundleSize.filter((p) => p.nivel === 1),
  2: entrevistaBundleSize.filter((p) => p.nivel === 2),
  3: entrevistaBundleSize.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Bundle Size — Dev Study Lab",
  description:
    "Cuánto JavaScript mandás al navegador, por qué cuesta más de lo que pesa, y cómo medirlo, reducirlo y evitar que vuelva a crecer.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Por qué 200 KB de JavaScript son más caros que 200 KB de una imagen?",
    opciones: [
      "Porque el JS, además de descargarse, se parsea y ejecuta en el hilo principal",
      "Porque el JS no se puede comprimir tanto como una imagen y viaja más pesado",
      "Porque el JS se descarga de a un archivo por vez, y las imágenes en paralelo",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La imagen se decodifica fuera del hilo principal; el JS compite con la interacción del usuario mientras se procesa.",
  },
  {
    pregunta: "¿Qué tamaño refleja mejor el costo de CPU de un bundle?",
    opciones: [
      "El tamaño comprimido con gzip o Brotli, que es lo que viaja por la red",
      "El tamaño sin comprimir, que es lo que el navegador parsea y ejecuta",
      "El tamaño minificado, antes de comprimir y después de quitar espacios",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "gzip mide la transferencia. El trabajo de parseo y ejecución se hace sobre el código ya descomprimido, que suele pesar 3-4 veces más.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué requisito técnico tiene el tree-shaking?",
    opciones: [
      "Que el código esté minificado antes de pasar por el bundler",
      "Que cada función exportada esté en un archivo propio",
      "Que los módulos sean ES modules, analizables estáticamente",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "require() de CommonJS es dinámico: el bundler no puede probar qué se usa, así que conserva todo.",
  },
  {
    pregunta:
      "Tu equipo agrega ~5 KB de JS por PR y en un año el bundle se duplicó. ¿Qué lo hubiera evitado?",
    opciones: [
      "Un performance budget chequeado en CI que marque cada PR que lo supere",
      "Minificar más agresivo en producción, con opciones extra de terser",
      "Revisar el bundle con un analizador una vez por trimestre",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El crecimiento gradual no se nota PR a PR; solo un límite automático lo convierte en una decisión explícita.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "Marcaste tu paquete con sideEffects: false y en producción desaparecieron los estilos. ¿Por qué?",
    opciones: [
      "Porque sideEffects: false desactiva el loader de CSS en todo el paquete",
      "Porque el import del CSS no exporta nada y el bundler lo eliminó",
      "Porque los estilos solo se cargan si algún componente los usa en runtime",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los imports que existen solo por su efecto (CSS, polyfills, registros globales) hay que listarlos en sideEffects.",
  },
  {
    pregunta:
      "¿Qué problema, además del peso, causa tener dos copias de React en el bundle?",
    opciones: [
      "Que las dos copias renderizan en paralelo y duplican cada mutación del DOM",
      "Que el hydration falla porque el servidor usa una copia y el cliente otra",
      "Que los hooks de una copia no ven el estado ni el contexto de la otra",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Las librerías con estado global a nivel de módulo asumen que existe una sola instancia.",
  },
];

export default function BundleSizePage() {
  return (
    <ModuloLayout
      categoriaTitulo="Performance"
      titulo="Bundle Size"
      descripcion="Cuánto JavaScript mandás al navegador, por qué cuesta más de lo que pesa, y cómo medirlo, reducirlo y evitar que vuelva a crecer."
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
            El bundle es el JavaScript que el navegador tiene que descargar
            para que la página funcione. Su costo tiene dos partes: la{" "}
            <strong className="text-foreground">transferencia</strong>{" "}
            (medida en KB comprimidos con gzip o brotli) y el{" "}
            <strong className="text-foreground">procesamiento</strong>:
            parsear, compilar y ejecutar el código descomprimido en el hilo
            principal. Mientras pasa eso, la página no responde a clicks ni a
            teclas.
          </p>
          <p>
            La segunda parte es la que se subestima. En un celular de gama
            media, el mismo JavaScript puede tardar varias veces más en
            procesarse que en la notebook del equipo. Por eso el tamaño del
            bundle impacta directamente en cuánto tarda la página en ser
            interactiva.
          </p>
          <p>
            Antes de optimizar hay que medir: la salida del build muestra el
            peso por ruta, y un analizador de bundle (treemap) muestra qué
            dependencia ocupa cuánto.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <BundleSizeSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Mirar solo el tamaño gzip.
            </strong>{" "}
            Es lo que viaja por la red, pero el navegador procesa el código
            descomprimido.
          </li>
          <li>
            <strong className="text-foreground">
              Instalar una dependencia sin mirar cuánto pesa.
            </strong>{" "}
            Una librería de fechas o de utilidades puede sumar más que todo el
            código propio de la app.
          </li>
          <li>
            <strong className="text-foreground">
              Probar el rendimiento solo en la máquina de desarrollo.
            </strong>{" "}
            El usuario típico tiene un dispositivo bastante más lento.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Una landing que tarda en responder en mobile: el analizador
            muestra que una librería de gráficos usada solo en el dashboard
            está en el chunk compartido.
          </li>
          <li>
            Elegir entre dos librerías equivalentes comparando su costo en
            bundlephobia antes de instalar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
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
            El <strong className="text-foreground">tree-shaking</strong>{" "}
            elimina los exports que nadie importa. Funciona solo si el
            bundler puede analizar estáticamente qué se usa, lo que exige ES
            modules: con CommonJS (<code>require</code>) conserva todo por
            seguridad. También falla si importás el objeto entero de una
            librería en vez de exports nombrados, o si no puede probar que un
            módulo no tiene side effects al importarse.
          </p>
          <p>
            Las tres palancas principales son las del playground: importar
            solo lo que usás (tree-shaking), reemplazar dependencias pesadas
            por alternativas modulares, y sacar del chunk inicial lo que solo
            usa una ruta o una interacción (import dinámico).
          </p>
          <p>
            Optimizar una vez no alcanza: sin un{" "}
            <strong className="text-foreground">performance budget</strong>{" "}
            chequeado en CI (por ejemplo con size-limit), el bundle vuelve a
            crecer de a pocos KB por PR sin que nadie lo decida.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Barrel files que re-exportan todo.
            </strong>{" "}
            Importar un componente desde <code>index.ts</code> puede arrastrar
            todos los módulos que re-exporta.
          </li>
          <li>
            <strong className="text-foreground">
              Optimizar sin un límite que lo sostenga.
            </strong>{" "}
            El trabajo se pierde en pocos meses si no hay un chequeo
            automático.
          </li>
          <li>
            <strong className="text-foreground">
              Reescribir una librería a mano para ahorrar KB.
            </strong>{" "}
            Muchas veces se cambia peso por bugs y mantenimiento; primero
            buscar una alternativa modular.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Configurar size-limit en CI para que cada PR muestre cuánto suma
            o resta al bundle.
          </li>
          <li>
            Usar <code>optimizePackageImports</code> en Next.js para librerías
            de íconos o componentes que exponen un barrel.
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
            Hay fuentes de peso que no se ven en el código propio.{" "}
            <strong className="text-foreground">
              Dependencias duplicadas
            </strong>
            : si dos paquetes piden versiones incompatibles de una misma
            librería, se instalan y empaquetan ambas. Con librerías que
            guardan estado a nivel de módulo, como React, además de pesar
            rompe en runtime.
          </p>
          <p>
            El <strong className="text-foreground">target de transpilación</strong>{" "}
            (browserslist) define cuánta sintaxis moderna se reescribe y
            cuántos polyfills se agregan. Ese código lo descargan todos los
            usuarios, aunque la mayoría use navegadores que no lo necesitan.
            La decisión tiene que salir de los datos reales de analytics.
          </p>
          <p>
            <code>sideEffects: false</code> habilita un tree-shaking más
            agresivo, pero si es falso elimina imports que existían solo por
            su efecto, como CSS o registros globales. El bug aparece solo en
            producción.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Forzar una versión única con overrides sin testear.
            </strong>{" "}
            Estás rompiendo el contrato de versión que declaró la librería.
          </li>
          <li>
            <strong className="text-foreground">
              Mantener un target de navegadores viejo por inercia.
            </strong>{" "}
            Pagás polyfills y sintaxis transpilada para usuarios que ya no
            existen.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Detectar con <code>npm ls date-fns</code> que una librería de
            componentes arrastra una versión vieja duplicada.
          </li>
          <li>
            Publicar una librería interna con <code>sideEffects</code> bien
            configurado para que las apps que la consumen puedan hacer
            tree-shaking.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>
            Esta app usa una sola función de la librería de íconos, pero el
            analizador muestra que se empaquetaron los 1.500 íconos. La
            librería es ESM. ¿Por qué no funcionó el tree-shaking?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// iconos/index.js (el barrel de la librería)
import './registrar-estilos-globales.js';
export * from './flecha.js';
export * from './casa.js';
// ...1.500 exports más

// package.json de la librería: no declara "sideEffects"

// app
import { Flecha } from 'iconos';`}
          </pre>
          <RevelarSolucion>
            <p>
              El barrel ejecuta <code>registrar-estilos-globales.js</code> al
              importarse, y como el paquete no declara{" "}
              <code>sideEffects</code>, el bundler tiene que asumir que
              cualquiera de los módulos re-exportados puede tener efectos al
              evaluarse. Por seguridad los conserva a todos. El fix, del lado
              de la librería, es declarar{" "}
              <code>
                &quot;sideEffects&quot;: [&quot;./registrar-estilos-globales.js&quot;]
              </code>{" "}
              para que el resto se pueda descartar. Del lado de la app, importar
              desde el archivo concreto (<code>iconos/flecha</code>) o usar{" "}
              <code>optimizePackageImports</code> en Next.js.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
