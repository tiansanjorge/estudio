"use client";

import { useId, useState } from "react";
import { ARCHIVO_EJEMPLO, enmascarar, escanear } from "@/lib/modules/seguridad/secrets-management";

const PASOS_RESPUESTA = [
  "Rotar (revocar) el secreto en el proveedor de inmediato: asumí que ya lo vieron.",
  "Revisar los logs del proveedor para ver si se usó.",
  "Mover el valor a un gestor de secretos o a las variables del entorno de deploy.",
  "Recién después, limpiar el historial de git (borrar el archivo no alcanza: queda en commits viejos).",
];

export function EscanerSecretos() {
  const idTexto = useId();
  const [texto, setTexto] = useState(ARCHIVO_EJEMPLO);
  const hallazgos = escanear(texto);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-2">
          <label htmlFor={idTexto} className="text-sm font-medium text-foreground">
            Contenido del commit (editable)
          </label>
          <textarea
            id={idTexto}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            spellCheck={false}
            rows={16}
            className="rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          />
          <button
            type="button"
            onClick={() => setTexto(ARCHIVO_EJEMPLO)}
            className="self-start text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            restaurar ejemplo
          </button>
        </div>

        <div className="flex flex-col gap-2" aria-live="polite">
          <p
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
              hallazgos.length === 0
                ? "border-success/30 bg-success-soft text-success"
                : "border-error/30 bg-error-soft text-error"
            }`}
          >
            {hallazgos.length === 0
              ? "Sin secretos detectados"
              : `${hallazgos.length} posible(s) secreto(s): el pre-commit bloquearía este commit`}
          </p>
          <ul className="flex flex-col gap-2">
            {hallazgos.map((h, i) => (
              <li key={`${h.linea}-${i}`} className="rounded-lg border border-error/30 bg-error-soft p-2 text-xs">
                <p className="font-mono text-error">
                  línea {h.linea} · {h.patron.nombre} · {enmascarar(h.valor)}
                </p>
                <p className="mt-0.5 text-foreground">{h.patron.riesgo}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-info/30 bg-info-soft p-4">
        <p className="text-sm font-medium text-foreground">Si un secreto ya llegó al repo remoto</p>
        <ol className="flex list-decimal flex-col gap-1 pl-5 text-xs text-foreground">
          {PASOS_RESPUESTA.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </div>

      <p className="text-xs text-muted-foreground">
        Los valores del ejemplo son falsos. Herramientas reales como gitleaks, trufflehog o el
        secret scanning de GitHub combinan cientos de patrones con análisis de entropía.
      </p>
    </div>
  );
}
