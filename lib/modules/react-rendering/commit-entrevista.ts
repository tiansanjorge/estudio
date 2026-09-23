import type { PreguntaEntrevista } from "../types";

export const entrevistaCommit: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué hace React específicamente durante la fase de Commit?",
    respuestaEs:
      "Aplica al DOM real, de forma sincrónica y sin interrupciones, los cambios que Reconciliation decidió que hacían falta: inserta nodos nuevos, actualiza atributos y texto, elimina lo que ya no corresponde, y conecta los ref a sus elementos reales. Es la única fase donde React efectivamente toca el DOM del navegador.",
    respuestaEn:
      "It applies to the real DOM, synchronously and without interruptions, the changes Reconciliation decided were needed: inserting new nodes, updating attributes and text, removing what's no longer needed, and attaching refs to their real elements. It's the only phase where React actually touches the browser's DOM.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿por qué leer ref.current dentro del cuerpo del componente (no en un efecto) casi siempre da null o un valor viejo?",
    respuestaEs:
      "Porque los refs recién se conectan a sus elementos reales durante el Commit, que ocurre DESPUÉS de que el cuerpo del componente ya terminó de ejecutarse (esa ejecución es la fase de Render). Leer ref.current en el cuerpo del componente lee el valor de ANTES de este commit — típicamente null en el primer render, o el nodo del render anterior en renders posteriores. Para acceder al DOM ya actualizado hace falta un useEffect o useLayoutEffect, que corren después del commit.",
    respuestaEn:
      "Because refs only get attached to their real elements during Commit, which happens AFTER the component's body already finished executing (that execution is the Render phase). Reading ref.current in the component's body reads the value from BEFORE this commit — typically null on the first render, or the previous render's node on later ones. To access the already-updated DOM you need a useEffect or useLayoutEffect, which run after commit.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirve getSnapshotBeforeUpdate (en componentes de clase), y qué problema resuelve que ni useLayoutEffect puede resolver directamente?",
    respuestaEs:
      "Captura información del DOM justo ANTES de que React lo mute — por ejemplo, la posición de scroll actual de un contenedor, antes de que se le agreguen nuevos elementos arriba. El valor que retorna se pasa como argumento a componentDidUpdate, ya después del commit, permitiendo ajustar algo (como restaurar el scroll) usando tanto el estado 'antes' como el 'después' del cambio. useLayoutEffect corre DESPUÉS de que el DOM ya se mutó, así que no puede ver cómo estaba el DOM inmediatamente antes del cambio — para ese caso específico (comparar antes/después de la mutación) getSnapshotBeforeUpdate es la herramienta correcta, aunque solo existe en la API de clases.",
    respuestaEn:
      "It captures DOM information right BEFORE React mutates it — for example, a container's current scroll position, before new items get prepended to it. The value it returns gets passed as an argument to componentDidUpdate, already after commit, allowing you to adjust something (like restoring scroll) using both the 'before' and 'after' state of the change. useLayoutEffect runs AFTER the DOM was already mutated, so it can't see how the DOM looked right before the change — for that specific case (comparing before/after the mutation) getSnapshotBeforeUpdate is the right tool, though it only exists in the class API.",
    codigo: `class ListaChat extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    if (prevProps.mensajes.length < this.props.mensajes.length) {
      return this.listaRef.current.scrollHeight; // captura ANTES de mutar
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshotAltura) {
    if (snapshotAltura !== null) {
      this.listaRef.current.scrollTop += this.listaRef.current.scrollHeight - snapshotAltura;
    }
  }
}`,
    tradeoffs:
      "getSnapshotBeforeUpdate solo existe en componentes de clase; en función, el patrón equivalente requiere guardar el valor 'antes' manualmente en una ref dentro de un useLayoutEffect del render anterior, lo cual es menos directo.",
    repregunta:
      "¿Para qué sirve useInsertionEffect, y por qué corre incluso antes que useLayoutEffect?",
    respuestaRepreguntaEs:
      "useInsertionEffect es un hook de nicho, pensado casi exclusivamente para librerías de CSS-in-JS: corre ANTES de que React mute el DOM (más temprano que useLayoutEffect), específicamente para inyectar reglas de estilo (`<style>`) en el documento antes de que cualquier layout effect intente medir el DOM. Si los estilos se inyectaran después de las mutaciones normales (como haría un useLayoutEffect), un layout effect que mide un elemento podría hacerlo ANTES de que sus estilos definitivos estén aplicados, dando medidas incorrectas. El orden real es: useInsertionEffect → mutaciones del DOM (commit) → refs conectados → useLayoutEffect → paint del navegador → useEffect.",
    respuestaRepreguntaEn:
      "useInsertionEffect is a niche hook, meant almost exclusively for CSS-in-JS libraries: it runs BEFORE React mutates the DOM (earlier than useLayoutEffect), specifically to inject style rules (`<style>`) into the document before any layout effect tries to measure the DOM. If styles were injected after the normal mutations (as a useLayoutEffect would), a layout effect measuring an element could do so BEFORE its final styles were applied, giving incorrect measurements. The real order is: useInsertionEffect → DOM mutations (commit) → refs attached → useLayoutEffect → browser paint → useEffect.",
    codigoRepregunta: `// orden real de ejecución en cada actualización:
// 1. useInsertionEffect (inyectar CSS, antes de mutar el DOM)
// 2. React muta el DOM real (commit)
// 3. refs quedan conectados a los nodos reales
// 4. useLayoutEffect (sincrónico, antes del paint)
// 5. el navegador pinta la pantalla
// 6. useEffect (asincrónico, después del paint)`,
  },
  {
    nivel: 2,
    pregunta:
      "En un árbol con varios componentes que tienen useLayoutEffect, ¿en qué orden corren entre sí?",
    respuestaEs:
      "De abajo hacia arriba: los layout effects de los componentes hijos corren ANTES que los de sus padres, para cada actualización. Esto tiene sentido porque, para cuando el layout effect de un padre se ejecuta, sus hijos ya terminaron de aplicar los suyos — así el padre puede medir o depender de un DOM que ya está en su estado 'final' de esa actualización, incluyendo cualquier ajuste que los hijos hayan hecho sobre sí mismos. Lo mismo aplica para useEffect: hijos antes que padres, aunque ahí no importa tanto el orden porque no bloquean el paint.",
    respuestaEn:
      "Bottom-up: child components' layout effects run BEFORE their parents' for each update. This makes sense because, by the time a parent's layout effect runs, its children have already finished applying theirs — so the parent can measure or depend on a DOM that's already in its 'final' state for that update, including any adjustments the children made to themselves. The same applies to useEffect: children before parents, though the order matters less there since they don't block paint.",
    codigo: `function Padre() {
  useLayoutEffect(() => console.log('padre'), []);
  return <Hijo />;
}
function Hijo() {
  useLayoutEffect(() => console.log('hijo'), []);
  return <p>hijo</p>;
}
// orden real: "hijo", después "padre"`,
  },
  {
    nivel: 3,
    pregunta:
      "Si la fase de Commit es sincrónica y sin interrupciones, ¿por qué a veces se percibe que los useEffect de una actualización grande 'tardan' en correr?",
    respuestaEs:
      "El commit en sí (la mutación del DOM) es efectivamente sincrónico y no se puede pausar. Pero los useEffect (a diferencia de los useLayoutEffect) se programan para correr DESPUÉS de que el navegador ya pintó la pantalla, y React puede además diferir cuándo exactamente los ejecuta según la prioridad del trabajo pendiente — en actualizaciones muy grandes o con trabajo concurrente de por medio, puede pasar un poco más de tiempo del esperado antes de que todos los useEffect de una actualización terminen de correr, aunque el commit que los originó ya haya terminado hace rato. Esto es intencional: prioriza que el usuario vea la pantalla actualizada cuanto antes, por sobre que los efectos (generalmente invisibles para el usuario) corran de inmediato.",
    respuestaEn:
      "The commit itself (the DOM mutation) is effectively synchronous and can't be paused. But useEffect calls (unlike useLayoutEffect) are scheduled to run AFTER the browser already painted the screen, and React can also defer exactly when it runs them based on the priority of pending work — in very large updates or with concurrent work involved, it can take a bit longer than expected before all of an update's useEffect calls finish running, even though the commit that triggered them already finished a while ago. This is intentional: it prioritizes the user seeing the updated screen as soon as possible, over effects (generally invisible to the user) running immediately.",
    repregunta:
      "¿Un componente puede 'saltarse' su propio commit si React determina que no hay cambios reales que aplicar al DOM?",
    respuestaRepreguntaEs:
      "Sí. Reconciliation puede determinar que, aunque un componente se haya vuelto a renderizar (la función corrió de nuevo), el resultado sea idéntico al anterior en términos de estructura y props relevantes para el DOM — en ese caso, React no genera ninguna mutación real para ese nodo específico, y por lo tanto no hay nada que 'commitear' ahí. El componente sí completó su fase de Render, pero su participación en la fase de Commit puede ser efectivamente nula si no hay diffs que aplicar. Esto es distinto de bail-out por memo (que evita directamente re-ejecutar la función): acá la función SÍ corrió, pero su resultado no generó trabajo de commit.",
    respuestaRepreguntaEn:
      "Yes. Reconciliation can determine that, even though a component re-rendered (the function ran again), the result is identical to the previous one in terms of structure and DOM-relevant props — in that case, React generates no real mutation for that specific node, so there's nothing to 'commit' there. The component did complete its Render phase, but its participation in the Commit phase can be effectively null if there are no diffs to apply. This is different from a memo bail-out (which directly avoids re-running the function): here the function DID run, but its result didn't generate any commit work.",
  },
];
