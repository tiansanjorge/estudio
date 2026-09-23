import type { PreguntaEntrevista } from "../types";

export const entrevistaTanstackQuery: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué distinción hace TanStack Query entre 'server state' y 'client state', y por qué importa?",
    respuestaEs:
      "'Client state' es estado que le pertenece por completo al frontend (un modal abierto, un formulario a medio completar) — Redux, Zustand o useState son herramientas naturales para eso. 'Server state' es una COPIA de datos que en realidad viven en otro lugar (una base de datos, detrás de una API): puede quedar desactualizada sin que el frontend lo sepa, puede ser pedida por varias partes de la app a la vez, y necesita revalidarse periódicamente. Meter server state directamente en Redux o Zustand obliga a reimplementar a mano cacheo, deduplicación de pedidos, revalidación en segundo plano y manejo de loading/error — exactamente lo que TanStack Query ya resuelve out of the box, tratando 'los datos que pedí a esta URL con estos parámetros' como la unidad central de trabajo.",
    respuestaEn:
      "'Client state' is state that fully belongs to the frontend (an open modal, a partially filled form) — Redux, Zustand, or useState are natural tools for that. 'Server state' is a COPY of data that actually lives elsewhere (a database, behind an API): it can go stale without the frontend knowing, it can be requested by several parts of the app at once, and it needs periodic revalidation. Putting server state directly into Redux or Zustand forces you to reimplement caching, request deduping, background revalidation, and loading/error handling by hand — exactly what TanStack Query already solves out of the box, treating 'the data I requested from this URL with these parameters' as the central unit of work.",
    codigo: `function Perfil({ id }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['usuario', id],
    queryFn: () => fetch(\`/api/usuarios/\${id}\`).then((r) => r.json()),
  });
  // cacheo, deduplicación y revalidación ya resueltos por la librería
}`,
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿qué pasa si dos componentes distintos usan useQuery con la misma queryKey al mismo tiempo?",
    respuestaEs:
      "TanStack Query DEDUPLICA automáticamente: aunque dos componentes en ramas distintas del árbol llamen a `useQuery` con la misma `queryKey` (por ejemplo, `['usuario', 5]`), la librería hace UNA sola petición de red, y comparte el resultado (y el estado de carga/error) entre ambos componentes — sin que ninguno de los dos necesite saber que el otro también está pidiendo lo mismo. Esto resuelve de fábrica un problema que, manejado a mano con fetch + useState, requeriría coordinar manualmente qué componente 'es responsable' de pedir el dato.",
    respuestaEn:
      "TanStack Query automatically DEDUPES: even if two components in different branches of the tree call `useQuery` with the same `queryKey` (e.g. `['user', 5]`), the library makes ONE single network request, and shares the result (and loading/error state) between both components — without either needing to know the other is also requesting the same thing. This solves out of the box a problem that, handled by hand with fetch + useState, would require manually coordinating which component 'is responsible' for requesting the data.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Cuál es la diferencia entre 'staleTime' y 'gcTime' (antes llamado cacheTime), y por qué confundirlos causa bugs de datos desactualizados o refetches excesivos?",
    respuestaEs:
      "`staleTime` es cuánto tiempo un dato se considera 'fresco' después de obtenerlo: mientras esté fresco, useQuery lo devuelve directamente desde la caché sin volver a pedirlo, ni siquiera si el componente se vuelve a montar. `gcTime` es cuánto tiempo se mantiene ese dato en memoria DESPUÉS de que ya nadie lo esté usando (todos los componentes que lo pedían se desmontaron), antes de eliminarlo por completo de la caché (garbage collection). Son ejes independientes: un dato puede estar 'viejo' (stale) pero seguir en caché (todavía no llegó su gcTime), en cuyo caso useQuery lo muestra inmediatamente mientras revalida en segundo plano — confundir ambos lleva a configurar mal cuándo refetchear (staleTime) pensando que se está configurando cuánto dura en memoria (gcTime), o viceversa.",
    respuestaEn:
      "`staleTime` is how long data is considered 'fresh' after fetching it: while fresh, useQuery returns it directly from cache without refetching, even if the component remounts. `gcTime` is how long that data stays in memory AFTER nobody's using it anymore (all components requesting it unmounted), before it's fully removed from the cache (garbage collection). They're independent axes: data can be 'stale' but still in cache (its gcTime hasn't hit yet), in which case useQuery shows it immediately while revalidating in the background — confusing the two leads to misconfiguring when to refetch (staleTime) thinking you're configuring how long it lives in memory (gcTime), or vice versa.",
    codigo: `useQuery({
  queryKey: ['usuario', id],
  queryFn: obtenerUsuario,
  staleTime: 5 * 60 * 1000, // se considera fresco por 5 minutos: sin refetch en ese lapso
  gcTime: 10 * 60 * 1000,   // se elimina de memoria 10 min después de que nadie lo use
});`,
    tradeoffs:
      "Un staleTime alto reduce peticiones de red pero aumenta el riesgo de mostrar datos desactualizados por más tiempo; un staleTime de 0 (default) maximiza frescura a costa de más refetches (por ejemplo, cada vez que la ventana recupera el foco).",
    repregunta:
      "¿Por qué no conviene guardar los datos que devuelve una query de TanStack Query también en Redux o Zustand, 'por las dudas'?",
    respuestaRepreguntaEs:
      "Porque se crean dos fuentes de verdad para el mismo dato: la caché de TanStack Query (que se revalida, invalida y sincroniza sola) y una copia manual en el store global (que hay que actualizar a mano cada vez que la query cambia, perdiendo justamente la sincronización automática que se buscaba con la librería). Si un componente necesita ese dato, debe leerlo directamente con `useQuery` (o `useQueryClient().getQueryData()` si hace falta acceder fuera de un componente) — TanStack Query YA ES el lugar donde vive el server state; duplicarlo en otro store solo reintroduce el problema que la librería vino a resolver.",
    respuestaRepreguntaEn:
      "Because it creates two sources of truth for the same data: TanStack Query's cache (which revalidates, invalidates, and syncs itself) and a manual copy in the global store (which has to be updated by hand every time the query changes, losing exactly the automatic sync the library was meant to provide). If a component needs that data, it should read it directly with `useQuery` (or `useQueryClient().getQueryData()` if access is needed outside a component) — TanStack Query IS ALREADY where server state lives; duplicating it in another store just reintroduces the problem the library was meant to solve.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué es la invalidación de queries, y cómo se usa después de una mutación (por ejemplo, crear un nuevo pedido)?",
    respuestaEs:
      "Invalidar una query le dice a TanStack Query 'este dato ya no es confiable, volvé a pedirlo la próxima vez que se necesite' — sin borrarlo inmediatamente de la UI (evitando un parpadeo a vacío), pero disparando un refetch en segundo plano. El patrón típico es: después de que una mutación (crear, editar, borrar algo) se completa con éxito, se invalida la queryKey relacionada (por ejemplo, la lista de pedidos), para que la próxima vez que se muestre esa lista refleje el cambio recién hecho, sin tener que actualizar manualmente el estado local con el resultado de la mutación.",
    respuestaEn:
      "Invalidating a query tells TanStack Query 'this data is no longer trustworthy, fetch it again next time it's needed' — without immediately clearing it from the UI (avoiding a flash to empty), but triggering a background refetch. The typical pattern is: after a mutation (creating, editing, deleting something) completes successfully, the related queryKey is invalidated (e.g. the orders list), so the next time that list is shown it reflects the change just made, without manually updating local state with the mutation's result.",
    codigo: `const queryClient = useQueryClient();

const mutacion = useMutation({
  mutationFn: crearPedido,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['pedidos'] }); // refetch en segundo plano
  },
});`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué es una 'optimistic update', y qué riesgo hay que manejar explícitamente al implementarla?",
    respuestaEs:
      "Es actualizar la UI INMEDIATAMENTE con el resultado esperado de una mutación, antes de que la respuesta real del servidor llegue — por ejemplo, marcar un 'like' como activo apenas se hace click, sin esperar la confirmación de la API, para que la interfaz se sienta instantánea. El riesgo que hay que manejar es qué pasa si la mutación real termina FALLANDO: hay que revertir explícitamente ese cambio optimista al estado anterior (rollback), porque de lo contrario la UI queda mostrando un estado que nunca se confirmó del lado del servidor. TanStack Query expone los hooks `onMutate` (para aplicar el cambio optimista y guardar una copia del estado anterior), `onError` (para revertir usando esa copia) y `onSettled` (para revalidar contra el servidor pase lo que pase), estructurando ese flujo de forma explícita.",
    respuestaEn:
      "It's updating the UI IMMEDIATELY with a mutation's expected result, before the server's real response arrives — e.g. marking a 'like' as active right on click, without waiting for the API's confirmation, so the interface feels instant. The risk that needs explicit handling is what happens if the real mutation ends up FAILING: that optimistic change needs to be explicitly rolled back to the previous state, otherwise the UI keeps showing a state that was never confirmed server-side. TanStack Query exposes the `onMutate` (to apply the optimistic change and save a copy of the previous state), `onError` (to roll back using that copy), and `onSettled` (to revalidate against the server no matter what) hooks, structuring that flow explicitly.",
    codigo: `useMutation({
  mutationFn: darLike,
  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ['post', postId] });
    const anterior = queryClient.getQueryData(['post', postId]);
    queryClient.setQueryData(['post', postId], (post) => ({ ...post, likeado: true }));
    return { anterior }; // se pasa a onError para el rollback
  },
  onError: (err, postId, contexto) => {
    queryClient.setQueryData(['post', postId], contexto.anterior); // rollback
  },
  onSettled: (postId) => queryClient.invalidateQueries({ queryKey: ['post', postId] }),
});`,
    repregunta:
      "¿Por qué es importante cancelar queries en curso (queryClient.cancelQueries) antes de aplicar una actualización optimista?",
    respuestaRepreguntaEs:
      "Porque si hay un refetch en curso para esa misma queryKey cuando se aplica el cambio optimista, y ese refetch termina y trae el dato VIEJO (previo a la mutación) DESPUÉS del cambio optimista, el resultado del refetch pisaría silenciosamente el cambio optimista con datos desactualizados — una race condition clásica entre 'lo que acabo de mostrar optimísticamente' y 'lo que un fetch que ya estaba en vuelo termina trayendo'. Cancelar las queries en curso antes de aplicar el cambio optimista elimina esa ventana de inconsistencia, asegurando que el próximo dato que llegue a esa key sea posterior al cambio optimista aplicado, no uno anterior que llegó tarde.",
    respuestaRepreguntaEn:
      "Because if there's a refetch in flight for that same queryKey when the optimistic change is applied, and that refetch finishes and brings back the OLD data (before the mutation) AFTER the optimistic change, the refetch's result would silently overwrite the optimistic change with stale data — a classic race condition between 'what I just optimistically showed' and 'what a fetch that was already in flight ends up bringing back'. Cancelling in-flight queries before applying the optimistic change eliminates that inconsistency window, ensuring the next data arriving for that key is later than the applied optimistic change, not an earlier one that arrived late.",
  },
];
