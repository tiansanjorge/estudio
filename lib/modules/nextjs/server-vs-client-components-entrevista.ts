import type { PreguntaEntrevista } from "../types";

export const entrevistaServerVsClientComponents: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué es un Server Component y en qué se diferencia de un Client Component?",
    respuestaEs:
      "Un Server Component se ejecuta solo en el servidor (en el build o en el request): puede ser async, leer la base de datos o usar secretos directamente, y su código nunca llega al navegador; lo que viaja es el resultado renderizado, en el RSC payload. No puede usar estado, efectos, event handlers ni APIs del navegador. Un Client Component, marcado con 'use client', es el componente de React de siempre: se prerenderiza a HTML en el servidor y después se hidrata en el navegador, donde puede tener estado, efectos y eventos; su JavaScript sí va al bundle. En el App Router todo es Server Component por defecto, y la regla práctica es usar Client Components solo donde hace falta interactividad o APIs del navegador, lo más abajo posible en el árbol.",
    respuestaEn:
      "A Server Component runs only on the server (at build or request time): it can be async, read the database or use secrets directly, and its code never reaches the browser; what travels is the rendered result, in the RSC payload. It can't use state, effects, event handlers or browser APIs. A Client Component, marked with 'use client', is the React component we've always had: it's prerendered to HTML on the server and then hydrated in the browser, where it can have state, effects and events; its JavaScript does go into the bundle. In the App Router everything is a Server Component by default, and the practical rule is to use Client Components only where interactivity or browser APIs are needed, as low in the tree as possible.",
  },
  {
    nivel: 1,
    pregunta: "¿Un Client Component se renderiza solo en el navegador?",
    respuestaEs:
      "No, y es una confusión muy común. En la carga inicial, los Client Components también se renderizan en el servidor para generar el HTML (prerender), igual que en el SSR tradicional; después el navegador descarga su JavaScript y los hidrata para hacerlos interactivos. En las navegaciones siguientes del lado del cliente sí se renderizan directamente en el navegador. 'use client' no significa 'solo cliente': significa 'este componente también existe en el cliente, mandá su código al bundle'. Por eso un Client Component no puede tocar `window` durante el render sin chequear el entorno: esa parte del código corre en el servidor primero.",
    respuestaEn:
      "No, and it's a very common confusion. On initial load, Client Components are also rendered on the server to generate HTML (prerender), just like traditional SSR; then the browser downloads their JavaScript and hydrates them to make them interactive. On subsequent client-side navigations they do render directly in the browser. 'use client' doesn't mean 'client only': it means 'this component also exists on the client, ship its code in the bundle'. That's why a Client Component can't touch `window` during render without checking the environment: that code runs on the server first.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué significa que 'use client' marca una frontera, y cómo afecta al bundle?",
    respuestaEs:
      "'use client' no marca un componente, marca una frontera en el grafo de MÓDULOS: el archivo que la tiene y todo lo que ese archivo importa pasan a ser código de cliente, sin necesidad de repetir la directiva. Por eso ponerla en un componente alto (un layout, una page) arrastra al bundle todo lo que importa, incluidas librerías pesadas que no necesitaban interactividad. La regla es empujar la frontera hacia las hojas: el layout sigue siendo Server Component y solo el buscador, que tiene estado, lleva 'use client'. La excepción importante es lo que se pasa como `children` u otra prop: esos componentes no los importa el Client Component, los importa y renderiza el Server Component padre, así que siguen siendo de servidor aunque visualmente estén 'adentro' del componente de cliente.",
    respuestaEn:
      "'use client' doesn't mark a component, it marks a boundary in the MODULE graph: the file that has it and everything that file imports become client code, without repeating the directive. That's why putting it on a high component (a layout, a page) drags into the bundle everything it imports, including heavy libraries that didn't need interactivity. The rule is to push the boundary toward the leaves: the layout stays a Server Component and only the search bar, which has state, gets 'use client'. The important exception is what's passed as `children` or another prop: those components aren't imported by the Client Component, they're imported and rendered by the parent Server Component, so they remain server-side even though they're visually 'inside' the client component.",
    codigo: `// Modal.tsx
"use client";
export function Modal({ children }) {
  const [abierto, setAbierto] = useState(false);
  return abierto ? <div>{children}</div> : <button onClick={() => setAbierto(true)}>Ver</button>;
}

// page.tsx (Server Component)
<Modal>
  <Carrito /> {/* sigue siendo Server Component: lo importa page, no Modal */}
</Modal>`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué restricciones tienen las props que pasan de un Server Component a un Client Component?",
    respuestaEs:
      "Tienen que ser serializables por React, porque viajan dentro del RSC payload desde el servidor al navegador. Valen primitivos, objetos y arrays planos, Date, Map, Set, Promises (que el cliente puede leer con `use()`), JSX ya renderizado y Server Actions. No valen funciones comunes (un `onClick` definido en el Server Component), instancias de clases con métodos, ni símbolos no registrados. El error típico es pasar un callback desde la page: la solución es mover ese comportamiento al Client Component, o convertir la función en una Server Action si lo que hace ocurre en el servidor. Un segundo cuidado es el tamaño: todo lo que se pasa como prop queda embebido en el payload, así que pasar un objeto enorme de la base de datos cuando el componente usa dos campos engorda la respuesta y puede filtrar datos que el cliente no debería ver.",
    respuestaEn:
      "They must be serializable by React, since they travel inside the RSC payload from server to browser. Allowed: primitives, plain objects and arrays, Date, Map, Set, Promises (which the client can read with `use()`), already-rendered JSX, and Server Actions. Not allowed: regular functions (an `onClick` defined in the Server Component), class instances with methods, or unregistered symbols. The typical mistake is passing a callback from the page: the fix is moving that behavior into the Client Component, or turning the function into a Server Action if it happens on the server. A second concern is size: everything passed as a prop is embedded in the payload, so passing a huge database object when the component uses two fields bloats the response and can leak data the client shouldn't see.",
    tradeoffs:
      "Pasar solo los campos necesarios (un DTO) cuesta un poco más de código, pero reduce el payload y evita exponer datos sensibles por accidente.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Cómo evitás que código de servidor (secretos, acceso a la DB) termine importado en el cliente por error?",
    respuestaEs:
      "Hay dos capas. La primera es de Next: solo las variables de entorno con prefijo `NEXT_PUBLIC_` se incluyen en el bundle del cliente; las demás se reemplazan por vacío, así que un secreto no se filtra por la variable en sí, pero el código igual se importa y falla de forma confusa. La segunda, la importante, es marcar explícitamente los módulos de servidor con `import \"server-only\"`: si alguien los importa desde un Client Component (directa o indirectamente), el build falla con un error claro. Es una forma de hacer que la frontera sea verificable en vez de depender de la disciplina del equipo. Lo complementa una capa de acceso a datos (DAL) centralizada que hace los chequeos de autorización y devuelve DTOs con solo los campos necesarios. Existe también `client-only` para lo inverso, código que usa `window`.",
    respuestaEn:
      "There are two layers. The first is Next's: only environment variables prefixed with `NEXT_PUBLIC_` are included in the client bundle; the rest are replaced with empty values, so a secret doesn't leak through the variable itself, but the code still gets imported and fails confusingly. The second, the important one, is explicitly marking server modules with `import \"server-only\"`: if someone imports them from a Client Component (directly or indirectly), the build fails with a clear error. It makes the boundary verifiable instead of relying on team discipline. It's complemented by a centralized data access layer (DAL) that performs authorization checks and returns DTOs with only the needed fields. There's also `client-only` for the inverse, code that uses `window`.",
    codigo: `// lib/datos.ts
import "server-only";

export async function getUsuario(id: string) {
  const u = await db.usuario.findUnique({ where: { id } });
  return { nombre: u.nombre }; // DTO: sin email ni hash
}`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué no se puede usar Context en un Server Component, y cómo compartís datos del servidor con muchos Client Components?",
    respuestaEs:
      "Porque Context es un mecanismo de React en tiempo de render que depende del árbol de componentes en memoria y de re-renders al cambiar el valor, y los Server Components no tienen estado ni se re-renderizan en el cliente: se ejecutan una vez y producen un resultado serializado. Para compartir estado de cliente se crea un Provider con 'use client' que recibe `children` y se lo coloca lo más abajo posible en el layout (así el resto sigue siendo servidor). Para compartir datos del servidor hay dos opciones: pasar el valor ya resuelto como prop al Provider, o pasar la PROMESA sin esperar (sin `await`) y que los consumidores la lean con `use()`, lo que permite empezar a renderizar sin bloquear en esa consulta y hacer streaming. Entre Server Components, en cambio, no hace falta context: cada uno puede llamar a la misma función de datos, y la memoización del request (con `React.cache` o el dedupe de `fetch`) evita repetir la consulta.",
    respuestaEn:
      "Because Context is a render-time React mechanism that depends on the in-memory component tree and on re-renders when the value changes, and Server Components have no state and don't re-render on the client: they run once and produce a serialized result. To share client state you create a 'use client' Provider that takes `children` and place it as low as possible in the layout (so the rest stays server). To share server data there are two options: pass the resolved value as a prop to the Provider, or pass the PROMISE without awaiting and let consumers read it with `use()`, which lets rendering start without blocking on that query and enables streaming. Between Server Components, on the other hand, no context is needed: each can call the same data function, and request memoization (with `React.cache` or `fetch` dedupe) avoids repeating the query.",
  },
];
