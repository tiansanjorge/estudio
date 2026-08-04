export interface ScopeBox {
  nombre: string;
  variables: Record<string, string>;
}

export interface PasoScope {
  descripcion: string;
  scopes: ScopeBox[];
  scopeResaltado?: string;
  consola: string[];
}

export interface EscenarioScope {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoScope[];
}

export const escenariosScope: EscenarioScope[] = [
  {
    slug: "cadena-de-scopes",
    titulo: "Cadena de scopes",
    codigo: [
      "const nombre = 'Global';",
      "",
      "function externa() {",
      "  const ciudad = 'Buenos Aires';",
      "",
      "  function interna() {",
      "    console.log(nombre);",
      "    console.log(ciudad);",
      "  }",
      "",
      "  interna();",
      "}",
      "",
      "externa();",
    ],
    pasos: [
      {
        descripcion: "Se declara nombre en el scope global.",
        scopes: [{ nombre: "Global", variables: { nombre: "'Global'" } }],
        consola: [],
      },
      {
        descripcion: "Se llama a externa(). Se crea su scope, anidado dentro del global.",
        scopes: [
          { nombre: "Global", variables: { nombre: "'Global'" } },
          { nombre: "externa()", variables: { ciudad: "'Buenos Aires'" } },
        ],
        consola: [],
      },
      {
        descripcion: "Se llama a interna(). Se crea su scope, anidado dentro de externa().",
        scopes: [
          { nombre: "Global", variables: { nombre: "'Global'" } },
          { nombre: "externa()", variables: { ciudad: "'Buenos Aires'" } },
          { nombre: "interna()", variables: {} },
        ],
        consola: [],
      },
      {
        descripcion:
          "interna() busca 'nombre'. No está en su propio scope ni en externa(), así que sigue subiendo hasta encontrarlo en Global.",
        scopes: [
          { nombre: "Global", variables: { nombre: "'Global'" } },
          { nombre: "externa()", variables: { ciudad: "'Buenos Aires'" } },
          { nombre: "interna()", variables: {} },
        ],
        scopeResaltado: "Global",
        consola: ["Global"],
      },
      {
        descripcion:
          "interna() busca 'ciudad'. No está en su propio scope, pero la encuentra un nivel arriba, en externa() — no hace falta llegar al Global.",
        scopes: [
          { nombre: "Global", variables: { nombre: "'Global'" } },
          { nombre: "externa()", variables: { ciudad: "'Buenos Aires'" } },
          { nombre: "interna()", variables: {} },
        ],
        scopeResaltado: "externa()",
        consola: ["Global", "Buenos Aires"],
      },
    ],
  },
  {
    slug: "shadowing",
    titulo: "Shadowing",
    codigo: [
      "const color = 'azul';",
      "",
      "function pintar() {",
      "  const color = 'rojo';",
      "  console.log(color);",
      "}",
      "",
      "pintar();",
      "console.log(color);",
    ],
    pasos: [
      {
        descripcion: "Se declara color = 'azul' en el scope global.",
        scopes: [{ nombre: "Global", variables: { color: "'azul'" } }],
        consola: [],
      },
      {
        descripcion:
          "Se llama a pintar(). Dentro se declara OTRA variable color = 'rojo'. Esta es una variable distinta que vive en un scope distinto — no modifica la de Global.",
        scopes: [
          { nombre: "Global", variables: { color: "'azul'" } },
          { nombre: "pintar()", variables: { color: "'rojo'" } },
        ],
        consola: [],
      },
      {
        descripcion:
          "console.log(color) dentro de pintar() busca en su PROPIO scope primero, la encuentra ahí mismo, y ya no sigue buscando: 'rojo' hace shadowing sobre la de Global.",
        scopes: [
          { nombre: "Global", variables: { color: "'azul'" } },
          { nombre: "pintar()", variables: { color: "'rojo'" } },
        ],
        scopeResaltado: "pintar()",
        consola: ["rojo"],
      },
      {
        descripcion:
          "pintar() terminó, su scope desaparece. De vuelta en Global, console.log(color) resuelve la variable de Global, que nunca cambió.",
        scopes: [{ nombre: "Global", variables: { color: "'azul'" } }],
        scopeResaltado: "Global",
        consola: ["rojo", "azul"],
      },
    ],
  },
];
