export interface PasoReconciliation {
  descripcion: string;
  tipoAnterior: string;
  tipoNuevo: string;
  mismaInstancia: boolean;
  estado: string;
}

export interface EscenarioReconciliation {
  slug: string;
  titulo: string;
  pasos: PasoReconciliation[];
}

export const escenariosReconciliation: EscenarioReconciliation[] = [
  {
    slug: "mismo-tipo",
    titulo: "Mismo tipo → se actualiza",
    pasos: [
      {
        descripcion:
          "Estado inicial: <Boton color='blanco' /> está montado, con su propio estado interno (por ejemplo, clics=3).",
        tipoAnterior: "Boton",
        tipoNuevo: "Boton",
        mismaInstancia: true,
        estado: "clics: 3",
      },
      {
        descripcion:
          "Se togglea modoOscuro. El nuevo render es <Boton color='negro' /> — MISMO tipo de componente, en la misma posición del árbol.",
        tipoAnterior: "Boton",
        tipoNuevo: "Boton",
        mismaInstancia: true,
        estado: "clics: 3",
      },
      {
        descripcion:
          "React reconoce el mismo tipo: reutiliza la instancia existente y solo actualiza la prop color. El estado interno sobrevive intacto.",
        tipoAnterior: "Boton",
        tipoNuevo: "Boton",
        mismaInstancia: true,
        estado: "clics: 3 (preservado)",
      },
    ],
  },
  {
    slug: "distinto-tipo",
    titulo: "Distinto tipo → se destruye y se crea de cero",
    pasos: [
      {
        descripcion: "Estado inicial: <BotonClaro /> está montado, con clics=3.",
        tipoAnterior: "BotonClaro",
        tipoNuevo: "BotonClaro",
        mismaInstancia: true,
        estado: "clics: 3",
      },
      {
        descripcion:
          "Se togglea modoOscuro. El nuevo render es <BotonOscuro /> — un componente DISTINTO en la misma posición del árbol.",
        tipoAnterior: "BotonClaro",
        tipoNuevo: "BotonOscuro",
        mismaInstancia: false,
        estado: "—",
      },
      {
        descripcion:
          "React ve tipos distintos: destruye por completo la instancia de BotonClaro (se pierde clics) y monta BotonOscuro de cero, con estado inicial nuevo.",
        tipoAnterior: "BotonClaro",
        tipoNuevo: "BotonOscuro",
        mismaInstancia: false,
        estado: "clics: 0 (nuevo, desde cero)",
      },
    ],
  },
];
