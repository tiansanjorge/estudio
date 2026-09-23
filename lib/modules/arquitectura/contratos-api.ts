export const CONTRATO_BASE = `paths:
  /pedidos/{id}:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Pedido"
  /pedidos:
    post:
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [productoId, cantidad]
              properties:
                productoId: { type: string }
                cantidad: { type: integer, minimum: 1 }
                nota: { type: string }
components:
  schemas:
    Pedido:
      type: object
      required: [id, estado, total]
      properties:
        id: { type: string }
        estado: { type: string, enum: [pendiente, pagado, enviado] }
        total: { type: number }`;

export interface CambioContrato {
  id: string;
  descripcion: string;
  breaking: boolean;
  razon: string;
}

export const CAMBIOS: CambioContrato[] = [
  {
    id: "agregar-campo-respuesta",
    descripcion: "Agregar el campo opcional `fechaEntrega` a la respuesta de Pedido",
    breaking: false,
    razon: "Los clientes existentes ignoran los campos que no conocen.",
  },
  {
    id: "agregar-endpoint",
    descripcion: "Agregar el endpoint `GET /pedidos/{id}/tracking`",
    breaking: false,
    razon: "Nadie lo usa todavía; no afecta a lo existente.",
  },
  {
    id: "agregar-campo-opcional-request",
    descripcion: "Aceptar un campo opcional `cupon` en el POST",
    breaking: false,
    razon: "Los clientes que no lo mandan siguen funcionando igual.",
  },
  {
    id: "quitar-campo",
    descripcion: "Quitar `total` de la respuesta (ahora se calcula en el front)",
    breaking: true,
    razon: "Todo cliente que lee `total` recibe undefined.",
  },
  {
    id: "renombrar",
    descripcion: "Renombrar `estado` a `status`",
    breaking: true,
    razon: "Un renombre es quitar un campo y agregar otro: rompe a quien leía el viejo.",
  },
  {
    id: "requerido-request",
    descripcion: "Hacer obligatorio `nota` en el POST",
    breaking: true,
    razon: "Los clientes que no la mandaban empiezan a recibir 400.",
  },
  {
    id: "cambiar-tipo",
    descripcion: "Cambiar `total` de number a string con formato",
    breaking: true,
    razon: "El código cliente que suma o compara totales se rompe.",
  },
  {
    id: "enum-respuesta",
    descripcion: "Agregar el valor `cancelado` al enum `estado` de la respuesta",
    breaking: true,
    razon:
      "Parece inofensivo, pero un cliente con un switch exhaustivo o un tipo cerrado puede fallar ante un valor que no conoce. Es breaking para clientes estrictos.",
  },
];

export function evaluar(seleccionados: ReadonlySet<string>) {
  const elegidos = CAMBIOS.filter((c) => seleccionados.has(c.id));
  const rompe = elegidos.filter((c) => c.breaking);
  return {
    elegidos,
    rompe,
    recomendacion:
      elegidos.length === 0
        ? "Elegí uno o más cambios para evaluar el impacto."
        : rompe.length === 0
          ? "Todos los cambios son compatibles hacia atrás: se publican en la versión actual (minor)."
          : "Hay cambios incompatibles: hacen falta una versión nueva (v2 o una versión por fecha) o una estrategia expand/contract, con deprecación anunciada y un período de convivencia.",
  };
}
