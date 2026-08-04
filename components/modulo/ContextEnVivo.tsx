"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Tema = "claro" | "oscuro";

const TemaContext = createContext<Tema>("claro");

function useTema() {
  return useContext(TemaContext);
}

function CapaIntermedia({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-4">{children}</div>
  );
}

function BotonAccion() {
  const tema = useTema();
  return (
    <button
      type="button"
      className={`rounded-lg border px-4 py-2 text-sm font-medium ${
        tema === "oscuro"
          ? "border-foreground bg-foreground text-background"
          : "border-accent/30 bg-accent-soft text-accent"
      }`}
    >
      Botón — lee tema=&apos;{tema}&apos; directo del Context
    </button>
  );
}

export function ContextEnVivo() {
  const [tema, setTema] = useState<Tema>("claro");

  return (
    <TemaContext.Provider value={tema}>
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={() => setTema((t) => (t === "claro" ? "oscuro" : "claro"))}
          className="w-fit rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
        >
          Cambiar tema (actual: {tema})
        </button>

        <p className="text-sm text-muted-foreground">
          CapaIntermedia está anidada 3 veces. Ninguna de esas instancias
          recibe &apos;tema&apos; como prop en ningún lado del código —
          fijate en el código fuente si querés. BotonAccion lo lee
          directo del Context, sin importar qué tan profundo esté.
        </p>

        <CapaIntermedia>
          <CapaIntermedia>
            <CapaIntermedia>
              <BotonAccion />
            </CapaIntermedia>
          </CapaIntermedia>
        </CapaIntermedia>
      </div>
    </TemaContext.Provider>
  );
}
