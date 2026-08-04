export interface DirectivaCache {
  directiva: string;
  descripcion: string;
  ejemplo: string;
}

export const directivasCache: DirectivaCache[] = [
  {
    directiva: "no-store",
    descripcion: "Nunca guarda nada en caché. Cada petición va sí o sí al servidor.",
    ejemplo: "Cache-Control: no-store",
  },
  {
    directiva: "no-cache",
    descripcion:
      "A pesar del nombre, sí guarda la respuesta — pero revalida con el servidor antes de usarla cada vez.",
    ejemplo: "Cache-Control: no-cache",
  },
  {
    directiva: "max-age",
    descripcion:
      "Usa la copia cacheada sin preguntarle nada al servidor durante N segundos.",
    ejemplo: "Cache-Control: max-age=3600",
  },
  {
    directiva: "must-revalidate",
    descripcion:
      "Una vez que max-age vence, prohíbe servir una copia vieja aunque el servidor no responda: hay que revalidar sí o sí.",
    ejemplo: "Cache-Control: max-age=3600, must-revalidate",
  },
  {
    directiva: "private / public",
    descripcion:
      "private: solo el navegador del usuario puede guardar la copia. public: también CDNs y proxies intermedios pueden cachearla.",
    ejemplo: "Cache-Control: private, max-age=0",
  },
  {
    directiva: "stale-while-revalidate",
    descripcion:
      "Sirve la copia vieja inmediatamente mientras revalida en segundo plano, sin hacer esperar al usuario.",
    ejemplo: "Cache-Control: max-age=60, stale-while-revalidate=86400",
  },
];
