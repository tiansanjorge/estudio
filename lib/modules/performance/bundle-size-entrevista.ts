import type { PreguntaEntrevista } from "../types";

export const entrevistaBundleSize: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta:
      "¿Por qué importa el tamaño del bundle de JavaScript, si hoy la mayoría de los usuarios tiene buena conexión?",
    respuestaEs:
      "Porque el costo del JavaScript no es solo la descarga: una vez que llega, el navegador tiene que parsearlo, compilarlo y ejecutarlo en el hilo principal, y mientras eso pasa la página no responde a la interacción. Ese trabajo de CPU escala con el tamaño SIN comprimir del código, y en un celular de gama media (que es el dispositivo típico de buena parte de los usuarios reales, no la notebook del equipo de desarrollo) puede ser varias veces más lento que en una máquina de desarrollo. Por eso 200 KB de JavaScript son mucho más caros que 200 KB de una imagen: la imagen se decodifica fuera del hilo principal, el JS lo bloquea. Un bundle grande se traduce directamente en peor tiempo hasta que la página es interactiva y en métricas como INP.",
    respuestaEn:
      "Because JavaScript's cost isn't only the download: once it arrives, the browser has to parse, compile and execute it on the main thread, and while that happens the page doesn't respond to interaction. That CPU work scales with the UNCOMPRESSED size of the code, and on a mid-range phone (the typical device for a large share of real users, not the dev team's laptop) it can be several times slower than on a development machine. That's why 200 KB of JavaScript is much more expensive than a 200 KB image: the image is decoded off the main thread, the JS blocks it. A large bundle translates directly into a worse time to interactive and metrics like INP.",
    tradeoffs:
      "Medir solo el tamaño gzip subestima el costo real: gzip reduce la transferencia, pero el navegador parsea y ejecuta el código descomprimido.",
  },
  {
    nivel: 1,
    pregunta:
      "¿Cómo averiguás qué está haciendo pesado el bundle de una app en producción?",
    respuestaEs:
      "Primero mirando la salida del build (Next.js, por ejemplo, muestra el peso de JS inicial por ruta) para ver DÓNDE está el problema, y después con un analizador de bundle (como @next/bundle-analyzer, webpack-bundle-analyzer o source-map-explorer) que dibuja un treemap con cada dependencia y su tamaño, para ver QUÉ lo causa. Casi siempre aparecen los mismos sospechosos: una librería importada completa cuando se usa una sola función, una dependencia pesada que tiene una alternativa modular, código que solo usa una ruta pero terminó en el chunk compartido, o la misma dependencia duplicada en dos versiones. Antes de sumar una dependencia nueva, herramientas como bundlephobia permiten ver cuánto va a costar antes de instalarla.",
    respuestaEn:
      "First by looking at the build output (Next.js, for example, shows initial JS weight per route) to see WHERE the problem is, and then with a bundle analyzer (like @next/bundle-analyzer, webpack-bundle-analyzer or source-map-explorer) that draws a treemap of every dependency and its size, to see WHAT causes it. The same suspects almost always show up: a library imported whole when only one function is used, a heavy dependency that has a modular alternative, code used by only one route that ended up in the shared chunk, or the same dependency duplicated in two versions. Before adding a new dependency, tools like bundlephobia show how much it will cost before installing it.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es tree-shaking y por qué a veces no funciona aunque el bundler lo soporte?",
    respuestaEs:
      "Es la eliminación del código exportado que nadie importa. Depende de que el bundler pueda analizar ESTÁTICAMENTE qué se usa, así que requiere módulos ES (import/export), no CommonJS (require es dinámico y no se puede analizar con seguridad). Falla en tres casos típicos: cuando la librería se publica solo en CommonJS (como lodash clásico, a diferencia de lodash-es); cuando el import trae el objeto entero (`import _ from 'lodash'` y después `_.debounce`) en vez de una exportación nombrada; y cuando el bundler no puede probar que un módulo no tiene side effects al importarse, en cuyo caso lo conserva por seguridad aunque nadie use sus exports. Para esto último existe el campo `sideEffects: false` en el package.json de la librería.",
    respuestaEn:
      "It's the removal of exported code nobody imports. It depends on the bundler being able to STATICALLY analyze what's used, so it requires ES modules (import/export), not CommonJS (require is dynamic and can't be safely analyzed). It fails in three typical cases: when the library ships only as CommonJS (like classic lodash, unlike lodash-es); when the import pulls the whole object (`import _ from 'lodash'` then `_.debounce`) instead of a named export; and when the bundler can't prove a module has no side effects on import, in which case it keeps it to be safe even if nobody uses its exports. The `sideEffects: false` field in the library's package.json exists for that last case.",
    codigo: `// CommonJS + objeto entero: entra toda la librería
import _ from 'lodash';
_.debounce(fn, 300);

// ESM + export nombrado: entra solo debounce y sus dependencias
import { debounce } from 'lodash-es';
debounce(fn, 300);`,
    repregunta:
      "¿Por qué los barrel files (un index.ts que re-exporta todo) pueden empeorar el bundle?",
    respuestaRepreguntaEs:
      "Porque importar una sola cosa desde el barrel obliga al bundler a evaluar el index completo, y con él todos los módulos que re-exporta. Si alguno tiene side effects (o el bundler no puede asegurar que no los tiene), no lo puede descartar, y terminás cargando media librería interna para usar un componente. Además en desarrollo empeoran los tiempos de compilación, porque cada import resuelve el árbol entero. La solución es importar desde el archivo concreto, marcar el paquete con `sideEffects: false` cuando es cierto, o en Next.js usar `optimizePackageImports`, que reescribe esos imports automáticamente.",
    respuestaRepreguntaEn:
      "Because importing one thing from the barrel forces the bundler to evaluate the whole index, and with it every module it re-exports. If any has side effects (or the bundler can't be sure it doesn't), it can't drop it, and you end up loading half an internal library to use one component. They also hurt dev compile times, since each import resolves the entire tree. The fix is importing from the concrete file, marking the package with `sideEffects: false` when that's true, or in Next.js using `optimizePackageImports`, which rewrites those imports automatically.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo evitás que el bundle vuelva a crecer después de optimizarlo?",
    respuestaEs:
      "Con un performance budget automatizado: un límite explícito de KB para el JS inicial (por ruta o total) que se chequea en CI, por ejemplo con size-limit o con el reporte de bundle comparado contra la rama base, y que hace fallar o al menos comenta el PR cuando se supera. Sin eso, el bundle crece de a poco: cada PR suma 5 KB 'que no es nada', y en un año la app pesa el doble sin que nadie haya tomado esa decisión conscientemente. El presupuesto convierte el tamaño en una decisión explícita: si alguien quiere sumar una dependencia pesada, tiene que justificarla o compensarla.",
    respuestaEn:
      "With an automated performance budget: an explicit KB limit for initial JS (per route or total) checked in CI, for example with size-limit or a bundle report compared against the base branch, that fails or at least comments on the PR when exceeded. Without it, the bundle creeps up: each PR adds 5 KB 'which is nothing', and a year later the app weighs twice as much without anyone consciously deciding that. The budget turns size into an explicit decision: whoever wants to add a heavy dependency has to justify or offset it.",
    tradeoffs:
      "Un presupuesto demasiado estricto frena al equipo con discusiones por 2 KB; uno demasiado laxo no sirve. Conviene arrancar con el tamaño actual como techo y bajarlo gradualmente.",
  },
  {
    nivel: 3,
    pregunta:
      "Tu bundle tiene dos copias de la misma librería en versiones distintas. ¿Cómo llega a pasar y cómo lo resolvés?",
    respuestaEs:
      "Pasa cuando dos dependencias piden rangos de versión incompatibles de una misma librería (por ejemplo, tu app usa date-fns 3 y una librería de componentes depende de date-fns 2): el package manager instala ambas para respetar los rangos, y el bundler incluye las dos porque son módulos distintos. Se detecta en el analizador de bundle (el mismo nombre aparece dos veces) o con `npm ls <paquete>`. Se resuelve actualizando la dependencia que arrastra la versión vieja, o forzando una única versión con `overrides` (npm) / `resolutions` (yarn) si las APIs son compatibles, lo cual hay que verificar con tests porque estás rompiendo el contrato que declaró la librería. Con librerías que mantienen estado global (React, por ejemplo), una copia duplicada no solo pesa: rompe en runtime, porque los hooks de una copia no ven el contexto de la otra.",
    respuestaEn:
      "It happens when two dependencies require incompatible version ranges of the same library (e.g. your app uses date-fns 3 and a component library depends on date-fns 2): the package manager installs both to honor the ranges, and the bundler includes both because they're different modules. You detect it in the bundle analyzer (the same name shows up twice) or with `npm ls <package>`. You fix it by upgrading the dependency dragging the old version, or forcing a single version with `overrides` (npm) / `resolutions` (yarn) if the APIs are compatible, which must be verified with tests since you're breaking the contract the library declared. With libraries that hold global state (React, for example), a duplicate copy doesn't just add weight: it breaks at runtime, because one copy's hooks don't see the other's context.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué impacto tiene el target de transpilación (browserslist) en el tamaño del bundle?",
    respuestaEs:
      "Uno grande y poco visible. Si el target incluye navegadores viejos, el compilador reescribe sintaxis moderna (clases, async/await, optional chaining, spread) a equivalentes más verbosos, y se suman polyfills para APIs que esos navegadores no tienen. Ese código extra lo descargan y parsean TODOS los usuarios, incluso el 95% con navegadores modernos que no lo necesitan. La decisión correcta sale de los datos de analytics reales: si nadie usa IE11, soportarlo es pagar un costo para cero usuarios. Cuando sí hace falta soportar navegadores viejos, existe el differential serving (un bundle moderno vía `type=\"module\"` y uno legacy vía `nomodule`), aunque hoy con la base de navegadores evergreen suele alcanzar con un target moderno.",
    respuestaEn:
      "A large and not very visible one. If the target includes old browsers, the compiler rewrites modern syntax (classes, async/await, optional chaining, spread) into more verbose equivalents, and polyfills get added for APIs those browsers lack. ALL users download and parse that extra code, including the 95% on modern browsers who don't need it. The right call comes from real analytics data: if nobody uses IE11, supporting it means paying a cost for zero users. When supporting old browsers is actually required, there's differential serving (a modern bundle via `type=\"module\"` and a legacy one via `nomodule`), though today, with an evergreen browser base, a modern target is usually enough.",
    repregunta:
      "¿Y qué pasa si marcás un paquete con `sideEffects: false` y no era cierto?",
    respuestaRepreguntaEs:
      "El bundler va a eliminar imports que parecen no usarse pero que en realidad hacían algo al importarse, y el bug aparece solo en producción (en desarrollo no se hace tree-shaking). El caso clásico son los imports de CSS (`import './estilos.css'`), que no exportan nada y existen solo por su efecto: con `sideEffects: false` desaparecen y la app queda sin estilos. También polyfills o registros globales (`import './registrar-iconos'`). La solución es listar esos archivos explícitamente: `\"sideEffects\": [\"*.css\", \"./src/registrar-iconos.ts\"]`.",
    respuestaRepreguntaEn:
      "The bundler will drop imports that look unused but actually did something on import, and the bug shows up only in production (dev builds don't tree-shake). The classic case is CSS imports (`import './styles.css'`), which export nothing and exist only for their effect: with `sideEffects: false` they vanish and the app loses its styles. Also polyfills or global registrations (`import './register-icons'`). The fix is listing those files explicitly: `\"sideEffects\": [\"*.css\", \"./src/register-icons.ts\"]`.",
  },
];
