import type { PreguntaEntrevista } from "../types";

export const entrevistaCodeSplitting: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es code splitting, y qué lo dispara técnicamente?",
    respuestaEs:
      "Es la técnica de dividir el bundle de JavaScript de una app en varios archivos (chunks) más chicos, que se cargan bajo demanda en vez de todos de una al inicio. El disparador técnico es el `import()` dinámico: a diferencia de un `import` estático (que el bundler resuelve e incluye siempre en el mismo chunk), un `import()` con paréntesis devuelve una Promise y le dice al bundler 'esto puede vivir en un archivo separado, cargalo solo cuando este código realmente se ejecute'. React.lazy es, por debajo, simplemente un wrapper sobre esta misma técnica aplicado a componentes.",
    respuestaEn:
      "It's the technique of splitting an app's JavaScript bundle into several smaller files (chunks), loaded on demand instead of all at once upfront. The technical trigger is dynamic `import()`: unlike a static `import` (which the bundler resolves and always includes in the same chunk), a parenthesized `import()` returns a Promise and tells the bundler 'this can live in a separate file, load it only when this code actually runs'. React.lazy is, underneath, simply a wrapper around this same technique applied to components.",
    codigo: `// import estático: siempre en el mismo bundle
import Modulo from './modulo-pesado';

// import dinámico: candidato a chunk separado, cargado bajo demanda
const cargar = () => import('./modulo-pesado');`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real con Next.js o un router moderno, ¿dónde ocurre el code splitting más importante sin que el desarrollador tenga que pedirlo explícitamente?",
    respuestaEs:
      "A nivel de RUTA: frameworks como Next.js dividen automáticamente el código de cada página/ruta en su propio chunk, así que visitar `/perfil` no descarga el código de `/checkout` ni de ninguna otra ruta que el usuario no visitó. Es la forma de code splitting con mejor relación beneficio/esfuerzo, porque coincide naturalmente con cómo los usuarios navegan una app (rara vez usan todas las rutas en la misma sesión) y no requiere que el desarrollador identifique manualmente qué envolver en un import() dinámico.",
    respuestaEn:
      "At the ROUTE level: frameworks like Next.js automatically split each page/route's code into its own chunk, so visiting `/profile` doesn't download `/checkout`'s code or any other route the user didn't visit. It's the code splitting technique with the best effort-to-benefit ratio, because it naturally matches how users navigate an app (they rarely use every route in the same session) and doesn't require the developer to manually identify what to wrap in a dynamic import().",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es un 'vendor chunk', y qué trade-off resuelve separar las dependencias de terceros del código propio de la app?",
    respuestaEs:
      "Es un chunk separado que agrupa el código de las librerías de terceros (React, lodash, cualquier dependencia de node_modules), en vez de mezclarlo con el código propio de la app en el mismo archivo. La ventaja es de CACHEO: el código de las dependencias cambia mucho menos seguido que el código propio de la app (que se despliega en cada release). Si están en el mismo chunk, cada deploy invalida la caché del navegador para TODO ese archivo, incluidas las dependencias que no cambiaron. Separándolas, el navegador puede seguir usando el vendor chunk cacheado entre deploys sucesivos, mientras solo re-descarga el chunk más chico con el código propio que sí cambió.",
    respuestaEn:
      "It's a separate chunk grouping third-party library code (React, lodash, any node_modules dependency), instead of mixing it with the app's own code in the same file. The advantage is CACHING: dependency code changes much less often than the app's own code (which deploys on every release). If they're in the same chunk, every deploy invalidates the browser's cache for THAT ENTIRE file, including dependencies that didn't change. Separating them lets the browser keep using the cached vendor chunk across successive deploys, only re-downloading the smaller chunk with the app code that actually changed.",
    codigo: `// configuración conceptual (webpack/similar):
// splitChunks: separar node_modules en un chunk "vendor" aparte
// beneficio: vendor.js se mantiene cacheado entre deploys que no tocan dependencias`,
    tradeoffs:
      "Separar vendor chunks mejora el cacheo entre deploys, pero agrega una request HTTP adicional en la carga inicial — para sitios con muy poco tráfico recurrente, ese beneficio de caché entre visitas puede no compensar el costo de la request extra en la primera carga.",
    repregunta:
      "¿Qué pasa si dos rutas distintas, cada una en su propio chunk gracias al code splitting automático, importan ambas la misma librería pesada (por ejemplo, una librería de gráficos)?",
    respuestaRepreguntaEs:
      "Depende de cómo el bundler resuelva la deduplicación: bundlers modernos (Webpack, Vite/Rollup) detectan que ambos chunks de ruta dependen del mismo módulo, y en vez de duplicar esa librería pesada en AMBOS chunks (inflando el tamaño total descargado si el usuario visita ambas rutas), la extraen a un chunk COMÚN compartido, que se descarga una sola vez y ambas rutas referencian. Sin esta optimización (o con una configuración que la desactive), cada chunk de ruta incluiría su propia copia completa de la librería, duplicando bytes descargados innecesariamente si el usuario navega entre ambas rutas en la misma sesión.",
    respuestaRepreguntaEn:
      "It depends on how the bundler resolves deduplication: modern bundlers (Webpack, Vite/Rollup) detect that both route chunks depend on the same module, and instead of duplicating that heavy library in BOTH chunks (inflating total downloaded size if the user visits both routes), they extract it into a shared COMMON chunk, downloaded once and referenced by both routes. Without this optimization (or with a configuration that disables it), each route chunk would include its own full copy of the library, unnecessarily duplicating downloaded bytes if the user navigates between both routes in the same session.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué dividir el código en demasiados chunks muy chicos puede generar un problema de 'waterfall' de requests?",
    respuestaEs:
      "Si un chunk A, al cargarse, descubre que necesita otro chunk B, y B a su vez necesita C, el navegador no puede empezar a pedir C hasta no haber recibido y parseado B (que a su vez esperó a A) — una cadena secuencial de requests, cada una esperando a la anterior, en vez de descargas en paralelo. Cuantos más niveles de chunks anidados haya (por dividir demasiado granularmente), más larga la cadena, y el tiempo total puede terminar siendo mayor que si esas piezas hubieran estado agrupadas en menos chunks descargables en paralelo desde el principio.",
    respuestaEn:
      "If chunk A, once loaded, discovers it needs another chunk B, and B in turn needs C, the browser can't start requesting C until it has received and parsed B (which in turn waited for A) — a sequential chain of requests, each waiting for the previous one, instead of parallel downloads. The more nested chunk levels there are (from splitting too granularly), the longer the chain, and the total time can end up being longer than if those pieces had been grouped into fewer chunks downloadable in parallel from the start.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo interactúa el tree-shaking con las decisiones de code splitting, y por qué exportar un objeto grande con muchas propiedades desde un módulo puede sabotear ambas optimizaciones a la vez?",
    respuestaEs:
      "Tree-shaking depende de que el bundler pueda analizar ESTÁTICAMENTE qué exports de un módulo se usan realmente, para eliminar el resto del bundle final. Si un módulo exporta un único objeto grande (`export default { funcionA, funcionB, funcionC, ... }`) en vez de exports nombrados individuales, el bundler no puede saber con certeza qué PROPIEDADES de ese objeto se usan en cada punto de import — tiene que asumir conservadoramente que el objeto completo podría necesitarse, e incluirlo entero. Esto no solo infla el bundle (falla de tree-shaking), sino que también afecta code splitting: si distintas partes de la app solo usan `funcionA` o solo `funcionB`, no se pueden separar en chunks distintos porque técnicamente 'dependen' del mismo objeto grande indivisible, en vez de poder extraer solo lo que cada chunk específico necesita.",
    respuestaEn:
      "Tree-shaking depends on the bundler being able to STATICALLY analyze which exports of a module are actually used, in order to remove the rest from the final bundle. If a module exports a single large object (`export default { functionA, functionB, functionC, ... }`) instead of individually named exports, the bundler can't know for certain which PROPERTIES of that object are used at each import point — it has to conservatively assume the whole object might be needed, and include it entirely. This not only bloats the bundle (tree-shaking failure), but also affects code splitting: if different parts of the app only use `functionA` or only `functionB`, they can't be split into separate chunks because they technically 'depend' on the same indivisible large object, instead of being able to extract just what each specific chunk needs.",
    codigo: `// sabotea tree-shaking y code splitting: todo o nada
export default { funcionA, funcionB, funcionC };

// permite tree-shaking y splitting granular: cada import es independiente
export { funcionA };
export { funcionB };
export { funcionC };`,
    repregunta:
      "¿Qué diferencia hay entre code splitting a nivel de ruta y 'component-level splitting' más granular dentro de una misma ruta, en cuanto a la complejidad que agregan al mantenimiento del proyecto?",
    respuestaRepreguntaEs:
      "El splitting por ruta es prácticamente gratis en términos de mantenimiento: el framework/router lo maneja automáticamente, sin decisiones manuales continuas por parte del equipo. El splitting a nivel de componente individual (envolver manualmente componentes puntuales en React.lazy dentro de una misma ruta) requiere que cada desarrollador identifique, mantenga y revise decisiones específicas de qué envolver — con el riesgo de que, con el tiempo, esas decisiones queden desactualizadas (un componente que se lazy-cargó porque era pesado y poco usado, pero que después se volvió parte del flujo principal y ya no debería estar detrás de un Suspense). Por eso la recomendación práctica es empezar siempre por el splitting automático de rutas, y reservar el splitting manual a nivel de componente solo para casos puntuales y bien justificados (medidos con el bundle analyzer), no como práctica generalizada.",
    respuestaRepreguntaEn:
      "Route-level splitting is essentially free in terms of maintenance: the framework/router handles it automatically, with no ongoing manual decisions from the team. Individual component-level splitting (manually wrapping specific components in React.lazy within the same route) requires each developer to identify, maintain, and review specific decisions about what to wrap — with the risk that, over time, those decisions become stale (a component that was lazy-loaded because it was heavy and rarely used, but later became part of the main flow and shouldn't be behind a Suspense anymore). That's why the practical recommendation is to always start with automatic route splitting, and reserve manual component-level splitting only for specific, well-justified cases (measured with a bundle analyzer), not as a blanket practice.",
  },
];
