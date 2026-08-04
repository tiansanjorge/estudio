@AGENTS.md

# Frontend Study Lab

## Visión

Este proyecto no es un blog ni una colección de apuntes.

El objetivo es construir una plataforma interactiva para estudiar conceptos de Frontend (y algunos de Backend) mediante visualizaciones, simulaciones, playgrounds, ejercicios y desafíos.

El foco está en comprender cómo funcionan realmente las tecnologías, no simplemente memorizar definiciones.

El proyecto también debe servir como portfolio profesional, reflejando un nivel Senior de ingeniería frontend.

---

# Objetivos

- Construir una plataforma educativa moderna.
- Explicar conceptos complejos de forma visual e interactiva.
- Priorizar la comprensión profunda sobre la cantidad de contenido.
- Mantener una arquitectura limpia y escalable.
- Escribir código mantenible y reusable.
- Evitar soluciones rápidas o duplicación innecesaria.

---

# Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

En el futuro podrían incorporarse:

- Framer Motion
- TanStack Query
- Zod
- React Hook Form
- Testing (Vitest, React Testing Library y Playwright)

No agregar dependencias hasta que realmente sean necesarias.

---

# Filosofía del proyecto

Cada concepto debe poder experimentarse.

No queremos páginas de texto.

Queremos laboratorios interactivos.

Cada módulo debería intentar incluir, cuando tenga sentido:

- explicación conceptual
- visualización
- playground
- experimento
- errores comunes
- casos de uso
- quiz
- desafío

---

# Calidad del código

Prioridades:

- código simple
- componentes pequeños
- composición antes que herencia
- separación de responsabilidades
- evitar duplicación
- nombres claros
- tipado fuerte
- accesibilidad
- responsive
- reutilización

Siempre pensar primero en la arquitectura antes de implementar.

Evitar soluciones "quick and dirty".

---

# Forma de trabajar

Nunca implementar grandes funcionalidades sin antes proponer una arquitectura.

Antes de escribir código:

- analizar el problema
- identificar componentes reutilizables
- detectar patrones
- pensar escalabilidad

Si una implementación puede generar deuda técnica, explicar el problema antes de continuar.

No asumir decisiones importantes sin justificarlas.

---

# Rol esperado

Actuar como un Staff Frontend Engineer.

No limitarse a escribir código.

También:

- proponer mejoras
- detectar problemas de arquitectura
- sugerir refactorizaciones
- cuestionar decisiones cuando exista una alternativa mejor

No aceptar ciegamente una implementación solo porque funciona.

---

# Organización

La plataforma irá creciendo por módulos.

Los conceptos se desarrollarán de menor a mayor complejidad.

Roadmap inicial:

1. JavaScript profundo

- Event Loop
- Closures
- Promises
- Async
- Scope
- Hoisting
- Memory

2. React Core

- Componentes
- Props
- State
- Composition
- Keys
- Context
- Forms

3. React Rendering

- Render
- Commit
- Reconciliation
- Fiber
- Virtual DOM
- Concurrent Rendering
- Hydration

4. Hooks

- useState
- useEffect
- useMemo
- useCallback
- useRef
- useReducer
- Custom Hooks

5. Performance

- Memoization
- Lazy Loading
- Code Splitting
- Suspense
- Virtualization
- Bundle Size

6. Accesibilidad

7. Next.js

8. HTTP y Networking

- Métodos y status codes
- Headers y CORS
- Fetch/XHR y manejo de requests
- Caching HTTP
- REST vs GraphQL vs WebSockets
- HTTP/1.1 vs HTTP/2 vs HTTP/3

9. Estado

- Context
- Zustand
- Redux Toolkit
- TanStack Query

10. TypeScript avanzado

11. Testing

12. Arquitectura

13. Seguridad

14. Backend

15. DevOps

16. IA aplicada al desarrollo

---

# Diseño

La estética debe ser moderna, cuidada y atractiva, con paletas de colores livianas (bajo contraste de fondo, tonos suaves) para evitar la sobrecarga visual en sesiones de estudio largas.

Evitar diseños recargados, saturados o con demasiado contraste agresivo. El texto siempre debe cumplir WCAG AA (contraste con el fondo), la "liviandad" es sobre saturación de color, no sobre legibilidad.

Priorizar espacio en blanco, tipografía clara y jerarquía visual simple por sobre la decoración.

## Design tokens

**Color** — base neutra (zinc) en ambos modos. El acento difiere a propósito entre modos: índigo/violeta en claro, verde (emerald) en oscuro.

| Token | Claro | Oscuro |
|---|---|---|
| `background` | `#fafafa` | `#18181b` |
| `surface` (cards, paneles) | `#ffffff` | `#1f1f23` |
| `foreground` (texto principal) | `#27272a` | `#e4e4e7` |
| `muted-foreground` (texto secundario) | `#71717a` | `#a1a1aa` |
| `border` | `#e4e4e7` | `#27272a` |
| `accent` | `#6366f1` | `#34d399` |
| `accent-soft` (fondos, badges) | `#eef2ff` | `#064e3b` |

Los chips/badges que usan `accent-soft` deben llevar `border border-accent/30` — el fondo del token queda cerca en luminancia al `background` de la página, y el borde es lo que separa visualmente el chip.

**Color semántico** — para feedback (correcto/incorrecto, status codes HTTP, alertas), independiente del acento de marca:

| Token | Claro | Oscuro |
|---|---|---|
| `success` / `success-soft` | `#047857` / `#ecfdf5` | `#34d399` / `#064e3b` |
| `info` / `info-soft` | `#0369a1` / `#f0f9ff` | `#38bdf8` / `#0c4a6e` |
| `warning` / `warning-soft` | `#b45309` / `#fffbeb` | `#fbbf24` / `#78350f` |
| `error` / `error-soft` | `#b91c1c` / `#fef2f2` | `#f87171` / `#7f1d1d` |

Mismo patrón que `accent-soft`: siempre acompañar el fondo `-soft` con `border border-{token}/30`.

**Tipografía** — Geist Sans para UI/texto (ya configurada en `layout.tsx`), Geist Mono para código y snippets.

**Bordes** — `rounded-xl` (0.75rem) por defecto en cards y botones, `rounded-2xl` en contenedores grandes (paneles de playground, secciones destacadas).

**Espaciado** — generoso, evitar densidad. Preferir `gap-6`/`gap-8` entre bloques y `py-16`/`py-24` entre secciones.

---

# Importante

Este proyecto busca convertirse en una referencia visual e interactiva para estudiar frontend.

La prioridad absoluta es la calidad del contenido y de la experiencia de aprendizaje.

Si existe una solución más didáctica aunque requiera un poco más de trabajo, preferir esa.

Siempre privilegiar claridad, reutilización y escalabilidad.
