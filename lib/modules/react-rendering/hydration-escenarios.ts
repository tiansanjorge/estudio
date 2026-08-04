export interface PasoHydration {
  descripcion: string;
  htmlEnPantalla: string;
  interactivo: boolean;
}

export interface EscenarioHydration {
  slug: string;
  titulo: string;
  pasos: PasoHydration[];
}

export const escenariosHydration: EscenarioHydration[] = [
  {
    slug: "hydration-normal",
    titulo: "Hydration sin problemas",
    pasos: [
      {
        descripcion: "El servidor ejecuta los componentes y genera HTML completo. Se lo manda al navegador.",
        htmlEnPantalla: "<button>Guardar</button>",
        interactivo: false,
      },
      {
        descripcion:
          "El navegador pinta ese HTML de inmediato — el usuario YA VE la página. Pero no hay JavaScript corriendo todavía: el botón no responde, no hay estado.",
        htmlEnPantalla: "<button>Guardar</button>",
        interactivo: false,
      },
      {
        descripcion:
          "El bundle de JavaScript se descarga y se ejecuta. React arranca el proceso de hydration: recorre el HTML que ya está en el DOM.",
        htmlEnPantalla: "<button>Guardar</button>",
        interactivo: false,
      },
      {
        descripcion:
          "En vez de tirar ese HTML y crearlo de nuevo, React lo REUTILIZA: solo conecta los event listeners y arma el árbol de Fiber sobre los nodos existentes.",
        htmlEnPantalla: "<button>Guardar</button>",
        interactivo: false,
      },
      {
        descripcion: "Ahora sí, la página es interactiva — sin que haya habido un parpadeo de HTML viejo siendo reemplazado por HTML nuevo.",
        htmlEnPantalla: "<button>Guardar</button>",
        interactivo: true,
      },
    ],
  },
  {
    slug: "hydration-mismatch",
    titulo: "Hydration mismatch",
    pasos: [
      {
        descripcion: "El servidor renderiza este componente. window no existe ahí, así que calcula 'Servidor'.",
        htmlEnPantalla: "<span>Estás en: Servidor</span>",
        interactivo: false,
      },
      {
        descripcion: "El navegador pinta ese HTML tal cual: dice 'Servidor'.",
        htmlEnPantalla: "<span>Estás en: Servidor</span>",
        interactivo: false,
      },
      {
        descripcion:
          "Al hidratar, React ejecuta el mismo componente en el cliente. Ahora window SÍ existe, así que calcula 'Cliente' — un resultado DISTINTO al que ya está pintado.",
        htmlEnPantalla: "<span>Estás en: Cliente</span>",
        interactivo: false,
      },
      {
        descripcion:
          "React detecta la discrepancia: es un hydration mismatch. Avisa por consola y, en el peor caso, tiene que descartar el HTML del servidor y volver a renderizar esa parte desde cero en el cliente — perdiendo ahí el beneficio de SSR.",
        htmlEnPantalla: "<span>Estás en: Cliente</span>",
        interactivo: true,
      },
    ],
  },
];
