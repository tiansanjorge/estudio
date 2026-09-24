export type ModeloComputo = "vm" | "contenedores" | "serverless";

// requests por segundo en cada minuto: tranquilo, un pico de campaña y la noche sin tráfico
export const TRAFICO = [10, 10, 10, 80, 80, 80, 80, 20, 10, 0, 0, 10];
export const CAPACIDAD_POR_INSTANCIA = 20;

export interface ConfigModelo {
  id: ModeloComputo;
  nombre: string;
  // minutos que tarda en tener lista una instancia nueva desde que el autoscaler la pide
  demoraEscalado: number;
  minimoInstancias: number;
  nota: string;
}

export const MODELOS_COMPUTO: ConfigModelo[] = [
  {
    id: "vm",
    nombre: "VMs con autoscaling",
    demoraEscalado: 3,
    minimoInstancias: 1,
    nota: "Una VM nueva tarda minutos (arrancar el sistema, instalar, pasar el health check): durante el pico, la capacidad llega tarde.",
  },
  {
    id: "contenedores",
    nombre: "Contenedores",
    demoraEscalado: 1,
    minimoInstancias: 1,
    nota: "Un contenedor arranca en segundos sobre hosts que ya existen: reacciona mucho antes, aunque con un mínimo siempre prendido.",
  },
  {
    id: "serverless",
    nombre: "Serverless",
    demoraEscalado: 0,
    minimoInstancias: 0,
    nota: "Escala con cada request y baja a cero sin tráfico, pero cada instancia nueva paga un cold start.",
  },
];

export interface MinutoSimulado {
  trafico: number;
  instancias: number;
  atendidas: number;
  sinAtender: number;
  coldStarts: number;
}

export function simular(modelo: ConfigModelo): MinutoSimulado[] {
  const deseadas = TRAFICO.map((t) => Math.ceil(t / CAPACIDAD_POR_INSTANCIA));
  let previas = modelo.minimoInstancias;

  return TRAFICO.map((trafico, t) => {
    // el autoscaler reacciona a lo que midió hace `demoraEscalado` minutos
    const medido = t - modelo.demoraEscalado >= 0 ? deseadas[t - modelo.demoraEscalado] : modelo.minimoInstancias;
    const instancias = Math.max(modelo.minimoInstancias, medido);
    const atendidas = Math.min(trafico, instancias * CAPACIDAD_POR_INSTANCIA);
    const coldStarts = modelo.id === "serverless" ? Math.max(0, instancias - previas) : 0;
    previas = instancias;
    return { trafico, instancias, atendidas, sinAtender: trafico - atendidas, coldStarts };
  });
}

export function resumen(minutos: MinutoSimulado[]) {
  const sinAtender = minutos.reduce((s, m) => s + m.sinAtender, 0);
  const total = minutos.reduce((s, m) => s + m.trafico, 0);
  const capacidad = minutos.reduce((s, m) => s + m.instancias * CAPACIDAD_POR_INSTANCIA, 0);
  return {
    porcentajeSinAtender: (sinAtender / total) * 100,
    coldStarts: minutos.reduce((s, m) => s + m.coldStarts, 0),
    // cuánta de la capacidad pagada no atendió nada
    ociosa: capacidad === 0 ? 0 : ((capacidad - (total - sinAtender)) / capacidad) * 100,
  };
}
