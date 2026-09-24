"use client";

import { useState } from "react";

export interface PreguntaQuiz {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion: string;
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
              {item.opciones.map((opcion, opcionIndex) => {
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
