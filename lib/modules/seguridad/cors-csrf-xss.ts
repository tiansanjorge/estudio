// ── XSS ────────────────────────────────────────────────────────────────────

export type ModoRender = "jsx" | "innerHTML" | "sanitizado";

export const PAYLOADS = [
  { id: "img", etiqueta: "img con onerror", valor: `<img src="x" onerror="robar(document.cookie)">` },
  { id: "script", etiqueta: "etiqueta script", valor: `<script>robar(document.cookie)</script>` },
  { id: "href", etiqueta: "link javascript:", valor: `<a href="javascript:robar()">Ver oferta</a>` },
  { id: "texto", etiqueta: "comentario normal", valor: `¡Muy bueno el producto! <b>Recomendado</b>` },
] as const;

/** Escapa como lo hace React al renderizar un string en JSX. */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitizador DIDÁCTICO (no usar en producción: para eso, DOMPurify).
 * Deja pasar un puñado de etiquetas de formato y descarta el resto.
 */
export function sanitizarDidactico(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/href\s*=\s*("|')\s*javascript:[^"']*\1/gi, 'href="#"')
    .replace(/<(?!\/?(b|i|em|strong|a|p)\b)[^>]*>/gi, "");
}

export interface ResultadoXss {
  htmlResultante: string;
  ejecuta: boolean;
  explicacion: string;
}

export function renderizar(payload: string, modo: ModoRender): ResultadoXss {
  if (modo === "jsx") {
    return {
      htmlResultante: escaparHtml(payload),
      ejecuta: false,
      explicacion:
        "React escapa los strings: el navegador muestra el texto literal y nunca lo interpreta como HTML.",
    };
  }
  if (modo === "sanitizado") {
    return {
      htmlResultante: sanitizarDidactico(payload),
      ejecuta: false,
      explicacion:
        "Se conserva el HTML de formato permitido y se descartan scripts, atributos de eventos y URLs javascript:.",
    };
  }
  const tieneHandler = /\son\w+\s*=/i.test(payload);
  const tieneJsUrl = /javascript:/i.test(payload);
  const soloScript = /<script/i.test(payload) && !tieneHandler && !tieneJsUrl;
  return {
    htmlResultante: payload,
    ejecuta: tieneHandler || tieneJsUrl,
    explicacion: soloScript
      ? "Curiosidad: un <script> insertado con innerHTML NO se ejecuta. Pero no es protección: con <img onerror> se ejecuta igual."
      : tieneHandler
        ? "El atributo onerror se ejecuta apenas falla la carga de la imagen: el código del atacante corre en tu página, con acceso a todo."
        : tieneJsUrl
          ? "Al hacer click, la URL javascript: ejecuta código del atacante."
          : "Este HTML es inofensivo, pero con innerHTML cualquier comentario futuro podría no serlo.",
  };
}

// ── CSRF ───────────────────────────────────────────────────────────────────

export type SameSite = "None" | "Lax" | "Strict";

export const REQUESTS_CROSS_SITE = [
  {
    id: "form-post",
    etiqueta: "Formulario oculto en malicioso.com que hace POST a /transferir",
    metodo: "POST",
    navegacion: true,
  },
  {
    id: "link-get",
    etiqueta: "Link en malicioso.com a tubanco.com/cuenta (el usuario hace click)",
    metodo: "GET",
    navegacion: true,
  },
  {
    id: "img-get",
    etiqueta: "<img src=\"tubanco.com/transferir?monto=1000\"> en malicioso.com",
    metodo: "GET",
    navegacion: false,
  },
] as const;

export type RequestCrossSite = (typeof REQUESTS_CROSS_SITE)[number];

export function cookieViaja(sameSite: SameSite, request: RequestCrossSite): boolean {
  if (sameSite === "None") return true;
  if (sameSite === "Strict") return false;
  // Lax: solo navegaciones de primer nivel con método seguro
  return request.navegacion && request.metodo === "GET";
}

export function explicarCsrf(sameSite: SameSite, request: RequestCrossSite): string {
  const viaja = cookieViaja(sameSite, request);
  if (!viaja) {
    return `Con SameSite=${sameSite} la cookie no viaja en este request cross-site: el servidor lo recibe sin sesión y lo rechaza.`;
  }
  if (request.id === "link-get") {
    return "La cookie viaja (es una navegación GET, y así el usuario llega logueado desde un link externo). Es seguro solo si los GET no cambian estado.";
  }
  if (request.id === "img-get") {
    return "Con SameSite=None la cookie viaja: si /transferir acepta GET, la transferencia se ejecuta. Nunca cambiar estado con GET.";
  }
  return "La cookie viaja con el POST y el servidor ve un request autenticado: la transferencia se ejecuta sin que el usuario lo sepa. Ataque CSRF.";
}
