"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Nivel, PreguntaEntrevista } from "@/lib/modules/types";
import {
  bancoEntrevista,
  type BancoEntrevistaModulo,
} from "@/lib/modules/entrevista-registry";
import { rutaModulo } from "@/lib/modules/registry";

type Idioma = "es" | "en";

interface GrupoCategoria {
  categoriaSlug: string;
  categoriaTitulo: string;
  modulos: BancoEntrevistaModulo[];
  totalPreguntas: number;
}

const ETIQUETAS_NIVEL: Record<Nivel, string> = {
  1: "Nivel 1 · Fundamentos aplicados",
  2: "Nivel 2 · Trade-offs y buenas prácticas",
  3: "Nivel 3 · Edge cases y profundidad interna",
};

function agruparPorCategoria(nivel: Nivel): GrupoCategoria[] {
  const grupos = new Map<string, GrupoCategoria>();

  for (const modulo of bancoEntrevista) {
    const preguntas = modulo.preguntas.filter((p) => p.nivel === nivel);
    if (preguntas.length === 0) continue;

    const grupo = grupos.get(modulo.categoriaSlug) ?? {
      categoriaSlug: modulo.categoriaSlug,
      categoriaTitulo: modulo.categoriaTitulo,
      modulos: [],
      totalPreguntas: 0,
    };
    grupo.modulos.push({ ...modulo, preguntas });
    grupo.totalPreguntas += preguntas.length;
    grupos.set(modulo.categoriaSlug, grupo);
  }

  return [...grupos.values()];
}

export default function EntrevistaPage() {
  const [nivel, setNivel] = useState<Nivel>(1);
  const [idioma, setIdioma] = useState<Idioma>("es");
  const [categoriaAbierta, setCategoriaAbierta] = useState<string | null>(null);

  const grupos = useMemo(() => agruparPorCategoria(nivel), [nivel]);

  function alternarCategoria(slug: string) {
    const abriendo = categoriaAbierta !== slug;
    setCategoriaAbierta(abriendo ? slug : null);

    // Al colapsar un bloque de arriba el contenido se desplaza: llevamos el
    // encabezado recién abierto al viewport para no perder el lugar.
    if (abriendo) {
      requestAnimationFrame(() => {
        document
          .getElementById(`categoria-${slug}`)
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
  }

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
          {(["es", "en"] as Idioma[]).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdioma(i)}
              className={`rounded-lg px-3 py-1 uppercase transition-colors ${
                idioma === i
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{ETIQUETAS_NIVEL[nivel]}</p>

      {grupos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Todavía no hay preguntas cargadas en este nivel.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {grupos.map((grupo) => (
          <CategoriaAcordeon
            key={grupo.categoriaSlug}
            grupo={grupo}
            idioma={idioma}
            abierta={categoriaAbierta === grupo.categoriaSlug}
            onAlternar={() => alternarCategoria(grupo.categoriaSlug)}
          />
        ))}
      </div>
    </div>
  );
}

function CategoriaAcordeon({
  grupo,
  idioma,
  abierta,
  onAlternar,
}: {
  grupo: GrupoCategoria;
  idioma: Idioma;
  abierta: boolean;
  onAlternar: () => void;
}) {
  const panelId = `panel-${grupo.categoriaSlug}`;

  return (
    <section
      id={`categoria-${grupo.categoriaSlug}`}
      className="scroll-mt-6 overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <h2>
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={abierta}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-background"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-lg font-semibold text-foreground">
              {grupo.categoriaTitulo}
            </span>
            <span className="text-sm text-muted-foreground">
              {grupo.modulos.length}{" "}
              {grupo.modulos.length === 1 ? "módulo" : "módulos"} ·{" "}
              {grupo.totalPreguntas}{" "}
              {grupo.totalPreguntas === 1 ? "pregunta" : "preguntas"}
            </span>
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-5 shrink-0 text-muted-foreground transition-transform ${
              abierta ? "rotate-180" : ""
            }`}
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </h2>

      {abierta && (
        <div
          id={panelId}
          className="flex flex-col gap-10 border-t border-border px-5 py-6"
        >
          {grupo.modulos.map((modulo) => (
            <ModuloPreguntas
              key={modulo.moduloSlug}
              modulo={modulo}
              idioma={idioma}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ModuloPreguntas({
  modulo,
  idioma,
}: {
  modulo: BancoEntrevistaModulo;
  idioma: Idioma;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl font-semibold text-foreground">
          {modulo.moduloTitulo}
        </h3>
        <Link
          href={rutaModulo(modulo.categoriaSlug, modulo.moduloSlug)}
          className="shrink-0 text-sm font-medium text-accent hover:underline"
        >
          Ver módulo →
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {modulo.preguntas.map((item, index) => (
          <PreguntaCard key={index} item={item} idioma={idioma} />
        ))}
      </div>
    </div>
  );
}

function PreguntaCard({
  item,
  idioma,
}: {
  item: PreguntaEntrevista;
  idioma: Idioma;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4">
      <p className="font-medium text-foreground">{item.pregunta}</p>
      <p className="text-sm leading-6 text-muted-foreground">
        {idioma === "es" ? item.respuestaEs : item.respuestaEn}
      </p>
      {item.codigo && (
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground">
          {item.codigo}
        </pre>
      )}
      {item.tradeoffs && (
        <p className="text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">Trade-offs: </span>
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
          {item.codigoRepregunta && (
            <pre className="mt-1 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground">
              {item.codigoRepregunta}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
