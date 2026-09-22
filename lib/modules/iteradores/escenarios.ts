export interface PasoGenerador {
  llamada: string;
  resultado: string;
  descripcion: string;
}

export interface EscenarioGenerador {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoGenerador[];
}

export const escenariosGeneradores: EscenarioGenerador[] = [
  {
    slug: "contador-simple",
    titulo: "Generador básico",
    codigo: [
      "function* contarHasta(max) {",
      "  for (let i = 1; i <= max; i++) {",
      "    yield i;",
      "  }",
      "  return 'listo';",
      "}",
      "",
      "const gen = contarHasta(3);",
    ],
    pasos: [
      {
        llamada: "contarHasta(3)",
        resultado: "Generator { }",
        descripcion:
          "Llamar a una función generadora NO ejecuta su cuerpo. Devuelve un objeto iterator, pausado antes de la primera línea, listo para avanzar con .next().",
      },
      {
        llamada: "gen.next()",
        resultado: "{ value: 1, done: false }",
        descripcion:
          "Corre el cuerpo hasta el primer yield i, que en ese momento vale 1. La ejecución se pausa justo ahí — literalmente en el medio del for.",
      },
      {
        llamada: "gen.next()",
        resultado: "{ value: 2, done: false }",
        descripcion:
          "Se reanuda desde donde quedó pausado (dentro del for), completa esa vuelta, entra a la siguiente y pausa en el yield con i = 2.",
      },
      {
        llamada: "gen.next()",
        resultado: "{ value: 3, done: false }",
        descripcion: "Misma mecánica: reanuda, avanza el for, pausa en yield con i = 3.",
      },
      {
        llamada: "gen.next()",
        resultado: "{ value: 'listo', done: true }",
        descripcion:
          "El for ya no cumple la condición (i > max), sale del loop y llega al return. El valor de un return en un generador viaja en 'value' de la llamada que hace terminar al generador, con done: true.",
      },
      {
        llamada: "gen.next()",
        resultado: "{ value: undefined, done: true }",
        descripcion:
          "Un generador ya terminado siempre devuelve done: true con value: undefined en cualquier llamada posterior — no se puede 'reiniciar' este mismo iterator.",
      },
    ],
  },
  {
    slug: "comunicacion-bidireccional",
    titulo: "next(valor): comunicación en ambos sentidos",
    codigo: [
      "function* conversacion() {",
      "  const nombre = yield '¿Cómo te llamás?';",
      "  const edad = yield `Hola ${nombre}, ¿qué edad tenés?`;",
      "  return `${nombre} tiene ${edad} años`;",
      "}",
      "",
      "const gen = conversacion();",
    ],
    pasos: [
      {
        llamada: "gen.next()",
        resultado: "{ value: '¿Cómo te llamás?', done: false }",
        descripcion:
          "La primera llamada a next() nunca puede 'entregar' un valor útil al generador (todavía no hay ningún yield esperando uno) — solo arranca la ejecución hasta el primer yield.",
      },
      {
        llamada: "gen.next('Ana')",
        resultado: "{ value: 'Hola Ana, ¿qué edad tenés?', done: false }",
        descripcion:
          "'Ana' se convierte en el valor de la expresión 'yield ...' anterior — por eso nombre queda asignado a 'Ana'. La ejecución sigue hasta el próximo yield.",
      },
      {
        llamada: "gen.next('30')",
        resultado: "{ value: 'Ana tiene 30 años', done: true }",
        descripcion:
          "'30' se convierte en el valor de esa segunda expresión yield, completando edad. El generador llega al return y termina con done: true.",
      },
    ],
  },
];
