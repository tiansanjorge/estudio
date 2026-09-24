export interface NodoComponente {
  nombre: string;
  props?: Record<string, string>;
  hijos?: NodoComponente[];
  rol?: "intermedio" | "usaContext";
}

export interface PasoArbol {
  descripcion: string;
  arbol: NodoComponente;
}

export interface EscenarioArbol {
  slug: string;
  titulo: string;
  pasos: PasoArbol[];
}

export const pasosArbolComponentes: PasoArbol[] = [
  {
    descripcion:
      "Cuando escribís <App />, React arma un árbol de descripciones — todavía no es HTML, es una estructura de datos.",
    arbol: { nombre: "App" },
  },
  {
    descripcion:
      "App() retorna JSX que describe a sus hijos: <Header/>, <Main/> y <Footer/>. React los agrega como hijos en el árbol.",
    arbol: {
      nombre: "App",
      hijos: [{ nombre: "Header" }, { nombre: "Main" }, { nombre: "Footer" }],
    },
  },
  {
    descripcion:
      "Main() a su vez retorna <ProductList productos={...} />. Los props viajan de padre a hijo — nunca al revés.",
    arbol: {
      nombre: "App",
      hijos: [
        { nombre: "Header" },
        {
          nombre: "Main",
          hijos: [{ nombre: "ProductList", props: { productos: "[A, B, C]" } }],
        },
        { nombre: "Footer" },
      ],
    },
  },
  {
    descripcion:
      "ProductList() mapea el array 'productos' y renderiza un <ProductCard/> por cada elemento — el MISMO componente, reutilizado con props distintos cada vez.",
    arbol: {
      nombre: "App",
      hijos: [
        { nombre: "Header" },
        {
          nombre: "Main",
          hijos: [
            {
              nombre: "ProductList",
              props: { productos: "[A, B, C]" },
              hijos: [
                { nombre: "ProductCard", props: { nombre: "A" } },
                { nombre: "ProductCard", props: { nombre: "B" } },
                { nombre: "ProductCard", props: { nombre: "C" } },
              ],
            },
          ],
        },
        { nombre: "Footer" },
      ],
    },
  },
];

/**
 * JSX equivalente a un árbol de componentes, para mostrar al lado de la
 * visualización. Resalta las líneas que reciben props o leen el Context.
 */
export function arbolAJsx(raiz: NodoComponente): { codigo: string; resaltadas: number[] } {
  const lineas: string[] = [];
  const resaltadas: number[] = [];

  function visitar(nodo: NodoComponente, nivel: number) {
    const sangria = "  ".repeat(nivel);
    const { children, ...resto } = nodo.props ?? {};
    const atributos = Object.entries(resto)
      .map(([nombre, valor]) => ` ${nombre}={${valor}}`)
      .join("");
    const nota = nodo.rol === "usaContext" ? "  // lee useContext" : "";
    if (Object.keys(resto).length > 0 || nodo.rol === "usaContext") {
      resaltadas.push(lineas.length + 1);
    }

    const hijos = nodo.hijos ?? [];
    if (hijos.length === 0 && !children) {
      lineas.push(`${sangria}<${nodo.nombre}${atributos} />${nota}`);
      return;
    }

    lineas.push(`${sangria}<${nodo.nombre}${atributos}>${nota}`);
    if (children) lineas.push(`${sangria}  ${children}`);
    hijos.forEach((hijo) => visitar(hijo, nivel + 1));
    lineas.push(`${sangria}</${nodo.nombre}>`);
  }

  visitar(raiz, 0);
  return { codigo: lineas.join("\n"), resaltadas };
}
