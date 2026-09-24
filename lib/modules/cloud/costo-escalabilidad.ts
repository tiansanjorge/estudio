// precios ilustrativos, en dólares: sirven para ver la forma de las curvas, no para presupuestar
export const USD_POR_MILLON_SERVERLESS = 4;
export const USD_POR_INSTANCIA_MES = 30;
export const DESCUENTO_COMPROMISO = 0.35;
// millones de requests por mes que atiende una instancia a ~60% de uso, dejando margen para picos
export const MILLONES_POR_INSTANCIA = 78;
export const MINIMO_INSTANCIAS = 2;

// posiciones del slider: escala logarítmica de 0,1 a 3.000 millones de requests por mes
export const VOLUMENES = [0.1, 0.3, 1, 3, 10, 20, 40, 80, 150, 300, 600, 1200, 3000];

export interface Opcion {
  id: "serverless" | "on-demand" | "compromiso";
  nombre: string;
  costo: number;
  detalle: string;
}

export function instanciasNecesarias(millones: number): number {
  return Math.max(MINIMO_INSTANCIAS, Math.ceil(millones / MILLONES_POR_INSTANCIA));
}

export function costos(millones: number): Opcion[] {
  const instancias = instanciasNecesarias(millones);
  const onDemand = instancias * USD_POR_INSTANCIA_MES;
  // se compromete el mínimo (lo que siempre está prendido); lo que escala por encima se paga on-demand
  const comprometidas = MINIMO_INSTANCIAS * USD_POR_INSTANCIA_MES * (1 - DESCUENTO_COMPROMISO);
  const extra = (instancias - MINIMO_INSTANCIAS) * USD_POR_INSTANCIA_MES;
  return [
    {
      id: "serverless",
      nombre: "Serverless",
      costo: millones * USD_POR_MILLON_SERVERLESS,
      detalle: "proporcional a las requests; cero si no hay tráfico",
    },
    {
      id: "on-demand",
      nombre: "Contenedores on-demand",
      costo: onDemand,
      detalle: `${instancias} instancias (mínimo ${MINIMO_INSTANCIAS} por alta disponibilidad)`,
    },
    {
      id: "compromiso",
      nombre: "Contenedores + compromiso anual",
      costo: comprometidas + extra,
      detalle: `base comprometida con ${Math.round(DESCUENTO_COMPROMISO * 100)}% de descuento, el resto on-demand`,
    },
  ];
}

// volumen a partir del cual el mínimo de contenedores sale más barato que serverless
export const EQUILIBRIO_MILLONES = (MINIMO_INSTANCIAS * USD_POR_INSTANCIA_MES) / USD_POR_MILLON_SERVERLESS;
