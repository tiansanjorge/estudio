"use client";

import { useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import { useNivelActivo } from "./NivelTabs";

/**
 * Borrador de respuesta para un desafío. Se guarda en localStorage (solo en
 * este navegador) para no perderlo al navegar o recargar.
 *
 * El textarea es no controlado: el valor guardado se carga después del
 * montaje (en el servidor no existe localStorage) sin provocar re-renders.
 */
export function RespuestaDesafio({ idRespuesta }: { idRespuesta?: string }) {
  const pathname = usePathname();
  const nivel = useNivelActivo();
  const id = useId();
  const ref = useRef<HTMLTextAreaElement>(null);
  const clave = `desafio:${pathname}:nivel-${nivel ?? 0}:${idRespuesta ?? id}`;

  useEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.value = leer(clave);
    ajustarAltura(textarea);
  }, [clave]);

  function alEscribir(textarea: HTMLTextAreaElement) {
    ajustarAltura(textarea);
    guardar(clave, textarea.value);
  }

  function borrar() {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.value = "";
    alEscribir(textarea);
    textarea.focus();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-base font-medium text-foreground">
          Tu respuesta
        </label>
        <button
          type="button"
          onClick={borrar}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-error"
        >
          Borrar
        </button>
      </div>
      <textarea
        id={id}
        ref={ref}
        rows={5}
        spellCheck
        placeholder="Escribí tu respuesta antes de ver la solución…"
        onInput={(e) => alEscribir(e.currentTarget)}
        className="min-h-32 w-full resize-none overflow-hidden rounded-xl border border-border bg-background px-4 py-3 text-base leading-7 text-foreground placeholder:text-muted-foreground focus-visible:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/30"
      />
      <span className="text-xs text-muted-foreground">
        Se guarda automáticamente en este navegador.
      </span>
    </div>
  );
}

function ajustarAltura(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function leer(clave: string): string {
  try {
    return localStorage.getItem(clave) ?? "";
  } catch {
    return "";
  }
}

function guardar(clave: string, valor: string) {
  try {
    if (valor) localStorage.setItem(clave, valor);
    else localStorage.removeItem(clave);
  } catch {
    // Storage bloqueado o lleno: el borrador sigue en pantalla, solo no persiste.
  }
}
