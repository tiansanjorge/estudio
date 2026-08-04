"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Children = "ninguno" | "texto" | "boton";

const opcionesChildren: { valor: Children; etiqueta: string }[] = [
  { valor: "ninguno", etiqueta: "sin children" },
  { valor: "texto", etiqueta: "texto" },
  { valor: "boton", etiqueta: "botón" },
];

function TarjetaPerfil({
  nombre,
  rol,
  activo,
  children,
}: {
  nombre: string;
  rol: string;
  activo: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">{nombre || "(sin nombre)"}</span>
        <span
          className={`rounded-lg border px-2 py-0.5 text-xs ${
            activo
              ? "border-success/30 bg-success-soft text-success"
              : "border-border text-muted-foreground"
          }`}
        >
          {activo ? "activo" : "inactivo"}
        </span>
      </div>
      <span className="text-sm text-muted-foreground">{rol || "(sin rol)"}</span>
      {children && <div className="mt-2 border-t border-border pt-2">{children}</div>}
    </div>
  );
}

export function PropsInspector() {
  const [nombre, setNombre] = useState("Ana Gómez");
  const [rol, setRol] = useState("Frontend Engineer");
  const [activo, setActivo] = useState(true);
  const [children, setChildren] = useState<Children>("texto");

  const childrenDescripcion =
    children === "ninguno" ? "undefined" : children === "texto" ? "<p>...</p>" : "<button>...</button>";

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              nombre
            </span>
            <input
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              rol
            </span>
            <input
              value={rol}
              onChange={(event) => setRol(event.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </label>
          <button
            type="button"
            onClick={() => setActivo((v) => !v)}
            className={`w-fit rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              activo
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            activo: {String(activo)}
          </button>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              children
            </span>
            <div className="flex flex-wrap gap-2">
              {opcionesChildren.map((opcion) => (
                <button
                  key={opcion.valor}
                  type="button"
                  onClick={() => setChildren(opcion.valor)}
                  className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
                    opcion.valor === children
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          </div>
        </div>

        <TarjetaPerfil nombre={nombre} rol={rol} activo={activo}>
          {children === "texto" && (
            <p className="text-sm text-muted-foreground">Este texto es el children de TarjetaPerfil.</p>
          )}
          {children === "boton" && (
            <button className="rounded-lg border border-border px-3 py-1 text-sm text-foreground">
              Este botón es el children
            </button>
          )}
        </TarjetaPerfil>
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Objeto de props recibido por TarjetaPerfil
        </span>
        <pre className="mt-2 whitespace-pre-wrap">
{`{
  nombre: "${nombre}",
  rol: "${rol}",
  activo: ${activo},
  children: ${childrenDescripcion}
}`}
        </pre>
      </div>
    </div>
  );
}
