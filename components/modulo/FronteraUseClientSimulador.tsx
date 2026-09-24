"use client";

import { useState } from "react";
import {
  ARBOL,
  evaluar,
  kbEnCliente,
  type NodoComponente,
  type ResultadoNodo,
} from "@/lib/modules/nextjs/server-vs-client-components";
import { BloqueCodigo } from "./BloqueCodigo";

/** Header.tsx y Buscador.tsx según las marcas actuales, comentados con el resultado. */
function generarCodigo(marcas: ReadonlySet<string>, resultados: Map<string, ResultadoNodo>): string {
  const directiva = (id: string) =>
    marcas.has(id) ? '"use client";' : "// (sin directiva)";
  const logoEnCliente = resultados.get("logo")?.entorno === "cliente";
  const buscadorFalla = Boolean(resultados.get("buscador")?.error);
  return [
    "// Header.tsx",
    directiva("header"),
    `import { Logo } from "./Logo"; // ${logoEnCliente ? "va al cliente por herencia" : "se queda en el servidor"}`,
    'import { Buscador } from "./Buscador";',
    "",
    "// Buscador.tsx",
    directiva("buscador"),
    `const [q, setQ] = useState(""); // ${buscadorFalla ? "ERROR: hook en un Server Component" : "OK: corre en el cliente"}`,
  ].join("\n");
}

interface PropsNodo {
  nodo: NodoComponente;
  resultados: Map<string, ResultadoNodo>;
  marcas: ReadonlySet<string>;
  alternar: (id: string) => void;
}

function Nodo({ nodo, resultados, marcas, alternar }: PropsNodo) {
  const resultado = resultados.get(nodo.id)!;
  const esCliente = resultado.entorno === "cliente";

  return (
    <li className="flex flex-col gap-2">
      <div
        className={`flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2 ${
          resultado.error
            ? "border-error/30 bg-error-soft"
            : esCliente
              ? "border-warning/30 bg-warning-soft"
              : "border-border bg-surface"
        }`}
      >
        <span className="font-mono text-sm text-foreground">&lt;{nodo.nombre}&gt;</span>
        <span
          className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] ${
            esCliente ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
          }`}
        >
          {esCliente ? (resultado.heredado ? "cliente (heredado)" : "cliente") : "servidor"}
        </span>
        <span className="text-xs text-muted-foreground">{nodo.detalle}</span>
        <button
          type="button"
          aria-pressed={marcas.has(nodo.id)}
          onClick={() => alternar(nodo.id)}
          className={`ml-auto rounded-lg border px-2 py-1 font-mono text-[11px] transition-colors ${
            marcas.has(nodo.id)
              ? "border-accent bg-accent-soft text-accent"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          &quot;use client&quot;
        </button>
        {(resultado.error || nodo.nota) && (
          <p className="basis-full text-xs">
            {resultado.error && <span className="text-error">{resultado.error} </span>}
            {nodo.nota && <span className="text-muted-foreground">{nodo.nota}.</span>}
          </p>
        )}
      </div>
      {nodo.importa.length > 0 && (
        <ul className="flex flex-col gap-2 border-l border-border pl-4">
          {nodo.importa.map((hijo) => (
            <Nodo key={hijo.id} nodo={hijo} resultados={resultados} marcas={marcas} alternar={alternar} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function FronteraUseClientSimulador() {
  const [marcas, setMarcas] = useState<Set<string>>(new Set());
  const resultados = evaluar(marcas);
  const kb = kbEnCliente(resultados);
  const errores = [...resultados.values()].filter((r) => r.error).length;

  function alternar(id: string) {
    setMarcas((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(id)) siguiente.delete(id);
      else siguiente.add(id);
      return siguiente;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span
          className={`rounded-lg border px-3 py-1 font-mono text-xs ${
            errores === 0
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          {errores === 0 ? "Sin errores" : `${errores} componente(s) en el entorno equivocado`}
        </span>
        <span className="rounded-lg border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground">
          JS de componentes en el cliente: {kb} KB
        </span>
        <button
          type="button"
          onClick={() => setMarcas(new Set())}
          className="text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          reiniciar
        </button>
      </div>

      <BloqueCodigo
        titulo="Dos de los archivos del árbol"
        codigo={generarCodigo(marcas, resultados)}
        resaltadas={[2, 3, 7, 8]}
      />

      <ul className="flex flex-col gap-2">
        <Nodo nodo={ARBOL} resultados={resultados} marcas={marcas} alternar={alternar} />
      </ul>

      <p className="text-xs text-muted-foreground">
        El árbol muestra quién IMPORTA a quién. Objetivo: cero errores con la
        menor cantidad de KB en el cliente. Probá también marcar{" "}
        <code>Page</code> y mirá qué pasa con todo lo que importa.
      </p>
    </div>
  );
}
