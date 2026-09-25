"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Nivel } from "@/lib/modules/types";
import { EVENTO_PROGRESO_CAMBIO, NIVELES, alternarLeido, claveNivel, leerLeidos } from "@/lib/modules/progreso";

/**
 * Progreso de lectura por nivel del módulo actual, persistido en
 * localStorage (solo en este navegador). Dos instancias del hook pueden
 * convivir en la misma página (el toggle de arriba y el de abajo del
 * módulo): se sincronizan entre sí escuchando un evento propio, ya que
 * localStorage no re-renderiza al componente que hizo el cambio.
 */
function useNivelesLeidos() {
  const pathname = usePathname();
  const [, raiz, categoriaSlug, moduloSlug] = pathname.split("/");
  const disponible = raiz === "modulos" && !!categoriaSlug && !!moduloSlug;

  const [leidos, setLeidos] = useState<Record<Nivel, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  useEffect(() => {
    if (!disponible) return;

    function sincronizar() {
      const guardados = leerLeidos();
      setLeidos({
        1: guardados.has(claveNivel(categoriaSlug, moduloSlug, 1)),
        2: guardados.has(claveNivel(categoriaSlug, moduloSlug, 2)),
        3: guardados.has(claveNivel(categoriaSlug, moduloSlug, 3)),
      });
    }
    sincronizar();
    window.addEventListener(EVENTO_PROGRESO_CAMBIO, sincronizar);
    return () => window.removeEventListener(EVENTO_PROGRESO_CAMBIO, sincronizar);
  }, [disponible, categoriaSlug, moduloSlug]);

  const toggle = useCallback(
    (nivel: Nivel) => {
      if (!disponible) return;
      alternarLeido(claveNivel(categoriaSlug, moduloSlug, nivel));
    },
    [disponible, categoriaSlug, moduloSlug],
  );

  return { leidos, toggle, disponible };
}

const iconoCheck = (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
    <path
      fillRule="evenodd"
      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
      clipRule="evenodd"
    />
  </svg>
);

/** Toggles compactos por nivel, junto al título del módulo. */
export function ModuloProgresoChevron() {
  const { leidos, toggle, disponible } = useNivelesLeidos();
  if (!disponible) return null;

  return (
    <div
      aria-label="Progreso por nivel"
      className="inline-flex items-center gap-1 rounded-xl border border-border p-1"
    >
      {NIVELES.map((nivel) => (
        <button
          key={nivel}
          type="button"
          onClick={() => toggle(nivel)}
          aria-pressed={leidos[nivel]}
          aria-label={`Nivel ${nivel}: ${leidos[nivel] ? "marcar como no leído" : "marcar como leído"}`}
          title={`Nivel ${nivel}: ${leidos[nivel] ? "leído" : "marcar como leído"}`}
          className={`flex size-7 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            leidos[nivel]
              ? "bg-accent-soft text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {leidos[nivel] ? iconoCheck : nivel}
        </button>
      ))}
    </div>
  );
}

/** Tarjeta de progreso por nivel, al pie del módulo, junto a Anterior/Siguiente. */
export function ModuloProgresoBoton() {
  const { leidos, toggle, disponible } = useNivelesLeidos();
  if (!disponible) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <span className="text-xs font-medium text-muted-foreground">Progreso por nivel</span>
      <div className="grid grid-cols-3 gap-2">
        {NIVELES.map((nivel) => (
          <button
            key={nivel}
            type="button"
            onClick={() => toggle(nivel)}
            aria-pressed={leidos[nivel]}
            className={`flex items-center justify-center gap-1.5 rounded-lg border p-2 text-sm font-medium transition-colors ${
              leidos[nivel]
                ? "border-accent/30 bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:border-accent/30 hover:bg-accent-soft hover:text-accent"
            }`}
          >
            {leidos[nivel] && iconoCheck}
            Nivel {nivel}
          </button>
        ))}
      </div>
    </div>
  );
}
