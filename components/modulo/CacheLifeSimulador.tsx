"use client";

import { useState } from "react";
import {
  ESTADO_INICIAL,
  PERFILES,
  avanzar,
  formatearMinutos,
  mutar,
  pedir,
  type EstadoCache,
  type Invalidador,
  type PerfilId,
  type TipoRespuesta,
} from "@/lib/modules/nextjs/data-fetching-caching";

interface Evento {
  id: number;
  texto: string;
  tipo: TipoRespuesta | "accion";
  desactualizado: boolean;
}

const ESTILO_TIPO: Record<Evento["tipo"], string> = {
  MISS: "text-info",
  HIT: "text-success",
  STALE: "text-warning",
  accion: "text-muted-foreground",
};

const SALTOS = [1, 30, 120, 60 * 24];

const MUTACIONES: { invalidador: Invalidador; etiqueta: string }[] = [
  { invalidador: "revalidateTag", etiqueta: "Mutar + revalidateTag('posts', 'max')" },
  { invalidador: "updateTag", etiqueta: "Mutar + updateTag('posts')" },
  { invalidador: "ninguno", etiqueta: "Mutar sin invalidar" },
];

const MAX_EVENTOS = 8;

export function CacheLifeSimulador() {
  const [perfilId, setPerfilId] = useState<PerfilId>("hours");
  const [estado, setEstado] = useState<EstadoCache>(ESTADO_INICIAL);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const perfil = PERFILES[perfilId];

  function registrar(evento: Omit<Evento, "id">) {
    setEventos((prev) => [{ ...evento, id: Date.now() + Math.random() }, ...prev].slice(0, MAX_EVENTOS));
  }

  function hacerRequest() {
    const { estado: siguiente, respuesta } = pedir(estado, perfil);
    const desactualizado = respuesta.versionServida < estado.versionDb;
    registrar({
      tipo: respuesta.tipo,
      desactualizado,
      texto: `${formatearMinutos(estado.minuto)} · ${respuesta.tipo} · sirvió v${respuesta.versionServida} (DB: v${estado.versionDb})`,
    });
    setEstado(siguiente);
  }

  function hacerMutacion(invalidador: Invalidador) {
    registrar({
      tipo: "accion",
      desactualizado: false,
      texto: `${formatearMinutos(estado.minuto)} · DB pasa a v${estado.versionDb + 1}${
        invalidador === "ninguno" ? " (sin invalidar)" : ` + ${invalidador}`
      }`,
    });
    setEstado(mutar(estado, invalidador));
  }

  function reiniciar(nuevoPerfil: PerfilId = perfilId) {
    setPerfilId(nuevoPerfil);
    setEstado(ESTADO_INICIAL);
    setEventos([]);
  }

  const edad = estado.entrada ? estado.minuto - estado.entrada.creadaEn : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <pre className="overflow-x-auto rounded-xl border border-border bg-background p-3 font-mono text-xs text-foreground">
{`async function getPosts() {
  "use cache";
  cacheLife("${perfilId}"); // revalidate: ${formatearMinutos(perfil.revalidate)} · expire: ${formatearMinutos(perfil.expire)}
  cacheTag("posts");
  return db.post.findMany();
}`}
        </pre>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Perfil de cacheLife">
          {(Object.keys(PERFILES) as PerfilId[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={id === perfilId}
              onClick={() => reiniciar(id)}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition-colors ${
                id === perfilId
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={hacerRequest}
            className="rounded-xl border border-accent bg-accent-soft px-4 py-2 text-sm text-accent"
          >
            Request a la página
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Avanzar el reloj:</span>
            {SALTOS.map((minutos) => (
              <button
                key={minutos}
                type="button"
                onClick={() => setEstado((e) => avanzar(e, minutos))}
                className="rounded-lg border border-border px-2 py-1 font-mono text-xs text-foreground hover:border-accent"
              >
                +{formatearMinutos(minutos)}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {MUTACIONES.map(({ invalidador, etiqueta }) => (
              <button
                key={invalidador}
                type="button"
                onClick={() => hacerMutacion(invalidador)}
                className="rounded-lg border border-border px-3 py-1.5 text-left font-mono text-xs text-foreground hover:border-accent"
              >
                {etiqueta}
              </button>
            ))}
          </div>
          <dl className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-3 font-mono text-xs">
            <dt className="text-muted-foreground">Reloj</dt>
            <dd className="text-foreground">{formatearMinutos(estado.minuto)}</dd>
            <dt className="text-muted-foreground">DB</dt>
            <dd className="text-foreground">v{estado.versionDb}</dd>
            <dt className="text-muted-foreground">Cache</dt>
            <dd className="text-foreground">
              {estado.entrada
                ? `v${estado.entrada.version} · edad ${formatearMinutos(edad ?? 0)}${
                    estado.entrada.invalidacion !== "ninguna" ? ` · ${estado.entrada.invalidacion}` : ""
                  }`
                : "vacío"}
            </dd>
          </dl>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">Registro</p>
          {eventos.length === 0 ? (
            <p className="text-xs text-muted-foreground">Hacé el primer request.</p>
          ) : (
            <ol className="flex flex-col gap-1 font-mono text-xs">
              {eventos.map((e) => (
                <li key={e.id} className={ESTILO_TIPO[e.tipo]}>
                  {e.texto}
                  {e.desactualizado && <span className="text-warning"> ← dato viejo</span>}
                </li>
              ))}
            </ol>
          )}
          <ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
            <li>
              <span className="text-info">MISS</span>: no hay entrada usable, el request espera a que se
              regenere.
            </li>
            <li>
              <span className="text-success">HIT</span>: se sirve del cache, sin tocar la DB.
            </li>
            <li>
              <span className="text-warning">STALE</span>: se sirve lo viejo al instante y se regenera en
              segundo plano para el próximo.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
