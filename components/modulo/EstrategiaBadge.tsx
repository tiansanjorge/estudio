import {
  estrategiaDeCategoria,
  estrategiaDeGrupo,
  type EstrategiaCategoria,
  type GrupoRepaso,
} from "@/lib/modules/estrategia-repaso";

export const CLASES_POR_GRUPO: Record<GrupoRepaso, string> = {
  1: "border-warning/30 bg-warning-soft text-warning",
  2: "border-success/30 bg-success-soft text-success",
  3: "border-info/30 bg-info-soft text-info",
  "baja-prioridad": "border-border text-muted-foreground",
};

function Chip({ estrategia }: { estrategia: EstrategiaCategoria }) {
  return (
    <span
      title={estrategia.descripcion}
      className={`inline-flex shrink-0 items-center rounded-xl border px-2.5 py-1 text-xs font-medium ${CLASES_POR_GRUPO[estrategia.grupo]}`}
    >
      {estrategia.etiqueta}
    </span>
  );
}

/** Chip con la estrategia de repaso personal de la categoría (ver ENTREVISTA.md). */
export function EstrategiaBadge({ categoriaSlug }: { categoriaSlug: string }) {
  const estrategia = estrategiaDeCategoria(categoriaSlug);
  if (!estrategia) return null;
  return <Chip estrategia={estrategia} />;
}

/** Mismo chip, pero a partir de un grupo directo (para la leyenda del home). */
export function EstrategiaBadgeDeGrupo({ grupo }: { grupo: GrupoRepaso }) {
  return <Chip estrategia={estrategiaDeGrupo(grupo)} />;
}
