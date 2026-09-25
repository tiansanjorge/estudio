"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { modulosVecinos, type ModuloVecino } from "@/lib/modules/registry";
import { ModuloProgresoBoton } from "./ModuloProgreso";

/**
 * Lee el módulo actual de la URL (/modulos/<categoria>/<modulo>) para no
 * tener que pasar slugs desde cada page.tsx.
 */
function useModulosVecinos() {
  const pathname = usePathname();
  const [, raiz, categoriaSlug, moduloSlug] = pathname.split("/");
  if (raiz !== "modulos" || !categoriaSlug || !moduloSlug) {
    return { anterior: null, siguiente: null };
  }
  return modulosVecinos(categoriaSlug, moduloSlug);
}

/** Tarjetas "← Anterior / Siguiente →" al pie del módulo. */
export function ModuloNavegacion() {
  const { anterior, siguiente } = useModulosVecinos();

  return (
    <div className="flex flex-col gap-4">
      <ModuloProgresoBoton />
      {(anterior || siguiente) && (
        <nav
          aria-label="Navegación entre módulos"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {anterior ? (
            <EnlaceVecino vecino={anterior} direccion="anterior" />
          ) : (
            <span className="hidden sm:block" />
          )}
          {siguiente && <EnlaceVecino vecino={siguiente} direccion="siguiente" />}
        </nav>
      )}
    </div>
  );
}

/** Chevrones compactos junto al título del módulo. */
export function ModuloChevrones() {
  const { anterior, siguiente } = useModulosVecinos();
  if (!anterior && !siguiente) return null;

  return (
    <nav aria-label="Módulo anterior y siguiente" className="flex shrink-0 gap-2">
      <Chevron vecino={anterior} direccion="anterior" />
      <Chevron vecino={siguiente} direccion="siguiente" />
    </nav>
  );
}

function EnlaceVecino({
  vecino,
  direccion,
}: {
  vecino: ModuloVecino;
  direccion: "anterior" | "siguiente";
}) {
  const esSiguiente = direccion === "siguiente";

  return (
    <Link
      href={vecino.href}
      rel={esSiguiente ? "next" : "prev"}
      className={`group flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-accent/30 hover:bg-accent-soft ${
        esSiguiente ? "items-end text-right sm:col-start-2" : "items-start"
      }`}
    >
      <span className="text-xs font-medium text-muted-foreground">
        {esSiguiente ? "Siguiente →" : "← Anterior"}
      </span>
      <span className="font-medium text-foreground group-hover:text-accent">
        {vecino.titulo}
      </span>
      <span className="text-xs text-muted-foreground">
        {vecino.categoriaTitulo}
      </span>
    </Link>
  );
}

function Chevron({
  vecino,
  direccion,
}: {
  vecino: ModuloVecino | null;
  direccion: "anterior" | "siguiente";
}) {
  const esSiguiente = direccion === "siguiente";
  const base =
    "flex size-9 items-center justify-center rounded-xl border border-border bg-surface";
  const icono = (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`size-5 ${esSiguiente ? "" : "rotate-180"}`}
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.06 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.39 4.25a.75.75 0 0 1 0 1.08l-4.39 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Sin vecino (primer/último módulo) el lugar se mantiene para que el otro
  // chevron no salte de posición.
  if (!vecino) {
    return (
      <span aria-hidden="true" className={`${base} text-muted-foreground opacity-40`}>
        {icono}
      </span>
    );
  }

  const etiqueta = `${esSiguiente ? "Siguiente" : "Anterior"}: ${vecino.titulo}`;

  return (
    <Link
      href={vecino.href}
      aria-label={etiqueta}
      title={etiqueta}
      className={`${base} text-muted-foreground transition-colors hover:border-accent/30 hover:bg-accent-soft hover:text-accent`}
    >
      {icono}
    </Link>
  );
}
