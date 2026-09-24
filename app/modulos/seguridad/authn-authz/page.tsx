import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { AuthMatriz } from "@/components/modulo/AuthMatriz";
import { entrevistaAuthnAuthz } from "@/lib/modules/seguridad/authn-authz-entrevista";

const preguntasPorNivel = {
  1: entrevistaAuthnAuthz.filter((p) => p.nivel === 1),
  2: entrevistaAuthnAuthz.filter((p) => p.nivel === 2),
  3: entrevistaAuthnAuthz.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "AuthN vs AuthZ — Dev Study Lab",
  description:
    "Autenticación y autorización: 401 vs 403, IDOR, OAuth y OpenID Connect, dónde verificar permisos, MFA y passkeys.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Un usuario logueado intenta borrar un producto sin ser admin. ¿Qué status corresponde?",
    opciones: ["401", "403", "500"],
    respuestaCorrecta: 1,
    explicacion:
      "Sabemos quién es (autenticación ok), pero no tiene permiso (falla la autorización).",
  },
  {
    pregunta: "Cambiando el id en la URL, un usuario ve pedidos de otros. ¿Qué vulnerabilidad es?",
    opciones: ["XSS", "IDOR (falla de autorización)", "CSRF"],
    respuestaCorrecta: 1,
    explicacion:
      "El servidor no verifica que el recurso pertenezca al usuario autenticado.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Para 'Iniciar sesión con Google', ¿qué protocolo se usa?",
    opciones: ["OAuth 2.0 solo", "OpenID Connect (sobre OAuth 2.0)", "SAML obligatoriamente"],
    respuestaCorrecta: 1,
    explicacion:
      "OAuth delega autorización; OIDC agrega la identidad con el ID token.",
  },
  {
    pregunta: "Ocultar el botón 'Borrar' para los no-admins, ¿es suficiente?",
    opciones: [
      "Sí",
      "No: el endpoint tiene que verificar el permiso en el servidor",
      "Solo si además se deshabilita con CSS",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La UI es experiencia de usuario; cualquiera puede llamar al endpoint directo.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué segundo factor es resistente al phishing?",
    opciones: ["SMS", "Código TOTP", "WebAuthn / passkeys"],
    respuestaCorrecta: 2,
    explicacion:
      "La firma está atada al dominio real: un sitio falso no puede obtenerla.",
  },
  {
    pregunta: "¿Qué guarda el servidor cuando un usuario registra una passkey?",
    opciones: ["La contraseña hasheada", "La clave pública", "La clave privada"],
    respuestaCorrecta: 1,
    explicacion:
      "La clave privada nunca sale del dispositivo; una clave pública filtrada no sirve para entrar.",
  },
];

export default function AuthnAuthzPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="AuthN vs AuthZ"
      descripcion="Saber quién es el usuario y decidir qué puede hacer son dos problemas distintos, y confundirlos es una de las fuentes de vulnerabilidades más comunes."
    >
      <NivelTabs
        niveles={{
          1: <NivelUno />,
          2: <NivelDos />,
          3: <NivelTres />,
        }}
      />
    </ModuloLayout>
  );
}

function NivelUno() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            <strong className="text-foreground">Autenticación</strong> (AuthN):
            ¿quién sos? Se verifica la identidad.{" "}
            <strong className="text-foreground">Autorización</strong> (AuthZ):
            ¿podés hacer esto? Se decide el permiso sobre una acción y un
            recurso concretos. Siempre en ese orden.
          </p>
          <p>
            En HTTP: <code>401</code> cuando falla la autenticación,{" "}
            <code>403</code> cuando falla la autorización (o <code>404</code>{" "}
            si no conviene revelar que el recurso existe). La autorización se
            verifica en el servidor, en cada acceso.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <AuthMatriz />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Verificar que hay sesión, pero no de quién es el recurso.</strong>{" "}
            Es el origen del IDOR.
          </li>
          <li>
            <strong className="text-foreground">Tomar el userId del body.</strong>{" "}
            El usuario lo puede cambiar; sale de la sesión.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Filtrar por <code>usuarioId</code> de la sesión en cada consulta de recursos propios.</li>
          <li>Tests que verifican que un usuario no accede a datos de otro.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>
    </>
  );
}

function NivelDos() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            <strong className="text-foreground">OAuth 2.0</strong> delega
            autorización (acceder a recursos de un usuario en otro servicio);{" "}
            <strong className="text-foreground">OpenID Connect</strong> agrega
            autenticación con un ID token. En web, el flujo Authorization Code
            con PKCE.
          </p>
          <p>
            La autorización vive en el servidor, cerca de los datos: una capa de
            acceso a datos o servicios que verifican antes de leer o escribir,
            en cada Server Action, Route Handler y endpoint. La UI solo refleja
            permisos, no los hace cumplir.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Usar OAuth &quot;puro&quot; para login.</strong>{" "}
            Un access token no identifica al usuario; para eso está OIDC.
          </li>
          <li>
            <strong className="text-foreground">Reglas de permiso duplicadas en cada endpoint.</strong>{" "}
            Tarde o temprano una queda desactualizada.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Login con Google o GitHub vía OIDC con Auth.js o un proveedor.</li>
          <li>Una función <code>puedeEditar(usuario, documento)</code> reutilizada en todas las acciones.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel2} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[2]} />
      </Seccion>
    </>
  );
}

function NivelTres() {
  return (
    <>
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 prosa">
          <p>
            <strong className="text-foreground">MFA</strong>: SMS (débil), TOTP
            (mejor, pero phisheable), push con number matching, y{" "}
            <strong className="text-foreground">WebAuthn</strong>, resistente al
            phishing. Más códigos de recuperación y step-up auth para acciones
            sensibles.
          </p>
          <p>
            Las <strong className="text-foreground">passkeys</strong> reemplazan
            el secreto compartido por un par de claves por sitio: el servidor
            guarda solo la clave pública y el navegador firma solo para el
            dominio real.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">MFA sin rate limiting.</strong>{" "}
            Un código de 6 dígitos se puede probar por fuerza bruta.
          </li>
          <li>
            <strong className="text-foreground">Recuperación de cuenta más débil que el login.</strong>{" "}
            El atacante entra por el &quot;olvidé mi contraseña&quot;.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Pedir de nuevo el segundo factor antes de cambiar el email de la cuenta.</li>
          <li>Ofrecer passkeys como opción principal de login.</li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>Encontrá los problemas de autorización en esta Server Action.</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`"use server";
export async function actualizarDireccion(formData: FormData) {
  const sesion = await getSesion();
  if (!sesion) redirect("/login");

  const usuarioId = formData.get("usuarioId") as string;
  const esAdmin = formData.get("esAdmin") === "true";

  if (esAdmin || usuarioId) {
    await db.usuario.update({
      where: { id: usuarioId },
      data: { direccion: formData.get("direccion") as string },
    });
  }
}`}
          </pre>
          <RevelarSolucion>
            <p>
              La autenticación está bien (hay sesión), pero la autorización está
              rota: el <code>usuarioId</code> y el flag <code>esAdmin</code>{" "}
              vienen del formulario, que el cliente controla, así que cualquier
              usuario logueado puede cambiar la dirección de cualquier otro (y
              declararse admin). Además el <code>if</code> no verifica nada útil.
              Corrección: tomar el id de <code>sesion.usuarioId</code>; si un
              admin puede editar a otros, leer el rol desde la sesión o la base,
              nunca del formulario; y validar la dirección con un esquema antes
              de guardar.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
