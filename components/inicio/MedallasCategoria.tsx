"use client";

import { useLeidos } from "./useLeidos";
import { NIVELES, contarLeidosPorNivel } from "@/lib/modules/progreso";
import type { Nivel } from "@/lib/modules/types";

const MEDALLAS: Record<Nivel, { emoji: string; etiqueta: string }> = {
  1: { emoji: "🥉", etiqueta: "bronce" },
  2: { emoji: "🥈", etiqueta: "plata" },
  3: { emoji: "🥇", etiqueta: "oro" },
};

/** Medallas en la esquina de la card de categoría: una por nivel completado en todos sus módulos. */
export function MedallasCategoria({
  categoriaSlug,
  moduloSlugs,
}: {
  categoriaSlug: string;
  moduloSlugs: string[];
}) {
  const leidos = useLeidos();
  if (moduloSlugs.length === 0) return null;

  const completos = NIVELES.filter(
    (nivel) => contarLeidosPorNivel(leidos, categoriaSlug, moduloSlugs, nivel) === moduloSlugs.length,
  );
  if (completos.length === 0) return null;

  return (
    <div className="absolute right-4 top-4 flex gap-1">
      {completos.map((nivel) => (
        <span
          key={nivel}
          role="img"
          aria-label={`Nivel ${nivel} completo — medalla de ${MEDALLAS[nivel].etiqueta}`}
          title={`Nivel ${nivel} completo`}
          className="text-2xl leading-none drop-shadow-sm"
        >
          {MEDALLAS[nivel].emoji}
        </span>
      ))}
    </div>
  );
}
