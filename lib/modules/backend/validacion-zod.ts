export const ESQUEMA_ZOD = `const RegistroSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  nombre: z.string().trim().min(2).max(50),
  edad: z.coerce.number().int().min(18),
  rol: z.enum(["cliente", "vendedor"]).default("cliente"),
  tags: z.array(z.string()).max(5).default([]),
});
// z.object descarta las claves que no están en el schema

type Registro = z.infer<typeof RegistroSchema>;
const resultado = RegistroSchema.safeParse(req.body);`;

export interface Issue {
  path: string;
  message: string;
}

export interface ResultadoValidacion {
  success: boolean;
  data?: Record<string, unknown>;
  issues: Issue[];
  descartadas: string[];
}

const CLAVES = ["email", "nombre", "edad", "rol", "tags"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Implementación a mano de las MISMAS reglas que RegistroSchema, para el playground
 * (el proyecto no suma Zod como dependencia solo para esta demo).
 */
export function validarRegistro(input: unknown): ResultadoValidacion {
  const issues: Issue[] = [];
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { success: false, issues: [{ path: "(raíz)", message: "Se esperaba un objeto" }], descartadas: [] };
  }
  const obj = input as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  if (typeof obj.email !== "string") issues.push({ path: "email", message: "Se esperaba un string" });
  else {
    const email = obj.email.trim().toLowerCase();
    if (!EMAIL.test(email)) issues.push({ path: "email", message: "Email inválido" });
    else data.email = email;
  }

  if (typeof obj.nombre !== "string") issues.push({ path: "nombre", message: "Se esperaba un string" });
  else {
    const nombre = obj.nombre.trim();
    if (nombre.length < 2) issues.push({ path: "nombre", message: "Debe tener al menos 2 caracteres" });
    else if (nombre.length > 50) issues.push({ path: "nombre", message: "Debe tener como máximo 50 caracteres" });
    else data.nombre = nombre;
  }

  const edad = Number(obj.edad);
  if (obj.edad === undefined || obj.edad === null || obj.edad === "" || Number.isNaN(edad)) {
    issues.push({ path: "edad", message: "Se esperaba un número" });
  } else if (!Number.isInteger(edad)) issues.push({ path: "edad", message: "Debe ser un entero" });
  else if (edad < 18) issues.push({ path: "edad", message: "Debe ser mayor o igual a 18" });
  else data.edad = edad;

  if (obj.rol === undefined) data.rol = "cliente";
  else if (obj.rol === "cliente" || obj.rol === "vendedor") data.rol = obj.rol;
  else issues.push({ path: "rol", message: `Valor inválido: se esperaba "cliente" | "vendedor"` });

  if (obj.tags === undefined) data.tags = [];
  else if (!Array.isArray(obj.tags)) issues.push({ path: "tags", message: "Se esperaba un array" });
  else if (obj.tags.length > 5) issues.push({ path: "tags", message: "Como máximo 5 elementos" });
  else {
    obj.tags.forEach((t, i) => {
      if (typeof t !== "string") issues.push({ path: `tags.${i}`, message: "Se esperaba un string" });
    });
    if (!issues.some((i) => i.path.startsWith("tags"))) data.tags = obj.tags;
  }

  const descartadas = Object.keys(obj).filter((k) => !CLAVES.includes(k));
  return issues.length
    ? { success: false, issues, descartadas }
    : { success: true, data, issues: [], descartadas };
}

export const PAYLOADS: { id: string; nombre: string; json: string }[] = [
  {
    id: "valido",
    nombre: "Válido (con normalización)",
    json: `{
  "email": "  Ana@Mail.COM ",
  "nombre": "Ana",
  "edad": "34"
}`,
  },
  {
    id: "mass-assignment",
    nombre: "Intento de mass assignment",
    json: `{
  "email": "beto@mail.com",
  "nombre": "Beto",
  "edad": 29,
  "esAdmin": true,
  "saldo": 1000000
}`,
  },
  {
    id: "tipos",
    nombre: "Tipos incorrectos",
    json: `{
  "email": "no-es-un-email",
  "nombre": "A",
  "edad": 16.5,
  "rol": "admin",
  "tags": ["uno", 2]
}`,
  },
];
