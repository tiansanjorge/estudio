"use client";

import { useState } from "react";

export interface PreguntaQuiz {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
}

/**
 * Orden de presentación de las opciones, determinístico por pregunta: el
 * mismo texto da siempre el mismo orden (igual en servidor y cliente, sin
 * mismatch de hidratación), pero la posición de la correcta varía entre
 * preguntas en vez de depender de cómo se escribieron los datos.
 */
function ordenOpciones(pregunta: string, cantidad: number): number[] {
  // FNV-1a como semilla + mulberry32 como generador
  let semilla = 0x811c9dc5;
  for (const caracter of pregunta) {
    semilla ^= caracter.charCodeAt(0);
    semilla = Math.imul(semilla, 0x01000193) >>> 0;
  }
  const aleatorio = () => {
    semilla = (semilla + 0x6d2b79f5) >>> 0;
    let t = semilla;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const orden = Array.from({ length: cantidad }, (_, i) => i);
  for (let i = orden.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [orden[i], orden[j]] = [orden[j], orden[i]];
  }
  return orden;
}

interface QuizProps {
  preguntas: PreguntaQuiz[];
}

export function Quiz({ preguntas }: QuizProps) {
  const [respuestas, setRespuestas] = useState<Array<number | null>>(
    () => Array(preguntas.length).fill(null),
  );

  function responder(preguntaIndex: number, opcionIndex: number) {
    setRespuestas((prev) => {
      if (prev[preguntaIndex] !== null) return prev;
      const next = [...prev];
      next[preguntaIndex] = opcionIndex;
      return next;
    });
  }

  const respondidas = respuestas.filter((r) => r !== null).length;
  const correctas = respuestas.filter(
    (r, i) => r === preguntas[i].respuestaCorrecta,
  ).length;

  return (
    <div className="flex flex-col gap-8">
      {preguntas.map((item, preguntaIndex) => {
        const respuesta = respuestas[preguntaIndex];
        return (
          <div key={preguntaIndex} className="flex flex-col gap-3">
            <p className="font-medium text-foreground">
              {preguntaIndex + 1}. {item.pregunta}
            </p>
            <div className="flex flex-col gap-2">
              {ordenOpciones(item.pregunta, item.opciones.length).map((opcionIndex) => {
                const opcion = item.opciones[opcionIndex];
                const esCorrecta = opcionIndex === item.respuestaCorrecta;
                const esElegida = respuesta === opcionIndex;

                let estilo =
                  "border-border text-foreground hover:bg-accent-soft hover:text-accent";
                if (respuesta !== null && esCorrecta) {
                  estilo = "border-success/30 bg-success-soft text-success";
                } else if (respuesta !== null && esElegida) {
                  estilo = "border-error/30 bg-error-soft text-error";
                }

                return (
                  <button
                    key={opcionIndex}
                    type="button"
                    onClick={() => responder(preguntaIndex, opcionIndex)}
                    disabled={respuesta !== null}
                    className={`rounded-xl border px-4 py-2 text-left text-base transition-colors disabled:cursor-default ${estilo}`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
            {respuesta !== null && (
              <p className="prosa">{item.explicacion}</p>
            )}
          </div>
        );
      })}
      <p className="text-base font-medium text-muted-foreground">
        {respondidas === preguntas.length
          ? `Resultado: ${correctas} / ${preguntas.length}`
          : `Respondidas: ${respondidas} / ${preguntas.length}`}
      </p>
    </div>
  );
}
