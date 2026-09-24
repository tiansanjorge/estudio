export interface ComponentePrompt {
  id: string;
  nombre: string;
  texto: string;
  // qué suele pasar cuando el prompt no lo incluye
  riesgoSiFalta: string;
}

export const TAREA_BASE = "Agregá paginación al listado de pedidos.";

export const COMPONENTES: ComponentePrompt[] = [
  {
    id: "contexto",
    nombre: "Contexto del proyecto",
    texto: "Stack: Next.js 16 con App Router, Prisma sobre Postgres. Los accesos a datos viven en lib/pedidos/repository.ts.",
    riesgoSiFalta: "Asume otro framework u ORM y genera código que no encaja con el proyecto.",
  },
  {
    id: "objetivo",
    nombre: "Objetivo concreto",
    texto: "El endpoint es GET /api/pedidos. Quiero paginación por cursor, 20 por página, ordenada por creado_el descendente.",
    riesgoSiFalta: "Elige offset, un tamaño arbitrario o pagina otro listado: resuelve un problema distinto al tuyo.",
  },
  {
    id: "restricciones",
    nombre: "Restricciones",
    texto: "No agregues dependencias. No cambies la firma de listarPedidos, que la usan otros módulos.",
    riesgoSiFalta: "Agrega una librería de paginación o rompe a los otros que llaman a la función.",
  },
  {
    id: "ejemplo",
    nombre: "Ejemplo del repo",
    texto: "Seguí la misma convención que GET /api/clientes (app/api/clientes/route.ts), que ya pagina con cursor.",
    riesgoSiFalta: "Inventa una convención nueva de parámetros y respuesta, distinta de la que ya usa el resto de la API.",
  },
  {
    id: "formato",
    nombre: "Formato de salida",
    texto: "Mostrame solo los cambios, archivo por archivo.",
    riesgoSiFalta: "Reescribe archivos completos y mezcla cambios que no pediste, difíciles de revisar.",
  },
  {
    id: "verificacion",
    nombre: "Criterios de verificación",
    texto: "Incluí tests para la primera página, la última, un listado vacío y un cursor inválido.",
    riesgoSiFalta: "No hay forma de saber si funciona en los bordes, justo donde falla la paginación.",
  },
  {
    id: "plan",
    nombre: "Plan antes del código",
    texto: "Antes de escribir código, proponé el plan y esperá mi confirmación.",
    riesgoSiFalta: "Si entendió mal la tarea, lo descubrís después de leer doscientas líneas.",
  },
];

export function armarPrompt(activos: string[]): { texto: string; riesgos: string[] } {
  const incluidos = COMPONENTES.filter((c) => activos.includes(c.id));
  const faltantes = COMPONENTES.filter((c) => !activos.includes(c.id));
  // el objetivo concreto reemplaza al pedido vago; si no está, queda el pedido original
  const encabezado = activos.includes("objetivo") ? [] : [TAREA_BASE];
  return {
    texto: [...encabezado, ...incluidos.map((c) => c.texto)].join("\n\n"),
    riesgos: faltantes.map((c) => c.riesgoSiFalta),
  };
}
