import type { PreguntaEntrevista } from "../types";

export const entrevistaSecretsManagement: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Dónde guardás los secretos de una aplicación (API keys, contraseñas de base)?",
    respuestaEs:
      "Nunca en el código ni en el repositorio, ni siquiera en uno privado: el historial de git es permanente, el repo se clona en muchas máquinas y los accesos cambian con el tiempo. En desarrollo local, en un archivo `.env` que está en el `.gitignore`, con un `.env.example` commiteado que lista los NOMBRES de las variables sin valores. En producción, en las variables de entorno del proveedor de deploy (Vercel, Railway, Fly) o, mejor, en un gestor de secretos (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler, Infisical), que agregan cifrado, control de acceso, auditoría de quién leyó qué y rotación. El código solo referencia el nombre (`process.env.STRIPE_SECRET_KEY`) y conviene validar al arrancar que todas las variables necesarias existan, con un esquema, para fallar rápido en vez de a mitad de un request.",
    respuestaEn:
      "Never in code or in the repository, not even a private one: git history is permanent, the repo is cloned onto many machines and access changes over time. In local development, in a `.env` file listed in `.gitignore`, with a committed `.env.example` listing variable NAMES without values. In production, in the deploy provider's environment variables (Vercel, Railway, Fly) or, better, in a secrets manager (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, Doppler, Infisical), which add encryption, access control, auditing of who read what, and rotation. Code only references the name (`process.env.STRIPE_SECRET_KEY`), and you should validate at startup that all required variables exist, with a schema, to fail fast rather than mid-request.",
    codigo: `// env.ts: falla al arrancar si falta algo
import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  })
  .parse(process.env);`,
  },
  {
    nivel: 1,
    pregunta: "¿Qué pasa con una variable `NEXT_PUBLIC_` en Next.js y por qué es un error común de seguridad?",
    respuestaEs:
      "Next.js reemplaza en el BUILD cada `process.env.NEXT_PUBLIC_ALGO` por su valor literal dentro del JavaScript que se manda al navegador, para que el código del cliente pueda leerla. Eso significa que cualquiera puede verla abriendo las DevTools o descargando el bundle. Es correcto para valores públicos por naturaleza (la URL de la API, la clave publicable de Stripe `pk_`, el id de analytics), pero es un error grave ponerle el prefijo a un secreto 'para que funcione en el cliente': si el cliente necesita llamar a un servicio con una clave secreta, esa llamada tiene que pasar por el servidor (un Route Handler, una Server Action o un BFF) que usa la clave sin exponerla. Las variables SIN el prefijo solo existen en el servidor y Next las reemplaza por vacío en el bundle del cliente. Mismo concepto en Vite con `VITE_` y en Create React App con `REACT_APP_`.",
    respuestaEn:
      "Next.js replaces at BUILD time every `process.env.NEXT_PUBLIC_SOMETHING` with its literal value inside the JavaScript sent to the browser, so client code can read it. That means anyone can see it by opening DevTools or downloading the bundle. It's correct for inherently public values (the API URL, Stripe's publishable `pk_` key, the analytics id), but it's a serious mistake to add the prefix to a secret 'so it works on the client': if the client needs to call a service with a secret key, that call must go through the server (a Route Handler, Server Action or BFF) that uses the key without exposing it. Variables WITHOUT the prefix only exist on the server and Next replaces them with empty values in the client bundle. Same concept in Vite with `VITE_` and in Create React App with `REACT_APP_`.",
  },
  {
    nivel: 2,
    pregunta: "Un desarrollador commiteó una API key y la pusheó. ¿Qué hacés?",
    respuestaEs:
      "Lo primero es ROTAR: revocar la clave en el proveedor y generar una nueva, de inmediato, asumiendo que ya fue vista (hay bots que escanean GitHub buscando secretos en segundos después de cada push). Borrar el archivo en un commit nuevo NO sirve: el secreto sigue en el historial y en todos los clones y forks. Después: revisar los logs del proveedor para ver si hubo uso no autorizado desde que se expuso; cargar la clave nueva en el gestor de secretos o en las variables del entorno y redeployar. Recién entonces, si hace falta, limpiar el historial (git filter-repo o BFG, con force push coordinado con el equipo), sabiendo que es secundario porque la clave ya no sirve. Y prevenir la próxima: escaneo en pre-commit (gitleaks), push protection de GitHub, secret scanning en el CI, y un postmortem sin culpas sobre por qué el secreto estaba en un archivo que se podía commitear.",
    respuestaEn:
      "First, ROTATE: revoke the key at the provider and generate a new one, immediately, assuming it's already been seen (bots scan GitHub for secrets within seconds of each push). Deleting the file in a new commit does NOT help: the secret remains in history and in every clone and fork. Then: review the provider's logs for unauthorized use since exposure; load the new key into the secrets manager or environment variables and redeploy. Only then, if needed, clean the history (git filter-repo or BFG, with a force push coordinated with the team), knowing it's secondary since the key no longer works. And prevent the next one: pre-commit scanning (gitleaks), GitHub push protection, CI secret scanning, and a blameless postmortem on why the secret was in a committable file.",
    tradeoffs:
      "Reescribir el historial rompe los clones de todo el equipo y no elimina las copias ya descargadas; por eso la rotación es la única respuesta que realmente cierra la exposición.",
  },
  {
    nivel: 2,
    pregunta: "¿Cómo manejás los secretos en un pipeline de CI/CD?",
    respuestaEs:
      "Con el almacén de secretos del propio CI (GitHub Actions secrets, GitLab CI variables) o, mejor, con credenciales temporales sin secretos guardados: OIDC entre el CI y el cloud, donde el workflow obtiene credenciales de corta duración asumiendo un rol en AWS o GCP según el repo y la rama, sin ninguna clave de larga vida almacenada. Además: secretos con alcance mínimo (por entorno: el de staging no sirve en producción) y protegidos por environments con aprobación para producción; no exponerlos a workflows que corren con código de forks (los pull requests de terceros no deberían tener acceso a secretos); cuidar que no se impriman en los logs (los CI los enmascaran, pero no si se transforman, por ejemplo en base64); fijar por hash las acciones de terceros, porque una action comprometida corre con acceso a tus secretos; y declarar explícitamente los `permissions` mínimos del token del workflow.",
    respuestaEn:
      "With the CI's own secret store (GitHub Actions secrets, GitLab CI variables) or, better, with temporary credentials and no stored secrets: OIDC between CI and cloud, where the workflow gets short-lived credentials by assuming a role in AWS or GCP based on repo and branch, with no long-lived key stored. Also: minimally scoped secrets (per environment: staging's don't work in production) protected by environments requiring approval for production; not exposing them to workflows running fork code (third-party pull requests shouldn't access secrets); making sure they aren't printed in logs (CI masks them, but not if transformed, e.g. base64); pinning third-party actions by hash, since a compromised action runs with access to your secrets; and explicitly declaring the workflow token's minimal `permissions`.",
  },
  {
    nivel: 3,
    pregunta: "¿Por qué rotar secretos periódicamente y cómo se hace sin downtime?",
    respuestaEs:
      "Porque un secreto puede filtrarse sin que te enteres (un log, un backup, un ex empleado, una laptop robada), y la rotación acota cuánto tiempo sirve. Además, practicarla hace que, el día que hay una filtración real, rotar sea un procedimiento conocido y no una emergencia improvisada. Para rotar sin downtime el sistema tiene que aceptar DOS versiones válidas durante la transición: se genera el secreto nuevo, se configura el consumidor para aceptar ambos (o el proveedor permite dos claves activas a la vez, como muchas APIs y los usuarios duales de base de datos), se despliega el uso del nuevo, se verifica que nada use el viejo y recién ahí se revoca. En firmas de tokens se hace con varios `kid` en el JWKS: se empieza a firmar con la clave nueva y se sigue verificando con la vieja hasta que venzan los tokens emitidos con ella. Los gestores de secretos automatizan buena parte (AWS Secrets Manager rota contraseñas de RDS). El ideal final son credenciales dinámicas de vida corta (Vault genera un usuario de base por servicio con TTL), donde rotar deja de ser un evento.",
    respuestaEn:
      "Because a secret can leak without you knowing (a log, a backup, a former employee, a stolen laptop), and rotation limits how long it's useful. Also, practicing it means that, the day there's a real leak, rotating is a known procedure rather than an improvised emergency. To rotate without downtime the system must accept TWO valid versions during the transition: generate the new secret, configure the consumer to accept both (or the provider allows two active keys at once, like many APIs and dual database users), deploy use of the new one, verify nothing uses the old one, and only then revoke it. For token signing it's done with several `kid`s in the JWKS: start signing with the new key and keep verifying with the old one until tokens issued with it expire. Secrets managers automate much of it (AWS Secrets Manager rotates RDS passwords). The end goal is short-lived dynamic credentials (Vault generates a per-service database user with a TTL), where rotation stops being an event.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es el cifrado de sobre (envelope encryption) y para qué sirve un KMS?",
    respuestaEs:
      "Cuando hay que cifrar datos sensibles en tu propia base (documentos, tokens de terceros, datos personales), el problema es dónde guardar la clave de cifrado: si está al lado de los datos, un acceso a la base da todo. Con envelope encryption se usan dos niveles de claves: cada dato (o grupo de datos) se cifra con una DATA KEY propia, y esa data key se guarda cifrada con una KEY ENCRYPTION KEY que vive en un KMS (AWS KMS, GCP KMS, un HSM) y nunca sale de ahí. Para descifrar, la aplicación le pide al KMS que descifre la data key (una operación autenticada, con permisos y auditada), la usa en memoria y la descarta. Ventajas: la clave maestra nunca está en la aplicación ni en la base; se puede revocar el acceso cortando el permiso al KMS; rotar la clave maestra no obliga a recifrar todos los datos, solo las data keys; y cada uso queda registrado. Es lo que usan por debajo los servicios de cloud cuando ofrecen cifrado en reposo con claves administradas por el cliente.",
    respuestaEn:
      "When sensitive data must be encrypted in your own database (documents, third-party tokens, personal data), the problem is where to keep the encryption key: if it sits next to the data, database access yields everything. With envelope encryption there are two key levels: each piece (or group) of data is encrypted with its own DATA KEY, and that data key is stored encrypted with a KEY ENCRYPTION KEY that lives in a KMS (AWS KMS, GCP KMS, an HSM) and never leaves it. To decrypt, the app asks the KMS to decrypt the data key (an authenticated, permissioned, audited operation), uses it in memory and discards it. Advantages: the master key is never in the app or database; access can be revoked by removing the KMS permission; rotating the master key doesn't require re-encrypting all data, just the data keys; and every use is logged. It's what cloud services use under the hood when offering encryption at rest with customer-managed keys.",
  },
];
