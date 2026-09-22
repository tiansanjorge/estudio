export interface ConfiguracionPrototipo {
  enInstancia: boolean;
  enPrototipoDirecto: boolean;
  enPrototipoBase: boolean;
}

export type NivelPrototipo = "Instancia" | "Prototipo directo (Hijo.prototype)" | "Prototipo base (Padre.prototype)";

export interface ResultadoBusqueda {
  encontradoEn: NivelPrototipo | null;
  rutaBusqueda: string[];
}

export function resolverPropiedad(config: ConfiguracionPrototipo): ResultadoBusqueda {
  const rutaBusqueda: string[] = [];

  if (config.enInstancia) {
    rutaBusqueda.push("Instancia: propiedad propia, encontrada.");
    return { encontradoEn: "Instancia", rutaBusqueda };
  }
  rutaBusqueda.push("Instancia: no tiene la propiedad como propia, sube a __proto__.");

  if (config.enPrototipoDirecto) {
    rutaBusqueda.push("Hijo.prototype: encontrada acá.");
    return { encontradoEn: "Prototipo directo (Hijo.prototype)", rutaBusqueda };
  }
  rutaBusqueda.push("Hijo.prototype: tampoco está acá, sube al prototipo de este.");

  if (config.enPrototipoBase) {
    rutaBusqueda.push("Padre.prototype: encontrada acá.");
    return { encontradoEn: "Prototipo base (Padre.prototype)", rutaBusqueda };
  }
  rutaBusqueda.push("Padre.prototype: tampoco está. Sigue a Object.prototype y luego a null.");

  return { encontradoEn: null, rutaBusqueda };
}
