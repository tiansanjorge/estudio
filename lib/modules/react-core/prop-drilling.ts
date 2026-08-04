import type { NodoComponente, PasoArbol, EscenarioArbol } from "./arbol";

export type { PasoArbol, EscenarioArbol };

const arbolDrilling: NodoComponente = {
  nombre: "App",
  props: { usuario: "'Ana'" },
  hijos: [
    {
      nombre: "Layout",
      props: { usuario: "'Ana'" },
      rol: "intermedio",
      hijos: [
        {
          nombre: "Sidebar",
          props: { usuario: "'Ana'" },
          rol: "intermedio",
          hijos: [
            {
              nombre: "PerfilCard",
              props: { usuario: "'Ana'" },
              rol: "intermedio",
              hijos: [{ nombre: "Avatar", props: { usuario: "'Ana'" } }],
            },
          ],
        },
      ],
    },
  ],
};

export const escenariosPropDrilling: EscenarioArbol[] = [
  {
    slug: "prop-drilling",
    titulo: "Prop drilling",
    pasos: [
      {
        descripcion:
          "El usuario logueado vive en App. Avatar es el único componente que realmente lo USA (para mostrar la inicial); todo lo que está en el medio solo lo reenvía.",
        arbol: arbolDrilling,
      },
      {
        descripcion:
          "Layout, Sidebar y PerfilCard reciben 'usuario' como prop sin usarlo ellos mismos — solo se lo pasan al siguiente hijo. Eso es prop drilling.",
        arbol: arbolDrilling,
      },
      {
        descripcion:
          "El problema: si mañana Avatar necesita OTRO dato (ej: 'tema'), hay que tocar Layout, Sidebar y PerfilCard también, aunque a ninguno de los tres le importe ese dato.",
        arbol: arbolDrilling,
      },
    ],
  },
  {
    slug: "children",
    titulo: "children evita el drilling",
    pasos: [
      {
        descripcion:
          "App arma <Layout><Sidebar usuario='Ana' /></Layout>. Por dentro, ese Sidebar ya renderizado es el valor de una prop especial: children.",
        arbol: { nombre: "Layout", props: { children: "<Sidebar usuario='Ana' />" } },
      },
      {
        descripcion:
          "Layout ni siquiera necesita importar Sidebar ni saber qué props tiene — solo hace {children} en el medio de su propio JSX (por ejemplo, entre un header y un footer).",
        arbol: { nombre: "Layout", props: { children: "<Sidebar usuario='Ana' />" } },
      },
      {
        descripcion:
          "Comparado con el escenario anterior: acá 'usuario' viaja directo de App a Sidebar, sin pasar por las props de Layout. Layout queda totalmente desacoplado de ese dato.",
        arbol: { nombre: "Layout", props: { children: "<Sidebar usuario='Ana' />" } },
      },
    ],
  },
];
