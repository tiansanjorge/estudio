import type { Metadata } from "next";
import { ModuloLayout } from "@/components/modulo/ModuloLayout";
import { Seccion } from "@/components/modulo/Seccion";
import { PromiseSimulador } from "@/components/modulo/PromiseSimulador";
import { CombinadoresSimulador } from "@/components/modulo/CombinadoresSimulador";
import { Quiz, type PreguntaQuiz } from "@/components/modulo/Quiz";
import { RevelarSolucion } from "@/components/modulo/RevelarSolucion";
import { escenariosPromises } from "@/lib/modules/promises/escenarios";

export const metadata: Metadata = {
  title: "Promises — Dev Study Lab",
  description:
    "Los tres estados de una Promise, cómo se propagan los errores en una cadena, y las diferencias entre Promise.all, race, allSettled y any.",
};

const preguntas: PreguntaQuiz[] = [
  {
    pregunta: "Una promesa rechazada llega a un .then() que solo tiene manejador de éxito. ¿Qué pasa?",
    opciones: [
      "Se ejecuta igual, con el error como argumento",
      "Se salta ese .then() y el rechazo sigue propagándose hasta encontrar un catch",
      "La aplicación se rompe",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Un .then() sin segundo argumento (o sin manejar el rechazo) no intercepta errores: simplemente los deja pasar a la siguiente promesa de la cadena.",
  },
  {
    pregunta: "¿Qué diferencia a Promise.all de Promise.allSettled?",
    opciones: [
      "all espera a todas, allSettled solo a la primera",
      "all se rechaza apenas una falla; allSettled siempre espera a todas y te da el resultado de cada una",
      "Son exactamente lo mismo",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Promise.all corta apenas la primera rechaza. Promise.allSettled nunca rechaza: espera que todas terminen (éxito o error) y te devuelve un resumen de cada resultado.",
  },
  {
    pregunta: "¿Cuándo rechaza Promise.any?",
    opciones: [
      "Apenas rechaza la primera promesa",
      "Solo si TODAS las promesas rechazan",
      "Nunca rechaza",
    ],
    respuestaCorrecta: 1,
    explicacion:
      "Promise.any se cumple con la primera que tenga éxito, e ignora los rechazos individuales. Solo rechaza si absolutamente todas fallan.",
  },
];

export default function PromisesPage() {
  return (
    <ModuloLayout
      categoriaTitulo="JavaScript profundo"
      titulo="Promises"
      descripcion="Una Promise representa un valor que todavía no existe. Lo interesante no es el valor final, sino cómo se propagan el éxito y el error a través de una cadena."
    >
      <Seccion eyebrow="Concepto" titulo="Explicación">
        <div className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
          <p>
            Una Promise tiene tres estados:{" "}
            <strong className="text-foreground">pendiente</strong>,{" "}
            <strong className="text-foreground">cumplida</strong> (resuelta
            con un valor) o{" "}
            <strong className="text-foreground">rechazada</strong> (falló
            con un error). Una vez que pasa de pendiente a cumplida o
            rechazada, queda así para siempre — no puede cambiar de
            estado de nuevo.
          </p>
          <p>
            Cada <code>.then()</code>, <code>.catch()</code> y{" "}
            <code>.finally()</code> devuelve una promesa{" "}
            <strong className="text-foreground">nueva</strong>, no la
            misma. Eso es lo que permite encadenarlos. Si un{" "}
            <code>.then()</code> lanza un error (o retorna una promesa que
            rechaza), la promesa que devuelve queda rechazada, y ese
            rechazo se propaga saltando todos los <code>.then()</code>{" "}
            siguientes que no manejen errores, hasta encontrar un{" "}
            <code>.catch()</code>.
          </p>
          <p>
            Cuando necesitás combinar varias promesas a la vez, JavaScript
            da cuatro combinadores con reglas distintas:{" "}
            <code>Promise.all</code> (todas o nada),{" "}
            <code>Promise.race</code> (la primera que termine, gane o
            pierda), <code>Promise.allSettled</code> (esperá a todas, sin
            cortar por errores) y <code>Promise.any</code> (la primera que
            tenga éxito).
          </p>
        </div>
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Visualización">
        <PromiseSimulador escenarios={escenariosPromises} mostrarSelector />
      </Seccion>

      <Seccion eyebrow="Interactivo" titulo="Playground">
        <p className="mb-4 text-sm text-muted-foreground">
          Configurá 3 tareas (éxito/error y duración) y compará cómo se
          comporta cada combinador con Promises reales, no una simulación
          escrita a mano.
        </p>
        <CombinadoresSimulador />
      </Seccion>

      <Seccion eyebrow="Cuidado" titulo="Errores comunes">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            <strong className="text-foreground">
              Olvidarse el return dentro de un .then().
            </strong>{" "}
            Si el callback de un .then() llama a una función que devuelve
            una promesa pero no la retorna, la cadena no espera a que esa
            promesa termine.
          </li>
          <li>
            <strong className="text-foreground">
              Pensar que .catch() solo atrapa errores del .then() inmediatamente anterior.
            </strong>{" "}
            Atrapa cualquier rechazo de toda la cadena que viene antes,
            sin importar en qué eslabón haya ocurrido.
          </li>
          <li>
            <strong className="text-foreground">
              Usar Promise.all cuando en realidad no importa si alguna falla.
            </strong>{" "}
            Si querés el resultado de las que sí funcionaron aunque otras
            fallen, Promise.all no sirve — corta todo apenas la primera
            rechaza. Ahí es Promise.allSettled.
          </li>
          <li>
            <strong className="text-foreground">
              Anidar .then() en vez de encadenarlos.
            </strong>{" "}
            Crea el clásico &ldquo;pyramid of doom&rdquo; y complica el
            manejo de errores — casi siempre se puede aplanar
            retornando la promesa interna.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Aplicación" titulo="Casos de uso">
        <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
          <li>
            Promise.all para cargar en paralelo varios recursos que la
            pantalla necesita todos sí o sí antes de renderizar.
          </li>
          <li>
            Promise.allSettled para mandar varias peticiones independientes
            (ej: subir 5 archivos) donde el fallo de una no debe cancelar
            las demás.
          </li>
          <li>
            Promise.race para implementar un timeout: correr un fetch
            contra una promesa que rechaza pasado cierto tiempo.
          </li>
        </ul>
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Quiz">
        <Quiz preguntas={preguntas} />
      </Seccion>

      <Seccion eyebrow="Práctica" titulo="Desafío">
        <div className="flex flex-col gap-4 text-sm leading-6 text-muted-foreground">
          <p>
            Necesitás pedirle datos a 3 servicios distintos. Si cualquiera
            de los 3 falla, igual querés mostrar los que sí funcionaron
            (no toda la pantalla en blanco). ¿Qué combinador usarías, y
            por qué Promise.all sería la elección incorrecta acá?
          </p>
          <RevelarSolucion>
            <p>
              <code>Promise.allSettled</code> es la elección correcta.
              Devuelve un array con el resultado de{" "}
              <strong className="text-foreground">cada</strong> promesa,
              marcando cada una como <code>fulfilled</code> o{" "}
              <code>rejected</code>, sin cortar la ejecución de las demás.
            </p>
            <p className="mt-2">
              <code>Promise.all</code> sería incorrecto porque corta y
              rechaza toda la operación apenas UNA de las tres falla —
              perderías también los resultados de las que sí funcionaron,
              justo lo que no querés.
            </p>
          </RevelarSolucion>
        </div>
      </Seccion>
    </ModuloLayout>
  );
}
