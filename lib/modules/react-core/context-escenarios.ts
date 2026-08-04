import type { EscenarioArbol } from "./arbol";

export const escenariosContext: EscenarioArbol[] = [
  {
    slug: "sin-context",
    titulo: "Sin Context (prop drilling)",
    pasos: [
      {
        descripcion:
          "El tema vive en App y tiene que llegar hasta BotonTema, varios niveles abajo. Layout y Sidebar no usan 'tema' para nada — solo lo reenvían.",
        arbol: {
          nombre: "App",
          props: { tema: "'oscuro'" },
          hijos: [
            {
              nombre: "Layout",
              props: { tema: "'oscuro'" },
              rol: "intermedio",
              hijos: [
                {
                  nombre: "Sidebar",
                  props: { tema: "'oscuro'" },
                  rol: "intermedio",
                  hijos: [{ nombre: "BotonTema", props: { tema: "'oscuro'" } }],
                },
              ],
            },
          ],
        },
      },
      {
        descripcion:
          "Si mañana otro componente en OTRA rama del árbol también necesita 'tema', hay que repetir este mismo recorrido de props desde App hasta ahí.",
        arbol: {
          nombre: "App",
          props: { tema: "'oscuro'" },
          hijos: [
            {
              nombre: "Layout",
              props: { tema: "'oscuro'" },
              rol: "intermedio",
              hijos: [
                {
                  nombre: "Sidebar",
                  props: { tema: "'oscuro'" },
                  rol: "intermedio",
                  hijos: [{ nombre: "BotonTema", props: { tema: "'oscuro'" } }],
                },
                {
                  nombre: "Contenido",
                  props: { tema: "'oscuro'" },
                  rol: "intermedio",
                  hijos: [{ nombre: "Encabezado", props: { tema: "'oscuro'" } }],
                },
              ],
            },
          ],
        },
      },
    ],
  },
  {
    slug: "con-context",
    titulo: "Con Context",
    pasos: [
      {
        descripcion:
          "App envuelve todo con <TemaContext.Provider value='oscuro'>. Ese valor queda disponible para cualquier descendiente, sin pasar por props.",
        arbol: {
          nombre: "TemaContext.Provider",
          props: { value: "'oscuro'" },
          hijos: [
            {
              nombre: "Layout",
              hijos: [{ nombre: "Sidebar", hijos: [{ nombre: "BotonTema", rol: "usaContext" }] }],
            },
          ],
        },
      },
      {
        descripcion:
          "Layout y Sidebar ya NO reciben ningún prop relacionado con el tema — desaparecieron del recorrido. Solo BotonTema, que realmente lo necesita, llama a useContext(TemaContext) y lo lee directo.",
        arbol: {
          nombre: "TemaContext.Provider",
          props: { value: "'oscuro'" },
          hijos: [
            {
              nombre: "Layout",
              hijos: [
                { nombre: "Sidebar", hijos: [{ nombre: "BotonTema", rol: "usaContext" }] },
                { nombre: "Contenido", hijos: [{ nombre: "Encabezado", rol: "usaContext" }] },
              ],
            },
          ],
        },
      },
    ],
  },
];
