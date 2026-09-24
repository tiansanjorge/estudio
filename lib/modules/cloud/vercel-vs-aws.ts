export type Lado = "plataforma" | "aws";

export interface Requisito {
  id: string;
  etiqueta: string;
  lado: Lado;
  peso: number;
  razon: string;
}

export const REQUISITOS: Requisito[] = [
  {
    id: "sin-infra",
    etiqueta: "El equipo no tiene a nadie dedicado a infraestructura",
    lado: "plataforma",
    peso: 2,
    razon: "Una plataforma resuelve deploys, CDN, TLS y escalado sin que nadie los opere.",
  },
  {
    id: "nextjs",
    etiqueta: "El frontend es Next.js (o un framework con integración de primera)",
    lado: "plataforma",
    peso: 2,
    razon: "Las plataformas con integración directa traen ISR, imágenes y caché configurados sin trabajo extra.",
  },
  {
    id: "previews",
    etiqueta: "Previews por PR son parte del flujo de review",
    lado: "plataforma",
    peso: 1,
    razon: "Un entorno por PR viene incluido, sin armar infraestructura efímera.",
  },
  {
    id: "websockets",
    etiqueta: "Conexiones persistentes propias (WebSockets de larga vida)",
    lado: "aws",
    peso: 2,
    razon: "Las funciones de estas plataformas no están pensadas para conexiones persistentes: hace falta un servicio de tiempo real externo o contenedores propios.",
  },
  {
    id: "workers",
    etiqueta: "Workers permanentes o jobs largos",
    lado: "aws",
    peso: 2,
    razon: "Procesos que corren todo el tiempo o por muchos minutos encajan en contenedores, no en funciones con límite de duración.",
  },
  {
    id: "red-privada",
    etiqueta: "Base en red privada o requisitos de compliance estrictos",
    lado: "aws",
    peso: 2,
    razon: "Controlar la red (VPC, subredes privadas, auditoría) es natural en AWS; en una plataforma suele requerir planes empresariales.",
  },
  {
    id: "trafico-alto",
    etiqueta: "Tráfico alto y estable, con mucho ancho de banda",
    lado: "aws",
    peso: 1,
    razon: "A gran volumen, el precio por uso de la plataforma suele superar al de la infraestructura propia bien aprovechada.",
  },
];

export interface Recomendacion {
  titulo: string;
  resumen: string;
  razones: string[];
}

export function recomendar(activos: string[]): Recomendacion {
  const elegidos = REQUISITOS.filter((r) => activos.includes(r.id));
  const puntaje = (lado: Lado) => elegidos.filter((r) => r.lado === lado).reduce((s, r) => s + r.peso, 0);
  const plataforma = puntaje("plataforma");
  const aws = puntaje("aws");
  const razones = elegidos.map((r) => r.razon);

  if (elegidos.length === 0) {
    return {
      titulo: "Marcá los requisitos del proyecto",
      resumen: "Sin requisitos fuertes, lo más simple suele ser una plataforma: se cambia después si hace falta.",
      razones: [],
    };
  }
  if (plataforma >= 2 && aws >= 2) {
    return {
      titulo: "Híbrido: frontend en la plataforma, backend en AWS",
      resumen:
        "El frontend aprovecha la experiencia de la plataforma y lo que no encaja ahí (tiempo real, workers, datos privados) vive en AWS. Ojo con poner las funciones en la misma región que la base.",
      razones,
    };
  }
  if (aws > plataforma) {
    return {
      titulo: "AWS (contenedores, Lambda y servicios gestionados)",
      resumen: "Los requisitos piden control de red, procesos largos o costo a escala: vale la pena operar la infraestructura.",
      razones,
    };
  }
  return {
    titulo: "Vercel / Netlify",
    resumen: "La experiencia de desarrollo y la operación cero pesan más que el control fino de la infraestructura.",
    razones,
  };
}
