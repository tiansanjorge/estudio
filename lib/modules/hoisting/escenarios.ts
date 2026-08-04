export interface EntradaMemoria {
  nombre: string;
  valor: string;
}

export interface PasoHoisting {
  descripcion: string;
  memoria: EntradaMemoria[];
  consola: string[];
}

export interface EscenarioHoisting {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoHoisting[];
}

export const escenariosHoisting: EscenarioHoisting[] = [
  {
    slug: "var-y-function",
    titulo: "var y function declaration",
    codigo: [
      "console.log(mensaje);",
      "console.log(saludar());",
      "",
      "var mensaje = 'hola';",
      "",
      "function saludar() {",
      "  return 'saludo';",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "Fase de creación (antes de ejecutar cualquier línea): JS escanea el scope y encuentra 'var mensaje' y 'function saludar'. Reserva mensaje con undefined, y saludar queda disponible con su función completa ya armada.",
        memoria: [
          { nombre: "mensaje", valor: "undefined" },
          { nombre: "saludar", valor: "función completa" },
        ],
        consola: [],
      },
      {
        descripcion:
          "Arranca la fase de ejecución. console.log(mensaje) lee el valor actual: todavía undefined, porque la línea de asignación no corrió.",
        memoria: [
          { nombre: "mensaje", valor: "undefined" },
          { nombre: "saludar", valor: "función completa" },
        ],
        consola: ["undefined"],
      },
      {
        descripcion:
          "console.log(saludar()) funciona sin problema: saludar ya estaba completamente definida desde la fase de creación.",
        memoria: [
          { nombre: "mensaje", valor: "undefined" },
          { nombre: "saludar", valor: "función completa" },
        ],
        consola: ["undefined", "saludo"],
      },
      {
        descripcion: "Recién ahora se ejecuta 'var mensaje = hola': mensaje pasa de undefined a 'hola'.",
        memoria: [
          { nombre: "mensaje", valor: "'hola'" },
          { nombre: "saludar", valor: "función completa" },
        ],
        consola: ["undefined", "saludo"],
      },
    ],
  },
  {
    slug: "temporal-dead-zone",
    titulo: "Temporal Dead Zone",
    codigo: ["console.log(a);", "", "let a = 5;"],
    pasos: [
      {
        descripcion:
          "Fase de creación: JS ve 'let a' y la registra, pero NO le asigna undefined como haría con var. Queda en un estado especial: la Temporal Dead Zone (TDZ). Todavía no se puede leer.",
        memoria: [{ nombre: "a", valor: "<TDZ>" }],
        consola: [],
      },
      {
        descripcion:
          "console.log(a) intenta leer 'a' mientras sigue en la TDZ. Esto lanza un ReferenceError — no devuelve undefined como pasaría con var.",
        memoria: [{ nombre: "a", valor: "<TDZ>" }],
        consola: ["Uncaught ReferenceError: Cannot access 'a' before initialization"],
      },
      {
        descripcion:
          "La ejecución se corta ahí: la línea 'let a = 5' nunca llega a correr. Si no hubiera error, sería recién en esa línea que 'a' saldría de la TDZ.",
        memoria: [{ nombre: "a", valor: "<TDZ>" }],
        consola: ["Uncaught ReferenceError: Cannot access 'a' before initialization"],
      },
    ],
  },
];
