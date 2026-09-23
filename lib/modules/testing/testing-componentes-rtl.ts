export type Calidad = "recomendada" | "aceptable" | "ultimo-recurso";

export interface OpcionQuery {
  codigo: string;
  calidad: Calidad;
  nota: string;
}

export interface ElementoObjetivo {
  id: string;
  nombre: string;
  html: string;
  queries: OpcionQuery[];
}

export const ELEMENTOS: ElementoObjetivo[] = [
  {
    id: "email",
    nombre: "Input de email",
    html: `<label for="email">Email</label>
<input id="email" type="email" placeholder="vos@mail.com" class="input-lg" />`,
    queries: [
      {
        codigo: `screen.getByRole("textbox", { name: "Email" })`,
        calidad: "recomendada",
        nota: "Busca como una tecnología asistiva: rol + nombre accesible. Si el label se desconecta, el test falla, y eso es bueno.",
      },
      {
        codigo: `screen.getByLabelText("Email")`,
        calidad: "recomendada",
        nota: "Ideal para campos de formulario: así los encuentra un usuario.",
      },
      {
        codigo: `screen.getByPlaceholderText("vos@mail.com")`,
        calidad: "aceptable",
        nota: "Funciona, pero el placeholder no es un label: si solo lo encontrás así, el campo tiene un problema de accesibilidad.",
      },
      {
        codigo: `container.querySelector(".input-lg")`,
        calidad: "ultimo-recurso",
        nota: "Atado a una clase CSS: se rompe con un cambio de estilos y no verifica nada que el usuario perciba.",
      },
    ],
  },
  {
    id: "boton",
    nombre: "Botón de enviar",
    html: `<button type="submit" data-testid="btn-login">Ingresar</button>`,
    queries: [
      {
        codigo: `screen.getByRole("button", { name: "Ingresar" })`,
        calidad: "recomendada",
        nota: "La query por defecto para casi todo. Además verifica que sea un botón de verdad y que tenga nombre.",
      },
      {
        codigo: `screen.getByText("Ingresar")`,
        calidad: "aceptable",
        nota: "Encuentra el texto, pero no garantiza que sea un botón: pasaría igual con un <div>.",
      },
      {
        codigo: `screen.getByTestId("btn-login")`,
        calidad: "ultimo-recurso",
        nota: "Invisible para el usuario. Sirve cuando no hay otra forma (texto dinámico, contenedores sin rol).",
      },
    ],
  },
  {
    id: "error",
    nombre: "Mensaje de error",
    html: `<p role="alert">Email o contraseña incorrectos</p>`,
    queries: [
      {
        codigo: `await screen.findByRole("alert")`,
        calidad: "recomendada",
        nota: "El rol alert es lo que anuncia el lector de pantalla. findBy espera a que aparezca después del submit.",
      },
      {
        codigo: `await screen.findByText(/incorrectos/i)`,
        calidad: "aceptable",
        nota: "Válido para contenido no interactivo. Un regex hace al test más tolerante a cambios menores de redacción.",
      },
      {
        codigo: `container.querySelector(".error-msg")`,
        calidad: "ultimo-recurso",
        nota: "Además de frágil, es sincrónico: si el error aparece después de una respuesta, no lo va a encontrar.",
      },
    ],
  },
];

export interface Situacion {
  id: string;
  descripcion: string;
  variante: "getBy" | "queryBy" | "findBy";
  codigo: string;
  explicacion: string;
}

export const SITUACIONES: Situacion[] = [
  {
    id: "existe",
    descripcion: "El elemento está desde el primer render",
    variante: "getBy",
    codigo: `expect(screen.getByRole("heading", { name: "Ingresá" })).toBeInTheDocument();`,
    explicacion: "Sincrónico. Si no lo encuentra, lanza un error con el DOM impreso para diagnosticar.",
  },
  {
    id: "no-existe",
    descripcion: "Verificar que algo NO está",
    variante: "queryBy",
    codigo: `expect(screen.queryByRole("alert")).not.toBeInTheDocument();`,
    explicacion: "Devuelve null en vez de lanzar. Es la única variante que permite afirmar una ausencia.",
  },
  {
    id: "async",
    descripcion: "Aparece después de una respuesta de red o un timeout",
    variante: "findBy",
    codigo: `expect(await screen.findByText("Bienvenida, Ana")).toBeInTheDocument();`,
    explicacion:
      "Devuelve una Promise y reintenta hasta encontrarlo (1 s por defecto). Equivale a waitFor + getBy.",
  },
];
