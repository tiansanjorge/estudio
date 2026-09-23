export interface ConfigFormulario {
  /** <label htmlFor> asociado, en vez de usar el placeholder como etiqueta. */
  labelAsociado: boolean;
  /** Error vinculado con aria-describedby y estado con aria-invalid. */
  errorAsociado: boolean;
  /** Al enviar con errores, mover el foco al primer campo inválido. */
  enfocarPrimerError: boolean;
}

export type CampoId = "nombre" | "email";

export interface DefinicionCampo {
  id: CampoId;
  etiqueta: string;
  placeholder: string;
  tipo: "text" | "email";
  autoComplete: string;
}

export const CAMPOS: DefinicionCampo[] = [
  { id: "nombre", etiqueta: "Nombre completo", placeholder: "Ana García", tipo: "text", autoComplete: "name" },
  { id: "email", etiqueta: "Email", placeholder: "ana@mail.com", tipo: "email", autoComplete: "email" },
];

export type Errores = Partial<Record<CampoId, string>>;

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validar(valores: Record<CampoId, string>): Errores {
  const errores: Errores = {};
  if (!valores.nombre.trim()) errores.nombre = "Ingresá tu nombre.";
  if (!valores.email.trim()) errores.email = "Ingresá tu email.";
  else if (!PATRON_EMAIL.test(valores.email)) errores.email = "El email tiene que tener el formato nombre@dominio.com.";
  return errores;
}

/**
 * Aproximación de lo que anuncia un lector de pantalla al enfocar el campo:
 * nombre accesible, rol, estados y descripción.
 */
export function anuncioDelCampo(
  campo: DefinicionCampo,
  config: ConfigFormulario,
  error: string | undefined,
): string {
  // sin label, los navegadores usan el placeholder como nombre de último recurso
  const nombre = config.labelAsociado ? campo.etiqueta : campo.placeholder;
  const partes = [nombre, "campo de edición", "requerido"];
  if (error && config.errorAsociado) partes.push("inválido", error);
  return `“${partes.join(", ")}”`;
}
