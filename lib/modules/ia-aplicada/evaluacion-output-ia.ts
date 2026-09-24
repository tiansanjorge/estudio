export const PEDIDO_ORIGINAL =
  "Endpoint GET /api/pedidos que devuelva los últimos 20 pedidos del usuario logueado, con filtro opcional por estado.";

// código tal como lo devolvió el asistente: compila, parece razonable y tiene problemas serios
export const LINEAS_CODIGO = [
  'import { prisma } from "@/lib/prisma";',
  'import _ from "lodash";',
  "",
  "export async function GET(req: Request) {",
  "  const url = new URL(req.url);",
  '  const usuarioId = url.searchParams.get("usuarioId");',
  '  const estado = url.searchParams.get("estado");',
  "  const pedidos = await prisma.$queryRawUnsafe(",
  "    `SELECT * FROM pedidos WHERE usuario_id = ${usuarioId} AND estado = '${estado}'`",
  "  );",
  '  const ordenados = _.sortBy(pedidos, "creado_el");',
  "  return Response.json(ordenados.slice(0, 20));",
  "}",
];

export type Categoria = "seguridad" | "bug" | "rendimiento" | "mantenimiento";

export interface Problema {
  // índices de línea (desde 0) donde se ve el problema
  lineas: number[];
  categoria: Categoria;
  titulo: string;
  explicacion: string;
}

export const PROBLEMAS: Problema[] = [
  {
    lineas: [5],
    categoria: "seguridad",
    titulo: "IDOR: el usuario viene de la URL",
    explicacion:
      "Cualquiera puede pedir ?usuarioId=otro y ver pedidos ajenos. El pedido decía 'del usuario logueado': el id tiene que salir de la sesión, no del request.",
  },
  {
    lineas: [7, 8],
    categoria: "seguridad",
    titulo: "SQL injection",
    explicacion:
      "$queryRawUnsafe con interpolación de strings: un estado como x' OR '1'='1 devuelve todo. Con la API de Prisma, o $queryRaw como tagged template, los valores van parametrizados.",
  },
  {
    lineas: [6, 8],
    categoria: "bug",
    titulo: "El filtro opcional no es opcional",
    explicacion:
      "Si no viene estado, la consulta busca estado = 'null' y no devuelve nada. El caso sin filtro, que es el más común, está roto.",
  },
  {
    lineas: [10, 11],
    categoria: "rendimiento",
    titulo: "Trae todos los pedidos a memoria",
    explicacion:
      "SELECT * sin LIMIT carga todo el historial del usuario, lo ordena en memoria y recién ahí corta 20. Además ordena ascendente, así que devuelve los más viejos, no los últimos. ORDER BY creado_el DESC LIMIT 20 en la base resuelve las dos cosas.",
  },
  {
    lineas: [1, 10],
    categoria: "mantenimiento",
    titulo: "Dependencia innecesaria",
    explicacion:
      "Suma lodash para un ordenamiento que tiene que hacer la base. Cada dependencia nueva es superficie de ataque, peso y mantenimiento: hay que verificar que haga falta y que exista.",
  },
];

export interface Revision {
  encontrados: Problema[];
  omitidos: Problema[];
  // líneas marcadas que no tienen ningún problema
  falsosPositivos: number[];
}

export function revisar(marcadas: number[]): Revision {
  const encontrados = PROBLEMAS.filter((p) => p.lineas.some((l) => marcadas.includes(l)));
  const omitidos = PROBLEMAS.filter((p) => !encontrados.includes(p));
  const conProblema = new Set(PROBLEMAS.flatMap((p) => p.lineas));
  return { encontrados, omitidos, falsosPositivos: marcadas.filter((l) => !conProblema.has(l)) };
}
