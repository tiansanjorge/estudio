export const CLAVE_FLAG = "nuevo-checkout";

export interface Usuario {
  id: string;
  plan: "free" | "pro";
  empleado: boolean;
}

export const USUARIOS: Usuario[] = Array.from({ length: 20 }, (_, i) => ({
  id: `u${String(i + 1).padStart(2, "0")}`,
  plan: i % 4 === 1 ? "pro" : "free",
  empleado: i === 0 || i === 7,
}));

export interface ConfigFlag {
  activa: boolean;
  empleados: boolean;
  betaPro: boolean;
  porcentaje: number;
}

export interface Evaluacion {
  encendida: boolean;
  motivo: string;
  bucket: number;
}

// FNV-1a: el mismo usuario cae siempre en el mismo bucket para esta flag,
// y en buckets independientes para otras flags porque la clave entra en el hash
export function bucket(claveFlag: string, idUsuario: string): number {
  let hash = 0x811c9dc5;
  for (const caracter of `${claveFlag}:${idUsuario}`) {
    hash ^= caracter.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash % 100;
}

// las reglas se evalúan en orden y gana la primera que coincide
export function evaluar(config: ConfigFlag, usuario: Usuario): Evaluacion {
  const b = bucket(CLAVE_FLAG, usuario.id);
  if (!config.activa) return { encendida: false, motivo: "kill switch", bucket: b };
  if (config.empleados && usuario.empleado) return { encendida: true, motivo: "empleado", bucket: b };
  if (config.betaPro && usuario.plan === "pro") return { encendida: true, motivo: "beta pro", bucket: b };
  if (b < config.porcentaje) return { encendida: true, motivo: `bucket ${b} < ${config.porcentaje}`, bucket: b };
  return { encendida: false, motivo: `bucket ${b} ≥ ${config.porcentaje}`, bucket: b };
}
