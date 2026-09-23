/** Secreto SOLO para la demo: en un sistema real vive en el servidor y nunca en el cliente. */
export const SECRETO_DEMO = "secreto-de-demo-no-usar-en-produccion";

/** Token HS256 firmado con SECRETO_DEMO. Payload: sub, nombre, rol, iat, exp (+15 min). */
export const TOKEN_EJEMPLO =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfYW5hXzQyIiwibm9tYnJlIjoiQW5hIiwicm9sIjoiY2xpZW50ZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzY3MjI2NTAwfQ.sSUTQcPjWAajY0DRIuJk1atmk5eBcrawGFOUmzljAOk";

export function base64UrlAJson(segmento: string): unknown {
  const base64 = segmento.replace(/-/g, "+").replace(/_/g, "/");
  const relleno = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(relleno), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function jsonABase64Url(valor: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(valor));
  const binario = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function partes(token: string) {
  const [header, payload, firma] = token.split(".");
  return { header, payload, firma };
}

/** Verifica una firma HS256 con Web Crypto. */
export async function verificarHs256(token: string, secreto: string): Promise<boolean> {
  const { header, payload, firma } = partes(token);
  if (!header || !payload || !firma) return false;
  const clave = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const firmaCalculada = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(`${header}.${payload}`));
  const binario = Array.from(new Uint8Array(firmaCalculada), (b) => String.fromCharCode(b)).join("");
  const esperada = btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return esperada === firma;
}
