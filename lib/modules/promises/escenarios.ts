export type EstadoPromiseSimulada = "pendiente" | "cumplida" | "rechazada";

export interface EstadoEnPaso {
  nombre: string;
  estado: EstadoPromiseSimulada;
  valor?: string;
}

export interface PasoPromise {
  descripcion: string;
  estados: EstadoEnPaso[];
  consola: string[];
}

export interface EscenarioPromise {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoPromise[];
}

export const escenariosPromises: EscenarioPromise[] = [
  {
    slug: "cadena-con-error",
    titulo: "Cadena con error y catch",
    codigo: [
      "Promise.resolve(1)",
      "  .then((n) => n + 1)",
      "  .then((n) => { throw new Error('boom'); })",
      "  .then((n) => console.log('nunca llega', n))",
      "  .catch((err) => console.log('atrapado:', err.message))",
      "  .finally(() => console.log('siempre corre'));",
    ],
    pasos: [
      {
        descripcion: "Promise.resolve(1) crea una promesa ya cumplida con valor 1.",
        estados: [{ nombre: "p0", estado: "cumplida", valor: "1" }],
        consola: [],
      },
      {
        descripcion:
          "El primer .then() recibe 1 y devuelve 2. Cada .then() crea una promesa NUEVA que se cumple con ese valor de retorno.",
        estados: [
          { nombre: "p0", estado: "cumplida", valor: "1" },
          { nombre: "p1 (then #1)", estado: "cumplida", valor: "2" },
        ],
        consola: [],
      },
      {
        descripcion:
          "El segundo .then() recibe 2, pero lanza un Error. Eso hace que la promesa que devuelve quede RECHAZADA.",
        estados: [
          { nombre: "p1 (then #1)", estado: "cumplida", valor: "2" },
          { nombre: "p2 (then #2)", estado: "rechazada", valor: "Error: boom" },
        ],
        consola: [],
      },
      {
        descripcion:
          "El tercer .then() solo maneja el caso cumplido, así que se SALTEA por completo. El rechazo pasa de largo hasta encontrar un manejador de errores.",
        estados: [
          { nombre: "p2 (then #2)", estado: "rechazada", valor: "Error: boom" },
          { nombre: "p3 (then #3, salteado)", estado: "rechazada", valor: "Error: boom" },
        ],
        consola: [],
      },
      {
        descripcion:
          ".catch() sí atrapa el rechazo e imprime el mensaje. Como no vuelve a lanzar el error, la promesa que devuelve .catch() queda CUMPLIDA.",
        estados: [
          { nombre: "p3 (then #3, salteado)", estado: "rechazada", valor: "Error: boom" },
          { nombre: "p4 (catch)", estado: "cumplida", valor: "undefined" },
        ],
        consola: ["atrapado: boom"],
      },
      {
        descripcion:
          ".finally() corre siempre, sin importar si la cadena terminó cumplida o rechazada, y no cambia el valor que sigue circulando.",
        estados: [{ nombre: "p4 (catch)", estado: "cumplida", valor: "undefined" }],
        consola: ["atrapado: boom", "siempre corre"],
      },
    ],
  },
  {
    slug: "olvidar-el-return",
    titulo: "Olvidar el return",
    codigo: [
      "function getUsuario(id) {",
      "  return fetch(`/usuarios/${id}`)",
      "    .then((res) => res.json());",
      "}",
      "",
      "function getUsuarioConBug(id) {",
      "  return fetch(`/usuarios/${id}`)",
      "    .then((res) => { res.json(); }); // falta el return",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "getUsuario: el .then() RETORNA res.json() (otra promesa). Cuando retornás una promesa desde un .then, la cadena espera a que se resuelva y adopta su valor.",
        estados: [{ nombre: "getUsuario(1)", estado: "pendiente" }],
        consola: [],
      },
      {
        descripcion:
          "res.json() se resuelve con los datos parseados. Como fue retornada, la promesa de getUsuario() se cumple con ESE valor.",
        estados: [{ nombre: "getUsuario(1)", estado: "cumplida", valor: "{ id: 1, nombre: 'Ana' }" }],
        consola: [],
      },
      {
        descripcion:
          "getUsuarioConBug: el .then() llama a res.json() pero no la retorna. Esa promesa interna queda 'flotando', sin conectarse a la cadena.",
        estados: [{ nombre: "getUsuarioConBug(1)", estado: "pendiente" }],
        consola: [],
      },
      {
        descripcion:
          "Sin un return explícito, el .then() devuelve undefined de inmediato. La promesa de getUsuarioConBug() se cumple con undefined, sin esperar el parseo del JSON.",
        estados: [{ nombre: "getUsuarioConBug(1)", estado: "cumplida", valor: "undefined" }],
        consola: ["quien llamó a getUsuarioConBug(1) recibe undefined, no los datos"],
      },
    ],
  },
];
