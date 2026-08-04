import type { ReactNode } from "react";

interface SeccionProps {
  eyebrow: string;
  titulo: string;
  children: ReactNode;
}

export function Seccion({ eyebrow, titulo, children }: SeccionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </span>
        <h2 className="text-xl font-semibold text-foreground">{titulo}</h2>
      </div>
      <div className="text-foreground">{children}</div>
    </section>
  );
}
