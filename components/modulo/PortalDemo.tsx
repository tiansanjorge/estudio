"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BloqueCodigo } from "./BloqueCodigo";

function generarCodigo(usarPortal: boolean): string {
  const menu = usarPortal
    ? "{abierto && createPortal(<Menu />, document.body)}"
    : "{abierto && <Menu />}";
  const nota = usarPortal
    ? [
        "// DOM: <Menu> vive en <body>, fuera del div recortado",
        "// React: sigue siendo hijo del div → el click burbujea hasta onClick",
      ]
    : ["// DOM y React: <Menu> es hijo del div → overflow: hidden lo recorta"];
  return [
    '<div onClick={registrar} style={{ overflow: "hidden" }}>',
    "  <button onClick={abrirMenu}>Abrir menú</button>",
    `  ${menu}`,
    "</div>",
    ...nota,
  ].join("\n");
}

export function PortalDemo() {
  const [montado, setMontado] = useState(false);
  const [usarPortal, setUsarPortal] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const [log, setLog] = useState<string[]>([]);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true);
  }, []);

  function registrar(mensaje: string) {
    setLog((prev) => [mensaje, ...prev].slice(0, 4));
  }

  function abrirMenu() {
    const rect = botonRef.current?.getBoundingClientRect();
    if (rect) {
      setPosicion({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX });
    }
    setMenuAbierto((v) => !v);
  }

  const menu = (
    <div
      role="menu"
      className="w-48 rounded-xl border border-accent/30 bg-surface p-2 shadow-lg"
      style={
        usarPortal
          ? { position: "absolute", top: posicion.top, left: posicion.left }
          : { position: "absolute", top: "2.5rem", left: 0 }
      }
    >
      <button
        type="button"
        onClick={() => {
          registrar("Click en item del menú (dentro del portal)");
          setMenuAbierto(false);
        }}
        className="w-full rounded-lg px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent-soft hover:text-accent"
      >
        Opción del menú
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setUsarPortal((v) => !v)}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
            usarPortal
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {usarPortal ? "Con portal" : "Sin portal"}
        </button>
        <span className="text-xs text-muted-foreground">
          El contenedor de abajo tiene overflow: hidden.
        </span>
      </div>

      <BloqueCodigo codigo={generarCodigo(usarPortal)} resaltadas={[1, 3]} />

      <div
        onClick={() => registrar("Click detectado en el contenedor externo (por bubbling de React)")}
        className="relative h-28 overflow-hidden rounded-xl border border-border bg-background p-4"
      >
        <button
          ref={botonRef}
          type="button"
          onClick={abrirMenu}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground hover:bg-accent-soft hover:text-accent"
        >
          Abrir menú
        </button>

        {menuAbierto && !usarPortal && menu}
        {menuAbierto && usarPortal && montado && createPortal(menu, document.body)}
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs">
        <span className="text-muted-foreground">Log de eventos:</span>
        <div className="mt-2 flex flex-col gap-1">
          {log.length === 0 ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            log.map((linea, i) => <span key={i}>&gt; {linea}</span>)
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Sin portal, el menú queda recortado por el overflow: hidden del
        contenedor. Con portal, se renderiza en document.body y se ve
        completo — pero un click en su item sigue apareciendo en el log
        como si viniera &quot;desde adentro&quot; del contenedor, porque
        el evento burbujea por el árbol de React, no por el DOM.
      </p>
    </div>
  );
}
