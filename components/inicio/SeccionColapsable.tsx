"use client";

import { useId, useState, type ReactNode } from "react";

const iconoInfo = (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0ZM9 9a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V9Zm1-3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
      clipRule="evenodd"
    />
  </svg>
);

const iconoChevron = (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-4">
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

/** Sección que se abre/cierra desde un botón tipo "info", colapsada por defecto. */
export function SeccionColapsable({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={id}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {iconoInfo}
        {titulo}
        <span className={`transition-transform ${abierto ? "rotate-180" : ""}`}>
          {iconoChevron}
        </span>
      </button>
      {abierto && <div id={id}>{children}</div>}
    </div>
  );
}
