import type { PreguntaEntrevista } from "../types";

export const entrevistaVirtualization: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué problema resuelve la virtualización (o 'windowing') de listas?",
    respuestaEs:
      "Cuando una lista tiene miles de elementos, renderizar TODOS esos elementos en el DOM real es costoso incluso si cada item individual es barato: el navegador tiene que crear, mantener en memoria y calcular el layout de miles de nodos reales, la mayoría de los cuales ni siquiera son visibles en pantalla en un momento dado. La virtualización renderiza en el DOM real ÚNICAMENTE los elementos que están (o están por entrar) en el viewport visible, sin importar cuántos haya en total en los datos — el resto de la lista existe solo como datos en memoria, no como nodos del DOM.",
    respuestaEn:
      "When a list has thousands of items, rendering ALL of them in the real DOM is expensive even if each individual item is cheap: the browser has to create, keep in memory, and calculate layout for thousands of real nodes, most of which aren't even visible on screen at any given moment. Virtualization renders in the real DOM ONLY the elements that are (or are about to be) in the visible viewport, regardless of how many there are in total in the data — the rest of the list exists only as data in memory, not as DOM nodes.",
    codigo: `// sin virtualizar: 10.000 nodos reales en el DOM, la mayoría fuera de pantalla
{items.map((item) => <Fila key={item.id} item={item} />)}

// virtualizado: solo se montan los ~15 items visibles en el viewport actual
<ListaVirtualizada items={items} alturaFila={40} alturaViewport={600} />`,
  },
  {
    nivel: 1,
    pregunta: "¿Cuándo tiene sentido virtualizar una lista, y cuándo no aporta nada?",
    respuestaEs:
      "Virtualizar aporta valor a partir de listas con cientos o miles de elementos, donde la cantidad de nodos en el DOM es en sí misma el problema (memoria, tiempo de layout inicial, scroll poco fluido). Para listas cortas (una docena de elementos, un menú de navegación), virtualizar agrega complejidad de implementación sin ningún beneficio medible — el costo de mantener esos pocos nodos en el DOM es insignificante comparado con la complejidad adicional del cálculo de posiciones que la virtualización introduce.",
    respuestaEn:
      "Virtualizing pays off starting from lists with hundreds or thousands of elements, where the sheer number of DOM nodes is itself the problem (memory, initial layout time, choppy scrolling). For short lists (a dozen items, a navigation menu), virtualizing adds implementation complexity with no measurable benefit — the cost of keeping those few nodes in the DOM is negligible compared to the extra position-calculation complexity virtualization introduces.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cómo sabe una librería de virtualización qué posición (offset) darle a un elemento que todavía no se montó en el DOM?",
    respuestaEs:
      "Cuando todos los elementos tienen la MISMA altura fija, es aritmética simple: el offset del elemento N es `N * alturaFila`, así que la posición de cualquier item se calcula sin necesidad de haberlo renderizado nunca. El contenedor externo se dimensiona con una altura total falsa (`cantidadTotal * alturaFila`) para que la scrollbar refleje el tamaño real de la lista completa, y a medida que el usuario scrollea, se recalcula qué rango de índices cae dentro del viewport visible y se monta/desmonta esa ventana de elementos usando `position: absolute` con el `top` calculado para cada uno.",
    respuestaEn:
      "When every element has the SAME fixed height, it's simple arithmetic: item N's offset is `N * rowHeight`, so any item's position can be calculated without ever having rendered it. The outer container is sized with a fake total height (`totalCount * rowHeight`) so the scrollbar reflects the full list's real size, and as the user scrolls, the library recalculates which index range falls within the visible viewport and mounts/unmounts that window of elements using `position: absolute` with a computed `top` for each one.",
    codigo: `function ListaVirtualizada({ items, alturaFila, alturaViewport, scrollTop }) {
  const inicio = Math.floor(scrollTop / alturaFila);
  const cantidadVisible = Math.ceil(alturaViewport / alturaFila);
  const visibles = items.slice(inicio, inicio + cantidadVisible);

  return (
    <div style={{ height: items.length * alturaFila, position: 'relative' }}>
      {visibles.map((item, i) => (
        <div key={item.id} style={{ position: 'absolute', top: (inicio + i) * alturaFila }}>
          {item.contenido}
        </div>
      ))}
    </div>
  );
}`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué problema adicional introduce virtualizar una lista con alturas de fila VARIABLES (no todas iguales), y cómo se maneja?",
    respuestaEs:
      "Sin una altura fija, ya no se puede calcular el offset de un elemento con una simple multiplicación — hace falta conocer las alturas de TODOS los elementos anteriores para saber dónde empieza uno dado, pero esas alturas reales solo se conocen después de haber renderizado (y medido) cada elemento al menos una vez. La solución típica es mantener un cache de alturas MEDIDAS (con estimaciones por defecto para elementos que todavía no se midieron), recalculando offsets a medida que se van montando y midiendo elementos nuevos — lo que puede causar pequeños saltos de posición mientras las estimaciones se corrigen con datos reales.",
    respuestaEn:
      "Without a fixed height, an element's offset can no longer be calculated with simple multiplication — you need to know the heights of ALL previous elements to know where a given one starts, but those real heights are only known after having rendered (and measured) each element at least once. The typical solution is keeping a cache of MEASURED heights (with default estimates for elements not yet measured), recalculating offsets as new elements get mounted and measured — which can cause small position jumps while estimates get corrected with real data.",
    tradeoffs:
      "Alturas fijas son mucho más simples y predecibles de virtualizar; alturas variables requieren un sistema de medición y cache que agrega complejidad y puede introducir saltos visuales menores, pero es indispensable cuando el contenido real (texto de longitud variable, imágenes) no permite una altura uniforme.",
    repregunta:
      "¿Por qué la virtualización de listas suele combinarse mal con el foco del teclado y la accesibilidad si no se maneja con cuidado?",
    respuestaRepreguntaEs:
      "Porque un elemento que sale del viewport se DESMONTA del DOM (no solo se oculta visualmente), así que si el foco del teclado estaba en ese elemento, o si un lector de pantalla lo tenía referenciado, ese foco se pierde apenas el elemento deja de existir. También rompe el comportamiento nativo de 'buscar en la página' (Ctrl+F) del navegador, porque el texto de los elementos no montados simplemente no existe en el DOM para que el navegador lo encuentre. Mitigarlo requiere manejo explícito de foco (recalcular a qué elemento debe volver el foco tras el desmontaje) y, en casos críticos de accesibilidad, evaluar si esa lista específica realmente necesita virtualizarse o si el costo de UX no lo justifica.",
    respuestaRepreguntaEn:
      "Because an element leaving the viewport gets UNMOUNTED from the DOM (not just visually hidden), so if keyboard focus was on that element, or a screen reader had it referenced, that focus is lost as soon as the element stops existing. It also breaks the browser's native 'find on page' (Ctrl+F) behavior, since unmounted elements' text simply doesn't exist in the DOM for the browser to find. Mitigating this requires explicit focus handling (recalculating which element focus should move to after unmount) and, in accessibility-critical cases, evaluating whether that specific list really needs virtualizing or whether the UX cost isn't justified.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué el 'overscan' (renderizar algunos elementos extra fuera del viewport visible) es una técnica estándar en las librerías de virtualización?",
    respuestaEs:
      "Si se renderizaran EXACTAMENTE los elementos visibles y ni uno más, un scroll rápido dejaría ver, por una fracción de segundo, espacio en blanco mientras React monta los elementos nuevos que acaban de entrar al viewport — el montaje no es instantáneo, y ese lapso es perceptible como parpadeo. El overscan renderiza unos pocos elementos ADICIONALES inmediatamente antes y después del rango visible (por ejemplo, 3-5 filas de margen a cada lado), para que ya estén montados y listos en el DOM cuando el scroll los revele, a costa de mantener unos pocos nodos más de los estrictamente necesarios.",
    respuestaEn:
      "If EXACTLY the visible elements were rendered and not one more, fast scrolling would briefly show blank space while React mounts the new elements that just entered the viewport — mounting isn't instantaneous, and that lag is perceptible as flicker. Overscan renders a few ADDITIONAL elements immediately before and after the visible range (e.g. 3-5 rows of margin on each side), so they're already mounted and ready in the DOM by the time scrolling reveals them, at the cost of keeping a few more nodes than strictly necessary.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué ventaja de rendimiento tiene reusar (recyclear) los mismos nodos del DOM al virtualizar, en vez de desmontar y montar nodos nuevos en cada scroll?",
    respuestaEs:
      "Desmontar un componente y montar uno nuevo implica que React tenga que crear una nueva fiber, ejecutar el ciclo completo de montaje (incluyendo efectos), y descartar la anterior con su limpieza correspondiente — trabajo repetido en cada elemento que entra o sale del viewport durante un scroll continuo. Reciclar nodos (mantener las MISMAS instancias de componente montadas, y simplemente actualizarles las props con los nuevos datos que corresponden a la posición actual) evita ese ciclo completo de montaje/desmontaje, aprovechando el camino de actualización de React (que es más barato que un montaje desde cero) para simplemente 'renombrar' qué dato representa cada nodo ya existente a medida que el scroll avanza.",
    respuestaEn:
      "Unmounting a component and mounting a new one means React has to create a new fiber, run the full mount cycle (including effects), and discard the previous one with its corresponding cleanup — repeated work for every element entering or leaving the viewport during continuous scrolling. Recycling nodes (keeping the SAME component instances mounted, and just updating their props with the new data corresponding to the current position) avoids that full mount/unmount cycle, leveraging React's update path (cheaper than mounting from scratch) to essentially 're-label' which data each already-existing node represents as scrolling progresses.",
    repregunta:
      "¿Qué cuidado hay que tener con el estado interno (useState) de un componente cuando se recicla su nodo del DOM para representar un ítem distinto?",
    respuestaRepreguntaEs:
      "Como el componente NO se desmonta (solo cambian sus props), cualquier estado interno que haya acumulado (por ejemplo, si un item tenía un 'modo edición' activado con useState) persiste en la instancia reciclada, aunque ahora esa instancia represente un item de datos completamente distinto — lo cual produce un bug visible donde el nuevo item 'hereda' el estado visual del item anterior que ocupaba ese mismo nodo. La forma de evitarlo es derivar cualquier estado que dependa de la identidad del item a partir de los props/datos actuales (o resetear explícitamente ese estado cuando cambia el id del item que el nodo representa), en vez de asumir que el ciclo de vida del componente coincide con la identidad del dato mostrado.",
    respuestaRepreguntaEn:
      "Since the component does NOT unmount (only its props change), any internal state it had accumulated (e.g. if an item had an 'edit mode' toggled on via useState) persists in the recycled instance, even though that instance now represents a completely different data item — producing a visible bug where the new item 'inherits' the previous item's visual state from that same node. The way to avoid it is to derive any state that depends on the item's identity from the current props/data (or explicitly reset that state when the item id the node represents changes), instead of assuming the component's lifecycle matches the identity of the data being shown.",
  },
];
