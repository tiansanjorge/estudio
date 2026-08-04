export type EstadoUnidad = "procesando" | "pendiente" | "completada";

export interface UnidadTrabajo {
  nombre: string;
  estado: EstadoUnidad;
}

export interface PasoFiber {
  descripcion: string;
  unidades: UnidadTrabajo[];
  inputAtendido: boolean;
}

export interface EscenarioFiber {
  slug: string;
  titulo: string;
  pasos: PasoFiber[];
}

export const escenariosFiber: EscenarioFiber[] = [
  {
    slug: "sin-fiber",
    titulo: "Sin Fiber (reconciler viejo)",
    pasos: [
      {
        descripcion:
          "Empieza a renderizar un árbol grande (miles de componentes). Con el reconciler recursivo de React 15, esto es UNA sola operación, sin puntos de pausa.",
        unidades: [{ nombre: "Árbol completo", estado: "procesando" }],
        inputAtendido: false,
      },
      {
        descripcion:
          "A mitad de camino, el usuario tipea una letra en un input. El navegador NO puede atenderla todavía: el hilo principal sigue ocupado renderizando.",
        unidades: [{ nombre: "Árbol completo", estado: "procesando" }],
        inputAtendido: false,
      },
      {
        descripcion:
          "El render recién termina acá. Solo ahora el navegador puede procesar la letra tipeada — el usuario sintió un salto o directamente la página trabada.",
        unidades: [{ nombre: "Árbol completo", estado: "completada" }],
        inputAtendido: true,
      },
    ],
  },
  {
    slug: "con-fiber",
    titulo: "Con Fiber (unidades interrumpibles)",
    pasos: [
      {
        descripcion:
          "Con Fiber, ese mismo árbol se divide en unidades de trabajo chicas — aproximadamente una por componente.",
        unidades: [
          { nombre: "Unidad 1", estado: "procesando" },
          { nombre: "Unidad 2", estado: "pendiente" },
          { nombre: "Unidad 3", estado: "pendiente" },
        ],
        inputAtendido: false,
      },
      {
        descripcion:
          "Después de cada unidad, React puede ceder el control al navegador y preguntar: '¿hay algo más urgente esperando?'",
        unidades: [
          { nombre: "Unidad 1", estado: "completada" },
          { nombre: "Unidad 2", estado: "pendiente" },
          { nombre: "Unidad 3", estado: "pendiente" },
        ],
        inputAtendido: false,
      },
      {
        descripcion:
          "El usuario tipeó una letra. Como hay un punto de pausa disponible, el navegador la atiende YA, sin esperar a que termine todo el árbol.",
        unidades: [
          { nombre: "Unidad 1", estado: "completada" },
          { nombre: "Unidad 2", estado: "pendiente" },
          { nombre: "Unidad 3", estado: "pendiente" },
        ],
        inputAtendido: true,
      },
      {
        descripcion: "Recién después, React retoma exactamente donde había quedado y sigue con las unidades restantes.",
        unidades: [
          { nombre: "Unidad 1", estado: "completada" },
          { nombre: "Unidad 2", estado: "procesando" },
          { nombre: "Unidad 3", estado: "pendiente" },
        ],
        inputAtendido: true,
      },
      {
        descripcion: "Termina de procesar todas las unidades. El árbol completo se actualiza, pero el input nunca se sintió trabado.",
        unidades: [
          { nombre: "Unidad 1", estado: "completada" },
          { nombre: "Unidad 2", estado: "completada" },
          { nombre: "Unidad 3", estado: "completada" },
        ],
        inputAtendido: true,
      },
    ],
  },
];
