export const PREGUNTA_ENTREVISTADOR = "¿Usás IA para programar? ¿Cómo?";

export type Senal = "criterio" | "proceso" | "verificacion" | "responsabilidad" | "ejemplo" | "riesgos";

export const SENALES: { id: Senal; nombre: string }[] = [
  { id: "criterio", nombre: "Criterio sobre cuándo usarla" },
  { id: "proceso", nombre: "Un proceso concreto" },
  { id: "verificacion", nombre: "Cómo verificás" },
  { id: "responsabilidad", nombre: "Responsabilidad sobre el resultado" },
  { id: "ejemplo", nombre: "Un ejemplo real" },
  { id: "riesgos", nombre: "Cuidado con datos y seguridad" },
];

export interface Fragmento {
  id: string;
  texto: string;
  // null = fragmento débil que resta en vez de sumar
  senal: Senal | null;
  feedback: string;
}

export const FRAGMENTOS: Fragmento[] = [
  {
    id: "patrones",
    texto: "La uso sobre todo para tareas con patrones claros: tests, componentes que siguen las convenciones del repo, scripts y refactors mecánicos.",
    senal: "criterio",
    feedback: "Muestra que sabés dónde rinde y dónde no.",
  },
  {
    id: "sparring",
    texto: "Para decisiones de arquitectura la uso como sparring para contrastar opciones, pero la decisión y el porqué son míos.",
    senal: "responsabilidad",
    feedback: "Separa bien usar la herramienta de delegarle el criterio.",
  },
  {
    id: "contexto",
    texto: "Antes de pedir código le doy contexto: el stack, las convenciones y un archivo de ejemplo; en tareas grandes pido primero un plan y lo reviso.",
    senal: "proceso",
    feedback: "Un proceso concreto y replicable, no 'le pido cosas'.",
  },
  {
    id: "verifico",
    texto: "Todo lo que genera pasa por typecheck, tests y mi revisión línea por línea: no mergeo nada que no pueda explicar.",
    senal: "verificacion",
    feedback: "Es la señal que más tranquiliza a quien entrevista.",
  },
  {
    id: "caso",
    texto: "Por ejemplo, migré 30 endpoints a un cliente HTTP nuevo: la IA hizo la parte mecánica y yo escribí los tests de los casos borde, que encontraron dos bugs.",
    senal: "ejemplo",
    feedback: "Un caso real con resultado vale más que cualquier afirmación general.",
  },
  {
    id: "datos",
    texto: "No comparto secretos ni datos de clientes, y uso las herramientas que aprobó la empresa.",
    senal: "riesgos",
    feedback: "Muestra conciencia de privacidad y seguridad sin que te lo pregunten.",
  },
  {
    id: "todo",
    texto: "La uso para todo, me hace el 90% del código.",
    senal: null,
    feedback: "Suena a que no hay criterio ni revisión: la pregunta siguiente va a ser '¿y cómo sabés que está bien?'.",
  },
  {
    id: "funciona",
    texto: "Le pido lo que necesito y, si funciona, lo subo.",
    senal: null,
    feedback: "'Si funciona' no es verificación: es la frase que más preocupa a un equipo.",
  },
  {
    id: "senior",
    texto: "Es como tener un senior al lado, sabe más que yo.",
    senal: null,
    feedback: "Transmite que delegás el criterio en vez de ejercerlo.",
  },
  {
    id: "herramientas",
    texto: "Uso ChatGPT, Copilot, Cursor, Claude y varias más.",
    senal: null,
    feedback: "Una lista de herramientas no dice nada de tu método; lo que importa es cómo las usás.",
  },
  {
    id: "nunca",
    texto: "No la uso: prefiero escribir todo yo para no perder práctica.",
    senal: null,
    feedback: "Es válido si lo justificás, pero dicho así suena a no evaluar la herramienta. Mejor: contar dónde sí y dónde no, y por qué.",
  },
];

export interface Evaluacion {
  cubiertas: Senal[];
  faltantes: Senal[];
  debiles: Fragmento[];
}

export function evaluar(elegidos: string[]): Evaluacion {
  const seleccion = FRAGMENTOS.filter((f) => elegidos.includes(f.id));
  const cubiertas = SENALES.map((s) => s.id).filter((s) => seleccion.some((f) => f.senal === s));
  return {
    cubiertas,
    faltantes: SENALES.map((s) => s.id).filter((s) => !cubiertas.includes(s)),
    debiles: seleccion.filter((f) => f.senal === null),
  };
}
