import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { XssCsrfSimulador } from "@/components/modulo/XssCsrfSimulador";
import { entrevistaCorsCsrfXss } from "@/lib/modules/seguridad/cors-csrf-xss-entrevista";

const preguntasPorNivel = {
  1: entrevistaCorsCsrfXss.filter((p) => p.nivel === 1),
  2: entrevistaCorsCsrfXss.filter((p) => p.nivel === 2),
  3: entrevistaCorsCsrfXss.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "CORS / CSRF / XSS — Dev Study Lab",
  description:
    "XSS y cómo React lo previene, CSRF y SameSite, sanitización, Content-Security-Policy y la relación entre CORS y CSRF.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace React con un string renderizado en JSX, como <p>{comentario}</p>?",
    opciones: [
      "Lo escapa: se muestra como texto literal",
      "Lo sanitiza: saca los <script> y deja el resto",
      "Lo inserta como HTML si contiene etiquetas",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La protección se pierde con dangerouslySetInnerHTML o manipulando el DOM directo.",
  },
  {
    pregunta: "En un ataque CSRF, ¿el atacante puede leer la respuesta?",
    opciones: [
      "Sí: la respuesta vuelve a la página del atacante, que la procesa",
      "No, pero no le hace falta: el efecto (la transferencia) ya ocurrió",
      "No, y por eso CSRF solo sirve para leer datos, no para modificarlos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La same-origin policy bloquea la lectura, no el envío del request.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "Con SameSite=Lax, ¿viaja la cookie en un POST de formulario desde otro sitio?",
    opciones: [
      "Sí, porque es una navegación de nivel superior",
      "Sí, salvo que la cookie además sea HttpOnly",
      "No",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Lax solo la envía en navegaciones de primer nivel con GET.",
  },
  {
    pregunta: "¿Cómo se renderiza de forma segura el HTML de un editor enriquecido?",
    opciones: [
      "Sanitizando con DOMPurify y una allowlist mínima, al renderizar",
      "Escapando el HTML al guardarlo y usándolo tal cual al renderizar",
      "Con dangerouslySetInnerHTML, que React protege contra scripts",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las regex caseras fallan con los muchos casos raros del HTML.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué usar nonces en la CSP en vez de 'unsafe-inline'?",
    opciones: [
      "Porque los nonces cifran los scripts y el atacante no puede leerlos",
      "Solo pasan los scripts inline legítimos; uno inyectado no conoce el nonce",
      "Porque 'unsafe-inline' bloquea también los scripts externos del sitio",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "'unsafe-inline' deja ejecutar cualquier script inline, incluidos los inyectados.",
  },
  {
    pregunta: "¿CORS protege contra CSRF?",
    opciones: [
      "Sí: el navegador bloquea todo request cross-origin sin ACAO",
      "Sí, siempre que el servidor no devuelva Allow-Origin: *",
      "No: un form o una imagen hacen requests sin pasar por CORS",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "CORS controla la lectura de respuestas; CSRF solo necesita que el request llegue.",
  },
];

export default function CorsCsrfXssPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="CORS / CSRF / XSS"
      descripcion="Tres siglas que se confunden: código del atacante corriendo en tu página, requests forzados desde otro sitio, y la política que controla quién lee qué."
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
            <strong className="text-foreground">XSS</strong>: el JavaScript del
            atacante se ejecuta en tu página. React escapa todo lo que se
            renderiza en JSX; el riesgo vuelve con{" "}
            <code>dangerouslySetInnerHTML</code>, <code>innerHTML</code> o URLs{" "}
            <code>javascript:</code>.
          </p>
          <p>
            <strong className="text-foreground">CSRF</strong>: otro sitio hace
            que el navegador del usuario mande un request con efectos a tu
            sitio, con sus cookies. No lee la respuesta; no le hace falta.{" "}
            <strong className="text-foreground">CORS</strong> (visto a fondo en
            HTTP y Networking) controla quién puede leer respuestas, no quién
            puede mandar requests.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <XssCsrfSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>href</code> construido con datos del usuario.</strong>{" "}
            Un <code>javascript:</code> ejecuta código al hacer click, incluso en React.
          </li>
          <li>
            <strong className="text-foreground">GET que cambian estado.</strong>{" "}
            Una imagen en otro sitio alcanza para dispararlos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Revisar cada uso de <code>dangerouslySetInnerHTML</code> en el código.</li>
          <li>Cookies de sesión con <code>SameSite=Lax</code> por defecto.</li>
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
            Contra CSRF, en capas: cookie <code>SameSite=Lax</code> o{" "}
            <code>Strict</code>, GETs que nunca cambian estado, y para lo
            sensible un token anti-CSRF o verificar <code>Origin</code> /{" "}
            <code>Sec-Fetch-Site</code>. Las Server Actions de Next ya comparan
            el <code>Origin</code>.
          </p>
          <p>
            Para HTML de usuarios: <strong className="text-foreground">DOMPurify</strong>{" "}
            con una allowlist mínima al renderizar, o mejor, un formato
            estructurado renderizado con componentes.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Sanitizar con regex.</strong>{" "}
            El HTML tiene demasiados casos borde.
          </li>
          <li>
            <strong className="text-foreground">Sanitizar solo al guardar.</strong>{" "}
            Datos viejos o de otros caminos quedan sin limpiar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un componente <code>HtmlSeguro</code> que centraliza la sanitización.</li>
          <li>Verificar <code>Sec-Fetch-Site</code> en endpoints de pagos.</li>
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
            Una <strong className="text-foreground">CSP</strong> con{" "}
            <code>script-src</code> basada en nonces y{" "}
            <code>&apos;strict-dynamic&apos;</code> bloquea los scripts
            inyectados aunque lleguen al DOM. El costo: el nonce cambia en cada
            request y complica el caching estático.
          </p>
          <p>
            CORS no protege contra CSRF, pero una API que solo acepta JSON
            obliga a un preflight que un sitio ajeno no pasa. Es un efecto
            colateral útil, no una defensa en la que confiar.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">CSP con <code>&apos;unsafe-inline&apos;</code>.</strong>{" "}
            Tiene el header, pero no la protección.
          </li>
          <li>
            <strong className="text-foreground">CORS abierto con credenciales &quot;para que ande&quot;.</strong>{" "}
            Permite leer las respuestas desde cualquier sitio.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>CSP con nonce generado en el Proxy de Next.js.</li>
          <li>Desplegar la CSP en <code>Report-Only</code> y revisar los reportes.</li>
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
          <p>Este perfil público tiene dos vulnerabilidades. ¿Cuáles?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function Perfil({ usuario }) {
  return (
    <div>
      <h1>{usuario.nombre}</h1>
      <a href={usuario.sitioWeb}>Mi sitio</a>
      <div dangerouslySetInnerHTML={{ __html: usuario.bio }} />
    </div>
  );
}`}
          </pre>
          <RevelarSolucion>
            <p>
              1) <code>href=&#123;usuario.sitioWeb&#125;</code>: si el usuario
              guarda <code>javascript:robar()</code> como sitio web, cualquiera
              que haga click ejecuta su código. Hay que validar que la URL sea{" "}
              <code>http:</code> o <code>https:</code> (al guardar y al
              renderizar). 2) La bio con <code>dangerouslySetInnerHTML</code>{" "}
              sin sanitizar es un XSS almacenado: afecta a todos los que visitan
              el perfil. Hay que sanitizar con DOMPurify y una allowlist mínima,
              o guardar la bio como texto o Markdown y renderizarla con
              componentes. El nombre en el <code>&lt;h1&gt;</code> está bien:
              JSX lo escapa.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
