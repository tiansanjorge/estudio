"use client";

import { useState } from "react";
import {
  SECRETO_DEMO,
  TOKEN_EJEMPLO,
  base64UrlAJson,
  jsonABase64Url,
  partes,
  verificarHs256,
} from "@/lib/modules/seguridad/jwt-sesiones";

interface Payload {
  sub: string;
  nombre: string;
  rol: string;
  iat: number;
  exp: number;
}

const PAYLOAD_ORIGINAL = base64UrlAJson(partes(TOKEN_EJEMPLO).payload) as Payload;
/** "Ahora" de la demo: un minuto después de emitido el token. */
const AHORA_DEMO = PAYLOAD_ORIGINAL.iat + 60;

type Verificacion = "valida" | "invalida" | "verificando";

export function JwtInspector() {
  const [rol, setRol] = useState(PAYLOAD_ORIGINAL.rol);
  const [minutosTranscurridos, setMinutosTranscurridos] = useState(1);
  const [token, setToken] = useState(TOKEN_EJEMPLO);
  const [verificacion, setVerificacion] = useState<Verificacion>("valida");

  const { header, payload, firma } = partes(token);
  const payloadDecodificado = base64UrlAJson(payload) as Payload;
  const ahora = AHORA_DEMO + (minutosTranscurridos - 1) * 60;
  const vencido = ahora >= payloadDecodificado.exp;

  async function cambiarRol(nuevoRol: string) {
    setRol(nuevoRol);
    // el atacante edita el payload pero no puede recalcular la firma sin el secreto
    const nuevoPayload = jsonABase64Url({ ...PAYLOAD_ORIGINAL, rol: nuevoRol });
    const nuevoToken = `${header}.${nuevoPayload}.${firma}`;
    setToken(nuevoToken);
    setVerificacion("verificando");
    setVerificacion((await verificarHs256(nuevoToken, SECRETO_DEMO)) ? "valida" : "invalida");
  }

  const aceptado = verificacion === "valida" && !vencido;

  return (
    <div className="flex flex-col gap-6">
      <div className="break-all rounded-xl border border-border bg-background p-3 font-mono text-xs leading-5">
        <span className="text-error">{header}</span>.<span className="text-accent">{payload}</span>.
        <span className="text-info">{firma}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-error">Header</span>
          <pre className="rounded-lg border border-border bg-surface p-2 font-mono text-[11px] text-foreground">
            {JSON.stringify(base64UrlAJson(header), null, 2)}
          </pre>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-accent">Payload (legible por cualquiera)</span>
          <pre className="rounded-lg border border-border bg-surface p-2 font-mono text-[11px] text-foreground">
            {JSON.stringify(payloadDecodificado, null, 2)}
          </pre>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-info">Firma</span>
          <p className="rounded-lg border border-border bg-surface p-2 font-mono text-[11px] text-foreground">
            HMAC-SHA256(header + &quot;.&quot; + payload, secreto)
          </p>
          <p className="text-[11px] text-muted-foreground">
            Solo quien tiene el secreto puede generarla. Codificar no es cifrar: el payload se lee
            sin el secreto.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <label className="flex flex-col gap-1 text-xs text-foreground">
          Editar el claim <code>rol</code> (como haría un atacante)
          <select
            value={rol}
            onChange={(e) => void cambiarRol(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-xs"
          >
            <option value="cliente">cliente</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-foreground">
          Minutos desde que se emitió: {minutosTranscurridos}
          <input
            type="range"
            min={1}
            max={30}
            value={minutosTranscurridos}
            onChange={(e) => setMinutosTranscurridos(Number(e.target.value))}
            className="accent-accent"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2" aria-live="polite">
        <p
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
            verificacion === "valida"
              ? "border-success/30 bg-success-soft text-success"
              : verificacion === "invalida"
                ? "border-error/30 bg-error-soft text-error"
                : "border-border bg-surface text-muted-foreground"
          }`}
        >
          Firma: {verificacion === "verificando" ? "verificando…" : verificacion === "valida" ? "válida" : "inválida: el payload fue modificado"}
        </p>
        <p
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs ${
            vencido ? "border-error/30 bg-error-soft text-error" : "border-success/30 bg-success-soft text-success"
          }`}
        >
          exp: {vencido ? "vencido (pasaron más de 15 minutos)" : `vigente, vence en ${15 - minutosTranscurridos} min`}
        </p>
        <p className={`text-sm ${aceptado ? "text-success" : "text-error"}`}>
          El servidor {aceptado ? "acepta" : "rechaza (401)"} el token.
        </p>
      </div>
    </div>
  );
}
