/**
 * Estrategia de repaso personal por categoría — ver "Estrategia de repaso
 * personal" en ENTREVISTA.md para el razonamiento completo. Define cuánto
 * confiar en el Quiz como filtro antes de releer una categoría entera.
 */
export type GrupoRepaso = 1 | 2 | 3 | "baja-prioridad";

export interface EstrategiaCategoria {
  grupo: GrupoRepaso;
  etiqueta: string;
  descripcion: string;
}

const ESTRATEGIAS: Record<GrupoRepaso, Omit<EstrategiaCategoria, "grupo">> = {
  1: {
    etiqueta: "Leer todo",
    descripcion:
      "Sin base práctica todavía: el quiz no filtra bien acá. Conviene leer los 3 niveles completos.",
  },
  2: {
    etiqueta: "Quiz filtra todo",
    descripcion:
      "Área de especialidad: si aprobás el quiz de cada nivel, pasá al siguiente sin releer.",
  },
  3: {
    etiqueta: "Leer Nivel 2 y 3",
    descripcion:
      "El quiz de Nivel 1 filtra, pero Nivel 2/3 conviene leerlos directo: se sabe hacerlo pero no siempre se sabe explicar el trade-off en voz alta.",
  },
  "baja-prioridad": {
    etiqueta: "Baja prioridad",
    descripcion: "Dejar para el final si el tiempo aprieta.",
  },
};

const CATEGORIA_A_GRUPO: Record<string, GrupoRepaso> = {
  backend: 1,
  "bases-de-datos": 1,
  cloud: 1,
  "ci-cd": 1,
  "javascript-fundamentos": 2,
  "javascript-profundo": 2,
  "react-core": 2,
  "react-rendering": 2,
  hooks: 2,
  estado: 2,
  performance: 2,
  "http-networking": 2,
  nextjs: 2,
  accesibilidad: 2,
  "typescript-avanzado": 3,
  arquitectura: 3,
  seguridad: 3,
  "system-design": 3,
  testing: 3,
  "ia-aplicada": "baja-prioridad",
};

export function estrategiaDeCategoria(categoriaSlug: string): EstrategiaCategoria | undefined {
  const grupo = CATEGORIA_A_GRUPO[categoriaSlug];
  if (!grupo) return undefined;
  return { grupo, ...ESTRATEGIAS[grupo] };
}

/** Orden de "menos trabajo" a "más trabajo", para mostrar como leyenda. */
export const ORDEN_GRUPOS: GrupoRepaso[] = [2, 3, 1, "baja-prioridad"];

export function estrategiaDeGrupo(grupo: GrupoRepaso): EstrategiaCategoria {
  return { grupo, ...ESTRATEGIAS[grupo] };
}
