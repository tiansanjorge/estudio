export interface LadoComparacion {
  archivo: string;
  codigo: string;
}

export interface Comparacion {
  id: string;
  tema: string;
  pages: LadoComparacion;
  app: LadoComparacion;
  nota: string;
}

export const COMPARACIONES: Comparacion[] = [
  {
    id: "ruta",
    tema: "Definir una ruta",
    pages: {
      archivo: "pages/blog/[slug].tsx",
      codigo: `// el ARCHIVO es la ruta
export default function Post() {
  const { query } = useRouter();
  return <h1>{query.slug}</h1>;
}`,
    },
    app: {
      archivo: "app/blog/[slug]/page.tsx",
      codigo: `// la CARPETA es la ruta; page.tsx la hace pública
export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}`,
    },
    nota:
      "En app/ solo page.tsx (y route.ts) exponen una URL: el resto de los archivos de la carpeta se pueden colocar ahí sin volverse rutas. Desde Next 15, params es una Promise.",
  },
  {
    id: "layout",
    tema: "Layout compartido",
    pages: {
      archivo: "pages/_app.tsx",
      codigo: `// un solo _app para todo; layouts por página
// con el patrón getLayout, a mano
export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout ?? ((p) => p);
  return getLayout(<Component {...pageProps} />);
}`,
    },
    app: {
      archivo: "app/dashboard/layout.tsx",
      codigo: `// layouts anidados por carpeta; se preservan
// (no se re-renderizan) al navegar entre hijas
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section><Sidebar />{children}</section>;
}`,
    },
    nota:
      "Como el layout no se re-renderiza al navegar, mantiene su estado (un sidebar colapsado, un input) y no puede leer searchParams: quedarían desactualizados.",
  },
  {
    id: "ssr",
    tema: "Datos en cada request (SSR)",
    pages: {
      archivo: "pages/dashboard.tsx",
      codigo: `export async function getServerSideProps() {
  const proyectos = await db.proyecto.findMany();
  return { props: { proyectos } };
}

export default function Dashboard({ proyectos }) {
  return <Lista items={proyectos} />;
}`,
    },
    app: {
      archivo: "app/dashboard/page.tsx",
      codigo: `// Server Component: el fetch vive en el componente
export default async function Dashboard() {
  const proyectos = await db.proyecto.findMany();
  return <Lista items={proyectos} />;
}`,
    },
    nota:
      "En Pages, los datos se piden en una función a nivel de página y bajan por props. En App, cada Server Component puede pedir lo suyo, y su código no llega al bundle del cliente.",
  },
  {
    id: "ssg",
    tema: "Páginas estáticas con rutas dinámicas",
    pages: {
      archivo: "pages/blog/[slug].tsx",
      codigo: `export async function getStaticPaths() {
  const posts = await getPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  return { props: { post: await getPost(params.slug) }, revalidate: 60 };
}`,
    },
    app: {
      archivo: "app/blog/[slug]/page.tsx",
      codigo: `export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Post({ params }) {
  const { slug } = await params;
  return <Articulo post={await getPost(slug)} />;
}`,
    },
    nota:
      "getStaticPaths pasa a ser generateStaticParams, y fallback desaparece: las rutas no generadas en el build se renderizan bajo demanda por defecto (dynamicParams).",
  },
  {
    id: "errores",
    tema: "Errores y 404",
    pages: {
      archivo: "pages/_error.tsx + pages/404.tsx",
      codigo: `// un manejador de errores global
function Error({ statusCode }) {
  return <p>Error {statusCode}</p>;
}`,
    },
    app: {
      archivo: "app/dashboard/error.tsx",
      codigo: `"use client"; // los error boundaries son Client Components

export default function Error({ error, reset }) {
  return <button onClick={reset}>Reintentar</button>;
}
// + not-found.tsx y loading.tsx por segmento`,
    },
    nota:
      "error.tsx, loading.tsx y not-found.tsx se aplican por segmento: un error en el dashboard no tira abajo el layout raíz ni la navegación.",
  },
  {
    id: "navegacion",
    tema: "Hooks de navegación",
    pages: {
      archivo: "next/router",
      codigo: `import { useRouter } from "next/router";

const { pathname, query, push } = useRouter();`,
    },
    app: {
      archivo: "next/navigation",
      codigo: `"use client";
import { useRouter, usePathname, useSearchParams, useParams } from "next/navigation";

const router = useRouter();       // push, replace, refresh
const pathname = usePathname();
const searchParams = useSearchParams();`,
    },
    nota:
      "El useRouter nuevo ya no devuelve pathname ni query: se separaron en hooks propios, y solo funcionan en Client Components.",
  },
  {
    id: "api",
    tema: "Endpoints de API",
    pages: {
      archivo: "pages/api/usuarios.ts",
      codigo: `// API de Node (req/res)
export default function handler(req, res) {
  if (req.method === "GET") res.json(usuarios);
}`,
    },
    app: {
      archivo: "app/api/usuarios/route.ts",
      codigo: `// Web Request / Response, una función por método
export async function GET(request: Request) {
  return Response.json(usuarios);
}`,
    },
    nota:
      "Si el endpoint solo existía para que el cliente pidiera datos al servidor, en App muchas veces sobra: un Server Component lee los datos directo.",
  },
];
