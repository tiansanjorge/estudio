"use client";

import { useLeidos } from "./useLeidos";
import { NIVELES, contarLeidosPorNivel } from "@/lib/modules/progreso";

/** Indicador compacto "N1 x/y · N2 x/y · N3 x/y" para una categoría del home. */
export function IndicadorProgresoCategoria({
  categoriaSlug,
  moduloSlugs,
}: {
  categoriaSlug: string;
  moduloSlugs: string[];
}) {
  const leidos = useLeidos();
  if (moduloSlugs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {NIVELES.map((nivel) => {
        const leidosNivel = contarLeidosPorNivel(leidos, categoriaSlug, moduloSlugs, nivel);
        return (
          <div key={nivel} className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">N{nivel}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {leidosNivel}/{moduloSlugs.length}
            </span>
            <div className="h-1.5 w-8 overflow-hidden rounded-full bg-border/60">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${(leidosNivel / moduloSlugs.length) * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
