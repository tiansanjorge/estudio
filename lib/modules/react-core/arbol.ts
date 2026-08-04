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
