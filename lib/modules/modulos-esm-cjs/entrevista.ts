import type { PreguntaEntrevista } from "../types";

export const entrevistaModulosEsmCjs: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuál es la diferencia fundamental entre CommonJS y ES Modules?",
    respuestaEs:
      "CommonJS (require/module.exports) resuelve y carga módulos de forma síncrona y dinámica, en tiempo de ejecución: un require() es una llamada a función común, que puede estar dentro de un if o un try/catch. ES Modules (import/export) se analizan de forma estática antes de ejecutar cualquier código: los imports se hoistean al tope del archivo, no pueden ser condicionales, y eso le permite a herramientas (bundlers, el propio motor) saber de antemano exactamente qué depende de qué, sin ejecutar nada.",
    respuestaEn:
      "CommonJS (require/module.exports) resolves and loads modules synchronously and dynamically, at runtime: a require() is a regular function call, which can live inside an if or a try/catch. ES Modules (import/export) are statically analyzed before running any code: imports are hoisted to the top of the file, can't be conditional, and that lets tooling (bundlers, the engine itself) know exactly what depends on what ahead of time, without executing anything.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto Node real, ¿cómo decidís si un módulo usa CommonJS o ES Modules?",
    respuestaEs:
      "Depende del campo \"type\" en package.json: \"module\" hace que los archivos .js se traten como ESM por defecto (usás import/export); sin ese campo, o con \"type\": \"commonjs\", se tratan como CJS (require/module.exports). También se puede forzar por archivo con las extensiones .mjs (siempre ESM) o .cjs (siempre CJS), sin importar lo que diga package.json. Para proyectos nuevos, hoy tiene sentido arrancar con \"type\": \"module\" para alinearse con el estándar y con cómo funciona el navegador.",
    respuestaEn:
      "It depends on the \"type\" field in package.json: \"module\" makes .js files treated as ESM by default (you use import/export); without that field, or with \"type\": \"commonjs\", they're treated as CJS (require/module.exports). It can also be forced per file with the .mjs (always ESM) or .cjs (always CJS) extensions, regardless of what package.json says. For new projects, it makes sense today to start with \"type\": \"module\" to align with the standard and with how the browser works.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué ESM habilita mejor tree-shaking que CommonJS?",
    respuestaEs:
      "El tree-shaking necesita saber, sin ejecutar código, qué exports de un módulo se usan realmente en algún punto del programa, para poder descartar el resto. Como los imports/exports de ESM son estáticos (no pueden depender de una condición en runtime), un bundler puede analizar el grafo completo de dependencias de antemano y eliminar con confianza lo que no se usa. Con CommonJS, un require() puede estar detrás de una condición, y module.exports puede mutarse dinámicamente en cualquier punto del archivo, así que el bundler no puede garantizar con la misma certeza qué es seguro eliminar — en la práctica, el tree-shaking de código CJS es mucho más limitado o directamente no ocurre.",
    respuestaEn:
      "Tree-shaking needs to know, without running any code, which exports of a module are actually used somewhere in the program, so it can discard the rest. Since ESM imports/exports are static (they can't depend on a runtime condition), a bundler can analyze the full dependency graph ahead of time and confidently remove what's unused. With CommonJS, a require() can be behind a condition, and module.exports can be mutated dynamically anywhere in the file, so the bundler can't guarantee with the same certainty what's safe to remove — in practice, tree-shaking of CJS code is much more limited or simply doesn't happen.",
    tradeoffs:
      "ESM: mejor tree-shaking y análisis estático, pero menos flexible (no podés requerir condicionalmente sin usar import() dinámico, que es asincrónico). CJS: más flexible en runtime, pero peor para bundle size en apps de frontend.",
    repregunta:
      "¿Qué es el 'dual package hazard' y cuándo aparece?",
    respuestaRepreguntaEs:
      "Pasa cuando una misma librería se publica en ambos formatos (CJS y ESM) y, por cómo la resuelve el bundler o Node, termina cargándose DOS VECES en el mismo proceso — una copia vía require (CJS) y otra vía import (ESM) — como si fueran dos módulos distintos. Si esa librería mantiene estado a nivel de módulo (por ejemplo, un singleton, una caché interna, un registro global), cada copia tiene su propio estado independiente, rompiendo la garantía de que existe una sola instancia compartida en toda la aplicación. Se mitiga definiendo bien el campo \"exports\" condicional en package.json para asegurar que ambos formatos apunten al mismo estado interno cuando sea posible, o diseñando la librería para no depender de estado module-level compartido entre ambos builds.",
    respuestaRepreguntaEn:
      "It happens when the same library is published in both formats (CJS and ESM) and, depending on how the bundler or Node resolves it, ends up loaded TWICE in the same process — one copy via require (CJS) and another via import (ESM) — as if they were two separate modules. If that library keeps module-level state (e.g. a singleton, an internal cache, a global registry), each copy has its own independent state, breaking the guarantee that there's a single shared instance across the whole app. It's mitigated by properly defining the conditional \"exports\" field in package.json to make sure both formats point to the same internal state when possible, or by designing the library to not depend on module-level state shared between both builds.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirve el campo \"exports\" condicional en package.json de una librería?",
    respuestaEs:
      "Permite declarar explícitamente qué archivo debe cargarse según cómo te consuman: una condición \"import\" apunta al build ESM (para quien haga import), una condición \"require\" apunta al build CJS (para quien haga require), y puede haber condiciones adicionales (\"browser\", \"node\", \"types\") para servir builds distintos según el entorno. Sin este campo, Node y los bundlers infieren el entry point de forma menos predecible (por convención de \"main\"/\"module\"), lo que aumenta el riesgo de resolver el archivo equivocado o de terminar en un dual package hazard.",
    respuestaEn:
      "It lets you explicitly declare which file should load depending on how you're consumed: an \"import\" condition points to the ESM build (for whoever does import), a \"require\" condition points to the CJS build (for whoever does require), and there can be additional conditions (\"browser\", \"node\", \"types\") to serve different builds per environment. Without this field, Node and bundlers infer the entry point less predictably (via the \"main\"/\"module\" convention), which increases the risk of resolving the wrong file or ending up with a dual package hazard.",
  },
  {
    nivel: 3,
    pregunta:
      "En una dependencia circular, ¿por qué ESM con live bindings puede resolver casos que CommonJS no resuelve bien?",
    respuestaEs:
      "require() en CJS devuelve una COPIA del module.exports en el momento exacto de la llamada: si el módulo circular todavía no llegó a la línea que asigna el valor necesitado, lo que se recibe es un objeto incompleto, y esa copia no se actualiza después aunque el módulo termine de exportar. Los named exports de ESM, en cambio, son bindings en vivo: si el valor se usa recién dentro de una función que se ejecuta DESPUÉS de que el ciclo de carga terminó (no en el nivel superior del módulo durante el ciclo), el binding ya refleja el valor final, porque no es una copia sino una referencia actualizada. El caso que sigue fallando en ambos sistemas es usar el valor directamente en el nivel superior mientras el ciclo todavía está en curso.",
    respuestaEn:
      "require() in CJS returns a COPY of module.exports at the exact moment of the call: if the circular module hasn't reached the line that assigns the needed value yet, what you get is an incomplete object, and that copy doesn't update later even after the module finishes exporting. ESM's named exports, on the other hand, are live bindings: if the value is only used inside a function that runs AFTER the load cycle finished (not at the module's top level during the cycle), the binding already reflects the final value, because it's not a copy but an updated reference. The case that still breaks in both systems is using the value directly at the top level while the cycle is still in progress.",
    repregunta:
      "¿Node permite hacer require() de un módulo ESM de forma síncrona?",
    respuestaRepreguntaEs:
      "En general no. Un módulo ESM puede tener top-level await, lo que lo vuelve inherentemente asincrónico de cargar, y por eso require() (que es síncrono por diseño) no puede cargarlo de forma confiable. La forma soportada de consumir un ESM desde CJS es el import() dinámico, que devuelve una Promise y hay que await-earla o encadenarla con .then(). Versiones recientes de Node agregaron soporte experimental para requerir ESM síncronamente en casos específicos donde el módulo no usa top-level await, pero no es la forma general ni portable de resolverlo.",
    respuestaRepreguntaEn:
      "Generally no. An ESM module can have top-level await, which makes it inherently asynchronous to load, and that's why require() (which is synchronous by design) can't reliably load it. The supported way to consume an ESM from CJS is dynamic import(), which returns a Promise that you need to await or chain with .then(). Recent Node versions added experimental support for synchronously requiring ESM in specific cases where the module doesn't use top-level await, but it's not the general or portable way to solve it.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué le indica el campo \"sideEffects\" en package.json a un bundler, y por qué importa para tree-shaking agresivo?",
    respuestaEs:
      "\"sideEffects\": false le dice al bundler que ningún archivo del paquete tiene efectos secundarios al ser importado (no registra nada global, no modifica prototipos, no ejecuta lógica que otro código dependa sin usar un export explícito) — así que si nada importa nombres específicos de un módulo, el bundler puede eliminar el archivo entero del bundle final con seguridad, no solo los exports no usados dentro de él. Es especialmente relevante en librerías que incluyen archivos con efectos reales (por ejemplo, un CSS importado por su efecto de side-loading, o un polyfill que se ejecuta por importarlo), que hay que listar explícitamente como excepción en un array dentro de ese mismo campo para que el bundler no los elimine por error.",
    respuestaEn:
      "\"sideEffects\": false tells the bundler that no file in the package has side effects when imported (it doesn't register anything global, doesn't modify prototypes, doesn't run logic other code depends on without an explicit export) — so if nothing imports specific names from a module, the bundler can safely remove the entire file from the final bundle, not just the unused exports within it. It's especially relevant for libraries that include files with real effects (e.g. a CSS file imported for its side-loading effect, or a polyfill that runs just by being imported), which need to be explicitly listed as an exception in an array within that same field so the bundler doesn't accidentally remove them.",
  },
];
