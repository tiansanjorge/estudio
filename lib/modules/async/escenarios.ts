export interface PasoAsync {
  descripcion: string;
  callStack: string[];
  consola: string[];
}

export interface EscenarioAsync {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoAsync[];
}

export const escenariosAsync: EscenarioAsync[] = [
  {
    slug: "no-bloquea",
    titulo: "async no bloquea",
    codigo: [
      "async function main() {",
      "  console.log('A');",
      "  await esperar(0);",
      "  console.log('B');",
      "}",
      "",
      "console.log('inicio');",
      "main();",
      "console.log('fin');",
    ],
    pasos: [
      {
        descripcion: "Se ejecuta console.log('inicio') de forma síncrona.",
        callStack: ["script"],
        consola: ["inicio"],
      },
      {
        descripcion:
          "Se llama a main(). Al ser una función async, arranca a ejecutarse INMEDIATAMENTE y de forma síncrona, igual que cualquier función normal.",
        callStack: ["script", "main()"],
        consola: ["inicio"],
      },
      {
        descripcion: "Dentro de main(), console.log('A') se ejecuta síncrono.",
        callStack: ["script", "main()"],
        consola: ["inicio", "A"],
      },
      {
        descripcion:
          "Se llega al await. Acá main() se PAUSA y le devuelve el control al código que la llamó — no bloquea nada. El resto de main() queda agendado para cuando la promesa se resuelva.",
        callStack: ["script"],
        consola: ["inicio", "A"],
      },
      {
        descripcion:
          "Como main() devolvió el control, sigue el código síncrono que venía después de llamarla: console.log('fin').",
        callStack: ["script"],
        consola: ["inicio", "A", "fin"],
      },
      {
        descripcion:
          "El código síncrono terminó y el call stack queda vacío. El Event Loop procesa la continuación de main() que había quedado pendiente, igual que procesaría una microtask.",
        callStack: ["main() (continuación)"],
        consola: ["inicio", "A", "fin"],
      },
      {
        descripcion: "Se ejecuta console.log('B'): la parte de main() que estaba después del await.",
        callStack: [],
        consola: ["inicio", "A", "fin", "B"],
      },
    ],
  },
];
