"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  CONFIG_CORRECTA,
  describirFoco,
  problemasDeConfig,
  type ConfigFoco,
} from "@/lib/modules/accesibilidad/focus-management";
import { BloqueCodigo } from "./BloqueCodigo";

function generarCodigo({ moverAlAbrir, atrapar, devolverAlCerrar }: ConfigFoco): string {
  return [
    "useEffect(() => {",
    moverAlAbrir
      ? "  if (abierto) primerCampo.current.focus(); // entra al diálogo"
      : "  // (no se mueve el foco: queda en el botón, detrás del diálogo)",
    "}, [abierto]);",
    "",
    "function cerrar() {",
    "  setAbierto(false);",
    devolverAlCerrar
      ? "  disparador.current.focus(); // vuelve al botón que lo abrió"
      : "  // (no se devuelve: el foco cae en <body> y se pierde el lugar)",
    "}",
    "",
    "<>",
    atrapar
      ? "  <main inert={abierto}>…</main> {/* el fondo no recibe foco */}"
      : "  <main>…</main> {/* Tab se escapa al fondo */}",
    '  <div role="dialog" aria-modal="true" aria-labelledby="titulo">',
    '    <h2 id="titulo">Editar perfil</h2>',
    "    <input ref={primerCampo} />",
    "    <button onClick={cerrar}>Cerrar</button>",
    "  </div>",
    "</>",
    "",
    "// Nativo: <dialog>.showModal() ya mueve y atrapa el foco",
  ].join("\n");
}

const OPCIONES: { clave: keyof ConfigFoco; etiqueta: string }[] = [
  { clave: "moverAlAbrir", etiqueta: "Mover el foco al abrir" },
  { clave: "atrapar", etiqueta: "Atrapar el foco (focus trap + inert en el fondo)" },
  { clave: "devolverAlCerrar", etiqueta: "Devolver el foco al cerrar" },
];

const MAX_REGISTRO = 6;

const ESTILO_CONTROL =
  "rounded-xl border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function FocoDialogoSimulador() {
  const [config, setConfig] = useState<ConfigFoco>(CONFIG_CORRECTA);
  const [abierto, setAbierto] = useState(false);
  const [registro, setRegistro] = useState<string[]>([]);
  const contenedorRef = useRef<HTMLDivElement>(null);
  const disparadorRef = useRef<HTMLButtonElement>(null);
  const primerCampoRef = useRef<HTMLInputElement>(null);

  function registrar(descripcion: string) {
    setRegistro((prev) =>
      prev[0] === descripcion ? prev : [descripcion, ...prev].slice(0, MAX_REGISTRO),
    );
  }

  useEffect(() => {
    function alEnfocar(e: FocusEvent) {
      registrar(describirFoco(e.target as Element, contenedorRef.current));
    }
    document.addEventListener("focusin", alEnfocar);
    return () => document.removeEventListener("focusin", alEnfocar);
  }, []);

  useEffect(() => {
    if (abierto && config.moverAlAbrir) primerCampoRef.current?.focus();
  }, [abierto, config.moverAlAbrir]);

  function cerrar() {
    setAbierto(false);
    if (config.devolverAlCerrar) {
      // esperar a que el diálogo se desmonte y el fondo deje de ser inert
      requestAnimationFrame(() => disparadorRef.current?.focus());
    } else {
      // al desmontarse el elemento enfocado no se dispara focusin: se consulta a mano
      requestAnimationFrame(() =>
        registrar(describirFoco(document.activeElement, contenedorRef.current)),
      );
    }
  }

  function alPresionarTecla(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      cerrar();
      return;
    }
    if (e.key !== "Tab" || !config.atrapar) return;

    // focus trap: al pasar el último elemento vuelve al primero, y viceversa
    const enfocables = e.currentTarget.querySelectorAll<HTMLElement>("input, button");
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  }

  function esProblema(entrada: string) {
    return entrada.includes("perdido") || (abierto && !entrada.includes("(diálogo)"));
  }

  const problemas = problemasDeConfig(config);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="sr-only">Configuración del manejo de foco</legend>
        {OPCIONES.map(({ clave, etiqueta }) => (
          <label key={clave} className="flex cursor-pointer items-center gap-2 text-foreground">
            <input
              type="checkbox"
              checked={config[clave]}
              disabled={abierto}
              onChange={(e) => setConfig((c) => ({ ...c, [clave]: e.target.checked }))}
              className="accent-accent"
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>

      <BloqueCodigo codigo={generarCodigo(config)} resaltadas={[2, 7, 11]} />

      <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
        <div
          ref={contenedorRef}
          className="relative min-h-64 overflow-hidden rounded-2xl border border-border bg-background p-4"
        >
          <div inert={abierto && config.atrapar} className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">Contenido de la página</p>
            <button
              ref={disparadorRef}
              type="button"
              onClick={() => setAbierto(true)}
              className={ESTILO_CONTROL}
              data-foco="botón “Editar perfil” (disparador)"
            >
              Editar perfil
            </button>
            <button type="button" className={ESTILO_CONTROL} data-foco="botón “Ayuda” (fondo)">
              Ayuda
            </button>
            <button type="button" className={ESTILO_CONTROL} data-foco="botón “Configuración” (fondo)">
              Configuración
            </button>
          </div>

          {abierto && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 p-4">
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialogo-foco-titulo"
                onKeyDown={alPresionarTecla}
                className="flex w-full max-w-xs flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg"
              >
                <h3 id="dialogo-foco-titulo" className="text-sm font-semibold text-foreground">
                  Editar perfil
                </h3>
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Nombre
                  <input
                    ref={primerCampoRef}
                    className={ESTILO_CONTROL}
                    data-foco="input “Nombre” (diálogo)"
                  />
                </label>
                <button
                  type="button"
                  onClick={cerrar}
                  className={ESTILO_CONTROL}
                  data-foco="botón “Cerrar” (diálogo)"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">¿Dónde está el foco?</p>
          <ol className="flex flex-col gap-1 font-mono text-xs">
            {registro.length === 0 && (
              <li className="text-muted-foreground">Usá Tab para empezar.</li>
            )}
            {registro.map((entrada, i) => (
              <li
                key={`${entrada}-${i}`}
                className={
                  i > 0
                    ? "text-muted-foreground"
                    : esProblema(entrada)
                      ? "text-error"
                      : "text-foreground"
                }
              >
                {i === 0 ? "→ " : "  "}
                {entrada}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {problemas.length > 0 ? (
        <ul className="flex flex-col gap-1 rounded-xl border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-foreground">
          {problemas.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-success/30 bg-success-soft px-3 py-2 text-xs text-foreground">
          Con las tres activas: el foco entra al abrir, no se escapa con Tab, y vuelve a
          &quot;Editar perfil&quot; al cerrar (con el botón o con Escape). Desactivá una por
          vez y repetí el recorrido con el teclado.
        </p>
      )}
    </div>
  );
}
