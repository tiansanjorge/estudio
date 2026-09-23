export type VarianteBotonId =
  | "button-nativo"
  | "div-onclick"
  | "div-role"
  | "div-role-completo"
  | "icono-sin-nombre"
  | "icono-aria-label";

export interface VarianteBoton {
  id: VarianteBotonId;
  etiqueta: string;
  codigo: string;
  /** Lo que el navegador expone en el árbol de accesibilidad. */
  rol: string;
  nombreAccesible: string | null;
  enfocableConTab: boolean;
  activableConTeclado: boolean;
  /** Lo que anunciaría un lector de pantalla al llegar al elemento. */
  anuncio: string;
  leccion: string;
}

export const VARIANTES_BOTON: VarianteBoton[] = [
  {
    id: "button-nativo",
    etiqueta: "<button>",
    codigo: `<button onClick={guardar}>Guardar</button>`,
    rol: "button",
    nombreAccesible: "Guardar",
    enfocableConTab: true,
    activableConTeclado: true,
    anuncio: "“Guardar, botón”",
    leccion:
      "El elemento nativo trae rol, foco, activación con Enter y Espacio, y estado disabled sin escribir nada extra.",
  },
  {
    id: "div-onclick",
    etiqueta: "<div onClick>",
    codigo: `<div onClick={guardar}>Guardar</div>`,
    rol: "generic",
    nombreAccesible: null,
    enfocableConTab: false,
    activableConTeclado: false,
    anuncio: "“Guardar” (como texto, sin indicar que es interactivo)",
    leccion:
      "Visualmente es igual, pero para el teclado y el lector de pantalla no existe como control: solo funciona con mouse.",
  },
  {
    id: "div-role",
    etiqueta: '<div role="button">',
    codigo: `<div role="button" onClick={guardar}>Guardar</div>`,
    rol: "button",
    nombreAccesible: "Guardar",
    enfocableConTab: false,
    activableConTeclado: false,
    anuncio: "“Guardar, botón” (pero no se puede alcanzar con Tab)",
    leccion:
      "ARIA cambia lo que se ANUNCIA, no lo que el elemento HACE. El lector promete un botón que el teclado no puede usar.",
  },
  {
    id: "div-role-completo",
    etiqueta: '<div role="button" tabIndex onKeyDown>',
    codigo: `<div
  role="button"
  tabIndex={0}
  onClick={guardar}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      guardar();
    }
  }}
>
  Guardar
</div>`,
    rol: "button",
    nombreAccesible: "Guardar",
    enfocableConTab: true,
    activableConTeclado: true,
    anuncio: "“Guardar, botón”",
    leccion:
      "Funciona, pero reimplementaste a mano lo que <button> ya hacía (y todavía falta disabled, submit en forms, etc.).",
  },
  {
    id: "icono-sin-nombre",
    etiqueta: "<button> solo con ícono",
    codigo: `<button onClick={eliminar}>
  <IconoPapelera />
</button>`,
    rol: "button",
    nombreAccesible: null,
    enfocableConTab: true,
    activableConTeclado: true,
    anuncio: "“Botón” (sin decir qué hace)",
    leccion:
      "El control es operable, pero no tiene nombre accesible: el usuario no sabe qué va a pasar si lo activa.",
  },
  {
    id: "icono-aria-label",
    etiqueta: "<button aria-label>",
    codigo: `<button onClick={eliminar} aria-label="Eliminar">
  <IconoPapelera aria-hidden="true" />
</button>`,
    rol: "button",
    nombreAccesible: "Eliminar",
    enfocableConTab: true,
    activableConTeclado: true,
    anuncio: "“Eliminar, botón”",
    leccion:
      "aria-label da el nombre accesible y aria-hidden saca el SVG decorativo del árbol. Es el caso legítimo de ARIA: completar lo que el HTML no puede expresar.",
  },
];
