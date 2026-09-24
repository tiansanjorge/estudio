export type EventoWorkflow = "push-main" | "pr-interno" | "pr-fork" | "dependabot";
export type EntornoJob = "ninguno" | "staging" | "production";

export const EVENTOS: { id: EventoWorkflow; nombre: string }[] = [
  { id: "push-main", nombre: "Push a main" },
  { id: "pr-interno", nombre: "PR desde un branch del repo" },
  { id: "pr-fork", nombre: "PR desde un fork" },
  { id: "dependabot", nombre: "PR de Dependabot" },
];

export const ENTORNOS: { id: EntornoJob; nombre: string }[] = [
  { id: "ninguno", nombre: "Sin environment" },
  { id: "staging", nombre: "environment: staging" },
  { id: "production", nombre: "environment: production" },
];

export interface SecretoVisible {
  nombre: string;
  origen: string;
  disponible: boolean;
}

export interface ResultadoAcceso {
  bloqueo: string | null;
  requiereAprobacion: boolean;
  secretos: SecretoVisible[];
  token: string;
  nota: string;
}

// production tiene reglas de protección: revisores requeridos y solo el branch main puede desplegar
export function resolverAcceso(evento: EventoWorkflow, entorno: EntornoJob): ResultadoAcceso {
  if (entorno === "production" && evento !== "push-main") {
    return {
      bloqueo: "El job no arranca: el environment production solo acepta deploys desde main.",
      requiereAprobacion: false,
      secretos: [],
      token: "—",
      nota: "Las reglas de protección del environment se evalúan antes de entregar sus secretos.",
    };
  }

  const tipoFork = evento === "pr-fork" || evento === "dependabot";
  const secretoEntorno: SecretoVisible[] =
    entorno === "ninguno"
      ? []
      : [{ nombre: "DATABASE_URL", origen: `secreto del environment ${entorno}`, disponible: !tipoFork }];

  if (evento === "dependabot") {
    return {
      bloqueo: null,
      requiereAprobacion: false,
      secretos: [
        { nombre: "NPM_TOKEN", origen: "secreto de Dependabot (se configura aparte)", disponible: true },
        { nombre: "NPM_TOKEN", origen: "secreto de Actions del repo", disponible: false },
        ...secretoEntorno,
      ],
      token: "solo lectura",
      nota: "GitHub trata los PRs de Dependabot como si vinieran de un fork: solo ve los secretos de Dependabot y el token no puede escribir.",
    };
  }

  if (evento === "pr-fork") {
    return {
      bloqueo: null,
      requiereAprobacion: false,
      secretos: [{ nombre: "NPM_TOKEN", origen: "secreto de Actions del repo", disponible: false }, ...secretoEntorno],
      token: "solo lectura",
      nota: "Con el evento pull_request, el código de un fork no recibe secretos: cualquiera podría abrir un PR que los imprima.",
    };
  }

  return {
    bloqueo: null,
    requiereAprobacion: entorno === "production",
    secretos: [{ nombre: "NPM_TOKEN", origen: "secreto de Actions del repo", disponible: true }, ...secretoEntorno],
    token: "lo que declare permissions (mínimo recomendado: contents: read)",
    nota:
      entorno === "production"
        ? "El job espera la aprobación de un revisor antes de recibir los secretos de production."
        : entorno === "staging"
          ? "Recibe los secretos del repo más los de staging; los de production no existen para este job."
          : "Sin environment, solo ve los secretos del repo: ninguna credencial de base de datos.",
  };
}
