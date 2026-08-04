export interface ScopeClosure {
  nombre: string;
  variables: Record<string, string | number>;
}

export interface PasoClosure {
  descripcion: string;
  scopes: ScopeClosure[];
  consola: string[];
}

export interface EscenarioClosure {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoClosure[];
}

export const escenariosClosures: EscenarioClosure[] = [
  {
    slug: "contador",
    titulo: "Contador con closure",
    codigo: [
      "function crearContador() {",
      "  let cuenta = 0;",
      "  return function () {",
      "    cuenta++;",
      "    return cuenta;",
      "  };",
      "}",
      "",
      "const contador1 = crearContador();",
      "const contador2 = crearContador();",
      "",
      "contador1(); // ?",
      "contador1(); // ?",
      "contador2(); // ?",
    ],
    pasos: [
      {
        descripcion:
          "Se llama a crearContador() por primera vez. Se crea un scope nuevo con cuenta = 0.",
        scopes: [{ nombre: "crearContador() #1", variables: { cuenta: 0 } }],
        consola: [],
      },
      {
        descripcion:
          "Esa llamada retorna una función interna. Esa función 'recuerda' el scope donde nació — eso es la closure. contador1 apunta a esa función junto con su scope.",
        scopes: [{ nombre: "closure #1 (contador1)", variables: { cuenta: 0 } }],
        consola: [],
      },
      {
        descripcion:
          "Se llama a crearContador() de nuevo. Se crea un scope TOTALMENTE NUEVO e independiente, con su propia cuenta = 0.",
        scopes: [
          { nombre: "closure #1 (contador1)", variables: { cuenta: 0 } },
          { nombre: "closure #2 (contador2)", variables: { cuenta: 0 } },
        ],
        consola: [],
      },
      {
        descripcion: "contador1() se ejecuta: incrementa SU cuenta (la del closure #1) a 1.",
        scopes: [
          { nombre: "closure #1 (contador1)", variables: { cuenta: 1 } },
          { nombre: "closure #2 (contador2)", variables: { cuenta: 0 } },
        ],
        consola: ["1"],
      },
      {
        descripcion: "contador1() se ejecuta de nuevo: vuelve a incrementar la misma cuenta capturada.",
        scopes: [
          { nombre: "closure #1 (contador1)", variables: { cuenta: 2 } },
          { nombre: "closure #2 (contador2)", variables: { cuenta: 0 } },
        ],
        consola: ["1", "2"],
      },
      {
        descripcion:
          "contador2() se ejecuta: incrementa SU PROPIA cuenta (closure #2), que arrancaba en 0. No comparte estado con contador1.",
        scopes: [
          { nombre: "closure #1 (contador1)", variables: { cuenta: 2 } },
          { nombre: "closure #2 (contador2)", variables: { cuenta: 1 } },
        ],
        consola: ["1", "2", "1"],
      },
    ],
  },
  {
    slug: "var-vs-let",
    titulo: "var vs let en loops",
    codigo: [
      "for (var i = 0; i < 3; i++) {",
      "  setTimeout(() => console.log(i), 0);",
      "}",
      "// -----",
      "for (let j = 0; j < 3; j++) {",
      "  setTimeout(() => console.log(j), 0);",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "var es function-scoped: existe UNA sola variable i, compartida por las 3 vueltas del loop.",
        scopes: [{ nombre: "Scope del loop (var)", variables: { i: 0 } }],
        consola: [],
      },
      {
        descripcion:
          "Se programan los 3 setTimeout. Los tres closures capturan la MISMA variable i — no un valor congelado en cada vuelta.",
        scopes: [{ nombre: "Scope del loop (var)", variables: { i: 3 } }],
        consola: [],
      },
      {
        descripcion:
          "El código síncrono ya terminó y el loop dejó i = 3. Cuando el Event Loop ejecuta los timeouts, los tres leen la misma i, que ahora vale 3.",
        scopes: [{ nombre: "Scope del loop (var)", variables: { i: 3 } }],
        consola: ["3", "3", "3"],
      },
      {
        descripcion:
          "let es block-scoped: el motor de JS crea una variable j NUEVA en cada vuelta del loop.",
        scopes: [
          { nombre: "Vuelta 0 (let)", variables: { j: 0 } },
          { nombre: "Vuelta 1 (let)", variables: { j: 1 } },
          { nombre: "Vuelta 2 (let)", variables: { j: 2 } },
        ],
        consola: ["3", "3", "3"],
      },
      {
        descripcion: "Cada uno de los 3 timeouts capturó SU PROPIA j, en el scope de esa vuelta específica.",
        scopes: [
          { nombre: "Vuelta 0 (let)", variables: { j: 0 } },
          { nombre: "Vuelta 1 (let)", variables: { j: 1 } },
          { nombre: "Vuelta 2 (let)", variables: { j: 2 } },
        ],
        consola: ["3", "3", "3"],
      },
      {
        descripcion: "Cuando corren los timeouts, cada uno imprime el valor que capturó: 0, 1 y 2.",
        scopes: [
          { nombre: "Vuelta 0 (let)", variables: { j: 0 } },
          { nombre: "Vuelta 1 (let)", variables: { j: 1 } },
          { nombre: "Vuelta 2 (let)", variables: { j: 2 } },
        ],
        consola: ["3", "3", "3", "0", "1", "2"],
      },
    ],
  },
];
