import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { OwaspCazador } from "@/components/modulo/OwaspCazador";
import { entrevistaOwaspTop10 } from "@/lib/modules/seguridad/owasp-top-10-entrevista";

const preguntasPorNivel = {
  1: entrevistaOwaspTop10.filter((p) => p.nivel === 1),
  2: entrevistaOwaspTop10.filter((p) => p.nivel === 2),
  3: entrevistaOwaspTop10.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "OWASP Top 10 esencial — Dev Study Lab",
  description:
    "Las vulnerabilidades web más comunes con ejemplos de código: control de acceso, inyección, criptografía, configuración, supply chain, SSRF y diseño inseguro.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué categoría encabeza el OWASP Top 10 (2021)?",
    opciones: [
      "Broken Access Control",
      "Injection",
      "Cryptographic Failures",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Usuarios accediendo a datos o acciones que no deberían: la falla más frecuente.",
  },
  {
    pregunta: "¿Qué previene la inyección SQL?",
    opciones: [
      "Escapar las comillas del input antes de concatenarlo en la consulta",
      "Consultas parametrizadas: el input viaja como dato, no como SQL",
      "Validar en el frontend que el input no tenga caracteres especiales",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Los ORMs lo hacen en sus métodos normales; el riesgo vuelve con el SQL crudo concatenado.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué algoritmo es adecuado para guardar contraseñas?",
    opciones: [
      "SHA-256 con salt",
      "AES-256",
      "Argon2id",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Los hashes rápidos permiten fuerza bruta masiva; Argon2id es lento a propósito.",
  },
  {
    pregunta: "¿Qué protege contra que npm install traiga versiones distintas cada vez?",
    opciones: [
      "El lockfile commiteado y npm ci",
      "Usar rangos con ^ en package.json",
      "Correr npm audit antes de instalar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La instalación reproducible es la base de la seguridad de la cadena de suministro.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué un SSRF es especialmente grave en AWS?",
    opciones: [
      "Porque AWS no permite filtrar el tráfico saliente de una instancia",
      "Porque la metadata de la instancia puede devolver credenciales del rol",
      "Porque el atacante puede apagar la instancia desde afuera",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "IMDSv2 mitiga la mayoría de los SSRF simples exigiendo un token.",
  },
  {
    pregunta: "Un checkout que confía en el precio que manda el cliente es un ejemplo de...",
    opciones: [
      "Injection",
      "Broken Authentication",
      "Insecure Design",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "La falla está en el diseño del flujo, no en una línea de código.",
  },
];

export default function OwaspTop10Page() {
  return (
    <ModuloLayout
      categoriaTitulo="Seguridad"
      titulo="OWASP Top 10 esencial"
      descripcion="Las vulnerabilidades web más comunes, cómo se ven en código real y cómo se corrigen."
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
            El <strong className="text-foreground">OWASP Top 10</strong> lista
            los riesgos más críticos de las aplicaciones web a partir de datos
            reales. La edición 2021 es la referencia más citada; la de 2025
            reordena la lista y suma categorías como las fallas en la cadena de
            suministro de software.
          </p>
          <p>
            Las que más aparecen en el día a día: control de acceso roto,
            inyección, fallas criptográficas, configuración insegura,
            componentes vulnerables y fallas de autenticación. Casi todas se
            previenen con prácticas concretas y verificables.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Encontrá la vulnerabilidad">
        <OwaspCazador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Tratar el Top 10 como un checklist completo.</strong>{" "}
            Es un piso de concientización, no una auditoría.
          </li>
          <li>
            <strong className="text-foreground">Confiar en la validación del frontend.</strong>{" "}
            Todo lo que llega al servidor se valida de nuevo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Una checklist de seguridad para los code reviews.</li>
          <li>Priorizar hallazgos de un pentest por categoría.</li>
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
            <strong className="text-foreground">Contraseñas</strong>: Argon2id,
            scrypt o bcrypt, con sal por usuario y costo ajustado; nunca hashes
            rápidos.
          </p>
          <p>
            <strong className="text-foreground">Cadena de suministro</strong>:
            lockfile y <code>npm ci</code>, escaneo automático de CVEs,
            actualizaciones chicas y frecuentes, revisar dependencias nuevas y
            fijar las GitHub Actions por hash. Cada paquete corre con tus
            permisos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Ignorar las alertas de Dependabot durante meses.</strong>{" "}
            Los saltos de versión se vuelven grandes y riesgosos.
          </li>
          <li>
            <strong className="text-foreground">Instalar paquetes por el nombre sin revisar.</strong>{" "}
            Typosquatting a una letra de distancia.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Migrar hashes MD5 a Argon2id re-hasheando en el próximo login.</li>
          <li>Dependabot con auto-merge para parches con tests en verde.</li>
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
            <strong className="text-foreground">SSRF</strong>: el servidor hace
            requests a donde decide el atacante, alcanzando servicios internos y
            la metadata del cloud. Allowlists, rechazo de IPs privadas,
            aislamiento de red e IMDSv2.
          </p>
          <p>
            <strong className="text-foreground">Insecure Design</strong>: fallas
            del flujo, no del código. Se previenen con threat modeling, casos de
            abuso y reglas de negocio validadas en el servidor.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Validar la URL sin resolver el DNS.</strong>{" "}
            Un dominio público puede apuntar a una IP interna.
          </li>
          <li>
            <strong className="text-foreground">Pensar la seguridad recién en el pentest.</strong>{" "}
            Las fallas de diseño cuestan mucho más al final.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un servicio aislado para las vistas previas de links.</li>
          <li>Una sesión de threat modeling antes de lanzar un sistema de cupones.</li>
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
          <p>
            Revisá este endpoint de checkout. ¿Cuántas categorías del Top 10
            encontrás?
          </p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`app.post("/checkout", async (req, res) => {
  const { usuarioId, items, total, cupon } = req.body;
  await db.$queryRawUnsafe(
    \`UPDATE cupones SET usos = usos + 1 WHERE codigo = '\${cupon}'\`
  );
  const pedido = await db.pedido.create({ data: { usuarioId, items, total } });
  res.json(pedido);
});`}
          </pre>
          <RevelarSolucion>
            <p>
              Broken Access Control: el <code>usuarioId</code> viene del body, así
              que se puede comprar a nombre de otro; va de la sesión. Injection:
              el cupón se concatena en SQL crudo; hay que parametrizar. Insecure
              Design: el <code>total</code> lo decide el cliente (se puede pagar
              $1) y el cupón no verifica validez, vencimiento ni límite de usos
              por usuario; el total se calcula en el servidor a partir de los
              precios de la base. Además, falta validar <code>items</code> con un
              esquema y hacer todo en una transacción para no sumar usos a un
              cupón si el pedido falla.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
