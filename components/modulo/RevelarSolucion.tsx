"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { RespuestaDesafio } from "./RespuestaDesafio";

interface RevelarSolucionProps {
  etiqueta?: string;
  /** Identifica el borrador cuando el mismo componente se reutiliza para varios desafíos (ej. pasos de un ejercicio). */
  idRespuesta?: string;
  children: ReactNode;
}

export function RevelarSolucion({
  etiqueta = "Ver solución",
  idRespuesta,
  children,
}: RevelarSolucionProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <RespuestaDesafio idRespuesta={idRespuesta} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="w-fit rounded-xl border border-border px-4 py-2 text-base font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
      >
        {visible ? "Ocultar solución" : etiqueta}
      </button>
      {visible && (
        <div className="rounded-xl border border-border bg-background p-4 prosa">
          {children}
        </div>
      )}
    </div>
  );
}
