import type { PreguntaEntrevista } from "../types";

export const entrevistaFormulariosAccesibles: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Por qué el placeholder no reemplaza a un label?",
    respuestaEs:
      "Por varias razones. Desaparece apenas el usuario empieza a escribir, así que quien vuelve a revisar el formulario (o tiene problemas de memoria o atención) ya no sabe qué dato iba en cada campo. Suele tener bajo contraste por diseño, lo que lo hace difícil de leer. Y aunque los navegadores lo usan como nombre accesible de último recurso, no es confiable entre lectores de pantalla, y normalmente contiene un EJEMPLO ('ana@mail.com') y no la descripción del dato ('Email'). Además, un `<label>` asociado con `htmlFor` agranda el área clickeable: hacer click en el texto enfoca el input o marca el checkbox, algo muy útil en mobile y para personas con motricidad reducida. El placeholder puede complementar con un ejemplo, pero el label tiene que estar siempre visible.",
    respuestaEn:
      "For several reasons. It disappears as soon as the user starts typing, so whoever reviews the form (or has memory or attention issues) no longer knows what each field was for. It usually has low contrast by design, making it hard to read. And although browsers use it as a last-resort accessible name, it's unreliable across screen readers, and it normally contains an EXAMPLE ('ana@mail.com') rather than the field description ('Email'). Also, a `<label>` associated via `htmlFor` enlarges the click target: clicking the text focuses the input or toggles the checkbox, very useful on mobile and for people with reduced motor control. The placeholder can complement with an example, but the label must always be visible.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo hacés que un mensaje de error de validación sea accesible?",
    respuestaEs:
      "Tres cosas: que el error esté ASOCIADO al campo, que el campo indique su ESTADO, y que el usuario se ENTERE de que hubo errores. La asociación se hace con `aria-describedby` apuntando al id del mensaje, así el lector lo lee al enfocar el campo. El estado con `aria-invalid=\"true\"`, que el lector anuncia como 'inválido'. Y al enviar, mover el foco al primer campo con error (o a un resumen de errores al principio del formulario con links a cada campo), porque si el foco se queda en el botón de enviar, quien no ve la pantalla no sabe que algo falló. El error no puede comunicarse solo con color (un borde rojo): tiene que haber texto, y el texto tiene que decir cómo corregirlo, no solo 'campo inválido'.",
    respuestaEn:
      "Three things: the error must be ASSOCIATED with the field, the field must expose its STATE, and the user must LEARN there were errors. Association is done with `aria-describedby` pointing to the message's id, so the reader reads it when the field is focused. State with `aria-invalid=\"true\"`, announced as 'invalid'. And on submit, move focus to the first invalid field (or to an error summary at the top of the form with links to each field), because if focus stays on the submit button, someone who can't see the screen doesn't know something failed. The error can't be conveyed with color alone (a red border): there must be text, and the text must say how to fix it, not just 'invalid field'.",
    codigo: `<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  autoComplete="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <p id="email-error">{error}</p>}`,
  },
  {
    nivel: 2,
    pregunta: "¿Cuándo conviene validar: al escribir, al salir del campo o al enviar?",
    respuestaEs:
      "Validar en cada tecla es lo peor para la accesibilidad y para la UX en general: el usuario ve (y el lector anuncia, si hay una región viva) 'email inválido' mientras todavía está escribiendo la primera letra. El punto de equilibrio más usado es validar al salir del campo (blur) la primera vez, y a partir de ahí, una vez que el campo ya mostró un error, revalidar al escribir para que el error desaparezca apenas se corrige. Y siempre validar todo al enviar, moviendo el foco al primer error. Hay excepciones razonables: requisitos de contraseña se pueden mostrar en vivo como una checklist (sin anunciar cada cambio de forma agresiva), y la disponibilidad de un nombre de usuario se puede chequear con debounce. Además, la validación del cliente es para UX: la del servidor sigue siendo obligatoria.",
    respuestaEn:
      "Validating on every keystroke is the worst for accessibility and UX in general: the user sees (and the reader announces, if there's a live region) 'invalid email' while still typing the first letter. The most used balance is validating on leaving the field (blur) the first time, and from then on, once the field has shown an error, revalidating on input so the error disappears as soon as it's fixed. And always validate everything on submit, moving focus to the first error. There are reasonable exceptions: password requirements can be shown live as a checklist (without aggressively announcing each change), and username availability can be checked with debounce. Also, client-side validation is for UX: server-side validation is still mandatory.",
    tradeoffs:
      "Un resumen de errores arriba del formulario escala mejor en formularios largos (el usuario ve todos los problemas juntos); enfocar el primer campo inválido es más directo en formularios cortos. Los formularios de gobierno (GOV.UK) usan ambos.",
  },
  {
    nivel: 2,
    pregunta:
      "¿Para qué sirven `fieldset`/`legend` y el atributo `autocomplete` en términos de accesibilidad?",
    respuestaEs:
      "`fieldset` con `legend` agrupa controles relacionados y le da un nombre al grupo: en un grupo de radio buttons de '¿Cómo querés recibir el pedido?', el lector anuncia la pregunta al entrar al grupo, y no solo 'Envío a domicilio, radio button', que sin contexto no significa nada. Es imprescindible para radios y checkboxes que responden a una misma pregunta. `autocomplete` con los valores estándar (`name`, `email`, `street-address`, `tel`, `cc-number`, `one-time-code`) permite al navegador y a los gestores de contraseñas completar los datos: para personas con problemas motrices o cognitivos reduce muchísimo el esfuerzo de tipear, y WCAG lo exige para datos del propio usuario (1.3.5, identify input purpose). También sirve para que el teclado correcto aparezca en mobile, junto con `type` e `inputMode`.",
    respuestaEn:
      "`fieldset` with `legend` groups related controls and names the group: in a radio group for 'How do you want to receive the order?', the reader announces the question when entering the group, not just 'Home delivery, radio button', which means nothing without context. It's essential for radios and checkboxes answering the same question. `autocomplete` with standard values (`name`, `email`, `street-address`, `tel`, `cc-number`, `one-time-code`) lets the browser and password managers fill in data: for people with motor or cognitive impairments it greatly reduces typing effort, and WCAG requires it for the user's own data (1.3.5, identify input purpose). It also helps the right keyboard appear on mobile, together with `type` and `inputMode`.",
    codigo: `<fieldset>
  <legend>¿Cómo querés recibir el pedido?</legend>
  <label><input type="radio" name="entrega" value="domicilio" /> Envío a domicilio</label>
  <label><input type="radio" name="entrega" value="retiro" /> Retiro en sucursal</label>
</fieldset>`,
  },
  {
    nivel: 3,
    pregunta:
      "¿Por qué `aria-describedby` a veces no anuncia el error, aunque esté bien puesto?",
    respuestaEs:
      "Porque la descripción se lee cuando el campo RECIBE el foco, no cuando cambia. Si el usuario está en el campo, sale con Tab, y el error aparece en ese blur, el lector ya está en el campo siguiente: el error recién se va a escuchar si vuelve. Por eso la asociación sola no alcanza para errores que aparecen dinámicamente: hace falta además anunciarlos (una región viva con el mensaje, o mover el foco al primer error al enviar). Otro caso: si el elemento referenciado por `aria-describedby` no existe en el DOM en el momento del cálculo (porque se renderiza condicionalmente), la referencia queda rota; algunos equipos dejan el contenedor del error siempre montado y cambian solo su texto. Y si el mensaje tiene `display: none` o `hidden`, se lee igual (las referencias por id sí incluyen contenido oculto), lo que puede anunciar errores viejos si no se limpia.",
    respuestaEn:
      "Because the description is read when the field RECEIVES focus, not when it changes. If the user is in the field, tabs out, and the error appears on that blur, the reader is already on the next field: the error will only be heard if they come back. So association alone isn't enough for dynamically appearing errors: they also need announcing (a live region with the message, or moving focus to the first error on submit). Another case: if the element referenced by `aria-describedby` doesn't exist in the DOM when computed (because it renders conditionally), the reference is broken; some teams keep the error container always mounted and just change its text. And if the message has `display: none` or `hidden`, it's still read (id references do include hidden content), which can announce stale errors if not cleaned up.",
  },
  {
    nivel: 3,
    pregunta:
      "¿Qué problemas de accesibilidad tienen los componentes custom de formulario (selects, date pickers, checkboxes estilizados) y cómo los evitás?",
    respuestaEs:
      "Al reemplazar un control nativo se pierde todo lo que el navegador daba gratis: rol, estados (`checked`, `expanded`, `selected`), foco, modelo de teclado, integración con el `<form>` (el valor no viaja en el submit, no participa de `required` ni del reset), soporte de autocompletado, y en mobile, los pickers nativos del sistema, que suelen ser mucho más usables que cualquier widget custom. Para un checkbox o radio estilizado, lo mejor es mantener el `<input>` nativo visualmente oculto (no con `display: none`) y estilizar un elemento hermano con `:checked` y `:focus-visible`; o directamente usar `appearance: none` y estilizar el input. Para select y date picker, primero cuestionar si el nativo alcanza (hoy `<select>` es cada vez más estilizable con `appearance: base-select`). Si no, usar una librería headless probada que implemente el patrón completo de ARIA (combobox, listbox, grid) en vez de escribirlo desde cero.",
    respuestaEn:
      "Replacing a native control loses everything the browser gave for free: role, states (`checked`, `expanded`, `selected`), focus, keyboard model, `<form>` integration (the value isn't submitted, doesn't participate in `required` or reset), autofill support, and on mobile, the native system pickers, usually far more usable than any custom widget. For a styled checkbox or radio, it's best to keep the native `<input>` visually hidden (not with `display: none`) and style a sibling with `:checked` and `:focus-visible`; or just use `appearance: none` and style the input itself. For select and date picker, first question whether the native one is enough (`<select>` is increasingly stylable with `appearance: base-select`). If not, use a proven headless library that implements the full ARIA pattern (combobox, listbox, grid) instead of writing it from scratch.",
  },
];
