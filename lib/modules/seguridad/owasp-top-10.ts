export interface CasoVulnerable {
  id: string;
  titulo: string;
  codigo: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
  fix: string;
}

export const CASOS: CasoVulnerable[] = [
  {
    id: "sql",
    titulo: "Buscador de productos",
    codigo: `const q = req.query.q;
const filas = await db.$queryRawUnsafe(
  \`SELECT * FROM productos WHERE nombre LIKE '%\${q}%'\`
);`,
    opciones: ["Broken Access Control", "Injection", "Security Misconfiguration"],
    correcta: 1,
    explicacion:
      "El input del usuario se concatena en la consulta. Con q = `' OR '1'='1` (o algo peor, como un UNION o un DROP), el atacante cambia la consulta.",
    fix: `const filas = await db.$queryRaw\`
  SELECT * FROM productos WHERE nombre LIKE \${"%" + q + "%"}
\`; // parámetros, nunca concatenación`,
  },
  {
    id: "idor",
    titulo: "Descargar una factura",
    codigo: `app.get("/facturas/:id", requireLogin, async (req, res) => {
  const factura = await db.factura.findUnique({ where: { id: req.params.id } });
  res.json(factura);
});`,
    opciones: ["Broken Access Control", "Cryptographic Failures", "Injection"],
    correcta: 0,
    explicacion:
      "Verifica que haya sesión, pero no que la factura sea del usuario: cambiando el id se descargan facturas ajenas (IDOR). Es la categoría número uno del Top 10.",
    fix: `const factura = await db.factura.findFirst({
  where: { id: req.params.id, clienteId: req.user.id },
});
if (!factura) return res.sendStatus(404);`,
  },
  {
    id: "hash",
    titulo: "Registro de usuarios",
    codigo: `const hash = crypto.createHash("md5").update(password).digest("hex");
await db.usuario.create({ data: { email, password: hash } });`,
    opciones: ["Injection", "Cryptographic Failures", "Insecure Design"],
    correcta: 1,
    explicacion:
      "MD5 (y SHA-256 solo) son rapidísimos: con una base filtrada se prueban miles de millones de contraseñas por segundo. Faltan un algoritmo lento y sal por usuario.",
    fix: `import { hash } from "@node-rs/argon2";
const passwordHash = await hash(password); // argon2id, con sal incluida`,
  },
  {
    id: "ssrf",
    titulo: "Vista previa de un link",
    codigo: `app.post("/preview", async (req, res) => {
  const html = await fetch(req.body.url).then((r) => r.text());
  res.json({ titulo: extraerTitulo(html) });
});`,
    opciones: ["Server-Side Request Forgery (SSRF)", "Broken Access Control", "Security Logging Failures"],
    correcta: 0,
    explicacion:
      "El servidor hace un request a cualquier URL que mande el usuario, incluidas direcciones internas: http://169.254.169.254 (metadata del cloud, con credenciales) o servicios de la red privada.",
    fix: `// validar esquema y resolver el host: rechazar IPs privadas,
// loopback y link-local; usar una allowlist si es posible
if (!esUrlPublicaPermitida(req.body.url)) return res.sendStatus(400);`,
  },
  {
    id: "config",
    titulo: "Manejo de errores en producción",
    codigo: `app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack, query: err.sql });
});`,
    opciones: ["Security Misconfiguration", "Injection", "Vulnerable Components"],
    correcta: 0,
    explicacion:
      "Devuelve el stack trace y la consulta SQL al cliente: le regala al atacante rutas, versiones y estructura de la base.",
    fix: `app.use((err, req, res, next) => {
  logger.error({ err, requestId: req.id });          // el detalle va a los logs
  res.status(500).json({ error: "Error interno", requestId: req.id });
});`,
  },
  {
    id: "login",
    titulo: "Endpoint de login",
    codigo: `app.post("/login", async (req, res) => {
  const u = await db.usuario.findUnique({ where: { email: req.body.email } });
  if (!u) return res.status(401).json({ error: "El email no existe" });
  if (!(await verify(u.password, req.body.password)))
    return res.status(401).json({ error: "Contraseña incorrecta" });
  crearSesion(res, u);
});`,
    opciones: ["Identification and Authentication Failures", "Cryptographic Failures", "SSRF"],
    correcta: 0,
    explicacion:
      "Sin rate limiting permite fuerza bruta y credential stuffing, y los mensajes distintos revelan qué emails están registrados (enumeración de usuarios).",
    fix: `// rate limit por IP y por cuenta, mensaje único,
// y MFA para cuentas sensibles
return res.status(401).json({ error: "Email o contraseña incorrectos" });`,
  },
];
