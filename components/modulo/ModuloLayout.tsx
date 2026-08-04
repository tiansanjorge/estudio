import type { ReactNode } from "react";

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
        <span className="text-sm font-medium text-accent">{categoriaTitulo}</span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {titulo}
        </h1>
        {descripcion && (
          <p className="max-w-xl text-lg leading-7 text-muted-foreground">
            {descripcion}
          </p>
        )}
      </header>
      <div className="flex flex-col gap-8">{children}</div>
    </div>
  );
}
