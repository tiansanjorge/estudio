"use client";

import { useLeidos } from "./useLeidos";
import { NIVELES, contarLeidosPorNivel } from "@/lib/modules/progreso";

interface CategoriaProgreso {
  slug: string;
  titulo: string;
  moduloSlugs: string[];
}

/**
 * Progreso general, una barra por nivel (1/2/3). Cada barra está segmentada
 * por categoría: cada segmento pesa proporcional a su cantidad de módulos y
 * se rellena según lo leído en ese nivel.
 */
export function ProgresoGlobal({ categorias }: { categorias: CategoriaProgreso[] }) {
  const leidos = useLeidos();
  const conModulos = categorias.filter((c) => c.moduloSlugs.length > 0);
  const total = conModulos.reduce((acc, c) => acc + c.moduloSlugs.length, 0);
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {NIVELES.map((nivel) => {
        const totalLeidosNivel = conModulos.reduce(
          (acc, c) => acc + contarLeidosPorNivel(leidos, c.slug, c.moduloSlugs, nivel),
          0,
        );

        return (
          <div key={nivel} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm text-muted-foreground">Nivel {nivel}</span>
              <span className="text-sm tabular-nums text-muted-foreground">
                {totalLeidosNivel}/{total}
              </span>
            </div>
            <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-border/50">
              {conModulos.map((categoria) => {
                const categoriaLeidos = contarLeidosPorNivel(
                  leidos,
                  categoria.slug,
                  categoria.moduloSlugs,
                  nivel,
                );
                return (
                  <div
                    key={categoria.slug}
                    style={{ width: `${(categoria.moduloSlugs.length / total) * 100}%` }}
                    className="h-full bg-surface"
                    title={`${categoria.titulo} · Nivel ${nivel}: ${categoriaLeidos}/${categoria.moduloSlugs.length}`}
                  >
                    <div
                      className="h-full rounded-full bg-accent transition-[width]"
                      style={{ width: `${(categoriaLeidos / categoria.moduloSlugs.length) * 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
