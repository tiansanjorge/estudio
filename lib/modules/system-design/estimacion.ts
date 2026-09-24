export interface Supuestos {
  usuariosDiarios: number;
  accionesPorUsuario: number;
  lecturasPorEscritura: number;
  bytesPorEscritura: number;
  anios: number;
  factorPico: number;
}

export const REPLICAS = 3;
export const SEGUNDOS_POR_DIA = 86_400;

export const PRESETS: { id: string; nombre: string; supuestos: Supuestos }[] = [
  {
    id: "acortador",
    nombre: "Acortador de URLs",
    supuestos: { usuariosDiarios: 20_000_000, accionesPorUsuario: 5, lecturasPorEscritura: 100, bytesPorEscritura: 500, anios: 5, factorPico: 3 },
  },
  {
    id: "chat",
    nombre: "Chat",
    supuestos: { usuariosDiarios: 50_000_000, accionesPorUsuario: 80, lecturasPorEscritura: 1, bytesPorEscritura: 200, anios: 3, factorPico: 5 },
  },
  {
    id: "feed",
    nombre: "Feed social",
    supuestos: { usuariosDiarios: 100_000_000, accionesPorUsuario: 20, lecturasPorEscritura: 50, bytesPorEscritura: 1_000, anios: 10, factorPico: 3 },
  },
];

export interface Estimacion {
  valor: number;
  unidad: "qps" | "bytes" | "bytes/s";
  formula: string;
}

export function estimar(s: Supuestos): Record<string, Estimacion> {
  const accionesDia = s.usuariosDiarios * s.accionesPorUsuario;
  const escriturasDia = accionesDia / (s.lecturasPorEscritura + 1);
  const lecturasDia = accionesDia - escriturasDia;
  const qpsPromedio = accionesDia / SEGUNDOS_POR_DIA;
  const almacenamientoDia = escriturasDia * s.bytesPorEscritura;

  return {
    "QPS promedio": { valor: qpsPromedio, unidad: "qps", formula: "usuarios × acciones / 86.400 s" },
    "QPS pico": { valor: qpsPromedio * s.factorPico, unidad: "qps", formula: `QPS promedio × ${s.factorPico}` },
    "Escrituras por segundo": {
      valor: escriturasDia / SEGUNDOS_POR_DIA,
      unidad: "qps",
      formula: `acciones / (${s.lecturasPorEscritura} + 1) / 86.400 s`,
    },
    "Almacenamiento por día": { valor: almacenamientoDia, unidad: "bytes", formula: "escrituras por día × bytes por escritura" },
    [`Almacenamiento en ${s.anios} años (×${REPLICAS} réplicas)`]: {
      valor: almacenamientoDia * 365 * s.anios * REPLICAS,
      unidad: "bytes",
      formula: `por día × 365 × ${s.anios} × ${REPLICAS}`,
    },
    "Ancho de banda de lectura": {
      valor: (lecturasDia / SEGUNDOS_POR_DIA) * s.bytesPorEscritura,
      unidad: "bytes/s",
      formula: "lecturas por segundo × bytes por lectura",
    },
  };
}

const PREFIJOS = ["", "K", "M", "G", "T", "P", "E"];

// estilo de estimación: potencias de 10 y un decimal, que es la precisión que importa
export function formatear(valor: number, unidad: Estimacion["unidad"]): string {
  let v = valor;
  let i = 0;
  while (v >= 1000 && i < PREFIJOS.length - 1) {
    v /= 1000;
    i++;
  }
  const numero = v.toLocaleString("es-AR", { maximumFractionDigits: v < 10 ? 1 : 0 });
  if (unidad === "qps") return `${numero}${PREFIJOS[i]} req/s`;
  return `${numero} ${PREFIJOS[i]}B${unidad === "bytes/s" ? "/s" : ""}`;
}
