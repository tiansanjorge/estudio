"use client";

import { useState, type ReactNode } from "react";
import {
  VARIANTES_BOTON,
  type VarianteBotonId,
} from "@/lib/modules/accesibilidad/semantic-html-aria";

const ESTILO_BOTON =
  "inline-flex cursor-pointer items-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm text-accent";

function IconoPapelera(props: { "aria-hidden"?: "true" }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12h10l1-12M9 7V4h6v3" />
    </svg>
  );
}

/** Render real de cada variante, para probarla con Tab y Enter en vivo. */
function renderVariante(id: VarianteBotonId, alActivar: () => void): ReactNode {
  switch (id) {
    case "button-nativo":
      return (
        <button type="button" className={ESTILO_BOTON} onClick={alActivar}>
          Guardar
        </button>
      );
    case "div-onclick":
      return (
        <div className={ESTILO_BOTON} onClick={alActivar}>
          Guardar
        </div>
      );
    case "div-role":
      return (
        <div role="button" className={ESTILO_BOTON} onClick={alActivar}>
          Guardar
        </div>
      );
    case "div-role-completo":
      return (
        <div
          role="button"
          tabIndex={0}
          className={ESTILO_BOTON}
          onClick={alActivar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              alActivar();
            }
          }}
        >
          Guardar
        </div>
      );
    case "icono-sin-nombre":
      return (
        <button type="button" className={ESTILO_BOTON} onClick={alActivar}>
          <IconoPapelera />
        </button>
      );
    case "icono-aria-label":
      return (
        <button type="button" className={ESTILO_BOTON} onClick={alActivar} aria-label="Eliminar">
          <IconoPapelera aria-hidden="true" />
        </button>
      );
  }
}

function Estado({ ok, texto }: { ok: boolean; texto: string }) {
  return (
    <span className={ok ? "text-success" : "text-error"}>
      {ok ? "✓" : "✗"} {texto}
    </span>
  );
}

export function ArbolAccesibilidadExplorador() {
  const [seleccionada, setSeleccionada] = useState<VarianteBotonId>("button-nativo");
  const [activaciones, setActivaciones] = useState(0);
  const variante = VARIANTES_BOTON.find((v) => v.id === seleccionada)!;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Variantes de implementación">
        {VARIANTES_BOTON.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === seleccionada}
            onClick={() => {
              setSeleccionada(v.id);
              setActivaciones(0);
            }}
            className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
              v.id === seleccionada
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.etiqueta}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
            {variante.codigo}
          </pre>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
            <p className="text-xs text-muted-foreground">
              Probalo en vivo: con el mouse, y después con Tab + Enter o Espacio.
            </p>
            <div className="flex items-center gap-4">
              {renderVariante(variante.id, () => setActivaciones((n) => n + 1))}
              <span className="font-mono text-xs text-muted-foreground" aria-live="polite">
                activado {activaciones} {activaciones === 1 ? "vez" : "veces"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Árbol de accesibilidad</p>
          <dl className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4 font-mono text-xs">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">role</dt>
              <dd className="text-foreground">{variante.rol}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">name</dt>
              <dd className={variante.nombreAccesible ? "text-foreground" : "text-error"}>
                {variante.nombreAccesible ? `"${variante.nombreAccesible}"` : "(vacío)"}
              </dd>
            </div>
            <div className="flex flex-col gap-1 pt-2">
              <Estado ok={variante.enfocableConTab} texto="enfocable con Tab" />
              <Estado ok={variante.activableConTeclado} texto="se activa con Enter / Espacio" />
            </div>
          </dl>
          <p className="text-sm text-foreground">
            Lector de pantalla: <span className="text-muted-foreground">{variante.anuncio}</span>
          </p>
          <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
            {variante.leccion}
          </p>
        </div>
      </div>
    </div>
  );
}
