export type TipoHeader = "request" | "response";

export interface HeaderHttp {
  nombre: string;
  tipo: TipoHeader;
  descripcion: string;
  ejemplo: string;
}

export const headersHttp: HeaderHttp[] = [
  {
    nombre: "Authorization",
    tipo: "request",
    descripcion: "Credenciales para autenticar la petición.",
    ejemplo: "Authorization: Bearer eyJhbGciOi...",
  },
  {
    nombre: "Content-Type (request)",
    tipo: "request",
    descripcion: "Formato del body que estás mandando en la petición.",
    ejemplo: "Content-Type: application/json",
  },
  {
    nombre: "Accept",
    tipo: "request",
    descripcion: "Formato de respuesta que el cliente está dispuesto a procesar.",
    ejemplo: "Accept: application/json",
  },
  {
    nombre: "Origin",
    tipo: "request",
    descripcion:
      "El navegador lo agrega automáticamente en peticiones cross-origin. El servidor lo usa para decidir si autoriza CORS.",
    ejemplo: "Origin: https://miapp.com",
  },
  {
    nombre: "If-None-Match",
    tipo: "request",
    descripcion:
      "ETag que el cliente tiene cacheado, para preguntarle al servidor si el recurso cambió.",
    ejemplo: 'If-None-Match: "abc123"',
  },
  {
    nombre: "Content-Type (response)",
    tipo: "response",
    descripcion: "Formato del body que devuelve el servidor.",
    ejemplo: "Content-Type: application/json; charset=utf-8",
  },
  {
    nombre: "Access-Control-Allow-Origin",
    tipo: "response",
    descripcion: "Qué orígenes tienen permitido leer esta respuesta (CORS).",
    ejemplo: "Access-Control-Allow-Origin: https://miapp.com",
  },
  {
    nombre: "Cache-Control",
    tipo: "response",
    descripcion: "Reglas de cacheo para el cliente y los proxies intermedios.",
    ejemplo: "Cache-Control: max-age=3600, must-revalidate",
  },
  {
    nombre: "ETag",
    tipo: "response",
    descripcion: "Identificador único del estado actual del recurso, para validar caché.",
    ejemplo: 'ETag: "abc123"',
  },
  {
    nombre: "Set-Cookie",
    tipo: "response",
    descripcion: "Le pide al navegador que guarde una cookie.",
    ejemplo: "Set-Cookie: session=xyz; HttpOnly; Secure",
  },
  {
    nombre: "Location",
    tipo: "response",
    descripcion:
      "URL a la que redirigir (con 3xx) o URL del recurso recién creado (con 201).",
    ejemplo: "Location: /usuarios/42",
  },
];
