export interface MetodoHttp {
  metodo: string;
  descripcion: string;
  idempotente: boolean;
  seguro: boolean;
  cuerpoEnRequest: boolean;
  ejemplo: string;
}

export const metodosHttp: MetodoHttp[] = [
  {
    metodo: "GET",
    descripcion: "Obtiene un recurso sin modificar nada en el servidor.",
    idempotente: true,
    seguro: true,
    cuerpoEnRequest: false,
    ejemplo: "GET /usuarios/42",
  },
  {
    metodo: "POST",
    descripcion:
      "Crea un recurso nuevo o dispara una acción con efectos secundarios (ej: enviar un mail).",
    idempotente: false,
    seguro: false,
    cuerpoEnRequest: true,
    ejemplo: 'POST /usuarios\n{ "nombre": "Ana" }',
  },
  {
    metodo: "PUT",
    descripcion:
      "Reemplaza un recurso completo. Llamarlo varias veces con los mismos datos da siempre el mismo resultado.",
    idempotente: true,
    seguro: false,
    cuerpoEnRequest: true,
    ejemplo: 'PUT /usuarios/42\n{ "nombre": "Ana", "email": "ana@mail.com" }',
  },
  {
    metodo: "PATCH",
    descripcion: "Modifica parcialmente un recurso, sin reemplazarlo entero.",
    idempotente: false,
    seguro: false,
    cuerpoEnRequest: true,
    ejemplo: 'PATCH /usuarios/42\n{ "email": "nueva@mail.com" }',
  },
  {
    metodo: "DELETE",
    descripcion: "Elimina un recurso. Repetirlo no cambia el resultado: ya estaba borrado.",
    idempotente: true,
    seguro: false,
    cuerpoEnRequest: false,
    ejemplo: "DELETE /usuarios/42",
  },
  {
    metodo: "HEAD",
    descripcion:
      "Como GET pero sin body en la respuesta: solo headers. Sirve para chequear existencia o metadata sin bajar todo el recurso.",
    idempotente: true,
    seguro: true,
    cuerpoEnRequest: false,
    ejemplo: "HEAD /archivos/reporte.pdf",
  },
  {
    metodo: "OPTIONS",
    descripcion:
      "Pregunta qué métodos y headers soporta un endpoint. Es lo que el navegador dispara automáticamente como preflight de CORS.",
    idempotente: true,
    seguro: true,
    cuerpoEnRequest: false,
    ejemplo: "OPTIONS /usuarios/42",
  },
];
