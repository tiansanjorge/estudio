"use client";

import { useState } from "react";
import { BUGS, TESTS, type TipoTest } from "@/lib/modules/testing/unit-integration-e2e";

export function NivelesTestComparador() {
  const [tipo, setTipo] = useState<TipoTest>("integracion");
  const [bugId, setBugId] = useState(BUGS[0].id);
  const test = TESTS.find((t) => t.tipo === tipo) ?? TESTS[0];
  const bug = BUGS.find((b) => b.id === bugId) ?? BUGS[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-sm text-foreground">Feature: aplicar un cupón de descuento en el carrito.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de test">
          {TESTS.map((t) => (
            <button
              key={t.tipo}
              type="button"
              aria-pressed={t.tipo === tipo}
              onClick={() => setTipo(t.tipo)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                t.tipo === tipo
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.titulo}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="text-foreground">{test.herramientas}</span> · {test.alcance}
        </p>
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs leading-5 text-foreground">
          {test.codigo}
        </pre>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">¿Qué test atrapa este bug?</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Bug introducido">
          {BUGS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={b.id === bugId}
              onClick={() => setBugId(b.id)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                b.id === bugId
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.descripcion}
            </button>
          ))}
        </div>
        <ul className="grid gap-2 sm:grid-cols-3">
          {TESTS.map((t) => (
            <li
              key={t.tipo}
              className={`rounded-xl border px-3 py-2 font-mono text-xs ${
                bug.detecta[t.tipo]
                  ? "border-success/30 bg-success-soft text-success"
                  : "border-error/30 bg-error-soft text-error"
              }`}
            >
              {t.titulo}: {bug.detecta[t.tipo] ? "falla ✓ (lo detecta)" : "pasa ✗ (no lo ve)"}
            </li>
          ))}
        </ul>
        <p className="rounded-xl border border-info/30 bg-info-soft px-3 py-2 text-sm text-foreground">
          {bug.explicacion}
        </p>
      </div>
    </div>
  );
}
