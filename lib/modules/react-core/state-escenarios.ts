export interface PasoState {
  descripcion: string;
  cuentaEnClosure: number;
  cuentaInterna: number;
  consola: string[];
}

export interface EscenarioState {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoState[];
}

export const escenariosState: EscenarioState[] = [
  {
    slug: "asincronico",
    titulo: "setState no es inmediato",
    codigo: [
      "function manejarClick() {",
      "  console.log(cuenta); // ?",
      "  setCuenta(cuenta + 1);",
      "  console.log(cuenta); // ?",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "El botón se clickea. Esta ejecución de manejarClick() tiene 'cuenta' fijo en 0 — es el valor que tenía cuando se renderizó este botón.",
        cuentaEnClosure: 0,
        cuentaInterna: 0,
        consola: [],
      },
      {
        descripcion: "console.log(cuenta) imprime 0: el valor capturado en esta closure, que no cambia durante esta ejecución.",
        cuentaEnClosure: 0,
        cuentaInterna: 0,
        consola: ["0"],
      },
      {
        descripcion:
          "setCuenta(cuenta + 1) le pide a React que actualice el estado a 1 y agende un re-render — pero NO cambia la variable 'cuenta' de esta ejecución.",
        cuentaEnClosure: 0,
        cuentaInterna: 1,
        consola: ["0"],
      },
      {
        descripcion:
          "console.log(cuenta) vuelve a imprimir 0. Seguimos en la misma ejecución, con la misma closure — 'cuenta' todavía vale lo que valía al principio.",
        cuentaEnClosure: 0,
        cuentaInterna: 1,
        consola: ["0", "0"],
      },
      {
        descripcion:
          "manejarClick() terminó. Recién ahora React vuelve a renderizar el componente: en el próximo render, cuenta = 1.",
        cuentaEnClosure: 1,
        cuentaInterna: 1,
        consola: ["0", "0"],
      },
    ],
  },
  {
    slug: "valor-stale",
    titulo: "Valor stale vs función updater",
    codigo: [
      "function sumarTresDirecto() {",
      "  setCuenta(cuenta + 1);",
      "  setCuenta(cuenta + 1);",
      "  setCuenta(cuenta + 1);",
      "}",
    ],
    pasos: [
      {
        descripcion:
          "Arranca con cuenta = 0 en esta closure. Las tres llamadas usan 'cuenta + 1' — pero 'cuenta' es SIEMPRE 0 en las tres, porque es la misma variable capturada.",
        cuentaEnClosure: 0,
        cuentaInterna: 0,
        consola: [],
      },
      {
        descripcion: "Primera llamada: setCuenta(0 + 1). React agenda: 'el próximo estado va a ser 1'.",
        cuentaEnClosure: 0,
        cuentaInterna: 1,
        consola: [],
      },
      {
        descripcion:
          "Segunda llamada: setCuenta(0 + 1) DE NUEVO — sigue siendo 0 + 1, porque 'cuenta' no cambió en esta ejecución. Esto PISA la actualización anterior en vez de sumarla.",
        cuentaEnClosure: 0,
        cuentaInterna: 1,
        consola: [],
      },
      {
        descripcion: "Tercera llamada: lo mismo. Después de las tres, el estado agendado sigue siendo 1, no 3.",
        cuentaEnClosure: 0,
        cuentaInterna: 1,
        consola: [],
      },
      {
        descripcion:
          "Con la función updater — setCuenta(c => c + 1) — cada llamada recibe el valor MÁS RECIENTE pendiente, no el de la closure. Ahí sí: 0 → 1 → 2 → 3.",
        cuentaEnClosure: 0,
        cuentaInterna: 3,
        consola: [],
      },
    ],
  },
];
