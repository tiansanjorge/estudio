import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { NivelTabs } from "@/components/modulo/NivelTabs";
import { EntrevistaSeccion } from "@/components/modulo/EntrevistaSeccion";
import { EstructuraCarpetasComparador } from "@/components/modulo/EstructuraCarpetasComparador";
import { entrevistaEstructuraCarpetas } from "@/lib/modules/arquitectura/estructura-carpetas-entrevista";

const preguntasPorNivel = {
  1: entrevistaEstructuraCarpetas.filter((p) => p.nivel === 1),
  2: entrevistaEstructuraCarpetas.filter((p) => p.nivel === 2),
  3: entrevistaEstructuraCarpetas.filter((p) => p.nivel === 3),
};

export const metadata: Metadata = {
  title: "Feature-based vs layer-based — Dev Study Lab",
  description:
    "Organizar el código por tipo técnico o por funcionalidad: cohesión, límites entre features, shared y cómo migrar.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "En una estructura por features, ¿dónde vive el hook useCarrito?",
    opciones: [
      "src/features/carrito/",
      "src/hooks/",
      "src/shared/hooks/",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Junto al resto del código del carrito: lo que cambia junto vive junto.",
  },
  {
    pregunta: "¿Cuándo algo se mueve a shared/?",
    opciones: [
      "Apenas se crea, por si alguna otra feature lo necesita",
      "Cuando dos o más features lo usan de verdad y es genérico",
      "Cuando el archivo supera cierto tamaño o complejidad",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Si no, shared/ se vuelve un cajón de sastre que acopla todo.",
  },
];

const preguntasNivel2: PreguntaQuiz[] = [
  {
    pregunta: "¿Cómo se evita que otra feature importe un componente interno del carrito?",
    opciones: [
      "Poniendo el componente en una carpeta llamada private/",
      "Con un comentario de @internal en el componente",
      "Con un index.ts público y reglas de lint contra imports internos",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Las reglas en el CI hacen que el límite se cumpla.",
  },
  {
    pregunta: "En Next.js, ¿qué conviene que contenga app/carrito/page.tsx?",
    opciones: [
      "Poca cosa: componer features/carrito y resolver params o metadata",
      "Toda la lógica del carrito, porque Next agrupa el código por ruta",
      "Los componentes del carrito, para que se hagan code splitting",
    ],
    respuestaCorrecta: 0,
    explicacion:
      "Las rutas quedan delgadas y el dominio vive en features.",
  },
];

const preguntasNivel3: PreguntaQuiz[] = [
  {
    pregunta: "En Feature-Sliced Design, ¿de qué capas puede importar una feature?",
    opciones: [
      "De cualquier capa, siempre que no haya ciclos",
      "Solo de las capas de abajo (entities, shared)",
      "De otras features y de las capas de abajo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Las dependencias van siempre hacia abajo en la jerarquía.",
  },
  {
    pregunta: "Al migrar de capas a features, ¿qué conviene evitar?",
    opciones: [
      "Migrar de a una feature por vez en PRs separados",
      "Dejar código viejo en capas mientras se migra",
      "Mezclar la reorganización con cambios de lógica",
    ],
    respuestaCorrecta: 2,
    explicacion:
      "Mover archivos y cambiar comportamiento en el mismo PR esconde bugs.",
  },
];

export default function EstructuraCarpetasPage() {
  return (
    <ModuloLayout
      categoriaTitulo="Arquitectura"
      titulo="Feature-based vs layer-based"
      descripcion="Organizar el código por tipo técnico o por funcionalidad de negocio, y por qué la segunda suele escalar mejor."
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
            <strong className="text-foreground">Por capas</strong>: carpetas por
            tipo técnico (<code>components/</code>, <code>hooks/</code>,{" "}
            <code>services/</code>). Simple al empezar.{" "}
            <strong className="text-foreground">Por features</strong>: carpetas
            por funcionalidad (<code>features/carrito/</code>) con todo lo suyo
            adentro, y lo genérico en <code>shared/</code>.
          </p>
          <p>
            La diferencia aparece al crecer: con features, lo que cambia junto
            vive junto, cada equipo puede ser dueño de una carpeta, y borrar una
            funcionalidad es borrar una carpeta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <EstructuraCarpetasComparador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground"><code>shared/</code> como cajón de sastre.</strong>{" "}
            Termina con lógica de negocio de todas las features mezclada.
          </li>
          <li>
            <strong className="text-foreground">Carpetas <code>utils/</code> gigantes.</strong>{" "}
            Nadie sabe qué se usa y qué es código muerto.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Definir la estructura de un proyecto que va a crecer.</li>
          <li>Asignar ownership de carpetas a equipos (CODEOWNERS).</li>
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
            Cada feature expone una <strong className="text-foreground">API
            pública</strong> (<code>index.ts</code>) y el resto es interno. Los
            límites se verifican con reglas de lint en el CI, con una dirección
            clara: rutas → features → shared.
          </p>
          <p>
            En Next.js, <code>app/</code> define las rutas y conviene que quede
            delgado, componiendo piezas de <code>features/</code>. Las carpetas
            privadas (<code>_components</code>) permiten colocar lo que usa una
            sola ruta.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Imports a internos de otra feature.</strong>{" "}
            Cualquier reorganización interna rompe a las demás.
          </li>
          <li>
            <strong className="text-foreground">Dependencias circulares entre features.</strong>{" "}
            Señal de que el límite está mal trazado.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Configurar <code>eslint-plugin-boundaries</code> con las capas del proyecto.</li>
          <li>Páginas de Next que solo componen features.</li>
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
            <strong className="text-foreground">Feature-Sliced Design</strong>{" "}
            formaliza la idea con capas jerárquicas (app, pages, widgets,
            features, entities, shared) donde cada una solo importa de las de
            abajo. Resuelve dónde va cada cosa, a cambio de más ceremonia.
          </p>
          <p>
            Migrar de capas a features se hace de a una feature, con PRs chicos
            sin cambios de lógica, reexports temporales y reglas de límites
            activadas de forma gradual.
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 prosa">
          <li>
            <strong className="text-foreground">Migración big-bang de toda la estructura.</strong>{" "}
            Conflictos con todo el trabajo en curso.
          </li>
          <li>
            <strong className="text-foreground">Adoptar FSD completo en una app chica.</strong>{" "}
            Seis capas para diez pantallas.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 prosa">
          <li>Un codemod que mueve una feature y actualiza todos sus imports.</li>
          <li>Separar entities de features en un dominio grande.</li>
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
            En tu proyecto por features, <code>shared/components/</code> tiene 80
            componentes, incluidos <code>TarjetaProductoCarrito</code>,{" "}
            <code>TarjetaProductoCatalogo</code> y un{" "}
            <code>TarjetaProducto</code> con 14 props booleanas. ¿Qué pasó y qué
            hacés?
          </p>
          <RevelarSolucion>
            <p>
              <code>shared/</code> se convirtió en el cajón de sastre: se movió
              ahí código específico de features &quot;por si otra lo
              necesitaba&quot;, y un componente intentó servir a todos los casos
              a fuerza de props. Plan: devolver a cada feature lo que solo usa
              ella (<code>TarjetaProductoCarrito</code> a carrito, el de
              catálogo a catálogo); partir <code>TarjetaProducto</code> en
              piezas de UI genéricas y componibles (una <code>Tarjeta</code>,
              una <code>Imagen</code>, un <code>Precio</code>) que sí son de{" "}
              <code>shared/ui</code>, y armar la variante de cada feature con
              composición en vez de flags; y agregar una regla que impida que{" "}
              <code>shared/</code> importe de features, más una revisión en los
              PRs de lo que entra ahí.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </>
  );
}
