# Sistema de preparación para entrevistas técnicas

Este archivo es el checklist maestro y las instrucciones de continuidad de un proyecto que se ejecuta en múltiples sesiones (el usuario tiene un plan de $20/mes y no lo hace de una sola vez). Cuando el usuario diga **"continuemos"** (o algo equivalente, como "seguimos" o "dale con el próximo"), sin más contexto:

1. Buscar en el catálogo de abajo el primer módulo marcado `☐ pendiente`.
2. Implementarlo siguiendo el patrón de referencia (Event Loop, ya hecho).
3. Correr `npx tsc --noEmit` y `npx eslint <archivos tocados>` antes de dar por terminado.
4. Marcar el módulo como `✅ hecho` en este archivo.
5. Avisar brevemente qué se hizo y preguntar si se commitea (nunca commitear sin que lo pida).
6. No re-litigar decisiones ya tomadas acá (niveles, bilingüe, estructura) — están cerradas. Si algo nuevo no encaja en el patrón, avisar y proponer alternativa, no improvisar en silencio.

## Objetivo del usuario

Conseguir trabajo como **Full Stack Engineer senior** (no "especializado en frontend" — está corrigiendo ese posicionamiento). Este repo cubre la preparación de **conceptos técnicos con profundidad y trade-offs, en español e inglés**. Entrevistas de RRHH y live coding se preparan por fuera, no acá.

## Sistema de niveles (por módulo)

Cada módulo tiene 3 niveles, todos con el mismo estándar de calidad (ninguno es "para junior"):

- **Nivel 1 — Fundamentos aplicados**: el concepto y cómo se lleva de idea a producción. Es el piso parejo que hay que tener en TODO el catálogo antes de profundizar en ningún tema puntual (evita agujeros negros tipo "sé mucho de GraphQL pero no sé explicar un deploy").
- **Nivel 2 — Trade-offs y buenas prácticas**: por qué se elige una alternativa sobre otra, patrones intermedios. Es lo que distingue a un senior hablando.
- **Nivel 3 — Edge cases y profundidad interna**: detalles de implementación, límites del sistema, preguntas capciosas de procesos duros o de staff.

El usuario decide por tema hasta qué nivel le conviene llegar; el catálogo entero debería tener Nivel 1, pero Nivel 2/3 son opcionales según prioridad.

## Patrón de implementación (referencia: `event-loop`)

Cada módulo, al completarse, toca estos archivos:

1. **`lib/modules/<slug>/entrevista.ts`** — array de `PreguntaEntrevista` (tipo en `lib/modules/types.ts`). Cada pregunta: `pregunta`, `respuestaEs`, `respuestaEn`, `nivel` (1|2|3), y opcionalmente `tradeoffs`, `repregunta` + `respuestaRepreguntaEs`/`respuestaRepreguntaEn` (si hay repregunta, SIEMPRE con su respuesta redactada, no dejarla abierta), y `codigo`/`codigoRepregunta` (snippet corto, **solo cuando el código resuelve una ambigüedad que la prosa no resuelve tan bien** — ej: "¿qué imprime esto?", un fix concreto, una comparación de dos formas de escribir algo. No agregar código a preguntas puramente conceptuales o de trade-offs en prosa; no es un requisito por pregunta, es una herramienta a usar con criterio).
2. **`app/modulos/<categoria>/<slug>/page.tsx`** — se estructura con `<NivelTabs niveles={{1: <NivelUno/>, 2: <NivelDos/>, 3: <NivelTres/>}} />`. Cada `NivelX` es una función que devuelve un fragment con las secciones: Explicación, Playground/Visualización (**opcional en nivel 2/3**, solo si el concepto realmente lo amerita — no crear un simulador nuevo por costumbre), Errores comunes, Casos de uso, Quiz (`preguntasNivelX`), y Entrevista (`<EntrevistaSeccion preguntas={preguntasPorNivel[X]} />`).
3. **`lib/modules/entrevista-registry.ts`** — agregar una entrada al array `bancoEntrevista` con `categoriaSlug`, `categoriaTitulo`, `moduloSlug`, `moduloTitulo` y las preguntas importadas.
4. Si el módulo no existe todavía en `lib/modules/registry.ts` (categoría/módulo con `estado: "proximamente"` o directamente ausente), actualizar su `estado` a `"disponible"` (o agregar la entrada si la categoría estaba vacía).

Componentes ya construidos y reutilizables, no recrear: `ModuloLayout`, `Seccion`, `Quiz`, `RevelarSolucion`, `NivelTabs`, `EntrevistaSeccion`.

## Catálogo maestro

### JavaScript profundo
- ✅ Event Loop (Nivel 1/2/3 + Entrevista) — referencia del patrón
- ✅ Closures (Nivel 1/2/3 + Entrevista)
- ✅ Promises (Nivel 1/2/3 + Entrevista)
- ✅ Async (Nivel 1/2/3 + Entrevista)
- ✅ Scope (Nivel 1/2/3 + Entrevista)
- ✅ Hoisting (Nivel 1/2/3 + Entrevista)
- ✅ Memory (Nivel 1/2/3 + Entrevista)
- ✅ Prototypes & Clases (Nivel 1/2/3 + Entrevista)
- ✅ Módulos: ESM vs CommonJS (Nivel 1/2/3 + Entrevista)
- ✅ Iteradores y Generadores (Nivel 1/2/3 + Entrevista)

### TypeScript avanzado
- ✅ Genéricos (Nivel 1/2/3 + Entrevista)
- ✅ Utility types (Nivel 1/2/3 + Entrevista)
- ✅ Discriminated unions & type narrowing (Nivel 1/2/3 + Entrevista)
- ✅ Structural typing vs nominal (Nivel 1/2/3 + Entrevista)
- ✅ Trade-offs de `strict` mode (Nivel 1/2/3 + Entrevista)

### React Core
- ✅ Componentes (Nivel 1/2/3 + Entrevista)
- ✅ Props (Nivel 1/2/3 + Entrevista)
- ✅ State (Nivel 1/2/3 + Entrevista)
- ✅ Composition (Nivel 1/2/3 + Entrevista)
- ✅ Keys (Nivel 1/2/3 + Entrevista)
- ✅ Context (Nivel 1/2/3 + Entrevista)
- ✅ Forms (Nivel 1/2/3 + Entrevista)
- ✅ Error Boundaries (Nivel 1/2/3 + Entrevista)
- ✅ Portals (Nivel 1/2/3 + Entrevista)

### React Rendering
- ✅ Render (Nivel 1/2/3 + Entrevista)
- ✅ Commit (Nivel 1/2/3 + Entrevista)
- ✅ Reconciliation (Nivel 1/2/3 + Entrevista)
- ✅ Fiber (Nivel 1/2/3 + Entrevista)
- ✅ Virtual DOM (Nivel 1/2/3 + Entrevista)
- ✅ Concurrent Rendering (Nivel 1/2/3 + Entrevista)
- ✅ Hydration (Nivel 1/2/3 + Entrevista)

### Hooks (categoría nueva, sin contenido aún)
- ✅ useState (Nivel 1/2/3 + Entrevista)
- ✅ useEffect (Nivel 1/2/3 + Entrevista)
- ✅ useMemo (Nivel 1/2/3 + Entrevista)
- ✅ useCallback (Nivel 1/2/3 + Entrevista)
- ✅ useRef (Nivel 1/2/3 + Entrevista)
- ✅ useReducer (Nivel 1/2/3 + Entrevista)
- ✅ Custom Hooks (Nivel 1/2/3 + Entrevista)

### Estado
- ✅ Context (Nivel 1/2/3 + Entrevista, gestión de estado, distinto del módulo de React Core)
- ✅ Zustand (Nivel 1/2/3 + Entrevista)
- ✅ Redux Toolkit (Nivel 1/2/3 + Entrevista)
- ✅ TanStack Query (Nivel 1/2/3 + Entrevista)
- ✅ Cuándo NO usar una librería de estado global (Nivel 1/2/3 + Entrevista)

### Performance (frontend)
- ✅ Memoization (Nivel 1/2/3 + Entrevista)
- ✅ Lazy Loading (Nivel 1/2/3 + Entrevista)
- ✅ Code Splitting (Nivel 1/2/3 + Entrevista)
- ✅ Suspense (Nivel 1/2/3 + Entrevista)
- ✅ Virtualization (Nivel 1/2/3 + Entrevista)
- ✅ Bundle Size (Nivel 1/2/3 + Entrevista)
- ✅ Core Web Vitals (Nivel 1/2/3 + Entrevista)

### Accesibilidad
- ✅ Semantic HTML & ARIA (Nivel 1/2/3 + Entrevista)
- ✅ Focus management (Nivel 1/2/3 + Entrevista)
- ✅ Navegación por teclado (Nivel 1/2/3 + Entrevista)
- ✅ Formularios accesibles (Nivel 1/2/3 + Entrevista)
- ✅ Testing de accesibilidad (axe) (Nivel 1/2/3 + Entrevista)

### Next.js
- ✅ App Router vs Pages Router (Nivel 1/2/3 + Entrevista)
- ✅ Server Components vs Client Components (Nivel 1/2/3 + Entrevista)
- ✅ Data fetching & caching (Nivel 1/2/3 + Entrevista)
- ✅ SSR / SSG / ISR (Nivel 1/2/3 + Entrevista)
- ✅ Middleware & Edge runtime (Nivel 1/2/3 + Entrevista; titulado "Proxy (ex Middleware)" porque Next 16 lo renombró y deprecó el Edge runtime en rutas)
- ✅ Route handlers (API routes) (Nivel 1/2/3 + Entrevista)

### HTTP y Networking
- ✅ Fundamentos de red (Nivel 1/2/3 + Entrevista)
- ✅ Métodos y status codes (Nivel 1/2/3 + Entrevista)
- ✅ Headers y CORS (Nivel 1/2/3 + Entrevista)
- ✅ Fetch/XHR y manejo de requests (Nivel 1/2/3 + Entrevista)
- ✅ Caching HTTP (Nivel 1/2/3 + Entrevista)
- ✅ REST vs GraphQL vs WebSockets (Nivel 1/2/3 + Entrevista)
- ✅ HTTP/1.1 vs HTTP/2 vs HTTP/3 (Nivel 1/2/3 + Entrevista)

### Testing
- ✅ Pirámide de testing (Nivel 1/2/3 + Entrevista)
- ✅ Unit vs integration vs e2e (Nivel 1/2/3 + Entrevista)
- ✅ Mocking strategies (MSW) (Nivel 1/2/3 + Entrevista)
- ✅ TDD (Nivel 1/2/3 + Entrevista)
- ✅ Testing de componentes React (RTL) (Nivel 1/2/3 + Entrevista)
- ✅ Testing de APIs (Nivel 1/2/3 + Entrevista)

### Arquitectura
- ✅ Monolito vs microservicios vs microfrontends (Nivel 1/2/3 + Entrevista)
- ✅ Clean / Hexagonal architecture (Nivel 1/2/3 + Entrevista)
- ✅ Design patterns comunes (factory, strategy, observer) (Nivel 1/2/3 + Entrevista)
- ✅ Feature-based vs layer-based folder structure (Nivel 1/2/3 + Entrevista)
- ✅ Contratos de API (OpenAPI) (Nivel 1/2/3 + Entrevista)
- ✅ Event-driven architecture (Nivel 1/2/3 + Entrevista)

### Seguridad
- ✅ AuthN vs AuthZ (Nivel 1/2/3 + Entrevista)
- ✅ JWT & sesiones (Nivel 1/2/3 + Entrevista)
- ✅ OWASP Top 10 esencial (Nivel 1/2/3 + Entrevista)
- ✅ CORS / CSRF / XSS (Nivel 1/2/3 + Entrevista)
- ✅ RBAC / ABAC (Nivel 1/2/3 + Entrevista)
- ✅ Secrets management (Nivel 1/2/3 + Entrevista)

### Backend
- ✅ Node.js runtime (Nivel 1/2/3 + Entrevista; foco en proceso/threads)
- ✅ Diseño de APIs REST (Nivel 1/2/3 + Entrevista)
- ✅ Fastify / Express / NestJS — trade-offs (Nivel 1/2/3 + Entrevista)
- ✅ Validación de datos (Zod) (Nivel 1/2/3 + Entrevista)
- ✅ Manejo de errores y logging (Nivel 1/2/3 + Entrevista)
- ✅ Rate limiting (Nivel 1/2/3 + Entrevista)
- ✅ WebSockets / tiempo real (Nivel 1/2/3 + Entrevista)
- ✅ Colas y jobs asíncronos (BullMQ) (Nivel 1/2/3 + Entrevista)
- ✅ Arquitectura en capas (controller/service/repository) (Nivel 1/2/3 + Entrevista)

### Bases de datos (categoría nueva)
- ✅ SQL vs NoSQL (Nivel 1/2/3 + Entrevista)
- ✅ Modelado relacional & normalización (Nivel 1/2/3 + Entrevista)
- ✅ Índices y query performance (Nivel 1/2/3 + Entrevista)
- ✅ Transacciones & ACID (Nivel 1/2/3 + Entrevista)
- ✅ Prisma / ORM — trade-offs (Nivel 1/2/3 + Entrevista)
- ✅ Migraciones (Nivel 1/2/3 + Entrevista)
- ✅ Postgres específico (constraints, JSONB) (Nivel 1/2/3 + Entrevista)
- ✅ Redis / caching (Nivel 1/2/3 + Entrevista)
- ✅ Nociones de escalabilidad (réplicas, sharding) (Nivel 1/2/3 + Entrevista)

### CI/CD (antes "DevOps")
- ✅ Pipelines (GitHub Actions) (Nivel 1/2/3 + Entrevista)
- ☐ Estrategias de deploy (blue-green, canary, rolling)
- ☐ Docker (nociones)
- ☐ Variables y secretos en CI
- ☐ Observabilidad (logs, métricas, tracing)
- ☐ Feature flags

### Cloud (categoría nueva)
- ☐ Modelo de responsabilidad compartida
- ☐ Cómputo: VMs vs contenedores vs serverless
- ☐ AWS básico (EC2, S3, Lambda, RDS)
- ☐ Redes básicas (VPC, load balancer, CDN)
- ☐ Trade-offs de costo/escalabilidad
- ☐ Vercel/Netlify vs AWS — cuándo usar qué

### System Design / Arquitectura distribuida (categoría nueva, capstone)
- ☐ CAP theorem, consistencia vs disponibilidad
- ☐ Estrategias de caching (write-through, write-back, invalidación)
- ☐ Load balancing, escalado horizontal vs vertical
- ☐ Colas de mensajes / pub-sub (Kafka, SQS)
- ☐ Idempotencia y rate limiting a nivel de diseño
- ☐ Estimación "back of the envelope"
- ☐ Ejercicios guiados: diseñar un acortador de URLs, un chat en tiempo real, un feed paginado

### IA aplicada al desarrollo
- ☐ Prompt engineering aplicado a desarrollo
- ☐ Evaluación de output de IA / code review de IA
- ☐ MCP servers — qué son y para qué sirven
- ☐ Riesgos y límites del desarrollo 100% asistido por IA
- ☐ Cómo comunicar en entrevista tu metodología de trabajo con IA

## Vista de repaso

`/entrevista` agrega todas las preguntas de `entrevista-registry.ts`, filtradas por nivel, agrupadas por categoría/módulo. A medida que se completan módulos, esta vista crece sola — no requiere mantenimiento manual más allá de sumar la entrada al registry (paso 3 del patrón de implementación).
