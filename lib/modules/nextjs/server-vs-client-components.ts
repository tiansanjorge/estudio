export type Necesidad = "interactividad" | "servidor" | "ninguna";
export type Entorno = "servidor" | "cliente";

export interface NodoComponente {
  id: string;
  nombre: string;
  necesidad: Necesidad;
  detalle: string;
  /** Peso aproximado de su JS si termina en el bundle del cliente. */
  kb: number;
  /** Nota sobre cómo se renderiza, cuando difiere de quién lo importa. */
  nota?: string;
  /** Componentes que ESTE módulo importa (grafo de módulos, no árbol visual). */
  importa: NodoComponente[];
}

export const ARBOL: NodoComponente = {
  id: "page",
  nombre: "Page",
  necesidad: "servidor",
  detalle: "Consulta la base de datos del producto",
  kb: 4,
  importa: [
    {
      id: "header",
      nombre: "Header",
      necesidad: "ninguna",
      detalle: "Markup estático",
      kb: 3,
      importa: [
        { id: "logo", nombre: "Logo", necesidad: "ninguna", detalle: "SVG estático", kb: 2, importa: [] },
        {
          id: "buscador",
          nombre: "Buscador",
          necesidad: "interactividad",
          detalle: "useState + onChange",
          kb: 6,
          importa: [],
        },
      ],
    },
    {
      id: "detalle",
      nombre: "DetalleProducto",
      necesidad: "ninguna",
      detalle: "Renderiza descripción y markdown (librería de 40 KB)",
      kb: 42,
      importa: [],
    },
    {
      id: "like",
      nombre: "BotonLike",
      necesidad: "interactividad",
      detalle: "onClick + estado optimista",
      kb: 3,
      importa: [],
    },
    {
      id: "modal",
      nombre: "Modal",
      necesidad: "interactividad",
      detalle: "Estado abierto/cerrado",
      kb: 4,
      importa: [],
    },
    {
      id: "carrito",
      nombre: "Carrito",
      necesidad: "servidor",
      detalle: "Lee el carrito de la DB con un secreto",
      kb: 5,
      nota: "Page lo importa y lo pasa como children a <Modal>",
      importa: [],
    },
  ],
};

export interface ResultadoNodo {
  entorno: Entorno;
  /** true si el entorno viene heredado de un ancestro con "use client". */
  heredado: boolean;
  error?: string;
}

/**
 * Un módulo es de cliente si tiene "use client" o si lo importa un módulo de
 * cliente. Lo que se pasa como children no se importa, así que no hereda.
 */
export function evaluar(
  marcas: ReadonlySet<string>,
  nodo: NodoComponente = ARBOL,
  padreEsCliente = false,
  resultados: Map<string, ResultadoNodo> = new Map(),
): Map<string, ResultadoNodo> {
  const esCliente = padreEsCliente || marcas.has(nodo.id);
  const entorno: Entorno = esCliente ? "cliente" : "servidor";

  let error: string | undefined;
  if (nodo.necesidad === "interactividad" && !esCliente) {
    error = "Usa estado o eventos: en un Server Component no existen.";
  } else if (nodo.necesidad === "servidor" && esCliente) {
    error = "Accede a la DB o a secretos: no puede correr en el navegador.";
  }

  resultados.set(nodo.id, { entorno, heredado: padreEsCliente, error });
  for (const hijo of nodo.importa) evaluar(marcas, hijo, esCliente, resultados);
  return resultados;
}

export function kbEnCliente(resultados: Map<string, ResultadoNodo>, nodo: NodoComponente = ARBOL): number {
  const propio = resultados.get(nodo.id)?.entorno === "cliente" ? nodo.kb : 0;
  return propio + nodo.importa.reduce((acc, hijo) => acc + kbEnCliente(resultados, hijo), 0);
}
