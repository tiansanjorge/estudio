import type { PreguntaEntrevista } from "../types";

export const entrevistaTestingComponentesRtl: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Cuál es la filosofía de React Testing Library y en qué se diferencia de Enzyme?",
    respuestaEs:
      "Su principio es 'cuanto más se parezcan tus tests a cómo se usa tu software, más confianza te dan'. Por eso RTL no expone el estado interno, las props ni los métodos de los componentes: renderiza al DOM y ofrece formas de encontrar elementos como lo haría un usuario (por rol, por label, por texto) e interactuar con ellos (clicks, escritura). Enzyme, la librería anterior, permitía inspeccionar el árbol de componentes, leer el estado y llamar métodos internos, lo que producía tests atados a la implementación: cambiar un `useState` por un `useReducer`, o dividir un componente en dos, rompía tests aunque el usuario viera exactamente lo mismo. Con RTL, un refactor que no cambia el comportamiento no rompe los tests, y un test que pasa da confianza real de que la UI funciona. Enzyme además dejó de mantenerse y no soporta las versiones modernas de React.",
    respuestaEn:
      "Its principle is 'the more your tests resemble the way your software is used, the more confidence they give you'. So RTL doesn't expose components' internal state, props or methods: it renders to the DOM and provides ways to find elements the way a user would (by role, label, text) and interact with them (clicks, typing). Enzyme, the previous library, allowed inspecting the component tree, reading state and calling internal methods, producing implementation-bound tests: swapping a `useState` for a `useReducer`, or splitting a component in two, broke tests even though the user saw exactly the same thing. With RTL, a refactor that doesn't change behavior doesn't break tests, and a passing test gives real confidence the UI works. Enzyme is also unmaintained and doesn't support modern React versions.",
  },
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre `getBy`, `queryBy` y `findBy`?",
    respuestaEs:
      "Cambian qué pasa cuando el elemento no está y si esperan. `getBy` es sincrónico y LANZA un error si no encuentra el elemento (o si encuentra más de uno), con el DOM impreso para diagnosticar: es la opción por defecto para lo que tiene que estar. `queryBy` es sincrónico y devuelve `null` si no lo encuentra, sin lanzar: es la única forma de afirmar que algo NO está (`expect(queryByRole('alert')).not.toBeInTheDocument()`). `findBy` es asincrónico: devuelve una Promise que reintenta hasta encontrar el elemento o agotar un timeout (1 segundo por defecto), así que se usa para lo que aparece después de una respuesta de red, un timeout o una transición; equivale a `waitFor` con un `getBy` adentro. Cada una tiene su versión `All` (`getAllBy`, etc.) para múltiples elementos.",
    respuestaEn:
      "They change what happens when the element isn't there and whether they wait. `getBy` is synchronous and THROWS if it doesn't find the element (or finds more than one), printing the DOM to help diagnose: it's the default for what must be present. `queryBy` is synchronous and returns `null` if not found, without throwing: it's the only way to assert something is NOT there (`expect(queryByRole('alert')).not.toBeInTheDocument()`). `findBy` is asynchronous: it returns a Promise that retries until the element is found or a timeout expires (1 second by default), so it's used for what appears after a network response, a timeout or a transition; it's equivalent to `waitFor` with a `getBy` inside. Each has an `All` version (`getAllBy`, etc.) for multiple elements.",
  },
  {
    nivel: 2,
    pregunta: "¿Por qué se recomienda `userEvent` en lugar de `fireEvent`?",
    respuestaEs:
      "`fireEvent` dispara UN evento del DOM de forma sintética: `fireEvent.change(input, { target: { value: 'hola' } })` cambia el valor de golpe. Un usuario real, en cambio, al escribir genera una secuencia: foco, keydown, keypress, input, keyup por cada tecla. `userEvent` simula esa secuencia completa: respeta si el elemento está deshabilitado o es de solo lectura, mueve el foco, dispara los eventos intermedios, maneja selección de texto, pegar, Tab entre campos. Eso atrapa bugs que `fireEvent` no ve: un handler en `onKeyDown`, un campo con `maxLength`, un botón deshabilitado que igual 'se clickea'. Desde la versión 14 se usa creando una instancia con `userEvent.setup()` al inicio del test, y todas sus acciones son async (`await user.click(...)`). `fireEvent` queda para eventos que userEvent no cubre, como un `scroll` o eventos custom.",
    respuestaEn:
      "`fireEvent` dispatches ONE synthetic DOM event: `fireEvent.change(input, { target: { value: 'hello' } })` changes the value at once. A real user typing generates a sequence: focus, keydown, keypress, input, keyup per key. `userEvent` simulates that full sequence: it respects disabled or read-only elements, moves focus, fires intermediate events, handles text selection, paste, Tab between fields. That catches bugs `fireEvent` misses: an `onKeyDown` handler, a field with `maxLength`, a disabled button that still 'gets clicked'. Since v14 you create an instance with `userEvent.setup()` at the start of the test, and all actions are async (`await user.click(...)`). `fireEvent` remains for events userEvent doesn't cover, like `scroll` or custom events.",
    codigo: `it("envía el formulario con Enter", async () => {
  const user = userEvent.setup();
  render(<Login onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Email"), "ana@mail.com");
  await user.type(screen.getByLabelText("Contraseña"), "secreto{Enter}");

  expect(onSubmit).toHaveBeenCalledWith({ email: "ana@mail.com", password: "secreto" });
});`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo testeás un componente que usa un Context, un router o React Query?",
    respuestaEs:
      "Envolviéndolo en los mismos providers que usa la app, en vez de mockear los hooks. Lo práctico es un `render` custom en un archivo de utilidades de test (`test-utils.tsx`) que acepta el componente y opciones (ruta inicial, usuario logueado, estado inicial), arma los providers (router en memoria, QueryClientProvider, ThemeProvider, el context de auth) y llama al `render` de RTL con la opción `wrapper`. Los tests importan ese `render` en lugar del original. Para React Query hay dos detalles: crear un `QueryClient` NUEVO por test (si se comparte, el cache de un test contamina al siguiente) y desactivar los reintentos (`retry: false`), porque si no, un test de error espera los reintentos con backoff y se vuelve lento o se agota el timeout. La red se simula con MSW, así el componente, el hook y la librería corren de verdad.",
    respuestaEn:
      "By wrapping it in the same providers the app uses, rather than mocking the hooks. The practical approach is a custom `render` in a test utilities file (`test-utils.tsx`) that takes the component and options (initial route, logged-in user, initial state), sets up the providers (in-memory router, QueryClientProvider, ThemeProvider, auth context) and calls RTL's `render` with the `wrapper` option. Tests import that `render` instead of the original. For React Query there are two details: create a NEW `QueryClient` per test (if shared, one test's cache contaminates the next) and disable retries (`retry: false`), because otherwise an error test waits for retries with backoff and becomes slow or times out. The network is mocked with MSW, so component, hook and library run for real.",
    codigo: `export function renderConProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}`,
  },
  {
    nivel: 3,
    pregunta: "¿Qué significa el warning 'not wrapped in act(...)' y cómo se resuelve bien?",
    respuestaEs:
      "`act` es el mecanismo de React para asegurar que todas las actualizaciones de estado, efectos y renders pendientes se procesaron antes de hacer asserts. RTL ya envuelve en `act` el `render`, los eventos de `userEvent` y las utilidades async (`findBy`, `waitFor`). El warning aparece cuando el estado cambia FUERA de eso: típicamente una respuesta de red o un timeout que termina después de que el test ya hizo su último assert, o cuando el test terminó sin esperar algo que seguía en curso. La solución NO es envolver cosas en `act` a mano ni silenciar el warning: es esperar el resultado de esa actualización como lo vería el usuario, con `await screen.findBy...` o `await waitFor(...)` sobre el estado final. Si el warning aparece por algo que el test no verifica (un efecto que se dispara al final), es señal de que el test no está esperando todo lo que el componente hace, y puede volverse flaky.",
    respuestaEn:
      "`act` is React's mechanism to ensure all pending state updates, effects and renders are processed before asserting. RTL already wraps `render`, `userEvent` events and async utilities (`findBy`, `waitFor`) in `act`. The warning appears when state changes OUTSIDE of that: typically a network response or timeout finishing after the test already made its last assertion, or when the test ended without awaiting something still in progress. The fix is NOT wrapping things in `act` manually or silencing the warning: it's awaiting that update's outcome as the user would see it, with `await screen.findBy...` or `await waitFor(...)` on the final state. If the warning comes from something the test doesn't verify (an effect firing at the end), it signals the test isn't waiting for everything the component does, and it may become flaky.",
  },
  {
    nivel: 3,
    pregunta: "¿Cuáles son los errores más comunes con `waitFor`?",
    respuestaEs:
      "Varios. Poner varios asserts adentro: `waitFor` reintenta la función completa hasta que no lance, así que con varios `expect` el mensaje de error solo muestra el primero que falla y es más lento; va UNO, y el resto después. Meter efectos secundarios adentro (un click, un `user.type`): se ejecutan en cada reintento, repitiendo la acción; las acciones van fuera. Usar `waitFor` con un `getBy` cuando existe `findBy`, que hace lo mismo con mejor mensaje. Usarlo 'por las dudas' en asserts que son sincrónicos, lo que esconde el hecho de que no había nada que esperar. Y usar `waitFor` para esperar que algo DESAPAREZCA con un `getBy` adentro, cuando existe `waitForElementToBeRemoved`. Por último, el timeout por defecto de un segundo: si algo tarda más en el test, suele ser un problema del setup (reintentos de React Query, timers reales) más que una razón para subir el timeout.",
    respuestaEn:
      "Several. Putting multiple assertions inside: `waitFor` retries the whole callback until it stops throwing, so with several `expect`s the error only shows the first failing one and it's slower; put ONE inside and the rest after. Putting side effects inside (a click, a `user.type`): they run on every retry, repeating the action; actions go outside. Using `waitFor` with a `getBy` when `findBy` exists, which does the same with a better message. Using it 'just in case' on synchronous assertions, hiding the fact there was nothing to wait for. And using `waitFor` to wait for something to DISAPPEAR with a `getBy` inside, when `waitForElementToBeRemoved` exists. Finally, the default one-second timeout: if something takes longer in a test, it's usually a setup problem (React Query retries, real timers) rather than a reason to raise the timeout.",
    codigo: `// ❌ la acción se repite en cada reintento y hay dos asserts
await waitFor(() => {
  user.click(boton);
  expect(screen.getByText("Guardado")).toBeInTheDocument();
  expect(onSave).toHaveBeenCalled();
});

// ✅
await user.click(boton);
expect(await screen.findByText("Guardado")).toBeInTheDocument();
expect(onSave).toHaveBeenCalled();`,
  },
];
