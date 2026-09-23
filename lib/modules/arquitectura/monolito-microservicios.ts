export type ArquitecturaId = "monolito" | "microservicios" | "microfrontends";
export type Veredicto = "encaja" | "depende" | "no-encaja";

export const ARQUITECTURAS: { id: ArquitecturaId; nombre: string; resumen: string }[] = [
  {
    id: "monolito",
    nombre: "Monolito modular",
    resumen: "Una aplicación y un deploy, con módulos internos de límites claros.",
  },
  {
    id: "microservicios",
    nombre: "Microservicios",
    resumen: "Servicios independientes con su propia base, que se comunican por red.",
  },
  {
    id: "microfrontends",
    nombre: "Microfrontends",
    resumen: "El frontend dividido en partes que despliegan equipos distintos.",
  },
];

export interface Evaluacion {
  veredicto: Veredicto;
  detalle: string[];
}

export interface Escenario {
  id: string;
  titulo: string;
  contexto: string;
  evaluaciones: Record<ArquitecturaId, Evaluacion>;
}

export const ESCENARIOS: Escenario[] = [
  {
    id: "startup",
    titulo: "Startup de 4 devs buscando product-market fit",
    contexto: "El producto cambia todas las semanas y no está claro qué módulos van a existir.",
    evaluaciones: {
      monolito: {
        veredicto: "encaja",
        detalle: [
          "Un repo, un deploy, una base: máxima velocidad.",
          "Refactorizar entre módulos es un cambio de código, no una migración entre servicios.",
        ],
      },
      microservicios: {
        veredicto: "no-encaja",
        detalle: [
          "Red, observabilidad distribuida, datos repartidos y varios pipelines para 4 personas.",
          "Los límites entre servicios se definen antes de entender el dominio y después cuesta moverlos.",
        ],
      },
      microfrontends: {
        veredicto: "no-encaja",
        detalle: ["Resuelve un problema de coordinación entre equipos que todavía no existe."],
      },
    },
  },
  {
    id: "cambio",
    titulo: "Agregar el CUIT del cliente y mostrarlo en las facturas",
    contexto: "Un cambio que cruza dos áreas del negocio: clientes y facturación.",
    evaluaciones: {
      monolito: {
        veredicto: "encaja",
        detalle: ["Un PR, una migración, un deploy.", "El compilador encuentra todos los usos del tipo Cliente."],
      },
      microservicios: {
        veredicto: "depende",
        detalle: [
          "Cambio en el servicio de Clientes y en su contrato o evento, compatible hacia atrás.",
          "Facturación actualiza su consumidor; deploys en orden y dos equipos coordinados.",
        ],
      },
      microfrontends: {
        veredicto: "depende",
        detalle: [
          "Se tocan el formulario de Clientes y la vista de Facturación, de equipos distintos.",
          "Si comparten tipos o componentes, hay que versionar esa librería común.",
        ],
      },
    },
  },
  {
    id: "pico",
    titulo: "Black Friday: el checkout recibe 20 veces más tráfico",
    contexto: "El resto del sitio tiene tráfico normal.",
    evaluaciones: {
      monolito: {
        veredicto: "depende",
        detalle: [
          "Se escala la aplicación entera, aunque solo el checkout lo necesite.",
          "Un problema en otro módulo (un reporte pesado) puede degradar el checkout.",
        ],
      },
      microservicios: {
        veredicto: "encaja",
        detalle: [
          "Se escala solo el servicio de checkout.",
          "Aislamiento de fallas: si recomendaciones se cae, se puede comprar igual (con timeouts y circuit breakers).",
        ],
      },
      microfrontends: {
        veredicto: "depende",
        detalle: [
          "No cambia la escalabilidad del backend.",
          "Sí permite que el equipo de checkout despliegue un fix sin esperar al resto del frontend.",
        ],
      },
    },
  },
  {
    id: "equipos",
    titulo: "8 equipos trabajando sobre el mismo producto",
    contexto: "Cada equipo es dueño de un área (catálogo, checkout, cuenta, backoffice...).",
    evaluaciones: {
      monolito: {
        veredicto: "depende",
        detalle: [
          "Conflictos de merge, un CI lento y un deploy compartido que coordina a todos.",
          "Un monolito modular con ownership por módulo y límites verificados aguanta más de lo que parece.",
        ],
      },
      microservicios: {
        veredicto: "encaja",
        detalle: [
          "Cada equipo despliega su servicio a su ritmo (ley de Conway a favor).",
          "Exige una plataforma compartida: CI/CD, observabilidad, contratos entre servicios.",
        ],
      },
      microfrontends: {
        veredicto: "encaja",
        detalle: [
          "Cada equipo es dueño de su parte de la UI de punta a punta, con deploy propio.",
          "Riesgos: inconsistencia visual, dependencias duplicadas en el bundle y performance.",
        ],
      },
    },
  },
];
