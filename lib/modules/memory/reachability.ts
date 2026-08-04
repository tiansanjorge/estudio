export type NodoObjeto = "A" | "B" | "C";

export interface ConfiguracionReferencias {
  rootHaciaA: boolean;
  aHaciaB: boolean;
  bHaciaC: boolean;
  cHaciaA: boolean;
}

export function calcularAlcanzables(config: ConfiguracionReferencias): Set<NodoObjeto> {
  const alcanzables = new Set<NodoObjeto>();
  if (!config.rootHaciaA) return alcanzables;

  const pendientes: NodoObjeto[] = ["A"];
  while (pendientes.length > 0) {
    const actual = pendientes.pop() as NodoObjeto;
    if (alcanzables.has(actual)) continue;
    alcanzables.add(actual);

    if (actual === "A" && config.aHaciaB) pendientes.push("B");
    if (actual === "B" && config.bHaciaC) pendientes.push("C");
    if (actual === "C" && config.cHaciaA) pendientes.push("A");
  }

  return alcanzables;
}
