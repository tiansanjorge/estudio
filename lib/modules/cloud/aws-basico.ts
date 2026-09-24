export type Principal = "rol-misma-cuenta" | "rol-otra-cuenta" | "anonimo";
export type Origen = "vpc" | "internet";

export const PRINCIPALES: { id: Principal; nombre: string }[] = [
  { id: "rol-misma-cuenta", nombre: "Rol de la API (misma cuenta)" },
  { id: "rol-otra-cuenta", nombre: "Rol de otra cuenta" },
  { id: "anonimo", nombre: "Anónimo desde internet" },
];

export const ORIGENES: { id: Origen; nombre: string }[] = [
  { id: "vpc", nombre: "Desde la VPC (vía endpoint)" },
  { id: "internet", nombre: "Desde internet" },
];

export interface ConfigPermisos {
  principal: Principal;
  origen: Origen;
  // Allow s3:GetObject en la política adjunta al rol (en su propia cuenta)
  politicaIdentidad: boolean;
  // Allow s3:GetObject en la bucket policy para ese principal ("*" si es anónimo)
  politicaBucket: boolean;
  // Deny en la bucket policy si el request no llega por el VPC endpoint
  denyFueraDeVpc: boolean;
  blockPublicAccess: boolean;
}

export interface Decision {
  permitido: boolean;
  pasos: string[];
}

// orden de evaluación de IAM (simplificado a identidad + recurso, sin SCPs):
// 1) un Deny explícito que aplique gana siempre; 2) si no, hace falta un Allow;
// en la misma cuenta alcanza con uno de los dos, entre cuentas hacen falta ambos
export function evaluar(c: ConfigPermisos): Decision {
  const pasos: string[] = ["Request: s3:GetObject sobre arn:aws:s3:::facturas/2026/09.pdf"];

  if (c.denyFueraDeVpc && c.origen === "internet") {
    pasos.push("La bucket policy tiene un Deny explícito para requests que no llegan por el VPC endpoint.");
    pasos.push("Un Deny explícito gana sobre cualquier Allow → DENEGADO.");
    return { permitido: false, pasos };
  }

  if (c.principal === "anonimo") {
    if (!c.politicaBucket) {
      pasos.push("Un anónimo no tiene política de identidad, y la bucket policy no lo permite.");
      pasos.push("Sin ningún Allow, rige el deny implícito → DENEGADO.");
      return { permitido: false, pasos };
    }
    if (c.blockPublicAccess) {
      pasos.push('La bucket policy permite Principal "*", pero Block Public Access ignora las políticas públicas.');
      pasos.push("→ DENEGADO. Es el guardrail que evita buckets públicos por error.");
      return { permitido: false, pasos };
    }
    pasos.push('La bucket policy permite Principal "*" y Block Public Access está desactivado.');
    pasos.push("→ PERMITIDO: cualquiera en internet puede leer el archivo.");
    return { permitido: true, pasos };
  }

  if (c.principal === "rol-misma-cuenta") {
    if (c.politicaIdentidad || c.politicaBucket) {
      pasos.push(
        `Misma cuenta: alcanza con un Allow en la política de identidad o en la del bucket (${
          c.politicaIdentidad && c.politicaBucket ? "hay en las dos" : c.politicaIdentidad ? "está en la del rol" : "está en la del bucket"
        }).`,
      );
      pasos.push("→ PERMITIDO.");
      return { permitido: true, pasos };
    }
    pasos.push("Ni la política del rol ni la del bucket tienen un Allow.");
    pasos.push("Todo lo que no se permite explícitamente está denegado → DENEGADO.");
    return { permitido: false, pasos };
  }

  // rol de otra cuenta: su cuenta tiene que dejarlo pedir y tu bucket tiene que aceptarlo
  if (c.politicaIdentidad && c.politicaBucket) {
    pasos.push("Entre cuentas: la política del rol (en su cuenta) lo permite y la bucket policy (en la tuya) acepta a ese principal.");
    pasos.push("→ PERMITIDO.");
    return { permitido: true, pasos };
  }
  pasos.push(
    !c.politicaIdentidad
      ? "La cuenta del rol no le dio permiso para pedirlo, aunque tu bucket lo acepte."
      : "La política del rol lo permite, pero tu bucket policy no acepta a ese principal de otra cuenta.",
  );
  pasos.push("Entre cuentas hacen falta los dos Allow → DENEGADO.");
  return { permitido: false, pasos };
}
