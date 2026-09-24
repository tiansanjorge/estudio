export type Algoritmo = "round-robin" | "aleatorio" | "least-connections" | "hash-usuario";

export const ALGORITMOS: { id: Algoritmo; nombre: string; descripcion: string }[] = [
  { id: "round-robin", nombre: "Round-robin", descripcion: "uno para cada servidor, en orden" },
  { id: "aleatorio", nombre: "Aleatorio", descripcion: "un servidor al azar por request" },
  { id: "least-connections", nombre: "Least connections", descripcion: "el servidor con menos requests activas" },
  { id: "hash-usuario", nombre: "Hash por usuario", descripcion: "cada usuario siempre al mismo servidor (sticky)" },
];

export const SERVIDORES = 4;
// requests simultáneas que un servidor atiende bien; por encima, se degrada
export const CAPACIDAD = 3;

export interface Request {
  llegada: number;
  duracion: number;
  usuario: string;
}

// dos requests por segundo; una de cada 4 es pesada (un reporte) y un usuario grande genera el 40% del tráfico
export const REQUESTS: Request[] = Array.from({ length: 32 }, (_, i) => ({
  llegada: Math.floor(i / 2),
  duracion: i % 4 === 3 ? 8 : 2,
  usuario: i % 5 === 0 || i % 5 === 2 ? "cliente-grande" : `usuario-${i}`,
}));

function hash(texto: string): number {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

// pseudoaleatorio determinista (FNV-1a), para que el resultado no cambie en cada render
function aleatorio(i: number): number {
  let h = 0x811c9dc5;
  for (const c of `request-${i}`) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  return h % SERVIDORES;
}

export interface ResultadoServidor {
  requests: number;
  trabajo: number;
  maxSimultaneas: number;
}

export function balancear(algoritmo: Algoritmo): ResultadoServidor[] {
  const asignadas: Request[][] = Array.from({ length: SERVIDORES }, () => []);
  const activas = (s: number, t: number) => asignadas[s].filter((r) => r.llegada <= t && t < r.llegada + r.duracion).length;

  REQUESTS.forEach((req, i) => {
    let destino: number;
    switch (algoritmo) {
      case "round-robin":
        destino = i % SERVIDORES;
        break;
      case "aleatorio":
        destino = aleatorio(i);
        break;
      case "least-connections": {
        const cargas = Array.from({ length: SERVIDORES }, (_, s) => activas(s, req.llegada));
        destino = cargas.indexOf(Math.min(...cargas));
        break;
      }
      case "hash-usuario":
        destino = hash(req.usuario) % SERVIDORES;
        break;
    }
    asignadas[destino].push(req);
  });

  const fin = Math.max(...REQUESTS.map((r) => r.llegada + r.duracion));
  return asignadas.map((lista, s) => ({
    requests: lista.length,
    trabajo: lista.reduce((total, r) => total + r.duracion, 0),
    maxSimultaneas: Math.max(0, ...Array.from({ length: fin }, (_, t) => activas(s, t))),
  }));
}
