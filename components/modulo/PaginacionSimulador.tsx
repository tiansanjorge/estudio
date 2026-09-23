"use client";

import { useState } from "react";
import {
  DATASET_INICIAL,
  TAMANO_PAGINA,
  analizar,
  paginaPorCursor,
  paginaPorOffset,
} from "@/lib/modules/backend/diseno-apis-rest";

interface Estado {
  dataset: number[];
  offsetCargados: number[];
  offsetPaginas: number;
  cursorCargados: number[];
  eventos: string[];
}

function estadoInicial(): Estado {
  const primera = paginaPorOffset(DATASET_INICIAL, 0);
  return {
    dataset: DATASET_INICIAL,
    offsetCargados: primera,
    offsetPaginas: 1,
    cursorCargados: paginaPorCursor(DATASET_INICIAL, null),
    eventos: [`Se cargó la página 1 (${TAMANO_PAGINA} posts) en las dos estrategias.`],
  };
}

function Columna({
  titulo,
  request,
  cargados,
  dataset,
}: {
  titulo: string;
  request: string;
  cargados: number[];
  dataset: number[];
}) {
  const { duplicados, salteados } = analizar(cargados, dataset);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{titulo}</span>
      <code className="font-mono text-[11px] text-muted-foreground">{request}</code>
      <ul className="flex flex-wrap gap-1.5">
        {cargados.map((id, i) => (
          <li
            key={`${id}-${i}`}
            className={`rounded-md border px-2 py-1 font-mono text-xs ${
              duplicados.has(id) ? "border-error/30 bg-error-soft text-error" : "border-border bg-surface text-foreground"
            }`}
          >
            #{id}
          </li>
        ))}
      </ul>
      <p className={`font-mono text-[11px] ${duplicados.size || salteados.length ? "text-error" : "text-success"}`}>
        duplicados: {duplicados.size ? [...duplicados].map((d) => `#${d}`).join(", ") : "ninguno"} · salteados:{" "}
        {salteados.length ? salteados.map((s) => `#${s}`).join(", ") : "ninguno"}
      </p>
    </div>
  );
}

export function PaginacionSimulador() {
  const [estado, setEstado] = useState<Estado>(estadoInicial);
  const ultimoCursor = estado.cursorCargados.at(-1) ?? null;

  function cargarSiguiente() {
    setEstado((e) => {
      const deOffset = paginaPorOffset(e.dataset, e.offsetPaginas);
      const deCursor = paginaPorCursor(e.dataset, e.cursorCargados.at(-1) ?? null);
      return {
        ...e,
        offsetCargados: [...e.offsetCargados, ...deOffset],
        offsetPaginas: e.offsetPaginas + 1,
        cursorCargados: [...e.cursorCargados, ...deCursor],
        eventos: [...e.eventos, "El usuario scrollea y se pide la página siguiente."],
      };
    });
  }

  function publicarNuevo() {
    setEstado((e) => {
      const nuevo = e.dataset[0] + 1;
      return {
        ...e,
        dataset: [nuevo, ...e.dataset],
        eventos: [...e.eventos, `Alguien publica el post #${nuevo}: todo se corre un lugar.`],
      };
    });
  }

  function borrarUnoVisto() {
    setEstado((e) => {
      const victima = e.offsetCargados.find((id) => e.dataset.includes(id));
      if (victima === undefined) return e;
      return {
        ...e,
        dataset: e.dataset.filter((id) => id !== victima),
        eventos: [...e.eventos, `Se borra el post #${victima}, que ya estaba en pantalla.`],
      };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={publicarNuevo} className="rounded-xl border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent">
          Llega un post nuevo arriba
        </button>
        <button type="button" onClick={borrarUnoVisto} className="rounded-xl border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent">
          Se borra un post ya visto
        </button>
        <button type="button" onClick={cargarSiguiente} className="rounded-xl border border-accent bg-accent-soft px-3 py-1.5 text-xs text-accent">
          Cargar página siguiente
        </button>
        <button type="button" onClick={() => setEstado(estadoInicial())} className="text-xs text-muted-foreground underline-offset-2 hover:underline">
          reiniciar
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Columna
          titulo="Offset"
          request={`GET /posts?limit=${TAMANO_PAGINA}&offset=${estado.offsetPaginas * TAMANO_PAGINA}`}
          cargados={estado.offsetCargados}
          dataset={estado.dataset}
        />
        <Columna
          titulo="Cursor"
          request={`GET /posts?limit=${TAMANO_PAGINA}&cursor=${ultimoCursor ?? ""}`}
          cargados={estado.cursorCargados}
          dataset={estado.dataset}
        />
      </div>

      <ol className="flex flex-col gap-1 border-l border-border pl-3 text-xs text-muted-foreground" aria-live="polite">
        {estado.eventos.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ol>

      <p className="text-xs text-muted-foreground">
        Probá: publicá un post y después cargá la página siguiente. Con offset, el último post de la
        página 1 vuelve a aparecer; con cursor, no. Borrar un post visto hace que offset saltee uno.
      </p>
    </div>
  );
}
