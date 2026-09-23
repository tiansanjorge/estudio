import type { PreguntaEntrevista } from "../types";

export const entrevistaUseEffect: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significan los distintos valores posibles del array de dependencias de useEffect?",
    respuestaEs:
      "Sin array (omitido por completo), el efecto corre después de CADA render, sin excepción. Con un array vacío `[]`, corre una sola vez, después del montaje, y nunca más (salvo su cleanup al desmontar). Con un array con valores `[a, b]`, corre después del montaje y cada vez que alguno de esos valores cambió respecto al render anterior — si ninguno cambió, el efecto se saltea en ese render.",
    respuestaEn:
      "With no array (fully omitted), the effect runs after EVERY render, no exceptions. With an empty array `[]`, it runs once, after mount, and never again (except its cleanup on unmount). With an array of values `[a, b]`, it runs after mount and every time any of those values changed compared to the previous render — if none changed, the effect is skipped that render.",
    codigo: `useEffect(() => { /* cada render */ });
useEffect(() => { /* solo al montar */ }, []);
useEffect(() => { /* al montar, y cuando cambien query o filtro */ }, [query, filtro]);`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo hace falta una función de cleanup en un useEffect?",
    respuestaEs:
      "Cuando el efecto se suscribe a algo que sigue existiendo después de que el efecto termina de correr: un event listener, un setInterval/setTimeout, una suscripción a un WebSocket, o una petición que podría seguir en curso. Sin cleanup, cada vez que el efecto se vuelve a ejecutar (o el componente se desmonta) esa suscripción sigue viva, acumulándose — listeners duplicados, timers que nadie va a cancelar, memory leaks. El cleanup es la función que el efecto retorna, y React la corre automáticamente antes de la próxima ejecución del efecto, y al desmontar el componente.",
    respuestaEn:
      "When the effect subscribes to something that keeps existing after the effect finishes running: an event listener, a setInterval/setTimeout, a WebSocket subscription, or a request that could still be in flight. Without cleanup, every time the effect re-runs (or the component unmounts) that subscription stays alive, piling up — duplicate listeners, timers nobody will cancel, memory leaks. The cleanup is the function the effect returns, and React runs it automatically before the effect's next run, and on unmount.",
    codigo: `useEffect(() => {
  const id = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(id); // cleanup: corre antes del próximo efecto y al desmontar
}, []);`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo evitarías una race condition cuando un useEffect dispara un fetch que depende de un valor que puede cambiar rápido (como un query de búsqueda)?",
    respuestaEs:
      "El problema: si el usuario cambia el query varias veces rápido, se disparan varios fetches, pero no hay garantía de que respondan en el mismo orden en que se enviaron — un fetch más viejo puede resolver DESPUÉS de uno más nuevo, sobreescribiendo el resultado correcto con uno obsoleto. La solución estándar es usar el cleanup del efecto como una bandera de 'este efecto ya no es el vigente': se declara una variable local (o se usa un AbortController) dentro del efecto, y en el cleanup se marca como cancelado o se aborta la request — al llegar la respuesta, se chequea esa bandera antes de actualizar el estado, ignorando resultados de fetches que ya quedaron obsoletos.",
    respuestaEn:
      "The problem: if the user changes the query several times fast, several fetches fire, but there's no guarantee they respond in the same order they were sent — an older fetch can resolve AFTER a newer one, overwriting the correct result with a stale one. The standard solution is using the effect's cleanup as an 'this effect is no longer current' flag: a local variable is declared (or an AbortController is used) inside the effect, and the cleanup marks it as cancelled or aborts the request — when the response arrives, that flag is checked before updating state, ignoring results from fetches that already went stale.",
    codigo: `useEffect(() => {
  let cancelado = false;

  fetch(\`/api/buscar?q=\${query}\`)
    .then((r) => r.json())
    .then((datos) => {
      if (!cancelado) setResultados(datos); // ignora respuestas obsoletas
    });

  return () => { cancelado = true; };
}, [query]);`,
    tradeoffs:
      "La bandera local es simple pero no cancela la request en curso, solo ignora su resultado — un AbortController además cancela la petición de red real, ahorrando ancho de banda, pero requiere que el endpoint/fetch soporte la señal de abort.",
    repregunta:
      "¿Cómo se vería la misma solución usando AbortController en vez de una bandera local?",
    respuestaRepreguntaEs:
      "Se crea un AbortController al inicio del efecto, se le pasa su `signal` al fetch, y en el cleanup se llama a `controller.abort()`. Si el efecto se vuelve a ejecutar (porque query cambió) antes de que la request anterior termine, React corre el cleanup, abortando esa request vieja — el fetch abortado rechaza con un AbortError, que hay que capturar y descartar explícitamente para no tratarlo como un error real.",
    respuestaRepreguntaEn:
      "An AbortController is created at the start of the effect, its `signal` is passed to fetch, and the cleanup calls `controller.abort()`. If the effect re-runs (because query changed) before the previous request finished, React runs the cleanup, aborting that old request — the aborted fetch rejects with an AbortError, which needs to be explicitly caught and discarded so it isn't treated as a real error.",
    codigoRepregunta: `useEffect(() => {
  const controller = new AbortController();

  fetch(\`/api/buscar?q=\${query}\`, { signal: controller.signal })
    .then((r) => r.json())
    .then(setResultados)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err; // ignora el abort, propaga errores reales
    });

  return () => controller.abort();
}, [query]);`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Conviene un único useEffect grande con varias responsabilidades, o varios useEffect chicos y enfocados?",
    respuestaEs:
      "Varios useEffect enfocados, cada uno con su propia razón de existir y su propio array de dependencias. Mezclar varias responsabilidades no relacionadas en un solo efecto obliga a que su array de dependencias combine TODO lo que cualquiera de esas responsabilidades necesita, disparando el efecto entero (incluida la parte que no cambió) cada vez que cualquiera de esas dependencias cambia. Separarlos deja que cada efecto reaccione solo a lo que realmente le importa, y hace más fácil razonar sobre qué efecto hace qué cuando algo falla.",
    respuestaEn:
      "Several focused useEffect calls, each with its own reason to exist and its own dependency array. Mixing several unrelated responsibilities in one effect forces its dependency array to combine EVERYTHING any of those responsibilities needs, triggering the whole effect (including the part that didn't change) every time any of those dependencies changes. Splitting them lets each effect react only to what actually matters to it, and makes it easier to reason about which effect does what when something breaks.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué problema resuelve la API experimental useEffectEvent (Effect Event), y por qué no alcanza con simplemente omitir una dependencia del array?",
    respuestaEs:
      "El problema: a veces un efecto necesita reaccionar a UN valor (por ejemplo, la conexión a un chat room cambia solo si cambia el roomId), pero dentro de ese efecto también usa otro valor que cambia seguido y NO debería disparar el efecto de nuevo (por ejemplo, un theme para loguear un mensaje de bienvenida con el theme actual). Omitir 'theme' del array de dependencias a mano es peligroso: el efecto queda con una closure sobre el valor VIEJO de theme para siempre (stale closure), ignorando actualizaciones futuras. `useEffectEvent` resuelve esto envolviendo esa lógica no-reactiva en una función especial que SIEMPRE ve la versión más reciente de sus valores capturados, sin necesitar estar en el array de dependencias del efecto ni disparar su re-ejecución — separa explícitamente 'qué dispara el efecto' (las dependencias reales) de 'qué valores necesito leer, siempre actualizados, sin que disparen nada'.",
    respuestaEn:
      "The problem: sometimes an effect needs to react to ONE value (e.g. a chat room connection changes only if roomId changes), but inside that effect it also uses another value that changes often and should NOT re-trigger the effect (e.g. a theme, to log a welcome message with the current theme). Manually omitting 'theme' from the dependency array is dangerous: the effect ends up with a closure over the OLD value of theme forever (stale closure), ignoring future updates. `useEffectEvent` solves this by wrapping that non-reactive logic in a special function that ALWAYS sees the latest version of its captured values, without needing to be in the effect's dependency array or triggering its re-execution — it explicitly separates 'what triggers the effect' (the real dependencies) from 'what values I need to read, always up to date, without triggering anything'.",
    codigo: `function ChatRoom({ roomId, theme }) {
  const onConectar = useEffectEvent(() => {
    mostrarNotificacion(\`Conectado, tema: \${theme}\`); // siempre ve el theme actual
  });

  useEffect(() => {
    const conexion = crearConexion(roomId);
    conexion.on('conectado', () => onConectar());
    return () => conexion.desconectar();
  }, [roomId]); // solo roomId dispara el efecto; theme no está ni hace falta
}`,
    repregunta:
      "¿Por qué React Strict Mode invoca dos veces el ciclo montar→limpiar→montar de los efectos en desarrollo, específicamente?",
    respuestaRepreguntaEs:
      "Para exponer efectos con cleanup faltante o incorrecto. Si un efecto se suscribe a algo pero su cleanup no desuscribe correctamente, el patrón montar→limpiar→montar de Strict Mode deja DOS suscripciones activas después del segundo montaje (la del primer montaje, que el cleanup no llegó a remover bien, más la del segundo) — un bug que en un solo montaje normal podría pasar completamente desapercibido en desarrollo y aparecer recién en producción, bajo un patrón de uso distinto (por ejemplo, con Fast Refresh, o con Suspense reintentando montar un componente). Ver el mismo log o efecto duplicado en consola durante desarrollo es la señal de que el cleanup no está deshaciendo correctamente todo lo que el efecto hizo.",
    respuestaRepreguntaEn:
      "To expose effects with missing or incorrect cleanup. If an effect subscribes to something but its cleanup doesn't properly unsubscribe, Strict Mode's mount→cleanup→mount pattern leaves TWO active subscriptions after the second mount (the first mount's, which the cleanup didn't properly remove, plus the second's) — a bug that in a single normal mount could go completely unnoticed in development and only show up in production, under a different usage pattern (e.g. with Fast Refresh, or with Suspense retrying to mount a component). Seeing the same log or effect duplicated in the console during development is the signal that the cleanup isn't properly undoing everything the effect did.",
  },
];
