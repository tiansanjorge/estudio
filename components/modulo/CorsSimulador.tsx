"use client";

import { useState } from "react";
import { evaluarCors, type MetodoCors } from "@/lib/modules/http/cors";
import { BloqueCodigo } from "./BloqueCodigo";

const ORIGEN = "https://app.com";

const REQUEST: Record<MetodoCors, { linea: string; contentType?: string }> = {
  GET: { linea: "GET /pedidos HTTP/1.1" },
  "POST-form": {
    linea: "POST /pedidos HTTP/1.1",
    contentType: "application/x-www-form-urlencoded",
  },
  "POST-json": { linea: "POST /pedidos HTTP/1.1", contentType: "application/json" },
  PUT: { linea: "PUT /pedidos HTTP/1.1", contentType: "application/json" },
};

/** Intercambio HTTP entre app.com y api.com; devuelve también las líneas clave. */
function generarIntercambio(metodo: MetodoCors, origenPermitido: boolean, preflight: boolean) {
  const lineas: string[] = [];
  const resaltadas: number[] = [];
  const marcar = (linea: string) => {
    lineas.push(linea);
    resaltadas.push(lineas.length);
  };
  const acao = () =>
    origenPermitido
      ? marcar(`Access-Control-Allow-Origin: ${ORIGEN}`)
      : marcar("// (sin Access-Control-Allow-Origin para app.com)");
  const { linea, contentType } = REQUEST[metodo];

  if (preflight) {
    lineas.push("// 1) preflight: lo manda el navegador solo, antes de tu fetch");
    lineas.push(`OPTIONS /pedidos HTTP/1.1`);
    lineas.push(`Origin: ${ORIGEN}`);
    lineas.push(`Access-Control-Request-Method: ${linea.split(" ")[0]}`);
    lineas.push("Access-Control-Request-Headers: content-type");
    lineas.push("");
    lineas.push("HTTP/1.1 204 No Content");
    acao();
    if (origenPermitido) {
      lineas.push("Access-Control-Allow-Methods: GET, POST, PUT");
      lineas.push("Access-Control-Allow-Headers: content-type");
    } else {
      lineas.push("");
      marcar("// el navegador frena acá: la petición real nunca se envía");
      return { codigo: lineas.join("\n"), resaltadas };
    }
    lineas.push("");
    lineas.push("// 2) petición real");
  }

  lineas.push(linea);
  lineas.push(`Origin: ${ORIGEN}`);
  if (contentType) lineas.push(`Content-Type: ${contentType}`);
  lineas.push("");
  lineas.push("HTTP/1.1 200 OK");
  acao();
  if (!origenPermitido) {
    lineas.push("");
    marcar("// el servidor YA procesó el pedido; el navegador solo impide que tu JS lea la respuesta");
  }
  return { codigo: lineas.join("\n"), resaltadas };
}

const metodos: { valor: MetodoCors; etiqueta: string }[] = [
  { valor: "GET", etiqueta: "GET" },
  { valor: "POST-form", etiqueta: "POST (form)" },
  { valor: "POST-json", etiqueta: "POST (JSON)" },
  { valor: "PUT", etiqueta: "PUT" },
];

export function CorsSimulador() {
  const [metodo, setMetodo] = useState<MetodoCors>("GET");
  const [origenPermitido, setOrigenPermitido] = useState(true);

  const resultado = evaluarCors({ metodo, origenPermitido });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Método de la petición
        </span>
        <div className="flex flex-wrap gap-2">
          {metodos.map((item) => (
            <button
              key={item.valor}
              type="button"
              onClick={() => setMetodo(item.valor)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-sm transition-colors ${
                item.valor === metodo
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          El servidor incluye tu origen en Access-Control-Allow-Origin
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrigenPermitido(true)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              origenPermitido
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => setOrigenPermitido(false)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              !origenPermitido
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <BloqueCodigo
        titulo="app.com → api.com"
        {...generarIntercambio(metodo, origenPermitido, resultado.requierePreflight)}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {resultado.requierePreflight
            ? "Requiere preflight (OPTIONS)"
            : "Request simple, sin preflight"}
        </span>
        <ol className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
          {resultado.pasos.map((paso, index) => (
            <li key={index}>
              <span className="text-foreground">{index + 1}.</span> {paso}
            </li>
          ))}
        </ol>
        <span
          className={`w-fit rounded-lg border px-3 py-1 text-sm font-medium ${
            resultado.resultado === "permitido"
              ? "border-success/30 bg-success-soft text-success"
              : "border-error/30 bg-error-soft text-error"
          }`}
        >
          {resultado.resultado === "permitido" ? "Permitido" : "Bloqueado"}
        </span>
      </div>
    </div>
  );
}
