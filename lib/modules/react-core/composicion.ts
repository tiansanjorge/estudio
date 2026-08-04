import type { EscenarioArbol } from "./arbol";

export const escenariosComposicion: EscenarioArbol[] = [
  {
    slug: "configuracion",
    titulo: "Configuración (props que explotan)",
    pasos: [
      {
        descripcion:
          "Un solo componente Boton intenta cubrir todas las variantes posibles con props booleanos.",
        arbol: {
          nombre: "Boton",
          props: { esPrimario: "true", esGrande: "true", tieneIcono: "true" },
        },
      },
      {
        descripcion:
          "Aparece un nuevo requisito: a veces el ícono va a la derecha. Se agrega OTRO prop al mismo componente.",
        arbol: {
          nombre: "Boton",
          props: {
            esPrimario: "true",
            esGrande: "true",
            tieneIcono: "true",
            iconoPosicion: "'derecha'",
          },
        },
      },
      {
        descripcion:
          "Aparece otro requisito: un badge opcional. El componente sigue creciendo — cada variante nueva es un prop más, y Boton tiene que saber renderizar TODAS las combinaciones posibles internamente.",
        arbol: {
          nombre: "Boton",
          props: {
            esPrimario: "true",
            esGrande: "true",
            tieneIcono: "true",
            iconoPosicion: "'derecha'",
            tieneBadge: "true",
            badgeTexto: "'Nuevo'",
          },
        },
      },
    ],
  },
  {
    slug: "composicion",
    titulo: "Composición (piezas chicas)",
    pasos: [
      {
        descripcion:
          "En vez de un Boton que sabe hacer de todo, hay un BotonBase simple que solo sabe ser un botón — y recibe children.",
        arbol: { nombre: "BotonBase" },
      },
      {
        descripcion:
          "Para el caso con ícono, se compone BotonBase con un componente Icono como hijo. BotonBase no necesita saber que existe Icono.",
        arbol: {
          nombre: "BotonBase",
          hijos: [{ nombre: "Icono", props: { nombre: "'check'" } }],
        },
      },
      {
        descripcion:
          "Para agregar el badge, se compone un Badge más, sin tocar BotonBase ni Icono. Cada pieza nueva es un componente chico y reutilizable, no un prop más en un componente gigante.",
        arbol: {
          nombre: "BotonBase",
          hijos: [
            { nombre: "Icono", props: { nombre: "'check'" } },
            { nombre: "Badge", props: { texto: "'Nuevo'" } },
          ],
        },
      },
    ],
  },
];
