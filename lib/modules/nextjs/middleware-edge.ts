export const RUTAS_EJEMPLO = [
  "/",
  "/dashboard",
  "/dashboard/facturas",
  "/blog/hola-mundo",
  "/api/usuarios",
  "/_next/static/chunks/app.js",
] as const;

export type RutaEjemplo = (typeof RUTAS_EJEMPLO)[number];

/** Equivalente al matcher negativo típico de la documentación. */
export const MATCHER = "/((?!api|_next/static|_next/image|favicon.ico).*)";
const MATCHER_REGEX = /^\/(?!api|_next\/static|_next\/image|favicon\.ico).*$/;

export const CODIGO_PROXY = `// proxy.ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sesion = request.cookies.get("sesion");

  // chequeo optimista: solo mira la cookie, sin DB
  if (pathname.startsWith("/dashboard") && !sesion) {
    return NextResponse.redirect(new URL(\`/login?desde=\${pathname}\`, request.url));
  }

  // A/B test: misma URL, otra página
  if (pathname === "/" && request.cookies.get("variante")?.value === "b") {
    return NextResponse.rewrite(new URL("/home-b", request.url));
  }

  const respuesta = NextResponse.next();
  respuesta.headers.set("x-request-id", crypto.randomUUID());
  return respuesta;
}

export const config = {
  matcher: ["${MATCHER}"],
};`;

export interface ContextoRequest {
  sesion: boolean;
  varianteB: boolean;
}

export type TipoAccion = "no-corre" | "redirect" | "rewrite" | "next";

export interface ResultadoProxy {
  coincideMatcher: boolean;
  accion: TipoAccion;
  /** URL que ve el navegador al final. */
  urlNavegador: string;
  /** Ruta que termina renderizando Next. */
  rutaRenderizada: string;
  explicacion: string;
}

export function ejecutarProxy(ruta: RutaEjemplo, contexto: ContextoRequest): ResultadoProxy {
  if (!MATCHER_REGEX.test(ruta)) {
    return {
      coincideMatcher: false,
      accion: "no-corre",
      urlNavegador: ruta,
      rutaRenderizada: ruta,
      explicacion:
        "El matcher excluye esta ruta: el Proxy ni se ejecuta. Sin esa exclusión, un redirect de auth podría bloquear JS, CSS o imágenes.",
    };
  }

  if (ruta.startsWith("/dashboard") && !contexto.sesion) {
    const destino = `/login?desde=${ruta}`;
    return {
      coincideMatcher: true,
      accion: "redirect",
      urlNavegador: destino,
      rutaRenderizada: "/login",
      explicacion:
        "Redirect: el navegador recibe un 307 y hace un nuevo request. La URL cambia. Es un chequeo optimista: la autorización real igual se verifica en la page o la Server Action.",
    };
  }

  if (ruta === "/" && contexto.varianteB) {
    return {
      coincideMatcher: true,
      accion: "rewrite",
      urlNavegador: ruta,
      rutaRenderizada: "/home-b",
      explicacion:
        "Rewrite: Next renderiza otra ruta, pero el navegador sigue viendo la URL original. Ideal para A/B tests o multi-tenant.",
    };
  }

  return {
    coincideMatcher: true,
    accion: "next",
    urlNavegador: ruta,
    rutaRenderizada: ruta,
    explicacion:
      "NextResponse.next(): el request sigue su camino normal, en este caso con un header agregado a la respuesta.",
  };
}
