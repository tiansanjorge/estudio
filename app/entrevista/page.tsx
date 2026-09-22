"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Nivel } from "@/lib/modules/types";
import { bancoEntrevista } from "@/lib/modules/entrevista-registry";
import { rutaModulo } from "@/lib/modules/registry";

const ETIQUETAS_NIVEL: Record<Nivel, string> = {
  1: "Nivel 1 · Fundamentos aplicados",
  2: "Nivel 2 · Trade-offs y buenas prácticas",
  3: "Nivel 3 · Edge cases y profundidad interna",
};

export default function EntrevistaPage() {
  const [nivel, setNivel] = useState<Nivel>(1);
  const [idioma, setIdioma] = useState<"es" | "en">("es");

  const grupos = useMemo(
    () =>
      bancoEntrevista
        .map((modulo) => ({
          ...modulo,
          preguntas: modulo.preguntas.filter((p) => p.nivel === nivel),
        }))
        .filter((modulo) => modulo.preguntas.length > 0),
    [nivel],
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16 sm:px-8">
      <header className="flex flex-col gap-3">
        <span className="text-sm font-medium text-accent">Repaso</span>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Preguntas de entrevista
        </h1>
        <p className="max-w-xl text-lg leading-7 text-muted-foreground">
          Corte vertical de todo el catálogo, ordenado por nivel. Empezá por
          Nivel 1 en todos los temas antes de profundizar en Nivel 2 o 3.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-xl border border-border p-1">
          {([1, 2, 3] as Nivel[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNivel(n)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                nivel === n
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nivel {n}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-xl border border-border p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setIdioma("es")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              idioma === "es"
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ES
          </button>
          <button
            type="button"
            onClick={() => setIdioma("en")}
            className={`rounded-lg px-3 py-1 transition-colors ${
              idioma === "en"
                ? "bg-accent-soft text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{ETIQUETAS_NIVEL[nivel]}</p>

      {grupos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Todavía no hay preguntas cargadas en este nivel.
        </p>
      )}

      <div className="flex flex-col gap-10">
        {grupos.map((modulo) => (
          <section key={`${modulo.categoriaSlug}-${modulo.moduloSlug}`} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {modulo.categoriaTitulo}
                </span>
                <h2 className="text-xl font-semibold text-foreground">
                  {modulo.moduloTitulo}
                </h2>
              </div>
              <Link
                href={rutaModulo(modulo.categoriaSlug, modulo.moduloSlug)}
                className="text-sm font-medium text-accent hover:underline"
              >
                Ver módulo →
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {modulo.preguntas.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4"
                >
                  <p className="font-medium text-foreground">{item.pregunta}</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {idioma === "es" ? item.respuestaEs : item.respuestaEn}
                  </p>
                  {item.tradeoffs && (
                    <p className="text-sm leading-6 text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Trade-offs:{" "}
                      </span>
                      {item.tradeoffs}
                    </p>
                  )}
                  {item.repregunta && (
                    <div className="flex flex-col gap-1 rounded-lg bg-accent-soft/50 p-3">
                      <p className="text-sm font-medium text-accent">
                        Repregunta: {item.repregunta}
                      </p>
                      {(item.respuestaRepreguntaEs || item.respuestaRepreguntaEn) && (
                        <p className="text-sm leading-6 text-muted-foreground">
                          {idioma === "es"
                            ? item.respuestaRepreguntaEs
                            : item.respuestaRepreguntaEn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
