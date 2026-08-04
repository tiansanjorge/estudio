export type CategoriaStatus = "2xx" | "3xx" | "4xx" | "5xx";

export interface StatusCode {
  codigo: number;
  nombre: string;
  categoria: CategoriaStatus;
  descripcion: string;
  ejemplo: string;
}

export const statusCodes: StatusCode[] = [
  {
    codigo: 200,
    nombre: "OK",
    categoria: "2xx",
    descripcion: "La petición se procesó correctamente.",
    ejemplo: "Un GET que devuelve los datos pedidos.",
  },
  {
    codigo: 201,
    nombre: "Created",
    categoria: "2xx",
    descripcion: "Se creó un recurso nuevo.",
    ejemplo: "Un POST /usuarios que crea un usuario y devuelve su ID.",
  },
  {
    codigo: 204,
    nombre: "No Content",
    categoria: "2xx",
    descripcion: "Éxito, pero no hay nada que devolver en el body.",
    ejemplo: "Un DELETE que borró el recurso sin devolver contenido.",
  },
  {
    codigo: 301,
    nombre: "Moved Permanently",
    categoria: "3xx",
    descripcion: "El recurso se movió a otra URL de forma permanente.",
    ejemplo: "Redirigir /viejo-blog a /blog para siempre.",
  },
  {
    codigo: 304,
    nombre: "Not Modified",
    categoria: "3xx",
    descripcion:
      "El recurso no cambió desde la última vez que se pidió: usá la copia en caché.",
    ejemplo: "El navegador manda If-None-Match y el server confirma que el ETag sigue igual.",
  },
  {
    codigo: 307,
    nombre: "Temporary Redirect",
    categoria: "3xx",
    descripcion:
      "Redirección temporal que preserva el método y el body original (a diferencia de 301/302).",
    ejemplo: "Un POST que se redirige y se vuelve a mandar como POST, no como GET.",
  },
  {
    codigo: 400,
    nombre: "Bad Request",
    categoria: "4xx",
    descripcion: "La petición está mal formada (sintaxis inválida, falta un campo requerido).",
    ejemplo: "Mandar un JSON roto en el body.",
  },
  {
    codigo: 401,
    nombre: "Unauthorized",
    categoria: "4xx",
    descripcion: "No sabemos quién sos: falta autenticación o el token es inválido.",
    ejemplo: "Pegarle a un endpoint protegido sin mandar el token.",
  },
  {
    codigo: 403,
    nombre: "Forbidden",
    categoria: "4xx",
    descripcion: "Sabemos quién sos, pero no tenés permiso para hacer esto.",
    ejemplo: "Un usuario normal intentando borrar la cuenta de otro usuario.",
  },
  {
    codigo: 404,
    nombre: "Not Found",
    categoria: "4xx",
    descripcion: "El recurso pedido no existe.",
    ejemplo: "GET /usuarios/9999 cuando ese ID no existe.",
  },
  {
    codigo: 409,
    nombre: "Conflict",
    categoria: "4xx",
    descripcion: "La petición entra en conflicto con el estado actual del recurso.",
    ejemplo: "Intentar crear un usuario con un email que ya existe.",
  },
  {
    codigo: 429,
    nombre: "Too Many Requests",
    categoria: "4xx",
    descripcion: "Superaste el límite de rate limiting.",
    ejemplo: "Pegarle a una API pública demasiadas veces por segundo.",
  },
  {
    codigo: 500,
    nombre: "Internal Server Error",
    categoria: "5xx",
    descripcion: "Algo se rompió del lado del servidor, sin más detalle.",
    ejemplo: "Una excepción no controlada en el backend.",
  },
  {
    codigo: 502,
    nombre: "Bad Gateway",
    categoria: "5xx",
    descripcion: "Un proxy o gateway recibió una respuesta inválida del servidor upstream.",
    ejemplo: "Nginx no puede comunicarse con el proceso de la aplicación.",
  },
  {
    codigo: 503,
    nombre: "Service Unavailable",
    categoria: "5xx",
    descripcion: "El servidor está temporalmente caído o sobrecargado.",
    ejemplo: "El servidor está en mantenimiento o recibió más tráfico del que soporta.",
  },
  {
    codigo: 504,
    nombre: "Gateway Timeout",
    categoria: "5xx",
    descripcion: "Un proxy/gateway esperó respuesta del servidor upstream y esta nunca llegó.",
    ejemplo: "El backend tardó demasiado en responder y el proxy cortó la espera.",
  },
];
