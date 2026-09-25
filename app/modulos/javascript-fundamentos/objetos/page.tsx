import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaObjetos } from "@/lib/modules/javascript-fundamentos/objetos-entrevista";

const preguntasPorNivel = {
  1: entrevistaObjetos.filter((p) => p.nivel === 1),
  2: entrevistaObjetos.filter((p) => p.nivel === 2),
  3: entrevistaObjetos.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Objetos — Dev Study Lab",
  description:
    "Destructuring, spread, Object.keys/values/entries y por qué una copia superficial no es lo mismo que una copia profunda.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué hace const { edad: anios = 0 } = usuario?",
    opciones: [
      "Extrae la propiedad edad, la guarda en una variable llamada anios, y usa 0 si edad no existe",
      "Crea una nueva propiedad anios en el objeto usuario, con valor 0",
      "Falla si el objeto usuario no tiene una propiedad llamada anios",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El destructuring permite renombrar (edad: anios) y dar un valor por defecto (= 0) para cuando la propiedad original no existe.",
  },
  {
    pregunta: "¿Qué tipo de copia hace { ...original } sobre un objeto?",
    opciones: [
      "Una copia superficial: las propiedades anidadas siguen siendo la misma referencia",
      "Una copia profunda: todo el contenido, incluido lo anidado, queda independiente",
      "No copia nada: crea una referencia nueva al mismo objeto original",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El spread copia las propiedades de primer nivel. Si una de ellas es un objeto, la copia y el original comparten esa misma referencia anidada.",
  },
  {
    pregunta: "¿Qué devuelve Object.entries({ pan: 100, leche: 80 })?",
    opciones: [
      "[[\"pan\", 100], [\"leche\", 80]]",
      "[\"pan\", \"leche\"]",
      "[100, 80]",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Object.entries devuelve un array de pares [clave, valor]. Object.keys daría solo las claves; Object.values, solo los valores.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta:
      "Si copia.usuario.nombre se modifica después de const copia = { ...original }, ¿qué pasa con original.usuario.nombre?",
    opciones: [
      "También cambia: usuario es una propiedad anidada, y el spread solo copia la referencia a ese objeto",
      "No cambia: el spread siempre crea copias independientes en todos los niveles",
      "Lanza un TypeError, porque el spread congela las propiedades anidadas",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El spread es una copia superficial. original y copia comparten la misma referencia al objeto usuario anidado.",
  },
  {
    pregunta:
      "¿Qué hace usuario?.direccion?.ciudad si usuario no tiene la propiedad direccion?",
    opciones: [
      "Devuelve undefined, sin lanzar ningún error",
      "Lanza un TypeError: Cannot read properties of undefined",
      "Devuelve un string vacío por defecto",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Optional chaining corta la cadena apenas encuentra null o undefined, devolviendo undefined en vez de intentar seguir accediendo y romper.",
  },
  {
    pregunta: "¿Para qué se combina ?. con ??, como en usuario?.direccion?.ciudad ?? \"Sin datos\"?",
    opciones: [
      "Para dar un valor por defecto cuando la cadena opcional termina en undefined",
      "Para forzar que la propiedad direccion siempre exista en el objeto",
      "Para convertir el resultado de ?. a string automáticamente",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "?. evita el error de acceso; ?? aporta el valor de reemplazo cuando el resultado de esa cadena termina siendo null o undefined.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué diferencia hay entre Object.seal y Object.freeze?",
    opciones: [
      "seal permite modificar valores existentes pero no agregar/eliminar propiedades; freeze tampoco permite modificar valores",
      "Son sinónimos: ambos hacen exactamente lo mismo con distinto nombre",
      "seal es más restrictivo que freeze: además de eso, impide leer las propiedades",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "seal bloquea agregar y eliminar propiedades, pero deja modificar valores existentes. freeze además bloquea la modificación de esos valores.",
  },
  {
    pregunta:
      "En el objeto { b: 1, 2: \"dos\", a: 2, 1: \"uno\" }, ¿qué orden da Object.keys?",
    opciones: [
      "[\"1\", \"2\", \"b\", \"a\"] — las claves tipo entero van primero, ordenadas, y el resto en orden de inserción",
      "[\"b\", \"2\", \"a\", \"1\"] — siempre respeta el orden exacto en que se escribieron",
      "Es indefinido: el spec no garantiza ningún orden para Object.keys",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El spec ordena primero las claves tipo entero no negativo (numéricamente), y después el resto de las claves string en orden de inserción.",
  },
  {
    pregunta: "¿Por qué structuredClone(obj) resuelve un problema que { ...obj } no resuelve?",
    opciones: [
      "Porque hace una copia profunda real, incluyendo objetos anidados, no solo el primer nivel",
      "Porque structuredClone es más rápido que el spread para cualquier tamaño de objeto",
      "Porque structuredClone preserva funciones dentro del objeto y el spread las elimina",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "structuredClone clona recursivamente. El spread solo copia las referencias del primer nivel, dejando lo anidado compartido con el original.",
  },
];

export default function ObjetosPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Objetos"
      descripcion="Destructuring, spread y los métodos de Object — y por qué una copia superficial puede seguir mutando el original."
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
            <strong className="text-foreground">Destructuring</strong>{" "}
            extrae propiedades de un objeto y las asigna a variables en una
            sola línea, con la posibilidad de renombrarlas y darles un
            valor por defecto. El{" "}
            <strong className="text-foreground">spread operator</strong> (
            <code>...</code>) copia las propiedades de un objeto dentro de
            otro objeto literal, útil para combinar objetos o actualizar
            campos sin mutar el original.
          </p>
          <p>
            Para recorrer un objeto existen{" "}
            <code>Object.keys(obj)</code> (array de claves),{" "}
            <code>Object.values(obj)</code> (array de valores) y{" "}
            <code>Object.entries(obj)</code> (array de pares{" "}
            <code>[clave, valor]</code>), que combinados con{" "}
            <code>map</code>/<code>filter</code>/<code>reduce</code>{" "}
            permiten transformar objetos con la misma sintaxis que se usa
            para arrays.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="destructuring-y-spread.js"
            codigo={`const usuario = { nombre: "Ana", edad: 30 };

const { nombre, edad: anios = 0 } = usuario; // renombra y da default
const actualizado = { ...usuario, edad: 31 }; // copia con un campo cambiado

console.log(usuario.edad);     // 30 — no se mutó
console.log(actualizado.edad); // 31`}
          />
          <BloqueCodigo
            titulo="object-keys-values-entries.js"
            codigo={`const precios = { pan: 100, leche: 80 };

Object.keys(precios);    // ["pan", "leche"]
Object.values(precios);  // [100, 80]
Object.entries(precios); // [["pan", 100], ["leche", 80]]

Object.entries(precios).map(([producto, precio]) => \`\${producto}: $\${precio}\`);`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Pensar que el spread hace una copia profunda.
            </strong>{" "}
            Solo copia el primer nivel. Un objeto anidado sigue siendo la
            misma referencia entre el original y la copia.
          </li>
          <li>
            <strong className="text-foreground">
              Destructurar una propiedad que puede no existir sin default.
            </strong>{" "}
            const {"{ config }"} = obj da undefined en silencio si config
            no existe; sin un valor por defecto, el código que sigue puede
            romper más adelante con un error confuso.
          </li>
          <li>
            <strong className="text-foreground">
              Acceder a una propiedad anidada sin chequear que el padre
              exista.
            </strong>{" "}
            usuario.direccion.ciudad lanza TypeError si direccion es
            undefined — para eso está el optional chaining (?.).
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Destructurar props directamente en la firma de un componente
            React: function Boton({"{ etiqueta, onClick }"}) en vez de
            props.etiqueta y props.onClick.
          </li>
          <li>
            Usar spread para actualizar estado inmutable en React:
            setEstado({"{"}...estado, campo: nuevoValor{"}"}) en vez de
            mutar el objeto de estado directamente.
          </li>
          <li>
            Usar Object.entries(obj).map(...) para renderizar en una lista
            todos los pares clave/valor de un objeto de configuración.
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
{`const original = { usuario: { nombre: "Ana" }, activo: true };
const copia = { ...original };

copia.activo = false;
copia.usuario.nombre = "Beto";

console.log(original.activo);        // ?
console.log(original.usuario.nombre); // ?`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime{" "}
              <strong className="text-foreground">true</strong> y después{" "}
              <strong className="text-foreground">&quot;Beto&quot;</strong>.
            </p>
            <p className="mt-2">
              activo es un booleano (primitivo): el spread lo copia por
              valor, así que cambiarlo en copia no afecta a original.
              usuario es un objeto: el spread solo copia la referencia a
              ese objeto anidado, así que copia.usuario y
              original.usuario apuntan al mismo objeto — mutarlo desde
              copia también lo cambia en original.
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
            El spread es una copia{" "}
            <strong className="text-foreground">superficial</strong>{" "}
            (shallow): copia las referencias de las propiedades de primer
            nivel, no su contenido. Si una propiedad es un objeto o array,
            la copia y el original comparten esa misma referencia
            anidada, así que mutarla desde la copia también afecta al
            original.
          </p>
          <p>
            <strong className="text-foreground">Optional chaining</strong>{" "}
            (<code>?.</code>) evita un <code>TypeError</code> al acceder a
            una propiedad de algo que podría ser null o undefined,
            devolviendo undefined en ese caso. Se combina naturalmente con{" "}
            <code>??</code> para dar un valor de reemplazo cuando esa
            cadena termina en undefined.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="copia-superficial.js"
            codigo={`const original = { usuario: { nombre: "Ana" } };
const copia = { ...original };

copia.usuario.nombre = "Beto";
console.log(original.usuario.nombre); // "Beto" — se mutó el original también

const copiaProfunda = structuredClone(original); // copia real`}
          />
          <BloqueCodigo
            titulo="optional-chaining.js"
            codigo={`const usuario = { nombre: "Ana" }; // sin direccion

const ciudad = usuario?.direccion?.ciudad ?? "Sin especificar";
console.log(ciudad); // "Sin especificar" — sin lanzar TypeError`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar JSON.parse(JSON.stringify(obj)) como copia profunda sin
              revisar sus límites.
            </strong>{" "}
            Pierde funciones, convierte Dates a strings, y falla con
            referencias circulares. structuredClone es más seguro para la
            mayoría de los casos.
          </li>
          <li>
            <strong className="text-foreground">
              Encadenar && manualmente en vez de optional chaining.
            </strong>{" "}
            usuario && usuario.direccion && usuario.direccion.ciudad
            funciona, pero es mucho más ruidoso que usuario?.direccion?.
            ciudad para el mismo resultado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar structuredClone al necesitar mutar libremente una copia
            de un objeto de estado complejo (con anidamiento) sin afectar
            el original.
          </li>
          <li>
            Usar optional chaining al acceder a datos que vienen de una
            API externa, donde ciertas propiedades pueden legítimamente no
            estar presentes en la respuesta.
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
            <code>Object.preventExtensions</code>,{" "}
            <code>Object.seal</code> y <code>Object.freeze</code> forman
            una escala de restricción creciente:{" "}
            <code>preventExtensions</code> solo bloquea agregar
            propiedades nuevas; <code>seal</code> además bloquea
            eliminarlas (pero deja modificar valores existentes); y{" "}
            <code>freeze</code> bloquea también modificar esos valores.
            Los tres son superficiales.
          </p>
          <p>
            El orden de iteración de <code>Object.keys</code> y{" "}
            <code>for...in</code> no es arbitrario: el spec de ECMAScript
            ordena primero las claves que parecen enteros no negativos
            (numéricamente ascendente), y recién después el resto de las
            claves string en el orden en que se insertaron.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="freeze-seal-preventExtensions.js"
            codigo={`const a = Object.preventExtensions({ x: 1 });
a.x = 2; a.y = 3; // x cambia, y no se agrega

const b = Object.seal({ x: 1 });
b.x = 2;   // funciona
delete b.x; // no funciona

const c = Object.freeze({ x: 1 });
c.x = 2; // no funciona — nada cambia`}
          />
          <BloqueCodigo
            titulo="orden-de-claves.js"
            codigo={`const obj = { b: 1, 2: "dos", a: 2, 1: "uno" };
console.log(Object.keys(obj)); // ["1", "2", "b", "a"]
// claves tipo entero primero (ordenadas), después el resto en orden de inserción`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Confiar en el orden de inserción para claves numéricas.
            </strong>{" "}
            Aunque se inserten en otro orden, las claves tipo entero
            siempre se reordenan numéricamente al iterar.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir seal con freeze en code review.
            </strong>{" "}
            Un objeto sealed sigue siendo mutable en sus valores — solo
            freeze da inmutabilidad completa en el primer nivel.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar Object.seal cuando se quiere permitir actualizar valores
            de configuración en runtime pero evitar que código externo
            agregue o borre claves inesperadas.
          </li>
          <li>
            Explicar en una entrevista por qué Object.keys(arrayLike) con
            claves numéricas y no numéricas mezcladas da un orden
            &quot;raro&quot; — es una pregunta capciosa clásica.
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
