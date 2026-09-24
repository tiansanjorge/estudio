import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { JwtInspector } from "@/components/modulo/JwtInspector";
import { entrevistaJwtSesiones } from "@/lib/modules/seguridad/jwt-sesiones-entrevista";

const preguntasPorNivel = {
  1: entrevistaJwtSesiones.filter((p) => p.nivel === 1),
  2: entrevistaJwtSesiones.filter((p) => p.nivel === 2),
  3: entrevistaJwtSesiones.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "JWT & sesiones — Dev Study Lab",
  description:
    "Sesiones con estado vs JWT, qué garantiza la firma, dónde guardar el token, refresh tokens, revocación y vulnerabilidades de verificación.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Quién puede leer el payload de un JWT?",
    opciones: [
      "Solo el servidor que tiene el secreto",
      "Cualquiera que tenga el token: está codificado, no cifrado",
      "Nadie",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "La firma protege la integridad, no la confidencialidad.",
  },
  {
    pregunta: "¿Qué es más fácil de revocar al instante?",
    opciones: ["Un JWT", "Una sesión guardada en el servidor", "Son iguales"],
    respuestaCorrecta: 1,
    explicacion:
      "Borrar la sesión la invalida; un JWT sigue siendo válido hasta que vence.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué no guardar el token en localStorage?",
    opciones: [
      "Porque tiene poco espacio",
      "Porque cualquier script en la página (un XSS) puede leerlo y robarlo",
      "Porque se borra al cerrar la pestaña",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Una cookie HttpOnly no es accesible desde JavaScript.",
  },
  {
    pregunta: "¿Qué hace la rotación de refresh tokens?",
    opciones: [
      "Cambia el algoritmo de firma",
      "Emite uno nuevo en cada uso e invalida el anterior, detectando reutilizaciones",
      "Alarga la vida del access token",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si aparece un refresh token ya usado, es señal de robo y se revoca la familia.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo se evita el ataque de confusión de algoritmos (RS256 → HS256)?",
    opciones: [
      "Confiando en el header alg",
      "Fijando en el servidor la lista de algoritmos aceptados",
      "Usando secretos más largos",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El header lo controla el atacante; la decisión la toma el servidor.",
  },
  {
    pregunta: "Varios servicios necesitan verificar tokens. ¿Qué conviene?",
    opciones: [
      "HS256 con el secreto copiado en todos",
      "RS256/ES256: firma con clave privada y verificación con la pública (JWKS)",
      "No firmar los tokens",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Así verificar no implica poder emitir tokens.",
  },
];

export default function JwtSesionesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="JWT & sesiones"
      descripcion="Cómo recuerda el servidor quién sos entre requests: sesiones con estado, tokens firmados, dónde guardarlos y cómo revocarlos."
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
            Con <strong className="text-foreground">sesiones</strong>, el
            servidor guarda el estado y el navegador solo tiene un id opaco en
            una cookie: revocar es borrar. Con{" "}
            <strong className="text-foreground">JWT</strong>, el token contiene
            los datos firmados: se verifica sin consultar nada, pero no se puede
            revocar antes de que venza.
          </p>
          <p>
            La firma de un JWT garantiza que nadie modificó el payload; no lo
            oculta. En el inspector, cambiá el rol a <code>admin</code>: el
            payload cambia, pero sin el secreto no se puede recalcular la firma
            y el servidor lo rechaza.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Inspector de JWT">
        <JwtInspector />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Datos sensibles en el payload.</strong>{" "}
            Se leen pegando el token en cualquier decodificador.
          </li>
          <li>
            <strong className="text-foreground">JWT de vida larga sin forma de revocarlos.</strong>{" "}
            Un token robado sirve durante días.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una app web con sesiones en Redis y cookie HttpOnly.</li>
          <li>JWT de vida corta para autenticar llamadas entre servicios.</li>
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
            El token o el id de sesión va en una cookie{" "}
            <strong className="text-foreground">HttpOnly, Secure, SameSite</strong>:
            JavaScript no la lee, viaja solo por HTTPS y no se manda en la
            mayoría de los requests cross-site. El backend la lee de la cookie,
            no del header <code>Authorization</code>.
          </p>
          <p>
            Para revocar JWT: <strong className="text-foreground">access token
            corto</strong> más <strong className="text-foreground">refresh
            token</strong> guardado en el servidor, con rotación y detección de
            reutilización.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Refresh token en localStorage.</strong>{" "}
            Es la credencial de vida larga: es lo último que tiene que quedar expuesto.
          </li>
          <li>
            <strong className="text-foreground">Cookies sin SameSite en una app con formularios.</strong>{" "}
            Abre la puerta a CSRF.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Access token de 15 minutos y refresh de 7 días en cookies separadas.</li>
          <li>Un guard de NestJS que extrae el JWT de la cookie en vez del header.</li>
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
            Las vulnerabilidades de JWT vienen de verificar mal:{" "}
            <code>alg: none</code>, confusión RS256/HS256, secretos débiles, no
            validar <code>exp</code>/<code>iss</code>/<code>aud</code>, o usar{" "}
            <code>decode</code> en vez de <code>verify</code>. Los algoritmos se
            fijan en el servidor.
          </p>
          <p>
            <strong className="text-foreground">HS256</strong> usa un secreto
            compartido (verificar = poder emitir);{" "}
            <strong className="text-foreground">RS256/ES256</strong> separa la
            clave privada que firma de la pública que verifica, distribuida por
            JWKS con rotación por <code>kid</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Confiar en el rol del token para decisiones críticas.</strong>{" "}
            Pudo cambiar después de emitido.
          </li>
          <li>
            <strong className="text-foreground">Copiar el secreto HMAC a cada microservicio.</strong>{" "}
            Cualquiera de ellos comprometido puede fabricar tokens.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Verificar tokens de un proveedor de identidad con su JWKS.</li>
          <li>Auditar la configuración de <code>jwtVerify</code> de un servicio.</li>
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
          <p>¿Qué está mal en este manejo de tokens?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`// login
const token = jwt.sign({ id: u.id, email: u.email, rol: u.rol, dni: u.dni }, "secret", {
  expiresIn: "30d",
});
localStorage.setItem("token", token);

// middleware del backend
const datos = jwt.decode(req.headers.authorization.split(" ")[1]);
if (datos.rol === "admin") return next();`}
          </pre>
          <RevelarSolucion>
            <p>
              1) El payload lleva datos personales (email, DNI) que cualquiera
              puede leer. 2) Secreto trivial (<code>&quot;secret&quot;</code>),
              rompible por fuerza bruta: tiene que ser largo, aleatorio y venir
              de un gestor de secretos. 3) Vence en 30 días sin forma de
              revocarlo: mejor access token corto más refresh token. 4) Guardado
              en <code>localStorage</code>, expuesto a XSS: va en una cookie
              HttpOnly, Secure, SameSite. 5) El backend usa{" "}
              <code>jwt.decode</code>, que NO verifica la firma: cualquiera se
              fabrica un token con <code>rol: &quot;admin&quot;</code>. Hay que
              usar <code>verify</code> con algoritmos fijados, y para acciones de
              admin revalidar el rol contra la base.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
