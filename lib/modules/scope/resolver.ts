export interface ConfiguracionScope {
  declaradoEnGlobal: boolean;
  declaradoEnExterna: boolean;
  declaradoEnInterna: boolean;
}

export type NivelScope = "Interna" | "Externa" | "Global";

export interface ResultadoResolucion {
  encontradoEn: NivelScope | null;
  rutaBusqueda: string[];
}

export function resolverVariable(config: ConfiguracionScope): ResultadoResolucion {
  const rutaBusqueda: string[] = [];

  if (config.declaradoEnInterna) {
    rutaBusqueda.push("Interna: encontrada.");
    return { encontradoEn: "Interna", rutaBusqueda };
  }
  rutaBusqueda.push("Interna: no declarada acá, sigue buscando arriba.");

  if (config.declaradoEnExterna) {
    rutaBusqueda.push("Externa: encontrada.");
    return { encontradoEn: "Externa", rutaBusqueda };
  }
  rutaBusqueda.push("Externa: no declarada acá, sigue buscando arriba.");

  if (config.declaradoEnGlobal) {
    rutaBusqueda.push("Global: encontrada.");
    return { encontradoEn: "Global", rutaBusqueda };
  }
  rutaBusqueda.push("Global: tampoco está acá.");

  return { encontradoEn: null, rutaBusqueda };
}
