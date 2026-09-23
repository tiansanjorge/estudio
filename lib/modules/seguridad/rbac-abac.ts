export type Rol = "lector" | "editor" | "admin";
export type Accion = "ver" | "editar" | "publicar" | "borrar";
export type Departamento = "ventas" | "legales";

export interface Sujeto {
  id: string;
  rol: Rol;
  departamento: Departamento;
}

export interface Documento {
  duenoId: string;
  departamento: Departamento;
  estado: "borrador" | "publicado";
  confidencial: boolean;
}

export const ACCIONES: Accion[] = ["ver", "editar", "publicar", "borrar"];

/** RBAC: el permiso depende solo del rol. */
const PERMISOS_POR_ROL: Record<Rol, Accion[]> = {
  lector: ["ver"],
  editor: ["ver", "editar", "publicar"],
  admin: ["ver", "editar", "publicar", "borrar"],
};

export interface Decision {
  permitido: boolean;
  regla: string;
}

export function decidirRbac(sujeto: Sujeto, accion: Accion): Decision {
  const permitido = PERMISOS_POR_ROL[sujeto.rol].includes(accion);
  return {
    permitido,
    regla: `rol ${sujeto.rol} ${permitido ? "incluye" : "no incluye"} "${accion}"`,
  };
}

/** ABAC: el permiso combina atributos del sujeto, del recurso y del contexto. */
export function decidirAbac(sujeto: Sujeto, doc: Documento, accion: Accion): Decision {
  const esDueno = sujeto.id === doc.duenoId;
  const mismoDepto = sujeto.departamento === doc.departamento;

  if (sujeto.rol === "admin") return { permitido: true, regla: "los admins pueden todo" };

  if (doc.confidencial && !mismoDepto) {
    return { permitido: false, regla: "confidencial: solo su departamento" };
  }

  switch (accion) {
    case "ver":
      return doc.estado === "publicado" || esDueno || mismoDepto
        ? { permitido: true, regla: "publicado, propio o del mismo departamento" }
        : { permitido: false, regla: "borrador ajeno de otro departamento" };
    case "editar":
      if (doc.estado === "publicado") return { permitido: false, regla: "un documento publicado no se edita" };
      return esDueno || (sujeto.rol === "editor" && mismoDepto)
        ? { permitido: true, regla: esDueno ? "es el dueño" : "editor del mismo departamento" }
        : { permitido: false, regla: "ni dueño ni editor del departamento" };
    case "publicar":
      return sujeto.rol === "editor" && mismoDepto && !esDueno
        ? { permitido: true, regla: "editor del departamento, distinto del autor (cuatro ojos)" }
        : { permitido: false, regla: "solo otro editor del departamento puede publicar" };
    case "borrar":
      return esDueno && doc.estado === "borrador"
        ? { permitido: true, regla: "el dueño puede borrar sus borradores" }
        : { permitido: false, regla: "solo el dueño, y solo borradores" };
  }
}
