export type Cambio = "codigo" | "dependencias" | "nada";

export const CAMBIOS: { id: Cambio; nombre: string }[] = [
  { id: "codigo", nombre: "Cambió un archivo de src/" },
  { id: "dependencias", nombre: "Cambió package.json" },
  { id: "nada", nombre: "No cambió nada" },
];

export interface Capa {
  instruccion: string;
  segundos: number;
  // qué cambios invalidan esta capa: sus archivos de entrada cambiaron
  invalidadaPor: Cambio[];
}

export interface VarianteDockerfile {
  id: string;
  nombre: string;
  capas: Capa[];
  tamanioMb: number;
  nota: string;
}

export const VARIANTES: VarianteDockerfile[] = [
  {
    id: "ingenuo",
    nombre: "Ingenuo",
    capas: [
      { instruccion: "FROM node:22", segundos: 0, invalidadaPor: [] },
      { instruccion: "WORKDIR /app", segundos: 0, invalidadaPor: [] },
      { instruccion: "COPY . .", segundos: 2, invalidadaPor: ["codigo", "dependencias"] },
      { instruccion: "RUN npm ci", segundos: 90, invalidadaPor: [] },
      { instruccion: "RUN npm run build", segundos: 40, invalidadaPor: [] },
      { instruccion: 'CMD ["npm", "start"]', segundos: 0, invalidadaPor: [] },
    ],
    tamanioMb: 1400,
    nota: "COPY . . va primero: cualquier cambio en el código invalida esa capa y todas las siguientes, incluida la instalación de dependencias.",
  },
  {
    id: "ordenado",
    nombre: "Ordenado",
    capas: [
      { instruccion: "FROM node:22-slim", segundos: 0, invalidadaPor: [] },
      { instruccion: "WORKDIR /app", segundos: 0, invalidadaPor: [] },
      { instruccion: "COPY package.json package-lock.json ./", segundos: 1, invalidadaPor: ["dependencias"] },
      { instruccion: "RUN npm ci", segundos: 90, invalidadaPor: [] },
      { instruccion: "COPY . .", segundos: 2, invalidadaPor: ["codigo"] },
      { instruccion: "RUN npm run build", segundos: 40, invalidadaPor: [] },
      { instruccion: 'CMD ["npm", "start"]', segundos: 0, invalidadaPor: [] },
    ],
    tamanioMb: 750,
    nota: "Lo que cambia poco (dependencias) va antes que lo que cambia siempre (código): un cambio en src/ reutiliza la capa de npm ci.",
  },
  {
    id: "multi-stage",
    nombre: "Multi-stage",
    capas: [
      { instruccion: "FROM node:22-slim AS build", segundos: 0, invalidadaPor: [] },
      { instruccion: "COPY package.json package-lock.json ./", segundos: 1, invalidadaPor: ["dependencias"] },
      { instruccion: "RUN npm ci", segundos: 90, invalidadaPor: [] },
      { instruccion: "COPY . .", segundos: 2, invalidadaPor: ["codigo"] },
      { instruccion: "RUN npm run build && npm prune --omit=dev", segundos: 45, invalidadaPor: [] },
      { instruccion: "FROM node:22-slim", segundos: 0, invalidadaPor: [] },
      { instruccion: "COPY --from=build /app/node_modules ./node_modules", segundos: 2, invalidadaPor: [] },
      { instruccion: "COPY --from=build /app/dist ./dist", segundos: 1, invalidadaPor: [] },
      { instruccion: "USER node", segundos: 0, invalidadaPor: [] },
      { instruccion: 'CMD ["node", "dist/server.js"]', segundos: 0, invalidadaPor: [] },
    ],
    tamanioMb: 260,
    nota: "La etapa de build tiene compiladores, devDependencies y el código fuente; la imagen final copia solo el resultado y las dependencias de producción, y corre sin root.",
  },
];

export interface CapaEjecutada extends Capa {
  cacheada: boolean;
}

// Docker reutiliza una capa si ella y todas las anteriores no cambiaron;
// la primera capa invalidada rompe la cadena y todo lo que sigue se reconstruye
export function construir(variante: VarianteDockerfile, cambio: Cambio): { capas: CapaEjecutada[]; segundos: number } {
  let invalidada = false;
  const capas = variante.capas.map((capa) => {
    // en multi-stage, la etapa final depende de lo que produjo la de build
    if (capa.instruccion.startsWith("COPY --from") && invalidada) return { ...capa, cacheada: false };
    if (capa.instruccion.startsWith("FROM") && capa.instruccion !== variante.capas[0].instruccion) {
      return { ...capa, cacheada: true };
    }
    invalidada = invalidada || capa.invalidadaPor.includes(cambio);
    return { ...capa, cacheada: !invalidada };
  });
  const segundos = capas.filter((c) => !c.cacheada).reduce((total, c) => total + c.segundos, 0);
  return { capas, segundos };
}
