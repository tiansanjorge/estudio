export type EstadoModulo = "disponible" | "proximamente";

export interface Modulo {
  slug: string;
  titulo: string;
  estado: EstadoModulo;
}

export interface Categoria {
  slug: string;
  titulo: string;
  modulos: Modulo[];
}
