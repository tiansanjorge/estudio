export type EstrategiaDeploy = "recreate" | "rolling" | "blue-green" | "canary";

// "off" = instancia apagada o arrancando: no atiende tráfico
export type EstadoInstancia = "v1" | "v2" | "off";

export interface PasoDeploy {
  titulo: string;
  instancias: EstadoInstancia[];
  // porcentaje del tráfico que atiende v2
  traficoV2: number;
}

export interface Estrategia {
  id: EstrategiaDeploy;
  nombre: string;
  pasos: PasoDeploy[];
  capacidadExtra: string;
  rollback: string;
  resumen: string;
}

const v1 = (n: number): EstadoInstancia[] => Array.from({ length: n }, () => "v1");
const v2 = (n: number): EstadoInstancia[] => Array.from({ length: n }, () => "v2");
const off = (n: number): EstadoInstancia[] => Array.from({ length: n }, () => "off");

export const ESTRATEGIAS_DEPLOY: Estrategia[] = [
  {
    id: "recreate",
    nombre: "Recreate",
    pasos: [
      { titulo: "Estado inicial", instancias: v1(8), traficoV2: 0 },
      { titulo: "Se apagan todas las v1", instancias: off(8), traficoV2: 0 },
      { titulo: "Arrancan todas las v2", instancias: v2(8), traficoV2: 100 },
    ],
    capacidadExtra: "Ninguna",
    rollback: "Lento: otro recreate completo, con otra caída",
    resumen: "Simple y barato, pero hay downtime entre apagar y arrancar. Sirve cuando dos versiones no pueden convivir y se acepta una ventana de mantenimiento.",
  },
  {
    id: "rolling",
    nombre: "Rolling",
    pasos: [
      { titulo: "Estado inicial", instancias: v1(8), traficoV2: 0 },
      { titulo: "Se reemplazan 2", instancias: [...v2(2), ...v1(6)], traficoV2: 25 },
      { titulo: "Se reemplazan 2 más", instancias: [...v2(4), ...v1(4)], traficoV2: 50 },
      { titulo: "Se reemplazan 2 más", instancias: [...v2(6), ...v1(2)], traficoV2: 75 },
      { titulo: "Deploy completo", instancias: v2(8), traficoV2: 100 },
    ],
    capacidadExtra: "Poca o ninguna (se reemplaza de a tandas)",
    rollback: "Otro rolling en sentido inverso: minutos",
    resumen: "El default de Kubernetes y de la mayoría de las plataformas. Sin downtime, pero durante el deploy conviven v1 y v2: el código y el schema tienen que ser compatibles entre versiones.",
  },
  {
    id: "blue-green",
    nombre: "Blue-green",
    pasos: [
      { titulo: "Estado inicial (blue)", instancias: [...v1(8), ...off(8)], traficoV2: 0 },
      { titulo: "Se levanta green completo, sin tráfico", instancias: [...v1(8), ...v2(8)], traficoV2: 0 },
      { titulo: "El balanceador pasa todo a green", instancias: [...v1(8), ...v2(8)], traficoV2: 100 },
      { titulo: "Blue queda de respaldo y después se apaga", instancias: [...off(8), ...v2(8)], traficoV2: 100 },
    ],
    capacidadExtra: "El doble durante el deploy",
    rollback: "Instantáneo: volver a apuntar el balanceador a blue",
    resumen: "Se puede probar green antes de darle tráfico y el rollback es un switch. Pero el cambio es todo o nada: si hay un bug que las pruebas no vieron, lo ve el 100% de los usuarios.",
  },
  {
    id: "canary",
    nombre: "Canary",
    pasos: [
      { titulo: "Estado inicial", instancias: v1(8), traficoV2: 0 },
      { titulo: "Canary: 5% del tráfico a v2", instancias: [...v2(1), ...v1(8)], traficoV2: 5 },
      { titulo: "Métricas sanas: 25%", instancias: [...v2(2), ...v1(6)], traficoV2: 25 },
      { titulo: "Métricas sanas: 50%", instancias: [...v2(4), ...v1(4)], traficoV2: 50 },
      { titulo: "Deploy completo", instancias: v2(8), traficoV2: 100 },
    ],
    capacidadExtra: "Poca (una instancia extra al principio)",
    rollback: "Rápido y con impacto acotado: se saca el canary",
    resumen: "Un bug lo ve primero un porcentaje chico de usuarios, y el análisis de métricas (errores, latencia) decide si avanzar o volver atrás, idealmente de forma automática.",
  },
];
