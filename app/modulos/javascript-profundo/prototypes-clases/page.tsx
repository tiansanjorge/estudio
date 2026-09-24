import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PrototypeChainResolver } from "@/components/modulo/PrototypeChainResolver";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaPrototypes } from "@/lib/modules/prototypes/entrevista";

const preguntasPorNivel = {
  1: entrevistaPrototypes.filter((p) => p.nivel === 1),
  2: entrevistaPrototypes.filter((p) => p.nivel === 2),
  3: entrevistaPrototypes.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Prototypes & Clases — Dev Study Lab",
  description:
    "class es azúcar sintáctico sobre el sistema de prototipos de JavaScript. Entender la cadena de prototipos es entender cómo funciona realmente la herencia.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace JS cuando accedés a una propiedad que un objeto no tiene como propia?",
    opciones: [
      "Devuelve undefined inmediatamente, sin buscar más",
      "Sube por la cadena de prototipos buscando en cada nivel, hasta encontrarla o llegar a null",
      "Lanza un error de inmediato",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Cada objeto tiene una referencia a su prototipo. El motor recorre esa cadena nivel por nivel, igual que la scope chain con variables, hasta encontrar la propiedad o llegar al final (null).",
  },
  {
    pregunta: "¿Los métodos definidos dentro de una class se duplican en cada instancia?",
    opciones: [
      "Sí, cada new Clase() crea su propia copia de los métodos",
      "No, se definen una sola vez en el prototype y todas las instancias los comparten por la cadena de prototipos",
      "Solo se duplican si la clase usa extends",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "class es azúcar sintáctico sobre prototypes: los métodos viven en Clase.prototype, compartidos por todas las instancias, a diferencia de una función asignada dentro del constructor.",
  },
  {
    pregunta: "¿Qué conecta extends entre Hijo y Padre?",
    opciones: [
      "Copia todos los métodos de Padre.prototype dentro de Hijo.prototype",
      "Hace que el prototipo de Hijo.prototype sea Padre.prototype, conectando ambos en la cadena",
      "No tiene relación con prototipos, es un mecanismo aparte",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "extends conecta Hijo.prototype como un objeto cuyo prototipo es Padre.prototype, así las instancias de Hijo encuentran por la cadena tanto sus propios métodos como los heredados.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "¿Cuándo se vuelve un problema usar herencia de clases (extends) para compartir código?",
    opciones: [
      "Nunca, la herencia siempre es la mejor opción para reusar código",
      "Cuando se usa entre cosas sin una relación 'es un' real: jerarquías profundas se vuelven frágiles ante cambios en la clase base",
      "Solo si la clase base no tiene constructor",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El 'fragile base class problem': modificar un método heredado puede romper silenciosamente a todos los descendientes. La composición suele ser más flexible para compartir comportamiento sin esa relación jerárquica real.",
  },
  {
    pregunta:
      "¿Qué ventaja tiene Object.create(null) sobre {} para un diccionario con claves externas?",
    opciones: [
      "Es más rápido de crear",
      "No hereda de Object.prototype, así que no hay riesgo de colisión con claves como 'toString' o 'constructor'",
      "Permite iterar las propiedades más rápido",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un objeto literal {} hereda métodos como toString o hasOwnProperty. Si una clave externa coincide con uno de esos nombres, puede generar bugs sutiles. Object.create(null) elimina esa clase de colisiones.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta:
      "¿De qué depende super.metodo() para saber en qué prototipo buscar hacia arriba?",
    opciones: [
      "De this, igual que cualquier acceso a propiedad",
      "De una referencia interna ([[HomeObject]]) fijada en el momento en que el método se definió, no de this",
      "Del prototipo del objeto global",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Por eso extraer un método con super y llamarlo con un this distinto (.call() sobre otro objeto) sigue resolviendo super desde el prototipo original donde se definió, no desde el de ese otro this.",
  },
  {
    pregunta:
      "Object.freeze(instancia) — ¿protege también las propiedades heredadas de su prototipo?",
    opciones: [
      "Sí, congela toda la cadena de prototipos automáticamente",
      "No, solo afecta las propiedades propias de esa instancia; el prototipo sigue siendo mutable salvo que también se congele",
      "Solo protege métodos, no propiedades de datos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es un error común asumir que congelar una instancia protege todo lo que expone. Solo protege lo que le pertenece directamente; lo heredado por prototype queda intacto y mutable.",
  },
];

export default function PrototypesClasesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Prototypes & Clases"
      descripcion="class es la sintaxis moderna, pero por debajo sigue siendo el mismo sistema de prototipos que JavaScript tuvo siempre. Entender la cadena es entender cómo funciona realmente la herencia."
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
            Cada objeto en JavaScript tiene una referencia interna a otro
            objeto: su{" "}
            <strong className="text-foreground">prototipo</strong> (
            <code>[[Prototype]]</code>, accesible con{" "}
            <code>Object.getPrototypeOf</code>). Cuando accedés a una
            propiedad que el objeto no tiene como propia, el motor sube por
            esa <strong className="text-foreground">cadena de prototipos</strong>
            , buscando en cada nivel, hasta encontrarla o llegar a{" "}
            <code>null</code> (el final de la cadena, típicamente después
            de <code>Object.prototype</code>).
          </p>
          <p>
            <code>class</code> es azúcar sintáctico sobre este mismo
            sistema. <code>extends</code> conecta{" "}
            <code>Hijo.prototype</code> como un objeto cuyo prototipo es{" "}
            <code>Padre.prototype</code>, así que las instancias de{" "}
            <code>Hijo</code> encuentran, por la cadena, tanto sus propios
            métodos como los heredados. Los métodos declarados en una
            clase viven <strong className="text-foreground">
            una sola vez</strong> en el prototype, compartidos por todas
            las instancias — no se duplican en cada <code>new</code>.
          </p>
          <p>
            El operador <code>new</code> hace tres cosas: crea un objeto
            nuevo, le setea el prototipo a{" "}
            <code>Constructor.prototype</code>, y ejecuta el constructor
            con <code>this</code> apuntando a ese objeto nuevo.{" "}
            <code>Object.create(proto)</code> permite crear un objeto con
            un prototipo específico directamente, sin pasar por un
            constructor.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <PrototypeChainResolver />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Modificar Array.prototype u Object.prototype directamente.
            </strong>{" "}
            Afecta a TODOS los objetos del programa, incluidos los de
            librerías de terceros — una fuente clásica de bugs
            impredecibles.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir __proto__ con .prototype.
            </strong>{" "}
            <code>__proto__</code> es la referencia real al prototipo de UN
            objeto (uso directo desaconsejado). <code>.prototype</code> es
            una propiedad de las funciones/clases, usada para construir el
            prototipo de las instancias que creen con <code>new</code>.
          </li>
          <li>
            <strong className="text-foreground">
              Usar &apos;in&apos; para chequear si una propiedad es propia.
            </strong>{" "}
            <code>in</code> recorre toda la cadena de prototipos.
            Para distinguir propiedad propia de heredada, usá{" "}
            <code>hasOwnProperty</code> o <code>Object.hasOwn</code>.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Herencia clásica con <code>class extends</code>, llamando a{" "}
            <code>super()</code> en el constructor para inicializar la
            parte heredada del padre.
          </li>
          <li>
            Mixins simples aplicando <code>Object.assign</code> al
            prototype para compartir métodos entre clases sin relación
            jerárquica directa.
          </li>
          <li>
            Polyfills que agregan métodos faltantes a un prototype
            built-in, siempre chequeando primero si el método ya existe.
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
            ¿Por qué agregar un método a Animal.prototype DESPUÉS de crear
            una instancia igual la hace disponible en esa instancia?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`class Animal {}

const perro = new Animal();

Animal.prototype.hacerRuido = function () {
  return 'algún sonido';
};

console.log(perro.hacerRuido());`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">&apos;algún sonido&apos;</strong>{" "}
              sin error.
            </p>
            <p className="mt-2">
              <code>perro</code> no tiene una copia de{" "}
              <code>hacerRuido</code> — solo tiene una referencia a{" "}
              <code>Animal.prototype</code>. Cuando se llama a{" "}
              <code>perro.hacerRuido()</code>, el motor busca en la
              instancia, no la encuentra, sube a{" "}
              <code>Animal.prototype</code> y la encuentra ahí — en el
              momento de la llamada, no en el momento de crear{" "}
              <code>perro</code>. Por eso agregar el método después sigue
              funcionando: la cadena se resuelve en cada acceso, no se
              &quot;copia&quot; al crear el objeto.
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
        <div className="flex flex-col gap-4 prosa">
          <p>
            Herencia (<code>extends</code>) modela una relación{" "}
            <strong className="text-foreground">&quot;es un&quot;</strong> y
            tiene sentido cuando existe una jerarquía natural y estable. Se
            vuelve un problema cuando se usa solo para compartir código
            entre cosas sin esa relación real: jerarquías profundas se
            vuelven frágiles ante cambios en la clase base (&quot;fragile
            base class problem&quot;), porque modificar un método heredado
            puede romper silenciosamente a todos los descendientes. La{" "}
            <strong className="text-foreground">composición</strong>{" "}
            (funciones factory, mixins vía <code>Object.assign</code>)
            modela &quot;tiene un&quot; y es más flexible entre objetos sin
            relación jerárquica.
          </p>
          <p>
            Un objeto literal <code>{"{}"}</code> hereda de{" "}
            <code>Object.prototype</code>, trayendo consigo métodos como{" "}
            <code>toString</code> o <code>hasOwnProperty</code>. Si se usa
            como diccionario con claves externas,{" "}
            <code>Object.create(null)</code> elimina esos métodos
            heredados y con ellos el riesgo de colisión con una clave que
            coincida con uno de esos nombres.
          </p>
          <p>
            Los motores optimizan el acceso a propiedades asumiendo que la
            &quot;forma&quot; de un objeto (sus propiedades y su
            prototipo) se mantiene estable después de creado. Cambiar el
            prototipo dinámicamente con{" "}
            <code>Object.setPrototypeOf</code> invalida esa suposición y
            des-optimiza el acceso a sus propiedades — mejor definir el
            prototipo en el momento de creación.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar extends para compartir código sin relación jerárquica
              real.
            </strong>{" "}
            Termina en jerarquías frágiles y difíciles de refactorizar.
          </li>
          <li>
            <strong className="text-foreground">
              Llamar Object.setPrototypeOf después de crear muchos objetos
              del mismo tipo.
            </strong>{" "}
            De-optimiza el acceso a propiedades para todos los que
            comparten esa forma.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Preferir composición (factory functions + Object.assign) para
            compartir comportamiento entre objetos no relacionados
            jerárquicamente.
          </li>
          <li>
            Usar Object.create(null) para un objeto que representa
            puramente datos externos (un mapa de traducciones, por
            ejemplo), evitando colisiones con métodos heredados.
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
            Las <strong className="text-foreground">hidden classes</strong>{" "}
            (shapes) son una estructura interna que usan motores como V8
            para optimizar el acceso a propiedades propias: dos objetos
            creados con las mismas propiedades en el mismo orden comparten
            la misma hidden class, permitiendo inline caching. Es distinto
            pero relacionado al prototype chain: la hidden class optimiza
            lo propio; el prototype chain es lo que se recorre cuando la
            propiedad NO es propia.
          </p>
          <p>
            <code>super.metodo()</code> no depende de <code>this</code>{" "}
            para saber dónde buscar hacia arriba: usa una referencia
            interna del método ([[HomeObject]]), fijada en el momento en
            que se definió. Por eso extraer un método con{" "}
            <code>super</code> y llamarlo con un <code>this</code> distinto
            sigue resolviendo desde el prototipo original de definición.
          </p>
          <p>
            <code>Object.freeze()</code> solo protege las propiedades{" "}
            <strong className="text-foreground">propias</strong> del
            objeto congelado. No toca su prototipo: si una propiedad se
            resuelve por herencia, ese prototipo sigue siendo mutable
            salvo que también se congele explícitamente.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Agregar propiedades en distinto orden entre instancias
              &quot;equivalentes&quot;.
            </strong>{" "}
            Genera hidden classes distintas y pierde las optimizaciones de
            inline caching.
          </li>
          <li>
            <strong className="text-foreground">
              Asumir que Object.freeze protege todo lo que una instancia
              expone.
            </strong>{" "}
            Solo protege lo propio; lo heredado por prototype sigue
            mutable.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Inicializar siempre las mismas propiedades en el mismo orden
            dentro de un constructor, para que todas las instancias
            compartan hidden class y se beneficien de las optimizaciones
            del motor.
          </li>
          <li>
            Congelar explícitamente tanto la instancia como su prototipo
            cuando se necesita inmutabilidad real de punta a punta.
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
