import type { PreguntaEntrevista } from "../types";

export const entrevistaValidacionZod: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "Si ya uso TypeScript, ¿por qué hace falta validar los datos en runtime?",
    respuestaEs:
      "Porque los tipos de TypeScript desaparecen al compilar: son una verificación en tiempo de desarrollo sobre el código que vos escribiste, pero no pueden verificar datos que llegan de afuera en ejecución. El body de un request, los query params, una respuesta de una API externa, un mensaje de una cola, las variables de entorno o un `JSON.parse` son `unknown` en la realidad, aunque los anotes como `Pedido`: si el cliente manda `cantidad: \"muchas\"`, TypeScript no se entera y el error explota lejos del origen, o peor, se guarda un dato corrupto. Por eso en cada FRONTERA del sistema se valida con un schema en runtime. Zod resuelve las dos cosas a la vez: el schema valida en ejecución y `z.infer` genera el tipo de TypeScript desde el mismo schema, así hay una sola fuente de verdad y el código posterior trabaja con datos cuya forma está garantizada.",
    respuestaEn:
      "Because TypeScript types disappear at compile time: they check the code you wrote during development, but can't verify data arriving from outside at runtime. A request body, query params, an external API response, a queue message, environment variables or a `JSON.parse` are really `unknown`, even if you annotate them as `Order`: if the client sends `quantity: \"lots\"`, TypeScript doesn't notice and the error blows up far from the source, or worse, corrupt data gets saved. That's why every system BOUNDARY validates with a runtime schema. Zod solves both at once: the schema validates at runtime and `z.infer` generates the TypeScript type from the same schema, so there's a single source of truth and downstream code works with data whose shape is guaranteed.",
    codigo: `const PedidoSchema = z.object({
  productoId: z.string().uuid(),
  cantidad: z.number().int().positive(),
});
type Pedido = z.infer<typeof PedidoSchema>; // el tipo sale del schema

const resultado = PedidoSchema.safeParse(req.body);
if (!resultado.success) return res.status(400).json(resultado.error.issues);
crearPedido(resultado.data); // acá ya es Pedido de verdad`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué es el mass assignment y cómo lo previene un schema?",
    respuestaEs:
      "Es una vulnerabilidad donde el servidor toma el body del request y lo pasa entero a la base (`db.usuario.update({ data: req.body })`), así que el atacante puede agregar campos que no debería poder tocar: `esAdmin: true`, `saldo: 1000000`, `emailVerificado: true`, `organizacionId` de otra empresa. El formulario de la UI no tiene esos campos, pero el request se arma a mano. Se previene con allowlists explícitas de lo que cada operación acepta: un schema que define exactamente los campos permitidos para ESE endpoint (`z.object` descarta por defecto las claves desconocidas, y `.strict()` directamente las rechaza con error), o DTOs que mapean campo por campo. Los campos sensibles (rol, saldo, dueño) nunca salen del body: se derivan de la sesión o de la lógica del servidor. Y conviene un schema distinto por operación (crear, actualizar, actualizar como admin) en vez de reutilizar el modelo completo de la base.",
    respuestaEn:
      "It's a vulnerability where the server takes the request body and passes it whole to the database (`db.user.update({ data: req.body })`), so an attacker can add fields they shouldn't be able to touch: `isAdmin: true`, `balance: 1000000`, `emailVerified: true`, another company's `organizationId`. The UI form doesn't have those fields, but the request is crafted by hand. It's prevented with explicit allowlists of what each operation accepts: a schema defining exactly the permitted fields for THAT endpoint (`z.object` strips unknown keys by default, and `.strict()` rejects them with an error), or DTOs mapping field by field. Sensitive fields (role, balance, owner) never come from the body: they're derived from the session or server logic. And use a distinct schema per operation (create, update, admin update) rather than reusing the full database model.",
  },
  {
    nivel: 2,
    pregunta: "¿Dónde validás en una aplicación full stack y cómo evitás duplicar reglas?",
    respuestaEs:
      "En el cliente se valida para la EXPERIENCIA DE USUARIO (feedback inmediato en el formulario, sin ida y vuelta al servidor), y en el servidor para la SEGURIDAD y la integridad, porque el cliente se puede saltear. Las reglas de forma (tipos, requeridos, longitudes, formatos) se definen UNA vez en un schema compartido: en un monorepo o en un paquete común, el mismo schema de Zod se usa con React Hook Form (`zodResolver`) en el formulario y en el endpoint o Server Action. Las reglas que dependen de datos del servidor (el email no está registrado, hay stock, el cupón es válido) solo pueden validarse en el servidor y se devuelven como errores por campo que el formulario muestra. Además hay validación en otras fronteras: respuestas de APIs externas (que pueden cambiar sin aviso), variables de entorno al arrancar, y mensajes de colas. Y la base de datos con sus constraints es la última defensa.",
    respuestaEn:
      "The client validates for USER EXPERIENCE (instant form feedback, no server round trip), and the server for SECURITY and integrity, since the client can be bypassed. Shape rules (types, required, lengths, formats) are defined ONCE in a shared schema: in a monorepo or shared package, the same Zod schema is used with React Hook Form (`zodResolver`) in the form and in the endpoint or Server Action. Rules depending on server data (email not already registered, stock available, coupon valid) can only be validated on the server and are returned as per-field errors the form displays. There's also validation at other boundaries: external API responses (which can change without notice), environment variables at startup, and queue messages. And the database with its constraints is the last line of defense.",
    tradeoffs:
      "Un schema compartido evita duplicación, pero acopla front y back: si divergen las necesidades (un campo que el admin puede editar y el usuario no), conviene derivar schemas con .pick/.omit/.extend en vez de forzar uno solo.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencia hay entre parse y safeParse, y entre validar y transformar?",
    respuestaEs:
      "`parse` devuelve los datos si son válidos y LANZA un `ZodError` si no; `safeParse` nunca lanza y devuelve un objeto `{ success, data }` o `{ success: false, error }`. En un endpoint conviene `safeParse` para responder un 400 con los detalles de forma explícita; `parse` sirve donde un dato inválido es un error de programación o de configuración (validar variables de entorno al arrancar y cortar). Sobre transformar: Zod no solo valida, también NORMALIZA el dato mientras lo valida: `trim()`, `toLowerCase()`, `z.coerce.number()` para convertir el string de un query param en número, `.default()` para completar valores faltantes, y `.transform()` para cualquier conversión propia (un string de fecha a `Date`). Por eso importa usar el resultado del parse (`resultado.data`) y no el input original: el input tiene espacios, mayúsculas, strings en vez de números y claves de más. El tipo de entrada y el de salida pueden ser distintos (`z.input` vs `z.output`).",
    respuestaEn:
      "`parse` returns the data if valid and THROWS a `ZodError` if not; `safeParse` never throws and returns `{ success, data }` or `{ success: false, error }`. In an endpoint, `safeParse` is better for explicitly returning a 400 with details; `parse` fits where invalid data is a programming or config error (validating env vars at startup and aborting). On transforming: Zod doesn't just validate, it also NORMALIZES data while validating: `trim()`, `toLowerCase()`, `z.coerce.number()` to turn a query param string into a number, `.default()` to fill missing values, and `.transform()` for any custom conversion (a date string to a `Date`). That's why you must use the parse result (`result.data`) and not the original input: the input has spaces, uppercase, strings instead of numbers and extra keys. Input and output types can differ (`z.input` vs `z.output`).",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo validás reglas que dependen de varios campos o de datos asincrónicos?",
    respuestaEs:
      "Para reglas entre campos del mismo objeto (la fecha de fin posterior a la de inicio, confirmar contraseña, un campo obligatorio solo si otro tiene cierto valor) Zod ofrece `.refine()` y `.superRefine()` a nivel de objeto, indicando con `path` a qué campo asociar el error para que el formulario lo muestre en el lugar correcto. Para variantes de forma según un campo, `z.discriminatedUnion('tipo', [...])` modela, por ejemplo, un pago con tarjeta y uno con transferencia con campos distintos, y TypeScript estrecha el tipo después. Las reglas asincrónicas (el email ya existe, el cupón es válido) se pueden escribir con refinamientos async y `parseAsync`, pero muchas veces conviene sacarlas del schema: el schema valida la FORMA de manera pura y rápida, y las reglas que consultan la base van en el caso de uso, porque necesitan transacciones, dan errores de negocio (409) más que de validación (400), y además hay condiciones de carrera: que el email no exista al validar no garantiza que no exista al insertar, así que el constraint único en la base sigue siendo necesario.",
    respuestaEn:
      "For rules across fields of the same object (end date after start date, confirm password, a field required only if another has some value) Zod offers object-level `.refine()` and `.superRefine()`, specifying a `path` to attach the error to the right field so the form shows it in place. For shape variants depending on a field, `z.discriminatedUnion('type', [...])` models, say, a card payment and a transfer payment with different fields, and TypeScript narrows the type afterward. Async rules (email already exists, coupon valid) can be written as async refinements with `parseAsync`, but it's often better to keep them out of the schema: the schema validates SHAPE purely and fast, and rules that query the database belong in the use case, since they need transactions, produce business errors (409) rather than validation errors (400), and there are race conditions: the email not existing at validation time doesn't guarantee it won't exist at insert time, so the database unique constraint is still needed.",
    codigo: `const ReservaSchema = z
  .object({ desde: z.coerce.date(), hasta: z.coerce.date() })
  .refine((r) => r.hasta > r.desde, {
    path: ["hasta"],
    message: "La fecha de salida tiene que ser posterior a la de entrada",
  });`,
  },
  {
    nivel: 3,
    pregunta: "¿Por qué validar también las respuestas de APIs de terceros?",
    respuestaEs:
      "Porque son otra frontera del sistema que no controlás: un proveedor puede cambiar un campo, devolver `null` donde antes había un string, agregar un valor nuevo a un enum, o responder un HTML de error con status 200. Si el código asume la forma tipada con un `as TipoRespuesta`, el problema aparece lejos, como un `undefined` en medio de la lógica o, peor, como datos corruptos guardados en la base. Validar la respuesta con un schema en el adaptador del proveedor convierte ese cambio silencioso en un error explícito, en el lugar exacto, con un mensaje claro para el log y la alerta. Conviene que el schema sea tolerante con lo que no importa (usar solo los campos necesarios, permitir claves extra) y estricto con lo que sí se usa. Con muchos consumidores de la misma API, el costo de validar es mínimo comparado con depurar una integración rota en producción.",
    respuestaEn:
      "Because they're another system boundary you don't control: a provider may change a field, return `null` where there used to be a string, add a new enum value, or respond with an HTML error page with status 200. If the code assumes the typed shape with `as ResponseType`, the problem surfaces far away, as an `undefined` mid-logic or, worse, as corrupt data saved in the database. Validating the response with a schema in the provider adapter turns that silent change into an explicit error, at the exact spot, with a clear message for logs and alerts. The schema should be lenient on what doesn't matter (use only needed fields, allow extra keys) and strict on what is used. With many consumers of the same API, the cost of validating is minimal compared to debugging a broken integration in production.",
  },
];
