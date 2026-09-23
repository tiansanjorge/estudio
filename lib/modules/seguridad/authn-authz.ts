export interface Usuario {
  id: string;
  nombre: string;
  rol: "anonimo" | "cliente" | "admin";
}

export const USUARIOS: Usuario[] = [
  { id: "anon", nombre: "Anónimo (sin sesión)", rol: "anonimo" },
  { id: "ana", nombre: "Ana (cliente)", rol: "cliente" },
  { id: "beto", nombre: "Beto (cliente)", rol: "cliente" },
  { id: "admin", nombre: "Carla (admin)", rol: "admin" },
];

export interface Accion {
  id: string;
  nombre: string;
  /** Dueño del recurso, si la acción es sobre un recurso de alguien. */
  duenoRecurso?: string;
  requiereRol?: Usuario["rol"];
  publica?: boolean;
}

export const ACCIONES: Accion[] = [
  { id: "catalogo", nombre: "GET /productos", publica: true },
  { id: "mi-perfil", nombre: "GET /yo" },
  { id: "pedido-ana", nombre: "GET /pedidos/41 (de Ana)", duenoRecurso: "ana" },
  { id: "borrar-producto", nombre: "DELETE /productos/7", requiereRol: "admin" },
];

export type Resultado = {
  status: number;
  etapa: "publica" | "authn" | "authz" | "ok";
  explicacion: string;
};

export function evaluar(usuario: Usuario, accion: Accion): Resultado {
  if (accion.publica) {
    return { status: 200, etapa: "publica", explicacion: "Recurso público: no hace falta saber quién sos." };
  }

  // 1. Autenticación: ¿quién sos?
  if (usuario.rol === "anonimo") {
    return {
      status: 401,
      etapa: "authn",
      explicacion: "Falla la autenticación: no hay sesión válida, el sistema no sabe quién sos.",
    };
  }

  // 2. Autorización: ¿podés hacer esto?
  if (accion.requiereRol && usuario.rol !== accion.requiereRol) {
    return {
      status: 403,
      etapa: "authz",
      explicacion: `Autenticado como ${usuario.nombre}, pero su rol no tiene permiso para esta acción.`,
    };
  }
  if (accion.duenoRecurso && accion.duenoRecurso !== usuario.id && usuario.rol !== "admin") {
    return {
      status: 404,
      etapa: "authz",
      explicacion:
        "Autenticado, pero el recurso es de otra persona. Se responde 404 para no revelar que existe.",
    };
  }

  return { status: 200, etapa: "ok", explicacion: "Pasó autenticación y autorización." };
}
