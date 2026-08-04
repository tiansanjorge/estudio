export interface ObjetoMemoria {
  id: string;
  descripcion: string;
  referenciadoDesde: string[];
  recolectado?: boolean;
}

export interface PasoMemory {
  descripcion: string;
  objetos: ObjetoMemoria[];
  consola: string[];
}

export interface EscenarioMemory {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoMemory[];
}

export const escenariosMemory: EscenarioMemory[] = [
  {
    slug: "reachability",
    titulo: "Reachability básica",
    codigo: [
      "let obj1 = { nombre: 'A' };",
      "let obj2 = { nombre: 'B' };",
      "",
      "obj1.amigo = obj2;",
      "",
      "obj2 = null;",
      "// ¿se borra el objeto B?",
      "",
      "obj1 = null;",
      "// ahora sí: nada referencia a A ni a B",
    ],
    pasos: [
      {
        descripcion: "Se crean dos objetos. Cada uno tiene una referencia directa desde su variable global.",
        objetos: [
          { id: "A", descripcion: "{ nombre: 'A' }", referenciadoDesde: ["obj1"] },
          { id: "B", descripcion: "{ nombre: 'B' }", referenciadoDesde: ["obj2"] },
        ],
        consola: [],
      },
      {
        descripcion: "obj1.amigo = obj2 agrega OTRA referencia a B, esta vez desde adentro de A.",
        objetos: [
          { id: "A", descripcion: "{ nombre: 'A' }", referenciadoDesde: ["obj1"] },
          { id: "B", descripcion: "{ nombre: 'B' }", referenciadoDesde: ["obj2", "obj1.amigo"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "obj2 = null quita la referencia directa desde la variable obj2. Pero B sigue siendo alcanzable a través de obj1.amigo — el Garbage Collector NO lo recolecta.",
        objetos: [
          { id: "A", descripcion: "{ nombre: 'A' }", referenciadoDesde: ["obj1"] },
          { id: "B", descripcion: "{ nombre: 'B' }", referenciadoDesde: ["obj1.amigo"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "obj1 = null quita la última referencia directa a A. A queda inalcanzable... y como A era el único camino hacia B (vía .amigo), B también queda inalcanzable.",
        objetos: [
          { id: "A", descripcion: "{ nombre: 'A' }", referenciadoDesde: [] },
          { id: "B", descripcion: "{ nombre: 'B' }", referenciadoDesde: [] },
        ],
        consola: [],
      },
      {
        descripcion:
          "En algún momento no determinístico, el Garbage Collector libera la memoria de A y B, porque ningún 'root' puede alcanzarlos ya.",
        objetos: [
          { id: "A", descripcion: "{ nombre: 'A' }", referenciadoDesde: [], recolectado: true },
          { id: "B", descripcion: "{ nombre: 'B' }", referenciadoDesde: [], recolectado: true },
        ],
        consola: ["🗑 A y B recolectados"],
      },
    ],
  },
  {
    slug: "closure-que-retiene",
    titulo: "Closure que retiene memoria",
    codigo: [
      "function crearManejador() {",
      "  const datosGrandes = new Array(1_000_000).fill('x');",
      "",
      "  return function () {",
      "    console.log(datosGrandes.length);",
      "  };",
      "}",
      "",
      "const manejador = crearManejador();",
      "elemento.addEventListener('click', manejador);",
      "",
      "// nunca se llama a removeEventListener...",
    ],
    pasos: [
      {
        descripcion: "crearManejador() se ejecuta: crea un array gigante (datosGrandes) en su scope.",
        objetos: [
          { id: "datosGrandes", descripcion: "Array de 1.000.000 elementos", referenciadoDesde: ["scope de crearManejador()"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "Retorna una función interna que SÍ usa datosGrandes (datosGrandes.length). Esa función se convierte en una closure que retiene ese array.",
        objetos: [
          { id: "datosGrandes", descripcion: "Array de 1.000.000 elementos", referenciadoDesde: ["closure de manejador"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "crearManejador() terminó de ejecutarse. Normalmente su scope desaparecería, pero la closure (manejador) todavía lo necesita, así que datosGrandes sigue vivo en memoria.",
        objetos: [
          { id: "datosGrandes", descripcion: "Array de 1.000.000 elementos", referenciadoDesde: ["closure de manejador"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "elemento.addEventListener('click', manejador) agrega una referencia a manejador desde el propio elemento del DOM — un root alcanzable mientras el elemento exista.",
        objetos: [
          { id: "datosGrandes", descripcion: "Array de 1.000.000 elementos", referenciadoDesde: ["closure de manejador"] },
          { id: "manejador", descripcion: "función (closure)", referenciadoDesde: ["elemento (listener)"] },
        ],
        consola: [],
      },
      {
        descripcion:
          "Si nunca se llama a removeEventListener, manejador (y por lo tanto datosGrandes) queda retenido en memoria mientras el elemento exista en el DOM, aunque nadie vuelva a usar esos datos.",
        objetos: [
          { id: "datosGrandes", descripcion: "Array de 1.000.000 elementos", referenciadoDesde: ["closure de manejador"] },
          { id: "manejador", descripcion: "función (closure)", referenciadoDesde: ["elemento (listener)"] },
        ],
        consola: ["⚠ fuga de memoria mientras el elemento no se remueva del DOM"],
      },
    ],
  },
];
