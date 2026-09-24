export type Escenario = "reintento" | "concurrentes" | "otro-cuerpo";
export type Implementacion = "ninguna" | "memoria" | "tabla";

export const ESCENARIOS: { id: Escenario; nombre: string; descripcion: string }[] = [
  {
    id: "reintento",
    nombre: "Reintento tras un timeout",
    descripcion: "El cobro se hizo, pero la respuesta se perdió en la red; el cliente reintenta con la misma clave y el balanceador lo manda a otra instancia.",
  },
  {
    id: "concurrentes",
    nombre: "Doble click",
    descripcion: "Dos requests con la misma clave llegan casi a la vez, a dos instancias distintas.",
  },
  {
    id: "otro-cuerpo",
    nombre: "Misma clave, otro cuerpo",
    descripcion: "Por un bug, el cliente reutiliza la clave de un pago de $100 para uno de $500.",
  },
];

export const IMPLEMENTACIONES: { id: Implementacion; nombre: string }[] = [
  { id: "ninguna", nombre: "Sin idempotencia" },
  { id: "memoria", nombre: "Respuesta guardada en memoria" },
  { id: "tabla", nombre: "Tabla con estado, UNIQUE y huella" },
];

export interface Resultado {
  cobros: number;
  correcto: boolean;
  pasos: string[];
}

const RESULTADOS: Record<Escenario, Record<Implementacion, Resultado>> = {
  reintento: {
    ninguna: {
      cobros: 2,
      correcto: false,
      pasos: ["Request 1: cobra $100, la respuesta se pierde.", "Request 2: no sabe nada del primero y vuelve a cobrar $100."],
    },
    memoria: {
      cobros: 2,
      correcto: false,
      pasos: [
        "Request 1 (instancia A): cobra y guarda la respuesta en su memoria.",
        "Request 2 (instancia B): su memoria está vacía, así que vuelve a cobrar.",
      ],
    },
    tabla: {
      cobros: 1,
      correcto: true,
      pasos: [
        "Request 1: inserta la clave como 'en proceso', cobra y guarda la respuesta como 'completada'.",
        "Request 2: encuentra la clave completada en la tabla compartida y devuelve la misma respuesta sin cobrar.",
      ],
    },
  },
  concurrentes: {
    ninguna: {
      cobros: 2,
      correcto: false,
      pasos: ["Las dos requests cobran $100."],
    },
    memoria: {
      cobros: 2,
      correcto: false,
      pasos: [
        "Las dos consultan '¿existe la clave?' antes de que cualquiera termine: las dos ven que no.",
        "Las dos cobran. Verificar y después actuar, sin atomicidad, es una condición de carrera.",
      ],
    },
    tabla: {
      cobros: 1,
      correcto: true,
      pasos: [
        "Las dos intentan INSERT de la clave con estado 'en proceso'; el UNIQUE deja pasar solo a una.",
        "La otra recibe 409: 'hay una request en proceso con esta clave, reintentá en un momento'.",
      ],
    },
  },
  "otro-cuerpo": {
    ninguna: {
      cobros: 2,
      correcto: true,
      pasos: ["Cobra $100 y después $500: sin idempotencia, cada request es independiente."],
    },
    memoria: {
      cobros: 1,
      correcto: false,
      pasos: [
        "La segunda request encuentra la clave y devuelve la respuesta del pago de $100.",
        "El cliente cree que pagó $500 y en realidad no se cobró: un error silencioso.",
      ],
    },
    tabla: {
      cobros: 1,
      correcto: true,
      pasos: [
        "La tabla guarda un hash del cuerpo junto a la clave.",
        "La segunda request tiene otra huella: responde 422, 'esta clave ya se usó con otro contenido'.",
      ],
    },
  },
};

export function simular(escenario: Escenario, implementacion: Implementacion): Resultado {
  return RESULTADOS[escenario][implementacion];
}
