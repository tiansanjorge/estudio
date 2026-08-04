"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface RevelarSolucionProps {
  etiqueta?: string;
  children: ReactNode;
}

export function RevelarSolucion({
  etiqueta = "Ver solución",
  children,
}: RevelarSolucionProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
      >
        {visible ? "Ocultar solución" : etiqueta}
      </button>
      {visible && (
        <div className="rounded-xl border border-border bg-background p-4 text-sm text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
