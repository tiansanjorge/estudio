export type Decision = "delegar" | "verificar" | "liderar";

export const DECISIONES: { id: Decision; nombre: string }[] = [
  { id: "delegar", nombre: "Delegar" },
  { id: "verificar", nombre: "Delegar con verificación fuerte" },
  { id: "liderar", nombre: "Liderarlo uno, IA de apoyo" },
];

export interface Tarea {
  id: string;
  descripcion: string;
  costoError: "bajo" | "alto";
  verificable: "facil" | "dificil";
  recomendada: Decision;
  razon: string;
}

export const TAREAS: Tarea[] = [
  {
    id: "tests-funcion",
    descripcion: "Tests unitarios para una función pura que ya existe",
    costoError: "bajo",
    verificable: "facil",
    recomendada: "delegar",
    razon: "Un error se ve enseguida al correrlos o leerlos, y no toca producción. Igual hay que revisar que prueben comportamiento y no el mock.",
  },
  {
    id: "script-unico",
    descripcion: "Script de un solo uso para renombrar archivos en una carpeta local",
    costoError: "bajo",
    verificable: "facil",
    recomendada: "delegar",
    razon: "Se prueba sobre una copia en segundos y el daño posible es acotado.",
  },
  {
    id: "componente-ui",
    descripcion: "Un componente de formulario siguiendo el sistema de diseño",
    costoError: "bajo",
    verificable: "facil",
    recomendada: "delegar",
    razon: "Se verifica mirándolo y con los tests de accesibilidad; seguir un patrón existente es donde la IA rinde más.",
  },
  {
    id: "refactor-renombre",
    descripcion: "Renombrar una función usada en 40 archivos",
    costoError: "alto",
    verificable: "facil",
    recomendada: "verificar",
    razon: "Un error rompe muchas partes, pero el typecheck y los tests lo detectan de forma confiable: delegable si esa red existe.",
  },
  {
    id: "impuestos",
    descripcion: "Algoritmo de cálculo de impuestos de una factura",
    costoError: "alto",
    verificable: "facil",
    recomendada: "verificar",
    razon: "Un error cuesta plata y problemas legales, pero es verificable con casos conocidos: escribir uno mismo los tests con valores reales y dejar que la implementación los pase.",
  },
  {
    id: "query-reporte",
    descripcion: "Optimizar la consulta lenta de un reporte interno",
    costoError: "bajo",
    verificable: "dificil",
    recomendada: "verificar",
    razon: "Si sale mal, un reporte interno tarda o falla, sin daño serio. Pero la mejora solo se confirma con EXPLAIN ANALYZE sobre datos del tamaño real: en desarrollo cualquier consulta es rápida.",
  },
  {
    id: "permisos",
    descripcion: "La lógica de autorización de quién puede ver qué datos",
    costoError: "alto",
    verificable: "dificil",
    recomendada: "liderar",
    razon: "Un error es una filtración de datos, y los tests solo cubren los casos que se te ocurrieron. Hay que entender cada regla; la IA sirve para buscar huecos, no para decidir.",
  },
  {
    id: "migracion",
    descripcion: "Migración que transforma y borra columnas de una tabla de producción",
    costoError: "alto",
    verificable: "dificil",
    recomendada: "liderar",
    razon: "Es irreversible y su comportamiento con los datos reales no se ve en desarrollo. El plan, el orden y el rollback se deciden uno; la IA puede ayudar a escribir el SQL y a revisar riesgos.",
  },
  {
    id: "arquitectura",
    descripcion: "La arquitectura de un servicio nuevo que va a usar todo el equipo",
    costoError: "alto",
    verificable: "dificil",
    recomendada: "liderar",
    razon: "Las consecuencias aparecen en meses y dependen de contexto que no está en el código: equipo, negocio, restricciones. La IA es un buen sparring para contrastar opciones, no quien decide.",
  },
];

// el cuadrante define la decisión: el costo del error y cuánto cuesta detectarlo
export const CUADRANTES: { costoError: Tarea["costoError"]; verificable: Tarea["verificable"]; titulo: string }[] = [
  { costoError: "bajo", verificable: "facil", titulo: "Error barato, fácil de ver" },
  { costoError: "alto", verificable: "facil", titulo: "Error caro, fácil de ver" },
  { costoError: "bajo", verificable: "dificil", titulo: "Error barato, difícil de ver" },
  { costoError: "alto", verificable: "dificil", titulo: "Error caro, difícil de ver" },
];
