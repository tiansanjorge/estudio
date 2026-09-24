"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { paradasDeTab, siguienteIndice } from "@/lib/modules/accesibilidad/navegacion-teclado";
import { BloqueCodigo } from "./BloqueCodigo";

function generarCodigo(roving: boolean): string {
  const boton = roving
    ? "    <button key={h} tabIndex={i === activo ? 0 : -1}>{h}</button>"
    : "    <button key={h}>{h}</button> {/* cada botón es una parada de Tab */}";
  const lineas = [
    `<div role="toolbar" aria-label="Formato"${roving ? " onKeyDown={alPresionarTecla}" : ""}>`,
    "  {herramientas.map((h, i) => (",
    boton,
    "  ))}",
    "</div>",
  ];
  if (roving) {
    lineas.push(
      "",
      "function alPresionarTecla(e) {",
      "  // ←/→ mueven dentro; Home/End van a los extremos",
      "  const destino = siguienteIndice(activo, e.key);",
      "  setActivo(destino);          // el nuevo tabIndex=0",
      "  botones[destino].focus();",
      "}",
    );
  }
  return lineas.join("\n");
}

const HERRAMIENTAS = ["Negrita", "Cursiva", "Subrayado", "Izquierda", "Centro", "Derecha"];

const ESTILO_CONTROL =
  "rounded-lg border px-2.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function RovingToolbarSimulador() {
  const [roving, setRoving] = useState(true);
  const [activo, setActivo] = useState(0);
  const [aplicadas, setAplicadas] = useState<Set<number>>(new Set());
  const botonesRef = useRef<(HTMLButtonElement | null)[]>([]);

  function alPresionarTecla(e: KeyboardEvent<HTMLDivElement>) {
    if (!roving) return;
    const destino = siguienteIndice(activo, e.key, HERRAMIENTAS.length);
    if (destino === null) return;
    e.preventDefault();
    setActivo(destino);
    botonesRef.current[destino]?.focus();
  }

  function alternar(indice: number) {
    setActivo(indice);
    setAplicadas((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(indice)) siguiente.delete(indice);
      else siguiente.add(indice);
      return siguiente;
    });
  }

  const paradas = paradasDeTab(HERRAMIENTAS.length, roving);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {[true, false].map((modo) => (
          <button
            key={String(modo)}
            type="button"
            aria-pressed={roving === modo}
            onClick={() => setRoving(modo)}
            className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
              roving === modo
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {modo ? "Roving tabindex" : "Todos tabulables"}
          </button>
        ))}
        <span
          className={`rounded-lg border px-3 py-1 font-mono text-xs ${
            roving
              ? "border-success/30 bg-success-soft text-success"
              : "border-warning/30 bg-warning-soft text-warning"
          }`}
        >
          Tabs para cruzar la toolbar: {paradas}
        </span>
      </div>

      <BloqueCodigo codigo={generarCodigo(roving)} resaltadas={roving ? [3, 10, 11] : [3]} />

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4">
        <button type="button" className={`${ESTILO_CONTROL} self-start border-border text-foreground`}>
          Menú anterior
        </button>

        <div
          role="toolbar"
          aria-label="Formato de texto"
          onKeyDown={alPresionarTecla}
          className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-2"
        >
          {HERRAMIENTAS.map((nombre, i) => {
            const tabIndex = roving ? (i === activo ? 0 : -1) : 0;
            return (
              <div key={nombre} className="flex flex-col items-center gap-1">
                <button
                  ref={(el) => {
                    botonesRef.current[i] = el;
                  }}
                  type="button"
                  tabIndex={tabIndex}
                  aria-pressed={aplicadas.has(i)}
                  onClick={() => alternar(i)}
                  onFocus={() => setActivo(i)}
                  className={`${ESTILO_CONTROL} ${
                    aplicadas.has(i)
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border text-foreground"
                  }`}
                >
                  {nombre}
                </button>
                <span
                  className={`font-mono text-[10px] ${
                    tabIndex === 0 ? "text-accent" : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                >
                  tabindex={tabIndex}
                </span>
              </div>
            );
          })}
        </div>

        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Documento
          <textarea
            rows={2}
            className="rounded-lg border border-border bg-surface p-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            defaultValue="Llegá hasta acá con Tab desde “Menú anterior”."
          />
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {roving
          ? "Tab entra a la toolbar una sola vez (al último botón usado); ←/→ se mueven adentro, Home/End van a los extremos, y el próximo Tab sale al documento."
          : "Cada botón es una parada de Tab: para llegar al documento hay que atravesar toda la toolbar. Con 6 botones molesta; con una grilla de 50 celdas es inusable."}
      </p>
    </div>
  );
}
