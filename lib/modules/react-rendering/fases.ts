export type Fase = "trigger" | "render" | "reconciliation" | "commit";

export interface PasoFase {
  descripcion: string;
  faseActiva: Fase;
}

export const pasosFases: PasoFase[] = [
  {
    descripcion:
      "Algo dispara un render: cambia el estado de un componente (setState), le llegan props nuevas, o cambia un Context que consume.",
    faseActiva: "trigger",
  },
  {
    descripcion:
      "Arranca la fase de Render: React llama a la función del componente (y a las de sus hijos) de arriba hacia abajo, para averiguar qué debería mostrarse.",
    faseActiva: "render",
  },
  {
    descripcion:
      "Esa llamada produce una descripción de la UI — elementos React, no HTML real. Todavía no se tocó el DOM del navegador.",
    faseActiva: "render",
  },
  {
    descripcion:
      "React compara esa descripción nueva con la anterior para decidir qué cambió de verdad. Eso es Reconciliation — el próximo módulo.",
    faseActiva: "reconciliation",
  },
  {
    descripcion:
      "Recién ahora React aplica al DOM real solo los cambios que hacen falta. Eso es la fase de Commit — también el próximo módulo.",
    faseActiva: "commit",
  },
];
