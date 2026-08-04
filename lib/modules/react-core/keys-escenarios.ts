export interface FilaLista {
  key: string;
  texto: string;
  marcada: boolean;
}

export interface PasoKeys {
  descripcion: string;
  filas: FilaLista[];
}

export interface EscenarioKeys {
  slug: string;
  titulo: string;
  pasos: PasoKeys[];
}

export const escenariosKeys: EscenarioKeys[] = [
  {
    slug: "indice",
    titulo: "key = índice (bug)",
    pasos: [
      {
        descripcion: "Lista inicial con key = índice del array. Marcás 'Lavar los platos' (posición 0) como hecha.",
        filas: [
          { key: "0", texto: "Lavar los platos", marcada: true },
          { key: "1", texto: "Pagar la luz", marcada: false },
          { key: "2", texto: "Llamar al dentista", marcada: false },
        ],
      },
      {
        descripcion:
          "Se agrega una tarea nueva AL PRINCIPIO. React compara por key: en la posición key='0' había una instancia con marcada=true. La tarea nueva también tiene key='0' — React REUTILIZA esa instancia y hereda el checkbox marcado, aunque el texto sea otro. 'Lavar los platos' pasó a key='1' y perdió su estado.",
        filas: [
          { key: "0", texto: "Nueva tarea", marcada: true },
          { key: "1", texto: "Lavar los platos", marcada: false },
          { key: "2", texto: "Pagar la luz", marcada: false },
          { key: "3", texto: "Llamar al dentista", marcada: false },
        ],
      },
    ],
  },
  {
    slug: "id-estable",
    titulo: "key = id estable (correcto)",
    pasos: [
      {
        descripcion: "Misma lista, pero con un id propio de cada tarea como key. Marcás 'Lavar los platos' (id=1) como hecha.",
        filas: [
          { key: "1", texto: "Lavar los platos", marcada: true },
          { key: "2", texto: "Pagar la luz", marcada: false },
          { key: "3", texto: "Llamar al dentista", marcada: false },
        ],
      },
      {
        descripcion:
          "Se agrega una tarea nueva al principio, con un id NUEVO (key='4'), distinto a los existentes. React no confunde nada: cada instancia sigue ligada a su tarea real, sin importar en qué posición del array quedó.",
        filas: [
          { key: "4", texto: "Nueva tarea", marcada: false },
          { key: "1", texto: "Lavar los platos", marcada: true },
          { key: "2", texto: "Pagar la luz", marcada: false },
          { key: "3", texto: "Llamar al dentista", marcada: false },
        ],
      },
    ],
  },
];
