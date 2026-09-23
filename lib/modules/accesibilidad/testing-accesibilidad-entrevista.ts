import type { PreguntaEntrevista } from "../types";

export const entrevistaTestingAccesibilidad: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cómo testeás la accesibilidad de una aplicación?",
    respuestaEs:
      "En capas, porque ninguna herramienta sola alcanza. Primero, automático: eslint-plugin-jsx-a11y en el editor para errores en el código, y axe (con la extensión de DevTools, Lighthouse, o integrado en los tests) para problemas en el DOM renderizado: imágenes sin alt, inputs sin label, contraste, ARIA inválido. Eso encuentra una parte de los problemas; las estimaciones van de un tercio a poco más de la mitad según cómo se cuente. Segundo, manual con teclado: recorrer los flujos principales sin mouse, verificando que todo sea alcanzable, que el orden tenga sentido, que el foco se vea y que no haya trampas. Tercero, con lector de pantalla (VoiceOver en Mac, NVDA en Windows) en los flujos críticos: escuchar si los nombres, estados y anuncios tienen sentido. Y cuando se puede, pruebas con usuarios reales que usan tecnologías asistivas.",
    respuestaEn:
      "In layers, because no single tool is enough. First, automated: eslint-plugin-jsx-a11y in the editor for code errors, and axe (via the DevTools extension, Lighthouse, or integrated in tests) for issues in the rendered DOM: images without alt, inputs without labels, contrast, invalid ARIA. That finds a share of the problems; estimates range from a third to just over half depending on how you count. Second, manual keyboard testing: going through the main flows without a mouse, checking everything is reachable, order makes sense, focus is visible and there are no traps. Third, with a screen reader (VoiceOver on Mac, NVDA on Windows) on critical flows: listening to whether names, states and announcements make sense. And when possible, testing with real users of assistive technologies.",
  },
  {
    nivel: 1,
    pregunta: "¿Por qué un Lighthouse de 100 en accesibilidad no significa que la página sea accesible?",
    respuestaEs:
      "Porque Lighthouse corre un subconjunto de las reglas de axe, y las reglas automáticas solo pueden verificar lo que es comprobable mirando el DOM: que un atributo exista, que un rol tenga sus atributos obligatorios, que el contraste calculado alcance. No pueden juzgar significado ni comportamiento: si el alt describe la imagen o dice 'imagen', si un div con onClick responde al teclado, si el modal devuelve el foco, si el orden de Tab coincide con el visual, si un error comunicado solo con color se entiende. Una página puede tener 100 y ser inusable con teclado. El puntaje es un piso útil para no tener errores obvios, no una certificación.",
    respuestaEn:
      "Because Lighthouse runs a subset of axe's rules, and automated rules can only verify what's checkable by looking at the DOM: that an attribute exists, that a role has its required attributes, that computed contrast is sufficient. They can't judge meaning or behavior: whether alt describes the image or says 'image', whether a div with onClick responds to keyboard, whether the modal returns focus, whether Tab order matches the visual order, whether a color-only error is understandable. A page can score 100 and be unusable by keyboard. The score is a useful floor against obvious errors, not a certification.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo integrás pruebas de accesibilidad en el pipeline de un proyecto React?",
    respuestaEs:
      "En tres niveles. En tests de componentes, con jest-axe o vitest-axe: se renderiza el componente con Testing Library y se corre axe sobre el resultado, idealmente en sus distintos estados (abierto, con error, deshabilitado). En e2e, con @axe-core/playwright sobre las páginas reales, lo que sí permite chequear contraste porque hay un navegador con layout. Y en Storybook, con el addon de a11y, que muestra las violaciones mientras se desarrolla cada componente. Además, usar las queries de Testing Library por rol y nombre (`getByRole('button', { name: 'Guardar' })`) ya es un test de accesibilidad implícito: si el botón no tiene nombre accesible, el test no lo encuentra. En CI conviene que las violaciones rompan el build; en un proyecto legacy con cientos de violaciones, se empieza con una línea base y se bloquea solo lo nuevo.",
    respuestaEn:
      "At three levels. In component tests, with jest-axe or vitest-axe: render the component with Testing Library and run axe on the result, ideally in its different states (open, with error, disabled). In e2e, with @axe-core/playwright on real pages, which does allow checking contrast because there's a browser with layout. And in Storybook, with the a11y addon, which shows violations while developing each component. Also, using Testing Library queries by role and name (`getByRole('button', { name: 'Save' })`) is already an implicit accessibility test: if the button has no accessible name, the test can't find it. In CI violations should break the build; in a legacy project with hundreds of violations, start with a baseline and block only new ones.",
    codigo: `import { axe } from "vitest-axe";

it("el formulario con errores no tiene violaciones", async () => {
  const { container } = render(<Registro />);
  await userEvent.click(screen.getByRole("button", { name: "Registrarme" }));

  expect(await axe(container)).toHaveNoViolations();
  expect(screen.getByRole("textbox", { name: "Email" }))
    .toHaveAttribute("aria-invalid", "true");
});`,
  },
  {
    nivel: 2,
    pregunta: "¿Por qué preferir `getByRole` sobre `getByTestId` en Testing Library tiene que ver con accesibilidad?",
    respuestaEs:
      "Porque `getByRole` busca el elemento de la misma forma que lo encuentra una tecnología asistiva: por su rol en el árbol de accesibilidad y su nombre accesible. Si alguien cambia un `<button>` por un `<div onClick>`, o saca el `aria-label` de un botón de ícono, el test falla, cuando con `getByTestId` seguiría pasando porque el `data-testid` sigue ahí. Así, los tests de comportamiento cubren de paso una parte de la accesibilidad sin escribir tests aparte, y además quedan más desacoplados de la implementación. Testing Library recomienda explícitamente este orden de prioridad: primero queries accesibles para todos (role, label, text), y `testId` como último recurso.",
    respuestaEn:
      "Because `getByRole` finds the element the same way assistive technology does: by its role in the accessibility tree and its accessible name. If someone swaps a `<button>` for a `<div onClick>`, or removes an icon button's `aria-label`, the test fails, whereas with `getByTestId` it would still pass because the `data-testid` is still there. So behavior tests cover part of accessibility along the way without writing separate tests, and they're also less coupled to implementation. Testing Library explicitly recommends this priority: first queries accessible to everyone (role, label, text), and `testId` as a last resort.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué limitaciones tiene correr axe en jsdom (jest-axe/vitest-axe)?",
    respuestaEs:
      "jsdom no tiene motor de layout ni de render: no calcula estilos reales en cascada completa, tamaños ni posiciones. Por eso la regla de contraste (`color-contrast`) no puede funcionar y se suele desactivar; tampoco se detecta contenido oculto visualmente de forma confiable, ni tamaños de target táctil, ni problemas que dependen del viewport (zoom, reflow, orientación). Además axe solo ve el estado del DOM en el momento en que se lo llama: si el test no abre el menú o no dispara el error, esos estados no se auditan. Por eso los tests de componente con axe son rápidos y útiles para regresiones estructurales, pero hay que complementarlos con axe en un navegador real (Playwright) para contraste y layout, y con pruebas manuales para comportamiento.",
    respuestaEn:
      "jsdom has no layout or rendering engine: it doesn't compute real fully-cascaded styles, sizes or positions. So the contrast rule (`color-contrast`) can't work and is usually disabled; it also can't reliably detect visually hidden content, touch target sizes, or viewport-dependent problems (zoom, reflow, orientation). Also, axe only sees the DOM state at the moment it's called: if the test doesn't open the menu or trigger the error, those states aren't audited. So component tests with axe are fast and useful for structural regressions, but they must be complemented with axe in a real browser (Playwright) for contrast and layout, and with manual testing for behavior.",
  },
  {
    nivel: 3,
    pregunta:
      "axe se define con una filosofía de 'cero falsos positivos'. ¿Qué implica eso, y qué hacés con los resultados 'incomplete'?",
    respuestaEs:
      "Implica que axe prefiere NO reportar un problema antes que reportar uno que podría no serlo: una violación de axe es casi siempre un error real, lo que permite bloquear el CI con ella sin que el equipo aprenda a ignorar alertas. El costo es que muchos casos dudosos quedan fuera de `violations` y van a `incomplete` ('needs review'): por ejemplo, contraste de texto sobre una imagen o un gradiente, donde no puede calcular el fondo. Esos resultados no deben romper el build (serían ruido), pero tampoco ignorarse: conviene registrarlos y revisarlos a mano periódicamente, o en el PR cuando aparecen nuevos. Es un buen ejemplo de un trade-off de diseño de herramientas: precisión a costa de cobertura, para que la herramienta sea confiable en automatización.",
    respuestaEn:
      "It means axe prefers NOT reporting a problem over reporting one that might not be: an axe violation is almost always a real error, which lets you block CI on it without the team learning to ignore alerts. The cost is that many doubtful cases stay out of `violations` and go to `incomplete` ('needs review'): e.g. contrast of text over an image or gradient, where it can't compute the background. Those results shouldn't break the build (they'd be noise), but shouldn't be ignored either: log them and review them manually periodically, or in the PR when new ones appear. It's a good example of a tool design trade-off: precision at the cost of coverage, so the tool is trustworthy in automation.",
    repregunta: "¿Con qué combinaciones de lector de pantalla y navegador probarías?",
    respuestaRepreguntaEs:
      "Con las que usa la gente real, según la encuesta de WebAIM: NVDA con Chrome o Firefox y JAWS con Chrome en Windows (la mayoría de los usuarios de escritorio), VoiceOver con Safari en macOS e iOS (dominante en mobile), y TalkBack con Chrome en Android. Los lectores funcionan mejor con ciertos navegadores, así que combinar VoiceOver con Chrome, por ejemplo, puede mostrar problemas que los usuarios reales no tienen. Para el día a día alcanza con uno (el que esté en tu sistema operativo) en los flujos críticos; la matriz completa se reserva para releases importantes o auditorías.",
    respuestaRepreguntaEn:
      "The ones real people use, per the WebAIM survey: NVDA with Chrome or Firefox and JAWS with Chrome on Windows (most desktop users), VoiceOver with Safari on macOS and iOS (dominant on mobile), and TalkBack with Chrome on Android. Readers work best with certain browsers, so pairing VoiceOver with Chrome, for example, can show problems real users don't have. Day to day, one (whichever your OS has) on critical flows is enough; the full matrix is reserved for major releases or audits.",
  },
];
