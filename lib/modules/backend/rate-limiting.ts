export const LIMITE = 5;
export const VENTANA_S = 10;
/** Token bucket: capacidad = LIMITE, recarga LIMITE / VENTANA_S tokens por segundo. */
const RECARGA_POR_S = LIMITE / VENTANA_S;

export type AlgoritmoId = "ventana-fija" | "ventana-deslizante" | "token-bucket";

export const ALGORITMOS: { id: AlgoritmoId; nombre: string; descripcion: string }[] = [
  {
    id: "ventana-fija",
    nombre: "Ventana fija",
    descripcion: "Cuenta requests por bloque de 10 s (0-10, 10-20...). Simple y barato, pero en el borde de dos ventanas permite el doble.",
  },
  {
    id: "ventana-deslizante",
    nombre: "Ventana deslizante",
    descripcion: "Mira los últimos 10 s desde cada request. Preciso, a costa de guardar timestamps (o aproximarlos con dos contadores).",
  },
  {
    id: "token-bucket",
    nombre: "Token bucket",
    descripcion: "Un balde de 5 fichas que se recarga de a 0,5 por segundo. Permite ráfagas cortas y limita el promedio.",
  },
];

export const PATRONES: { id: string; nombre: string; tiempos: number[] }[] = [
  {
    id: "borde",
    nombre: "Ráfaga en el borde de la ventana",
    tiempos: [9.2, 9.4, 9.5, 9.7, 9.9, 10.1, 10.2, 10.4, 10.6, 10.8],
  },
  {
    id: "constante",
    nombre: "Tráfico constante (1 por segundo)",
    tiempos: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: "rafaga",
    nombre: "Ráfaga inicial y después calma",
    tiempos: [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2, 4, 8, 12],
  },
];

function ventanaFija(tiempos: number[]): boolean[] {
  const contadores = new Map<number, number>();
  return tiempos.map((t) => {
    const ventana = Math.floor(t / VENTANA_S);
    const usados = contadores.get(ventana) ?? 0;
    if (usados >= LIMITE) return false;
    contadores.set(ventana, usados + 1);
    return true;
  });
}

function ventanaDeslizante(tiempos: number[]): boolean[] {
  const aceptados: number[] = [];
  return tiempos.map((t) => {
    const recientes = aceptados.filter((a) => a > t - VENTANA_S);
    if (recientes.length >= LIMITE) return false;
    aceptados.push(t);
    return true;
  });
}

function tokenBucket(tiempos: number[]): boolean[] {
  let fichas = LIMITE;
  let ultimo = tiempos[0] ?? 0;
  return tiempos.map((t) => {
    fichas = Math.min(LIMITE, fichas + (t - ultimo) * RECARGA_POR_S);
    ultimo = t;
    if (fichas < 1) return false;
    fichas -= 1;
    return true;
  });
}

export function aplicar(algoritmo: AlgoritmoId, tiempos: number[]): boolean[] {
  switch (algoritmo) {
    case "ventana-fija":
      return ventanaFija(tiempos);
    case "ventana-deslizante":
      return ventanaDeslizante(tiempos);
    case "token-bucket":
      return tokenBucket(tiempos);
  }
}
