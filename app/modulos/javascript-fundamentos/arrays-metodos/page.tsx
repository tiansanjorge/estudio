import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { BloqueCodigo } from "@/components/modulo/BloqueCodigo";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { entrevistaArraysMetodos } from "@/lib/modules/javascript-fundamentos/arrays-metodos-entrevista";

const preguntasPorNivel = {
  1: entrevistaArraysMetodos.filter((p) => p.nivel === 1),
  2: entrevistaArraysMetodos.filter((p) => p.nivel === 2),
  3: entrevistaArraysMetodos.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Arrays & métodos — Dev Study Lab",
  description:
    "map/filter/reduce, métodos mutantes vs no mutantes, y por qué mutar un array de estado directamente rompe la UI.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué devuelve forEach en comparación con map?",
    opciones: [
      "forEach devuelve undefined; map devuelve un array nuevo con los resultados",
      "Ambos devuelven un array nuevo del mismo largo que el original",
      "forEach devuelve un array nuevo; map devuelve undefined",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "forEach está pensado para efectos secundarios, no para construir datos. map sí construye y devuelve un array transformado.",
  },
  {
    pregunta: "¿Cuál de estos métodos NO muta el array original?",
    opciones: [
      "slice",
      "sort",
      "splice",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "slice devuelve una copia nueva de una porción del array. sort y splice modifican el array original en el lugar.",
  },
  {
    pregunta: "¿Para qué tipo de resultado conviene usar reduce en vez de map?",
    opciones: [
      "Cuando el resultado final no es un array transformado, sino un valor distinto (suma, objeto agrupado, máximo)",
      "Cuando se necesita recorrer el array en orden inverso",
      "Cuando se necesita modificar el array original en el lugar",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "map siempre devuelve un array del mismo largo. reduce sirve cuando el resultado final tiene otra forma: un número, un objeto, etc.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Qué ventaja tiene un solo reduce sobre encadenar filter().map()?",
    opciones: [
      "Recorre el array una sola vez, sin crear un array intermedio",
      "Es siempre más legible que dos métodos encadenados",
      "Es el único que puede acceder al índice del elemento actual",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "filter().map() hace dos pasadas y crea un array intermedio. reduce logra el mismo resultado en una sola pasada, a costa de legibilidad.",
  },
  {
    pregunta: "¿Por qué lista.push(item); setLista(lista) no dispara un re-render en React?",
    opciones: [
      "push muta el array existente: la referencia sigue siendo la misma, y React compara por referencia",
      "push no existe como método válido sobre arrays de estado en React",
      "setLista solo funciona si se le pasa un número o un string, no un array",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "React decide re-renderizar comparando la referencia anterior contra la nueva. Si el array es el mismo objeto en memoria, no detecta cambio.",
  },
  {
    pregunta: "¿Cuál de estas opciones SÍ genera una nueva referencia para actualizar estado en React?",
    opciones: [
      "setLista([...lista, item])",
      "lista.push(item); setLista(lista)",
      "lista[lista.length] = item; setLista(lista)",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "El spread crea un array nuevo en memoria. Las otras dos opciones mutan el array existente y mantienen la misma referencia.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "¿Por qué [10, 2, 1].sort() sin comparador da [1, 10, 2]?",
    opciones: [
      "Porque sort() convierte los elementos a string y los ordena lexicográficamente, no numéricamente",
      "Porque sort() sin argumentos ordena siempre de mayor a menor por defecto",
      "Porque sort() solo funciona correctamente con arrays de menos de 10 elementos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "'10' es menor que '2' en orden de texto porque compara carácter por carácter, y '1' es menor que '2'. Hace falta un comparador para orden numérico.",
  },
  {
    pregunta: "¿Qué es un array 'sparse' (con huecos)?",
    opciones: [
      "Un array con posiciones sin asignar, distintas de posiciones que valen undefined",
      "Un array cuyo length es mayor que la cantidad real de elementos accesibles",
      "Un array que solo puede contener valores primitivos, no objetos",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Se crea con new Array(3) o borrando un índice con delete. La posición no tiene valor asignado, ni siquiera undefined explícito.",
  },
  {
    pregunta: "¿Cómo se comporta forEach frente a un hueco en un array sparse?",
    opciones: [
      "Salta ese índice: no ejecuta el callback para posiciones sin asignar",
      "Ejecuta el callback pasando undefined como valor",
      "Lanza una excepción al llegar al primer hueco",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "forEach, map y filter ignoran los huecos. for...of, en cambio, sí los recorre y entrega undefined en esas posiciones.",
  },
];

export default function ArraysMetodosPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript Fundamentos"
      titulo="Arrays & métodos"
      descripcion="map, filter, reduce y la diferencia entre mutar un array y crear uno nuevo — clave para no romper la UI en React."
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
            <code>map</code> transforma cada elemento y devuelve un array
            nuevo del mismo largo. <code>filter</code> devuelve un array
            nuevo solo con los elementos que cumplen una condición.{" "}
            <code>forEach</code> ejecuta una función por elemento y no
            devuelve nada útil — sirve para efectos secundarios, no para
            construir datos. <code>reduce</code> acumula todos los
            elementos en un único resultado, que puede ser cualquier cosa:
            un número, un objeto, otro array.
          </p>
          <p>
            Otra distinción clave: algunos métodos{" "}
            <strong className="text-foreground">mutan</strong> el array
            original (<code>push</code>, <code>pop</code>,{" "}
            <code>splice</code>, <code>sort</code>, <code>reverse</code>) y
            otros devuelven{" "}
            <strong className="text-foreground">uno nuevo</strong> sin
            tocar el original (<code>map</code>, <code>filter</code>,{" "}
            <code>slice</code>, <code>concat</code>, el spread{" "}
            <code>[...arr]</code>).
          </p>
          <p>
            De los mutantes, <code>splice(inicio, cantidadABorrar,
            ...itemsAInsertar)</code> es el más versátil y el que más
            confunde por nombre: con esos tres argumentos puede{" "}
            <strong className="text-foreground">borrar</strong>,{" "}
            <strong className="text-foreground">insertar</strong> o{" "}
            <strong className="text-foreground">reemplazar</strong>{" "}
            elementos en cualquier posición, y a la vez devuelve un array
            con lo que borró.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="map-filter-forEach.js"
            codigo={`const numeros = [1, 2, 3, 4];

numeros.map(n => n * 2);          // [2, 4, 6, 8]
numeros.filter(n => n % 2 === 0); // [2, 4]
numeros.forEach(n => console.log(n)); // imprime, devuelve undefined`}
          />
          <BloqueCodigo
            titulo="mutantes-vs-no-mutantes.js"
            codigo={`const original = [3, 1, 2];

const ordenadoMal = original.sort(); // muta original TAMBIÉN
console.log(original); // [1, 2, 3] — ¡cambió!

const copia = [...original].sort(); // no muta el original`}
          />
          <BloqueCodigo
            titulo="push-pop-shift-unshift-splice.js"
            codigo={`const frutas = ["manzana", "banana", "cereza"];

frutas.push("durazno");   // agrega al final -> ["manzana","banana","cereza","durazno"]
frutas.pop();              // saca el último -> quita "durazno", lo devuelve
frutas.unshift("kiwi");   // agrega al principio -> ["kiwi","manzana","banana","cereza"]
frutas.shift();            // saca el primero -> quita "kiwi", lo devuelve

// splice(inicio, cantidadABorrar, ...itemsAInsertar)
const lista = ["a", "b", "c", "d"];

lista.splice(1, 1);            // borra 1 elemento desde el índice 1
console.log(lista);            // ["a", "c", "d"]

lista.splice(1, 0, "x", "y");  // borra 0, inserta "x","y" desde el índice 1
console.log(lista);            // ["a", "x", "y", "c", "d"]

lista.splice(1, 2, "z");       // borra 2 desde el índice 1, inserta "z" ahí
console.log(lista);            // ["a", "z", "c", "d"]

const borrados = lista.splice(0, 1); // splice devuelve lo que borró
console.log(borrados);         // ["a"]`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Usar forEach esperando el array transformado.
            </strong>{" "}
            const resultado = arr.forEach(...) da siempre undefined. Para
            transformar y quedarse con el resultado, es map.
          </li>
          <li>
            <strong className="text-foreground">
              Olvidar que sort() y splice() mutan el array original.
            </strong>{" "}
            Si ese array viene de props o estado, mutarlo puede causar bugs
            difíciles de rastrear en otras partes que también lo usan.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir splice con slice por el nombre parecido.
            </strong>{" "}
            slice(inicio, fin) no muta y devuelve una porción por índices.
            splice(inicio, cantidadABorrar, ...items) muta el array y su
            segundo argumento es una cantidad, no un índice de fin.
          </li>
          <li>
            <strong className="text-foreground">
              Usar reduce cuando map o filter alcanzan.
            </strong>{" "}
            reduce puede hacer cualquier cosa, pero si el resultado es
            simplemente un array transformado o filtrado, map/filter son
            más legibles.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Renderizar una lista en React con .map(), transformando datos
            en elementos JSX sin mutar el array original.
          </li>
          <li>
            Usar .filter() para descartar elementos inválidos o inactivos
            antes de procesarlos, en vez de un for con if adentro.
          </li>
          <li>
            Usar reduce para calcular un total, agrupar por categoría, o
            construir un objeto de lookup (id → item) a partir de un array.
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
{`const carritos = [
  { producto: "libro", precio: 10 },
  { producto: "taza", precio: 5 },
  { producto: "lapicera", precio: 2 },
];

const total = carritos
  .filter(item => item.precio > 3)
  .reduce((acc, item) => acc + item.precio, 0);

console.log(total);`}
          </pre>
          <RevelarSolucion>
            <p>
              Imprime <strong className="text-foreground">15</strong>.
            </p>
            <p className="mt-2">
              filter() descarta la lapicera (precio 2, no es &gt; 3) y deja
              [libro (10), taza (5)]. reduce() suma esos precios empezando
              en 0: 0 + 10 + 5 = 15. Ninguno de los dos métodos mutó el
              array carritos original.
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
            <code>filter().map()</code> es más legible cuando cada paso
            tiene una responsabilidad clara, a costa de recorrer el array
            dos veces y crear un array intermedio. Un solo{" "}
            <code>reduce</code> recorre una sola vez sin intermedios, algo
            que importa en arrays muy grandes o loops calientes, pero
            suele ser menos legible. La regla general es priorizar
            legibilidad salvo que se mida un problema real de performance.
          </p>
          <p>
            En React, mutar el array de estado con <code>push</code> no
            dispara un re-render: React decide comparando la{" "}
            <em>referencia</em> anterior contra la nueva, y push devuelve
            el nuevo length, no un array nuevo — la referencia del estado
            sigue siendo la misma. Hace falta{" "}
            <code>setEstado([...estado, item])</code>, que sí crea una
            referencia nueva.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="chain-vs-reduce.js"
            codigo={`// Dos pasadas, más legible:
const resultado = items.filter(x => x.activo).map(x => x.nombre);

// Una pasada, menos legible:
const resultado2 = items.reduce((acc, x) => {
  if (x.activo) acc.push(x.nombre);
  return acc;
}, []);`}
          />
          <BloqueCodigo
            titulo="estado-inmutable.js"
            codigo={`// Mal: React no re-renderiza, la referencia no cambió
function agregar(item) {
  lista.push(item);
  setLista(lista);
}

// Bien: nueva referencia
function agregar(item) {
  setLista([...lista, item]);
}`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Optimizar prematuramente con reduce sin medir.
            </strong>{" "}
            Para la mayoría de los tamaños de array reales, la diferencia
            de performance entre chain y reduce es imperceptible; no vale
            la pérdida de legibilidad sin evidencia.
          </li>
          <li>
            <strong className="text-foreground">
              Mutar un array de props directamente.
            </strong>{" "}
            Aunque no sea estado propio, mutar un array recibido por props
            puede romper al componente padre que también lo usa.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Preferir setEstado(prev =&gt; [...prev, item]) en vez de
            setEstado([...estado, item]) cuando la actualización depende
            del estado anterior, para evitar condiciones de carrera con
            actualizaciones en batch.
          </li>
          <li>
            Usar reduce para agrupar datos por una clave (por categoría, por
            fecha) cuando filter+map no alcanzan porque el resultado no es
            una lista plana.
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
            Sin comparador explícito, <code>sort()</code> convierte cada
            elemento a string y ordena lexicográficamente (por código
            Unicode), no numéricamente: <code>&apos;10&apos;</code> es
            menor que <code>&apos;2&apos;</code> en orden de texto. Para
            ordenar números hace falta un comparador explícito:{" "}
            <code>arr.sort((a, b) =&gt; a - b)</code>.
          </p>
          <p>
            Un array <strong className="text-foreground">sparse</strong>{" "}
            (disperso) tiene huecos: posiciones sin asignar, distintas de
            posiciones que valen <code>undefined</code>. Se crean con{" "}
            <code>new Array(3)</code> o con <code>delete</code>. Métodos
            como <code>forEach</code>, <code>map</code> y{" "}
            <code>filter</code> saltean esos huecos, pero{" "}
            <code>for...of</code> sí los recorre y entrega{" "}
            <code>undefined</code>.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <div className="flex flex-col gap-4">
          <BloqueCodigo
            titulo="sort-lexicografico.js"
            codigo={`[10, 2, 1].sort();               // [1, 10, 2] — orden de texto
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10] — orden numérico`}
          />
          <BloqueCodigo
            titulo="arrays-sparse.js"
            codigo={`const disperso = [1, , 3]; // hueco en el índice 1

disperso.forEach(n => console.log(n)); // 1, 3 (salta el hueco)
disperso.map(n => n * 2);              // [2, <1 empty item>, 6]

for (const n of disperso) console.log(n); // 1, undefined, 3`}
          />
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">
              Ordenar números o fechas sin pasar un comparador.
            </strong>{" "}
            El bug de sort() lexicográfico es sutil porque funciona bien
            &quot;por casualidad&quot; con arrays chicos donde el orden de texto
            coincide con el numérico.
          </li>
          <li>
            <strong className="text-foreground">
              Confundir new Array(3) con Array(3).fill(undefined).
            </strong>{" "}
            El primero crea 3 huecos (sparse); el segundo crea 3
            posiciones reales con undefined, que sí procesan forEach/map
            normalmente.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            Usar Array.from({"{ length: n }"}, (_, i) =&gt; i) en vez de
            new Array(n) cuando se necesita un array denso (sin huecos)
            para iterar con map, por ejemplo para generar placeholders de
            loading.
          </li>
          <li>
            Auditar en code review cualquier .sort() sobre números,
            fechas o strings con mayúsculas mezcladas, donde el
            comparador por defecto casi seguro da un resultado incorrecto.
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
