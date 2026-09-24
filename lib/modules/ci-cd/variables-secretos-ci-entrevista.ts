import type { PreguntaEntrevista } from "../types";

export const entrevistaVariablesSecretosCi: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "En un pipeline, ¿qué diferencia hay entre una variable y un secreto?",
    respuestaEs:
      "Las dos son configuración que el workflow lee sin que esté escrita en el código, pero se tratan distinto. Una VARIABLE (`vars.API_URL` en GitHub Actions) es configuración no sensible: la URL de staging, la versión de Node, un nombre de bucket. Se puede leer desde la interfaz y aparece tal cual en los logs. Un SECRETO (`secrets.DATABASE_URL`) está cifrado, después de guardarlo no se puede volver a ver desde la interfaz, el CI lo enmascara en los logs, y no se entrega a workflows que corren código de forks. Las dos se definen en varios niveles: organización, repositorio y environment; si hay una con el mismo nombre en varios niveles, gana la del environment, lo que permite tener un `API_URL` distinto para staging y producción con el mismo workflow. El criterio para elegir: si filtrarlo le da a alguien acceso a algo, es un secreto; si no, variable. Y ninguno de los dos va en el repositorio, ni siquiera en un `.env` 'de ejemplo' con valores reales.",
    respuestaEn:
      "Both are configuration the workflow reads without it being written in code, but they're handled differently. A VARIABLE (`vars.API_URL` in GitHub Actions) is non-sensitive configuration: the staging URL, the Node version, a bucket name. It's readable in the UI and shows up as-is in logs. A SECRET (`secrets.DATABASE_URL`) is encrypted, can't be viewed again in the UI once saved, is masked in logs by the CI, and isn't passed to workflows running code from forks. Both are defined at several levels: organization, repository and environment; if one with the same name exists at several levels, the environment one wins, which lets you have a different `API_URL` for staging and production with the same workflow. The choice criterion: if leaking it gives someone access to something, it's a secret; otherwise, a variable. And neither goes in the repository, not even in a 'sample' `.env` with real values.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo manejás la configuración distinta por entorno?",
    respuestaEs:
      "Con el mismo código y el mismo artefacto en todos los entornos, cambiando solo la configuración, que llega por variables de entorno (el principio de config de la metodología twelve-factor). En GitHub Actions, cada entorno es un environment (staging, production) con sus propias variables y secretos, y el job de deploy declara a cuál apunta; en la plataforma de runtime (Vercel, ECS, Cloud Run), cada entorno tiene sus variables configuradas. En local, un `.env` que está en `.gitignore`, más un `.env.example` commiteado con los nombres y valores ficticios, para que cualquiera sepa qué hace falta. Una práctica que evita muchos incidentes: VALIDAR la configuración al arrancar. Si falta una variable o tiene un formato inválido, la app tiene que fallar en el arranque con un mensaje claro, no media hora después cuando alguien usa la funcionalidad que la necesita; con un schema de Zod sobre `process.env` se valida y además queda tipada.",
    respuestaEn:
      "With the same code and the same artifact in every environment, changing only configuration, delivered through environment variables (the config principle of the twelve-factor methodology). In GitHub Actions, each environment is an environment (staging, production) with its own variables and secrets, and the deploy job declares which it targets; on the runtime platform (Vercel, ECS, Cloud Run), each environment has its variables configured. Locally, a `.env` in `.gitignore`, plus a committed `.env.example` with names and dummy values, so anyone knows what's needed. A practice that prevents many incidents: VALIDATE configuration at startup. If a variable is missing or malformed, the app should fail at boot with a clear message, not half an hour later when someone uses the feature needing it; a Zod schema over `process.env` validates it and also types it.",
    codigo: `// config.ts: se evalúa al arrancar; si falta algo, el proceso no levanta
import { z } from "zod";

const esquema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
});

export const config = esquema.parse(process.env);`,
  },
  {
    nivel: 2,
    pregunta: "¿Qué diferencia hay entre configuración de build y de runtime, y por qué importa?",
    respuestaEs:
      "La de RUNTIME se lee cuando la aplicación corre (`process.env.DATABASE_URL` en el servidor): el mismo artefacto sirve para cualquier entorno, porque cada uno le pasa sus valores al arrancar. La de BUILD queda grabada en el artefacto al construirlo. El caso típico es el frontend: en Next.js, las variables `NEXT_PUBLIC_` se reemplazan por su valor literal en el JavaScript que va al navegador durante el build, porque el navegador no tiene `process.env`. Eso tiene dos consecuencias. Seguridad: todo lo que sea `NEXT_PUBLIC_` es público, nunca un secreto. Y deploy: si la URL de la API es `NEXT_PUBLIC_API_URL`, el artefacto de staging tiene grabada la URL de staging, y no se puede promover el mismo build a producción, lo que rompe la idea de build once, deploy many. Las salidas: construir una vez por entorno (simple, pero lo que llega a producción no es exactamente lo que se probó), leer esa configuración en el servidor y pasársela al cliente al renderizar, o exponer un endpoint de configuración que el cliente lee al cargar. En Docker pasa lo mismo: un `ARG` se usa en el build y un `ENV` al correr.",
    respuestaEn:
      "RUNTIME configuration is read when the application runs (`process.env.DATABASE_URL` on the server): the same artifact works for any environment, since each passes its values at startup. BUILD configuration is baked into the artifact when building it. The typical case is the frontend: in Next.js, `NEXT_PUBLIC_` variables are replaced with their literal value in the JavaScript shipped to the browser during the build, because the browser has no `process.env`. That has two consequences. Security: anything `NEXT_PUBLIC_` is public, never a secret. And deployment: if the API URL is `NEXT_PUBLIC_API_URL`, the staging artifact has the staging URL baked in, and you can't promote the same build to production, breaking the build once, deploy many idea. The ways out: build once per environment (simple, but what reaches production isn't exactly what was tested), read that configuration on the server and pass it to the client when rendering, or expose a configuration endpoint the client reads on load. Docker is the same: an `ARG` is used at build time and an `ENV` at run time.",
    tradeoffs:
      "Build por entorno es simple pero rompe build once, deploy many; configuración en runtime mantiene un solo artefacto a cambio de un paso más para llevarla al cliente.",
  },
  {
    nivel: 2,
    pregunta: "El CI enmascara los secretos en los logs. ¿Alcanza con eso?",
    respuestaEs:
      "No, y confiar en eso es un error frecuente. El enmascarado busca el valor EXACTO del secreto en la salida y lo reemplaza por `***`; cualquier transformación lo esquiva. Si un script imprime el secreto en base64, url-encoded, escapado dentro de un JSON o solo una parte, sale en claro. Los secretos de varias líneas (una clave privada) pueden no enmascararse bien línea por línea. Si un paso deriva un valor sensible (un token que obtiene en tiempo de ejecución), no está registrado como secreto y hay que enmascararlo explícitamente (en GitHub Actions, con `::add-mask::`). Además, los logs no son la única salida: un secreto puede terminar en un artifact subido, en la cache, en una imagen Docker construida en el job, o en el mensaje de error de una herramienta que imprime su configuración. Y `set -x` en un script de bash imprime cada comando con sus variables expandidas. Lo que funciona: no imprimir secretos nunca, pasarlos por variables de entorno solo a los steps que los usan, y tratar los logs de CI como algo que puede leer mucha gente.",
    respuestaEn:
      "No, and relying on it is a frequent mistake. Masking looks for the secret's EXACT value in the output and replaces it with `***`; any transformation evades it. If a script prints the secret base64-encoded, url-encoded, escaped inside JSON or only partially, it comes out in the clear. Multi-line secrets (a private key) may not be masked well line by line. If a step derives a sensitive value (a token it obtains at runtime), it isn't registered as a secret and must be masked explicitly (in GitHub Actions, with `::add-mask::`). Also, logs aren't the only output: a secret can end up in an uploaded artifact, in the cache, in a Docker image built in the job, or in a tool's error message that prints its configuration. And `set -x` in a bash script prints each command with its variables expanded. What works: never print secrets, pass them via environment variables only to the steps that use them, and treat CI logs as something many people can read.",
  },
  {
    nivel: 3,
    pregunta: "¿Cómo funciona OIDC entre GitHub Actions y un proveedor cloud, y dónde se configura mal?",
    respuestaEs:
      "En vez de guardar una clave de larga vida del cloud como secreto, el workflow pide a GitHub un token OIDC: un JWT firmado por GitHub que describe quién lo pide. Para eso el job necesita `permissions: id-token: write`. Los claims importantes son `aud` (para quién es el token) y `sub`, que identifica el origen: por ejemplo `repo:mi-org/mi-repo:ref:refs/heads/main` o `repo:mi-org/mi-repo:environment:production`. El workflow presenta ese JWT al cloud (en AWS, `AssumeRoleWithWebIdentity`), que verifica la firma contra el proveedor de identidad de GitHub configurado y evalúa la TRUST POLICY del rol: si las condiciones sobre `aud` y `sub` se cumplen, entrega credenciales temporales que vencen en minutos. Nada queda guardado que se pueda filtrar. El error clásico está en esa trust policy: una condición demasiado amplia sobre `sub`, como `repo:mi-org/*` o `repo:mi-org/mi-repo:*`, deja que cualquier repo de la organización, o cualquier branch o PR del repo, asuma el rol de producción. Lo correcto es atar el rol de producción al environment protegido (`environment:production`), así solo lo asumen jobs que pasaron sus reglas de aprobación, y tener roles distintos, con permisos mínimos, por entorno.",
    respuestaEn:
      "Instead of storing a long-lived cloud key as a secret, the workflow asks GitHub for an OIDC token: a JWT signed by GitHub describing who's asking. The job needs `permissions: id-token: write` for that. The important claims are `aud` (who the token is for) and `sub`, identifying the origin: for example `repo:my-org/my-repo:ref:refs/heads/main` or `repo:my-org/my-repo:environment:production`. The workflow presents that JWT to the cloud (in AWS, `AssumeRoleWithWebIdentity`), which verifies the signature against the configured GitHub identity provider and evaluates the role's TRUST POLICY: if the conditions on `aud` and `sub` hold, it issues temporary credentials that expire in minutes. Nothing is stored that could leak. The classic mistake is in that trust policy: an overly broad condition on `sub`, like `repo:my-org/*` or `repo:my-org/my-repo:*`, lets any repo in the organization, or any branch or PR of the repo, assume the production role. The right approach is tying the production role to the protected environment (`environment:production`), so only jobs that passed its approval rules can assume it, and having distinct, least-privilege roles per environment.",
    codigo: `// trust policy del rol de producción en AWS (fragmento)
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
    // solo jobs del environment protegido de este repo
    "token.actions.githubusercontent.com:sub": "repo:mi-org/mi-repo:environment:production"
  }
}
// peligroso: "StringLike": { "...:sub": "repo:mi-org/*" } → cualquier repo de la org`,
  },
  {
    nivel: 3,
    pregunta: "¿Los secretos de runtime de la aplicación deberían pasar por el pipeline?",
    respuestaEs:
      "Idealmente no, y es una decisión de diseño que reduce el daño de un pipeline comprometido. Hay dos modelos. INYECTADOS DESDE EL CI: el workflow tiene la contraseña de la base y la configura en la plataforma al desplegar. Es simple, pero el CI, que corre código de muchas personas y dependencias de terceros, termina teniendo todas las credenciales de producción, y rotar un secreto implica volver a correr el pipeline. LEÍDOS EN RUNTIME: la aplicación obtiene sus secretos al arrancar desde un secret manager (AWS Secrets Manager, GCP Secret Manager, Vault) usando la identidad de su propia carga de trabajo (el rol IAM de la tarea o del pod), y el CI solo tiene permisos para desplegar, no para leer secretos. Así, un workflow comprometido puede desplegar algo (lo que se mitiga con reviews y environments protegidos) pero no leer la base de producción, la rotación ocurre en el secret manager sin tocar el pipeline, y el acceso queda auditado. Plataformas como Vercel lo resuelven a su manera, con variables configuradas en la plataforma que el CI no necesita conocer. El costo del segundo modelo es más infraestructura y una dependencia más al arrancar, así que para proyectos chicos el primero es aceptable con secretos por environment y permisos mínimos.",
    respuestaEn:
      "Ideally not, and it's a design decision that limits the damage of a compromised pipeline. There are two models. INJECTED FROM CI: the workflow holds the database password and sets it on the platform when deploying. It's simple, but the CI, which runs code from many people and third-party dependencies, ends up holding every production credential, and rotating a secret means re-running the pipeline. READ AT RUNTIME: the application fetches its secrets at startup from a secret manager (AWS Secrets Manager, GCP Secret Manager, Vault) using its own workload identity (the task's or pod's IAM role), and the CI only has permission to deploy, not to read secrets. That way, a compromised workflow can deploy something (mitigated with reviews and protected environments) but can't read the production database, rotation happens in the secret manager without touching the pipeline, and access is audited. Platforms like Vercel solve it their own way, with variables configured on the platform that the CI doesn't need to know. The cost of the second model is more infrastructure and one more startup dependency, so for small projects the first is acceptable with per-environment secrets and least privilege.",
    tradeoffs:
      "Inyectar desde el CI es simple pero concentra credenciales en el pipeline; leer en runtime reduce el radio de impacto a cambio de más infraestructura.",
  },
];
