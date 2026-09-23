import type { PreguntaEntrevista } from "../types";

export const entrevistaRbacAbac: PreguntaEntrevista[] = [
  {
    nivel: 1,
    pregunta: "¿Qué diferencia hay entre RBAC y ABAC?",
    respuestaEs:
      "RBAC (Role-Based Access Control) asigna permisos a ROLES y roles a usuarios: un editor puede editar y publicar, un lector solo ver. Es simple de entender, auditar y administrar ('¿qué puede hacer un editor?' tiene una respuesta directa), y alcanza para muchas aplicaciones. Su límite aparece cuando el permiso depende del contexto: 'un editor puede editar documentos, pero solo los de su departamento, y solo si no están publicados'. Con RBAC puro eso lleva a una explosión de roles (editor-ventas, editor-legales, editor-ventas-borradores...). ABAC (Attribute-Based Access Control) decide con reglas sobre ATRIBUTOS: del usuario (rol, departamento, antigüedad), del recurso (dueño, estado, confidencialidad), de la acción y del contexto (hora, IP, dispositivo). Es mucho más expresivo, a cambio de reglas más difíciles de auditar y probar. En la práctica se combinan: roles como un atributo más, y reglas sobre el recurso para lo que el rol no alcanza.",
    respuestaEn:
      "RBAC (Role-Based Access Control) assigns permissions to ROLES and roles to users: an editor can edit and publish, a reader can only view. It's simple to understand, audit and administer ('what can an editor do?' has a direct answer), and it's enough for many applications. Its limit shows when permission depends on context: 'an editor can edit documents, but only their department's, and only if unpublished'. With pure RBAC that leads to role explosion (sales-editor, legal-editor, sales-editor-drafts...). ABAC (Attribute-Based Access Control) decides with rules over ATTRIBUTES: of the user (role, department, seniority), the resource (owner, status, confidentiality), the action and the context (time, IP, device). It's far more expressive, at the cost of rules that are harder to audit and test. In practice they're combined: roles as one more attribute, and rules on the resource for what the role can't express.",
  },
  {
    nivel: 1,
    pregunta: "¿Cómo implementarías RBAC en una aplicación?",
    respuestaEs:
      "Primero modelando PERMISOS en vez de chequear roles por todo el código: definir acciones concretas (`pedido:leer`, `pedido:reembolsar`, `usuario:invitar`) y un mapeo de rol a permisos en un solo lugar. El código pregunta `puede(usuario, 'pedido:reembolsar')` y no `usuario.rol === 'admin'`; así, crear un rol nuevo o mover un permiso es cambiar el mapeo, no buscar `if` por toda la base. Los roles y sus permisos pueden vivir en la configuración (si son fijos) o en la base (si los administradores los gestionan). La verificación se hace en el servidor, en cada endpoint o Server Action, típicamente con un guard o decorator (`@Roles()` o `@RequierePermiso()` en NestJS) para que sea declarativa y difícil de olvidar; en el frontend los mismos permisos solo deciden qué mostrar. Y los cambios de rol tienen que tener efecto enseguida, así que conviene leerlos de la sesión del servidor o de la base, no de un token de larga duración.",
    respuestaEn:
      "First by modeling PERMISSIONS instead of checking roles all over the code: define concrete actions (`order:read`, `order:refund`, `user:invite`) and a role-to-permissions mapping in one place. Code asks `can(user, 'order:refund')`, not `user.role === 'admin'`; so creating a new role or moving a permission means changing the mapping, not hunting `if`s through the codebase. Roles and their permissions can live in config (if fixed) or in the database (if admins manage them). Verification happens on the server, at every endpoint or Server Action, typically via a guard or decorator (`@Roles()` or `@RequirePermission()` in NestJS) so it's declarative and hard to forget; on the frontend, the same permissions only decide what to show. And role changes must take effect immediately, so read them from the server session or database, not from a long-lived token.",
    codigo: `const PERMISOS = {
  lector: ["pedido:leer"],
  soporte: ["pedido:leer", "pedido:reembolsar"],
  admin: ["pedido:leer", "pedido:reembolsar", "usuario:invitar"],
} as const satisfies Record<Rol, readonly Permiso[]>;

export function puede(usuario: Usuario, permiso: Permiso) {
  return (PERMISOS[usuario.rol] as readonly Permiso[]).includes(permiso);
}`,
  },
  {
    nivel: 2,
    pregunta: "¿Cómo se resuelve la autorización en un SaaS multi-tenant?",
    respuestaEs:
      "El tenant (la organización o cuenta cliente) es el atributo más importante: un usuario jamás puede ver datos de otra organización, sin importar su rol. Hay dos capas. Aislamiento: cada consulta se filtra por `organizacionId`, idealmente de forma que sea imposible olvidarlo: una capa de acceso a datos que lo agrega siempre, un cliente de ORM extendido por request, o Row Level Security en Postgres, donde la base misma filtra según el tenant de la conexión. Roles por tenant: un mismo usuario puede ser admin en una organización y lector en otra, así que el rol no es un campo del usuario sino de la membresía (usuario + organización + rol). La organización activa sale de la sesión o del subdominio, y se verifica que el usuario sea miembro antes de cualquier otra cosa. Los tests de aislamiento entre tenants son de los más importantes del sistema: una fuga entre clientes es de los incidentes más graves para un SaaS.",
    respuestaEn:
      "The tenant (the customer organization or account) is the most important attribute: a user must never see another organization's data, regardless of role. There are two layers. Isolation: every query is filtered by `organizationId`, ideally in a way that can't be forgotten: a data access layer that always adds it, a per-request extended ORM client, or Row Level Security in Postgres, where the database itself filters by the connection's tenant. Per-tenant roles: the same user can be admin in one organization and reader in another, so the role isn't a user field but a membership field (user + organization + role). The active organization comes from the session or subdomain, and membership is verified before anything else. Cross-tenant isolation tests are among the most important in the system: a leak between customers is one of the worst incidents for a SaaS.",
    tradeoffs:
      "Row Level Security garantiza el aislamiento aunque el código se olvide del filtro, a cambio de lógica en la base que es más difícil de testear y depurar, y de cuidar el manejo de conexiones.",
  },
  {
    nivel: 2,
    pregunta: "¿Qué es el principio de mínimo privilegio y cómo se aplica más allá de los usuarios?",
    respuestaEs:
      "Cada actor tiene que tener exactamente los permisos que necesita para su función, y nada más, durante el menor tiempo posible. Con usuarios: roles acotados, permisos elevados solo cuando hacen falta (y con aprobación o expiración), y revisiones periódicas para sacar accesos que ya no se usan. Pero aplica igual a lo que no es humano, donde se suele descuidar más: el usuario de base de datos de la aplicación no debería poder borrar tablas ni ser superusuario (uno para migraciones, otro con permisos de lectura y escritura para la app); las credenciales de cloud de un servicio solo acceden a su bucket o su cola; un token de GitHub en el CI tiene los scopes mínimos y los permisos del workflow se declaran explícitamente; y las API keys de terceros se crean con el alcance más restringido que ofrece el proveedor. El objetivo es limitar el daño: cuando una credencial se filtra o un componente se compromete, el atacante hereda solo esos permisos.",
    respuestaEn:
      "Every actor should have exactly the permissions needed for its function, nothing more, for the shortest time possible. With users: scoped roles, elevated permissions only when needed (with approval or expiry), and periodic reviews to remove unused access. But it applies equally to non-humans, where it's more often neglected: the app's database user shouldn't be able to drop tables or be superuser (one for migrations, another with read/write for the app); a service's cloud credentials only reach its bucket or queue; a GitHub token in CI has minimal scopes and workflow permissions are declared explicitly; and third-party API keys are created with the narrowest scope the provider offers. The goal is limiting damage: when a credential leaks or a component is compromised, the attacker inherits only those permissions.",
  },
  {
    nivel: 3,
    pregunta: "¿Qué es ReBAC y cuándo lo necesitás?",
    respuestaEs:
      "Relationship-Based Access Control decide según RELACIONES entre objetos, modeladas como un grafo: 'Ana es editora de la carpeta X', 'el documento Y está en la carpeta X', entonces Ana puede editar Y; 'Beto es miembro del equipo Z, que tiene acceso de lectura al proyecto W'. Es el modelo de Google Drive, GitHub o Notion, donde los permisos se heredan por jerarquías y se comparten con personas y grupos. Está descrito en el paper Zanzibar de Google y lo implementan sistemas como SpiceDB, OpenFGA o Permify. Lo necesitás cuando el acceso se comparte recurso por recurso, hay herencia (carpetas, organizaciones, equipos anidados) y preguntas como '¿quién tiene acceso a este documento?' o 'listar todo lo que Ana puede ver'. Hacer eso con RBAC o ABAC sobre tablas propias se vuelve lento y complejo. El costo: otro sistema que operar, mantener sincronizadas las relaciones con los datos de la aplicación, y una forma distinta de modelar.",
    respuestaEn:
      "Relationship-Based Access Control decides based on RELATIONSHIPS between objects, modeled as a graph: 'Ana is an editor of folder X', 'document Y is in folder X', so Ana can edit Y; 'Beto is a member of team Z, which has read access to project W'. It's the model of Google Drive, GitHub or Notion, where permissions inherit through hierarchies and are shared with people and groups. It's described in Google's Zanzibar paper and implemented by systems like SpiceDB, OpenFGA or Permify. You need it when access is shared resource by resource, there's inheritance (folders, organizations, nested teams) and questions like 'who has access to this document?' or 'list everything Ana can see'. Doing that with RBAC or ABAC over your own tables gets slow and complex. The cost: another system to operate, keeping relationships in sync with app data, and a different way of modeling.",
  },
  {
    nivel: 3,
    pregunta: "¿Conviene sacar la lógica de autorización del código a un motor de políticas?",
    respuestaEs:
      "Motores como Open Policy Agent (con el lenguaje Rego), Cedar (de AWS) o Casbin permiten escribir las políticas de autorización como reglas declarativas separadas del código de la aplicación, y el código solo pregunta '¿este sujeto puede hacer esta acción sobre este recurso?'. Ventajas: las políticas se versionan, revisan y testean por separado; se pueden aplicar las mismas reglas en varios servicios y lenguajes; seguridad o compliance pueden auditarlas sin leer todo el código; y se pueden cambiar sin redeploy. Desventajas: otro lenguaje que aprender, latencia si el motor es un servicio aparte, la dificultad de pasarle al motor todos los atributos que necesita (los datos viven en tu base), y la tentación de sobre-ingeniería. Para una aplicación con reglas moderadas, una capa de autorización bien centralizada en el propio código (funciones `puede...` testeadas) suele alcanzar; un motor rinde cuando hay muchos servicios, reglas complejas o requisitos de auditoría fuertes.",
    respuestaEn:
      "Engines like Open Policy Agent (with the Rego language), Cedar (from AWS) or Casbin let you write authorization policies as declarative rules separate from app code, and the code just asks 'may this subject perform this action on this resource?'. Advantages: policies are versioned, reviewed and tested separately; the same rules apply across several services and languages; security or compliance can audit them without reading all the code; and they can change without redeploying. Disadvantages: another language to learn, latency if the engine is a separate service, the difficulty of feeding the engine every attribute it needs (the data lives in your database), and the temptation to over-engineer. For an app with moderate rules, a well-centralized authorization layer in the code itself (tested `can...` functions) is usually enough; an engine pays off with many services, complex rules or strong audit requirements.",
  },
];
