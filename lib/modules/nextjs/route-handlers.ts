export type Metodo = "GET" | "POST" | "PATCH" | "DELETE";
export const METODOS: Metodo[] = ["GET", "POST", "PATCH", "DELETE"];

export const RUTAS = ["/api/productos", "/api/productos/1", "/api/productos/99"] as const;
export type Ruta = (typeof RUTAS)[number];

export const CODIGO_ROUTES = `// app/api/productos/route.ts
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  return Response.json(await buscarProductos(q));
}

export async function POST(request: Request) {
  const sesion = await verificarSesion(request);
  if (!sesion) return Response.json({ error: "No autenticado" }, { status: 401 });

  const datos = esquemaProducto.safeParse(await request.json());
  if (!datos.success) return Response.json({ error: datos.error.issues }, { status: 400 });

  const producto = await crearProducto(datos.data);
  return Response.json(producto, {
    status: 201,
    headers: { Location: \`/api/productos/\${producto.id}\` },
  });
}

// app/api/productos/[id]/route.ts
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/productos/[id]">) {
  const { id } = await ctx.params;
  const producto = await getProducto(id);
  if (!producto) return Response.json({ error: "No existe" }, { status: 404 });
  return Response.json(producto);
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/productos/[id]">) {
  if (!(await verificarSesion(request))) return new Response(null, { status: 401 });
  await borrarProducto((await ctx.params).id);
  return new Response(null, { status: 204 });
}`;

const PRODUCTOS: Record<string, { id: string; nombre: string; precio: number }> = {
  "1": { id: "1", nombre: "Teclado", precio: 45000 },
  "2": { id: "2", nombre: "Mouse", precio: 18000 },
};

export interface RequestSimulado {
  metodo: Metodo;
  ruta: Ruta;
  autenticado: boolean;
  cuerpoValido: boolean;
}

export interface RespuestaSimulada {
  status: number;
  textoStatus: string;
  headers: Record<string, string>;
  cuerpo: string | null;
  /** Qué función de qué archivo la produjo. */
  origen: string;
}

const TEXTO_STATUS: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  404: "Not Found",
  405: "Method Not Allowed",
};

function responder(
  status: number,
  origen: string,
  cuerpo: unknown = null,
  headers: Record<string, string> = {},
): RespuestaSimulada {
  const tieneCuerpo = cuerpo !== null;
  return {
    status,
    textoStatus: TEXTO_STATUS[status],
    headers: tieneCuerpo ? { "content-type": "application/json", ...headers } : headers,
    cuerpo: tieneCuerpo ? JSON.stringify(cuerpo, null, 2) : null,
    origen,
  };
}

export function manejarRequest(req: RequestSimulado): RespuestaSimulada {
  const esColeccion = req.ruta === "/api/productos";
  const archivo = esColeccion ? "api/productos/route.ts" : "api/productos/[id]/route.ts";
  const permitidos: Metodo[] = esColeccion ? ["GET", "POST"] : ["GET", "DELETE"];

  if (!permitidos.includes(req.metodo)) {
    // Next responde 405 solo, porque el archivo no exporta esa función (sin header Allow)
    return responder(405, `${archivo} · no exporta ${req.metodo}`);
  }

  const origen = `${archivo} · ${req.metodo}()`;

  if (esColeccion) {
    if (req.metodo === "GET") return responder(200, origen, Object.values(PRODUCTOS));
    if (!req.autenticado) return responder(401, origen, { error: "No autenticado" });
    if (!req.cuerpoValido) {
      return responder(400, origen, { error: [{ path: ["precio"], message: "Expected number" }] });
    }
    return responder(201, origen, { id: "3", nombre: "Monitor", precio: 250000 }, {
      Location: "/api/productos/3",
    });
  }

  const id = req.ruta.split("/").pop() ?? "";
  const producto = PRODUCTOS[id];

  if (req.metodo === "GET") {
    return producto ? responder(200, origen, producto) : responder(404, origen, { error: "No existe" });
  }
  if (!req.autenticado) return responder(401, origen);
  return responder(204, origen);
}
