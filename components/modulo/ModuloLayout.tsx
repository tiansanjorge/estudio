import type { ReactNode } from "react";
import { EstrategiaBadgeAuto, ModuloChevrones, ModuloNavegacion } from "./ModuloNavegacion";
import { ModuloProgresoChevron } from "./ModuloProgreso";

interface ModuloLayoutProps {
  categoriaTitulo: string;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}

export function ModuloLayout({
  categoriaTitulo,
  titulo,
  descripcion,
  children,
}: ModuloLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-16 px-6 py-16 sm:px-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-medium text-accent">{categoriaTitulo}</span>
          <EstrategiaBadgeAuto />
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {titulo}
          </h1>
          <div className="flex shrink-0 gap-2 pt-0.5 sm:pt-1">
            <ModuloProgresoChevron />
            <ModuloChevrones />
          </div>
        </div>
        {descripcion && (
          <p className="max-w-xl text-lg leading-7 text-muted-foreground">
            {descripcion}
          </p>
        )}
      </header>
      <div className="flex flex-col gap-8">{children}</div>
      <ModuloNavegacion />
    </div>
  );
}
