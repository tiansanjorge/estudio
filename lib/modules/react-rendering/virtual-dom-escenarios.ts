export interface PasoVirtualDom {
  descripcion: string;
  codigo: string;
  etiqueta: string;
}

export const pasosVirtualDom: PasoVirtualDom[] = [
  {
    etiqueta: "JSX",
    descripcion: "Esto es lo que escribís en el componente.",
    codigo: `<button className="primario">Guardar</button>`,
  },
  {
    etiqueta: "Compilado",
    descripcion:
      "El compilador (Babel/SWC) convierte ese JSX en un llamado a función normal — no es magia, es azúcar sintáctico.",
    codigo: `React.createElement(\n  'button',\n  { className: 'primario' },\n  'Guardar'\n)`,
  },
  {
    etiqueta: "En memoria",
    descripcion:
      "Y eso, en tiempo de ejecución, es simplemente un objeto JavaScript plano. El 'Virtual DOM' no es más que árboles de objetos como este.",
    codigo: `{\n  type: 'button',\n  props: {\n    className: 'primario',\n    children: 'Guardar'\n  }\n}`,
  },
  {
    etiqueta: "DOM real",
    descripcion:
      "Un nodo DOM real (lo que el navegador maneja de verdad) tiene cientos de propiedades y métodos heredados, y crearlo o mutarlo puede disparar cálculos de layout y repintado. Comparar dos objetos JS planos es muchísimo más barato que tocar el DOM real.",
    codigo: `document.createElement('button')\n// HTMLButtonElement { ... cientos de propiedades ... }`,
  },
];
