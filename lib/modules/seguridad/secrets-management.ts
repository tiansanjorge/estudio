export interface PatronSecreto {
  id: string;
  nombre: string;
  regex: RegExp;
  riesgo: string;
}

export const PATRONES: PatronSecreto[] = [
  {
    id: "aws",
    nombre: "AWS Access Key ID",
    regex: /AKIA[0-9A-Z]{16}/g,
    riesgo: "Con el secret key asociado da acceso a la cuenta de AWS con los permisos de ese usuario.",
  },
  {
    id: "stripe",
    nombre: "Stripe secret key",
    regex: /sk_(live|test)_[0-9a-zA-Z]{16,}/g,
    riesgo: "Permite cobrar, reembolsar y leer datos de clientes desde la API de Stripe.",
  },
  {
    id: "github",
    nombre: "Token de GitHub",
    regex: /gh[pousr]_[A-Za-z0-9]{30,}/g,
    riesgo: "Acceso a repositorios (incluidos privados) con los scopes del token.",
  },
  {
    id: "clave-privada",
    nombre: "Clave privada",
    regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g,
    riesgo: "Permite firmar tokens, descifrar tráfico o entrar a servidores por SSH.",
  },
  {
    id: "db-url",
    nombre: "Connection string con contraseña",
    regex: /(postgres(ql)?|mysql|mongodb(\+srv)?):\/\/[^:\s/]+:[^@\s]+@[^\s"']+/g,
    riesgo: "Acceso directo a la base de datos con ese usuario.",
  },
  {
    id: "next-public",
    nombre: "Secreto con prefijo NEXT_PUBLIC_",
    regex: /NEXT_PUBLIC_[A-Z_]*(SECRET|PRIVATE|TOKEN|PASSWORD)[A-Z_]*\s*=\s*\S+/g,
    riesgo: "Todo lo que empieza con NEXT_PUBLIC_ se incrusta en el bundle del navegador: cualquiera lo lee.",
  },
];

// Los ejemplos se arman por partes para que ningún token completo quede literal en el repo
// (evita falsos positivos de los escáneres, como el push protection de GitHub).
const AWS_FALSO = "AKIA" + "EJEMPLO7ABCDEFGH";
const STRIPE_FALSO = "sk_" + "live_" + "51EjemploNoReal0000abcd";
const GITHUB_FALSO = "ghp_" + "EjemploDeTokenQueNoExiste00000000";

export const ARCHIVO_EJEMPLO = `# .env (commiteado por error)
DATABASE_URL=postgresql://app:Sup3rClave@db.interna:5432/tienda
STRIPE_SECRET_KEY=${STRIPE_FALSO}
NEXT_PUBLIC_API_TOKEN=${GITHUB_FALSO}

# config/aws.ts
const cliente = new S3Client({
  credentials: { accessKeyId: "${AWS_FALSO}", secretAccessKey: process.env.AWS_SECRET },
});

# lo correcto: solo el nombre de la variable, el valor vive fuera del repo
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);`;

export interface Hallazgo {
  patron: PatronSecreto;
  linea: number;
  valor: string;
}

export function escanear(texto: string): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];
  texto.split("\n").forEach((contenido, i) => {
    for (const patron of PATRONES) {
      for (const match of contenido.matchAll(new RegExp(patron.regex.source, "g"))) {
        hallazgos.push({ patron, linea: i + 1, valor: match[0] });
      }
    }
  });
  return hallazgos;
}

/** Muestra solo el comienzo del valor, como hacen los escáneres en sus reportes. */
export function enmascarar(valor: string): string {
  return valor.length <= 10 ? "••••" : `${valor.slice(0, 8)}••••`;
}
