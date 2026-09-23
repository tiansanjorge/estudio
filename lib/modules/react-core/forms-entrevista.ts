import type { PreguntaEntrevista } from "../types";

export const entrevistaForms: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué significa que un input sea 'controlado' por React?",
    respuestaEs:
      "Que su value sale del estado de React, y en cada render React fuerza al DOM a mostrar exactamente ese valor, no lo que el usuario acaba de tipear. El onChange es lo único que actualiza ese estado — sin él, el ciclo se corta: el usuario tipea, el estado no cambia, y React vuelve a poner el value de siempre en el próximo render, dando la sensación de que el input está 'trabado'.",
    respuestaEn:
      "That its value comes from React's state, and on every render React forces the DOM to show exactly that value, not what the user just typed. onChange is the only thing that updates that state — without it, the cycle breaks: the user types, the state doesn't change, and React puts the same old value back on the next render, giving the impression the input is 'stuck'.",
  },
  {
    nivel: 1,
    pregunta:
      "En un proyecto real, ¿cuándo elegirías un input no controlado en vez de uno controlado?",
    respuestaEs:
      "Cuando no necesito reaccionar a cada tecla — validar en tiempo real, formatear mientras se escribe, o deshabilitar un botón según el contenido parcial. Para un formulario simple que solo se valida al enviar, un input no controlado con ref evita re-renderizar el componente completo en cada tecla, algo que importa en formularios grandes con muchos campos.",
    respuestaEn:
      "When I don't need to react to every keystroke — real-time validation, formatting while typing, or disabling a button based on partial content. For a simple form that only validates on submit, an uncontrolled input with a ref avoids re-rendering the whole component on every keystroke, which matters in large forms with many fields.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Por qué existen librerías como React Hook Form, si ya se puede armar un formulario con useState?",
    respuestaEs:
      "React Hook Form usa inputs no controlados por defecto (se registran con refs internamente vía `register()`), en vez de un useState por campo. Esto evita que el componente completo re-renderice en cada tecla de cualquier campo — con useState por campo, escribir en un input dispara un render del formulario entero, aunque los demás campos no cambiaron. En formularios grandes (10+ campos, validaciones complejas), esa diferencia de performance es notoria. Además centraliza validación, manejo de errores y estado de envío sin tener que armar esa lógica a mano por cada formulario.",
    respuestaEn:
      "React Hook Form uses uncontrolled inputs by default (registered with refs internally via `register()`), instead of a useState per field. This avoids the whole component re-rendering on every keystroke of any field — with a useState per field, typing in one input triggers a render of the entire form, even though the other fields didn't change. In large forms (10+ fields, complex validations), that performance difference is noticeable. It also centralizes validation, error handling, and submission state without having to build that logic by hand for every form.",
    codigo: `// useState por campo: cada tecla re-renderiza TODO el formulario
const [nombre, setNombre] = useState('');
const [email, setEmail] = useState('');

// React Hook Form: inputs no controlados, sin re-render del form por tecla
const { register, handleSubmit } = useForm();
<input {...register('nombre')} />
<input {...register('email')} />`,
    tradeoffs:
      "Menos re-renders y menos código repetitivo, a cambio de aprender la API de la librería y perder algo de control directo sobre cuándo exactamente se actualiza cada campo.",
    repregunta:
      "Si React Hook Form usa inputs no controlados, ¿cómo integra un componente de UI que solo puede ser controlado (como un Select custom de una librería de componentes)?",
    respuestaRepreguntaEs:
      "Con el componente `<Controller>`, que actúa como puente: internamente maneja el estado controlado que ese componente de UI necesita (value + onChange), pero lo sincroniza con el sistema de refs no controlado que usa el resto del formulario. Así, un formulario puede mezclar inputs nativos no controlados (rápidos, vía register) con componentes controlados de terceros (Select, DatePicker), sin que el desarrollador tenga que manejar dos sistemas de estado completamente separados a mano.",
    respuestaRepreguntaEn:
      "With the `<Controller>` component, which acts as a bridge: internally it manages the controlled state that UI component needs (value + onChange), but syncs it with the uncontrolled ref-based system the rest of the form uses. That way, a form can mix uncontrolled native inputs (fast, via register) with controlled third-party components (Select, DatePicker), without the developer having to manage two completely separate state systems by hand.",
    codigoRepregunta: `<Controller
  name="pais"
  control={control}
  render={({ field }) => <SelectCustom {...field} />}
/>
// SelectCustom recibe value/onChange como cualquier componente controlado,
// pero por debajo queda sincronizado con el resto del formulario no controlado`,
  },
  {
    nivel: 2,
    pregunta:
      "¿Qué ventaja tiene usar un schema de validación (como Zod) compartido entre el frontend y el backend?",
    respuestaEs:
      "Se define la forma y las reglas de validación de un dato UNA sola vez, y ese mismo schema sirve tanto para validar en el cliente (mostrar errores mientras el usuario completa el formulario) como para validar en el servidor (nunca confiar en que los datos que llegan ya fueron validados del lado del cliente, porque cualquiera puede mandar una request directa sin pasar por el formulario). Sin un schema compartido, es común terminar con dos implementaciones de la misma regla de validación — una en el formulario, otra en el endpoint — que eventualmente se desincronizan cuando alguien actualiza una sin la otra.",
    respuestaEn:
      "The shape and validation rules of a piece of data are defined ONCE, and that same schema serves both to validate on the client (showing errors as the user fills out the form) and to validate on the server (never trusting that incoming data was already validated client-side, since anyone can send a direct request bypassing the form). Without a shared schema, it's common to end up with two implementations of the same validation rule — one in the form, another in the endpoint — that eventually drift apart when someone updates one without the other.",
    codigo: `const esquemaUsuario = z.object({
  email: z.string().email(),
  edad: z.number().min(18),
});

// mismo esquema, cliente: valida el formulario antes de enviar
esquemaUsuario.safeParse(datosDelFormulario);

// mismo esquema, servidor: nunca confía en que el cliente ya validó
esquemaUsuario.parse(await request.json());`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué validación nativa del navegador existe independiente de JavaScript, y cuándo conviene apoyarse en ella en vez de reemplazarla completamente?",
    respuestaEs:
      "Atributos HTML como `required`, `type=\"email\"`, `minLength`, `pattern` disparan la validación nativa del navegador (el pseudo-selector `:invalid` en CSS, y los mensajes de error nativos al intentar enviar el formulario), sin necesitar ninguna línea de JavaScript. Conviene apoyarse en ella para las reglas más básicas y universales (campo requerido, formato de email) porque funciona incluso si JavaScript falla en cargar, y los navegadores ya manejan foco y accesibilidad de esos mensajes de forma consistente. Para reglas de negocio específicas (contraseñas con criterios particulares, validaciones cruzadas entre campos) hace falta JavaScript de todos modos, pero no es necesario reemplazar TODA la validación con JS si el navegador ya cubre una parte de forma gratuita y accesible.",
    respuestaEn:
      "HTML attributes like `required`, `type=\"email\"`, `minLength`, `pattern` trigger the browser's native validation (the `:invalid` CSS pseudo-selector, and native error messages when trying to submit the form), with no JavaScript needed at all. It's worth relying on it for the most basic, universal rules (required field, email format) because it works even if JavaScript fails to load, and browsers already handle focus and accessibility for those messages consistently. For specific business rules (passwords with particular criteria, cross-field validation) JavaScript is needed anyway, but there's no need to replace ALL validation with JS if the browser already covers part of it for free and accessibly.",
    codigo: `<input type="email" required minLength={5} />
{/* el navegador bloquea el submit y muestra su propio mensaje
    si el campo está vacío o no tiene formato de email, sin JS */}`,
    repregunta:
      "¿Qué es el modelo de 'form actions' de React 19, y en qué se diferencia de manejar el submit con un onSubmit tradicional?",
    respuestaRepreguntaEs:
      "Con `<form action={miFuncion}>`, React 19 permite pasar directamente una función (que puede ser una Server Action) como el `action` nativo del formulario, en vez de interceptar el submit con `onSubmit` y `preventDefault()`. La diferencia clave es la progressive enhancement: un formulario con `action` funciona incluso si JavaScript todavía no cargó o falló, porque el navegador sabe nativamente cómo enviar un formulario a una acción — React se engancha a ese mecanismo nativo en vez de reemplazarlo por completo. Combinado con hooks como `useFormStatus` (para saber si el envío está en curso) y `useActionState` (para manejar el resultado y errores de la acción), se obtiene un modelo de formularios que funciona en más escenarios (incluida carga lenta de JS) que el patrón tradicional 100% dependiente de un onSubmit de cliente.",
    respuestaRepreguntaEn:
      "With `<form action={myFunction}>`, React 19 lets you pass a function directly (which can be a Server Action) as the form's native `action`, instead of intercepting the submit with `onSubmit` and `preventDefault()`. The key difference is progressive enhancement: a form with `action` works even if JavaScript hasn't loaded yet or failed, because the browser natively knows how to submit a form to an action — React hooks into that native mechanism instead of fully replacing it. Combined with hooks like `useFormStatus` (to know if submission is in progress) and `useActionState` (to handle the action's result and errors), you get a forms model that works in more scenarios (including slow JS loading) than the traditional pattern fully dependent on a client-side onSubmit.",
    codigoRepregunta: `async function guardarPerfil(prevState, formData) {
  'use server';
  const nombre = formData.get('nombre');
  // ...validar y guardar
  return { ok: true };
}

function Formulario() {
  const [estado, accion] = useActionState(guardarPerfil, null);
  return <form action={accion}><input name="nombre" /></form>;
}`,
  },
];
