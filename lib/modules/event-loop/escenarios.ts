export interface PasoEventLoop {
  descripcion: string;
  lineaActiva?: number;
  callStack: string[];
  webApis: string[];
  colaMacrotasks: string[];
  colaMicrotasks: string[];
  consola: string[];
}

export interface EscenarioEventLoop {
  slug: string;
  titulo: string;
  codigo: string[];
  pasos: PasoEventLoop[];
}

const base: Omit<PasoEventLoop, "descripcion" | "lineaActiva"> = {
  callStack: [],
  webApis: [],
  colaMacrotasks: [],
  colaMicrotasks: [],
  consola: [],
};

export const escenariosEventLoop: EscenarioEventLoop[] = [
  {
    slug: "clasico",
    titulo: "Orden básico",
    codigo: [
      "console.log('inicio');",
      "setTimeout(() => console.log('timeout'), 0);",
      "Promise.resolve().then(() => console.log('promise'));",
      "console.log('fin');",
    ],
    pasos: [
      { ...base, callStack: ["main()"], descripcion: "Arranca la ejecución del script. main() entra al call stack." },
      { ...base, lineaActiva: 0, callStack: ["main()", "console.log"], descripcion: "Se ejecuta console.log('inicio') de forma síncrona." },
      { ...base, callStack: ["main()"], consola: ["inicio"], descripcion: "'inicio' se imprime. console.log sale del call stack." },
      { ...base, lineaActiva: 1, callStack: ["main()", "setTimeout"], consola: ["inicio"], descripcion: "Se invoca setTimeout. Su callback se delega a las Web APIs con un timer de 0ms." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (0ms)"], consola: ["inicio"], descripcion: "setTimeout sale del call stack; el timer queda corriendo en las Web APIs." },
      { ...base, lineaActiva: 2, callStack: ["main()", "Promise.then"], webApis: ["setTimeout (0ms)"], consola: ["inicio"], descripcion: "Se invoca .then(). Como la promesa ya está resuelta, su callback se encola directo en microtasks." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (0ms)"], colaMicrotasks: ["() => console.log('promise')"], consola: ["inicio"], descripcion: "El callback de then() se encola en la cola de microtasks (no espera al timer)." },
      { ...base, lineaActiva: 3, callStack: ["main()", "console.log"], webApis: ["setTimeout (0ms)"], colaMicrotasks: ["() => console.log('promise')"], consola: ["inicio"], descripcion: "Se ejecuta console.log('fin') de forma síncrona." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (0ms)"], colaMicrotasks: ["() => console.log('promise')"], consola: ["inicio", "fin"], descripcion: "'fin' se imprime." },
      { ...base, webApis: ["setTimeout (0ms)"], colaMicrotasks: ["() => console.log('promise')"], consola: ["inicio", "fin"], descripcion: "El call stack queda vacío: terminó el código síncrono." },
      { ...base, callStack: ["() => console.log('promise')"], webApis: ["setTimeout (0ms)"], consola: ["inicio", "fin"], descripcion: "Con el call stack vacío, el Event Loop revisa primero la cola de microtasks y la ejecuta." },
      { ...base, webApis: ["setTimeout (0ms)"], consola: ["inicio", "fin", "promise"], descripcion: "'promise' se imprime. La cola de microtasks queda vacía." },
      { ...base, colaMacrotasks: ["() => console.log('timeout')"], consola: ["inicio", "fin", "promise"], descripcion: "El timer de setTimeout venció: su callback pasa de las Web APIs a la cola de macrotasks." },
      { ...base, callStack: ["() => console.log('timeout')"], consola: ["inicio", "fin", "promise"], descripcion: "Con microtasks vacía, el Event Loop toma la siguiente macrotask y la ejecuta." },
      { ...base, consola: ["inicio", "fin", "promise", "timeout"], descripcion: "'timeout' se imprime. No quedan más tareas: el Event Loop queda inactivo." },
    ],
  },
  {
    slug: "varios-timeouts",
    titulo: "Varios setTimeout",
    codigo: [
      "console.log('A');",
      "setTimeout(() => console.log('B'), 100);",
      "setTimeout(() => console.log('C'), 0);",
      "console.log('D');",
    ],
    pasos: [
      { ...base, callStack: ["main()"], descripcion: "Arranca la ejecución. main() entra al call stack." },
      { ...base, lineaActiva: 0, callStack: ["main()", "console.log"], descripcion: "Se ejecuta console.log('A')." },
      { ...base, callStack: ["main()"], consola: ["A"], descripcion: "'A' se imprime." },
      { ...base, lineaActiva: 1, callStack: ["main()", "setTimeout"], consola: ["A"], descripcion: "Se invoca setTimeout con 100ms. Se delega a las Web APIs." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (100ms)"], consola: ["A"], descripcion: "El timer de 100ms empieza a correr en paralelo." },
      { ...base, lineaActiva: 2, callStack: ["main()", "setTimeout"], webApis: ["setTimeout (100ms)"], consola: ["A"], descripcion: "Se invoca el segundo setTimeout, con 0ms." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (100ms)", "setTimeout (0ms)"], consola: ["A"], descripcion: "El segundo timer también corre en paralelo en las Web APIs." },
      { ...base, lineaActiva: 3, callStack: ["main()", "console.log"], webApis: ["setTimeout (100ms)", "setTimeout (0ms)"], consola: ["A"], descripcion: "Se ejecuta console.log('D')." },
      { ...base, callStack: ["main()"], webApis: ["setTimeout (100ms)", "setTimeout (0ms)"], consola: ["A", "D"], descripcion: "'D' se imprime." },
      { ...base, webApis: ["setTimeout (100ms)", "setTimeout (0ms)"], consola: ["A", "D"], descripcion: "El call stack queda vacío: terminó el código síncrono." },
      { ...base, webApis: ["setTimeout (100ms)"], colaMacrotasks: ["() => console.log('C')"], consola: ["A", "D"], descripcion: "El timer de 0ms vence primero (aunque se agendó después): pasa a la cola de macrotasks." },
      { ...base, callStack: ["() => console.log('C')"], webApis: ["setTimeout (100ms)"], consola: ["A", "D"], descripcion: "El Event Loop ve el call stack vacío y toma la macrotask disponible." },
      { ...base, webApis: ["setTimeout (100ms)"], consola: ["A", "D", "C"], descripcion: "'C' se imprime." },
      { ...base, colaMacrotasks: ["() => console.log('B')"], consola: ["A", "D", "C"], descripcion: "Recién ahora vence el timer de 100ms: su callback pasa a la cola de macrotasks." },
      { ...base, callStack: ["() => console.log('B')"], consola: ["A", "D", "C"], descripcion: "El Event Loop toma la macrotask." },
      { ...base, consola: ["A", "D", "C", "B"], descripcion: "'B' se imprime. No quedan más tareas." },
    ],
  },
];
