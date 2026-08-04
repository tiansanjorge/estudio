export interface PasoForm {
  descripcion: string;
  valorEstado: string;
  valorDom: string;
  reRenderizo: boolean;
}

export interface EscenarioForm {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoForm[];
}

export const escenariosForms: EscenarioForm[] = [
  {
    slug: "ciclo-controlado",
    titulo: "Ciclo de un input controlado",
    codigo: [
      "function Formulario() {",
      "  const [texto, setTexto] = useState('');",
      "",
      "  return (",
      "    <input value={texto} onChange={(e) => setTexto(e.target.value)} />",
      "  );",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "El usuario tipea la letra 'H'. El navegador actualiza el DOM del input al instante (así funciona cualquier input nativo) y dispara onChange.",
        valorEstado: "",
        valorDom: "H",
        reRenderizo: false,
      },
      {
        descripcion:
          "onChange recibe el evento con e.target.value = 'H', y llama a setTexto('H'). React agenda un re-render — el estado todavía no cambió de forma sincrónica.",
        valorEstado: "",
        valorDom: "H",
        reRenderizo: false,
      },
      {
        descripcion: "React re-renderiza Formulario. Ahora texto = 'H', y el input recibe value='H' como prop.",
        valorEstado: "H",
        valorDom: "H",
        reRenderizo: true,
      },
      {
        descripcion:
          "Como el input es controlado, React fuerza al DOM a mostrar exactamente el value que le pasaste. Acá coincide con lo que el usuario tipeó, así que no se nota nada raro.",
        valorEstado: "H",
        valorDom: "H",
        reRenderizo: true,
      },
    ],
  },
  {
    slug: "sin-setstate",
    titulo: "Sin setState, el input se traba",
    codigo: [
      "function FormularioRoto() {",
      "  const [texto] = useState('');",
      "  // sin setTexto en el onChange",
      "",
      "  return <input value={texto} onChange={() => {}} />;",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "El usuario tipea 'H'. El DOM lo muestra por una fracción de segundo — es lo que hace cualquier input nativo apenas se lo toca.",
        valorEstado: "",
        valorDom: "H",
        reRenderizo: false,
      },
      {
        descripcion: "onChange se ejecuta, pero no llama a ningún setState. Nada le pide a React que actualice nada.",
        valorEstado: "",
        valorDom: "H",
        reRenderizo: false,
      },
      {
        descripcion:
          "En cuanto React vuelve a renderizar este componente (por cualquier motivo), fuerza el DOM de vuelta a value='' — la letra tipeada desaparece, como si el input estuviera 'trabado'.",
        valorEstado: "",
        valorDom: "",
        reRenderizo: true,
      },
    ],
  },
];
