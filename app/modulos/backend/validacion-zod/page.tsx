import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { ValidacionSimulador } from "@/components/modulo/ValidacionSimulador";
import { entrevistaValidacionZod } from "@/lib/modules/backend/validacion-zod-entrevista";

const preguntasPorNivel = {
  1: entrevistaValidacionZod.filter((p) => p.nivel === 1),
  2: entrevistaValidacionZod.filter((p) => p.nivel === 2),
  3: entrevistaValidacionZod.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Validación de datos (Zod) — Dev Study Lab",
  description:
    "Validar en las fronteras del sistema: por qué no alcanza TypeScript, mass assignment, schemas compartidos, transformaciones y reglas entre campos.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué verifica TypeScript sobre el body de un request en runtime?",
    opciones: ["Todo", "Nada: los tipos desaparecen al compilar", "Solo los números"],
    respuestaCorrecta: 1,
    explicacion:
      "Los datos externos son unknown en la realidad; hace falta un schema en runtime.",
  },
  {
    pregunta: "Un atacante agrega esAdmin: true al body. ¿Qué lo frena?",
    opciones: [
      "Que el formulario no tenga ese campo",
      "Un schema que solo acepta los campos permitidos para esa operación",
      "HTTPS",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "El request se puede armar a mano; la allowlist tiene que estar en el servidor.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Dónde se valida la regla 'el email no está registrado'?",
    opciones: [
      "Solo en el cliente",
      "En el servidor (y la base con un constraint único)",
      "En el schema compartido sin acceso a la base",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Depende de datos del servidor; el cliente solo puede validar la forma.",
  },
  {
    pregunta: "Después de safeParse exitoso, ¿qué datos usa el handler?",
    opciones: ["req.body", "resultado.data", "Cualquiera de los dos"],
    respuestaCorrecta: 1,
    explicacion:
      "resultado.data está normalizado (trim, coerce, defaults) y sin claves de más.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo se asocia a un campo el error de una regla entre dos campos con refine?",
    opciones: ["No se puede", "Con la opción path del refine", "Lanzando una excepción"],
    respuestaCorrecta: 1,
    explicacion:
      "Así el formulario muestra el error junto al input correcto.",
  },
  {
    pregunta: "¿Por qué validar la respuesta de la API de un proveedor?",
    opciones: [
      "Para hacerla más rápida",
      "Para que un cambio del proveedor falle explícitamente en el adaptador y no lejos, con datos corruptos",
      "No hace falta",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Es otra frontera que no controlás.",
  },
];

export default function ValidacionZodPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Backend"
      titulo="Validación de datos (Zod)"
      descripcion="Todo dato que entra desde afuera es sospechoso: validarlo en cada frontera, con un schema que también define el tipo."
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
            Los tipos de TypeScript no existen en runtime: el body, los query
            params o una respuesta externa son <code>unknown</code> de verdad.
            En cada <strong className="text-foreground">frontera</strong> se
            valida con un schema.
          </p>
          <p>
            <strong className="text-foreground">Zod</strong> define el schema
            una vez y de ahí salen la validación en runtime y el tipo (
            <code>z.infer</code>). Además normaliza (trim, coerce, defaults) y
            descarta claves desconocidas, lo que previene el mass assignment.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <ValidacionSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>req.body as Pedido</code>.</strong>{" "}
            Un cast no valida nada.
          </li>
          <li>
            <strong className="text-foreground"><code>db.create({"{ data: req.body }"})</code>.</strong>{" "}
            Es mass assignment esperando a pasar.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un middleware <code>validar(schema)</code> para las rutas de Express.</li>
          <li>Validar las variables de entorno al arrancar.</li>
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
            En el cliente se valida para la UX; en el servidor, para la
            seguridad. Un <strong className="text-foreground">schema
            compartido</strong> (con <code>zodResolver</code> en el formulario y
            en el endpoint) evita duplicar reglas de forma; las que dependen de
            la base solo pueden ir en el servidor.
          </p>
          <p>
            <code>safeParse</code> para endpoints, <code>parse</code> para
            configuración que tiene que cortar el arranque. Y siempre usar el
            resultado, que viene normalizado.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Validar solo en el cliente.</strong>{" "}
            Cualquiera manda un request sin pasar por el formulario.
          </li>
          <li>
            <strong className="text-foreground">Un solo schema para crear, actualizar y administrar.</strong>{" "}
            Cada operación permite campos distintos.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un paquete <code>@app/schemas</code> compartido en el monorepo.</li>
          <li><code>z.coerce.number()</code> para los query params de paginación.</li>
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
            Reglas entre campos con <code>refine</code>/<code>superRefine</code>{" "}
            y <code>path</code>; variantes con{" "}
            <code>discriminatedUnion</code>. Las reglas que consultan la base
            suelen ir en el caso de uso, con el constraint de la base como
            garantía final.
          </p>
          <p>
            Las respuestas de terceros también se validan: un cambio del
            proveedor falla explícitamente en el adaptador en vez de propagarse
            como datos corruptos.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Confiar en el chequeo de unicidad del schema.</strong>{" "}
            Entre validar e insertar, otro request puede ganar la carrera.
          </li>
          <li>
            <strong className="text-foreground">Schemas de respuestas externas demasiado estrictos.</strong>{" "}
            Un campo extra que no usás no debería romper la integración.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Pagos con <code>discriminatedUnion(&quot;medio&quot;, ...)</code>.</li>
          <li>Validar el webhook de un proveedor antes de procesarlo.</li>
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
          <p>Este endpoint de actualización de perfil tiene varios problemas. ¿Cuáles?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`app.put("/perfil", async (req, res) => {
  const datos = req.body as { nombre: string; edad: number };
  if (datos.edad < 18) return res.status(400).send("Menor de edad");
  const usuario = await db.usuario.update({
    where: { id: req.user.id },
    data: req.body,
  });
  res.json(usuario);
});`}
          </pre>
          <RevelarSolucion>
            <p>
              1) El <code>as</code> no valida: si <code>edad</code> llega como{" "}
              <code>&quot;17&quot;</code> o no llega, la comparación no hace lo
              esperado (<code>undefined &lt; 18</code> es false y pasa). 2){" "}
              <code>data: req.body</code> es mass assignment: se puede mandar{" "}
              <code>rol</code>, <code>email</code> o cualquier columna. 3) La
              respuesta devuelve el usuario completo, posiblemente con el hash
              de la contraseña. Corrección: un{" "}
              <code>ActualizarPerfilSchema</code> con solo los campos editables,{" "}
              <code>safeParse</code> y 400 con los issues por campo, guardar{" "}
              <code>resultado.data</code>, y responder con un DTO sin campos
              sensibles.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
