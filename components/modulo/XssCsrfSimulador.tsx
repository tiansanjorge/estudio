"use client";

import { useState } from "react";
import {
  PAYLOADS,
  REQUESTS_CROSS_SITE,
  cookieViaja,
  explicarCsrf,
  renderizar,
  type ModoRender,
  type SameSite,
} from "@/lib/modules/seguridad/cors-csrf-xss";

const MODOS: { id: ModoRender; codigo: string }[] = [
  { id: "jsx", codigo: "<p>{comentario}</p>" },
  { id: "innerHTML", codigo: "<p dangerouslySetInnerHTML={{ __html: comentario }} />" },
  { id: "sanitizado", codigo: "<p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comentario) }} />" },
];

const boton = (activo: boolean) =>
  `rounded-xl border px-3 py-1.5 text-xs transition-colors ${
    activo ? "border-accent bg-accent-soft text-accent" : "border-border text-muted-foreground hover:text-foreground"
  }`;

function SimuladorXss() {
  const [payloadId, setPayloadId] = useState<string>(PAYLOADS[0].id);
  const [modo, setModo] = useState<ModoRender>("innerHTML");
  const payload = PAYLOADS.find((p) => p.id === payloadId) ?? PAYLOADS[0];
  const resultado = renderizar(payload.valor, modo);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Comentario que manda un usuario</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Payload">
          {PAYLOADS.map((p) => (
            <button key={p.id} type="button" aria-pressed={p.id === payloadId} onClick={() => setPayloadId(p.id)} className={boton(p.id === payloadId)}>
              {p.etiqueta}
            </button>
          ))}
        </div>
        <code className="break-all rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground">
          {payload.valor}
        </code>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Cómo lo renderiza la app</span>
        <div className="flex flex-col gap-1.5" role="group" aria-label="Modo de render">
          {MODOS.map((m) => (
            <button key={m.id} type="button" aria-pressed={m.id === modo} onClick={() => setModo(m.id)} className={`${boton(m.id === modo)} text-left font-mono`}>
              {m.codigo}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2" aria-live="polite">
        <span className="text-xs text-muted-foreground">HTML que termina en el DOM</span>
        <code className="break-all rounded-lg border border-border bg-background p-2 font-mono text-xs text-foreground">
          {resultado.htmlResultante || "(vacío)"}
        </code>
        <p
          className={`rounded-lg border px-3 py-2 text-xs ${
            resultado.ejecuta ? "border-error/30 bg-error-soft text-error" : "border-success/30 bg-success-soft text-success"
          }`}
        >
          {resultado.ejecuta ? "✗ Se ejecuta código del atacante. " : "✓ No se ejecuta nada. "}
          <span className="text-foreground">{resultado.explicacion}</span>
        </p>
      </div>
    </div>
  );
}

function SimuladorCsrf() {
  const [sameSite, setSameSite] = useState<SameSite>("None");
  const [requestId, setRequestId] = useState<string>(REQUESTS_CROSS_SITE[0].id);
  const request = REQUESTS_CROSS_SITE.find((r) => r.id === requestId) ?? REQUESTS_CROSS_SITE[0];
  const viaja = cookieViaja(sameSite, request);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        El usuario está logueado en tubanco.com y, en otra pestaña, visita malicioso.com.
      </p>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Cookie de sesión de tubanco.com</span>
        <div className="flex flex-wrap gap-2" role="group" aria-label="SameSite">
          {(["None", "Lax", "Strict"] as SameSite[]).map((s) => (
            <button key={s} type="button" aria-pressed={s === sameSite} onClick={() => setSameSite(s)} className={`${boton(s === sameSite)} font-mono`}>
              SameSite={s}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Request que dispara malicioso.com</span>
        <div className="flex flex-col gap-1.5" role="group" aria-label="Request">
          {REQUESTS_CROSS_SITE.map((r) => (
            <button key={r.id} type="button" aria-pressed={r.id === requestId} onClick={() => setRequestId(r.id)} className={`${boton(r.id === requestId)} text-left`}>
              {r.etiqueta}
            </button>
          ))}
        </div>
      </div>
      <p
        className={`rounded-lg border px-3 py-2 text-xs ${
          viaja && request.id !== "link-get"
            ? "border-error/30 bg-error-soft text-error"
            : "border-success/30 bg-success-soft text-success"
        }`}
        aria-live="polite"
      >
        {viaja ? "La cookie viaja. " : "La cookie no viaja. "}
        <span className="text-foreground">{explicarCsrf(sameSite, request)}</span>
      </p>
    </div>
  );
}

export function XssCsrfSimulador() {
  const [vista, setVista] = useState<"xss" | "csrf">("xss");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2" role="group" aria-label="Simulador">
        <button type="button" aria-pressed={vista === "xss"} onClick={() => setVista("xss")} className={boton(vista === "xss")}>
          XSS
        </button>
        <button type="button" aria-pressed={vista === "csrf"} onClick={() => setVista("csrf")} className={boton(vista === "csrf")}>
          CSRF
        </button>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-4">
        {vista === "xss" ? <SimuladorXss /> : <SimuladorCsrf />}
      </div>
      <p className="text-xs text-muted-foreground">
        Nada de esto se ejecuta: el simulador analiza el HTML resultante sin insertarlo en la página.
      </p>
    </div>
  );
}
