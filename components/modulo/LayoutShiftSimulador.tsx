"use client";

import { useState } from "react";
import {
  calcularLayoutShift,
  clasificar,
  type Calificacion,
} from "@/lib/modules/performance/core-web-vitals";

const ALTURA_VIEWPORT = 320;
const ALTURA_TITULO = 48;
const ALTURA_TEXTO = 200;
const ALTURAS_IMAGEN = [40, 120] as const;

const ESTILO_CALIFICACION: Record<Calificacion, string> = {
  bueno: "border-success/30 bg-success-soft text-success",
  mejorable: "border-warning/30 bg-warning-soft text-warning",
  malo: "border-error/30 bg-error-soft text-error",
};

export function LayoutShiftSimulador() {
  const [reservarEspacio, setReservarEspacio] = useState(false);
  const [alturaImagen, setAlturaImagen] = useState<number>(120);
  const [cargada, setCargada] = useState(false);

  const desplazamiento = cargada && !reservarEspacio ? alturaImagen : 0;
  const shift = calcularLayoutShift({
    alturaViewport: ALTURA_VIEWPORT,
    top: ALTURA_TITULO,
    altura: ALTURA_TEXTO,
    desplazamiento,
  });
  const calificacion = clasificar("CLS", shift.puntaje);
  const ocupaEspacio = cargada || reservarEspacio;

  function reiniciar() {
    setCargada(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={reservarEspacio}
            onChange={(e) => {
              setReservarEspacio(e.target.checked);
              reiniciar();
            }}
            className="accent-accent"
          />
          Reservar espacio (width/height o aspect-ratio)
        </label>
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Altura de la imagen</legend>
          {ALTURAS_IMAGEN.map((altura) => (
            <button
              key={altura}
              type="button"
              aria-pressed={alturaImagen === altura}
              onClick={() => {
                setAlturaImagen(altura);
                reiniciar();
              }}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                alturaImagen === altura
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              imagen {altura}px
            </button>
          ))}
        </fieldset>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
        <div
          className="overflow-hidden rounded-xl border border-border bg-background p-4"
          style={{ height: ALTURA_VIEWPORT }}
          aria-label="Viewport simulado"
        >
          <div
            className="flex items-center font-semibold text-foreground"
            style={{ height: ALTURA_TITULO - 16 }}
          >
            Título del artículo
          </div>
          <div
            className={`flex items-center justify-center rounded-lg text-xs transition-all duration-300 ${
              cargada
                ? "bg-accent-soft text-accent"
                : "border border-dashed border-border text-muted-foreground"
            }`}
            style={{ height: ocupaEspacio ? alturaImagen : 0, marginBottom: ocupaEspacio ? 16 : 0 }}
          >
            {ocupaEspacio && (cargada ? "imagen cargada" : "espacio reservado")}
          </div>
          <div className="flex flex-col gap-3" style={{ height: ALTURA_TEXTO }}>
            {["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"].map((ancho, i) => (
              <div key={i} className={`h-3 rounded bg-border ${ancho}`} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => setCargada((c) => !c)}
            className="rounded-xl border border-accent bg-accent-soft px-3 py-2 text-sm text-accent"
          >
            {cargada ? "Reiniciar" : "Cargar imagen"}
          </button>
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between">
              <dt>Desplazamiento</dt>
              <dd className="text-foreground">{desplazamiento}px</dd>
            </div>
            <div className="flex justify-between">
              <dt>Impact fraction</dt>
              <dd className="text-foreground">{shift.impacto.toFixed(3)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Distance fraction</dt>
              <dd className="text-foreground">{shift.distancia.toFixed(3)}</dd>
            </div>
          </dl>
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${ESTILO_CALIFICACION[calificacion]}`}
            aria-live="polite"
          >
            Layout shift: {shift.puntaje.toFixed(3)} ({calificacion})
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        El puntaje es impact fraction (qué porción del viewport ocupa el
        contenido que se movió, antes y después) × distance fraction (cuánto se
        movió, relativo a la dimensión mayor del viewport; acá se simplifica
        usando la altura). Probá la imagen chica: el
        mismo error mueve menos contenido y menos distancia, y el puntaje cae
        de forma no lineal.
      </p>
    </div>
  );
}
