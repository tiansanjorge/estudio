"use client";

import { useId, useState } from "react";
import { ESQUEMA_ZOD, PAYLOADS, validarRegistro } from "@/lib/modules/backend/validacion-zod";

function parsear(json: string): { ok: true; valor: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, valor: JSON.parse(json) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "JSON inválido" };
  }
}

export function ValidacionSimulador() {
  const idTexto = useId();
  const [json, setJson] = useState(PAYLOADS[0].json);
  const parseado = parsear(json);
  const resultado = parseado.ok ? validarRegistro(parseado.valor) : null;

  return (
    <div className="flex flex-col gap-6">
      <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-[11px] leading-5 text-foreground">
        {ESQUEMA_ZOD}
      </pre>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Payload de ejemplo">
        {PAYLOADS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setJson(p.json)}
            className="rounded-xl border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {p.nombre}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor={idTexto} className="text-sm font-medium text-foreground">
            req.body (editable)
          </label>
          <textarea
            id={idTexto}
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            rows={10}
            className="rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground focus-visible:outline-2 focus-visible:outline-accent"
          />
        </div>

        <div className="flex flex-col gap-2" aria-live="polite">
          <span className="text-sm font-medium text-foreground">RegistroSchema.safeParse(body)</span>
          {!parseado.ok ? (
            <p className="rounded-lg border border-error/30 bg-error-soft px-3 py-2 font-mono text-xs text-error">
              400: el body no es JSON válido ({parseado.error})
            </p>
          ) : resultado?.success ? (
            <>
              <p className="rounded-lg border border-success/30 bg-success-soft px-3 py-1.5 font-mono text-xs text-success">
                success: true — el handler recibe datos tipados y normalizados
              </p>
              <pre className="rounded-lg border border-border bg-surface p-2 font-mono text-xs text-foreground">
                {JSON.stringify(resultado.data, null, 2)}
              </pre>
            </>
          ) : (
            <>
              <p className="rounded-lg border border-error/30 bg-error-soft px-3 py-1.5 font-mono text-xs text-error">
                success: false — el handler responde 400 con los issues
              </p>
              <ul className="flex flex-col gap-1 font-mono text-xs">
                {resultado?.issues.map((i) => (
                  <li key={`${i.path}-${i.message}`} className="text-foreground">
                    <span className="text-error">{i.path}</span>: {i.message}
                  </li>
                ))}
              </ul>
            </>
          )}
          {resultado && resultado.descartadas.length > 0 && (
            <p className="rounded-lg border border-info/30 bg-info-soft px-3 py-1.5 text-xs text-foreground">
              Claves descartadas por no estar en el schema:{" "}
              <code className="font-mono">{resultado.descartadas.join(", ")}</code>. Si el handler
              hubiera hecho <code className="font-mono">db.usuario.create({"{ data: req.body }"})</code>,
              se guardaban.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        El playground aplica las mismas reglas que el schema con una función escrita a mano, para no
        sumar Zod como dependencia del sitio; en un proyecto real se usa la librería.
      </p>
    </div>
  );
}
