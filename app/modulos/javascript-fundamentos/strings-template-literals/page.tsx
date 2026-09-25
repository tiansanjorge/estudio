import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaStringsTemplateLiterals } from "@/lib/modules/javascript-fundamentos/strings-template-literals-entrevista";

const preguntasPorNivel = {
  1: entrevistaStringsTemplateLiterals.filter((p) => p.nivel === 1),
  2: entrevistaStringsTemplateLiterals.filter((p) => p.nivel === 2),
  3: entrevistaStringsTemplateLiterals.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Strings & template literals — Dev Study Lab",
  description:
    "Interpolación, inmutabilidad de strings, slice/split, tagged templates y las trampas de Unicode al comparar texto.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace `Hola ${nombre}` que la concatenación con + no hace tan directo?",
    opciones: [
      "Interpola la variable directamente dentro del string, sin cortar comillas ni usar +",
      "Convierte automáticamente el string resultante a mayúsculas",
      "Ejecuta la expresión de forma asincrónica antes de armar el string",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los template literals permiten escribir ${expresion} directamente dentro del texto, en vez de cortar el string para concatenar con +.",
  },
  {
    pregunta: "Si texto = \"hola\" y hacés texto.toUpperCase(); sin reasignar, ¿qué vale texto después?",
    opciones: [
      "Sigue siendo \"hola\": los métodos de string no mutan, devuelven un string nuevo",
      "Pasa a ser \"HOLA\": toUpperCase() muta el string en el lugar",
      "Lanza un TypeError porque los strings son de solo lectura",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Los strings son inmutables. toUpperCase() devuelve un string nuevo; si no se reasigna la variable, el original queda intacto.",
  },
  {
    pregunta: "¿Qué diferencia hay entre .slice() y .split() en un string?",
    opciones: [
      "slice extrae una porción del string; split lo corta en un array de substrings",
      "Son sinónimos: ambos devuelven exactamente el mismo resultado",
      "slice devuelve un array; split devuelve un string",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "slice(inicio, fin) devuelve una porción del string original. split(separador) devuelve un array, cortando el string por ese separador.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué recibe la función en un tagged template literal como resaltar`Hola ${nombre}`?",
    opciones: [
      "El array de partes literales del texto y, por separado, los valores interpolados",
      "El string final ya armado, como un único argumento",
      "Solo los valores interpolados, sin las partes de texto literal",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "La función tag recibe el array de fragmentos de texto y, aparte, cada valor interpolado, y decide cómo combinarlos para el resultado final.",
  },
  {
    pregunta: "¿Cuánto vale \"😀\".length?",
    opciones: [
      "2, porque el emoji ocupa un par sustituto de dos unidades UTF-16",
      "1, porque .length siempre cuenta caracteres visibles",
      "0, porque los emojis no cuentan como parte del length del string",
    ],
    respuestaCorrecta: 0,
    explicacion:
      ".length cuenta unidades UTF-16, no caracteres visibles. Muchos emojis ocupan un par sustituto de 2 unidades.",
  },
  {
    pregunta: "¿Qué usarías en vez de .length para contar caracteres visibles reales, incluyendo emojis?",
    opciones: [
      "[...string].length, que usa el iterador de strings y respeta los pares sustitutos",
      "string.toString().length, que convierte el string a una forma más simple",
      "No hay forma de contar caracteres visibles correctamente en JavaScript",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El spread sobre un string usa su iterador, que sí trata un par sustituto como un único elemento — a diferencia de .length.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué \"Z\" < \"a\" da true al comparar strings con <?",
    opciones: [
      "Porque compara por code point Unicode, y todas las mayúsculas tienen código menor que las minúsculas",
      "Porque JavaScript compara strings ignorando mayúsculas por defecto",
      "Es un bug del motor: debería dar false, pero varía según el navegador",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "'Z' es el code point 90 y 'a' es el 97. La comparación es lexicográfica por código, no alfabética en el sentido humano.",
  },
  {
    pregunta: "¿Qué método se usa para ordenar texto de forma alfabética consciente del idioma?",
    opciones: [
      "localeCompare()",
      "toLocaleUpperCase()",
      "normalize()",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "localeCompare() compara dos strings según reglas de ordenamiento de un idioma/locale, en vez de por code point crudo.",
  },
  {
    pregunta:
      "¿Por qué dos strings que se ven idénticos como \"é\" pueden dar false al compararlos con ===?",
    opciones: [
      "Porque Unicode permite representar el mismo carácter visible con distintas secuencias de code points",
      "Porque === siempre compara strings ignorando sus últimos caracteres",
      "Porque uno de los dos strings tiene un espacio invisible al final",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "'é' puede ser un code point precompuesto o una 'e' + acento combinante: se ven iguales pero son secuencias distintas. .normalize() las unifica.",
  },
];

export default function StringsTemplateLiteralsPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Strings & template literals"
      descripcion="Interpolación, inmutabilidad, los métodos más usados de string, y las trampas de Unicode al comparar u ordenar texto."
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
            Los{" "}
            <strong className="text-foreground">template literals</strong>{" "}
            (entre backticks <code>`</code>) permiten interpolar variables
            y expresiones con <code>{"${expresion}"}</code>, sin cortar
            comillas ni concatenar con <code>+</code>, y soportan strings
            multilínea de forma nativa.
          </p>
          <p>
            Los strings son{" "}
            <strong className="text-foreground">inmutables</strong>:
            ningún método (<code>toUpperCase</code>, <code>slice</code>,{" "}
            <code>replace</code>, <code>trim</code>) modifica el string
            original, todos devuelven uno nuevo. <code>slice()</code>{" "}
            extrae una porción por índices; <code>split()</code> corta el
            string completo en un array de substrings según un separador.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="template-literals.js"
            codigo={`const nombre = "Ana";
const edad = 30;

const msg1 = "Hola " + nombre + ", tenés " + edad + " años"; // concatenación
const msg2 = \`Hola \${nombre}, tenés \${edad} años\`;          // template literal`}
          />
          <BloqueCodigo
            titulo="inmutabilidad-y-metodos.js"
            codigo={`let texto = "hola";
texto.toUpperCase();          // devuelve "HOLA", no reasigna
console.log(texto);           // "hola" — no cambió
texto = texto.toUpperCase();  // ahora sí
console.log(texto);           // "HOLA"

const s = "javascript";
s.slice(-6);  // "script"
s.split("a"); // ["j", "v", "script"]`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Esperar que un método de string mute la variable original.
            </strong>{" "}
            texto.trim() sin reasignar no cambia nada. Hay que hacer texto
            = texto.trim().
          </li>
          <li>
            <strong className="text-foreground">
              Confundir slice con substring en índices negativos.
            </strong>{" "}
            slice(-3) cuenta desde el final; substring(-3) trata el -3
            como 0 y devuelve el string completo.
          </li>
          <li>
            <strong className="text-foreground">
              Concatenar HTML o SQL a mano interpolando variables sin
              escapar.
            </strong>{" "}
            Un template literal interpola tal cual, sin sanitizar — abre
            la puerta a XSS o inyección si el valor viene de una fuente no
            confiable.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar template literals multilínea para armar queries SQL,
            emails o mensajes largos sin concatenar \n manualmente.
          </li>
          <li>
            Usar .split(&apos;,&apos;) para parsear un CSV simple o una lista de
            valores separados por coma que viene como string.
          </li>
          <li>
            Usar .slice() para truncar texto largo en una UI (con un
            &quot;...&quot; agregado), respetando un límite de caracteres.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[1]} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 prosa">
          <p>¿Qué imprime este código?</p>
          <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 font-mono text-xs text-foreground">
{`function formatear(nombre) {
  nombre.trim();
  nombre = nombre.toUpperCase();
  return \`Hola, \${nombre}!\`;
}

const entrada = "  ana  ";
console.log(formatear(entrada));
console.log(entrada);`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime{" "}
              <strong className="text-foreground">
                &quot;Hola,   ANA  !&quot;
              </strong>{" "}
              y después{" "}
              <strong className="text-foreground">
                &quot;  ana  &quot;
              </strong>{" "}
              (con los espacios originales).
            </p>
            <p className="mt-2">
              nombre.trim() no reasigna nada, así que ese resultado se
              descarta — los espacios nunca se eliminan. La línea
              siguiente sí reasigna el parámetro local nombre con
              toUpperCase(), pero eso solo cambia la variable local dentro
              de la función; entrada (la variable externa) nunca se
              modifica, porque los strings se pasan por valor.
            </p>
          </RevelarSolucion>
        </div>
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
            Un{" "}
            <strong className="text-foreground">
              tagged template literal
            </strong>{" "}
            permite procesar un template con una función propia: recibe el
            array de partes literales y, por separado, los valores
            interpolados. Es la base de librerías como styled-components (
            <code>css`...`</code>) o <code>gql`...`</code> para GraphQL, y
            también sirve para escapar valores automáticamente.
          </p>
          <p>
            <code>.length</code> cuenta{" "}
            <strong className="text-foreground">
              unidades UTF-16
            </strong>
            , no caracteres visibles. Muchos emojis ocupan un par
            sustituto de 2 unidades, así que{" "}
            <code>&apos;😀&apos;.length</code> da <code>2</code>, no{" "}
            <code>1</code>. Para contar caracteres visibles reales
            conviene <code>[...string].length</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="tagged-templates.js"
            codigo={`function resaltar(partes, ...valores) {
  return partes.reduce(
    (acc, parte, i) => acc + parte + (valores[i] !== undefined ? \`**\${valores[i]}**\` : ""),
    "",
  );
}

const nombre = "Ana";
resaltar\`Hola \${nombre}, bienvenida\`; // "Hola **Ana**, bienvenida"`}
          />
          <BloqueCodigo
            titulo="length-vs-caracteres-visibles.js"
            codigo={`"😀".length;      // 2 — par sustituto (surrogate pair)
[..."😀"].length; // 1 — el iterador de strings sí lo cuenta como uno`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Truncar texto con .slice(0, n) sin considerar emojis.
            </strong>{" "}
            Puede cortar un par sustituto a la mitad, mostrando un
            carácter roto (□) en vez del emoji completo.
          </li>
          <li>
            <strong className="text-foreground">
              Interpolar datos de usuario sin sanitizar en un tagged
              template que genera HTML.
            </strong>{" "}
            El tag es responsable de escapar; si no lo hace, sigue
            existiendo el riesgo de XSS igual que con un template literal
            normal.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar librerías basadas en tagged templates (styled-components,
            graphql-tag) que aprovechan el array de partes literales para
            hacer parsing o extracción de metadata en build time.
          </li>
          <li>
            Validar el length real de campos de texto con emojis (por
            ejemplo, un campo de bio con límite de caracteres) usando
            [...texto].length en vez de texto.length.
          </li>
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
            La comparación con <code>&lt;</code> entre strings es
            lexicográfica por{" "}
            <strong className="text-foreground">code point</strong>{" "}
            Unicode, no alfabética en el sentido humano: las mayúsculas
            (A-Z, códigos 65-90) tienen código menor que las minúsculas
            (a-z, códigos 97-122). Por eso{" "}
            <code>&apos;Z&apos; &lt; &apos;a&apos;</code> da{" "}
            <code>true</code>. Para ordenar de forma alfabética real
            (consciente del idioma) se usa <code>localeCompare()</code>.
          </p>
          <p>
            Unicode permite representar el mismo carácter visible de más
            de una forma (por ejemplo, &apos;é&apos; precompuesto vs
            &apos;e&apos; + acento combinante): se ven idénticos pero son
            strings distintos, con distinto <code>length</code>, que dan{" "}
            <code>false</code> con <code>===</code>.{" "}
            <code>.normalize()</code> los convierte a una forma canónica
            única.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="comparacion-lexicografica.js"
            codigo={`"a" < "b";  // true — 97 < 98
"Z" < "a";  // true — 90 < 97, aunque Z va después alfabéticamente

["b", "Z", "a"].sort();                             // ["Z", "a", "b"] — por code point
["b", "Z", "a"].sort((x, y) => x.localeCompare(y)); // ["a", "b", "Z"] — alfabético real`}
          />
          <BloqueCodigo
            titulo="normalizacion-unicode.js"
            codigo={`const precompuesto = "\\u00e9";  // "é" como un solo code point
const combinado = "e\\u0301";    // "e" + acento combinante

precompuesto === combinado;      // false — ¡se ven iguales pero no lo son!
precompuesto.normalize() === combinado.normalize(); // true`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Ordenar texto con .sort() sin comparador esperando orden
              alfabético.
            </strong>{" "}
            El comparador por defecto ordena por code point, no alfabeto:
            mezclar mayúsculas y minúsculas da resultados sorprendentes.
          </li>
          <li>
            <strong className="text-foreground">
              Comparar texto de un formulario contra un valor guardado sin
              normalizar.
            </strong>{" "}
            Si vienen de fuentes distintas (un teclado vs un copy-paste de
            otro sistema), pueden representar el mismo texto visible con
            distintos code points y fallar el === silenciosamente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar localeCompare() con opciones de sensibilidad ({"{ sensitivity: 'base' }"}) para comparar texto ignorando
            mayúsculas y acentos, útil en buscadores o validación de
            duplicados.
          </li>
          <li>
            Normalizar cualquier texto antes de guardarlo o compararlo
            cuando puede venir de múltiples fuentes (formularios, APIs de
            terceros, copy-paste) — un bug clásico y difícil de
            reproducir si no se conoce esta causa.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntasNivel3} />
      </Seccion>

      <Seccion eyebrow="Entrevista" titulo="Preguntas y respuestas">
        <EntrevistaSeccion preguntas={preguntasPorNivel[3]} />
      </Seccion>
    </>
  );
}
