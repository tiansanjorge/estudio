import type { PreguntaEntrevista } from "../types";

export const entrevistaErrorBoundaries: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un error boundary y qué errores captura exactamente?",
    respuestaEs:
      "Es un componente (obligatoriamente de clase) que captura errores de JavaScript lanzados durante el render, en métodos de ciclo de vida, o en constructores de cualquier componente descendiente en su árbol, y en vez de dejar que ese error tire abajo toda la aplicación, muestra una UI de fallback. Se implementa con el método estático `getDerivedStateFromError` (para calcular el estado de fallback) y/o `componentDidCatch` (para efectos secundarios como loguear el error).",
    respuestaEn:
      "It's a component (necessarily a class) that catches JavaScript errors thrown during rendering, in lifecycle methods, or in constructors of any descendant component in its tree, and instead of letting that error crash the whole application, it shows a fallback UI. It's implemented with the static method `getDerivedStateFromError` (to compute the fallback state) and/or `componentDidCatch` (for side effects like logging the error).",
    codigo: `class ErrorBoundary extends React.Component {
  state = { tieneError: false };

  static getDerivedStateFromError() {
    return { tieneError: true };
  }

  render() {
    if (this.state.tieneError) return <p>Algo salió mal.</p>;
    return this.props.children;
  }
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué envolver toda la app en un único error boundary en la raíz no es suficiente?",
    respuestaEs:
      "Porque un error en cualquier parte de la app tira abajo TODO lo que ese boundary envuelve — si es toda la app, un bug en un widget secundario (por ejemplo, un gráfico de estadísticas que falla al parsear un dato) deja a los usuarios sin poder usar nada, ni siquiera las partes de la app que funcionan perfectamente. Conviene colocar boundaries más granulares alrededor de secciones independientes (un widget, una tarjeta, una ruta), para que el fallo de una parte no arrastre al resto.",
    respuestaEn:
      "Because an error anywhere in the app brings down EVERYTHING that boundary wraps — if it's the whole app, a bug in a secondary widget (e.g. a stats chart that fails parsing some data) leaves users unable to use anything, not even the parts of the app that work perfectly fine. It's better to place more granular boundaries around independent sections (a widget, a card, a route), so one part failing doesn't drag down the rest.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué errores NO captura un error boundary, aunque estén relacionados con el componente que envuelve?",
    respuestaEs:
      "No captura errores dentro de event handlers (un onClick que lanza una excepción no activa el boundary — hay que usar try/catch ahí directamente), errores en código asincrónico (dentro de un setTimeout o una Promise que rechaza sin manejar), errores durante server-side rendering, ni errores lanzados en el propio error boundary (esos se propagan al boundary ancestro más cercano, si existe). El error boundary solo cubre el flujo síncrono de render y lifecycle de React.",
    respuestaEn:
      "It doesn't catch errors inside event handlers (an onClick that throws doesn't trigger the boundary — you need try/catch there directly), errors in asynchronous code (inside a setTimeout or an unhandled rejecting Promise), errors during server-side rendering, or errors thrown inside the error boundary itself (those propagate to the nearest ancestor boundary, if one exists). The error boundary only covers React's synchronous render and lifecycle flow.",
    codigo: `function Boton() {
  function manejarClick() {
    throw new Error('esto NO lo captura el error boundary');
    // hace falta: try { ... } catch (e) { manejarErrorManualmente(e); }
  }
  return <button onClick={manejarClick}>Click</button>;
}`,
    tradeoffs:
      "Boundaries granulares dan mejor resiliencia (un fallo no tumba toda la app), pero agregan boilerplate: cada sección envuelta necesita su propio fallback UI pensado, en vez de uno solo genérico para toda la app.",
    repregunta:
      "¿Dónde conviene loguear un error capturado por el boundary a un servicio externo (Sentry, por ejemplo): en getDerivedStateFromError o en componentDidCatch?",
    respuestaRepreguntaEs:
      "En `componentDidCatch`, nunca en `getDerivedStateFromError`. `getDerivedStateFromError` corre durante la fase de RENDER, que React puede llamar múltiples veces o descartar (por ejemplo, en Concurrent Mode al abortar un render especulativo) — debe ser una función pura, sin efectos secundarios, solo devolver el nuevo estado. `componentDidCatch` corre en la fase de COMMIT, que sí es segura para efectos secundarios como una llamada de red a un servicio de logging, porque solo se ejecuta una vez que React confirmó que ese render se aplica de verdad.",
    respuestaRepreguntaEn:
      "In `componentDidCatch`, never in `getDerivedStateFromError`. `getDerivedStateFromError` runs during the RENDER phase, which React can call multiple times or discard (e.g. in Concurrent Mode when aborting a speculative render) — it must be a pure function, with no side effects, only returning the new state. `componentDidCatch` runs in the COMMIT phase, which is safe for side effects like a network call to a logging service, because it only runs once React has confirmed that render is actually being applied.",
    codigoRepregunta: `class ErrorBoundary extends React.Component {
  state = { tieneError: false };

  static getDerivedStateFromError() {
    return { tieneError: true }; // puro, sin efectos secundarios
  }

  componentDidCatch(error, info) {
    enviarASentry(error, info); // efecto secundario: seguro acá
  }

  render() { /* ... */ }
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo resetearías un error boundary para que el usuario pueda 'reintentar' sin recargar toda la página?",
    respuestaEs:
      "Guardando en el estado del boundary una bandera de error, y exponiendo en el fallback un botón que resetea ese estado a `tieneError: false`, volviendo a intentar renderizar los children. Un patrón alternativo, útil cuando el error viene de cambiar de contexto (por ejemplo, navegar a una ruta distinta), es cambiarle la `key` al boundary: React lo desmonta y monta de cero, empezando limpio sin arrastrar el estado de error anterior.",
    respuestaEn:
      "By keeping an error flag in the boundary's state, and exposing a button in the fallback that resets that state to `hasError: false`, retrying to render the children. An alternative pattern, useful when the error comes from a context change (e.g. navigating to a different route), is changing the boundary's `key`: React unmounts and remounts it from scratch, starting clean without carrying over the previous error state.",
    codigo: `class ErrorBoundary extends React.Component {
  state = { tieneError: false };
  static getDerivedStateFromError() { return { tieneError: true }; }
  reintentar = () => this.setState({ tieneError: false });

  render() {
    if (this.state.tieneError) {
      return <button onClick={this.reintentar}>Reintentar</button>;
    }
    return this.props.children;
  }
}

// reset automático al cambiar de ruta:
<ErrorBoundary key={rutaActual}>{contenido}</ErrorBoundary>`,
  },
  {
    nivel: 3,
    pregunta:
      "¿En qué se diferencia cómo Suspense y un error boundary 'capturan' algo durante el render, aunque ambos parezcan mecanismos similares?",
    respuestaEs:
      "Suspense captura una Promise lanzada (throw) por un componente que todavía no tiene los datos listos, y usa eso como señal para mostrar un fallback de carga mientras esa promesa se resuelve — no es un error, es una señal de 'todavía no, esperá'. Un error boundary captura errores reales (instancias de Error u otros valores lanzados que representan una falla, no una espera) durante el render o lifecycle. Ambos usan el mecanismo de 'lanzar algo durante el render y que un ancestro lo intercepte', pero versionan situaciones semánticamente distintas: uno es 'esto va a tardar', el otro es 'esto se rompió'. Por eso pueden convivir en el mismo árbol: un Suspense boundary maneja la espera, un error boundary (colocado típicamente por fuera del Suspense) maneja el fallo real si la carga de datos termina rechazando.",
    respuestaEn:
      "Suspense catches a thrown Promise from a component that doesn't have its data ready yet, and uses that as a signal to show a loading fallback while that promise resolves — it's not an error, it's a 'not yet, wait' signal. An error boundary catches real errors (Error instances or other thrown values representing a failure, not a wait) during render or lifecycle. Both use the mechanism of 'throw something during render and have an ancestor intercept it', but they version semantically different situations: one is 'this will take a while', the other is 'this broke'. That's why they can coexist in the same tree: a Suspense boundary handles the wait, an error boundary (typically placed outside the Suspense) handles the real failure if the data loading ends up rejecting.",
    codigo: `<ErrorBoundary fallback={<p>Falló la carga</p>}>
  <Suspense fallback={<Spinner />}>
    <ComponenteQueSuspende />
    {/* si suspende: Suspense muestra el spinner */}
    {/* si su promesa rechaza con un error real: sube al ErrorBoundary */}
  </Suspense>
</ErrorBoundary>`,
    repregunta:
      "Si el propio fallback de un error boundary lanza un error al renderizarse, ¿qué pasa?",
    respuestaRepreguntaEs:
      "Ese error se propaga hacia arriba, al error boundary ANCESTRO más cercano (si existe alguno más arriba en el árbol) — el boundary que falló no puede capturar su propio error de render, porque `getDerivedStateFromError` ya corrió y produjo el estado que causó ese render fallido. Si no hay ningún boundary más arriba, el error llega hasta la raíz y React desmonta toda la aplicación, mostrando la pantalla en blanco característica de un error no capturado por ningún boundary. Por eso el fallback de un error boundary debe ser deliberadamente simple y robusto — es la última línea de defensa, no debería depender de datos que también podrían fallar.",
    respuestaRepreguntaEn:
      "That error propagates upward, to the nearest ANCESTOR error boundary (if one exists further up the tree) — the boundary that failed can't catch its own render error, because `getDerivedStateFromError` already ran and produced the state that caused that failed render. If there's no boundary further up, the error reaches the root and React unmounts the entire application, showing the characteristic blank screen of an error not caught by any boundary. That's why an error boundary's fallback should be deliberately simple and robust — it's the last line of defense, and shouldn't depend on data that could also fail.",
    codigoRepregunta: `function FallbackRiesgoso({ datosDelError }) {
  return <p>{datosDelError.mensaje.toUpperCase()}</p>;
  // si datosDelError es undefined, ESTE render también falla,
  // y sube al boundary ancestro (o tumba la app si no hay ninguno)
}`,
  },
];
